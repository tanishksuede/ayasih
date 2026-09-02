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
import { ForYouCarousel } from './ForYouCarousel';
import { CheckInCard } from './CheckInCard';
import { MessageSquarePlus, X, BellRing, Filter } from 'lucide-react';
import { CHECKIN_TAGS } from '../../config/recommendationConfig';
import { getStoryMetadata } from '../../data/storyMetadata';
import { generateLevels } from '../../utils/levelGenerator';

interface LevelMapProps {
    onPlayLevel: (level: any) => void;
    onOpenDnaProfile: () => void;
}

const trackSituationEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
    const analyticsWindow = window as typeof window & {
        gtag?: (command: 'event', name: string, params: Record<string, unknown>) => void;
    };
    analyticsWindow.gtag?.('event', eventName, parameters);
};

export function LevelMap({ onPlayLevel, onOpenDnaProfile }: LevelMapProps) {
    const navigate = useNavigate();
    const levels = useUserStore((state) => state.levels);
    const levelScores = useUserStore((state) => state.levelScores);
    const profile = useUserStore((state) => state.profile);
    const [showCheckInModal, setShowCheckInModal] = useState(() => !sessionStorage.getItem('hasCheckedInSession'));

    // Admin check — use profile.isAdmin from the store, with fallback to DB check
    const [isAdmin, setIsAdmin] = useState(!!profile?.isAdmin);
    useEffect(() => {
        if (profile?.isAdmin) { setIsAdmin(true); return; }
        const checkAdmin = async () => {
            try {
                const { checkIsAdmin } = await import('../../utils/adminCheck');
                const result = await checkIsAdmin();
                if (result) setIsAdmin(true);
            } catch {}
        };
        checkAdmin();
    }, [profile?.isAdmin]);
    const browseAge = useUserStore((state) => state.browseAge);
    const setBrowseAge = useUserStore((state) => state.setBrowseAge);
    const activeAge = browseAge ?? profile?.age ?? 18;
    
    let ageLevels: any[] = [];
    
    // Merge master code definitions from generateLevels with store levels and levelScores.
    // This guarantees that all stories (including newly added ones like Age 16 Bhuvan Bam)
    // are ALWAYS available immediately, even if the store has not synced or has a stale cached list.
    const masterLevels = generateLevels(activeAge);
    const storeLevelsMap = new Map((levels || []).map(l => [l.id, l]));

    let processedLevels: any[] = masterLevels.map(l => {
        const storeLevel = storeLevelsMap.get(l.id);
        const localScore = levelScores[l.id];
        let status = (storeLevel?.status || l.status || 'unlocked') as 'locked' | 'unlocked' | 'completed';
        let stars = l.stars || 0;
        if (storeLevel?.stars) stars = Math.max(stars, storeLevel.stars);
        if (localScore !== undefined && localScore > 0) {
            status = 'completed';
            stars = Math.max(stars, localScore);
        }
        return {
            ...l,
            ...(storeLevel || {}),
            age: l.age,
            status,
            stars
        };
    });

    const masterLevelIds = new Set(masterLevels.map(l => l.id));
    const extraDbLevels = (levels || []).filter(l => !masterLevelIds.has(l.id)).map(l => {
        const localScore = levelScores[l.id];
        if (localScore !== undefined && localScore > 0) {
            return { ...l, status: 'completed' as const, stars: Math.max(l.stars || 0, localScore) };
        }
        return l;
    });
    processedLevels = [...processedLevels, ...extraDbLevels];

    const activeSituationFilter = useUserStore((state) => state.activeSituationFilter);
    const clearSituationFilter = useUserStore((state) => state.clearSituationFilter);
    const [notified, setNotified] = useState(false);
    const [notifyError, setNotifyError] = useState(false);
    const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

    useEffect(() => {
        if (activeSituationFilter) {
            try {
                const stored = JSON.parse(localStorage.getItem('aya_user_story_requests') || '[]');
                const already = stored.some((r: any) => r.tag === activeSituationFilter);
                setNotified(already);
            } catch {
                setNotified(false);
            }
            setNotifyError(false);
            setIsSubmittingNotify(false);
        }
    }, [activeSituationFilter]);

    const getSituationLabel = (tag: string | null) => {
        if (!tag) return '';
        const found = CHECKIN_TAGS.situation.find(s => s.value === tag);
        if (found) return found.label;
        return tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (activeSituationFilter) {
        // Situation filter: restrict to the current age first, then match tags.
        const agePool = processedLevels.filter(l => Number(l.age) === Number(activeAge));
        ageLevels = agePool.filter(l => {
            const metadata = getStoryMetadata(l.scenarioId);
            return metadata?.situationTags.includes(activeSituationFilter)
                || metadata?.problemTags.includes(activeSituationFilter)
                || metadata?.intentTags.includes(activeSituationFilter);
        });
    } else {
        // STANDARD MAP FLOW
        let ageFiltered = processedLevels.filter(l => Number(l.age) === Number(activeAge));
        const hasRealStories = ageFiltered.some(l => !l.title.toLowerCase().includes('coming soon'));
        if (hasRealStories) {
            ageFiltered = ageFiltered.filter(l => !l.title.toLowerCase().includes('coming soon'));
        }
        ageLevels = ageFiltered;
    }

    const filteredScenarioIds = activeSituationFilter
        ? ageLevels.map(level => level.scenarioId).join(',')
        : '';

    useEffect(() => {
        if (!activeSituationFilter) return;

        trackSituationEvent('situation_filter_applied', {
            situation: activeSituationFilter,
            matching_story_count: ageLevels.length,
        });
        trackSituationEvent(ageLevels.length > 0 ? 'matching_stories_shown' : 'zero_result_situation', {
            situation: activeSituationFilter,
            matching_story_count: ageLevels.length,
        });
    }, [activeSituationFilter, filteredScenarioIds]);
    
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

    // Fast, zero-lag liquid spring tracking
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 800, // Instant response
        damping: 55,    // Smooth settling without wobble
        mass: 0.08,     // Ultra-light mass for immediate 1:1 finger/wheel tracking
        restDelta: 0.0001
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

    // --- SCROLL AUDIO GLIDE (THROTTLED TO RAF) ---
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let lastScrollTop = container.scrollTop;
        let scrollTimeout: any;
        let rafId: number | null = null;

        const handleScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const currentScrollTop = container.scrollTop;
                const delta = Math.abs(currentScrollTop - lastScrollTop);
                
                if (delta > 3) {
                    audioSynth.startGlide();
                    audioSynth.updateGlide(delta);
                    
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        audioSynth.stopGlide();
                    }, 120);
                }
                
                lastScrollTop = currentScrollTop;
            });
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
            clearTimeout(scrollTimeout);
            audioSynth.stopGlide();
        };
    }, []);

    return (
        <div className="relative w-full h-[calc(100dvh-60px)] bg-slate-900 overflow-hidden flex flex-col">
            <AudioController />
            {/* --- FIXED UI LAYER (Stays on Top) --- */}

            <SideMenu
                isCandyMode={isCandyMode}
                isAdmin={isAdmin}
                profile={profile}
                audioSynth={audioSynth}
                navigate={navigate}
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

            {/* Filter Header Banner */}
            {activeSituationFilter && (
                <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-purple-500/40 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in pointer-events-auto">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <Filter size={14} className="text-cyan-400 animate-pulse" />
                        <span>Stories for:</span>
                        <span className="text-white uppercase tracking-wider bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-md font-extrabold">
                            {getSituationLabel(activeSituationFilter)}
                        </span>
                    </div>
                    <button
                        onClick={clearSituationFilter}
                        className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 hover:text-white"
                    >
                        <X size={12} />
                        <span>Clear filter</span>
                    </button>
                </div>
            )}
            
            {/* Browse Age Indicator Banner */}
            {browseAge !== null && browseAge !== profile?.age && (
                <div className={`fixed ${activeSituationFilter ? 'top-32 md:top-36' : 'top-20 md:top-24'} left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-amber-500/40 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in pointer-events-auto`}>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <span>Exploring Age {browseAge}</span>
                        <span className="text-amber-400/60 text-[11px] font-normal">(Original: {profile?.age || 18})</span>
                    </div>
                    <button
                        onClick={() => {
                            setBrowseAge(null);
                            useUserStore.getState().syncLevels();
                        }}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1 hover:text-white"
                    >
                        <X size={12} />
                        <span>Reset</span>
                    </button>
                </div>
            )}

            {/* Modals moved to routes */}
            {/* --- SCROLLABLE MAP CONTENT --- */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden relative"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                }}
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
                    <div className="absolute top-0 w-full pointer-events-auto z-50">
                        <ForYouCarousel onPlayLevel={onPlayLevel} allLevels={levels} />
                    </div>
                    <div className="relative w-full max-w-md mx-auto mt-[340px] md:mt-[380px] pointer-events-none h-full map-content">
                        {/* NODES */}

                        {/* Local metadata makes this result immediate and offline-safe. */}
                        {activeSituationFilter && ageLevels.length === 0 && (
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-purple-500/40 p-6 md:p-8 rounded-3xl max-w-sm z-50 shadow-2xl text-white">
                                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner">
                                    <BellRing size={26} />
                                </div>
                                <h3 className="text-base md:text-lg font-black text-white mb-1">
                                    We don't have a story for this yet.
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                                    Want us to let you know when a story on <span className="font-bold text-cyan-300">{getSituationLabel(activeSituationFilter)}</span> is available?
                                </p>

                                {notified ? (
                                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold mb-4 flex items-center justify-center gap-2 animate-fade-in">
                                        <span>✓ Request saved! We'll notify you when published.</span>
                                    </div>
                                ) : (
                                    <button
                                        disabled={isSubmittingNotify}
                                        onClick={async () => {
                                            audioSynth.playClick();
                                            setIsSubmittingNotify(true);
                                            setNotifyError(false);
                                            trackSituationEvent('notify_me_clicked', { situation: activeSituationFilter });

                                            try {
                                                const { logStoryRequest } = await import('../../services/storyRequestService');
                                                const result = await logStoryRequest(
                                                    profile?.id, 
                                                    activeSituationFilter, 
                                                    getSituationLabel(activeSituationFilter),
                                                    Number(activeAge) || profile?.age || 18
                                                );

                                                // Also attempt to register for push notifications if not already granted
                                                try {
                                                    const { subscribeUserToPush } = await import('../../utils/pushNotifications');
                                                    await subscribeUserToPush(profile?.id);
                                                } catch (pushErr) {
                                                    console.warn('[NotifyMe] Push notice:', pushErr);
                                                }

                                                if (result.success) {
                                                    setNotified(true);
                                                } else {
                                                    setNotifyError(true);
                                                }
                                            } catch (err) {
                                                console.error('[NotifyMe] Error:', err);
                                                setNotifyError(true);
                                            } finally {
                                                setIsSubmittingNotify(false);
                                            }
                                        }}
                                        className="w-full py-3 mb-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingNotify ? 'Saving Request...' : 'Notify me'}
                                    </button>
                                )}

                                {notifyError && (
                                    <p className="text-xs text-rose-300 mb-3">Couldn't save your request right now. Please try again later.</p>
                                )}

                                <button
                                    onClick={clearSituationFilter}
                                    className="w-full py-2.5 rounded-2xl bg-slate-900 border border-slate-700 font-bold text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    Explore all stories
                                </button>
                            </div>
                        )}

                        {/* EMPTY STATE FOR AGES WITH NO STORIES */}
                        {!activeSituationFilter && ageLevels.length === 0 && (
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

                        {/* CONNECTION LINES */}
                        <svg className="absolute top-0 left-0 w-full z-0 pointer-events-none" style={{ height: totalHeight }}>
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#8B3DFF" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            {ageLevels.map((_, i) => {
                                if (i === ageLevels.length - 1) return null;
                                const pos1 = getPosition(i);
                                const pos2 = getPosition(i + 1);
                                
                                const x1 = `calc(50% ${!isMobile && pos1.x !== 0 ? (pos1.x > 0 ? `+ ${pos1.x}px` : `- ${Math.abs(pos1.x)}px`) : ''})`;
                                const y1 = pos1.y;
                                const x2 = `calc(50% ${!isMobile && pos2.x !== 0 ? (pos2.x > 0 ? `+ ${pos2.x}px` : `- ${Math.abs(pos2.x)}px`) : ''})`;
                                const y2 = pos2.y;

                                const isUnlocked2 = ageLevels[i + 1].status !== 'locked';

                                return (
                                    <g key={`line-${i}`}>
                                        <line 
                                            x1={x1} y1={y1} x2={x2} y2={y2} 
                                            stroke="rgba(255,255,255,0.05)" 
                                            strokeWidth="2" 
                                        />
                                        {isUnlocked2 && (
                                            <line 
                                                x1={x1} y1={y1} x2={x2} y2={y2} 
                                                stroke="url(#line-gradient)" 
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                className="animate-[pulse_3s_ease-in-out_infinite]"
                                                style={{
                                                    strokeDasharray: '8 12',
                                                    animation: 'flowLine 1.5s linear infinite'
                                                }}
                                            />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                        <style>{`
                            @keyframes flowLine {
                                to { stroke-dashoffset: -20; }
                            }
                        `}</style>
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
                                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-500 z-10 pointer-events-auto"
                                    style={isMobile
                                        ? { top: pos.y, left: '50%', transform: 'translateX(-50%)', zIndex: 20 + i }
                                        : { top: pos.y, transform: `translate(calc(-50% + ${pos.x}px), -50%)`, zIndex: 20 + i }
                                    }
                                >
                                    <div
                                        className={clsx(
                                            "group relative cursor-pointer transition-all duration-500",
                                            isUnlocked ? "hover:-translate-y-2" : "grayscale opacity-60",
                                            highlightedNodeId === level.id && "scale-110 z-50"
                                        )}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        onTouchStart={() => { if (isUnlocked) audioSynth.playHover(); }}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                audioSynth.playClick();
                                                onPlayLevel(level);
                                            }
                                        }}
                                    >
                                        <div className={clsx(
                                            "relative rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 transform-gpu bg-[#080B14]",
                                            "w-16 h-16 md:w-20 md:h-20 mx-auto",
                                            isCurrent 
                                                ? "border-2 border-[#FFC400] shadow-[0_10px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2),0_0_15px_rgba(255,196,0,0.3)] scale-110" 
                                                : "border border-white/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] group-hover:border-white/[0.2] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                                        )}>
                                            <img 
                                                src={level.portrait ? `/portraits/${level.portrait}` : (level.avatarUrl || resolvePersonalityAvatar(level.personality || ''))} 
                                                alt={level.archetype} 
                                                className={clsx(
                                                    "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                                                    !isCurrent && "opacity-80 group-hover:opacity-100"
                                                )} 
                                                onError={(e) => { e.currentTarget.src = resolvePersonalityAvatar(level.personality || ''); }}
                                            />
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05070D]/60 backdrop-blur-[2px]">
                                                    <Lock size={16} className="text-[#667085] drop-shadow-md md:w-5 md:h-5" />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.15] to-transparent pointer-events-none rounded-t-full mix-blend-overlay" />
                                        </div>

                                        <div className={clsx(
                                            "absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 transition-all duration-300",
                                            isUnlocked ? "opacity-90 group-hover:opacity-100 group-hover:translate-y-1" : "opacity-50"
                                        )}>
                                            <div className="flex flex-col items-center bg-[#080B14] border border-white/[0.06] rounded-xl px-4 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.05)] min-w-[140px] md:min-w-[160px] relative overflow-hidden">
                                                {isCurrent && (
                                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFC400] to-transparent opacity-80" />
                                                )}
                                                <span className={clsx(
                                                    "text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap mb-0.5",
                                                    isCurrent ? "text-[#FFC400]" : "text-[#F5F7FA]"
                                                )}>
                                                    {level.personality || level.archetype || 'GUEST'}
                                                </span>
                                                <span className="text-[9px] md:text-[10px] font-medium text-[#A5AFBF] whitespace-nowrap truncate max-w-full tracking-wide">
                                                    {level.title}
                                                </span>
                                            </div>
                                        </div>

                                        {!isUnlocked && level.day_number !== undefined && (
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                                                <div className="bg-[#0C1220] text-[#A5AFBF] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl border border-white/[0.04] whitespace-nowrap tracking-wide">
                                                    🔒 Unlocks on Day {level.day_number}
                                                </div>
                                            </div>
                                        )}

                                        {isCompleted && (
                                            <div className="absolute -top-4 md:-top-5 flex gap-1 justify-center w-full z-40">
                                                {[1, 2, 3].map(s => {
                                                    const isEarned = s <= (earnedStars || 0);
                                                    return (
                                                        <Star 
                                                            key={s} 
                                                            size={14} 
                                                            className={clsx(
                                                                "drop-shadow-lg md:w-[14px] md:h-[14px] transition-all",
                                                                isEarned ? "fill-[#FFC400] text-[#FFC400] scale-110" : "fill-transparent text-[#667085]"
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

            {/* Floating Life Check-in FAB Button */}
            <div className="fixed bottom-6 right-6 z-[110] pointer-events-auto">
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        trackSituationEvent('checkin_opened');
                        setShowCheckInModal(true);
                    }}
                    className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#080B14] border border-white/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/[0.12] hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,229,255,0.15)] hover:-translate-y-1 active:translate-y-0.5 active:scale-95 transition-all duration-300"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#111827] to-[#05070D] border border-white/[0.04] shadow-inner flex items-center justify-center">
                        <MessageSquarePlus size={16} className="text-[#00E5FF] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col items-start pr-1 hidden md:flex">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#A5AFBF] group-hover:text-[#F5F7FA] transition-colors">Situation Check-in</span>
                        <span className="text-xs font-bold text-[#F5F7FA]">What's on your mind?</span>
                    </div>
                    <span className="md:hidden text-[11px] font-black uppercase tracking-[0.15em] text-[#F5F7FA] mr-2">Check-In</span>
                </button>
            </div>

            {showCheckInModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="relative w-full max-w-xl my-auto animate-fade-in-up">
                        <CheckInCard
                            onCheckInComplete={() => {
                                sessionStorage.setItem('hasCheckedInSession', 'true');
                                setTimeout(() => setShowCheckInModal(false), 1500);
                            }}
                            onClose={() => setShowCheckInModal(false)}
                        />
                    </div>
                </div>
            )}

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
