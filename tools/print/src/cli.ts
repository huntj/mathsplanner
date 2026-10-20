// pnpm print --statements Y5-GEO-04,Y6-GEO-03 --depths 1,2,4 --count 10 --seed 42 --out sheet.pdf
// Prints a worksheet to PDF. Run with --help for every option.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { DEPTHS, NUMBERS, type Depth, type Numbers } from "@mathsplanner/core";
import { htmlToPdf } from "./pdf.ts";
import { worksheetHtml, type WorksheetSettings } from "./worksheet.ts";

const HELP = `Print a MathsPlanner worksheet to PDF.

  --statements  IDs, comma-separated (required), e.g. Y5-GEO-04,Y6-GEO-03
  --depths      depths 1-5, comma-separated (default 1,2,3,4)
  --numbers     friendly, standard or stretch (default standard)
  --count       number of questions, 1-40 (default 10)
  --seed        seed (default 1); the same settings and seed give the same sheet
  --title       title (default "Maths practice")
  --no-answers  leave out the answer pages
  --no-solutions  leave out worked solutions
  --reduced-ink lighter shading and fewer rules, for photocopying
  --html        also write the HTML next to the PDF
  --out         output file (default worksheet.pdf)
`;

function settingsFrom(argv: string[]): { settings: WorksheetSettings; out: string; html: boolean } {
  const { values } = parseArgs({
    args: argv,
    options: {
      statements: { type: "string" },
      depths: { type: "string", default: "1,2,3,4" },
      numbers: { type: "string", default: "standard" },
      count: { type: "string", default: "10" },
      seed: { type: "string", default: "1" },
      title: { type: "string", default: "Maths practice" },
      "no-answers": { type: "boolean", default: false },
      "no-solutions": { type: "boolean", default: false },
      "reduced-ink": { type: "boolean", default: false },
      html: { type: "boolean", default: false },
      out: { type: "string", default: "worksheet.pdf" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help || !values.statements) {
    console.log(HELP);
    process.exit(values.help ? 0 : 1);
  }
  const depths = values.depths.split(",").map(Number) as Depth[];
  if (!depths.every((d) => DEPTHS.includes(d))) throw new Error(`bad --depths ${values.depths}`);
  if (!NUMBERS.includes(values.numbers as Numbers))
    throw new Error(`bad --numbers ${values.numbers}`);
  const count = Number(values.count);
  const seed = Number(values.seed);
  if (!(Number.isInteger(count) && count >= 1 && count <= 40))
    throw new Error(`bad --count ${values.count}`);
  if (!(Number.isSafeInteger(seed) && seed >= 0)) throw new Error(`bad --seed ${values.seed}`);
  return {
    settings: {
      statements: values.statements.split(","),
      depths,
      numbers: values.numbers as Numbers,
      count,
      seed,
      title: values.title,
      answers: !values["no-answers"],
      solutions: !values["no-solutions"],
      reducedInk: values["reduced-ink"],
    },
    out: resolve(process.env.INIT_CWD ?? process.cwd(), values.out),
    html: values.html,
  };
}

const { settings, out, html: keepHtml } = settingsFrom(process.argv.slice(2));
const { html, questions } = worksheetHtml(settings);
if (keepHtml) writeFileSync(out.replace(/\.pdf$/i, "") + ".html", html);
writeFileSync(out, await htmlToPdf(html));
console.log(`Wrote ${out}: ${questions.length} questions, seed ${settings.seed}.`);
