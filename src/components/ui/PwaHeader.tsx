import { type FC } from 'react';
import { useUserStore } from '../../store/userStore';
import clsx from 'clsx';
import './PwaHeader.css';

export const PwaHeader: FC = () => {
    const profile = useUserStore((state) => state.profile);

    if (!profile) return null;

    const displayName = profile.name || profile.username || "GUEST";

    return (
        <header className={clsx(
            "w-full h-[60px] sm:h-[64px] max-h-[64px] shrink-0 sticky top-0 z-[110] flex items-center justify-between px-3 sm:px-6 md:px-8 transition-all duration-300",
            "bg-[#05070D] border-b border-[#111827] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.8)]"
        )}>
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
                <h1 className="font-bold tracking-tight whitespace-nowrap flex items-center gap-2 text-[#F5F7FA]">
                    <span className="hidden sm:inline text-xl tracking-tight">At Your Age</span>
                    <span className="sm:hidden text-xl tracking-tight font-extrabold">AYA</span>
                </h1>
            </div>

            {/* Center: SearchBar Portal Target */}
            <div id="header-search-portal" className="mx-2 sm:mx-4 flex-1 max-w-[160px] sm:max-w-[260px] min-w-0 flex items-center justify-center" />

            {/* Right: Profile Name Section */}
            <div data-tutorial="header-profile" className="flex items-center justify-end shrink-0 max-w-[120px] sm:max-w-[200px]">
                <span 
                    title={displayName}
                    className="font-semibold tracking-wide text-xs sm:text-sm text-[#F5F7FA] truncate block"
                >
                    {displayName}
                </span>
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
