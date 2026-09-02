const fs = require("fs");
const css = `
@layer utilities {
  .premium-panel {
    @apply bg-[#0b0f19]/90 border border-slate-700/50 shadow-2xl;
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.8),
      0 10px 40px -10px rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(12px);
  }
  
  .premium-card {
    @apply bg-[#111827]/80 border border-[#1f2937] rounded-2xl;
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.03),
      0 4px 20px -2px rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .premium-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
      0 8px 30px -4px rgba(0, 0, 0, 0.8),
      0 0 20px 0 rgba(79, 70, 229, 0.15); /* subtle indigo glow */
  }

  .premium-button {
    @apply bg-slate-800 text-slate-200 rounded-full font-semibold tracking-wide border border-slate-700;
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.6),
      0 4px 10px rgba(0, 0, 0, 0.5);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .premium-button:hover {
    @apply bg-slate-700 text-white;
    transform: translateY(-1px);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.6),
      0 6px 15px rgba(0, 0, 0, 0.6);
  }

  .premium-button:active {
    transform: translateY(1px);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.5),
      0 2px 5px rgba(0, 0, 0, 0.4);
  }

  .premium-button-accent {
    @apply bg-indigo-600 text-white rounded-full font-semibold tracking-wide border border-indigo-500;
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.5),
      0 4px 15px rgba(79, 70, 229, 0.3);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .premium-button-accent:hover {
    @apply bg-indigo-500;
    transform: translateY(-1px);
    box-shadow: 
      inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.5),
      0 6px 20px rgba(79, 70, 229, 0.4);
  }

  .premium-button-accent:active {
    transform: translateY(1px);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 2px 5px rgba(79, 70, 229, 0.2);
  }

  .premium-text {
    @apply text-slate-300 font-medium;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  }

  .premium-title {
    @apply text-slate-50 font-bold tracking-tight;
    text-shadow: 0 2px 4px rgba(0,0,0,0.9);
  }
}
`;
fs.appendFileSync("src/index.css", css);
console.log("Appended CSS");

