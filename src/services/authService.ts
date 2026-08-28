import { supabase } from '../utils/supabase';
import { saveSession, clearAllUserData } from '../utils/session';
import { useUserStore } from '../store/userStore';
import { checkUsernameAvailable } from './usernameService';
import { validatePhone, derivePhoneEmail, deriveMobileEmail } from '../utils/authHelpers';

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
    age?: number;
}

export interface SignInParams {
    username: string;
    password?: string;
}

export interface SignUpPhoneParams {
    phone: string;
    password?: string;
    confirmPassword?: string;
    age?: number;
}


export interface SignInPhoneParams {
    phone: string;
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
     * Sign Up with Phone Number + Password
     */
    async signUpWithPhonePassword({ phone, password, confirmPassword, age }: SignUpPhoneParams) {
        // Enforce strict 10-digit mobile number validation
        const cleanPhone = validatePhone(phone);

        const numericAge = Number(age);
        if (!age || isNaN(numericAge) || numericAge < 13 || numericAge > 30) {
            throw new Error('Please select your age.');
        }

        // Clear any stale local flags from previous user sessions on this device
        try {
            localStorage.removeItem('onboarding_done');
            localStorage.removeItem('aya_quiz_done');
            sessionStorage.removeItem('onboarding_done');
            sessionStorage.removeItem('aya_quiz_done');
        } catch {}

        if (password && confirmPassword && password !== confirmPassword) {
            throw new Error('Passwords do not match.');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters.');
        }

        // 1. Check if phone number is already registered in public.users
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('mobile', cleanPhone)
            .is('deleted_at', null)
            .maybeSingle();

        if (existingUser) {
            throw new Error('An account with this phone number already exists. Please sign in instead.');
        }

        // 2. Create user in Supabase Auth using synthetic phone email
        const email = derivePhoneEmail(cleanPhone);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { mobile: cleanPhone }
            }
        });

        if (authError) {
            if (authError.message.includes('User already registered') || authError.status === 400) {
                throw new Error('An account with this phone number already exists. Please sign in instead.');
            }
            if (authError.message.toLowerCase().includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
            }
            throw new Error(authError.message || 'Registration failed. Please try again.');
        }

        const authUid = authData.user?.id;
        const defaultName = `User_${cleanPhone.slice(-4)}`;

        // 3. Create record in public.users
        // NOTE: onboarding_complete=false here so user is directed to /signup/complete to set username
        const insertPayload: any = {
            auth_user_id: authUid,
            mobile: cleanPhone,
            name: defaultName,
            email,
            onboarding_complete: false,
            total_xp: 0,
            level: 1,
            stories_completed: 0,
            age: numericAge,
            preferred_theme: 'city_dark',
        };

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .upsert(insertPayload, { onConflict: 'mobile' })
            .select()
            .single();

        if (insertError) {
            console.warn('[AuthService] Supabase insert warning:', insertError.message);
        }

        const activeUser = newUser || { ...insertPayload, id: authUid || crypto.randomUUID() };

        // 4. Ensure personality profile entry exists
        try {
            await supabase.from('personality_profiles').upsert({
                user_id: activeUser.id,
                mobile: cleanPhone,
                trait_risk_taker: 50,
                trait_creative: 50,
                trait_analytical: 50,
                trait_social: 50,
                trait_ambitious: 50,
                future_archetype: 'Explorer',
                total_xp: 0,
                level: 1,
                stories_completed: 0
            }, { onConflict: 'user_id' });
        } catch { /* non-critical, swallow */ }

        // 5. Save Session & Hydrate Store
        saveSession({
            id: activeUser.id,
            username: activeUser.username || '',
            name: activeUser.name || defaultName,
            mobile: activeUser.mobile || cleanPhone,
            email: activeUser.email || email,
            onboarding_complete: false,
            age: numericAge,
        });

        useUserStore.getState().setProfile({
            id: activeUser.id,
            username: activeUser.username,
            name: activeUser.name || defaultName,
            mobile: activeUser.mobile || cleanPhone,
            email: activeUser.email || email,
            onboarding_complete: false,
            age: numericAge,
            total_xp: activeUser.total_xp || 0,
            level: activeUser.level || 1,
            stories_completed: activeUser.stories_completed || 0,
            current_streak: activeUser.current_streak || 0,
            longest_streak: activeUser.longest_streak || 0,
            daily_challenge_completed: false,
            assessmentCompleted: false,
            traits: { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
        } as any);

        return activeUser;
    },

    /**

     * Sign In with Phone Number + Password
     */
    async signInWithPhonePassword({ phone, password }: SignInPhoneParams) {
        const cleanPhone = validatePhone(phone);
        if (!password) {
            throw new Error('Please enter your password.');
        }

        const email = derivePhoneEmail(cleanPhone);

        // 1. Authenticate with Supabase Auth
        let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            // Fallback check for legacy mobile format
            const legacyEmail = deriveMobileEmail(cleanPhone);
            const { data: legacyAuth, error: legacyError } = await supabase.auth.signInWithPassword({
                email: legacyEmail,
                password,
            });

            if (!legacyError && legacyAuth.session) {
                authData = legacyAuth;
            } else {
                throw new Error('Invalid phone number or password.');
            }
        }

        const authUid = authData.session?.user?.id;

        // 2. Fetch public.users row
        let { data: userRow } = await supabase
            .from('users')
            .select('*')
            .or(`auth_user_id.eq.${authUid},mobile.eq.${cleanPhone}`)
            .is('deleted_at', null)
            .maybeSingle();

        if (!userRow) {
            // Auto-create user row if Auth user exists
            const defaultName = `User_${cleanPhone.slice(-4)}`;
            const insertPayload = {
                auth_user_id: authUid,
                mobile: cleanPhone,
                name: defaultName,
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

        // Persist auth email for admin check (works for Google, phone, username logins)
        try {
            const { data: { session: authSession } } = await supabase.auth.getSession();
            if (authSession?.user?.email) {
                localStorage.setItem('aya_google_email', authSession.user.email);
            }
        } catch {}

        // Check if user is an admin via admin_users table
        let isAdmin = false;
        try {
            const { checkIsAdmin } = await import('../utils/adminCheck');
            isAdmin = await checkIsAdmin();
        } catch {}

        const onboardingComplete = Boolean(userRow.onboarding_complete || userRow.username);
        // Existing user has completed assessment if they have game progress, assessment flag, or onboarding flag
        const hasAssessmentCompleted = Boolean(
            (userRow.total_xp && userRow.total_xp > 0) ||
            (userRow.stories_completed && userRow.stories_completed > 0) ||
            (userRow.level && userRow.level > 1) ||
            userRow.assessment_completed === true ||
            userRow.onboarding_complete === true
        );

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
            assessmentCompleted: hasAssessmentCompleted,
            isAdmin,
            traits: { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
        } as any);

        return { user: userRow, onboardingComplete };
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
        let { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: cleanUsername }
            }
        });

        if (authError) {
            // Fallback: If account was created on a previous click or rate limit was hit,
            // attempt signInWithPassword in case the auth user already exists.
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!signInError && signInData.session?.user) {
                authData = { user: signInData.session.user, session: signInData.session } as any;
            } else {
                if (authError.message.includes('User already registered') || authError.status === 400) {
                    throw new Error('Username is already registered. Please sign in instead.');
                }
                if (authError.message.toLowerCase().includes('rate limit')) {
                    throw new Error('Supabase sign-up rate limit reached. Please wait a few minutes or try signing in if you already created this account.');
                }
                throw authError;
            }
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
        try {
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
            }, { onConflict: 'user_id' });
        } catch { /* non-critical, swallow */ }

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
            assessmentCompleted: false,
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
     * Complete profile setup — sets username after phone/Google signup.
     *
     * Strategy:
     *   1. Try POST /api/set-username (Vercel serverless / Vite dev plugin, uses Service Role Key)
     *   2. If API is unavailable, fall back to direct Supabase query using array select (no .single())
     */
    async completeProfileSetup({ username, password, mobile, age }: SignUpParams) {
        const cleanUsername = username.trim();
        const cleanMobile = mobile ? mobile.trim().replace(/\s+/g, '') : null;
        const currentProfile = useUserStore.getState().profile;
        const numericAge = age ? Number(age) : currentProfile?.age;

        if (!cleanUsername || cleanUsername.length < 3) {
            throw new Error('Username must be at least 3 characters long.');
        }

        // Require an active Supabase Auth session
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user;
        const authUid = authUser?.id;
        const accessToken = session?.access_token;

        if (!authUid || !accessToken) {
            throw new Error('You must be signed in to set a username. Please sign in again.');
        }

        // Set user password if provided (Google OAuth users choosing a password)
        if (password && password.length >= 6) {
            const { error: pwErr } = await supabase.auth.updateUser({ password });
            if (pwErr) console.warn('[AuthService] Password update warning:', pwErr.message);
        }

        let savedRow: any = null;

        // ── Path 1: Server-side API (Vercel production & Vite dev plugin) ─────
        try {
            const resp = await fetch('/api/set-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    mobile: cleanMobile || undefined,
                    age: numericAge || undefined,
                }),
            });

            if (resp.ok) {
                const result = await resp.json();
                if (result.success && result.user) {
                    savedRow = result.user;
                } else {
                    const msg = result.error || 'Failed to save username.';
                    if (msg.toLowerCase().includes('taken') || msg.toLowerCase().includes('unique')) {
                        throw new Error('Username is already taken. Please choose another.');
                    }
                    throw new Error(msg);
                }
            } else {
                const result = await resp.json().catch(() => ({ error: 'Server error' }));
                const msg = result.error || 'Failed to save username.';
                if (msg.toLowerCase().includes('taken') || msg.toLowerCase().includes('unique')) {
                    throw new Error('Username is already taken. Please choose another.');
                }
                console.info('[AuthService] /api/set-username returned non-ok:', resp.status, msg);
            }
        } catch (fetchErr: any) {
            if (fetchErr.message?.toLowerCase().includes('taken') || fetchErr.message?.toLowerCase().includes('already')) {
                throw fetchErr;
            }
            console.info('[AuthService] API fetch failed, trying direct Supabase fallback:', fetchErr.message);
        }

        // ── Path 2: SECURITY DEFINER RPC (bypasses RLS) ───────────────────────
        if (!savedRow) {
            try {
                const { data: rpcRes, error: rpcErr } = await supabase.rpc('set_username', { p_username: cleanUsername });
                if (!rpcErr && rpcRes === 'ok') {
                    const { data: fresh } = await supabase.from('users').select('*').eq('auth_user_id', authUid);
                    if (fresh && fresh.length > 0) savedRow = fresh[0];
                } else if (rpcErr) {
                    if (rpcErr.message?.toLowerCase().includes('taken') || rpcErr.message?.toLowerCase().includes('unique')) {
                        throw new Error('Username is already taken. Please choose another.');
                    }
                }
            } catch (e: any) {
                if (e.message?.toLowerCase().includes('taken')) throw e;
            }
        }

        // ── Path 3: Direct Supabase client fallback (without .single()) ───────
        if (!savedRow) {
            const updatePayload: any = {
                auth_user_id: authUid,
                username: cleanUsername,
                name: cleanUsername,
                onboarding_complete: true,
            };
            if (cleanMobile) updatePayload.mobile = cleanMobile;
            if (authUser?.email) updatePayload.email = authUser.email;
            if (numericAge) updatePayload.age = numericAge;

            // 1. Try UPDATE on existing user row filtered by auth_user_id
            const { data: updatedRows, error: updateErr } = await supabase
                .from('users')
                .update(updatePayload)
                .eq('auth_user_id', authUid)
                .select();

            if (updateErr) {
                if (updateErr.code === '23505' || updateErr.message.toLowerCase().includes('unique')) {
                    throw new Error('Username is already taken. Please choose another.');
                }
                if (updateErr.message.toLowerCase().includes('row-level') || updateErr.code === '42501') {
                    throw new Error(
                        'Database error: new row violates row-level security policy for table "users". ' +
                        'Please run migration 017_fix_phone_auth_rls.sql in Supabase SQL Editor.'
                    );
                }
                throw new Error(`Database error: ${updateErr.message}`);
            }

            if (updatedRows && updatedRows.length > 0) {
                savedRow = updatedRows[0];
            } else {
                // 2. No row was updated — try UPSERT by auth_user_id
                const insertPayload: any = {
                    ...updatePayload,
                    total_xp: 0,
                    level: 1,
                    stories_completed: 0,
                };
                if (numericAge) insertPayload.age = numericAge;

                const { data: insertedRows, error: insertErr } = await supabase
                    .from('users')
                    .upsert(insertPayload, { onConflict: 'auth_user_id' })
                    .select();

                if (insertErr) {
                    if (insertErr.code === '23505' || insertErr.message.toLowerCase().includes('unique')) {
                        throw new Error('Username is already taken. Please choose another.');
                    }
                    if (insertErr.message.toLowerCase().includes('row-level') || insertErr.code === '42501') {
                        throw new Error(
                            'Database error: new row violates row-level security policy for table "users". ' +
                            'Please run migration 017_fix_phone_auth_rls.sql in Supabase SQL Editor.'
                        );
                    }
                    throw new Error(`Database error: ${insertErr.message}`);
                }

                if (insertedRows && insertedRows.length > 0) {
                    savedRow = insertedRows[0];
                }
            }
        }

        // ── Hydrate store & session ───────────────────────────────────────────
        const finalAge = savedRow?.age || numericAge || currentProfile?.age;

        saveSession({
            id: savedRow?.id || currentProfile?.id || crypto.randomUUID(),
            username: cleanUsername,
            name: cleanUsername,
            mobile: savedRow?.mobile || cleanMobile || currentProfile?.mobile || '',
            email: authUser?.email || currentProfile?.email || '',
            onboarding_complete: true,
            age: finalAge,
        });

        const hasAssessmentCompleted = Boolean(
            (savedRow?.total_xp && savedRow.total_xp > 0) ||
            (savedRow?.stories_completed && savedRow.stories_completed > 0) ||
            (savedRow?.level && savedRow.level > 1) ||
            savedRow?.assessment_completed === true ||
            currentProfile?.assessmentCompleted === true
        );

        useUserStore.getState().setProfile({
            ...currentProfile,
            id: savedRow?.id || currentProfile?.id || crypto.randomUUID(),
            username: cleanUsername,
            name: cleanUsername,
            mobile: savedRow?.mobile || cleanMobile || currentProfile?.mobile,
            email: authUser?.email || currentProfile?.email || '',
            onboarding_complete: true,
            age: finalAge,
            assessmentCompleted: hasAssessmentCompleted,
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
