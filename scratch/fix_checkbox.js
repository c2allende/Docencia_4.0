
const fs = require("fs");
const file = "docencia-4.0/styles/main.css";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  /\.lesson-remember__check\s*\{[^}]+\}/,
  `.lesson-remember__check {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 1.05rem;
  height: 1.05rem;
  border-radius: var(--radius-xs);
  background: var(--color-feedback-success-container);
  color: var(--color-feedback-success-on);
  font-weight: var(--font-weight-extrabold);
  line-height: 1;
}`
);

fs.writeFileSync(file, content, "utf8");
console.log("Updated check box CSS");

