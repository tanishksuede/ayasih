import { useEffect, useRef, useState } from 'react';

interface MascotLoaderProps {
    fullscreen?: boolean;
    message?: string;
    subMessage?: string;
    transparentBg?: boolean;
    fps?: number;
}

const TOTAL_FRAMES = 60;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => `/assets/loading_frames/frame_${i + 1}.png`);

export function MascotLoader({
    fullscreen = true,
    message = 'LOADING YOUR UNIVERSE...',
    subMessage,
    transparentBg = false,
    fps = 24
}: MascotLoaderProps) {
    const [currentFrame, setCurrentFrame] = useState(1);
    const [, setImagesLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameIndexRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const animFrameRef = useRef<number | null>(null);

    // Preload all 60 frames
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        FRAME_PATHS.forEach((path, idx) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };
            images[idx] = img;
        });

        imagesRef.current = images;

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // 24 fps loop animation
    useEffect(() => {
        const frameInterval = 1000 / fps;

        const loop = (now: number) => {
            const elapsed = now - lastTimeRef.current;
            if (elapsed >= frameInterval) {
                lastTimeRef.current = now - (elapsed % frameInterval);
                frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
                setCurrentFrame(frameIndexRef.current + 1);
            }
            animFrameRef.current = requestAnimationFrame(loop);
        };

        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [fps]);

    const content = (
        <div className="flex flex-col items-center justify-center gap-6 select-none">
            {/* Mascot Portal Frame Container */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                {/* Ambient glow behind portal */}
                <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute w-36 h-36 bg-pink-500/15 blur-2xl rounded-full pointer-events-none" />

                {/* Active Frame */}
                <img
                    src={'/assets/loading_frames/frame_' + currentFrame + '.png'}
                    alt="Loading animation"
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(213,117,255,0.4)] transition-none"
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
