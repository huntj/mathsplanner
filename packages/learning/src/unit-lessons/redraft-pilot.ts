// The pilot redrafts beside the circle theorems: one lesson from each stage, chosen because the
// unknown moves in them clearly. Each keeps its own problem, warm-ups, discovery and mistakes,
// and gets a new learning stage: the method, an example beside a question like it, a faded
// example, a set that changes one thing at a time, a set that moves the unknown, two to try, and
// an exit check that moves the unknown too.
import { ask, fade, pair, questionSet, quiz, redraft, typed } from "./build.ts";
import { gfRatio1 } from "./gf-ratio-1.ts";
import type { BarsPic, RelationPic, UnitLesson } from "./types.ts";
import { fan, y7Angles } from "./y7-angles.ts";
import { hundred, y7Fdp } from "./y7-fdp.ts";
import { measured, y8Area } from "./y8-area.ts";
import { tri, y9Trigonometry } from "./y9-trigonometry.ts";

const find = (list: readonly UnitLesson[], id: string) => list.find((l) => l.id === id);

const relation = (cells: [string, string][], joins: string[], asks?: number): RelationPic => ({
  kind: "relation",
  cells: cells.map(([label, value]) => ({ label, value })),
  joins,
  ...(asks === undefined ? {} : { asks }),
});

// ---------------------------------------------------------------------------------------------
// Year 7: angles on a straight line.

/** Two angles on a straight line, the first measured up from the right, the line turned by `turn`. */
const line2 = (first: number, labels: [string, string], turn = 0) =>
  fan([turn, turn + first, turn + 180], [labels[0], labels[1], null]);
/** Three angles on a straight line. */
const line3 = (a: number, b: number, labels: [string, string, string]) =>
  fan([0, a, a + b, 180], [labels[0], labels[1], labels[2], null]);
const lineRel = (a: string, b: string, c: string, asks?: number) =>
  relation(
    [
      ["angle 1", a],
      ["angle 2", b],
      ["angle 3", c],
      ["in all", "180°"],
    ],
    ["+", "+", "="],
    asks,
  );

const halfTurn = redraft(find(y7Angles, "y7-angles/half-turn"), {
  method: [
    "Check the angles all sit on one straight line.",
    "Add up the angles you know.",
    "Take that total away from 180°.",
    "Check: all the angles now add up to 180°.",
  ],
  picture: line2(60, ["a", "b"]),
  variation: {
    relationship: "the angles on a straight line add up to 180°",
    unknowns: ["angle 1", "angle 2", "angle 3", "x"],
    surface: ["numbers", "line turned", "which side", "three angles", "algebra"],
    nonExamples: ["angles that don't sit on one straight line"],
  },
  learning: [
    pair(
      "Take it from 180°",
      {
        problem: "Two angles on a straight line are 125° and x. Find x.",
        picture: line2(55, ["x", "125°"]),
        lines: [
          ["$x + 125° = 180°$", "Angles on a straight line add up to 180°."],
          ["$x = 180° - 125° = 55°$", "Take away the angle you know."],
        ],
      },
      ask(
        "Two angles on a straight line are 140° and x. Find x.",
        "40",
        "Take 140° from 180°.",
        "40°.",
        {
          unit: "°",
          asks: "angle 1",
          picture: line2(40, ["x", "140°"]),
        },
      ),
      "Same line, same 180°.",
    ),
    fade(
      "Finish it",
      "Three angles on a straight line are 40°, 75° and x. Find x.",
      ["Add the ones you know: $40° + 75° = 115°$."],
      [
        [
          "So x is",
          "$180° - 115° = 65°$",
          ["$115° - 40° = 75°$", "Take the total from 180°."],
          "$x = 65°$",
        ],
      ],
      "Add what you know, take it from 180°.",
      line3(40, 75, ["40°", "75°", "x"]),
    ),
    questionSet(
      "Same method, different look",
      "Find x each time. Watch what changes.",
      [
        ask("130° and x are on a straight line. Find x.", "50", "180° − 130°.", "50°.", {
          unit: "°",
          asks: "angle 1",
          picture: line2(50, ["x", "130°"]),
        }),
        ask("120° and x are on a straight line. Find x.", "60", "180° − 120°.", "60°.", {
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
        ask(
          "120° and x are on a straight line. Find x.",
          "60",
          "Still 180° − 120°.",
          "60°: turning the line changes nothing.",
          {
            unit: "°",
            asks: "angle 1",
            changed: "The line is turned.",
            picture: line2(60, ["x", "120°"], 35),
          },
        ),
        ask(
          "x and 120° are on a straight line. Find x.",
          "60",
          "Still 180° − 120°.",
          "60°: it doesn't matter which side x is on.",
          {
            unit: "°",
            asks: "angle 2",
            changed: "x is on the other side now.",
            picture: line2(120, ["120°", "x"]),
          },
        ),
        ask(
          "35°, 90° and x are on a straight line. Find x.",
          "55",
          "Add 35° and 90°, then take it from 180°.",
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
          "x and 2x are on a straight line. Find x.",
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
    questionSet(
      "Where's the answer?",
      "Which angle is missing?",
      [
        ask(
          "On a straight line, angle 1 is 50° and angle 2 is 70°. Find angle 3.",
          "60",
          "Take 50° and 70° from 180°.",
          "60°.",
          {
            unit: "°",
            asks: "angle 3",
            picture: lineRel("50°", "70°", "?", 2),
          },
        ),
        ask(
          "Angle 1 is 45° and angle 3 is 95°. Find angle 2.",
          "40",
          "Take 45° and 95° from 180°.",
          "40°.",
          {
            unit: "°",
            asks: "angle 2",
            changed: "Now the middle angle is missing.",
            picture: lineRel("45°", "?", "95°", 1),
          },
        ),
        ask(
          "Angle 2 is 80° and angle 3 is 30°. Find angle 1.",
          "70",
          "Take 80° and 30° from 180°.",
          "70°.",
          {
            unit: "°",
            asks: "angle 1",
            changed: "Now the first angle is missing.",
            picture: lineRel("?", "80°", "30°", 0),
          },
        ),
        ask(
          "Angles 1 and 2 are both x, and angle 3 is 100°. Find x.",
          "40",
          "x + x = 80°.",
          "40°: 40° + 40° + 100° = 180°.",
          {
            unit: "°",
            asks: "x",
            changed: "Two angles are the same size, x.",
            picture: lineRel("$x$", "$x$", "100°"),
          },
        ),
      ],
      "Wherever the gap is, the same 180° fills it.",
    ),
    typed("Your turn", "64° and x are on a straight line. Find x.", "116", "180° − 64°.", "116°.", {
      unit: "°",
      picture: line2(64, ["64°", "x"], 20),
    }),
    typed("Your turn", "x, 2x and 90° are on a straight line. Find x.", "30", "3x = 90°.", "30°.", {
      unit: "°",
      picture: line3(30, 60, ["x", "2x", "90°"]),
    }),
  ],
  exit: quiz([
    [
      [
        "On a straight line: 105° and x. x?",
        "75°",
        ["255°", "85°"],
        "180° − 105°.",
        undefined,
        "angle 1",
      ],
      [
        "On a straight line: 145° and x. x?",
        "35°",
        ["215°", "45°"],
        "180° − 145°.",
        undefined,
        "angle 1",
      ],
    ],
    [
      [
        "On a straight line: 30°, x and 65°. x?",
        "85°",
        ["95°", "265°"],
        "180° − 95°.",
        undefined,
        "angle 2",
      ],
      [
        "On a straight line: 50°, x and 45°. x?",
        "85°",
        ["95°", "275°"],
        "180° − 95°.",
        undefined,
        "angle 2",
      ],
    ],
    [
      [
        "On a straight line: x, x and 120°. x?",
        "30°",
        ["60°", "120°"],
        "2x = 60°.",
        undefined,
        "x",
      ],
      [
        "On a straight line: x, x and 80°. x?",
        "50°",
        ["100°", "80°"],
        "2x = 100°.",
        undefined,
        "x",
      ],
    ],
  ]),
});

// ---------------------------------------------------------------------------------------------
// Year 7: percentages, fractions and decimals.

const fdpRel = (from: [string, string], to: string) => relation([from, [to, "?"]], ["="], 1);

const percentages = redraft(find(y7Fdp, "y7-fdp/percentages"), {
  method: [
    "Per cent means out of 100.",
    "Percentage to decimal: divide by 100. Decimal to percentage: times by 100.",
    "Percentage to fraction: put it over 100, then simplify.",
    "Fraction to percentage: make it out of 100, or divide top by bottom and times by 100.",
  ],
  picture: hundred(40),
  variation: {
    relationship: "a fraction, a decimal and a percentage can name the same amount",
    unknowns: ["percentage", "decimal", "fraction"],
    surface: ["numbers", "small percentages", "over 100%", "picture", "words"],
    nonExamples: ["8% is not 0.8"],
  },
  learning: [
    pair(
      "Out of 100",
      {
        problem: "Write 40% as a decimal and as a fraction.",
        picture: hundred(40),
        lines: [
          ["$40\\% = \\frac{40}{100}$", "Per cent means out of 100."],
          ["$\\frac{40}{100} = 0.4$", "Divide by 100."],
          ["$\\frac{40}{100} = \\frac{2}{5}$", "Simplify: divide top and bottom by 20."],
        ],
      },
      ask("Write 60% as a decimal.", "0.6", "Divide 60 by 100.", "0.6.", {
        asks: "decimal",
        picture: hundred(60),
      }),
      "Out of 100 first, then decimal or fraction.",
    ),
    fade(
      "Finish it",
      "Write $\\frac{7}{20}$ as a percentage.",
      ["$\\frac{7}{20} = \\frac{35}{100}$ (times top and bottom by 5)"],
      [["So as a percentage:", "35%", ["7%", "Use the top once it's out of 100."], "35%"]],
      "Make it out of 100, and the top is the percentage.",
    ),
    questionSet(
      "Same method, different look",
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
    questionSet(
      "Where's the answer?",
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
    typed("Your turn", "Write 0.85 as a percentage.", "85", "Times by 100.", "85%.", { unit: "%" }),
    typed(
      "Your turn",
      "Write 30% as a fraction in its simplest form.",
      "3/10",
      "$\\frac{30}{100}$, then simplify.",
      "$\\frac{3}{10}$.",
    ),
  ],
  exit: quiz([
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
});

// ---------------------------------------------------------------------------------------------
// Year 8: the area of a circle.

const circleRel = (area: string, r2: string, asks?: number) =>
  relation(
    [
      ["area", area],
      ["pi", "$\\pi$"],
      ["radius squared", r2],
    ],
    ["=", "×"],
    asks,
  );

const circleArea = redraft(find(y8Area, "y8-area/circle-area"), {
  method: [
    "Find the radius. Given the diameter? Halve it.",
    "Square the radius.",
    "Times by π.",
    "Give the units squared, and round as asked.",
  ],
  picture: measured("r", "r"),
  variation: {
    relationship: "area = π × radius²",
    unknowns: ["area", "radius", "diameter"],
    surface: ["numbers", "diameter given", "half a circle", "context", "in terms of π"],
    nonExamples: ["π × d is the circumference, not the area"],
  },
  learning: [
    pair(
      "Square, then times by π",
      {
        problem: "Radius 5 cm. Find the area, to 1 decimal place.",
        picture: measured("r", "5 cm"),
        lines: [
          ["$5^2 = 25$", "Square the radius."],
          ["$\\pi \\times 25 = 78.5$ cm²", "Times by π, and round to 1 d.p."],
        ],
      },
      ask(
        "Radius 4 cm. Find the area, to 1 decimal place.",
        "50.3",
        "$4^2 = 16$, then times by π.",
        "50.3 cm².",
        {
          unit: "cm²",
          asks: "area",
          picture: measured("r", "4 cm"),
        },
      ),
      "Radius squared, times π.",
    ),
    fade(
      "Finish it",
      "Diameter 10 cm. Find the area, to 1 decimal place.",
      ["Radius = 10 ÷ 2 = 5 cm"],
      [
        [
          "Square it:",
          "$5^2 = 25$",
          ["$10^2 = 100$", "Use the radius, not the diameter."],
          "$r^2 = 25$",
        ],
        [
          "Times by π:",
          "78.5 cm²",
          ["31.4 cm²", "That's π × d: the circumference."],
          "Area = 78.5 cm²",
        ],
      ],
      "Halve the diameter first, every time.",
      measured("d", "10 cm"),
    ),
    questionSet(
      "Same method, different look",
      "Find each area, to 1 decimal place. Watch what changes.",
      [
        ask("Radius 3 cm.", "28.3", "$3^2 = 9$, times π.", "28.3 cm².", {
          unit: "cm²",
          asks: "area",
          picture: measured("r", "3 cm"),
        }),
        ask("Radius 6 cm.", "113.1", "$6^2 = 36$, times π.", "113.1 cm²: four times 28.3 cm².", {
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
        }),
        ask(
          "Diameter 6 cm.",
          "28.3",
          "Halve it: radius 3 cm.",
          "28.3 cm²: the first circle again.",
          {
            unit: "cm²",
            asks: "area",
            changed: "You're given the diameter, not the radius.",
            expect: [
              "Diameter 6 cm is the same circle as radius…",
              "3 cm",
              "The radius is half the diameter.",
              [["6 cm", "The radius is half the diameter."]],
            ],
            picture: measured("d", "6 cm"),
          },
        ),
        ask(
          "A semicircle with radius 3 cm.",
          "14.1",
          "Half of $\\pi \\times 3^2$.",
          "14.1 cm²: half of 28.3 cm².",
          {
            unit: "cm²",
            asks: "area",
            changed: "Only half a circle.",
          },
        ),
        ask(
          "A pizza is 30 cm across. Find its area, to the nearest cm².",
          "707",
          "30 cm across is the diameter: radius 15 cm.",
          "707 cm².",
          {
            unit: "cm²",
            asks: "area",
            changed: "A real one: “across” means the diameter.",
          },
        ),
        ask(
          "Radius 7 cm. Give the area in terms of π.",
          "$49\\pi$",
          "Square 7, and leave π as it is.",
          "$49\\pi$ cm²: exact, without rounding.",
          {
            asks: "area",
            changed: "Leave π in the answer.",
            others: ["$14\\pi$", "$7\\pi$"],
          },
        ),
      ],
      "Radius, square, times π: whatever the circle looks like.",
    ),
    questionSet(
      "Where's the answer?",
      "Which part is missing?",
      [
        ask("Radius 2 cm. Find the area, to 1 d.p.", "12.6", "$2^2 = 4$, times π.", "12.6 cm².", {
          unit: "cm²",
          asks: "area",
          picture: circleRel("?", "$2^2$", 0),
        }),
        ask(
          "The area is 50.3 cm². Find the radius.",
          "4",
          "Divide by π to get $r^2$, then square root.",
          "4 cm: $50.3 \\div \\pi = 16$, and $\\sqrt{16} = 4$.",
          {
            unit: "cm",
            asks: "radius",
            changed: "Now the radius is missing: work backwards.",
            expect: [
              "To work backwards from the area, first…",
              "divide by π",
              "Undo each step in reverse: divide by π, then square root.",
              [["square root", "Undo the last step first: the times by π."]],
            ],
            picture: circleRel("50.3", "?", 2),
          },
        ),
        ask(
          "The area is 314.2 cm². Find the radius.",
          "10",
          "$314.2 \\div \\pi \\approx 100$.",
          "10 cm.",
          {
            unit: "cm",
            asks: "radius",
            picture: circleRel("314.2", "?", 2),
          },
        ),
        ask(
          "The area is 28.3 cm². Find the diameter.",
          "6",
          "Find the radius first: $28.3 \\div \\pi \\approx 9$, so r = 3.",
          "6 cm: double the radius, 3 cm.",
          {
            unit: "cm",
            asks: "diameter",
            changed: "Now the diameter is missing.",
            picture: circleRel("28.3", "?", 2),
          },
        ),
      ],
      "Forwards: square, times π. Backwards: divide by π, square root.",
    ),
    typed(
      "Your turn",
      "Diameter 12 cm. Find the area, to 1 decimal place.",
      "113.1",
      "Radius 6 cm.",
      "113.1 cm².",
      {
        unit: "cm²",
        picture: measured("d", "12 cm"),
      },
    ),
    typed(
      "Your turn",
      "The area is 78.5 cm². Find the radius.",
      "5",
      "Divide by π, then square root.",
      "5 cm.",
      {
        unit: "cm",
      },
    ),
  ],
  exit: quiz([
    [
      [
        "Radius 10 cm. Area (1 d.p.)?",
        "314.2 cm²",
        ["62.8 cm²", "31.4 cm²"],
        "$\\pi \\times 100$.",
        undefined,
        "area",
      ],
      [
        "Radius 1 cm. Area (1 d.p.)?",
        "3.1 cm²",
        ["6.3 cm²", "1 cm²"],
        "$\\pi \\times 1$.",
        undefined,
        "area",
      ],
    ],
    [
      [
        "Area 12.6 cm². Radius?",
        "2 cm",
        ["4 cm", "6.3 cm"],
        "$12.6 \\div \\pi \\approx 4$; $\\sqrt{4} = 2$.",
        undefined,
        "radius",
      ],
      [
        "Area 113.1 cm². Radius?",
        "6 cm",
        ["36 cm", "12 cm"],
        "$113.1 \\div \\pi \\approx 36$; $\\sqrt{36} = 6$.",
        undefined,
        "radius",
      ],
    ],
    [
      [
        "Area 50.3 cm². Diameter?",
        "8 cm",
        ["4 cm", "16 cm"],
        "Radius 4 cm, so diameter 8 cm.",
        undefined,
        "diameter",
      ],
      [
        "Area 78.5 cm². Diameter?",
        "10 cm",
        ["5 cm", "25 cm"],
        "Radius 5 cm, so diameter 10 cm.",
        undefined,
        "diameter",
      ],
    ],
  ]),
});

// ---------------------------------------------------------------------------------------------
// Year 9: the sine ratio.

const sinRel = (s: string, o: string, h: string, asks?: number) =>
  relation(
    [
      ["sin θ", s],
      ["opposite", o],
      ["hypotenuse", h],
    ],
    ["=", "÷"],
    asks,
  );

const sine = redraft(find(y9Trigonometry, "y9-trigonometry/sine"), {
  method: [
    "Label the sides from θ: H across from the right angle, O across from θ, A next to θ.",
    "Sine uses O and H: $\\sin\\theta = \\frac{O}{H}$.",
    "O missing: $O = H \\times \\sin\\theta$. H missing: $H = O \\div \\sin\\theta$.",
    "Round at the end, to the accuracy asked.",
  ],
  picture: tri({ deg: 35, opp: "O", hyp: "H", adj: "A" }),
  drop: ["Any way round", "A steep one", "One more, at speed"],
  variation: {
    relationship: "$\\sin\\theta = \\frac{O}{H}$",
    unknowns: ["opposite", "hypotenuse", "sin θ"],
    surface: ["numbers", "turned triangle", "θ at the top", "bigger angle", "context"],
    nonExamples: ["the adjacent side doesn't go in the sine ratio"],
  },
  learning: [
    pair(
      "Hypotenuse times sine",
      {
        problem: "Hypotenuse 10 cm, angle 30°. Find the opposite side.",
        picture: tri({ deg: 30, hyp: "10 cm", opp: "x", angle: "30°" }),
        lines: [
          ["$\\sin 30° = \\frac{x}{10}$", "Sine: opposite over hypotenuse."],
          ["$x = 10 \\times \\sin 30° = 5$ cm", "Times both sides by 10."],
        ],
      },
      ask(
        "Hypotenuse 14 cm, angle 30°. Find the opposite side.",
        "7",
        "$14 \\times \\sin 30°$.",
        "7 cm.",
        {
          unit: "cm",
          asks: "opposite",
          picture: tri({ deg: 30, hyp: "14 cm", opp: "x", angle: "30°" }),
        },
      ),
      "O is on top, so multiply.",
    ),
    fade(
      "Finish it",
      "Hypotenuse 8 cm, angle 40°. Find the opposite side, to 1 decimal place.",
      ["$\\sin 40° = \\frac{x}{8}$"],
      [
        [
          "So",
          "$x = 8 \\times \\sin 40°$",
          ["$x = 8 \\div \\sin 40°$", "x is on top: multiply."],
          "$x = 8 \\times \\sin 40°$",
        ],
        ["To 1 d.p.:", "5.1 cm", ["12.4 cm", "That's dividing by sin 40°."], "$x = 5.1$ cm"],
      ],
      "Write the ratio, rearrange, then round.",
      tri({ deg: 40, hyp: "8 cm", opp: "x", angle: "40°" }),
    ),
    questionSet(
      "Same method, different look",
      "Find x each time, to 1 decimal place. Watch what changes.",
      [
        ask("Hypotenuse 10 cm, angle 30°.", "5", "$10 \\times \\sin 30°$.", "5 cm.", {
          unit: "cm",
          asks: "opposite",
          picture: tri({ deg: 30, hyp: "10 cm", opp: "x", angle: "30°" }),
        }),
        ask("Hypotenuse 20 cm, angle 30°.", "10", "$20 \\times \\sin 30°$.", "10 cm.", {
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
        ask(
          "Hypotenuse 20 cm, angle 30°.",
          "10",
          "Still $20 \\times \\sin 30°$.",
          "10 cm: turning it changes nothing.",
          {
            unit: "cm",
            asks: "opposite",
            changed: "The triangle is turned.",
            picture: tri({ deg: 30, hyp: "20 cm", opp: "x", angle: "30°", turn: 100 }),
          },
        ),
        ask("Hypotenuse 20 cm, angle 50°.", "15.3", "$20 \\times \\sin 50°$.", "15.3 cm.", {
          unit: "cm",
          asks: "opposite",
          changed: "A bigger angle: 50°.",
          expect: [
            "The angle grew. The opposite side…",
            "gets longer",
            "A steeper slope reaches higher for the same hypotenuse.",
            [["gets shorter", "Steeper means higher."]],
          ],
          picture: tri({ deg: 50, hyp: "20 cm", opp: "x", angle: "50°" }),
        }),
        ask(
          "Hypotenuse 12 cm, angle 35° at the top.",
          "6.9",
          "Label from θ: the opposite side is now along the bottom.",
          "6.9 cm: $12 \\times \\sin 35°$.",
          {
            unit: "cm",
            asks: "opposite",
            changed: "θ is at the top corner: label again.",
            picture: tri({ deg: 35, top: true, hyp: "12 cm", opp: "x", angle: "35°" }),
          },
        ),
        ask(
          "A 5 m ladder leans at 70° to the ground. How high up the wall does it reach?",
          "4.7",
          "The ladder is the hypotenuse; the height is opposite 70°.",
          "4.7 m: $5 \\times \\sin 70°$.",
          {
            unit: "m",
            asks: "opposite",
            changed: "A real one: draw the triangle in your head.",
            picture: tri({ deg: 70, hyp: "5 m", opp: "x", angle: "70°" }),
          },
        ),
      ],
      "Label from θ, then O = H × sin θ: whichever way it's drawn.",
    ),
    questionSet(
      "Where's the answer?",
      "Which side is missing?",
      [
        ask(
          "Hypotenuse 9 cm, angle 25°. Find the opposite side, to 1 d.p.",
          "3.8",
          "$9 \\times \\sin 25°$.",
          "3.8 cm.",
          {
            unit: "cm",
            asks: "opposite",
            picture: sinRel("$\\sin 25°$", "?", "9", 1),
          },
        ),
        ask(
          "Opposite 6 cm, angle 30°. Find the hypotenuse.",
          "12",
          "H is on the bottom: $6 \\div \\sin 30°$.",
          "12 cm.",
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
            picture: sinRel("$\\sin 30°$", "6", "?", 2),
          },
        ),
        ask(
          "Opposite 5 cm, angle 40°. Find the hypotenuse, to 1 d.p.",
          "7.8",
          "$5 \\div \\sin 40°$.",
          "7.8 cm.",
          {
            unit: "cm",
            asks: "hypotenuse",
            picture: sinRel("$\\sin 40°$", "5", "?", 2),
          },
        ),
        ask(
          "Opposite 7.5 cm, hypotenuse 15 cm. Find sin θ.",
          "0.5",
          "$7.5 \\div 15$.",
          "0.5. (The next lesson finds θ from it.)",
          {
            asks: "sin θ",
            changed: "Now both sides are known: the sine is missing.",
            picture: sinRel("?", "7.5", "15", 0),
          },
        ),
      ],
      "O missing: multiply. H missing: divide. Both known: divide O by H.",
    ),
    typed(
      "Your turn",
      "Hypotenuse 25 cm, angle 18°. Find the opposite side, to 1 d.p.",
      "7.7",
      "$25 \\times \\sin 18°$.",
      "7.7 cm.",
      {
        unit: "cm",
        picture: tri({ deg: 18, hyp: "25 cm", opp: "x", angle: "18°", turn: 200 }),
      },
    ),
    typed(
      "Your turn",
      "Opposite 9 cm, angle 60°. Find the hypotenuse, to 1 d.p.",
      "10.4",
      "$9 \\div \\sin 60°$.",
      "10.4 cm.",
      {
        unit: "cm",
        picture: tri({ deg: 60, hyp: "x", opp: "9 cm", angle: "60°" }),
      },
    ),
  ],
  exit: quiz([
    [
      [
        "Hypotenuse 10 cm, angle 30°. Opposite?",
        "5 cm",
        ["20 cm", "8.7 cm"],
        "$10 \\times \\sin 30°$.",
        undefined,
        "opposite",
      ],
      [
        "Hypotenuse 16 cm, angle 30°. Opposite?",
        "8 cm",
        ["32 cm", "13.9 cm"],
        "$16 \\times \\sin 30°$.",
        undefined,
        "opposite",
      ],
    ],
    [
      [
        "Opposite 4 cm, angle 30°. Hypotenuse?",
        "8 cm",
        ["2 cm", "4.6 cm"],
        "$4 \\div \\sin 30°$.",
        undefined,
        "hypotenuse",
      ],
      [
        "Opposite 7 cm, angle 30°. Hypotenuse?",
        "14 cm",
        ["3.5 cm", "8.1 cm"],
        "$7 \\div \\sin 30°$.",
        undefined,
        "hypotenuse",
      ],
    ],
    [
      [
        "Opposite 3 cm, hypotenuse 6 cm. sin θ?",
        "0.5",
        ["2", "3"],
        "$3 \\div 6$.",
        undefined,
        "sin θ",
      ],
      [
        "Opposite 9 cm, hypotenuse 12 cm. sin θ?",
        "0.75",
        ["1.33", "3"],
        "$9 \\div 12$.",
        undefined,
        "sin θ",
      ],
    ],
  ]),
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

const sharing = redraft(find(gfRatio1, "gf-ratio-1/part-part"), {
  method: [
    "Add the ratio's numbers: that's how many parts in all.",
    "Find one part: divide what you know by how many parts it is.",
    "Times one part by each share's number of parts.",
    "Check: the shares add up to the total.",
  ],
  picture: bars([
    ["A", 3],
    ["B", 5],
  ]),
  variation: {
    relationship: "each share = one part × its parts, and the total = one part × all the parts",
    unknowns: ["share", "other share", "total"],
    surface: ["numbers", "three-part ratio", "units", "picture", "difference given"],
    nonExamples: ["the ratio's numbers are not the shares"],
  },
  learning: [
    pair(
      "Parts, one part, shares",
      {
        problem: "Share £120 in the ratio 3 : 5.",
        picture: bars(
          [
            ["A", 3],
            ["B", 5],
          ],
          "£120",
        ),
        lines: [
          ["3 + 5 = 8 parts", "Add the ratio's numbers."],
          ["£120 ÷ 8 = £15", "One part."],
          ["3 × £15 = £45 and 5 × £15 = £75", "Each share. Check: £45 + £75 = £120."],
        ],
      },
      ask(
        "Share £80 in the ratio 3 : 5. Find the larger share.",
        "50",
        "8 parts, so one part is £10.",
        "£50.",
        {
          unit: "£",
          asks: "share",
          picture: bars(
            [
              ["A", 3],
              ["B", 5],
            ],
            "£80",
          ),
        },
      ),
      "Parts, then one part, then shares.",
    ),
    fade(
      "Finish it",
      "Share 42 sweets in the ratio 2 : 5.",
      ["2 + 5 = 7 parts", "42 ÷ 7 = 6 sweets in one part"],
      [
        [
          "So the shares are",
          "12 and 30",
          ["2 and 5", "Times each number by one part, 6."],
          "12 and 30 sweets",
        ],
      ],
      "Check: 12 + 30 = 42.",
    ),
    questionSet(
      "Same method, different look",
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
          "Share 2 kg of flour in 3 : 1. Find the larger share in grams.",
          "1500",
          "2 kg = 2000 g; 4 parts of 500 g.",
          "1500 g.",
          {
            unit: "g",
            asks: "share",
            changed: "Kilograms in, grams out.",
          },
        ),
        ask(
          "The bar model shows A : B, with 35 in all. Find B's share.",
          "21",
          "5 boxes: one box is 7.",
          "21.",
          {
            asks: "share",
            changed: "A picture: count the boxes.",
            picture: bars(
              [
                ["A", 2],
                ["B", 3],
              ],
              "35",
            ),
          },
        ),
      ],
      "Parts, one part, shares: whatever's being shared.",
    ),
    questionSet(
      "Where's the answer?",
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
          "In 4 : 5, the smaller share is £32. Find the larger share.",
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
          "In 4 : 5, the larger share is £8 more than the smaller. Find the total.",
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
    typed(
      "Your turn",
      "Red : blue = 2 : 7. There are 35 more blue than red. How many red?",
      "14",
      "The difference is 5 parts: one part is 7.",
      "14 red.",
    ),
    typed(
      "Your turn",
      "Share £150 in 2 : 3 : 5. Find the middle share.",
      "45",
      "10 parts: one part is £15.",
      "£45.",
      { unit: "£" },
    ),
  ],
  exit: quiz([
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
});

/** The five pilot redrafts, by the id of the lesson each replaces. */
export const pilotRedrafts: [string, UnitLesson[]][] = [
  ["y7-angles/half-turn", [halfTurn]],
  ["y7-fdp/percentages", [percentages]],
  ["y8-area/circle-area", [circleArea]],
  ["y9-trigonometry/sine", [sine]],
  ["gf-ratio-1/part-part", [sharing]],
];
