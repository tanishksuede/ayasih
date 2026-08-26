import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { ArrowLeft, Edit3, Settings, Check, X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useUsernameAvailability } from '../../hooks/useUsernameAvailability';
import { UsernameField } from './UsernameField';
import clsx from 'clsx';

interface ProfileDashboardProps {
    onBack: () => void;
}

export function ProfileDashboard({ onBack }: ProfileDashboardProps) {
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const clearUserData = useUserStore((state) => state.clearUserData);
    const { isCandyMode } = useUserStore();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    
    // Edit state
    const [newAge, setNewAge] = useState(18);
    const [usernameInput, setUsernameInput] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const usernameAvailability = useUsernameAvailability(
        usernameInput,
        profile?.id ?? null
    );

    useEffect(() => {
        if (profile) {
            setNewAge(profile.age || 18);
            setUsernameInput(profile.username || '');
        }
    }, [profile, isEditing]);


    const handleSaveProfile = async () => {
        if (!profile?.id) return;
        audioSynth.playClick();
        
        const trimmed = usernameInput.trim();
        
        if (!trimmed) {
            setUsernameError('Please enter a username.');
            return;
        }

        if (usernameAvailability.status !== 'available' && trimmed !== profile.username) {
            setUsernameError(
                usernameAvailability.errorMessage ||
                'Please wait for the availability check to finish, or choose a different username.'
            );
            return;
        }

        setIsSaving(true);
        setUsernameError('');
        setUsernameSuccess('');

        try {
            // Upsert / Update user details
            const { error: updateError } = await supabase
                .from('users')
                .upsert({
                    id: profile.id,
                    name: profile.name || 'User',
                    age: newAge,
                    mobile: profile.mobile || `local_${profile.id.slice(0, 8)}`,
                    username: trimmed,
                    access_type: profile.access_type || 'open',
                    access_start_date: profile.access_start_date || new Date().toISOString().split('T')[0],
                })
                .select();

            if (updateError) {
                if (updateError.code === '23505') {
                    setUsernameError('Username is already taken. Please choose another.');
                } else {
                    setUsernameError(`Failed to save profile: ${updateError.message}`);
                }
                setIsSaving(false);
                return;
            }

            // Success 
            setProfile({ ...profile, username: trimmed, age: newAge });
            setUsernameSuccess('Profile updated successfully!');
            setTimeout(() => {
                setUsernameSuccess('');
                setIsEditing(false);
            }, 1500);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unexpected error';
            setUsernameError(`Error: ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Whether the username save button should be active
    const isUsernameChanged = usernameInput.trim() !== (profile?.username ?? '');
    const isAgeChanged = newAge !== (profile?.age ?? 18);
    const canSave = (!isUsernameChanged || usernameAvailability.status === 'available') && !isSaving;

    return (
        <div className={clsx(
            "min-h-[100dvh] font-sans pb-24 overflow-x-hidden transition-colors duration-300",
            isCandyMode 
                ? "bg-[#faf9f6] text-slate-800 selection:bg-emerald-200 selection:text-emerald-900" 
                : "bg-slate-900 text-slate-200 selection:bg-[#00f2ff]/30 selection:text-[#00f2ff]"
        )}>
            
            {/* Soft decorative background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={clsx("absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]", isCandyMode ? "bg-emerald-50/50" : "bg-[#00f2ff]/10")} />
                <div className={clsx("absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]", isCandyMode ? "bg-purple-50/50" : "bg-indigo-500/10")} />
            </div>

            {/* Fixed Floating Back Button - Pushed down to avoid PWA header */}
            <div className="fixed top-24 md:top-28 left-6 z-50">
                <button 
                    onClick={() => { audioSynth.playBack(); onBack(); }}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-3 rounded-full border shadow-md font-bold hover:scale-105 active:scale-95 transition-all backdrop-blur-md",
                        isCandyMode
                            ? "bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                    )}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Main content pushed down to avoid header and give space */}
            <main className="relative z-20 max-w-3xl mx-auto px-6 md:px-12 pt-40 pb-20">
                <div className="flex flex-col gap-6">
                    
                    {/* Profile Card */}
                    <div className={clsx(
                        "rounded-[2.5rem] p-8 shadow-sm border relative overflow-hidden flex flex-col items-center text-center backdrop-blur-sm",
                        isCandyMode
                            ? "bg-white/90 border-slate-100"
                            : "bg-slate-800/80 border-slate-700/80 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                    )}>
                        {/* Cute background accent */}
                        <div className={clsx(
                            "absolute top-0 left-0 w-full h-32",
                            isCandyMode 
                                ? "bg-gradient-to-b from-emerald-50 to-white/0" 
                                : "bg-gradient-to-b from-[#00f2ff]/10 to-transparent"
                        )} />
                        
                        <div className="relative w-32 h-32 mb-6">
                            <div className={clsx("absolute inset-0 rounded-full shadow-md", isCandyMode ? "bg-white" : "bg-slate-700")} />
                            <div className={clsx("absolute inset-2 rounded-full overflow-hidden flex items-center justify-center", isCandyMode ? "bg-emerald-100" : "bg-slate-800 border border-slate-600")}>
                                <DotLottieReact
                                    src="/assets/Macot/waving mascot.lottie"
                                    loop
                                    autoplay
                                    style={{ width: '150%', height: '150%', marginTop: '10%' }}
                                />
                            </div>
                        </div>

                        {!isEditing ? (
                            <>
                                <h1 className={clsx("text-2xl font-black tracking-tight relative z-10", isCandyMode ? "text-slate-800" : "text-white")}>
                                    {profile?.name || 'Explorer'}
                                </h1>
                                <p className={clsx("font-bold text-sm mb-4 relative z-10", isCandyMode ? "text-emerald-500" : "text-[#00f2ff]")}>
                                    @{profile?.username || `explorer_${Math.floor(Math.random()*1000)}`} • {profile?.age || 18} y/o
                                </p>
                                
                                {profile?.mobile && (
                                    <p className={clsx("font-medium text-sm mb-6 relative z-10", isCandyMode ? "text-slate-500" : "text-slate-400")}>
                                        {profile.mobile}
                                    </p>
                                )}

                                <div className="w-full flex flex-col gap-3 mt-4">
                                    <button 
                                        onClick={() => { audioSynth.playClick(); setIsEditing(true); }}
                                        className={clsx(
                                            "w-full flex items-center justify-center gap-3 py-4 font-bold rounded-2xl transition-colors",
                                            isCandyMode
                                                ? "bg-slate-50 hover:bg-slate-100 text-slate-700"
                                                : "bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50"
                                        )}
                                    >
                                        <Edit3 className={clsx("w-5 h-5", isCandyMode ? "text-slate-400" : "text-slate-400")} />
                                        Edit Profile
                                    </button>
                                    
                                    <button 
                                        onClick={() => { audioSynth.playClick(); navigate('/game/settings'); }}
                                        className={clsx(
                                            "w-full flex items-center justify-center gap-3 py-4 font-bold rounded-2xl transition-colors",
                                            isCandyMode
                                                ? "bg-slate-50 hover:bg-slate-100 text-slate-700"
                                                : "bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50"
                                        )}
                                    >
                                        <Settings className={clsx("w-5 h-5", isCandyMode ? "text-slate-400" : "text-slate-400")} />
                                        App Settings
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-start text-left relative z-10 gap-4 mt-2">
                                <h2 className={clsx("text-lg font-black w-full text-center mb-2", isCandyMode ? "text-slate-800" : "text-white")}>Edit Details</h2>
                                
                                <div className="w-full">
                                    <label className={clsx("block text-xs font-bold uppercase tracking-wider mb-2 ml-1", isCandyMode ? "text-slate-500" : "text-slate-400")}>Username</label>
                                    <UsernameField
                                        label=""
                                        value={usernameInput}
                                        onChange={setUsernameInput}
                                        status={isUsernameChanged ? usernameAvailability.status : 'idle'}
                                        errorMessage={isUsernameChanged ? usernameAvailability.errorMessage : null}
                                        disabled={isSaving}
                                    />
                                    {usernameError && (
                                        <p className="text-xs text-rose-500 font-bold mt-2 ml-1">{usernameError}</p>
                                    )}
                                    {usernameSuccess && (
                                        <p className={clsx("text-xs font-bold mt-2 ml-1", isCandyMode ? "text-emerald-500" : "text-[#00f2ff]")}>{usernameSuccess}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className={clsx("block text-xs font-bold uppercase tracking-wider mb-2 ml-1", isCandyMode ? "text-slate-500" : "text-slate-400")}>Age</label>
                                    <input
                                        type="number"
                                        value={newAge}
                                        onChange={(e) => setNewAge(parseInt(e.target.value))}
                                        disabled={isSaving}
                                        className={clsx(
                                            "w-full font-bold rounded-2xl px-5 py-4 border focus:outline-none transition-all",
                                            isCandyMode
                                                ? "bg-slate-50 text-slate-800 border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                                                : "bg-slate-900 text-white border-slate-700 focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/20"
                                        )}
                                    />
                                </div>

                                <div className="w-full flex gap-3 mt-4">
                                    <button 
                                        onClick={() => { audioSynth.playClick(); setIsEditing(false); }}
                                        disabled={isSaving}
                                        className={clsx(
                                            "flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-colors disabled:opacity-50",
                                            isCandyMode
                                                ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                                : "bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600"
                                        )}
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                    
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={!canSave || (!isUsernameChanged && !isAgeChanged)}
                                        className={clsx(
                                            "flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-colors shadow-md disabled:opacity-50 disabled:text-slate-500",
                                            isCandyMode
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-300"
                                                : "bg-[#00f2ff] hover:bg-[#00d2ff] text-slate-900 disabled:bg-slate-700"
                                        )}
                                    >
                                        <Check className="w-5 h-5" />
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
