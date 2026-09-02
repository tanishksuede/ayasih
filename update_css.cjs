const fs = require("fs");
const css = `/* ----------------------------------------------------------
   VibeSpinnerButton.css 
   Premium dimensional instrument
   ---------------------------------------------------------- */

.vsb-wrapper {
  position: relative;
  display: inline-block;
}

.vsb-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 0 6px;
  height: 48px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  isolation: isolate;
  cursor: pointer;
  white-space: nowrap;
  
  /* Dimensional depth */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.8),
    0 10px 20px -5px rgba(0, 0, 0, 0.7);

  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-tap-highlight-color: transparent;
  z-index: 10;
  overflow: hidden;
}

/* Subtle animated light around the control */
.vsb-pill::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: conic-gradient(from 0deg, transparent 0%, rgba(79, 70, 229, 0.3) 25%, transparent 50%);
  animation: rotate-light 4s linear infinite;
  border-radius: 999px;
  z-index: -1;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.vsb-pill:not(.vsb-locked):hover::before {
  opacity: 1;
  background: conic-gradient(from 0deg, transparent 0%, rgba(99, 102, 241, 0.6) 25%, transparent 50%);
}

@keyframes rotate-light {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .vsb-pill {
    height: 52px;
    padding: 0 24px 0 8px;
    gap: 14px;
  }
}

.vsb-pill:not(.vsb-locked):hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.8),
    0 12px 25px -5px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(79, 70, 229, 0.2);
}

.vsb-pill:not(.vsb-locked):active {
  transform: translateY(1px) scale(0.98);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 2px 5px rgba(0, 0, 0, 0.4);
}

.vsb-locked {
  cursor: not-allowed;
  background: rgba(10, 15, 25, 0.8);
  box-shadow: none;
  border-color: rgba(255,255,255,0.05);
}
.vsb-locked::before { display: none; }

.vsb-mini-wheel-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.8);
}

.vsb-mini-wheel {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  animation: vsb-spin 8s linear infinite;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.vsb-mini-wheel-locked {
  animation: none;
  filter: grayscale(1) opacity(0.5);
}

.vsb-wheel-face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    #f59e0b 0deg 60deg,
    #10b981 60deg 120deg,
    #06b6d4 120deg 180deg,
    #8b5cf6 180deg 240deg,
    #ec4899 240deg 300deg,
    #ef4444 300deg 360deg
  );
}
.vsb-wheel-face-locked {
  background: conic-gradient(
    #475569 0deg 60deg,
    #334155 60deg 120deg,
    #1e293b 120deg 180deg,
    #0f172a 180deg 240deg,
    #334155 240deg 300deg,
    #475569 300deg 360deg
  );
}

.vsb-wheel-rim {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}

.vsb-wheel-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #334155;
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

@keyframes vsb-spin {
  100% { transform: rotate(360deg); }
}

.vsb-title {
  color: #f8fafc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}
@media (min-width: 768px) {
  .vsb-title {
    font-size: 13px;
  }
}

.vibe-spinner-locked {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spinner-lock-icon {
  font-size: 12px;
}
.spinner-locked-text {
  display: flex;
  flex-direction: column;
}
.spinner-locked-title {
  font-size: 8px;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.spinner-countdown {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* Toast */
.vsb-locked-toast {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255,255,255,0.1);
  color: #f1f5f9;
  font-size: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  animation: vsb-toast-in 0.2s cubic-bezier(0.16,1,0.3,1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
}
@keyframes vsb-toast-in {
  0% { opacity: 0; transform: translate(-50%, -4px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}

.vsb-sparkle { display: none; }
`;
fs.writeFileSync("src/components/MoodWheel/VibeSpinnerButton.css", css);
console.log("Updated CSS");

