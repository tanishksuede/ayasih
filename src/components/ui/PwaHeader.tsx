import { type FC } from 'react';
import { useUserStore } from '../../store/userStore';
import { calculateLevelInfo } from '../../utils/levelSystem';
import clsx from 'clsx';
import './PwaHeader.css';

export const PwaHeader: FC = () => {
    const profile = useUserStore((state) => state.profile);

    if (!profile) return null;

    const levelInfo = calculateLevelInfo(profile.total_xp || 0);

    return (
        <header className={clsx(
            "w-full h-[64px] max-h-[64px] shrink-0 sticky top-0 z-[110] flex items-center justify-between px-4 sm:px-6 md:px-8 transition-all duration-300",
            "bg-[#05070D] border-b border-[#111827] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.8)]"
        )}>
            {/* Logo & Search Section */}
            <div className="flex items-center flex-1 min-w-0">
                <h1 className={clsx(
                    "font-bold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2",
                    "text-[#F5F7FA]"
                )}>
                    <span className="hidden sm:inline text-xl tracking-tight">At Your Age</span>
                    <span className="sm:hidden text-xl tracking-tight font-extrabold">AYA</span>
                </h1>
                {/* SearchBar Portal Target */}
                <div id="header-search-portal" className="ml-2 sm:ml-6 flex-1 max-w-[120px] sm:max-w-[220px] min-w-[100px]" />
            </div>

            {/* Stats Section */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-4 overflow-hidden pr-1">
                <div className={clsx(
                    "flex items-center gap-2 sm:gap-3 truncate",
                    "text-[#A5AFBF]"
                )}>
                    <div className="flex flex-col items-end truncate min-w-0 leading-tight">
                        <span className="font-semibold tracking-wide text-[11px] sm:text-[13px] truncate max-w-[65px] sm:max-w-[120px] text-[#F5F7FA]">
                            {profile.name || "GUEST"}
                        </span>
                        {profile.username && (
                            <span className="text-[10px] sm:text-[11px] font-medium text-[#667085] tracking-wide truncate max-w-[65px] sm:max-w-[120px]">
                                @{profile.username}
                            </span>
                        )}
                    </div>
                    
                    <div className="h-6 w-[1px] bg-[#111827] mx-1 sm:mx-2" />

                    <div className="flex items-center gap-2 bg-[#0C1220] border border-[#111827] rounded-lg px-2 sm:px-3 py-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                        <span className={clsx(
                            "text-[10px] sm:text-[11px] font-bold uppercase tracking-widest truncate max-w-[90px] sm:max-w-[150px]",
                            "text-[#F5F7FA]"
                        )}>
                            Lvl {profile.level || 1} <span className="hidden sm:inline text-[#667085] ml-1">{levelInfo.title}</span>
                        </span>
                    </div>
                </div>
                
                {/* Optional Safe Area Padding for mobile notches if run in 'standalone' mode later */}
                <style>{`
                     @supports (padding-top: env(safe-area-inset-top)) {
                         header { padding-top: env(safe-area-inset-top); height: calc(64px + env(safe-area-inset-top)); }
                     }
                `}</style>
            </div>
        </header>
    );
};
