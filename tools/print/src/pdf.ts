// HTML to PDF with Playwright, using a Chrome or Edge that is already installed, so nothing is
// downloaded. Set MATHSPLANNER_BROWSER to a browser's path to use another one.
import { chromium, type Browser } from "playwright-core";

/** Opens an installed Chromium-based browser, or explains how to point at one. */
export async function openBrowser(): Promise<Browser> {
  const path = process.env.MATHSPLANNER_BROWSER;
  if (path) return chromium.launch({ executablePath: path });
  const tried: string[] = [];
  for (const channel of ["chrome", "msedge", "chromium"]) {
    try {
      return await chromium.launch({ channel });
    } catch (error) {
      tried.push(`${channel}: ${(error as Error).message.split("\n")[0] ?? ""}`);
    }
  }
  throw new Error(
    `No Chrome or Edge found. Install one, or set MATHSPLANNER_BROWSER to a Chromium-based browser.\n${tried.join("\n")}`,
  );
}

/** Prints a complete HTML document to an A4 PDF, using the page's own @page margins. */
export async function htmlToPdf(html: string, browser?: Browser): Promise<Buffer> {
  const own = browser ?? (await openBrowser());
  try {
    const page = await own.newPage();
    await page.setContent(html, { waitUntil: "load" });
    // Wait for KaTeX's fonts, so maths is measured and drawn in them.
    await page.evaluate("document.fonts.ready");
    const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
    await page.close();
    return pdf;
  } finally {
    if (!browser) await own.close();
  }
}
