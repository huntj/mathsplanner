// Year 8, "Coordinates and straight-line graphs", on the stepped template
// (docs/proposals/lesson-stepped.md): all four quadrants, a line from its table, and reading m and
// c. Points and lines are asked on the grid; working out y from a rule is algebra, its own picture.
import { ask, calc, explain, methodCard, questionSet, quiz, summary, typed } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, Rule, UnitLesson } from "./types.ts";
import { y8Graphs } from "./y8-graphs.ts";

const G = y8Graphs;
const ALGEBRA = "A rule worked out in algebra: the rule is the picture.";
const four: Range = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
const wide: Range = { xMin: -1, xMax: 6, yMin: -1, yMax: 12 };
const open: Range = { xMin: -4, xMax: 4, yMin: -6, yMax: 8 };
const dot = (x: number, y: number, range = four): Picture => ({
  kind: "graph",
  range,
  points: [{ x, y }],
});
const ruled = (rules: Rule[], range = open, steps = false): Picture => ({
  kind: "graph",
  range,
  lines: rules,
  ...(steps ? { steps: true } : {}),
});
const table = (xs: number[], ys: string[]): Picture => ({
  kind: "table",
  head: ["x", ...xs.map((x) => String(x).replace("-", "−"))],
  rows: [["y", ...ys]],
});
const at = (p: Point) => `(${p.x}, ${p.y})`.replace(/-/g, "−");

// ---------------------------------------------------------------------------------------------
// All four quadrants.

const COORDS = "y8-graphs/coordinates";
const coordsMethod = [
  "Start at (0, 0).",
  "Go across: right for positive x, left for negative.",
  "Then up for positive y, down for negative.",
];
const QUADRANTS: Picture = {
  kind: "graph",
  range: four,
  points: [
    { x: -3, y: 2 },
    { x: 2, y: -3 },
  ],
};
const read = (p: Point, wrongs: Point[], o: NonNullable<Parameters<typeof ask>[4]>) =>
  ask("Read the point.", at(p), "Across first, then up or down.", `${at(p)}.`, {
    ...o,
    others: wrongs.map(at),
    picture: dot(p.x, p.y),
  });

const coordinates = stepped(find(G, COORDS), {
  method: coordsMethod,
  variation: {
    relationship: "a point and its coordinates (x, y)",
    unknowns: ["x", "y", "quadrant", "point"],
    surface: ["left of zero", "below zero", "on an axis", "swapped numbers"],
  },
  screens: [
    explain(
      "The rule",
      "All four quadrants",
      ["**Across first, then up or down. Negative x is left; negative y is down.**"],
      QUADRANTS,
      "(−3, 2) and (2, −3) are different points: order matters.",
    ),
    reworded(G, COORDS, "Plot (−3, 2)", { tag: "The rule" }),

    reworded(G, COORDS, "Plot (3, 2)", { tag: "Check you remember" }),
    typed("Check you remember", "Read the x-coordinate.", "4", "How far across?", "4.", {
      picture: dot(4, 1, { xMin: 0, xMax: 5, yMin: 0, yMax: 5 }),
    }),

    methodCard("The method", coordsMethod, QUADRANTS),
    workedFrom(G, COORDS),
    calc(
      "Your turn",
      "Read the point.",
      dot(3, -2),
      [
        ["Across: $x =$", "3", "Right is positive."],
        ["Up or down: $y =$", "-2", "Down is negative."],
      ],
      "(3, −2).",
    ),

    calc(
      "Practise",
      "Read the point.",
      dot(-4, -1),
      [
        ["Across: $x =$", "-4", "Left is negative."],
        ["Up or down: $y =$", "-1", "Down is negative."],
      ],
      "(−4, −1).",
    ),
    ...owned(G, COORDS, "Together", "Practise"),
    questionSet(
      "Practise",
      "Read each one. Watch what changes.",
      [
        ask("Read the x-coordinate.", ["-2", "−2"], "Left is negative.", "−2.", {
          asks: "x",
          picture: dot(-2, 3),
        }),
        ask("Read the y-coordinate.", "3", "Up is positive.", "3.", {
          asks: "y",
          changed: "Now y.",
          picture: dot(-2, 3),
        }),
        ask("Which quadrant is it in?", "Bottom left", "Left and down.", "Bottom left.", {
          asks: "quadrant",
          changed: "Name the quadrant.",
          others: ["Top left", "Bottom right"],
          picture: dot(-3, -1),
        }),
        ask("Read the x-coordinate.", "0", "No distance across.", "0: it's on the y-axis.", {
          asks: "x",
          changed: "On an axis.",
          picture: dot(0, -3),
        }),
      ],
      "Across, then up or down, signs and all.",
    ),

    questionSet(
      "Variation",
      "Read the point. Watch what changes.",
      [
        read(
          { x: 2, y: -3 },
          [
            { x: -3, y: 2 },
            { x: 3, y: -2 },
          ],
          {
            asks: "point",
            expect: [
              "Abi reads it as (−3, 2). Right?",
              "No",
              "Across first: x = 2. Then 3 down: y = −3.",
              [["Yes", "x comes first: across."]],
            ],
          },
        ),
        read(
          { x: -2, y: -3 },
          [
            { x: 2, y: -3 },
            { x: -3, y: -2 },
          ],
          {
            asks: "point",
            changed: "Now left of zero.",
          },
        ),
        read(
          { x: -2, y: 3 },
          [
            { x: -2, y: -3 },
            { x: 3, y: -2 },
          ],
          {
            asks: "point",
            changed: "Now above zero.",
          },
        ),
        read(
          { x: 3, y: -2 },
          [
            { x: -2, y: 3 },
            { x: 2, y: -3 },
          ],
          {
            asks: "point",
            changed: "Swap the numbers.",
          },
        ),
      ],
      "x first, always: across, then up or down.",
    ),
    own(G, COORDS, "Spot the mistake"),

    quiz([
      [
        [
          "What are the coordinates?",
          "(−4, 3)",
          ["(3, −4)", "(4, −3)"],
          "4 left, 3 up.",
          dot(-4, 3),
        ],
        [
          "What are the coordinates?",
          "(−1, 4)",
          ["(4, −1)", "(1, −4)"],
          "1 left, 4 up.",
          dot(-1, 4),
        ],
      ],
      [
        [
          "Which quadrant is it in?",
          "Bottom right",
          ["Top right", "Bottom left"],
          "Right and down.",
          dot(3, -4),
        ],
        [
          "Which quadrant is it in?",
          "Top left",
          ["Top right", "Bottom left"],
          "Left and up.",
          dot(-2, 4),
        ],
      ],
      [
        [
          "This point is on the y-axis. Its x is",
          "0",
          ["2", "−2"],
          "No distance across.",
          dot(0, 2),
        ],
        [
          "This point is on the y-axis. Its x is",
          "0",
          ["−3", "3"],
          "No distance across.",
          dot(0, -3),
        ],
      ],
    ]),

    reworded(G, COORDS, "Find the treasure: (−3, −2)", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Across first, then up or down. Negative x is left; negative y is down.**"],
      QUADRANTS,
      [
        "**Across first, then up or down. Negative x is left; negative y is down.**",
        "(−3, 2): 3 left, 2 up.",
        "On the y-axis, x is 0.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// A line from its table.

const TABLE = "y8-graphs/from-a-table";
const tableMethod = [
  "Pick some x values: 0, 1, 2, 3.",
  "Work out y for each with the rule.",
  "Plot each (x, y) and join them with a ruler.",
];
const LINE_2X1 = ruled([{ m: 2, c: 1 }], wide);

const fromATable = stepped(find(G, TABLE), {
  method: tableMethod,
  variation: {
    relationship: "a rule, its table of values, and its line",
    unknowns: ["y", "x", "on the line?"],
    surface: ["negative x", "x is 0", "far along the line"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Spot the rule",
        ["**Put each x into the rule, plot (x, y): the points make a line.**"],
        LINE_2X1,
        "Every point on $y = 2x + 1$ fits the rule.",
      ),
      reworded(G, TABLE, "Feed the machine", { tag: "The rule" }),
      reworded(G, TABLE, "Plot what came out", { tag: "The rule" }),

      ...owned(G, TABLE, "Warm-up", "Check you remember"),

      methodCard("The method", tableMethod, LINE_2X1),
      workedFrom(G, TABLE),
      calc(
        "Your turn",
        "Complete the table for $y = 2x - 1$.",
        table([0, 1, 2, 3], ["?", "?", "?", "?"]),
        [
          ["$x = 0$: $y =$", "-1", "$2 \\times 0 - 1$."],
          ["$x = 1$: $y =$", "1", "$2 \\times 1 - 1$."],
          ["$x = 2$: $y =$", "3", "$2 \\times 2 - 1$."],
          ["$x = 3$: $y =$", "5", "$2 \\times 3 - 1$."],
        ],
        "(0, −1), (1, 1), (2, 3), (3, 5): a straight line.",
      ),

      calc(
        "Practise",
        "Complete the table for $y = 5 - 2x$.",
        table([0, 1, 2], ["?", "?", "?"]),
        [
          ["$x = 0$: $y =$", "5", "$5 - 0$."],
          ["$x = 1$: $y =$", "3", "$5 - 2$."],
          ["$x = 2$: $y =$", "1", "$5 - 4$."],
        ],
        "(0, 5), (1, 3), (2, 1): going down.",
      ),
      ...owned(G, TABLE, "Together", "Practise"),
      reworded(G, TABLE, "Plot $y = 4 - x$ from its table", { tag: "Practise" }),
      questionSet(
        "Practise",
        "$y = 3x + 1$. Watch what changes.",
        [
          ask("Find y when $x = 2$.", "7", "$3 \\times 2 + 1$.", "7.", { asks: "y" }),
          ask("Find y when $x = -2$.", ["-5", "−5"], "$3 \\times -2 + 1$.", "−5.", {
            asks: "y",
            changed: "Negative x.",
          }),
          ask("Find x when $y = 13$.", "4", "$3x + 1 = 13$.", "4.", {
            asks: "x",
            changed: "Now y is given.",
          }),
          ask("Is (3, 10) on the line?", "Yes", "$3 \\times 3 + 1 = 10$.", "Yes.", {
            asks: "on the line?",
            changed: "Check a point.",
            others: ["No"],
          }),
        ],
        "Put x in, get y out.",
      ),

      questionSet(
        "Variation",
        "$y = 2x + 1$. Find y. Watch what changes.",
        [
          ask("Find y when $x = 2$.", "5", "$2 \\times 2 + 1$.", "5.", {
            asks: "y",
            expect: [
              "Eli plots (2, 6) on this line. Right?",
              "No",
              "$2 \\times 2 + 1 = 5$, so the point is (2, 5).",
              [["Yes", "Work out y for x = 2."]],
            ],
          }),
          ask("Find y when $x = -2$.", ["-3", "−3"], "$2 \\times -2 + 1$.", "−3.", {
            asks: "y",
            changed: "Negative x.",
          }),
          ask("Find y when $x = 0$.", "1", "$0 + 1$.", "1: where it crosses the y-axis.", {
            asks: "y",
            changed: "x is 0.",
          }),
          ask("Find y when $x = 10$.", "21", "$20 + 1$.", "21.", {
            asks: "y",
            changed: "Far along the line.",
          }),
        ],
        "The same rule for every x, however big or negative.",
      ),
      own(G, TABLE, "Spot the mistake"),

      own(G, TABLE, "Exit check"),

      reworded(G, TABLE, "Where will x = 5 go?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Put each x into the rule, plot (x, y): the points make a line.**"],
        LINE_2X1,
        [
          "**Put each x into the rule, plot (x, y): the points make a line.**",
          "$y = 2x + 1$: (0, 1), (1, 3), (2, 5).",
          "A point off the line? Check its working.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// y = mx + c.

const SKETCH = "y8-graphs/sketch";
const sketchMethod = [
  "Read c: start at (0, c).",
  "Read m: 1 across, m up (down if m is negative).",
  "Repeat the step, then join the points.",
];
const MC = ruled([{ m: 2, c: 1 }], open, true);

const sketch = stepped(find(G, SKETCH), {
  method: sketchMethod,
  variation: {
    relationship: "y = mx + c: the gradient m and where it crosses, c",
    unknowns: ["gradient", "intercept", "rule"],
    surface: ["sloping down", "no c", "written backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "y = mx + c",
        ["**In y = mx + c, m is the gradient and c is where it crosses.**"],
        MC,
        "m: how far up for each 1 across. c: the start, on the y-axis.",
      ),
      reworded(G, SKETCH, "Steeper or flatter?", { tag: "The rule" }),
      reworded(G, SKETCH, "Up and down", { tag: "The rule" }),

      ...owned(G, SKETCH, "Warm-up", "Check you remember"),

      methodCard("The method", sketchMethod, MC),
      workedFrom(G, SKETCH),
      calc(
        "Your turn",
        "Find this line's rule.",
        ruled([{ m: 3, c: -1 }], open, true),
        [
          ["It crosses the y-axis at $c =$", "-1", "Read the y-axis."],
          ["Up for each 1 across: $m =$", "3", "Count one step."],
        ],
        "$y = 3x - 1$.",
      ),

      calc(
        "Practise",
        "Find this line's rule.",
        ruled([{ m: -2, c: 4 }], open, true),
        [
          ["$c =$", "4", "Where it crosses."],
          ["$m =$", "-2", "It goes down 2 for each 1 across."],
        ],
        "$y = -2x + 4$.",
      ),
      ...owned(G, SKETCH, "Together", "Practise"),
      ...owned(G, SKETCH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Find the gradient.", "2", "Up for each 1 across.", "2.", {
            asks: "gradient",
            picture: ruled([{ m: 2, c: -3 }], open, true),
          }),
          ask("Where does it cross the y-axis? $c =$", ["-3", "−3"], "Read the y-axis.", "−3.", {
            asks: "intercept",
            changed: "Now c.",
            picture: ruled([{ m: 2, c: -3 }], open, true),
          }),
          ask("Find the gradient.", ["-1", "−1"], "Down 1 for each 1 across.", "−1.", {
            asks: "gradient",
            changed: "Sloping down.",
            picture: ruled([{ m: -1, c: 2 }], open, true),
          }),
          ask("Which is its rule?", "$y = x + 3$", "m = 1, c = 3.", "$y = x + 3$.", {
            asks: "rule",
            changed: "The whole rule.",
            others: ["$y = 3x + 1$", "$y = x - 3$"],
            picture: ruled([{ m: 1, c: 3 }], open, true),
          }),
        ],
        "c from the y-axis, m from one step.",
      ),

      questionSet(
        "Variation",
        "Read each rule. Watch what changes.",
        [
          ask("The gradient of $y = 5 - 2x$?", ["-2", "−2"], "The number with x.", "−2.", {
            asks: "gradient",
            expect: [
              "Will says the gradient of $y = 5 - 2x$ is 5. Right?",
              "No",
              "The gradient is the number with x: −2.",
              [["Yes", "5 is c: where it crosses."]],
            ],
          }),
          ask("Where does $y = 5 - 2x$ cross? $c =$", "5", "The number on its own.", "5.", {
            asks: "intercept",
            changed: "Now c.",
          }),
          ask("The gradient of $y = -2x$?", ["-2", "−2"], "The number with x.", "−2.", {
            asks: "gradient",
            changed: "No number on its own.",
          }),
          ask("Where does $y = -2x$ cross? $c =$", "0", "Nothing added.", "0: through (0, 0).", {
            asks: "intercept",
            changed: "c is 0.",
          }),
        ],
        "m is the number with x, wherever it's written.",
      ),
      own(G, SKETCH, "Spot the mistake"),

      own(G, SKETCH, "Exit check"),

      reworded(G, SKETCH, "Sketch $y = -2x + 4$", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**In y = mx + c, m is the gradient and c is where it crosses.**"],
        MC,
        [
          "**In y = mx + c, m is the gradient and c is where it crosses.**",
          "Start at (0, c), then 1 across and m up.",
          "$y = 5 - 2x$: the gradient is −2.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// What the line means.

const INTERPRET = "y8-graphs/interpret";
const interpretMethod = [
  "The number on its own is the start: its value when x is 0.",
  "The number with x is the rate: the change for each 1.",
  "Say it with units: cm per hour, £ per mile.",
];
const CANDLE = ruled([{ m: -2, c: 12 }], { xMin: 0, xMax: 6, yMin: 0, yMax: 12 });

const interpret = stepped(find(G, INTERPRET), {
  method: interpretMethod,
  variation: {
    relationship: "a real-life line: its rate and its start",
    unknowns: ["rate", "start", "value"],
    surface: ["phone plans", "fuel", "faster rates", "gradient 0"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "What the line means",
        ["**In a real graph, the gradient is a rate and the intercept is the start.**"],
        CANDLE,
        "The candle starts 12 cm tall, and shrinks 2 cm each hour.",
      ),
      reworded(G, INTERPRET, "What does the 12 tell you?", {
        tag: "The rule",
        text: "Look where the line starts.",
      }),
      reworded(G, INTERPRET, "What does the −2 tell you?", { tag: "The rule", picture: CANDLE }),

      ...owned(G, INTERPRET, "Warm-up", "Check you remember"),

      methodCard("The method", interpretMethod, CANDLE),
      workedFrom(G, INTERPRET),
      calc(
        "Your turn",
        "A candle: $h = 15 - 3t$ cm after t hours.",
        ruled([{ m: -3, c: 15 }], { xMin: 0, xMax: 6, yMin: 0, yMax: 16 }),
        [
          ["Height at the start:", "15", "The number on its own.", { after: "cm" }],
          ["Shorter each hour by:", "3", "The number with t.", { after: "cm" }],
        ],
        "It starts 15 cm tall and loses 3 cm an hour.",
      ),

      calc(
        "Practise",
        "A taxi: $C = 2m + 1$ pounds for m miles.",
        ruled([{ m: 2, c: 1 }], { xMin: 0, xMax: 6, yMin: 0, yMax: 13 }),
        [
          ["Before you move: £", "1", "The start."],
          ["For each mile: £", "2", "The rate."],
          ["For 4 miles: £", "9", "$2 \\times 4 + 1$."],
        ],
        "£1 to start, £2 a mile: 4 miles cost £9.",
      ),
      reworded(G, INTERPRET, "Filling a tank", {
        tag: "Practise",
        start: "5 litres in, filling at 3 litres a minute.",
      }),
      reworded(G, INTERPRET, "Which story fits a horizontal line?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "$C = 0.5t + 10$ pounds for t texts.",
        [
          ask("The cost of each text, in £?", "0.5", "The number with t.", "£0.50.", {
            asks: "rate",
          }),
          ask("The monthly charge, in £?", "10", "The number on its own.", "£10.", {
            asks: "start",
            changed: "Now the start.",
          }),
          ask("The cost for 20 texts, in £?", "20", "$0.5 \\times 20 + 10$.", "£20.", {
            asks: "value",
            changed: "Now use it.",
          }),
          ask("Texts for a £15 bill?", "10", "$0.5t + 10 = 15$.", "10 texts.", {
            asks: "value",
            changed: "Now backwards.",
          }),
        ],
        "Rate with the letter, start on its own.",
      ),

      questionSet(
        "Variation",
        "A candle. Shorter each hour by how many cm?",
        [
          ask("$h = 12 - 2t$", "2", "The number with t.", "2 cm an hour.", {
            asks: "rate",
            expect: [
              "Lou says it shrinks 12 cm an hour. Right?",
              "No",
              "12 is the start; it shrinks 2 cm an hour.",
              [["Yes", "Which number is with t?"]],
            ],
          }),
          ask("$h = 12 - 3t$", "3", "The number with t.", "3 cm an hour.", {
            asks: "rate",
            changed: "It burns faster.",
          }),
          ask("$h = 20 - 2t$", "2", "The number with t.", "2 cm an hour.", {
            asks: "rate",
            changed: "Taller start, same rate.",
          }),
          ask("$h = 12$", "0", "No t at all.", "0: it never burns.", {
            asks: "rate",
            changed: "Gradient 0.",
          }),
        ],
        "The rate is always the number with the letter.",
      ),
      reworded(
        G,
        INTERPRET,
        "Where did it go wrong?",
        { text: "Plumber: $C = 30h + 50$ pounds for h hours. Kit explains." },
        "Spot the mistake",
      ),

      own(G, INTERPRET, "Exit check"),

      reworded(
        G,
        INTERPRET,
        "The candle: $h = 12 - 2t$",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In a real graph, the gradient is a rate and the intercept is the start.**"],
        CANDLE,
        [
          "**In a real graph, the gradient is a rate and the intercept is the start.**",
          "$C = 2m + 3$: £2 a mile, £3 to start.",
          "Gradient 0: nothing changes.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Reading a graph.

const READ = "y8-graphs/read";
const readMethod = [
  "Find the value you know on its axis.",
  "Go to the line: up from x, or across from y.",
  "Then across or down to the other axis. Check the scale.",
];
const MILES = ruled([{ m: 1.6, c: 0 }], { xMin: 0, xMax: 10, yMin: 0, yMax: 16 });
const X2: Picture = ruled([{ m: 1, c: 2 }], { xMin: 0, xMax: 6, yMin: 0, yMax: 9 });
const TWICE: Picture = ruled([{ m: 2, c: 0 }], { xMin: 0, xMax: 5, yMin: 0, yMax: 10 });

const readGraph = stepped(find(G, READ), {
  method: readMethod,
  variation: {
    relationship: "a value on one axis and the value it gives on the other",
    unknowns: ["y", "x"],
    surface: ["between grid lines", "backwards", "conversions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Reading a graph",
        ["**Up from x to the line, then across. Or across from y, then down.**"],
        {
          kind: "graph",
          range: { xMin: 0, xMax: 10, yMin: 0, yMax: 16 },
          lines: [{ m: 1.6, c: 0 }],
          points: [{ x: 5, y: 8 }],
        },
        "5 miles: up to the line, across to 8 km.",
      ),
      reworded(G, READ, "5 miles is how many km?", {
        tag: "The rule",
        text: "Up from 5, then across.",
      }),

      reworded(G, READ, "What are the coordinates of the point?", { tag: "Check you remember" }),
      reworded(G, READ, "What is halfway between 6 and 8?", { tag: "Check you remember" }),

      methodCard("The method", readMethod, MILES),
      workedFrom(G, READ),
      calc(
        "Your turn",
        "This is $y = x + 2$.",
        X2,
        [
          ["Up from $x = 1.5$, then across: $y =$", "3.5", "Halfway between grid lines."],
          ["Across from $y = 7$, then down: $x =$", "5", "Backwards."],
        ],
        "$y = 3.5$ when $x = 1.5$; $x = 5$ when $y = 7$.",
      ),

      calc(
        "Practise",
        "Change 4 km to miles.",
        MILES,
        [["Across from 4 km, then down:", "2.5", "Read the miles axis.", { after: "miles" }]],
        "4 km ≈ 2.5 miles.",
      ),
      ...owned(G, READ, "Together", "Practise"),
      ...owned(G, READ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read each one. Watch what changes.",
        [
          ask("Read y when $x = 4$.", "6", "Up, then across.", "6.", { asks: "y", picture: X2 }),
          ask("Read x when $y = 4$.", "2", "Across, then down.", "2.", {
            asks: "x",
            changed: "Now backwards.",
            picture: X2,
          }),
          ask("Read y when $x = 2.5$.", "4.5", "Halfway between lines.", "4.5.", {
            asks: "y",
            changed: "Between grid lines.",
            picture: X2,
          }),
          ask("Read x when $y = 7.5$.", "5.5", "Across, then down.", "5.5.", {
            asks: "x",
            changed: "Backwards, between lines.",
            picture: X2,
          }),
        ],
        "Start on the axis you know.",
      ),

      questionSet(
        "Variation",
        "This is $y = 2x$. Watch what changes.",
        [
          ask("Read y when $x = 3$.", "6", "Up from 3, then across.", "6.", {
            asks: "y",
            picture: TWICE,
            expect: [
              "Hal starts on the y-axis at 3. Right?",
              "No",
              "You know x, so start at 3 on the x-axis: up, then across.",
              [["Yes", "You know x: start on its axis."]],
            ],
          }),
          ask("Read x when $y = 6$.", "3", "Across from 6, then down.", "3.", {
            asks: "x",
            changed: "Backwards.",
            picture: TWICE,
          }),
          ask("Read y when $x = 0$.", "0", "At the start.", "0.", {
            asks: "y",
            changed: "At the start.",
            picture: TWICE,
          }),
          ask("Read y when $x = 4.5$.", "9", "Up from 4.5.", "9.", {
            asks: "y",
            changed: "Between grid lines.",
            picture: TWICE,
          }),
        ],
        "Start on the axis of the value you know.",
      ),
      reworded(G, READ, "Where did it go wrong?", { picture: MILES }, "Spot the mistake"),

      own(G, READ, "Exit check"),

      reworded(G, READ, "5 miles, and 12 km", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Up from x to the line, then across. Or across from y, then down.**"],
        MILES,
        [
          "**Up from x to the line, then across. Or across from y, then down.**",
          "Start on the axis of the value you know.",
          "Check the scale: one square may be 2.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Where lines cross.

const CROSS = "y8-graphs/simultaneous";
const crossMethod = [
  "Draw both lines.",
  "Find where they cross.",
  "Read x and y, then check them in both equations.",
];
const TAXIS = ruled(
  [
    { m: 1, c: 4 },
    { m: 2, c: 1 },
  ],
  { xMin: 0, xMax: 6, yMin: 0, yMax: 12 },
);
const small: Range = { xMin: 0, xMax: 5, yMin: 0, yMax: 10 };
const pairOf = (a: Rule, b: Rule, range = small) => ruled([a, b], range);

const simultaneous = stepped(find(G, CROSS), {
  method: crossMethod,
  variation: {
    relationship: "two lines and the point that solves both",
    unknowns: ["x", "y", "solution", "check"],
    surface: ["steeper lines", "left of zero", "parallel lines"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Where lines cross",
        ["**Where two lines cross solves both equations at once.**"],
        TAXIS,
        "They cross at (3, 7): it fits both rules.",
      ),
      reworded(G, CROSS, "On both lines", { tag: "The rule" }),
      reworded(G, CROSS, "Where do these lines cross?", { tag: "The rule" }),

      ...owned(G, CROSS, "Warm-up", "Check you remember"),

      methodCard("The method", crossMethod, TAXIS),
      workedFrom(G, CROSS),
      calc(
        "Your turn",
        "Solve $y = x + 1$ and $y = 3x - 3$.",
        pairOf({ m: 1, c: 1 }, { m: 3, c: -3 }),
        [
          ["They cross at $x =$", "2", "Read across."],
          ["and $y =$", "3", "Read up."],
          ["Check: $3 \\times 2 - 3 =$", "3", "It fits."],
        ],
        "$x = 2$, $y = 3$.",
      ),

      calc(
        "Practise",
        "Solve $y = 2x$ and $y = 6 - x$.",
        pairOf({ m: 2, c: 0 }, { m: -1, c: 6 }),
        [
          ["They cross at $x =$", "2", "Read across."],
          ["and $y =$", "4", "Read up."],
          ["Check: $6 - 2 =$", "4", "It fits."],
        ],
        "$x = 2$, $y = 4$.",
      ),
      ...owned(G, CROSS, "Together", "Practise"),
      ...owned(G, CROSS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Read x where they cross.", "1", "Read across.", "1.", {
            asks: "x",
            picture: pairOf({ m: 1, c: 3 }, { m: -1, c: 5 }),
          }),
          ask("Read y where they cross.", "4", "Read up.", "4.", {
            asks: "y",
            changed: "Now y.",
            picture: pairOf({ m: 1, c: 3 }, { m: -1, c: 5 }),
          }),
          ask(
            "Solve both equations.",
            "$x = 2$, $y = 3$",
            "Read the crossing.",
            "$x = 2$, $y = 3$.",
            {
              asks: "solution",
              changed: "New lines.",
              others: ["$x = 3$, $y = 2$", "$x = 2$ only"],
              picture: pairOf({ m: 2, c: -1 }, { m: 1, c: 1 }),
            },
          ),
          ask(
            "Does (1, 4) solve $y = x + 3$ and $y = 5 - x$?",
            "Yes",
            "Try it in both.",
            "Yes: it fits both.",
            {
              asks: "check",
              changed: "Check by working.",
              others: ["No"],
            },
          ),
        ],
        "Read the crossing, then check.",
      ),

      questionSet(
        "Variation",
        "Solve from the graph. Watch what changes.",
        [
          ask(
            "Solve $y = x + 3$ and $y = 2x$.",
            "$x = 3$, $y = 6$",
            "Read the crossing.",
            "$x = 3$, $y = 6$.",
            {
              asks: "solution",
              others: ["$x = 6$, $y = 3$", "$x = 3$ only"],
              picture: pairOf({ m: 1, c: 3 }, { m: 2, c: 0 }),
              expect: [
                "Ana writes $x = 6$, $y = 3$. Right?",
                "No",
                "They cross at (3, 6): x is across, so $x = 3$, $y = 6$.",
                [["Yes", "x comes first in (3, 6)."]],
              ],
            },
          ),
          ask(
            "Solve $y = x + 3$ and $y = 3x - 1$.",
            "$x = 2$, $y = 5$",
            "Read the crossing.",
            "$x = 2$, $y = 5$.",
            {
              asks: "solution",
              changed: "A steeper second line.",
              others: ["$x = 5$, $y = 2$", "$x = 2$ only"],
              picture: pairOf({ m: 1, c: 3 }, { m: 3, c: -1 }),
            },
          ),
          ask(
            "Solve $y = x + 3$ and $y = 1 - x$.",
            "$x = -1$, $y = 2$",
            "Left of zero.",
            "$x = -1$, $y = 2$.",
            {
              asks: "solution",
              changed: "Crossing left of zero.",
              others: ["$x = 1$, $y = 2$", "$x = 2$, $y = -1$"],
              picture: pairOf(
                { m: 1, c: 3 },
                { m: -1, c: 1 },
                { xMin: -3, xMax: 4, yMin: -1, yMax: 8 },
              ),
            },
          ),
          ask(
            "Where do $y = x + 3$ and $y = x + 1$ cross?",
            "They never cross",
            "Same gradient.",
            "They're parallel: no solution.",
            {
              asks: "solution",
              changed: "The same gradient.",
              others: ["At (0, 3)", "At (3, 6)"],
              picture: pairOf({ m: 1, c: 3 }, { m: 1, c: 1 }),
            },
          ),
        ],
        "The crossing gives both values; parallel lines never cross.",
      ),
      own(G, CROSS, "Spot the mistake"),

      own(G, CROSS, "Exit check"),

      reworded(G, CROSS, "The taxis", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Where two lines cross solves both equations at once.**"],
        TAXIS,
        [
          "**Where two lines cross solves both equations at once.**",
          "Give both values: $x = 3$, $y = 7$.",
          "Check the point in both equations.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y8GraphsStepped: [string, UnitLesson[]][] = [
  [COORDS, [coordinates]],
  [TABLE, [fromATable]],
  [SKETCH, [sketch]],
  [INTERPRET, [interpret]],
  [READ, [readGraph]],
  [CROSS, [simultaneous]],
];
