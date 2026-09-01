import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const MASCOT_ASSETS = {
    CHAIR_CELEBRATE: '/mascot/chair_celebrate_mascot.lottie',
} as const;

interface AnalysisMascotModalProps {
    parts: string[];
    onComplete: () => void;
    theme: 'candy' | 'dark';
}

export const AnalysisMascotModal: React.FC<AnalysisMascotModalProps> = ({ parts, onComplete }) => {
    const [step, setStep] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;
        const text = parts[step] || "";
        // 20ms per character for smooth type-in
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [step, parts]);

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

    const activeMascot = MASCOT_ASSETS.CHAIR_CELEBRATE;

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050817]/95 backdrop-blur-xl p-3 sm:p-4 md:p-6 overflow-y-auto min-h-[100dvh]">
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx(
                    "relative w-full max-w-4xl my-auto rounded-3xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-10 shadow-2xl flex flex-col gap-4 sm:gap-6",
                    "bg-gradient-to-b from-[#0D1530] to-[#070B1F] border border-[#506EFF]/30 text-white"
                )}
            >
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent blur-sm rounded-full" />
                <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/10 via-[#00D9FF]/10 to-[#EC3B9A]/10 rounded-3xl md:rounded-[2.5rem] blur-xl -z-10" />

                {/* Progress Header */}
                <div className="flex justify-between items-center px-2 sm:px-4 w-full relative z-20">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#00D9FF]">Insights</span>
                        <div className="flex gap-1 sm:gap-1.5">
                            {parts.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className={clsx(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        i === step 
                                            ? "w-6 sm:w-8 bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
                                             : i < step
                                            ? "w-2.5 sm:w-3 bg-[#00D9FF]/50"
                                            : "w-2.5 sm:w-3 bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={onComplete}
                        className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 flex-1 mt-2 sm:mt-4 relative z-10 w-full max-w-2xl mx-auto">
                    {/* Dialog Box Area */}
                    <div className="w-full relative min-h-[140px] sm:min-h-[150px] md:min-h-[160px] flex flex-col justify-end">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-[#111A38]/90 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#00D9FF]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-4"
                            >
                                {/* Speech Bubble Tail pointing to the mascot below */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-transparent border-t-[#111A38]/90 filter drop-shadow-[0_4px_2px_rgba(0,0,0,0.1)]" />
                                
                                {/* Inner tail border overlay to match the bubble's border */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-transparent border-t-[#00D9FF]/20 -z-10 scale-110 translate-y-[1px]" />
                                
                                <p className="text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed text-white/95 font-medium relative z-10 min-h-[4rem]">
                                    {displayedText}
                                    {isTyping && <span className="inline-block w-1.5 h-4 sm:h-5 ml-1 bg-[#00D9FF] animate-pulse align-middle" />}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mascot Area */}
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 shrink-0 relative flex items-center justify-center mx-auto mt-2">
                        <div className="absolute inset-0 bg-[#8B5CF6]/10 blur-3xl rounded-full" />
                        <div className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            <DotLottieReact
                                src={encodeURI(activeMascot)}
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                                className="object-contain pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-3 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-white/10 w-full z-20">
                    <button 
                        onClick={handlePrev}
                        disabled={step === 0}
                        className={clsx(
                            "flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all",
                            step === 0 
                                ? "opacity-0 pointer-events-none" 
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Previous
                    </button>

                    <button 
                        onClick={handleNext}
                        className={clsx(
                            "group relative overflow-hidden flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:shadow-[0_0_30px_rgba(0,217,255,0.4)] transition-all hover:scale-105 active:scale-95"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF]" />
                        <div className="absolute inset-[2px] bg-[#050817] rounded-full transition-opacity group-hover:opacity-0" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#EC3B9A] to-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2">
                            {step === parts.length - 1 ? 'Complete Story' : 'Next'}
                            {step === parts.length - 1 ? <Check size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

