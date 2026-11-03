/**
 * @statement Y4-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-01: Recognise and show, using diagrams, families of common equivalent fractions
import { defineGenerator } from "@mathsplanner/core";
import { equivalents } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    equivalents(
      "Y4-FR-01",
      { friendly: [2, 3, 4, 5], standard: [3, 4, 5, 6, 8], stretch: [5, 6, 7, 8, 9] },
      { friendly: 3, standard: 5, stretch: 6 },
    ),
    [
      {
        claim: "$\\frac{1}{2}$, $\\frac{2}{4}$ and $\\frac{4}{8}$ are the same amount.",
        truth: "always",
        right: "Always. Each is half of the whole, cut into different numbers of pieces.",
        wrong: [
          ["Never. They have different numbers.", "FR.EQUIV.ADD-SAME"],
          ["Sometimes. Only for pizzas."],
        ],
      },
      {
        claim: "A fraction with a bigger denominator is a smaller fraction.",
        truth: "sometimes",
        right: "Sometimes. 1/5 is smaller than 1/3, but 4/5 is bigger than 1/3.",
        wrong: [
          ["Always. A bigger bottom means smaller pieces.", "FR.EQUIV.ADD-SAME"],
          ["Never. Bigger numbers mean bigger fractions."],
        ],
      },
      {
        statement: "Sol says $\\frac{2}{3} = \\frac{4}{6}$.",
        truth: true,
        right: "True. Multiply the top and bottom by 2.",
        wrong: [
          ["False. 2/3 = 3/4, adding 1 to each.", "FR.EQUIV.ADD-SAME"],
          ["False. Thirds and sixths cannot match."],
        ],
      },
    ],
  ),
);
