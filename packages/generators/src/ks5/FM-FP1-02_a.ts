/**
 * @statement FM-FP1-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-02.a: Work with the parabola
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-02.ts";

const own = concept(
  "FM-FP1-02.a",
  ["GEO.CONIC"],
  [
    {
      question: "What is the equation of the directrix of the parabola $y^2 = 12x$?",
      correct: "$x = -3$",
      wrong: [
        [
          "$x = 3$",
          "x = 3 passes through the focus. The directrix is on the other side of the vertex.",
          "GEO.CONIC",
        ],
        ["$x = -12$", "4a = 12, so a = 3 and the directrix is x = −a.", "GEO.CONIC"],
      ],
      why: "$4a = 12$, so $a = 3$: focus $(3, 0)$ and directrix $x = -3$.",
    },
  ],
  [
    {
      statement:
        "Cy says every point on a parabola is the same distance from the focus as from the directrix.",
      truth: true,
      right: "True. That is the focus-directrix definition of a parabola (eccentricity 1).",
      wrong: [
        ["False. Only the vertex is.", "GEO.CONIC"],
        ["False. The points are twice as far from the directrix.", "GEO.CONIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-02.a" };

export default defineGenerator(mixFamilies("FM-FP1-02.a", { 1: base, 2: own, 4: own }));
