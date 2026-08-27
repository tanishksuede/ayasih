import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { getRecommendations } from '../../services/recommendationEngine';
import { Play, Sparkles } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';

export function ForYouCarousel({ onPlayLevel, allLevels }: { onPlayLevel: (l: any) => void, allLevels: any[] }) {
    const profile = useUserStore(state => state.profile);
    const sessionPreferences = useUserStore(state => state.sessionPreferences);
    const [recommendedStories, setRecommendedStories] = useState<any[]>([]);
    const [storyTagsMap, setStoryTagsMap] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            if (!profile?.id) return;
            try {
                const storyIds = await getRecommendations(profile.id, sessionPreferences, 5);
                
                let levelsToDisplay = [];
                if (storyIds.length > 0) {
                    levelsToDisplay = storyIds
                        .map(id => allLevels.find(l => l.id === id))
                        .filter(Boolean);
                }
                
                // Fallback if no matching tags yet (cold start)
                if (levelsToDisplay.length === 0) {
                    const fallback = allLevels
                        .filter(l => !l.title.toLowerCase().includes('coming soon'))
                        .sort(() => 0.5 - Math.random()) // Random shuffle for discovery
                        .slice(0, 5);
                    levelsToDisplay = fallback;
                }
                
                setRecommendedStories(levelsToDisplay);

                // Fetch tags for these stories to display visually
                const ids = levelsToDisplay.map(l => l.id);
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

    if (loading || recommendedStories.length === 0) return null;

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-b border-[#00f2ff]/20 p-4 pt-24 pb-6 z-40 relative">
            <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#00f2ff]" />
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">For You</h2>
            </div>
            
            <div className="flex overflow-x-auto pb-4 space-x-4 snap-x hide-scrollbar">
                {recommendedStories.map((level, i) => (
                    <div 
                        key={level.id + i}
                        className="snap-center shrink-0 w-64 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden cursor-pointer hover:border-[#00f2ff]/50 hover:scale-105 transition-all"
                        onClick={() => {
                            audioManager.playClick();
                            onPlayLevel(level);
                        }}
                    >
                        <div className="h-32 bg-black/50 relative">
                            <img 
                                src={resolvePersonalityAvatar(level.personality || level.archetype)} 
                                alt={level.personality}
                                className="w-full h-full object-cover opacity-60 mix-blend-screen"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                            <div className="absolute bottom-2 left-3 flex space-x-1">
                                {level.theme && (
                                    <span className="text-[10px] uppercase tracking-wider bg-[#00f2ff]/20 text-[#00f2ff] px-2 py-0.5 rounded border border-[#00f2ff]/30">
                                        {level.theme}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1 pr-2">
                                    <h3 className="text-white font-bold text-sm truncate">{level.title}</h3>
                                    <p className="text-gray-400 text-xs truncate mt-0.5">{level.personality || level.archetype}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#00f2ff]/20 flex items-center justify-center shrink-0">
                                    <Play className="w-4 h-4 text-[#00f2ff] ml-0.5" />
                                </div>
                            </div>
                            
                            {/* Visual Tags Pills */}
                            {storyTagsMap[level.id] && storyTagsMap[level.id].length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {storyTagsMap[level.id].slice(0, 3).map((tag, idx) => (
                                        <span 
                                            key={idx} 
                                            className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-md font-mono"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
