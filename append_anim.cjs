const fs = require("fs");
const css = `
@layer utilities {
  .animate-path-light {
    stroke-dasharray: 60 4000;
    animation: dash-move 8s linear infinite;
  }
}
@keyframes dash-move {
  0% { stroke-dashoffset: 4060; }
  100% { stroke-dashoffset: 0; }
}
`;
fs.appendFileSync("src/index.css", css);
console.log("Appended anim CSS");

