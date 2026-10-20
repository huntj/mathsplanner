/**
 * @statement Y1-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y1-GEO-01: Recognise and name common 2D shapes (rectangles, squares, circles, triangles)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { capital, shape } from "../shared/shapes.ts";

type Name = "square" | "rectangle" | "circle" | "triangle";

interface Params {
  name: Name;
  rotation: number;
  scale: number;
  triangle: "equilateral" | "isosceles" | "scalene" | "right-angled";
}

const NAMES: Name[] = ["square", "rectangle", "circle", "triangle"];

/**
 * Names that are definitely wrong. The national curriculum counts squares as rectangles in
 * KS1, so "rectangle" is never offered as a wrong name for a square.
 */
const wrongFor = (name: Name) =>
  NAMES.filter((n) => n !== name && !(name === "square" && n === "rectangle"));

function figure(name: Name, p: Params): GeometrySpec {
  if (name === "circle") {
    return {
      type: "geometry",
      points: { O: [0, 0] },
      circles: [{ centre: "O", radius: 1.5 * p.scale }],
      description: "A circle.",
    };
  }
  const kind = name === "triangle" ? p.triangle : name;
  return { ...shape(kind, { rotation: p.rotation, scale: p.scale }), description: `A ${name}.` };
}

export default defineGenerator<Params>({
  id: "Y1-GEO-01",
  version: "1.1.1",
  depths: [1, 3, 4],
  misconceptions: ["GEO.SHAPES.ORIENTATION"],

  params(rng, numbers) {
    return {
      name: rng.pick(NAMES),
      // Friendly shapes sit squarely; others are turned, which is where children get stuck.
      rotation:
        numbers === "friendly"
          ? 0
          : numbers === "standard"
            ? rng.pick([0, 20, 45])
            : rng.int(10, 80),
      scale: numbers === "stretch" ? rng.pick([0.6, 1, 1.4]) : 1,
      triangle: rng.pick(["equilateral", "isosceles", "scalene", "right-angled"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Look at this shape.", A.figure(figure(p.name, p))],
          ask: "What is it called?",
          correct: capital(p.name),
          distractors: wrongFor(p.name).map((n) => ({ content: capital(n) })),
          solution: [
            {
              say: `It is a ${p.name}${p.rotation && p.name !== "circle" ? ", even though it has been turned" : ""}.`,
            },
          ],
        });
      case 3: {
        // A square drawn as a distractor would also be a rectangle, so it cannot be one.
        const others = wrongFor(p.name).filter((n) => !(p.name === "rectangle" && n === "square"));
        return A.chooseTheDiagram({
          rng,
          question: `Which shape is a ${p.name}?`,
          ask: "Choose the picture.",
          correct: figure(p.name, p),
          distractors: others
            .slice(0, 3)
            .map((n) => ({ figure: figure(n, { ...p, rotation: rng.pick([0, 30, 60]) }) })),
          solution: [
            {
              say: `Look for the ${p.name}: ${{ square: "four equal sides and four square corners", rectangle: "four sides and four square corners, two long and two short", circle: "one curved side and no corners", triangle: "three straight sides and three corners" }[p.name]}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jack says this is not a square, because it is standing on its corner.",
            A.figure({
              ...shape("square", { rotation: 45 }),
              description: "A square turned so that it stands on one corner.",
            }),
          ],
          truth: false,
          reasons: [
            {
              text: "It is still a square: it has four equal sides and four square corners, whichever way it is turned.",
              correct: true,
            },
            {
              text: "When a square is turned it becomes a different shape.",
              code: "GEO.SHAPES.ORIENTATION",
            },
            { text: "It is not a square because squares are always bigger." },
          ],
          solution: [
            { say: "Turning a shape does not change what it is. This is still a square." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    // The shape drawn as the answer has the right number of corners for its name.
    const corners: Record<Name, number> = { square: 4, rectangle: 4, circle: 0, triangle: 3 };
    const answer = question.parts[0]?.answer;
    if (answer?.type !== "choice") return false;
    const index =
      question.archetype === "choose-the-diagram"
        ? (
            answer.options.find((o) => o.id === answer.correct)?.content[0] as
              { i?: number } | undefined
          )?.i
        : 0;
    const drawn = question.diagrams[index ?? 0];
    const polygon = (drawn?.polygons as { vertices: string[] }[] | undefined)?.[0];
    return (polygon?.vertices.length ?? 0) === corners[p.name];
  },
});
