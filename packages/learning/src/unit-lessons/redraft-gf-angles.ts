// GCSE Foundation, "Angles", on the stepped template (docs/proposals/lesson-stepped.md): angles
// with parallel lines, in triangles and in polygons, and proofs. Every angle question is asked on
// its diagram, with the given angles on it and only what to find in words; the written reasons
// come from the shared list.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { type Corner, parallels, regular } from "./geometry.ts";
import { gfAngles, proofTriangle } from "./gf-angles.ts";
import { REASON } from "./reasons.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Point, ShapePic, UnitLesson } from "./types.ts";
import { triangle } from "./y7-angles.ts";

const AN = gfAngles;
const WORDS = "Facts and reasons: the words are the picture.";
const p = (x: number, y: number): Point => ({ x, y });
const ISOSCELES = "base angles of an isosceles triangle are equal";
const EXTERIOR = "the exterior angle equals the two opposite interior angles";
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Parallel lines crossed at `deg`, with an angle marked at each crossing. */
const lines = (deg: number, low: [Corner, string] | null, high: [Corner, string] | null) =>
  parallels(deg, [
    ...(low ? [{ on: "lower" as const, corner: low[0], label: low[1] }] : []),
    ...(high ? [{ on: "upper" as const, corner: high[0], label: high[1] }] : []),
  ]);
/** One line crossed by another, two angles marked at the crossing. */
const crossing = (deg: number, a: [Corner, string], b: [Corner, string]): DrawingPic =>
  parallels(
    deg,
    [
      { on: "lower", corner: a[0], label: a[1] },
      { on: "lower", corner: b[0], label: b[1] },
    ],
    false,
  );

/** A triangle with angles A at the left and B at the right, its base run on past B, and labels
 * for the angle at A, the top angle and the exterior angle at B. */
const outside = (A: number, B: number, [a, c, e]: [string, string, string]): DrawingPic => {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = 7 / (1 / Math.tan(r(A)) + 1 / Math.tan(r(B)));
  const top = p(h / Math.tan(r(A)), h);
  return {
    kind: "drawing",
    items: [
      { line: [p(0, 0), p(7, 0)] },
      { line: [p(7, 0), p(9.5, 0)], tone: "soft" },
      { line: [p(0, 0), top] },
      { line: [p(7, 0), top] },
      { angle: p(0, 0), from: 0, to: A, label: a },
      { angle: top, from: 180 + A, to: 360 - B, label: c },
      { angle: p(7, 0), from: 0, to: 180 - B, label: e },
    ],
  };
};

// ---------------------------------------------------------------------------------------------
// Angles and parallel lines.

const PARALLEL = "gf-angles/parallel";
const parMethod = [
  "Find the angle you know and the one you want.",
  "Spot the shape: Z, F or C.",
  "Z and F: equal. C: take from 180°. Name the rule.",
];
const ZED = lines(60, ["up-right", "60°"], ["down-left", "x"]);
const REASONS = [
  REASON.zAngles,
  REASON.fAngles,
  REASON.cAngles,
  REASON.straightLine,
  REASON.opposite,
].map(cap);
const why = (right: string, extra: Record<string, unknown>) =>
  pick(
    "Give the reason for y.",
    cap(right),
    REASONS.filter((r) => r !== cap(right)).slice(0, 2),
    "Z, F, C, or a straight line?",
    { asks: "reason", ...extra },
  );

const parallel = stepped(find(AN, PARALLEL), {
  method: parMethod,
  variation: {
    relationship: "angles where a line crosses two parallel lines",
    unknowns: ["angle", "reason"],
    surface: ["Z shapes", "F shapes", "C shapes", "one crossing"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three rules",
        ["**Alternate (Z) and corresponding (F) are equal. Co-interior (C) add to 180°.**"],
        ZED,
        "Write the rule's name as your reason, not “Z angles”.",
      ),
      reworded(AN, PARALLEL, "Which rule?", { tag: "The rule" }),

      ...owned(AN, PARALLEL, "Warm-up", "Check you remember"),

      methodCard("The method", parMethod, ZED),
      workedFrom(AN, PARALLEL),
      calc(
        "Your turn",
        "Find a.",
        lines(55, ["up-right", "55°"], ["up-right", "a"]),
        [["$a =$", "55", "Same position: an F.", { after: "°", reason: REASON.fAngles }]],
        "$a = 55°$.",
      ),

      calc(
        "Practise",
        "Find c.",
        lines(70, ["up-right", "70°"], ["down-right", "c"]),
        [["$c =$", "110", "Same side, inside: a C.", { after: "°", reason: REASON.cAngles }]],
        "$c = 110°$.",
      ),
      ...owned(AN, PARALLEL, "Together", "Practise"),
      ...owned(AN, PARALLEL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find x. Watch what changes.",
        [
          ask("Find x.", "65", "A Z: equal.", "65°.", {
            asks: "angle",
            unit: "°",
            picture: lines(65, ["up-right", "65°"], ["down-left", "x"]),
          }),
          ask("Find x now.", "65", "An F: equal.", "65°.", {
            asks: "angle",
            unit: "°",
            changed: "Same position.",
            picture: lines(65, ["up-right", "65°"], ["up-right", "x"]),
          }),
          ask("And now?", "115", "A C: they add to 180°.", "115°.", {
            asks: "angle",
            unit: "°",
            changed: "Same side, inside.",
            picture: lines(65, ["up-right", "65°"], ["down-right", "x"]),
          }),
          ask("And this one?", "65", "Vertically opposite.", "65°.", {
            asks: "angle",
            unit: "°",
            changed: "Across the crossing.",
            picture: crossing(65, ["up-right", "65°"], ["down-left", "x"]),
          }),
        ],
        "Z and F are equal; C adds to 180°.",
      ),

      questionSet(
        "Variation",
        "Name the rule. Watch what changes.",
        [
          why(REASON.zAngles, {
            picture: lines(70, ["up-right", "70°"], ["down-left", "y"]),
            expect: [
              "Pip says alternate angles add to 180°. Right?",
              "No",
              "Alternate angles are equal: a Z.",
              [["Yes", "Look at the Z."]],
            ],
          }),
          why(REASON.fAngles, {
            changed: "An F.",
            picture: lines(70, ["up-right", "70°"], ["up-right", "y"]),
          }),
          why(REASON.cAngles, {
            changed: "A C.",
            picture: lines(70, ["up-right", "70°"], ["down-right", "y"]),
          }),
          why(REASON.straightLine, {
            changed: "One crossing.",
            picture: crossing(70, ["up-right", "70°"], ["up-left", "y"]),
          }),
        ],
        "The shape of the angles names the rule.",
      ),
      reworded(AN, PARALLEL, "Where did it go wrong?", {
        text: "Pip finds $y$. The marked angles are alternate.",
      }),

      own(AN, PARALLEL, "Exit check"),

      reworded(
        AN,
        PARALLEL,
        "“Find $x$. Give reasons for your answer.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Alternate (Z) and corresponding (F) are equal. Co-interior (C) add to 180°.**"],
        ZED,
        [
          "**Alternate (Z) and corresponding (F) are equal. Co-interior (C) add to 180°.**",
          "Write “alternate angles are equal”, not “Z angles”.",
          "Alternate angles are equal; they don't add to 180°.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Angles in triangles.

const TRIANGLES = "gf-angles/triangles";
const triMethod = [
  "Angles in a triangle add to 180°.",
  "Isosceles: the base angles are equal.",
  "Exterior angle = the two opposite interior angles.",
];
const OUT = outside(45, 70, ["45°", "65°", "e"]);

const triangles = stepped(find(AN, TRIANGLES), {
  method: triMethod,
  variation: {
    relationship: "the angles of a triangle, inside and out",
    unknowns: ["angle", "base"],
    surface: ["right angles", "isosceles", "exterior angles", "sharp tops"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two rules",
        [
          "**Angles in a triangle add to 180°. An exterior angle equals the two opposite interior angles.**",
        ],
        OUT,
        "Here $e = 45° + 65° = 110°$.",
      ),

      ...owned(AN, TRIANGLES, "Warm-up", "Check you remember"),

      methodCard("The method", triMethod, OUT),
      workedFrom(AN, TRIANGLES),
      calc(
        "Your turn",
        "Isosceles. Find b and t.",
        triangle(55, 55, ["55°", "b", "t"]),
        [
          ["$b =$", "55", "The base angles match.", { after: "°", reason: ISOSCELES }],
          ["$t =$", "70", "Take both from 180°.", { after: "°", reason: REASON.triangle }],
        ],
        "$b = 55°$, $t = 70°$.",
      ),

      calc(
        "Practise",
        "Find e.",
        outside(50, 75, ["50°", "55°", "e"]),
        [["$e =$", "105", "Add the two opposite angles.", { after: "°", reason: EXTERIOR }]],
        "$e = 105°$.",
      ),
      ...owned(AN, TRIANGLES, "Together", "Practise"),
      ...owned(AN, TRIANGLES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find x. Watch what changes.",
        [
          ask("Find x.", "70", "Take both from 180°.", "70°.", {
            asks: "angle",
            unit: "°",
            picture: triangle(60, 50, ["60°", "50°", "x"]),
          }),
          ask("Find x now.", "50", "The square is 90°.", "50°.", {
            asks: "angle",
            unit: "°",
            changed: "A right angle.",
            picture: triangle(90, 40, [null, "40°", "x"], 0),
          }),
          ask("Isosceles. Find x.", "50", "Both base angles from 180°.", "50°.", {
            asks: "angle",
            unit: "°",
            changed: "Isosceles.",
            picture: triangle(65, 65, ["65°", null, "x"]),
          }),
          ask("Find the exterior angle x.", "100", "Add the two opposite angles.", "100°.", {
            asks: "angle",
            unit: "°",
            changed: "Outside.",
            picture: outside(45, 80, ["45°", "55°", "x"]),
          }),
        ],
        "Inside: 180°. Outside: add the opposite two.",
      ),

      questionSet(
        "Variation",
        "Isosceles. Find a base angle. Watch what changes.",
        [
          ask("Find x.", "65", "Halve what's left.", "65°.", {
            asks: "base",
            unit: "°",
            picture: triangle(65, 65, ["x", "x", "50°"]),
            expect: [
              "Top 50°: Ola says each base angle is 130°. Right?",
              "No",
              "130° is both together: 65° each.",
              [["Yes", "Two base angles share it."]],
            ],
          }),
          ask("Find x now.", "50", "Halve what's left.", "50°.", {
            asks: "base",
            unit: "°",
            changed: "Wider top.",
            picture: triangle(50, 50, ["x", "x", "80°"]),
          }),
          ask("And now?", "45", "Halve what's left.", "45°.", {
            asks: "base",
            unit: "°",
            changed: "A right angle at the top.",
            picture: triangle(45, 45, ["x", "x", "90°"]),
          }),
          ask("And this one?", "80", "Halve what's left.", "80°.", {
            asks: "base",
            unit: "°",
            changed: "A sharp top.",
            picture: triangle(80, 80, ["x", "x", "20°"]),
          }),
        ],
        "Take the top from 180°, then halve.",
      ),
      reworded(AN, TRIANGLES, "Where did it go wrong?", {
        text: "Isosceles, top angle 50°. Ola finds the base angles.",
      }),

      own(AN, TRIANGLES, "Exit check"),

      reworded(
        AN,
        TRIANGLES,
        "“The roof is isosceles with base angle 35°. Find the top angle. Give reasons.”",
        {
          tag: "Real life",
          title: "The roof is isosceles. Find the top angle, with reasons.",
          picture: triangle(35, 35, ["35°", null, "?"]),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Angles in a triangle add to 180°. An exterior angle equals the two opposite interior angles.**",
        ],
        OUT,
        [
          "**Angles in a triangle add to 180°. An exterior angle equals the two opposite interior angles.**",
          "Isosceles: the base angles are equal.",
          "Top 50°: base angles $130 \\div 2 = 65°$ each.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Angles in polygons.

const POLYGONS = "gf-angles/polygons";
const polyMethod = [
  "Interior sum: (n − 2) × 180°.",
  "Regular: exterior = 360° ÷ n.",
  "Interior = 180° − exterior.",
];
const fan = (n: number): ShapePic => {
  const pts = regular(n, 3, 90);
  const [first] = pts;
  return {
    kind: "shape",
    points: pts,
    ...(first ? { dashed: pts.slice(2, -1).map((q): [Point, Point] => [first, q]) } : {}),
  };
};
const HEX = fan(6);

const polygons = stepped(find(AN, POLYGONS), {
  method: polyMethod,
  variation: {
    relationship: "a polygon's sides and its angles",
    unknowns: ["sum", "exterior", "sides"],
    surface: ["more sides", "regular polygons", "working backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Triangles inside",
        ["**Interior angles add to (n − 2) × 180°. Exterior angles add to 360°.**"],
        HEX,
        "From one corner, a hexagon splits into 4 triangles.",
      ),
      reworded(AN, POLYGONS, "Interior angles of a hexagon add to", { tag: "The rule" }),

      ...owned(AN, POLYGONS, "Warm-up", "Check you remember"),

      methodCard("The method", polyMethod, HEX),
      workedFrom(AN, POLYGONS),
      calc(
        "Your turn",
        "A regular 12-sided polygon.",
        undefined,
        [
          ["Exterior: $360 \\div 12 =$", "30", "Exterior angles add to 360°.", { after: "°" }],
          ["Interior: $180 - 30 =$", "150", "They make a straight line.", { after: "°" }],
        ],
        "Exterior 30°, interior 150°.",
      ),

      calc(
        "Practise",
        "Find the angle sum.",
        fan(7),
        [
          ["Triangles inside:", "5", "7 − 2."],
          ["Angle sum:", "900", "5 × 180°.", { after: "°" }],
        ],
        "A heptagon's angles add to 900°.",
      ),
      ...owned(AN, POLYGONS, "Together", "Practise"),
      ...owned(AN, POLYGONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Interior angle sum. Watch what changes.",
        [
          ask("A quadrilateral", "360", "2 triangles.", "360°.", { asks: "sum", unit: "°" }),
          ask("A hexagon", "720", "4 triangles.", "720°.", {
            asks: "sum",
            unit: "°",
            changed: "Two more sides.",
          }),
          ask("A decagon (10 sides)", "1440", "8 triangles.", "1440°.", {
            asks: "sum",
            unit: "°",
            changed: "Ten sides.",
          }),
          ask("A 20-sided polygon", "3240", "18 triangles.", "3240°.", {
            asks: "sum",
            unit: "°",
            changed: "Twenty sides.",
          }),
        ],
        "Each extra side adds 180°.",
      ),

      questionSet(
        "Variation",
        "Regular polygons. Watch what changes.",
        [
          ask("Interior 120°: the exterior angle?", "60", "180 − 120.", "60°.", {
            asks: "exterior",
            unit: "°",
            expect: [
              "Interior 120°: Sam says exterior 240°. Right?",
              "No",
              "Interior + exterior = 180°: the exterior is 60°.",
              [["Yes", "They sit on a straight line."]],
            ],
          }),
          ask("10 sides: the exterior angle?", "36", "360 ÷ 10.", "36°.", {
            asks: "exterior",
            unit: "°",
            changed: "From the sides.",
          }),
          ask("Exterior 30°: how many sides?", "12", "360 ÷ 30.", "12.", {
            asks: "sides",
            changed: "Backwards.",
          }),
          ask("Interior 160°: how many sides?", "18", "Exterior 20°; 360 ÷ 20.", "18.", {
            asks: "sides",
            changed: "From the interior.",
          }),
        ],
        "Exterior angles are the way in: they add to 360°.",
      ),
      own(AN, POLYGONS, "Spot the mistake"),

      own(AN, POLYGONS, "Exit check"),

      reworded(
        AN,
        POLYGONS,
        "“Show why regular pentagons can't tessellate.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Interior angles add to (n − 2) × 180°. Exterior angles add to 360°.**"],
        HEX,
        [
          "**Interior angles add to (n − 2) × 180°. Exterior angles add to 360°.**",
          "A hexagon: 4 triangles from one corner, not 6.",
          "Interior + exterior = 180°.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Proving angle facts.

const PROOF = "gf-angles/proof";
const proofMethod = [
  "Say what you're proving.",
  "Use known facts, each with its reason.",
  "End on the thing you set out to prove.",
];
const PARALLEL_TOP = proofTriangle(true);
const QUAD: ShapePic = {
  kind: "shape",
  points: [p(0, 0), p(6, 0), p(5, 4), p(1, 3)],
  dashed: [[p(0, 0), p(5, 4)]],
};
const BECAUSE = [REASON.straightLine, REASON.opposite, REASON.zAngles, REASON.cAngles].map(cap);
const because = (prompt: string, right: string, extra: Record<string, unknown>) =>
  pick(
    prompt,
    cap(right),
    BECAUSE.filter((r) => r !== cap(right)).slice(0, 2),
    "Which fact links them?",
    {
      asks: "reason",
      ...extra,
    },
  );

const proof = stepped(find(AN, PROOF), {
  method: proofMethod,
  variation: {
    relationship: "a proof: facts and reasons that work every time",
    unknowns: ["reason", "proof"],
    surface: ["one crossing", "parallel lines", "examples or reasons"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "What a proof is",
        ["**A proof uses known facts, with a reason at every step.**"],
        PARALLEL_TOP,
        "Examples aren't proof: it must work every time.",
      ),

      ...owned(AN, PROOF, "Warm-up", "Check you remember"),

      methodCard("The method", proofMethod, PARALLEL_TOP),
      workedFrom(AN, PROOF),
      calc(
        "Your turn",
        "Why do a quadrilateral's angles add to 360°?",
        QUAD,
        [
          ["Triangles:", "2", "The diagonal splits it."],
          ["$2 \\times 180 =$", "360", "Angles in a triangle add to 180°.", { after: "°" }],
        ],
        "Two triangles: 360°.",
      ),

      calc(
        "Practise",
        "Why do a pentagon's angles add to 540°?",
        fan(5),
        [
          ["Triangles:", "3", "From one corner."],
          ["$3 \\times 180 =$", "540", "Angles in a triangle add to 180°.", { after: "°" }],
        ],
        "Three triangles: 540°.",
      ),
      ...owned(AN, PROOF, "Together", "Practise"),
      reworded(
        AN,
        PROOF,
        "In a parallelogram, the first angle is $x$. Show the next is $180 - x$. Reason:",
        {
          tag: "Practise",
          title: "Parallelogram: one angle $x$, the next $180 - x$. Reason:",
        },
      ),
      reworded(AN, PROOF, "Prove a quadrilateral's angles add to 360°. First step:", {
        tag: "Practise",
      }),
      questionSet(
        "Practise",
        "Which reason? Watch what changes.",
        [
          because("Why does a + b = 180°?", REASON.straightLine, {
            picture: crossing(70, ["up-right", "a"], ["up-left", "b"]),
          }),
          because("Why does a = b?", REASON.opposite, {
            changed: "Opposite.",
            picture: crossing(70, ["up-right", "a"], ["down-left", "b"]),
          }),
          because("Why does a = b here?", REASON.zAngles, {
            changed: "Parallel lines.",
            picture: lines(65, ["up-right", "a"], ["down-left", "b"]),
          }),
          because("Why does a + b = 180° here?", REASON.cAngles, {
            changed: "Same side.",
            picture: lines(65, ["up-right", "a"], ["down-right", "b"]),
          }),
        ],
        "Every step needs its reason.",
      ),

      questionSet(
        "Variation",
        "Is it a proof? Watch what changes.",
        [
          pick(
            "Kim measures five triangles: each is 180°.",
            "No: only examples",
            ["Yes"],
            "Could the sixth differ?",
            {
              asks: "proof",
              expect: [
                "Will checking more triangles ever make a proof?",
                "No",
                "Only reasons that work every time prove it.",
                [["Yes", "Could the next one be different?"]],
              ],
            },
          ),
          pick(
            "Ali uses alternate angles and a straight line.",
            "Yes",
            ["No: only examples"],
            "Facts with reasons.",
            {
              asks: "proof",
              changed: "Reasons, not examples.",
            },
          ),
          pick(
            "Jo writes x = 70° with no reason.",
            "No: no reason",
            ["Yes"],
            "Each step needs a reason.",
            {
              asks: "proof",
              changed: "No reason.",
            },
          ),
          pick(
            "Raj measures 100 triangles.",
            "No: only examples",
            ["Yes"],
            "Still only examples.",
            {
              asks: "proof",
              changed: "More examples.",
            },
          ),
        ],
        "Reasons prove; examples only check.",
      ),
      own(AN, PROOF, "Spot the mistake"),

      own(AN, PROOF, "Exit check"),

      reworded(
        AN,
        PROOF,
        "“Prove that the angles in a triangle add up to 180°.” The key step is",
        {
          tag: "Real life",
          title: "Prove a triangle's angles add to 180°. The key step?",
          picture: proofTriangle(false),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A proof uses known facts, with a reason at every step.**"],
        PARALLEL_TOP,
        [
          "**A proof uses known facts, with a reason at every step.**",
          "Triangle: a parallel line, alternate angles, a straight line.",
          "Quadrilateral: two triangles, 2 × 180°.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

export const gfAnglesStepped: [string, UnitLesson[]][] = [
  [PARALLEL, [parallel]],
  [TRIANGLES, [triangles]],
  [POLYGONS, [polygons]],
  [PROOF, [proof]],
];
