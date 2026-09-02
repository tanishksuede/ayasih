import { type FC } from 'react';
import { useUserStore } from '../../store/userStore';
import { calculateLevelInfo } from '../../utils/levelSystem';

import './PwaHeader.css';

export const PwaHeader: FC = () => {
    const profile = useUserStore((state) => state.profile);

    if (!profile) return null;

    const levelInfo = calculateLevelInfo(profile.total_xp || 0);

    return (
        <header className="w-full h-[64px] max-h-[64px] shrink-0 sticky top-0 z-[110] flex items-center justify-between px-6 bg-[#05070D] border-b border-white/[0.04] shadow-sm">
            {/* Logo & Search Section */}
            <div className="flex items-center flex-1 min-w-0">
                <h1 className="font-bold tracking-tight whitespace-nowrap shrink-0 text-[#F5F7FA] mr-8">
                    <span className="hidden sm:inline text-lg">AT YOUR AGE</span>
                    <span className="sm:hidden text-lg">AYA</span>
                </h1>
                {/* SearchBar Portal Target */}
                <div id="header-search-portal" className="flex-1 max-w-[280px] min-w-[120px]" />
            </div>

            {/* Stats Section */}
            <div className="flex items-center justify-end gap-5 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end min-w-0 leading-tight">
                        <span className="font-semibold tracking-wide text-xs text-[#F5F7FA] truncate max-w-[120px]">
                            {profile.name || "GUEST"}
                        </span>
                        {profile.username && (
                            <span className="text-[10px] font-medium text-[#A5AFBF] tracking-wide truncate max-w-[120px]">
                                @{profile.username}
                            </span>
                        )}
                    </div>
                    
                    <div className="w-[1px] h-6 bg-white/[0.06] mx-1"></div>
                    
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] font-medium tracking-wide text-[#667085]">LEVEL {profile.level || 1}</span>
                        <span className="text-xs font-semibold tracking-wide text-[#00E5FF] truncate max-w-[120px]">
                            {levelInfo.title}
                        </span>
                    </div>

                    <div className="w-[1px] h-6 bg-white/[0.06] mx-1"></div>

                    <div className="flex items-center gap-1.5 font-semibold">
                        <span className="text-[10px] tracking-wide text-[#667085]">XP</span>
                        <span className="text-xs text-[#FFC400]">
                            {profile.total_xp || 0}
                        </span>
                    </div>
                    
                    {profile.avatarUrl && (
                        <div className="ml-2 w-8 h-8 rounded-full overflow-hidden border border-white/[0.1] shadow-inner shadow-black/50">
                            <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Optional Safe Area Padding for mobile notches if run in 'standalone' mode later */}
            <style>{`
                 @supports (padding-top: env(safe-area-inset-top)) {
                     header { padding-top: env(safe-area-inset-top); height: calc(64px + env(safe-area-inset-top)); }
                 }
            `}</style>
        </header>
    );
};
