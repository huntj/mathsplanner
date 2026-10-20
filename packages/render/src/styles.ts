// Base styles for rendered questions. Apps add KaTeX's own stylesheet (katex/dist/katex.min.css)
// and can override these through the custom properties.
export const questionStyles = `
.mp-question {
  --mp-text: CanvasText;
  --mp-muted: color-mix(in srgb, CanvasText 60%, Canvas);
  --mp-border: color-mix(in srgb, CanvasText 20%, Canvas);
  --mp-correct: #1a7f37;
  color: var(--mp-text);
  line-height: 1.6;
}
.mp-question .katex { font-size: 1.1em; }
.mp-stem { margin-bottom: 0.75em; }
.mp-parts { list-style: none; padding: 0; margin: 0; }
.mp-part { margin: 0 0 1em; }
.mp-label { font-weight: 600; margin-right: 0.25em; }
.mp-marks { color: var(--mp-muted); white-space: nowrap; float: right; margin-left: 1em; }
.mp-options { list-style: none; padding: 0; margin: 0.5em 0; display: grid; gap: 0.4em; }
.mp-options li { border: 1px solid var(--mp-border); border-radius: 6px; padding: 0.4em 0.6em; }
.mp-options li.mp-correct { border: 2px solid var(--mp-correct); }
.mp-options li.mp-correct::after { content: " ✓ correct"; color: var(--mp-correct); font-weight: 600; }
.mp-option-letter { font-weight: 600; margin-right: 0.35em; }
.mp-match { display: grid; grid-template-columns: 1fr 1fr; gap: 1em; }
.mp-answer, .mp-solution { border-left: 3px solid var(--mp-correct); padding: 0.25em 0.75em; margin: 0.5em 0; }
.mp-heading { font-weight: 600; }
.mp-misconceptions ul { margin: 0.25em 0; padding-left: 1.25em; }
.mp-remediate { color: var(--mp-muted); }
.mp-math-display { overflow-x: auto; }
.mp-diagram-pending {
  margin: 0.75em 0; padding: 1.5em 1em; text-align: center;
  border: 2px dashed var(--mp-border); border-radius: 8px; color: var(--mp-muted);
}
`;
