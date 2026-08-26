import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { ArrowLeft, Edit3, Settings, LogOut, Check, X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { useUsernameAvailability } from '../../hooks/useUsernameAvailability';
import { UsernameField } from './UsernameField';

interface ProfileDashboardProps {
    onBack: () => void;
}

export function ProfileDashboard({ onBack }: ProfileDashboardProps) {
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const clearUserData = useUserStore((state) => state.clearUserData);
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

    const handleLogout = () => {
        audioSynth.playClick();
        clearUserData();
        navigate('/'); // Assuming root maps to onboarding/login
    };

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
        <div className="min-h-screen bg-[#faf9f6] font-sans text-slate-800 pb-24 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
            
            {/* Soft decorative background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lavender-50/50 blur-[100px] bg-purple-50/50" />
            </div>

            {/* Header / Navigation */}
            <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 max-w-3xl mx-auto">
                <button 
                    onClick={() => { audioSynth.playBack(); onBack(); }}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    My Profile
                </div>
                <div className="w-12 h-12" /> {/* Balancer */}
            </header>

            <main className="relative z-20 max-w-3xl mx-auto px-6 md:px-12 pb-20">
                <div className="flex flex-col gap-6">
                    
                    {/* Profile Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center text-center">
                        {/* Cute background accent */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-white" />
                        
                        <div className="relative w-32 h-32 mb-6">
                            <div className="absolute inset-0 bg-white rounded-full shadow-md" />
                            <div className="absolute inset-2 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center">
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
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight relative z-10">
                                    {profile?.name || 'Explorer'}
                                </h1>
                                <p className="text-emerald-500 font-bold text-sm mb-4 relative z-10">
                                    @{profile?.username || `explorer_${Math.floor(Math.random()*1000)}`} • {profile?.age || 18} y/o
                                </p>
                                
                                {profile?.mobile && (
                                    <p className="text-slate-500 font-medium text-sm mb-6 relative z-10">
                                        {profile.mobile}
                                    </p>
                                )}

                                <div className="w-full flex flex-col gap-3 mt-4">
                                    <button 
                                        onClick={() => { audioSynth.playClick(); setIsEditing(true); }}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5 text-slate-400" />
                                        Edit Profile
                                    </button>
                                    
                                    <button 
                                        onClick={() => { audioSynth.playClick(); navigate('/game/settings'); }}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl transition-colors"
                                    >
                                        <Settings className="w-5 h-5 text-slate-400" />
                                        App Settings
                                    </button>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 text-rose-500" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col items-start text-left relative z-10 gap-4 mt-2">
                                <h2 className="text-lg font-black text-slate-800 w-full text-center mb-2">Edit Details</h2>
                                
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username</label>
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
                                        <p className="text-xs text-emerald-500 font-bold mt-2 ml-1">{usernameSuccess}</p>
                                    )}
                                </div>

                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Age</label>
                                    <input
                                        type="number"
                                        value={newAge}
                                        onChange={(e) => setNewAge(parseInt(e.target.value))}
                                        disabled={isSaving}
                                        className="w-full bg-slate-50 text-slate-800 font-bold rounded-2xl px-5 py-4 border border-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all"
                                    />
                                </div>

                                <div className="w-full flex gap-3 mt-4">
                                    <button 
                                        onClick={() => { audioSynth.playClick(); setIsEditing(false); }}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                    
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={!canSave || (!isUsernameChanged && !isAgeChanged)}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors shadow-md disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500"
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
