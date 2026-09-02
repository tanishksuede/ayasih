// Generated from mascot-48frame-loader.html
export const MASCOT_LOOP_DURATION = 1920;
export const TOTAL_MASCOT_FRAMES = 44;
export const MASCOT_FRAMES = [
    { ms: 0, path: '/assets/mascot_frames/frame_1.png', index: 0 },
    { ms: 40, path: '/assets/mascot_frames/frame_2.png', index: 1 },
    { ms: 80, path: '/assets/mascot_frames/frame_3.png', index: 2 },
    { ms: 120, path: '/assets/mascot_frames/frame_4.png', index: 3 },
    { ms: 160, path: '/assets/mascot_frames/frame_5.png', index: 4 },
    { ms: 200, path: '/assets/mascot_frames/frame_6.png', index: 5 },
    { ms: 280, path: '/assets/mascot_frames/frame_7.png', index: 6 },
    { ms: 320, path: '/assets/mascot_frames/frame_8.png', index: 7 },
    { ms: 360, path: '/assets/mascot_frames/frame_9.png', index: 8 },
    { ms: 400, path: '/assets/mascot_frames/frame_10.png', index: 9 },
    { ms: 440, path: '/assets/mascot_frames/frame_11.png', index: 10 },
    { ms: 480, path: '/assets/mascot_frames/frame_12.png', index: 11 },
    { ms: 520, path: '/assets/mascot_frames/frame_13.png', index: 12 },
    { ms: 560, path: '/assets/mascot_frames/frame_14.png', index: 13 },
    { ms: 600, path: '/assets/mascot_frames/frame_15.png', index: 14 },
    { ms: 640, path: '/assets/mascot_frames/frame_16.png', index: 15 },
    { ms: 720, path: '/assets/mascot_frames/frame_17.png', index: 16 },
    { ms: 760, path: '/assets/mascot_frames/frame_18.png', index: 17 },
    { ms: 800, path: '/assets/mascot_frames/frame_19.png', index: 18 },
    { ms: 840, path: '/assets/mascot_frames/frame_20.png', index: 19 },
    { ms: 880, path: '/assets/mascot_frames/frame_21.png', index: 20 },
    { ms: 920, path: '/assets/mascot_frames/frame_22.png', index: 21 },
    { ms: 960, path: '/assets/mascot_frames/frame_23.png', index: 22 },
    { ms: 1000, path: '/assets/mascot_frames/frame_24.png', index: 23 },
    { ms: 1040, path: '/assets/mascot_frames/frame_25.png', index: 24 },
    { ms: 1080, path: '/assets/mascot_frames/frame_26.png', index: 25 },
    { ms: 1160, path: '/assets/mascot_frames/frame_27.png', index: 26 },
    { ms: 1200, path: '/assets/mascot_frames/frame_28.png', index: 27 },
    { ms: 1240, path: '/assets/mascot_frames/frame_29.png', index: 28 },
    { ms: 1280, path: '/assets/mascot_frames/frame_30.png', index: 29 },
    { ms: 1320, path: '/assets/mascot_frames/frame_31.png', index: 30 },
    { ms: 1360, path: '/assets/mascot_frames/frame_32.png', index: 31 },
    { ms: 1400, path: '/assets/mascot_frames/frame_33.png', index: 32 },
    { ms: 1440, path: '/assets/mascot_frames/frame_34.png', index: 33 },
    { ms: 1480, path: '/assets/mascot_frames/frame_35.png', index: 34 },
    { ms: 1520, path: '/assets/mascot_frames/frame_36.png', index: 35 },
    { ms: 1560, path: '/assets/mascot_frames/frame_37.png', index: 36 },
    { ms: 1600, path: '/assets/mascot_frames/frame_38.png', index: 37 },
    { ms: 1680, path: '/assets/mascot_frames/frame_39.png', index: 38 },
    { ms: 1720, path: '/assets/mascot_frames/frame_40.png', index: 39 },
    { ms: 1760, path: '/assets/mascot_frames/frame_41.png', index: 40 },
    { ms: 1800, path: '/assets/mascot_frames/frame_42.png', index: 41 },
    { ms: 1840, path: '/assets/mascot_frames/frame_43.png', index: 42 },
    { ms: 1880, path: '/assets/mascot_frames/frame_44.png', index: 43 },
];

export function getFrameIndexForElapsed(elapsedMs: number): number {
    const frames = MASCOT_FRAMES;
    let lo = 0, hi = frames.length - 1;
    if (elapsedMs >= frames[hi].ms) return hi;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (frames[mid].ms <= elapsedMs) lo = mid; else hi = mid - 1;
    }
    return lo;
}
