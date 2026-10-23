/**
 * @statement FM-FS2-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-02.a: Calculate the PMCC
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-02.ts";

const own = concept(
  "FM-FS2-02.a",
  ["STA.PMCC.INTERPRET"],
  [
    {
      question:
        "Which value of the product moment correlation coefficient shows the strongest linear relationship?",
      correct: "$-0.92$",
      wrong: [
        [
          "$0.85$",
          "Strength depends on the size of r; |−0.92| is bigger than 0.85.",
          "STA.PMCC.INTERPRET",
        ],
        ["$0.05$", "r near 0 means little linear correlation.", "STA.PMCC.INTERPRET"],
      ],
      why: "The closer |r| is to 1, the stronger the linear relationship; the sign gives the direction.",
    },
    {
      question: "All the x values are doubled.",
      ask: "What happens to the product moment correlation coefficient?",
      correct: "It does not change",
      wrong: [
        [
          "It doubles",
          "r is unaffected by linear scaling of either variable.",
          "STA.PMCC.INTERPRET",
        ],
        [
          "It halves",
          "Scaling changes Sxx and Sxy in the same proportion, so r is unchanged.",
          "STA.PMCC.INTERPRET",
        ],
      ],
      why: "$r = \\frac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}}$ is unchanged by positive linear coding.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS2-02.a" };

export default defineGenerator(mixFamilies("FM-FS2-02.a", { 1: own, 2: own, 4: base }));
