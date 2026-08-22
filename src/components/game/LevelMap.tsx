import { useUserStore } from '../../store/userStore';
import { Star, Lock } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import clsx from 'clsx';
import { AudioController } from '../shared/AudioController';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { AntiGravityCanvas } from './AntiGravityCanvas';
import { useNavigate } from 'react-router-dom';
import { SideMenu } from './SideMenu';
import { bgmManager } from '../../utils/bgmManager';
import { MapAmbience } from './MapAmbience';
import { getUnlockedDayCount } from '../../utils/storyUnlock';
import { SearchBar } from '../SearchBar';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';
import TopicPreferencesSurvey from '../feedback/TopicPreferencesSurvey';

interface LevelMapProps {
    onPlayLevel: (level: any) => void;
    onOpenDnaProfile: () => void;
}


export function LevelMap({ onPlayLevel, onOpenDnaProfile }: LevelMapProps) {
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    const levelScores = useUserStore((state) => state.levelScores);
    const profile = useUserStore((state) => state.profile);

    // Admin check — read persisted Google email from localStorage
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const checkAdmin = async () => {
            const email = localStorage.getItem('aya_google_email');
            if (!email) return;
            // Founder always gets access (no DB needed)
            if (email === 'anitadhakad333@gmail.com') { setIsAdmin(true); return; }
            // Other admins: check database
            try {
                // Must import supabase at the top if it wasn't already
                const { supabase } = await import('../../utils/supabase');
                const { data } = await supabase.from('admin_users').select('email').eq('email', email).maybeSingle();
                if (data) setIsAdmin(true);
            } catch {}
        };
        checkAdmin();
    }, []);
    const activeAge = profile?.age || 18;
    
    let ageLevels: any[] = [];
    
    // Process levels and forcefully sync with levelScores to guarantee perfect UI reactivity
    let processedLevels = (levels || []).map(l => {
        const localScore = levelScores[l.id];
        if (localScore !== undefined && localScore > 0) {
            return { ...l, status: 'completed', stars: Math.max(l.stars || 0, localScore) };
        }
        return l;
    });

    if (profile?.preferred_map === 'jee') {
        ageLevels = processedLevels.filter(l => l.theme === 'JEE').sort((a, b) => (a.day_number || 0) - (b.day_number || 0));
    } else if (profile?.preferred_map === 'neet') {
        ageLevels = processedLevels.filter(l => l.theme === 'NEET').sort((a, b) => (a.day_number || 0) - (b.day_number || 0));
    } else if (profile?.preferred_map === 'upsc') {
        ageLevels = processedLevels.filter(l => l.theme === 'UPSC').sort((a, b) => (a.day_number || 0) - (b.day_number || 0));
    } else {
        // Standard Map Flow
        // 1. Filter by age
        let ageFiltered = processedLevels.filter(l => Number(l.age) === Number(activeAge));
        
        const hasRealStories = ageFiltered.some(l => !l.title.toLowerCase().includes('coming soon'));
        if (hasRealStories) {
            ageFiltered = ageFiltered.filter(l => !l.title.toLowerCase().includes('coming soon'));
        }

        ageLevels = ageFiltered;
    }
    
    const unlockedDays = getUnlockedDayCount(profile?.access_type, profile?.access_start_date);

    const mapTheme = useUserStore((state) => state.mapTheme);
    const isCandyMode = mapTheme === 'light';
    
    // Streaks
    const checkStreak = useUserStore((state) => state.checkStreak);
    
    useEffect(() => {
        checkStreak(); // evaluate streaks on mount
    }, [checkStreak]);

    const personalities = Array.from(new Set(ageLevels.map(l => l.personality || l.archetype).filter(Boolean)));
    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

    const handleMatch = useCallback((name: string) => {
        const index = ageLevels.findIndex(l => (l.personality || l.archetype) === name);
        if (index !== -1) {
            const level = ageLevels[index];
            setHighlightedNodeId(level.id);
            
            // Scroll to node
            if (containerRef.current) {
                const pos = getPosition(index);
                // Center the node on screen roughly
                containerRef.current.scrollTo({
                    top: Math.max(0, pos.y - window.innerHeight / 2),
                    behavior: 'smooth'
                });
            }

            // Remove highlight after 3 seconds
            setTimeout(() => {
                setHighlightedNodeId(null);
            }, 3000);
        }
    }, [ageLevels]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isBgmEnabled, setIsBgmEnabled] = useState(bgmManager.enabled);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        // Play neon-map BGM on initial mount
        bgmManager.setMapReady();
        bgmManager.play('neon-map');

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Play neon-map BGM on mount
    useEffect(() => {
        bgmManager.play('neon-map');
    }, []);

    // Configuration
    const NODE_SPACING_DESKTOP = 220;
    const NODE_SPACING_MOBILE = 180;
    const NODE_SPACING = isMobile ? NODE_SPACING_MOBILE : NODE_SPACING_DESKTOP;

    // Manual Offsets to align with the "River" background image
    // Manual Offsets to align with the "River" background image
    const DESKTOP_NODE_OFFSETS = [0, -60, 50, -50, 20, 60, -40, 30, -60, 0];
    const MOBILE_NODE_OFFSETS = [0, -20, 20, -20, 10, 25, -15, 10, -20, 0]; // Tighter zig-zag for mobile

    const NODE_OFFSETS = isMobile ? MOBILE_NODE_OFFSETS : DESKTOP_NODE_OFFSETS;

    const totalHeight = (ageLevels.length * NODE_SPACING) + (isMobile ? 300 : 400);

    // Helper to calculate X/Y for a node based on index
    const getPosition = (index: number) => {
        // TOP-DOWN: Start from Top
        const y = index * NODE_SPACING + (isMobile ? 120 : 150);

        // xOffset is used on desktop only; mobile always centers nodes
        const xOffset = index < NODE_OFFSETS.length
            ? NODE_OFFSETS[index]
            : Math.sin(index) * (isMobile ? 30 : 60);

        return { x: xOffset, y };
    };

    // Scroll refs and values
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
    const [canvasReady, setCanvasReady] = useState(false);

    const handleCanvasReady = useCallback(() => {
        setCanvasReady(true);
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress, scrollY: motionScrollY } = useScroll({ container: containerRef });

    // The "Liquid Scroll" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400, // Increased for sharper response
        damping: 40,    // Increased to prevent wobble
        mass: 0.5,      // Lighter mass for immediate start
        restDelta: 0.001
    });

    const scrollableDistance = Math.max(0, totalHeight - windowHeight);
    const hudY = useTransform(smoothProgress, [0, 1], [0, -scrollableDistance]);

    // --- STARTUP SOUND & AUTO-SCROLL ---
    useEffect(() => {
        // Startup Sound
        audioSynth.playStartup();

        const scrollToTop = () => {
            if (containerRef.current) {
                containerRef.current.scrollTop = 0;
                containerRef.current.dispatchEvent(new Event('scroll'));
            }
        };

        requestAnimationFrame(scrollToTop);
        const timer = setTimeout(scrollToTop, 150);
        return () => clearTimeout(timer);
    }, [ageLevels.length]);

    // --- SCROLL AUDIO GLIDE ---
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let lastScrollTop = container.scrollTop;
        let scrollTimeout: any;

        const handleScroll = () => {
            const currentScrollTop = container.scrollTop;
            const delta = Math.abs(currentScrollTop - lastScrollTop);
            
            if (delta > 2) {
                audioSynth.startGlide();
                audioSynth.updateGlide(delta);
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    audioSynth.stopGlide();
                }, 150);
            }
            
            lastScrollTop = currentScrollTop;
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
            audioSynth.stopGlide();
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 overflow-hidden">
            <AudioController />
            {/* --- FIXED UI LAYER (Stays on Top) --- */}

            <SideMenu
                isCandyMode={isCandyMode}
                isAdmin={isAdmin}
                isBgmEnabled={isBgmEnabled}
                profile={profile}
                audioSynth={audioSynth}
                bgmManager={bgmManager}
                navigate={navigate}
                setIsBgmEnabled={setIsBgmEnabled}
                onOpenDnaProfile={onOpenDnaProfile}
            />

            {/* Header Search Portal */}
            {document.getElementById('header-search-portal') && createPortal(
                <SearchBar 
                    personalities={personalities} 
                    onMatch={handleMatch} 
                />,
                document.getElementById('header-search-portal')!
            )}

            {/* Modals moved to routes */}
            {/* --- SCROLLABLE MAP CONTENT --- */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth"
            >
                {/* Dummy div to enforce native scroll height */}
                <div style={{ height: totalHeight, width: '100%' }} />

                {/* --- LAYER 1: BACKDROP (AntiGravityCanvas) --- */}
                <AntiGravityCanvas
                    progress={smoothProgress}
                    onReady={handleCanvasReady}
                />

                <MapAmbience scrollY={motionScrollY} />

                {!isMobile && canvasReady && (
                    <div className="fixed inset-0 bg-gradient-to-t from-pink-200/20 via-transparent to-slate-900/50 mix-blend-overlay pointer-events-none z-10" />
                )}

                {/* --- LAYER 2: MIDGROUND HUD (Interactive & Smooth Synced) --- */}
                <motion.div
                    className="fixed top-0 left-0 w-full layer-mid pb-32 pointer-events-none z-20"
                    style={{ 
                        height: totalHeight, 
                        y: hudY, 
                        willChange: "transform" // Force GPU acceleration on mobile
                    }}
                >
                    <div className="relative w-full max-w-md mx-auto mt-24 md:mt-32 pointer-events-none h-full map-content">
                        {/* NODES */}

                        {/* EMPTY STATE FOR AGES WITH NO STORIES */}
                        {ageLevels.length === 0 && (
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-sm z-30 shadow-2xl">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-2xl font-black">
                                    {activeAge}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Age {activeAge}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    No stories available for Age {activeAge} yet. Check back soon for new historical stories!
                                </p>
                            </div>
                        )}

                        {/* LEVEL NODES */}
                        {ageLevels.map((level, i) => {
                            const pos = getPosition(i);
                            let isUnlocked = level.status !== 'locked';
                            if (level.day_number !== undefined) {
                                isUnlocked = level.day_number <= unlockedDays;
                            }
                            const isCompleted = level.status === 'completed' || (levelScores[level.id] !== undefined && levelScores[level.id] > 0);
                            const isCurrent = isUnlocked && !isCompleted;
                            const earnedStars = levelScores[level.id] || level.stars || 0;

                            return (
                                <div
                                    key={level.id}
                                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-500 z-10 pointer-events-auto personality-node-container"
                                    style={isMobile
                                        ? { top: pos.y, left: '50%', transform: 'translateX(-50%)', zIndex: 20 + i }
                                        : { top: pos.y, transform: `translate(calc(-50% + ${pos.x}px), -50%)`, zIndex: 20 + i }
                                    }
                                >
                                    <div
                                        className={clsx(
                                            "candy-node-container group cursor-pointer hover:scale-110 transition-transform animate-float",
                                            isCurrent && "candy-node-active animate-breath",
                                            !isUnlocked && "candy-node-locked grayscale opacity-80",
                                            isCompleted && "candy-node-completed",
                                            highlightedNodeId === level.id && "ring-4 ring-[#00f2ff] ring-offset-4 ring-offset-transparent shadow-[0_0_30px_#00f2ff] rounded-full scale-110"
                                        )}
                                        // Touch start for mobile responsiveness
                                        onTouchStart={() => {
                                            if (isUnlocked) audioSynth.playHover();
                                        }}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                audioSynth.playClick();
                                                onPlayLevel(level);
                                            }
                                        }}
                                    >
                                        <div className="lollipop-stick" />
                                        {/* Responsive Halo */}
                                        <div className={clsx(
                                            "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full transition-colors node-base",
                                            // Mobile: w-20 h-20, Desktop: w-28 h-28
                                            "w-20 h-20 md:w-28 md:h-28",
                                            isCandyMode 
                                                ? (isCurrent ? "bg-pink-100/50" : "bg-white/10")
                                                : (isCurrent ? "bg-amber-400/20" : "bg-[#4DD9FF]/10")
                                        )} />

                                        {/* Responsive Avatar Ring */}
                                        <div className={clsx(
                                            "relative rounded-full overflow-hidden flex items-center justify-center bg-white node-ring transition-all duration-300",
                                            // Mobile: w-16 h-16, Desktop: w-24 h-24
                                            "w-16 h-16 md:w-24 md:h-24",
                                            isCandyMode
                                                ? (isCurrent ? "border-4 border-pink-400 ring-4 ring-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.6)]" : "border-4 border-slate-300 shadow-[0_8px_0_rgba(0,0,0,0.2)]")
                                                : (isCurrent 
                                                    ? "border-4 border-amber-400 ring-4 ring-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.8)]"
                                                    : "border-transparent ring-2 ring-[#4DD9FF]/80 shadow-[0_0_15px_rgba(77,217,255,0.6)]")
                                        )}>
                                            <img 
                                                src={level.portrait ? `/portraits/${level.portrait}` : (level.avatarUrl || resolvePersonalityAvatar(level.personality || ''))} 
                                                alt={level.archetype} 
                                                className="w-full h-full object-cover node-content" 
                                                onError={(e) => { e.currentTarget.src = resolvePersonalityAvatar(level.personality || ''); }}
                                            />
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-200/50 sm:backdrop-blur-[1px]">
                                                    <Lock size={20} className="text-slate-500 drop-shadow-md opacity-80 md:w-6 md:h-6" />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full" />
                                        </div>

                                        {/* Lock Tooltip */}
                                        {!isUnlocked && level.day_number !== undefined && (
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                                                <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded shadow-xl border border-slate-700 whitespace-nowrap">
                                                    🔒 Unlocks on Day {level.day_number}
                                                </div>
                                            </div>
                                        )}

                                        {/* Labels */}
                                        <div className={clsx(
                                            "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 transition-all duration-300 transform flex flex-col items-center",
                                            "md:-bottom-14", // Lower overlap on desktop
                                            isUnlocked ? "scale-100 hover:scale-110" : "scale-90 opacity-70 grayscale"
                                        )}>
                                            {/* Personality Badge */}
                                            {level.personality && (
                                                <div className={clsx(
                                                    "relative -mb-2 px-3 py-0.5 rounded-full border shadow-sm flex items-center justify-center z-40 animate-float min-w-max",
                                                    "md:-mb-3 md:px-4 md:py-1 md:border-2",
                                                    isCandyMode
                                                        ? (isUnlocked ? "bg-gradient-to-r from-yellow-300 to-yellow-500 border-white text-yellow-900" : "bg-slate-700 border-slate-600 text-slate-400")
                                                        : (isUnlocked 
                                                            ? (isCurrent ? "bg-amber-500 border-amber-300 text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-[rgba(10,15,40,0.95)] border-[#4DD9FF]/70 text-[#E8E0FF] shadow-[0_0_8px_rgba(77,217,255,0.3)]")
                                                            : "bg-slate-800 border-slate-700 text-slate-500")
                                                )}>
                                                    <span className="text-[10px] md:text-sm font-black uppercase tracking-blacker drop-shadow-sm personality-name-label">
                                                        {level.personality}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Story Title */}
                                            <div className={clsx(
                                                "px-4 py-1 pt-3 pb-1 md:px-6 md:py-2 md:pt-4 md:pb-2 rounded-xl shadow-xl flex items-center justify-center min-w-[100px] md:min-w-[140px] transition-all duration-300",
                                                isCandyMode
                                                    ? (isUnlocked ? "bg-gradient-to-r from-pink-500 to-rose-500 border-b-[3px] md:border-b-4 border-rose-800" : "border-b-[3px] md:border-b-4 bg-slate-800 border-slate-900")
                                                    : (isUnlocked
                                                        ? (isCurrent 
                                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 border-b-[3px] md:border-b-4 border-amber-800 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                                            : "bg-[rgba(10,15,40,0.95)] border border-[#4DD9FF]/60 shadow-[0_0_15px_rgba(77,217,255,0.15)]")
                                                        : "bg-slate-800/80 border-b-[3px] md:border-b-4 border-slate-900")
                                            )}>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider leading-none text-center story-title-label",
                                                    isCandyMode
                                                        ? (isUnlocked ? "text-white drop-shadow-md" : "text-slate-500")
                                                        : (isUnlocked 
                                                            ? (isCurrent ? "text-white drop-shadow-md" : "text-[#F0EEFF] drop-shadow-[0_0_4px_rgba(240,238,255,0.3)]")
                                                            : "text-slate-500")
                                                )}>
                                                    {level.title}
                                                </span>
                                            </div>
                                        </div>

                                        {true && (
                                            <div className="absolute -top-4 md:-top-6 flex gap-1 justify-center w-full">
                                                {[1, 2, 3].map(s => {
                                                    const isEarned = s <= (earnedStars || 0);
                                                    return (
                                                        <Star 
                                                            key={s} 
                                                            size={16} 
                                                            className={clsx(
                                                                "drop-shadow-sm md:w-5 md:h-5",
                                                                isEarned 
                                                                    ? "fill-yellow-400 text-yellow-600 animate-bounce" 
                                                                    : "fill-slate-400/50 text-slate-500/50"
                                                            )} 
                                                            style={isEarned ? { animationDelay: `${s * 100}ms` } : {}} 
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Topic Survey Modal after 3rd Journey */}
            {profile?.stories_completed === 3 && !localStorage.getItem('aya_topic_survey_done') && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="animate-fade-in-up">
                        <TopicPreferencesSurvey 
                            onComplete={() => {
                                localStorage.setItem('aya_topic_survey_done', 'true');
                                // Force a re-render to hide it
                                setHighlightedNodeId('refresh');
                            }} 
                        />
                    </div>
                </div>
            )}
        </div >
    );
}
