// LaTeX in generator source must double its backslashes: in a JavaScript string "\text" is a tab
// followed by "ext", and "\frac" a form feed, so a single backslash silently breaks the maths.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const here = join(dirname(fileURLToPath(import.meta.url)), "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? e.name === "__snapshots__"
        ? []
        : files(join(dir, e.name))
      : e.name.endsWith(".ts")
        ? [join(dir, e.name)]
        : [],
  );
const COMMANDS = [
  "text",
  "times",
  "frac",
  "circ",
  "pi",
  "sqrt",
  "le",
  "ge",
  "div",
  "cdot",
  "boxed",
  "rightarrow",
  "Rightarrow",
  "equiv",
  "square",
  "quad",
  "hline",
  "begin",
  "end",
  "pm",
  "theta",
  "left",
  "right",
  "mathrm",
  "mathbf",
  "dfrac",
  "overrightarrow",
];
const single = new RegExp(`(^|[^\\\\])\\\\(${COMMANDS.join("|")})(?![a-zA-Z])`);

test("LaTeX commands in generator strings use doubled backslashes", () => {
  const found: string[] = [];
  for (const file of files(here)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const t = line.trim();
        if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
        if (single.test(line)) found.push(`${file.slice(here.length + 1)}:${i + 1}`);
      });
  }
  expect(found).toEqual([]);
});
