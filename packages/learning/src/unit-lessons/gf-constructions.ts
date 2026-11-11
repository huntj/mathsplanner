// GCSE Foundation, "Scale drawings, constructions and bearings", as six short lessons, one just
// before each skill: scale factors and maps, ruler and compass constructions, loci, measuring
// lines and angles, reading maps and scale drawings, and bearings. Each recaps the Key Stage 3
// idea quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style
// check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const U = "gf-constructions";
const P = (x: number, y: number): Point => ({ x, y });
type Item = DrawingPic["items"][number];
const seg = (a: Point, b: Point, tone?: "find" | "soft"): Item => ({
  line: [a, b],
  ...(tone ? { tone } : {}),
});
const circle = (c: Point, r: number, dashed = false): Item[] => [
  { arc: c, r, from: 0, to: 180, ...(dashed ? { dashed: true as const } : {}) },
  { arc: c, r, from: 180, to: 360, ...(dashed ? { dashed: true as const } : {}) },
];

/** A bearing from a point A: a north line, the direction, and the angle clockwise from north. */
function bearing(deg: number, label: string): DrawingPic {
  const A = P(0, 0);
  const dir = 90 - deg;
  const end = P(4 * Math.cos((dir * Math.PI) / 180), 4 * Math.sin((dir * Math.PI) / 180));
  const north: Item = { line: [A, P(0, 4)], arrow: 1 };
  const arc: Item =
    deg <= 180
      ? { angle: A, from: dir, to: 90, label }
      : { angle: A, from: 90, to: dir + 360, label };
  return {
    kind: "drawing",
    frame: { xMin: -4.5, xMax: 4.5, yMin: -4.5, yMax: 4.8 },
    items: [
      north,
      { text: "N", at: P(0, 4.5) },
      { dot: A },
      { text: "A", at: P(-0.4, -0.4) },
      seg(A, end, "find"),
      arc,
    ],
  };
}

// The perpendicular bisector of AB: arcs from each end crossing above and below.
const A = P(0, 0);
const B = P(6, 0);
const bisector: DrawingPic = {
  kind: "drawing",
  frame: { xMin: -0.6, xMax: 6.6, yMin: -3.3, yMax: 3.3 },
  items: [
    seg(A, B),
    { text: "A", at: P(-0.4, 0) },
    { text: "B", at: P(6.4, 0) },
    { arc: A, r: 4, from: 25, to: 60 },
    { arc: A, r: 4, from: -60, to: -25 },
    { arc: B, r: 4, from: 120, to: 155 },
    { arc: B, r: 4, from: 205, to: 240 },
    seg(P(3, 3.2), P(3, -3.2), "find"),
  ],
};
const goatField: DrawingPic = {
  kind: "drawing",
  frame: { xMin: -0.5, xMax: 8.5, yMin: -0.5, yMax: 6.5 },
  items: [
    seg(P(0, 0), P(8, 0)),
    seg(P(8, 0), P(8, 6)),
    seg(P(8, 6), P(0, 6)),
    seg(P(0, 6), P(0, 0)),
    { dot: P(4, 3) },
    { text: "post", at: P(4, 2.4) },
    ...circle(P(4, 3), 2, true),
  ],
};

export const gfConstructions: UnitLesson[] = [
  lesson(
    U,
    "scale",
    "GF-R2",
    "Scale factors and maps",
    "Multiply by the scale for real lengths; divide for the map.",
    [
      problem("The walk", [
        "A map's scale is 1 : 25 000. A path is 8 cm on the map. “Work out the real length in kilometres.”",
        "By the end of this lesson, you can convert between maps and real life.",
      ]),
      typed(
        "Warm-up",
        "$8 \\times 25\\,000$",
        "200000",
        "$8 \\times 25 = 200$, then three zeros.",
        "200 000.",
      ),
      typed("Warm-up", "200 000 cm in metres", "2000", "÷ 100.", "2000 m."),
      explain(
        "Discover",
        "1 : 25 000",
        [
          "A scale of 1 : 25 000 means 1 cm on the map is 25 000 cm in real life. The units are the same on both sides.",
          "Map to real: multiply. Real to map: divide. Then convert to sensible units.",
        ],
        {
          kind: "maths",
          tex: "8 \\text{ cm} \\times 25\\,000 = 200\\,000 \\text{ cm} = 2 \\text{ km}",
        },
      ),
      choose("Discover", "1 : 100 000. 1 cm on the map is", "1 km for real", "100 000 cm = 1 km.", [
        ["100 m", "100 000 cm = 1000 m."],
        ["10 km", "100 000 cm = 1 km."],
      ]),
      worked(
        "The walk",
        "8 cm at 1 : 25 000. Real length in km?",
        [
          ["$8 \\times 25\\,000 = 200\\,000$ cm", "Map to real: multiply."],
          ["$= 2000$ m $= 2$ km", "Convert."],
        ],
        "2 km.",
      ),
      steps(
        "Together",
        "A 3.5 km road on a 1 : 50 000 map",
        "Length on the map.",
        [
          ["3.5 km in cm:", "350 000 cm", ["3500 cm", "1 km = 100 000 cm."], "350 000 cm"],
          ["On the map:", "7 cm", ["70 cm", "$350\\,000 \\div 50\\,000$."], "7 cm"],
        ],
        "Real to map: divide.",
      ),
      choose(
        "Together",
        "A model ship is 1 : 200. The real ship is 90 m. The model?",
        "45 cm",
        "$9000 \\div 200$ cm.",
        [
          ["4.5 cm", "90 m = 9000 cm."],
          ["18 000 cm", "Real to model: divide."],
        ],
      ),
      typed(
        "Your turn",
        "1 : 10 000 map, 6 cm. Real distance in metres?",
        "600",
        "$60\\,000$ cm.",
        "600 m.",
        { unit: "m", wrong: [["60000", "That's in cm."]] },
      ),
      typed(
        "Your turn",
        "1 : 20 000 map. A 4 km route on the map, in cm?",
        "20",
        "400 000 cm ÷ 20 000.",
        "20 cm.",
        { unit: "cm" },
      ),
      choose(
        "Watch out",
        "1 : 25 000 and 8 cm: Jo writes 200 000 km. What's wrong?",
        "The units are cm: 200 000 cm = 2 km",
        "Scale units match the map's.",
        [["Nothing", "Convert 200 000 cm."]],
      ),
      mistake(
        "Ali converts 3 km to a 1 : 50 000 map.",
        ["3 km = 3000 m", "$3000 \\div 50\\,000 = 0.06$", "0.06 cm on the map"],
        1,
        "Use cm: 300 000 cm ÷ 50 000 = 6 cm.",
      ),
      choose(
        "Back to the problem",
        "“1 : 25 000, 8 cm on the map. Real length in km?”",
        "2 km",
        "200 000 cm.",
        [
          ["20 km", "Check: 200 000 cm = 2 km."],
          ["0.2 km", "200 000 cm = 2000 m."],
        ],
      ),
      quiz([
        [
          ["1 : 50 000, 4 cm. Real", "2 km", ["20 km", "200 m"], "200 000 cm."],
          ["1 : 25 000, 12 cm. Real", "3 km", ["30 km", "300 m"], "300 000 cm."],
        ],
        [
          ["1 : 100 000. 5 km on the map", "5 cm", ["50 cm", "0.5 cm"], "500 000 cm ÷ 100 000."],
          ["1 : 10 000. 800 m on the map", "8 cm", ["80 cm", "0.8 cm"], "80 000 cm ÷ 10 000."],
        ],
        [
          ["Map to real:", "multiply", ["divide", "add"], "Bigger."],
          ["Real to map:", "divide", ["multiply", "subtract"], "Smaller."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "constructions",
    "GF-G2.a",
    "Ruler and compass constructions",
    "Perpendicular bisectors, angle bisectors and perpendiculars, with arcs showing.",
    [
      problem(
        "Construct it",
        [
          "“Using ruler and compasses only, construct the perpendicular bisector of AB. You must show all your construction lines.”",
          "By the end of this lesson, you'll know the method, and why the arcs matter.",
        ],
        {
          kind: "drawing",
          frame: { xMin: -0.6, xMax: 6.6, yMin: -3.3, yMax: 3.3 },
          items: [seg(A, B), { text: "A", at: P(-0.4, 0) }, { text: "B", at: P(6.4, 0) }],
        },
      ),
      choose(
        "Warm-up",
        "A perpendicular bisector cuts a line",
        "in half, at right angles",
        "Bisect: halve. Perpendicular: 90°.",
        [["at 45°", "Perpendicular means 90°."]],
      ),
      choose(
        "Warm-up",
        "Every point on a compass arc is",
        "the same distance from the compass point",
        "That distance is the radius.",
        [["on a straight line", "Arcs are curved."]],
      ),
      explain(
        "Discover",
        "Equal arcs",
        [
          "Open the compass to more than half of AB. Draw arcs above and below from A, then, **without changing the width**, from B.",
          "Join the two crossing points. Every point on that line is the same distance from A as from B. Leave the arcs showing: they're your working.",
        ],
        bisector,
      ),
      choose(
        "Discover",
        "Why keep the compass width the same?",
        "So the crossings are equally far from A and B",
        "That's what makes it the bisector.",
        [["It's neater", "Different widths give a slanted line."]],
      ),
      worked(
        "Perpendicular bisector",
        "Construct the perpendicular bisector of AB.",
        [
          ["Compass at A, more than half of AB: arcs above and below", "Step 1."],
          ["Same width from B: arcs crossing the first two", "Step 2."],
          ["Join the crossings with a ruler", "Step 3: leave the arcs."],
        ],
        "It cuts AB in half at 90°.",
        bisector,
      ),
      steps(
        "Together",
        "Bisect an angle at Q",
        "Angle bisector.",
        [
          [
            "Compass at Q:",
            "an arc crossing both arms",
            ["a whole circle", "Just an arc."],
            "Two points on the arms",
          ],
          [
            "From each, same width:",
            "arcs crossing inside the angle; join Q to the crossing",
            ["join the two arm points", "Join Q to the crossing."],
            "The bisector",
          ],
        ],
        "It splits the angle in half.",
      ),
      choose(
        "Together",
        "To draw a perpendicular from a point P to a line, first",
        "draw an arc from P crossing the line twice",
        "Then bisect those two points.",
        [["measure 90° with a protractor", "Ruler and compasses only."]],
      ),
      {
        kind: "order",
        tag: "Your turn",
        title: "Perpendicular bisector: put the steps in order",
        items: [
          "Compass at A, more than half of AB",
          "Arcs above and below AB",
          "Same width from B, crossing the arcs",
          "Join the two crossings",
        ],
        first: "first",
        last: "last",
        hint: "Start at A, then B, then join.",
        done: "That's the perpendicular bisector.",
      },
      choose("Your turn", "Bisecting a 70° angle gives two angles of", "35°", "Half.", [
        ["70°", "Bisect halves it."],
        ["140°", "Halve, don't double."],
      ]),
      choose(
        "Watch out",
        "Ben rubs out his arcs to keep it tidy. Problem?",
        "Yes: the arcs show the construction and earn marks",
        "Always leave construction lines.",
        [["No", "Without arcs, it looks like a guess."]],
      ),
      mistake(
        "Mia constructs the perpendicular bisector of a 6 cm line.",
        ["Compass opened to 2 cm", "Arcs from A and B", "Join the crossings"],
        0,
        "2 cm is less than half of 6 cm: the arcs won't meet. Open it more than 3 cm.",
      ),
      choose(
        "Back to the problem",
        "“Construct the perpendicular bisector of AB. Show all construction lines.”",
        "Equal arcs from A and B, then join the crossings",
        "Keep the arcs.",
        [
          ["Measure the middle and draw a line at 90°", "Ruler and compasses only."],
          ["Draw a circle round A", "You need arcs from both ends."],
        ],
      ),
      quiz([
        [
          [
            "A perpendicular bisector is",
            "at 90° through the midpoint",
            ["parallel to the line", "at 45°"],
            "Halve at 90°.",
          ],
          ["An angle bisector", "halves an angle", ["doubles it", "makes 90°"], "Halves."],
        ],
        [
          [
            "Compass width for bisecting AB:",
            "more than half of AB",
            ["less than half of AB", "exactly AB"],
            "So arcs meet.",
          ],
          [
            "During the construction, the width",
            "stays the same",
            ["halves", "doubles"],
            "Equal arcs.",
          ],
        ],
        [
          [
            "Construction lines should be",
            "left showing",
            ["rubbed out", "in pen"],
            "They're working.",
          ],
          ["Constructions use", "ruler and compasses", ["a protractor", "guesswork"], "Exact."],
        ],
      ]),
    ],
  ),

  lesson(U, "loci", "GF-G2.b", "Loci", "A locus is every point that follows a rule.", [
    problem(
      "The goat",
      [
        "A goat is tied to a post by a 2 m rope in a field. “Shade the region the goat can reach.” And “A lamp must be the same distance from two walls.”",
        "By the end of this lesson, you can draw loci and shade regions.",
      ],
      goatField,
    ),
    choose("Warm-up", "Points exactly 2 cm from a point make", "a circle", "Radius 2 cm.", [
      ["a square", "Equal distance in every direction."],
    ]),
    choose(
      "Warm-up",
      "Points equally far from A and B lie on",
      "the perpendicular bisector of AB",
      "Equal arcs.",
      [["the line AB", "Most points on AB aren't equidistant."]],
    ),
    explain(
      "Discover",
      "Three loci",
      [
        "A **locus** is all the points that obey a rule. Fixed distance from a point: a **circle**. Equal distance from two points: the **perpendicular bisector**.",
        "Equal distance from two lines that meet: the **angle bisector**. “Within” or “less than” means shade the region inside.",
      ],
      goatField,
    ),
    choose(
      "Discover",
      "The goat can reach anywhere within 2 m of the post. Shade",
      "inside the circle of radius 2 m",
      "Up to 2 m away.",
      [
        ["outside the circle", "Within means inside."],
        ["only the circle", "It can reach inside too."],
      ],
    ),
    worked(
      "The goat",
      "Show the region the goat can reach.",
      [
        ["Compass at the post, radius 2 m (to scale)", "Fixed distance."],
        ["Shade inside the circle", "Within 2 m."],
      ],
      "Use the map's scale for the radius.",
      goatField,
    ),
    steps(
      "Together",
      "A lamp equally far from two walls meeting at a corner",
      "Which locus?",
      [
        [
          "Equal distance from two lines:",
          "the angle bisector",
          ["a circle", "Lines, not a point."],
          "Bisect the corner",
        ],
        [
          "With “and within 3 m of the corner”, the lamp is",
          "on the bisector, inside a 3 m arc",
          ["anywhere in the room", "Both rules."],
          "Where they overlap",
        ],
      ],
      "Two rules: the answer is where both hold.",
    ),
    choose(
      "Together",
      "Closer to A than to B means",
      "the side of the perpendicular bisector nearest A",
      "Shade that side.",
      [["on the bisector", "That's equally close."]],
    ),
    choose(
      "Your turn",
      "Points more than 3 cm from P",
      "outside a circle of radius 3 cm",
      "More than: outside.",
      [["inside the circle", "That's less than 3 cm."]],
    ),
    choose(
      "Your turn",
      "A path equally far from two trees",
      "the perpendicular bisector between them",
      "Equidistant from two points.",
      [["a circle round one tree", "Two points: bisector."]],
    ),
    choose(
      "Watch out",
      "For “less than 4 m from the post”, Ed draws only the circle. What's missing?",
      "Shade inside: the whole region, not just the edge",
      "“Less than” means a region.",
      [["Nothing", "Points inside are less than 4 m away too."]],
    ),
    mistake(
      "Zoe draws the locus of points 3 cm from a straight line segment.",
      ["Lines 3 cm above and below it", "Joined at the ends with straight lines", "A rectangle"],
      1,
      "The ends are rounded: semicircles of radius 3 cm.",
    ),
    choose(
      "Back to the problem",
      "“The goat is tied by a 2 m rope. Shade the region it can reach.”",
      "Shade inside a circle of radius 2 m round the post",
      "Within 2 m.",
      [
        ["Shade outside the circle", "It can't reach beyond 2 m."],
        ["Draw a 2 m square", "Distance in every direction: a circle."],
      ],
    ),
    quiz([
      [
        ["Fixed distance from a point", "circle", ["line", "square"], "Same radius."],
        [
          "Equal distance from two points",
          "perpendicular bisector",
          ["circle", "angle bisector"],
          "Equidistant.",
        ],
      ],
      [
        [
          "Equal distance from two lines",
          "angle bisector",
          ["circle", "perpendicular bisector"],
          "Bisect the angle.",
        ],
        ["Within 5 m of a point", "inside a circle", ["outside a circle", "on a line"], "Region."],
      ],
      [
        ["More than 2 cm from P", "outside the circle", ["inside", "on it"], "Beyond."],
        [
          "Closer to A than B",
          "A's side of the bisector",
          ["on the bisector", "B's side"],
          "Nearer A.",
        ],
      ],
    ]),
  ]),

  lesson(
    U,
    "measure",
    "GF-G15.a",
    "Measuring lines and angles",
    "Measure accurately with a ruler and a protractor.",
    [
      problem(
        "Accurate drawing",
        [
          "“Measure the length of the line, and the size of the angle.” Exams allow ±1 mm and ±2°. Read the scale wrong, and the mark is lost.",
          "By the end of this lesson, you can measure accurately.",
        ],
        { kind: "ruler", from: 0, to: 7.4 },
      ),
      choose("Warm-up", "An acute angle is", "less than 90°", "Smaller than a right angle.", [
        ["between 90° and 180°", "That's obtuse."],
      ]),
      typed("Warm-up", "How many mm in 7.4 cm?", "74", "× 10.", "74 mm."),
      explain(
        "Discover",
        "Start at zero",
        [
          "Put the ruler's **0** at one end of the line, not the edge of the ruler. Read the other end in cm and mm.",
          "For angles, put the protractor's centre on the vertex, line up 0° with one arm, and read the scale that starts at 0 on that arm.",
        ],
        { kind: "ruler", from: 0, to: 7.4 },
      ),
      choose("Discover", "The line on the ruler is", "7.4 cm", "7 cm and 4 mm.", [
        ["74 cm", "74 mm."],
        ["7.04 cm", "4 mm is 0.4 cm."],
      ]),
      {
        kind: "dial",
        tag: "Discover",
        title: "Make an angle of 65°",
        text: "Turn the arm until the angle is 65°.",
        target: 65,
        within: 2,
        protractor: true,
        hint: "Use the scale that starts at 0 on the fixed arm.",
        done: "65°: acute.",
      },
      worked(
        "Which scale?",
        "A protractor shows 50 and 130 at the arm. The angle is acute. Which?",
        [
          ["Acute means less than 90°", "Estimate first."],
          ["So 50°", "The scale from 0 on the starting arm."],
        ],
        "Estimate first to pick the right scale.",
      ),
      steps(
        "Together",
        "A reflex angle",
        "Measure 250°.",
        [
          ["The other side is", "110°", ["250°", "360 − 250."], "Measure the smaller angle"],
          [
            "So the reflex angle is",
            "$360 - 110 = 250°$",
            ["110°", "Reflex is more than 180°."],
            "250°",
          ],
        ],
        "Protractors go to 180°: measure the other side.",
      ),
      {
        kind: "dial",
        tag: "Together",
        title: "Make an angle of 140°",
        target: 140,
        within: 2,
        protractor: true,
        hint: "It's obtuse: more than 90°.",
        done: "140°: obtuse.",
      },
      {
        kind: "dial",
        tag: "Your turn",
        title: "Estimate an angle of 25°",
        target: 25,
        within: 8,
        protractor: false,
        hint: "A bit more than a quarter of a right angle.",
        done: "About 25°.",
      },
      choose("Your turn", "A line is 12.3 cm. In mm?", "123 mm", "× 10.", [
        ["12.3 mm", "× 10."],
        ["1230 mm", "× 10, not 100."],
      ]),
      choose(
        "Watch out",
        "Kai measures from the end of the ruler, not 0, and gets 7.9 cm for a 7.4 cm line. What's wrong?",
        "Start at 0, not the ruler's edge",
        "Rulers have a gap before 0.",
        [["Nothing", "Line up the 0 mark."]],
      ),
      mistake(
        "Ivy measures an obtuse angle.",
        ["Centre on the vertex", "0° on one arm", "Reads 60° from the inner scale"],
        2,
        "It's obtuse, so it's 120°: use the scale starting at 0 on that arm.",
      ),
      choose(
        "Back to the problem",
        "“Measure the angle.” The protractor shows 50 and 130, and the angle is obtuse.",
        "130°",
        "Obtuse: more than 90°.",
        [
          ["50°", "Obtuse means over 90°."],
          ["180°", "Read the scale."],
        ],
      ),
      quiz([
        [
          ["An angle between 90° and 180° is", "obtuse", ["acute", "reflex"], "Obtuse."],
          ["An angle over 180° is", "reflex", ["obtuse", "acute"], "Reflex."],
        ],
        [
          ["A line of 56 mm in cm", "5.6", ["56", "0.56"], "÷ 10."],
          ["8.2 cm in mm", "82", ["8.2", "820"], "× 10."],
        ],
        [
          ["Reflex angle, the other side is 70°", "290°", ["70°", "110°"], "360 − 70."],
          ["Reflex angle, the other side is 155°", "205°", ["155°", "25°"], "360 − 155."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "maps",
    "GF-G15.b",
    "Maps and scale drawings",
    "Measure on the drawing, then use the scale.",
    [
      problem("The house plan", [
        "A plan of a house uses 1 cm to 2 m. The kitchen is 2.5 cm by 2 cm on the plan. “Work out the real area of the kitchen floor.”",
        "By the end of this lesson, you can read scale drawings, including areas.",
      ]),
      typed("Warm-up", "2.5 cm on the plan is how many metres?", "5", "× 2.", "5 m."),
      typed("Warm-up", "Area of a 5 m by 4 m room", "20", "× .", "20 m²."),
      explain(
        "Discover",
        "Lengths, then area",
        [
          "A scale like 1 cm to 2 m converts **lengths**. Convert each length first, then work out area from the real lengths.",
          "Don't scale the area by 2: area scales by $2^2$.",
        ],
        {
          kind: "table",
          head: ["Plan", "Real"],
          rows: [
            ["2.5 cm", "5 m"],
            ["2 cm", "4 m"],
          ],
        },
      ),
      choose("Discover", "1 cm to 2 m. A 3.5 cm wall is", "7 m", "× 2.", [
        ["1.75 m", "Multiply."],
        ["35 m", "× 2, not × 10."],
      ]),
      worked(
        "The kitchen",
        "2.5 cm by 2 cm at 1 cm to 2 m. Real area?",
        [
          ["Real: 5 m by 4 m", "Convert lengths."],
          ["Area: 20 m²", "Multiply."],
        ],
        "Convert the lengths first, then find the area.",
      ),
      steps(
        "Together",
        "A map: 1 cm to 5 km",
        "Two towns 4.2 cm apart.",
        [
          ["Real distance:", "21 km", ["0.84 km", "× 5."], "21 km"],
          [
            "At 60 km/h, the drive takes",
            "21 minutes",
            ["21 hours", "21 km at 1 km per minute."],
            "21 min",
          ],
        ],
        "Scale, then use the real distance.",
      ),
      choose("Together", "A garden is 12 m long. On a 1 cm to 3 m plan, it's", "4 cm", "÷ 3.", [
        ["36 cm", "Real to plan: divide."],
        ["0.25 cm", "$12 \\div 3$."],
      ]),
      typed(
        "Your turn",
        "1 cm to 4 m. A room 3 cm by 2.5 cm on the plan: real area?",
        "120",
        "12 m by 10 m.",
        "120 m².",
        { unit: "m²", wrong: [["30", "Convert both lengths first."]] },
      ),
      typed("Your turn", "1 cm to 50 m. A path of 350 m on the map?", "7", "÷ 50.", "7 cm.", {
        unit: "cm",
      }),
      choose(
        "Watch out",
        "Plan area 5 cm² at 1 cm to 2 m. Jo says the real area is 10 m². What's wrong?",
        "Convert lengths first: area scales by 4, so 20 m²",
        "Each cm² is 2 m by 2 m = 4 m².",
        [["Nothing", "Area uses two lengths."]],
      ),
      mistake(
        "Leo finds a real length on a 1 : 200 plan; 6 cm on the plan.",
        ["$6 \\times 200 = 1200$", "So 1200 m", "The room is 1.2 km long"],
        1,
        "Units stay as cm: 1200 cm = 12 m.",
      ),
      typed(
        "Back to the problem",
        "“1 cm to 2 m; the kitchen is 2.5 cm by 2 cm. Work out the real area.”",
        "20",
        "5 m by 4 m.",
        "20 m².",
        { unit: "m²", wrong: [["10", "Convert both lengths, then multiply."]] },
      ),
      quiz([
        [
          ["1 cm to 10 m: 3.4 cm is", "34 m", ["3.4 m", "340 m"], "× 10."],
          ["1 cm to 5 km: 6.6 cm is", "33 km", ["1.32 km", "330 km"], "× 5."],
        ],
        [
          ["1 cm to 2 m: 1 cm² is", "4 m²", ["2 m²", "1 m²"], "2 m × 2 m."],
          ["1 cm to 3 m: 1 cm² is", "9 m²", ["3 m²", "6 m²"], "3 m × 3 m."],
        ],
        [
          ["1 cm to 20 m: 100 m on the map", "5 cm", ["2000 cm", "0.2 cm"], "÷ 20."],
          ["1 cm to 8 km: 40 km on the map", "5 cm", ["320 cm", "0.2 cm"], "÷ 8."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "bearings",
    "GF-G15.c",
    "Bearings",
    "Measured clockwise from north, with three figures.",
    [
      problem(
        "The lighthouse",
        [
          "A ship sails from A on a bearing of 060°. “Find the bearing of A from the ship.” Navigators use bearings every day.",
          "By the end of this lesson, you can measure, draw and reverse bearings.",
        ],
        bearing(60, "60°"),
      ),
      choose("Warm-up", "Clockwise from north, east is", "90°", "A quarter turn.", [
        ["270°", "That's west."],
      ]),
      typed("Warm-up", "Work out $60 + 180$", "240", "Add.", "240."),
      explain(
        "Discover",
        "Three rules",
        [
          "A **bearing** is measured from **north**, **clockwise**, and written with **three figures**: 060°, not 60°.",
          "Due east is 090°, south 180°, west 270°.",
        ],
        bearing(60, "060°"),
      ),
      choose("Discover", "Due south as a bearing", "180°", "Half a turn from north.", [
        ["090°", "That's east."],
        ["270°", "That's west."],
      ]),
      worked(
        "Back the other way",
        "The ship sailed 060° from A. Bearing of A from the ship?",
        [
          ["The back bearing is 180° different", "Opposite direction."],
          ["$60 + 180 = 240°$", "Less than 180, so add."],
        ],
        "Bearing of A from the ship: 240°.",
      ),
      steps(
        "Together",
        "B is on a bearing of 300° from C",
        "Bearing of C from B.",
        [
          [
            "300° is more than 180°, so",
            "subtract 180°",
            ["add 180°", "That would pass 360°."],
            "$300 - 180$",
          ],
          ["Back bearing:", "120°", ["480°", "Subtract."], "120°"],
        ],
        "Add 180 if under 180°; subtract if over.",
      ),
      choose(
        "Together",
        "Which shows a bearing of 135°?",
        "South-east",
        "Between east (090°) and south (180°).",
        [
          ["North-east", "That's 045°."],
          ["South-west", "That's 225°."],
        ],
        { picture: bearing(135, "?") },
      ),
      typed(
        "Your turn",
        "Bearing of X from Y is 075°. Bearing of Y from X?",
        "255",
        "+ 180.",
        "255°.",
        { unit: "°" },
      ),
      typed(
        "Your turn",
        "Bearing of P from Q is 210°. Bearing of Q from P?",
        "030",
        "− 180 = 30: write three figures.",
        "030°.",
        { unit: "°", wrong: [["390", "Subtract when over 180."]] },
      ),
      choose(
        "Watch out",
        "Ana measures a bearing anticlockwise from north. What's wrong?",
        "Bearings go clockwise",
        "Clockwise from north, always.",
        [["Nothing", "Anticlockwise gives 360° minus the answer."]],
      ),
      mistake(
        "Sam writes the bearing of due west.",
        ["West is a quarter turn from north", "Going anticlockwise", "So the bearing is 090°"],
        1,
        "Clockwise from north, west is three quarters: 270°.",
      ),
      choose(
        "Back to the problem",
        "“A ship sails 060° from A. Find the bearing of A from the ship.”",
        "240°",
        "60 + 180.",
        [
          ["120°", "Back bearings differ by 180°."],
          ["300°", "That's 360 − 60."],
        ],
      ),
      quiz([
        [
          ["Due east", "090°", ["90", "270°"], "Three figures."],
          ["Due west", "270°", ["090°", "180°"], "Three quarters."],
        ],
        [
          ["Back bearing of 050°", "230°", ["310°", "130°"], "+180."],
          ["Back bearing of 160°", "340°", ["020°", "200°"], "+180."],
        ],
        [
          ["Back bearing of 250°", "070°", ["430°", "110°"], "−180."],
          ["Back bearing of 315°", "135°", ["495°", "045°"], "−180."],
        ],
      ]),
    ],
  ),
];
