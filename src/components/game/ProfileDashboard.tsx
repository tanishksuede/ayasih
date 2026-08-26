import { useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { ArrowLeft, Edit3, BookOpen, Star, Flame, Compass, Heart, Brain, Lightbulb, TrendingUp, Trophy, Award, Clock } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import clsx from 'clsx';

interface ProfileDashboardProps {
    onBack: () => void;
}

const TraitBadge = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
    // Convert 0-100 to descriptive words for badges
    let descriptive = "Balanced";
    if (value >= 80) descriptive = "Exceptional";
    else if (value >= 60) descriptive = "Strong";
    else if (value <= 20) descriptive = "Developing";

    return (
        <div className={`flex flex-col items-start p-4 rounded-3xl ${colorClass} bg-opacity-10 border border-white/50 shadow-sm transition-transform hover:-translate-y-1`}>
            <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${colorClass.replace('bg-', 'text-').replace('-50', '-600').replace('-100', '-600')}`}>
                {descriptive}
            </span>
            <span className="text-lg font-black text-slate-800 tracking-tight">
                {label}
            </span>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }: any) => (
    <div className="flex items-center gap-4 p-5 bg-white rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
        <div className={`p-4 rounded-2xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
            <div className="text-2xl font-black text-slate-800">{value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</div>
        </div>
    </div>
);

const AchievementBadge = ({ icon: Icon, label, date, achieved }: any) => (
    <div className={clsx(
        "flex flex-col items-center justify-center p-4 rounded-3xl text-center gap-2 border-2 transition-all",
        achieved ? "bg-white border-yellow-100 shadow-sm" : "bg-slate-50 border-transparent opacity-60 grayscale"
    )}>
        <div className={clsx("p-3 rounded-full", achieved ? "bg-yellow-50" : "bg-slate-200")}>
            <Icon className={clsx("w-8 h-8", achieved ? "text-yellow-500" : "text-slate-400")} />
        </div>
        <div>
            <div className="text-sm font-black text-slate-700">{label}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                {achieved ? date : 'Locked'}
            </div>
        </div>
    </div>
);

export function ProfileDashboard({ onBack }: ProfileDashboardProps) {
    const profile = useUserStore((state) => state.profile);
    const levels = useUserStore((state) => state.levels);

    const userTraits = profile?.traits || {
        risk: 50, creativity: 50, vision: 50, empathy: 50, leadership: 50, resilience: 50
    };

    const storiesCompleted = profile?.stories_completed || 0;
    const currentStreak = profile?.current_streak || 0;

    // Get recently explored (last 3 completed or unlocked)
    const recentlyExplored = useMemo(() => {
        return [...levels]
            .filter(l => l.status === 'completed' || l.status === 'unlocked')
            .reverse() // Naive recency for now
            .slice(0, 3);
    }, [levels]);

    // Infer interests based on profile data or default to a cute list
    const interests = profile?.interests?.length ? profile.interests : [
        "Personal Growth", "Creativity", "Mindfulness", "Technology", "Storytelling"
    ];

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans text-slate-800 pb-24 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
            
            {/* Soft decorative background shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lavender-50/50 blur-[100px] bg-purple-50/50" />
            </div>

            {/* Header / Navigation */}
            <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 max-w-7xl mx-auto">
                <button 
                    onClick={() => { audioSynth.playBack(); onBack(); }}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    My Journey
                </div>
                <div className="w-12 h-12" /> {/* Balancer */}
            </header>

            <main className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN - Identity & Personality */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        
                        {/* Profile Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center text-center">
                            {/* Cute background accent */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-white" />
                            
                            <div className="relative w-32 h-32 mb-6">
                                <div className="absolute inset-0 bg-white rounded-full shadow-md" />
                                <div className="absolute inset-2 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center">
                                    <DotLottieReact
                                        src="/assets/Macot/waving mascot.lottie"
                                        loop
                                        autoplay
                                        style={{ width: '150%', height: '150%', marginTop: '10%' }}
                                    />
                                </div>
                                {/* Level Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-sm border-2 border-white">
                                    LVL {profile?.level || 1}
                                </div>
                            </div>

                            <h1 className="text-2xl font-black text-slate-800 tracking-tight relative z-10">
                                {profile?.name || 'Explorer'}
                            </h1>
                            <p className="text-emerald-500 font-bold text-sm mb-4 relative z-10">
                                @{profile?.username || `explorer_${Math.floor(Math.random()*1000)}`} • {profile?.age || 18} y/o
                            </p>

                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                "On a journey to discover my true potential through stories and self-reflection."
                            </p>

                            <button 
                                onClick={() => audioSynth.playClick()}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* Personality Discovery Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-50 rounded-xl text-purple-500">
                                    <Star className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-black text-slate-800">Discovered Traits</h2>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <TraitBadge label="Creative" value={userTraits.creativity} colorClass="bg-purple-50 text-purple-600" />
                                <TraitBadge label="Analytical" value={userTraits.vision} colorClass="bg-blue-50 text-blue-600" />
                                <TraitBadge label="Social" value={userTraits.empathy} colorClass="bg-pink-50 text-pink-600" />
                                <TraitBadge label="Bold" value={userTraits.risk} colorClass="bg-orange-50 text-orange-600" />
                            </div>
                        </div>

                        {/* Interests Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-black text-slate-800">My Interests</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest, idx) => (
                                    <div key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold rounded-xl">
                                        {interest}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-4 italic">
                                *Interests are dynamically discovered from your journey.
                            </p>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - Journey, Stats, Insights */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard 
                                icon={BookOpen} label="Stories" value={storiesCompleted}
                                bgColor="bg-emerald-50" iconColor="text-emerald-500" 
                            />
                            <StatCard 
                                icon={Flame} label="Streak" value={currentStreak}
                                bgColor="bg-orange-50" iconColor="text-orange-500" 
                            />
                            <StatCard 
                                icon={Star} label="Total XP" value={profile?.total_xp || 0}
                                bgColor="bg-yellow-50" iconColor="text-yellow-500" 
                            />
                            <StatCard 
                                icon={Clock} label="Days Active" value={Math.max(1, currentStreak + 2)}
                                bgColor="bg-blue-50" iconColor="text-blue-500" 
                            />
                        </div>

                        {/* What AYA Knows About You */}
                        <div className="bg-emerald-50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                            <div className="w-32 h-32 shrink-0 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden">
                                <DotLottieReact
                                    src="/assets/Macot/happy mascot.lottie"
                                    loop
                                    autoplay
                                    style={{ width: '130%', height: '130%' }}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-emerald-900 mb-2">
                                    What AYA Knows About You
                                </h2>
                                <p className="text-emerald-700/80 font-medium mb-4">
                                    Based on your choices, AYA has noticed some beautiful patterns in your journey:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-emerald-800 font-bold">
                                        <Heart className="w-5 h-5 text-emerald-500 shrink-0" />
                                        You gravitate towards stories involving deep emotional connections.
                                    </li>
                                    <li className="flex items-start gap-3 text-emerald-800 font-bold">
                                        <Brain className="w-5 h-5 text-emerald-500 shrink-0" />
                                        When faced with risks, you prefer taking calculated, analytical steps.
                                    </li>
                                    <li className="flex items-start gap-3 text-emerald-800 font-bold">
                                        <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0" />
                                        You have a strong sense of curiosity and love exploring new domains.
                                    </li>
                                </ul>
                                <div className="mt-6 inline-block bg-white/60 px-5 py-3 rounded-2xl text-emerald-900 font-bold text-sm shadow-sm backdrop-blur-sm">
                                    "Hey {profile?.name?.split(' ')[0] || 'friend'}! You've been exploring a lot lately. Keep following your curiosity!" 🐢
                                </div>
                            </div>
                        </div>

                        {/* Recently Explored */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-800">Recently Explored</h2>
                                </div>
                            </div>
                            
                            {recentlyExplored.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recentlyExplored.map((level, idx) => (
                                        <div key={idx} className="flex flex-col bg-slate-50 rounded-3xl p-4 border border-slate-100 hover:border-emerald-200 transition-colors group cursor-pointer">
                                            <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 relative">
                                                <img src={level.avatarUrl || level.background || '/assets/map_background.png'} alt={level.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-3 left-3 text-white font-black text-sm">
                                                    {level.theme}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{level.title}</h3>
                                            <div className="flex items-center gap-1 text-yellow-500 mb-3">
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className={clsx("w-3 h-3", level.status === 'completed' ? "fill-current" : "text-slate-300")} />
                                            </div>
                                            <button className="w-full py-2.5 bg-white text-emerald-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors mt-auto">
                                                {level.status === 'completed' ? 'Revisit' : 'Continue'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                    <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">You haven't explored any stories yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-50 rounded-xl text-yellow-500">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-black text-slate-800">Achievements</h2>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <AchievementBadge icon={Compass} label="First Steps" date={today} achieved={true} />
                                <AchievementBadge icon={BookOpen} label="Storyteller" date={today} achieved={storiesCompleted >= 3} />
                                <AchievementBadge icon={Flame} label="Consistent" date={today} achieved={currentStreak >= 7} />
                                <AchievementBadge icon={Award} label="Mastery" date={today} achieved={(profile?.level || 1) > 5} />
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
