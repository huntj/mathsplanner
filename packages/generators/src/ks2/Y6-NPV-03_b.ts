/**
 * @statement Y6-NPV-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-03.b: Calculate intervals across zero
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-NPV-03.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-NPV-03.b", depths: [2, 4] }, [
    {
      statement: "Raj says the difference between −5 and 3 is 8.",
      truth: true,
      right: "True. From −5 to 0 is 5, and from 0 to 3 is 3: 5 + 3 = 8.",
      wrong: [["False. It is 2, as 5 − 3 = 2.", "NPV.NEGATIVE.MIRROR"], ["False. It is −8."]],
    },
    {
      statement: "Ella says the difference between −9 and −4 is 13.",
      truth: false,
      right: "False. Both are below zero: from −9 up to −4 is 5.",
      wrong: [
        ["True. 9 + 4 = 13.", "NPV.NEGATIVE.MIRROR"],
        ["True. You always add the numbers when one is negative."],
      ],
    },
    {
      claim:
        "The difference between a negative number and a positive number is bigger than the positive number.",
      truth: "always",
      right: "Always. You go past zero, so you count the positive number and then some more.",
      wrong: [
        ["Sometimes. Only if the negative number is big."],
        ["Never. The difference is smaller than both.", "NPV.NEGATIVE.MIRROR"],
      ],
    },
  ]),
);
