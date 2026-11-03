/**
 * @statement Y1-MEA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-02.a: Measure lengths and heights
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y1-MEA-02.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y1-MEA-02.a" }, [
    {
      claim: "To measure with a ruler, you start at 0.",
      truth: "always",
      right: "Always. Line the end of the object up with 0.",
      wrong: [["Never. Start at 1.", "MEA.RULER.END"], ["Sometimes. Only for long things."]],
    },
    {
      statement: "A pencil starts at 0 and ends at 9 on a ruler. Sam says it is 9 cm long.",
      truth: true,
      right: "True. From 0 to 9 is 9 cm.",
      wrong: [["False. It is 10 cm.", "MEA.RULER.END"], ["False. It is 8 cm."]],
    },
    {
      statement: "A crayon starts at 2 and ends at 7 on a ruler. Mia says it is 7 cm long.",
      truth: false,
      right: "False. It starts at 2, not 0: from 2 to 7 is 5 cm.",
      wrong: [
        ["True. Read where it ends.", "MEA.RULER.END"],
        ["True. The end shows the length.", "MEA.RULER.END"],
      ],
    },
  ]),
);
