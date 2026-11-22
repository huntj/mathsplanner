// The pilot lessons beside the circle theorems, one from each stage, on the stepped template
// (docs/proposals/lesson-stepped.md): the rule and an Explore; a check of what the method needs;
// the method shown, then typed a line at a time; practice with the unknown moving; new looks and
// a spot-the-mistake; an exit check; a real-life problem; and a summary to copy into a book.
import {
  ask,
  calc,
  choose,
  explain,
  explore,
  methodCard,
  mistake,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import { gfRatio1 } from "./gf-ratio-1.ts";
import { REASON } from "./reasons.ts";
import { find, relation, reworded, stepped, tagged, words } from "./stepped.ts";
import type { BarsPic, DrawingPic, Picture, ShapePic, UnitLesson } from "./types.ts";
import { fan, y7Angles } from "./y7-angles.ts";
import { hundred, y7Fdp } from "./y7-fdp.ts";
import { measured, y8Area } from "./y8-area.ts";
import { tri, y9Trigonometry } from "./y9-trigonometry.ts";

// ---------------------------------------------------------------------------------------------
// Year 7: angles on a straight line.

const HALF_TURN = "y7-angles/half-turn";

/** Two angles on a straight line, the first measured up from the right, the line turned by `turn`. */
const line2 = (first: number, labels: [string, string], turn = 0, mark = "x") =>
  fan([turn, turn + first, turn + 180], [labels[0], labels[1], null], mark);
/** Three angles on a straight line. */
const line3 = (a: number, b: number, labels: [string, string, string], mark = "x") =>
  fan([0, a, a + b, 180], [labels[0], labels[1], labels[2], null], mark);

const halfTurnMethod = [
  "Check the angles sit on one straight line.",
  "Add up the angles you know.",
  "Take the total away from 180°.",
];

const halfTurn = stepped(find(y7Angles, HALF_TURN), {
  method: halfTurnMethod,
  variation: {
    relationship: "the angles on a straight line add up to 180°",
    unknowns: ["angle 1", "angle 2", "angle 3", "x"],
    surface: ["numbers", "line turned", "which side", "three angles", "algebra"],
  },
  screens: [
    explain(
      "The rule",
      "Angles on a straight line",
      ["**Angles on a straight line add up to 180°.**"],
      line2(60, ["60°", "120°"]),
      "A straight line is a half turn: 180°.",
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
            { name: "A", onCircle: 180 },
            { name: "B", onCircle: 0 },
            { name: "C", onCircle: 60, drag: [20, 160] },
          ],
          lines: ["AB", "OC"],
          angles: [{ name: "BOC" }, { name: "COA" }],
          readouts: [
            { label: "Angle BOC", angle: "BOC" },
            { label: "Angle COA", angle: "COA" },
            { label: "Together", sum: ["BOC", "COA"] },
          ],
        },
        [
          "What did you notice?",
          "The two angles always add up to 180°",
          "Together they make the straight line: a half turn.",
          [
            ["The two angles are always equal", "Only when the ray points straight up."],
            ["The total changes as the ray turns", "Look again: it's 180° every time."],
          ],
        ],
        "Angles on a straight line add up to 180°, however the ray turns.",
        {
          text: "Drag C round. Watch the two angles on the straight line AB.",
        },
      ),
    ),

    typed(
      "Check you remember",
      "Find the missing angle.",
      "180",
      "A straight line is a half turn.",
      "180°: a half turn.",
      {
        unit: "°",
        picture: fan([0, 180], ["?", null], "?"),
      },
    ),
    words(
      typed(
        "Check you remember",
        "Work out 180 − 65.",
        "115",
        "180 − 60 = 120. Then take away 5 more.",
        "115.",
      ),
      "A number check: the taking away the method needs.",
    ),
    words(
      typed(
        "Check you remember",
        "Work out 40 + 75.",
        "115",
        "40 + 70 = 110. Then add 5 more.",
        "115.",
      ),
      "A number check: the adding the method needs.",
    ),

    methodCard("The method", halfTurnMethod, line3(40, 75, ["40°", "75°", "x"])),
    worked(
      "Watch the method",
      "Find x.",
      [
        { line: "$40° + 75° = 115°$", note: "Add the angles you know." },
        { line: "x = $180° - 115° = 65°$", reason: REASON.straightLine },
      ],
      "Add, then take away from 180°.",
      line3(40, 75, ["40°", "75°", "x"]),
    ),
    calc(
      "Your turn",
      "Find x.",
      line2(55, ["x", "125°"]),
      [
        [
          "x = $180° - 125° =$",
          "55",
          "Take 125° away from 180°.",
          { after: "°", reason: REASON.straightLine },
        ],
      ],
      "x is 55°.",
    ),

    calc(
      "Practise",
      "Find x.",
      line3(35, 90, ["35°", "90°", "x"]),
      [
        ["$35° + 90° =$", "125", "Add the angles you know.", { after: "°" }],
        [
          "x = $180° - 125° =$",
          "55",
          "Take the total away from 180°.",
          { after: "°", reason: REASON.straightLine },
        ],
      ],
      "x is 55°.",
    ),
    questionSet(
      "Practise",
      "Which angle is missing?",
      [
        ask("Find the missing angle.", "60", "Take the other two from 180°.", "60°.", {
          unit: "°",
          asks: "angle 3",
          picture: line3(50, 70, ["50°", "70°", "?"], "?"),
        }),
        ask("Find the missing angle.", "40", "Take the other two from 180°.", "40°.", {
          unit: "°",
          asks: "angle 2",
          changed: "Now the middle angle is missing.",
          picture: line3(45, 40, ["45°", "?", "95°"], "?"),
        }),
        ask("Find the missing angle.", "70", "Take the other two from 180°.", "70°.", {
          unit: "°",
          asks: "angle 1",
          changed: "Now the first angle is missing.",
          picture: line3(70, 80, ["?", "80°", "30°"], "?"),
        }),
        ask(
          "Find x.",
          "40",
          "The two x's make 180° take away the third angle.",
          "40°: 40° + 40° + 100° = 180°.",
          {
            unit: "°",
            asks: "x",
            changed: "Two angles are the same size, x.",
            picture: line3(40, 40, ["x", "x", "100°"]),
          },
        ),
      ],
      "Wherever the gap is, the same 180° fills it.",
    ),

    questionSet(
      "Variation",
      "Find x each time. Watch what changes.",
      [
        ask("Find x.", "50", "Take the angle you know from 180°.", "50°.", {
          unit: "°",
          asks: "angle 1",
          picture: line2(50, ["x", "130°"]),
        }),
        ask("Find x.", "60", "Take the angle you know from 180°.", "60°.", {
          unit: "°",
          asks: "angle 1",
          changed: "The angle you know went down by 10°.",
          expect: [
            "So x…",
            "goes up by 10°",
            "They still make 180°: less on one side means more on the other.",
            [
              ["goes down by 10°", "They must still add up to 180°."],
              ["stays the same", "They must still add up to 180°."],
            ],
          ],
          picture: line2(60, ["x", "120°"]),
        }),
        ask("Find x.", "60", "Still take it from 180°.", "60°: turning the line changes nothing.", {
          unit: "°",
          asks: "angle 1",
          changed: "The line is turned.",
          picture: line2(60, ["x", "120°"], 35),
        }),
        ask(
          "Find x.",
          "60",
          "Still take it from 180°.",
          "60°: it doesn't matter which side x is on.",
          {
            unit: "°",
            asks: "angle 2",
            changed: "x is on the other side now.",
            picture: line2(120, ["120°", "x"]),
          },
        ),
        ask(
          "Find x.",
          "55",
          "Add the two angles you know, then take it from 180°.",
          "55°: 180° − 125°.",
          {
            unit: "°",
            asks: "angle 3",
            changed: "Three angles now, and one is a right angle.",
            expect: [
              "There's one more angle on the line. x will be…",
              "smaller than before",
              "The same 180° is shared three ways now.",
              [["bigger than before", "More angles share the same 180°."]],
            ],
            picture: line3(35, 90, ["35°", "90°", "x"]),
          },
        ),
        ask(
          "Find x.",
          "60",
          "x + 2x = 3x, and 3x = 180°.",
          "60°: then 2x is 120°, and 60° + 120° = 180°.",
          {
            unit: "°",
            asks: "x",
            changed: "Both angles are in algebra.",
            picture: line2(60, ["x", "2x"]),
          },
        ),
      ],
      "Turned, swapped, three angles or algebra: it's always 180°.",
    ),
    mistake(
      "Mia finds x.",
      ["$35° + 60° + x = 180°$", "$95° + x = 180°$", "$x = 180° + 95°$", "$x = 275°$"],
      2,
      "To undo + 95°, take 95° away: x = 180° − 95° = 85°.",
      fan([0, 35, 95, 180], ["35°", "60°", "x"]),
    ),

    quiz([
      [
        ["Find x.", "75°", ["255°", "85°"], "180° − 105°.", line2(75, ["x", "105°"]), "angle 1"],
        [
          "Find x.",
          "35°",
          ["215°", "45°"],
          "180° − 145°.",
          line2(145, ["145°", "x"], 30),
          "angle 1",
        ],
      ],
      [
        [
          "Find x.",
          "85°",
          ["95°", "265°"],
          "180° − 95°.",
          line3(30, 85, ["30°", "x", "65°"]),
          "angle 2",
        ],
        [
          "Find x.",
          "85°",
          ["95°", "275°"],
          "180° − 95°.",
          line3(50, 85, ["50°", "x", "45°"]),
          "angle 2",
        ],
      ],
      [
        ["Find x.", "30°", ["60°", "120°"], "2x = 60°.", line3(30, 30, ["x", "x", "120°"]), "x"],
        ["Find x.", "50°", ["100°", "80°"], "2x = 100°.", line3(50, 50, ["x", "x", "80°"]), "x"],
      ],
    ]),

    reworded(
      y7Angles,
      HALF_TURN,
      "How far back?",
      {
        tag: "Real life",
        text: "The keyboard lies flat on the desk. What angle is the back of the screen to the desk?",
        hint: "The 110° and the angle behind the screen make a straight line.",
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Angles on a straight line add up to 180°.**"],
      line3(40, 75, ["40°", "75°", "65°"]),
      [
        "**Angles on a straight line add up to 180°.**",
        "Add the angles you know. Take the total away from 180°.",
        "$40° + 75° = 115°$",
        "x = 180° − 115° = 65° (angles on a straight line add up to 180°)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Year 7: percentages, fractions and decimals.

const fdpRel = (from: [string, string], to: string) => relation([from, [to, "?"]], ["="], 1);

const PERCENT = "y7-fdp/percentages";
const percentMethod = [
  "Per cent means out of 100.",
  "Percentage to decimal: divide by 100.",
  "Percentage to fraction: put it over 100, then simplify.",
  "Fraction to percentage: make it out of 100.",
];

const percentages = stepped(find(y7Fdp, PERCENT), {
  method: percentMethod,
  variation: {
    relationship: "a fraction, a decimal and a percentage can name the same amount",
    unknowns: ["percentage", "decimal", "fraction"],
    surface: ["numbers", "small percentages", "over 100%", "picture", "words"],
  },
  screens: [
    explain(
      "The rule",
      "Percentages",
      ["**Per cent means out of 100.**"],
      hundred(40),
      "40 squares out of 100 are shaded: that's 40%.",
    ),
    tagged(
      "The rule",
      explore(
        "Shade the hundred square",
        { kind: "hundred", start: 25 },
        [
          "What did you notice?",
          "The percentage is how many squares out of 100 are shaded",
          "Per cent means out of 100: 40 squares shaded is 40%, 0.4 and $\\frac{40}{100}$.",
          [
            [
              "The decimal is the number of squares shaded",
              "Look again: 40 squares is 0.4, not 40.",
            ],
            ["The fraction is always out of 10", "It's out of 100 before it's simplified."],
          ],
        ],
        "The same shading names a fraction, a decimal and a percentage.",
        {
          text: "Drag the slider to shade more or fewer squares. Watch the three ways of writing it.",
        },
      ),
    ),

    typed(
      "Check you remember",
      "How many squares out of 100 are shaded?",
      "30",
      "Count the shaded rows of 10.",
      "30 out of 100.",
      {
        picture: hundred(30),
      },
    ),
    typed(
      "Check you remember",
      "Work out 40 ÷ 100.",
      "0.4",
      "Dividing by 100 moves the digits two places.",
      "0.4.",
    ),
    typed(
      "Check you remember",
      "Simplify $\\frac{40}{100}$.",
      "2/5",
      "Divide the top and bottom by 20.",
      "$\\frac25$.",
    ),

    methodCard("The method", percentMethod, hundred(40)),
    worked(
      "Watch the method",
      "Write 40% as a decimal and as a fraction.",
      [
        { line: "$40\\% = \\frac{40}{100}$", note: "Per cent means out of 100." },
        { line: "$\\frac{40}{100} = 0.4$" },
        { line: "$\\frac{40}{100} = \\frac{2}{5}$", note: "Divide the top and bottom by 20." },
      ],
      "Out of 100 first, then a decimal or a fraction.",
      hundred(40),
    ),
    calc(
      "Your turn",
      "Write 60% as a decimal and as a fraction.",
      hundred(60),
      [
        ["$60\\% = \\frac{60}{100} =$", "0.6", "Divide 60 by 100."],
        ["$\\frac{60}{100} =$", "3/5", "Divide the top and bottom by 20."],
      ],
      "60% is 0.6, and $\\frac35$.",
    ),

    calc(
      "Practise",
      "Write 0.35 as a percentage.",
      undefined,
      [["$0.35 \\times 100 =$", "35", "Times by 100.", { after: "%" }]],
      "0.35 is 35%.",
    ),
    questionSet(
      "Practise",
      "Which form is missing?",
      [
        ask("Write $\\frac14$ as a percentage.", "25", "$\\frac14 = \\frac{25}{100}$.", "25%.", {
          unit: "%",
          asks: "percentage",
          picture: fdpRel(["fraction", "$\\frac14$"], "percentage"),
        }),
        ask("Write 45% as a decimal.", "0.45", "Divide by 100.", "0.45.", {
          asks: "decimal",
          changed: "Now the decimal is missing.",
          picture: fdpRel(["percentage", "45%"], "decimal"),
        }),
        ask(
          "Write 20% as a fraction in its simplest form.",
          "1/5",
          "$\\frac{20}{100}$, then simplify.",
          "$\\frac15$.",
          {
            asks: "fraction",
            changed: "Now the fraction is missing.",
            picture: fdpRel(["percentage", "20%"], "fraction"),
          },
        ),
        ask("Write 0.07 as a percentage.", "7", "Times by 100.", "7%.", {
          unit: "%",
          asks: "percentage",
          changed: "From a decimal this time.",
          picture: fdpRel(["decimal", "0.07"], "percentage"),
        }),
      ],
      "Find which form you're given and which you need, then use the matching step.",
    ),

    questionSet(
      "Variation",
      "Write each decimal as a percentage. Watch what changes.",
      [
        ask("Write 0.3 as a percentage.", "30", "Times by 100.", "30%.", {
          unit: "%",
          asks: "percentage",
        }),
        ask("Write 0.35 as a percentage.", "35", "Times by 100.", "35%.", {
          unit: "%",
          asks: "percentage",
          changed: "There's a second decimal place.",
        }),
        ask(
          "Write 0.05 as a percentage.",
          "5",
          "Times by 100: the digits move two places.",
          "5%.",
          {
            unit: "%",
            asks: "percentage",
            changed: "A small one, with a 0 before the 5.",
            expect: [
              "0.05 has a 0 before the 5. The percentage is…",
              "5%",
              "Times by 100 moves the digits two places: 0.05 becomes 5.",
              [
                ["50%", "That's 0.5."],
                ["0.05%", "Times by 100; don't just add a % sign."],
              ],
            ],
          },
        ),
        ask(
          "Write 1.2 as a percentage.",
          "120",
          "Times by 100.",
          "120%: 1 is 100%, so 1.2 is 120%.",
          {
            unit: "%",
            asks: "percentage",
            changed: "This decimal is more than 1.",
            expect: [
              "The decimal is more than 1, so the percentage is…",
              "more than 100%",
              "1 whole is 100%.",
              [["less than 100%", "1 whole is 100%, and this is more than 1."]],
            ],
          },
        ),
        ask("What percentage of the hundred square is shaded?", "27", "Count out of 100.", "27%.", {
          unit: "%",
          asks: "percentage",
          changed: "A picture instead of a decimal.",
          picture: hundred(27),
        }),
        ask(
          "3 in every 4 pupils walk to school. What percentage walk?",
          "75",
          "$\\frac34$ out of 100: times top and bottom by 25.",
          "75%.",
          {
            unit: "%",
            asks: "percentage",
            changed: "In words: 3 in every 4.",
          },
        ),
      ],
      "Decimal, picture or words: per cent always means out of 100.",
    ),
    reworded(y7Fdp, PERCENT, "Where did it go wrong?", {}),

    quiz([
      [
        ["0.4 as a percentage", "40%", ["4%", "0.4%"], "Times by 100.", undefined, "percentage"],
        ["0.09 as a percentage", "9%", ["90%", "0.09%"], "Times by 100.", undefined, "percentage"],
      ],
      [
        ["35% as a decimal", "0.35", ["3.5", "35"], "Divide by 100.", undefined, "decimal"],
        ["8% as a decimal", "0.08", ["0.8", "8"], "Divide by 100.", undefined, "decimal"],
      ],
      [
        [
          "50% as a fraction",
          "$\\frac12$",
          ["$\\frac{1}{50}$", "$\\frac{1}{5}$"],
          "$\\frac{50}{100}$ simplified.",
          undefined,
          "fraction",
        ],
        [
          "25% as a fraction",
          "$\\frac14$",
          ["$\\frac{1}{25}$", "$\\frac{2}{5}$"],
          "$\\frac{25}{100}$ simplified.",
          undefined,
          "fraction",
        ],
      ],
    ]),

    reworded(
      y7Fdp,
      PERCENT,
      "Which is the best score?",
      { tag: "Real life" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Per cent means out of 100.**"],
      hundred(40),
      [
        "**Per cent means out of 100.**",
        "Percentage to decimal: divide by 100.",
        "Percentage to fraction: put it over 100, then simplify.",
        "40% = 0.4 = $\\frac{2}{5}$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Year 8: the area of a circle.

const CIRCLE_AREA = "y8-area/circle-area";

/** A circle with its area written inside, and its radius or diameter marked to find. */
const withArea = (area: string, across: "d" | "r", label = "?"): Picture => {
  const pic = measured(across, label);
  return pic.kind === "drawing"
    ? { ...pic, items: [...pic.items, { text: `Area ${area}`, at: { x: 0, y: -1.3 } }] }
    : pic;
};

/** Half a circle, with its radius marked. */
const semicircle = (label: string): DrawingPic => ({
  kind: "drawing",
  items: [
    { arc: { x: 0, y: 0 }, r: 3, from: 0, to: 180 },
    {
      line: [
        { x: -3, y: 0 },
        { x: 0, y: 0 },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
      ],
      tone: "find",
    },
    { dot: { x: 0, y: 0 } },
    { text: label, at: { x: 1.5, y: 0.45 }, tone: "find" },
  ],
});

/** A rectangle, its sides labelled. */
const rectangle = (w: number, h: number, sides: [string, string]): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ],
  sides: [sides[0], sides[1], null, null],
});

const circleAreaMethod = [
  "Find the radius. Given the diameter? Halve it.",
  "Square the radius.",
  "Times by π.",
  "Give the units squared, and round as asked.",
];

const circleArea = stepped(find(y8Area, CIRCLE_AREA), {
  method: circleAreaMethod,
  variation: {
    relationship: "area = π × radius²",
    unknowns: ["area", "radius", "diameter"],
    surface: ["numbers", "diameter given", "half a circle", "context", "in terms of π"],
  },
  screens: [
    explain(
      "The rule",
      "The area of a circle",
      ["**The area of a circle is π × r².**"],
      measured("r", "r"),
      "r is the radius: from the centre to the edge.",
    ),
    tagged(
      "The rule",
      explore(
        "Grow the circle",
        {
          kind: "geometry",
          circleThrough: "R",
          points: [{ name: "R", from: "O", deg: 0, dist: 2, drag: [1, 4] }],
          lines: ["OR"],
          readouts: [
            { label: "Radius", length: "OR" },
            { label: "Area", circleArea: "OR" },
            { label: "Circumference", circumference: "OR" },
          ],
        },
        [
          "Drag the radius from 2 cm to 4 cm. What happens to the area?",
          "It's 4 times as big",
          "Double the radius and the area goes up 4 times, because the radius is squared: $2^2 = 4$.",
          [
            ["It doubles", "Look again: 12.6 cm² becomes 50.3 cm²."],
            ["It goes up by 2 cm²", "Look again: it grows much faster than the radius."],
          ],
        ],
        "The circumference doubles with the radius, but the area goes up 4 times.",
        {
          text: "Drag R to grow and shrink the circle. Watch the area and the circumference.",
        },
      ),
    ),

    words(
      typed("Check you remember", "Work out $5^2$.", "25", "$5^2$ means 5 × 5.", "25."),
      "A number check: squaring, which the method needs.",
    ),
    typed(
      "Check you remember",
      "Find the radius.",
      "5",
      "The radius is half the diameter.",
      "5 cm.",
      {
        unit: "cm",
        picture: measured("d", "10 cm"),
      },
    ),
    typed(
      "Check you remember",
      "Find the area of the rectangle.",
      "18",
      "Length times width.",
      "18 cm².",
      {
        unit: "cm²",
        picture: rectangle(6, 3, ["6 cm", "3 cm"]),
      },
    ),

    methodCard("The method", circleAreaMethod, measured("r", "5 cm")),
    worked(
      "Watch the method",
      "Find the area, to 1 decimal place.",
      [
        { line: "$5^2 = 25$", note: "Square the radius." },
        { line: "$\\pi \\times 25 = 78.5$ cm²", note: "Times by π, and round to 1 d.p." },
      ],
      "Radius squared, times π.",
      measured("r", "5 cm"),
    ),
    calc(
      "Your turn",
      "Find the area, to 1 decimal place.",
      measured("r", "4 cm"),
      [
        ["$4^2 =$", "16", "Square the radius."],
        ["$\\pi \\times 16 =$", "50.3", "Times by π, then round to 1 d.p.", { after: "cm²" }],
      ],
      "The area is 50.3 cm².",
    ),

    calc(
      "Practise",
      "Find the area, to 1 decimal place.",
      measured("d", "10 cm"),
      [
        ["r = $10 \\div 2 =$", "5", "Halve the diameter.", { after: "cm" }],
        ["$5^2 =$", "25", "Square the radius."],
        ["$\\pi \\times 25 =$", "78.5", "Times by π, then round to 1 d.p.", { after: "cm²" }],
      ],
      "The area is 78.5 cm².",
    ),
    questionSet(
      "Practise",
      "Which part is missing?",
      [
        ask("Find the area, to 1 d.p.", "12.6", "Square the radius, times π.", "12.6 cm².", {
          unit: "cm²",
          asks: "area",
          picture: measured("r", "2 cm"),
        }),
        ask(
          "Find the radius.",
          "4",
          "Divide by π to get $r^2$, then square root.",
          "4 cm: $50.3 \\div \\pi = 16$, and $\\sqrt{16} = 4$.",
          {
            unit: "cm",
            asks: "radius",
            changed: "Now the area is given and the radius is missing: work backwards.",
            expect: [
              "To work backwards from the area, first…",
              "divide by π",
              "Undo each step in reverse: divide by π, then square root.",
              [["square root", "Undo the last step first: the times by π."]],
            ],
            picture: withArea("50.3 cm²", "r"),
          },
        ),
        ask(
          "Find the radius.",
          "10",
          "Divide by π, then square root.",
          "10 cm: $314.2 \\div \\pi \\approx 100$.",
          {
            unit: "cm",
            asks: "radius",
            changed: "A bigger area: the same steps.",
            picture: withArea("314.2 cm²", "r"),
          },
        ),
        ask(
          "Find the diameter.",
          "6",
          "Find the radius first, then double it.",
          "6 cm: $28.3 \\div \\pi \\approx 9$, so the radius is 3 cm.",
          {
            unit: "cm",
            asks: "diameter",
            changed: "Now the diameter is missing.",
            picture: withArea("28.3 cm²", "d"),
          },
        ),
      ],
      "Forwards: square, times π. Backwards: divide by π, square root.",
    ),

    questionSet(
      "Variation",
      "Find each area, to 1 decimal place. Watch what changes.",
      [
        ask(
          "Find the area.",
          "28.3",
          "Square the radius, times π.",
          "28.3 cm²: $\\pi \\times 9$.",
          {
            unit: "cm²",
            asks: "area",
            picture: measured("r", "3 cm"),
          },
        ),
        ask(
          "Find the area.",
          "113.1",
          "Square the radius, times π.",
          "113.1 cm²: four times 28.3 cm².",
          {
            unit: "cm²",
            asks: "area",
            changed: "The radius doubled.",
            expect: [
              "The radius doubled. The area…",
              "is 4 times as big",
              "The radius is squared, and $2^2 = 4$.",
              [
                ["doubles", "The radius is squared, so doubling it makes the area 4 times as big."],
                ["stays the same", "A bigger circle covers more."],
              ],
            ],
            picture: measured("r", "6 cm"),
          },
        ),
        ask(
          "Find the area.",
          "28.3",
          "Halve the diameter to get the radius.",
          "28.3 cm²: the first circle again.",
          {
            unit: "cm²",
            asks: "area",
            changed: "You're given the diameter, not the radius.",
            expect: [
              "So the radius is…",
              "3 cm",
              "The radius is half the diameter.",
              [["6 cm", "That's the diameter: halve it."]],
            ],
            picture: measured("d", "6 cm"),
          },
        ),
        ask(
          "Find the area of the semicircle.",
          "14.1",
          "Find the whole circle's area, then halve it.",
          "14.1 cm²: half of 28.3 cm².",
          {
            unit: "cm²",
            asks: "area",
            changed: "Only half a circle.",
            picture: semicircle("3 cm"),
          },
        ),
        ask(
          "Find the pizza's area, to the nearest cm².",
          "707",
          "The measurement right across is the diameter: halve it.",
          "707 cm²: the radius is 15 cm.",
          {
            unit: "cm²",
            asks: "area",
            changed: "A real one: the pizza is measured right across.",
            picture: measured("d", "30 cm"),
          },
        ),
        ask(
          "Give the area in terms of π.",
          "$49\\pi$",
          "Square the radius, and leave π as it is.",
          "$49\\pi$ cm²: exact, without rounding.",
          {
            asks: "area",
            changed: "Leave π in the answer.",
            others: ["$14\\pi$", "$7\\pi$"],
            picture: measured("r", "7 cm"),
          },
        ),
      ],
      "Radius, square, times π: whatever the circle looks like.",
    ),
    reworded(y8Area, CIRCLE_AREA, "Where did it go wrong?", {
      text: "Dev finds the area of this circle.",
      picture: measured("r", "6 cm"),
    }),

    quiz([
      [
        [
          "Find the area, to 1 d.p.",
          "314.2 cm²",
          ["62.8 cm²", "31.4 cm²"],
          "$\\pi \\times 100$.",
          measured("r", "10 cm"),
          "area",
        ],
        [
          "Find the area, to 1 d.p.",
          "3.1 cm²",
          ["6.3 cm²", "1 cm²"],
          "$\\pi \\times 1$.",
          measured("r", "1 cm"),
          "area",
        ],
      ],
      [
        [
          "Find the radius.",
          "2 cm",
          ["4 cm", "6.3 cm"],
          "$12.6 \\div \\pi \\approx 4$; $\\sqrt{4} = 2$.",
          withArea("12.6 cm²", "r"),
          "radius",
        ],
        [
          "Find the radius.",
          "6 cm",
          ["36 cm", "12 cm"],
          "$113.1 \\div \\pi \\approx 36$; $\\sqrt{36} = 6$.",
          withArea("113.1 cm²", "r"),
          "radius",
        ],
      ],
      [
        [
          "Find the diameter.",
          "8 cm",
          ["4 cm", "16 cm"],
          "The radius is 4 cm, so the diameter is 8 cm.",
          withArea("50.3 cm²", "d"),
          "diameter",
        ],
        [
          "Find the diameter.",
          "10 cm",
          ["5 cm", "25 cm"],
          "The radius is 5 cm, so the diameter is 10 cm.",
          withArea("78.5 cm²", "d"),
          "diameter",
        ],
      ],
    ]),

    reworded(
      y8Area,
      CIRCLE_AREA,
      "The round rug, radius 1.5 m",
      { tag: "Real life", title: "The round rug", picture: measured("r", "1.5 m") },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**The area of a circle is π × r².**"],
      measured("r", "5 cm"),
      [
        "**The area of a circle is π × r².**",
        "Given the diameter? Halve it first.",
        "$5^2 = 25$, then $\\pi \\times 25 = 78.5$ cm²",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Year 9: the sine ratio.

const SINE = "y9-trigonometry/sine";

const sineMethod = [
  "Label the sides from θ: H, O and A.",
  "Sine uses O and H: $\\sin\\theta = \\frac{O}{H}$.",
  "O missing: $O = H \\times \\sin\\theta$.",
  "H missing: $H = O \\div \\sin\\theta$.",
  "Round at the end.",
];

const sine = stepped(find(y9Trigonometry, SINE), {
  method: sineMethod,
  variation: {
    relationship: "$\\sin\\theta = \\frac{O}{H}$",
    unknowns: ["opposite", "hypotenuse", "sin θ"],
    surface: ["numbers", "turned triangle", "θ at the top", "bigger angle", "context"],
  },
  screens: [
    explain(
      "The rule",
      "The sine ratio",
      ["**Sine is opposite ÷ hypotenuse.**", "$\\sin\\theta = \\frac{O}{H}$"],
      tri({ deg: 35, opp: "O", hyp: "H", adj: "A" }),
      "O is opposite θ. H is the longest side.",
    ),
    tagged(
      "The rule",
      explore(
        "Stretch the triangle",
        {
          kind: "geometry",
          points: [
            { name: "A", at: { x: 0, y: 0 } },
            { name: "C", from: "A", deg: 35, dist: 4, drag: [2.5, 6.5] },
            { name: "B", below: "C" },
          ],
          lines: ["AB", "BC", "CA"],
          angles: [{ name: "BAC", label: "35°" }],
          readouts: [
            { label: "Opposite, BC", length: "BC" },
            { label: "Hypotenuse, AC", length: "AC" },
            { label: "BC ÷ AC", lengths: ["BC", "AC"] },
          ],
        },
        [
          "What did you notice?",
          "BC ÷ AC stays the same, about 0.57",
          "The angle stays 35°, so the triangle keeps its shape: opposite ÷ hypotenuse doesn't change. That number is sin 35°.",
          [
            ["BC ÷ AC grows as the triangle grows", "Look again: both sides grow together."],
            ["BC stays the same", "BC grows as C moves out."],
          ],
        ],
        "For a 35° angle, opposite ÷ hypotenuse is always about 0.57. That's sin 35°.",
        {
          text: "Drag C to make the triangle bigger or smaller. The angle at A stays 35°.",
        },
      ),
    ),

    choose(
      "Check you remember",
      "Which side is the hypotenuse?",
      "r",
      "The hypotenuse is opposite the right angle: the longest side.",
      [
        ["p", "p touches the right angle."],
        ["q", "q touches the right angle."],
      ],
      { picture: tri({ deg: 34, adj: "p", opp: "q", hyp: "r", angle: "" }) },
    ),
    choose(
      "Check you remember",
      "Which side is opposite θ?",
      "b",
      "The opposite side is across from θ.",
      [
        ["a", "a touches θ: it's the adjacent side."],
        ["c", "c is the hypotenuse."],
      ],
      { picture: tri({ deg: 34, adj: "a", opp: "b", hyp: "c" }) },
    ),
    words(
      typed(
        "Check you remember",
        "Round 19.284 to 1 decimal place.",
        "19.3",
        "Look at the second decimal place.",
        "19.3.",
      ),
      "A number check: rounding, which every answer here needs.",
    ),

    methodCard("The method", sineMethod, tri({ deg: 35, opp: "O", hyp: "H", adj: "A" })),
    worked(
      "Watch the method",
      "Find x.",
      [
        { line: "$\\sin 30° = \\frac{x}{10}$", note: "Opposite over hypotenuse." },
        { line: "$x = 10 \\times \\sin 30° = 5$ cm", note: "Times both sides by 10." },
      ],
      "O is on top, so multiply.",
      tri({ deg: 30, hyp: "10 cm", opp: "x", angle: "30°" }),
    ),
    calc(
      "Your turn",
      "Find x.",
      tri({ deg: 30, hyp: "14 cm", opp: "x", angle: "30°" }),
      [
        [
          "$x = 14 \\times \\sin 30° =$",
          "7",
          "Hypotenuse times the sine of the angle.",
          { after: "cm" },
        ],
      ],
      "x is 7 cm.",
    ),

    calc(
      "Practise",
      "Find x, to 1 decimal place.",
      tri({ deg: 40, hyp: "8 cm", opp: "x", angle: "40°" }),
      [
        [
          "$x = 8 \\times \\sin 40° =$",
          "5.1",
          "Use your calculator, then round to 1 d.p.",
          { after: "cm" },
        ],
      ],
      "x is 5.1 cm.",
    ),
    questionSet(
      "Practise",
      "Which side is missing?",
      [
        ask(
          "Find x, to 1 d.p.",
          "3.8",
          "Hypotenuse times the sine of the angle.",
          "3.8 cm: $9 \\times \\sin 25°$.",
          {
            unit: "cm",
            asks: "opposite",
            picture: tri({ deg: 25, hyp: "9 cm", opp: "x", angle: "25°" }),
          },
        ),
        ask(
          "Find x.",
          "12",
          "H is on the bottom of the fraction: divide by the sine.",
          "12 cm: $6 \\div \\sin 30°$.",
          {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Now the hypotenuse is missing.",
            expect: [
              "H is on the bottom of the fraction. You will…",
              "divide by sin 30°",
              "$H = O \\div \\sin\\theta$.",
              [["multiply by sin 30°", "Multiply when O is missing; divide when H is."]],
            ],
            picture: tri({ deg: 30, opp: "6 cm", hyp: "x", angle: "30°" }),
          },
        ),
        ask(
          "Find x, to 1 d.p.",
          "7.8",
          "Divide the opposite by the sine.",
          "7.8 cm: $5 \\div \\sin 40°$.",
          {
            unit: "cm",
            asks: "hypotenuse",
            changed: "The hypotenuse again, with the triangle turned.",
            picture: tri({ deg: 40, opp: "5 cm", hyp: "x", angle: "40°", turn: 180 }),
          },
        ),
        ask(
          "Find sin θ.",
          "0.5",
          "Opposite divided by hypotenuse.",
          "0.5: $7.5 \\div 15$. (The next lesson finds θ from it.)",
          {
            asks: "sin θ",
            changed: "Now both sides are known: the sine is missing.",
            picture: tri({ deg: 30, opp: "7.5 cm", hyp: "15 cm" }),
          },
        ),
      ],
      "O missing: multiply. H missing: divide. Both known: divide O by H.",
    ),

    questionSet(
      "Variation",
      "Find x each time, to 1 decimal place. Watch what changes.",
      [
        ask("Find x.", "5", "Hypotenuse times the sine of the angle.", "5 cm.", {
          unit: "cm",
          asks: "opposite",
          picture: tri({ deg: 30, hyp: "10 cm", opp: "x", angle: "30°" }),
        }),
        ask("Find x.", "10", "Hypotenuse times the sine of the angle.", "10 cm.", {
          unit: "cm",
          asks: "opposite",
          changed: "The hypotenuse doubled.",
          expect: [
            "The hypotenuse doubled. The opposite side…",
            "doubles",
            "Same angle, same shape: twice the size all over.",
            [
              ["stays the same", "The triangle is twice as big."],
              ["halves", "A bigger triangle has longer sides."],
            ],
          ],
          picture: tri({ deg: 30, hyp: "20 cm", opp: "x", angle: "30°" }),
        }),
        ask("Find x.", "10", "Still hypotenuse times sine.", "10 cm: turning it changes nothing.", {
          unit: "cm",
          asks: "opposite",
          changed: "The triangle is turned.",
          picture: tri({ deg: 30, hyp: "20 cm", opp: "x", angle: "30°", turn: 100 }),
        }),
        ask(
          "Find x.",
          "15.3",
          "Hypotenuse times the sine of the angle.",
          "15.3 cm: $20 \\times \\sin 50°$.",
          {
            unit: "cm",
            asks: "opposite",
            changed: "A bigger angle.",
            expect: [
              "The angle grew. The opposite side…",
              "gets longer",
              "A steeper slope reaches higher for the same hypotenuse.",
              [["gets shorter", "Steeper means higher."]],
            ],
            picture: tri({ deg: 50, hyp: "20 cm", opp: "x", angle: "50°" }),
          },
        ),
        ask(
          "Find x.",
          "6.9",
          "Label from θ: the opposite side is now along the bottom.",
          "6.9 cm: $12 \\times \\sin 35°$.",
          {
            unit: "cm",
            asks: "opposite",
            changed: "The angle is at the top corner: label again.",
            picture: tri({ deg: 35, top: true, hyp: "12 cm", opp: "x", angle: "35°" }),
          },
        ),
        ask(
          "How high up the wall does the ladder reach?",
          "4.7",
          "The ladder is the hypotenuse; the height is opposite the angle.",
          "4.7 m: $5 \\times \\sin 70°$.",
          {
            unit: "m",
            asks: "opposite",
            changed: "A real one: a ladder against a wall.",
            picture: tri({ deg: 70, hyp: "5 m", opp: "x", angle: "70°" }),
          },
        ),
      ],
      "Label from θ, then O = H × sin θ: whichever way it's drawn.",
    ),
    reworded(y9Trigonometry, SINE, "Where did it go wrong?", {
      text: "Ravi finds the side opposite the angle.",
      picture: tri({ deg: 40, hyp: "8 cm", opp: "x", angle: "40°" }),
    }),

    quiz([
      [
        [
          "Find x.",
          "5 cm",
          ["20 cm", "8.7 cm"],
          "$10 \\times \\sin 30°$.",
          tri({ deg: 30, hyp: "10 cm", opp: "x", angle: "30°" }),
          "opposite",
        ],
        [
          "Find x.",
          "8 cm",
          ["32 cm", "13.9 cm"],
          "$16 \\times \\sin 30°$.",
          tri({ deg: 30, hyp: "16 cm", opp: "x", angle: "30°", turn: 150 }),
          "opposite",
        ],
      ],
      [
        [
          "Find x.",
          "8 cm",
          ["2 cm", "4.6 cm"],
          "$4 \\div \\sin 30°$.",
          tri({ deg: 30, opp: "4 cm", hyp: "x", angle: "30°" }),
          "hypotenuse",
        ],
        [
          "Find x.",
          "14 cm",
          ["3.5 cm", "8.1 cm"],
          "$7 \\div \\sin 30°$.",
          tri({ deg: 30, opp: "7 cm", hyp: "x", angle: "30°", flip: true }),
          "hypotenuse",
        ],
      ],
      [
        [
          "Find sin θ.",
          "0.5",
          ["2", "3"],
          "$3 \\div 6$.",
          tri({ deg: 30, opp: "3 cm", hyp: "6 cm" }),
          "sin θ",
        ],
        [
          "Find sin θ.",
          "0.75",
          ["1.33", "3"],
          "$9 \\div 12$.",
          tri({ deg: 48.6, opp: "9 cm", hyp: "12 cm", turn: 90 }),
          "sin θ",
        ],
      ],
    ]),

    reworded(
      y9Trigonometry,
      SINE,
      "How high is the kite?",
      { tag: "Real life", text: "How high is the kite, to 1 decimal place?" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Sine is opposite ÷ hypotenuse.**", "$\\sin\\theta = \\frac{O}{H}$"],
      tri({ deg: 30, hyp: "10 cm", opp: "5 cm", angle: "30°" }),
      [
        "**Sine is opposite ÷ hypotenuse.**",
        "$\\sin\\theta = \\frac{O}{H}$",
        "O missing: O = H × sin θ. H missing: H = O ÷ sin θ.",
        "$x = 10 \\times \\sin 30° = 5$ cm",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// GCSE Foundation: sharing in a ratio.

const bars = (rows: [string, number][], total?: string): BarsPic => ({
  kind: "bars",
  rows: rows.map(([label, parts]) => ({ label, parts })),
  ...(total ? { total } : {}),
});
const ratioRel = (one: string, parts: string, total: string, asks?: number) =>
  relation(
    [
      ["one part", one],
      ["number of parts", parts],
      ["amount", total],
    ],
    ["×", "="],
    asks,
  );

const SHARING = "gf-ratio-1/part-part";

const sharingMethod = [
  "Add the ratio's numbers to get the parts.",
  "One part: divide by the number of parts.",
  "Times one part by each share's parts.",
  "Check: the shares add up to the total.",
];

const sharing = stepped(find(gfRatio1, SHARING), {
  method: sharingMethod,
  variation: {
    relationship: "each share = one part × its parts, and the total = one part × all the parts",
    unknowns: ["share", "other share", "total"],
    surface: ["numbers", "three-part ratio", "units", "picture", "difference given"],
  },
  screens: [
    explain(
      "The rule",
      "Sharing in a ratio",
      ["**To share in a ratio, find one part first.**"],
      bars(
        [
          ["A", 3],
          ["B", 5],
        ],
        "£120",
      ),
      "Add the ratio's numbers to see how many parts there are.",
    ),
    tagged(
      "The rule",
      explore(
        "Change the total",
        {
          kind: "ratio",
          rows: [
            { label: "A", parts: 3 },
            { label: "B", parts: 5 },
          ],
          total: { min: 40, max: 200, step: 8, start: 120 },
          unit: "£",
        },
        [
          "What stayed the same?",
          "A always has 3 parts and B 5 parts: 8 parts in all",
          "The total changes the size of one part, not the number of parts.",
          [
            ["A's share stayed the same", "Look again: it grows with the total."],
            ["One part is always £3", "One part is the total ÷ 8, so it changes."],
          ],
        ],
        "One part is the total ÷ 8. A gets 3 parts, B gets 5.",
        {
          text: "Drag the slider to change the total. Watch one part, and each share.",
        },
      ),
    ),

    typed("Check you remember", "Work out 3 + 5.", "8", "Count on 5 from 3.", "8."),
    typed("Check you remember", "Work out £120 ÷ 8.", "15", "120 ÷ 8: halve three times.", "£15.", {
      unit: "£",
    }),
    typed("Check you remember", "Work out 3 × £15.", "45", "Three lots of £15.", "£45.", {
      unit: "£",
    }),

    methodCard(
      "The method",
      sharingMethod,
      bars(
        [
          ["A", 3],
          ["B", 5],
        ],
        "£120",
      ),
    ),
    worked(
      "Watch the method",
      "Share £120 in the ratio 3 : 5.",
      [
        { line: "3 + 5 = 8 parts", note: "Add the ratio's numbers." },
        { line: "£120 ÷ 8 = £15" },
        { line: "3 × £15 = £45 and 5 × £15 = £75", note: "Check: £45 + £75 = £120." },
      ],
      "Parts, then one part, then the shares.",
      bars(
        [
          ["A", 3],
          ["B", 5],
        ],
        "£120",
      ),
    ),
    calc(
      "Your turn",
      "Share £80 in the ratio 3 : 5.",
      bars(
        [
          ["A", 3],
          ["B", 5],
        ],
        "£80",
      ),
      [
        ["3 + 5 =", "8", "Add the ratio's numbers.", { after: "parts" }],
        ["One part: £80 ÷ 8 = £", "10", "Divide by the number of parts."],
        ["A: 3 × £10 = £", "30", "A has 3 parts."],
        ["B: 5 × £10 = £", "50", "B has 5 parts."],
      ],
      "£30 and £50: they add up to £80.",
    ),

    calc(
      "Practise",
      "Share 42 sweets in the ratio 2 : 5.",
      undefined,
      [
        ["2 + 5 =", "7", "Add the ratio's numbers.", { after: "parts" }],
        ["One part: 42 ÷ 7 =", "6", "Divide by the number of parts."],
        ["2 × 6 =", "12", "The first share is 2 parts."],
        ["5 × 6 =", "30", "The second share is 5 parts."],
      ],
      "12 and 30 sweets: they add up to 42.",
    ),
    questionSet(
      "Practise",
      "Which amount is missing?",
      [
        ask(
          "Share £72 in 4 : 5. Find the smaller share.",
          "32",
          "9 parts: one part is £8.",
          "£32.",
          {
            unit: "£",
            asks: "share",
            picture: ratioRel("?", "9", "£72", 0),
          },
        ),
        ask(
          "In 4 : 5, the smaller share is £32. Find the larger.",
          "40",
          "£32 is 4 parts, so one part is £8.",
          "£40.",
          {
            unit: "£",
            asks: "other share",
            changed: "You know one share, not the total.",
            expect: [
              "£32 is the smaller share. One part is…",
              "£32 ÷ 4",
              "The smaller share is 4 parts.",
              [["£32 ÷ 9", "£32 isn't the total: it's only 4 parts."]],
            ],
            picture: ratioRel("?", "4", "£32", 0),
          },
        ),
        ask(
          "In 4 : 5, the larger share is £40. Find the total.",
          "72",
          "£40 is 5 parts: one part is £8; 9 parts in all.",
          "£72.",
          {
            unit: "£",
            asks: "total",
            changed: "Now the total is missing.",
            picture: ratioRel("£8", "9", "?", 2),
          },
        ),
        ask(
          "In 4 : 5, the shares differ by £8. Find the total.",
          "72",
          "The difference is 1 part: £8.",
          "£72: 9 parts of £8.",
          {
            unit: "£",
            asks: "total",
            changed: "You know the difference between the shares.",
            picture: ratioRel("£8", "9", "?", 2),
          },
        ),
      ],
      "Ask how many parts you know about, find one part, then build what's missing.",
    ),

    questionSet(
      "Variation",
      "Find the share asked for. Watch what changes.",
      [
        ask(
          "Share £60 in 1 : 2. Find the larger share.",
          "40",
          "3 parts: one part is £20.",
          "£40.",
          { unit: "£", asks: "share" },
        ),
        ask(
          "Share £120 in 1 : 2. Find the larger share.",
          "80",
          "3 parts: one part is £40.",
          "£80.",
          {
            unit: "£",
            asks: "share",
            changed: "The total doubled.",
            expect: [
              "The total doubled. The larger share…",
              "doubles",
              "Same ratio: every share grows with the total.",
              [
                ["stays the same", "There's more money to share."],
                ["goes up by £60", "It doubles: £40 becomes £80."],
              ],
            ],
          },
        ),
        ask(
          "Share £120 in 1 : 3. Find the larger share.",
          "90",
          "4 parts now: one part is £30.",
          "£90.",
          {
            unit: "£",
            asks: "share",
            changed: "The ratio is 1 : 3 now.",
          },
        ),
        ask(
          "Share £120 in 1 : 2 : 3. Find the largest share.",
          "60",
          "6 parts: one part is £20.",
          "£60.",
          {
            unit: "£",
            asks: "share",
            changed: "Three people share it.",
          },
        ),
        ask(
          "Share 2 kg in 3 : 1. Give the larger share in grams.",
          "1500",
          "2 kg = 2000 g; 4 parts of 500 g.",
          "1500 g.",
          {
            unit: "g",
            asks: "share",
            changed: "Kilograms in, grams out.",
          },
        ),
        ask("The bar model shows A : B. Find B's share.", "21", "5 boxes: one box is 7.", "21.", {
          asks: "share",
          changed: "A picture: count the boxes.",
          picture: bars(
            [
              ["A", 2],
              ["B", 3],
            ],
            "35",
          ),
        }),
      ],
      "Parts, one part, shares: whatever's being shared.",
    ),
    reworded(gfRatio1, SHARING, "Where did it go wrong?", {}),

    quiz([
      [
        [
          "Share £56 in 3 : 4. Larger share?",
          "£32",
          ["£24", "£4"],
          "7 parts of £8.",
          undefined,
          "share",
        ],
        [
          "Share £45 in 2 : 7. Larger share?",
          "£35",
          ["£10", "£7"],
          "9 parts of £5.",
          undefined,
          "share",
        ],
      ],
      [
        [
          "In 2 : 3, the smaller share is £18. Larger share?",
          "£27",
          ["£12", "£45"],
          "One part is £9.",
          undefined,
          "other share",
        ],
        [
          "In 3 : 5, the smaller share is £24. Larger share?",
          "£40",
          ["£15", "£64"],
          "One part is £8.",
          undefined,
          "other share",
        ],
      ],
      [
        [
          "In 1 : 4, the larger share is £20. Total?",
          "£25",
          ["£80", "£24"],
          "One part is £5; 5 parts.",
          undefined,
          "total",
        ],
        [
          "In 2 : 5, the larger share is £35. Total?",
          "£49",
          ["£70", "£42"],
          "One part is £7; 7 parts.",
          undefined,
          "total",
        ],
      ],
    ]),

    reworded(
      gfRatio1,
      SHARING,
      "“Share £120 in the ratio 3 : 5.”",
      {
        tag: "Real life",
        title: "Ali and Ben share a £120 prize in 3\u00a0:\u00a05. How much each?",
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**To share in a ratio, find one part first.**"],
      bars(
        [
          ["A", 3],
          ["B", 5],
        ],
        "£120",
      ),
      [
        "**To share in a ratio, find one part first.**",
        "Add the ratio's numbers. Divide to find one part. Times by each share's parts.",
        "£120 in 3 : 5: 8 parts of £15, so £45 and £75",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

/** The five pilot redrafts, by the id of the lesson each replaces. */
export const pilotRedrafts: [string, UnitLesson[]][] = [
  ["y7-angles/half-turn", [halfTurn]],
  ["y7-fdp/percentages", [percentages]],
  ["y8-area/circle-area", [circleArea]],
  ["y9-trigonometry/sine", [sine]],
  ["gf-ratio-1/part-part", [sharing]],
];
