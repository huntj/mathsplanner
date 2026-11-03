/**
 * @statement Y2-AS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-01.b: Derive related facts up to 100, e.g. 30 + 70 from 3 + 7
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-AS-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y2-AS-01.b" }, [
    {
      statement: "Leo says 30 + 40 = 70.",
      truth: true,
      right: "True. 3 tens and 4 tens make 7 tens.",
      wrong: [["False. It is 34.", "NPV.PLACE.TENS-ONES-MIXUP"], ["False. It is 7."]],
    },
    {
      statement: "Mia says 46 + 7 = 413.",
      truth: false,
      right: "False. 6 + 7 = 13, which is 1 ten and 3 ones: 46 + 7 = 53.",
      wrong: [
        ["True. 4 tens and 13 ones.", "AS.COLUMN.NO-CARRY"],
        ["True. Add the ones and write it after the 4.", "AS.COLUMN.NO-CARRY"],
      ],
    },
    {
      claim: "Adding 10 to a number makes the tens digit go up by 1 (or more if it goes past 99).",
      truth: "always",
      right: "Always. 10 is one ten.",
      wrong: [
        ["Never. The ones go up.", "NPV.PLACE.TENS-ONES-MIXUP"],
        ["Sometimes. Only for odd numbers."],
      ],
    },
  ]),
);
