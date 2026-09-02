import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { supabase } from "../utils/supabase";
import { saveSession, getSession, clearSession } from "../utils/session";
import { useUserStore } from "../store/userStore";

export function ClerkSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (!isLoaded) return;
        
        if (!isSignedIn) {
            if (getSession().userId) {
                clearSession();
                useUserStore.getState().clearUserData();
            }
            // Clear supabase session
            supabase.auth.signOut().catch(() => {});
            syncedRef.current = false;
            return;
        }

        if (syncedRef.current) return;

        const syncUser = async () => {
            syncedRef.current = true;
            try {
                // Fetch Supabase JWT from Clerk
                const token = await getToken({ template: "supabase" });
                if (token) {
                    await supabase.auth.setSession({
                        access_token: token,
                        refresh_token: token,
                    });
                } else {
                    console.warn("No Supabase JWT template found in Clerk. RLS policies may fail.");
                }

                let { data: dbUser } = await supabase
                    .from("users")
                    .select("*")
                    .eq("auth_user_id", user.id)
                    .maybeSingle();

                const email = user.primaryEmailAddress?.emailAddress || "";
                const name = user.fullName || user.firstName || "Player";

                if (!dbUser && email) {
                    const { data: byEmail } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
                    if (byEmail) {
                        const { data: updated } = await supabase.from("users").update({ auth_user_id: user.id }).eq("id", byEmail.id).select().single();
                        dbUser = updated;
                    }
                }
                
                if (!dbUser) {
                    const insertPayload = {
                        auth_user_id: user.id,
                        username: name.toLowerCase().replace(/\s+/g, "_") + Math.floor(Math.random()*1000),
                        name: name,
                        email: email,
                        onboarding_complete: false,
                        age: 18,
                        total_xp: 0,
                        level: 1,
                        stories_completed: 0
                    };
                    const { data: inserted, error } = await supabase.from("users").insert(insertPayload).select().single();
                    if (!error && inserted) {
                        dbUser = inserted;
                        await supabase.from("personality_profiles").upsert({
                            user_id: dbUser.id,
                            trait_risk_taker: 50,
                            trait_creative: 50,
                            trait_analytical: 50,
                            trait_social: 50,
                            trait_ambitious: 50,
                        }, { onConflict: "user_id" });
                    }
                }

                if (dbUser) {
                    saveSession({
                        id: dbUser.id,
                        username: dbUser.username,
                        name: dbUser.name,
                        email: dbUser.email,
                        onboarding_complete: dbUser.onboarding_complete,
                        age: dbUser.age
                    });
                    
                    const store = useUserStore.getState();
                    store.setProfile({
                        ...dbUser,
                        assessmentCompleted: dbUser.assessment_completed
                    });
                }
            } catch(e) {
                console.error("Clerk sync failed", e);
                syncedRef.current = false;
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user]);

    return null;
}
