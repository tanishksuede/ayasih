import { Outlet, useLocation } from 'react-router-dom';
import { PwaHeader } from '../components/ui/PwaHeader';

export function AppLayout() {
    const location = useLocation();
    
    // Hide header on landing page (/) and immersive game routes (e.g., when playing a story)
    const hideHeader = location.pathname === '/' ||
                       location.pathname.includes('/game/play') || 
                       location.pathname.includes('/game/intro') || 
                       location.pathname.includes('/game/report');

    return (
        <div className="flex flex-col min-h-[100dvh] bg-slate-950 text-white overflow-x-hidden">
            {/* Premium Neon PWA Header */}
            {!hideHeader && <PwaHeader />}
            {/* Main Content Area - Starts directly below the header */}
            <main className="flex-1 relative flex flex-col min-h-0 w-full">
                <Outlet />
            </main>
        </div>
    );
}
