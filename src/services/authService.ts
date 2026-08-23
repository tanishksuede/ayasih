import { supabase } from '../utils/supabase';
import { saveSession, clearAllUserData } from '../utils/session';
import { useUserStore } from '../store/userStore';
import { checkUsernameAvailable } from './usernameService';

/** Helper to generate a consistent synthetic email for username-only Supabase Auth */
export function deriveUsernameEmail(username: string): string {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `${clean}@aya.app`;
}

export interface SignUpParams {
    username: string;
    password?: string;
    confirmPassword?: string;
    mobile?: string;
}

export interface SignInParams {
    username: string;
    password?: string;
}

export const authService = {
    /**
     * Trigger Google OAuth login/signup flow
     */
    async signInWithGoogle(redirectTo?: string) {
        const targetUrl = redirectTo || `${window.location.origin}/signup/complete`;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: targetUrl,
            },
        });
        if (error) throw error;
        return data;
    },

    /**
     * Sign Up with Username + Password (+ optional phone number)
     */
    async signUpWithUsernamePassword({ username, password, confirmPassword, mobile }: SignUpParams) {
        const cleanUsername = username.trim();
        const cleanMobile = mobile ? mobile.trim().replace(/\s+/g, '') : null;

        if (!cleanUsername || cleanUsername.length < 3) {
            throw new Error('Username must be at least 3 characters long.');
        }

        if (password && confirmPassword && password !== confirmPassword) {
            throw new Error('Passwords do not match.');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters.');
        }

        // 1. Check username availability
        const isAvailable = await checkUsernameAvailable(cleanUsername);
        if (!isAvailable) {
            throw new Error('Username is already taken.');
        }

        // 2. Check if phone number is already attached to a DIFFERENT user
        if (cleanMobile) {
            const { data: existingPhoneUser } = await supabase
                .from('users')
                .select('id')
                .eq('mobile', cleanMobile)
                .is('deleted_at', null)
                .maybeSingle();

            if (existingPhoneUser) {
                throw new Error('This phone number is already associated with another AYA account.');
            }
        }

        // 3. Create user in Supabase Auth using synthetic email
        const email = deriveUsernameEmail(cleanUsername);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: cleanUsername }
            }
        });

        if (authError) {
            // If email already exists in Auth, attempt signIn instead
            if (authError.message.includes('User already registered') || authError.status === 400) {
                throw new Error('Username is already registered. Please sign in instead.');
            }
            throw authError;
        }

        const authUid = authData.user?.id;

        // 4. Create or update record in public.users
        const insertPayload: any = {
            auth_user_id: authUid,
            username: cleanUsername,
            name: cleanUsername,
            email,
            mobile: cleanMobile,
            onboarding_complete: true,
            total_xp: 0,
            level: 1,
            stories_completed: 0,
            age: 18,
            preferred_theme: 'city_dark',
        };

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .upsert(insertPayload, { onConflict: 'username' })
            .select()
            .single();

        if (insertError) {
            console.warn('[AuthService] Supabase insert warning:', insertError.message);
        }

        const activeUser = newUser || { ...insertPayload, id: authUid || crypto.randomUUID() };

        // 5. Ensure personality profile entry exists
        await supabase.from('personality_profiles').upsert({
            user_id: activeUser.id,
            mobile: cleanMobile,
            trait_risk_taker: 50,
            trait_creative: 50,
            trait_analytical: 50,
            trait_social: 50,
            trait_ambitious: 50,
            future_archetype: 'Explorer',
            total_xp: 0,
            level: 1,
            stories_completed: 0
        }, { onConflict: 'user_id' }).catch(() => {});

        // 6. Save Session & Hydrate Store
        saveSession({
            id: activeUser.id,
            username: activeUser.username,
            name: activeUser.name,
            mobile: activeUser.mobile || '',
            email: activeUser.email || '',
            onboarding_complete: true,
            age: activeUser.age || 18,
        });

        useUserStore.getState().setProfile({
            id: activeUser.id,
            username: activeUser.username,
            name: activeUser.name,
            mobile: activeUser.mobile,
            email: activeUser.email,
            onboarding_complete: true,
            age: activeUser.age || 18,
            total_xp: activeUser.total_xp || 0,
            level: activeUser.level || 1,
            stories_completed: activeUser.stories_completed || 0,
            current_streak: activeUser.current_streak || 0,
            longest_streak: activeUser.longest_streak || 0,
            daily_challenge_completed: false,
            assessmentCompleted: true,
            traits: { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
        } as any);

        return activeUser;
    },

    /**
     * Sign In with Username + Password
     */
    async signInWithUsernamePassword({ username, password }: SignInParams) {
        const cleanUsername = username.trim();
        if (!cleanUsername || !password) {
            throw new Error('Please provide both username and password.');
        }

        // Derive synthetic email
        const email = deriveUsernameEmail(cleanUsername);

        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            // Fallback: check if username exists in public.users by another email
            const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('username', cleanUsername)
                .is('deleted_at', null)
                .maybeSingle();

            if (!dbUser) {
                throw new Error('Account not found for this username.');
            }

            if (dbUser.email && dbUser.email !== email) {
                // Retry sign in using the stored email
                const { data: retryAuth, error: retryError } = await supabase.auth.signInWithPassword({
                    email: dbUser.email,
                    password,
                });
                if (retryError) throw new Error('Invalid username or password.');
                return this.handlePostSignIn(dbUser, retryAuth.session?.user?.id);
            }

            throw new Error('Invalid username or password.');
        }

        const authUid = authData.session?.user?.id;

        // 2. Fetch public.users row
        let { data: userRow } = await supabase
            .from('users')
            .select('*')
            .or(`auth_user_id.eq.${authUid},username.eq.${cleanUsername}`)
            .is('deleted_at', null)
            .maybeSingle();

        if (!userRow) {
            // Auto-create user row if Auth user exists
            const insertPayload = {
                auth_user_id: authUid,
                username: cleanUsername,
                name: cleanUsername,
                email,
                onboarding_complete: true,
                total_xp: 0,
                level: 1,
                stories_completed: 0,
                age: 18,
            };
            const { data: created } = await supabase.from('users').insert(insertPayload).select().single();
            userRow = created || { ...insertPayload, id: authUid };
        }

        return this.handlePostSignIn(userRow, authUid);
    },

    /**
     * Internal post-signin handler to sync store & session
     */
    async handlePostSignIn(userRow: any, authUid?: string) {
        // Link auth_user_id if missing
        if (authUid && !userRow.auth_user_id) {
            await supabase.from('users').update({ auth_user_id: authUid }).eq('id', userRow.id).catch(() => {});
        }

        const onboardingComplete = Boolean(userRow.onboarding_complete || userRow.username);

        saveSession({
            id: userRow.id,
            username: userRow.username,
            name: userRow.name || userRow.username || 'Player',
            mobile: userRow.mobile || '',
            email: userRow.email || '',
            onboarding_complete: onboardingComplete,
            age: userRow.age || 18,
        });

        // Hydrate store
        useUserStore.getState().setProfile({
            id: userRow.id,
            username: userRow.username,
            name: userRow.name || userRow.username || 'Player',
            mobile: userRow.mobile,
            email: userRow.email,
            onboarding_complete: onboardingComplete,
            age: Number(userRow.age) || 18,
            total_xp: userRow.total_xp || 0,
            level: userRow.level || 1,
            stories_completed: userRow.stories_completed || 0,
            current_streak: userRow.current_streak || 0,
            longest_streak: userRow.longest_streak || 0,
            daily_challenge_completed: userRow.daily_challenge_completed || false,
            assessmentCompleted: true,
            traits: { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
        } as any);

        return { user: userRow, onboardingComplete };
    },

    /**
     * Complete profile setup (for Google OAuth users or incomplete profiles)
     */
    async completeProfileSetup({ username, password, mobile }: SignUpParams) {
        const cleanUsername = username.trim();
        const cleanMobile = mobile ? mobile.trim().replace(/\s+/g, '') : null;

        if (!cleanUsername || cleanUsername.length < 3) {
            throw new Error('Username must be at least 3 characters long.');
        }

        // Get current auth session
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user;
        const currentUserId = useUserStore.getState().profile?.id;

        // Check username availability
        const isAvailable = await checkUsernameAvailable(cleanUsername, currentUserId);
        if (!isAvailable) {
            throw new Error('Username is already taken.');
        }

        // Check phone uniqueness
        if (cleanMobile) {
            const { data: existingPhoneUser } = await supabase
                .from('users')
                .select('id')
                .eq('mobile', cleanMobile)
                .neq('id', currentUserId || '')
                .is('deleted_at', null)
                .maybeSingle();

            if (existingPhoneUser) {
                throw new Error('This phone number is already associated with another AYA account.');
            }
        }

        // Set user password if provided
        if (password && password.length >= 6) {
            await supabase.auth.updateUser({ password }).catch((e: any) => {
                console.warn('[AuthService] Password update warning:', e.message);
            });
        }

        // Update public.users
        const updateData: any = {
            username: cleanUsername,
            name: cleanUsername,
            mobile: cleanMobile,
            onboarding_complete: true,
        };

        if (authUser?.id) {
            updateData.auth_user_id = authUser.id;
            updateData.google_id = authUser.id;
            if (authUser.email) updateData.email = authUser.email;
        }

        let targetId = currentUserId;

        if (targetId) {
            await supabase.from('users').update(updateData).eq('id', targetId);
        } else if (authUser?.id) {
            const { data: userByAuth } = await supabase
                .from('users')
                .select('id')
                .or(`auth_user_id.eq.${authUser.id},google_id.eq.${authUser.id}`)
                .maybeSingle();

            if (userByAuth) {
                targetId = userByAuth.id;
                await supabase.from('users').update(updateData).eq('id', targetId);
            } else {
                const insertPayload = {
                    ...updateData,
                    total_xp: 0,
                    level: 1,
                    stories_completed: 0,
                    age: 18,
                };
                const { data: inserted } = await supabase.from('users').insert(insertPayload).select().single();
                if (inserted) targetId = inserted.id;
            }
        }

        // Save session & update state
        saveSession({
            id: targetId || crypto.randomUUID(),
            username: cleanUsername,
            name: cleanUsername,
            mobile: cleanMobile || '',
            email: authUser?.email || '',
            onboarding_complete: true,
            age: 18,
        });

        useUserStore.getState().setProfile({
            ...useUserStore.getState().profile,
            id: targetId || crypto.randomUUID(),
            username: cleanUsername,
            name: cleanUsername,
            mobile: cleanMobile,
            email: authUser?.email || '',
            onboarding_complete: true,
            assessmentCompleted: true,
        } as any);

        return true;
    },

    /**
     * Sign out user completely
     */
    async signOut() {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.warn('[AuthService] signOut error:', e);
        }
        clearAllUserData();
        useUserStore.getState().clearUserData();
    }
};
