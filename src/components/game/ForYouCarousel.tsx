import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { getExplainableRecommendations } from '../../services/recommendationEngine';
import type { RecommendationResult } from '../../types/gameTypes';
import { Play, Sparkles, Pause, Compass } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';
import { VibeSpinnerButton } from '../MoodWheel/VibeSpinnerButton';
import { useNavigate } from 'react-router-dom';

interface ForYouCarouselProps {
    onPlayLevel: (l: any) => void;
    allLevels: any[];
    situationQuery?: string;
    situationTags?: string[];
    activeTheme?: string | null;
}

export function ForYouCarousel({
    onPlayLevel,
    allLevels,
    situationQuery = '',
    situationTags = [],
    activeTheme = null,
}: ForYouCarouselProps) {
    const navigate = useNavigate();
    const profile = useUserStore((state) => state.profile);
    const sessionPreferences = useUserStore((state) => state.sessionPreferences);
    const [recommendedStories, setRecommendedStories] = useState<any[]>([]);
    const [recsMap, setRecsMap] = useState<Record<string, RecommendationResult>>({});
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchRecs = async () => {
            if (!allLevels || allLevels.length === 0) return;
            try {
                const combinedTags = [...situationTags];
                if (activeTheme) combinedTags.push(activeTheme);

                const recResults = await getExplainableRecommendations({
                    userId: profile?.id,
                    situationText: situationQuery,
                    situationTags: combinedTags,
                    userProfile: profile,
                    sessionTags: sessionPreferences,
                    allLevels,
                    limit: 10,
                });

                const resultMap: Record<string, RecommendationResult> = {};
                recResults.forEach((r) => {
                    resultMap[r.storyId] = r;
                });
                setRecsMap(resultMap);

                let levelsToDisplay: any[] = [];
                if (recResults.length > 0) {
                    levelsToDisplay = recResults
                        .map((r) => allLevels.find((l) => (l.scenarioId || l.id) === r.storyId || l.id === r.storyId))
                        .filter(Boolean);
                }

                // Fallback if needed
                if (levelsToDisplay.length < 5) {
                    const fallback = allLevels
                        .filter((l) => !l.title?.toLowerCase().includes('coming soon') && !levelsToDisplay.some((d) => d.id === l.id))
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 8 - levelsToDisplay.length);
                    levelsToDisplay = [...levelsToDisplay, ...fallback];
                }

                setRecommendedStories(levelsToDisplay);
            } catch (err) {
                console.error('[ForYouCarousel] Failed to load recommendations', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, [profile, sessionPreferences, allLevels, situationQuery, situationTags, activeTheme]);

    // 3x duplication for a seamless infinite loop
    const marqueeItems = useMemo(() => {
        if (recommendedStories.length === 0) return [];
        return [...recommendedStories, ...recommendedStories, ...recommendedStories];
    }, [recommendedStories]);

    if (loading || recommendedStories.length === 0) return null;

    const duration = Math.max(30, recommendedStories.length * 5.5);

    return (
        <div className="w-full bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-transparent backdrop-blur-xl border-b border-cyan-500/20 pt-20 md:pt-24 pb-5 z-40 relative shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden">
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

            {/* ── TOP HEADER ROW: TITLE & VIBE SPINNER ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-3 mb-3">
                {/* Left: Title & Live Badge */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,242,255,0.2)]">
                        <Sparkles className="w-3.5 h-3.5 text-[#00f2ff] animate-pulse" />
                        <span className="text-xs font-black tracking-wider text-white uppercase">
                            {situationQuery ? 'Situation Matches' : 'For You'}
                        </span>
                    </div>
                    <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                        {situationQuery
                            ? `Aligned with: "${situationQuery.slice(0, 35)}..."`
                            : 'Personalized from your life stage, choices & DNA'}
                    </span>
                </div>

                {/* Right: Vibe Spinner + Pause indicator */}
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
                        title={isPaused ? 'Resume Slideshow' : 'Pause Slideshow'}
                        aria-label="Toggle Slideshow"
                    >
                        {isPaused ? <Play className="w-3 h-3 text-cyan-400 ml-0.5" /> : <Pause className="w-3 h-3 text-purple-400" />}
                    </button>
                </div>
            </div>

            {/* ── SEAMLESS MOVING SLIDESHOW MARQUEE ── */}
            <div className="relative w-full overflow-hidden py-1">
                {/* Edge fade gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className={`aya-marquee-track px-4 cursor-pointer ${isPaused ? 'is-paused' : ''}`}>
                    {marqueeItems.map((level, i) => {
                        const storyId = level.scenarioId || level.id;
                        const recData = recsMap[storyId];
                        const explanation = recData?.explanation || `Explores critical decisions at age ${level.age || 18}.`;
                        const tags = recData?.situationalTags || [];
                        const dilemmaType = recData?.dilemmaType || level.theme || 'Life Decision';

                        return (
                            <div
                                key={`${level.id}-${i}`}
                                className="shrink-0 w-64 md:w-72 rounded-2xl border border-white/10 hover:border-cyan-400/90 bg-gradient-to-b from-slate-800/90 to-slate-950/95 overflow-hidden hover:shadow-[0_0_25px_rgba(0,242,255,0.3)] hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between group select-none relative"
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
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                                    {/* Dilemma Badge */}
                                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 max-w-[80%]">
                                        <span className="text-[9px] uppercase font-black tracking-wider bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-md shadow-sm truncate">
                                            {dilemmaType}
                                        </span>
                                        {level.age && (
                                            <span className="text-[9px] font-mono bg-purple-950/90 text-purple-300 px-1.5 py-0.5 rounded-md border border-purple-500/40 backdrop-blur-md shadow-sm shrink-0">
                                                Age {level.age}
                                            </span>
                                        )}
                                    </div>

                                    {/* Play icon indicator */}
                                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/20 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 text-white flex items-center justify-center transition-all shadow-md">
                                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                    </div>
                                </div>

                                {/* Card Text & Explanation Content */}
                                <div className="p-3.5 flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className="text-white font-bold text-xs truncate group-hover:text-cyan-300 transition-colors">
                                            {level.title}
                                        </h3>
                                        <p className="text-slate-400 text-[11px] font-medium truncate mt-0.5">
                                            Lens: <span className="text-slate-200">{level.personality || level.archetype}</span>
                                        </p>
                                    </div>

                                    {/* "Why this story?" Explanation Pill */}
                                    <div className="mt-2.5 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-200/90 leading-tight">
                                        <div className="flex items-center gap-1 font-bold text-cyan-300 mb-0.5">
                                            <Compass size={11} className="text-cyan-400" />
                                            <span>Why this story?</span>
                                        </div>
                                        <p className="line-clamp-2 text-slate-300 font-medium">
                                            {explanation}
                                        </p>
                                    </div>

                                    {/* Situational Tags */}
                                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/5">
                                        {tags.slice(0, 2).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[9px] bg-purple-950/70 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono truncate max-w-[110px]"
                                            >
                                                #{tag.replace(/_/g, ' ')}
                                            </span>
                                        ))}
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
        </div>
    );
}

