import { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import { audioManager as audioSynth } from "../../utils/audioManager";
import { ArrowRight, Sparkles, Star, Flame, Target, Zap, Shield, Heart } from 'lucide-react';
import type { PersonalityTraits, PsychologicalProfile } from '../../types/gameTypes';
import { IDOL_PROFILES } from '../../data/idolMindsets';
import { useUserStore } from '../../store/userStore';
import PostJourneyFeedback from '../feedback/PostJourneyFeedback';
import { resolvePersonalityAvatar } from '../../utils/avatarUtils';
import { generateSurprisedInsight } from '../../services/insightService';
import { motion } from 'framer-motion';

interface MatchReportProps {
    storyId?: string;
    userTraits: PersonalityTraits;
    userProfile?: PsychologicalProfile;
    idolTraits: PersonalityTraits;
    idolName: string;
    onClose: () => void;
}

// Reusable UI Components
const GlassCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className={clsx("relative rounded-3xl overflow-hidden bg-[#0D1530]/95 border border-[#506EFF]/30 p-5 sm:p-6 flex flex-col shadow-2xl backdrop-blur-md", className)}
    >
        <div className="relative z-10 w-full flex flex-col">
            {children}
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-5">
        <h3 className="text-xs md:text-sm font-bold text-white/90 tracking-[0.2em] uppercase">{title}</h3>
        {subtitle && <p className="text-[#00D9FF]/80 text-[11px] md:text-xs mt-1">{subtitle}</p>}
    </div>
);

export function MatchReport({ storyId, userTraits, idolName, onClose }: MatchReportProps) {
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    
    const profile = useUserStore((state) => state.profile);
    const cleanIdolName = (idolName || "Default").trim();
    const mainAvatarUrl = resolvePersonalityAvatar(cleanIdolName);

    // Compute "You Surprised Yourself" & "Current Chapter"
    const surpriseInsight = useMemo(() => {
        return generateSurprisedInsight(profile?.onboarding_scores, userTraits);
    }, [profile?.onboarding_scores, userTraits]);

    // Dynamic Trait Calculation
    const TRAIT_MAP = [
        { score: userTraits.risk || 50, strength: 'Bold Decision Maker', blindSpot: 'Plays It Too Safe', icon: Flame, color: 'from-[#FF9F1C] to-[#FFC928]', key: 'risk', label: 'Risk Taker', hex: '#FF9F1C' },
        { score: userTraits.creativity || 50, strength: 'Creative Visionary', blindSpot: 'Stuck In Routine', icon: Sparkles, color: 'from-[#8B5CF6] to-[#EC3B9A]', key: 'creativity', label: 'Creative', hex: '#8B5CF6' },
        { score: userTraits.vision || 50, strength: 'Strategic Thinker', blindSpot: 'Impulsive Tendencies', icon: Target, color: 'from-[#2677FF] to-[#00D9FF]', key: 'vision', label: 'Analytical', hex: '#00D9FF' },
        { score: userTraits.empathy || 50, strength: 'Natural Connector', blindSpot: 'Lone Wolf Syndrome', icon: Heart, color: 'from-[#EC3B9A] to-[#FF9F1C]', key: 'empathy', label: 'Social', hex: '#EC3B9A' },
        { score: userTraits.leadership || 50, strength: 'Relentless Achiever', blindSpot: 'Consistency Gap', icon: Zap, color: 'from-[#22E67A] to-[#00D9FF]', key: 'leadership', label: 'Ambitious', hex: '#22E67A' }
    ];
    
    const sortedTraits = [...TRAIT_MAP].sort((a, b) => b.score - a.score);
    const displayStrengths = sortedTraits.slice(0, 3);
    const displayBlindSpots = sortedTraits.slice(-2);

    // Dynamic Match Calculation using strict IDOL_PROFILES
    const matchScore = useMemo(() => {
        const strictIdolTraits = IDOL_PROFILES[cleanIdolName] || IDOL_PROFILES["Default"];
        
        const totalDiff = 
            Math.abs((userTraits.risk || 50) - strictIdolTraits.risk) +
            Math.abs((userTraits.creativity || 50) - strictIdolTraits.creativity) +
            Math.abs((userTraits.vision || 50) - strictIdolTraits.analytical) +
            Math.abs((userTraits.empathy || 50) - strictIdolTraits.social) +
            Math.abs((userTraits.leadership || 50) - strictIdolTraits.ambitious);

        const avgDiff = totalDiff / 5;
        let score = Math.round(100 - avgDiff);
        return Math.max(0, Math.min(100, score));
    }, [userTraits, cleanIdolName]);

    const personalityDNA = useMemo(() => {
        const diffs: { name: string; diff: number }[] = [];
        for (const [name, p] of Object.entries(IDOL_PROFILES)) {
            if (name === cleanIdolName || name === "Default") continue;
            
            const totalDiff = 
                Math.abs((userTraits.risk || 50) - p.risk) +
                Math.abs((userTraits.creativity || 50) - p.creativity) +
                Math.abs((userTraits.vision || 50) - p.analytical) +
                Math.abs((userTraits.empathy || 50) - p.social) +
                Math.abs((userTraits.leadership || 50) - p.ambitious);
                
            diffs.push({ name, diff: totalDiff });
        }
        
        diffs.sort((a, b) => a.diff - b.diff);
        const top2 = diffs.slice(0, 2).map(d => d.name);
        
        const getTraitDesc = (name: string) => {
            const p = IDOL_PROFILES[name];
            const maxVal = Math.max(p.ambitious, p.creativity, p.analytical, p.social, p.risk);
            
            if (maxVal === p.ambitious) return `${name}'s relentless drive`;
            if (maxVal === p.creativity) return `${name}'s creative vision`;
            if (maxVal === p.analytical) return `${name}'s analytical mind`;
            if (maxVal === p.social) return `${name}'s emotional depth`;
            return `${name}'s bold fearlessness`;
        };

        if (top2.length < 2) return null;

        return {
            idol1: { name: top2[0], avatarUrl: resolvePersonalityAvatar(top2[0]), desc: getTraitDesc(top2[0]) },
            idol2: { name: top2[1], avatarUrl: resolvePersonalityAvatar(top2[1]), desc: getTraitDesc(top2[1]) }
        };
    }, [userTraits, cleanIdolName]);

    useEffect(() => {
        if ((audioSynth as any).playWin) (audioSynth as any).playWin();
        const duration = 1500;
        const steps = 30;
        const stepTime = duration / steps;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setAnimatedPercent(Math.round(easeOutQuart * matchScore));
            
            if (currentStep >= steps) clearInterval(timer);
        }, stepTime);
        
        return () => clearInterval(timer);
    }, [matchScore]);

    const handleContinue = () => {
        setIsClosing(true);
        audioSynth.playClick();
        setTimeout(onClose, 400);
    };

    const getIdentityTags = () => {
        return displayStrengths.slice(0, 3).map(s => s.strength.split(' ')[1] || s.strength.split(' ')[0]);
    };

    return (
        <div className={clsx("w-full min-h-[100dvh] flex flex-col font-sans overflow-x-hidden overflow-y-auto scroll-smooth bg-[#050817] text-white relative transition-opacity duration-300", isClosing && "opacity-0")}>
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/15 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00D9FF]/15 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-36 min-h-[100dvh] flex flex-col">
                
                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full flex flex-col items-center text-center mt-2 sm:mt-4 md:mt-8 mb-8 sm:mb-10 md:mb-16"
                >
                    <div className="relative mb-3 sm:mb-4">
                        <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            {animatedPercent}<span className="text-4xl sm:text-5xl md:text-7xl text-[#00D9FF]">%</span>
                        </h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00D9FF]/20 blur-[60px] -z-10 rounded-full" />
                    </div>
                    
                    <h2 className="text-lg sm:text-xl md:text-3xl font-medium text-white/90 mb-6 sm:mb-8 max-w-2xl px-2 leading-tight">
                        Great match! You share strong qualities with <span className="text-[#00D9FF] font-bold">{cleanIdolName}</span>.
                    </h2>

                    {/* Progress Bar */}
                    <div className="w-full max-w-2xl h-1.5 md:h-2 bg-[#0D1530] rounded-full overflow-hidden relative border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${animatedPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF] shadow-[0_0_15px_#00D9FF]"
                        />
                    </div>
                </motion.div>

                {/* Main 3-Column Layout */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 flex-1">
                    
                    {/* LEFT COLUMN: Motivation Power-Up */}
                    <div className="md:col-span-3 flex flex-col gap-6 order-2 md:order-1">
                        <GlassCard delay={0.2} className="flex-1">
                            <SectionHeader title="Motivation Power-Up" subtitle="Your Core Strengths" />
                            <div className="flex flex-col gap-5 mt-2">
                                {displayStrengths.map((trait, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${trait.color} bg-opacity-20 shrink-0`}>
                                                <trait.icon size={16} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-sm font-semibold text-white/90">{trait.strength}</span>
                                                    <span className="text-xs font-bold text-white/60">{trait.score}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${trait.score}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${trait.color}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard delay={0.3}>
                            <SectionHeader title="Personality Traits" />
                            <div className="flex flex-col gap-4 mt-2">
                                {sortedTraits.map((trait, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-[11px] font-medium text-white/60 w-20 uppercase tracking-widest">{trait.label}</span>
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${trait.score}%` }}
                                                transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: trait.hex, boxShadow: `0 0 10px ${trait.hex}40` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-white/40 w-6 text-right">{trait.score}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-[#506EFF]/20 text-center">
                                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Profile Tag</div>
                                <div className="inline-block px-5 py-2 rounded-full bg-[#111A38] border border-[#EC3B9A]/30 text-[#EC3B9A] text-sm font-bold tracking-[0.1em] uppercase shadow-[0_0_15px_rgba(236,59,154,0.1)]">
                                    {displayStrengths[0].strength}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* CENTER COLUMN: Hero Avatar */}
                    <div className="md:col-span-6 flex flex-col items-center justify-start order-1 md:order-2 mb-6 sm:mb-8 md:mb-0">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                            className="relative w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] md:w-[360px] md:h-[360px] rounded-full p-2 group"
                        >
                            {/* Outer animated rings */}
                            <div className="absolute inset-0 rounded-full border border-[#00D9FF]/30 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-3 rounded-full border border-[#8B5CF6]/30 animate-[spin_15s_linear_infinite_reverse]" />
                            
                            <div className="w-full h-full rounded-full overflow-hidden relative z-10 border-4 border-[#111A38] bg-[#070B1F]">
                                <img 
                                    src={mainAvatarUrl} 
                                    alt={cleanIdolName}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050817] via-transparent to-transparent opacity-80" />
                            </div>
                            
                            {/* Center Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00D9FF]/20 blur-[50px] -z-10 rounded-full group-hover:bg-[#00D9FF]/30 transition-colors duration-700" />
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
                        >
                            {cleanIdolName}
                        </motion.h2>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="flex flex-wrap justify-center gap-2 md:gap-3 mt-5">
                            {getIdentityTags().map((tag, i) => (
                                <span key={i} className="px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.1em] uppercase bg-[#111A38]/80 border border-[#00D9FF]/20 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.1)]">
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Growth & Resilience */}
                    <div className="md:col-span-3 flex flex-col gap-6 order-3 md:order-3">
                        <GlassCard delay={0.4}>
                            <SectionHeader title="Growth Challenge" subtitle="Blind Spots to Work On" />
                            <div className="flex flex-col gap-4 mt-2">
                                {displayBlindSpots.map((blindSpot, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-[#050817]/60 border border-[#EC3B9A]/20 hover:border-[#EC3B9A]/50 transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-white/90 mb-1.5 uppercase tracking-wide">{blindSpot.blindSpot}</h4>
                                                <p className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/80 transition-colors pr-2">
                                                    Stay aware of this tendency. Focus on continuous improvement.
                                                </p>
                                            </div>
                                            <ArrowRight size={14} className="text-[#EC3B9A] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-0.5 shrink-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard delay={0.5}>
                            <SectionHeader title="Growth Rewards" subtitle="Unlock your next level" />
                            <div className="flex justify-around items-center py-5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="relative group">
                                        <div className="absolute inset-0 bg-[#FFC928]/30 blur-lg rounded-full scale-50 group-hover:scale-125 transition-transform duration-500" />
                                        <Star size={32} strokeWidth={1.5} className="text-[#FFC928]/50 fill-[#FFC928]/10 group-hover:text-[#FFC928] group-hover:fill-[#FFC928]/40 transition-colors duration-300 relative z-10" />
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard delay={0.6}>
                            <div className="flex items-center gap-5">
                                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                        <motion.path 
                                            initial={{ strokeDasharray: "0, 100" }}
                                            animate={{ strokeDasharray: `${userTraits.resilience || 70}, 100` }}
                                            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                            fill="none" stroke="#FF9F1C" strokeWidth="3" strokeLinecap="round" 
                                        />
                                    </svg>
                                    <Shield size={20} className="text-[#FF9F1C]" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-white/90 tracking-[0.2em] uppercase mb-1">Resilience Score</div>
                                    <div className="text-3xl font-black text-white leading-none">{userTraits.resilience || 70}<span className="text-lg text-white/50">%</span></div>
                                    <div className="text-[10px] text-[#00D9FF]/70 mt-1 uppercase tracking-wider">Your bounce-back power</div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* BOTTOM SECTION: Personality DNA */}
                {personalityDNA && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="w-full max-w-4xl mx-auto mt-12 md:mt-20 mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2677FF]/10 via-[#8B5CF6]/10 to-[#EC3B9A]/10 rounded-3xl blur-2xl" />
                        <div className="relative rounded-3xl border border-white/10 bg-[#0D1530]/50 backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-50" />
                            
                            <h3 className="text-sm font-bold text-white/90 tracking-[0.2em] uppercase mb-2">Your Personality DNA</h3>
                            <p className="text-[#00D9FF]/80 text-sm mb-10 md:mb-14">You are a unique mix of</p>
                            
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                                <div className="flex flex-col items-center max-w-[200px]">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#2677FF]/30 blur-xl rounded-full" />
                                        <img src={personalityDNA.idol1.avatarUrl} alt="" className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#2677FF]/50 mb-5 object-cover z-10" />
                                    </div>
                                    <p className="text-sm md:text-base text-white/90 font-medium leading-snug">{personalityDNA.idol1.desc}</p>
                                </div>
                                
                                <div className="text-4xl font-black text-white/10">+</div>
                                
                                <div className="flex flex-col items-center max-w-[200px]">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#EC3B9A]/30 blur-xl rounded-full" />
                                        <img src={personalityDNA.idol2.avatarUrl} alt="" className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#EC3B9A]/50 mb-5 object-cover z-10" />
                                    </div>
                                    <p className="text-sm md:text-base text-white/90 font-medium leading-snug">{personalityDNA.idol2.desc}</p>
                                </div>
                            </div>
                            
                            {surpriseInsight && (
                                <div className="mt-12 pt-10 border-t border-white/10">
                                    <div className="inline-block relative px-8">
                                        <span className="absolute left-0 -top-6 text-5xl text-[#00D9FF]/20 font-serif">"</span>
                                        <div className="flex flex-col gap-2">
                                            <h4 className="text-xl text-[#00D9FF] font-bold mx-auto">{surpriseInsight.headline}</h4>
                                            <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-2xl mx-auto italic">
                                                {surpriseInsight.detail}
                                            </p>
                                        </div>
                                        <span className="absolute right-0 -bottom-8 text-5xl text-[#00D9FF]/20 font-serif">"</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Feedback Form */}
                {storyId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full max-w-2xl mx-auto mt-4 mb-20 relative z-20"
                    >
                        <PostJourneyFeedback
                            journeyId={storyId}
                            sessionDurationSeconds={null}
                            onFeedbackComplete={() => console.log('[MatchReport] Feedback and reflection saved successfully.')}
                        />
                    </motion.div>
                )}
            </div>

            {/* FLOATING CTA */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="fixed bottom-0 left-0 w-full p-4 sm:p-5 md:p-6 bg-gradient-to-t from-[#050817] via-[#050817]/95 to-transparent z-50 flex flex-col items-center pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
                <button
                    onClick={handleContinue}
                    className="group relative w-full max-w-[400px] h-14 sm:h-16 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(0,217,255,0.4)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF]" />
                    <div className="absolute inset-[2px] bg-[#050817] rounded-full transition-opacity group-hover:opacity-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <span className="relative z-10 flex items-center justify-center h-full gap-3 text-xs sm:text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase px-4">
                        Continue Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </motion.div>
        </div>
    );
}
