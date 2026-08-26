import { useState } from 'react';
import { Menu, X, Settings, BookOpen, Users, Star, Activity, User } from 'lucide-react';
import clsx from 'clsx';
import { addToWishlist, logUnmatchedSearch } from '../../utils/feedbackUtils';
import { useUserStore } from '../../store/userStore';

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
    const { isCandyMode, setShowSubscriptionModal } = useUserStore();

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
        <div className="absolute top-20 right-4 md:top-24 md:right-6 z-[110] flex flex-col items-end pointer-events-none">
            {/* Hamburger Button */}
            <button
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
                {/* User Profile Identity Banner */}
                {profile && (
                    <div className={clsx(
                        "flex flex-col items-start px-3 py-2 rounded-xl border backdrop-blur-md",
                        isCandyMode
                            ? "bg-pink-50/80 border-pink-200"
                            : "bg-slate-800/50 border-[#00f2ff]/30 shadow-[0_0_10px_rgba(0,242,255,0.15)]"
                    )}>
                        <span className={clsx(
                            "font-extrabold text-xs uppercase tracking-wider",
                            isCandyMode ? "text-slate-800" : "text-white"
                        )}>
                            {profile.name || 'GUEST'}
                        </span>
                        {profile.username && (
                            <span className="text-[11px] font-bold text-[#00f2ff] tracking-widest">
                                @{profile.username}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-4 mt-2">
                    {/* Journal */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            navigate('/game/journal');
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all border shadow-md",
                            isCandyMode
                                ? "bg-pink-50 border-pink-200 hover:border-pink-400"
                                : "bg-slate-800/80 border-amber-600/30 hover:border-amber-400/80"
                        )}
                    >
                        <div className={clsx(
                            "p-2 rounded-xl text-white shadow-inner",
                            isCandyMode ? "bg-pink-500" : "bg-gradient-to-br from-amber-400 to-amber-600"
                        )}>
                            <BookOpen size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isCandyMode ? "text-pink-400" : "text-amber-500/80")}>My Wisdom</span>
                            <span className={clsx("text-base font-black uppercase tracking-wide", isCandyMode ? "text-pink-600" : "text-amber-400")}>Journal</span>
                        </div>
                    </button>

                    {/* DNA Data */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            onOpenDnaProfile();
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all border shadow-md",
                            isCandyMode
                                ? "bg-purple-50 border-purple-200 hover:border-purple-400"
                                : "bg-slate-800/80 border-[#00f2ff]/30 hover:border-[#00f2ff]/70"
                        )}
                    >
                        <div className={clsx(
                            "p-2 rounded-xl text-white shadow-inner flex items-center justify-center",
                            isCandyMode ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"
                        )}>
                            <Activity size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isCandyMode ? "text-emerald-600" : "text-emerald-400")}>My Stats</span>
                            <span className={clsx("text-base font-black uppercase tracking-wide", isCandyMode ? "text-emerald-700" : "text-[#99f7ff]")}>DNA Data</span>
                        </div>
                    </button>

                    {/* Upgrade to Pro */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            setShowSubscriptionModal(true);
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex items-center gap-4 p-3 rounded-2xl transition-all border shadow-[0_0_15px_rgba(234,179,8,0.3)]",
                            isCandyMode
                                ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200 hover:border-amber-400"
                                : "bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border-amber-500/50 hover:border-amber-400/80"
                        )}
                    >
                        <div className={clsx(
                            "p-2 rounded-xl text-black shadow-inner flex items-center justify-center",
                            "bg-gradient-to-r from-yellow-400 to-amber-500"
                        )}>
                            <Star size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isCandyMode ? "text-amber-600" : "text-amber-400/80")}>Unlock More</span>
                            <span className={clsx("text-base font-black uppercase tracking-wide", isCandyMode ? "text-amber-700" : "text-amber-400")}>Upgrade to Pro</span>
                        </div>
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Profile */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            navigate('/game/profile');
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border shadow-sm w-full",
                            isCandyMode
                                ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                : "bg-slate-800/60 border-[#d575ff]/30 hover:bg-slate-700/80 hover:border-[#d575ff]/50 text-[#d575ff]"
                        )}
                    >
                        <User size={24} className="opacity-90 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-90">Profile</span>
                    </button>

                    {/* People / Social */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            navigate('/game/social');
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border shadow-sm w-full",
                            isCandyMode
                                ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                : "bg-slate-800/60 border-[#00f2ff]/30 hover:bg-slate-700/80 hover:border-[#00f2ff]/50 text-[#00f2ff]"
                        )}
                    >
                        <Users size={24} className="opacity-90 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-90">People</span>
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            navigate('/game/settings');
                            setIsOpen(false);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border shadow-sm w-full",
                            isCandyMode
                                ? "bg-white/60 border-slate-200 hover:bg-white text-slate-700"
                                : "bg-slate-800/60 border-slate-700 hover:bg-slate-700/80 text-indigo-200"
                        )}
                    >
                        <Settings size={24} className="opacity-90 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-90">Settings</span>
                    </button>

                    {/* Admin */}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                audioSynth.playClick();
                                navigate('/game/admin');
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border shadow-sm w-full",
                                isCandyMode
                                    ? "bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-700"
                                    : "bg-fuchsia-900/30 border-fuchsia-500/30 hover:bg-fuchsia-900/60 text-fuchsia-300"
                            )}
                        >
                            <span className="text-2xl mb-1">👑</span>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-90">Admin</span>
                        </button>
                    )}
                </div>

                <div className="flex-grow" />

                {/* Personality Wishlist Section */}
                <div className={clsx(
                    "w-full p-4 mt-auto mb-4 rounded-2xl border shadow-sm",
                    isCandyMode ? "bg-white/60 border-slate-200" : "bg-slate-800/60 border-slate-700"
                )}>
                    <div className="flex items-center gap-2 mb-2">
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
