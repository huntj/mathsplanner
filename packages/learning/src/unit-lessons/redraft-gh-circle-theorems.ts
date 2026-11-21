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
  lesson,
  methodCard,
  mistake,
  questionSet,
  quiz,
  summary,
  tap,
  tapSet,
  typed,
  worked,
} from "./build.ts";
import { circlePic, type CircleSpec } from "./circle-pictures.ts";
import { REASON } from "./reasons.ts";
import type { DrawingPic, Point, Screen, ShapePic, UnitLesson, Variation } from "./types.ts";
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

/** A screen moved into a part of the lesson plan, by its tag. */
const tagged = (tag: string, screen: Screen): Screen => ({ ...screen, tag });

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
// 1. The angle at the centre, on the stepped plan (docs/proposals/lesson-stepped.md).

const centreMap: Variation = {
  relationship: "angle at the centre = 2 × angle at the circumference, on the same arc",
  unknowns: ["centre", "circumference"],
  surface: ["numbers", "turned diagram", "where C sits", "reflex angle", "algebra"],
};
const centreMethod = [
  "Find the angle at the centre and the angle at the circumference.",
  "Check both stand on the same arc.",
  "Centre angle = 2 × circumference angle.",
];

const angleAtCentre = lesson(
  U,
  "centre",
  SKILL,
  "The angle at the centre",
  "The angle at the centre is twice the angle at the circumference on the same arc.",
  [
    // 1. The rule.
    explain(
      "The rule",
      "The angle at the centre",
      ["**The angle at the centre is twice the angle at the circumference.**"],
      centre(100, ["100°", "50°"]),
      "Both angles must stand on the same arc AB.",
    ),
    tagged(
      "The rule",
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
        },
      ),
    ),

    // 2. Check you remember.
    tap(
      "Check you remember",
      "Tap both radii.",
      circlePic({
        centre: true,
        on: { A: 205, B: 335, C: 90 },
        lines: ["OA", "OB", "CA", "CB"],
        tap: true,
      }),
      ["OA", "OB"],
      "A radius joins the centre O to the circle.",
      "OA and OB: both go from the centre to the circle.",
      {
        wrong: {
          CA: "CA joins two points on the circle: it's a chord.",
          CB: "CB joins two points on the circle: it's a chord.",
        },
      },
    ),
    tap(
      "Check you remember",
      "Tap the angle at the centre.",
      circlePic({
        centre: true,
        on: { A: 220, B: 320, C: 90 },
        lines: ["OA", "OB", "CA", "CB"],
        angles: [
          ["AOB", ""],
          ["ACB", ""],
        ],
        tap: true,
      }),
      "AOB",
      "The centre is O.",
      "Angle AOB: its corner is the centre, O.",
      { wrong: { ACB: "That's at C, on the circumference." } },
    ),
    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "120",
      "Angles at a point add up to 360°.",
      "120°.",
      {
        unit: "°",
        picture: fan([0, 130, 240], ["130°", "110°", "?"], "?"),
      },
    ),

    // 3. The method.
    methodCard("The method", centreMethod, centre(130, ["130°", "?"])),
    worked(
      "Watch the method",
      "Find angle ACB.",
      [
        {
          line: "ACB = AOB ÷ 2",
          reason: CENTRE,
          note: "You need to state the angle and also give a reason why this is true.",
        },
        { line: "ACB = $130° \\div 2 = 65°$" },
      ],
      "Halve to go out to the edge.",
      centre(130, ["130°", "?"]),
    ),
    calc(
      "Your turn",
      "Find angle ACB.",
      centre(80, ["80°", "?"]),
      [
        [
          "ACB = $80° \\div 2 =$",
          "40",
          "Halve the angle at the centre.",
          { after: "°", reason: CENTRE },
        ],
      ],
      "Angle ACB is 40°.",
    ),

    // 4. Practise.
    calc(
      "Practise",
      "Find angle AOB.",
      centre(70, ["?", "35°"]),
      [
        [
          "AOB = $2 \\times 35° =$",
          "70",
          "Double to go in to the centre.",
          { after: "°", reason: CENTRE },
        ],
      ],
      "Angle AOB is 70°.",
    ),
    questionSet(
      "Practise",
      "Find the missing angle each time.",
      [
        ask("Find angle ACB.", "50", "Halve the angle at the centre.", "50°.", {
          unit: "°",
          asks: "circumference",
          picture: centre(100, ["100°", "?"]),
        }),
        ask("Find angle ACB.", "70", "Halve the angle at the centre.", "70°.", {
          unit: "°",
          asks: "circumference",
          changed: "The circle is turned.",
          picture: centre(140, ["140°", "?"], { turn: 180 }),
        }),
        ask("Find angle AOB.", "72", "Double the angle at the circumference.", "72°.", {
          unit: "°",
          asks: "centre",
          changed: "Now the angle at the centre is missing.",
          picture: centre(72, ["?", "36°"], { turn: 200 }),
        }),
        ask("Find angle AOB.", "144", "Double the angle at the circumference.", "144°.", {
          unit: "°",
          asks: "centre",
          changed: "C has moved round the circle.",
          picture: centre(144, ["?", "72°"], { turn: 330, c: 120 }),
        }),
      ],
      "Halve to go out. Double to go in.",
    ),

    // 5. Variation.
    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find y.", "25", "Halve 150° to get angle ACB. Then solve 3y = 75.", "y = 25.", {
          asks: "circumference",
          picture: centre(150, ["150°", "3y"]),
        }),
        ask("Find x.", "24", "Centre = 2 × circumference: 3x = 2x + 24.", "x = 24.", {
          asks: "circumference",
          changed: "Both angles are in algebra.",
          picture: centre(72, ["3x", "x + 12°"]),
        }),
        ask(
          "Find angle ACB.",
          "130",
          "C faces the reflex angle. Take 100° from 360°, then halve.",
          "130°.",
          {
            unit: "°",
            asks: "circumference",
            changed: "C is on the other side of AB.",
            picture: centre(100, ["100°", "?"], { c: 270 }),
          },
        ),
        ask(
          "AB is a diameter. Find angle ACB.",
          "90",
          "The angle at O is 180°. Halve it.",
          "90°.",
          {
            unit: "°",
            asks: "circumference",
            changed: "A, O and B are in a straight line.",
            picture: semicircle(30, { C: "?" }),
          },
        ),
      ],
      "One rule, many looks.",
    ),

    // 6. Exit check.
    mistake(
      "Ola finds angle ACB.",
      [
        "The angle at the centre is twice the angle at the circumference.",
        "So ACB = 100° ÷ 2",
        "ACB = 50°",
      ],
      1,
      "C faces the reflex angle: 360° − 100° = 260°, so ACB = 130°.",
      centre(100, ["100°", "?"], { c: 270 }),
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

    // 7. Summary.
    summary(
      "What to remember",
      ["**The angle at the centre is twice the angle at the circumference.**"],
      centre(130, ["130°", "65°"]),
      [
        "**The angle at the centre is twice the angle at the circumference.**",
        "Draw a circle, centre O, with both angles on arc AB.",
        "Halve to go out to the edge. Double to go in to the centre.",
        "ACB = 130° ÷ 2 = 65° (angle at the centre is twice the angle at the circumference)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
angleAtCentre.plan = "stepped";
angleAtCentre.method = centreMethod;
angleAtCentre.variation = centreMap;

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

    mistake(
      "Leo finds angle ABC.",
      ["ACB = 90° (angle in a semicircle is 90°)", "ABC = 180° − 90° + 31°", "ABC = 121°"],
      1,
      "Take away both angles: 180° − 90° − 31° = 59°.",
      semicircle(31, { A: "31°", B: "?" }),
    ),

    // 6. Exit check.
    quiz([
      [
        [
          "Find angle ABC.",
          "68°",
          ["158°", "22°"],
          "90° − 22°.",
          semicircle(22, { A: "22°", B: "?" }),
          "angle at B",
        ],
        [
          "Find angle ABC.",
          "53°",
          ["143°", "37°"],
          "90° − 37°.",
          semicircle(37, { A: "37°", B: "?" }, { turn: 60 }),
          "angle at B",
        ],
      ],
      [
        [
          "Find angle ACB.",
          "90°",
          ["180°", "45°"],
          "The angle in a semicircle.",
          semicircle(50, { C: "?" }),
          "angle at C",
        ],
        [
          "Find angle ACB.",
          "90°",
          ["180°", "60°"],
          "The angle in a semicircle.",
          semicircle(20, { C: "?" }, { turn: 120 }),
          "angle at C",
        ],
      ],
      [
        [
          "Find x.",
          "30",
          ["45", "60"],
          "x + 2x = 90°.",
          semicircle(30, { A: "x", B: "2x" }),
          "angle at A",
        ],
        [
          "Find x.",
          "18",
          ["22.5", "72"],
          "x + 4x = 90°.",
          semicircle(18, { A: "x", B: "4x" }, { turn: 200 }),
          "angle at A",
        ],
      ],
    ]),

    // 7. Summary, and what to write in an exercise book.
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
// 3. Angles in the same segment, on the stepped plan.

const sameSegmentMethod = [
  "Find two angles standing on the same chord.",
  "Check they're on the same side of it.",
  "Then the angles are equal.",
];

const sameSegment = lesson(
  U,
  "same-segment",
  SKILL,
  "Angles in the same segment",
  "Angles standing on the same arc, on the same side, are equal.",
  [
    explain(
      "The rule",
      "Angles in the same segment",
      ["**Angles in the same segment are equal.**"],
      bowtie(48, ["48°", "48°"]),
      "Both stand on chord AB, on the same side.",
    ),
    tagged(
      "The rule",
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
    ),

    tap(
      "Check you remember",
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
          CAD: "That's at A: it stands on chord CD.",
          DBC: "That's at B: it stands on chord CD.",
        },
      },
    ),
    choose(
      "Check you remember",
      "Are C and D on the same side of chord AB?",
      "Yes",
      "Both are above AB, in the same segment.",
      [["No", "Look again: both are above AB."]],
      {
        picture: circlePic({
          on: { A: 230, B: 310, C: 60, D: 120 },
          lines: ["AB", "CA", "CB", "DA", "DB"],
        }),
      },
    ),
    typed("Check you remember", "Find angle ACB.", "48", "Halve the angle at the centre.", "48°.", {
      unit: "°",
      picture: centre(96, ["96°", "?"]),
    }),

    methodCard("The method", sameSegmentMethod, bowtie(35, ["35°", "?"])),
    worked(
      "Watch the method",
      "Find angle ADB.",
      [
        {
          line: "ADB = ACB",
          reason: SAME_SEGMENT,
          note: "Both angles stand on chord AB, on the same side.",
        },
        { line: "ADB = 35°" },
      ],
      "Same chord, same side: equal.",
      bowtie(35, ["35°", "?"]),
    ),
    calc(
      "Your turn",
      "Find angle ADB.",
      bowtie(52, ["52°", "?"]),
      [["ADB =", "52", "Same chord, same side: equal.", { after: "°", reason: SAME_SEGMENT }]],
      "Angle ADB is 52°.",
    ),

    calc(
      "Practise",
      "Find angle ACB.",
      bowtie(29, ["?", "29°"], { turn: 200 }),
      [["ACB =", "29", "Same chord, same side: equal.", { after: "°", reason: SAME_SEGMENT }]],
      "Angle ACB is 29°.",
    ),
    questionSet(
      "Practise",
      "Find the missing angle each time.",
      [
        ask("Find angle ADB.", "40", "Same chord, same side.", "40°.", {
          unit: "°",
          asks: "angle at D",
          picture: bowtie(40, ["40°", "?"]),
        }),
        ask("Find angle ADB.", "40", "Same chord, same side.", "40°.", {
          unit: "°",
          asks: "angle at D",
          changed: "The circle is turned.",
          picture: bowtie(40, ["40°", "?"], { turn: 180 }),
        }),
        ask("Find angle ADB.", "40", "D is still on the same side of AB.", "40°.", {
          unit: "°",
          asks: "angle at D",
          changed: "D has moved along the arc.",
          picture: bowtie(40, ["40°", "?"], { d: 90 }),
        }),
        ask("Find angle ACB.", "61", "Same chord, same side.", "61°.", {
          unit: "°",
          asks: "angle at C",
          changed: "Now the angle at C is missing.",
          picture: bowtie(61, ["?", "61°"], { turn: 300 }),
        }),
      ],
      "Same chord and same side: equal, wherever the points are.",
    ),

    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find x.", "18", "The two angles are equal: 3x = 54.", "x = 18.", {
          asks: "angle at C",
          picture: bowtie(54, ["3x", "54°"]),
        }),
        ask("Find x.", "15", "The two angles are equal: 5x − 10 = 3x + 20.", "x = 15.", {
          asks: "angle at C",
          changed: "Both angles are in algebra.",
          picture: bowtie(65, ["5x − 10°", "3x + 20°"]),
        }),
        ask(
          "Find angle ACB.",
          "50",
          "First find angle ADB in its triangle.",
          "50°: angle ADB is 180° − 70° − 60°.",
          {
            unit: "°",
            asks: "third angle",
            changed: "Neither angle is given: use a triangle first.",
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
        ask(
          "Is angle ADB equal to angle ACB?",
          "No",
          "C and D must be on the same side of AB.",
          "No: D is in the other segment.",
          {
            changed: "D is below AB now.",
            others: ["Yes"],
            picture: bowtie(40, ["40°", "?"], { dOpposite: true }),
          },
        ),
      ],
      "Same chord, same side: equal. Other side: not equal.",
    ),

    mistake(
      "Kim finds angle ADB.",
      ["ADB and ACB stand on chord AB, on the same side.", "So ADB = 46° ÷ 2", "ADB = 23°"],
      1,
      "Both angles are at the circumference: they're equal. ADB = 46°.",
      bowtie(46, ["46°", "?"]),
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

    summary(
      "What to remember",
      ["**Angles in the same segment are equal.**"],
      bowtie(48, ["48°", "48°"]),
      [
        "**Angles in the same segment are equal.**",
        "Draw a bow tie: two angles standing on chord AB, on the same side.",
        "ADB = ACB = 48° (angles in the same segment are equal)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
sameSegment.plan = "stepped";
sameSegment.method = sameSegmentMethod;
sameSegment.variation = {
  relationship: "angles standing on the same arc, in the same segment, are equal",
  unknowns: ["angle at C", "angle at D", "third angle"],
  surface: ["numbers", "turned diagram", "where D sits", "algebra", "other segment"],
};

// 4. Cyclic quadrilaterals, on the stepped plan.

const cyclicMethod = [
  "Check all four corners are on the circle.",
  "Find the angle opposite the one you know.",
  "Take it away from 180°.",
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
    explain(
      "The rule",
      "Cyclic quadrilaterals",
      ["**Opposite angles of a cyclic quadrilateral add up to 180°.**"],
      cyclic(70, 95, { A: "70°", B: "95°", C: "110°", D: "85°" }),
      "Cyclic means all four corners are on the circle.",
    ),
    tagged(
      "The rule",
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
        },
      ),
    ),

    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "116",
      "Angles on a straight line add up to 180°.",
      "116°.",
      {
        unit: "°",
        picture: fan([0, 64, 180], ["64°", "?"], "?"),
      },
    ),
    tap(
      "Check you remember",
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
    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "85",
      "Angles in a quadrilateral add up to 360°.",
      "85°.",
      {
        unit: "°",
        picture: cyclic(70, 95, { A: "70°", B: "95°", C: "110°", D: "?" }),
      },
    ),

    methodCard("The method", cyclicMethod, cyclic(80, 100, { B: "100°", D: "?" })),
    worked(
      "Watch the method",
      "Find angle CDA.",
      [
        { line: "CDA + ABC = 180°", reason: CYCLIC, note: "B and D are opposite corners." },
        { line: "CDA = $180° - 100° = 80°$" },
      ],
      "Opposite corners share 180°.",
      cyclic(80, 100, { B: "100°", D: "?" }),
    ),
    calc(
      "Your turn",
      "Find angle BCD.",
      cyclic(75, 95, { A: "75°", C: "?" }),
      [
        [
          "BCD = $180° - 75° =$",
          "105",
          "Take the angle at A from 180°.",
          { after: "°", reason: CYCLIC },
        ],
      ],
      "Angle BCD is 105°.",
    ),

    tapSet(
      "Practise",
      "Tap two opposite angles.",
      [
        [70, 95, 300],
        [85, 50, 120],
        [60, 110, 200],
        [100, 80, 30],
      ].map(([a = 70, b = 95, turn = 300]) => ({
        picture: cyclic(a, b, { A: "", B: "", C: "", D: "" }, turn, { tap: true }),
        answers: ["DAB", "BCD"],
        anyOf: [["ABC", "CDA"]],
        hint: "Opposite angles are across the shape, not next to each other.",
        done: "Opposite: across the shape.",
      })),
      "Whatever its shape, opposite corners are across from each other.",
    ),
    calc(
      "Practise",
      "Find angle CDA.",
      cyclic(80, 85, { B: "85°", D: "?" }),
      [
        [
          "CDA = $180° - 85° =$",
          "95",
          "Take the angle at B from 180°.",
          { after: "°", reason: CYCLIC },
        ],
      ],
      "Angle CDA is 95°.",
    ),
    questionSet(
      "Practise",
      "Find the missing angle each time.",
      [
        ask("Find angle DAB.", "68", "Take the opposite angle from 180°.", "68°.", {
          unit: "°",
          asks: "opposite angle",
          picture: cyclic(68, 100, { A: "?", C: "112°" }),
        }),
        ask("Find angle CDA.", "133", "Take the opposite angle from 180°.", "133°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "Now it's the other pair of corners.",
          picture: cyclic(85, 47, { B: "47°", D: "?" }),
        }),
        ask("Find angle BCD.", "95", "Take the opposite angle from 180°.", "95°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "A long, thin shape, turned.",
          picture: cyclic(85, 50, { A: "85°", C: "?" }, 120),
        }),
        ask("Find angle ABC.", "95", "Take the opposite angle from 180°.", "95°.", {
          unit: "°",
          asks: "opposite angle",
          changed: "Now the angle at B is missing.",
          picture: cyclic(70, 95, { B: "?", D: "85°" }, 200),
        }),
      ],
      "Opposite corners always share 180°.",
    ),

    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find x.", "60", "The angles at A and C add up to 180°: 3x = 180.", "x = 60.", {
          asks: "x",
          picture: cyclic(60, 90, { A: "x", C: "2x" }),
        }),
        ask("Find x.", "40", "The angles at A and C add up to 180°.", "4x + 20 = 180, so x = 40.", {
          asks: "x",
          changed: "One angle has a number added.",
          picture: cyclic(120, 90, { A: "3x", C: "x + 20°" }),
        }),
        ask("Find x.", "35", "The angles at A and C add up to 180°.", "5x + 5 = 180, so x = 35.", {
          asks: "x",
          changed: "Both angles have a number added or taken away.",
          picture: cyclic(80, 95, { A: "2x + 10°", C: "3x − 5°" }, 160),
        }),
        ask(
          "Do the opposite angles of OBCD add to 180°?",
          "No",
          "The rule needs all four corners on the circle.",
          "No: O is the centre, not on the circle.",
          { changed: "One corner is at the centre.", others: ["Yes"], picture: notCyclic },
        ),
      ],
      "On the circle and opposite: they add to 180°.",
    ),

    choose(
      "Variation",
      "Is ABCD a cyclic quadrilateral?",
      "Yes: all four corners are on the circle",
      "Cyclic means every corner is on the circle.",
      [["No", "Look again: A, B, C and D are all on the circle."]],
      {
        picture: circlePic({
          on: { A: 200, B: 290, C: 20, D: 110 },
          lines: ["AB", "BC", "CD", "DA"],
        }),
      },
    ),
    mistake(
      "Ben finds angle BCD.",
      ["BCD is opposite DAB.", "Opposite angles are equal.", "BCD = 64°"],
      1,
      "Opposite angles add up to 180°: BCD = 116°.",
      cyclic(64, 95, { A: "64°", C: "?" }),
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

    summary(
      "What to remember",
      ["**Opposite angles of a cyclic quadrilateral add up to 180°.**"],
      cyclic(80, 100, { A: "80°", B: "100°", C: "100°", D: "80°" }),
      [
        "**Opposite angles of a cyclic quadrilateral add up to 180°.**",
        "Draw a circle with all four corners A, B, C and D on it.",
        "CDA = 180° − 100° = 80° (opposite angles of a cyclic quadrilateral add up to 180°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
cyclicLesson.plan = "stepped";
cyclicLesson.method = cyclicMethod;
cyclicLesson.variation = {
  relationship: "opposite angles of a cyclic quadrilateral add to 180°",
  unknowns: ["opposite angle", "x"],
  surface: ["numbers", "the other pair", "shape and turn", "algebra", "corner off the circle"],
};

// 5. Tangents and radii, on the stepped plan. Its one rule is the right angle; that two tangents
// from a point are equal comes in as a new look.

const tangentsMethod = [
  "Mark 90° where each radius meets a tangent.",
  "Add the angles you know.",
  "Take the total away from 360°.",
];

const tangentsLesson = lesson(
  U,
  "tangents",
  SKILL,
  "Tangents and radii",
  "A tangent meets the radius at 90°, and two tangents from a point are equal.",
  [
    explain(
      "The rule",
      "Tangents and radii",
      ["**A tangent meets a radius at 90°.**"],
      kite(50, { A: "90°", B: "90°" }),
      "A tangent touches the circle at just one point.",
    ),
    tagged(
      "The rule",
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
        },
      ),
    ),

    tap(
      "Check you remember",
      "Tap both tangents.",
      kite(60, {}, 0, { tap: true }),
      ["PA", "PB"],
      "A tangent touches the circle at one point, from outside.",
      "PA and PB: each touches the circle once.",
      { wrong: { OA: "OA is a radius.", OB: "OB is a radius." } },
    ),
    choose(
      "Check you remember",
      "The angles in a quadrilateral add up to…",
      "360°",
      "Angles in a quadrilateral add up to 360°.",
      [
        ["180°", "That's a triangle."],
        ["90°", "That's one right angle."],
      ],
      { picture: kite(60, { A: "a", B: "b", P: "c", O: "d" }) },
    ),
    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "110",
      "Angles in a quadrilateral add up to 360°.",
      "110°.",
      {
        unit: "°",
        picture: kite(70, { A: "90°", B: "90°", P: "70°", O: "?" }),
      },
    ),

    methodCard("The method", tangentsMethod, kite(40, { P: "40°", O: "?" })),
    worked(
      "Watch the method",
      "Find angle AOB.",
      [
        { line: "OAP = OBP = 90°", reason: TANGENT },
        { line: "$90° + 90° + 40° = 220°$", note: "Add the angles you know." },
        {
          line: "AOB = $360° - 220° = 140°$",
          reason: QUADRILATERAL,
          note: "Take the total from 360°.",
        },
      ],
      "Two right angles, then 360°.",
      kite(40, { P: "40°", O: "?" }),
    ),
    calc(
      "Your turn",
      "Find angle AOB.",
      kite(70, { A: "90°", B: "90°", P: "70°", O: "?" }),
      [
        [
          "$90° + 90° + 70° =$",
          "250",
          "Add the two right angles and the angle at P.",
          { after: "°" },
        ],
        [
          "AOB = $360° - 250° =$",
          "110",
          "Take the total away from 360°.",
          { after: "°", reason: QUADRILATERAL },
        ],
      ],
      "Angle AOB is 110°.",
    ),

    calc(
      "Practise",
      "Find angle APB.",
      kite(56, { O: "124°", P: "?" }),
      [
        ["OAP = OBP =", "90", "A tangent meets a radius at 90°.", { after: "°", reason: TANGENT }],
        ["$90° + 90° + 124° =$", "304", "Add the angles you know.", { after: "°" }],
        [
          "APB = $360° - 304° =$",
          "56",
          "Take the total away from 360°.",
          { after: "°", reason: QUADRILATERAL },
        ],
      ],
      "Angle APB is 56°.",
    ),
    questionSet(
      "Practise",
      "PA and PB are tangents. Find the missing angle.",
      [
        ask("Find angle AOB.", "120", "Two right angles, then take the total from 360°.", "120°.", {
          unit: "°",
          asks: "angle at O",
          picture: kite(60, { P: "60°", O: "?" }),
        }),
        ask("Find angle AOB.", "100", "Two right angles, then take the total from 360°.", "100°.", {
          unit: "°",
          asks: "angle at O",
          changed: "The circle is turned.",
          picture: kite(80, { P: "80°", O: "?" }, 90),
        }),
        ask("Find angle APB.", "30", "Two right angles, then take the total from 360°.", "30°.", {
          unit: "°",
          asks: "angle at P",
          changed: "Now the angle at P is missing.",
          picture: kite(30, { O: "150°", P: "?" }),
        }),
        ask("Find angle APB.", "82", "Two right angles, then take the total from 360°.", "82°.", {
          unit: "°",
          asks: "angle at P",
          changed: "P is on the other side.",
          picture: kite(82, { O: "98°", P: "?" }, 200),
        }),
      ],
      "Two right angles, then 360°.",
    ),

    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find PB.", "9", "Two tangents from one point are equal.", "9 cm.", {
          unit: "cm",
          asks: "length",
          picture: kite(60, {}, 0, {
            sides: [
              ["PA", "9 cm"],
              ["PB", "?"],
            ],
          }),
        }),
        ask(
          "Find PA.",
          "12",
          "The right angle at A makes a right-angled triangle: use Pythagoras.",
          "12 cm.",
          {
            unit: "cm",
            asks: "length",
            changed: "Now use Pythagoras in triangle OAP.",
            picture: kite(45, { A: "90°" }, 0, {
              sides: [
                ["OA", "5 cm"],
                ["OP", "13 cm"],
              ],
            }),
          },
        ),
        ask("Find x.", "60", "The angles at O and P add up to 180°: 3x = 180.", "x = 60.", {
          asks: "angle at P",
          changed: "The angles are in algebra.",
          picture: kite(60, { P: "x", O: "2x" }),
        }),
        ask(
          "Find angle AOP.",
          "50",
          "OP cuts the kite in half. Find angle AOB first.",
          "50°: half of 100°.",
          {
            unit: "°",
            asks: "angle at O",
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
      ],
      "Right angles where the radius meets the tangent; equal tangents from one point.",
    ),

    mistake(
      "Kim finds angle AOB.",
      ["OAP = OBP = 90°", "AOB = 180° − 64° − 90°", "AOB = 26°"],
      1,
      "OAPB is a quadrilateral: 360° − 90° − 90° − 64° = 116°.",
      kite(64, { P: "64°", O: "?" }),
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

    summary(
      "What to remember",
      ["**A tangent meets a radius at 90°.**", "Two tangents from one point are equal."],
      kite(50, { A: "90°", B: "90°", P: "50°", O: "130°" }),
      [
        "**A tangent meets a radius at 90°.**",
        "Two tangents from one point are equal.",
        "OAP = OBP = 90° (a tangent meets a radius at 90°)",
        "AOB = 360° − 90° − 90° − 50° = 130° (angles in a quadrilateral add up to 360°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
tangentsLesson.plan = "stepped";
tangentsLesson.method = tangentsMethod;
tangentsLesson.variation = {
  relationship: "in kite OAPB, the right angles at A and B leave angle O + angle P = 180°; PA = PB",
  unknowns: ["angle at O", "angle at P", "length"],
  surface: ["numbers", "turned diagram", "half the kite", "a length", "algebra"],
};

// 6. The alternate segment theorem, on the stepped plan.

const alternateMethod = [
  "Find the tangent and the chord from T.",
  "Mark the angle between them.",
  "Look across the chord for the equal angle.",
];

const alternateLesson = lesson(
  U,
  "alternate-segment",
  SKILL,
  "The alternate segment",
  "The angle between a tangent and a chord equals the angle in the other segment.",
  [
    explain(
      "The rule",
      "The alternate segment",
      ["**The angle between a tangent and a chord equals the angle in the alternate segment.**"],
      alternate(55, { tangent: "55°", B: "55°" }),
      "Alternate means the other side of the chord.",
    ),
    tagged(
      "The rule",
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
        },
      ),
    ),

    tap(
      "Check you remember",
      "Tap the tangent.",
      alternate(55, {}, 150, { tap: true }),
      "RS",
      "A tangent touches the circle once, at T.",
      "RS: it touches the circle at T and doesn't cut it.",
      { wrong: { TA: "TA is a chord.", TB: "TB is a chord.", AB: "AB is a chord." } },
    ),
    tap(
      "Check you remember",
      "Tap the chord TA.",
      alternate(55, {}, 150, { tap: true }),
      "TA",
      "A chord joins two points on the circle.",
      "TA: it joins T and A, both on the circle.",
      { wrong: { RS: "RS is the tangent.", TB: "That's TB.", AB: "That's AB." } },
    ),
    typed(
      "Check you remember",
      "Find the angle marked ?.",
      "125",
      "Angles on a straight line add up to 180°.",
      "125°.",
      {
        unit: "°",
        picture: tangentChord(20, [
          ["STA", "55°"],
          ["ATR", "?"],
        ]),
      },
    ),

    methodCard("The method", alternateMethod, alternate(62, { tangent: "62°", B: "?" })),
    worked(
      "Watch the method",
      "Find angle TBA.",
      [
        {
          line: "TBA = STA",
          reason: ALTERNATE,
          note: "Look across the chord TA, into the other segment.",
        },
        { line: "TBA = 62°" },
      ],
      "Tangent–chord angle = the angle across the chord.",
      alternate(62, { tangent: "62°", B: "?" }),
    ),
    calc(
      "Your turn",
      "Find angle TBA.",
      alternate(48, { tangent: "48°", B: "?" }),
      [["TBA =", "48", "Look across the chord TA.", { after: "°", reason: ALTERNATE }]],
      "Angle TBA is 48°.",
    ),

    calc(
      "Practise",
      "Find angle STA.",
      alternate(50, { tangent: "?", B: "50°" }),
      [["STA =", "50", "The angle across the chord is equal.", { after: "°", reason: ALTERNATE }]],
      "Angle STA is 50°.",
    ),
    questionSet(
      "Practise",
      "RS is a tangent at T. Find the missing angle.",
      [
        ask("Find angle TBA.", "40", "Look across the chord TA.", "40°.", {
          unit: "°",
          asks: "segment angle",
          picture: alternate(40, { tangent: "40°", B: "?" }),
        }),
        ask("Find angle TBA.", "40", "B is still across the chord.", "40°.", {
          unit: "°",
          asks: "segment angle",
          changed: "B has moved along its arc.",
          picture: alternate(40, { tangent: "40°", B: "?" }, 100),
        }),
        ask("Find angle TBA.", "70", "Look across the chord TA.", "70°.", {
          unit: "°",
          asks: "segment angle",
          changed: "The chord TA is steeper.",
          picture: alternate(70, { tangent: "70°", B: "?" }),
        }),
        ask(
          "Find angle STA.",
          "38",
          "The tangent–chord angle equals the angle across the chord.",
          "38°.",
          {
            unit: "°",
            asks: "tangent angle",
            changed: "Now the tangent–chord angle is missing.",
            picture: alternate(38, { tangent: "?", B: "38°" }, 110),
          },
        ),
      ],
      "Always look across the chord.",
    ),

    questionSet(
      "Variation",
      "Same rule, new look.",
      [
        ask("Find x.", "18", "The two angles are equal: 4x = 72.", "x = 18.", {
          asks: "tangent angle",
          picture: alternate(72, { tangent: "4x", B: "72°" }),
        }),
        ask("Find angle TAB.", "58", "Use the other chord, TB. Look across it.", "58°.", {
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
        }),
        ask("Find angle ATB.", "65", "Find angle TBA first. Then use the triangle.", "65°.", {
          unit: "°",
          asks: "segment angle",
          changed: "The rule is one step of a longer problem.",
          picture: alternate(55, { tangent: "55°", A: "60°", T: "?" }, 150),
        }),
        ask(
          "Is angle TCA equal to angle STA?",
          "No",
          "The equal angle is across the chord.",
          "No: C is on the same side of TA as S.",
          {
            changed: "C is on the same side as the tangent angle.",
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
      "Each chord from T has its own pair of equal angles.",
    ),

    mistake(
      "Zoe finds angle TBA.",
      ["TA is a radius, so STA is 90°.", "So TBA = 90° − 52°", "TBA = 38°"],
      0,
      "TA is a chord, not a radius. By the alternate segment theorem, TBA = 52°.",
      alternate(52, { tangent: "52°", B: "?" }),
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

    summary(
      "What to remember",
      ["**The angle between a tangent and a chord equals the angle in the alternate segment.**"],
      alternate(55, { tangent: "55°", B: "55°" }),
      [
        "**The angle between a tangent and a chord equals the angle in the alternate segment.**",
        "Draw the tangent RS at T, the chord TA, and B across the chord.",
        "TBA = STA = 55° (alternate segment theorem)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
);
alternateLesson.plan = "stepped";
alternateLesson.method = alternateMethod;
alternateLesson.variation = {
  relationship: "angle between tangent and chord = angle in the alternate segment",
  unknowns: ["tangent angle", "segment angle"],
  surface: ["numbers", "where B sits", "steeper chord", "the other chord", "algebra", "same side"],
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
