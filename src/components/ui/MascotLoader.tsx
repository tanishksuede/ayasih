import { useEffect, useRef, useState } from 'react';

interface MascotLoaderProps {
    fullscreen?: boolean;
    message?: string;
    subMessage?: string;
    transparentBg?: boolean;
    fps?: number;
}

const TOTAL_FRAMES = 60;
const COLS = 10;
const FRAME_WIDTH = 140;
const FRAME_HEIGHT = 140;
export function MascotLoader( {
    fullscreen = true,
    message = 'LOADING YOUR UNIVERSE...',
    subMessage,
    transparentBg = false,
    fps = 24
}: MascotLoaderProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = '/assets/mascot_anim_sheet.png';
        
        let animId: number;
        let frameIndex = 0;
        let lastTime = performance.now();
        const frameInterval = 1000 / fps;

        img.onload = () => {
            setIsLoaded(true);
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const render = (now: number) => {
                const elapsed = now - lastTime;
                if (elapsed >= frameInterval) {
                    lastTime = now - (elapsed % frameInterval);
                    frameIndex = (frameIndex + 1) % TOTAL_FRAMES;

                    const col = frameIndex % COLS;
                    const row = Math.floor(frameIndex / COLS);
                    const sx = col * FRAME_WIDTH;
                    const sy = row * FRAME_HEIGHT;
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        img,
                        sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
                        0, 0, canvas.width, canvas.height
                    );
                }
                animId = requestAnimationFrame(render);
            };

            animId = requestAnimationFrame(render);
        };

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [fps]);

    const content = (
        <div className="flex flex-col items-center justify-center gap-6 select-none">
            {/* Mascot Portal Canvas Container */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                {/* Ambient purple/cyan glows */}
                <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute w-36 h-36 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

                {/* 24 FPS Canvas Renderer */}
                <canvas
                    ref={canvasRef}
                    width={FRAME_WIDTH}
                    height={FRAME_HEIGHT}
                    className={`relative z-i10 w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(213,117,255,0.5)] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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
