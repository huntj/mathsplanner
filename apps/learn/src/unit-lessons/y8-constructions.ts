// Year 8, "Scale drawings and constructions": scale factors and maps, then compass constructions
// built a step at a time, each step drawn as it is chosen: the perpendicular bisector, an angle
// bisector and a perpendicular from a point, and why the perpendicular is the shortest way.
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

export const y8Constructions: UnitLesson = {
  unit: "y8-constructions",
  title: "Compass and ruler",
  summary: "Scale drawings up and down, then construct with a compass a step at a time.",
  screens: [
    {
      kind: "explain",
      title: "Scale factor",
      text: [
        "An enlargement with **scale factor** 3 makes every length 3 times as long. The angles stay the same.",
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
      kind: "answer",
      title: "A model car",
      text: "A model car is made to a scale of 1 : 40. The model is 11 cm long. How long is the real car, in metres?",
      answers: ["4.4"],
      unit: "m",
      wrong: [{ answer: "440", feedback: "440 is in centimetres. There are 100 cm in a metre." }],
      hint: "Every length is 40 times bigger for real.",
      done: "$11 \\times 40 = 440$ cm, which is 4.4 m.",
    },
    {
      kind: "answer",
      title: "Real to map",
      text: "On a map, 1 cm stands for 2.5 km. A walk is 10 km long. How long is it on the map?",
      answers: ["4"],
      unit: "cm",
      wrong: [{ answer: "25", feedback: "That multiplies. To go from real to map, divide." }],
      hint: "How many lots of 2.5 km make 10 km?",
      done: "$10 \\div 2.5 = 4$ cm.",
    },
    {
      kind: "steps",
      title: "Cut AB in half, at right angles",
      text: "This is the **perpendicular bisector**.",
      picture: bisectorPic(...ab),
      start: "Draw it with a compass and a ruler.",
      stages: [
        {
          prompt: "Put the compass point on A. How wide do you open it?",
          options: [
            { text: "More than half of AB", correct: true, feedback: "" },
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
            { text: "Keep it the same", correct: true, feedback: "" },
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
            { text: "Join the two crossing points", correct: true, feedback: "" },
            {
              text: "Join A to a crossing point",
              feedback: "That makes a sloping line. Join the two crossings.",
            },
          ],
          then: "That line cuts AB in half, at right angles.",
          picture: draw(
            ...ab,
            ...fromA,
            ...fromB,
            seg({ x: 3, y: 3.2 }, { x: 3, y: -3.2 }, "find"),
          ),
        },
      ],
      done: "Every point on it is the same distance from A as from B.",
    },
    {
      kind: "steps",
      title: "Cut an angle in half",
      text: "This is the **angle bisector**.",
      picture: anglePic(...angle),
      start: "Bisect the angle at Q.",
      stages: [
        {
          prompt: "Compass on Q. What do you draw?",
          options: [
            { text: "An arc crossing both arms", correct: true, feedback: "" },
            { text: "A whole circle", feedback: "Just an arc across the two arms is enough." },
          ],
          then: "Draw an arc crossing both arms.",
          picture: anglePic(...angle, arcQ),
        },
        {
          prompt: "From where the arc crosses each arm, keeping the same width:",
          options: [
            { text: "Draw two arcs that cross inside the angle", correct: true, feedback: "" },
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
            { text: "Join Q to where they cross", correct: true, feedback: "" },
            { text: "Join the two arms", feedback: "Join Q to the crossing point." },
          ],
          then: "That line splits the angle in half.",
          picture: anglePic(...angle, arcQ, ...arcsMid, seg(Q, { x: 5.4, y: 3.12 }, "find")),
        },
      ],
      done: "The 60° angle is split into two angles of 30°.",
    },
    {
      kind: "choice",
      title: "A right angle at a point",
      text: "To draw a perpendicular at a point on a line, which construction do you use?",
      options: [
        {
          text: "Bisect the straight angle at the point",
          correct: true,
          feedback: "The point splits the line into an angle of 180°. Half of 180° is 90°.",
        },
        { text: "Draw a circle round the point", feedback: "A circle alone gives no right angle." },
        {
          text: "Measure 90° by eye",
          feedback: "A construction uses a compass and ruler, not guesswork.",
        },
      ],
    },
    {
      kind: "steps",
      title: "From a point to a line",
      picture: pointPic(...line),
      start: "Draw the perpendicular from P to the line.",
      stages: [
        {
          prompt: "Compass on P. What do you draw?",
          options: [
            { text: "An arc crossing the line twice", correct: true, feedback: "" },
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
            { text: "Draw arcs that cross below the line", correct: true, feedback: "" },
            {
              text: "Draw arcs above P",
              feedback: "Cross them on the other side of the line from P.",
            },
          ],
          then: "The arcs cross below the line.",
          picture: pointPic(...line, arcP, ...arcsBelow),
        },
        {
          prompt: "Finally:",
          options: [
            { text: "Join P to where they cross", correct: true, feedback: "" },
            { text: "Join the two crossings on the line", feedback: "That is the line itself." },
          ],
          then: "That line meets the first one at right angles.",
          picture: pointPic(...line, arcP, ...arcsBelow, seg(P, { x: 4, y: -3 }, "find")),
        },
      ],
      done: "It is the perpendicular from P to the line.",
    },
    {
      kind: "choice",
      title: "The shortest way",
      text: "Which is the shortest distance from P to the line?",
      picture: draw(
        seg({ x: 0, y: 0 }, { x: 8, y: 0 }),
        { dot: P },
        { text: "P", at: { x: 4, y: 3.6 } },
        seg(P, { x: 4, y: 0 }, "find"),
        seg(P, { x: 1, y: 0 }, "soft"),
        seg(P, { x: 7.5, y: 0 }, "soft"),
        { text: "A", at: { x: 4.4, y: 1.3 } },
        { text: "B", at: { x: 2.1, y: 1.3 } },
        { text: "C", at: { x: 6.2, y: 1.3 } },
      ),
      options: [
        {
          text: "A, at right angles to the line",
          correct: true,
          feedback:
            "The **perpendicular distance** is always the shortest. Every slanted line is longer.",
        },
        { text: "B", feedback: "B slants, so it is longer than the line straight across." },
        { text: "C", feedback: "C slants a lot: it is the longest." },
      ],
    },
    {
      kind: "explain",
      title: "Compass and ruler",
      text: [
        "A scale multiplies every length by the same number.",
        "Constructions keep the compass width the same, so the points they find are equal distances apart.",
        "The perpendicular distance from a point to a line is the shortest.",
      ],
      picture: bisectorPic(
        ...ab,
        ...fromA,
        ...fromB,
        seg({ x: 3, y: 3.2 }, { x: 3, y: -3.2 }, "find"),
      ),
    },
  ],
};
