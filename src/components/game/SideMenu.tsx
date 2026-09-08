import { useState, useEffect } from 'react';
import { Menu, X, Settings, BookOpen, Users, Star, Activity, User, HelpCircle, Volume2, VolumeX, Music } from 'lucide-react';
import clsx from 'clsx';
import { addToWishlist, logUnmatchedSearch } from '../../utils/feedbackUtils';
import { useUserStore } from '../../store/userStore';
import { calculateLevelInfo } from '../../utils/levelSystem';

interface SideMenuProps {
    isCandyMode: boolean;
    isAdmin: boolean;
    profile: any;
    audioSynth: any;
    navigate: (path: string) => void;
    onOpenDnaProfile: () => void;
}

export function SideMenu({
    isAdmin,
    profile,
    audioSynth,
    navigate,
    onOpenDnaProfile
}: SideMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [wishlistInput, setWishlistInput] = useState('');
    const [wishlistStatus, setWishlistStatus] = useState<'idle' | 'loading' | 'added'>('idle');
    const [hoveredAudio, setHoveredAudio] = useState<'music' | 'sfx' | null>(null);
    const [expandedMobileAudio, setExpandedMobileAudio] = useState<'music' | 'sfx' | null>(null);

    const {
        isCandyMode,
        musicVolume,
        sfxVolume,
        isMusicMuted,
        isSfxMuted,
        setMusicVolume,
        setSfxVolume,
        toggleMusicMute,
        toggleSfxMute
    } = useUserStore();

    useEffect(() => {
        const handleEvent = (e: any) => {
            if (e.detail?.open) setIsOpen(true);
            else setIsOpen(false);
        };
        window.addEventListener('tutorial-menu-toggle', handleEvent);
        return () => window.removeEventListener('tutorial-menu-toggle', handleEvent);
    }, []);

    const handleWishlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishlistInput.trim()) return;
        setWishlistStatus('loading');
        try {
            const userId = profile?.id || '';
            await logUnmatchedSearch(userId, wishlistInput);
            const res = await addToWishlist(userId, wishlistInput);
            
            if (!res.success) {
                alert(`Failed to save wishlist. Database Error: ${res.error}`);
                setWishlistStatus('idle');
                return;
            }

            setWishlistStatus('added');
            setTimeout(() => {
                setWishlistStatus('idle');
                setWishlistInput('');
            }, 3000);
        } catch (err) {
            console.error(err);
            setWishlistStatus('idle');
        }
    };

    const toggleMenu = () => {
        audioSynth.playClick();
        setIsOpen(!isOpen);
    };

    return (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] flex flex-col items-end pointer-events-none">
            {/* Hamburger Button */}
            <button
                data-tutorial="menu-toggle"
                onClick={toggleMenu}
                className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg pointer-events-auto",
                    isCandyMode
                        ? "bg-amber-400 text-slate-900 border-2 border-amber-300 hover:scale-105 active:scale-95"
                        : "bg-slate-800 text-[#00f2ff] border-2 border-[#00f2ff]/30 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95"
                )}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Floating Audio Controls beneath Hamburger Menu */}
            {!isOpen && (
                <div className="mt-3 flex flex-col items-end gap-2.5 pointer-events-none">
                    {/* Background Music (BGM) Control */}
                    <div
                        onMouseEnter={() => setHoveredAudio('music')}
                        onMouseLeave={() => setHoveredAudio(null)}
                        className="flex items-center gap-2 pointer-events-auto"
                    >
                        {/* Expandable Volume Slider (expands to the left) */}
                        <div
                            className={clsx(
                                "transition-all duration-300 ease-in-out flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md",
                                isCandyMode
                                    ? "bg-white/95 border-pink-300 text-slate-800"
                                    : "bg-slate-900/90 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]",
                                hoveredAudio === 'music' || expandedMobileAudio === 'music'
                                    ? "w-36 opacity-100 scale-100"
                                    : "w-0 opacity-0 scale-90 px-0 pointer-events-none border-none overflow-hidden"
                            )}
                        >
                            <span className="text-[10px] font-black shrink-0">
                                {isMusicMuted ? '0%' : `${Math.round(musicVolume * 100)}%`}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMusicMuted ? 0 : musicVolume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setMusicVolume(val);
                                    if (isMusicMuted && val > 0) toggleMusicMute();
                                }}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                            />
                        </div>

                        {/* Round Floating Button */}
                        <button
                            type="button"
                            onClick={() => {
                                audioSynth.playClick();
                                toggleMusicMute();
                            }}
                            onTouchStart={() => {
                                setExpandedMobileAudio((prev) => (prev === 'music' ? null : 'music'));
                            }}
                            className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg active:scale-95",
                                isCandyMode
                                    ? isMusicMuted
                                        ? "bg-slate-200 text-slate-500 border-slate-300"
                                        : "bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-200"
                                    : isMusicMuted
                                    ? "bg-slate-900/90 text-red-400 border-red-800/60"
                                    : "bg-slate-900/90 text-purple-300 border-purple-500/40 hover:border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:scale-105"
                            )}
                            title={isMusicMuted ? "Unmute Music" : "Mute Music"}
                            aria-label="Toggle Music"
                        >
                            {isMusicMuted ? <VolumeX size={16} /> : <Music size={16} />}
                        </button>
                    </div>

                    {/* Sound Effects (SFX) Control */}
                    <div
                        onMouseEnter={() => setHoveredAudio('sfx')}
                        onMouseLeave={() => setHoveredAudio(null)}
                        className="flex items-center gap-2 pointer-events-auto"
                    >
                        {/* Expandable Volume Slider (expands to the left) */}
                        <div
                            className={clsx(
                                "transition-all duration-300 ease-in-out flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md",
                                isCandyMode
                                    ? "bg-white/95 border-cyan-300 text-slate-800"
                                    : "bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,255,0.25)]",
                                hoveredAudio === 'sfx' || expandedMobileAudio === 'sfx'
                                    ? "w-36 opacity-100 scale-100"
                                    : "w-0 opacity-0 scale-90 px-0 pointer-events-none border-none overflow-hidden"
                            )}
                        >
                            <span className="text-[10px] font-black shrink-0">
                                {isSfxMuted ? '0%' : `${Math.round(sfxVolume * 100)}%`}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isSfxMuted ? 0 : sfxVolume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setSfxVolume(val);
                                    if (isSfxMuted && val > 0) toggleSfxMute();
                                }}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                        </div>

                        {/* Round Floating Button */}
                        <button
                            type="button"
                            onClick={() => {
                                audioSynth.playClick();
                                toggleSfxMute();
                            }}
                            onTouchStart={() => {
                                setExpandedMobileAudio((prev) => (prev === 'sfx' ? null : 'sfx'));
                            }}
                            className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg active:scale-95",
                                isCandyMode
                                    ? isSfxMuted
                                        ? "bg-slate-200 text-slate-500 border-slate-300"
                                        : "bg-cyan-100 text-cyan-600 border-cyan-300 hover:bg-cyan-200"
                                    : isSfxMuted
                                    ? "bg-slate-900/90 text-red-400 border-red-800/60"
                                    : "bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,242,255,0.3)] hover:scale-105"
                            )}
                            title={isSfxMuted ? "Unmute Sound" : "Mute Sound"}
                            aria-label="Toggle Sound"
                        >
                            {isSfxMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] pointer-events-auto transition-opacity" 
                    onClick={toggleMenu}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-[100dvh] w-72 sm:w-80 transition-transform duration-300 ease-in-out pointer-events-auto flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[110]",
                    isOpen ? "translate-x-0" : "translate-x-full",
                    isCandyMode 
                        ? "bg-white/95 backdrop-blur-xl border-l border-white/40 text-slate-800"
                        : "bg-slate-900/95 backdrop-blur-xl border-l border-[#00f2ff]/20 text-white"
                )}
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center px-6 pt-8 pb-4 shrink-0">
                    <span className={clsx(
                        "text-lg font-black uppercase tracking-widest",
                        isCandyMode ? "text-pink-500" : "text-[#00f2ff]"
                    )}>Menu</span>
                    <button 
                        onClick={toggleMenu}
                        className={clsx(
                            "p-2 rounded-full transition-all",
                            isCandyMode ? "hover:bg-pink-100 text-pink-600" : "hover:bg-slate-800 text-slate-300 hover:text-white"
                        )}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] px-6 pb-8 flex flex-col gap-6">
                {/* User Profile Identity Banner (Clickable) */}
                {profile && (() => {
                    const levelInfo = calculateLevelInfo(profile.total_xp || 0);
                    return (
                        <button 
                            onClick={() => {
                                audioSynth.playClick();
                                navigate('/game/profile');
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all text-left",
                                isCandyMode
                                    ? "bg-white/80 border-pink-200 hover:border-pink-400 hover:bg-pink-50"
                                    : "bg-slate-800/80 border-[#00f2ff]/30 hover:border-[#00f2ff] hover:shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                            )}
                        >
                            <div className={clsx(
                                "w-12 h-12 rounded-full overflow-hidden border-2 flex shrink-0 items-center justify-center bg-slate-900",
                                isCandyMode ? "border-pink-400" : "border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                            )}>
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className={isCandyMode ? "text-pink-400" : "text-[#00f2ff]"} />
                                )}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className={clsx(
                                    "font-black text-sm uppercase tracking-wider truncate",
                                    isCandyMode ? "text-slate-800" : "text-white"
                                )}>
                                    {profile.name || 'GUEST'}
                                </span>
                                <span className={clsx(
                                    "text-[10px] font-bold tracking-widest uppercase truncate",
                                    isCandyMode ? "text-pink-500" : "text-[#00f2ff]"
                                )}>
                                    Level {profile.level || 1} • {levelInfo.title}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={clsx("text-[10px] uppercase font-bold tracking-widest", isCandyMode ? "text-slate-400" : "text-slate-400")}>XP</span>
                                <span className={clsx("text-xs font-black", isCandyMode ? "text-amber-500" : "text-[#00f2ff]")}>{profile.total_xp || 0}</span>
                            </div>
                        </button>
                    );
                })()}

                {/* USER HUB */}
                <div className="flex flex-col gap-3">
                    <span className={clsx("text-[10px] font-black uppercase tracking-widest ml-2", isCandyMode ? "text-slate-400" : "text-slate-500")}>User Hub</span>
                    
                    {/* Journal */}
                    <button
                        data-tutorial="journal"
                        onClick={() => {
                            audioSynth.playClick();
                            navigate('/game/journal');
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all border shadow-sm",
                            isCandyMode
                                ? "bg-white/60 border-slate-200 hover:border-pink-300"
                                : "bg-slate-800/40 border-slate-700 hover:border-amber-400/50"
                        )}
                    >
                        <div className={clsx(
                            "p-2 rounded-xl text-white shadow-inner",
                            isCandyMode ? "bg-pink-400" : "bg-gradient-to-br from-amber-400 to-amber-600"
                        )}>
                            <BookOpen size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isCandyMode ? "text-pink-400" : "text-amber-500/80")}>My Wisdom</span>
                            <span className={clsx("text-base font-black uppercase tracking-wide", isCandyMode ? "text-slate-700" : "text-slate-200")}>Journal</span>
                        </div>
                    </button>

                    {/* DNA Data */}
                    <button
                        data-tutorial="dna"
                        onClick={() => {
                            audioSynth.playClick();
                            onOpenDnaProfile();
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all border shadow-sm",
                            isCandyMode
                                ? "bg-white/60 border-slate-200 hover:border-emerald-300"
                                : "bg-slate-800/40 border-slate-700 hover:border-[#00f2ff]/50"
                        )}
                    >
                        <div className={clsx(
                            "p-2 rounded-xl text-white shadow-inner flex items-center justify-center",
                            isCandyMode ? "bg-emerald-400" : "bg-gradient-to-r from-emerald-400 to-teal-500"
                        )}>
                            <Activity size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isCandyMode ? "text-emerald-500" : "text-emerald-400")}>My Stats</span>
                            <span className={clsx("text-base font-black uppercase tracking-wide", isCandyMode ? "text-slate-700" : "text-slate-200")}>DNA Data</span>
                        </div>
                    </button>
                </div>



                {/* APP CONTROLS */}
                <div className="flex flex-col gap-3">
                    <span className={clsx("text-[10px] font-black uppercase tracking-widest ml-2 mt-2", isCandyMode ? "text-slate-400" : "text-slate-500")}>App Controls</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => {
                                audioSynth.playClick();
                                navigate('/game/settings');
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border shadow-sm w-full",
                                isCandyMode
                                    ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                    : "bg-slate-800/40 border-slate-700 hover:bg-slate-700/80 text-slate-300 hover:border-slate-500"
                            )}
                        >
                            <Settings size={20} className="opacity-90 mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-90">Settings</span>
                        </button>

                        <button
                            onClick={() => {
                                audioSynth.playClick();
                                navigate('/game/social');
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border shadow-sm w-full",
                                isCandyMode
                                    ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                    : "bg-slate-800/40 border-[#00f2ff]/20 hover:bg-slate-700/80 hover:border-[#00f2ff]/50 text-[#00f2ff]"
                            )}
                        >
                            <Users size={20} className="opacity-90 mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-90">People</span>
                        </button>

                        {isAdmin ? (
                            <button
                                onClick={() => {
                                    audioSynth.playClick();
                                    navigate('/game/admin');
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border shadow-sm w-full",
                                    isCandyMode
                                        ? "bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-700"
                                        : "bg-fuchsia-900/30 border-fuchsia-500/30 hover:bg-fuchsia-900/60 text-fuchsia-300"
                                )}
                            >
                                <span className="text-xl mb-1">👑</span>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-90">Admin</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    audioSynth.playClick();
                                    setIsOpen(false);
                                    setTimeout(() => window.dispatchEvent(new CustomEvent('tutorial-start')), 300);
                                }}
                                className={clsx(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border shadow-sm w-full",
                                    isCandyMode
                                        ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                        : "bg-slate-800/40 border-slate-700 hover:bg-slate-700/80 text-slate-300"
                                )}
                            >
                                <HelpCircle size={20} className="opacity-90 mb-1" />
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-90 text-center">Tutorial</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-grow" />

                {/* COMMUNITY */}
                <div className="flex flex-col gap-3">
                    <span className={clsx("text-[10px] font-black uppercase tracking-widest ml-2 mt-2", isCandyMode ? "text-slate-400" : "text-slate-500")}>Community</span>
                    <div data-tutorial="wishlist" className={clsx(
                        "w-full p-4 rounded-2xl border shadow-sm",
                        isCandyMode ? "bg-white/60 border-slate-200" : "bg-slate-800/40 border-slate-700"
                    )}>
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={16} className={isCandyMode ? "text-amber-500" : "text-amber-400"} />
                            <span className={clsx("text-xs font-bold uppercase tracking-wider", isCandyMode ? "text-slate-700" : "text-slate-300")}>
                                Wishlist a Personality
                            </span>
                        </div>
                    {wishlistStatus === 'added' ? (
                        <div className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 p-2 rounded-xl text-center">
                            ✓ Added to wishlist!
                        </div>
                    ) : (
                        <form onSubmit={handleWishlistSubmit} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="E.g., Leonardo da Vinci"
                                value={wishlistInput}
                                onChange={(e) => setWishlistInput(e.target.value)}
                                disabled={wishlistStatus === 'loading'}
                                className={clsx(
                                    "flex-grow px-3 py-2 rounded-xl text-sm border outline-none transition-all",
                                    isCandyMode 
                                        ? "bg-slate-50 border-slate-200 focus:border-amber-400 text-slate-800" 
                                        : "bg-slate-900 border-slate-700 focus:border-amber-500 text-white placeholder-slate-500"
                                )}
                            />
                            <button
                                type="submit"
                                disabled={!wishlistInput.trim() || wishlistStatus === 'loading'}
                                className={clsx(
                                    "px-3 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50",
                                    isCandyMode
                                        ? "bg-amber-400 text-amber-900 hover:bg-amber-300"
                                        : "bg-amber-500 text-amber-950 hover:bg-amber-400"
                                )}
                            >
                                {wishlistStatus === 'loading' ? '...' : 'Add'}
                            </button>
                        </form>
                    )}
                    </div>
                </div>

                {/* Dedicated Close Button */}
                <button
                    onClick={toggleMenu}
                    className={clsx(
                        "w-full flex items-center justify-center gap-2 p-4 mt-auto mb-8 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95",
                        isCandyMode
                            ? "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-500/30"
                            : "bg-gradient-to-r from-red-600 to-rose-700 text-white hover:brightness-110 shadow-red-900/50"
                    )}
                >
                    <X size={20} strokeWidth={3} />
                    Close Menu
                </button>
                </div>
            </div>
        </div>
    );
}
