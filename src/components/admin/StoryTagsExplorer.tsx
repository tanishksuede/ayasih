import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Tag, Search, Sparkles } from 'lucide-react';

interface StoryTagItem {
    story_id: string;
    tag_name: string;
    weight: number;
}

export function StoryTagsExplorer() {
    const [tagsData, setTagsData] = useState<StoryTagItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('story_tags')
                .select('*')
                .order('tag_name', { ascending: true });

            if (!error && data) {
                setTagsData(data);
            }
        } catch (err) {
            console.error('Failed to load story tags:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group tags by tag_name
    const tagFrequencies: Record<string, number> = {};
    const storyGroups: Record<string, string[]> = {};

    tagsData.forEach(item => {
        tagFrequencies[item.tag_name] = (tagFrequencies[item.tag_name] || 0) + 1;
        if (!storyGroups[item.story_id]) storyGroups[item.story_id] = [];
        storyGroups[item.story_id].push(item.tag_name);
    });

    const uniqueTags = Object.entries(tagFrequencies).sort((a, b) => b[1] - a[1]);
    const uniqueStories = Object.keys(storyGroups);

    // Filter stories
    const filteredStories = uniqueStories.filter(storyId => {
        const matchesSearch = storyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (storyGroups[storyId] && storyGroups[storyId].some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesTag = selectedTag ? storyGroups[storyId]?.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 mt-8 border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-[#00f2ff] flex items-center gap-2">
                        <Sparkles size={20} className="text-[#00f2ff]" /> Story Tags & Embeddings Explorer
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        Visualizing live AI tags across {uniqueStories.length} stories ({tagsData.length} tag connections)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search stories or tags..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-black/40 border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2ff]"
                    />
                </div>
            </div>

            {/* Tag Cloud / Filter Pills */}
            <div className="mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Tag size={12} /> Top Extracted Topics ({uniqueTags.length} Unique Tags)
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-black/30 rounded-xl border border-white/5">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            selectedTag === null 
                                ? 'bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                                : 'bg-slate-800/60 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                        All ({uniqueStories.length})
                    </button>
                    {uniqueTags.map(([tag, count]) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                                selectedTag === tag 
                                    ? 'bg-purple-500/30 text-purple-200 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                    : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-700'
                            }`}
                        >
                            #{tag} <span className="text-[10px] opacity-60 ml-1">({count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Grid with Visual Tags */}
            {loading ? (
                <div className="text-center py-8 text-slate-400 text-xs animate-pulse">Loading tags from Supabase...</div>
            ) : filteredStories.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No matching stories found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                    {filteredStories.map(storyId => (
                        <div 
                            key={storyId} 
                            className="bg-black/40 border border-white/10 hover:border-purple-500/40 rounded-xl p-3.5 transition-all flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs text-white font-bold truncate max-w-[200px]">
                                    {storyId.replace('lvl_age_', 'Age ').replace('scenario_', '')}
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                    ID: {storyId}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {storyGroups[storyId]?.map((tag, idx) => (
                                    <span 
                                        key={idx}
                                        className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                                            selectedTag === tag 
                                                ? 'bg-purple-500/40 text-purple-200 border-purple-400 font-bold'
                                                : 'bg-purple-900/20 text-purple-300 border-purple-700/30'
                                        }`}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
