// GCSE Higher, circle theorems (GH-G10), redrafted with variation: six lessons in place of one,
// each with one theorem and its method. Every lesson shows its example beside a question like it,
// fades a second example, then changes one thing at a time (the numbers, the way the diagram is
// turned, where the point sits, algebra, a non-example) and moves the unknown around the
// relationship. Diagrams are drawn from the numbers, so what a pupil sees is accurate.
import {
  ask,
  choose,
  explain,
  fade,
  lesson,
  methodCard,
  mistake,
  pair,
  problem,
  questionSet,
  quiz,
  typed,
} from "./build.ts";
import { circlePic } from "./circle-pictures.ts";
import type { DrawingPic, Point, RelationPic, UnitLesson, Variation } from "./types.ts";

const U = "gh-circles";
const SKILL = "GH-G10";
const P = (x: number, y: number): Point => ({ x, y });

const relation = (cells: [string, string][], joins: string[], asks?: number): RelationPic => ({
  kind: "relation",
  cells: cells.map(([label, value]) => ({ label, value })),
  joins,
  ...(asks === undefined ? {} : { asks }),
});

// The angle at the centre: arc AB faces `turn`; C sits at `c` (on the minor arc, the angle at C
// stands on the reflex angle).
function centre(
  angle: number,
  labels: [atCentre: string, atC: string],
  opts: { turn?: number; c?: number } = {},
): DrawingPic {
  const turn = opts.turn ?? 270;
  return circlePic({
    centre: true,
    on: { A: turn - angle / 2, B: turn + angle / 2, C: opts.c ?? turn + 180 },
    lines: ["OA", "OB", "CA", "CB"],
    angles: [
      ["AOB", labels[0]],
      ["ACB", labels[1]],
    ],
  });
}

// The angle in a semicircle: diameter AB at `turn`, C placed so that angle CAB is `a`.
function semicircle(
  a: number,
  labels: { A?: string; B?: string; C?: string },
  opts: { turn?: number; below?: boolean } = {},
): DrawingPic {
  const turn = opts.turn ?? 0;
  const side = opts.below ? -1 : 1;
  const angles: [string, string][] = [];
  if (labels.A) angles.push(["CAB", labels.A]);
  if (labels.B) angles.push(["ABC", labels.B]);
  if (labels.C) angles.push(["ACB", labels.C]);
  return circlePic({
    centre: true,
    on: { A: turn + 180, B: turn, C: turn + side * 2 * a },
    lines: ["AB", "CA", "CB"],
    angles,
  });
}

// Angles in the same segment: chord AB faces `turn`; C and D on the major arc, both standing on
// AB, each `angle` (half of the angle at the centre).
function bowtie(
  angle: number,
  labels: [atC: string, atD: string],
  opts: { turn?: number; c?: number; d?: number; dOpposite?: boolean } = {},
): DrawingPic {
  const turn = opts.turn ?? 270;
  return circlePic({
    on: {
      A: turn - angle,
      B: turn + angle,
      C: opts.c ?? turn + 150,
      D: opts.dOpposite ? turn : (opts.d ?? turn + 210),
    },
    lines: ["CA", "CB", "DA", "DB"],
    angles: [
      ["ACB", labels[0]],
      ["ADB", labels[1]],
    ],
  });
}

// A cyclic quadrilateral ABCD with angle DAB = a and angle ABC = b, drawn exactly.
function cyclic(
  a: number,
  b: number,
  labels: { A?: string; B?: string; C?: string; D?: string },
  turn = 300,
): DrawingPic {
  const q = Math.min(a, b);
  const p = 2 * a - q;
  const s = 2 * b - q;
  const B = turn;
  const C = B + p;
  const D = C + q;
  const A = D + s;
  const angles: [string, string][] = [];
  if (labels.A) angles.push(["DAB", labels.A]);
  if (labels.B) angles.push(["ABC", labels.B]);
  if (labels.C) angles.push(["BCD", labels.C]);
  if (labels.D) angles.push(["CDA", labels.D]);
  return circlePic({ on: { A, B, C, D }, lines: ["AB", "BC", "CD", "DA"], angles });
}

// Two tangents from P touch the circle at A and B; angle APB is `p`.
function kite(
  p: number,
  labels: { P?: string; O?: string; A?: string; B?: string },
  turn = 0,
): DrawingPic {
  const r = 2.4;
  const half = (180 - p) / 2;
  const d = r / Math.cos((half * Math.PI) / 180);
  const angles: [string, string][] = [];
  if (labels.P) angles.push(["APB", labels.P]);
  if (labels.O) angles.push(["AOB", labels.O]);
  if (labels.A) angles.push(["OAP", labels.A]);
  if (labels.B) angles.push(["PBO", labels.B]);
  return circlePic({
    r,
    centre: true,
    on: { A: turn + half, B: turn - half },
    off: { P: P(d * Math.cos((turn * Math.PI) / 180), d * Math.sin((turn * Math.PI) / 180)) },
    lines: ["OA", "OB", "PA", "PB"],
    angles,
  });
}

// The alternate segment: the tangent at T (at the bottom) and chord TA make angle x on the right;
// B is on the far arc, so angle TBA is x too.
function alternate(
  x: number,
  labels: { tangent?: string; B?: string; A?: string; T?: string },
  b = 150,
): DrawingPic {
  const angles: [string, string][] = [];
  if (labels.tangent) angles.push(["STA", labels.tangent]);
  if (labels.B) angles.push(["TBA", labels.B]);
  if (labels.A) angles.push(["BAT", labels.A]);
  if (labels.T) angles.push(["ATB", labels.T]);
  return circlePic({
    on: { T: 270, A: 270 + 2 * x, B: b },
    lines: ["TA", "TB", "AB"],
    tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
    angles,
  });
}

// ---------------------------------------------------------------------------------------------
// 1. The angle at the centre.

const centreMap: Variation = {
  relationship: "angle at the centre = 2 × angle at the circumference, on the same arc",
  unknowns: ["centre", "circumference"],
  surface: ["numbers", "turned diagram", "where C sits", "reflex angle", "algebra"],
  nonExamples: ["two angles that stand on different arcs"],
};
const centreRel = (atCentre: string, atC: string, asks: number) =>
  relation(
    [
      ["angle at the centre", atCentre],
      ["angle at the circumference", atC],
    ],
    ["$= 2 \\times$"],
    asks,
  );

const centreMethod = [
  "Find the arc: both angles' arms end at the same two points, A and B.",
  "Check one angle is at the centre O and the other is on the circumference.",
  "Centre = 2 × circumference: halve to go out to the edge, double to go in.",
  "Give the reason: the angle at the centre is twice the angle at the circumference.",
];

const angleAtCentre = lesson(
  U,
  "centre",
  SKILL,
  "The angle at the centre",
  "The angle at the centre is twice the angle at the circumference on the same arc.",
  [
    problem(
      "Find angle ACB",
      [
        "“O is the centre of the circle. Angle AOB = 130°. Find angle ACB. Give a reason.”",
        "Circle theorems are rules about the angles in a circle. This lesson is the first, and the others are built on it.",
      ],
      centre(130, ["130°", "?"]),
    ),
    typed("Warm-up", "Angles at a point add up to", "360", "All the way round.", "360°.", {
      unit: "°",
    }),
    choose(
      "Warm-up",
      "O is the centre. Which two lines must be the same length?",
      "OA and OC",
      "Both are radii.",
      [
        ["OA and AC", "AC is a chord, not a radius."],
        ["AC and BC", "Chords can be any length."],
      ],
      { picture: centre(100, ["", ""]) },
    ),
    explain(
      "Discover",
      "Why it's twice",
      [
        "OA, OB and OC are all radii, so the triangles OAC and OBC are isosceles.",
        "In each one, the angle at O outside the triangle is twice its angle at C. Add the two parts: **the angle at the centre is twice the angle at the circumference**, when both stand on the same arc AB.",
      ],
      centre(100, ["2x", "x"]),
    ),
    choose(
      "Discover",
      "Angle AOB = 90°. Angle ACB is",
      "45°",
      "Half the angle at the centre.",
      [
        ["90°", "The angle at the centre is the bigger one."],
        ["180°", "Double goes the other way: centre = 2 × circumference."],
      ],
      { picture: centre(90, ["90°", "?"]) },
    ),
    methodCard("The method", centreMethod, centre(100, ["2x", "x"])),
    pair(
      "Halve the angle at the centre",
      {
        problem: "Angle AOB = 80°. Find angle ACB.",
        picture: centre(80, ["80°", "?"]),
        lines: [
          ["Both angles stand on arc AB.", "Their arms end at A and B."],
          [
            "ACB = 80° ÷ 2 = 40°",
            "The angle at the centre is twice the angle at the circumference.",
          ],
        ],
      },
      ask(
        "Angle AOB = 120°. Find angle ACB.",
        "60",
        "Halve the angle at the centre.",
        "60°: half of 120°.",
        {
          unit: "°",
          asks: "circumference",
          picture: centre(120, ["120°", "?"]),
        },
      ),
      "Same arc, so halve.",
    ),
    fade(
      "Now double it",
      "Angle ACB = 35°. Find angle AOB, with a reason.",
      ["Both angles stand on arc AB."],
      [
        [
          "So angle AOB is",
          "$2 \\times 35° = 70°$",
          ["$35° \\div 2 = 17.5°$", "The angle at the centre is the bigger one: double."],
          "Angle AOB = 70°",
        ],
        [
          "The reason:",
          "the angle at the centre is twice the angle at the circumference",
          [
            "angles in the same segment are equal",
            "That rule is for two angles on the circumference.",
          ],
          "The angle at the centre is twice the angle at the circumference.",
        ],
      ],
      "Double to go in to the centre; halve to go out.",
      centre(70, ["?", "35°"]),
    ),
    questionSet(
      "Same method, different look",
      "Find angle ACB each time. Watch what changes.",
      [
        ask("Angle AOB = 100°. Find angle ACB.", "50", "Halve 100°.", "50°.", {
          unit: "°",
          asks: "circumference",
          picture: centre(100, ["100°", "?"]),
        }),
        ask("Angle AOB = 140°. Find angle ACB.", "70", "Halve 140°.", "70°.", {
          unit: "°",
          asks: "circumference",
          changed: "The angle at the centre went up by 40°.",
          expect: [
            "So angle ACB goes up by…",
            "20°",
            "Half of the change: the angle at the circumference is always half.",
            [
              ["40°", "It changes by half as much."],
              ["80°", "Halving makes the change smaller, not bigger."],
            ],
          ],
          picture: centre(140, ["140°", "?"]),
        }),
        ask(
          "Angle AOB = 140°. Find angle ACB.",
          "70",
          "It's still half of 140°.",
          "Still 70°: turning a diagram changes none of its angles.",
          {
            unit: "°",
            asks: "circumference",
            changed: "The whole diagram is turned.",
            picture: centre(140, ["140°", "?"], { turn: 180 }),
          },
        ),
        ask(
          "Angle AOB = 140°, and C has moved along the big arc. Find angle ACB.",
          "70",
          "C is still on the major arc: halve 140°.",
          "70°: every point on the major arc sees AB at the same angle.",
          {
            unit: "°",
            asks: "circumference",
            changed: "C has moved round the major arc.",
            picture: centre(140, ["140°", "?"], { c: 140 }),
          },
        ),
        ask(
          "Angle AOB = 100°, but C is on the small arc. Find angle ACB.",
          "130",
          "C faces the reflex angle at O: 360° − 100° = 260°. Halve that.",
          "130°: half of the reflex angle, 260°.",
          {
            unit: "°",
            asks: "circumference",
            changed: "C is now on the minor arc, on the other side of AB.",
            expect: [
              "Angle ACB will be…",
              "more than 90°",
              "Now it stands on the reflex angle at O, the big one: 360° − 100° = 260°.",
              [
                [
                  "still half of 100°",
                  "C now looks at AB from the other side: use the reflex angle.",
                ],
              ],
            ],
            picture: centre(100, ["100°", "?"], { c: 270 }),
          },
        ),
        ask(
          "AB is a diameter, so angle AOB = 180°. Find angle ACB.",
          "90",
          "Halve 180°.",
          "90°: the next lesson's theorem, the angle in a semicircle.",
          {
            unit: "°",
            asks: "circumference",
            changed: "A, O and B are in a straight line.",
            picture: semicircle(30, { C: "?" }),
          },
        ),
      ],
      "Turned, moved or on the other side: it's the same theorem. Check which arc first.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Angle AOB = 110°. Find angle ACB.", "55", "Halve it.", "55°.", {
          unit: "°",
          asks: "circumference",
          picture: centreRel("110°", "?", 1),
        }),
        ask(
          "Angle ACB = 35°. Find angle AOB.",
          "70",
          "The angle at the centre is double.",
          "70°.",
          {
            unit: "°",
            asks: "centre",
            changed: "Now the angle at the centre is missing.",
            picture: centreRel("?", "35°", 0),
          },
        ),
        ask("Angle ACB = 72°. Find angle AOB.", "144", "Double 72°.", "144°.", {
          unit: "°",
          asks: "centre",
          picture: centreRel("?", "72°", 0),
        }),
        ask(
          "Angle AOB = 150° and angle ACB = 3y. Find y.",
          "25",
          "Halve 150° to get angle ACB, then divide by 3.",
          "ACB = 75°, so 3y = 75 and y = 25.",
          {
            asks: "circumference",
            changed: "The angle at the circumference is written in algebra.",
            picture: centreRel("150°", "?", 1),
          },
        ),
      ],
      "First ask which angle is missing, then double or halve.",
      { text: "The angle at the centre is twice the angle at the circumference." },
    ),
    typed("Your turn", "Angle ACB = 47°. Find angle AOB.", "94", "Double it.", "94°.", {
      unit: "°",
      picture: centre(94, ["?", "47°"], { turn: 200 }),
    }),
    typed(
      "Your turn",
      "Angle AOB = 4x and angle ACB = 50°. Find x.",
      "25",
      "AOB = 2 × 50° = 100°, so 4x = 100.",
      "x = 25.",
      {
        picture: centre(100, ["4x", "50°"], { turn: 330 }),
      },
    ),
    choose(
      "Watch out",
      "Ben says angle AOB = 2 × angle BDE. Is he right?",
      "No: the two angles stand on different arcs",
      "Angle AOB stands on arc AB; angle BDE stands on arc BE. The theorem needs the same arc.",
      [
        [
          "Yes: one is at the centre and one at the circumference",
          "Check the arc: their arms must end at the same two points.",
        ],
      ],
      {
        picture: circlePic({
          centre: true,
          on: { A: 230, B: 310, E: 20, D: 150 },
          lines: ["OA", "OB", "DB", "DE"],
          angles: [
            ["AOB", "80°"],
            ["BDE", "?"],
          ],
        }),
      },
    ),
    mistake(
      "Ola finds angle ACB. Angle AOB = 100°, and C is on the minor arc.",
      [
        "The angle at the centre is twice the angle at the circumference.",
        "So ACB = 100° ÷ 2",
        "ACB = 50°",
      ],
      1,
      "C is on the minor arc, so ACB stands on the reflex angle: 360° − 100° = 260°, and ACB = 130°.",
      centre(100, ["100°", "?"], { c: 270 }),
    ),
    choose(
      "Back to the problem",
      "“Angle AOB = 130°. Find angle ACB. Give a reason.”",
      "65°, because the angle at the centre is twice the angle at the circumference",
      "Half of 130°, with the theorem as the reason.",
      [
        [
          "130°, because angles in the same segment are equal",
          "One angle is at the centre: halve it.",
        ],
        ["65°, because angles in a triangle add to 180°", "Right number, wrong reason."],
      ],
      { picture: centre(130, ["130°", "?"]) },
    ),
    quiz([
      [
        [
          "Angle AOB = 150°. Angle ACB?",
          "75°",
          ["300°", "150°"],
          "Halve it.",
          undefined,
          "circumference",
        ],
        [
          "Angle AOB = 96°. Angle ACB?",
          "48°",
          ["192°", "96°"],
          "Halve it.",
          undefined,
          "circumference",
        ],
      ],
      [
        ["Angle ACB = 41°. Angle AOB?", "82°", ["20.5°", "41°"], "Double it.", undefined, "centre"],
        [
          "Angle ACB = 63°. Angle AOB?",
          "126°",
          ["31.5°", "63°"],
          "Double it.",
          undefined,
          "centre",
        ],
      ],
      [
        [
          "Angle AOB = 3x and angle ACB = x + 12°. x?",
          "24°",
          ["12°", "36°"],
          "3x = 2(x + 12) = 2x + 24.",
        ],
        [
          "Angle AOB = 5x and angle ACB = 2x + 10°. x?",
          "20°",
          ["10°", "40°"],
          "5x = 2(2x + 10) = 4x + 20.",
        ],
      ],
    ]),
  ],
);
angleAtCentre.method = centreMethod;
angleAtCentre.variation = centreMap;

// ---------------------------------------------------------------------------------------------
// 2. The angle in a semicircle.

const triangleRel = (a: string, b: string, c: string, asks: number) =>
  relation(
    [
      ["angle at A", a],
      ["angle at B", b],
      ["angle at C", c],
      ["in all", "180°"],
    ],
    ["+", "+", "="],
    asks,
  );

const semicircleMethod = [
  "Spot the diameter: a chord through the centre O.",
  "The angle at the circumference standing on it is 90°.",
  "In the triangle, the other two angles add to 90°.",
  "Give reasons: the angle in a semicircle is 90°; angles in a triangle add to 180°.",
];

const semicircleLesson = lesson(
  U,
  "semicircle",
  SKILL,
  "The angle in a semicircle",
  "An angle standing on a diameter is 90°.",
  [
    problem(
      "Find angle ABC",
      [
        "“AB is a diameter of the circle, centre O. Angle CAB = 34°. Find angle ABC. Give reasons.”",
        "By the end of this lesson, you'll see the right angle hiding in it.",
      ],
      semicircle(34, { A: "34°", B: "?" }),
    ),
    typed(
      "Warm-up",
      "Two angles of a triangle are 90° and 34°. The third angle?",
      "56",
      "180° − 90° − 34°.",
      "56°.",
      {
        unit: "°",
      },
    ),
    choose(
      "Warm-up",
      "A diameter is a chord that",
      "passes through the centre",
      "Corner to corner of the circle, through O.",
      [
        ["touches the circle once", "That's a tangent."],
        ["joins any two points on the circle", "That's any chord."],
      ],
    ),
    explain(
      "Discover",
      "A special case",
      [
        "A diameter AB is a straight line through O, so the angle at the centre is 180°.",
        "The angle at the centre is twice the angle at the circumference, so angle ACB = 180° ÷ 2 = **90°**, wherever C is on the circle.",
      ],
      semicircle(30, { C: "90°" }),
    ),
    choose(
      "Discover",
      "C moves round the circle. Angle ACB",
      "is always 90°",
      "Every point on the circle sees the diameter at a right angle.",
      [
        ["gets bigger near A", "It stays 90° until C reaches A or B."],
        ["is always 180°", "That's the straight angle at O."],
      ],
      { picture: semicircle(65, { C: "?" }) },
    ),
    methodCard("The method", semicircleMethod, semicircle(30, { C: "90°" })),
    pair(
      "Use the right angle",
      {
        problem: "AB is a diameter. Angle CAB = 25°. Find angle ABC.",
        picture: semicircle(25, { A: "25°", B: "?" }),
        lines: [
          ["ACB = 90°", "The angle in a semicircle is 90°."],
          ["ABC = 180° − 90° − 25° = 65°", "Angles in a triangle add to 180°."],
        ],
      },
      ask(
        "AB is a diameter. Angle CAB = 40°. Find angle ABC.",
        "50",
        "ACB is 90°, so take 90° and 40° from 180°.",
        "50°.",
        {
          unit: "°",
          asks: "angle at B",
          picture: semicircle(40, { A: "40°", B: "?" }),
        },
      ),
      "The other two angles always add to 90°.",
    ),
    fade(
      "Finish it",
      "AB is a diameter. Angle ABC = 58°. Find angle CAB.",
      ["Angle ACB = 90° (the angle in a semicircle)."],
      [
        [
          "So angle CAB is",
          "$90° - 58° = 32°$",
          ["$180° - 58° = 122°$", "Take off the right angle too."],
          "Angle CAB = 32°",
        ],
      ],
      "32°: the two angles share 90°.",
      semicircle(32, { A: "?", B: "58°" }),
    ),
    questionSet(
      "Same method, different look",
      "AB is a diameter each time. Watch what changes.",
      [
        ask("Angle CAB = 30°. Find angle ABC.", "60", "90° − 30°.", "60°.", {
          unit: "°",
          asks: "angle at B",
          picture: semicircle(30, { A: "30°", B: "?" }),
        }),
        ask("Angle CAB = 40°. Find angle ABC.", "50", "90° − 40°.", "50°.", {
          unit: "°",
          asks: "angle at B",
          changed: "Angle CAB went up by 10°.",
          expect: [
            "So angle ABC…",
            "goes down by 10°",
            "The two angles share 90°: one up means the other down.",
            [
              ["goes up by 10°", "They must still add to 90°."],
              ["stays the same", "They must still add to 90°."],
            ],
          ],
          picture: semicircle(40, { A: "40°", B: "?" }),
        }),
        ask(
          "Angle CAB = 40°. Find angle ABC.",
          "50",
          "Still 90° − 40°.",
          "Still 50°: a turned diagram has the same angles.",
          {
            unit: "°",
            asks: "angle at B",
            changed: "The diameter is upright now.",
            picture: semicircle(40, { A: "40°", B: "?" }, { turn: 90 }),
          },
        ),
        ask(
          "Angle CAB = 72°. Find angle ABC.",
          "18",
          "90° − 72°.",
          "18°: the angle at A is big, so the angle at B is small.",
          {
            unit: "°",
            asks: "angle at B",
            changed: "C is below the diameter, near A.",
            picture: semicircle(72, { A: "72°", B: "?" }, { below: true }),
          },
        ),
        ask(
          "Angle CAB = x and angle ABC = 2x. Find x.",
          "30",
          "x + 2x = 90°.",
          "3x = 90, so x = 30.",
          {
            asks: "angle at A",
            changed: "The angles are written in algebra.",
            picture: semicircle(30, { A: "x", B: "2x" }),
          },
        ),
        ask(
          "Chord AB does not pass through O. Is angle ACB 90°?",
          "No",
          "It's only 90° when AB is a diameter.",
          "No: AB isn't a diameter, so there's no semicircle.",
          {
            changed: "This chord misses the centre.",
            others: ["Yes"],
            picture: circlePic({
              centre: true,
              on: { A: 200, B: 340, C: 90 },
              lines: ["AB", "CA", "CB"],
              angles: [["ACB", "?"]],
            }),
          },
        ),
      ],
      "Always check for a diameter first: no diameter, no right angle.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Angle CAB = 28°. Find angle ABC.", "62", "90° − 28°.", "62°.", {
          unit: "°",
          asks: "angle at B",
          picture: triangleRel("28°", "?", "90°", 1),
        }),
        ask("Angle ABC = 47°. Find angle CAB.", "43", "90° − 47°.", "43°.", {
          unit: "°",
          asks: "angle at A",
          changed: "Now the angle at A is missing.",
          picture: triangleRel("?", "47°", "90°", 0),
        }),
        ask(
          "Angle CAB = 35° and angle ABC = 55°. Find angle ACB.",
          "90",
          "It's the angle in a semicircle.",
          "90°, and 35° + 55° + 90° = 180° checks it.",
          {
            unit: "°",
            asks: "angle at C",
            changed: "Now the angle at C is missing.",
            picture: triangleRel("35°", "55°", "?", 2),
          },
        ),
        ask(
          "Angle CAB = 2x + 10° and angle ABC = 50°. Find x.",
          "15",
          "Angle CAB = 90° − 50° = 40°, so 2x + 10 = 40.",
          "x = 15.",
          {
            asks: "angle at A",
            picture: triangleRel("?", "50°", "90°", 0),
          },
        ),
      ],
      "Whichever angle is missing, the 90° is your way in.",
      { text: "AB is a diameter, so angle C is 90°, and the three angles add to 180°." },
    ),
    typed(
      "Your turn",
      "AB is a diameter. Angle ABC = 61°. Find angle CAB.",
      "29",
      "90° − 61°.",
      "29°.",
      {
        unit: "°",
        picture: semicircle(29, { A: "?", B: "61°" }, { turn: 30 }),
      },
    ),
    typed(
      "Your turn",
      "AB is a diameter and AC = BC. Find angle CAB.",
      "45",
      "The triangle is isosceles and the angles at A and B share 90°.",
      "45°.",
      {
        unit: "°",
        picture: semicircle(45, { A: "?", B: "?" }),
      },
    ),
    choose(
      "Watch out",
      "Zoe says angle ACB is 90° because C is on the circle. What's missing?",
      "AB must be a diameter",
      "The right angle only stands on a diameter.",
      [["Nothing: every angle in a circle is 90°", "Only angles standing on a diameter are."]],
    ),
    mistake(
      "Leo finds angle ABC. AB is a diameter and angle CAB = 31°.",
      ["ACB = 90° (angle in a semicircle)", "ABC = 180° − 90° + 31°", "ABC = 121°"],
      1,
      "Take away both angles: 180° − 90° − 31° = 59°.",
      semicircle(31, { A: "31°", B: "?" }),
    ),
    choose(
      "Back to the problem",
      "“AB is a diameter. Angle CAB = 34°. Find angle ABC. Give reasons.”",
      "56°: the angle in a semicircle is 90°, and angles in a triangle add to 180°",
      "Both reasons, and the angle.",
      [
        ["56°: angles in a triangle add to 180°", "Say why ACB is 90° too."],
        [
          "146°: angles on a straight line add to 180°",
          "Use the triangle, with its right angle at C.",
        ],
      ],
      { picture: semicircle(34, { A: "34°", B: "?" }) },
    ),
    quiz([
      [
        [
          "Diameter AB, angle CAB = 22°. Angle ABC?",
          "68°",
          ["158°", "22°"],
          "90° − 22°.",
          undefined,
          "angle at B",
        ],
        [
          "Diameter AB, angle CAB = 37°. Angle ABC?",
          "53°",
          ["143°", "37°"],
          "90° − 37°.",
          undefined,
          "angle at B",
        ],
      ],
      [
        [
          "Diameter AB, C on the circle. Angle ACB?",
          "90°",
          ["180°", "45°"],
          "The angle in a semicircle.",
          undefined,
          "angle at C",
        ],
        [
          "Diameter PQ, R on the circle. Angle PRQ?",
          "90°",
          ["180°", "60°"],
          "The angle in a semicircle.",
          undefined,
          "angle at C",
        ],
      ],
      [
        [
          "Diameter AB, angle ABC = 2 × angle CAB. Angle CAB?",
          "30°",
          ["45°", "60°"],
          "3 × angle CAB = 90°.",
          undefined,
          "angle at A",
        ],
        [
          "Diameter AB, angle ABC = 4 × angle CAB. Angle CAB?",
          "18°",
          ["22.5°", "72°"],
          "5 × angle CAB = 90°.",
          undefined,
          "angle at A",
        ],
      ],
    ]),
  ],
);
semicircleLesson.method = semicircleMethod;
semicircleLesson.variation = {
  relationship:
    "the angle on a diameter is 90°, so the other two angles of the triangle add to 90°",
  unknowns: ["angle at A", "angle at B", "angle at C"],
  surface: ["numbers", "turned diagram", "where C sits", "algebra", "no diameter"],
  nonExamples: ["an angle on a chord that misses the centre"],
};

// ---------------------------------------------------------------------------------------------
// 3. Angles in the same segment.

const sameRel = (c: string, d: string, asks: number) =>
  relation(
    [
      ["angle at C", c],
      ["angle at D", d],
    ],
    ["="],
    asks,
  );

const sameSegmentMethod = [
  "Find two angles at the circumference whose arms end at the same two points.",
  "Check they're on the same side of that chord: the same segment.",
  "Then they're equal.",
  "Give the reason: angles in the same segment are equal.",
];

const sameSegment = lesson(
  U,
  "same-segment",
  SKILL,
  "Angles in the same segment",
  "Angles standing on the same arc, on the same side, are equal.",
  [
    problem(
      "The bow tie",
      [
        "“A, B, C and D are on the circle. Angle ACB = 48°. Find angle ADB. Give a reason.”",
        "The two angles look different. By the end of this lesson, you'll see why they can't be.",
      ],
      bowtie(48, ["48°", "?"]),
    ),
    typed(
      "Warm-up",
      "The angle at the centre on arc AB is 96°. The angle at the circumference on AB?",
      "48",
      "Halve it.",
      "48°.",
      {
        unit: "°",
      },
    ),
    choose(
      "Warm-up",
      "A segment is the part of a circle",
      "cut off by a chord",
      "Like a slice cut off by a straight line.",
      [
        ["between two radii", "That's a sector."],
        ["outside the circle", "A segment is inside."],
      ],
    ),
    explain(
      "Discover",
      "Both are half",
      [
        "Angles ACB and ADB both stand on arc AB, so each is half the angle at the centre on AB. Half of the same angle: they must be **equal**.",
        "They must be on the same side of AB, in the **same segment**. This shape is often called a bow tie.",
      ],
      bowtie(48, ["x", "x"]),
    ),
    choose(
      "Discover",
      "D moves round the big arc. Angle ADB",
      "stays the same",
      "It always stands on arc AB from the same side.",
      [
        ["gets bigger", "It's half the angle at the centre, which doesn't change."],
        ["gets smaller", "It's half the angle at the centre, which doesn't change."],
      ],
      { picture: bowtie(40, ["40°", "?"], { d: 160 }) },
    ),
    methodCard("The method", sameSegmentMethod, bowtie(48, ["x", "x"])),
    pair(
      "Spot the bow tie",
      {
        problem: "Angle ACB = 35°. Find angle ADB.",
        picture: bowtie(35, ["35°", "?"]),
        lines: [
          ["Both stand on arc AB, on the same side.", "Their arms end at A and B."],
          ["ADB = 35°", "Angles in the same segment are equal."],
        ],
      },
      ask("Angle ACB = 52°. Find angle ADB.", "52", "Same arc, same side: equal.", "52°.", {
        unit: "°",
        asks: "angle at D",
        picture: bowtie(52, ["52°", "?"]),
      }),
      "Equal angles: nothing to work out once you've spotted the arc.",
    ),
    fade(
      "Finish it",
      "Angle ACB = 40°. Find angle ADB, with a reason.",
      ["ADB and ACB both stand on arc AB, on the same side."],
      [
        [
          "So angle ADB is",
          "40°",
          ["80°", "Both are at the circumference: equal, not double."],
          "Angle ADB = 40°",
        ],
        [
          "The reason:",
          "angles in the same segment are equal",
          [
            "the angle at the centre is twice the angle at the circumference",
            "Neither angle is at the centre.",
          ],
          "Angles in the same segment are equal.",
        ],
      ],
      "Spot the arc, check the side, and they're equal.",
      bowtie(40, ["40°", "?"]),
    ),
    questionSet(
      "Same method, different look",
      "Find the missing angle each time. Watch what changes.",
      [
        ask("Angle ACB = 40°. Find angle ADB.", "40", "Same arc, same side.", "40°.", {
          unit: "°",
          asks: "angle at D",
          picture: bowtie(40, ["40°", "?"]),
        }),
        ask(
          "Angle ACB = 40°. Find angle ADB.",
          "40",
          "Still the same arc.",
          "40°: turning the diagram changes nothing.",
          {
            unit: "°",
            asks: "angle at D",
            changed: "The diagram is turned.",
            picture: bowtie(40, ["40°", "?"], { turn: 180 }),
          },
        ),
        ask(
          "Angle ACB = 40°. Find angle ADB.",
          "40",
          "D is still above AB.",
          "40°: wherever D is on that arc.",
          {
            unit: "°",
            asks: "angle at D",
            changed: "D has moved along the arc, close to C.",
            expect: [
              "D has moved. Angle ADB…",
              "stays 40°",
              "It still stands on arc AB from the same side.",
              [
                ["gets smaller", "Its size doesn't depend on where D is on that arc."],
                ["gets bigger", "Its size doesn't depend on where D is on that arc."],
              ],
            ],
            picture: bowtie(40, ["40°", "?"], { d: 90 }),
          },
        ),
        ask(
          "Angle ACB = 3x and angle ADB = 54°. Find x.",
          "18",
          "They're equal: 3x = 54.",
          "x = 18.",
          {
            asks: "angle at C",
            changed: "One angle is in algebra.",
            picture: bowtie(54, ["3x", "54°"]),
          },
        ),
        ask(
          "Angle ACB = 40°, but D is on the other side of AB. Is angle ADB 40°?",
          "No",
          "C and D must be in the same segment.",
          "No: D is in the other segment. (It's 140°, as ACBD is then a cyclic quadrilateral.)",
          {
            changed: "D is now below AB.",
            others: ["Yes"],
            picture: bowtie(40, ["40°", "?"], { dOpposite: true }),
          },
        ),
      ],
      "Same arc and same side: equal. Other side: not equal.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Angle ACB = 61°. Find angle ADB.", "61", "Equal.", "61°.", {
          unit: "°",
          asks: "angle at D",
          picture: sameRel("61°", "?", 1),
        }),
        ask("Angle ADB = 29°. Find angle ACB.", "29", "Equal.", "29°.", {
          unit: "°",
          asks: "angle at C",
          changed: "Now the angle at C is missing.",
          picture: sameRel("?", "29°", 0),
        }),
        ask("Angle ACB = 2y + 6° and angle ADB = 44°. Find y.", "19", "2y + 6 = 44.", "y = 19.", {
          asks: "angle at C",
          changed: "The angle at C is in algebra.",
          picture: sameRel("?", "44°", 0),
        }),
        ask(
          "In triangle ADB, angle DAB = 70° and angle ABD = 60°. Angle ACB?",
          "50",
          "First find ADB: 180° − 70° − 60°.",
          "ADB = 50°, so ACB = 50°.",
          {
            unit: "°",
            asks: "third angle",
            changed: "Neither angle is given: find one from its triangle first.",
            picture: circlePic({
              on: { A: 230, B: 330, C: 60, D: 110 },
              lines: ["CA", "CB", "DA", "DB", "AB"],
              angles: [
                ["DAB", "70°"],
                ["ABD", "60°"],
                ["ACB", "?"],
              ],
            }),
          },
        ),
      ],
      "Find the equal pair, then use whatever else you know.",
      { text: "Angles ACB and ADB stand on arc AB on the same side, so they're equal." },
    ),
    typed("Your turn", "Angle ADB = 33°. Find angle ACB.", "33", "Same segment.", "33°.", {
      unit: "°",
      picture: bowtie(33, ["?", "33°"], { turn: 300 }),
    }),
    typed(
      "Your turn",
      "Angle ACB = 5x − 10° and angle ADB = 3x + 20°. Find x.",
      "15",
      "Equal: 5x − 10 = 3x + 20.",
      "x = 15.",
      {
        picture: bowtie(65, ["5x − 10°", "3x + 20°"]),
      },
    ),
    choose(
      "Watch out",
      "Raj says angles ACB and ADB are equal. D is on the other side of AB. Is he right?",
      "No: they're in different segments",
      "Angles on opposite sides of a chord add to 180° instead.",
      [["Yes: they stand on the same arc", "They must be on the same side as well."]],
      { picture: bowtie(40, ["40°", "?"], { dOpposite: true }) },
    ),
    mistake(
      "Kim finds angle ADB. Angle ACB = 46°.",
      [
        "ACB and ADB stand on arc AB.",
        "The angle at the circumference is half the angle at the centre.",
        "So ADB = 23°",
      ],
      2,
      "Both are at the circumference, on the same side: they're equal. ADB = 46°.",
      bowtie(46, ["46°", "?"]),
    ),
    choose(
      "Back to the problem",
      "“Angle ACB = 48°. Find angle ADB. Give a reason.”",
      "48°, because angles in the same segment are equal",
      "Same arc, same side.",
      [
        [
          "96°, because the angle at the centre is twice the angle at the circumference",
          "Neither angle is at the centre.",
        ],
        ["24°, because it's half", "Both are at the circumference: equal."],
      ],
      { picture: bowtie(48, ["48°", "?"]) },
    ),
    quiz([
      [
        [
          "Same segment: angle ACB = 57°. Angle ADB?",
          "57°",
          ["114°", "28.5°"],
          "Equal.",
          undefined,
          "angle at D",
        ],
        [
          "Same segment: angle ACB = 38°. Angle ADB?",
          "38°",
          ["76°", "19°"],
          "Equal.",
          undefined,
          "angle at D",
        ],
      ],
      [
        [
          "Same segment: angle ADB = 2x, angle ACB = 64°. x?",
          "32°",
          ["64°", "128°"],
          "2x = 64.",
          undefined,
          "angle at C",
        ],
        [
          "Same segment: angle ADB = 3x, angle ACB = 72°. x?",
          "24°",
          ["72°", "36°"],
          "3x = 72.",
          undefined,
          "angle at C",
        ],
      ],
      [
        ["Angles in the same segment are", "equal", ["supplementary", "doubled"], "The theorem."],
        [
          "For the theorem, C and D must be",
          "on the same side of AB",
          ["on opposite sides of AB", "at the centre"],
          "Same segment.",
        ],
      ],
    ]),
  ],
);
sameSegment.method = sameSegmentMethod;
sameSegment.variation = {
  relationship: "angles standing on the same arc, in the same segment, are equal",
  unknowns: ["angle at C", "angle at D", "third angle"],
  surface: ["numbers", "turned diagram", "where D sits", "algebra", "other segment"],
  nonExamples: ["angles on opposite sides of the chord"],
};

// ---------------------------------------------------------------------------------------------
// 4. Cyclic quadrilaterals.

const cyclicRel = (one: string, two: string, asks?: number) =>
  relation(
    [
      ["one angle", one],
      ["the opposite angle", two],
      ["together", "180°"],
    ],
    ["+", "="],
    asks,
  );

const cyclicMethod = [
  "Check all four corners are on the circle.",
  "Find the angle opposite the one you know.",
  "Opposite angles add to 180°: take it from 180°.",
  "Give the reason: opposite angles of a cyclic quadrilateral add to 180°.",
];

const cyclicLesson = lesson(
  U,
  "cyclic",
  SKILL,
  "Cyclic quadrilaterals",
  "Opposite angles of a quadrilateral with every corner on a circle add to 180°.",
  [
    problem(
      "Four corners on a circle",
      [
        "“ABCD is a cyclic quadrilateral. Angle DAB = 70° and angle ABC = 95°. Find angles BCD and CDA. Give reasons.”",
        "By the end of this lesson, you can find both in a line each.",
      ],
      cyclic(70, 95, { A: "70°", B: "95°", C: "?", D: "?" }),
    ),
    typed("Warm-up", "The angles of a quadrilateral add up to", "360", "Two triangles.", "360°.", {
      unit: "°",
    }),
    typed("Warm-up", "$180° - 70°$", "110", "Subtract.", "110°.", { unit: "°" }),
    explain(
      "Discover",
      "Opposite angles share a circle",
      [
        "Angle A stands on the arc BCD; angle C stands on the arc BAD. The two arcs make the whole circle, so the angles at the centre on them add to 360°.",
        "Each angle at the circumference is half of its angle at the centre, so **opposite angles add to 180°**. A quadrilateral with every corner on the circle is called **cyclic**.",
      ],
      cyclic(70, 95, { A: "x", C: "180° − x" }),
    ),
    choose(
      "Discover",
      "Angle DAB = 70°. Angle BCD is",
      "110°",
      "Opposite angles add to 180°.",
      [
        ["70°", "Opposite angles add to 180°; they're only equal when both are 90°."],
        ["290°", "That's 360° − 70°, the reflex angle."],
      ],
      { picture: cyclic(70, 95, { A: "70°", C: "?" }) },
    ),
    methodCard("The method", cyclicMethod, cyclic(70, 95, { A: "x", C: "180° − x" })),
    pair(
      "Opposite, then subtract",
      {
        problem: "ABCD is cyclic. Angle ABC = 100°. Find angle CDA.",
        picture: cyclic(80, 100, { B: "100°", D: "?" }),
        lines: [
          ["CDA is opposite ABC.", "B and D are opposite corners."],
          ["CDA = 180° − 100° = 80°", "Opposite angles of a cyclic quadrilateral add to 180°."],
        ],
      },
      ask("ABCD is cyclic. Angle ABC = 85°. Find angle CDA.", "95", "Take 85° from 180°.", "95°.", {
        unit: "°",
        asks: "opposite angle",
        picture: cyclic(80, 85, { B: "85°", D: "?" }),
      }),
      "Opposite corners always share 180°.",
    ),
    fade(
      "Finish it",
      "ABCD is cyclic. Angle BCD = 2x and angle DAB = x. Find x.",
      ["BCD and DAB are opposite, so they add to 180°."],
      [
        [
          "So",
          "$x + 2x = 180°$",
          ["$x = 2x$", "They add to 180°; they aren't equal."],
          "$3x = 180°$",
        ],
        ["And x is", "60°", ["90°", "180° ÷ 3."], "$x = 60°$"],
      ],
      "Write the pair adding to 180°, then solve.",
      cyclic(60, 90, { A: "x", C: "2x" }),
    ),
    questionSet(
      "Same method, different look",
      "ABCD is cyclic each time. Watch what changes.",
      [
        ask("Angle DAB = 75°. Find angle BCD.", "105", "180° − 75°.", "105°.", {
          unit: "°",
          asks: "opposite angle",
          picture: cyclic(75, 95, { A: "75°", C: "?" }),
        }),
        ask("Angle DAB = 85°. Find angle BCD.", "95", "180° − 85°.", "95°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "Angle DAB went up by 10°.",
          expect: [
            "So angle BCD…",
            "goes down by 10°",
            "Opposite angles share 180°.",
            [
              ["goes up by 10°", "They must still add to 180°."],
              ["stays the same", "They must still add to 180°."],
            ],
          ],
          picture: cyclic(85, 95, { A: "85°", C: "?" }),
        }),
        ask(
          "Angle ABC = 85°. Find angle CDA.",
          "95",
          "B and D are the other opposite pair.",
          "95°.",
          {
            unit: "°",
            asks: "opposite angle",
            changed: "Now it's the other pair of corners, B and D.",
            picture: cyclic(85, 85, { B: "85°", D: "?" }),
          },
        ),
        ask(
          "Angle DAB = 85°. Find angle BCD.",
          "95",
          "Still opposite: 180° − 85°.",
          "95°: the shape has a different look, but A and C are still opposite.",
          {
            unit: "°",
            asks: "opposite angle",
            changed: "The quadrilateral is long and thin, and turned.",
            picture: cyclic(85, 50, { A: "85°", C: "?" }, 120),
          },
        ),
        ask(
          "Quadrilateral OBCD has its corner O at the centre. Do its opposite angles add to 180°?",
          "No",
          "The rule needs all four corners on the circle.",
          "No: O isn't on the circle, so OBCD isn't cyclic.",
          {
            changed: "One corner is at the centre, not on the circle.",
            others: ["Yes"],
            picture: circlePic({
              centre: true,
              on: { B: 300, C: 30, D: 110 },
              lines: ["OB", "BC", "CD", "DO"],
              angles: [
                ["DOB", "?"],
                ["BCD", "?"],
              ],
            }),
          },
        ),
      ],
      "Opposite and on the circle: add to 180°. A corner off the circle: no rule.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("One angle is 112°. Find the angle opposite.", "68", "180° − 112°.", "68°.", {
          unit: "°",
          asks: "opposite angle",
          picture: cyclicRel("112°", "?", 1),
        }),
        ask("The angle opposite is 47°. Find the angle.", "133", "180° − 47°.", "133°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "The other box is missing now.",
          picture: cyclicRel("?", "47°", 0),
        }),
        ask(
          "Opposite angles are 3x and x + 20°. Find x.",
          "40",
          "3x + x + 20 = 180.",
          "4x = 160, so x = 40.",
          {
            asks: "x",
            changed: "Both angles are in algebra.",
            picture: cyclicRel("$3x$", "$x + 20°$"),
          },
        ),
        ask(
          "Opposite angles are 2x + 10° and 3x − 5°. Find x.",
          "35",
          "2x + 10 + 3x − 5 = 180.",
          "5x + 5 = 180, so x = 35.",
          {
            asks: "x",
            picture: cyclicRel("$2x + 10°$", "$3x - 5°$"),
          },
        ),
      ],
      "One angle known: subtract. Both in algebra: add them, make 180°, solve.",
      { text: "Opposite angles of a cyclic quadrilateral add to 180°." },
    ),
    typed(
      "Your turn",
      "ABCD is cyclic. Angle BCD = 124°. Find angle DAB.",
      "56",
      "180° − 124°.",
      "56°.",
      {
        unit: "°",
        picture: cyclic(56, 100, { A: "?", C: "124°" }, 200),
      },
    ),
    typed(
      "Your turn",
      "ABCD is cyclic. Angle ABC = 5x and angle CDA = 4x. Find x.",
      "20",
      "5x + 4x = 180.",
      "x = 20.",
      {
        picture: cyclic(70, 100, { B: "5x", D: "4x" }),
      },
    ),
    choose(
      "Watch out",
      "Ivy says angles A and B of cyclic quadrilateral ABCD add to 180°. What's wrong?",
      "A and B are next to each other; the rule is for opposite angles",
      "Opposite corners: A with C, B with D.",
      [["Nothing: any two angles add to 180°", "Only opposite ones do."]],
      { picture: cyclic(70, 95, { A: "70°", B: "95°" }) },
    ),
    mistake(
      "Ben finds angle BCD. ABCD is cyclic and angle DAB = 64°.",
      ["BCD is opposite DAB.", "Opposite angles are equal.", "BCD = 64°"],
      1,
      "Opposite angles of a cyclic quadrilateral add to 180°: BCD = 116°.",
      cyclic(64, 95, { A: "64°", C: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Angle DAB = 70° and angle ABC = 95°. Find angles BCD and CDA.”",
      "BCD = 110° and CDA = 85°",
      "Each is 180° minus its opposite angle.",
      [
        ["BCD = 95° and CDA = 70°", "Use the opposite angles, not the neighbours."],
        ["BCD = 110° and CDA = 95°", "CDA is opposite ABC: 180° − 95°."],
      ],
      { picture: cyclic(70, 95, { A: "70°", B: "95°", C: "?", D: "?" }) },
    ),
    quiz([
      [
        [
          "Cyclic ABCD: angle DAB = 58°. Angle BCD?",
          "122°",
          ["58°", "302°"],
          "180° − 58°.",
          undefined,
          "opposite angle",
        ],
        [
          "Cyclic ABCD: angle ABC = 103°. Angle CDA?",
          "77°",
          ["103°", "257°"],
          "180° − 103°.",
          undefined,
          "opposite angle",
        ],
      ],
      [
        [
          "Cyclic: opposite angles 2x and 7x. x?",
          "20°",
          ["36°", "90°"],
          "9x = 180.",
          undefined,
          "x",
        ],
        [
          "Cyclic: opposite angles x and 5x. x?",
          "30°",
          ["36°", "60°"],
          "6x = 180.",
          undefined,
          "x",
        ],
      ],
      [
        [
          "In a cyclic quadrilateral, opposite angles",
          "add to 180°",
          ["are equal", "add to 360°"],
          "The theorem.",
        ],
        [
          "A quadrilateral is cyclic when",
          "all four corners are on a circle",
          ["one corner is at the centre", "its sides are equal"],
          "Cyclic.",
        ],
      ],
    ]),
  ],
);
cyclicLesson.method = cyclicMethod;
cyclicLesson.variation = {
  relationship: "opposite angles of a cyclic quadrilateral add to 180°",
  unknowns: ["opposite angle", "x"],
  surface: ["numbers", "the other pair", "shape and turn", "algebra", "corner off the circle"],
  nonExamples: ["a quadrilateral with a corner at the centre", "neighbouring angles"],
};

// ---------------------------------------------------------------------------------------------
// 5. Tangents and radii.

const kiteRel = (o: string, p: string, asks?: number) =>
  relation(
    [
      ["angle at O", o],
      ["angle at P", p],
      ["together", "180°"],
    ],
    ["+", "="],
    asks,
  );

const tangentsMethod = [
  "Mark a right angle wherever a radius meets a tangent.",
  "Two tangents from one point are equal: the shape is a kite, or two matching triangles.",
  "Use the angles of a quadrilateral (360°) or a triangle (180°).",
  "Give each reason in words.",
];

const tangentsLesson = lesson(
  U,
  "tangents",
  SKILL,
  "Tangents and radii",
  "A tangent meets the radius at 90°, and two tangents from a point are equal.",
  [
    problem(
      "Two tangents",
      [
        "“PA and PB are tangents to the circle, centre O. Angle APB = 50°. Find angle AOB. Give reasons.”",
        "By the end of this lesson, you'll find the two right angles hiding in the picture.",
      ],
      kite(50, { P: "50°", O: "?" }),
    ),
    typed("Warm-up", "The angles of a quadrilateral add up to", "360", "Two triangles.", "360°.", {
      unit: "°",
    }),
    choose(
      "Warm-up",
      "A tangent",
      "touches the circle at one point",
      "It just touches, without crossing.",
      [
        ["cuts the circle twice", "That's a chord, carried on."],
        ["goes through the centre", "That's a diameter."],
      ],
    ),
    explain(
      "Discover",
      "Two facts about tangents",
      [
        "A tangent meets the radius at the point it touches at **90°**.",
        "Two tangents from the same point P are **equal in length**: PA = PB. So OAPB is a kite, with right angles at A and B. Its angles add to 360°, so **angle O + angle P = 180°**.",
      ],
      kite(50, { A: "90°", B: "90°" }),
    ),
    choose(
      "Discover",
      "Angle APB = 50°. Angle AOB is",
      "130°",
      "360° − 90° − 90° − 50°.",
      [
        ["50°", "They're opposite corners of the kite, not equal."],
        ["40°", "The two right angles and these two make 360°."],
      ],
      { picture: kite(50, { P: "50°", O: "?" }) },
    ),
    methodCard("The method", tangentsMethod, kite(50, { A: "90°", B: "90°" })),
    pair(
      "The kite",
      {
        problem: "PA and PB are tangents. Angle APB = 40°. Find angle AOB.",
        picture: kite(40, { P: "40°", O: "?" }),
        lines: [
          ["OAP = OBP = 90°", "A tangent meets a radius at 90°."],
          ["AOB = 360° − 90° − 90° − 40° = 140°", "The angles of a quadrilateral add to 360°."],
        ],
      },
      ask(
        "PA and PB are tangents. Angle APB = 70°. Find angle AOB.",
        "110",
        "Two right angles and 70°, from 360°.",
        "110°.",
        {
          unit: "°",
          asks: "angle at O",
          picture: kite(70, { P: "70°", O: "?" }),
        },
      ),
      "Angle O and angle P always share 180°.",
    ),
    fade(
      "Finish it",
      "PA and PB are tangents. Angle AOB = 124°. Find angle APB.",
      ["OAP = OBP = 90° (a tangent meets a radius at 90°)."],
      [
        [
          "So angle APB is",
          "$360° - 90° - 90° - 124° = 56°$",
          ["$180° - 124° - 90°$", "It's a quadrilateral: 360°."],
          "Angle APB = 56°",
        ],
      ],
      "Or straight away: 180° − 124°.",
      kite(56, { O: "124°", P: "?" }),
    ),
    questionSet(
      "Same method, different look",
      "PA and PB are tangents each time. Watch what changes.",
      [
        ask("Angle APB = 60°. Find angle AOB.", "120", "180° − 60°.", "120°.", {
          unit: "°",
          asks: "angle at O",
          picture: kite(60, { P: "60°", O: "?" }),
        }),
        ask("Angle APB = 80°. Find angle AOB.", "100", "180° − 80°.", "100°.", {
          unit: "°",
          asks: "angle at O",
          changed: "Angle APB went up by 20°.",
          expect: [
            "So angle AOB…",
            "goes down by 20°",
            "They share 180°.",
            [
              ["goes up by 20°", "Angle O and angle P add to 180°."],
              ["stays the same", "Angle O and angle P add to 180°."],
            ],
          ],
          picture: kite(80, { P: "80°", O: "?" }),
        }),
        ask(
          "Angle APB = 80°. Find angle AOB.",
          "100",
          "Still 180° − 80°.",
          "100°: the kite is only turned.",
          {
            unit: "°",
            asks: "angle at O",
            changed: "P is above the circle now.",
            picture: kite(80, { P: "80°", O: "?" }, 90),
          },
        ),
        ask(
          "Angle APB = 80°. Find angle OPA.",
          "40",
          "OP cuts the kite into two matching halves.",
          "40°: half of 80°, as the kite is symmetrical.",
          {
            unit: "°",
            changed: "Now it's half of the angle at P.",
            picture: circlePic({
              r: 2.4,
              centre: true,
              on: { A: 50, B: -50 },
              off: { P: P(2.4 / Math.cos((50 * Math.PI) / 180), 0) },
              lines: ["OA", "OB", "PA", "PB"],
              dashed: ["OP"],
              angles: [
                ["APB", "80°"],
                ["OPA", "?"],
              ],
            }),
          },
        ),
        ask(
          "Radius OA = 5 cm and OP = 13 cm. Find the tangent PA.",
          "12",
          "Triangle OAP has a right angle at A: Pythagoras.",
          "12 cm: $13^2 - 5^2 = 144$.",
          {
            unit: "cm",
            asks: "length",
            changed: "Now a length, not an angle.",
            expect: [
              "The right angle at A means you can use…",
              "Pythagoras",
              "A right-angled triangle with two sides known.",
              [["the angle at the centre", "It's a length: use the right angle."]],
            ],
            picture: kite(45, { A: "90°" }),
          },
        ),
      ],
      "Right angles where radius meets tangent; the rest is triangles and quadrilaterals.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Angle AOB = 150°. Find angle APB.", "30", "180° − 150°.", "30°.", {
          unit: "°",
          asks: "angle at P",
          picture: kiteRel("150°", "?", 1),
        }),
        ask("Angle APB = 36°. Find angle AOB.", "144", "180° − 36°.", "144°.", {
          unit: "°",
          asks: "angle at O",
          changed: "Now the angle at O is missing.",
          picture: kiteRel("?", "36°", 0),
        }),
        ask("PA = 9 cm. Find PB.", "9", "Tangents from one point are equal.", "9 cm.", {
          unit: "cm",
          asks: "length",
          changed: "Now a length is missing.",
          picture: kite(60, { P: "60°" }),
        }),
        ask("Angle APB = x and angle AOB = 2x. Find x.", "60", "x + 2x = 180.", "x = 60.", {
          asks: "angle at P",
          changed: "Both angles are in algebra.",
          picture: kiteRel("$2x$", "$x$"),
        }),
      ],
      "Angle, angle or length: the right angles and equal tangents do the work.",
      { text: "In the kite OAPB, the angles at O and P add to 180°, and PA = PB." },
    ),
    typed(
      "Your turn",
      "PA and PB are tangents. Angle AOB = 98°. Find angle APB.",
      "82",
      "180° − 98°.",
      "82°.",
      {
        unit: "°",
        picture: kite(82, { O: "98°", P: "?" }, 200),
      },
    ),
    typed(
      "Your turn",
      "Radius 8 cm, tangent PA = 15 cm. Find OP.",
      "17",
      "Pythagoras: $8^2 + 15^2$.",
      "17 cm.",
      {
        unit: "cm",
      },
    ),
    choose(
      "Watch out",
      "Ola says angle OAP is 90° because OA is a radius. What else must be true?",
      "PA must be a tangent at A",
      "The right angle is between a tangent and a radius.",
      [["Nothing: every radius makes 90°", "Only with a tangent at that point."]],
    ),
    mistake(
      "Kim finds angle AOB. PA and PB are tangents, and angle APB = 64°.",
      ["OAP = OBP = 90°", "AOB = 180° − 64° − 90°", "AOB = 26°"],
      1,
      "OAPB is a quadrilateral: 360° − 90° − 90° − 64° = 116°.",
      kite(64, { P: "64°", O: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Angle APB = 50°. Find angle AOB. Give reasons.”",
      "130°: a tangent meets a radius at 90°, and the angles of a quadrilateral add to 360°",
      "Both reasons, and the angle.",
      [
        ["130°: angles in a triangle add to 180°", "OAPB is a quadrilateral."],
        ["50°: opposite angles are equal", "That's not a rule for kites."],
      ],
      { picture: kite(50, { P: "50°", O: "?" }) },
    ),
    quiz([
      [
        [
          "Tangents PA, PB: angle APB = 48°. Angle AOB?",
          "132°",
          ["48°", "42°"],
          "180° − 48°.",
          undefined,
          "angle at O",
        ],
        [
          "Tangents PA, PB: angle APB = 66°. Angle AOB?",
          "114°",
          ["66°", "24°"],
          "180° − 66°.",
          undefined,
          "angle at O",
        ],
      ],
      [
        [
          "Tangents PA, PB: angle AOB = 140°. Angle APB?",
          "40°",
          ["140°", "50°"],
          "180° − 140°.",
          undefined,
          "angle at P",
        ],
        [
          "Tangents PA, PB: angle AOB = 110°. Angle APB?",
          "70°",
          ["110°", "20°"],
          "180° − 110°.",
          undefined,
          "angle at P",
        ],
      ],
      [
        [
          "Radius 6 cm, OP = 10 cm. Tangent PA?",
          "8 cm",
          ["16 cm", "4 cm"],
          "Pythagoras: $100 - 36 = 64$.",
          undefined,
          "length",
        ],
        [
          "Radius 7 cm, OP = 25 cm. Tangent PA?",
          "24 cm",
          ["18 cm", "32 cm"],
          "Pythagoras: $625 - 49 = 576$.",
          undefined,
          "length",
        ],
      ],
    ]),
  ],
);
tangentsLesson.method = tangentsMethod;
tangentsLesson.variation = {
  relationship: "in kite OAPB, the right angles at A and B leave angle O + angle P = 180°; PA = PB",
  unknowns: ["angle at O", "angle at P", "length"],
  surface: ["numbers", "turned diagram", "half the kite", "a length", "algebra"],
  nonExamples: ["a radius to a point with no tangent"],
};

// ---------------------------------------------------------------------------------------------
// 6. The alternate segment theorem.

const altRel = (tangent: string, segment: string, asks: number) =>
  relation(
    [
      ["tangent and chord", tangent],
      ["in the other segment", segment],
    ],
    ["="],
    asks,
  );

const alternateMethod = [
  "Find the tangent and the point T where it touches.",
  "Pick the chord from T, and the angle between it and the tangent.",
  "Look across the chord: the angle at the circumference on the far side, standing on the same chord.",
  "They're equal. Reason: the alternate segment theorem.",
];

const alternateLesson = lesson(
  U,
  "alternate-segment",
  SKILL,
  "The alternate segment",
  "The angle between a tangent and a chord equals the angle in the other segment.",
  [
    problem(
      "Tangent and chord",
      [
        "“RS is a tangent to the circle at T. Angle STA = 55°. Find angle TBA. Give a reason.”",
        "This is the hardest circle theorem to spot. By the end of this lesson, you'll know what to look for.",
      ],
      alternate(55, { tangent: "55°", B: "?" }),
    ),
    typed("Warm-up", "Angles on a straight line add up to", "180", "Half a turn.", "180°.", {
      unit: "°",
    }),
    choose("Warm-up", "Angles in the same segment are", "equal", "The earlier theorem.", [
      ["supplementary", "That's opposite angles in a cyclic quadrilateral."],
      ["double", "That's the centre and the circumference."],
    ]),
    explain(
      "Discover",
      "Look across the chord",
      [
        "The chord TA cuts the circle into two segments. The angle between the tangent and the chord sits in one; B is in the other, the **alternate** segment.",
        "**The angle between a tangent and a chord equals the angle in the alternate segment.** Here, angle STA = angle TBA.",
      ],
      alternate(55, { tangent: "x", B: "x" }),
    ),
    choose(
      "Discover",
      "Angle STA = 55°. Angle TBA is",
      "55°",
      "The angle in the alternate segment.",
      [
        ["35°", "They're equal, not adding to 90°."],
        ["125°", "That's the angle on the other side of T."],
      ],
      { picture: alternate(55, { tangent: "55°", B: "?" }) },
    ),
    methodCard("The method", alternateMethod, alternate(55, { tangent: "x", B: "x" })),
    pair(
      "Across the chord",
      {
        problem: "RS is a tangent at T. Angle STA = 62°. Find angle TBA.",
        picture: alternate(62, { tangent: "62°", B: "?" }),
        lines: [
          ["Chord TA, tangent TS: the angle between them is 62°.", "Tangent and chord meet at T."],
          ["TBA = 62°", "The alternate segment theorem."],
        ],
      },
      ask(
        "RS is a tangent at T. Angle STA = 48°. Find angle TBA.",
        "48",
        "The angle in the alternate segment equals the tangent–chord angle.",
        "48°.",
        {
          unit: "°",
          asks: "segment angle",
          picture: alternate(48, { tangent: "48°", B: "?" }),
        },
      ),
      "Tangent–chord angle = angle across the chord.",
    ),
    fade(
      "The other way round",
      "RS is a tangent at T. Angle TBA = 50°. Find angle STA.",
      ["Angle TBA stands on chord TA, in the segment away from S."],
      [
        [
          "So angle STA is",
          "50°",
          ["130°", "Equal, by the alternate segment theorem."],
          "Angle STA = 50°",
        ],
      ],
      "It works in both directions.",
      alternate(50, { tangent: "?", B: "50°" }),
    ),
    questionSet(
      "Same method, different look",
      "RS is a tangent at T each time. Watch what changes.",
      [
        ask("Angle STA = 40°. Find angle TBA.", "40", "Alternate segment.", "40°.", {
          unit: "°",
          asks: "segment angle",
          picture: alternate(40, { tangent: "40°", B: "?" }),
        }),
        ask(
          "Angle STA = 40°. Find angle TBA.",
          "40",
          "B is still in the alternate segment.",
          "40°: anywhere on that arc, by the same-segment theorem.",
          {
            unit: "°",
            asks: "segment angle",
            changed: "B has moved along its arc.",
            expect: [
              "B has moved. Angle TBA…",
              "stays 40°",
              "Angles in the same segment are equal.",
              [["changes", "B is still in the alternate segment."]],
            ],
            picture: alternate(40, { tangent: "40°", B: "?" }, 100),
          },
        ),
        ask("Angle STA = 70°. Find angle TBA.", "70", "Alternate segment.", "70°.", {
          unit: "°",
          asks: "segment angle",
          changed: "The chord TA is steeper: angle STA is 70°.",
          picture: alternate(70, { tangent: "70°", B: "?" }),
        }),
        ask(
          "Angle STA = 55° and angle BAT = 60°. Find angle ATB.",
          "65",
          "Angle TBA = 55° by the alternate segment theorem; then use the triangle.",
          "65°: 180° − 55° − 60°.",
          {
            unit: "°",
            changed: "Now the theorem is one step in a longer problem.",
            picture: alternate(55, { tangent: "55°", A: "60°", T: "?" }, 150),
          },
        ),
        ask(
          "The angle between the tangent and chord TA is 70°. C is on the same side of TA as S. Is angle TCA 70°?",
          "No",
          "The equal angle is across the chord, in the alternate segment.",
          "No: C is on the wrong side of TA. The angle there is 180° − 70° = 110°.",
          {
            changed: "The point is on the same side as the tangent angle.",
            others: ["Yes"],
            picture: circlePic({
              on: { T: 270, A: 50, C: 340 },
              lines: ["TA", "TC", "CA"],
              tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
              angles: [
                ["STA", "70°"],
                ["TCA", "?"],
              ],
            }),
          },
        ),
      ],
      "Always look across the chord, into the other segment.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask(
          "The tangent–chord angle is 66°. Find the angle in the alternate segment.",
          "66",
          "Equal.",
          "66°.",
          {
            unit: "°",
            asks: "segment angle",
            picture: altRel("66°", "?", 1),
          },
        ),
        ask(
          "The angle in the alternate segment is 38°. Find the tangent–chord angle.",
          "38",
          "Equal.",
          "38°.",
          {
            unit: "°",
            asks: "tangent angle",
            changed: "Now the tangent–chord angle is missing.",
            picture: altRel("?", "38°", 0),
          },
        ),
        ask(
          "The tangent–chord angle is 4x and the angle in the alternate segment is 72°. Find x.",
          "18",
          "4x = 72.",
          "x = 18.",
          {
            asks: "tangent angle",
            changed: "The tangent–chord angle is in algebra.",
            picture: altRel("?", "72°", 0),
          },
        ),
        ask(
          "Angle RTB = 58°, between the tangent and chord TB. Find angle TAB.",
          "58",
          "The other chord, TB: look across it.",
          "58°: angle RTB equals angle TAB in its alternate segment.",
          {
            unit: "°",
            asks: "segment angle",
            changed: "The other chord: TB, on the left.",
            picture: circlePic({
              on: { T: 270, A: 30, B: 154 },
              lines: ["TA", "TB", "AB"],
              tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
              angles: [
                ["BTR", "58°"],
                ["TAB", "?"],
              ],
            }),
          },
        ),
      ],
      "Each chord from T has its own pair of equal angles.",
      { text: "The tangent–chord angle equals the angle in the alternate segment." },
    ),
    typed(
      "Your turn",
      "RS is a tangent at T. Angle TBA = 63°. Find angle STA.",
      "63",
      "Alternate segment.",
      "63°.",
      {
        unit: "°",
        picture: alternate(63, { tangent: "?", B: "63°" }),
      },
    ),
    typed(
      "Your turn",
      "RS is a tangent at T. Angle STA = 3x + 5° and angle TBA = 59°. Find x.",
      "18",
      "3x + 5 = 59.",
      "x = 18.",
      {
        picture: alternate(59, { tangent: "3x + 5°", B: "59°" }),
      },
    ),
    choose(
      "Watch out",
      "Ben matches the tangent–chord angle with an angle on the same side of the chord. What's wrong?",
      "The equal angle is across the chord, in the other segment",
      "Alternate means the other side.",
      [["Nothing: any angle on the chord matches", "Only the one in the alternate segment."]],
    ),
    mistake(
      "Zoe finds angle TBA. RS is a tangent at T, and angle STA = 52°.",
      ["The tangent meets the radius at 90°.", "So TBA = 90° − 52°", "TBA = 38°"],
      1,
      "There's no radius here. By the alternate segment theorem, TBA = 52°.",
      alternate(52, { tangent: "52°", B: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Angle STA = 55°. Find angle TBA. Give a reason.”",
      "55°: the angle between a tangent and a chord equals the angle in the alternate segment",
      "The full theorem as the reason.",
      [
        ["35°: a tangent meets a radius at 90°", "TA isn't a radius."],
        [
          "55°: angles in the same segment are equal",
          "Right number; give the alternate segment theorem.",
        ],
      ],
      { picture: alternate(55, { tangent: "55°", B: "?" }) },
    ),
    quiz([
      [
        [
          "Tangent–chord angle 47°. Angle in the alternate segment?",
          "47°",
          ["43°", "133°"],
          "Equal.",
          undefined,
          "segment angle",
        ],
        [
          "Tangent–chord angle 71°. Angle in the alternate segment?",
          "71°",
          ["19°", "109°"],
          "Equal.",
          undefined,
          "segment angle",
        ],
      ],
      [
        [
          "Angle in the alternate segment 36°. Tangent–chord angle?",
          "36°",
          ["54°", "144°"],
          "Equal.",
          undefined,
          "tangent angle",
        ],
        [
          "Angle in the alternate segment 64°. Tangent–chord angle?",
          "64°",
          ["26°", "116°"],
          "Equal.",
          undefined,
          "tangent angle",
        ],
      ],
      [
        [
          "The equal angle is",
          "across the chord, in the other segment",
          ["on the same side as the tangent angle", "at the centre"],
          "Alternate.",
        ],
        [
          "The alternate segment theorem needs",
          "a tangent and a chord from the same point",
          ["two chords", "a radius and a chord"],
          "Tangent and chord.",
        ],
      ],
    ]),
  ],
);
alternateLesson.method = alternateMethod;
alternateLesson.variation = {
  relationship: "angle between tangent and chord = angle in the alternate segment",
  unknowns: ["tangent angle", "segment angle"],
  surface: ["numbers", "where B sits", "steeper chord", "the other chord", "algebra", "same side"],
  nonExamples: ["an angle on the same side of the chord as the tangent angle"],
};

/** The circle theorems lesson, as six. */
export const circleTheorems: UnitLesson[] = [
  angleAtCentre,
  semicircleLesson,
  sameSegment,
  cyclicLesson,
  tangentsLesson,
  alternateLesson,
];
