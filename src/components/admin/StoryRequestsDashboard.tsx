import { useEffect, useState } from 'react';
import { getStoryRequestsSummary, type StoryRequestSummary } from '../../services/storyRequestService';
import { CHECKIN_TAGS } from '../../config/recommendationConfig';
import { BarChart2, Bell, Clock } from 'lucide-react';

export function StoryRequestsDashboard() {
    const [requests, setRequests] = useState<StoryRequestSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            const data = await getStoryRequestsSummary();
            setRequests(data);
            setLoading(false);
        };
        fetchSummary();
    }, []);

    const getLabel = (tag: string) => {
        const found = CHECKIN_TAGS.situation.find(s => s.value === tag);
        if (found) return found.label;
        return tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-slate-400 font-mono text-sm animate-pulse">
                Loading story demand requests...
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 mb-8 text-white">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-purple-200 flex items-center gap-2">
                        <BarChart2 size={20} className="text-cyan-400" /> Story Requests & Content Demand
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Direct demand signals from users requesting stories for situations not yet available.
                    </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono">
                    {requests.reduce((acc, r) => acc + r.count, 0)} Total Requests
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
                    No zero-result story requests logged yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(req => (
                        <div 
                            key={req.requested_tag}
                            className="p-4 rounded-2xl bg-slate-950/70 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {getLabel(req.requested_tag)}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        tag: #{req.requested_tag}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="text-xl font-black text-cyan-400 font-mono">
                                        {req.count}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                                        {req.count === 1 ? 'Request' : 'Requests'}
                                    </span>
                                </div>

                                <div className="text-right hidden sm:block">
                                    <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                                        <Clock size={12} className="text-slate-500" />
                                        {new Date(req.most_recent).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                                        Most Recent
                                    </span>
                                </div>

                                <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                                    {req.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
