
const fs = require("fs");
const file = "docencia-4.0/styles/main.css";
let content = fs.readFileSync(file, "utf8");

// Fallback if utf8 reading got garbled (hopefully not too bad, or we can just replace the specific string)
content = content.replace("color: var(--color-feedback-success-text, var(--color-brand-primary));", "color: var(--color-feedback-success);");

fs.writeFileSync(file, content, "utf8");
console.log("Check color updated");

