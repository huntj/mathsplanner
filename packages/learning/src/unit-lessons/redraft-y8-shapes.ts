// Year 8, "Angles and shapes", on the stepped template (docs/proposals/lesson-stepped.md):
// alternate and corresponding angles on parallel lines, and naming the parts of a triangle. Every
// question is asked on its diagram, with the angle or letter to find marked on it.
import {
  ask,
  calc,
  choose,
  explain,
  explore,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import { parallels, type Corner } from "./geometry.ts";
import { REASON } from "./reasons.ts";
import { find, own, owned, reworded, stepped, tagged, words, workedFrom } from "./stepped.ts";
import type { DrawingPic, Picture, Point, ShapePic, UnitLesson } from "./types.ts";
import { PRISM, SQUARE_PYRAMID, y8Shapes } from "./y8-shapes.ts";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

const SH = y8Shapes;

/** Parallel lines crossed at `deg`, with an angle marked at each crossing. */
const lines = (
  deg: number,
  low: [Corner, string] | null,
  high: [Corner, string] | null,
  arrows = true,
): DrawingPic =>
  parallels(
    deg,
    [
      ...(low ? [{ on: "lower" as const, corner: low[0], label: low[1] }] : []),
      ...(high ? [{ on: "upper" as const, corner: high[0], label: high[1] }] : []),
    ],
    arrows,
  );

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

/** The parallels and crossing line to drag: the top end of the crossing line slides. */
const SLIDE = {
  kind: "geometry" as const,
  points: [
    { name: "A", at: { x: 0, y: 0 } },
    { name: "B", at: { x: 6, y: 0 } },
    { name: "C", at: { x: 0, y: 3 } },
    { name: "D", at: { x: 6, y: 3 } },
    { name: "P", at: { x: 2, y: 0 } },
    { name: "Q", free: { x: 3.5, y: 3 }, drag: { xMin: 0.8, xMax: 5.2, yMin: 3, yMax: 3 } },
  ],
  lines: ["AB", "CD", "PQ"],
};

// ---------------------------------------------------------------------------------------------
// Alternate angles.

const ALT = "y8-shapes/alternate";
const altMethod = [
  "Find the angles between the parallel lines.",
  "Opposite sides of the crossing line? They're alternate.",
  "Alternate angles are equal. Give the reason.",
];

const alternate = stepped(find(SH, ALT), {
  method: altMethod,
  variation: {
    relationship: "alternate angles are equal",
    unknowns: ["angle", "is it alternate?"],
    surface: ["steep and shallow lines", "leaning the other way", "no arrows"],
  },
  screens: [
    explain(
      "The rule",
      "Z angles",
      ["**Alternate angles are equal: they make a Z.**"],
      lines(65, ["up-right", "65°"], ["down-left", "65°"]),
      "Both between the parallels, on opposite sides of the crossing line.",
    ),
    tagged(
      "The rule",
      explore(
        "Tilt the crossing line",
        {
          ...SLIDE,
          angles: [{ name: "BPQ" }, { name: "CQP" }],
          readouts: [
            { label: "Bottom angle", angle: "BPQ" },
            { label: "Top angle", angle: "CQP" },
          ],
        },
        [
          "What do you notice about the two angles?",
          "They are always equal",
          "However the line tilts, the two angles in the Z match.",
          [
            ["They add to 180°", "Look again: they show the same number."],
            ["The top one is bigger", "Drag Q: they change together."],
          ],
        ],
        "Alternate angles are always equal when the lines are parallel.",
        { text: "Drag Q along the top line. Watch both angles." },
      ),
    ),
    reworded(SH, ALT, "Find y", {
      tag: "The rule",
      text: "y is on the other side of the crossing line.",
    }),

    typed("Check you remember", "Find a.", "110", "Angles on a straight line.", "110°.", {
      unit: "°",
      picture: crossing(70, ["up-right", "70°"], ["up-left", "a"]),
    }),
    typed("Check you remember", "Find b.", "70", "Vertically opposite angles.", "70°.", {
      unit: "°",
      picture: crossing(70, ["up-right", "70°"], ["down-left", "b"]),
    }),

    methodCard("The method", altMethod, lines(65, ["up-right", "65°"], ["down-left", "x"])),
    workedFrom(SH, ALT),
    calc(
      "Your turn",
      "Find a.",
      lines(50, ["up-right", "50°"], ["down-left", "a"]),
      [["$a =$", "50", "They make a Z.", { after: "°", reason: REASON.zAngles }]],
      "$a = 50°$.",
    ),

    calc(
      "Practise",
      "Find z.",
      lines(60, ["up-right", "60°"], ["down-right", "z"]),
      [
        [
          "The Z angle at the top:",
          "60",
          "Alternate to the 60°.",
          { after: "°", reason: REASON.zAngles },
        ],
        [
          "$z = 180 - 60 =$",
          "120",
          "z is next to it on the line.",
          { after: "°", reason: REASON.straightLine },
        ],
      ],
      "$z = 120°$.",
    ),
    ...owned(SH, ALT, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find x.", "75", "They make a Z.", "75°.", {
          unit: "°",
          asks: "angle",
          picture: lines(75, ["up-right", "75°"], ["down-left", "x"]),
        }),
        ask("Find x.", "105", "The other Z.", "105°.", {
          unit: "°",
          asks: "angle",
          changed: "The other pair.",
          picture: lines(75, ["up-left", "105°"], ["down-right", "x"]),
        }),
        ask("Find y.", "105", "Z first, then a straight line.", "105°.", {
          unit: "°",
          asks: "angle",
          changed: "Two steps.",
          picture: lines(75, ["up-right", "75°"], ["down-right", "y"]),
        }),
        ask(
          "Are these two angles alternate?",
          "No",
          "x isn't between the lines.",
          "No: x is above the top line.",
          {
            asks: "is it alternate?",
            changed: "Is it a Z?",
            others: ["Yes"],
            picture: lines(75, ["up-right", "75°"], ["up-left", "x"]),
          },
        ),
      ],
      "Find the Z, then use it.",
    ),

    questionSet(
      "Variation",
      "Find x. Watch what changes.",
      [
        ask("Find x.", "40", "They make a Z.", "40°.", {
          unit: "°",
          asks: "angle",
          picture: lines(40, ["up-right", "40°"], ["down-left", "x"]),
          expect: [
            "Pip says alternate angles add to 180°. Right?",
            "No",
            "Alternate angles are equal: x = 40°.",
            [["Yes", "Adding to 180° is angles on a straight line."]],
          ],
        }),
        ask("Find x.", "70", "They make a Z.", "70°.", {
          unit: "°",
          asks: "angle",
          changed: "A steeper line.",
          picture: lines(70, ["up-right", "70°"], ["down-left", "x"]),
        }),
        ask("Find x.", "110", "A back-to-front Z.", "110°.", {
          unit: "°",
          asks: "angle",
          changed: "Leaning the other way.",
          picture: lines(110, ["up-right", "110°"], ["down-left", "x"]),
        }),
        ask(
          "Must x equal the marked angle?",
          "Not unless the lines are parallel",
          "Look for the arrows.",
          "Only parallel lines make equal Z angles.",
          {
            asks: "is it alternate?",
            changed: "No arrows.",
            others: ["Yes, always"],
            picture: lines(70, ["up-right", "70°"], ["down-left", "x"], false),
          },
        ),
      ],
      "Equal, however the line leans, if the lines are parallel.",
    ),
    reworded(
      SH,
      ALT,
      "Where did it go wrong?",
      { text: "Pip finds y. The two angles are alternate." },
      "Spot the mistake",
    ),

    quiz([
      [
        [
          "Find x.",
          "65°",
          ["115°", "25°"],
          "They make a Z: alternate angles.",
          lines(65, ["up-right", "65°"], ["down-left", "x"]),
        ],
        [
          "Find x.",
          "55°",
          ["125°", "35°"],
          "They make a Z: alternate angles.",
          lines(55, ["up-right", "55°"], ["down-left", "x"]),
        ],
      ],
      [
        [
          "The marked angles make which letter?",
          "Z",
          ["F", "C"],
          "Alternate angles make a Z.",
          lines(70, ["up-right", "a"], ["down-left", "b"]),
        ],
        [
          "The marked angles make which letter?",
          "Z",
          ["F", "C"],
          "Alternate angles make a Z.",
          lines(50, ["up-left", "a"], ["down-right", "b"]),
        ],
      ],
      [
        [
          "Find x.",
          "120°",
          ["60°", "30°"],
          "Alternate to the 120°.",
          lines(60, ["up-left", "120°"], ["down-right", "x"]),
        ],
        [
          "Find x.",
          "130°",
          ["50°", "40°"],
          "Alternate to the 130°.",
          lines(50, ["up-left", "130°"], ["down-right", "x"]),
        ],
      ],
    ]),

    reworded(SH, ALT, "The level crossing", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Alternate angles are equal: they make a Z.**"],
      lines(65, ["up-right", "65°"], ["down-left", "65°"]),
      [
        "**Alternate angles are equal: they make a Z.**",
        "Both between the parallels, on opposite sides.",
        "Only when the lines are parallel.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Corresponding angles.

const COR = "y8-shapes/corresponding";
const corMethod = [
  "Find the angle in the same position at the other crossing.",
  "Same position: they're corresponding, so equal.",
  "Give the reason: corresponding angles.",
];

const corresponding = stepped(find(SH, COR), {
  method: corMethod,
  variation: {
    relationship: "corresponding angles are equal",
    unknowns: ["angle", "which rule"],
    surface: ["above and below the lines", "F, Z and C shapes", "two steps"],
  },
  screens: [
    explain(
      "The rule",
      "F angles",
      ["**Corresponding angles are equal: they make an F.**"],
      lines(65, ["up-right", "65°"], ["up-right", "65°"]),
      "Same position at each crossing.",
    ),
    reworded(SH, COR, "Slide it up", {
      tag: "The rule",
      text: "Slide the bottom crossing up. Where does it land?",
    }),
    reworded(SH, COR, "F, Z or C?", { tag: "The rule" }),

    typed("Check you remember", "Find x.", "55", "They make a Z.", "55°.", {
      unit: "°",
      picture: lines(55, ["up-right", "55°"], ["down-left", "x"]),
    }),
    typed("Check you remember", "Find y.", "115", "Angles on a straight line.", "115°.", {
      unit: "°",
      picture: crossing(65, ["up-right", "65°"], ["up-left", "y"]),
    }),

    methodCard("The method", corMethod, lines(65, ["up-right", "65°"], ["up-right", "x"])),
    workedFrom(SH, COR),
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
      [
        [
          "The F angle at the top:",
          "70",
          "Same position as the 70°.",
          { after: "°", reason: REASON.fAngles },
        ],
        [
          "$c = 180 - 70 =$",
          "110",
          "c is next to it on the line.",
          { after: "°", reason: REASON.straightLine },
        ],
      ],
      "$c = 110°$.",
    ),
    ...owned(SH, COR, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find x.", "100", "Same position.", "100°.", {
          unit: "°",
          asks: "angle",
          picture: lines(80, ["up-left", "100°"], ["up-left", "x"]),
        }),
        ask("Find x.", "80", "Same position, below.", "80°.", {
          unit: "°",
          asks: "angle",
          changed: "Below the lines.",
          picture: lines(80, ["down-left", "80°"], ["down-left", "x"]),
        }),
        ask("Find x.", "100", "F first, then a straight line.", "100°.", {
          unit: "°",
          asks: "angle",
          changed: "Two steps.",
          picture: lines(80, ["up-right", "80°"], ["down-right", "x"]),
        }),
        ask("Which rule gives x?", "Alternate angles", "It's a Z.", "Alternate: a Z.", {
          asks: "which rule",
          changed: "Which letter?",
          others: ["Corresponding angles"],
          picture: lines(80, ["up-right", "80°"], ["down-left", "x"]),
        }),
      ],
      "Same position: equal.",
    ),

    questionSet(
      "Variation",
      "Find x. Watch what changes.",
      [
        ask("Find x.", "60", "Same position: an F.", "60°.", {
          unit: "°",
          asks: "angle",
          picture: lines(60, ["up-right", "60°"], ["up-right", "x"]),
          expect: [
            "Cal says x and 60° add to 180°. Right?",
            "No",
            "Same position at each crossing: corresponding, so equal.",
            [["Yes", "Adding to 180° is a straight line, not this."]],
          ],
        }),
        ask("Find x.", "60", "A Z this time.", "60°.", {
          unit: "°",
          asks: "angle",
          changed: "A Z, not an F.",
          picture: lines(60, ["up-right", "60°"], ["down-left", "x"]),
        }),
        ask("Find x.", "120", "A C: they add to 180°.", "120°.", {
          unit: "°",
          asks: "angle",
          changed: "A C shape.",
          picture: lines(60, ["up-right", "60°"], ["down-right", "x"]),
        }),
        ask("Find x.", "120", "F, then a straight line.", "120°.", {
          unit: "°",
          asks: "angle",
          changed: "Above, on the other side.",
          picture: lines(60, ["up-right", "60°"], ["up-left", "x"]),
        }),
      ],
      "F and Z angles are equal; C angles add to 180°.",
    ),
    own(SH, COR, "Spot the mistake"),

    quiz([
      [
        [
          "Find x.",
          "70°",
          ["110°", "20°"],
          "Same position: corresponding angles.",
          lines(70, ["up-right", "70°"], ["up-right", "x"]),
        ],
        [
          "Find x.",
          "50°",
          ["130°", "40°"],
          "Same position: corresponding angles.",
          lines(50, ["down-left", "50°"], ["down-left", "x"]),
        ],
      ],
      [
        [
          "The marked angles make which letter?",
          "F",
          ["Z", "C"],
          "Corresponding angles make an F.",
          lines(65, ["up-right", "a"], ["up-right", "b"]),
        ],
        [
          "The marked angles make which letter?",
          "F",
          ["Z", "C"],
          "Corresponding angles make an F.",
          lines(65, ["down-left", "a"], ["down-left", "b"]),
        ],
      ],
      [
        [
          "Find x.",
          "120°",
          ["60°", "30°"],
          "Same position as the 120°.",
          lines(60, ["up-left", "120°"], ["up-left", "x"]),
        ],
        [
          "Find x.",
          "100°",
          ["80°", "10°"],
          "Same position as the 100°.",
          lines(80, ["down-right", "100°"], ["down-right", "x"]),
        ],
      ],
    ]),

    reworded(SH, COR, "The shelves", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Corresponding angles are equal: they make an F.**"],
      lines(65, ["up-right", "65°"], ["up-right", "65°"]),
      [
        "**Corresponding angles are equal: they make an F.**",
        "Z angles are equal too.",
        "C angles add up to 180°.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Naming a triangle.

const NAMING = "y8-shapes/naming";
const namingMethod = [
  "Corners: capital letters.",
  "Sides: the small letter of the corner opposite.",
  "Angles: three letters. The middle one is the corner.",
];
const tri = (names: string[], sides?: (string | null)[]): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 2, y: 4 },
  ],
  names,
  ...(sides ? { sides } : {}),
});
const ABC = tri(["A", "B", "C"], ["c", "a", "b"]);

const naming = stepped(find(SH, NAMING), {
  method: namingMethod,
  variation: {
    relationship: "a corner, the side opposite it, and the angle at it",
    unknowns: ["side", "angle"],
    surface: ["different letters", "angles written backwards", "sides and angles"],
  },
  screens: [
    explain(
      "The rule",
      "Naming a triangle",
      ["**Side a is opposite corner A.**"],
      ABC,
      "Small letter, same as the corner it doesn't touch.",
    ),
    reworded(SH, NAMING, "Label the sides a, b and c", { tag: "The rule" }),
    reworded(SH, NAMING, "Naming angles", { tag: "The rule" }),

    reworded(SH, NAMING, "Side AB joins", { tag: "Check you remember" }),
    choose(
      "Check you remember",
      "Which corner does side QR not touch?",
      "P",
      "QR joins Q and R.",
      [
        ["Q", "QR starts at Q."],
        ["R", "QR ends at R."],
      ],
      { picture: tri(["P", "Q", "R"]) },
    ),

    methodCard("The method", namingMethod, ABC),
    workedFrom(SH, NAMING),
    choose(
      "Your turn",
      "In triangle KLM, side k is",
      "LM",
      "k is opposite K: the side K doesn't touch.",
      [
        ["KL", "That touches K."],
        ["KM", "That touches K."],
      ],
      { picture: tri(["K", "L", "M"]) },
    ),

    calc(
      "Practise",
      "Name the parts.",
      tri(["G", "H", "I"]),
      [
        ["Side g is H", "I", "g is opposite G: it joins H and I."],
        ["$\\angle GHI$ is the angle at", "H", "The middle letter."],
      ],
      "Side g is HI, and $\\angle GHI$ is at H.",
    ),
    ...owned(SH, NAMING, "Together", "Practise"),
    ...owned(SH, NAMING, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Side d is", "EF", "Opposite D.", "EF.", {
          asks: "side",
          others: ["DE", "DF"],
          picture: tri(["D", "E", "F"]),
        }),
        ask("Side f is", "DE", "Opposite F.", "DE.", {
          asks: "side",
          changed: "Another side.",
          others: ["EF", "DF"],
          picture: tri(["D", "E", "F"]),
        }),
        ask("$\\angle DEF$ is the angle at", "E", "The middle letter.", "E.", {
          asks: "angle",
          changed: "Now an angle.",
          others: ["D", "F"],
          picture: tri(["D", "E", "F"]),
        }),
        ask("The angle at F is", "$\\angle DFE$", "F in the middle.", "$\\angle DFE$.", {
          asks: "angle",
          changed: "Write it in letters.",
          others: ["$\\angle DEF$", "$\\angle FDE$"],
          picture: tri(["D", "E", "F"]),
        }),
      ],
      "Small letters opposite; the middle letter is the corner.",
    ),

    questionSet(
      "Variation",
      "Find the corner. Watch what changes.",
      [
        ask("$\\angle BAC$ is the angle at", "A", "The middle letter.", "A.", {
          asks: "angle",
          others: ["B", "C"],
          picture: tri(["A", "B", "C"]),
          expect: [
            "Kim says $\\angle BAC$ is at B, as B comes first. Right?",
            "No",
            "The middle letter is the corner: A.",
            [["Yes", "Look at the middle letter."]],
          ],
        }),
        ask("$\\angle ACB$ is the angle at", "C", "The middle letter.", "C.", {
          asks: "angle",
          changed: "Another middle letter.",
          others: ["A", "B"],
          picture: tri(["A", "B", "C"]),
        }),
        ask("$\\angle CBA$ is the angle at", "B", "The middle letter.", "B.", {
          asks: "angle",
          changed: "Written backwards.",
          others: ["C", "A"],
          picture: tri(["A", "B", "C"]),
        }),
        ask("Side b is", "AC", "Opposite B.", "AC.", {
          asks: "side",
          changed: "Now a side.",
          others: ["AB", "BC"],
          picture: tri(["A", "B", "C"]),
        }),
      ],
      "Read the middle letter, whichever way round it's written.",
    ),
    reworded(
      SH,
      NAMING,
      "Where did it go wrong?",
      { picture: tri(["A", "B", "C"]) },
      "Spot the mistake",
    ),

    quiz([
      [
        ["Side a is", "BC", ["AB", "AC"], "a is opposite A.", tri(["A", "B", "C"])],
        ["Side p is", "QR", ["PQ", "PR"], "p is opposite P.", tri(["P", "Q", "R"])],
      ],
      [
        [
          "$\\angle PQR$ is the angle at",
          "Q",
          ["P", "R"],
          "The middle letter.",
          tri(["P", "Q", "R"]),
        ],
        [
          "$\\angle XZY$ is the angle at",
          "Z",
          ["X", "Y"],
          "The middle letter.",
          tri(["X", "Y", "Z"]),
        ],
      ],
      [
        ["Side y is", "XZ", ["XY", "YZ"], "y is opposite Y.", tri(["X", "Y", "Z"])],
        ["Side m is", "LN", ["LM", "MN"], "m is opposite M.", tri(["L", "M", "N"])],
      ],
    ]),

    reworded(
      SH,
      NAMING,
      "“Find side b, and the angle ABC.”",
      { tag: "Real life" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Side a is opposite corner A.**"],
      ABC,
      [
        "**Side a is opposite corner A.**",
        "$\\angle ABC$ is the angle at B: the middle letter.",
        "Capitals for corners, small letters for sides.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Congruent triangles.

type Pt = Point;
/** What is marked on a triangle: its base, right and left sides, and the angles at its corners. */
interface Marks {
  base?: string;
  right?: string;
  left?: string;
  a?: string;
  b?: string;
  c?: string;
}
const dir = (from: Pt, to: Pt) => (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
/** The angle at v between the directions to u and w, as an arc going anticlockwise. */
function arc(v: Pt, u: Pt, w: Pt, label: string): DrawingPic["items"][number] {
  let [p, q] = [dir(v, u), dir(v, w)].map((d) => (d + 360) % 360) as [number, number];
  if (p > q) [p, q] = [q, p];
  return q - p < 180
    ? { angle: v, from: p, to: q, label }
    : { angle: v, from: q, to: p + 360, label };
}
/** One triangle's items: any (a slanted top) or right (a right angle at the first corner). */
function triItems(
  m: Marks,
  at: number,
  o: { scale?: number; flip?: boolean; right?: boolean } = {},
): DrawingPic["items"] {
  const s = o.scale ?? 1;
  const base = o.right
    ? [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 0, y: 3 },
      ]
    : [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 1.2, y: 2.8 },
      ];
  const [p0, p1, p2] = base.map((p) => ({ x: at + (o.flip ? 4 - p.x : p.x) * s, y: p.y * s })) as [
    Pt,
    Pt,
    Pt,
  ];
  const mid = { x: (p0.x + p1.x + p2.x) / 3, y: (p0.y + p1.y + p2.y) / 3 };
  const items: DrawingPic["items"] = [{ line: [p0, p1] }, { line: [p1, p2] }, { line: [p2, p0] }];
  if (m.base) items.push({ side: [p0, p1], label: m.base, inside: mid });
  if (m.right) items.push({ side: [p1, p2], label: m.right, inside: mid });
  if (m.left) items.push({ side: [p2, p0], label: m.left, inside: mid });
  if (m.a) items.push(arc(p0, p1, p2, m.a));
  if (m.b) items.push(arc(p1, p0, p2, m.b));
  if (m.c) items.push(arc(p2, p0, p1, m.c));
  return items;
}
/** Two triangles side by side, the second perhaps flipped or bigger. */
const pair = (
  m: Marks,
  o: { flip?: boolean; scale?: number; right?: boolean; other?: Marks } = {},
): DrawingPic => ({
  kind: "drawing",
  items: [
    ...triItems(m, 0, { ...(o.right ? { right: true } : {}) }),
    ...triItems(o.other ?? m, 5.5, {
      ...(o.right ? { right: true } : {}),
      ...(o.flip ? { flip: true } : {}),
      ...(o.scale ? { scale: o.scale } : {}),
    }),
  ],
});
const TESTS = ["SSS", "SAS", "ASA", "RHS"];
const others = (right: string) => TESTS.filter((t) => t !== right).slice(0, 2);

const CONG = "y8-shapes/congruent";
const congMethod = [
  "List what matches: sides and angles.",
  "Is a matching angle between the matching sides?",
  "Name the test: SSS, SAS, ASA or RHS. Angles alone aren't enough.",
];
const SAS_PIC = pair({ base: "7 cm", left: "5 cm", a: "40°" });

const congruent = stepped(find(SH, CONG), {
  method: congMethod,
  variation: {
    relationship: "matching facts and the test that proves two triangles congruent",
    unknowns: ["test", "congruent?"],
    surface: ["flipped over", "angle not between", "right-angled", "same angles, different size"],
  },
  screens: [
    explain(
      "The rule",
      "Exactly the same",
      ["**Three matching facts can fix a triangle: SSS, SAS, ASA or RHS.**"],
      SAS_PIC,
      "Matching angles alone aren't enough: one could be bigger.",
    ),
    reworded(SH, CONG, "The four tests", { tag: "The rule" }),

    choose(
      "Check you remember",
      "Is the flipped one the same shape and size?",
      "Yes",
      "Flipping doesn't change the sides or angles.",
      [["No", "Flip it back: it fits exactly."]],
      { picture: pair({ base: "4 cm", right: "4 cm", left: "3 cm" }, { flip: true }) },
    ),
    choose(
      "Check you remember",
      "Same angles. Must they be the same size?",
      "No",
      "One can be an enlargement of the other.",
      [["Yes", "Look: one is bigger."]],
      { picture: pair({ a: "60°", b: "45°", c: "75°" }, { scale: 0.75 }) },
    ),

    methodCard("The method", congMethod, SAS_PIC),
    worked(
      "Watch the method",
      "Are they congruent? Which test?",
      [
        { line: "Two sides match: 7 cm and 5 cm", note: "List what matches." },
        { line: "The 40° is between them", note: "It's where the two sides meet." },
        { line: "Congruent, by SAS", note: "Side, angle between, side." },
      ],
      "Two sides and the angle between: SAS.",
      SAS_PIC,
    ),
    calc(
      "Your turn",
      "What matches?",
      pair({ base: "6 cm", a: "50°", b: "70°" }),
      [
        ["Angles that match:", "2", "The 50° and the 70°."],
        ["Sides that match:", "1", "The 6 cm, between the two angles."],
      ],
      "Two angles and the side between: ASA.",
    ),

    reworded(
      SH,
      CONG,
      "Which test?",
      {
        tag: "Practise",
        start: "Look at the marked facts.",
        picture: pair({ base: "4 cm", a: "50°", b: "60°" }),
      },
      "Together",
    ),
    reworded(SH, CONG, "Right-angled", {
      tag: "Practise",
      start: "Look at the marked facts.",
      picture: pair({ right: "13 cm", base: "5 cm" }, { right: true }),
    }),
    questionSet(
      "Practise",
      "Which test? Watch what changes.",
      [
        ask("Which test proves them congruent?", "SSS", "Three sides match.", "SSS.", {
          asks: "test",
          others: others("SSS"),
          picture: pair({ base: "6 cm", right: "5 cm", left: "4 cm" }),
        }),
        ask("Which test proves them congruent?", "SAS", "The angle is between the sides.", "SAS.", {
          asks: "test",
          changed: "One side becomes an angle.",
          others: others("SAS"),
          picture: pair({ base: "6 cm", left: "4 cm", a: "50°" }),
        }),
        ask("Which test proves them congruent?", "ASA", "The side is between the angles.", "ASA.", {
          asks: "test",
          changed: "Two angles now.",
          others: others("ASA"),
          picture: pair({ base: "6 cm", a: "50°", b: "60°" }),
        }),
        ask("Which test proves them congruent?", "RHS", "Right angle, hypotenuse, side.", "RHS.", {
          asks: "test",
          changed: "Right-angled triangles.",
          others: others("RHS"),
          picture: pair({ right: "5 cm", base: "4 cm" }, { right: true }),
        }),
      ],
      "Name what matches, then the test.",
    ),

    questionSet(
      "Variation",
      "Congruent? Watch what changes.",
      [
        ask(
          "Must they be congruent?",
          "Not necessarily",
          "Only angles match.",
          "No: one could be bigger.",
          {
            asks: "congruent?",
            others: ["Yes"],
            picture: pair({ a: "45°", b: "45°" }, { scale: 0.7 }),
            expect: [
              "Zara says matching angles make them congruent. Right?",
              "No",
              "Same angles, different size: one can be an enlargement.",
              [["Yes", "Look: one is bigger."]],
            ],
          },
        ),
        ask(
          "Must they be congruent?",
          "Not necessarily",
          "The angle isn't between the sides.",
          "No: SAS needs the angle between.",
          {
            asks: "congruent?",
            changed: "Two sides and an angle, not between.",
            others: ["Yes, by SAS"],
            picture: pair({ base: "6 cm", right: "5 cm", a: "40°" }),
          },
        ),
        ask("Must they be congruent?", "Yes, by SAS", "Now the angle is between.", "Yes, by SAS.", {
          asks: "congruent?",
          changed: "Now the angle is between.",
          others: ["Not necessarily"],
          picture: pair({ base: "6 cm", left: "5 cm", a: "40°" }),
        }),
        ask("Must they be congruent?", "Yes, by SSS", "Flipping doesn't matter.", "Yes, by SSS.", {
          asks: "congruent?",
          changed: "One is flipped over.",
          others: ["Not necessarily"],
          picture: pair({ base: "6 cm", right: "5 cm", left: "4 cm" }, { flip: true }),
        }),
      ],
      "The angle must sit between the sides, and angles alone are never enough.",
    ),
    reworded(
      SH,
      CONG,
      "Where did it go wrong?",
      { picture: pair({ a: "45°", b: "45°" }, { scale: 0.7 }) },
      "Spot the mistake",
    ),

    quiz([
      [
        [
          "Which test proves them congruent?",
          "SAS",
          others("SAS"),
          "Two sides and the angle between.",
          pair({ base: "8 cm", left: "6 cm", a: "35°" }),
        ],
        [
          "Which test proves them congruent?",
          "SAS",
          others("SAS"),
          "Two sides and the angle between.",
          pair({ base: "5 cm", left: "7 cm", a: "65°" }),
        ],
      ],
      [
        [
          "Is this enough to be sure?",
          "No: angles alone aren't a test",
          ["Yes, by AAA"],
          "One could be bigger.",
          pair({ a: "50°", b: "60°", c: "70°" }, { scale: 0.75 }),
        ],
        [
          "Is this enough to be sure?",
          "No: angles alone aren't a test",
          ["Yes, by AAA"],
          "One could be bigger.",
          pair({ a: "30°", b: "80°", c: "70°" }, { scale: 0.75 }),
        ],
      ],
      [
        [
          "Which test proves them congruent?",
          "RHS",
          others("RHS"),
          "Right angle, hypotenuse, side.",
          pair({ right: "10 cm", base: "6 cm" }, { right: true }),
        ],
        [
          "Which test proves them congruent?",
          "RHS",
          others("RHS"),
          "Right angle, hypotenuse, side.",
          pair({ right: "13 cm", left: "12 cm" }, { right: true }),
        ],
      ],
    ]),

    reworded(
      SH,
      CONG,
      "The roof trusses",
      {
        tag: "Real life",
        text: "The builder checks all three sides of each truss.",
        picture: pair({ base: "6 m", right: "5.7 m", left: "4.5 m" }),
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Three matching facts can fix a triangle: SSS, SAS, ASA or RHS.**"],
      SAS_PIC,
      [
        "**Three matching facts can fix a triangle: SSS, SAS, ASA or RHS.**",
        "SAS: the angle must be between the two sides.",
        "Matching angles alone don't prove it.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Shape properties.

const PROPS = "y8-shapes/properties";
const propsMethod = [
  "Name the shape from its marks.",
  "Use its rules: equal sides, equal angles, parallel sides.",
  "Then the angle sums: 180° in a triangle, 360° in a quadrilateral.",
];
const shape = (
  pts: [number, number][],
  angles: (string | null)[],
  sides?: (string | null)[],
): ShapePic => ({
  kind: "shape",
  points: pts.map(([x, y]) => ({ x, y })),
  angles,
  ...(sides ? { sides } : {}),
});
const PARA: [number, number][] = [
  [0, 0],
  [5, 0],
  [6.5, 3],
  [1.5, 3],
];
const KITE: [number, number][] = [
  [3, 0],
  [5.5, 4],
  [3, 5.5],
  [0.5, 4],
];
const ISO: [number, number][] = [
  [0, 0],
  [6, 0],
  [3, 5],
];
const para = (a: string | null, b: string | null, c: string | null, d: string | null) =>
  shape(PARA, [a, b, c, d]);
const iso = (base1: string | null, base2: string | null, top: string | null) =>
  shape(ISO, [base1, base2, top], [null, "5 cm", "5 cm"]);

const properties = stepped(find(SH, PROPS), {
  method: propsMethod,
  variation: {
    relationship: "a shape's family and the rules its angles follow",
    unknowns: ["angle", "name"],
    surface: ["parallelograms", "kites", "isosceles triangles", "right angles"],
  },
  screens: [
    explain(
      "The rule",
      "Shape properties",
      ["**Each family of shapes has its own rules: sides, angles, diagonals.**"],
      para("70°", "110°", "70°", "110°"),
      "A parallelogram: opposite angles equal, next-door angles add to 180°.",
    ),
    reworded(SH, PROPS, "Which shape has it?", { tag: "The rule" }),

    typed("Check you remember", "Find x.", "90", "Angles in a quadrilateral add to 360°.", "90°.", {
      unit: "°",
      picture: shape(
        [
          [0, 0],
          [5, 0],
          [5.5, 3.5],
          [0, 3],
        ],
        ["x", "100°", "80°", "90°"],
      ),
    }),
    typed("Check you remember", "Find y.", "70", "Angles in a triangle add to 180°.", "70°.", {
      unit: "°",
      picture: shape(
        [
          [0, 0],
          [6, 0],
          [2, 4],
        ],
        ["50°", "60°", "y"],
      ),
    }),

    methodCard("The method", propsMethod, para("70°", "a", "b", "c")),
    worked(
      "Watch the method",
      "Find a, b and c.",
      [
        {
          line: "$a = 180° - 70° = 110°$",
          note: "Next-door angles in a parallelogram add to 180°.",
        },
        { line: "$b = 70°$ and $c = 110°$", note: "Opposite angles are equal." },
      ],
      "Next-door: add to 180°. Opposite: equal.",
      para("70°", "a", "b", "c"),
    ),
    calc(
      "Your turn",
      "Find x.",
      shape(KITE, ["x", "115°", "70°", null]),
      [
        [
          "The angle on the left matches the right:",
          "115",
          "A kite has one pair of equal angles.",
          { after: "°" },
        ],
        [
          "$x = 360 - 115 - 115 - 70 =$",
          "60",
          "Angles in a quadrilateral.",
          { after: "°", reason: REASON.quadrilateral },
        ],
      ],
      "$x = 60°$.",
    ),

    calc(
      "Practise",
      "Find b.",
      iso("b", "b", "40°"),
      [
        [
          "The two base angles share $180 - 40 =$",
          "140",
          "Angles in a triangle.",
          { after: "°", reason: REASON.triangle },
        ],
        ["$b = 140 \\div 2 =$", "70", "The base angles are equal.", { after: "°" }],
      ],
      "$b = 70°$.",
    ),
    reworded(SH, PROPS, "What is the blue line called?", { tag: "Practise" }),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find x.", "115", "Next-door angles add to 180°.", "115°.", {
          unit: "°",
          asks: "angle",
          picture: para("65°", "x", null, null),
        }),
        ask("Find x.", "65", "Opposite angles are equal.", "65°.", {
          unit: "°",
          asks: "angle",
          changed: "The opposite angle.",
          picture: para("65°", null, "x", null),
        }),
        ask("Find x.", "75", "The base angles share 150°.", "75°.", {
          unit: "°",
          asks: "angle",
          changed: "An isosceles triangle.",
          picture: iso("x", null, "30°"),
        }),
        ask(
          "Which shape is this?",
          "A rhombus",
          "Four equal sides, no right angle.",
          "A rhombus.",
          {
            asks: "name",
            changed: "Name it.",
            others: ["A square", "A rectangle"],
            picture: shape(
              [
                [0, 0],
                [4, 0],
                [6, 3],
                [2, 3],
              ],
              [null, null, null, null],
              ["4 cm", "4 cm", "4 cm", "4 cm"],
            ),
          },
        ),
      ],
      "Name the shape, then use its rules.",
    ),

    questionSet(
      "Variation",
      "An isosceles triangle. Watch what changes.",
      [
        ask("Find x.", "65", "The base angles share 130°.", "65°.", {
          unit: "°",
          asks: "angle",
          picture: iso("x", null, "50°"),
          expect: [
            "Amy says each base angle is 180 − 50 = 130°. Right?",
            "No",
            "The two base angles share 130°: 65° each.",
            [["Yes", "Two angles of 130° already make 260°."]],
          ],
        }),
        ask("Find x.", "80", "180 − 50 − 50.", "80°.", {
          unit: "°",
          asks: "angle",
          changed: "Now the top angle.",
          picture: iso("50°", null, "x"),
        }),
        ask("Find x.", "50", "The base angles are equal.", "50°.", {
          unit: "°",
          asks: "angle",
          changed: "The other base angle.",
          picture: iso("50°", "x", null),
        }),
        ask("Find x.", "45", "The base angles share 90°.", "45°.", {
          unit: "°",
          asks: "angle",
          changed: "A right angle at the top.",
          picture: iso("x", null, "90°"),
        }),
      ],
      "The two base angles are equal, and share what's left of 180°.",
    ),
    reworded(
      SH,
      PROPS,
      "Where did it go wrong?",
      { text: "Amy finds the base angles.", picture: iso("b", "b", "50°") },
      "Spot the mistake",
    ),

    quiz([
      [
        [
          "Which shape is this?",
          "A trapezium",
          ["A parallelogram", "A kite"],
          "Exactly one pair of parallel sides.",
          shape(
            [
              [0, 0],
              [6, 0],
              [4.5, 3],
              [1.5, 3],
            ],
            [null, null, null, null],
          ),
        ],
        [
          "Which shape is this?",
          "A kite",
          ["A rhombus", "A trapezium"],
          "Two pairs of equal sides next to each other.",
          shape(KITE, [null, null, null, null]),
        ],
      ],
      [
        [
          "Find x.",
          "115°",
          ["65°", "295°"],
          "Next-door angles add to 180°.",
          para("65°", "x", null, null),
        ],
        [
          "Find x.",
          "105°",
          ["75°", "285°"],
          "Next-door angles add to 180°.",
          para("75°", "x", null, null),
        ],
      ],
      [
        ["Find x.", "50°", ["100°", "80°"], "The base angles share 100°.", iso("x", null, "80°")],
        ["Find x.", "80°", ["160°", "20°"], "The base angles share 160°.", iso("x", null, "20°")],
      ],
    ]),

    reworded(
      SH,
      PROPS,
      "Four sides of 80 cm",
      {
        tag: "Real life",
        title: "The window frame",
        picture: shape(
          [
            [0, 0],
            [4, 0],
            [5, 3],
            [1, 3],
          ],
          [null, null, null, null],
          ["80 cm", "80 cm", "80 cm", "80 cm"],
        ),
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Each family of shapes has its own rules: sides, angles, diagonals.**"],
      para("70°", "110°", "70°", "110°"),
      [
        "**Each family of shapes has its own rules: sides, angles, diagonals.**",
        "Parallelogram: opposite angles equal.",
        "Isosceles: two equal base angles.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Faces, edges and vertices.

const SOLIDS = "y8-shapes/solids";
const solidsMethod = [
  "Faces: count the flat surfaces, back ones too.",
  "Edges: count where two faces meet.",
  "Vertices: count the corners. Check: F + V − E = 2.",
];
const box = (w: number, d: number, h: number): Picture => ({ kind: "cuboid", w, d, h });
const CUBOID = box(4, 2, 3);
const TETRA: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 2.6, y: 1.2 },
      ],
      dashed: true,
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 2.6, y: 1.2 },
      ],
      dashed: true,
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 2, y: 3.5 },
      ],
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 2, y: 3.5 },
      ],
    },
    {
      line: [
        { x: 2.6, y: 1.2 },
        { x: 2, y: 3.5 },
      ],
      dashed: true,
    },
  ],
};

const solids = stepped(find(SH, SOLIDS), {
  method: solidsMethod,
  variation: {
    relationship: "a solid's faces, edges and vertices, and F + V − E = 2",
    unknowns: ["faces", "edges", "vertices", "rule"],
    surface: ["cuboids", "prisms", "pyramids", "hidden edges"],
  },
  screens: [
    explain(
      "The rule",
      "Faces, edges, vertices",
      ["**Count faces, edges and vertices: F + V − E = 2.**"],
      CUBOID,
      "Face: a flat surface. Edge: where two meet. Vertex: a corner.",
    ),
    reworded(SH, SOLIDS, "How many edges does a cuboid have?", { tag: "The rule" }),

    reworded(SH, SOLIDS, "How many faces does a cube have?", {
      tag: "Check you remember",
      title: "How many faces does this cube have?",
      picture: box(3, 3, 3),
    }),

    methodCard("The method", solidsMethod, PRISM),
    workedFrom(SH, SOLIDS),
    calc(
      "Your turn",
      "Count the parts.",
      SQUARE_PYRAMID,
      [
        ["Faces: 1 square + 4 triangles =", "5", "Count the base too."],
        ["Edges: 4 round the base + 4 up =", "8", "Where faces meet."],
        ["Vertices: 4 + 1 =", "5", "The base corners, and the top."],
      ],
      "5 faces, 8 edges, 5 vertices.",
    ),

    calc(
      "Practise",
      "Check the rule for this pyramid.",
      SQUARE_PYRAMID,
      [
        ["$F + V = 5 + 5 =$", "10", "Faces plus vertices."],
        ["$10 - E = 10 - 8 =$", "2", "Take the edges."],
      ],
      "$F + V - E = 2$: it works.",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How many faces?", "4", "Count the base too.", "4 triangles.", {
          asks: "faces",
          picture: TETRA,
        }),
        ask("How many edges?", "6", "3 round the base, 3 up.", "6.", {
          asks: "edges",
          changed: "Now the edges.",
          picture: TETRA,
        }),
        ask("How many vertices?", "4", "3 at the base, 1 at the top.", "4.", {
          asks: "vertices",
          changed: "Now the corners.",
          picture: TETRA,
        }),
        ask("Work out $F + V - E$.", "2", "4 + 4 − 6.", "2: the rule works.", {
          asks: "rule",
          changed: "Now the rule.",
          picture: TETRA,
        }),
      ],
      "Faces, edges, vertices, then check.",
    ),

    questionSet(
      "Variation",
      "How many edges? Watch what changes.",
      [
        ask("How many edges?", "12", "Count the hidden ones too.", "12.", {
          asks: "edges",
          picture: CUBOID,
          expect: [
            "Rob counts the edges he can see: 9. Right?",
            "No",
            "Three edges are hidden at the back: 12.",
            [["Yes", "Count the ones at the back too."]],
          ],
        }),
        ask("How many edges?", "9", "3 + 3 + 3.", "9.", {
          asks: "edges",
          changed: "A triangular prism.",
          picture: PRISM,
        }),
        ask("How many edges?", "8", "4 round the base, 4 up.", "8.", {
          asks: "edges",
          changed: "A pyramid.",
          picture: SQUARE_PYRAMID,
        }),
        ask("How many edges?", "6", "3 round the base, 3 up.", "6.", {
          asks: "edges",
          changed: "A triangle base.",
          picture: TETRA,
        }),
      ],
      "Count every edge, seen or hidden.",
    ),
    words(
      own(SH, SOLIDS, "Spot the mistake"),
      "A description of a curved solid: no drawing to count from.",
    ),

    quiz([
      [
        ["How many vertices?", "8", ["6", "12"], "4 on top, 4 underneath.", CUBOID],
        ["How many faces?", "6", ["4", "8"], "Count the back and bottom too.", CUBOID],
      ],
      [
        ["How many edges?", "8", ["5", "4"], "4 round the base, 4 up.", SQUARE_PYRAMID],
        ["How many edges?", "9", ["6", "5"], "3 + 3 + 3.", PRISM],
      ],
      [
        [
          "7 faces and 10 vertices. How many edges?",
          "15",
          ["17", "3"],
          "$7 + 10 - E = 2$.",
          maths("F + V - E = 2"),
        ],
        [
          "6 faces and 6 vertices. How many edges?",
          "10",
          ["12", "2"],
          "$6 + 6 - E = 2$.",
          maths("F + V - E = 2"),
        ],
      ],
    ]),

    reworded(SH, SOLIDS, "The chocolate box", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Count faces, edges and vertices: F + V − E = 2.**"],
      CUBOID,
      [
        "**Count faces, edges and vertices: F + V − E = 2.**",
        "Cuboid: 6 faces, 12 edges, 8 vertices.",
        "Count the hidden edges at the back too.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

export const y8ShapesStepped: [string, UnitLesson[]][] = [
  [ALT, [alternate]],
  [COR, [corresponding]],
  [NAMING, [naming]],
  [CONG, [congruent]],
  [PROPS, [properties]],
  [SOLIDS, [solids]],
];
