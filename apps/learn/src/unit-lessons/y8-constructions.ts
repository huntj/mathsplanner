// Year 8, "Scale drawings and constructions", as five short lessons, one just before each skill:
// scale factors and maps; then compass constructions built a step at a time, each step drawn as
// it is chosen: the perpendicular bisector, a perpendicular at or from a point, an angle
// bisector; and why the perpendicular is the shortest way. Each starts from something quick,
// builds the idea a step at a time, names the common mistakes, and ends on an exit check.
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

type Item = DrawingPic["items"][number];
const draw = (...items: Item[]): DrawingPic => ({ kind: "drawing", items });
/** A drawing in a fixed frame, so it keeps its scale as a construction adds to it. */
const framed =
  (xMin: number, xMax: number, yMin: number, yMax: number) =>
  (...items: Item[]): DrawingPic => ({ kind: "drawing", items, frame: { xMin, xMax, yMin, yMax } });
const bisectorPic = framed(-0.6, 6.6, -3.3, 3.3);
const anglePic = framed(-0.6, 6.2, -0.5, 5.4);
const pointPic = framed(0, 8, -3.3, 3.8);
const seg = (a: Point, b: Point, tone?: "find" | "soft"): Item => ({
  line: [a, b],
  ...(tone ? { tone } : {}),
});

// The perpendicular bisector of AB: arcs of radius 4 from each end, crossing at (3, ±2.65).
const A = { x: 0, y: 0 };
const B = { x: 6, y: 0 };
const ab = [seg(A, B), { text: "A", at: { x: -0.4, y: 0 } }, { text: "B", at: { x: 6.4, y: 0 } }];
const fromA: Item[] = [
  { arc: A, r: 4, from: 25, to: 60 },
  { arc: A, r: 4, from: -60, to: -25 },
];
const fromB: Item[] = [
  { arc: B, r: 4, from: 120, to: 155 },
  { arc: B, r: 4, from: 205, to: 240 },
];

// An angle of 60° at Q, its arc, the two arcs from where that meets the arms, and the bisector.
const Q = { x: 0, y: 0 };
const arm1 = { x: 6, y: 0 };
const arm2 = { x: 3, y: 5.196 };
const angle = [seg(Q, arm1), seg(Q, arm2), { text: "Q", at: { x: -0.4, y: -0.2 } }];
const arcQ: Item = { arc: Q, r: 3, from: -8, to: 68 };
const arcsMid: Item[] = [
  { arc: { x: 3, y: 0 }, r: 2.5, from: 50, to: 85 },
  { arc: { x: 1.5, y: 2.598 }, r: 2.5, from: -25, to: 10 },
];

// A perpendicular from P to a line: an arc from P meets the line at 4 ± √7, then two arcs meet
// below at (4, −3).
const P = { x: 4, y: 3 };
const line = [seg({ x: 0, y: 0 }, { x: 8, y: 0 }), { dot: P }, { text: "P", at: { x: 4, y: 3.6 } }];
const arcP: Item = { arc: P, r: 4, from: 225, to: 315 };
const arcsBelow: Item[] = [
  { arc: { x: 1.354, y: 0 }, r: 4, from: -65, to: -30 },
  { arc: { x: 6.646, y: 0 }, r: 4, from: -150, to: -115 },
];

const SCALE = "Y8-RAT-01";
const BISECTOR = "Y8-GEO-04.a";
const PERPENDICULAR = "Y8-GEO-04.b";
const ANGLE = "Y8-GEO-04.c";
const SHORTEST = "Y8-GEO-04.d";

// A perpendicular at X, a point on a line: an arc from X meets the line at (2, 0) and (6, 0),
// then arcs from those meet above at (4, 2.24).
const X = { x: 4, y: 0 };
const atPic = framed(0, 8, -1, 3.6);
const atLine = [
  seg({ x: 0, y: 0 }, { x: 8, y: 0 }),
  { dot: X },
  { text: "X", at: { x: 4, y: -0.5 } },
];
const arcsX: Item[] = [
  { arc: X, r: 2, from: 160, to: 200 },
  { arc: X, r: 2, from: -20, to: 20 },
];
const arcsAbove: Item[] = [
  { arc: { x: 2, y: 0 }, r: 3, from: 35, to: 60 },
  { arc: { x: 6, y: 0 }, r: 3, from: 120, to: 145 },
];

/** A shore, a swimmer at P, and three ways to it: straight across, and two slanting. */
const shortest = draw(
  seg({ x: 0, y: 0 }, { x: 8, y: 0 }),
  { dot: P },
  { text: "P", at: { x: 4, y: 3.6 } },
  seg(P, { x: 4, y: 0 }, "find"),
  seg(P, { x: 1, y: 0 }, "soft"),
  seg(P, { x: 7.5, y: 0 }, "soft"),
  { text: "A", at: { x: 4.4, y: 1.3 } },
  { text: "B", at: { x: 2.1, y: 1.3 } },
  { text: "C", at: { x: 6.2, y: 1.3 } },
);

const bisectorSteps = {
  kind: "steps" as const,
  title: "Cut AB in half, at right angles",
  text: "This is the **perpendicular bisector**.",
  picture: bisectorPic(...ab),
  start: "Draw it with a compass and a ruler.",
  stages: [
    {
      prompt: "Put the compass point on A. How wide do you open it?",
      options: [
        { text: "More than half of AB", correct: true as const, feedback: "" },
        {
          text: "Less than half of AB",
          feedback: "Then the arcs from A and from B would never meet in the middle.",
        },
      ],
      then: "Draw an arc above the line and one below it.",
      picture: bisectorPic(...ab, ...fromA),
    },
    {
      prompt: "Now put the compass on B. What about the width?",
      options: [
        { text: "Keep it the same", correct: true as const, feedback: "" },
        {
          text: "Change it",
          feedback: "Keep it the same, so the crossing points are as far from A as from B.",
        },
      ],
      then: "Draw arcs that cross the first two.",
      picture: bisectorPic(...ab, ...fromA, ...fromB),
    },
    {
      prompt: "What next?",
      options: [
        { text: "Join the two crossing points", correct: true as const, feedback: "" },
        {
          text: "Join A to a crossing point",
          feedback: "That makes a sloping line. Join the two crossings.",
        },
      ],
      then: "That line cuts AB in half, at right angles.",
      picture: bisectorPic(
        ...ab,
        ...fromA,
        ...fromB,
        seg({ x: 3, y: 3.2 }, { x: 3, y: -3.2 }, "find"),
      ),
    },
  ],
  done: "Every point on it is the same distance from A as from B.",
};

const angleSteps = {
  kind: "steps" as const,
  title: "Cut an angle in half",
  text: "This is the **angle bisector**.",
  picture: anglePic(...angle),
  start: "Bisect the angle at Q.",
  stages: [
    {
      prompt: "Compass on Q. What do you draw?",
      options: [
        { text: "An arc crossing both arms", correct: true as const, feedback: "" },
        { text: "A whole circle", feedback: "Just an arc across the two arms is enough." },
      ],
      then: "Draw an arc crossing both arms.",
      picture: anglePic(...angle, arcQ),
    },
    {
      prompt: "From where the arc crosses each arm, keeping the same width:",
      options: [
        { text: "Draw two arcs that cross inside the angle", correct: true as const, feedback: "" },
        {
          text: "Draw arcs outside the angle",
          feedback: "The arcs must cross inside the angle, between the arms.",
        },
      ],
      then: "The two arcs cross inside the angle.",
      picture: anglePic(...angle, arcQ, ...arcsMid),
    },
    {
      prompt: "Finally:",
      options: [
        { text: "Join Q to where they cross", correct: true as const, feedback: "" },
        { text: "Join the two arms", feedback: "Join Q to the crossing point." },
      ],
      then: "That line splits the angle in half.",
      picture: anglePic(...angle, arcQ, ...arcsMid, seg(Q, { x: 5.4, y: 3.12 }, "find")),
    },
  ],
  done: "The 60° angle is split into two angles of 30°.",
};

const fromPointSteps = {
  kind: "steps" as const,
  title: "From a point to a line",
  picture: pointPic(...line),
  start: "Draw the perpendicular from P to the line.",
  stages: [
    {
      prompt: "Compass on P. What do you draw?",
      options: [
        { text: "An arc crossing the line twice", correct: true as const, feedback: "" },
        {
          text: "An arc that just touches the line",
          feedback: "You need two crossings to work from.",
        },
      ],
      then: "The arc crosses the line in two places.",
      picture: pointPic(...line, arcP),
    },
    {
      prompt: "From each crossing, with the same width:",
      options: [
        { text: "Draw arcs that cross below the line", correct: true as const, feedback: "" },
        { text: "Draw arcs above P", feedback: "Cross them on the other side of the line from P." },
      ],
      then: "The arcs cross below the line.",
      picture: pointPic(...line, arcP, ...arcsBelow),
    },
    {
      prompt: "Finally:",
      options: [
        { text: "Join P to where they cross", correct: true as const, feedback: "" },
        { text: "Join the two crossings on the line", feedback: "That is the line itself." },
      ],
      then: "That line meets the first one at right angles.",
      picture: pointPic(...line, arcP, ...arcsBelow, seg(P, { x: 4, y: -3 }, "find")),
    },
  ],
  done: "It is the perpendicular from P to the line.",
};

export const y8Constructions: UnitLesson[] = [
  {
    unit: "y8-constructions",
    id: "y8-constructions/scale",
    before: SCALE,
    title: "Scale drawings and maps",
    summary: "Every length is multiplied by the same scale factor; the angles stay the same.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Planning a walk",
        text: [
          "On a map, 1 cm stands for 2.5 km. Your planned walk measures 6 cm on the map. A friend's route is 10 km for real.",
          "How long is your walk, and how long will your friend's be on the map? By the end of this lesson, you can convert both ways.",
        ],
        picture: {
          kind: "table",
          head: ["", "Map", "Real"],
          rows: [
            ["Scale", "1 cm", "2.5 km"],
            ["Your walk", "6 cm", "?"],
            ["Friend's", "?", "10 km"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $11 \\times 40$",
        answers: ["440"],
        hint: "$11 \\times 4 = 44$, then times 10.",
        done: "440.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many metres is 440 cm?",
        answers: ["4.4"],
        unit: "m",
        wrong: [{ answer: "44", feedback: "100 cm in a metre: divide by 100." }],
        hint: "Divide by 100.",
        done: "4.4 m.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Scale factor",
        text: [
          "An enlargement with **scale factor** 3 makes every length 3 times as long. The angles stay the same, so the shape looks the same.",
        ],
        picture: draw(
          seg({ x: 0, y: 0 }, { x: 2, y: 0 }),
          seg({ x: 2, y: 0 }, { x: 2, y: 1 }),
          seg({ x: 2, y: 1 }, { x: 0, y: 1 }),
          seg({ x: 0, y: 1 }, { x: 0, y: 0 }),
          seg({ x: 3, y: 0 }, { x: 9, y: 0 }, "find"),
          seg({ x: 9, y: 0 }, { x: 9, y: 3 }, "find"),
          seg({ x: 9, y: 3 }, { x: 3, y: 3 }, "find"),
          seg({ x: 3, y: 3 }, { x: 3, y: 0 }, "find"),
          { text: "2", at: { x: 1, y: -0.5 } },
          { text: "1", at: { x: -0.4, y: 0.5 } },
          { text: "6", at: { x: 6, y: -0.5 }, tone: "find" },
          { text: "3", at: { x: 9.4, y: 1.5 }, tone: "find" },
        ),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "A scale of 1 : 100. 1 cm on the plan is",
        options: [
          {
            text: "100 cm, or 1 m, for real",
            correct: true,
            feedback: "Same units both sides: 1 cm to 100 cm.",
          },
          { text: "100 m for real", feedback: "1 : 100 has no units: 1 cm stands for 100 cm." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A model car",
        problem:
          "A model car is made to a scale of 1 : 40. The model is 11 cm long. How long is the real car?",
        steps: [
          { line: "Real = $11 \\times 40 = 440$ cm", why: "Model to real: multiply." },
          { line: "$440$ cm $= 4.4$ m", why: "Change to sensible units." },
        ],
        done: "Model to real: times. Real to model: divide.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Map to real",
        start: "1 cm stands for 2.5 km. A lake is 3.2 cm across on the map.",
        stages: [
          {
            prompt: "Map to real, so",
            options: [
              { text: "multiply by 2.5", correct: true, feedback: "" },
              { text: "divide by 2.5", feedback: "Real distances are bigger: multiply." },
            ],
            then: "$3.2 \\times 2.5$",
          },
          {
            prompt: "The lake is",
            options: [
              { text: "8 km across", correct: true, feedback: "" },
              { text: "1.28 km across", feedback: "That divides." },
            ],
            then: "8 km",
          },
        ],
        done: "3.2 cm on the map is 8 km for real.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Real to map",
        start: "1 cm stands for 2.5 km. A road is 10 km long.",
        stages: [
          {
            prompt: "Real to map, so",
            options: [
              { text: "divide by 2.5", correct: true, feedback: "" },
              { text: "multiply by 2.5", feedback: "Map distances are smaller: divide." },
            ],
            then: "$10 \\div 2.5$",
          },
          {
            prompt: "On the map, it's",
            options: [
              { text: "4 cm", correct: true, feedback: "" },
              { text: "25 cm", feedback: "That multiplies." },
            ],
            then: "4 cm",
          },
        ],
        done: "How many lots of 2.5 km make 10 km? Four.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A plan has scale 1 : 50",
        text: "A room is 8 cm long on the plan. How long is it really, in metres?",
        answers: ["4"],
        unit: "m",
        wrong: [{ answer: "400", feedback: "400 cm, which is 4 m." }],
        hint: "$8 \\times 50$ cm, then into metres.",
        done: "400 cm = 4 m.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "1 cm stands for 5 km",
        text: "Two towns are 35 km apart. How far apart on the map?",
        answers: ["7"],
        unit: "cm",
        wrong: [{ answer: "175", feedback: "Real to map: divide." }],
        hint: "$35 \\div 5$.",
        done: "7 cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A shape is enlarged by scale factor 2. Its 40° angle becomes",
        options: [
          {
            text: "40°",
            correct: true,
            feedback: "Lengths change; angles don't. That's why it's the same shape.",
          },
          { text: "80°", feedback: "Angles stay the same in an enlargement." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A map has scale 1 : 25 000. Jo finds the real length of 4 cm.",
        lines: ["$4 \\times 25\\,000 = 100\\,000$", "So it's 100 000 km", "That's a long way!"],
        wrong: 1,
        why: "The units stay as cm: 100 000 cm = 1000 m = 1 km.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "1 cm : 2.5 km",
        text: "Your walk is 6 cm on the map. Your friend's is 10 km for real.",
        options: [
          {
            text: "Yours is 15 km; theirs is 4 cm on the map",
            correct: true,
            feedback: "$6 \\times 2.5$ and $10 \\div 2.5$.",
          },
          { text: "Yours is 2.4 km; theirs is 25 cm", feedback: "Those are the wrong way round." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Scale 1 : 20. A model is 9 cm. Real length?",
            options: ["180 cm", "29 cm", "0.45 cm"],
            answers: ["180 cm"],
            why: "$9 \\times 20$.",
            retry: {
              prompt: "Scale 1 : 30. A model is 7 cm. Real length?",
              options: ["210 cm", "37 cm", "4.3 cm"],
              answers: ["210 cm"],
              why: "$7 \\times 30$.",
            },
          },
          {
            prompt: "1 cm stands for 4 km. 18 km on the map is",
            options: ["4.5 cm", "72 cm", "22 cm"],
            answers: ["4.5 cm"],
            why: "$18 \\div 4$.",
            retry: {
              prompt: "1 cm stands for 3 km. 21 km on the map is",
              options: ["7 cm", "63 cm", "24 cm"],
              answers: ["7 cm"],
              why: "$21 \\div 3$.",
            },
          },
          {
            prompt: "Enlarge by scale factor 3: a 5 cm side becomes",
            options: ["15 cm", "8 cm", "5 cm"],
            answers: ["15 cm"],
            why: "Times 3.",
            retry: {
              prompt: "Enlarge by scale factor 4: a 2.5 cm side becomes",
              options: ["10 cm", "6.5 cm", "2.5 cm"],
              answers: ["10 cm"],
              why: "Times 4.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-constructions",
    id: "y8-constructions/perpendicular-bisector",
    before: BISECTOR,
    title: "Halfway, at right angles",
    summary: "Equal arcs from both ends find every point the same distance from each.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A fair place to meet",
        text: [
          "Two friends live at A and B. They want a meeting point exactly the same distance from both homes.",
          "There are lots of such points, and they lie on one line. By the end of this lesson, you can draw it with a compass, without measuring.",
        ],
        picture: bisectorPic(...ab),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Every point on a circle is",
        options: [
          {
            text: "the same distance from its centre",
            correct: true,
            feedback: "That distance is the radius.",
          },
          { text: "the same distance from the edge", feedback: "From the centre." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Perpendicular means",
        options: [
          { text: "at right angles", correct: true, feedback: "Meeting at 90°." },
          { text: "parallel", feedback: "Parallel lines never meet." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Why the compass works",
        text: [
          "Open the compass and draw an arc from A: every point on it is that distance from A. Do the same from B.",
          "Where the arcs cross, the point is the **same distance** from A and from B. Two such points fix the line of all of them.",
        ],
        picture: bisectorPic(...ab, ...fromA, ...fromB),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The perpendicular bisector",
        problem: "Construct the perpendicular bisector of AB.",
        picture: bisectorPic(
          ...ab,
          ...fromA,
          ...fromB,
          seg({ x: 3, y: 3.2 }, { x: 3, y: -3.2 }, "find"),
        ),
        steps: [
          { line: "Compass on A, open more than half of AB", why: "So the arcs will meet." },
          { line: "Arcs above and below AB", why: "" },
          {
            line: "Same width, compass on B: arcs crossing the first two",
            why: "Equal distances.",
          },
          { line: "Join the two crossings", why: "That's the bisector." },
        ],
        done: "It cuts AB in half, at right angles.",
      },
      bisectorSteps,
      {
        kind: "choice",
        tag: "Together",
        title: "Why open the compass more than half of AB?",
        options: [
          {
            text: "So the arcs from A and B meet",
            correct: true,
            feedback: "Less than half, and they never reach each other.",
          },
          { text: "So it's neater", feedback: "It's needed: smaller arcs don't meet." },
        ],
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Put the steps in order",
        items: [
          "Compass on A, more than half of AB",
          "Draw arcs above and below AB",
          "Same width: compass on B, arcs crossing",
          "Join the two crossing points",
        ],
        first: "first",
        last: "last",
        hint: "Start at A, then B, then join.",
        done: "That's the perpendicular bisector.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A point on the perpendicular bisector of AB is 5 cm from A. How far is it from B?",
        options: [
          {
            text: "5 cm",
            correct: true,
            feedback: "Every point on it is equidistant from A and B.",
          },
          {
            text: "It depends",
            feedback: "On the bisector, it's always the same distance from both.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Halfway through, Ben changes the compass width before drawing from B. Problem?",
        options: [
          {
            text: "Yes: the crossings won't be equal distances from A and B",
            correct: true,
            feedback: "Keep the same width, so each crossing point is the same distance from both.",
          },
          { text: "No", feedback: "The line would slant off the middle." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia constructs the perpendicular bisector of AB, 6 cm long.",
        lines: [
          "Compass on A, opened to 2 cm",
          "Arcs above and below",
          "Same from B, then join the crossings",
        ],
        wrong: 0,
        why: "2 cm is less than half of 6 cm: the arcs never meet. Open it more than 3 cm.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A fair place to meet",
        text: "Where are all the points the same distance from A and B?",
        picture: bisectorPic(
          ...ab,
          ...fromA,
          ...fromB,
          seg({ x: 3, y: 3.2 }, { x: 3, y: -3.2 }, "find"),
        ),
        options: [
          {
            text: "On the perpendicular bisector of AB",
            correct: true,
            feedback: "Any point on that line is fair to both.",
          },
          {
            text: "Only the midpoint of AB",
            feedback: "The midpoint is one, but the whole line works.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The perpendicular bisector of AB meets AB",
            options: ["at its midpoint, at 90°", "at A", "at 45°"],
            answers: ["at its midpoint, at 90°"],
            why: "It bisects AB at right angles.",
            retry: {
              prompt: "The perpendicular bisector cuts AB",
              options: ["in half, at right angles", "into thirds", "at an angle of 60°"],
              answers: ["in half, at right angles"],
              why: "Bisect: halve. Perpendicular: 90°.",
            },
          },
          {
            prompt: "AB is 8 cm. The compass must open more than",
            options: ["4 cm", "8 cm", "2 cm"],
            answers: ["4 cm"],
            why: "More than half of AB.",
            retry: {
              prompt: "AB is 10 cm. The compass must open more than",
              options: ["5 cm", "10 cm", "2.5 cm"],
              answers: ["5 cm"],
              why: "More than half of AB.",
            },
          },
          {
            prompt: "Points on the perpendicular bisector of AB are",
            options: ["the same distance from A and B", "closer to A", "on AB"],
            answers: ["the same distance from A and B"],
            why: "That's why the arcs work.",
            retry: {
              prompt: "A point is 7 cm from A and 7 cm from B. It lies on",
              options: ["the perpendicular bisector of AB", "the line AB", "a circle round A only"],
              answers: ["the perpendicular bisector of AB"],
              why: "Equidistant from A and B.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-constructions",
    id: "y8-constructions/perpendicular",
    before: PERPENDICULAR,
    title: "A right angle anywhere",
    summary: "Make two points either side, then bisect: a perpendicular at or from a point.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A fence post",
        text: [
          "A fence post at X must stand at exactly 90° to a straight path. You have a compass and a ruler, but no protractor.",
          "By the end of this lesson, you can draw a perfect right angle at any point, or from a point down to a line.",
        ],
        picture: atPic(...atLine),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "The perpendicular bisector of AB meets it at",
        options: [
          { text: "90°", correct: true, feedback: "Perpendicular means at right angles." },
          { text: "45°", feedback: "Perpendicular: 90°." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Half of a straight angle (180°) is",
        answers: ["90"],
        unit: "°",
        hint: "$180 \\div 2$.",
        done: "90°: a right angle.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Make a segment, then bisect it",
        text: [
          "With the compass on X, draw arcs cutting the line either side. Now X is the **midpoint** of a segment.",
          "Its perpendicular bisector goes straight through X at 90°. Same trick from a point P above a line.",
        ],
        picture: atPic(...atLine, ...arcsX),
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "At X, on the line",
        picture: atPic(...atLine),
        start: "Draw the perpendicular at X.",
        stages: [
          {
            prompt: "Compass on X, any width:",
            options: [
              { text: "Cut the line on both sides of X", correct: true, feedback: "" },
              {
                text: "Draw an arc above X",
                feedback: "First make two points on the line, either side.",
              },
            ],
            then: "Two points, equally far from X.",
            picture: atPic(...atLine, ...arcsX),
          },
          {
            prompt: "Wider now, from each of those points:",
            options: [
              { text: "Arcs that cross above X", correct: true, feedback: "" },
              { text: "Arcs that cross on the line", feedback: "Cross above it, off the line." },
            ],
            then: "The arcs cross above X.",
            picture: atPic(...atLine, ...arcsX, ...arcsAbove),
          },
          {
            prompt: "Finally:",
            options: [
              { text: "Join X to the crossing", correct: true, feedback: "" },
              { text: "Join the two points on the line", feedback: "That's the line itself." },
            ],
            then: "A right angle at X.",
            picture: atPic(...atLine, ...arcsX, ...arcsAbove, seg(X, { x: 4, y: 3.3 }, "find")),
          },
        ],
        done: "It's the perpendicular bisector of the two points you made.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "From P to the line",
        problem: "Construct the perpendicular from P to the line.",
        picture: pointPic(...line, arcP, ...arcsBelow, seg(P, { x: 4, y: -3 }, "find")),
        steps: [
          {
            line: "Compass on P: an arc crossing the line twice",
            why: "Two points, equally far from P.",
          },
          {
            line: "Same width, from each crossing: arcs meeting below the line",
            why: "Equal distances again.",
          },
          { line: "Join P to where they meet", why: "It hits the line at 90°." },
        ],
        done: "Make two points, then bisect.",
      },
      { ...fromPointSteps, tag: "Together" },
      {
        kind: "choice",
        tag: "Together",
        title: "Why cross the arcs on the other side of the line from P?",
        options: [
          {
            text: "To get a second point, far from P, for an accurate line",
            correct: true,
            feedback: "P and the crossing fix the line.",
          },
          {
            text: "It doesn't matter: cross them on P",
            feedback: "They'd meet at P itself: no new point.",
          },
        ],
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Perpendicular at X: put the steps in order",
        items: [
          "Compass on X: cut the line on both sides",
          "Open wider: arcs from each cut, crossing above X",
          "Join X to the crossing",
        ],
        first: "first",
        last: "last",
        hint: "Make two points, then bisect.",
        done: "A right angle at X.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which construction is the perpendicular at X really?",
        options: [
          {
            text: "A perpendicular bisector",
            correct: true,
            feedback: "Of the two points either side of X.",
          },
          { text: "An angle bisector of 90°", feedback: "It bisects the straight angle, 180°." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam draws the perpendicular at X with a protractor, by eye. Is it a construction?",
        options: [
          {
            text: "No: constructions use only a compass and a straight edge",
            correct: true,
            feedback: "Compass arcs make it exact, and show your method.",
          },
          { text: "Yes", feedback: "Leave the arcs showing: they prove the right angle." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj constructs the perpendicular at X.",
        lines: [
          "Compass on X: cut the line either side",
          "From each cut, small arcs that don't meet",
          "Join X straight up",
        ],
        wrong: 1,
        why: "Open the compass wider, so the arcs cross: the crossing fixes the direction.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The fence post at X",
        picture: atPic(...atLine, ...arcsX, ...arcsAbove, seg(X, { x: 4, y: 3.3 }, "find")),
        options: [
          {
            text: "Cut the path either side of X, then bisect",
            correct: true,
            feedback: "A perfect 90°, no protractor.",
          },
          { text: "Guess and check", feedback: "Construction is exact." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "First step for a perpendicular at X on a line?",
            options: [
              "Compass on X: cut the line both sides",
              "Draw a circle",
              "Join X to the line",
            ],
            answers: ["Compass on X: cut the line both sides"],
            why: "Make two points either side.",
            retry: {
              prompt: "First step for a perpendicular from P to a line?",
              options: [
                "Compass on P: an arc crossing the line twice",
                "Draw a line from P",
                "Measure 90°",
              ],
              answers: ["Compass on P: an arc crossing the line twice"],
              why: "Make two points on the line.",
            },
          },
          {
            prompt: "The perpendicular meets the line at",
            options: ["90°", "180°", "45°"],
            answers: ["90°"],
            why: "Perpendicular.",
            retry: {
              prompt: "The perpendicular at X makes two angles of",
              options: ["90°", "60°", "45°"],
              answers: ["90°"],
              why: "Half of 180°.",
            },
          },
          {
            prompt: "Constructions use",
            options: ["a compass and straight edge", "a protractor", "guesswork"],
            answers: ["a compass and straight edge"],
            why: "Exact, with the arcs showing.",
            retry: {
              prompt: "In a construction, you should",
              options: ["leave the arcs showing", "rub out the arcs", "measure angles"],
              answers: ["leave the arcs showing"],
              why: "They show your method.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-constructions",
    id: "y8-constructions/angle-bisector",
    before: ANGLE,
    title: "Halve an angle",
    summary: "Equal arcs from both arms find the line that splits an angle in half.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A path between two walls",
        text: [
          "Two garden walls meet at Q at 60°. A path must run exactly between them, the same distance from each wall.",
          "By the end of this lesson, you can draw it with just a compass and ruler.",
        ],
        picture: anglePic(...angle),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Half of 60° is",
        answers: ["30"],
        unit: "°",
        hint: "$60 \\div 2$.",
        done: "30°.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "To bisect means to",
        options: [
          { text: "cut in half", correct: true, feedback: "Bi- is two: two equal parts." },
          { text: "cut at 90°", feedback: "That's perpendicular." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Why it works",
        text: [
          "An arc from Q crosses both arms the **same distance** from Q.",
          "From those two points, equal arcs meet at a point equally far from both. Joining it to Q splits the angle exactly.",
        ],
        picture: anglePic(...angle, arcQ, ...arcsMid),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Bisect the angle at Q",
        problem: "Construct the bisector of the angle at Q.",
        picture: anglePic(...angle, arcQ, ...arcsMid, seg(Q, { x: 5.4, y: 3.12 }, "find")),
        steps: [
          {
            line: "Compass on Q: an arc crossing both arms",
            why: "Two points equally far from Q.",
          },
          {
            line: "Same width, from each crossing: arcs meeting inside the angle",
            why: "Equal distances.",
          },
          { line: "Join Q to the meeting point", why: "That's the bisector." },
        ],
        done: "Two 30° angles.",
      },
      { ...angleSteps, tag: "Together" },
      {
        kind: "choice",
        tag: "Together",
        title: "Bisect a 90° angle. Each half is",
        options: [
          { text: "45°", correct: true, feedback: "A way to construct 45° with no protractor." },
          { text: "90°", feedback: "Bisecting halves it." },
        ],
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Put the steps in order",
        items: [
          "Compass on Q: an arc crossing both arms",
          "From each crossing, same width: arcs meeting inside",
          "Join Q to where they meet",
        ],
        first: "first",
        last: "last",
        hint: "Start at the corner.",
        done: "That's the angle bisector.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A point on the bisector of an angle is",
        options: [
          {
            text: "the same distance from both arms",
            correct: true,
            feedback: "Just as the path is between the walls.",
          },
          { text: "the same distance from Q and the arms", feedback: "From the two arms." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Zoe joins the two points where her first arc crosses the arms. Is that the bisector?",
        options: [
          {
            text: "No: join Q to where the next two arcs meet",
            correct: true,
            feedback: "Joining the arm crossings makes a line across the angle, not through Q.",
          },
          { text: "Yes", feedback: "The bisector must start at Q." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ali bisects a 70° angle.",
        lines: [
          "Arc from Q crossing both arms",
          "From each crossing, arcs meeting inside",
          "Each half is 70°",
        ],
        wrong: 2,
        why: "Bisecting halves it: each half is 35°.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The path between the walls",
        picture: anglePic(...angle, arcQ, ...arcsMid, seg(Q, { x: 5.4, y: 3.12 }, "find")),
        options: [
          {
            text: "Along the angle bisector, at 30° to each wall",
            correct: true,
            feedback: "Every point on it is equally far from both walls.",
          },
          { text: "Along one wall", feedback: "It must be equally far from both." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Bisect an 80° angle. Each half is",
            options: ["40°", "80°", "160°"],
            answers: ["40°"],
            why: "Half of 80°.",
            retry: {
              prompt: "Bisect a 120° angle. Each half is",
              options: ["60°", "120°", "240°"],
              answers: ["60°"],
              why: "Half of 120°.",
            },
          },
          {
            prompt: "The first arc is drawn with the compass on",
            options: ["the corner of the angle", "one arm's end", "anywhere"],
            answers: ["the corner of the angle"],
            why: "On Q.",
            retry: {
              prompt: "The bisector is joined from",
              options: ["the corner to where the arcs meet", "arm to arm", "the arcs to the arms"],
              answers: ["the corner to where the arcs meet"],
              why: "From Q.",
            },
          },
          {
            prompt: "Points on an angle bisector are equally far from",
            options: ["both arms", "the corner", "one arm"],
            answers: ["both arms"],
            why: "That's why it's halfway between.",
            retry: {
              prompt: "A path equally far from two meeting walls follows",
              options: ["the angle bisector", "the perpendicular bisector", "one wall"],
              answers: ["the angle bisector"],
              why: "Equal distance from both arms.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-constructions",
    id: "y8-constructions/shortest",
    before: SHORTEST,
    title: "The shortest way",
    summary: "The shortest distance from a point to a line meets it at right angles.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Swim to the shore",
        text: [
          "A swimmer at P gets tired and needs to reach the straight shore as quickly as possible. Which way should she swim?",
          "By the end of this lesson, you'll know, and why.",
        ],
        picture: shortest,
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In a right-angled triangle, the longest side is",
        options: [
          {
            text: "the hypotenuse, opposite the right angle",
            correct: true,
            feedback: "The slanted side.",
          },
          { text: "the shortest of the other two", feedback: "The hypotenuse is always longest." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Perpendicular to a horizontal line means",
        options: [
          { text: "straight up or down", correct: true, feedback: "At 90°." },
          { text: "sloping", feedback: "At 90°: vertical." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is the shortest distance from P to the line?",
        picture: shortest,
        options: [
          {
            text: "A, at right angles to the line",
            correct: true,
            feedback: "The **perpendicular distance** is always the shortest.",
          },
          { text: "B", feedback: "B slants, so it is longer than the line straight across." },
          { text: "C", feedback: "C slants a lot: it is the longest." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Why it's shortest",
        text: [
          "A slanted path, B, makes a right-angled triangle with A. B is its hypotenuse, so it's **longer** than A.",
          "Every slanted path is a hypotenuse. Only the perpendicular one isn't, so it's the shortest.",
        ],
        picture: shortest,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "On a grid",
        problem: "Find the shortest distance from (3, 5) to the x-axis.",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
          points: [
            { x: 3, y: 5 },
            { x: 3, y: 0 },
          ],
        },
        steps: [
          { line: "Go straight down to the x-axis: (3, 0)", why: "Perpendicular to the axis." },
          { line: "Distance: 5 units", why: "From y = 5 to y = 0." },
        ],
        done: "Straight down is the perpendicular.",
      },
      { ...fromPointSteps, tag: "Together", title: "Construct the shortest path from P" },
      {
        kind: "choice",
        tag: "Together",
        title: "Shortest distance from (−2, 4) to the y-axis?",
        options: [
          { text: "2 units", correct: true, feedback: "Straight across to (0, 4)." },
          { text: "4 units", feedback: "To the y-axis, go across: 2." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Shortest distance from (2, 7) to the line y = 3",
        answers: ["4"],
        unit: "units",
        hint: "Straight down from y = 7 to y = 3.",
        done: "$7 - 3 = 4$ units.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "To measure how far a tree is from a straight road, measure",
        options: [
          {
            text: "at right angles to the road",
            correct: true,
            feedback: "The perpendicular distance.",
          },
          { text: "to the nearest junction", feedback: "That's a slanted, longer path." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Lee measures from P to the line along a slant: 5 cm. Is that the distance from P to the line?",
        options: [
          {
            text: "No: the distance to a line means the perpendicular one",
            correct: true,
            feedback: "Any slanted path is longer than the true distance.",
          },
          { text: "Yes", feedback: "A slanted path is a hypotenuse: too long." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eva finds the distance from (4, 6) to the x-axis.",
        lines: ["The x-axis is y = 0", "Go across to x = 0", "Distance: 4"],
        wrong: 1,
        why: "To reach the x-axis, go straight **down**, from y = 6 to 0: 6 units.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The swimmer at P",
        picture: shortest,
        options: [
          {
            text: "Straight to the shore, at 90°: path A",
            correct: true,
            feedback: "The perpendicular is the shortest way.",
          },
          { text: "Path C, towards the far end", feedback: "C is a long hypotenuse." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The shortest distance from a point to a line is",
            options: ["perpendicular to the line", "parallel to it", "at 45°"],
            answers: ["perpendicular to the line"],
            why: "At right angles.",
            retry: {
              prompt: "The shortest path to a straight line meets it at",
              options: ["90°", "45°", "180°"],
              answers: ["90°"],
              why: "Perpendicular.",
            },
          },
          {
            prompt: "Shortest distance from (5, 3) to the x-axis?",
            options: ["3", "5", "8"],
            answers: ["3"],
            why: "Straight down: 3.",
            retry: {
              prompt: "Shortest distance from (5, 3) to the y-axis?",
              options: ["5", "3", "8"],
              answers: ["5"],
              why: "Straight across: 5.",
            },
          },
          {
            prompt: "Why is a slanted path longer?",
            options: ["It's the hypotenuse of a right-angled triangle", "It's curved", "It isn't"],
            answers: ["It's the hypotenuse of a right-angled triangle"],
            why: "The hypotenuse is the longest side.",
            retry: {
              prompt: "A slanted path from P to a line is always",
              options: [
                "longer than the perpendicular",
                "shorter than the perpendicular",
                "the same",
              ],
              answers: ["longer than the perpendicular"],
              why: "It's a hypotenuse.",
            },
          },
        ],
      },
    ],
  },
];
