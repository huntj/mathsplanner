// Year 8, "Scale drawings and constructions", on the stepped template
// (docs/proposals/lesson-stepped.md): scales and maps, the perpendicular bisector, a perpendicular
// at or from a point, the angle bisector, and the shortest way to a line. The constructions keep
// their step-by-step drawings; the practice works with the lengths and angles they make.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y8Constructions } from "./y8-constructions.ts";

const C = y8Constructions;
const FACT = "A fact about the construction: the steps are the picture.";

/** The picture on one of a lesson's own screens, to draw it again. */
function picOf(id: string, title: string): Picture {
  const screen = find(C, id)?.screens.find((s) => s.title === title);
  const pic = screen && "picture" in screen ? screen.picture : undefined;
  if (!pic) throw new Error(`No picture on "${title}" in ${id}`);
  return pic;
}

// ---------------------------------------------------------------------------------------------
// Scale drawings and maps.

const SCALE = "y8-constructions/scale";
const scaleMethod = [
  "Map to real: multiply by the scale.",
  "Real to map: divide by the scale.",
  "Change the units at the end: cm to m or km.",
];
const MAP: Picture = {
  kind: "table",
  head: ["Map", "1 cm", "2 cm", "6 cm"],
  rows: [["Real", "2.5 km", "5 km", "15 km"]],
};

const scale = stepped(find(C, SCALE), {
  method: scaleMethod,
  variation: {
    relationship: "map length × scale = real length",
    unknowns: ["real", "map", "angle"],
    surface: ["decimals", "a different scale", "backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Scale drawings and maps",
        ["**Every length is multiplied by the scale. Angles stay the same.**"],
        MAP,
        "1 cm stands for 2.5 km: 6 cm is 15 km.",
      ),
      reworded(C, SCALE, "Scale factor", { tag: "The rule" }),
      reworded(C, SCALE, "A scale of 1 : 100. 1 cm on the plan is", { tag: "The rule" }),

      ...owned(C, SCALE, "Warm-up", "Check you remember"),

      methodCard("The method", scaleMethod, MAP),
      workedFrom(C, SCALE),
      calc(
        "Your turn",
        "A model boat is 1 : 30, and 12 cm long.",
        undefined,
        [
          ["Real: $12 \\times 30 =$", "360", "Multiply by the scale.", { after: "cm" }],
          ["In metres:", "3.6", "100 cm in a metre.", { after: "m" }],
        ],
        "The real boat is 3.6 m long.",
      ),

      calc(
        "Practise",
        "1 cm stands for 2 km. Towns are 13 km apart.",
        undefined,
        [["On the map: $13 \\div 2 =$", "6.5", "Real to map: divide.", { after: "cm" }]],
        "6.5 cm on the map.",
      ),
      reworded(C, SCALE, "Map to real", {
        tag: "Practise",
        start: "1 cm : 2.5 km. A lake is 3.2 cm across.",
      }),
      reworded(C, SCALE, "Real to map", {
        tag: "Practise",
        start: "1 cm : 2.5 km. A road is 10 km long.",
      }),
      questionSet(
        "Practise",
        "1 cm stands for 3 km. Watch what changes.",
        [
          ask("4 cm on the map, in km?", "12", "4 × 3.", "12 km.", { unit: "km", asks: "real" }),
          ask("7.5 cm on the map, in km?", "22.5", "7.5 × 3.", "22.5 km.", {
            unit: "km",
            asks: "real",
            changed: "A decimal.",
          }),
          ask("A 21 km walk, on the map?", "7", "21 ÷ 3.", "7 cm.", {
            unit: "cm",
            asks: "map",
            changed: "Real to map.",
          }),
          ask("A 40° angle on the map is, for real?", "40", "Angles don't change.", "40°.", {
            unit: "°",
            asks: "angle",
            changed: "An angle.",
          }),
        ],
        "Lengths scale; angles stay.",
      ),

      questionSet(
        "Variation",
        "A 1 : 25 000 map. Watch what changes.",
        [
          ask("4 cm on the map, in km?", "1", "100 000 cm, then to km.", "1 km.", {
            unit: "km",
            asks: "real",
            expect: [
              "Jo says 4 cm is 100 000 km. Right?",
              "No",
              "It's 100 000 cm: that's 1 km.",
              [["Yes", "Change cm to km: divide by 100 000."]],
            ],
          }),
          ask("8 cm on the map, in km?", "2", "Twice as long.", "2 km.", {
            unit: "km",
            asks: "real",
            changed: "Twice as long.",
          }),
          ask("4 cm on a 1 : 50 000 map, in km?", "2", "200 000 cm.", "2 km.", {
            unit: "km",
            asks: "real",
            changed: "A different scale.",
          }),
          ask("2 km for real, on the map?", "8", "200 000 ÷ 25 000.", "8 cm.", {
            unit: "cm",
            asks: "map",
            changed: "Backwards.",
          }),
        ],
        "Multiply by the scale, then change the units.",
      ),
      reworded(
        C,
        SCALE,
        "Where did it go wrong?",
        { text: "Scale 1 : 25 000. Jo converts 4 cm to real." },
        "Spot the mistake",
      ),

      own(C, SCALE, "Exit check"),

      reworded(
        C,
        SCALE,
        "1 cm : 2.5 km",
        { tag: "Real life", text: "Your walk: 6 cm on the map. Theirs: 10 km." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Every length is multiplied by the scale. Angles stay the same.**"],
        MAP,
        [
          "**Every length is multiplied by the scale. Angles stay the same.**",
          "Map to real: multiply. Real to map: divide.",
          "Change cm to m or km at the end.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    FACT,
  ),
});

// ---------------------------------------------------------------------------------------------
// The perpendicular bisector.

const BISECTOR = "y8-constructions/perpendicular-bisector";
const bisectorMethod = [
  "Open the compass more than half of AB.",
  "Arcs from A above and below; the same width from B.",
  "Join the two crossings.",
];
const BISECTED = picOf(BISECTOR, "The perpendicular bisector");

const bisector = stepped(find(C, BISECTOR), {
  method: bisectorMethod,
  variation: {
    relationship: "points on the perpendicular bisector are equally far from A and B",
    unknowns: ["compass width", "distance", "angle", "step"],
    surface: ["odd lengths", "changing the width", "points far along it"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Halfway, at right angles",
        ["**Every point on the perpendicular bisector is equally far from A and B.**"],
        BISECTED,
        "It cuts AB in half, at 90°.",
      ),

      ...owned(C, BISECTOR, "Warm-up", "Check you remember"),

      methodCard("The method", bisectorMethod, BISECTED),
      workedFrom(C, BISECTOR),
      calc(
        "Your turn",
        "AB is 10 cm.",
        undefined,
        [
          ["Open the compass more than", "5", "Half of AB.", { after: "cm" }],
          ["The bisector meets AB this far from A:", "5", "At the midpoint.", { after: "cm" }],
        ],
        "More than 5 cm; it meets AB at its midpoint.",
      ),

      reworded(C, BISECTOR, "Cut AB in half, at right angles", { tag: "Practise" }),
      calc(
        "Practise",
        "P is on the perpendicular bisector of AB, 7 cm from A.",
        undefined,
        [["P's distance from B:", "7", "Equally far from both.", { after: "cm" }]],
        "7 cm.",
      ),
      ...owned(C, BISECTOR, "Together", "Practise"),
      reworded(C, BISECTOR, "Put the steps in order", { tag: "Practise" }),
      reworded(
        C,
        BISECTOR,
        "A point on the perpendicular bisector of AB is 5 cm from A. How far is it from B?",
        { tag: "Practise", title: "On the bisector, 5 cm from A. How far from B?" },
      ),
      questionSet(
        "Practise",
        "AB is 12 cm. Watch what changes.",
        [
          ask("Open the compass more than", "6", "Half of AB.", "6 cm.", {
            unit: "cm",
            asks: "compass width",
          }),
          ask("It meets AB how far from A?", "6", "At the midpoint.", "6 cm.", {
            unit: "cm",
            asks: "distance",
            changed: "Where it meets AB.",
          }),
          ask("At what angle does it cross AB?", "90", "Perpendicular.", "90°.", {
            unit: "°",
            asks: "angle",
            changed: "The angle.",
          }),
          ask("P is on it, 9 cm from A. From B?", "9", "Equally far.", "9 cm.", {
            unit: "cm",
            asks: "distance",
            changed: "A point on it.",
          }),
        ],
        "Half of AB, at 90°, equally far from both.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          ask("AB is 6 cm. Open the compass more than", "3", "Half of AB.", "3 cm.", {
            unit: "cm",
            asks: "compass width",
            expect: [
              "Mia opens the compass to 2 cm for a 6 cm AB. Will it work?",
              "No",
              "2 cm is less than half of 6 cm: the arcs won't meet.",
              [["Yes", "Half of AB is 3 cm."]],
            ],
          }),
          ask("AB is 9 cm. Open the compass more than", "4.5", "Half of AB.", "4.5 cm.", {
            unit: "cm",
            asks: "compass width",
            changed: "An odd length.",
          }),
          ask("P is on it, 6 cm from A. From B?", "6", "Equally far.", "6 cm.", {
            unit: "cm",
            asks: "distance",
            changed: "A point far along it.",
          }),
          ask(
            "Ben changes the width before drawing from B. Still a bisector?",
            "No",
            "Same width from both.",
            "No.",
            {
              asks: "step",
              changed: "A change of width.",
              others: ["Yes"],
            },
          ),
        ],
        "More than half of AB, and the same width from both ends.",
      ),
      own(C, BISECTOR, "Spot the mistake"),

      quiz([
        [
          [
            "The perpendicular bisector of AB meets AB",
            "at its midpoint, at 90°",
            ["at A, at 90°", "at its midpoint, at 45°"],
            "Halfway, at right angles.",
          ],
          [
            "Where does it cross AB?",
            "At the midpoint, at 90°",
            ["At B", "Anywhere, at 45°"],
            "Halfway, at right angles.",
          ],
        ],
        [
          ["AB is 8 cm. Open the compass more than", "4 cm", ["8 cm", "2 cm"], "Half of AB."],
          ["AB is 10 cm. Open the compass more than", "5 cm", ["10 cm", "2.5 cm"], "Half of AB."],
        ],
        [
          [
            "Points on the perpendicular bisector of AB are",
            "equally far from A and B",
            ["closer to A", "all on AB"],
            "Equally far from both.",
          ],
          [
            "7 cm from A and 7 cm from B. It's on",
            "the perpendicular bisector",
            ["the angle bisector", "AB itself"],
            "Equally far from A and B.",
          ],
        ],
      ]),

      reworded(C, BISECTOR, "A fair place to meet", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Every point on the perpendicular bisector is equally far from A and B.**"],
        BISECTED,
        [
          "**Every point on the perpendicular bisector is equally far from A and B.**",
          "Open the compass more than half of AB.",
          "Keep the same width from both ends.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    FACT,
  ),
});

// ---------------------------------------------------------------------------------------------
// A perpendicular at or from a point.

const PERP = "y8-constructions/perpendicular";
const perpMethod = [
  "Compass on the point: cut the line twice.",
  "From each cut, arcs that meet.",
  "Join the point to where they meet.",
];
const FROM_P = picOf(PERP, "From P to the line");

const perpendicular = stepped(find(C, PERP), {
  method: perpMethod,
  variation: {
    relationship: "a perpendicular is a perpendicular bisector of a segment you make",
    unknowns: ["step", "angle"],
    surface: ["at a point on the line", "from a point off it", "the tools"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A right angle anywhere",
        ["**Cut the line either side of the point, then bisect.**"],
        FROM_P,
        "The point becomes a midpoint: its bisector meets the line at 90°.",
      ),
      reworded(C, PERP, "At X, on the line", { tag: "The rule" }),

      ...owned(C, PERP, "Warm-up", "Check you remember"),

      methodCard("The method", perpMethod, FROM_P),
      workedFrom(C, PERP),
      calc(
        "Your turn",
        "Compass on X, opened to 3 cm.",
        undefined,
        [
          ["The two cuts are apart by", "6", "3 cm each side.", { after: "cm" }],
          ["X is this far from each cut:", "3", "X is the midpoint.", { after: "cm" }],
        ],
        "X is the midpoint of a 6 cm segment.",
      ),

      calc(
        "Practise",
        "The perpendicular at X is drawn.",
        undefined,
        [["The angle it makes with the line:", "90", "Perpendicular.", { after: "°" }]],
        "90°.",
      ),
      reworded(C, PERP, "From a point to a line", { tag: "Practise" }),
      reworded(C, PERP, "Why cross the arcs on the other side of the line from P?", {
        tag: "Practise",
        title: "Why cross the arcs across the line from P?",
      }),
      ...owned(C, PERP, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "A perpendicular at X. Watch what changes.",
        [
          ask(
            "The first step?",
            "Compass on X: cut the line both sides",
            "Make a segment.",
            "Cut the line both sides of X.",
            {
              asks: "step",
              others: ["Draw a line up from X", "Measure 90° with a protractor"],
            },
          ),
          ask(
            "The second step?",
            "From each cut, arcs that meet",
            "Bisect the segment.",
            "Arcs from each cut.",
            {
              asks: "step",
              changed: "The next step.",
              others: ["Join the two cuts", "Compass on X again"],
            },
          ),
          ask(
            "The last step?",
            "Join X to where the arcs meet",
            "Through X.",
            "Join X to the crossing.",
            {
              asks: "step",
              changed: "The last step.",
              others: ["Join the two cuts", "Measure the angle"],
            },
          ),
          ask("The angle made?", "90", "Perpendicular.", "90°.", {
            unit: "°",
            asks: "angle",
            changed: "The result.",
          }),
        ],
        "Make a segment, then bisect it.",
      ),

      questionSet(
        "Variation",
        "A perpendicular from P. Watch what changes.",
        [
          ask(
            "The first step?",
            "Compass on P: cut the line twice",
            "Make a segment.",
            "Cut the line twice.",
            {
              asks: "step",
              others: ["Draw straight down from P", "Compass on the line"],
              expect: [
                "Raj's arcs from the two cuts don't meet. Will it work?",
                "No",
                "The arcs must cross to give a second point to join to.",
                [["Yes", "You need a point to join to."]],
              ],
            },
          ),
          ask(
            "Where should the arcs from the cuts meet?",
            "Across the line from P",
            "Far from P.",
            "On the other side.",
            {
              asks: "step",
              changed: "Where they cross.",
              others: ["On P", "On the line"],
            },
          ),
          ask(
            "Then join P to",
            "where the arcs meet",
            "Through the crossing.",
            "Where the arcs meet.",
            {
              asks: "step",
              changed: "The last step.",
              others: ["the nearer cut", "the middle of the line"],
            },
          ),
          ask("Is a protractor allowed?", "No", "Compass and straight edge only.", "No.", {
            asks: "step",
            changed: "The tools.",
            others: ["Yes"],
          }),
        ],
        "From a point or at a point: make a segment, then bisect.",
      ),
      own(C, PERP, "Spot the mistake"),

      own(C, PERP, "Exit check"),

      reworded(C, PERP, "The fence post at X", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Cut the line either side of the point, then bisect.**"],
        FROM_P,
        [
          "**Cut the line either side of the point, then bisect.**",
          "The arcs must cross, away from the point.",
          "Compass and straight edge only.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    FACT,
  ),
});

// ---------------------------------------------------------------------------------------------
// The angle bisector.

const ANGLE = "y8-constructions/angle-bisector";
const angleMethod = [
  "Compass on the corner: an arc crossing both arms.",
  "Same width, from each crossing: arcs meeting inside.",
  "Join the corner to where they meet.",
];
const HALVED = picOf(ANGLE, "Bisect the angle at Q");

const angleBisector = stepped(find(C, ANGLE), {
  method: angleMethod,
  variation: {
    relationship: "the angle bisector halves the angle",
    unknowns: ["half", "step"],
    surface: ["obtuse angles", "a straight line", "bisecting twice"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Halve an angle",
        ["**Equal arcs from both arms find the line that halves the angle.**"],
        HALVED,
        "Every point on it is equally far from both arms.",
      ),
      reworded(C, ANGLE, "Why it works", { tag: "The rule" }),

      ...owned(C, ANGLE, "Warm-up", "Check you remember"),

      methodCard("The method", angleMethod, HALVED),
      workedFrom(C, ANGLE),
      calc(
        "Your turn",
        "Bisect a 70° angle.",
        undefined,
        [
          ["Each half is", "35", "Half of 70.", { after: "°" }],
          ["The two halves add to", "70", "The whole angle.", { after: "°" }],
        ],
        "35° and 35°.",
      ),

      calc(
        "Practise",
        "Bisect a 130° angle, then one half again.",
        undefined,
        [
          ["Each half:", "65", "Half of 130.", { after: "°" }],
          ["Each quarter:", "32.5", "Half of 65.", { after: "°" }],
        ],
        "65°, then 32.5°.",
      ),
      ...owned(C, ANGLE, "Together", "Practise"),
      ...owned(C, ANGLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Bisect each angle. Watch what changes.",
        [
          ask("Bisect 50°. Each half?", "25", "Half of 50.", "25°.", { unit: "°", asks: "half" }),
          ask("Bisect 150°. Each half?", "75", "Half of 150.", "75°.", {
            unit: "°",
            asks: "half",
            changed: "An obtuse angle.",
          }),
          ask("Bisect 180°. Each half?", "90", "Half a straight line.", "90°.", {
            unit: "°",
            asks: "half",
            changed: "A straight line.",
          }),
          ask("The first arc: compass on", "the corner", "Where the arms meet.", "The corner.", {
            asks: "step",
            changed: "Now a step.",
            others: ["the end of an arm", "the middle of the angle"],
          }),
        ],
        "Half, whatever the angle.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          ask("Bisect 70°. Each half?", "35", "Half of 70.", "35°.", {
            unit: "°",
            asks: "half",
            expect: [
              "Ali says each half of 70° is 70°. Right?",
              "No",
              "Bisect means cut in half: 35°.",
              [["Yes", "Bisect means cut in half."]],
            ],
          }),
          ask("Bisect 35°. Each half?", "17.5", "Half of 35.", "17.5°.", {
            unit: "°",
            asks: "half",
            changed: "Bisect again.",
          }),
          ask("Bisect 60°, then a half again. Each piece?", "15", "30, then 15.", "15°.", {
            unit: "°",
            asks: "half",
            changed: "Twice.",
          }),
          ask("Zoe joins the two first crossings. A bisector?", "No", "Join the corner.", "No.", {
            asks: "step",
            changed: "The wrong join.",
            others: ["Yes"],
          }),
        ],
        "Bisect means exactly half.",
      ),
      own(C, ANGLE, "Spot the mistake"),

      own(C, ANGLE, "Exit check"),

      reworded(C, ANGLE, "The path between the walls", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Equal arcs from both arms find the line that halves the angle.**"],
        HALVED,
        [
          "**Equal arcs from both arms find the line that halves the angle.**",
          "First arc: compass on the corner.",
          "Join the corner to where the next arcs meet.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    FACT,
  ),
});

// ---------------------------------------------------------------------------------------------
// The shortest way.

const SHORT = "y8-constructions/shortest";
const shortMethod = [
  "Go straight to the line, at 90°.",
  "On a grid: keep one coordinate the same.",
  "The distance is the change in the other coordinate.",
];
const SHORTEST = picOf(SHORT, "Which is the shortest distance from P to the line?");
const dot53 = (
  extra: { lines?: { m: number; c: number }[]; verticals?: number[] } = {},
): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 6, yMin: 0, yMax: 5 },
  points: [{ x: 5, y: 3 }],
  ...extra,
});

const shortestWay = stepped(find(C, SHORT), {
  method: shortMethod,
  variation: {
    relationship: "the shortest distance from a point to a line is the perpendicular one",
    unknowns: ["distance"],
    surface: ["the other axis", "a line off the axis", "below the axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The shortest way",
        ["**The shortest way from a point to a line meets it at 90°.**"],
        SHORTEST,
        "Any slanted path is a hypotenuse, so it's longer.",
      ),
      reworded(C, SHORT, "Which is the shortest distance from P to the line?", { tag: "The rule" }),
      reworded(C, SHORT, "Why it's shortest", { tag: "The rule" }),

      ...owned(C, SHORT, "Warm-up", "Check you remember"),

      methodCard("The method", shortMethod, SHORTEST),
      workedFrom(C, SHORT),
      calc(
        "Your turn",
        "Shortest distance from (4, 6) to the x-axis.",
        { kind: "graph", range: { xMin: 0, xMax: 6, yMin: 0, yMax: 7 }, points: [{ x: 4, y: 6 }] },
        [
          ["Straight down to (4,", "0", "The x-axis is $y = 0$.", { after: ")" }],
          ["The distance:", "6", "From 6 down to 0.", { after: "units" }],
        ],
        "6 units.",
      ),

      calc(
        "Practise",
        "Shortest distance from (−3, 2) to the y-axis.",
        undefined,
        [["Across to $x = 0$:", "3", "From −3 to 0.", { after: "units" }]],
        "3 units.",
      ),
      ...owned(C, SHORT, "Together", "Practise"),
      ...owned(C, SHORT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The point (5, 3). Watch what changes.",
        [
          ask("Shortest distance to the x-axis?", "3", "Straight down.", "3 units.", {
            asks: "distance",
            picture: dot53(),
          }),
          ask("Shortest distance to the y-axis?", "5", "Straight across.", "5 units.", {
            asks: "distance",
            changed: "The other axis.",
            picture: dot53(),
          }),
          ask("Shortest distance to the line $y = 1$?", "2", "Down to 1.", "2 units.", {
            asks: "distance",
            changed: "A line off the axis.",
            picture: dot53({ lines: [{ m: 0, c: 1 }] }),
          }),
          ask("Shortest distance to the line $x = 2$?", "3", "Across to 2.", "3 units.", {
            asks: "distance",
            changed: "An upright line.",
            picture: dot53({ verticals: [2] }),
          }),
        ],
        "Straight across or straight down.",
      ),

      questionSet(
        "Variation",
        "Find the shortest distance. Watch what changes.",
        [
          ask("From (4, 6) to the x-axis?", "6", "Straight down.", "6 units.", {
            asks: "distance",
            expect: [
              "Eva goes across to $x = 0$ and gets 4. Right?",
              "No",
              "The x-axis is $y = 0$: go down, 6 units.",
              [["Yes", "Which way is the x-axis?"]],
            ],
          }),
          ask("From (4, −6) to the x-axis?", "6", "Straight up.", "6 units.", {
            asks: "distance",
            changed: "Below the axis.",
          }),
          ask("From (−4, 6) to the y-axis?", "4", "Straight across.", "4 units.", {
            asks: "distance",
            changed: "The y-axis.",
          }),
          ask("From (4, 6) to the line $y = 2$?", "4", "Down to 2.", "4 units.", {
            asks: "distance",
            changed: "A line off the axis.",
          }),
        ],
        "Distances are never negative: count the steps.",
      ),
      own(C, SHORT, "Spot the mistake"),

      own(C, SHORT, "Exit check"),

      reworded(C, SHORT, "The swimmer at P", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**The shortest way from a point to a line meets it at 90°.**"],
        SHORTEST,
        [
          "**The shortest way from a point to a line meets it at 90°.**",
          "To the x-axis: straight down. To the y-axis: across.",
          "A slanted path is a hypotenuse: longer.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    FACT,
  ),
});

export const y8ConstructionsStepped: [string, UnitLesson[]][] = [
  [SCALE, [scale]],
  [BISECTOR, [bisector]],
  [PERP, [perpendicular]],
  [ANGLE, [angleBisector]],
  [SHORT, [shortestWay]],
];
