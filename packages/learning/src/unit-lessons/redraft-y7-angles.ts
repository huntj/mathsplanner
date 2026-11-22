// Year 7, "Angle facts", on the stepped template (docs/proposals/lesson-stepped.md): a full turn,
// crossing lines, a triangle, any polygon and regular polygons. (A half turn is in the pilot.)
// Every question is asked on its diagram, with the given angles on it and only what to find in
// words; the written reasons come from the shared list.
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
import { regular } from "./geometry.ts";
import { REASON } from "./reasons.ts";
import { find, own, owned, reworded, stepped, tagged, words } from "./stepped.ts";
import type { Screen, ShapePic, UnitLesson } from "./types.ts";
import {
  cross,
  fan,
  hexagon,
  octagon,
  pentagon,
  quad,
  rightAngled,
  split,
  triangle,
  y7Angles,
} from "./y7-angles.ts";

const NUMBER = "A number check: the sum the method needs.";
const list = y7Angles;

/** A regular polygon with n sides, its angles labelled. */
const shape = (n: number, angles?: (string | null)[]): ShapePic => ({
  kind: "shape",
  points: regular(n, 3, 90),
  ...(angles ? { angles } : {}),
});
const polygon = (points: ShapePic["points"], angles: (string | null)[]): ShapePic => ({
  kind: "shape",
  points,
  angles,
});

// ---------------------------------------------------------------------------------------------
// A full turn.

const FULL = "y7-angles/full-turn";
const fullMethod = [
  "Check the angles meet at one point.",
  "Add the angles you know.",
  "Take the total away from 360°.",
];

const fullTurn = stepped(find(list, FULL), {
  method: fullMethod,
  variation: {
    relationship: "the angles round a point add up to 360°",
    unknowns: ["angle 1", "angle 2", "angle 3", "equal angles"],
    surface: ["three angles", "five angles", "algebra", "turned"],
  },
  screens: [
    explain(
      "The rule",
      "A full turn",
      ["**Angles round a point add up to 360°.**"],
      fan([0, 90, 200], ["90°", "110°", "160°"]),
      "A full turn is four right angles: 360°.",
    ),
    tagged(
      "The rule",
      explore(
        "Turn the ray",
        {
          kind: "geometry",
          circle: 3,
          hideCircle: true,
          points: [
            { name: "A", onCircle: 0 },
            { name: "B", onCircle: 110, drag: [75, 150] },
            { name: "C", onCircle: 240 },
          ],
          lines: ["OA", "OB", "OC"],
          angles: [{ name: "AOB" }, { name: "BOC" }, { name: "COA" }],
          readouts: [
            { label: "Angle AOB", angle: "AOB" },
            { label: "Angle BOC", angle: "BOC" },
            { label: "Angle COA", angle: "COA" },
            { label: "Together", sum: ["AOB", "BOC", "COA"] },
          ],
        },
        [
          "What did you notice?",
          "The three angles always add up to 360°",
          "Together they go all the way round: a full turn.",
          [
            ["The angles stay the same", "Look again: two of them change."],
            ["They add up to 180°", "That's a half turn. These go all the way round."],
          ],
        ],
        "Angles round a point add up to 360°, however the ray turns.",
        { text: "Drag B round. Watch the three angles." },
      ),
    ),

    words(
      typed("Check you remember", "Work out 360 − 150.", "210", "360 − 100 = 260.", "210."),
      NUMBER,
    ),
    typed(
      "Check you remember",
      "How many right angles make a full turn?",
      "4",
      "Count the quarter turns.",
      "4.",
      {
        picture: fan([0, 90, 180, 270], ["90°", "90°", "90°", "90°"]),
      },
    ),
    words(
      typed("Check you remember", "Work out 120 + 110.", "230", "100 + 100, then 20 + 10.", "230."),
      NUMBER,
    ),

    methodCard("The method", fullMethod, fan([0, 120, 230], ["120°", "110°", "x"])),
    worked(
      "Watch the method",
      "Find x.",
      [
        { line: "$120° + 110° = 230°$", note: "Add the angles you know." },
        { line: "x = $360° - 230° = 130°$", reason: REASON.point },
      ],
      "Add, then take away from 360°.",
      fan([0, 120, 230], ["120°", "110°", "x"]),
    ),
    calc(
      "Your turn",
      "Find x.",
      fan([0, 100, 250], ["100°", "150°", "x"]),
      [
        ["$100° + 150° =$", "250", "Add the angles you know.", { after: "°" }],
        [
          "x = $360° - 250° =$",
          "110",
          "Take the total from 360°.",
          { after: "°", reason: REASON.point },
        ],
      ],
      "x is 110°.",
    ),

    calc(
      "Practise",
      "Find x.",
      fan([0, 90, 170, 260], ["90°", "80°", "90°", "x"]),
      [
        ["$90° + 80° + 90° =$", "260", "Add the angles you know.", { after: "°" }],
        [
          "x = $360° - 260° =$",
          "100",
          "Take the total from 360°.",
          { after: "°", reason: REASON.point },
        ],
      ],
      "x is 100°.",
    ),
    questionSet(
      "Practise",
      "Which angle is missing?",
      [
        ask("Find the missing angle.", "80", "Take the other two from 360°.", "80°.", {
          unit: "°",
          asks: "angle 1",
          picture: fan([0, 80, 200], ["?", "120°", "160°"], "?"),
        }),
        ask("Find the missing angle.", "120", "Take the other two from 360°.", "120°.", {
          unit: "°",
          asks: "angle 2",
          changed: "Now the second angle is missing.",
          picture: fan([0, 80, 200], ["80°", "?", "160°"], "?"),
        }),
        ask("Find the missing angle.", "160", "Take the other two from 360°.", "160°.", {
          unit: "°",
          asks: "angle 3",
          changed: "Now the third angle.",
          picture: fan([0, 80, 200], ["80°", "120°", "?"], "?"),
        }),
        ask("Find x.", "120", "Three equal angles share 360°.", "120°.", {
          unit: "°",
          asks: "equal angles",
          changed: "Three equal angles.",
          picture: fan([90, 210, 330], ["x", "x", "x"]),
        }),
      ],
      "Whichever angle is missing, take the others from 360°.",
    ),

    questionSet(
      "Variation",
      "Find x. Watch what changes.",
      [
        ask("Find x.", "90", "360° − 140° − 130°.", "90°.", {
          unit: "°",
          asks: "angle 3",
          picture: fan([0, 140, 270], ["140°", "130°", "x"]),
          expect: [
            "Ella says angles round a point add to 180°. Right?",
            "No: 360°",
            "Round a point is a full turn: 360°.",
            [["Yes", "180° is a straight line, a half turn."]],
          ],
        }),
        ask("Find x.", "90", "Add the four, take from 360°.", "90°.", {
          unit: "°",
          asks: "angle 3",
          changed: "Five angles now.",
          picture: fan([0, 60, 130, 200, 270], ["60°", "70°", "70°", "70°", "x"]),
        }),
        ask("Find x.", "80", "x + 2x is 240°.", "80°.", {
          unit: "°",
          asks: "equal angles",
          changed: "x and 2x.",
          picture: fan([0, 120, 200], ["120°", "x", "2x"]),
        }),
        ask("Find x.", "120", "Take the other two from 360°.", "120°.", {
          unit: "°",
          asks: "angle 2",
          changed: "The picture is turned.",
          picture: fan([45, 165, 285], ["120°", "x", "120°"]),
        }),
      ],
      "However many angles, and however they're turned: 360° round a point.",
    ),
    {
      ...own(list, FULL, "Spot the mistake"),
      text: "Ravi finds x, where three angles meet.",
    } as Screen,

    quiz([
      [
        [
          "Find x.",
          "120°",
          ["240°", "60°"],
          "360° − 140° − 100°.",
          fan([0, 140, 240], ["140°", "100°", "x"]),
          "angle 3",
        ],
        [
          "Find x.",
          "130°",
          ["230°", "50°"],
          "360° − 120° − 110°.",
          fan([0, 120, 230], ["120°", "110°", "x"]),
          "angle 3",
        ],
      ],
      [
        [
          "Find x.",
          "100°",
          ["80°", "260°"],
          "360° − 150° − 110°.",
          fan([0, 100, 250], ["x", "150°", "110°"]),
          "angle 1",
        ],
        [
          "Find x.",
          "90°",
          ["270°", "180°"],
          "360° − 140° − 130°.",
          fan([0, 90, 230], ["x", "140°", "130°"]),
          "angle 1",
        ],
      ],
      [
        [
          "Find x.",
          "72°",
          ["60°", "90°"],
          "360° ÷ 5.",
          fan([90, 162, 234, 306, 18], ["x", "x", "x", "x", "x"]),
          "equal angles",
        ],
        [
          "Find x.",
          "90°",
          ["45°", "180°"],
          "360° ÷ 4.",
          fan([45, 135, 225, 315], ["x", "x", "x", "x"]),
          "equal angles",
        ],
      ],
    ]),

    reworded(
      list,
      FULL,
      "The last slice",
      { tag: "Real life", text: "What angle does the last slice make at the centre?" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Angles round a point add up to 360°.**"],
      fan([0, 120, 230], ["120°", "110°", "130°"]),
      [
        "**Angles round a point add up to 360°.**",
        "Add the angles you know; take the total from 360°.",
        "x = 360° − 230° = 130° (angles at a point add up to 360°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Crossing lines.

const CROSSING = "y7-angles/crossing-lines";
const crossingMethod = [
  "Opposite angles are equal.",
  "Angles next to each other add up to 180°.",
  "Give a reason for each angle.",
];

const crossing = stepped(find(list, CROSSING), {
  method: crossingMethod,
  variation: {
    relationship: "where two lines cross, opposite angles are equal and neighbours add to 180°",
    unknowns: ["opposite", "next to", "algebra"],
    surface: ["steeper lines", "near right angles", "algebra", "scissors"],
  },
  screens: [
    explain(
      "The rule",
      "Crossing lines",
      ["**Where two lines cross, opposite angles are equal.**"],
      cross(35, ["110°", "70°", "110°", "70°"]),
      "Next to each other, they make a straight line: 180°.",
    ),
    reworded(list, CROSSING, "Why are opposite angles equal?", {
      tag: "The rule",
      start: "Use the two straight lines.",
    }),

    ...owned(list, CROSSING, "Warm-up", "Check you remember"),
    words(
      typed("Check you remember", "Work out 180 − 140.", "40", "140 + 40 = 180.", "40."),
      NUMBER,
    ),

    methodCard("The method", crossingMethod, cross(20, ["140°", "x", "y", "z"])),
    worked(
      "Watch the method",
      "Find x, y and z.",
      [
        { line: "y = 140°", reason: REASON.opposite },
        { line: "x = $180° - 140° = 40°$", reason: REASON.straightLine },
        { line: "z = 40°", reason: REASON.opposite },
      ],
      "x and z are 40°; y is 140°.",
      cross(20, ["140°", "x", "y", "z"]),
    ),
    calc(
      "Your turn",
      "Find a and b.",
      cross(40, ["100°", "a", "b", null], "a"),
      [
        [
          "a = $180° - 100° =$",
          "80",
          "a and 100° make a straight line.",
          { after: "°", reason: REASON.straightLine },
        ],
        ["b =", "100", "b is opposite the 100°.", { after: "°", reason: REASON.opposite }],
      ],
      "a is 80°, b is 100°.",
    ),

    calc(
      "Practise",
      "Find p, q and r.",
      cross(25, ["p", "50°", "q", "r"], "p"),
      [
        [
          "p = $180° - 50° =$",
          "130",
          "p and 50° make a straight line.",
          { after: "°", reason: REASON.straightLine },
        ],
        ["q =", "130", "q is opposite p.", { after: "°", reason: REASON.opposite }],
        ["r =", "50", "r is opposite the 50°.", { after: "°", reason: REASON.opposite }],
      ],
      "p and q are 130°; r is 50°.",
    ),
    questionSet(
      "Practise",
      "Which angle is missing?",
      [
        ask("Find the missing angle.", "120", "It's next to 60°: a straight line.", "120°.", {
          unit: "°",
          asks: "next to",
          picture: cross(30, ["?", "60°", null, null], "?"),
        }),
        ask("Find the missing angle.", "60", "It's opposite 60°.", "60°.", {
          unit: "°",
          asks: "opposite",
          changed: "Now the angle opposite.",
          picture: cross(30, [null, "60°", null, "?"], "?"),
        }),
        ask("Find the missing angle.", "120", "It's opposite 120°.", "120°.", {
          unit: "°",
          asks: "opposite",
          changed: "Opposite the wide angle.",
          picture: cross(30, ["120°", null, "?", null], "?"),
        }),
        ask("Find x.", "40", "Opposite angles: 2x = 80°.", "40°.", {
          unit: "°",
          asks: "algebra",
          changed: "A letter: 2x.",
          picture: cross(40, [null, "80°", null, "2x"], "2x"),
        }),
      ],
      "Opposite: equal. Next to each other: add to 180°.",
    ),

    questionSet(
      "Variation",
      "Find each angle. Watch what changes.",
      [
        ask("Find the missing angle.", "120", "Next to 60°: 180° − 60°.", "120°.", {
          unit: "°",
          asks: "next to",
          picture: cross(30, ["?", "60°", null, null], "?"),
          expect: [
            "Ana says angles next to each other are equal. Right?",
            "No",
            "Next to each other, they add to 180°. Opposite ones are equal.",
            [["Yes", "Look: one is wide, one is narrow."]],
          ],
        }),
        ask("Find the missing angle.", "150", "Next to 30°: 180° − 30°.", "150°.", {
          unit: "°",
          asks: "next to",
          changed: "The lines are closer together.",
          picture: cross(15, ["?", "30°", null, null], "?"),
        }),
        ask("Find the missing angle.", "96", "Next to 84°: 180° − 84°.", "96°.", {
          unit: "°",
          asks: "next to",
          changed: "Nearly at right angles.",
          picture: cross(42, ["?", "84°", null, null], "?"),
        }),
        ask("Find x.", "70", "Opposite: x + 40° = 110°.", "70°.", {
          unit: "°",
          asks: "algebra",
          changed: "Algebra opposite a number.",
          picture: cross(35, ["x + 40°", null, "110°", null], "x + 40°"),
        }),
      ],
      "However the lines cross, opposite angles match.",
    ),
    {
      ...own(list, CROSSING, "Spot the mistake"),
      text: "Leo finds the other three angles.",
    } as Screen,

    quiz([
      [
        [
          "Find x.",
          "110°",
          ["70°", "290°"],
          "Next to 70°: a straight line.",
          cross(35, ["x", "70°", null, null]),
          "next to",
        ],
        [
          "Find x.",
          "130°",
          ["50°", "310°"],
          "Next to 50°: a straight line.",
          cross(25, ["x", "50°", null, null]),
          "next to",
        ],
      ],
      [
        [
          "Find x.",
          "80°",
          ["100°", "280°"],
          "Opposite 80°.",
          cross(40, [null, "80°", null, "x"]),
          "opposite",
        ],
        [
          "Find x.",
          "60°",
          ["120°", "300°"],
          "Opposite 60°.",
          cross(30, [null, "60°", null, "x"]),
          "opposite",
        ],
      ],
      [
        [
          "Find x.",
          "35°",
          ["70°", "110°"],
          "Opposite: 2x = 70°.",
          cross(35, [null, "70°", null, "2x"], "2x"),
          "algebra",
        ],
        [
          "Find x.",
          "20°",
          ["60°", "40°"],
          "Opposite: 3x = 60°.",
          cross(30, [null, "60°", null, "3x"], "3x"),
          "algebra",
        ],
      ],
    ]),

    reworded(
      list,
      CROSSING,
      "Open scissors",
      { tag: "Real life", start: "The blades and handles cross at the pivot." },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Where two lines cross, opposite angles are equal.**"],
      cross(35, ["110°", "70°", "110°", "70°"]),
      [
        "**Where two lines cross, opposite angles are equal.**",
        "Next to each other: they add up to 180°.",
        "y = 140° (vertically opposite angles are equal)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Inside a triangle.

const TRIANGLE = "y7-angles/triangle";
const triangleMethod = [
  "Add the angles you know.",
  "Take the total away from 180°.",
  "Isosceles: the two base angles are equal.",
];

const insideTriangle = stepped(find(list, TRIANGLE), {
  method: triangleMethod,
  variation: {
    relationship: "the angles in a triangle add up to 180°",
    unknowns: ["angle A", "angle B", "angle C", "base angle"],
    surface: ["right angles", "a wide angle", "isosceles", "equilateral", "roofs"],
  },
  screens: [
    explain(
      "The rule",
      "Inside a triangle",
      ["**The angles in a triangle add up to 180°.**"],
      triangle(50, 60, ["50°", "60°", "70°"]),
      "Tear off the corners and they make a straight line.",
    ),
    tagged(
      "The rule",
      explore(
        "Stretch the triangle",
        {
          kind: "geometry",
          points: [
            { name: "A", at: { x: -3, y: 0 } },
            { name: "B", at: { x: 3, y: 0 } },
            {
              name: "C",
              free: { x: 0.5, y: 2.5 },
              drag: { xMin: -1.5, xMax: 1.5, yMin: 2, yMax: 3.5 },
            },
          ],
          lines: ["AB", "BC", "CA"],
          angles: [{ name: "CAB" }, { name: "ABC" }, { name: "BCA" }],
          readouts: [
            { label: "Angle A", angle: "CAB" },
            { label: "Angle B", angle: "ABC" },
            { label: "Angle C", angle: "BCA" },
            { label: "Together", sum: ["CAB", "ABC", "BCA"] },
          ],
        },
        [
          "What did you notice?",
          "The three angles always add up to 180°",
          "However the triangle is stretched, its angles make 180°.",
          [
            ["A bigger triangle has bigger angles in all", "Look at Together: it never changes."],
            ["They add up to 360°", "Look again: it's 180° every time."],
          ],
        ],
        "The angles in any triangle add up to 180°.",
        { text: "Drag C. Watch the three angles." },
      ),
    ),

    ...owned(list, TRIANGLE, "Warm-up", "Check you remember").map((s) =>
      s.kind === "answer" && !("picture" in s && s.picture)
        ? ({ ...s, wordsOnly: NUMBER } as Screen)
        : s,
    ),
    words(
      typed("Check you remember", "Work out 90 + 35.", "125", "90 + 30, then 5 more.", "125."),
      NUMBER,
    ),

    methodCard("The method", triangleMethod, triangle(48, 67, ["48°", "67°", "x"])),
    worked(
      "Watch the method",
      "Find x.",
      [
        { line: "$48° + 67° = 115°$", note: "Add the angles you know." },
        { line: "x = $180° - 115° = 65°$", reason: REASON.triangle },
      ],
      "x is 65°.",
      triangle(48, 67, ["48°", "67°", "x"]),
    ),
    calc(
      "Your turn",
      "Find x.",
      triangle(55, 76, ["55°", "76°", "x"]),
      [
        ["$55° + 76° =$", "131", "Add the angles you know.", { after: "°" }],
        [
          "x = $180° - 131° =$",
          "49",
          "Take the total from 180°.",
          { after: "°", reason: REASON.triangle },
        ],
      ],
      "x is 49°.",
    ),

    calc(
      "Practise",
      "Find x.",
      rightAngled(27, ["27°", null, "x"]),
      [
        ["$90° + 27° =$", "117", "The square marks 90°.", { after: "°" }],
        [
          "x = $180° - 117° =$",
          "63",
          "Take the total from 180°.",
          { after: "°", reason: REASON.triangle },
        ],
      ],
      "x is 63°.",
    ),
    questionSet(
      "Practise",
      "Which angle is missing?",
      [
        ask("Find the missing angle.", "50", "Take the other two from 180°.", "50°.", {
          unit: "°",
          asks: "angle A",
          picture: triangle(50, 60, ["?", "60°", "70°"], undefined),
        }),
        ask("Find the missing angle.", "60", "Take the other two from 180°.", "60°.", {
          unit: "°",
          asks: "angle B",
          changed: "Now another corner.",
          picture: triangle(50, 60, ["50°", "?", "70°"]),
        }),
        ask("Find the missing angle.", "70", "Take the other two from 180°.", "70°.", {
          unit: "°",
          asks: "angle C",
          changed: "Now the top.",
          picture: triangle(50, 60, ["50°", "60°", "?"]),
        }),
        ask("Find x.", "70", "The two x's make 180° − 40°.", "70°.", {
          unit: "°",
          asks: "base angle",
          changed: "Isosceles: two equal angles.",
          picture: triangle(70, 70, ["x", "x", "40°"]),
        }),
      ],
      "Whichever corner is missing, take the others from 180°.",
    ),
    ...owned(list, TRIANGLE, "Your turn", "Practise").filter((s) => s.kind === "sort"),

    questionSet(
      "Variation",
      "Find x. Watch what changes.",
      [
        ask("Find x.", "70", "180° − 50° − 60°.", "70°.", {
          unit: "°",
          asks: "angle C",
          picture: triangle(50, 60, ["50°", "60°", "x"]),
          expect: [
            "Joe says a bigger triangle has a bigger angle sum. Right?",
            "No",
            "Every triangle's angles add up to 180°, big or small.",
            [["Yes", "Stretching makes the sides longer, not the angles add to more."]],
          ],
        }),
        ask("Find x.", "130", "180° − 20° − 30°.", "130°.", {
          unit: "°",
          asks: "angle C",
          changed: "One wide angle.",
          picture: triangle(20, 30, ["20°", "30°", "x"]),
        }),
        ask("Find x.", "75", "The two x's make 150°.", "75°.", {
          unit: "°",
          asks: "base angle",
          changed: "Isosceles, a narrow top.",
          picture: triangle(75, 75, ["x", "x", "30°"]),
        }),
        ask("Find x.", "60", "Three equal angles share 180°.", "60°.", {
          unit: "°",
          asks: "base angle",
          changed: "All three equal.",
          picture: triangle(60, 60, ["x", "x", "x"]),
        }),
      ],
      "Any triangle, any shape: the angles add up to 180°.",
    ),
    { ...own(list, TRIANGLE, "Spot the mistake"), text: "Kai finds the base angles." } as Screen,

    quiz([
      [
        [
          "Find x.",
          "50°",
          ["130°", "60°"],
          "180° − 60° − 70°.",
          triangle(60, 70, ["60°", "70°", "x"]),
          "angle C",
        ],
        [
          "Find x.",
          "70°",
          ["110°", "65°"],
          "180° − 45° − 65°.",
          triangle(45, 65, ["45°", "65°", "x"]),
          "angle C",
        ],
      ],
      [
        [
          "Find x.",
          "63°",
          ["153°", "73°"],
          "180° − 90° − 27°.",
          rightAngled(27, ["27°", null, "x"]),
          "angle C",
        ],
        [
          "Find x.",
          "50°",
          ["140°", "60°"],
          "180° − 90° − 40°.",
          rightAngled(40, ["40°", null, "x"]),
          "angle C",
        ],
      ],
      [
        [
          "Find x.",
          "75°",
          ["30°", "150°"],
          "The two x's make 150°.",
          triangle(75, 75, ["x", "x", "30°"]),
          "base angle",
        ],
        [
          "Find x.",
          "65°",
          ["50°", "130°"],
          "The two x's make 130°.",
          triangle(65, 65, ["x", "x", "50°"]),
          "base angle",
        ],
      ],
    ]),

    reworded(
      list,
      TRIANGLE,
      "The top of the roof",
      { tag: "Real life", text: "What angle do the slopes make at the top?" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**The angles in a triangle add up to 180°.**"],
      triangle(48, 67, ["48°", "67°", "65°"]),
      [
        "**The angles in a triangle add up to 180°.**",
        "Isosceles: the two base angles are equal.",
        "x = 180° − 115° = 65° (angles in a triangle add up to 180°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Any polygon.

const POLYGONS = "y7-angles/polygons";
const polygonsMethod = [
  "Count the sides: n.",
  "It splits into n − 2 triangles.",
  "Angle sum: (n − 2) × 180°.",
  "Take the angles you know from it.",
];

const anyPolygon = stepped(find(list, POLYGONS), {
  method: polygonsMethod,
  variation: {
    relationship: "a polygon's angle sum is (n − 2) × 180°",
    unknowns: ["angle sum", "missing angle", "triangles"],
    surface: ["quadrilaterals", "pentagons", "hexagons", "decagons", "gardens"],
  },
  screens: [
    explain(
      "The rule",
      "Any polygon",
      ["**A polygon with n sides splits into n − 2 triangles.**"],
      split(pentagon),
      "A pentagon is 3 triangles: $3 \\times 180° = 540°$.",
    ),
    reworded(list, POLYGONS, "The angles in a pentagon", { tag: "The rule" }),
    reworded(list, POLYGONS, "Spot the pattern", { tag: "The rule" }),

    ...owned(list, POLYGONS, "Warm-up", "Check you remember").map((s) =>
      s.kind === "answer" && !("picture" in s && s.picture)
        ? ({ ...s, wordsOnly: NUMBER } as Screen)
        : s,
    ),
    typed(
      "Check you remember",
      "How many sides does this shape have?",
      "6",
      "Count them.",
      "6: a hexagon.",
      {
        picture: shape(6),
      },
    ),

    methodCard("The method", polygonsMethod, split(octagon)),
    worked(
      "Watch the method",
      "Find the angle sum of an octagon.",
      [
        { line: "$8 - 2 = 6$ triangles", note: "An octagon has 8 sides." },
        { line: "$6 \\times 180° = 1080°$", reason: REASON.polygon },
      ],
      "1080°.",
      split(octagon),
    ),
    calc(
      "Your turn",
      "Find the angle sum of this shape.",
      split(regular(7, 3, 90)),
      [
        ["Triangles: $7 - 2 =$", "5", "Count the sides, then take 2."],
        [
          "$5 \\times 180° =$",
          "900",
          "180° for each triangle.",
          { after: "°", reason: REASON.polygon },
        ],
      ],
      "900°.",
    ),

    calc(
      "Practise",
      "Find x.",
      polygon(quad, ["70°", "100°", "x", "110°"]),
      [
        ["$70° + 100° + 110° =$", "280", "Add the angles you know.", { after: "°" }],
        [
          "x = $360° - 280° =$",
          "80",
          "A quadrilateral's angles make 360°.",
          { after: "°", reason: REASON.quadrilateral },
        ],
      ],
      "x is 80°.",
    ),
    ...owned(list, POLYGONS, "Together", "Practise").filter(
      (s) => !s.title.includes("quadrilateral"),
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How many triangles?", "4", "6 sides, take 2.", "4.", {
          asks: "triangles",
          picture: split(hexagon),
        }),
        ask("Find the angle sum.", "720", "4 × 180°.", "720°.", {
          unit: "°",
          asks: "angle sum",
          changed: "Now the angle sum.",
          picture: split(hexagon),
        }),
        ask("Find the missing angle.", "120", "540° take the other four.", "120°.", {
          unit: "°",
          asks: "missing angle",
          changed: "A pentagon, one angle missing.",
          picture: polygon(pentagon, ["110°", "100°", "120°", "90°", "?"]),
        }),
        ask("Find the angle sum.", "360", "2 × 180°.", "360°.", {
          unit: "°",
          asks: "angle sum",
          changed: "A quadrilateral.",
          picture: split(quad),
        }),
      ],
      "Triangles first, then the sum, then the missing angle.",
    ),

    questionSet(
      "Variation",
      "Find the angle sum. Watch what changes.",
      [
        ask("Find the angle sum.", "540", "3 triangles.", "540°.", {
          unit: "°",
          asks: "angle sum",
          picture: shape(5),
          expect: [
            "Raj says 5 sides, so 5 × 180°. Right?",
            "No: 3 × 180°",
            "A pentagon splits into 5 − 2 = 3 triangles.",
            [["Yes", "Draw the diagonals: only 3 triangles."]],
          ],
        }),
        ask("Find the angle sum.", "720", "4 triangles.", "720°.", {
          unit: "°",
          asks: "angle sum",
          changed: "One more side.",
          picture: shape(6),
        }),
        ask("Find the angle sum.", "1440", "8 triangles.", "1440°.", {
          unit: "°",
          asks: "angle sum",
          changed: "Ten sides.",
          picture: shape(10),
        }),
        ask("Find the angle sum.", "180", "1 triangle.", "180°.", {
          unit: "°",
          asks: "angle sum",
          changed: "Back to a triangle.",
          picture: shape(3),
        }),
      ],
      "Each extra side adds one more triangle: 180° more.",
    ),
    own(list, POLYGONS, "Spot the mistake"),

    quiz([
      [
        ["Find the angle sum.", "540°", ["900°", "360°"], "3 triangles.", shape(5), "angle sum"],
        ["Find the angle sum.", "720°", ["1080°", "540°"], "4 triangles.", shape(6), "angle sum"],
      ],
      [
        [
          "Find x.",
          "80°",
          ["100°", "260°"],
          "360° − 280°.",
          polygon(quad, ["80°", "100°", "x", "100°"]),
          "missing angle",
        ],
        [
          "Find x.",
          "90°",
          ["180°", "70°"],
          "360° − 270°.",
          polygon(quad, ["90°", "110°", "x", "70°"]),
          "missing angle",
        ],
      ],
      [
        ["How many triangles?", "6", ["8", "7"], "8 sides, take 2.", split(octagon), "triangles"],
        [
          "How many triangles?",
          "5",
          ["7", "6"],
          "7 sides, take 2.",
          split(regular(7, 3, 90)),
          "triangles",
        ],
      ],
    ]),

    reworded(
      list,
      POLYGONS,
      "The garden corner",
      { tag: "Real life", text: "What angle is the last corner of the garden?" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**A polygon with n sides splits into n − 2 triangles.**"],
      split(pentagon),
      [
        "**A polygon with n sides splits into n − 2 triangles.**",
        "Angle sum = (n − 2) × 180°",
        "Octagon: 6 × 180° = 1080°",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Regular polygons.

const REGULAR = "y7-angles/regular";
const regularMethod = [
  "Exterior angle: 360° ÷ the number of sides.",
  "Interior angle: 180° − the exterior angle.",
  "Sides: 360° ÷ the exterior angle.",
];

const regularPolygons = stepped(find(list, REGULAR), {
  method: regularMethod,
  variation: {
    relationship: "a regular polygon's sides, exterior and interior angles",
    unknowns: ["exterior", "interior"],
    surface: ["squares", "triangles", "many sides", "tiles"],
  },
  screens: [
    explain(
      "The rule",
      "Regular polygons",
      ["**The exterior angles of any polygon add up to 360°.**"],
      shape(6),
      "Walk round it and you turn a full circle. Interior + exterior = 180°.",
    ),
    choose(
      "The rule",
      "A regular hexagon's interior angle is",
      "120°",
      "Its exterior angle is 360° ÷ 6 = 60°, so 180° − 60°.",
      [
        ["60°", "That's the exterior angle."],
        ["300°", "Interior and exterior make 180°."],
      ],
      { picture: shape(6) },
    ),

    ...owned(list, REGULAR, "Warm-up", "Check you remember").map((s) =>
      s.title === "Angle sum of a hexagon"
        ? ({
            ...s,
            title: "What do a hexagon's angles add up to?",
            text: undefined,
            picture: shape(6),
          } as unknown as Screen)
        : ({ ...s, wordsOnly: NUMBER } as Screen),
    ),
    words(
      typed("Check you remember", "Work out 180 − 45.", "135", "180 − 40, then 5 more.", "135."),
      NUMBER,
    ),

    methodCard("The method", regularMethod, shape(8)),
    worked(
      "Watch the method",
      "Find the exterior and interior angles of this regular octagon.",
      [
        { line: "Exterior: $360° \\div 8 = 45°$", reason: REASON.exterior },
        { line: "Interior: $180° - 45° = 135°$", reason: REASON.interior },
      ],
      "45° and 135°.",
      shape(8),
    ),
    calc(
      "Your turn",
      "Find the interior angle of this regular pentagon.",
      shape(5),
      [
        [
          "Exterior: $360° \\div 5 =$",
          "72",
          "Share 360° between the 5 corners.",
          { after: "°", reason: REASON.exterior },
        ],
        [
          "Interior: $180° - 72° =$",
          "108",
          "Interior and exterior make 180°.",
          { after: "°", reason: REASON.interior },
        ],
      ],
      "108°.",
    ),

    calc(
      "Practise",
      "Find the interior angle of this regular decagon.",
      shape(10),
      [
        [
          "Exterior: $360° \\div 10 =$",
          "36",
          "Share 360° between 10 corners.",
          { after: "°", reason: REASON.exterior },
        ],
        [
          "Interior: $180° - 36° =$",
          "144",
          "Interior and exterior make 180°.",
          { after: "°", reason: REASON.interior },
        ],
      ],
      "144°.",
    ),
    ...owned(list, REGULAR, "Together", "Practise")
      .filter((s) => !s.title.includes("decagon"))
      .map(
        (s) =>
          ({ ...s, wordsOnly: "A polygon with 20 sides is too fine to draw clearly." }) as Screen,
      ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the exterior angle.", "40", "360° ÷ 9.", "40°.", {
          unit: "°",
          asks: "exterior",
          picture: shape(9),
        }),
        ask("Find the interior angle.", "150", "Exterior 30°, so 180° − 30°.", "150°.", {
          unit: "°",
          asks: "interior",
          changed: "Now the interior angle.",
          picture: shape(12),
        }),
        ask("Find the interior angle.", "120", "Exterior 60°.", "120°.", {
          unit: "°",
          asks: "interior",
          changed: "Fewer sides.",
          picture: shape(6),
        }),
        ask("Find the interior angle.", "140", "Exterior 40°.", "140°.", {
          unit: "°",
          asks: "interior",
          changed: "Nine sides.",
          picture: shape(9),
        }),
      ],
      "Exterior is 360° shared; interior is what's left of 180°.",
    ),

    questionSet(
      "Variation",
      "Find the interior angle. Watch what changes.",
      [
        ask("Find the interior angle.", "120", "Exterior 60°.", "120°.", {
          unit: "°",
          asks: "interior",
          picture: shape(6),
          expect: [
            "Lia says interior and exterior are equal. Right?",
            "No",
            "They add to 180°: interior 120°, exterior 60°.",
            [["Yes", "Only when both are 90°: a square."]],
          ],
        }),
        ask("Find the interior angle.", "90", "Exterior 90°.", "90°.", {
          unit: "°",
          asks: "interior",
          changed: "A square: 4 sides.",
          picture: shape(4),
        }),
        ask("Find the interior angle.", "60", "Exterior 120°.", "60°.", {
          unit: "°",
          asks: "interior",
          changed: "An equilateral triangle.",
          picture: shape(3),
        }),
        ask("Find the exterior angle.", "20", "360° ÷ 18.", "20°.", {
          unit: "°",
          asks: "exterior",
          changed: "Many sides: a small exterior angle.",
          picture: shape(18),
        }),
      ],
      "More sides: smaller exterior angles, bigger interior ones.",
    ),
    { ...own(list, REGULAR, "Spot the mistake"), picture: shape(6) } as Screen,
    ...owned(list, REGULAR, "Your turn", "Variation").filter((s) => s.kind === "sort"),

    quiz([
      [
        ["Find the exterior angle.", "40°", ["140°", "20°"], "360° ÷ 9.", shape(9), "exterior"],
        ["Find the exterior angle.", "36°", ["144°", "18°"], "360° ÷ 10.", shape(10), "exterior"],
      ],
      [
        ["Find the interior angle.", "150°", ["30°", "165°"], "180° − 30°.", shape(12), "interior"],
        ["Find the interior angle.", "135°", ["45°", "120°"], "180° − 45°.", shape(8), "interior"],
      ],
      [
        ["Find the interior angle.", "120°", ["60°", "720°"], "180° − 60°.", shape(6), "interior"],
        ["Find the interior angle.", "108°", ["72°", "540°"], "180° − 72°.", shape(5), "interior"],
      ],
    ]),

    reworded(list, REGULAR, "Tiling a floor", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The exterior angles of any polygon add up to 360°.**"],
      shape(8),
      [
        "**The exterior angles of any polygon add up to 360°.**",
        "Regular: exterior = 360° ÷ n; interior = 180° − exterior.",
        "Octagon: exterior 45°, interior 135°.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

export const y7AnglesStepped: [string, UnitLesson[]][] = [
  [FULL, [fullTurn]],
  [CROSSING, [crossing]],
  [TRIANGLE, [insideTriangle]],
  [POLYGONS, [anyPolygon]],
  [REGULAR, [regularPolygons]],
];
