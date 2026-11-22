// GCSE Foundation, "2D and 3D shapes", on the stepped template (docs/proposals/lesson-stepped.md):
// the notation of geometry, quadrilaterals, triangles, solids, plans and elevations. Shapes and
// solids are asked on their drawings; descriptions without one are worded.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { lSolid, gfShapes } from "./gf-shapes.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, ShapePic, UnitLesson } from "./types.ts";
import { SQUARE_PYRAMID } from "./y8-shapes.ts";
import { triangle } from "./y7-angles.ts";

const S = gfShapes;
const WORDS = "Geometry's words: the description is the picture.";
const p = (x: number, y: number): Point => ({ x, y });
const pts = (list: [number, number][]): Point[] => list.map(([x, y]) => p(x, y));
const shape = (list: [number, number][], extra: Partial<ShapePic> = {}): ShapePic => ({
  kind: "shape",
  points: pts(list),
  ...extra,
});
/** A quadrilateral with its two diagonals dashed. */
const diagonals = (list: [number, number][], extra: Partial<ShapePic> = {}): ShapePic => {
  const [a, b, c, d] = pts(list);
  return shape(list, {
    ...extra,
    ...(a && b && c && d
      ? {
          dashed: [
            [a, c],
            [b, d],
          ],
        }
      : {}),
  });
};
const named = (t: ShapePic, names: string[]): ShapePic => ({ ...t, names });
const box = (w: number, d: number, h: number, cubes = false): Picture => ({
  kind: "cuboid",
  w,
  d,
  h,
  ...(cubes ? { cubes: true } : {}),
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

const SQUARE: [number, number][] = [
  [0, 0],
  [4, 0],
  [4, 4],
  [0, 4],
];
const OBLONG: [number, number][] = [
  [0, 0],
  [6, 0],
  [6, 3],
  [0, 3],
];
const RHOMBUS: [number, number][] = [
  [0, 0],
  [5, 0],
  [8, 4],
  [3, 4],
];
const PARALLELOGRAM: [number, number][] = [
  [0, 0],
  [6, 0],
  [7.5, 3.7],
  [1.5, 3.7],
];
const KITE: [number, number][] = [
  [3, 0],
  [5, 3],
  [3, 7],
  [1, 3],
];
const QUAD: [number, number][] = [
  [0, 0],
  [6, 0],
  [5, 4],
  [1, 3],
];

// ---------------------------------------------------------------------------------------------
// The language of geometry.

const NOTATION = "gf-shapes/notation";
const notationMethod = [
  "Read AB as the line from A to B.",
  "Read ∠ABC as the angle at the middle letter, B.",
  "Read the marks: arrows, dashes, squares.",
];
const AT_B = named(triangle(55, 70, ["x", null, null]), ["B", "C", "A"]);

const notation = stepped(find(S, NOTATION), {
  method: notationMethod,
  variation: {
    relationship: "geometry's symbols and what they name",
    unknowns: ["corner", "meaning"],
    surface: ["letters reversed", "different symbols", "marks on a diagram"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Reading geometry",
        ["**∠ABC is the angle at B, the middle letter.**"],
        AT_B,
        "Arrows: parallel. Dashes: equal. A small square: 90°.",
      ),
      reworded(S, NOTATION, "In triangle PQR, ∠PQR is the angle at", { tag: "The rule" }),

      ...owned(S, NOTATION, "Warm-up", "Check you remember"),

      methodCard("The method", notationMethod, AT_B),
      workedFrom(S, NOTATION),
      calc(
        "Your turn",
        "Read the angles.",
        named(triangle(50, 70, ["50°", null, "60°"]), ["B", "C", "A"]),
        [
          ["∠ABC =", "50", "The angle at B.", { after: "°" }],
          ["∠BCA =", "70", "Angles in a triangle add to 180°.", { after: "°" }],
        ],
        "∠ABC is at B; ∠BCA is at C.",
      ),

      calc(
        "Practise",
        "Read the angles.",
        named(triangle(40, 75, [null, "75°", "65°"]), ["P", "Q", "R"]),
        [
          ["∠PQR =", "75", "The angle at Q.", { after: "°" }],
          ["∠QPR =", "40", "Angles in a triangle add to 180°.", { after: "°" }],
        ],
        "The middle letter names the corner.",
      ),
      ...owned(S, NOTATION, "Together", "Practise"),
      ...owned(S, NOTATION, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which corner? Watch what changes.",
        [
          pick("∠ABC is at", "B", ["A", "C"], "The middle letter.", {
            asks: "corner",
            picture: named(shape(QUAD), ["A", "B", "C", "D"]),
          }),
          pick("∠BCD is at", "C", ["B", "D"], "The middle letter.", {
            asks: "corner",
            changed: "Moved round.",
            picture: named(shape(QUAD), ["A", "B", "C", "D"]),
          }),
          pick("∠CBA is at", "B", ["C", "A"], "Still the middle.", {
            asks: "corner",
            changed: "Letters reversed.",
            picture: named(shape(QUAD), ["A", "B", "C", "D"]),
          }),
          pick("∠DAB is at", "A", ["D", "B"], "The middle letter.", {
            asks: "corner",
            changed: "Ends with B.",
            picture: named(shape(QUAD), ["A", "B", "C", "D"]),
          }),
        ],
        "The middle letter is the corner.",
      ),

      questionSet(
        "Variation",
        "What does it mean? Watch what changes.",
        [
          pick(
            "PQ ∥ RS means",
            "PQ is parallel to RS",
            ["PQ = RS", "PQ ⊥ RS"],
            "∥: two lines side by side.",
            {
              asks: "meaning",
              expect: [
                "Leo says ∥ means equal length. Right?",
                "No",
                "∥ means parallel. Equal length is =.",
                [["Yes", "Picture two railway lines."]],
              ],
            },
          ),
          pick(
            "PQ ⊥ RS means",
            "PQ is perpendicular to RS",
            ["PQ is parallel to RS", "PQ = RS"],
            "⊥: one line standing on another.",
            { asks: "meaning", changed: "⊥, not ∥." },
          ),
          pick(
            "PQ = RS means",
            "They're the same length",
            ["They're parallel", "They meet"],
            "= is equal.",
            {
              asks: "meaning",
              changed: "Equals.",
            },
          ),
          pick(
            "A small square at a corner means",
            "90°",
            ["180°", "a square shape"],
            "A right angle.",
            {
              asks: "meaning",
              changed: "A mark, not a symbol.",
            },
          ),
        ],
        "Each symbol has one meaning.",
      ),
      own(S, NOTATION, "Spot the mistake"),

      own(S, NOTATION, "Exit check"),

      reworded(
        S,
        NOTATION,
        "“AB = AC and ∠BAC = 40°. Work out ∠ABC.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**∠ABC is the angle at B, the middle letter.**"],
        AT_B,
        [
          "**∠ABC is the angle at B, the middle letter.**",
          "∥ parallel, ⊥ perpendicular, = equal length.",
          "A small square marks 90°.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Special quadrilaterals.

const QUADS = "gf-shapes/quadrilaterals";
const quadMethod = [
  "Check the sides: equal? parallel?",
  "Check the angles: right angles? equal pairs?",
  "Name the most exact shape, with a reason.",
];
const FAMILY: Picture = {
  kind: "table",
  head: ["Shape", "Sides", "Angles"],
  rows: [
    ["Square", "4 equal", "all 90°"],
    ["Rectangle", "opposite equal", "all 90°"],
    ["Rhombus", "4 equal", "opposite equal"],
    ["Parallelogram", "opposite equal", "opposite equal"],
    ["Trapezium", "1 pair parallel", "—"],
    ["Kite", "2 pairs next to each other", "1 pair equal"],
  ],
};
const ANGLE70: [number, number][] = [
  [0, 0],
  [6, 0],
  [7.2, 3.29],
  [1.2, 3.29],
];

const quadrilaterals = stepped(find(S, QUADS), {
  method: quadMethod,
  variation: {
    relationship: "a quadrilateral's sides, angles and diagonals",
    unknowns: ["name", "property"],
    surface: ["equal sides", "right angles", "diagonals"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The quadrilateral family",
        ["**Name a quadrilateral by its sides, angles and diagonals.**"],
        FAMILY,
        "A square is a special rectangle and a special rhombus.",
      ),
      reworded(S, QUADS, "Which shape?", { tag: "The rule" }),

      ...owned(S, QUADS, "Warm-up", "Check you remember"),

      methodCard("The method", quadMethod, FAMILY),
      workedFrom(S, QUADS),
      calc(
        "Your turn",
        "A parallelogram. Find a and b.",
        shape(ANGLE70, { angles: ["70°", "a", "b", null] }),
        [
          ["a =", "110", "Next to each other: add to 180°.", { after: "°" }],
          ["b =", "70", "Opposite angles are equal.", { after: "°" }],
        ],
        "a = 110°, b = 70°.",
      ),

      calc(
        "Practise",
        "A kite. Find x.",
        shape(KITE, { angles: ["x", "120°", "54°", null] }),
        [
          ["The other equal angle:", "120", "A kite has one pair of equal angles.", { after: "°" }],
          ["x =", "66", "Angles add to 360°.", { after: "°" }],
        ],
        "x = 66°.",
      ),
      ...owned(S, QUADS, "Together", "Practise"),
      reworded(S, QUADS, "Which has rotational symmetry of order 2 and no lines of symmetry?", {
        tag: "Practise",
      }),
      reworded(S, QUADS, "A parallelogram has an angle of 65°. The angle next to it is", {
        tag: "Practise",
        title: "A parallelogram has a 65° angle. The angle next to it?",
      }),
      questionSet(
        "Practise",
        "Name the shape. Watch what changes.",
        [
          pick(
            "Which shape is it?",
            "Square",
            ["Rhombus", "Rectangle"],
            "Equal sides, right angles.",
            {
              asks: "name",
              picture: shape(SQUARE, {
                sides: ["4 cm", "4 cm", "4 cm", "4 cm"],
                square: [0, 1, 2, 3],
              }),
            },
          ),
          pick(
            "Which shape now?",
            "Rectangle",
            ["Square", "Parallelogram"],
            "Right angles, unequal sides.",
            {
              asks: "name",
              changed: "Longer.",
              picture: shape(OBLONG, {
                sides: ["6 cm", "3 cm", "6 cm", "3 cm"],
                square: [0, 1, 2, 3],
              }),
            },
          ),
          pick(
            "And this one?",
            "Rhombus",
            ["Square", "Parallelogram"],
            "Equal sides, no right angles.",
            {
              asks: "name",
              changed: "Leaning over.",
              picture: shape(RHOMBUS, { sides: ["5 cm", "5 cm", "5 cm", "5 cm"] }),
            },
          ),
          pick("And this?", "Parallelogram", ["Rhombus", "Rectangle"], "Opposite sides equal.", {
            asks: "name",
            changed: "Unequal sides.",
            picture: shape(PARALLELOGRAM, { sides: ["6 cm", "4 cm", "6 cm", "4 cm"] }),
          }),
        ],
        "Sides first, then angles.",
      ),

      questionSet(
        "Variation",
        "Are the diagonals equal? Watch what changes.",
        [
          pick("A rhombus", "No", ["Yes"], "One is longer.", {
            asks: "property",
            picture: diagonals(RHOMBUS),
            expect: [
              "Eve says a rhombus's diagonals are equal. Right?",
              "No",
              "They cross at 90°, but one is longer.",
              [["Yes", "Picture a long, thin rhombus."]],
            ],
          }),
          pick("A square", "Yes", ["No"], "Same length.", {
            asks: "property",
            changed: "Right angles added.",
            picture: diagonals(SQUARE),
          }),
          pick("A rectangle", "Yes", ["No"], "Same length.", {
            asks: "property",
            changed: "Sides not all equal.",
            picture: diagonals(OBLONG),
          }),
          pick("A kite", "No", ["Yes"], "One is longer.", {
            asks: "property",
            changed: "A kite.",
            picture: diagonals(KITE),
          }),
        ],
        "Right angles make the diagonals equal.",
      ),
      own(S, QUADS, "Spot the mistake"),

      own(S, QUADS, "Exit check"),

      reworded(
        S,
        QUADS,
        "“A shape has four sides of 5 cm. He says it must be a square. Is he correct? Give a reason.”",
        {
          tag: "Real life",
          title: "Four equal sides. Must it be a square?",
          picture: shape(RHOMBUS, { sides: ["5 cm", "5 cm", "5 cm", "5 cm"] }),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Name a quadrilateral by its sides, angles and diagonals.**"],
        FAMILY,
        [
          "**Name a quadrilateral by its sides, angles and diagonals.**",
          "A square is a rectangle and a rhombus.",
          "A rhombus's diagonals cross at 90° but aren't equal.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Triangles and other plane figures.

const TRIANGLES = "gf-shapes/triangles";
const triMethod = [
  "Name it: equal sides face equal angles.",
  "Angles in a triangle add to 180°.",
  "Isosceles: the two base angles match.",
];
const ISOSCELES = triangle(55, 55, ["55°", "55°", "70°"]);

const triangles = stepped(find(S, TRIANGLES), {
  method: triMethod,
  variation: {
    relationship: "a triangle's equal sides and equal angles",
    unknowns: ["type", "angle"],
    surface: ["equal sides", "a right angle", "steeper or flatter"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Types of triangle",
        ["**Equilateral: all equal. Isosceles: two equal. Scalene: none equal.**"],
        ISOSCELES,
        "A regular polygon has all sides and all angles equal.",
      ),

      ...owned(S, TRIANGLES, "Warm-up", "Check you remember"),

      methodCard("The method", triMethod, ISOSCELES),
      workedFrom(S, TRIANGLES),
      calc(
        "Your turn",
        "An isosceles triangle. Find the base angles.",
        triangle(70, 70, ["a", "b", "40°"]),
        [
          ["$a + b =$", "140", "Take the top angle from 180°.", { after: "°" }],
          ["Each base angle:", "70", "Halve it.", { after: "°" }],
        ],
        "70° each.",
      ),

      calc(
        "Practise",
        "An isosceles triangle. Find x and y.",
        triangle(35, 35, ["35°", "x", "y"]),
        [
          ["x =", "35", "The base angles match.", { after: "°" }],
          ["y =", "110", "Angles add to 180°.", { after: "°" }],
        ],
        "x = 35°, y = 110°.",
      ),
      ...owned(S, TRIANGLES, "Together", "Practise"),
      ...owned(S, TRIANGLES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Name the triangle. Watch what changes.",
        [
          pick("Which triangle?", "Equilateral", ["Isosceles", "Scalene"], "All sides equal.", {
            asks: "type",
            picture: shape(
              [
                [0, 0],
                [6, 0],
                [3, 5.2],
              ],
              { sides: ["6 cm", "6 cm", "6 cm"] },
            ),
          }),
          pick("Which now?", "Isosceles", ["Equilateral", "Scalene"], "Two sides equal.", {
            asks: "type",
            changed: "One side shorter.",
            picture: shape(
              [
                [0, 0],
                [3, 0],
                [1.5, 4.77],
              ],
              { sides: ["3 cm", "5 cm", "5 cm"] },
            ),
          }),
          pick("And this one?", "Scalene", ["Isosceles", "Equilateral"], "No sides equal.", {
            asks: "type",
            changed: "All different.",
            picture: shape(
              [
                [0, 0],
                [6, 0],
                [3.75, 3.31],
              ],
              { sides: ["6 cm", "4 cm", "5 cm"] },
            ),
          }),
          pick("And this?", "Right-angled", ["Equilateral", "Isosceles"], "Look at the square.", {
            asks: "type",
            changed: "A right angle.",
            picture: shape(
              [
                [0, 0],
                [7, 0],
                [0, 4],
              ],
              { square: [0] },
            ),
          }),
        ],
        "Count the equal sides, then look for 90°.",
      ),

      questionSet(
        "Variation",
        "Isosceles. Find the top angle. Watch what changes.",
        [
          ask("The top angle?", "40", "Take both base angles from 180°.", "40°.", {
            asks: "angle",
            unit: "°",
            picture: triangle(70, 70, ["70°", null, "?"]),
            expect: [
              "Raj adds the base angles to 180°. Right?",
              "No",
              "Take them away: $180 - 140 = 40°$.",
              [["Yes", "The three angles add to 180°."]],
            ],
          }),
          ask("Find the top angle.", "30", "Both base angles from 180°.", "30°.", {
            asks: "angle",
            unit: "°",
            changed: "Steeper.",
            picture: triangle(75, 75, ["75°", null, "?"]),
          }),
          ask("The top angle now?", "90", "Both base angles from 180°.", "90°.", {
            asks: "angle",
            unit: "°",
            changed: "A right angle.",
            picture: triangle(45, 45, ["45°", null, "?"]),
          }),
          ask("And now?", "120", "Both base angles from 180°.", "120°.", {
            asks: "angle",
            unit: "°",
            changed: "Flatter.",
            picture: triangle(30, 30, ["30°", null, "?"]),
          }),
        ],
        "Lower base angles: a wider top.",
      ),
      own(S, TRIANGLES, "Spot the mistake"),

      own(S, TRIANGLES, "Exit check"),

      reworded(
        S,
        TRIANGLES,
        "“The truss is isosceles with 50° at the top. Find the base angles.”",
        {
          tag: "Real life",
          title: "The roof truss is isosceles. Find the base angles.",
          picture: triangle(65, 65, ["?", "?", "50°"]),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Equilateral: all equal. Isosceles: two equal. Scalene: none equal.**"],
        ISOSCELES,
        [
          "**Equilateral: all equal. Isosceles: two equal. Scalene: none equal.**",
          "Equal angles face the equal sides.",
          "Top angle 50°: base angles $(180 - 50) \\div 2 = 65°$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// 3D solids.

const SOLIDS = "gf-shapes/solids";
const solidMethod = [
  "Faces: count the flat surfaces.",
  "Edges: count where faces meet, hidden ones too.",
  "Vertices: count the corners. Check F + V − E = 2.",
];
const CUBOID = box(4, 2, 2);

const solids = stepped(find(S, SOLIDS), {
  method: solidMethod,
  variation: {
    relationship: "a solid's faces, edges and vertices",
    unknowns: ["edges", "vertices"],
    surface: ["prisms", "pyramids", "curved solids"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Faces, edges, vertices",
        ["**Faces are flat, edges are where they meet, vertices are corners.**"],
        CUBOID,
        "For prisms and pyramids, F + V − E = 2.",
      ),
      reworded(S, SOLIDS, "Faces + vertices − edges for a cuboid", { tag: "The rule" }),

      ...owned(S, SOLIDS, "Warm-up", "Check you remember"),

      methodCard("The method", solidMethod, CUBOID),
      workedFrom(S, SOLIDS),
      calc(
        "Your turn",
        "Count for the cuboid.",
        CUBOID,
        [
          ["Faces:", "6", "Top, bottom and four sides."],
          ["Edges:", "12", "4 on top, 4 below, 4 up."],
        ],
        "6 faces, 12 edges.",
      ),

      calc(
        "Practise",
        "Use F + V − E = 2.",
        undefined,
        [
          ["Pentagonal prism: $7 + 10 - 15 =$", "2", "It checks."],
          ["F = 5, V = 5, so E =", "8", "5 + 5 − 2."],
        ],
        "A square-based pyramid has 8 edges.",
      ),
      ...owned(S, SOLIDS, "Together", "Practise"),
      reworded(S, SOLIDS, "Edges of a hexagonal prism?", { tag: "Practise" }),
      reworded(S, SOLIDS, "A solid has 8 faces and 12 vertices. Edges? (F + V − E = 2)", {
        tag: "Practise",
        title: "8 faces and 12 vertices. Edges? Use F + V − E = 2.",
      }),
      questionSet(
        "Practise",
        "How many edges? Watch what changes.",
        [
          ask("Edges on a cube?", "12", "4 on top, 4 below, 4 up.", "12.", {
            asks: "edges",
            picture: box(2, 2, 2),
          }),
          ask("Edges on this pyramid?", "8", "4 round the base, 4 up.", "8.", {
            asks: "edges",
            changed: "A pyramid.",
            picture: SQUARE_PYRAMID,
          }),
          ask("Edges on a pentagonal pyramid?", "10", "5 round the base, 5 up.", "10.", {
            asks: "edges",
            changed: "A five-sided base.",
          }),
          ask("Edges on an octagonal prism?", "24", "8 on each end, 8 along.", "24.", {
            asks: "edges",
            changed: "Eight-sided ends.",
          }),
        ],
        "Count the base, then the rest.",
      ),

      questionSet(
        "Variation",
        "How many vertices? Watch what changes.",
        [
          ask("A cylinder", "0", "Where are the corners?", "0.", {
            asks: "vertices",
            expect: [
              "Jay says a cylinder has 8 vertices. Right?",
              "No",
              "A cylinder has no corners: 0 vertices.",
              [["Yes", "Where are its corners?"]],
            ],
          }),
          ask("A cone", "1", "The point.", "1.", { asks: "vertices", changed: "One point." }),
          ask("A cube", "8", "4 on top, 4 below.", "8.", {
            asks: "vertices",
            changed: "Flat faces.",
          }),
          ask("A square-based pyramid", "5", "4 on the base, 1 on top.", "5.", {
            asks: "vertices",
            changed: "A point on top.",
          }),
        ],
        "Curved surfaces have no corners.",
      ),
      own(S, SOLIDS, "Spot the mistake"),

      own(S, SOLIDS, "Exit check"),

      reworded(
        S,
        SOLIDS,
        "“A chocolate box is a triangular prism. How many faces and edges?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Faces are flat, edges are where they meet, vertices are corners.**"],
        CUBOID,
        [
          "**Faces are flat, edges are where they meet, vertices are corners.**",
          "Count the hidden edges too.",
          "F + V − E = 2.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Plans.

const PLANS = "gf-shapes/plans";
const planMethod = [
  "Look straight down from above.",
  "Draw the outline you see, flat.",
  "Add a line wherever the height changes.",
];
const TOWER = box(2, 2, 3, true);

const plans = stepped(find(S, PLANS), {
  method: planMethod,
  variation: {
    relationship: "a solid and its view from above",
    unknowns: ["plan", "view"],
    surface: ["standing or lying", "curved solids", "pyramids"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The view from above",
        ["**A plan is the view from directly above.**"],
        TOWER,
        "Heights don't show. Mark where the height changes.",
      ),
      reworded(S, PLANS, "A cylinder lying on its side: its plan is", { tag: "The rule" }),

      ...owned(S, PLANS, "Warm-up", "Check you remember"),

      methodCard("The method", planMethod, TOWER),
      workedFrom(S, PLANS),
      calc(
        "Your turn",
        "Its plan is a rectangle.",
        box(5, 2, 1, true),
        [
          ["Length:", "5", "Cubes along."],
          ["Width:", "2", "Cubes deep."],
        ],
        "A 5 by 2 rectangle.",
      ),

      calc(
        "Practise",
        "What size is its plan?",
        box(3, 3, 2, true),
        [
          ["Length:", "3", "Cubes along."],
          ["Width:", "3", "Cubes deep."],
        ],
        "A 3 by 3 square: the height doesn't show.",
      ),
      ...owned(S, PLANS, "Together", "Practise"),
      reworded(S, PLANS, "A triangular prism lying on a rectangular face: its plan is", {
        tag: "Practise",
      }),
      reworded(S, PLANS, "A plan shows a 2 by 2 square. Which solid could it be?", {
        tag: "Practise",
        title: "A plan is a 2 by 2 square. Which solid?",
      }),
      questionSet(
        "Practise",
        "What's the plan? Watch what changes.",
        [
          pick(
            "A cylinder, standing up",
            "A circle",
            ["A rectangle", "A triangle"],
            "You see its top.",
            {
              asks: "plan",
            },
          ),
          pick(
            "A cone, standing up",
            "A circle with a dot",
            ["A triangle", "A circle"],
            "The point is in the middle.",
            {
              asks: "plan",
              changed: "A point on top.",
            },
          ),
          pick("A cube", "A square", ["A cube", "A rectangle"], "You see one face.", {
            asks: "plan",
            changed: "Flat faces.",
          }),
          pick(
            "This pyramid",
            "A square with its diagonals",
            ["A triangle", "A plain square"],
            "Four sloping faces meet at the top.",
            { asks: "plan", changed: "A pyramid.", picture: SQUARE_PYRAMID },
          ),
        ],
        "Look straight down.",
      ),

      questionSet(
        "Variation",
        "From which way? Watch what changes.",
        [
          pick("An upright cylinder, from above", "A circle", ["A rectangle"], "You see its top.", {
            asks: "view",
            expect: [
              "Ben draws a rectangle for its plan. Right?",
              "No",
              "From above, you see the circular top.",
              [["Yes", "Look straight down."]],
            ],
          }),
          pick(
            "An upright cylinder, from the front",
            "A rectangle",
            ["A circle"],
            "You see its side.",
            {
              asks: "view",
              changed: "From the front.",
            },
          ),
          pick(
            "A cylinder lying down, from above",
            "A rectangle",
            ["A circle"],
            "You see its side.",
            {
              asks: "view",
              changed: "Lying down.",
            },
          ),
          pick(
            "A cylinder lying down, from the end",
            "A circle",
            ["A rectangle"],
            "You see its end.",
            {
              asks: "view",
              changed: "From the end.",
            },
          ),
        ],
        "The view depends on where you look from.",
      ),
      own(S, PLANS, "Spot the mistake"),

      own(S, PLANS, "Exit check"),

      reworded(
        S,
        PLANS,
        "“Draw the plan of the solid: three cubes in a row, one on top of the left end.”",
        { tag: "Real life", title: "What is the plan of this solid?", picture: lSolid },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A plan is the view from directly above.**"],
        TOWER,
        [
          "**A plan is the view from directly above.**",
          "An upright cylinder's plan is a circle.",
          "Mark where the height changes.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Elevations.

const ELEVATIONS = "gf-shapes/elevations";
const elevMethod = [
  "Front: look straight at the front.",
  "Side: look straight at the side.",
  "Draw each one flat, with no depth.",
];
const WALL = box(3, 1, 2, true);

const elevations = stepped(find(S, ELEVATIONS), {
  method: elevMethod,
  variation: {
    relationship: "a solid and its flat views",
    unknowns: ["solid", "view"],
    surface: ["curved solids", "pyramids", "prisms"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Front and side",
        ["**Elevations are the flat views from the front and the side.**"],
        WALL,
        "Plan from above; elevations from the front and side.",
      ),
      reworded(S, ELEVATIONS, "From the right-hand side, the L-shaped solid shows", {
        tag: "The rule",
      }),

      ...owned(S, ELEVATIONS, "Warm-up", "Check you remember"),

      methodCard("The method", elevMethod, WALL),
      workedFrom(S, ELEVATIONS),
      calc(
        "Your turn",
        "Its front elevation is a rectangle.",
        box(4, 2, 3, true),
        [
          ["Width:", "4", "Cubes along the front."],
          ["Height:", "3", "Cubes up."],
        ],
        "A 4 by 3 rectangle.",
      ),

      calc(
        "Practise",
        "Its side elevation is a rectangle.",
        box(4, 2, 3, true),
        [
          ["Width:", "2", "Cubes deep."],
          ["Height:", "3", "Cubes up."],
        ],
        "A 2 by 3 rectangle.",
      ),
      ...owned(S, ELEVATIONS, "Together", "Practise"),
      reworded(
        S,
        ELEVATIONS,
        "Front elevation of a triangular prism lying on a rectangle, with its triangular end facing you",
        { tag: "Practise", title: "A triangular prism, end on. Its front elevation?" },
      ),
      reworded(S, ELEVATIONS, "Plan: rectangle. Front: rectangle. Side: rectangle. The solid is", {
        tag: "Practise",
      }),
      questionSet(
        "Practise",
        "Which solid? Watch what changes.",
        [
          pick(
            "Plan circle; front and side rectangles",
            "Cylinder",
            ["Cone", "Sphere"],
            "Round, with straight sides.",
            {
              asks: "solid",
            },
          ),
          pick(
            "Plan, front and side all circles",
            "Sphere",
            ["Cylinder", "Cone"],
            "Round every way.",
            {
              asks: "solid",
              changed: "All circles.",
            },
          ),
          pick(
            "Plan square; front and side triangles",
            "Square-based pyramid",
            ["Cone", "Cube"],
            "A square base, a point on top.",
            { asks: "solid", changed: "A square plan." },
          ),
          pick(
            "Plan rectangle; front triangle; side rectangle",
            "Triangular prism",
            ["Square-based pyramid", "Cuboid"],
            "A triangle all the way through.",
            { asks: "solid", changed: "One triangle." },
          ),
        ],
        "Put the three views together.",
      ),

      questionSet(
        "Variation",
        "Give the view. Watch what changes.",
        [
          pick(
            "A cone on its base, from the side",
            "A triangle",
            ["A circle"],
            "Look straight at it.",
            {
              asks: "view",
              expect: [
                "Joe says the side view is a circle. Right?",
                "No",
                "From the side, a cone looks like a triangle.",
                [["Yes", "Look straight at its side."]],
              ],
            },
          ),
          pick(
            "A cone on its base, from above",
            "A circle with a dot",
            ["A triangle", "A plain circle"],
            "The base, with the point in the middle.",
            { asks: "view", changed: "From above." },
          ),
          pick(
            "A cylinder on its end, from the side",
            "A rectangle",
            ["A circle", "A triangle"],
            "Straight sides.",
            {
              asks: "view",
              changed: "A cylinder.",
            },
          ),
          pick(
            "A cylinder on its end, from above",
            "A circle",
            ["A rectangle", "A circle with a dot"],
            "No point.",
            {
              asks: "view",
              changed: "From above.",
            },
          ),
        ],
        "Each view is flat, from one direction.",
      ),
      own(S, ELEVATIONS, "Spot the mistake"),

      own(S, ELEVATIONS, "Exit check"),

      reworded(
        S,
        ELEVATIONS,
        "“Draw the front elevation of the L-shaped solid.”",
        { tag: "Real life", title: "What is the front elevation of this solid?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Elevations are the flat views from the front and the side.**"],
        WALL,
        [
          "**Elevations are the flat views from the front and the side.**",
          "A cone: triangle from the side, circle from above.",
          "Draw them flat, with no depth.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

export const gfShapesStepped: [string, UnitLesson[]][] = [
  [NOTATION, [notation]],
  [QUADS, [quadrilaterals]],
  [TRIANGLES, [triangles]],
  [SOLIDS, [solids]],
  [PLANS, [plans]],
  [ELEVATIONS, [elevations]],
];
