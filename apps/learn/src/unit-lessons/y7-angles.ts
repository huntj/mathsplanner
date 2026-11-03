// Year 7, "Angle facts": a half turn and a full turn, angles that meet across crossing lines,
// tearing a triangle's corners to make a straight line, splitting polygons into triangles to
// find their angle sum, and walking round a regular polygon to find its exterior angle.
import { regular } from "./geometry.ts";
import type { UnitLesson } from "./types.ts";

const pentagon = regular(5, 3, 90);
const hexagon = regular(6, 3, 90);

export const y7Angles: UnitLesson = {
  unit: "y7-angles",
  title: "Angle detectives",
  summary: "Find missing angles from a few facts that never change.",
  screens: [
    {
      kind: "explain",
      title: "Two turns to remember",
      text: [
        "A straight line is a half turn: the angles on it add up to **180°**.",
        "All the way round a point is a full turn: those angles add up to **360°**.",
      ],
      picture: {
        kind: "angles",
        rays: [0, 70, 180],
        arcs: [
          { from: 0, to: 1, label: "70°" },
          { from: 1, to: 2, label: "110°" },
        ],
      },
    },
    {
      kind: "choice",
      title: "Find x on the straight line",
      picture: {
        kind: "angles",
        rays: [0, 130, 180],
        arcs: [
          { from: 0, to: 1, label: "130°" },
          { from: 1, to: 2, label: "x", find: true },
        ],
      },
      options: [
        {
          text: "50°",
          correct: true,
          feedback: "Angles on a straight line add to 180°: $180 - 130 = 50$.",
        },
        { text: "130°", feedback: "x is not the same angle: together they make a straight line." },
        { text: "230°", feedback: "On a straight line it is 180°, not 360°." },
      ],
    },
    {
      kind: "answer",
      title: "Find x, all the way round",
      picture: {
        kind: "angles",
        rays: [0, 100, 220],
        arcs: [
          { from: 0, to: 1, label: "100°" },
          { from: 1, to: 2, label: "120°" },
          { from: 2, to: 0, label: "x", find: true },
        ],
      },
      answers: ["140"],
      unit: "°",
      wrong: [{ answer: "-40", feedback: "All the way round a point is 360°, not 180°." }],
      hint: "Angles round a point add up to 360°.",
      done: "$360 - 100 - 120 = 140°$.",
    },
    {
      kind: "choice",
      title: "Two straight lines cross. Find x.",
      picture: {
        kind: "angles",
        rays: [35, 145, 215, 325],
        arcs: [
          { from: 0, to: 1, label: "110°" },
          { from: 2, to: 3, label: "x", find: true },
        ],
      },
      options: [
        {
          text: "110°",
          correct: true,
          feedback: "x is opposite the 110°. **Vertically opposite** angles are equal.",
        },
        { text: "70°", feedback: "70° is the angle next to the 110°. x is opposite it." },
        { text: "250°", feedback: "x is less than a half turn. Look at the angle opposite it." },
      ],
    },
    {
      kind: "answer",
      title: "Now find y",
      picture: {
        kind: "angles",
        rays: [35, 145, 215, 325],
        arcs: [
          { from: 0, to: 1, label: "110°" },
          { from: 1, to: 2, label: "y", find: true },
        ],
      },
      answers: ["70"],
      unit: "°",
      wrong: [{ answer: "110", feedback: "y is next to the 110°, not opposite it." }],
      hint: "y and the 110° sit together on a straight line.",
      done: "$180 - 110 = 70°$. Round the crossing: 110°, 70°, 110°, 70°.",
    },
    {
      kind: "explain",
      title: "Tear the corners off a triangle",
      text: [
        "Tear the three corners off any paper triangle and put them side by side: they always make a straight line.",
        "So the angles in a triangle add up to **180°**.",
      ],
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 2, y: 4 },
        ],
        angles: ["a", "b", "c"],
      },
    },
    {
      kind: "answer",
      title: "Find the missing angle",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 2, y: 4 },
        ],
        angles: ["63°", "45°", "x"],
      },
      answers: ["72"],
      unit: "°",
      wrong: [{ answer: "108", feedback: "108° is the other two added. Take it away from 180°." }],
      hint: "The three angles add up to 180°.",
      done: "$180 - 63 - 45 = 72°$.",
    },
    {
      kind: "steps",
      title: "The angles in a pentagon",
      picture: {
        kind: "shape",
        points: pentagon,
        dashed: [
          [pentagon[0] ?? { x: 0, y: 0 }, pentagon[2] ?? { x: 0, y: 0 }],
          [pentagon[0] ?? { x: 0, y: 0 }, pentagon[3] ?? { x: 0, y: 0 }],
        ],
      },
      start: "A pentagon has 5 sides.",
      stages: [
        {
          prompt: "The diagonals from one corner split it into how many triangles?",
          options: [
            { text: "3", correct: true, feedback: "" },
            { text: "5", feedback: "Count the triangles in the picture." },
            { text: "2", feedback: "Count again: there are three." },
          ],
          then: "It splits into 3 triangles.",
        },
        {
          prompt: "Each triangle's angles add to 180°. So the pentagon's angles add to",
          options: [
            { text: "540°", correct: true, feedback: "" },
            { text: "900°", feedback: "There are 3 triangles, not 5." },
            { text: "360°", feedback: "That is a quadrilateral, with 2 triangles." },
          ],
          then: "$3 \\times 180° = 540°$",
        },
      ],
      done: "A polygon with n sides splits into $n - 2$ triangles, so its angles add to $(n - 2) \\times 180°$.",
    },
    {
      kind: "fill",
      title: "Spot the pattern",
      picture: {
        kind: "table",
        head: ["Sides", "Triangles", "Angle sum"],
        rows: [
          ["3", "1", "180°"],
          ["4", "2", "360°"],
          ["5", "3", "540°"],
        ],
      },
      template: "A hexagon's angles add to [] and a decagon's (10 sides) to []",
      bank: ["720°", "900°", "1080°", "1440°", "1800°"],
      answers: ["720°", "1440°"],
      hint: "Each extra side adds one more triangle: sides − 2 triangles.",
      done: "$(6 - 2) \\times 180 = 720°$ and $(10 - 2) \\times 180 = 1440°$.",
    },
    {
      kind: "answer",
      title: "One angle of a regular hexagon",
      text: "A regular hexagon's six angles are all equal, and add up to 720°.",
      picture: { kind: "shape", points: hexagon, angles: ["?", null, null, null, null, null] },
      answers: ["120"],
      unit: "°",
      wrong: [
        { answer: "720", feedback: "720° is all six together. Share it between the 6 angles." },
      ],
      hint: "Share the total between the 6 equal angles.",
      done: "$720 \\div 6 = 120°$.",
    },
    {
      kind: "explain",
      title: "Walk round the outside",
      text: [
        "Walk round any polygon. At each corner you turn through the **exterior angle**.",
        "One lap is a full turn, so the exterior angles of any polygon add up to 360°. Interior + exterior = 180° at each corner.",
      ],
      picture: {
        kind: "shape",
        points: hexagon,
        dashed: [[hexagon[0] ?? { x: 0, y: 0 }, { x: 1.56, y: 3.9 }]],
      },
    },
    {
      kind: "answer",
      title: "The exterior angle of a regular octagon",
      text: "An octagon has 8 sides.",
      answers: ["45"],
      unit: "°",
      wrong: [
        { answer: "135", feedback: "135° is the interior angle. The exterior angle is 180 − 135." },
      ],
      hint: "The 8 exterior angles share a full turn, 360°.",
      done: "$360 \\div 8 = 45°$, and the interior angle is $180 - 45 = 135°$.",
    },
    {
      kind: "answer",
      title: "How many sides?",
      text: "A regular polygon has exterior angles of 30°. How many sides does it have?",
      answers: ["12"],
      wrong: [{ answer: "6", feedback: "Six 30° turns make 180°, only half a lap." }],
      hint: "How many 30° turns make a full turn of 360°?",
      done: "$360 \\div 30 = 12$ sides.",
    },
    {
      kind: "explain",
      title: "Case closed",
      text: [
        "Straight line: 180°. Round a point: 360°. Vertically opposite angles are equal.",
        "Triangle: 180°. Polygon with n sides: $(n - 2) \\times 180°$.",
        "Exterior angles of any polygon add to 360°.",
      ],
      picture: {
        kind: "angles",
        rays: [35, 145, 215, 325],
        arcs: [
          { from: 0, to: 1, label: "110°" },
          { from: 1, to: 2, label: "70°" },
          { from: 2, to: 3, label: "110°" },
          { from: 3, to: 0, label: "70°" },
        ],
      },
    },
  ],
};
