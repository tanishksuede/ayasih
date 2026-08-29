import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { getRecommendationsV2, logRecommendationClick } from '../../services/recommendationEngine';
import { Play, Sparkles, Pause, Lock } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';
import { VibeSpinnerButton } from '../MoodWheel/VibeSpinnerButton';
import { useNavigate } from 'react-router-dom';
import type { ScoredStory } from '../../types/ayaTypes';

interface ForYouCarouselProps {
    onPlayLevel: (l: any) => void;
    allLevels: any[];
}

export function ForYouCarousel({ onPlayLevel, allLevels }: ForYouCarouselProps) {
    const navigate = useNavigate();
    const profile = useUserStore(state => state.profile);
    const sessionPreferences = useUserStore(state => state.sessionPreferences);
    const checkinData = useUserStore(state => state.checkinData);
    const levelScores = useUserStore(state => state.levelScores);
    const setShowSubscriptionModal = useUserStore(state => state.setShowSubscriptionModal);
    
    const [recommendedStories, setRecommendedStories] = useState<any[]>([]);
    const [storyExplanations, setStoryExplanations] = useState<Record<string, ScoredStory>>({});
    const [storyTagsMap, setStoryTagsMap] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [decisionId, setDecisionId] = useState<string | undefined>();

    useEffect(() => {
        const fetchRecs = async () => {
            if (!profile?.id) return;
            try {
                const completedIds = Object.keys(levelScores || {});
                
                const recResponse = await getRecommendationsV2({
                    user_id: profile.id,
                    dna_traits: {
                        risk: profile.traits?.risk ?? 50,
                        creativity: profile.traits?.creativity ?? 50,
                        vision: profile.traits?.vision ?? 50,
                        empathy: profile.traits?.empathy ?? 50,
                        leadership: profile.traits?.leadership ?? 50,
                    },
                    onboarding_scores: profile.onboarding_scores ? {
                        risk: profile.onboarding_scores.risk ?? 50,
                        creativity: profile.onboarding_scores.creativity ?? 50,
                        vision: profile.onboarding_scores.vision ?? 50,
                        empathy: profile.onboarding_scores.empathy ?? 50,
                        leadership: profile.onboarding_scores.leadership ?? 50,
                    } : undefined,
                    checkin_data: checkinData || undefined,
                    session_preferences: sessionPreferences,
                    completed_story_ids: completedIds,
                    age: profile.age || 18,
                    access_tier: (profile.access_type || 'free') as any,
                    limit: 8
                });
                
                setDecisionId(recResponse.decision_id);

                const scoredMap: Record<string, ScoredStory> = {};
                (recResponse.stories || []).forEach(s => {
                    scoredMap[s.story_id] = s;
                });
                setStoryExplanations(scoredMap);

                const storyIds = (recResponse.stories || []).map(s => s.story_id);
                
                let levelsToDisplay: any[] = [];
                if (storyIds.length > 0) {
                    levelsToDisplay = storyIds
                        .map(id => allLevels.find(l => (l.scenarioId || l.id) === id || l.id === id))
                        .filter(Boolean);
                }
                
                // Fallback if no matching stories in metadata yet
                if (levelsToDisplay.length < 5) {
                    const fallback = allLevels
                        .filter(l => !l.title.toLowerCase().includes('coming soon') && !levelsToDisplay.some(d => d.id === l.id))
                        .sort((a, b) => {
                            const aDone = completedIds.includes(a.id) || completedIds.includes(a.scenarioId);
                            const bDone = completedIds.includes(b.id) || completedIds.includes(b.scenarioId);
                            if (aDone !== bDone) return aDone ? 1 : -1;
                            return 0.5 - Math.random();
                        })
                        .slice(0, 8 - levelsToDisplay.length);
                    levelsToDisplay = [...levelsToDisplay, ...fallback];
                }
                
                setRecommendedStories(levelsToDisplay);

                // Fetch tags for display
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
    }, [profile?.id, profile?.stories_completed, profile?.traits, sessionPreferences, checkinData, levelScores, allLevels]);


    // 3x duplication for a seamless, 33.333% infinite continuous loop
    const marqueeItems = useMemo(() => {
        if (recommendedStories.length === 0) return [];
        return [...recommendedStories, ...recommendedStories, ...recommendedStories];
    }, [recommendedStories]);

    if (loading || recommendedStories.length === 0) return null;

    // Animation duration based on number of items for consistent smooth glide speed
    const duration = Math.max(30, recommendedStories.length * 5.5);

    return (
        <div 
            className="w-full bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-transparent backdrop-blur-xl border-b border-cyan-500/20 pt-20 md:pt-24 pb-5 z-40 relative shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden"
        >
            {/* Embedded Pure CSS Keyframes for True Resumable Pause */}
            <style>{`
                @keyframes ayaSeamlessMarquee {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-33.333333%, 0, 0);
                    }
                }
                .aya-marquee-track {
                    display: flex;
                    gap: 1rem;
                    width: max-content;
                    animation: ayaSeamlessMarquee ${duration}s linear infinite;
                    will-change: transform;
                }
                .aya-marquee-track:hover {
                    animation-play-state: paused !important;
                }
                .aya-marquee-track.is-paused {
                    animation-play-state: paused !important;
                }
            `}</style>

            {/* ── TOP HEADER ROW: TITLE & VIBE SPINNER (NO OVERLAP) ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-3 mb-3">
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

                {/* Center / Right: Non-overlapping Vibe Spinner + Pause indicator */}
                <div className="flex items-center gap-3">
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

                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="w-7 h-7 rounded-full bg-slate-800/80 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 text-[10px]"
                        title={isPaused ? "Resume Slideshow" : "Pause Slideshow"}
                        aria-label="Toggle Slideshow"
                    >
                        {isPaused ? <Play className="w-3 h-3 text-cyan-400 ml-0.5" /> : <Pause className="w-3 h-3 text-purple-400" />}
                    </button>
                </div>
            </div>
            
            {/* ── SEAMLESS MOVING SLIDESHOW MARQUEE (NO SCROLLBAR & PERFECT PAUSE/RESUME) ── */}
            <div className="relative w-full overflow-hidden py-1">
                {/* Edge fade gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <div 
                    className={`aya-marquee-track px-4 cursor-pointer ${isPaused ? 'is-paused' : ''}`}
                >
                    {marqueeItems.map((level, i) => {
                        const storyId = level.scenarioId || level.id;
                        const tags = storyTagsMap[storyId] || [];
                        const recData = storyExplanations[storyId];
                        const isLocked = recData?.requires_upgrade;
                        const explanationText = recData?.explanation?.primary;
                        const recMode = recData?.recommendation_mode;

                        return (
                            <div 
                                key={`${level.id}-${i}`}
                                className={`shrink-0 w-60 md:w-64 rounded-2xl border ${
                                    isLocked ? 'border-amber-500/30 bg-slate-950/90' : 'border-white/10 hover:border-cyan-400/90 bg-gradient-to-b from-slate-800/80 to-slate-950/95'
                                } overflow-hidden hover:shadow-[0_0_25px_rgba(0,242,255,0.3)] hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between group select-none relative`}
                                onClick={() => {
                                    audioManager.playClick();
                                    if (decisionId) {
                                        logRecommendationClick(decisionId, storyId);
                                    }
                                    if (isLocked) {
                                        setShowSubscriptionModal(true);
                                    } else {
                                        onPlayLevel(level);
                                    }
                                }}
                            >
                                {/* Card Image Banner */}
                                <div className="h-28 bg-slate-950 relative overflow-hidden">
                                    <img 
                                        src={resolvePersonalityAvatar(level.personality || level.archetype)} 
                                        alt={level.personality}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                                    
                                    {/* Theme & Mode Badges */}
                                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                                        {recMode === 'challenge' ? (
                                            <span className="text-[9px] uppercase font-bold tracking-wider bg-rose-950/90 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/40 backdrop-blur-md shadow-sm">
                                                Growth Challenge
                                            </span>
                                        ) : (
                                            level.theme && (
                                                <span className="text-[9px] uppercase font-bold tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-md shadow-sm">
                                                    {level.theme}
                                                </span>
                                            )
                                        )}
                                        {level.age && (
                                            <span className="text-[9px] font-mono bg-purple-950/90 text-purple-300 px-1.5 py-0.5 rounded-md border border-purple-500/40 backdrop-blur-md shadow-sm">
                                                Age {level.age}
                                            </span>
                                        )}
                                    </div>

                                    {/* Play / Lock icon indicator */}
                                    <div className={`absolute top-2 right-2 w-7 h-7 rounded-full ${
                                        isLocked
                                            ? 'bg-amber-500/30 border border-amber-400 text-amber-300'
                                            : 'bg-black/70 border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 text-white'
                                    } flex items-center justify-center transition-all shadow-md`}>
                                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                                    </div>
                                </div>

                                {/* Card Text & Explanation Content */}
                                <div className="p-3 flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="text-white font-bold text-xs truncate group-hover:text-cyan-300 transition-colors">
                                            {level.title}
                                        </h3>
                                        <p className="text-slate-400 text-[11px] font-medium truncate mt-0.5">
                                            {level.personality || level.archetype}
                                        </p>
                                    </div>

                                    {/* Explainability snippet ("Why this story?") */}
                                    {explanationText && (
                                        <p className="text-[10px] text-cyan-200/90 bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-1.5 mt-2 line-clamp-2 italic">
                                            "{explanationText}"
                                        </p>
                                    )}
                                    
                                    {/* Visual Tag Pills */}
                                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-white/5">
                                        {tags.length > 0 ? (
                                            tags.slice(0, 2).map((tag, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="text-[9px] bg-purple-950/70 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono truncate max-w-[100px]"
                                                >
                                                    #{tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[9px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                                #recommended
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
