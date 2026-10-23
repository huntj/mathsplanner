/**
 * @statement FM-CP-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-02.c: Solve quadratics with complex roots
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-02.ts";

const own = concept(
  "FM-CP-02.c",
  ["CPLX.CONJUGATE", "ALG.QUADRATIC.FORMULA"],
  [
    {
      question: "Solve $z^2 + 9 = 0$.",
      correct: "$z = 3i$ or $z = -3i$",
      wrong: [
        ["$z = 3i$", "Square roots come in pairs: −3i also works.", "CPLX.CONJUGATE"],
        ["$z = 3$ or $z = -3$", "3² + 9 = 18, not 0. You need z² = −9.", "ALG.QUADRATIC.FORMULA"],
      ],
      why: "$z^2 = -9$, so $z = \\pm 3i$.",
    },
  ],
  [
    {
      statement:
        "A real quadratic has one root $2 + 5i$. Ola says the other root could be any complex number.",
      truth: false,
      right:
        "False. Non-real roots of a polynomial with real coefficients come in conjugate pairs, so the other root is 2 − 5i.",
      wrong: [
        ["True. The roots of a quadratic are not linked.", "CPLX.CONJUGATE"],
        ["True. The other root must be −2 − 5i.", "CPLX.CONJUGATE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-02.c" };

export default defineGenerator(mixFamilies("FM-CP-02.c", { 1: own, 2: base, 4: own }));
