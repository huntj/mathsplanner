// The Phase 6 exit check: a mixed-depth worksheet prints correctly from a seed. The PDF test needs
// an installed Chrome or Edge, and is skipped (with a note) where there is none.
import { describe, expect, it } from "vitest";
import { openBrowser, htmlToPdf } from "./pdf.ts";
import { worksheetHtml, type WorksheetSettings } from "./worksheet.ts";

const settings: WorksheetSettings = {
  statements: ["Y5-GEO-03", "Y5-GEO-04", "Y6-GEO-01", "Y8-GEO-03", "GH-G10"],
  depths: [1, 2, 3, 4, 5],
  numbers: "standard",
  count: 10,
  seed: 11,
  title: "Angles practice",
  answers: true,
  solutions: true,
  reducedInk: false,
};

const browser = await openBrowser().catch(() => undefined);

describe("worksheets", () => {
  it("are the same for the same settings and seed, and mix depths", () => {
    const { html, questions } = worksheetHtml(settings);
    expect(worksheetHtml(settings).html).toBe(html);
    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((q) => q.key.depth)).size).toBeGreaterThan(2);
    expect(worksheetHtml({ ...settings, seed: 12 }).html).not.toBe(html);
  });

  it("number every question, add answer pages on request, and carry the seed", () => {
    const { html } = worksheetHtml(settings);
    for (let n = 1; n <= 10; n++) expect(html).toContain(`<span class="ws-number">${n}</span>`);
    expect(html).toContain("Angles practice: answers");
    expect(html).toContain("Worked solution");
    expect(html).toContain("MathsPlanner · seed 11");
    // KaTeX's fonts travel inside the page, so printing needs nothing else.
    expect(html).toContain("data:font/woff2;base64,");
    const questionsOnly = worksheetHtml({ ...settings, answers: false }).html;
    expect(questionsOnly).not.toContain(": answers");
  });

  it.skipIf(!browser)(
    "print to an A4 PDF with the answers on their own pages",
    async () => {
      const { html } = worksheetHtml(settings);
      const questionsOnly = worksheetHtml({ ...settings, answers: false }).html;
      const pages = (pdf: Buffer) =>
        (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
      const full = await htmlToPdf(html, browser);
      const short = await htmlToPdf(questionsOnly, browser);
      expect(full.subarray(0, 5).toString()).toBe("%PDF-");
      expect(pages(short)).toBeGreaterThanOrEqual(2);
      expect(pages(full)).toBeGreaterThan(pages(short));
      // A4 is 595 × 842 points.
      const box = /\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/.exec(full.toString("latin1"));
      expect(Number(box?.[1])).toBeCloseTo(595, 0);
      expect(Number(box?.[2])).toBeCloseTo(842, 0);
      await browser?.close();
    },
    60_000,
  );
});
