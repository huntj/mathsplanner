// GCSE Higher, circle theorems (GH-G10), redrafted with variation and diagrams first: six lessons
// in place of one, each with one theorem and its method. Every question is asked on a diagram,
// with the given angles marked on it and only what to find in words, as in an exam. Each lesson
// opens with an Explore (drag a point and watch the angles), shows its example beside a question
// like it, fades a second example, then changes one thing at a time (the numbers, the way the
// diagram is turned, where the point sits, algebra, a non-example), has a Tap question, and moves
// the "?" round the diagram. Diagrams are drawn from the numbers, so what a pupil sees is accurate.
import {
  ask,
  calc,
  choose,
  explain,
  explore,
  fade,
  lesson,
  methodCard,
  mistake,
  pair,
  problem,
  questionSet,
  quiz,
  summary,
  tap,
  typed,
  worked,
} from "./build.ts";
import { circlePic, type CircleSpec } from "./circle-pictures.ts";
import { REASON } from "./reasons.ts";
import type { DrawingPic, Point, ShapePic, UnitLesson, Variation } from "./types.ts";
import { fan } from "./y7-angles.ts";

const U = "gh-circles";
const SKILL = "GH-G10";

// The reasons a pupil writes, worded the same wherever they appear.
const CENTRE = REASON.centre;
const SEMICIRCLE = REASON.semicircle;
const TRIANGLE = REASON.triangle;
const SAME_SEGMENT = REASON.sameSegment;
const CYCLIC = REASON.cyclic;
const TANGENT = REASON.tangent;
const QUADRILATERAL = REASON.quadrilateral;
const ALTERNATE = REASON.alternate;
const P = (x: number, y: number): Point => ({ x, y });
const rad = (d: number) => (d * Math.PI) / 180;

/** Extra spec for a diagram: tappable parts, side labels and so on. */
type More = Partial<Pick<CircleSpec, "tap" | "sides">>;

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
  more: More = {},
): DrawingPic {
  const q = Math.min(a, b);
  const p = 2 * a - q;
  const s = 2 * b - q;
  const B = turn;
  const C = B + p;
  const D = C + q;
  const A = D + s;
  const angles: [string, string][] = [];
  if (labels.A !== undefined) angles.push(["DAB", labels.A]);
  if (labels.B !== undefined) angles.push(["ABC", labels.B]);
  if (labels.C !== undefined) angles.push(["BCD", labels.C]);
  if (labels.D !== undefined) angles.push(["CDA", labels.D]);
  return circlePic({ on: { A, B, C, D }, lines: ["AB", "BC", "CD", "DA"], angles, ...more });
}

// Two tangents from P touch the circle at A and B; angle APB is `p`.
function kite(
  p: number,
  labels: { P?: string; O?: string; A?: string; B?: string },
  turn = 0,
  more: More = {},
): DrawingPic {
  const r = 2.4;
  const half = (180 - p) / 2;
  const d = r / Math.cos(rad(half));
  const angles: [string, string][] = [];
  if (labels.P !== undefined) angles.push(["APB", labels.P]);
  if (labels.O !== undefined) angles.push(["AOB", labels.O]);
  if (labels.A !== undefined) angles.push(["OAP", labels.A]);
  if (labels.B !== undefined) angles.push(["PBO", labels.B]);
  const lengths = (more.sides ?? []).some(([l]) => l === "OP");
  return circlePic({
    r,
    centre: true,
    on: { A: turn + half, B: turn - half },
    off: { P: P(d * Math.cos(rad(turn)), d * Math.sin(rad(turn))) },
    lines: ["OA", "OB", "PA", "PB"],
    ...(lengths ? { dashed: ["OP"] } : {}),
    angles,
    ...more,
  });
}

// The alternate segment: the tangent at T (at the bottom) and chord TA make angle x on the right;
// B is on the far arc, so angle TBA is x too. Angle BAT is (270 − b) ÷ 2.
function alternate(
  x: number,
  labels: { tangent?: string; B?: string; A?: string; T?: string },
  b = 150,
  more: More = {},
): DrawingPic {
  const angles: [string, string][] = [];
  if (labels.tangent !== undefined) angles.push(["STA", labels.tangent]);
  if (labels.B !== undefined) angles.push(["TBA", labels.B]);
  if (labels.A !== undefined) angles.push(["BAT", labels.A]);
  if (labels.T !== undefined) angles.push(["ATB", labels.T]);
  return circlePic({
    on: { T: 270, A: 270 + 2 * x, B: b },
    lines: ["TA", "TB", "AB"],
    tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
    angles,
    ...more,
  });
}

/** A right-angled triangle for a warm-up: angles at its corners. */
const rightTriangle = (labels: [string | null, string | null, string | null]): ShapePic => ({
  kind: "shape",
  points: [P(0, 0), P(6, 0), P(0, 4)],
  angles: labels,
  square: [0],
});

/** A tangent at T and one chord TA, with A at `a` degrees round the circle. */
const tangentChord = (a: number, angles: [string, string][]): DrawingPic =>
  circlePic({
    on: { T: 270, A: a },
    lines: ["TA"],
    tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
    angles,
  });

// ---------------------------------------------------------------------------------------------
// 1. The angle at the centre.

const centreMap: Variation = {
  relationship: "angle at the centre = 2 × angle at the circumference, on the same arc",
  unknowns: ["centre", "circumference"],
  surface: ["numbers", "turned diagram", "where C sits", "reflex angle", "algebra"],
  nonExamples: ["two angles that stand on different arcs"],
};
const centreMethod = [
  "Find two angles standing on the same arc.",
  "One is at the centre, one at the circumference.",
  "Centre angle = 2 × circumference angle.",
  "Write the angle, then the reason.",
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
        "“O is the centre of the circle. Find angle ACB. Give a reason.”",
        "Circle theorems are rules about the angles in a circle. This lesson is the first, and the others are built on it.",
      ],
      centre(130, ["130°", "?"]),
    ),
    tap(
      "Warm-up",
      "Tap both radii.",
      circlePic({
        centre: true,
        on: { A: 205, B: 335, C: 90 },
        lines: ["OA", "OB", "CA", "CB"],
        tap: true,
      }),
      ["OA", "OB"],
      "A radius joins the centre O to the circle.",
      "OA and OB: both go from the centre to the circle, so they're equal.",
      {
        wrong: {
          CA: "CA joins two points on the circle: it's a chord.",
          CB: "CB joins two points on the circle: it's a chord.",
        },
      },
    ),
    typed(
      "Warm-up",
      "Find the angle marked ?.",
      "120",
      "Angles at a point add up to 360°.",
      "120°.",
      {
        unit: "°",
        picture: fan([0, 130, 240], ["130°", "110°", "?"], "?"),
      },
    ),
    explore(
      "Move C round the circle",
      {
        kind: "geometry",
        circle: 3,
        points: [
          { name: "A", onCircle: 225 },
          { name: "B", onCircle: 315 },
          { name: "C", onCircle: 90, drag: [345, 195] },
        ],
        lines: ["OA", "OB", "CA", "CB"],
        angles: [{ name: "AOB" }, { name: "ACB" }],
        readouts: [
          { label: "Angle AOB", angle: "AOB" },
          { label: "Angle ACB", angle: "ACB" },
          { label: "ACB ÷ AOB", ratio: ["ACB", "AOB"] },
        ],
      },
      [
        "What did you notice?",
        "Angle ACB is always half of angle AOB",
        "The angle at the centre is twice the angle at the circumference.",
        [
          ["Angle ACB changes as C moves", "Look again: it stays at 45°."],
          ["Angle ACB equals angle AOB", "It's half: 45° against 90°."],
        ],
      ],
      "Wherever C is on the big arc, angle ACB is half of angle AOB.",
      {
        text: "Drag C round the circle. Watch the angles at O and at C.",
        expect: [
          "Before you drag: as C moves round the circle, angle ACB will…",
          "stay the same",
          "It's always half of angle AOB, wherever C is on the big arc.",
          [
            ["get bigger near A", "Try it and see."],
            ["get smaller near A", "Try it and see."],
          ],
        ],
      },
    ),
    explain(
      "Discover",
      "Why it's twice",
      [
        "**The angle at the centre is twice the angle at the circumference**, when both stand on the same arc.",
      ],
      centre(100, ["2x", "x"]),
      "OA, OB and OC are all radii, so both triangles are isosceles.",
    ),
    methodCard("The method", centreMethod, centre(100, ["2x", "x"])),
    pair(
      "Halve it",
      {
        problem: "Find angle ACB.",
        picture: centre(80, ["80°", "?"]),
        lines: [
          {
            line: "ACB = AOB ÷ 2",
            reason: CENTRE,
            note: "You need to state the angle and also give a reason why this is true.",
          },
          { line: "ACB = $80° \\div 2 = 40°$" },
        ],
      },
      ask("Find angle ACB.", "60", "Halve the angle at the centre.", "60°: half of 120°.", {
        unit: "°",
        asks: "circumference",
        picture: centre(120, ["120°", "?"]),
      }),
      "Same arc, so halve.",
    ),
    fade(
      "Now double it",
      "Find angle AOB. Give a reason.",
      [
        {
          line: "AOB = 2 × ACB",
          reason: CENTRE,
          note: "AOB is at the centre, so it's the bigger one.",
        },
      ],
      [
        [
          "So angle AOB is",
          "$2 \\times 35° = 70°$",
          ["$35° \\div 2 = 17.5°$", "The angle at the centre is the bigger one: double."],
          "AOB = 70°",
        ],
      ],
      "Double to go in to the centre. Halve to go out.",
      centre(70, ["?", "35°"]),
    ),
    questionSet(
      "Same method, different look",
      "Find angle ACB each time. Watch what changes.",
      [
        ask("Find angle ACB.", "50", "Halve the angle at O.", "50°.", {
          unit: "°",
          asks: "circumference",
          picture: centre(100, ["100°", "?"]),
        }),
        ask("Find angle ACB.", "70", "Halve the angle at O.", "70°.", {
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
          "Find angle ACB.",
          "70",
          "It's still half the angle at O.",
          "Still 70°: turning a diagram changes none of its angles.",
          {
            unit: "°",
            asks: "circumference",
            changed: "The whole diagram is turned.",
            picture: centre(140, ["140°", "?"], { turn: 180 }),
          },
        ),
        ask(
          "Find angle ACB.",
          "70",
          "C is still on the major arc: halve the angle at O.",
          "70°: every point on the major arc sees AB at the same angle.",
          {
            unit: "°",
            asks: "circumference",
            changed: "C has moved round the major arc.",
            picture: centre(140, ["140°", "?"], { c: 140 }),
          },
        ),
        ask(
          "Find angle ACB.",
          "130",
          "C faces the reflex angle. Take the angle at O from 360°, then halve.",
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
                  "still half the angle marked at O",
                  "C now looks at AB from the other side: use the reflex angle.",
                ],
              ],
            ],
            picture: centre(100, ["100°", "?"], { c: 270 }),
          },
        ),
        ask(
          "AB is a diameter. Find angle ACB.",
          "90",
          "A, O and B make a straight line: 180° at O. Halve it.",
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
    tap(
      "Spot it",
      "Which angle stands on the same arc as angle AOB? Tap it.",
      circlePic({
        centre: true,
        on: { A: 230, B: 310, C: 95, D: 160, E: 25 },
        lines: ["OA", "OB", "CA", "CB", "DA", "DE"],
        angles: [
          ["AOB", "2x"],
          ["ACB", ""],
          ["ADE", ""],
        ],
        tap: true,
      }),
      "ACB",
      "Look for the angle whose arms end at A and B.",
      "Angle ACB: its arms end at A and B, so it stands on arc AB and is half of angle AOB.",
      {
        wrong: {
          ADE: "Its arms end at A and E: it stands on arc AE, not AB.",
          AOB: "That's the angle at the centre itself.",
        },
      },
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Find angle ACB.", "55", "Halve it.", "55°.", {
          unit: "°",
          asks: "circumference",
          picture: centre(110, ["110°", "?"]),
        }),
        ask("Find angle AOB.", "70", "The angle at the centre is double.", "70°.", {
          unit: "°",
          asks: "centre",
          changed: "Now the angle at the centre is missing.",
          picture: centre(70, ["?", "35°"], { turn: 200 }),
        }),
        ask("Find angle AOB.", "144", "Double the angle at C.", "144°.", {
          unit: "°",
          asks: "centre",
          changed: "New numbers, and the diagram turned the other way.",
          picture: centre(144, ["?", "72°"], { turn: 330 }),
        }),
        ask(
          "Find y.",
          "25",
          "Halve the angle at O to get angle ACB, then divide by 3.",
          "ACB = 75°, so 3y = 75 and y = 25.",
          {
            asks: "circumference",
            changed: "The angle at the circumference is written in algebra.",
            picture: centre(150, ["150°", "3y"]),
          },
        ),
      ],
      "First ask which angle is missing, then double or halve.",
      { text: "The angle at the centre is twice the angle at the circumference." },
    ),
    typed("Your turn", "Find angle AOB.", "94", "Double it.", "94°.", {
      unit: "°",
      picture: centre(94, ["?", "47°"], { turn: 200 }),
    }),
    typed("Your turn", "Find x.", "25", "Angle AOB is twice angle ACB, so 4x = 100.", "x = 25.", {
      picture: centre(100, ["4x", "50°"], { turn: 330 }),
    }),
    choose(
      "Watch out",
      "Ben says angle AOB is twice angle BDE. Is he right?",
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
      "Ola finds angle ACB. C is on the minor arc.",
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
      "“Find angle ACB. Give a reason.”",
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
          "Find angle ACB.",
          "75°",
          ["300°", "150°"],
          "Half of 150°.",
          centre(150, ["150°", "?"]),
          "circumference",
        ],
        [
          "Find angle ACB.",
          "48°",
          ["192°", "96°"],
          "Half of 96°.",
          centre(96, ["96°", "?"], { turn: 200 }),
          "circumference",
        ],
      ],
      [
        [
          "Find angle AOB.",
          "82°",
          ["20.5°", "41°"],
          "Double 41°.",
          centre(82, ["?", "41°"], { turn: 30 }),
          "centre",
        ],
        [
          "Find angle AOB.",
          "126°",
          ["31.5°", "63°"],
          "Double 63°.",
          centre(126, ["?", "63°"], { turn: 120 }),
          "centre",
        ],
      ],
      [
        ["Find x.", "24", ["12", "36"], "3x = 2(x + 12) = 2x + 24.", centre(72, ["3x", "x + 12°"])],
        [
          "Find x.",
          "20",
          ["10", "40"],
          "5x = 2(2x + 10) = 4x + 20.",
          centre(100, ["5x", "2x + 10°"], { turn: 300 }),
        ],
      ],
    ]),
  ],
);
angleAtCentre.method = centreMethod;
angleAtCentre.variation = centreMap;

// ---------------------------------------------------------------------------------------------
// 2. The angle in a semicircle: the stepped plan (docs/proposals/lesson-stepped.md), for weaker
// readers. The rule first, shown and dragged; a check of what it needs; the method shown, then
// done a line at a time; practice with the missing angle moving; new looks; and a summary to
// copy into an exercise book.

const semicircleMethod = [
  "Angle C is 90°: the angle in a semicircle.",
  "Add the two angles you know.",
  "Take the total away from 180°.",
];

/** A diameter AB with two triangles on it: C above, at 2 × `c`, and D below, at 180° + 2 × `d`. */
const twoTriangles = (c: number, d: number, labels: [string, string][]) =>
  circlePic({
    centre: true,
    on: { A: 180, B: 0, C: 2 * c, D: 180 + 2 * d },
    lines: ["AB", "CA", "CB", "DA", "DB"],
    angles: labels,
  });

const semicircleLesson = lesson(
  U,
  "semicircle",
  SKILL,
  "The angle in a semicircle",
  "An angle standing on a diameter is 90°.",
  [
    // 1. The rule, and an Explore that shows it.
    explain(
      "The rule",
      "The angle in a semicircle",
      ["**The angle in a semicircle is 90°.**"],
      semicircle(30, { A: "30°", B: "60°", C: "90°" }),
      "AB is a diameter. C can be anywhere on the circle.",
    ),
    explore(
      "Move C round the circle",
      {
        kind: "geometry",
        circle: 3,
        points: [
          { name: "A", onCircle: 180 },
          { name: "B", onCircle: 0 },
          { name: "C", onCircle: 60, drag: [45, 135] },
        ],
        lines: ["AB", "CA", "CB"],
        angles: [{ name: "ACB" }, { name: "CAB" }, { name: "ABC" }],
        readouts: [
          { label: "Angle C", angle: "ACB" },
          { label: "Angle A", angle: "CAB" },
          { label: "Angle B", angle: "ABC" },
        ],
      },
      [
        "What stays the same?",
        "Angle C is always 90°",
        "The angle in a semicircle is 90°. A and B share the other 90°.",
        [
          ["Angle A is always 90°", "Look again: angle A changes as C moves."],
          ["All three angles change", "Look again at angle C."],
        ],
      ],
      "Angle C is always 90°. Angles A and B add up to 90°.",
      { text: "Drag C. Watch all three angles.", tag: "The rule" },
    ),

    // 2. Check you remember: what the method needs.
    tap(
      "Check you remember",
      "Tap the diameter.",
      circlePic({
        centre: true,
        on: { A: 180, B: 0, C: 60, D: 250 },
        lines: ["AB", "CA", "CB", "DB"],
        tap: true,
      }),
      "AB",
      "A diameter goes through the centre O.",
      "AB: it goes through the centre.",
      {
        wrong: {
          CA: "CA doesn't go through O.",
          CB: "CB doesn't go through O.",
          DB: "DB doesn't go through O.",
        },
      },
    ),
    choose(
      "Check you remember",
      "The angles in a triangle add up to…",
      "180°",
      "Angles in a triangle add up to 180°.",
      [
        ["360°", "That's a full turn, or a quadrilateral."],
        ["90°", "That's one right angle."],
      ],
      {
        picture: {
          kind: "shape",
          points: [P(0, 0), P(6, 0), P(2, 4)],
          angles: ["a", "b", "c"],
        },
      },
    ),
    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "56",
      "The square is 90°. Angles in a triangle add up to 180°.",
      "56°: 180° − 90° − 34°.",
      { unit: "°", picture: rightTriangle([null, "34°", "?"]) },
    ),

    // 3. The method: shown, then done a line at a time.
    methodCard("The method", semicircleMethod, semicircle(34, { A: "34°", B: "?" })),
    worked(
      "Watch the method",
      "Find angle ABC.",
      [
        { line: "ACB = 90°", reason: SEMICIRCLE },
        { line: "$90° + 34° = 124°$", note: "Add the two angles you know." },
        {
          line: "ABC = $180° - 124° = 56°$",
          reason: TRIANGLE,
          note: "Take the total away from 180°.",
        },
      ],
      "Add, then take away from 180°.",
      semicircle(34, { A: "34°", B: "?" }),
    ),
    calc(
      "Your turn",
      "Find angle ABC.",
      semicircle(25, { A: "25°", B: "?", C: "90°" }),
      [
        ["$90° + 25° =$", "115", "Add the angles at C and A.", { after: "°" }],
        [
          "ABC = $180° - 115° =$",
          "65",
          "Take 115° away from 180°.",
          { after: "°", reason: TRIANGLE },
        ],
      ],
      "Angle ABC is 65°.",
    ),

    // 4. Practise, with the missing angle moving round.
    calc(
      "Practise",
      "Find angle ABC.",
      semicircle(40, { A: "40°", B: "?" }),
      [
        ["ACB =", "90", "The angle in a semicircle.", { after: "°", reason: SEMICIRCLE }],
        ["$90° + 40° =$", "130", "Add the two angles you know.", { after: "°" }],
        [
          "ABC = $180° - 130° =$",
          "50",
          "Take 130° away from 180°.",
          { after: "°", reason: TRIANGLE },
        ],
      ],
      "Angle ABC is 50°.",
    ),
    questionSet(
      "Practise",
      "Find the missing angle each time.",
      [
        ask("Find angle ABC.", "62", "Add the two you know. Take it from 180°.", "62°.", {
          unit: "°",
          asks: "angle at B",
          picture: semicircle(28, { A: "28°", B: "?" }),
        }),
        ask("Find angle ABC.", "40", "Add the two you know. Take it from 180°.", "40°.", {
          unit: "°",
          asks: "angle at B",
          changed: "The circle is turned.",
          picture: semicircle(50, { A: "50°", B: "?" }, { turn: 90 }),
        }),
        ask("Find angle CAB.", "43", "Add the two you know. Take it from 180°.", "43°.", {
          unit: "°",
          asks: "angle at A",
          changed: "Now the angle at A is missing.",
          picture: semicircle(43, { A: "?", B: "47°" }),
        }),
        ask("Find angle CAB.", "26", "Add the two you know. Take it from 180°.", "26°.", {
          unit: "°",
          asks: "angle at A",
          changed: "C is below the diameter.",
          picture: semicircle(26, { A: "?", B: "64°" }, { below: true }),
        }),
        ask("Find angle ACB.", "90", "It's the angle in a semicircle.", "90°.", {
          unit: "°",
          asks: "angle at C",
          changed: "Now the angle at C is missing.",
          picture: semicircle(35, { A: "35°", B: "55°", C: "?" }),
        }),
      ],
      "Same method, wherever the missing angle is.",
    ),

    // 5. Variation: algebra, and two triangles on one diameter.
    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find x.", "30", "Angles A and B add up to 90°: x + 2x = 90°.", "x = 30°.", {
          asks: "angle at A",
          picture: semicircle(30, { A: "x", B: "2x" }),
        }),
        ask("Find x.", "18", "Angles A and B add up to 90°: x + 4x = 90°.", "x = 18°.", {
          asks: "angle at A",
          changed: "Now the angles are x and 4x.",
          picture: semicircle(18, { A: "x", B: "4x" }, { turn: 200 }),
        }),
        ask("Find angle ABC.", "55", "Use triangle ABC. Angle C is 90°.", "55°.", {
          unit: "°",
          asks: "angle at B",
          changed: "Two triangles share the diameter.",
          picture: twoTriangles(35, 40, [
            ["CAB", "35°"],
            ["ABD", "40°"],
            ["ABC", "?"],
          ]),
        }),
        ask("Find angle DAB.", "50", "Use triangle ABD. Angle D is 90°.", "50°.", {
          unit: "°",
          asks: "angle at A",
          changed: "Now find an angle in the other triangle.",
          picture: twoTriangles(35, 40, [
            ["CAB", "35°"],
            ["ABD", "40°"],
            ["DAB", "?"],
          ]),
        }),
      ],
      "Both angles on the diameter are 90°.",
    ),

    // 6. Summary, and what to write in an exercise book.
    summary(
      "What to remember",
      ["**The angle in a semicircle is 90°.**"],
      semicircle(34, { A: "34°", B: "56°", C: "90°" }),
      [
        "**The angle in a semicircle is 90°.**",
        "Draw the circle, the diameter AB and the point C.",
        "To find a missing angle: add the two you know, take it from 180°.",
        "ACB = 90° (angle in a semicircle is 90°)",
        "ABC = 180° − 90° − 34° = 56° (angles in a triangle add up to 180°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
semicircleLesson.plan = "stepped";
semicircleLesson.method = semicircleMethod;
semicircleLesson.variation = {
  relationship:
    "the angle on a diameter is 90°, so the other two angles of the triangle add to 90°",
  unknowns: ["angle at A", "angle at B", "angle at C"],
  surface: ["numbers", "turned diagram", "where C sits", "algebra", "two triangles"],
};

// ---------------------------------------------------------------------------------------------
// 3. Angles in the same segment.

const sameSegmentMethod = [
  "Find two angles standing on the same chord.",
  "Check they're on the same side of it.",
  "Then the angles are equal.",
  "Write the angle, then the reason.",
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
        "“A, B, C and D are on the circle. Find angle ADB. Give a reason.”",
        "The two angles look different. By the end of this lesson, you'll see why they can't be.",
      ],
      bowtie(48, ["48°", "?"]),
    ),
    typed("Warm-up", "Find angle ACB.", "48", "Halve the angle at the centre.", "48°.", {
      unit: "°",
      picture: centre(96, ["96°", "?"]),
    }),
    tap(
      "Warm-up",
      "Tap the two angles that stand on chord AB.",
      circlePic({
        on: { A: 230, B: 310, C: 60, D: 120 },
        lines: ["CA", "CB", "DA", "DB"],
        angles: [
          ["ACB", ""],
          ["ADB", ""],
          ["CAD", ""],
          ["DBC", ""],
        ],
        tap: true,
      }),
      ["ACB", "ADB"],
      "Their arms must end at A and B.",
      "Angles ACB and ADB: both have arms ending at A and B.",
      {
        wrong: {
          CAD: "That's at A, with arms to C and D: it stands on chord CD.",
          DBC: "That's at B, with arms to D and C: it stands on chord CD.",
        },
      },
    ),
    explore(
      "Move D along the arc",
      {
        kind: "geometry",
        circle: 3,
        points: [
          { name: "A", onCircle: 230 },
          { name: "B", onCircle: 310 },
          { name: "C", onCircle: 110 },
          { name: "D", onCircle: 40, drag: [340, 200] },
        ],
        lines: ["CA", "CB", "DA", "DB"],
        angles: [{ name: "ACB" }, { name: "ADB" }],
        readouts: [
          { label: "Angle ACB", angle: "ACB" },
          { label: "Angle ADB", angle: "ADB" },
        ],
      },
      [
        "What did you notice?",
        "Angle ADB always equals angle ACB",
        "Both stand on arc AB from the same side: angles in the same segment are equal.",
        [
          ["Angle ADB gets bigger near C", "Look again: it stays at 40°."],
          ["Angle ADB is double angle ACB", "Neither is at the centre: they're equal."],
        ],
      ],
      "Anywhere on that arc, the angle on AB is the same.",
      { text: "Drag D along the top arc. Compare the angles at C and D." },
    ),
    explain(
      "Discover",
      "Both are half",
      ["**Angles in the same segment are equal.**", "Both stand on chord AB, on the same side."],
      bowtie(48, ["x", "x"]),
      "Each is half the angle at the centre, so they match.",
    ),
    methodCard("The method", sameSegmentMethod, bowtie(48, ["x", "x"])),
    pair(
      "Spot the bow tie",
      {
        problem: "Find angle ADB.",
        picture: bowtie(35, ["35°", "?"]),
        lines: [
          {
            line: "ADB = ACB",
            reason: SAME_SEGMENT,
            note: "Both angles stand on chord AB, on the same side.",
          },
          { line: "ADB = 35°" },
        ],
      },
      ask("Find angle ADB.", "52", "Same chord, same side: equal.", "52°.", {
        unit: "°",
        asks: "angle at D",
        picture: bowtie(52, ["52°", "?"]),
      }),
      "Equal angles: nothing to work out once you've spotted the chord.",
    ),
    fade(
      "Finish it",
      "Find angle ADB. Give a reason.",
      [{ line: "ADB = ACB", reason: SAME_SEGMENT, note: "Same chord, same side." }],
      [
        [
          "So angle ADB is",
          "40°",
          ["80°", "Both are at the circumference: equal, not double."],
          "ADB = 40°",
        ],
      ],
      "Spot the chord, check the side, and they're equal.",
      bowtie(40, ["40°", "?"]),
    ),
    questionSet(
      "Same method, different look",
      "Find angle ADB each time. Watch what changes.",
      [
        ask("Find angle ADB.", "40", "Same arc, same side.", "40°.", {
          unit: "°",
          asks: "angle at D",
          picture: bowtie(40, ["40°", "?"]),
        }),
        ask(
          "Find angle ADB.",
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
        ask("Find angle ADB.", "40", "D is still above AB.", "40°: wherever D is on that arc.", {
          unit: "°",
          asks: "angle at D",
          changed: "D has moved along the arc, close to C.",
          expect: [
            "D has moved. Angle ADB…",
            "stays the same",
            "It still stands on arc AB from the same side.",
            [
              ["gets smaller", "Its size doesn't depend on where D is on that arc."],
              ["gets bigger", "Its size doesn't depend on where D is on that arc."],
            ],
          ],
          picture: bowtie(40, ["40°", "?"], { d: 90 }),
        }),
        ask("Find x.", "18", "They're equal: 3x = 54.", "x = 18.", {
          asks: "angle at C",
          changed: "One angle is in algebra.",
          picture: bowtie(54, ["3x", "54°"]),
        }),
        ask(
          "Is angle ADB equal to angle ACB?",
          "No",
          "C and D must be in the same segment.",
          "No: D is in the other segment, so ACBD is a cyclic quadrilateral and the two add to 180°.",
          {
            changed: "D is now below AB.",
            others: ["Yes"],
            picture: bowtie(40, ["40°", "?"], { dOpposite: true }),
          },
        ),
      ],
      "Same arc and same side: equal. Other side: not equal.",
    ),
    tap(
      "Spot it",
      "Tap the angle equal to x.",
      circlePic({
        on: { A: 230, B: 310, C: 70, D: 130 },
        lines: ["CA", "CB", "DA", "DB", "CD"],
        angles: [
          ["ACB", "x"],
          ["ADB", ""],
          ["CAD", ""],
          ["DBC", ""],
        ],
        tap: true,
      }),
      "ADB",
      "Find the other angle standing on the same chord as x, on the same side.",
      "Angle ADB: it stands on arc AB, like x, from the same side.",
      {
        wrong: {
          CAD: "That stands on chord CD, not AB.",
          DBC: "That stands on chord CD, not AB.",
          ACB: "That's x itself.",
        },
      },
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Find angle ADB.", "61", "Equal.", "61°.", {
          unit: "°",
          asks: "angle at D",
          picture: bowtie(61, ["61°", "?"]),
        }),
        ask("Find angle ACB.", "29", "Equal.", "29°.", {
          unit: "°",
          asks: "angle at C",
          changed: "Now the angle at C is missing.",
          picture: bowtie(29, ["?", "29°"], { turn: 200 }),
        }),
        ask(
          "Find y.",
          "19",
          "The two angles are equal: make an equation.",
          "2y + 6 = 44, so y = 19.",
          {
            asks: "angle at C",
            changed: "The angle at C is in algebra.",
            picture: bowtie(44, ["2y + 6°", "44°"]),
          },
        ),
        ask(
          "Find angle ACB.",
          "50",
          "First find angle ADB in its triangle.",
          "ADB = 180° − 70° − 60° = 50°, so ACB = 50°.",
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
      { text: "Same chord, same side: the angles are equal." },
    ),
    typed("Your turn", "Find angle ACB.", "33", "Same segment.", "33°.", {
      unit: "°",
      picture: bowtie(33, ["?", "33°"], { turn: 300 }),
    }),
    typed(
      "Your turn",
      "Find x.",
      "15",
      "They're equal: make an equation and solve it.",
      "5x − 10 = 3x + 20, so x = 15.",
      {
        picture: bowtie(65, ["5x − 10°", "3x + 20°"]),
      },
    ),
    choose(
      "Watch out",
      "Raj says angles ACB and ADB are equal. Is he right?",
      "No: they're in different segments",
      "D is on the other side of AB. Angles on opposite sides of a chord add to 180° instead.",
      [["Yes: they stand on the same arc", "They must be on the same side as well."]],
      { picture: bowtie(40, ["40°", "?"], { dOpposite: true }) },
    ),
    mistake(
      "Kim finds angle ADB.",
      [
        "ACB and ADB stand on arc AB.",
        "The angle at the circumference is half the angle at the centre.",
        "So ADB = 23°",
      ],
      1,
      "Neither angle is at the centre. Both are at the circumference, on the same side: they're equal. ADB = 46°.",
      bowtie(46, ["46°", "?"]),
    ),
    choose(
      "Back to the problem",
      "“Find angle ADB. Give a reason.”",
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
          "Find angle ADB.",
          "57°",
          ["114°", "28.5°"],
          "Equal.",
          bowtie(57, ["57°", "?"]),
          "angle at D",
        ],
        [
          "Find angle ADB.",
          "38°",
          ["76°", "19°"],
          "Equal.",
          bowtie(38, ["38°", "?"], { turn: 120 }),
          "angle at D",
        ],
      ],
      [
        ["Find x.", "32", ["64", "128"], "2x = 64.", bowtie(64, ["2x", "64°"]), "angle at C"],
        [
          "Find x.",
          "24",
          ["72", "36"],
          "3x = 72.",
          bowtie(72, ["3x", "72°"], { turn: 200 }),
          "angle at C",
        ],
      ],
      [
        [
          "Is angle ADB equal to angle ACB?",
          "No",
          ["Yes"],
          "D is in the other segment.",
          bowtie(40, ["40°", "?"], { dOpposite: true }),
        ],
        [
          "Is angle ADB equal to angle ACB?",
          "Yes",
          ["No"],
          "Same arc, same side.",
          bowtie(35, ["35°", "?"], { turn: 60 }),
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

const cyclicMethod = [
  "Check all four corners are on the circle.",
  "Find the angle opposite the one you know.",
  "Take it away from 180°.",
  "Write the angle, then the reason.",
];

/** O at the centre, with B, C and D on the circle: not a cyclic quadrilateral. */
const notCyclic = circlePic({
  centre: true,
  on: { B: 300, C: 30, D: 110 },
  lines: ["OB", "BC", "CD", "DO"],
  angles: [
    ["DOB", "?"],
    ["BCD", "?"],
  ],
});

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
        "“ABCD is a cyclic quadrilateral. Find angles BCD and CDA. Give reasons.”",
        "By the end of this lesson, you can find both in a line each.",
      ],
      cyclic(70, 95, { A: "70°", B: "95°", C: "?", D: "?" }),
    ),
    typed(
      "Warm-up",
      "Find the angle marked ?.",
      "85",
      "Angles in a quadrilateral add up to 360°.",
      "85°.",
      { unit: "°", picture: cyclic(70, 95, { A: "70°", B: "95°", C: "110°", D: "?" }) },
    ),
    tap(
      "Warm-up",
      "Tap the angle opposite angle DAB.",
      cyclic(70, 95, { A: "x", B: "", C: "", D: "" }, 300, { tap: true }),
      "BCD",
      "Opposite means across the shape, not next to it.",
      "Angle BCD, at C: across from A.",
      {
        wrong: {
          ABC: "B is next to A, not opposite.",
          CDA: "D is next to A, not opposite.",
          DAB: "That's angle DAB itself.",
        },
      },
    ),
    explore(
      "Move D round its arc",
      {
        kind: "geometry",
        circle: 3,
        points: [
          { name: "A", onCircle: 200 },
          { name: "B", onCircle: 290 },
          { name: "C", onCircle: 20 },
          { name: "D", onCircle: 110, drag: [50, 170] },
        ],
        lines: ["AB", "BC", "CD", "DA"],
        angles: [{ name: "DAB" }, { name: "ABC" }, { name: "BCD" }, { name: "CDA" }],
        readouts: [
          { label: "Angle A + angle C", sum: ["DAB", "BCD"] },
          { label: "Angle B + angle D", sum: ["ABC", "CDA"] },
        ],
      },
      [
        "What did you notice?",
        "Opposite angles always add up to 180°",
        "However the shape changes, opposite angles share 180°.",
        [
          ["All four angles stay the same", "The angles at A and C change as D moves."],
          ["Opposite angles are equal", "They add to 180°; they aren't equal."],
        ],
      ],
      "Opposite angles of a cyclic quadrilateral add to 180°.",
      {
        text: "Drag D round the circle. Watch the angles change, and the two sums.",
        expect: [
          "Before you drag: angle A + angle C will…",
          "stay the same",
          "Opposite angles share 180°, however the shape changes.",
          [["change", "Try it and see."]],
        ],
      },
    ),
    explain(
      "Discover",
      "Opposite angles share a circle",
      [
        "A **cyclic quadrilateral** has all four corners on a circle.",
        "**Its opposite angles add up to 180°.**",
      ],
      cyclic(70, 95, { A: "x", C: "180° − x" }),
      "Their two arcs make the whole circle, so the angles at the centre make 360°.",
    ),
    methodCard("The method", cyclicMethod, cyclic(70, 95, { A: "x", C: "180° − x" })),
    pair(
      "Opposite, then subtract",
      {
        problem: "Find angle CDA.",
        picture: cyclic(80, 100, { B: "100°", D: "?" }),
        lines: [
          { line: "CDA + ABC = 180°", reason: CYCLIC, note: "B and D are opposite corners." },
          { line: "CDA = $180° - 100° = 80°$" },
        ],
      },
      ask("Find angle CDA.", "95", "Take the angle at B from 180°.", "95°.", {
        unit: "°",
        asks: "opposite angle",
        picture: cyclic(80, 85, { B: "85°", D: "?" }),
      }),
      "Opposite corners always share 180°.",
    ),
    fade(
      "Finish it",
      "Find x.",
      [{ line: "$x + 2x = 180°$", reason: CYCLIC, note: "A and C are opposite corners." }],
      [
        ["So", "$3x = 180°$", ["$2x = 180°$", "Add the x's: x + 2x is 3x."], "$3x = 180°$"],
        ["And x is", "60°", ["90°", "180° ÷ 3."], "$x = 60°$"],
      ],
      "Write the pair adding to 180°, then solve.",
      cyclic(60, 90, { A: "x", C: "2x" }),
    ),
    questionSet(
      "Same method, different look",
      "ABCD is cyclic each time. Watch what changes.",
      [
        ask("Find angle BCD.", "105", "180° take away the angle at A.", "105°.", {
          unit: "°",
          asks: "opposite angle",
          picture: cyclic(75, 95, { A: "75°", C: "?" }),
        }),
        ask("Find angle BCD.", "95", "180° take away the angle at A.", "95°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "The angle at A went up by 10°.",
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
        ask("Find angle CDA.", "95", "B and D are the other opposite pair.", "95°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "Now it's the other pair of corners, B and D.",
          picture: cyclic(85, 85, { B: "85°", D: "?" }),
        }),
        ask(
          "Find angle BCD.",
          "95",
          "Still opposite: 180° take away the angle at A.",
          "95°: the shape looks different, but A and C are still opposite.",
          {
            unit: "°",
            asks: "opposite angle",
            changed: "The quadrilateral is long and thin, and turned.",
            picture: cyclic(85, 50, { A: "85°", C: "?" }, 120),
          },
        ),
        ask(
          "Do the opposite angles of OBCD add to 180°?",
          "No",
          "The rule needs all four corners on the circle.",
          "No: O is the centre, not on the circle, so OBCD isn't cyclic.",
          {
            changed: "One corner is at the centre, not on the circle.",
            others: ["Yes"],
            picture: notCyclic,
          },
        ),
      ],
      "Opposite and on the circle: add to 180°. A corner off the circle: no rule.",
    ),
    tap(
      "Spot it",
      "Tap the angle that adds to angle ABC to make 180°.",
      cyclic(75, 95, { A: "", B: "y", C: "", D: "" }, 200, { tap: true }),
      "CDA",
      "Opposite means across the shape.",
      "Angle CDA, at D: across from B.",
      {
        wrong: {
          DAB: "A is next to B, not opposite.",
          BCD: "C is next to B, not opposite.",
          ABC: "That's angle ABC itself.",
        },
      },
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Find angle DAB.", "68", "180° take away the angle at C.", "68°.", {
          unit: "°",
          asks: "opposite angle",
          picture: cyclic(68, 100, { A: "?", C: "112°" }),
        }),
        ask("Find angle CDA.", "133", "180° take away the angle at B.", "133°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "The other pair, and a small angle given.",
          picture: cyclic(85, 47, { B: "47°", D: "?" }),
        }),
        ask(
          "Find x.",
          "40",
          "The two angles add to 180°: make an equation.",
          "3x + x + 20 = 180, so 4x = 160 and x = 40.",
          {
            asks: "x",
            changed: "Both angles are in algebra.",
            picture: cyclic(120, 90, { A: "3x", C: "x + 20°" }),
          },
        ),
        ask(
          "Find x.",
          "35",
          "The two angles add to 180°: make an equation.",
          "5x + 5 = 180, so x = 35.",
          {
            asks: "x",
            changed: "Both angles have a number added or taken away.",
            picture: cyclic(80, 95, { A: "2x + 10°", C: "3x − 5°" }, 160),
          },
        ),
      ],
      "One angle known: subtract. Both in algebra: add them, make 180°, solve.",
      { text: "Opposite angles of a cyclic quadrilateral add to 180°." },
    ),
    typed("Your turn", "Find angle DAB.", "56", "180° take away the angle at C.", "56°.", {
      unit: "°",
      picture: cyclic(56, 100, { A: "?", C: "124°" }, 200),
    }),
    typed(
      "Your turn",
      "Find x.",
      "20",
      "B and D are opposite: they add to 180°.",
      "9x = 180, so x = 20.",
      {
        picture: cyclic(70, 100, { B: "5x", D: "4x" }),
      },
    ),
    choose(
      "Watch out",
      "Ivy says angles A and B add up to 180°. What's wrong?",
      "A and B are next to each other; the rule is for opposite angles",
      "Opposite corners: A with C, B with D.",
      [["Nothing: any two angles add to 180°", "Only opposite ones do."]],
      { picture: cyclic(70, 95, { A: "70°", B: "95°" }) },
    ),
    mistake(
      "Ben finds angle BCD. ABCD is cyclic.",
      ["BCD is opposite DAB.", "Opposite angles are equal.", "BCD = 64°"],
      1,
      "Opposite angles of a cyclic quadrilateral add to 180°: BCD = 116°.",
      cyclic(64, 95, { A: "64°", C: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Find angles BCD and CDA. Give reasons.”",
      "BCD = 110° and CDA = 85°",
      "Each is 180° minus its opposite angle.",
      [
        ["BCD = 95° and CDA = 70°", "Use the opposite angles, not the neighbours."],
        ["BCD = 110° and CDA = 95°", "CDA is opposite ABC: take that one from 180°."],
      ],
      { picture: cyclic(70, 95, { A: "70°", B: "95°", C: "?", D: "?" }) },
    ),
    quiz([
      [
        [
          "Find angle BCD.",
          "122°",
          ["58°", "302°"],
          "180° − 58°.",
          cyclic(58, 95, { A: "58°", C: "?" }),
          "opposite angle",
        ],
        [
          "Find angle CDA.",
          "77°",
          ["103°", "257°"],
          "180° − 103°.",
          cyclic(77, 103, { B: "103°", D: "?" }, 200),
          "opposite angle",
        ],
      ],
      [
        [
          "Find x.",
          "20",
          ["36", "90"],
          "2x + 7x = 180.",
          cyclic(40, 95, { A: "2x", C: "7x" }),
          "x",
        ],
        [
          "Find x.",
          "30",
          ["36", "60"],
          "x + 5x = 180.",
          cyclic(30, 95, { A: "x", C: "5x" }, 160),
          "x",
        ],
      ],
      [
        [
          "Do the opposite angles of OBCD add to 180°?",
          "No",
          ["Yes"],
          "O is the centre, not on the circle.",
          notCyclic,
        ],
        [
          "Do the opposite angles of ABCD add to 180°?",
          "Yes",
          ["No"],
          "All four corners are on the circle.",
          cyclic(75, 95, { A: "?", C: "?" }, 100),
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

const tangentsMethod = [
  "Mark 90° where a radius meets a tangent.",
  "Tangents from one point are equal.",
  "Use 360° in the kite, or 180° in a triangle.",
  "Write each angle with its reason.",
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
        "“PA and PB are tangents to the circle, centre O. Find angle AOB. Give reasons.”",
        "By the end of this lesson, you'll find the two right angles hiding in the picture.",
      ],
      kite(50, { P: "50°", O: "?" }),
    ),
    tap(
      "Warm-up",
      "Tap both tangents.",
      kite(60, {}, 0, { tap: true }),
      ["PA", "PB"],
      "A tangent touches the circle at one point, from outside.",
      "PA and PB: each touches the circle once.",
      { wrong: { OA: "OA is a radius.", OB: "OB is a radius." } },
    ),
    typed(
      "Warm-up",
      "Find the angle marked ?.",
      "110",
      "Angles in a quadrilateral add up to 360°.",
      "110°.",
      { unit: "°", picture: kite(70, { A: "90°", B: "90°", P: "70°", O: "?" }) },
    ),
    explore(
      "Move P away from the circle",
      {
        kind: "geometry",
        circle: 2.4,
        points: [
          { name: "P", from: "O", deg: 0, dist: 4.5, drag: [4.2, 7] },
          { name: "A", tangentFrom: "P", side: 1 },
          { name: "B", tangentFrom: "P", side: -1 },
        ],
        lines: ["OA", "OB", "PA", "PB"],
        angles: [{ name: "OAP" }, { name: "APB" }, { name: "AOB" }],
        readouts: [
          { label: "PA", length: "PA" },
          { label: "PB", length: "PB" },
          { label: "Angle APB + angle AOB", sum: ["APB", "AOB"] },
        ],
      },
      [
        "What stayed the same?",
        "The right angle at A, PA = PB, and angle APB + angle AOB = 180°",
        "A tangent meets a radius at 90°, and two tangents from a point are equal.",
        [
          ["Angle APB stayed the same", "It got smaller as P moved away."],
          ["PA and PB changed by different amounts", "Look again: they're always equal."],
        ],
      ],
      "Right angles at A and B, and equal tangents, however far away P is.",
      {
        text: "Drag P along the line. Watch the tangents and the angles.",
        expect: [
          "Before you drag: as P moves further away, angle APB will…",
          "get smaller",
          "The tangents close up as P moves away.",
          [
            ["get bigger", "Try it and see."],
            ["stay the same", "Try it and see."],
          ],
        ],
      },
    ),
    explain(
      "Discover",
      "Two facts about tangents",
      ["**A tangent meets a radius at 90°.**", "**Two tangents from one point are equal.**"],
      kite(50, { A: "90°", B: "90°" }),
      "So OAPB is a kite, and angle O + angle P = 180°.",
    ),
    methodCard("The method", tangentsMethod, kite(50, { A: "90°", B: "90°" })),
    pair(
      "The kite",
      {
        problem: "PA and PB are tangents. Find angle AOB.",
        picture: kite(40, { P: "40°", O: "?" }),
        lines: [
          { line: "OAP = OBP = 90°", reason: TANGENT },
          {
            line: "AOB = $360° - 90° - 90° - 40° = 140°$",
            reason: QUADRILATERAL,
          },
        ],
      },
      ask(
        "Find angle AOB.",
        "110",
        "Take the two right angles and the angle at P from 360°.",
        "110°.",
        { unit: "°", asks: "angle at O", picture: kite(70, { P: "70°", O: "?" }) },
      ),
      "Angle O and angle P always share 180°.",
    ),
    fade(
      "Finish it",
      "Find angle APB.",
      [{ line: "OAP = OBP = 90°", reason: TANGENT, note: "PA and PB are tangents." }],
      [
        [
          "So angle APB is",
          "$360° - 90° - 90° - 124° = 56°$",
          ["$180° - 124° - 90°$", "It's a quadrilateral: 360°."],
          "APB = 56°",
          { reason: QUADRILATERAL },
        ],
      ],
      "Or straight away: 180° − 124°.",
      kite(56, { O: "124°", P: "?" }),
    ),
    questionSet(
      "Same method, different look",
      "PA and PB are tangents each time. Watch what changes.",
      [
        ask("Find angle AOB.", "120", "180° take away the angle at P.", "120°.", {
          unit: "°",
          asks: "angle at O",
          picture: kite(60, { P: "60°", O: "?" }),
        }),
        ask("Find angle AOB.", "100", "180° take away the angle at P.", "100°.", {
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
          "Find angle AOB.",
          "100",
          "Still 180° take away the angle at P.",
          "100°: the kite is only turned.",
          {
            unit: "°",
            asks: "angle at O",
            changed: "P is above the circle now.",
            picture: kite(80, { P: "80°", O: "?" }, 90),
          },
        ),
        ask(
          "Find angle AOP.",
          "50",
          "OP cuts the kite into two matching halves. Find angle AOB first.",
          "50°: angle AOB is 180° − 80° = 100°, and OP cuts it in half.",
          {
            unit: "°",
            changed: "Now it's half of the kite.",
            picture: circlePic({
              r: 2.4,
              centre: true,
              on: { A: 50, B: -50 },
              off: { P: P(2.4 / Math.cos(rad(50)), 0) },
              lines: ["OA", "OB", "PA", "PB"],
              dashed: ["OP"],
              angles: [
                ["APB", "80°"],
                ["AOP", "?"],
              ],
            }),
          },
        ),
        ask(
          "Find the tangent PA.",
          "12",
          "Triangle OAP has a right angle at A: use Pythagoras.",
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
            picture: kite(45, { A: "90°" }, 0, {
              sides: [
                ["OA", "5 cm"],
                ["OP", "13 cm"],
              ],
            }),
          },
        ),
      ],
      "Right angles where radius meets tangent; the rest is triangles and quadrilaterals.",
    ),
    tap(
      "Spot it",
      "PA and PB are tangents. Tap both right angles.",
      kite(60, { A: "", B: "", P: "", O: "" }, 0, { tap: true }),
      ["OAP", "PBO"],
      "Look where a radius meets a tangent.",
      "At A and B, where each radius meets its tangent.",
      {
        wrong: {
          APB: "That's at P, between the tangents.",
          AOB: "That's at O, between the radii.",
        },
      },
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Find angle APB.", "30", "180° take away the angle at O.", "30°.", {
          unit: "°",
          asks: "angle at P",
          picture: kite(30, { O: "150°", P: "?" }),
        }),
        ask("Find angle AOB.", "144", "180° take away the angle at P.", "144°.", {
          unit: "°",
          asks: "angle at O",
          changed: "Now the angle at O is missing.",
          picture: kite(36, { P: "36°", O: "?" }, 200),
        }),
        ask("Find PB.", "9", "Tangents from one point are equal.", "9 cm.", {
          unit: "cm",
          asks: "length",
          changed: "Now a length is missing.",
          picture: kite(60, {}, 0, {
            sides: [
              ["PA", "9 cm"],
              ["PB", "?"],
            ],
          }),
        }),
        ask("Find x.", "60", "The angles at O and P add to 180°.", "3x = 180, so x = 60.", {
          asks: "angle at P",
          changed: "Both angles are in algebra.",
          picture: kite(60, { P: "x", O: "2x" }),
        }),
      ],
      "Angle, angle or length: the right angles and equal tangents do the work.",
      { text: "In kite OAPB, angle O + angle P = 180°." },
    ),
    typed(
      "Your turn",
      "PA and PB are tangents. Find angle APB.",
      "82",
      "180° take away the angle at O.",
      "82°.",
      { unit: "°", picture: kite(82, { O: "98°", P: "?" }, 200) },
    ),
    typed(
      "Your turn",
      "PA is a tangent. Find OP.",
      "17",
      "Triangle OAP has a right angle at A: use Pythagoras.",
      "17 cm.",
      {
        unit: "cm",
        picture: kite(56, { A: "90°" }, 0, {
          sides: [
            ["OA", "8 cm"],
            ["PA", "15 cm"],
            ["OP", "?"],
          ],
        }),
      },
    ),
    choose(
      "Watch out",
      "Ola says OAP is 90° as OA is a radius. What's missing?",
      "PA must be a tangent at A",
      "The right angle is between a tangent and a radius.",
      [["Nothing: every radius makes a right angle", "Only with a tangent at that point."]],
      { picture: kite(70, { A: "?" }) },
    ),
    mistake(
      "Kim finds angle AOB. PA and PB are tangents.",
      ["OAP = OBP = 90°", "AOB = 180° − 64° − 90°", "AOB = 26°"],
      1,
      "OAPB is a quadrilateral: 360° − 90° − 90° − 64° = 116°.",
      kite(64, { P: "64°", O: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Find angle AOB. Give reasons.”",
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
          "Find angle AOB.",
          "132°",
          ["48°", "42°"],
          "180° − 48°.",
          kite(48, { P: "48°", O: "?" }),
          "angle at O",
        ],
        [
          "Find angle AOB.",
          "114°",
          ["66°", "24°"],
          "180° − 66°.",
          kite(66, { P: "66°", O: "?" }, 90),
          "angle at O",
        ],
      ],
      [
        [
          "Find angle APB.",
          "40°",
          ["140°", "50°"],
          "180° − 140°.",
          kite(40, { O: "140°", P: "?" }),
          "angle at P",
        ],
        [
          "Find angle APB.",
          "70°",
          ["110°", "20°"],
          "180° − 110°.",
          kite(70, { O: "110°", P: "?" }, 200),
          "angle at P",
        ],
      ],
      [
        [
          "Find PA.",
          "8 cm",
          ["16 cm", "4 cm"],
          "Pythagoras: $10^2 - 6^2 = 64$.",
          kite(74, { A: "90°" }, 0, {
            sides: [
              ["OA", "6 cm"],
              ["OP", "10 cm"],
              ["PA", "?"],
            ],
          }),
          "length",
        ],
        [
          "Find PA.",
          "24 cm",
          ["18 cm", "32 cm"],
          "Pythagoras: $25^2 - 7^2 = 576$.",
          kite(32, { A: "90°" }, 0, {
            sides: [
              ["OA", "7 cm"],
              ["OP", "25 cm"],
              ["PA", "?"],
            ],
          }),
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

const alternateMethod = [
  "Find the tangent and the chord from T.",
  "Mark the angle between them.",
  "Look across the chord for the equal angle.",
  "Write the angle, then the reason.",
];

/** A tangent at T, chord TA, and C on the same side as the tangent angle: not alternate. */
const sameSide = circlePic({
  on: { T: 270, A: 50, C: 340 },
  lines: ["TA", "TC", "CA"],
  tangents: [{ at: "T", ends: ["R", "S"], len: 3 }],
  angles: [
    ["STA", "70°"],
    ["TCA", "?"],
  ],
});

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
        "“RS is a tangent to the circle at T. Find angle TBA. Give a reason.”",
        "This is the hardest circle theorem to spot. By the end of this lesson, you'll know what to look for.",
      ],
      alternate(55, { tangent: "55°", B: "?" }),
    ),
    tap(
      "Warm-up",
      "Tap the tangent.",
      alternate(55, {}, 150, { tap: true }),
      "RS",
      "A tangent touches the circle once, at T.",
      "RS: it touches the circle at T and doesn't cut it.",
      { wrong: { TA: "TA is a chord.", TB: "TB is a chord.", AB: "AB is a chord." } },
    ),
    typed(
      "Warm-up",
      "Find the angle marked ?.",
      "125",
      "Angles on a straight line add to 180°.",
      "125°.",
      {
        unit: "°",
        picture: tangentChord(20, [
          ["STA", "55°"],
          ["ATR", "?"],
        ]),
      },
    ),
    explore(
      "Move A round the circle",
      {
        kind: "geometry",
        circle: 3,
        points: [
          { name: "T", onCircle: 270 },
          { name: "R", at: P(-3.4, -3) },
          { name: "S", at: P(3.4, -3) },
          { name: "A", onCircle: 20, drag: [310, 90] },
          { name: "B", onCircle: 150 },
        ],
        lines: ["RS", "TA", "TB", "AB"],
        angles: [{ name: "STA" }, { name: "TBA" }],
        readouts: [
          { label: "Angle STA", angle: "STA" },
          { label: "Angle TBA", angle: "TBA" },
        ],
      },
      [
        "What did you notice?",
        "Angle TBA always equals angle STA",
        "The angle between a tangent and a chord equals the angle in the alternate segment.",
        [
          ["They add to 180°", "Look again: they're equal."],
          ["Angle TBA never changes", "It changes with angle STA, every time."],
        ],
      ],
      "Tangent–chord angle = the angle across the chord.",
      {
        text: "RS is a tangent at T. Drag A round the circle and watch the two angles.",
        expect: [
          "Before you drag: as angle STA grows, angle TBA will…",
          "grow with it",
          "They stay equal: the alternate segment theorem.",
          [
            ["stay the same", "Try it and see."],
            ["shrink", "Try it and see."],
          ],
        ],
      },
    ),
    explain(
      "Discover",
      "Look across the chord",
      ["**The angle between a tangent and a chord equals the angle in the alternate segment.**"],
      alternate(55, { tangent: "x", B: "x" }),
      "Alternate means the other side of the chord.",
    ),
    methodCard("The method", alternateMethod, alternate(55, { tangent: "x", B: "x" })),
    pair(
      "Across the chord",
      {
        problem: "RS is a tangent at T. Find angle TBA.",
        picture: alternate(62, { tangent: "62°", B: "?" }),
        lines: [
          {
            line: "TBA = STA",
            reason: ALTERNATE,
            note: "Look across the chord TA, into the other segment.",
          },
          { line: "TBA = 62°" },
        ],
      },
      ask(
        "Find angle TBA.",
        "48",
        "The angle across the chord equals the tangent–chord angle.",
        "48°.",
        { unit: "°", asks: "segment angle", picture: alternate(48, { tangent: "48°", B: "?" }) },
      ),
      "Tangent–chord angle = angle across the chord.",
    ),
    fade(
      "The other way round",
      "Find angle STA.",
      [{ line: "STA = TBA", reason: ALTERNATE, note: "B is across the chord TA from S." }],
      [["So angle STA is", "50°", ["130°", "They're equal, not adding to 180°."], "STA = 50°"]],
      "It works in both directions.",
      alternate(50, { tangent: "?", B: "50°" }),
    ),
    questionSet(
      "Same method, different look",
      "RS is a tangent at T each time. Watch what changes.",
      [
        ask("Find angle TBA.", "40", "Alternate segment.", "40°.", {
          unit: "°",
          asks: "segment angle",
          picture: alternate(40, { tangent: "40°", B: "?" }),
        }),
        ask(
          "Find angle TBA.",
          "40",
          "B is still in the alternate segment.",
          "40°: anywhere on that arc, by the same-segment theorem.",
          {
            unit: "°",
            asks: "segment angle",
            changed: "B has moved along its arc.",
            expect: [
              "B has moved. Angle TBA…",
              "stays the same",
              "Angles in the same segment are equal.",
              [["changes", "B is still in the alternate segment."]],
            ],
            picture: alternate(40, { tangent: "40°", B: "?" }, 100),
          },
        ),
        ask("Find angle TBA.", "70", "Alternate segment.", "70°.", {
          unit: "°",
          asks: "segment angle",
          changed: "The chord TA is steeper.",
          picture: alternate(70, { tangent: "70°", B: "?" }),
        }),
        ask(
          "Find angle ATB.",
          "65",
          "Angle TBA equals the tangent–chord angle; then use the triangle.",
          "65°: angle TBA equals the tangent–chord angle, and the triangle's angles add to 180°.",
          {
            unit: "°",
            changed: "Now the theorem is one step in a longer problem.",
            picture: alternate(55, { tangent: "55°", A: "60°", T: "?" }, 150),
          },
        ),
        ask(
          "Is angle TCA equal to angle STA?",
          "No",
          "The equal angle is across the chord, in the alternate segment.",
          "No: C is on the same side of TA as S. The angle there is 180° take away the tangent–chord angle.",
          {
            changed: "The point is on the same side as the tangent angle.",
            others: ["Yes"],
            picture: sameSide,
          },
        ),
      ],
      "Always look across the chord, into the other segment.",
    ),
    tap(
      "Spot it",
      "RS is a tangent at T. Tap the angle equal to x.",
      alternate(55, { tangent: "x", B: "", A: "", T: "" }, 150, { tap: true }),
      "TBA",
      "Look across the chord TA, into the other segment.",
      "Angle TBA: across chord TA from the tangent angle.",
      {
        wrong: {
          BAT: "That's at A: it stands on chord TB.",
          ATB: "That's at T, between the two chords.",
          STA: "That's x itself.",
        },
      },
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Find angle TBA.", "66", "Equal.", "66°.", {
          unit: "°",
          asks: "segment angle",
          picture: alternate(66, { tangent: "66°", B: "?" }),
        }),
        ask("Find angle STA.", "38", "Equal.", "38°.", {
          unit: "°",
          asks: "tangent angle",
          changed: "Now the tangent–chord angle is missing.",
          picture: alternate(38, { tangent: "?", B: "38°" }, 110),
        }),
        ask("Find x.", "18", "The two angles are equal: make an equation.", "4x = 72, so x = 18.", {
          asks: "tangent angle",
          changed: "The tangent–chord angle is in algebra.",
          picture: alternate(72, { tangent: "4x", B: "72°" }),
        }),
        ask(
          "Find angle TAB.",
          "58",
          "The other chord, TB: look across it.",
          "58°: angle BTR equals angle TAB, in its alternate segment.",
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
      "RS is a tangent at T. Find angle STA.",
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
      "RS is a tangent at T. Find x.",
      "18",
      "The two angles are equal: make an equation.",
      "3x + 5 = 59, so x = 18.",
      {
        picture: alternate(59, { tangent: "3x + 5°", B: "59°" }),
      },
    ),
    choose(
      "Watch out",
      "Ben says angle TCA equals the tangent–chord angle. What's wrong?",
      "The equal angle is across the chord, in the other segment",
      "Alternate means the other side.",
      [["Nothing: any angle on the chord matches", "Only the one in the alternate segment."]],
      { picture: sameSide },
    ),
    mistake(
      "Zoe finds angle TBA. RS is a tangent at T.",
      ["The tangent meets the radius at 90°.", "So TBA = 90° − 52°", "TBA = 38°"],
      0,
      "There's no radius here: TA is a chord. By the alternate segment theorem, TBA = 52°.",
      alternate(52, { tangent: "52°", B: "?" }),
    ),
    choose(
      "Back to the problem",
      "“Find angle TBA. Give a reason.”",
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
          "Find angle TBA.",
          "47°",
          ["43°", "133°"],
          "Equal.",
          alternate(47, { tangent: "47°", B: "?" }),
          "segment angle",
        ],
        [
          "Find angle TBA.",
          "71°",
          ["19°", "109°"],
          "Equal.",
          alternate(71, { tangent: "71°", B: "?" }, 100),
          "segment angle",
        ],
      ],
      [
        [
          "Find angle STA.",
          "36°",
          ["54°", "144°"],
          "Equal.",
          alternate(36, { tangent: "?", B: "36°" }),
          "tangent angle",
        ],
        [
          "Find angle STA.",
          "64°",
          ["26°", "116°"],
          "Equal.",
          alternate(64, { tangent: "?", B: "64°" }, 120),
          "tangent angle",
        ],
      ],
      [
        [
          "Find angle ATB.",
          "65°",
          ["50°", "115°"],
          "Angle TBA is 50°, so 180° − 50° − 65°.",
          alternate(50, { tangent: "50°", A: "65°", T: "?" }, 140),
        ],
        [
          "Find angle ATB.",
          "70°",
          ["40°", "110°"],
          "Angle TBA is 40°, so 180° − 40° − 70°.",
          alternate(40, { tangent: "40°", A: "70°", T: "?" }, 130),
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
