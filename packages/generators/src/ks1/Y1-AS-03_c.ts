/**
 * @statement Y1-AS-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-03.c: Add and subtract a one-digit and a two-digit number within 20
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y1-AS-03.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-AS-03.c",
  params(rng, numbers) {
    const a = rng.int(11, numbers === "friendly" ? 15 : 19);
    const b = rng.int(1, numbers === "friendly" ? 4 : 9);
    const add = rng.bool();
    if (add && a + b > 20) reject("answers to 20");
    if (numbers === "friendly" && !add && a - b < 10) reject("no crossing ten yet");
    return { a, b, add };
  },
});
