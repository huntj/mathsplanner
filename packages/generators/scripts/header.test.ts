import { describe, expect, it } from "vitest";
import { findGenerators } from "./coverage.ts";
import { parseHeader } from "./header.ts";

describe("generator headers", () => {
  it("read the author, AI note and every review", () => {
    const header = parseHeader(`/**
 * @statement Y6-FR-03
 * @author @someone
 * @ai-assisted no
 * @reviewed 2026-11-02 @teacher (KS2 teacher): depths 1-5
 * @reviewed 2027-01-15 @other: depth 4 again
 */
export default 1;`);
    expect(header).toEqual({
      statement: "Y6-FR-03",
      author: "@someone",
      aiAssisted: "no",
      reviews: [
        { date: "2026-11-02", reviewer: "@teacher", note: "(KS2 teacher): depths 1-5" },
        { date: "2027-01-15", reviewer: "@other", note: ": depth 4 again" },
      ],
    });
    expect(parseHeader("export default 1;").reviews).toEqual([]);
  });

  it("are complete in every generator file", () => {
    for (const g of findGenerators()) {
      expect(g.header.statement, g.path).toBe(g.fileId);
      expect(g.header.author, g.path).toMatch(/^@\S+/);
      expect(g.header.aiAssisted, g.path).toMatch(/^(no|yes: .+)$/);
    }
  });
});
