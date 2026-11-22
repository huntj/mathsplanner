// GCSE Foundation, "Constructions, loci and bearings", on the stepped template
// (docs/proposals/lesson-stepped.md): map scales, ruler-and-compass constructions, loci,
// measuring, scale drawings and bearings. Constructions, plans and bearings are drawn; scale
// conversions are number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { bearing, bisector, gfConstructions } from "./gf-constructions.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const CO = gfConstructions;
const NUMBER = "A measurement fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const plan = (w: number, h: number, a: string, b: string): Picture => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ],
  sides: [a, b, a, b],
  square: [0, 1, 2, 3],
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Scale factors and maps.

const SCALE = "gf-constructions/scale";
const scaleMethod = [
  "Map to real: × the scale.",
  "Real to map: change to cm, then ÷ the scale.",
  "Convert to sensible units.",
];
const RATIO = maths(
  "\\begin{array}{l} 1 : 50\\,000 \\\\ 1 \\text{ cm} \\to 50\\,000 \\text{ cm} = 500 \\text{ m} \\end{array}",
);

const scale = stepped(find(CO, SCALE), {
  method: scaleMethod,
  variation: {
    relationship: "a map scale and real distances",
    unknowns: ["length"],
    surface: ["map to real", "real to map", "metres or km"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Map scales",
        ["**Map to real: multiply by the scale. Real to map: divide.**"],
        RATIO,
        "Both sides are in the same units, so convert after.",
      ),
      reworded(CO, SCALE, "1 : 100 000. 1 cm on the map is", { tag: "The rule" }),

      ...owned(CO, SCALE, "Warm-up", "Check you remember"),

      methodCard("The method", scaleMethod, RATIO),
      workedFrom(CO, SCALE),
      calc(
        "Your turn",
        "A 1 : 20 000 map; 7 cm. Real distance?",
        undefined,
        [
          ["$7 \\times 20\\,000 =$", "140000", "Map to real.", { after: "cm" }],
          ["In km:", "1.4", "÷ 100 000."],
        ],
        "1.4 km.",
      ),

      calc(
        "Practise",
        "A 1 : 40 000 map; 6 km. On the map?",
        undefined,
        [
          ["6 km in cm:", "600000", "× 100 000."],
          ["$\\div 40\\,000 =$", "15", "Real to map.", { after: "cm" }],
        ],
        "15 cm.",
      ),
      reworded(CO, SCALE, "A 3.5 km road on a 1 : 50 000 map", { tag: "Practise" }),
      reworded(CO, SCALE, "A model ship is 1 : 200. The real ship is 90 m. The model?", {
        tag: "Practise",
        title: "A 1 : 200 model of a 90 m ship. Its length?",
      }),
      reworded(CO, SCALE, "1 : 10 000 map, 6 cm. Real distance in metres?", { tag: "Practise" }),
      reworded(CO, SCALE, "1 : 20 000 map. A 4 km route on the map, in cm?", {
        tag: "Practise",
        title: "A 4 km route on a 1 : 20 000 map, in cm?",
      }),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          ask("1 : 50 000; 2 cm. Real, in km?", "1", "100 000 cm.", "1 km.", {
            asks: "length",
            unit: "km",
          }),
          ask("1 : 50 000; 6 cm. Real, in km?", "3", "300 000 cm.", "3 km.", {
            asks: "length",
            unit: "km",
            changed: "Longer.",
          }),
          ask("1 : 25 000; 6 cm. Real, in km?", "1.5", "150 000 cm.", "1.5 km.", {
            asks: "length",
            unit: "km",
            changed: "A different scale.",
          }),
          ask("1 : 50 000; 4 km. On the map?", "8", "400 000 ÷ 50 000.", "8 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Backwards.",
          }),
        ],
        "Multiply to the real world; divide to the map.",
      ),

      questionSet(
        "Variation",
        "On the map, in cm. Watch what changes.",
        [
          ask("3 km at 1 : 50 000", "6", "300 000 ÷ 50 000.", "6 cm.", {
            asks: "length",
            unit: "cm",
            expect: [
              "For 3 km at 1 : 50 000, Ivy divides 3000 by 50 000. Right?",
              "No",
              "Change to cm first: 300 000 ÷ 50 000 = 6 cm.",
              [["Yes", "Are both in the same units?"]],
            ],
          }),
          ask("3 km at 1 : 25 000", "12", "300 000 ÷ 25 000.", "12 cm.", {
            asks: "length",
            unit: "cm",
            changed: "A bigger map.",
          }),
          ask("1.5 km at 1 : 50 000", "3", "150 000 ÷ 50 000.", "3 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Shorter.",
          }),
          ask("300 m at 1 : 10 000", "3", "30 000 ÷ 10 000.", "3 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Metres.",
          }),
        ],
        "Same units on both sides first.",
      ),
      own(CO, SCALE, "Spot the mistake"),

      own(CO, SCALE, "Exit check"),

      reworded(
        CO,
        SCALE,
        "“1 : 25 000, 8 cm on the map. Real length in km?”",
        { tag: "Real life", title: "1 : 25 000; 8 cm on the map. Real length in km?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Map to real: multiply by the scale. Real to map: divide.**"],
        RATIO,
        [
          "**Map to real: multiply by the scale. Real to map: divide.**",
          "The units match: 1 cm to 25 000 cm.",
          "Convert to km at the end.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Ruler and compass constructions.

const CONSTRUCT = "gf-constructions/constructions";
const constructMethod = [
  "Open the compass to more than half of AB.",
  "Equal arcs from A and from B, above and below.",
  "Join the crossings; leave the arcs showing.",
];

const constructions = stepped(find(CO, CONSTRUCT), {
  method: constructMethod,
  variation: {
    relationship: "constructions and what they make",
    unknowns: ["construction", "width"],
    surface: ["bisecting a line", "bisecting an angle", "compass widths"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Equal arcs",
        ["**Keep the compass width the same; leave every arc showing.**"],
        bisector,
        "Every point on the line is equally far from A and B.",
      ),
      reworded(CO, CONSTRUCT, "Why keep the compass width the same?", { tag: "The rule" }),

      ...owned(CO, CONSTRUCT, "Warm-up", "Check you remember"),

      methodCard("The method", constructMethod, bisector),
      workedFrom(CO, CONSTRUCT),
      calc(
        "Your turn",
        "AB is 8 cm. Construct its bisector.",
        undefined,
        [
          ["It cuts AB this far from A:", "4", "Halfway.", { after: "cm" }],
          ["The angle it meets AB at:", "90", "Perpendicular.", { after: "°" }],
        ],
        "Through the midpoint, at 90°.",
      ),

      calc(
        "Practise",
        "Bisect a 130° angle.",
        undefined,
        [["Each half:", "65", "130 ÷ 2.", { after: "°" }]],
        "Two angles of 65°.",
      ),
      ...owned(CO, CONSTRUCT, "Together", "Practise"),
      ...owned(CO, CONSTRUCT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which construction? Watch what changes.",
        [
          pick(
            "Equally far from A and B",
            "Perpendicular bisector",
            ["Angle bisector", "A circle"],
            "Halfway between two points.",
            { asks: "construction" },
          ),
          pick(
            "Splits an angle in half",
            "Angle bisector",
            ["Perpendicular bisector", "A circle"],
            "Two equal angles.",
            {
              asks: "construction",
              changed: "An angle.",
            },
          ),
          pick(
            "The shortest path from P to a line",
            "Perpendicular from P",
            ["Angle bisector", "A circle"],
            "At 90° to the line.",
            { asks: "construction", changed: "From a point." },
          ),
          pick(
            "All points 3 cm from P",
            "A circle",
            ["Perpendicular bisector", "Angle bisector"],
            "Compass at P.",
            {
              asks: "construction",
              changed: "A fixed distance.",
            },
          ),
        ],
        "Name it by what it keeps equal.",
      ),

      questionSet(
        "Variation",
        "Bisect AB. Which compass width works?",
        [
          pick("AB = 6 cm", "4 cm", ["2 cm", "3 cm"], "More than half.", {
            asks: "width",
            expect: [
              "For a 6 cm line, Mia opens the compass to 2 cm. Right?",
              "No",
              "Under half: the arcs never cross. Use more than 3 cm.",
              [["Yes", "Will the arcs meet?"]],
            ],
          }),
          pick("AB = 10 cm", "6 cm", ["4 cm", "5 cm"], "More than half.", {
            asks: "width",
            changed: "Longer.",
          }),
          pick("AB = 4 cm", "3 cm", ["1 cm", "2 cm"], "More than half.", {
            asks: "width",
            changed: "Shorter.",
          }),
          pick("AB = 9 cm", "5 cm", ["3 cm", "4.5 cm"], "More than half.", {
            asks: "width",
            changed: "An odd length.",
          }),
        ],
        "Exactly half only touches; more than half crosses.",
      ),
      own(CO, CONSTRUCT, "Spot the mistake"),

      own(CO, CONSTRUCT, "Exit check"),

      reworded(
        CO,
        CONSTRUCT,
        "“Construct the perpendicular bisector of AB. Show all construction lines.”",
        { tag: "Real life", title: "Construct the perpendicular bisector of AB. How?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Keep the compass width the same; leave every arc showing.**"],
        bisector,
        [
          "**Keep the compass width the same; leave every arc showing.**",
          "Open it to more than half of AB.",
          "The arcs earn the marks.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Loci.

const LOCI = "gf-constructions/loci";
const lociMethod = [
  "Read the rule: from a point, two points or two lines?",
  "Draw the circle or the bisector.",
  "Shade the region: inside, outside or one side.",
];

const loci = stepped(find(CO, LOCI), {
  method: lociMethod,
  variation: {
    relationship: "a rule and the points that obey it",
    unknowns: ["locus"],
    surface: ["points", "segments", "two lines", "regions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three loci",
        ["**A locus is every point that obeys a rule.**"],
        bisector,
        "Equally far from A and B: the perpendicular bisector.",
      ),

      ...owned(CO, LOCI, "Warm-up", "Check you remember"),

      methodCard("The method", lociMethod, bisector),
      workedFrom(CO, LOCI),
      calc(
        "Your turn",
        "A dog on a 5 m lead, tied to a post.",
        undefined,
        [
          ["The edge is a circle of radius:", "5", "The lead's length.", { after: "m" }],
          ["The region is this wide:", "10", "Twice the radius.", { after: "m" }],
        ],
        "Inside a circle of radius 5 m.",
      ),

      calc(
        "Practise",
        "The 5 m lead on a 1 cm to 2 m plan.",
        undefined,
        [["Radius on the plan:", "2.5", "5 ÷ 2.", { after: "cm" }]],
        "A 2.5 cm circle.",
      ),
      ...owned(CO, LOCI, "Together", "Practise"),
      ...owned(CO, LOCI, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The locus? Watch what changes.",
        [
          pick(
            "Exactly 3 cm from P",
            "A circle",
            ["Inside a circle", "A straight line"],
            "Just the edge.",
            {
              asks: "locus",
            },
          ),
          pick(
            "Less than 3 cm from P",
            "Inside the circle",
            ["Outside the circle", "The circle only"],
            "A region.",
            {
              asks: "locus",
              changed: "Less than.",
            },
          ),
          pick(
            "More than 3 cm from P",
            "Outside the circle",
            ["Inside the circle", "The circle only"],
            "A region.",
            {
              asks: "locus",
              changed: "More than.",
            },
          ),
          pick(
            "Equally far from P and Q",
            "The perpendicular bisector",
            ["A circle", "The angle bisector"],
            "Two points.",
            { asks: "locus", changed: "Two points." },
          ),
        ],
        "Exactly: a line. Less or more: a region.",
      ),

      questionSet(
        "Variation",
        "The locus? Watch what changes.",
        [
          pick(
            "3 cm from a line segment",
            "Two lines with semicircle ends",
            ["A rectangle", "A circle"],
            "Round each end.",
            {
              asks: "locus",
              expect: [
                "Zoe joins the ends with straight lines. Right?",
                "No",
                "Round each end: semicircles 3 cm from the end points.",
                [["Yes", "How far is a corner from the end?"]],
              ],
            },
          ),
          pick("3 cm from a point", "A circle", ["A rectangle", "Two lines"], "All round.", {
            asks: "locus",
            changed: "A point.",
          }),
          pick(
            "Within 3 cm of a segment",
            "Inside the rounded shape",
            ["Inside a rectangle", "Outside it"],
            "A region.",
            { asks: "locus", changed: "Within." },
          ),
          pick(
            "Equally far from two crossing lines",
            "The angle bisectors",
            ["The perpendicular bisector", "A circle"],
            "Halve the angles.",
            { asks: "locus", changed: "Two lines." },
          ),
        ],
        "Every point that obeys the rule, ends and corners too.",
      ),
      reworded(CO, LOCI, "Where did it go wrong?", {
        text: "Zoe draws the points 3 cm from a line segment.",
      }),

      own(CO, LOCI, "Exit check"),

      reworded(
        CO,
        LOCI,
        "“The goat is tied by a 2 m rope. Shade the region it can reach.”",
        { tag: "Real life", title: "A goat on a 2 m rope. Which region?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A locus is every point that obeys a rule.**"],
        bisector,
        [
          "**A locus is every point that obeys a rule.**",
          "From a point: a circle. From two points: the bisector.",
          "Less than: shade inside.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Measuring lines and angles.

const MEASURE = "gf-constructions/measure";
const measureMethod = [
  "Start the ruler at 0.",
  "Protractor: centre on the corner, 0° on one arm.",
  "Acute or obtuse? Read the matching scale.",
];
const RULER: Picture = { kind: "ruler", from: 0, to: 8 };

const measure = stepped(find(CO, MEASURE), {
  method: measureMethod,
  variation: {
    relationship: "a protractor's two scales",
    unknowns: ["converted", "angle"],
    surface: ["acute", "obtuse", "reflex", "mm and cm"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Start at zero",
        ["**Ruler: start at 0. Protractor: centre on the corner, 0° on one arm.**"],
        RULER,
        "Then pick the scale that fits: acute or obtuse.",
      ),

      ...owned(CO, MEASURE, "Warm-up", "Check you remember"),

      methodCard("The method", measureMethod, RULER),
      workedFrom(CO, MEASURE),
      calc(
        "Your turn",
        "A protractor reads 35 and 145. The angle is obtuse.",
        undefined,
        [["The angle:", "145", "Over 90°.", { after: "°" }]],
        "145°.",
      ),

      calc(
        "Practise",
        "A reflex angle: the other side is 115°.",
        undefined,
        [["$360 - 115 =$", "245", "Round a full turn.", { after: "°" }]],
        "245°.",
      ),
      ...owned(CO, MEASURE, "Together", "Practise"),
      ...owned(CO, MEASURE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Convert. Watch what changes.",
        [
          ask("47 mm in cm", "4.7", "÷ 10.", "4.7 cm.", { asks: "converted" }),
          ask("4.7 cm in mm", "47", "× 10.", "47 mm.", {
            asks: "converted",
            changed: "Backwards.",
          }),
          ask("0.5 cm in mm", "5", "× 10.", "5 mm.", { asks: "converted", changed: "Under 1 cm." }),
          ask("120 mm in cm", "12", "÷ 10.", "12 cm.", { asks: "converted", changed: "Longer." }),
        ],
        "10 mm in every cm.",
      ),

      questionSet(
        "Variation",
        "Which reading? Watch what changes.",
        [
          ask("Reads 60 and 120; obtuse", "120", "Over 90°.", "120°.", {
            asks: "angle",
            unit: "°",
            expect: [
              "For an obtuse angle, Ned reads 60°. Right?",
              "No",
              "Obtuse is over 90°: 120°.",
              [["Yes", "Is 60° obtuse?"]],
            ],
          }),
          ask("Reads 60 and 120; acute", "60", "Under 90°.", "60°.", {
            asks: "angle",
            unit: "°",
            changed: "Acute.",
          }),
          ask("Reads 15 and 165; acute", "15", "Under 90°.", "15°.", {
            asks: "angle",
            unit: "°",
            changed: "Sharper.",
          }),
          ask("Reads 15 and 165; obtuse", "165", "Over 90°.", "165°.", {
            asks: "angle",
            unit: "°",
            changed: "Obtuse.",
          }),
        ],
        "Estimate first, then pick the scale.",
      ),
      own(CO, MEASURE, "Spot the mistake"),

      own(CO, MEASURE, "Exit check"),

      reworded(
        CO,
        MEASURE,
        "“Measure the angle.” The protractor shows 50 and 130, and the angle is obtuse.",
        { tag: "Real life", title: "It shows 50 and 130; the angle is obtuse. Size?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Ruler: start at 0. Protractor: centre on the corner, 0° on one arm.**"],
        RULER,
        [
          "**Ruler: start at 0. Protractor: centre on the corner, 0° on one arm.**",
          "Acute or obtuse? Estimate first.",
          "Reflex: 360° take the other side.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Maps and scale drawings.

const MAPS = "gf-constructions/maps";
const mapsMethod = [
  "Change each plan length to a real length.",
  "Find the area from the real lengths.",
  "Real to plan: divide by the scale.",
];
const ROOM = plan(6, 4, "3 cm", "2 cm");

const maps = stepped(find(CO, MAPS), {
  method: mapsMethod,
  variation: {
    relationship: "plan areas and real areas",
    unknowns: ["real"],
    surface: ["bigger scales", "same size", "lengths and areas"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Lengths, then area",
        ["**Convert each length first; then work out the area.**"],
        ROOM,
        "1 cm to 2 m: 6 m by 4 m = 24 m².",
      ),
      reworded(CO, MAPS, "1 cm to 2 m. A 3.5 cm wall is", { tag: "The rule" }),

      ...owned(CO, MAPS, "Warm-up", "Check you remember"),

      methodCard("The method", mapsMethod, ROOM),
      workedFrom(CO, MAPS),
      calc(
        "Your turn",
        "A plan at 1 cm to 3 m.",
        plan(8, 3, "4 cm", "1.5 cm"),
        [
          ["Real length:", "12", "× 3.", { after: "m" }],
          ["Real width:", "4.5", "× 3.", { after: "m" }],
          ["Real area:", "54", "12 × 4.5.", { after: "m²" }],
        ],
        "54 m².",
      ),

      calc(
        "Practise",
        "Plan: 1 cm to 5 m. A 40 m path?",
        undefined,
        [["$40 \\div 5 =$", "8", "Real to plan.", { after: "cm" }]],
        "8 cm.",
      ),
      reworded(CO, MAPS, "A map: 1 cm to 5 km", { tag: "Practise" }),
      reworded(CO, MAPS, "A garden is 12 m long. On a 1 cm to 3 m plan, it's", {
        tag: "Practise",
        title: "A 12 m garden on a 1 cm to 3 m plan?",
      }),
      reworded(CO, MAPS, "1 cm to 4 m. A room 3 cm by 2.5 cm on the plan: real area?", {
        tag: "Practise",
        title: "Plan: 1 cm to 4 m. The room's real area?",
        picture: plan(6, 5, "3 cm", "2.5 cm"),
      }),
      reworded(CO, MAPS, "1 cm to 50 m. A path of 350 m on the map?", {
        tag: "Practise",
        title: "1 cm to 50 m. A 350 m path on the map?",
      }),
      questionSet(
        "Practise",
        "Plan: 1 cm to 2 m. Watch what changes.",
        [
          ask("A 4 cm wall: real length?", "8", "× 2.", "8 m.", { asks: "real", unit: "m" }),
          ask("A 4 cm by 3 cm room: real area?", "48", "8 × 6.", "48 m².", {
            asks: "real",
            unit: "m²",
            changed: "An area.",
          }),
          ask("A 1 cm square: real area?", "4", "2 × 2.", "4 m².", {
            asks: "real",
            unit: "m²",
            changed: "One square.",
          }),
          ask("A 10 m wall: on the plan?", "5", "÷ 2.", "5 cm.", {
            asks: "real",
            unit: "cm",
            changed: "Backwards.",
          }),
        ],
        "Lengths scale by 2; areas by 4.",
      ),

      questionSet(
        "Variation",
        "A plan area of 6 cm². Real area?",
        [
          ask("1 cm to 2 m", "24", "× 2².", "24 m².", {
            asks: "real",
            unit: "m²",
            expect: [
              "At 1 cm to 2 m, Ella doubles 6 cm² to 12 m². Right?",
              "No",
              "Each length doubles: area × 4 = 24 m².",
              [["Yes", "How many lengths make an area?"]],
            ],
          }),
          ask("1 cm to 3 m", "54", "× 3².", "54 m².", {
            asks: "real",
            unit: "m²",
            changed: "× 3.",
          }),
          ask("1 cm to 10 m", "600", "× 10².", "600 m².", {
            asks: "real",
            unit: "m²",
            changed: "× 10.",
          }),
          ask("1 cm to 1 m", "6", "× 1².", "6 m².", {
            asks: "real",
            unit: "m²",
            changed: "The same.",
          }),
        ],
        "Area scales by the scale squared.",
      ),
      reworded(CO, MAPS, "Where did it go wrong?", {
        text: "A 1 : 200 plan; 6 cm. Leo finds the real length.",
      }),

      own(CO, MAPS, "Exit check"),

      reworded(
        CO,
        MAPS,
        "“1 cm to 2 m; the kitchen is 2.5 cm by 2 cm. Work out the real area.”",
        { tag: "Real life", title: "1 cm to 2 m; kitchen 2.5 cm by 2 cm. Real area?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Convert each length first; then work out the area.**"],
        ROOM,
        [
          "**Convert each length first; then work out the area.**",
          "5 cm² at 1 cm to 2 m is 20 m², not 10.",
          "1 : 200 gives cm: 6 cm is 12 m.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Bearings.

const BEARINGS = "gf-constructions/bearings";
const bearMethod = [
  "Start at north.",
  "Turn clockwise to the direction.",
  "Three figures. Back bearing: ± 180°.",
];
const SE = bearing(130, "130°");
const compass = (deg: number, right: string, others: string[], extra: Record<string, unknown>) =>
  pick("Which bearing is this?", right, others, "Clockwise from north.", {
    asks: "bearing",
    picture: bearing(deg, "?"),
    ...extra,
  });

const bearings = stepped(find(CO, BEARINGS), {
  method: bearMethod,
  variation: {
    relationship: "a direction as a bearing",
    unknowns: ["bearing"],
    surface: ["each quarter", "back bearings", "compass points"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three rules",
        ["**A bearing goes from north, clockwise, in three figures.**"],
        SE,
        "Due east is 090°; west is 270°.",
      ),
      reworded(CO, BEARINGS, "Due south as a bearing", { tag: "The rule" }),

      ...owned(CO, BEARINGS, "Warm-up", "Check you remember"),

      methodCard("The method", bearMethod, SE),
      workedFrom(CO, BEARINGS),
      calc(
        "Your turn",
        "B is on this bearing from A. A from B?",
        bearing(70, "070°"),
        [["$70 + 180 =$", "250", "Turn round: add 180°.", { after: "°" }]],
        "250°.",
      ),

      calc(
        "Practise",
        "A bearing of 310°. The back bearing?",
        undefined,
        [["$310 - 180 =$", "130", "Over 180: subtract.", { after: "°" }]],
        "130°.",
      ),
      ...owned(CO, BEARINGS, "Together", "Practise"),
      ...owned(CO, BEARINGS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which bearing? Watch what changes.",
        [
          compass(45, "045°", ["45°", "315°"], {}),
          compass(135, "135°", ["045°", "225°"], { changed: "South-east." }),
          compass(225, "225°", ["135°", "315°"], { changed: "South-west." }),
          compass(315, "315°", ["045°", "225°"], { changed: "North-west." }),
        ],
        "Each quarter turn adds 90°.",
      ),

      questionSet(
        "Variation",
        "As a bearing. Watch what changes.",
        [
          pick("Due west", "270°", ["090°", "180°"], "Three quarters round.", {
            asks: "bearing",
            expect: [
              "Jo turns anticlockwise and says due west is 090°. Right?",
              "No",
              "Clockwise from north, west is three quarters round: 270°.",
              [["Yes", "Which way do bearings turn?"]],
            ],
          }),
          pick("Due east", "090°", ["270°", "90°"], "A quarter round.", {
            asks: "bearing",
            changed: "East.",
          }),
          pick("South-west", "225°", ["135°", "315°"], "Between south and west.", {
            asks: "bearing",
            changed: "South-west.",
          }),
          pick("North-west", "315°", ["045°", "225°"], "Between west and north.", {
            asks: "bearing",
            changed: "North-west.",
          }),
        ],
        "Always clockwise; always three figures.",
      ),
      own(CO, BEARINGS, "Spot the mistake"),

      own(CO, BEARINGS, "Exit check"),

      reworded(
        CO,
        BEARINGS,
        "“A ship sails 060° from A. Find the bearing of A from the ship.”",
        { tag: "Real life", title: "A ship sails 060° from A. A from the ship?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A bearing goes from north, clockwise, in three figures.**"],
        SE,
        [
          "**A bearing goes from north, clockwise, in three figures.**",
          "060°, not 60°.",
          "Back bearing: add or take 180°.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfConstructionsStepped: [string, UnitLesson[]][] = [
  [SCALE, [scale]],
  [CONSTRUCT, [constructions]],
  [LOCI, [loci]],
  [MEASURE, [measure]],
  [MAPS, [maps]],
  [BEARINGS, [bearings]],
];
