import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { SupabaseChecker } from '../components/SupabaseChecker';
import { StreakCelebration } from '../components/game/StreakCelebration';
import { supabase } from '../utils/supabase';
import { getSession, clearSession, markQuizDone, isQuizDone } from '../utils/session';
import { withTimeout } from '../utils/withTimeout';
import { useUserStore } from '../store/userStore';
import { safeStorage } from '../utils/storage';
import { NotificationPrompt } from '../components/ui/NotificationPrompt';
import { subscribeUserToPush } from '../utils/pushNotifications';
import { MascotLoader } from '../components/ui/MascotLoader';

export function GameRoot() {
    const profile = useUserStore((state) => state.profile);
    const mapTheme = useUserStore((state) => state.mapTheme);
    const setMapTheme = useUserStore((state) => state.setMapTheme);
    const pendingStreakData = useUserStore((state) => state.pendingStreakData);
    const setPendingStreakData = useUserStore((state) => state.setPendingStreakData);
    const location = useLocation();
    const safetySyncStarted = useRef(false);

    // Sync theme from localStorage on mount; reset 'solar' → 'city_dark'
    useEffect(() => {
        const raw = safeStorage.get('aya_map_theme') as any;
        const storedTheme = (!raw || raw === 'solar') ? 'city_dark' : raw;
        if (storedTheme !== mapTheme) {
            setMapTheme(storedTheme);
        }
    }, []);


    // NOTE: syncLevels is called explicitly inside restoreSession after scores are loaded.
    // Do NOT call it here on mount — it would run with empty levelScores and reset everything.

    const [sessionStatus, setSessionStatus] = useState<'checking' | 'found' | 'not_found'>('checking');
    const [connectionError, setConnectionError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionStatus === 'found') {
            // we could store the last path, but simple last view is fine
            if (location.pathname === '/game' || location.pathname === '/game/dna') {
                localStorage.setItem('aya_last_view', location.pathname);
            }
        }
    }, [location.pathname, sessionStatus]);



    // Safety net: if a user finishes onboarding, GameRoot is already mounted,
    // so restoreSession() won't run again. We must fetch levels for them.
    useEffect(() => {
        const store = useUserStore.getState();
        if (profile && store.levels.length === 0 && sessionStatus !== 'checking') {
            if (!safetySyncStarted.current) {
                safetySyncStarted.current = true;
                store.syncLevels().finally(() => {
                    // Reset if it somehow fails, allowing retry
                    if (useUserStore.getState().levels.length === 0) {
                        safetySyncStarted.current = false;
                    }
                });
            }
        }
    }, [profile, sessionStatus]);

    useEffect(() => {
        const restoreSession = async () => {
            console.log('[Session] Checking for existing session...')

            // ── iOS FAST PATH ──────────────────────────────────────────────────────
            // If the Zustand store already has a persisted profile AND the session
            // keys match, show the app immediately without waiting for Supabase.
            // We still fetch from DB in the background to stay up-to-date.
            const store = useUserStore.getState();
            const sessionQuick = getSession();
            if (store.profile && sessionQuick.userId && store.profile.id === sessionQuick.userId) {
                console.log('[Session] Fast-path: using cached Zustand profile, skipping DB wait');
                setSessionStatus('found');
                // Hydrate from DB silently in background (don't block UI)
                withTimeout(
                    supabase.from('users').select('*').eq('id', sessionQuick.userId).is('deleted_at', null).maybeSingle(),
                    6000
                ).then(({ data: freshUser }: any) => {
                    if (freshUser) {
                        store.setProfile({ ...store.profile!, ...freshUser });
                    }
                }).catch(() => { /* silent — cached profile already shown */ });
                return;
            }
            // ──────────────────────────────────────────────────────────────────────

            // Reduced from 20s → 8s for faster iOS failure recovery
            const maxWait = setTimeout(() => {
                setSessionStatus(prev => prev === 'checking' ? 'not_found' : prev);
            }, 8000);

            try {
                const session = getSession();
                if (!session.userId) {
                    clearTimeout(maxWait);
                    setSessionStatus('not_found');
                    return;
                }

                let user: any = null;
                const isJeeNeet = store.profile?.access_type === 'jee15' || store.profile?.access_type === 'neet15';

                if (isJeeNeet) {
                    let attempt = 0;
                    while (attempt < 3 && !user) {
                        attempt++;
                        try {
                            const { data, error }: any = await withTimeout(
                                supabase.from('users').select('*').eq('id', session.userId).is('deleted_at', null).maybeSingle()
                            );
                            if (error) throw error;
                            user = data;
                        } catch (e) {
                            if (attempt < 3) {
                                await new Promise(r => setTimeout(r, 5000));
                            } else {
                                clearTimeout(maxWait);
                                setConnectionError("Having trouble connecting. Please check your internet and try again.");
                                return;
                            }
                        }
                    }
                } else {
                    try {
                        // Reduced timeout from 20s → 6s for iOS
                        const { data, error }: any = await withTimeout(
                            supabase.from('users').select('*').eq('id', session.userId).is('deleted_at', null).maybeSingle(),
                            6000
                        );
                        if (error) throw error;
                        user = data;
                    } catch (dbErr) {
                        if (!store.profile) {
                            store.setProfile({
                                id: session.userId,
                                name: session.name || 'Player',
                                age: session.age || 18,
                                mobile: session.mobile,
                                total_xp: 0, level: 1,
                                current_streak: 0, longest_streak: 0,
                                stories_completed: 0,
                                daily_challenge_completed: false,
                                preferred_theme: 'city_dark',
                                access_type: 'free',
                                access_start_date: null,
                                preferred_map: null,
                                assessmentCompleted: isQuizDone(),
                            } as any);
                            if (isQuizDone()) {
                                store.completeAssessment(
                                    { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
                                    { motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient', social: 'Supporter', passion: 'Creative', coreValue: 'Success' }
                                );
                            }
                        }
                        clearTimeout(maxWait);
                        setSessionStatus('found');
                        return;
                    }
                }

                if (!user) {
                    clearSession();
                    clearTimeout(maxWait);
                    setSessionStatus('not_found');
                    return;
                }


                let profileData: any = null;
                try {
                    const { data }: any = await withTimeout(
                        supabase.from('personality_profiles').select('*').eq('user_id', session.userId).maybeSingle(),
                        5000
                    );
                    profileData = data;
                } catch { }

                let quizCompleted = isQuizDone() || !!profileData;
                if (!quizCompleted) {
                    try {
                        const { data: qr }: any = await withTimeout(
                            supabase.from('quiz_responses').select('id').eq('user_id', session.userId).limit(1),
                            5000
                        );
                        quizCompleted = !!(qr && qr.length > 0);
                        if (quizCompleted) markQuizDone();
                    } catch { }
                }

                // Fallback: If they have progression data or already completed onboarding, assume assessment is done
                if (!quizCompleted && user && (user.total_xp > 0 || user.stories_completed > 0 || user.level > 1 || user.onboarding_complete)) {
                    quizCompleted = true;
                    markQuizDone();
                    localStorage.setItem('onboarding_done', 'true');
                }

                // ── STEP 1: Build level scores from game_sessions and user table ──
                const restoredScores: Record<string, number> = {};
                
                // 1a. Grab from users table as primary fallback (since game_sessions insert might fail)
                if (user && user.level_scores) {
                    const dbScores = typeof user.level_scores === 'string'
                        ? (() => { try { return JSON.parse(user.level_scores); } catch { return {}; } })()
                        : user.level_scores;
                    Object.entries(dbScores).forEach(([id, stars]) => {
                        restoredScores[id] = Math.max(restoredScores[id] || 0, Number(stars) || 0);
                    });
                }

                console.log('[Session] Final restored scores:', JSON.stringify(restoredScores));

                // ── STEP 1.5: Check if user is an admin ──
                let isAdmin = false;
                try {
                    const { checkIsAdmin } = await import('../utils/adminCheck');
                    isAdmin = await checkIsAdmin();
                } catch (err) {
                    console.error('Failed to check admin status:', err);
                }

                // ── STEP 2: Set profile (this triggers syncLevels internally but we'll override after) ──
                store.setProfile({
                    id: user.id,
                    name: user.name,
                    age: Number(user.age) || 18,
                    mobile: user.mobile,
                    username: user.username ?? undefined,
                    email: user.email ?? undefined,
                    google_id: user.google_id ?? undefined,
                    auth_user_id: user.auth_user_id ?? undefined,
                    onboarding_complete: Boolean(user.onboarding_complete || user.username),
                    total_xp: user.total_xp || 0,
                    level: user.level || 1,
                    current_streak: user.current_streak || 0,
                    longest_streak: user.longest_streak || 0,
                    stories_completed: user.stories_completed || 0,
                    daily_challenge_completed: user.daily_challenge_completed || false,
                    preferred_theme: user.preferred_theme || 'city_dark',
                    access_type: user.access_type,
                    access_start_date: user.access_start_date,
                    preferred_map: user.preferred_map,
                    assessmentCompleted: quizCompleted,
                    onboarding_scores: user.onboarding_scores || undefined,
                    gameplay_scores: user.gameplay_scores || undefined,
                    story_count: user.story_count || 0,
                    tutorial_completed: user.tutorial_completed || false,
                    topic_survey_completed: user.topic_survey_completed || false,
                    choice_history: user.choice_history || [],
                    music_volume: user.music_volume,
                    sfx_volume: user.sfx_volume,
                    is_music_muted: user.is_music_muted,
                    is_sfx_muted: user.is_sfx_muted,
                    traits: {
                        risk: profileData?.trait_risk_taker || 50,
                        creativity: profileData?.trait_creative || 50,
                        vision: profileData?.trait_analytical || 50,
                        empathy: profileData?.trait_social || 50,
                        leadership: profileData?.trait_ambitious || 50,
                        discipline: 50,
                        resilience: 50,
                    },
                    futureArchetype: profileData?.future_archetype || undefined,
                    futureArchetypeScore: profileData?.future_archetype_score || undefined,
                    lifeTraits: profileData ? {
                        resilience: profileData.life_resilience || 50,
                        discipline: profileData.life_discipline || 50,
                        courage: profileData.life_courage || 50,
                        creativity: profileData.life_creativity || 50,
                        emotional_control: profileData.life_emotional_control || 50,
                        leadership: profileData.life_leadership || 50,
                        risk_intelligence: profileData.life_risk_intelligence || 50,
                        consistency: profileData.life_consistency || 50,
                    } : undefined,
                    ...(profileData ? {
                        trait_risk_taker: profileData.trait_risk_taker,
                        trait_creative: profileData.trait_creative,
                        trait_analytical: profileData.trait_analytical,
                        trait_social: profileData.trait_social,
                        trait_ambitious: profileData.trait_ambitious,
                        future_archetype: profileData.future_archetype,
                        interest_goal: profileData.interest_goal,
                        interest_struggle: profileData.interest_struggle,
                        interest_domain: profileData.interest_domain,
                    } : {}),
                    isAdmin
                } as any);

                if (quizCompleted && profileData) {
                    store.completeAssessment(
                        {
                            discipline: 50,
                            resilience: 50,
                            risk: profileData.trait_risk_taker || 50,
                            leadership: profileData.trait_ambitious || 50,
                            creativity: profileData.trait_creative || 50,
                            empathy: profileData.trait_social || 50,
                            vision: profileData.trait_analytical || 50
                        },
                        {
                            motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                            social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                        }
                    );
                } else if (quizCompleted && !profileData) {
                    store.completeAssessment(
                        { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
                        { motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient', social: 'Supporter', passion: 'Creative', coreValue: 'Success' }
                    );
                }

                const savedTheme = user.preferred_theme || 'city_dark';
                store.setMapTheme(savedTheme as any);

                // Restore persistent backend preferences & flags
                if (user.tutorial_completed) localStorage.setItem('aya_game_tutorial_done', 'true');
                if (user.topic_survey_completed) localStorage.setItem('aya_topic_survey_done', 'true');
                if (user.choice_history && Array.isArray(user.choice_history) && user.choice_history.length > 0) {
                    localStorage.setItem('aya_choice_history', JSON.stringify(user.choice_history));
                }
                if (typeof user.music_volume === 'number') store.setMusicVolume(user.music_volume);
                if (typeof user.sfx_volume === 'number') store.setSfxVolume(user.sfx_volume);
                if (typeof user.is_music_muted === 'boolean' && user.is_music_muted !== store.isMusicMuted) {
                    store.toggleMusicMute();
                }
                if (typeof user.is_sfx_muted === 'boolean' && user.is_sfx_muted !== store.isSfxMuted) {
                    store.toggleSfxMute();
                }

                // ── STEP 3: SYNC LEVELS AND APPLY SCORES ──
                // Everyone needs levels, so we always sync them.
                await store.syncLevels();

                if (Object.keys(restoredScores).length > 0) {
                    // Apply scores by merging with local state (so we don't wipe progress if DB failed to save previously)
                    useUserStore.setState((state) => ({ 
                        levelScores: { ...state.levelScores, ...restoredScores } 
                    }));
                    // Force-mark levels as completed in the levels array directly
                    useUserStore.setState((state) => ({
                        levels: state.levels.map(l => {
                            const dbScore = restoredScores[l.id];
                            const localScore = state.levelScores[l.id];
                            const bestScore = Math.max(dbScore || 0, localScore || 0);
                            
                            if (bestScore > 0) {
                                return { ...l, status: 'completed', stars: bestScore };
                            }
                            return l;
                        })
                    }));
                } else {
                    // Even if DB has nothing, ensure local levelScores are applied to levels
                    useUserStore.setState((state) => ({
                        levels: state.levels.map(l => {
                            const localScore = state.levelScores[l.id];
                            if (localScore !== undefined && localScore > 0) {
                                return { ...l, status: 'completed', stars: localScore };
                            }
                            return l;
                        })
                    }));
                }
                
                console.log('[Session] ✓ Force-applied', Object.keys(restoredScores).length, 'completed levels to map');

                clearTimeout(maxWait);
                setSessionStatus('found');

            } catch (err) {
                clearTimeout(maxWait);
                setSessionStatus('not_found');
            }
        };

        restoreSession();
    }, [])

    const onboardingComplete = localStorage.getItem('onboarding_done') === 'true';

    // Track level for level-up screen — persist across logins so it doesn't
    // re-trigger every time the user opens the app at level 2+
    const prevLevelRef = useRef<number>(parseInt(localStorage.getItem('aya_last_seen_level') || '1', 10));

    useEffect(() => {
        if (!profile?.level) return;
        // Only update tracking, do not show celebration overlay
        if (profile.level > prevLevelRef.current) {
            prevLevelRef.current = profile.level;
            localStorage.setItem('aya_last_seen_level', String(profile.level));
        }
    }, [profile?.level]);

    // Daily Notification Prompt Check
    const [showDailyNotifPrompt, setShowDailyNotifPrompt] = useState(false);

    useEffect(() => {
        if (sessionStatus !== 'found' || !profile) return;
        
        // Skip on initial onboarding / assessment steps
        if (!profile.assessmentCompleted || location.pathname.startsWith('/game/onboarding') || location.pathname.startsWith('/game/assessment')) {
            return;
        }

        // Only prompt if notifications are not already enabled in browser
        const hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;
        if (!hasNotificationSupport) return;
        if (Notification.permission === 'granted') return;

        // Check if we already prompted the user today
        const todayDateStr = new Date().toISOString().split('T')[0];
        const lastPromptDate = safeStorage.get('aya_daily_notif_prompt_date');

        if (lastPromptDate !== todayDateStr) {
            const timer = setTimeout(() => {
                setShowDailyNotifPrompt(true);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [sessionStatus, profile, location.pathname]);

    const handleAcceptDailyNotif = async () => {
        const todayDateStr = new Date().toISOString().split('T')[0];
        safeStorage.set('aya_daily_notif_prompt_date', todayDateStr);
        setShowDailyNotifPrompt(false);
        try {
            await subscribeUserToPush(profile?.id);
        } catch (err) {
            console.warn('[DailyNotif] Subscription notice:', err);
        }
    };

    const handleDeclineDailyNotif = () => {
        const todayDateStr = new Date().toISOString().split('T')[0];
        safeStorage.set('aya_daily_notif_prompt_date', todayDateStr);
        setShowDailyNotifPrompt(false);
    };

    if (sessionStatus === 'checking') {
        return (
            <MascotLoader
                message="LOADING YOUR UNIVERSE..."
                subMessage={connectionError || undefined}
            />
        );
    }

    if (!profile && location.pathname !== '/game/welcome' && location.pathname !== '/game/setup') {
        return <Navigate to="/signin" replace />;
    }

    if (profile && profile.assessmentCompleted && (location.pathname === '/game/welcome' || location.pathname === '/game/setup')) {
        return <Navigate to="/game" replace />;
    }

    if (profile && !profile.assessmentCompleted && !onboardingComplete && !location.pathname.startsWith('/game/onboarding')) {
        return <Navigate to="/game/onboarding/1" replace />;
    }

    if (profile && !profile.assessmentCompleted && onboardingComplete && !location.pathname.startsWith('/game/assessment')) {
        return <Navigate to="/game/assessment/1" replace />;
    }

    const isScrollableRoute =
        location.pathname.startsWith('/game/report') ||
        location.pathname === '/game/welcome' ||
        location.pathname === '/game/setup' ||
        location.pathname === '/game/dna' ||
        location.pathname === '/game/profile' ||
        location.pathname === '/game/settings' ||
        location.pathname === '/game/journal' ||
        location.pathname.startsWith('/game/admin');

    return (
        <div className={`relative w-full font-sans bg-slate-900 text-slate-100 ${
            isScrollableRoute
                ? 'min-h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth'
                : 'h-[100dvh] overflow-hidden'
        }`}>
            <SupabaseChecker />
            <Outlet />
            <NotificationPrompt 
                isOpen={showDailyNotifPrompt}
                onAccept={handleAcceptDailyNotif}
                onDecline={handleDeclineDailyNotif}
            />
            {pendingStreakData && (
                <div className="absolute inset-0 z-[9999]">
                    <StreakCelebration 
                        streak={pendingStreakData.newStreak}
                        xpEarned={pendingStreakData.xpEarned}
                        isMilestone={pendingStreakData.isMilestone}
                        onComplete={() => setPendingStreakData(null)}
                    />
                </div>
            )}
        </div>
    );
}
