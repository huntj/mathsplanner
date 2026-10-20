// A4 worksheets: numbered questions laid out for paper, then (optionally) answer pages with worked
// solutions. The same HTML prints from a browser or goes to PDF through Playwright, and every
// page carries the settings and seed that regenerate it.
import type { Question } from "@mathsplanner/core";
import { escapeHtml, renderPartAnswer, renderQuestion, renderSolution } from "./render.ts";
import { questionStyles } from "./styles.ts";

export interface WorksheetOptions {
  title: string;
  /** A line under the title, e.g. the statements and numbers setting. */
  subtitle?: string;
  /** Include the questions (default) and the answer pages. */
  questions?: boolean;
  answers?: boolean;
  /** Worked solutions on the answer pages. */
  solutions?: boolean;
  /** Lighter shading and fewer rules, for photocopying. */
  reducedInk?: boolean;
  /** Printed at the foot of every page: how to regenerate the sheet. */
  footer?: string;
}

/** The line under a worksheet's title: what it covers. */
export function worksheetSubtitle(
  statements: readonly string[],
  numbers: string,
  count: number,
): string {
  return `${statements.join(", ")} · ${numbers} numbers · ${count} question${count === 1 ? "" : "s"}`;
}

const DEPTH_NAMES = [
  "",
  "Fluency",
  "Varied fluency",
  "Representation",
  "Reasoning",
  "Problem solving",
];

function header(options: WorksheetOptions, answers: boolean): string {
  const fields = answers
    ? ""
    : `<div class="ws-fields"><span>Name ${'<span class="mp-blank"></span>'}</span><span>Class <span class="mp-blank mp-short"></span></span><span>Date <span class="mp-blank mp-short"></span></span></div>`;
  return `<header class="ws-header"><h1>${escapeHtml(options.title)}${answers ? ": answers" : ""}</h1>${options.subtitle ? `<p class="ws-subtitle">${escapeHtml(options.subtitle)}</p>` : ""}${fields}</header>`;
}

/** The worksheet's body HTML. Style it with `worksheetStyles` (and KaTeX's stylesheet). */
export function renderWorksheet(questions: readonly Question[], options: WorksheetOptions): string {
  const showQuestions = options.questions ?? true;
  const marks = questions.reduce((sum, q) => sum + q.parts.reduce((s, p) => s + p.marks, 0), 0);
  const sections: string[] = [];
  if (showQuestions) {
    const items = questions.map(
      (q, i) =>
        `<section class="ws-question"><span class="ws-number">${i + 1}</span>${renderQuestion(q, { print: true })}</section>`,
    );
    sections.push(
      `<div class="ws-page">${header(options, false)}${items.join("")}<p class="ws-total">Total: <span class="mp-blank mp-short"></span> / ${marks} mark${marks === 1 ? "" : "s"}</p></div>`,
    );
  }
  if (options.answers) {
    const items = questions.map((q, i) => {
      const { key, diagrams } = q;
      const parts = q.parts
        .map(
          (p, k) =>
            `${q.parts.length > 1 ? `<p class="ws-part">(${String.fromCharCode(97 + k)})</p>` : ""}${renderPartAnswer(p, diagrams)}`,
        )
        .join("");
      const solution = options.solutions ? renderSolution(q.solution, diagrams) : "";
      const worth = q.parts.reduce((s, p) => s + p.marks, 0);
      const ref = `${key.statementId} · depth ${key.depth} ${DEPTH_NAMES[key.depth] ?? ""} · ${worth} mark${worth === 1 ? "" : "s"}`;
      return `<section class="ws-question ws-answer"><span class="ws-number">${i + 1}</span><div class="mp-question"><p class="ws-ref">${escapeHtml(ref)}</p>${parts}${solution}</div></section>`;
    });
    sections.push(
      `<div class="ws-page ws-answers">${header(options, true)}${items.join("")}</div>`,
    );
  }
  const footer = options.footer
    ? `<footer class="ws-footer">${escapeHtml(options.footer)}</footer>`
    : "";
  return `<div class="ws${options.reducedInk ? " ws-reduced-ink" : ""}">${sections.join("")}${footer}</div>`;
}

/** A4 layout for worksheets, on screen as a preview and on paper. */
export const worksheetStyles = `
@page { size: A4; margin: 14mm 15mm 16mm; }
.ws { --ws-rule: #b9b4aa; color: #111; background: #fff; font: 11pt/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.ws .mp-question { --mp-text: #111; --mp-muted: #555; --mp-border: #b9b4aa; --mp-correct: #1a7f37; }
.ws-page { padding: 0 0 1em; }
.ws-page + .ws-page { break-before: page; margin-top: 2.5em; }
.ws-header { border-bottom: 2px solid #111; padding-bottom: 0.5em; margin-bottom: 0.75em; }
.ws-header h1 { font-size: 17pt; margin: 0; line-height: 1.2; }
.ws-subtitle { margin: 0.2em 0 0; color: #555; }
.ws-fields { display: flex; flex-wrap: wrap; gap: 0.5em 2em; margin-top: 0.75em; }
.ws-fields .mp-blank { min-width: 12em; }
.ws-fields .mp-blank.mp-short { min-width: 6em; }
.ws-question { display: grid; grid-template-columns: 2em 1fr; gap: 0.25em; padding: 0.6em 0; border-top: 0.5pt solid var(--ws-rule); break-inside: avoid; }
.ws-header + .ws-question { border-top: 0; }
.ws-number { font-weight: 700; font-size: 12pt; }
.ws .mp-question { min-width: 0; }
.ws .mp-stem { margin-bottom: 0.4em; }
.ws .mp-prompt { display: flow-root; }
.ws .mp-match { grid-template-columns: 1fr 1fr; gap: 0.75em; }
.ws .mp-diagram { margin: 0.4em 0; }
.ws .mp-diagram svg { max-height: 6.5cm; width: auto; }
.ws .mp-true-size svg { max-height: none; }
.ws .mp-options { gap: 0.25em; }
.ws .mp-options li { padding: 0.2em 0.5em; }
.ws .mp-options:has(svg) { grid-template-columns: repeat(auto-fit, minmax(5.5cm, 1fr)); }
.ws .mp-options:has(svg) svg { max-height: 4.5cm; }
.ws .mp-match .mp-options li svg { max-height: 3.5cm; }
.ws-total { text-align: right; font-weight: 600; margin-top: 1em; }
.ws-ref { color: #555; margin: 0 0 0.3em; font-size: 9.5pt; }
.ws-part { margin: 0.3em 0 0; font-weight: 600; }
.ws .mp-answer { border-left: 3px solid var(--mp-correct); padding: 0.1em 0.6em; margin: 0.2em 0; }
.ws .mp-solution { border-left: 3px solid var(--ws-rule); padding: 0.1em 0.6em; }
.ws .mp-misconceptions { font-size: 9.5pt; }
.ws-footer { color: #666; font-size: 8.5pt; margin-top: 1.5em; }
.ws-reduced-ink { --ws-rule: #ddd; }
.ws-reduced-ink .ws-header { border-bottom-width: 1px; }
.ws-reduced-ink svg [fill-opacity] { fill-opacity: 0.06; }
.ws-reduced-ink .mp-options li { border-color: #ddd; }
@media print {
  .ws-page + .ws-page { margin-top: 0; }
  .ws-footer { position: fixed; bottom: -10mm; left: 0; right: 0; margin: 0; }
}
`;

/** A complete HTML document for one worksheet; `head` adds e.g. KaTeX's stylesheet. */
export function worksheetDocument(
  questions: readonly Question[],
  options: WorksheetOptions,
  head = "",
): string {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${escapeHtml(options.title)}</title>${head}<style>${questionStyles}${worksheetStyles}body{margin:0;background:#fff}</style></head><body>${renderWorksheet(questions, options)}</body></html>`;
}
