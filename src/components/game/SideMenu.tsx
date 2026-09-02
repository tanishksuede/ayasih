import { Settings, BookOpen, Users, Star, Activity, User, Compass } from 'lucide-react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation();

    const navItems = [
        { icon: <Compass size={20} />, label: "Explore", action: () => navigate('/game'), active: location.pathname === '/game' },
        { icon: <Activity size={20} />, label: "DNA Data", action: onOpenDnaProfile, active: location.pathname === '/game/dna' },
        { icon: <BookOpen size={20} />, label: "Journal", action: () => navigate('/game/journal'), active: location.pathname === '/game/journal' },
        { icon: <Users size={20} />, label: "People", action: () => navigate('/game/social'), active: location.pathname === '/game/social' },
        { icon: <Settings size={20} />, label: "Settings", action: () => navigate('/game/settings'), active: location.pathname === '/game/settings' },
    ];

    if (isAdmin) {
        navItems.push({ icon: <Star size={20} />, label: "Admin", action: () => navigate('/game/admin'), active: location.pathname === '/game/admin' });
    }

    return (
        <div className="fixed z-[110] pointer-events-auto flex flex-row md:flex-col bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 md:top-1/2 md:-translate-y-1/2 items-center gap-2 p-2 bg-[#080B14] border border-white/[0.04] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {navItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        audioSynth.playClick();
                        item.action();
                    }}
                    className={clsx(
                        "group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200",
                        item.active
                            ? "bg-[#0C1220] border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_4px_12px_rgba(0,229,255,0.1),inset_0_2px_4px_rgba(0,0,0,0.5)] transform scale-95"
                            : "bg-transparent border border-transparent text-[#667085] hover:bg-[#0C1220] hover:text-[#F5F7FA] hover:border-white/[0.06] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-1 md:hover:-translate-y-0 md:hover:translate-x-1"
                    )}
                    aria-label={item.label}
                >
                    {item.icon}
                    
                    {/* Tooltip */}
                    <span className="absolute md:left-[110%] md:bottom-auto bottom-[110%] mb-2 md:mb-0 md:ml-2 px-2 py-1 bg-[#05070D] border border-white/[0.06] rounded-md text-[10px] font-bold tracking-widest uppercase text-[#A5AFBF] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl shadow-black">
                        {item.label}
                    </span>
                    
                    {item.active && (
                        <div className="absolute -bottom-1 md:-left-1 md:bottom-auto w-1 h-1 md:w-1 md:h-4 bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF]"></div>
                    )}
                </button>
            ))}

            <div className="w-[1px] h-6 md:w-6 md:h-[1px] bg-white/[0.06] my-1 mx-2 md:mx-0"></div>

            {/* Profile Avatar Button */}
            <button
                onClick={() => {
                    audioSynth.playClick();
                    navigate('/game/profile');
                }}
                className="group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/[0.1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:-translate-y-1 md:hover:-translate-y-0 md:hover:translate-x-1"
                aria-label="Profile"
            >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/[0.1] shadow-inner shadow-black/50">
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} className="w-full h-full p-2 bg-[#0C1220] text-[#667085]" />
                    )}
                </div>
                
                <span className="absolute md:left-[110%] md:bottom-auto bottom-[110%] mb-2 md:mb-0 md:ml-2 px-2 py-1 bg-[#05070D] border border-white/[0.06] rounded-md text-[10px] font-bold tracking-widest uppercase text-[#A5AFBF] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl shadow-black">
                    Profile
                </span>
            </button>
        </div>
    );
}
