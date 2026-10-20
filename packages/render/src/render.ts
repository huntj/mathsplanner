// Question → HTML. The output is a plain string with no browser dependency, so the gallery,
// the practice app and print export all show a question the same way. Maths goes through KaTeX
// with HTML and MathML output, so screen readers get real maths.
import type {
  Accuracy,
  AnswerSpec,
  AnswerValue,
  DiagramSpec,
  Misconception,
  Option,
  Part,
  Question,
  Rich,
  SolutionStep,
} from "@mathsplanner/core";
import katex from "katex";

export interface RenderOptions {
  /** Show each part's answer and its misconceptions (teacher view). */
  showAnswers?: boolean;
  /** Show the worked solution. */
  showSolution?: boolean;
}

export class RenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RenderError";
  }
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** LaTeX → HTML. Bad LaTeX throws, so generator tests catch it rather than students. */
export function renderMath(latex: string, display = false): string {
  try {
    return katex.renderToString(latex, {
      displayMode: display,
      output: "htmlAndMathml",
      throwOnError: true,
      strict: "error",
    });
  } catch (error) {
    throw new RenderError(`cannot render LaTeX "${latex}": ${(error as Error).message}`);
  }
}

/** A placeholder until the diagram engine (Phase 3) draws real SVG. */
function renderDiagram(spec: DiagramSpec | undefined, index: number): string {
  if (!spec) throw new RenderError(`diagram ${index} does not exist`);
  const label = `${spec.type} diagram (not drawn yet: the diagram engine arrives in Phase 3)`;
  return `<figure class="mp-diagram mp-diagram-pending" role="img" aria-label="${escapeHtml(label)}"><figcaption>${escapeHtml(label)}</figcaption></figure>`;
}

export function renderRich(rich: Rich, diagrams: readonly DiagramSpec[] = []): string {
  return rich
    .map((node) => {
      switch (node.t) {
        case "text":
          return escapeHtml(node.v);
        case "math":
          return node.display
            ? `<div class="mp-math-display">${renderMath(node.v, true)}</div>`
            : renderMath(node.v);
        case "diagram":
          return renderDiagram(diagrams[node.i], node.i);
      }
    })
    .join("");
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function optionList(
  options: readonly Option[],
  diagrams: readonly DiagramSpec[],
  correct: readonly string[] = [],
): string {
  const items = options.map((o, i) => {
    const mark = correct.includes(o.id) ? ' class="mp-correct"' : "";
    return `<li${mark} data-option="${escapeHtml(o.id)}"><span class="mp-option-letter">${LETTERS[i] ?? i + 1}</span> ${renderRich(o.content, diagrams)}</li>`;
  });
  return `<ol class="mp-options">${items.join("")}</ol>`;
}

/** What the student sees besides the prompt: options to choose from, items to order or match. */
function renderResponseArea(
  answer: AnswerSpec,
  diagrams: readonly DiagramSpec[],
  showAnswers: boolean,
): string {
  switch (answer.type) {
    case "choice":
      return optionList(answer.options, diagrams, showAnswers ? [answer.correct] : []);
    case "multi-select":
      return optionList(answer.options, diagrams, showAnswers ? answer.correct : []);
    case "choice-with-reason":
      return (
        optionList(answer.options, diagrams, showAnswers ? [answer.correct] : []) +
        `<p class="mp-reason-prompt">Choose a reason:</p>` +
        optionList(answer.reasons, diagrams, showAnswers ? [answer.correctReason] : [])
      );
    case "order":
      return optionList(answer.options, diagrams);
    case "match":
      return `<div class="mp-match">${optionList(answer.left, diagrams)}${optionList(answer.right, diagrams)}</div>`;
    default:
      return "";
  }
}

function accuracyText(accuracy: Accuracy): string {
  if ("dp" in accuracy) return ` (to ${accuracy.dp} decimal place${accuracy.dp === 1 ? "" : "s"})`;
  if ("sf" in accuracy)
    return ` (to ${accuracy.sf} significant figure${accuracy.sf === 1 ? "" : "s"})`;
  if ("tolerance" in accuracy) return ` (±${accuracy.tolerance})`;
  return "";
}

function optionContent(
  options: readonly Option[],
  id: string,
  diagrams: readonly DiagramSpec[],
): string {
  const index = options.findIndex((o) => o.id === id);
  const option = options[index];
  if (!option) throw new RenderError(`option "${id}" does not exist`);
  return `<span class="mp-option-letter">${LETTERS[index] ?? index + 1}</span> ${renderRich(option.content, diagrams)}`;
}

const FORM_TEXT: Record<string, string> = {
  simplest: "in its simplest form",
  "mixed-number": "as a mixed number",
  improper: "as an improper fraction",
  factorised: "factorised",
  expanded: "expanded",
  "standard-form": "in standard form",
  surd: "in surd form",
  decimal: "as a decimal",
};

/** The correct answer, as a teacher would read it. */
export function renderAnswer(answer: AnswerSpec, diagrams: readonly DiagramSpec[] = []): string {
  switch (answer.type) {
    case "number": {
      // Degrees and percentages sit against the number (63°, 15%); other units take a space (5 cm).
      const units = answer.units
        ? /^[°%]$/.test(answer.units)
          ? answer.units
          : ` ${answer.units}`
        : "";
      return escapeHtml(`${answer.value}${units}${accuracyText(answer.accuracy)}`);
    }
    case "exact":
      return (
        renderMath(answer.value) +
        (answer.form ? ` ${escapeHtml(`(${FORM_TEXT[answer.form] ?? answer.form})`)}` : "")
      );
    case "coordinate":
      return renderMath(`(${answer.x}, ${answer.y})`);
    case "choice":
      return optionContent(answer.options, answer.correct, diagrams);
    case "multi-select":
      return answer.correct.map((id) => optionContent(answer.options, id, diagrams)).join("; ");
    case "choice-with-reason":
      return `${optionContent(answer.options, answer.correct, diagrams)}, because ${optionContent(answer.reasons, answer.correctReason, diagrams)}`;
    case "order":
      return answer.correct.map((id) => optionContent(answer.options, id, diagrams)).join(", ");
    case "match":
      return answer.correct
        .map(
          ([l, r]) =>
            `${optionContent(answer.left, l, diagrams)} ↔ ${optionContent(answer.right, r, diagrams)}`,
        )
        .join("; ");
    case "plot":
      return `${escapeHtml("Plot as shown")} ${renderDiagram(answer.target, -1)}`;
    case "condition":
      return `Any answer that satisfies: ${renderRich(answer.describe, diagrams)}`;
    case "free-text":
      return `Mark scheme: ${renderRich(answer.markScheme, diagrams)}`;
  }
}

/** A wrong answer a misconception produces. */
export function renderAnswerValue(value: AnswerValue): string {
  switch (value.type) {
    case "number":
      return escapeHtml(String(value.value));
    case "exact":
      return renderMath(value.latex);
    case "coordinate":
      return renderMath(`(${value.x}, ${value.y})`);
    case "choice":
      return `option ${escapeHtml(value.id)}`;
    case "choices":
    case "order":
      return `options ${escapeHtml(value.ids.join(", "))}`;
    case "choice-with-reason":
      return `option ${escapeHtml(value.id)}, reason ${escapeHtml(value.reason)}`;
    case "match":
      return escapeHtml(value.pairs.map(([l, r]) => `${l}–${r}`).join(", "));
    case "values":
      return value.values.map(renderAnswerValue).join(", ");
    case "text":
      return escapeHtml(value.text);
  }
}

function renderMisconceptions(misconceptions: readonly Misconception[]): string {
  if (misconceptions.length === 0) return "";
  const items = misconceptions.map(
    (m) =>
      `<li><code>${escapeHtml(m.code)}</code>: ${renderAnswerValue(m.answer)}. ${renderRich(m.feedback)}${m.remediate ? ` <span class="mp-remediate">Step back to ${escapeHtml(m.remediate)}.</span>` : ""}</li>`,
  );
  return `<div class="mp-misconceptions"><p class="mp-heading">Misconceptions</p><ul>${items.join("")}</ul></div>`;
}

function renderPart(part: Part, diagrams: readonly DiagramSpec[], options: RenderOptions): string {
  const label = part.label ? `<span class="mp-label">${escapeHtml(part.label)}</span> ` : "";
  const marks = `<span class="mp-marks">[${part.marks} mark${part.marks === 1 ? "" : "s"}]</span>`;
  const answer = options.showAnswers
    ? `<div class="mp-answer"><p><span class="mp-heading">Answer:</span> ${renderAnswer(part.answer, diagrams)}</p>${renderMisconceptions(part.misconceptions)}</div>`
    : "";
  return `<li class="mp-part"><div class="mp-prompt">${label}${renderRich(part.prompt, diagrams)} ${marks}</div>${renderResponseArea(part.answer, diagrams, options.showAnswers ?? false)}${answer}</li>`;
}

function renderSolution(steps: readonly SolutionStep[], diagrams: readonly DiagramSpec[]): string {
  if (steps.length === 0) return "";
  const items = steps.map((s) => {
    const math = s.math ? `<div class="mp-math-display">${renderMath(s.math, true)}</div>` : "";
    const diagram = s.diagram === undefined ? "" : renderDiagram(diagrams[s.diagram], s.diagram);
    return `<li>${renderRich(s.say, diagrams)}${math}${diagram}</li>`;
  });
  return `<section class="mp-solution" aria-label="Worked solution"><p class="mp-heading">Worked solution</p><ol>${items.join("")}</ol></section>`;
}

/** The whole question as HTML: the same question and options always give the same string. */
export function renderQuestion(question: Question, options: RenderOptions = {}): string {
  const { key, diagrams } = question;
  const keyText = `${key.statementId} depth ${key.depth} ${key.numbers} seed ${key.seed} v${key.version}`;
  const parts = question.parts.map((p) => renderPart(p, diagrams, options)).join("");
  const solution = options.showSolution ? renderSolution(question.solution, diagrams) : "";
  return `<article class="mp-question" data-key="${escapeHtml(keyText)}"><div class="mp-stem">${renderRich(question.stem, diagrams)}</div><ol class="mp-parts">${parts}</ol>${solution}</article>`;
}
