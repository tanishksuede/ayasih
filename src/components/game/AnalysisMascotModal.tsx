import React, { useState } from 'react';
import { MascotQuizGuide } from './MascotQuizGuide';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';

interface AnalysisMascotModalProps {
    parts: string[];
    onComplete: () => void;
    theme: 'candy' | 'dark';
}

export const AnalysisMascotModal: React.FC<AnalysisMascotModalProps> = ({ parts, onComplete, theme }) => {
    const [step, setStep] = useState(0);

    const isCandy = theme === 'candy';

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

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-end md:justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className={clsx(
                "relative w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-fade-in-up",
                isCandy 
                    ? "bg-gradient-to-br from-pink-100 to-white border-4 border-pink-300"
                    : "bg-slate-900 border border-purple-500/30 text-white"
            )}>
                {/* Close/Skip button */}
                <button 
                    onClick={onComplete}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-current"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col items-center">
                    {/* Mascot */}
                    <div className="w-48 h-48 mb-2 shrink-0">
                        <MascotQuizGuide 
                            currentStep={step} 
                            lastAction={step > 0 ? 'next' : 'none'} 
                        />
                    </div>
                    
                    {/* Speech Bubble */}
                    <div className={clsx(
                        "w-full p-4 rounded-2xl text-center relative",
                        isCandy ? "bg-white shadow-md text-slate-800" : "bg-slate-800 shadow-xl text-slate-200"
                    )}>
                        {/* Little triangle pointing to mascot */}
                        <div className={clsx(
                            "absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 rounded-sm",
                            isCandy ? "bg-white" : "bg-slate-800"
                        )} />
                        
                        <p className="text-lg leading-relaxed relative z-10 font-medium">
                            {parts[step]}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={handlePrev}
                        disabled={step === 0}
                        className={clsx(
                            "p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none",
                            isCandy 
                                ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {parts.map((_, i) => (
                            <div 
                                key={i}
                                className={clsx(
                                    "w-2 h-2 rounded-full transition-all",
                                    i === step 
                                        ? (isCandy ? "bg-pink-500 w-4" : "bg-purple-500 w-4")
                                        : (isCandy ? "bg-pink-200" : "bg-slate-700")
                                )}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleNext}
                        className={clsx(
                            "px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg active:scale-95",
                            isCandy
                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                : "bg-purple-600 text-white hover:bg-purple-500"
                        )}
                    >
                        {step === parts.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
