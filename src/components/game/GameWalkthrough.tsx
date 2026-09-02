import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
    {
        id: 'welcome',
        target: null, // Centered
        title: 'Welcome to your world.',
        desc: 'This is where you explore stories, discover personalities, and track how your choices shape your journey.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: false } }))
    },
    {
        id: 'header',
        target: '[data-tutorial="header-profile"]',
        title: 'Your progress.',
        desc: 'Keep track of your current level, experience points, and profile status here.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: false } }))
    },
    {
        id: 'menu',
        target: '[data-tutorial="menu-toggle"]',
        title: 'Your command center.',
        desc: 'Open the menu anytime to access the rest of your AYA tools and settings.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: false } }))
    },
    {
        id: 'journal',
        target: '[data-tutorial="journal"]',
        title: 'Your Journal.',
        desc: 'Your personal record of the journey - revisit your progress, moments, choices, and discoveries here.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: true } }))
    },
    {
        id: 'dna',
        target: '[data-tutorial="dna"]',
        title: 'DNA Data & Telemetry.',
        desc: 'DNA is your evolving profile based on choices. Telemetry analyzes patterns in how you interact and progress.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: true } }))
    },
    {
        id: 'wishlist',
        target: '[data-tutorial="wishlist"]',
        title: 'Wishlist.',
        desc: 'Save stories or personalities you want to come back to later. Need a refresher? Replay this tutorial from the menu.',
        onEnter: () => window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: true } }))
    }
];

export function GameWalkthrough() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initialization check
    useEffect(() => {
        const checkTutorialState = () => {
            const hasSeen = localStorage.getItem('aya_game_tutorial_done') === 'true';
            if (!hasSeen) {
                // Wait for the app to settle
                setTimeout(() => setIsActive(true), 2000);
            }
        };

        checkTutorialState();

        const handleStart = () => {
            setCurrentStep(0);
            setIsActive(true);
        };

        window.addEventListener('tutorial-start', handleStart);
        return () => window.removeEventListener('tutorial-start', handleStart);
    }, []);

    // Effect to run onEnter logic and find target element
    useEffect(() => {
        if (!isActive) return;

        const step = STEPS[currentStep];
        if (step.onEnter) {
            step.onEnter();
        }

        const updateRect = () => {
            if (step.target) {
                const el = document.querySelector(step.target);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                } else {
                    setTargetRect(null); // Fallback to center
                }
            } else {
                setTargetRect(null);
            }
        };

        // Delay to allow UI to transition (e.g. side menu opening)
        const timer = setTimeout(updateRect, 350);
        window.addEventListener('resize', updateRect);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [isActive, currentStep]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        localStorage.setItem('aya_game_tutorial_done', 'true');
        setIsActive(false);
        window.dispatchEvent(new CustomEvent('tutorial-menu-toggle', { detail: { open: false } }));
    };

    if (!isActive) return null;

    const step = STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === STEPS.length - 1;

    // Calculate spotlight and tooltip positions
    let spotlightStyle: any = {};
    let tooltipStyle: any = {};

    if (targetRect) {
        const PADDING = 8;
        spotlightStyle = {
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            borderRadius: '12px'
        };

        // Determine tooltip placement (prefer below, then left, then right, then above)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const spaceBelow = windowHeight - targetRect.bottom;
        const spaceLeft = targetRect.left;
        
        if (spaceBelow > 200) {
            // Place below
            tooltipStyle = {
                top: targetRect.bottom + PADDING + 12,
                left: Math.max(16, Math.min(targetRect.left + (targetRect.width / 2) - 150, windowWidth - 316)),
            };
        } else if (spaceLeft > 320) {
            // Place left
            tooltipStyle = {
                top: Math.max(16, targetRect.top + (targetRect.height / 2) - 100),
                left: targetRect.left - PADDING - 316,
            };
        } else {
            // Place center fallback
            tooltipStyle = {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            };
        }
    } else {
        // Centered
        spotlightStyle = {
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            opacity: 0
        };
        tooltipStyle = {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        };
    }

    return (
        <div className="fixed inset-0 z-[99999] pointer-events-auto">
            {/* Darkened overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/70"
            />

            {/* Spotlight Hole (using SVG mask or simple border trick) */}
            {targetRect && (
                <motion.div
                    initial={false}
                    animate={spotlightStyle}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute shadow-[0_0_0_9999px_rgba(2,6,23,0.75)] border-2 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-transparent pointer-events-none"
                    style={{
                        boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.75), 0 0 20px rgba(0, 229, 255, 0.3) inset, 0 0 20px rgba(0, 229, 255, 0.3)"
                    }}
                >
                    <div className="absolute inset-0 animate-pulse bg-[#00E5FF]/10 rounded-[inherit]" />
                </motion.div>
            )}

            {/* Tooltip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute w-[300px] sm:w-[320px] bg-[#0C1220] border border-[#1C2333] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-3"
                    style={tooltipStyle}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <button 
                            onClick={handleFinish}
                            className="text-[#667085] hover:text-[#F5F7FA] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F7FA] leading-tight">
                        {step.title}
                    </h3>
                    
                    <p className="text-sm text-[#A5AFBF] leading-relaxed">
                        {step.desc}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1C2333]">
                        <button
                            onClick={handlePrev}
                            disabled={isFirst}
                            className={clsx(
                                "flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors px-2 py-1 -ml-2 rounded-lg",
                                isFirst ? "opacity-30 cursor-not-allowed text-[#667085]" : "text-[#A5AFBF] hover:text-[#F5F7FA] hover:bg-[#111827]"
                            )}
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                        
                        <button
                            onClick={handleNext}
                            className={clsx(
                                "flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md active:scale-95",
                                isLast 
                                    ? "bg-gradient-to-r from-[#00E5FF] to-[#168CFF] text-[#05070D] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                                    : "bg-[#F5F7FA] text-[#05070D] hover:bg-white"
                            )}
                        >
                            {isLast ? (
                                <div className="flex items-center">Ready <Check size={14} className="ml-1" /></div>
                            ) : (
                                <div className="flex items-center">Next <ChevronRight size={14} /></div>
                            )}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
