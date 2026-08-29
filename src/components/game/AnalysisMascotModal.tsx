import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const MASCOT_ASSETS = {
    WATCHING_LEFT: '/assets/Macot/watching left mascot.lottie',
    BIRD: '/assets/Macot/mascot with bird.lottie',
    HAPPY: '/assets/Macot/happy mascot.lottie',
    WINNER: '/assets/Macot/Winner mascot.lottie',
} as const;

interface AnalysisMascotModalProps {
    parts: string[];
    onComplete: () => void;
    theme: 'candy' | 'dark';
}

export const AnalysisMascotModal: React.FC<AnalysisMascotModalProps> = ({ parts, onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < parts.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const getMascotAsset = (idx: number) => {
        if (idx === 0) return MASCOT_ASSETS.BIRD; // Empathetic/listening
        if (idx === 1) return MASCOT_ASSETS.WATCHING_LEFT; // Explaining/thoughtful
        return MASCOT_ASSETS.HAPPY; // Encouraging/Happy
    };

    const activeMascot = getMascotAsset(step);

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-end md:justify-center bg-[#050817]/95 backdrop-blur-xl p-4 overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx(
                    "relative w-full max-w-4xl md:my-8 rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex flex-col gap-6",
                    "bg-gradient-to-b from-[#0D1530] to-[#070B1F] border border-[#506EFF]/30 text-white"
                )}
            >
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent blur-sm rounded-full" />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/10 via-[#00D9FF]/10 to-[#EC3B9A]/10 rounded-[2.5rem] blur-xl -z-10" />

                {/* Progress Header */}
                <div className="flex justify-between items-center px-4 w-full relative z-20">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#00D9FF]">AI Insights</span>
                        <div className="flex gap-1.5">
                            {parts.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className={clsx(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        i === step 
                                            ? "w-8 bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
                                            : i < step
                                            ? "w-3 bg-[#00D9FF]/50"
                                            : "w-3 bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={onComplete}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 flex-1 mt-4 relative z-10">
                    {/* Mascot Area */}
                    <div className="w-48 h-48 md:w-80 md:h-80 shrink-0 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#8B5CF6]/10 blur-3xl rounded-full" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMascot}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                            >
                                <DotLottieReact
                                    src={encodeURI(activeMascot)}
                                    loop
                                    autoplay
                                    style={{ width: '100%', height: '100%' }}
                                    className="object-contain"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Dialog Box Area */}
                    <div className="w-full flex-1 flex flex-col justify-center max-w-lg min-h-[160px] relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="relative bg-[#111A38]/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl"
                            >
                                <span className="absolute -top-6 -left-2 text-6xl text-[#00D9FF]/20 font-serif leading-none">"</span>
                                <p className="text-lg md:text-2xl leading-relaxed text-white/90 font-medium relative z-10">
                                    {parts[step]}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 md:mt-10 pt-6 border-t border-white/10 w-full z-20">
                    <button 
                        onClick={handlePrev}
                        disabled={step === 0}
                        className={clsx(
                            "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all",
                            step === 0 
                                ? "opacity-0 pointer-events-none" 
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    <button 
                        onClick={handleNext}
                        className={clsx(
                            "group relative overflow-hidden flex items-center gap-2 px-8 py-4 rounded-full text-sm md:text-base font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:shadow-[0_0_30px_rgba(0,217,255,0.4)] transition-all hover:scale-105 active:scale-95"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF]" />
                        <div className="absolute inset-[2px] bg-[#050817] rounded-full transition-opacity group-hover:opacity-0" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                            {step === parts.length - 1 ? 'Complete Story' : 'Next'}
                            {step === parts.length - 1 ? <Check size={18} /> : <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
