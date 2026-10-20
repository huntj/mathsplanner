// Builds a worksheet's HTML from its settings: the same settings and seed give the same sheet as
// the practice app's worksheet page.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Depth, Numbers, Question } from "@mathsplanner/core";
import { generators, selectQuestions } from "@mathsplanner/generators";
import { worksheetDocument, worksheetSubtitle } from "@mathsplanner/render";

export interface WorksheetSettings {
  statements: string[];
  depths: Depth[];
  numbers: Numbers;
  count: number;
  seed: number;
  title: string;
  answers: boolean;
  solutions: boolean;
  reducedInk: boolean;
  /** Printed on every page, e.g. the practice app link that regenerates the sheet. */
  footer?: string;
}

export function worksheetQuestions(settings: WorksheetSettings): Question[] {
  const byId = new Map(generators.map((g) => [g.id, g]));
  return selectQuestions(generators, settings).flatMap(({ statementId, depth, seed }) => {
    const generator = byId.get(statementId);
    return generator ? [generator.generate({ depth, numbers: settings.numbers, seed })] : [];
  });
}

/** KaTeX's stylesheet with its fonts inlined, so the page needs nothing from disk or the web. */
function katexCss(): string {
  const require = createRequire(import.meta.url);
  const css = require.resolve("katex/dist/katex.min.css");
  const fonts = join(dirname(css), "fonts");
  return readFileSync(css, "utf8")
    .replace(/,url\(fonts\/[^)]+\.(woff|ttf)\) format\("(woff|truetype)"\)/g, "")
    .replace(/url\(fonts\/([^)]+\.woff2)\)/g, (_, file: string) => {
      const data = readFileSync(join(fonts, file)).toString("base64");
      return `url(data:font/woff2;base64,${data})`;
    });
}

export function worksheetHtml(settings: WorksheetSettings): {
  html: string;
  questions: Question[];
} {
  const questions = worksheetQuestions(settings);
  if (questions.length === 0) throw new Error("no questions: check the statement IDs and depths");
  const html = worksheetDocument(
    questions,
    {
      title: settings.title,
      subtitle: worksheetSubtitle(settings.statements, settings.numbers, questions.length),
      answers: settings.answers,
      solutions: settings.solutions,
      reducedInk: settings.reducedInk,
      footer: settings.footer ?? `MathsPlanner · seed ${settings.seed}`,
    },
    `<style>${katexCss()}</style>`,
  );
  return { html, questions };
}
