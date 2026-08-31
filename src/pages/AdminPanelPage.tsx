import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Send, AlertTriangle, UserPlus, Trash2, Shield, 
    Search, BarChart2, Activity, BookOpen, LayoutDashboard, LogOut
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import clsx from 'clsx';
import FeedbackDashboard from '../components/admin/FeedbackDashboard';
import { StoryTagsExplorer } from '../components/admin/StoryTagsExplorer';
import { StoryMetadataAuthoring } from '../components/admin/StoryMetadataAuthoring';
import { StoryRequestsDashboard } from '../components/admin/StoryRequestsDashboard';

export function AdminPanelPage() {
    const navigate = useNavigate();

    // Admin auth
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [currentEmail, setCurrentEmail] = useState('');
    const [activeView, setActiveView] = useState<'overview' | 'feedback' | 'stories' | 'operations'>('overview');

    useEffect(() => {
        let isMounted = true;

        const verifyAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    if (isMounted) setIsAdmin(false);
                    return;
                }
                if (isMounted && session.user?.email) {
                    setCurrentEmail(session.user.email);
                }

                const { data: isAdminData, error } = await supabase.rpc('is_admin_user');
                if (error) throw error;
                
                if (isMounted) {
                    setIsAdmin(!!isAdminData);
                }
            } catch (err) {
                console.error('Admin verification failed:', err);
                if (isMounted) setIsAdmin(false);
            }
        };

        verifyAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, _session: any) => {
            if (event === 'SIGNED_OUT') {
                if (isMounted) setIsAdmin(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                verifyAdmin();
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Operations State
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [notifStatus, setNotifStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [notifMessage, setNotifMessage] = useState('');
    
    
    
    const [adminList, setAdminList] = useState<{ id: string; email: string }[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adminStatus, setAdminStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle');
    const [adminMessage, setAdminMessage] = useState('');
    
    const [subCount, setSubCount] = useState<number | null>(null);
    const [subCheckLoading, setSubCheckLoading] = useState(false);

    useEffect(() => {
        if (isAdmin && activeView === 'operations') {
            loadAdmins();
        }
    }, [isAdmin, activeView]);

    const loadAdmins = async () => {
        try {
            const { data, error } = await supabase.from('admin_users').select('id, email').order('created_at', { ascending: true });
            if (error) throw error;
            setAdminList(data || []);
        } catch (err) {
            console.error('Failed to load admins:', err);
        }
    };

    const handleAddAdmin = async () => {
        const email = newAdminEmail.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            setAdminStatus('error'); setAdminMessage('Please enter a valid email address.'); return;
        }
        if (adminList.some(a => a.email === email)) {
            setAdminStatus('error'); setAdminMessage('This email is already an admin.'); return;
        }
        setAdminStatus('adding');
        try {
            const { error } = await supabase.from('admin_users').insert({ email });
            if (error) throw error;
            setAdminStatus('success');
            setAdminMessage(`${email} added as admin!`);
            setNewAdminEmail('');
            await loadAdmins();
        } catch (err: any) {
            setAdminStatus('error'); setAdminMessage(err.message || 'Failed to add admin.');
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        if (email === 'anitadhakad333@gmail.com') {
            setAdminStatus('error'); setAdminMessage('Cannot remove the founder account.'); return;
        }
        try {
            const { error } = await supabase.from('admin_users').delete().eq('id', id);
            if (error) throw error;
            setAdminStatus('success');
            setAdminMessage(`${email} removed.`);
            await loadAdmins();
        } catch (err: any) {
            setAdminStatus('error'); setAdminMessage(err.message || 'Failed to remove admin.');
        }
    };

    const handleCheckSubs = async () => {
        setSubCheckLoading(true);
        try {
            const res = await fetch('/api/subscribe-push', { headers: { 'x-admin-email': currentEmail } });
            const data = await res.json();
            setSubCount(data.count ?? 0);
        } catch (err) {
            setSubCount(-1);
        }
        setSubCheckLoading(false);
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setNotifStatus('error'); setNotifMessage('Title and body are required.'); return;
        }
        setNotifStatus('sending');  
        try {
            const res = await fetch('/api/send-notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-email': currentEmail },
                body: JSON.stringify({ title, body, url: '/game' }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            
            
            
            if (data.sent === 0 && data.total === 0) {
                setNotifStatus('error'); setNotifMessage('No registered devices found.');
            } else if (data.failed > 0) {
                setNotifStatus('error'); setNotifMessage('Broadcast completed with some failures. See report.');
            } else {
                setNotifStatus('success'); setNotifMessage(`Successfully broadcasted to ${data.sent} device(s)!`);
                setTitle(''); setBody('');
            }
        } catch (err: any) {
            setNotifStatus('error'); setNotifMessage(err.message || 'An unexpected error occurred.');
        }
    };

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-[#0a0510] flex items-center justify-center">
                <div className="text-indigo-400 text-lg animate-pulse font-bold flex items-center gap-3">
                    <Activity className="animate-spin" size={24} /> Authenticating Admin...
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#0a0510] flex items-center justify-center p-6">
                <div className="bg-slate-900/80 p-8 rounded-3xl border border-rose-500/30 text-center max-w-md shadow-2xl">
                    <AlertTriangle className="mx-auto mb-4 text-rose-500" size={56} />
                    <h2 className="text-2xl font-black text-white mb-2">Access Restricted</h2>
                    <p className="text-slate-400 mb-6 font-medium">You must be granted administrative privileges to view this portal.</p>
                    <p className="text-slate-500 text-xs mb-8 font-mono bg-black/40 py-2 rounded-lg">ID: {currentEmail || 'unknown'}</p>
                    <button onClick={() => navigate('/game')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-indigo-500/25">
                        Return to Map
                    </button>
                </div>
            </div>
        );
    }

    const navigation = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'feedback', label: 'Analytics & Feedback', icon: BarChart2 },
        { id: 'stories', label: 'Story Engine', icon: BookOpen },
        { id: 'operations', label: 'Operations & Access', icon: Shield },
    ] as const;

    return (
        <div className="flex h-screen bg-[#0a0510] text-slate-300 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800/60 flex flex-col z-20 shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-2">
                        <Activity size={24} className="text-indigo-500" />
                        Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                activeView === item.id 
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner" 
                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                            )}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-800/60 bg-slate-950/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                            {currentEmail[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{currentEmail.split('@')[0]}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">Administrator</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/game')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-lg transition-colors border border-slate-800 hover:border-slate-700"
                    >
                        <LogOut size={14} /> Exit Portal
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            {/* OVERVIEW */}
                            {activeView === 'overview' && (
                                <div className="space-y-8">
                                    <div className="mb-2">
                                        <h2 className="text-3xl font-black text-white">Platform Overview</h2>
                                        <p className="text-slate-400">High-level metrics and user demand signals.</p>
                                    </div>
                                    <SearchAnalyticsView />
                                    <StoryRequestsDashboard />
                                </div>
                            )}

                            {/* FEEDBACK & ANALYTICS */}
                            {activeView === 'feedback' && (
                                <div className="space-y-6">
                                    <div className="mb-2">
                                        <h2 className="text-3xl font-black text-white">Analytics & Feedback</h2>
                                        <p className="text-slate-400">Deep dive into global metrics, story performance, and user activity.</p>
                                    </div>
                                    <div className="bg-slate-950/40 rounded-3xl border border-slate-800 p-2 md:p-6 shadow-2xl">
                                        <FeedbackDashboard />
                                    </div>
                                </div>
                            )}

                            {/* STORY ENGINE */}
                            {activeView === 'stories' && (
                                <div className="space-y-8">
                                    <div className="mb-2">
                                        <h2 className="text-3xl font-black text-white">Story Engine</h2>
                                        <p className="text-slate-400">Manage tags, offline metadata, and narrative routing.</p>
                                    </div>
                                    <StoryTagsExplorer />
                                    <StoryMetadataAuthoring />
                                </div>
                            )}

                            {/* OPERATIONS */}
                            {activeView === 'operations' && (
                                <div className="space-y-8 max-w-4xl">
                                    <div className="mb-2">
                                        <h2 className="text-3xl font-black text-white">Operations & Access</h2>
                                        <p className="text-slate-400">Broadcast push notifications and manage admin privileges.</p>
                                    </div>

                                    <form onSubmit={handleBroadcast} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <Send size={18} className="text-indigo-400" /> Push Notifications
                                        </h3>
                                        
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Title</label>
                                                <input
                                                    type="text" value={title} onChange={e => setTitle(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    placeholder="e.g. New Story Unlocked!" maxLength={50}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Message Body</label>
                                                <textarea
                                                    value={body} onChange={e => setBody(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[100px] resize-y"
                                                    placeholder="e.g. Tap here to discover your future archetype..." maxLength={150}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Devices</p>
                                                    <p className="text-lg font-black text-white">{subCount === null ? '—' : subCount === -1 ? 'Error' : subCount}</p>
                                                </div>
                                                <button
                                                    type="button" onClick={handleCheckSubs} disabled={subCheckLoading}
                                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    {subCheckLoading ? 'Checking...' : 'Refresh Count'}
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {notifStatus !== 'idle' && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                        className={`p-4 rounded-xl border text-sm font-medium ${
                                                            notifStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                                            notifStatus === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                                                            'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                                        }`}
                                                    >
                                                        {notifStatus === 'sending' ? 'Broadcasting out to devices...' : notifMessage}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <button 
                                                type="submit" disabled={notifStatus === 'sending'}
                                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50"
                                            >
                                                {notifStatus === 'sending' ? 'SENDING...' : 'BROADCAST NOTIFICATION'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <Shield size={18} className="text-emerald-400" /> Administrative Access
                                        </h3>

                                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                            <input
                                                type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)}
                                                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Enter email to grant access..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAdmin())}
                                            />
                                            <button
                                                type="button" onClick={handleAddAdmin} disabled={adminStatus === 'adding'}
                                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <UserPlus size={18} /> Add Admin
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {adminStatus !== 'idle' && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                    className={`mb-6 p-3 rounded-xl border text-sm font-medium ${
                                                        adminStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                                        adminStatus === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                                                        'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                                    }`}
                                                >
                                                    {adminStatus === 'adding' ? 'Processing...' : adminMessage}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="space-y-2">
                                            {adminList.length === 0 ? (
                                                <p className="text-slate-500 text-sm text-center py-6 border border-dashed border-slate-700 rounded-xl">No admins found.</p>
                                            ) : (
                                                adminList.map(admin => (
                                                    <div key={admin.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                                                                {admin.email[0].toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-200">
                                                                {admin.email}
                                                                {admin.email === 'anitadhakad333@gmail.com' && (
                                                                    <span className="ml-3 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">FOUNDER</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {admin.email !== 'anitadhakad333@gmail.com' && (
                                                            <button
                                                                onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                                                className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-all"
                                                                title="Revoke access"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// --- SEARCH ANALYTICS COMPONENT ---
function SearchAnalyticsView() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<number>(7);

    useEffect(() => { loadLogs(); }, [range]);

    const loadLogs = async () => {
        setLoading(true);
        let query = supabase.from('search_demand_analytics').select('*').order('created_at', { ascending: false });
        if (range !== 0) {
            const date = new Date();
            date.setDate(date.getDate() - range);
            query = query.gte('created_at', date.toISOString());
        }
        const { data } = await query;
        setLogs(data || []);
        setLoading(false);
    };

    const topSearches = (Object.entries(
        logs.reduce((acc, log) => { acc[log.query_text] = (acc[log.query_text] || 0) + 1; return acc; }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const isPersonality = (log: any) => /[A-Z]/.test(log.query_text);
    const personalityCount = logs.filter(isPersonality).length;
    const situationCount = logs.length - personalityCount;

    const unmatchedByDate = (Object.entries(
        logs.filter(l => l.match_count === 0).reduce((acc, log) => {
            const date = new Date(log.created_at).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1; return acc;
        }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);

    
    const missingPersonalities = (Object.entries(
        logs.filter(l => l.match_count === 0 && isPersonality(l)).reduce((acc, log) => {
            acc[log.query_text] = (acc[log.query_text] || 0) + 1; return acc;
        }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Search size={20} className="text-cyan-400" /> Search Analytics
                </h3>
                <select 
                    value={range} onChange={e => setRange(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-cyan-500"
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={0}>All Time</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-10 font-medium">Loading search data...</div>
            ) : logs.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No search logs found for this period.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                    
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-black text-cyan-400">{personalityCount}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Personas</div>
                            </div>
                            <div className="text-xl font-black text-slate-700">VS</div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-indigo-400">{situationCount}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Situations</div>
                            </div>
                        </div>
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Unmatched Demand Volume</h4>
                            <div className="flex items-end gap-1 h-16 w-full">
                                {unmatchedByDate.length === 0 && <span className="text-xs text-slate-600">No unmatched data</span>}
                                {unmatchedByDate.map(([, count], i) => {
                                    const max = Math.max(...unmatchedByDate.map(d => d[1]), 1);
                                    const height = Math.max(10, (count / max) * 100);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                            <div className="w-full bg-rose-500/30 hover:bg-rose-400 rounded-sm transition-all" style={{ height: `${height}%` }} />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-1.5 py-0.5 rounded hidden group-hover:block z-20 text-white font-bold">
                                                {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                            Top Searches
                            <Activity size={14} className="text-cyan-400" />
                        </h4>
                        <div className="space-y-2.5">
                            {topSearches.map(([q, count], i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300 font-medium truncate pr-2">{q}</span>
                                    <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                            Missing Personas
                            <Activity size={14} className="text-rose-400" />
                        </h4>
                        <div className="space-y-2.5">
                            {missingPersonalities.length === 0 ? (
                                <p className="text-sm text-slate-500">None recently.</p>
                            ) : missingPersonalities.map(([q, count], i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-sm text-rose-200 font-medium truncate pr-2 capitalize">{q}</span>
                                    <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
