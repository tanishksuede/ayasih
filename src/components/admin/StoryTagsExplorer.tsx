import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils/supabase';
import { Tag, Search, Sparkles, User, Calendar, X, ChevronRight } from 'lucide-react';
import { generateLevels } from '../../utils/levelGenerator';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';

interface StoryTagItem {
    story_id: string;
    tag_name: string;
    weight: number;
}

export function StoryTagsExplorer() {
    const [tagsData, setTagsData] = useState<StoryTagItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAge, setSelectedAge] = useState<number | 'all'>('all');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

    // Get all master levels with rich personality metadata
    const allLevels = useMemo(() => {
        return generateLevels(18);
    }, []);

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

    // Map story_id to array of tags
    const storyTagsMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        tagsData.forEach(item => {
            if (!map[item.story_id]) map[item.story_id] = [];
            map[item.story_id].push(item.tag_name);
        });
        return map;
    }, [tagsData]);

    // Tag frequencies
    const tagFrequencies = useMemo(() => {
        const freq: Record<string, number> = {};
        tagsData.forEach(item => {
            freq[item.tag_name] = (freq[item.tag_name] || 0) + 1;
        });
        return Object.entries(freq).sort((a, b) => b[1] - a[1]);
    }, [tagsData]);

    // Available ages
    const availableAges = useMemo(() => {
        const ages = new Set<number>();
        allLevels.forEach(l => {
            if (l.age) ages.add(l.age);
        });
        return Array.from(ages).sort((a, b) => a - b);
    }, [allLevels]);

    // Filter levels
    const filteredLevels = useMemo(() => {
        return allLevels.filter(lvl => {
            const storyId = lvl.scenarioId || lvl.id;
            const tags = storyTagsMap[storyId] || [];

            // Age filter
            if (selectedAge !== 'all' && lvl.age !== selectedAge) return false;

            // Tag filter
            if (selectedTag && !tags.includes(selectedTag)) return false;

            // Search filter
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const matchesName = (lvl.personality || '').toLowerCase().includes(term);
                const matchesTitle = (lvl.title || '').toLowerCase().includes(term);
                const matchesArchetype = (lvl.archetype || '').toLowerCase().includes(term);
                const matchesTag = tags.some(t => t.toLowerCase().includes(term));
                if (!matchesName && !matchesTitle && !matchesArchetype && !matchesTag) return false;
            }

            return true;
        });
    }, [allLevels, selectedAge, selectedTag, searchTerm, storyTagsMap]);

    // Active story object
    const activeLevel = useMemo(() => {
        if (!activeStoryId) return null;
        return allLevels.find(l => (l.scenarioId || l.id) === activeStoryId || l.id === activeStoryId);
    }, [activeStoryId, allLevels]);

    const activeTags = activeLevel ? (storyTagsMap[activeLevel.scenarioId || activeLevel.id] || []) : [];

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 mt-8 border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-[#00f2ff] to-fuchsia-300 flex items-center gap-2">
                        <Sparkles size={20} className="text-[#00f2ff]" /> Personality Story Tags & Embeddings Explorer
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        Select any age or personality to inspect its complete AI topic tags ({tagsData.length} tag connections across {Object.keys(storyTagsMap).length} stories)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search personality, age, or tag..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2ff]"
                    />
                </div>
            </div>

            {/* AGE SELECTOR BAR */}
            <div className="mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#00f2ff]" /> Filter by Age Group:
                </div>
                <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                    <button
                        onClick={() => setSelectedAge('all')}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all ${
                            selectedAge === 'all'
                                ? 'bg-gradient-to-r from-purple-600 to-[#00f2ff] text-white border-transparent shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                                : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        All Ages ({allLevels.length})
                    </button>
                    {availableAges.map(age => {
                        const count = allLevels.filter(l => l.age === age).length;
                        return (
                            <button
                                key={age}
                                onClick={() => setSelectedAge(age)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all ${
                                    selectedAge === age
                                        ? 'bg-[#00f2ff] text-slate-900 border-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.5)]'
                                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-[#00f2ff]/40 hover:bg-slate-800'
                                }`}
                            >
                                Age {age} <span className="text-[10px] opacity-70 ml-0.5">({count})</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TOP TAG PILLS */}
            <div className="mb-6">
                <div className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Tag size={13} className="text-purple-400" /> Filter by Topic Tag ({tagFrequencies.length} Available Tags):
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-2 bg-black/40 rounded-xl border border-white/5">
                    {selectedTag && (
                        <button
                            onClick={() => setSelectedTag(null)}
                            className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1"
                        >
                            <X size={12} /> Clear Filter (#{selectedTag})
                        </button>
                    )}
                    {tagFrequencies.map(([tag, count]) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                                selectedTag === tag
                                    ? 'bg-purple-500/40 text-purple-200 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)] font-bold'
                                    : 'bg-slate-800/40 text-slate-300 border-white/10 hover:bg-slate-700/60'
                            }`}
                        >
                            #{tag} <span className="text-[10px] opacity-60 ml-0.5">({count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT: PERSONALITY GRID & DETAILS MODAL/INSPECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Personalities Grid */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-bold uppercase tracking-wider">
                        <span>Personalities ({filteredLevels.length})</span>
                        <span>Click to view all tags</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-slate-400 text-xs animate-pulse">Loading tags from Supabase...</div>
                    ) : filteredLevels.length === 0 ? (
                        <div className="text-center py-12 bg-black/30 border border-white/5 rounded-2xl text-slate-500 text-xs">
                            No personalities found for the selected Age & Tag filter.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                            {filteredLevels.map(level => {
                                const storyId = level.scenarioId || level.id;
                                const tags = storyTagsMap[storyId] || [];
                                const isSelected = (activeLevel?.scenarioId || activeLevel?.id) === storyId;

                                return (
                                    <div
                                        key={level.id}
                                        onClick={() => setActiveStoryId(storyId)}
                                        className={`group cursor-pointer rounded-2xl border p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-purple-900/60 to-slate-900 border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.25)] scale-[1.02]'
                                                : 'bg-black/40 border-white/10 hover:border-purple-500/40 hover:bg-black/60'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                                                <img
                                                    src={resolvePersonalityAvatar(level.personality || level.archetype)}
                                                    alt={level.personality}
                                                    className="w-full h-full object-cover"
                                                    onError={e => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="text-white font-bold text-sm truncate">
                                                        {level.personality || level.archetype}
                                                    </h4>
                                                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono shrink-0">
                                                        Age {level.age}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs truncate mt-0.5">{level.title}</p>
                                            </div>
                                        </div>

                                        {/* Tag Counter & Mini Pills */}
                                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-black text-[#00f2ff] bg-[#00f2ff]/10 border border-[#00f2ff]/30 px-2 py-0.5 rounded-full">
                                                    {tags.length} Tags
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-purple-300 group-hover:text-white flex items-center gap-0.5 transition-colors">
                                                View Tags <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Detailed Personality Tag Inspector Card */}
                <div className="lg:col-span-1">
                    {activeLevel ? (
                        <div className="bg-gradient-to-b from-purple-900/40 via-slate-900/90 to-black border border-purple-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl sticky top-4">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-full">
                                    Personality Inspector
                                </span>
                                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded-lg">
                                    Age {activeLevel.age}
                                </span>
                            </div>

                            {/* Avatar & Persona Banner */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-[#00f2ff]/40 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
                                    <img
                                        src={resolvePersonalityAvatar(activeLevel.personality || activeLevel.archetype)}
                                        alt={activeLevel.personality}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">{activeLevel.personality}</h3>
                                    <p className="text-xs text-[#00f2ff] font-medium">{activeLevel.archetype}</p>
                                    <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{activeLevel.theme}</p>
                                </div>
                            </div>

                            {/* Story Title & Scenario */}
                            <div className="bg-black/50 border border-white/10 rounded-xl p-3 mb-4">
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Scenario Title</div>
                                <div className="text-xs font-bold text-slate-200 mt-0.5">{activeLevel.title}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">ID: {activeLevel.scenarioId || activeLevel.id}</div>
                            </div>

                            {/* TAG COUNT BADGE & COMPLETE TAG LIST */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Tag size={13} className="text-[#00f2ff]" /> Attached Tags
                                    </span>
                                    <span className="text-xs font-black text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                        {activeTags.length} Total Tags
                                    </span>
                                </div>

                                {activeTags.length === 0 ? (
                                    <div className="text-xs text-slate-500 italic py-2">No tags found for this scenario yet.</div>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto custom-scrollbar p-3 bg-black/40 border border-white/5 rounded-2xl">
                                        {activeTags.map((tag, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedTag(tag)}
                                                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-900/50 to-fuchsia-900/40 text-purple-200 border border-purple-500/40 hover:border-[#00f2ff] hover:text-white transition-all shadow-sm flex items-center gap-1"
                                                title={`Click to filter other stories with #${tag}`}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lesson / Wisdom snippet */}
                            {activeLevel.lesson && (
                                <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3 text-[11px] text-purple-200 leading-relaxed">
                                    <span className="font-bold text-[#00f2ff] block mb-1">Core Wisdom / Lesson:</span>
                                    {activeLevel.lesson}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full min-h-[320px] bg-black/30 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                                <User size={28} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-300 mb-1">Select a Personality</h4>
                            <p className="text-xs text-slate-500 max-w-[200px]">
                                Click on any story card on the left to inspect its exact tags and AI taxonomy.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
