import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, AlertTriangle, UserPlus, Trash2, Shield, Search, BarChart2, Activity } from 'lucide-react';
import { supabase } from '../utils/supabase';
import clsx from 'clsx';
import FeedbackDashboard from '../components/admin/FeedbackDashboard';

export function AdminPanelPage() {
    const navigate = useNavigate();

    // Admin auth — read persisted Google email from localStorage
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        const checkAdmin = async () => {
            const email = localStorage.getItem('aya_google_email');
            if (!email) { setIsAdmin(false); return; }
            setCurrentEmail(email);
            // Founder always gets access
            if (email === 'anitadhakad333@gmail.com') { setIsAdmin(true); return; }
            // Other admins: check database
            try {
                const { data } = await supabase.from('admin_users').select('email').eq('email', email).maybeSingle();
                setIsAdmin(!!data);
            } catch {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, []);

    // Notification state
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [notifStatus, setNotifStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [notifMessage, setNotifMessage] = useState('');

    // Admin management state
    const [adminList, setAdminList] = useState<{ id: string; email: string }[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adminStatus, setAdminStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle');
    const [adminMessage, setAdminMessage] = useState('');

    // Load admin list
    useEffect(() => {
        if (isAdmin) {
            loadAdmins();
        }
    }, [isAdmin]);

    const loadAdmins = async () => {
        try {
            const { data, error } = await supabase.from('admin_users').select('id, email').order('created_at', { ascending: true });
            if (error) throw error;
            setAdminList(data || []);
        } catch (err: any) {
            console.error('Failed to load admins:', err);
        }
    };

    const handleAddAdmin = async () => {
        const email = newAdminEmail.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            setAdminStatus('error');
            setAdminMessage('Please enter a valid email address.');
            return;
        }
        if (adminList.some(a => a.email === email)) {
            setAdminStatus('error');
            setAdminMessage('This email is already an admin.');
            return;
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
            setAdminStatus('error');
            setAdminMessage(err.message || 'Failed to add admin.');
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        if (email === 'anitadhakad333@gmail.com') {
            setAdminStatus('error');
            setAdminMessage('Cannot remove the founder account.');
            return;
        }
        try {
            const { error } = await supabase.from('admin_users').delete().eq('id', id);
            if (error) throw error;
            setAdminStatus('success');
            setAdminMessage(`${email} removed.`);
            await loadAdmins();
        } catch (err: any) {
            setAdminStatus('error');
            setAdminMessage(err.message || 'Failed to remove admin.');
        }
    };

    // Diagnostic state
    const [subCount, setSubCount] = useState<number | null>(null);
    const [subCheckLoading, setSubCheckLoading] = useState(false);

    const handleCheckSubs = async () => {
        setSubCheckLoading(true);
        try {
            const res = await fetch('/api/subscribe-push', {
                headers: {
                    'x-admin-email': currentEmail
                }
            });
            const data = await res.json();
            setSubCount(data.count ?? 0);
        } catch (err: any) {
            setSubCount(-1); // error indicator
        }
        setSubCheckLoading(false);
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            setNotifStatus('error');
            setNotifMessage('Title and body are required.');
            return;
        }

        setNotifStatus('sending');
        try {
            const res = await fetch('/api/send-notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-email': currentEmail
                },
                body: JSON.stringify({ title, body, url: '/game' }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();
            
            if (data.sent === 0 && data.total === 0) {
                setNotifStatus('error');
                setNotifMessage('No registered devices found. Users must enable notifications in Settings to register their device.');
            } else if (data.failed > 0) {
                setNotifStatus('error');
                setNotifMessage(`Sent to ${data.sent} device(s), but failed for ${data.failed} device(s).`);
            } else {
                setNotifStatus('success');
                setNotifMessage(`Notification broadcasted successfully to ${data.sent} device(s)!`);
                setTitle('');
                setBody('');
            }
        } catch (err: any) {
            console.error('Broadcast error:', err);
            setNotifStatus('error');
            setNotifMessage(err.message || 'An unexpected error occurred.');
        }
    };

    // Loading state
    if (isAdmin === null) {
        return (
            <div className="min-h-[100dvh] bg-[#0a0510] flex items-center justify-center">
                <div className="text-purple-300 text-lg animate-pulse">Verifying admin access...</div>
            </div>
        );
    }

    // Access denied
    if (!isAdmin) {
        return (
            <div className="min-h-[100dvh] bg-[#0a0510] flex items-center justify-center p-6">
                <div className="bg-red-900/40 p-6 rounded-2xl border border-red-500/50 text-center">
                    <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
                    <h2 className="text-xl font-bold text-red-100 mb-2">Access Denied</h2>
                    <p className="text-red-200 mb-4">You do not have permission to view this page.</p>
                    <p className="text-red-300/60 text-xs mb-6">Logged in as: {currentEmail || 'unknown'}</p>
                    <button onClick={() => navigate('/game')} className="px-6 py-2 bg-red-600 rounded-full font-bold text-white">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] bg-[#0a0510] text-white p-6 md:p-12 relative overflow-y-auto overflow-x-hidden pb-32">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate('/game')} 
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ChevronLeft size={20} /> Back to Map
                </button>

                <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300">
                    Admin Panel
                </h1>
                <p className="text-slate-400 mb-8">Logged in as <span className="text-purple-300">{currentEmail}</span></p>

                {/* ── SECTION 1: Broadcast Notifications ── */}
                <form onSubmit={handleBroadcast} className="glass-panel rounded-3xl p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-bold text-purple-200 mb-6 flex items-center gap-2">
                        <Send size={20} /> Broadcast Notification
                    </h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-purple-200 mb-2 uppercase tracking-wider">Notification Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                            placeholder="e.g. New Story Unlocked!"
                            maxLength={50}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-purple-200 mb-2 uppercase tracking-wider">Notification Body</label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all min-h-[100px] resize-y"
                            placeholder="e.g. Tap here to discover your future archetype..."
                            maxLength={150}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {notifStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`mb-6 p-4 rounded-xl border ${
                                    notifStatus === 'success' ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' :
                                    notifStatus === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-200' :
                                    'bg-blue-900/30 border-blue-500/50 text-blue-200'
                                }`}
                            >
                                {notifStatus === 'sending' ? 'Broadcasting to all users...' : notifMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Diagnostic: Check registered devices */}
                    <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Devices</p>
                                <p className="text-lg font-black text-white">
                                    {subCount === null ? '—' : subCount === -1 ? 'Error' : subCount}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCheckSubs}
                                disabled={subCheckLoading}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider"
                            >
                                {subCheckLoading ? 'Checking...' : 'Check DB'}
                            </button>
                        </div>
                        {subCount === 0 && (
                            <p className="text-xs text-amber-400 mt-2">⚠️ No devices registered yet. Users must click "Test Push" in Settings to register.</p>
                        )}
                    </div>

                    <button 
                        type="submit"
                        disabled={notifStatus === 'sending'}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                        {notifStatus === 'sending' ? 'SENDING...' : 'BROADCAST NOTIFICATION'}
                    </button>
                </form>

                {/* ── SECTION 2: Manage Admins ── */}
                <div className="glass-panel rounded-3xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-purple-200 mb-6 flex items-center gap-2">
                        <Shield size={20} /> Manage Admins
                    </h2>

                    {/* Add new admin */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="email"
                            value={newAdminEmail}
                            onChange={e => setNewAdminEmail(e.target.value)}
                            className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                            placeholder="Enter Gmail ID to add as admin..."
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAdmin())}
                        />
                        <button
                            type="button"
                            onClick={handleAddAdmin}
                            disabled={adminStatus === 'adding'}
                            className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            Add
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {adminStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`mb-6 p-3 rounded-xl border text-sm ${
                                    adminStatus === 'success' ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' :
                                    adminStatus === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-200' :
                                    'bg-blue-900/30 border-blue-500/50 text-blue-200'
                                }`}
                            >
                                {adminStatus === 'adding' ? 'Adding admin...' : adminMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Admin list */}
                    <div className="space-y-2">
                        {adminList.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-4">No admins found.</p>
                        ) : (
                            adminList.map(admin => (
                                <div key={admin.id} className="flex items-center justify-between bg-black/30 border border-purple-500/10 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 text-sm font-bold">
                                            {admin.email[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm text-white">
                                            {admin.email}
                                            {admin.email === 'anitadhakad333@gmail.com' && (
                                                <span className="ml-2 text-xs text-fuchsia-400 font-bold">FOUNDER</span>
                                            )}
                                        </span>
                                    </div>
                                    {admin.email !== 'anitadhakad333@gmail.com' && (
                                        <button
                                            onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-all"
                                            title="Remove admin"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <SearchAnalyticsView />
                
                <div className="mt-8">
                    <FeedbackDashboard />
                </div>
            </div>
        </div>
    );
}


// --- SEARCH ANALYTICS COMPONENT ---
function SearchAnalyticsView() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<number>(7); // 7, 30, 0 (all)

    useEffect(() => {
        loadLogs();
    }, [range]);

    const loadLogs = async () => {
        setLoading(true);
        let query = supabase.from('search_logs').select('*').order('created_at', { ascending: false });
        if (range !== 0) {
            const date = new Date();
            date.setDate(date.getDate() - range);
            query = query.gte('created_at', date.toISOString());
        }
        const { data } = await query;
        setLogs(data || []);
        setLoading(false);
    };

    // 1. Top searched terms
    const topSearches = (Object.entries(
        logs.reduce((acc, log) => {
            acc[log.query] = (acc[log.query] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // 2. Personality vs Situation
    const isPersonality = (log: any) => /[A-Z]/.test(log.query_original);
    const personalityCount = logs.filter(isPersonality).length;
    const situationCount = logs.length - personalityCount;

    // 3. Unmatched volume over time
    const unmatchedByDate = (Object.entries(
        logs.filter(l => !l.matched).reduce((acc, log) => {
            const date = new Date(log.created_at).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);

    // 4. Raw recent searches
    const recentSearches = logs.slice(0, 50);

    // 5. Most requested missing personalities
    const missingPersonalities = (Object.entries(
        logs.filter(l => !l.matched && isPersonality(l)).reduce((acc, log) => {
            acc[log.query] = (acc[log.query] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 mt-8 border border-[#00f2ff]/20 shadow-[0_0_30px_rgba(0,242,255,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ff]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-bold text-[#00f2ff] flex items-center gap-2">
                    <Search size={20} /> Search Analytics
                </h2>
                <select 
                    value={range} 
                    onChange={e => setRange(Number(e.target.value))}
                    className="bg-black/40 border border-[#00f2ff]/30 rounded-xl px-3 py-1.5 text-sm text-[#00f2ff] outline-none"
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={0}>All Time</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center text-[#00f2ff]/60 py-10 animate-pulse">Loading analytics...</div>
            ) : logs.length === 0 ? (
                <div className="text-center text-[#00f2ff]/60 py-10">No search logs found for this period.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    
                    {/* Top Searches */}
                    <div className="bg-black/30 border border-[#00f2ff]/10 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <BarChart2 size={16} className="text-[#00f2ff]" /> Top Searches
                        </h3>
                        <div className="space-y-2">
                            {topSearches.map(([q, count], i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300">{q}</span>
                                    <span className="text-[#00f2ff] font-bold bg-[#00f2ff]/10 px-2 rounded-md">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Missing Personalities */}
                    <div className="bg-black/30 border border-fuchsia-500/20 rounded-2xl p-5 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)]">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Activity size={16} className="text-fuchsia-400" /> Missing Requests
                        </h3>
                        <div className="space-y-2">
                            {missingPersonalities.length === 0 ? (
                                <p className="text-sm text-slate-500">No missing personalities noted.</p>
                            ) : missingPersonalities.map(([q, count], i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-fuchsia-200 capitalize">{q}</span>
                                    <span className="text-fuchsia-400 font-bold bg-fuchsia-400/10 px-2 rounded-md">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Split & Volume */}
                    <div className="bg-black/30 border border-[#00f2ff]/10 rounded-2xl p-5 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-black text-[#00f2ff]">{personalityCount}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Personalities</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-slate-500">vs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-emerald-400">{situationCount}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">Situations</div>
                            </div>
                        </div>
                        <div className="border-t border-white/5 pt-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Unmatched Volume (Last 14 days)</h4>
                            <div className="flex items-end gap-1 h-16 w-full opacity-80">
                                {unmatchedByDate.length === 0 && <span className="text-xs text-slate-600">No unmatched data</span>}
                                {unmatchedByDate.map(([, count], i) => {
                                    const max = Math.max(...unmatchedByDate.map(d => d[1]), 1);
                                    const height = Math.max(10, (count / max) * 100);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                            <div className="w-full bg-fuchsia-500/50 hover:bg-fuchsia-400 rounded-t-sm transition-all" style={{ height: `${height}%` }} />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-xs px-1 rounded hidden group-hover:block z-20">
                                                {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Raw Feed */}
                    <div className="bg-black/30 border border-[#00f2ff]/10 rounded-2xl p-5 md:col-span-2">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Live Search Feed</h3>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {recentSearches.map(log => (
                                <div key={log.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className={clsx(
                                            "w-2 h-2 rounded-full",
                                            log.matched ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                        )} />
                                        <span className="text-slate-300 font-medium">"{log.query_original}"</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>{isPersonality(log) ? 'Person' : 'Situation'}</span>
                                        <span>{new Date(log.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

