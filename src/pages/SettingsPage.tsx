import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { audioManager as audioSynth } from "../utils/audioManager";
import { bgmManager } from '../utils/bgmManager';
import { Volume2, VolumeX, Trash2, AlertTriangle, Bell, SunMoon } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../utils/supabase';
import { clearAllUserData } from '../utils/session';
import { subscribeToPush, unsubscribeFromPush, sendTestNotification, getNotificationSupportStatus, getExistingSubscription, runIsolatedPushDiagnostic } from '../utils/pushNotifications';

export function SettingsPage() {
    const navigate = useNavigate();
    const [newPreferredMap, setNewPreferredMap] = useState('standard');

    // Push Notifications State
    const [pushState, setPushState] = useState<'unsupported' | 'granted' | 'denied' | 'default' | 'subscribing'>(() => getNotificationSupportStatus());
    const [pushMessage, setPushMessage] = useState('');

    // Check active PushSubscription status on mount
    useEffect(() => {
        const checkActiveSubscription = async () => {
            const status = getNotificationSupportStatus();
            if (status === 'granted') {
                const sub = await getExistingSubscription();
                setPushState(sub ? 'granted' : 'default');
            } else {
                setPushState(status);
            }
        };
        checkActiveSubscription();
    }, []);

    // Delete Account State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const resetProgress = useUserStore((state) => state.resetProgress);
    const clearUserData = useUserStore((state) => state.clearUserData);

    const musicVolume = useUserStore((state) => state.musicVolume);
    const sfxVolume = useUserStore((state) => state.sfxVolume);
    const isMusicMuted = useUserStore((state) => state.isMusicMuted);
    const isSfxMuted = useUserStore((state) => state.isSfxMuted);
    const isNarrationMuted = useUserStore((state) => state.isNarrationMuted);
    const setMusicVolume = useUserStore((state) => state.setMusicVolume);
    const setSfxVolume = useUserStore((state) => state.setSfxVolume);
    const toggleMusicMute = useUserStore((state) => state.toggleMusicMute);
    const toggleSfxMute = useUserStore((state) => state.toggleSfxMute);
    const toggleNarrationMute = useUserStore((state) => state.toggleNarrationMute);

    const appLanguage = useUserStore((state) => state.appLanguage);
    const setAppLanguage = useUserStore((state) => state.setAppLanguage);


    useEffect(() => {
        if (profile) {
            if (profile.preferred_map) setNewPreferredMap(profile.preferred_map);
        }
    }, [profile]);

    // Live sync audio while in settings
    useEffect(() => {
        bgmManager.setVolume(isMusicMuted ? 0 : musicVolume);
        audioSynth.setMusicVolume(isMusicMuted ? 0 : musicVolume);
    }, [musicVolume, isMusicMuted]);

    useEffect(() => {
        audioSynth.setSfxVolume(isSfxMuted ? 0 : sfxVolume);
    }, [sfxVolume, isSfxMuted]);

    const handleSave = async () => {
        if (profile) {
            setProfile({ ...profile, preferred_map: newPreferredMap });
            try {
                await supabase.from('users').update({ 
                    preferred_map: newPreferredMap
                }).eq('id', profile.id);
            } catch (err) {
                console.error("Failed to update profile in Supabase", err);
            }
            useUserStore.getState().syncLevels();
            navigate('/game');
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        setDeleteError(null);

        const isGuest = !profile?.id || profile.id.startsWith('local_') || profile.id.startsWith('offline-');

        try {
            if (!isGuest && profile?.id) {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                let apiSuccess = false;
                try {
                    const response = await fetch('/api/delete-account', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify({ userId: profile.id })
                    });

                    const resData = await response.json().catch(() => ({}));
                    if (response.ok && resData.success) {
                        apiSuccess = true;
                    } else if (resData.error) {
                        console.warn('[DeleteAccount] Endpoint returned error, trying DB fallback:', resData.error);
                    }
                } catch (fetchErr) {
                    console.warn('[DeleteAccount] Endpoint fetch failed, using DB fallback:', fetchErr);
                }

                // Fallback direct DB soft-delete if API endpoint didn't succeed
                if (!apiSuccess) {
                    const { error: dbError } = await supabase
                        .from('users')
                        .update({ status: 'deactivated', deleted_at: new Date().toISOString() })
                        .eq('id', profile.id);
                    if (dbError) {
                        throw new Error(`Database error: ${dbError.message}`);
                    }
                }

                try {
                    await supabase.auth.signOut();
                } catch {}
            }

            // Clear store and localStorage
            clearUserData();
            clearAllUserData();

            // Redirect
            navigate('/game/welcome');
        } catch (err: any) {
            console.error('[DeleteAccount] Error during account deletion:', err);
            setDeleteError(err.message || 'An error occurred while deleting your account. Please try again.');
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleEnablePush = async () => {
        audioSynth.playClick();
        setPushState('subscribing');
        setPushMessage('');
        try {
            const sub = await subscribeToPush(profile?.id);
            if (sub) {
                setPushState('granted');
                setPushMessage('Notifications enabled!');
                setTimeout(() => setPushMessage(''), 3000);
            } else {
                const currentStatus = getNotificationSupportStatus();
                setPushState(currentStatus);
                if (currentStatus === 'denied') {
                    setPushMessage('Permission denied in browser settings.');
                } else {
                    setPushMessage('Failed to enable push notifications.');
                }
            }
        } catch (e: any) {
            setPushState(getNotificationSupportStatus());
            setPushMessage(e?.message || 'Error subscribing to notifications');
        }
    };

    const handleTestPush = async () => {
        audioSynth.playClick();
        await sendTestNotification();
    };

    const handleDiagnosticPush = async () => {
        audioSynth.playClick();
        setPushMessage('Running isolated browser push test...');
        const result = await runIsolatedPushDiagnostic();
        if (result.success) {
            setPushMessage(`Push Service OK! Endpoint host: ${result.endpointHost}`);
        } else {
            setPushMessage(`Push Diagnostic: ${result.error}`);
        }
        setTimeout(() => setPushMessage(''), 6000);
    };

    const handleDisablePush = async () => {
        audioSynth.playClick();
        setPushState('subscribing');
        try {
            await unsubscribeFromPush();
            setPushState('default');
            setPushMessage('Notifications disabled.');
            setTimeout(() => setPushMessage(''), 3000);
        } catch (e: any) {
            setPushState('granted');
            setPushMessage('Failed to disable notifications.');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                <h2 className="text-xl font-bold text-white mb-4 text-center">Settings</h2>
                <div className="space-y-6">
                    <div className="space-y-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Music</span>
                                <button
                                    onClick={() => { audioSynth.playClick(); toggleMusicMute(); }}
                                    className={clsx("p-1 rounded transition-colors", isMusicMuted ? "text-red-400 bg-red-900/30" : "text-green-400 bg-green-900/30")}
                                >
                                    {isMusicMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Sound FX</span>
                                <button
                                    onClick={() => { audioSynth.playClick(); toggleSfxMute(); }}
                                    className={clsx("p-1 rounded transition-colors", isSfxMuted ? "text-red-400 bg-red-900/30" : "text-green-400 bg-green-900/30")}
                                >
                                    {isSfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div className="pt-2 border-t border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Voice Narration</span>
                                <button
                                    onClick={() => { audioSynth.playClick(); toggleNarrationMute(); }}
                                    className={clsx("p-1 px-3 text-xs font-bold rounded transition-colors uppercase tracking-widest", isNarrationMuted ? "text-red-400 bg-red-900/30" : "text-[#00f1fe] bg-[#00f1fe]/20")}
                                >
                                    {isNarrationMuted ? 'Muted' : 'Enabled'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">Language</span>
                            <div className="flex bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                                <button
                                    onClick={() => { audioSynth.playClick(); setAppLanguage('en'); }}
                                    className={clsx("px-3 py-1 text-xs font-bold uppercase transition-colors", appLanguage === 'en' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => { audioSynth.playClick(); setAppLanguage('hi'); }}
                                    className={clsx("px-3 py-1 text-xs font-bold uppercase transition-colors", appLanguage === 'hi' ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white")}
                                >
                                    हिंदी
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-700" />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preferred Exam Focus</label>
                        <select
                            value={newPreferredMap}
                            onChange={(e) => setNewPreferredMap(e.target.value)}
                            className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-[#00f1fe]"
                        >
                            <option value="standard">None (Standard)</option>
                            <option value="neet">NEET</option>
                            <option value="jee">JEE</option>
                            <option value="upsc">UPSC</option>
                        </select>
                    </div>


                    {/* Push Notifications Section */}
                    <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700 space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bell size={16} className="text-purple-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Push Notifications</span>
                            </div>
                            <span className={clsx(
                                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                pushState === 'granted' ? "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50" :
                                pushState === 'denied' ? "bg-red-900/50 text-red-400 border border-red-700/50" :
                                pushState === 'unsupported' ? "bg-amber-900/50 text-amber-400 border border-amber-700/50" :
                                pushState === 'subscribing' ? "bg-blue-900/50 text-blue-400 border border-blue-700/50 animate-pulse" :
                                "bg-slate-700 text-slate-300"
                            )}>
                                {pushState === 'granted' ? 'Enabled' :
                                 pushState === 'denied' ? 'Blocked' :
                                 pushState === 'unsupported' ? 'Unsupported' :
                                 pushState === 'subscribing' ? 'Enabling...' : 'Disabled'}
                            </span>
                        </div>

                        {pushMessage && (
                            <p className="text-xs font-medium text-purple-300">{pushMessage}</p>
                        )}

                        {pushState === 'granted' ? (
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleTestPush}
                                    className="w-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
                                >
                                    🔔 Send Test Notification
                                </button>
                                <button
                                    onClick={handleDiagnosticPush}
                                    className="w-full bg-slate-800/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-semibold py-1.5 rounded-xl text-[11px] uppercase tracking-wider transition-all"
                                >
                                    🛠️ Run Push Hardware Test
                                </button>
                                <button
                                    onClick={handleDisablePush}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 font-semibold py-1.5 rounded-xl text-[11px] uppercase tracking-wider transition-all"
                                >
                                    Disable Notifications
                                </button>
                            </div>
                        ) : pushState === 'denied' ? (
                            <p className="text-[11px] text-slate-400 leading-snug">
                                Notifications are blocked in your browser settings. Unblock them in your browser URL bar.
                            </p>
                        ) : pushState === 'unsupported' ? (
                            <p className="text-[11px] text-slate-400 leading-snug">
                                Push notifications are not supported in this browser.
                            </p>
                        ) : (
                            <button
                                onClick={handleEnablePush}
                                disabled={pushState === 'subscribing'}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                            >
                                {pushState === 'subscribing' ? 'Enabling Notifications...' : 'Enable Notifications'}
                            </button>
                        )}
                    </div>
                    <button onClick={() => { audioSynth.playClick(); handleSave(); }} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all mt-4">
                        UPDATE TIMELINE
                    </button>

                    <hr className="border-slate-700 my-2" />

                    <button
                        onClick={() => { 
                            audioSynth.playClick(); 
                            if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
                                resetProgress(); 
                            }
                        }}
                        className="w-full bg-slate-800 hover:bg-red-900/50 text-red-400 hover:text-red-200 border border-slate-700 hover:border-red-800 font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all uppercase tracking-wider text-xs"
                    >
                        Restart Journey (Reset)
                    </button>

                    {/* Bottom row: Go Back (left) & Delete Account (bottom right) */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <button
                            onClick={() => { audioSynth.playBack(); navigate(-1); }}
                            className="text-slate-500 text-xs font-semibold hover:text-white transition-colors py-2 px-1"
                        >
                            ← Go Back
                        </button>
                        <button
                            onClick={() => { audioSynth.playClick(); setShowDeleteConfirm(true); }}
                            className="px-3.5 py-2 bg-red-950/70 hover:bg-red-900 text-red-400 hover:text-red-100 border border-red-800/70 hover:border-red-600 rounded-xl text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all transform active:scale-95"
                        >
                            <Trash2 size={13} />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2-Step Confirmation Modal for Account Deletion */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-slate-900 border border-red-900/80 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
                        <div className="w-12 h-12 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-inner">
                            <AlertTriangle size={24} />
                        </div>
                        
                        <h3 className="text-lg font-black text-white tracking-wide">Delete Your Account?</h3>
                        
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Your account will be deactivated immediately and permanently erased after <strong className="text-red-400 font-bold">30 days</strong>. All your XP, levels, traits, and story progress will be lost.
                        </p>

                        {deleteError && (
                            <div className="p-3 bg-red-950/90 border border-red-800 text-red-200 text-xs rounded-xl font-semibold">
                                ⚠️ {deleteError}
                            </div>
                        )}

                        <div className="flex flex-col gap-2.5 pt-2">
                            <button
                                disabled={isDeletingAccount}
                                onClick={handleDeleteAccount}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
                            >
                                {isDeletingAccount ? (
                                    <span>Deactivating Account…</span>
                                ) : (
                                    <>
                                        <Trash2 size={14} />
                                        <span>Confirm Account Deletion</span>
                                    </>
                                )}
                            </button>
                            <button
                                disabled={isDeletingAccount}
                                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
