import { useEffect, useRef, useState } from 'react';
import { MASCOT_FRAMES, MASCOT_LOOP_DURATION, getFrameIndexForElapsed } from '../../data/mascotFrames';

interface MascotLoaderProps {
    fullscreen?: boolean;
    message?: string;
    subMessage?: string;
    transparentBg?: boolean;
    speed?: number;
}

export function MascotLoader({
    fullscreen = true,
    message = 'LOADING YOUR UNIVERSE...',
    subMessage,
    transparentBg = false,
    speed = 1.0
}: MascotLoaderProps) {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [currentPath, setCurrentPath] = useState(MASCOT_FRAMES[0].path);

    useEffect(() => {
        // Preload all 44 frames for zero-flicker performance
        MASCOT_FRAMES.forEach(f => {
            const im = new Image();
            im.src = f.path;
        });

        let animId: number;
        const startTime = performance.now();
        let lastIndex = 0;

        const tick = (now: number) => {
            const elapsed = ((now - startTime) * speed) % MASCOT_LOOP_DURATION;
            const idx = getFrameIndexForElapsed(elapsed);
            if (idx !== lastIndex) {
                lastIndex = idx;
                const path = MASCOT_FRAMES[idx].path;
                setCurrentPath(path);
                if (imgRef.current) {
                    imgRef.current.src = path;
                }
            }
            animId = requestAnimationFrame(tick);
        };

        animId = requestAnimationFrame(tick);

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [speed]);

    const content = (
        <div className="flex flex-col items-center justify-center gap-6 select-none">
            {/* Mascot Portal Frame Container */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
                {/* Ambient purple/cyan glows */}
                <div className="absolute inset-0 bg-purple-600/25 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

                <img
                    ref={imgRef}
                    src={currentPath}
                    alt="Loading animation"
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(213,117,255,0.4)]"
                />
            </div>

            {/* Message */}
            {message && (
                <div className="flex flex-col items-center gap-1.5 text-center px-4">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 text-base sm:text-lg font-black tracking-widest uppercase animate-pulse">
                        {message}
                    </p>
                    {subMessage && (
                        <p className="text-xs text-slate-400 font-medium">
                            {subMessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    if (!fullscreen) {
        return content;
    }

    return (
        <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 transition-all duration-500 ${transparentBg ? 'bg-black/80 backdrop-blur-md' : 'bg-gradient-to-b from-[#281A4B] via-[#1E1338] to-[#1A1033]'}`}>
            {content}
        </div>
    );
}
