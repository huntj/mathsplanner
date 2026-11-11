// GCSE Foundation, "2D and 3D shapes", as six short lessons, one just before each skill: the
// notation of geometry, the properties of quadrilaterals, triangles and other plane figures, the
// faces, edges and vertices of solids, and plans and elevations. Each recaps the Key Stage 3 idea
// quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, ShapePic, UnitLesson } from "./types.ts";

const U = "gf-shapes";

const shape = (points: Point[], extra: Partial<ShapePic> = {}): ShapePic => ({
  kind: "shape",
  points,
  ...extra,
});
const P = (x: number, y: number): Point => ({ x, y });

/** An L-shaped solid of four cubes, drawn in oblique view: three in a row and one on top. */
const lSolid: DrawingPic = (() => {
  const o = P(1.2, 0.9);
  const f = [P(0, 0), P(3, 0), P(3, 1), P(1, 1), P(1, 2), P(0, 2)];
  const b = f.map((p) => P(p.x + o.x, p.y + o.y));
  const seg = (a: Point, c: Point) => ({ line: [a, c] as [Point, Point] });
  const at = (i: number) => f[i] ?? P(0, 0);
  const back = (i: number) => b[i] ?? P(0, 0);
  return {
    kind: "drawing",
    items: [
      ...f.map((p, i) => seg(p, at((i + 1) % 6))),
      ...[1, 2, 3, 4, 5].map((i) => seg(at(i), back(i))),
      seg(back(1), back(2)),
      seg(back(2), back(3)),
      seg(back(3), back(4)),
      seg(back(4), back(5)),
      { text: "front", at: P(1.5, -0.5) },
    ],
  };
})();

const view = (cols: number, rows: number, cells: number[]): Picture => ({
  kind: "grid",
  cols,
  rows,
  shaded: cells.length,
  cells,
});

const kite = shape([P(3, 0), P(5, 3), P(3, 7), P(1, 3)]);
const rhombus = shape([P(0, 0), P(4, 0), P(6, 3), P(2, 3)], {
  sides: ["5 cm", "5 cm", "5 cm", "5 cm"],
});

export const gfShapes: UnitLesson[] = [
  lesson(
    U,
    "notation",
    "GF-G1",
    "The language of geometry",
    "Read and use AB, ∠ABC, parallel and perpendicular marks.",
    [
      problem(
        "The exam diagram",
        [
          "“In triangle ABC, AB = AC and ∠BAC = 40°. Work out ∠ABC.” Exam questions are written in geometry's own notation.",
          "By the end of this lesson, you can read every symbol and draw the diagram from the words.",
        ],
        shape([P(0, 0), P(6, 0), P(3, 5)], { names: ["B", "C", "A"] }),
      ),
      choose(
        "Warm-up",
        "A line joining points A and B is called",
        "AB",
        "Name a line segment by its ends.",
        [["∠AB", "∠ is for angles."]],
      ),
      choose("Warm-up", "A right angle is", "90°", "A quarter turn.", [
        ["180°", "That's a straight line."],
      ]),
      explain(
        "Discover",
        "The notation",
        [
          "AB is the line segment from A to B. ∠ABC is the angle **at B** (the middle letter), between BA and BC.",
          "Matching arrows mean **parallel**; matching dashes mean **equal lengths**; a small square means a **right angle** (perpendicular).",
        ],
        shape([P(0, 0), P(5, 0), P(5, 4), P(0, 4)], { names: ["A", "B", "C", "D"], square: [1] }),
      ),
      choose("Discover", "In triangle PQR, ∠PQR is the angle at", "Q", "The middle letter.", [
        ["P", "The middle letter is the corner."],
        ["R", "The middle letter is the corner."],
      ]),
      worked(
        "Draw it from words",
        "“Triangle ABC has AB = AC and ∠BAC = 40°.” What does the diagram show?",
        [
          ["AB and AC have equal-length dashes", "AB = AC."],
          ["The angle at A is marked 40°", "∠BAC: middle letter A."],
          ["So it's isosceles, with base BC", "Equal sides meet at A."],
        ],
        "Translating the words is half the question.",
      ),
      steps(
        "Together",
        "∠ABC and ∠CBA",
        "Two names.",
        [
          ["Both are the angle at", "B", ["A", "The middle letter in both is B."], "B"],
          [
            "So they are",
            "the same angle",
            ["different angles", "Same corner, same arms."],
            "∠ABC = ∠CBA",
          ],
        ],
        "The middle letter is the corner; the order of the ends doesn't matter.",
      ),
      choose(
        "Together",
        "Lines marked with matching arrows are",
        "parallel",
        "They point the same way.",
        [
          ["equal in length", "Equal lengths have dashes."],
          ["perpendicular", "Perpendicular has a square corner mark."],
        ],
      ),
      choose("Your turn", "“AB ⊥ BC” means", "AB is perpendicular to BC", "They meet at 90°.", [
        ["AB is parallel to BC", "Parallel is ∥."],
        ["AB = BC", "That uses =."],
      ]),
      choose(
        "Your turn",
        "In quadrilateral ABCD, the diagonals are",
        "AC and BD",
        "Joining opposite corners.",
        [
          ["AB and CD", "Those are sides."],
          ["AB and BC", "Those are sides."],
        ],
      ),
      choose(
        "Watch out",
        "Ana says ∠ABC is the angle at A, because A comes first. Is she right?",
        "No: the middle letter, B, is the corner",
        "A and C are the ends of the arms.",
        [["Yes", "Trace A → B → C: you turn at B."]],
      ),
      mistake(
        "Leo reads “PQ ∥ RS and PQ = 5 cm”.",
        ["PQ is a line segment", "∥ means PQ and RS are equal", "PQ is 5 cm long"],
        1,
        "∥ means parallel. Equal lengths would be written PQ = RS.",
      ),
      choose(
        "Back to the problem",
        "“AB = AC and ∠BAC = 40°. Work out ∠ABC.”",
        "70°",
        "Isosceles: base angles equal, $(180 - 40) \\div 2$.",
        [
          ["40°", "∠BAC is the angle at A."],
          ["140°", "Share 140° between the two base angles."],
        ],
      ),
      quiz([
        [
          ["∠XYZ is the angle at", "Y", ["X", "Z"], "Middle letter."],
          ["∠RST is the angle at", "S", ["R", "T"], "Middle letter."],
        ],
        [
          [
            "Equal dashes on two sides mean",
            "equal lengths",
            ["parallel", "right angle"],
            "Dashes: lengths.",
          ],
          ["Matching arrows mean", "parallel", ["equal", "perpendicular"], "Arrows: parallel."],
        ],
        [
          ["A small square in a corner means", "90°", ["45°", "equal sides"], "Right angle."],
          ["⊥ means", "perpendicular", ["parallel", "equal"], "At 90°."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "quadrilaterals",
    "GF-G4.a",
    "Special quadrilaterals",
    "Know the sides, angles, diagonals and symmetry of each quadrilateral.",
    [
      problem(
        "Is it a square?",
        [
          "A shape has four sides of 5 cm. A builder says it must be a square. The exam asks: “Is he correct? Give a reason.”",
          "By the end of this lesson, you'll know exactly what makes each quadrilateral, and how to answer.",
        ],
        rhombus,
      ),
      typed("Warm-up", "The angles in a quadrilateral add to", "360", "Two triangles.", "360°.", {
        unit: "°",
      }),
      choose("Warm-up", "A rectangle's angles are", "all 90°", "Four right angles.", [
        ["two of 90°", "All four."],
      ]),
      explain(
        "Discover",
        "The family",
        [
          "**Square**: 4 equal sides, 4 right angles. **Rectangle**: opposite sides equal, 4 right angles. **Rhombus**: 4 equal sides, opposite angles equal.",
          "**Parallelogram**: opposite sides equal and parallel. **Trapezium**: exactly one pair of parallel sides. **Kite**: two pairs of equal adjacent sides.",
        ],
        {
          kind: "table",
          head: ["Shape", "Diagonals"],
          rows: [
            ["Square", "equal, cross at 90°"],
            ["Rectangle", "equal"],
            ["Rhombus", "cross at 90°"],
            ["Kite", "cross at 90°"],
          ],
        },
      ),
      {
        kind: "sort",
        tag: "Discover",
        title: "Which shape?",
        groups: ["Parallelogram", "Kite", "Trapezium"],
        items: [
          { text: "Two pairs of parallel sides", group: 0, why: "Opposite sides parallel." },
          {
            text: "Diagonals bisect each other",
            group: 0,
            why: "A parallelogram's diagonals cut each other in half.",
          },
          {
            text: "Exactly one pair of parallel sides",
            group: 2,
            why: "That defines a trapezium.",
          },
          {
            text: "Two pairs of equal adjacent sides",
            group: 1,
            why: "A kite's equal sides are next to each other.",
          },
          {
            text: "One line of symmetry, corner to corner",
            group: 1,
            why: "A kite folds along one diagonal.",
          },
        ],
        done: "Each family has its own properties.",
      },
      worked(
        "Answer with a reason",
        "“A shape has four sides of 5 cm. Must it be a square?”",
        [
          ["Four equal sides: at least a rhombus", "What we know."],
          ["A rhombus needn't have right angles", "A counter-example."],
          ["No: it could be a rhombus", "Give the reason."],
        ],
        "In “is he correct?” questions, give a reason.",
      ),
      steps(
        "Together",
        "A kite has angles 110°, 110°, 60° and ?",
        "Kite angles.",
        [
          [
            "The angles add to",
            "360°",
            ["180°", "A quadrilateral: 360°."],
            "$360 - 110 - 110 - 60$",
          ],
          ["The missing angle is", "80°", ["90°", "$360 - 280 = 80$."], "80°"],
        ],
        "A kite has one pair of equal angles: the 110°s.",
        kite,
      ),
      choose(
        "Together",
        "Which quadrilateral's diagonals are equal but don't cross at 90°?",
        "A rectangle (not a square)",
        "Equal diagonals, crossing at other angles.",
        [
          ["A rhombus", "A rhombus's diagonals cross at 90°, and aren't equal."],
          ["A kite", "A kite's cross at 90°."],
        ],
      ),
      choose(
        "Your turn",
        "Which has rotational symmetry of order 2 and no lines of symmetry?",
        "A parallelogram",
        "It looks the same after a half turn.",
        [
          ["A rectangle", "A rectangle has 2 lines of symmetry."],
          ["A kite", "A kite has 1 line, and no rotational symmetry."],
        ],
      ),
      choose(
        "Your turn",
        "A parallelogram has an angle of 65°. The angle next to it is",
        "115°",
        "Co-interior angles add to 180°.",
        [
          ["65°", "Opposite angles are equal; neighbours add to 180°."],
          ["25°", "They add to 180°, not 90°."],
        ],
      ),
      choose(
        "Watch out",
        "Ben says a square isn't a rectangle. Is he right?",
        "No: a square has every rectangle property",
        "A square is a special rectangle (and a special rhombus).",
        [["Yes", "A rectangle needs 4 right angles and opposite sides equal: a square has both."]],
      ),
      mistake(
        "Eve describes a rhombus.",
        ["4 equal sides", "Diagonals equal in length", "Opposite angles equal"],
        1,
        "A rhombus's diagonals cross at 90°, but are usually different lengths.",
      ),
      choose(
        "Back to the problem",
        "“A shape has four sides of 5 cm. He says it must be a square. Is he correct? Give a reason.”",
        "No: it could be a rhombus without right angles",
        "Equal sides don't force 90° angles.",
        [
          ["Yes: four equal sides", "A rhombus has those too."],
          ["No: squares have 5 sides", "Squares have 4."],
        ],
      ),
      quiz([
        [
          [
            "Exactly one pair of parallel sides",
            "trapezium",
            ["parallelogram", "kite"],
            "Definition.",
          ],
          ["Two pairs of equal adjacent sides", "kite", ["rhombus", "trapezium"], "Definition."],
        ],
        [
          [
            "Diagonals cross at 90° and are equal",
            "square",
            ["rectangle", "kite"],
            "Only a square.",
          ],
          [
            "Diagonals are equal and bisect each other",
            "rectangle",
            ["kite", "trapezium"],
            "Squares too.",
          ],
        ],
        [
          ["Parallelogram angle 72°; the next angle", "108°", ["72°", "18°"], "$180 - 72$."],
          ["Parallelogram angle 130°; the next angle", "50°", ["130°", "230°"], "$180 - 130$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "triangles",
    "GF-G4.b",
    "Triangles and other plane figures",
    "Know types of triangle, and regular and irregular polygons.",
    [
      problem(
        "The roof truss",
        [
          "A roof truss is an isosceles triangle with a 50° angle at the top. A tile is a regular hexagon. What are their angles?",
          "By the end of this lesson, you can name any triangle or polygon and use its properties.",
        ],
        shape([P(0, 0), P(8, 0), P(4, 4)], { angles: [null, null, "50°"] }),
      ),
      typed(
        "Warm-up",
        "The angles in a triangle add to",
        "180",
        "Tear off the corners: a straight line.",
        "180°.",
        { unit: "°" },
      ),
      choose(
        "Warm-up",
        "A triangle with all sides equal is",
        "equilateral",
        "Equal sides, equal angles of 60°.",
        [["isosceles", "Isosceles has two equal sides."]],
      ),
      explain(
        "Discover",
        "Types of triangle",
        [
          "**Equilateral**: 3 equal sides, 3 angles of 60°. **Isosceles**: 2 equal sides, and the 2 angles opposite them equal. **Scalene**: none equal.",
          "**Right-angled**: one 90° angle. A polygon is **regular** if all its sides **and** all its angles are equal.",
        ],
        shape([P(0, 0), P(6, 0), P(3, 5)], { angles: ["x", "x", null] }),
      ),
      choose(
        "Discover",
        "An isosceles triangle has a 40° base angle. The other base angle is",
        "40°",
        "Base angles are equal.",
        [
          ["100°", "That's the top angle."],
          ["50°", "Equal to the first."],
        ],
      ),
      worked(
        "The roof truss",
        "Isosceles, 50° at the top. Find the base angles.",
        [
          ["$180 - 50 = 130$", "What's left for the two base angles."],
          ["$130 \\div 2 = 65°$", "They're equal."],
        ],
        "Each base angle is 65°.",
      ),
      steps(
        "Together",
        "A regular hexagon's interior angle",
        "Six equal angles.",
        [
          ["Interior angles add to", "720°", ["360°", "$(6 - 2) \\times 180$."], "720°"],
          ["Each is", "120°", ["60°", "$720 \\div 6$."], "120°"],
        ],
        "Regular hexagons tile because $3 \\times 120 = 360$.",
      ),
      choose(
        "Together",
        "Can a triangle have two right angles?",
        "No: that already makes 180°",
        "The third angle would be 0°.",
        [["Yes", "$90 + 90 = 180$ leaves nothing."]],
      ),
      typed(
        "Your turn",
        "Isosceles, top angle 30°. Each base angle?",
        "75",
        "$(180 - 30) \\div 2$.",
        "75°.",
        { unit: "°", wrong: [["150", "Share it between two angles."]] },
      ),
      choose(
        "Your turn",
        "A shape with all sides equal but angles different is",
        "irregular",
        "Regular needs equal angles too.",
        [["regular", "Both sides and angles must be equal."]],
      ),
      choose(
        "Watch out",
        "In isosceles triangle ABC, AB = AC. Jo says ∠ABC = ∠BAC. What's wrong?",
        "The equal angles face the equal sides: ∠ABC = ∠ACB",
        "Base angles, at B and C.",
        [["Nothing", "The angle at A is between the equal sides."]],
      ),
      mistake(
        "Raj finds the angles of an isosceles triangle with base angle 70°.",
        ["The other base angle is 70°", "$70 + 70 = 140$", "Top angle: $180 + 140$"],
        2,
        "Subtract: $180 - 140 = 40°$.",
      ),
      choose(
        "Back to the problem",
        "“The truss is isosceles with 50° at the top. Find the base angles.”",
        "65° each",
        "$(180 - 50) \\div 2$.",
        [
          ["50° each", "50° is at the top."],
          ["130° each", "Share 130° between them."],
        ],
      ),
      quiz([
        [
          ["Isosceles, top 80°: base angle", "50°", ["80°", "100°"], "$(180 - 80) \\div 2$."],
          ["Isosceles, top 100°: base angle", "40°", ["80°", "100°"], "$(180 - 100) \\div 2$."],
        ],
        [
          ["Each angle of an equilateral triangle", "60°", ["90°", "180°"], "$180 \\div 3$."],
          ["Interior angle of a regular hexagon", "120°", ["60°", "108°"], "$720 \\div 6$."],
        ],
        [
          ["No equal sides:", "scalene", ["isosceles", "equilateral"], "Definition."],
          ["Two equal sides:", "isosceles", ["scalene", "equilateral"], "Definition."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "solids",
    "GF-G12",
    "3D solids",
    "Count faces, edges and vertices, and name prisms and pyramids.",
    [
      problem(
        "The packaging",
        [
          "A chocolate box is a triangular prism; a tent is a square-based pyramid. How many faces of card, and edges to glue?",
          "By the end of this lesson, you can count them for any solid, and spot the rule that links them.",
        ],
        { kind: "cuboid", w: 4, d: 2, h: 3 },
      ),
      choose("Warm-up", "How many faces does a cube have?", "6", "Like a dice.", [
        ["8", "8 is its vertices."],
      ]),
      choose("Warm-up", "Which solid has a curved surface?", "Cylinder", "Its side curves round.", [
        ["Cuboid", "All flat faces."],
      ]),
      explain(
        "Discover",
        "Faces, edges, vertices",
        [
          "A **face** is a flat surface, an **edge** is where two faces meet, a **vertex** is a corner.",
          "A **prism** has the same cross-section all the way through. A **pyramid** rises from a base to a point.",
        ],
        {
          kind: "table",
          head: ["Solid", "F", "E", "V"],
          rows: [
            ["Cuboid", "6", "12", "8"],
            ["Triangular prism", "5", "9", "6"],
            ["Square pyramid", "5", "8", "5"],
          ],
        },
      ),
      choose(
        "Discover",
        "Faces + vertices − edges for a cuboid",
        "2",
        "$6 + 8 - 12 = 2$: Euler's rule.",
        [["0", "$6 + 8 = 14$, minus 12."]],
      ),
      worked(
        "A pentagonal prism",
        "Count its faces, edges and vertices.",
        [
          ["Faces: 2 pentagons + 5 rectangles = 7", "The ends and the sides."],
          ["Edges: 5 + 5 + 5 = 15", "Each end, plus 5 joining them."],
          ["Vertices: 5 + 5 = 10", "Each end."],
        ],
        "Check: $7 + 10 - 15 = 2$ ✓",
      ),
      steps(
        "Together",
        "A square-based pyramid",
        "Count.",
        [
          ["Faces:", "5", ["4", "Include the base."], "5"],
          [
            "Edges and vertices:",
            "8 edges, 5 vertices",
            ["4 edges, 4 vertices", "Include the apex."],
            "8, 5",
          ],
        ],
        "$5 + 5 - 8 = 2$ ✓",
      ),
      choose(
        "Together",
        "A cone has",
        "1 flat face, 1 curved surface, 1 vertex",
        "Circle base, curved side, point.",
        [
          ["2 flat faces", "A cylinder has 2."],
          ["0 vertices", "The tip is a vertex."],
        ],
      ),
      typed("Your turn", "Edges of a hexagonal prism?", "18", "6 + 6 + 6.", "18.", {
        wrong: [["12", "Add the 6 joining edges."]],
      }),
      choose(
        "Your turn",
        "A solid has 8 faces and 12 vertices. Edges? (F + V − E = 2)",
        "18",
        "$8 + 12 - 2$.",
        [
          ["22", "$20 - 2 = 18$."],
          ["20", "Subtract 2."],
        ],
      ),
      choose(
        "Watch out",
        "Sam counts a cube's edges from a drawing and gets 9. Why?",
        "Three edges are hidden at the back",
        "A cube has 12 edges.",
        [["He's right", "Count all edges, seen or not."]],
      ),
      mistake(
        "Tia describes a cylinder.",
        ["2 flat faces", "1 curved surface", "8 vertices"],
        2,
        "A cylinder has no vertices (corners).",
      ),
      choose(
        "Back to the problem",
        "“A chocolate box is a triangular prism. How many faces and edges?”",
        "5 faces, 9 edges",
        "2 triangles + 3 rectangles; 3 + 3 + 3 edges.",
        [
          ["6 faces, 12 edges", "That's a cuboid."],
          ["5 faces, 6 edges", "6 is the vertices."],
        ],
      ),
      quiz([
        [
          ["Vertices of a cuboid", "8", ["6", "12"], "4 on top, 4 below."],
          ["Faces of a cuboid", "6", ["8", "12"], "Top, bottom, 4 sides."],
        ],
        [
          ["Edges of a triangular prism", "9", ["6", "5"], "3 + 3 + 3."],
          ["Edges of a square pyramid", "8", ["5", "4"], "4 + 4."],
        ],
        [
          ["F = 6, V = 6. E?", "10", ["12", "14"], "$6 + 6 - 2$."],
          ["F = 9, V = 14. E?", "21", ["23", "25"], "$9 + 14 - 2$."],
        ],
      ]),
    ],
  ),

  lesson(U, "plans", "GF-G13.a", "Plans", "A plan is the view from directly above.", [
    problem(
      "The architect",
      [
        "An architect sketches a building made of cubes: three in a row, with one more on top of the left end. Builders need the view from above.",
        "By the end of this lesson, you can draw the plan of a solid, and work back from one.",
      ],
      lSolid,
    ),
    choose(
      "Warm-up",
      "Looking straight down on a cube, you see",
      "a square",
      "Just its top face.",
      [["a cube", "From directly above you see one face."]],
    ),
    choose(
      "Warm-up",
      "Looking straight down on a cylinder standing up, you see",
      "a circle",
      "Its top.",
      [["a rectangle", "That's from the side."]],
    ),
    explain(
      "Discover",
      "The view from above",
      [
        "A **plan** is the 2D view from **directly above**. Heights don't show, but you draw a line wherever the height changes.",
        "This solid is 3 cubes long and 2 deep, so its plan is a 3 by 2 rectangle.",
      ],
      view(3, 2, [0, 1, 2, 3, 4, 5]),
    ),
    choose(
      "Discover",
      "A cylinder lying on its side: its plan is",
      "a rectangle",
      "From above you see its length and width.",
      [["a circle", "The circle faces sideways now."]],
    ),
    worked(
      "The architect's solid",
      "Draw the plan of the L-shaped solid.",
      [
        ["Length 3, depth 2", "From above, every column shows."],
        ["A 3 by 2 rectangle", "The outline."],
        ["A line where the height changes, 1 from the left", "The taller part's edge."],
      ],
      "The plan shows the footprint.",
      lSolid,
    ),
    steps(
      "Together",
      "A square-based pyramid",
      "Its plan.",
      [
        [
          "The outline from above is",
          "a square",
          ["a triangle", "That's from the side."],
          "A square",
        ],
        [
          "Inside, you see",
          "lines from each corner to the centre",
          ["nothing", "The sloping edges show."],
          "Square with diagonals",
        ],
      ],
      "The plan of a square pyramid is a square with its diagonals.",
    ),
    choose(
      "Together",
      "The plan of a cone standing on its base",
      "a circle with a dot in the middle",
      "The apex sits above the centre.",
      [["a triangle", "That's the front view."]],
    ),
    choose(
      "Your turn",
      "A triangular prism lying on a rectangular face: its plan is",
      "a rectangle",
      "From above you see a sloping rectangle.",
      [["a triangle", "The triangles face front and back."]],
    ),
    choose(
      "Your turn",
      "A plan shows a 2 by 2 square. Which solid could it be?",
      "A 2 by 2 by 3 cuboid",
      "Its top is 2 by 2.",
      [["A 3 by 3 cube", "Its top would be 3 by 3."]],
    ),
    choose(
      "Watch out",
      "Kai draws the plan of the L-shaped solid as an L. What's wrong?",
      "The L is the front view; from above it's a rectangle",
      "Plans are from directly above.",
      [["Nothing", "From above, you see 3 by 2."]],
    ),
    mistake(
      "Amy draws the plan of a cylinder standing upright.",
      ["Look from directly above", "You see the top", "Draw a rectangle"],
      2,
      "The top of an upright cylinder is a circle.",
    ),
    choose(
      "Back to the problem",
      "“Draw the plan of the solid: three cubes in a row, one on top of the left end.”",
      "A 3 by 2 rectangle with a line marking the taller part",
      "The view from above.",
      [
        ["An L shape", "That's the front elevation."],
        ["A 2 by 2 square", "It's 3 long."],
      ],
      { picture: lSolid },
    ),
    quiz([
      [
        ["Plan of an upright cylinder", "circle", ["rectangle", "triangle"], "From above."],
        ["Plan of a cube", "square", ["cube", "rectangle"], "From above."],
      ],
      [
        [
          "Plan of a 4 by 2 by 1 cuboid lying flat",
          "4 by 2 rectangle",
          ["4 by 1 rectangle", "2 by 1 rectangle"],
          "Length by width.",
        ],
        [
          "Plan of a 5 by 3 by 2 cuboid lying flat",
          "5 by 3 rectangle",
          ["5 by 2", "3 by 2"],
          "Length by width.",
        ],
      ],
      [
        ["A plan is the view from", "above", ["the front", "the side"], "Directly above."],
        ["The front elevation is the view from", "the front", ["above", "below"], "Facing it."],
      ],
    ]),
  ]),

  lesson(U, "elevations", "GF-G13.b", "Elevations", "The views from the front and the side.", [
    problem(
      "The architect again",
      [
        "The builders now need the views from the front and from the side of the same L-shaped building.",
        "By the end of this lesson, you can draw both elevations, and recognise a solid from its views.",
      ],
      lSolid,
    ),
    choose("Warm-up", "The plan is the view from", "above", "Directly above.", [
      ["the front", "That's the front elevation."],
    ]),
    choose("Warm-up", "From the front, a cube looks like", "a square", "One face.", [
      ["a cube", "You see one face."],
    ]),
    explain(
      "Discover",
      "Front and side",
      [
        "The **front elevation** is the view from the front; the **side elevation** from the side. Each is a flat 2D drawing.",
        "From the front, the L-shaped solid looks like an L: three squares along the bottom, one above the left end.",
      ],
      view(3, 2, [0, 3, 4, 5]),
    ),
    choose(
      "Discover",
      "From the right-hand side, the L-shaped solid shows",
      "a 2 by 2 square",
      "2 deep and 2 tall at its tallest.",
      [
        ["an L", "The L faces the front."],
        ["a 3 by 2 rectangle", "It's 2 deep, not 3."],
      ],
      { picture: view(2, 2, [0, 1, 2, 3]) },
    ),
    worked(
      "Three views",
      "Give the plan, front and side elevations of a square-based pyramid.",
      [
        ["Plan: a square with its diagonals", "From above."],
        ["Front: a triangle", "From the front."],
        ["Side: a triangle", "The same from the side."],
      ],
      "Two triangles and a square: a pyramid.",
    ),
    steps(
      "Together",
      "A cylinder standing upright",
      "Its elevations.",
      [
        ["Front elevation:", "a rectangle", ["a circle", "The circle is on top."], "Rectangle"],
        ["Side elevation:", "a rectangle", ["a triangle", "Same as the front."], "Rectangle"],
      ],
      "Plan circle, elevations rectangles: a cylinder.",
    ),
    choose(
      "Together",
      "Front and side are triangles, plan is a circle. The solid is",
      "a cone",
      "Triangle from the side, circle from above.",
      [
        ["a pyramid", "A pyramid's plan has straight sides."],
        ["a cylinder", "A cylinder's elevations are rectangles."],
      ],
    ),
    choose(
      "Your turn",
      "Front elevation of a triangular prism lying on a rectangle, with its triangular end facing you",
      "a triangle",
      "You see the end.",
      [["a rectangle", "The rectangles face up and sideways."]],
    ),
    choose(
      "Your turn",
      "Plan: rectangle. Front: rectangle. Side: rectangle. The solid is",
      "a cuboid",
      "All three views rectangles.",
      [
        ["a cylinder", "Its plan would be a circle."],
        ["a cone", "Its views include triangles."],
      ],
    ),
    choose(
      "Watch out",
      "Zoe draws the side elevation in 3D, with depth. What's wrong?",
      "Elevations are flat 2D views",
      "Draw only what you see face-on.",
      [["Nothing", "No perspective in plans and elevations."]],
    ),
    mistake(
      "Ivy gives the views of a cone standing on its base.",
      ["Plan: circle with a dot in the centre", "Front: triangle", "Side: circle"],
      2,
      "From the side, a cone is a triangle too.",
    ),
    choose(
      "Back to the problem",
      "“Draw the front elevation of the L-shaped solid.”",
      "An L: three squares along the bottom, one above the left",
      "The view from the front.",
      [
        ["A 3 by 2 rectangle", "That's the plan."],
        ["A 2 by 2 square", "That's the side."],
      ],
      { picture: lSolid },
    ),
    quiz([
      [
        [
          "Front elevation of an upright cylinder",
          "rectangle",
          ["circle", "triangle"],
          "From the front.",
        ],
        [
          "Side elevation of an upright cone",
          "triangle",
          ["circle", "rectangle"],
          "From the side.",
        ],
      ],
      [
        ["Plan circle, elevations triangles:", "cone", ["cylinder", "sphere"], "A cone."],
        ["Plan circle, elevations rectangles:", "cylinder", ["cone", "cube"], "A cylinder."],
      ],
      [
        ["Elevations are drawn", "flat, in 2D", ["in 3D", "from above"], "Face-on views."],
        [
          "How many standard views?",
          "3: plan, front, side",
          ["2", "6"],
          "Plan and two elevations.",
        ],
      ],
    ]),
  ]),
];
