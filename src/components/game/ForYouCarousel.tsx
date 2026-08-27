import { useEffect, useState, useRef, useCallback } from 'react';
import { useUserStore } from '../../store/userStore';
import { getRecommendations } from '../../services/recommendationEngine';
import { Play, Sparkles, ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';
import { VibeSpinnerButton } from '../MoodWheel/VibeSpinnerButton';
import { useNavigate } from 'react-router-dom';

interface ForYouCarouselProps {
    onPlayLevel: (l: any) => void;
    allLevels: any[];
}

export function ForYouCarousel({ onPlayLevel, allLevels }: ForYouCarouselProps) {
    const navigate = useNavigate();
    const profile = useUserStore(state => state.profile);
    const sessionPreferences = useUserStore(state => state.sessionPreferences);
    const [recommendedStories, setRecommendedStories] = useState<any[]>([]);
    const [storyTagsMap, setStoryTagsMap] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchRecs = async () => {
            if (!profile?.id) return;
            try {
                const storyIds = await getRecommendations(profile.id, sessionPreferences, 8);
                
                let levelsToDisplay: any[] = [];
                if (storyIds.length > 0) {
                    levelsToDisplay = storyIds
                        .map(id => allLevels.find(l => (l.scenarioId || l.id) === id || l.id === id))
                        .filter(Boolean);
                }
                
                // Fallback if no matching tags yet (cold start / broad selection)
                if (levelsToDisplay.length < 5) {
                    const fallback = allLevels
                        .filter(l => !l.title.toLowerCase().includes('coming soon') && !levelsToDisplay.some(d => d.id === l.id))
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 8 - levelsToDisplay.length);
                    levelsToDisplay = [...levelsToDisplay, ...fallback];
                }
                
                setRecommendedStories(levelsToDisplay);

                // Fetch tags for these stories to display visually
                const ids = levelsToDisplay.map(l => l.scenarioId || l.id);
                if (ids.length > 0) {
                    const { supabase } = await import('../../utils/supabase');
                    const { data: tagRows } = await supabase
                        .from('story_tags')
                        .select('story_id, tag_name')
                        .in('story_id', ids);

                    if (tagRows) {
                        const map: Record<string, string[]> = {};
                        tagRows.forEach((r: any) => {
                            if (!map[r.story_id]) map[r.story_id] = [];
                            map[r.story_id].push(r.tag_name);
                        });
                        setStoryTagsMap(map);
                    }
                }
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, [profile?.id, sessionPreferences, allLevels]);

    // ── Smooth Auto-Scrolling Slideshow Logic ───────────────────────────────
    const scroll = useCallback((direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = 270; // card width + gap
        const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
        
        // Loop back if at the end
        if (direction === 'right' && container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (direction === 'left' && container.scrollLeft <= 0) {
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        if (isPaused || loading || recommendedStories.length === 0) {
            if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
            return;
        }

        autoScrollTimerRef.current = setInterval(() => {
            scroll('right');
        }, 3200); // Smooth auto-advance every 3.2 seconds

        return () => {
            if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
        };
    }, [isPaused, loading, recommendedStories.length, scroll]);

    if (loading || recommendedStories.length === 0) return null;

    return (
        <div 
            className="w-full bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-transparent backdrop-blur-xl border-b border-cyan-500/20 pt-20 md:pt-24 pb-5 px-4 md:px-8 z-40 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* ── TOP HEADER ROW: TITLE, VIBE SPINNER, AND SLIDESHOW CONTROLS ── */}
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 mb-3">
                {/* Left: Title & Live Badge */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,242,255,0.2)]">
                        <Sparkles className="w-3.5 h-3.5 text-[#00f2ff] animate-pulse" />
                        <span className="text-xs font-black tracking-wider text-white uppercase">For You</span>
                    </div>
                    <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                        Personalized from your choices & mindset
                    </span>
                </div>

                {/* Center / Middle: Non-overlapping Vibe Spinner */}
                <div className="shrink-0 flex items-center scale-90 md:scale-100">
                    <VibeSpinnerButton
                        streak={profile?.current_streak || 0}
                        completed={!!profile?.daily_challenge_completed}
                        userId={profile?.id || ''}
                        onClick={() => {
                            audioManager.playClick();
                            navigate('/game/mood');
                        }}
                    />
                </div>

                {/* Right: Slideshow Navigation Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => {
                            audioManager.playClick();
                            scroll('left');
                        }}
                        className="w-7 h-7 rounded-full bg-slate-800/80 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                        title="Previous Story"
                        aria-label="Previous Story"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="w-7 h-7 rounded-full bg-slate-800/80 border border-white/10 hover:border-purple-400 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 text-[10px]"
                        title={isPaused ? "Resume Auto-slideshow" : "Pause Auto-slideshow"}
                        aria-label="Toggle Slideshow"
                    >
                        {isPaused ? <Play className="w-3 h-3 text-cyan-400 ml-0.5" /> : <Pause className="w-3 h-3 text-purple-400" />}
                    </button>

                    <button
                        onClick={() => {
                            audioManager.playClick();
                            scroll('right');
                        }}
                        className="w-7 h-7 rounded-full bg-slate-800/80 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                        title="Next Story"
                        aria-label="Next Story"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            {/* ── MOVING SLIDESHOW HORIZONTAL CAROUSEL ── */}
            <div 
                ref={scrollContainerRef}
                className="max-w-7xl mx-auto flex overflow-x-auto pb-2 pt-1 space-x-3.5 snap-x hide-scrollbar scroll-smooth"
            >
                {recommendedStories.map((level, i) => {
                    const storyId = level.scenarioId || level.id;
                    const tags = storyTagsMap[storyId] || [];

                    return (
                        <div 
                            key={`${level.id}-${i}`}
                            className="snap-start shrink-0 w-60 md:w-64 rounded-2xl border border-white/10 hover:border-cyan-400/80 bg-gradient-to-b from-slate-800/60 to-slate-900/90 overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(0,242,255,0.25)] hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between group"
                            onClick={() => {
                                audioManager.playClick();
                                onPlayLevel(level);
                            }}
                        >
                            {/* Card Image Banner */}
                            <div className="h-28 bg-slate-950 relative overflow-hidden">
                                <img 
                                    src={resolvePersonalityAvatar(level.personality || level.archetype)} 
                                    alt={level.personality}
                                    className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                                
                                {/* Theme & Age Badges */}
                                <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                                    {level.theme && (
                                        <span className="text-[9px] uppercase font-bold tracking-wider bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-md">
                                            {level.theme}
                                        </span>
                                    )}
                                    {level.age && (
                                        <span className="text-[9px] font-mono bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded-md border border-purple-500/40 backdrop-blur-md">
                                            Age {level.age}
                                        </span>
                                    )}
                                </div>

                                {/* Floating Play Icon on Hover */}
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-500 group-hover:text-black text-white flex items-center justify-center transition-all shadow-md">
                                    <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                </div>
                            </div>

                            {/* Card Text & Tags Content */}
                            <div className="p-3 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="text-white font-bold text-xs truncate group-hover:text-cyan-300 transition-colors">
                                        {level.title}
                                    </h3>
                                    <p className="text-slate-400 text-[11px] font-medium truncate mt-0.5">
                                        {level.personality || level.archetype}
                                    </p>
                                </div>
                                
                                {/* Visual Tag Pills */}
                                <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-white/5">
                                    {tags.length > 0 ? (
                                        tags.slice(0, 2).map((tag, idx) => (
                                            <span 
                                                key={idx} 
                                                className="text-[9px] bg-purple-950/60 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono truncate max-w-[100px]"
                                            >
                                                #{tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[9px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                            #recommended
                                        </span>
                                    )}
                                    {tags.length > 2 && (
                                        <span className="text-[8px] text-slate-500 font-mono self-center">
                                            +{tags.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
