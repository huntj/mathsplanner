/**
 * @statement Y4-MD-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.a: Multiply by 0 and 1 and divide by 1
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    mentalMD(
      "Y4-MD-02.a",
      { friendly: ["zero-one"], standard: ["zero-one"], stretch: ["zero-one"] },
      { friendly: 1, standard: 1, stretch: 2 },
    ),
    [
      {
        statement: "Sam says $25 \\times 1 = 25$.",
        truth: true,
        right: "True. One lot of 25 is 25.",
        wrong: [["False. It is 26.", "MD.ZERO-ONE.IDENTITY"], ["False. It is 1."]],
      },
      {
        statement: "Pia says $9 \\times 0 = 9$.",
        truth: false,
        right: "False. Zero lots of 9 is 0.",
        wrong: [
          ["True. Multiplying by 0 leaves the number the same.", "MD.ZERO-ONE.IDENTITY"],
          ["True. 0 does not count."],
        ],
      },
      {
        claim: "Dividing a number by 1 leaves it the same.",
        truth: "always",
        right: "Always. Sharing into 1 group keeps the whole amount in that group.",
        wrong: [
          ["Never. It makes it 1.", "MD.ZERO-ONE.IDENTITY"],
          ["Sometimes. Only for even numbers."],
        ],
      },
    ],
  ),
);
