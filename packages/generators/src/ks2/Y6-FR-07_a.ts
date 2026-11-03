/**
 * @statement Y6-FR-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-07.a: Find the value of each digit in numbers with three decimal places
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-FR-07.ts";
import places from "./Y5-FR-09_a.ts";
import { withClaims } from "../shared/variety.ts";

const read = { ...places.definition, id: "Y6-FR-07.a" };

export default defineGenerator(
  withClaims(
    mixFamilies("Y6-FR-07.a", { 1: read, 2: { ...parent.definition, id: "Y6-FR-07.a" }, 4: read }),
    [
      {
        statement: "Ruby says the 7 in $3.072$ is worth 7 hundredths.",
        truth: true,
        right: "True. The digits after the point are tenths, hundredths, thousandths: 0, 7, 2.",
        wrong: [["False. It is worth 7 tenths.", "FR.DECIMAL.PLACE"], ["False. It is worth 70."]],
      },
      {
        statement: "Dan says $0.45$ is bigger than $0.5$, because 45 is bigger than 5.",
        truth: false,
        right: "False. 0.5 = 0.50, and 50 hundredths is more than 45 hundredths.",
        wrong: [
          ["True. More digits make a bigger number.", "FR.DECIMAL.PLACE"],
          ["True. Compare 45 and 5."],
        ],
      },
      {
        claim: "Putting a 0 on the end of a decimal, after the point, changes its value.",
        truth: "never",
        right: "Never. 0.3 and 0.30 are both 3 tenths: the 0 adds no hundredths.",
        wrong: [
          ["Always. It makes it ten times bigger.", "NPV.POWERS10.APPEND-ZEROS"],
          ["Sometimes. Only for whole numbers."],
        ],
      },
    ],
  ),
);
