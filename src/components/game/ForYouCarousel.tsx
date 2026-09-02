import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioManager } from '../../utils/audioManager';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useSpinCountdown } from '../../hooks/useSpinCountdown';

interface ForYouCarouselProps {
    onPlayLevel?: (l: any) => void;
    allLevels?: any[];
}

// IST date helper
const todayIST = (): string =>
  new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  ).toISOString().split('T')[0];

export function ForYouCarousel({ onPlayLevel, allLevels = [] }: ForYouCarouselProps) {
    const navigate = useNavigate();
    const profile = useUserStore(state => state.profile);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [spinsUsed, setSpinsUsed] = useState<number | null>(null);
    const countdownStr = useSpinCountdown();

    useEffect(() => {
        const today = todayIST();
        let localSpins = 0;
        try {
            const localData = JSON.parse(localStorage.getItem('aya_vibe_spins') || '{}');
            if (localData.date === today) localSpins = localData.count || 0;
            else localStorage.setItem('aya_vibe_spins', JSON.stringify({ count: 0, date: today }));
        } catch(e) {}

        const userId = profile?.id;
        if (!userId) { 
            setSpinsUsed(localSpins); 
            return; 
        }

        (async () => {
            try {
                const { data } = await supabase.from('users').select('daily_spins_used, spin_reset_date').eq('id', userId).maybeSingle();
                if (!data) { setSpinsUsed(localSpins); return; }
                let used = data.daily_spins_used ?? 0;
                if (!data.spin_reset_date || data.spin_reset_date < today) {
                    used = 0;
                    await supabase.from('users').update({ daily_spins_used: 0, spin_reset_date: today }).eq('id', userId);
                }
                const syncUsed = Math.max(used, localSpins);
                localStorage.setItem('aya_vibe_spins', JSON.stringify({ count: syncUsed, date: today }));
                setSpinsUsed(syncUsed);
            } catch {
                setSpinsUsed(localSpins);
            }
        })();
    }, [profile?.id]);

    const isLocked = spinsUsed !== null && spinsUsed >= 2;

    // Grab 5 random levels for the editorial shelf
    const suggestedLevels = allLevels.length > 0 
        ? [...allLevels].sort(() => 0.5 - Math.random()).slice(0, 5)
        : [];

    return (
        <div className="w-full pt-16 pb-4 z-40 relative flex flex-col items-center pointer-events-none">
            
            <div className="w-full max-w-[1400px] px-6 flex flex-col pointer-events-auto">
                {/* Header & Spinner Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 sm:mb-6 px-2 gap-4">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-sm font-black tracking-[0.2em] text-[#F5F7FA] uppercase">For You</h2>
                            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
                        </div>
                        <p className="text-[11px] font-medium tracking-wide text-[#A5AFBF]">
                            Personalized from your choices & mindset
                        </p>
                    </div>

                    {/* Premium Physical Vibe Spinner */}
                    <button
                        onClick={() => {
                            if (isLocked) return;
                            audioManager.playClick();
                            navigate('/game/mood');
                        }}
                        className={clsx(
                            "group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 pointer-events-auto origin-right",
                            isLocked
                                ? "bg-[#05070D] border border-white/[0.04] opacity-80 cursor-not-allowed"
                                : "bg-[#080B14] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(139,61,255,0.15)] active:translate-y-0.5 active:scale-95"
                        )}
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px'
                        }}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full border-[3px] shadow-inner flex items-center justify-center transition-all duration-[2s] ease-out",
                            isLocked ? "border-[#111827] bg-[#0C1220]" : "border-[#8B3DFF]/40 bg-gradient-to-br from-[#111827] to-[#080B14] group-hover:rotate-[360deg] group-hover:border-[#8B3DFF] group-hover:shadow-[0_0_15px_rgba(139,61,255,0.4)] animate-[pulse_4s_ease-in-out_infinite]"
                        )}>
                            <div className={clsx(
                                "w-1 h-3 rounded-full transition-colors",
                                isLocked ? "bg-[#111827]" : "bg-[#00E5FF] group-hover:bg-[#FFC400]"
                            )}></div>
                        </div>
                        
                        <div className="flex flex-col items-start pr-2">
                            {isLocked ? (
                                <>
                                    <span className="text-[9px] font-black tracking-widest text-[#667085]">NEXT SPIN IN</span>
                                    <span className="text-xs font-bold font-mono text-[#F5F7FA]">{countdownStr}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[11px] font-black tracking-[0.15em] text-[#F5F7FA] group-hover:text-[#00E5FF] transition-colors">VIBE SPINNER</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>

                {/* Editorial Story Cards */}
                {suggestedLevels.length > 0 && (
                    <div 
                        ref={scrollRef}
                        className="w-full flex gap-4 overflow-x-auto pb-6 pt-2 px-2 snap-x scrollbar-hide [-webkit-overflow-scrolling:touch]"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {suggestedLevels.map((level, idx) => (
                            <div 
                                key={idx}
                                onClick={() => onPlayLevel?.(level)}
                                className="group relative shrink-0 w-[240px] md:w-[280px] h-[160px] md:h-[180px] rounded-2xl bg-[#080B14] border border-white/[0.04] overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                    {level.cover_url || level.avatarUrl ? (
                                        <img src={level.cover_url || level.avatarUrl} alt={level.title} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#111827] to-[#05070D]" />
                                    )}
                                </div>
                                
                                {/* Inner Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/80 to-transparent"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-end translate-z-10">
                                    <div className="flex items-center gap-2 mb-2 translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                                        <span className="px-2 py-0.5 rounded bg-white/[0.1] backdrop-blur-md text-[9px] font-bold tracking-widest text-[#00E5FF] border border-white/[0.05]">
                                            AGE {level.age}
                                        </span>
                                        <span className="text-[9px] font-bold tracking-widest text-[#A5AFBF] uppercase truncate">
                                            {level.personality || level.archetype || 'STORY'}
                                        </span>
                                    </div>
                                    <h3 className="text-sm md:text-base font-bold text-[#F5F7FA] leading-tight translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                        {level.title}
                                    </h3>
                                </div>

                                {/* Play Indicator */}
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 translate-z-20 shadow-lg">
                                    <Play size={12} className="text-white ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


