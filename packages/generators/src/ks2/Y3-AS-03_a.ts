/**
 * @statement Y3-AS-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-03.a: Estimate the answer to a calculation
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-AS-03.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-AS-03.a", depths: [1, 4] }, [
    {
      statement:
        "Kim works out 298 + 103 = 401. She estimates 300 + 100 = 400 and says her answer looks right.",
      truth: true,
      right: "True. 401 is close to the estimate 400.",
      wrong: [
        ["False. An estimate must match exactly.", "NPV.ROUND.ALWAYS-DOWN"],
        ["False. You cannot estimate with hundreds."],
      ],
    },
    {
      claim: "An estimate is close to the real answer.",
      truth: "always",
      right: "Always, if you round sensibly. It shows roughly how big the answer should be.",
      wrong: [
        ["Never. Estimates are guesses.", "NPV.ROUND.ALWAYS-DOWN"],
        ["Sometimes. Only for adding."],
      ],
    },
    {
      statement:
        "Dan works out 412 − 199 = 313. He estimates 400 − 200 = 200 and says his answer must be right.",
      truth: false,
      right: "False. 313 is a long way from 200, so he should check again. 412 − 199 = 213.",
      wrong: [
        ["True. Both answers have three digits.", "NPV.ROUND.ALWAYS-DOWN"],
        ["True. Estimates cannot find mistakes.", "AS.INVERSE.SAME-OPERATION"],
      ],
    },
  ]),
);
