// Year 9, "Similarity, surface area and proof", on the stepped template
// (docs/proposals/lesson-stepped.md): the surface area of a prism, the volume of a cylinder,
// similar shapes, enlargement and angle proofs. Shapes are asked on their drawings, with only
// what to find in the words.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { parallels, type Corner } from "./geometry.ts";
import { REASON } from "./reasons.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { CuboidPic, DrawingPic, Picture, Point, UnitLesson } from "./types.ts";
import { cylinder, prism, similar, y9Similarity } from "./y9-similarity.ts";

const S9 = y9Similarity;
const NUMBER = "A calculation from the shape: the numbers are the picture.";
const box = (w: number, d: number, h: number): CuboidPic => ({
  kind: "cuboid",
  w,
  d,
  h,
  labels: [`${w} cm`, `${d} cm`, `${h} cm`],
});
/** Parallel lines crossed at `deg`, with an angle marked at each crossing. */
const lines = (deg: number, low: [Corner, string], high: [Corner, string]): DrawingPic =>
  parallels(deg, [
    { on: "lower", corner: low[0], label: low[1] },
    { on: "upper", corner: high[0], label: high[1] },
  ]);
function picOf(id: string, title: string): Picture {
  const screen = find(S9, id)?.screens.find((s) => s.title === title);
  const pic = screen && "picture" in screen ? screen.picture : undefined;
  if (!pic) throw new Error(`No picture on "${title}" in ${id}`);
  return pic;
}

// ---------------------------------------------------------------------------------------------
// Surface area.

const SURFACE = "y9-similarity/surface-area";
const surfaceMethod = [
  "List the faces: a cuboid's come in pairs.",
  "Find the area of each face.",
  "Add them all up, in cm².",
];
const BOX = box(5, 2, 3);

const surfaceArea = stepped(find(S9, SURFACE), {
  method: surfaceMethod,
  variation: {
    relationship: "surface area: the total area of every face",
    unknowns: ["surface area", "face"],
    surface: ["cubes", "longer cuboids", "prisms"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Wrapping a prism",
        ["**Surface area: add up the area of every face.**"],
        BOX,
        "A cuboid's six faces come in three matching pairs.",
      ),
      reworded(S9, SURFACE, "Unfold it", { tag: "The rule" }),

      ...owned(S9, SURFACE, "Warm-up", "Check you remember"),

      methodCard("The method", surfaceMethod, BOX),
      workedFrom(S9, SURFACE),
      calc(
        "Your turn",
        "Find the surface area.",
        box(6, 4, 1),
        [
          ["Front and back: $2 \\times (6 \\times 1) =$", "12", "A pair of faces."],
          ["Top and bottom: $2 \\times (6 \\times 4) =$", "48", "A pair of faces."],
          ["Sides: $2 \\times (4 \\times 1) =$", "8", "A pair of faces."],
          ["Total:", "68", "Add them up.", { after: "cm²" }],
        ],
        "68 cm².",
      ),

      calc(
        "Practise",
        "Find the surface area.",
        prism("5 cm", "12 cm", "13 cm", "10 cm"),
        [
          ["Two ends: $2 \\times \\frac12 \\times 5 \\times 12 =$", "60", "Two triangles."],
          ["Rectangles: $(5 + 12 + 13) \\times 10 =$", "300", "Three rectangles."],
          ["Total:", "360", "Add them up.", { after: "cm²" }],
        ],
        "360 cm².",
      ),
      reworded(S9, SURFACE, "A 4 cm by 3 cm by 2 cm cuboid", {
        tag: "Practise",
        title: "A cuboid",
        start: "Find the surface area.",
      }),
      reworded(S9, SURFACE, "A triangular prism", {
        tag: "Practise",
        start: "Find the surface area.",
      }),
      reworded(S9, SURFACE, "A cube with sides of 4 cm", {
        tag: "Practise",
        title: "A cube",
        text: "Find the surface area.",
      }),
      reworded(S9, SURFACE, "A 6 cm by 5 cm by 2 cm cuboid", {
        tag: "Practise",
        title: "A cuboid",
        text: "Find the surface area.",
      }),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Find the surface area.", "14", "3 + 3 + 1 + 1 + 3 + 3.", "14 cm².", {
            unit: "cm²",
            asks: "surface area",
            picture: box(1, 1, 3),
          }),
          ask("Find the surface area.", "26", "Taller: more side area.", "26 cm².", {
            unit: "cm²",
            asks: "surface area",
            changed: "Twice as tall.",
            picture: box(1, 1, 6),
          }),
          ask("Find the area of the front face.", "12", "3 × 4.", "12 cm².", {
            unit: "cm²",
            asks: "face",
            changed: "Just one face.",
            picture: box(3, 2, 4),
          }),
          ask("Find the surface area.", "52", "24 + 12 + 16.", "52 cm².", {
            unit: "cm²",
            asks: "surface area",
            changed: "Now all of it.",
            picture: box(3, 2, 4),
          }),
        ],
        "Pairs of faces, then add.",
      ),

      questionSet(
        "Variation",
        "A cube. Find the surface area.",
        [
          ask("Find the surface area.", "6", "Six faces of 1 cm².", "6 cm².", {
            unit: "cm²",
            asks: "surface area",
            picture: box(1, 1, 1),
            expect: [
              "Ben says a 1 cm cube has a surface area of 1 cm². Right?",
              "No",
              "Six faces of 1 cm² each: 6 cm². 1 cm³ is its volume.",
              [["Yes", "Count every face."]],
            ],
          }),
          ask("Find the surface area.", "24", "Six faces of 4 cm².", "24 cm².", {
            unit: "cm²",
            asks: "surface area",
            changed: "Side doubled.",
            picture: box(2, 2, 2),
          }),
          ask("Find the surface area.", "150", "Six faces of 25 cm².", "150 cm².", {
            unit: "cm²",
            asks: "surface area",
            changed: "Side 5.",
            picture: box(5, 5, 5),
          }),
          ask("Find the surface area.", "600", "Six faces of 100 cm².", "600 cm².", {
            unit: "cm²",
            asks: "surface area",
            changed: "Side 10.",
            picture: box(10, 10, 10),
          }),
        ],
        "A cube: six times one face.",
      ),
      reworded(
        S9,
        SURFACE,
        "Where did it go wrong?",
        { text: "Tia finds the surface area.", picture: prism("5 cm", "12 cm", "13 cm", "4 cm") },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find the surface area.",
            "54 cm²",
            ["27 cm²", "9 cm²"],
            "Six faces of 9 cm².",
            box(3, 3, 3),
          ],
          [
            "Find the surface area.",
            "96 cm²",
            ["64 cm²", "16 cm²"],
            "Six faces of 16 cm².",
            box(4, 4, 4),
          ],
        ],
        [
          [
            "Find the surface area.",
            "28 cm²",
            ["8 cm²", "14 cm²"],
            "8 + 8 + 4 + 4 + 2 + 2.",
            box(4, 2, 1),
          ],
          [
            "Find the surface area.",
            "22 cm²",
            ["6 cm²", "11 cm²"],
            "6 + 6 + 3 + 3 + 2 + 2.",
            box(3, 1, 2),
          ],
        ],
        [
          [
            "How many rectangular faces?",
            "3",
            ["2", "5"],
            "Plus two triangles.",
            prism("3 cm", "4 cm", "5 cm", "6 cm"),
          ],
          [
            "How many triangular faces?",
            "2",
            ["3", "5"],
            "The two ends.",
            prism("3 cm", "4 cm", "5 cm", "6 cm"),
          ],
        ],
      ]),

      reworded(
        S9,
        SURFACE,
        "How much card?",
        {
          tag: "Real life",
          text: "Find its surface area.",
          hint: "Two triangles, then three rectangles.",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Surface area: add up the area of every face.**"],
        BOX,
        [
          "**Surface area: add up the area of every face.**",
          "A cuboid: three pairs of rectangles.",
          "A triangular prism: two triangles and three rectangles.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// The volume of a cylinder.

const CYL = "y9-similarity/cylinder";
const cylMethod = [
  "Find the radius. Given the diameter? Halve it.",
  "Area of the circle: πr².",
  "Times by the height.",
];
const CYL_PIC = cylinder("3 cm", "10 cm");

const cylinderVolume = stepped(find(S9, CYL), {
  method: cylMethod,
  variation: {
    relationship: "volume of a cylinder = πr² × height",
    unknowns: ["volume", "area"],
    surface: ["the diameter given", "doubling the radius", "doubling the height"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Filling a cylinder",
        ["**The volume of a cylinder is πr² × height.**"],
        CYL_PIC,
        "A stack of circles: the circle's area times the height.",
      ),
      reworded(S9, CYL, "A cylinder is a prism", { tag: "The rule" }),

      reworded(S9, CYL, "The area of a circle with radius 3 cm", { tag: "Check you remember" }),
      reworded(S9, CYL, "A prism's volume", {
        tag: "Check you remember",
        text: "Cross-section 12 cm², length 5 cm. Its volume?",
      }),

      methodCard("The method", cylMethod, CYL_PIC),
      workedFrom(S9, CYL),
      calc(
        "Your turn",
        "Find the volume, to 1 decimal place.",
        cylinder("2 cm", "6 cm"),
        [
          ["Circle: $\\pi \\times 2^2 =$", "12.57", "πr².", { after: "cm²" }],
          ["Volume: $12.57 \\times 6 =$", "75.4", "Times the height.", { after: "cm³" }],
        ],
        "75.4 cm³.",
      ),

      calc(
        "Practise",
        "Find the volume, to 1 decimal place.",
        cylinder("6 cm", "5 cm", true),
        [
          ["Radius:", "3", "Half the diameter.", { after: "cm" }],
          ["Circle: $\\pi \\times 3^2 =$", "28.27", "πr².", { after: "cm²" }],
          ["Volume:", "141.4", "Times the height.", { after: "cm³" }],
        ],
        "141.4 cm³.",
      ),
      reworded(S9, CYL, "Radius 4 cm, height 5 cm", { tag: "Practise", title: "A cylinder" }),
      reworded(S9, CYL, "Diameter 10 cm, height 6 cm", {
        tag: "Practise",
        title: "Given the diameter",
      }),
      reworded(S9, CYL, "Radius 5 cm, height 8 cm", { tag: "Practise", title: "Another cylinder" }),
      reworded(S9, CYL, "Diameter 8 cm, height 12 cm", {
        tag: "Practise",
        title: "Halve the diameter",
      }),
      questionSet(
        "Practise",
        "Find each one, to 1 d.p. Watch what changes.",
        [
          ask("Find the volume.", "31.4", "$\\pi \\times 1 \\times 10$.", "31.4 cm³.", {
            unit: "cm³",
            asks: "volume",
            picture: cylinder("1 cm", "10 cm"),
          }),
          ask("Find the volume.", "62.8", "Twice as tall.", "62.8 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Twice as tall.",
            picture: cylinder("1 cm", "20 cm"),
          }),
          ask("Find the volume.", "37.7", "$\\pi \\times 4 \\times 3$.", "37.7 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Wider and shorter.",
            picture: cylinder("2 cm", "3 cm"),
          }),
          ask("Find the area of the top.", "12.6", "$\\pi \\times 2^2$.", "12.6 cm².", {
            unit: "cm²",
            asks: "area",
            changed: "Just the circle.",
            picture: cylinder("2 cm", "3 cm"),
          }),
        ],
        "Circle first, then times the height.",
      ),

      questionSet(
        "Variation",
        "Find the volume, to 1 d.p. Watch what changes.",
        [
          ask("Find the volume.", "113.1", "$\\pi \\times 9 \\times 4$.", "113.1 cm³.", {
            unit: "cm³",
            asks: "volume",
            picture: cylinder("3 cm", "4 cm"),
            expect: [
              "Max works out $\\pi \\times 6 \\times 4$. Right?",
              "No",
              "Square the radius: $\\pi \\times 9 \\times 4 = 113.1$.",
              [["Yes", "$r^2$ means r × r, not 2r."]],
            ],
          }),
          ask("Find the volume.", "113.1", "Halve the diameter first.", "113.1 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "The diameter given.",
            picture: cylinder("6 cm", "4 cm", true),
          }),
          ask("Find the volume.", "452.4", "$\\pi \\times 36 \\times 4$.", "452.4 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Radius doubled.",
            picture: cylinder("6 cm", "4 cm"),
          }),
          ask("Find the volume.", "226.2", "$\\pi \\times 9 \\times 8$.", "226.2 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Height doubled.",
            picture: cylinder("3 cm", "8 cm"),
          }),
        ],
        "Double the radius: four times the volume. Double the height: twice.",
      ),
      reworded(
        S9,
        CYL,
        "Where did it go wrong?",
        { text: "Ella finds the volume.", picture: cylinder("10 cm", "4 cm", true) },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find the volume, to 1 d.p.",
            "125.7 cm³",
            ["62.8 cm³", "40.0 cm³"],
            "$\\pi \\times 4 \\times 10$.",
            cylinder("2 cm", "10 cm"),
          ],
          [
            "Find the volume, to 1 d.p.",
            "28.3 cm³",
            ["18.8 cm³", "9.0 cm³"],
            "$\\pi \\times 9 \\times 1$.",
            cylinder("3 cm", "1 cm"),
          ],
        ],
        [
          [
            "Find the volume, to 1 d.p.",
            "88.0 cm³",
            ["351.9 cm³", "44.0 cm³"],
            "Radius 2: $\\pi \\times 4 \\times 7$.",
            cylinder("4 cm", "7 cm", true),
          ],
          [
            "Find the volume, to 1 d.p.",
            "50.3 cm³",
            ["201.1 cm³", "25.1 cm³"],
            "Radius 2: $\\pi \\times 4 \\times 4$.",
            cylinder("4 cm", "4 cm", true),
          ],
        ],
        [
          [
            "Which is the volume of a cylinder?",
            "$\\pi r^2 h$",
            ["$2\\pi r h$", "$\\pi r h$"],
            "Circle × height.",
            cylinder("r", "h"),
          ],
          [
            "A cylinder's volume is",
            "the circle's area × height",
            ["the radius × height", "the diameter × height"],
            "A stack of circles.",
            cylinder("r", "h"),
          ],
        ],
      ]),

      reworded(
        S9,
        CYL,
        "Will it fit?",
        { tag: "Real life", text: "Find the volume of the tin, to 1 decimal place." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The volume of a cylinder is πr² × height.**"],
        CYL_PIC,
        [
          "**The volume of a cylinder is πr² × height.**",
          "Given the diameter? Halve it first.",
          "Square the radius: $r^2$ is r × r.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Similar shapes.

const SIMILAR = "y9-similarity/similar-shapes";
const similarMethod = [
  "Find a pair of matching sides.",
  "Scale factor = new ÷ old.",
  "Multiply the side you want by it.",
];
const TWICE = similar(2, ["4 cm", "3 cm"], ["8 cm", "6 cm"]);

const similarShapes = stepped(find(S9, SIMILAR), {
  method: similarMethod,
  variation: {
    relationship: "similar shapes: every length times one scale factor",
    unknowns: ["length", "scale factor"],
    surface: ["bigger scale factors", "decimal scale factors", "going smaller"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Similar shapes",
        ["**Similar shapes: every length times the same scale factor.**"],
        TWICE,
        "Here every side doubles; the angles stay the same.",
      ),
      reworded(S9, SIMILAR, "Same shape, different size", { tag: "The rule" }),
      reworded(S9, SIMILAR, "Similar to a 2 cm by 3 cm rectangle?", { tag: "The rule" }),

      ...owned(S9, SIMILAR, "Warm-up", "Check you remember"),

      methodCard("The method", similarMethod, TWICE),
      workedFrom(S9, SIMILAR),
      calc(
        "Your turn",
        "The triangles are similar. Find x.",
        similar(1.5, ["4 cm", "6 cm"], ["6 cm", null]),
        [
          ["Scale factor: $6 \\div 4 =$", "1.5", "New ÷ old."],
          ["$x = 6 \\times 1.5 =$", "9", "Times the scale factor.", { after: "cm" }],
        ],
        "$x = 9$ cm.",
      ),

      calc(
        "Practise",
        "The triangles are similar. Find x.",
        similar(0.5, ["10 cm", "8 cm"], ["5 cm", null]),
        [
          ["Scale factor: $5 \\div 10 =$", "0.5", "New ÷ old."],
          ["$x = 8 \\times 0.5 =$", "4", "Times the scale factor.", { after: "cm" }],
        ],
        "$x = 4$ cm.",
      ),
      reworded(S9, SIMILAR, "Similar rectangles", {
        tag: "Practise",
        start: "3 by 5 is similar to 6 by $x$. Find x.",
      }),
      reworded(S9, SIMILAR, "Going smaller", {
        tag: "Practise",
        start: "The triangles are similar. Find x.",
      }),
      reworded(
        S9,
        SIMILAR,
        "Find x",
        { tag: "Practise", text: "The triangles are similar." },
        "Your turn",
      ),
      questionSet(
        "Practise",
        "The triangles are similar. Watch what changes.",
        [
          ask("Find x.", "8", "Scale factor 2.", "8 cm.", {
            unit: "cm",
            asks: "length",
            picture: similar(2, ["3 cm", "4 cm"], ["6 cm", null]),
          }),
          ask("Find the scale factor.", "2", "6 ÷ 3.", "2.", {
            asks: "scale factor",
            changed: "Now the scale factor.",
            picture: similar(2, ["3 cm", "4 cm"], ["6 cm", "8 cm"]),
          }),
          ask("Find x.", "5", "Divide by 2.", "5 cm.", {
            unit: "cm",
            asks: "length",
            changed: "Backwards.",
            picture: similar(2, ["3 cm", null], ["6 cm", "10 cm"]),
          }),
          ask("Find x.", "3", "Scale factor 1.5.", "3 cm.", {
            unit: "cm",
            asks: "length",
            changed: "A decimal scale factor.",
            picture: similar(1.5, ["4 cm", "2 cm"], ["6 cm", null], "x", 2),
          }),
        ],
        "Scale factor first, then multiply.",
      ),

      questionSet(
        "Variation",
        "The triangles are similar. Find x.",
        [
          ask("Find x.", "15", "Scale factor 3.", "15 cm.", {
            unit: "cm",
            asks: "length",
            picture: similar(3, ["2 cm", "5 cm"], ["6 cm", null], "x", 2.5),
            expect: [
              "2 cm became 6 cm, so Ali adds 4 to 5. Right?",
              "No",
              "2 was multiplied by 3, so $5 \\times 3 = 15$.",
              [["Yes", "Similar means multiply, not add."]],
            ],
          }),
          ask("Find x.", "20", "Scale factor 4.", "20 cm.", {
            unit: "cm",
            asks: "length",
            changed: "Scale factor 4.",
            picture: similar(4, ["2 cm", "5 cm"], ["8 cm", null], "x", 2.5),
          }),
          ask("Find x.", "12.5", "Scale factor 2.5.", "12.5 cm.", {
            unit: "cm",
            asks: "length",
            changed: "Scale factor 2.5.",
            picture: similar(2.5, ["2 cm", "5 cm"], ["5 cm", null], "x", 2.5),
          }),
          ask("Find x.", "2.5", "Scale factor 0.5.", "2.5 cm.", {
            unit: "cm",
            asks: "length",
            changed: "Smaller.",
            picture: similar(0.5, ["2 cm", "5 cm"], ["1 cm", null], "x", 2.5),
          }),
        ],
        "Similar means multiply by the scale factor, never add.",
      ),
      reworded(
        S9,
        SIMILAR,
        "Where did it go wrong?",
        { text: "Sam finds x.", picture: similar(1.5, ["4 cm", "10 cm"], ["6 cm", null]) },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find x.",
            "15 cm",
            ["11 cm", "45 cm"],
            "Scale factor 3.",
            similar(3, ["3 cm", "5 cm"], ["9 cm", null]),
          ],
          [
            "Find x.",
            "6 cm",
            ["8 cm", "1.5 cm"],
            "Scale factor 2.",
            similar(2, ["5 cm", "3 cm"], ["10 cm", null]),
          ],
        ],
        [
          [
            "Find x.",
            "6 cm",
            ["9 cm", "37.5 cm"],
            "Scale factor 0.4.",
            similar(0.4, ["10 cm", "15 cm"], ["4 cm", null]),
          ],
          [
            "Find x.",
            "4 cm",
            ["2 cm", "16 cm"],
            "Scale factor 0.5.",
            similar(0.5, ["12 cm", "8 cm"], ["6 cm", null]),
          ],
        ],
        [
          [
            "Which is similar to a 4 cm by 6 cm rectangle?",
            "6 cm by 9 cm",
            ["6 cm by 8 cm", "5 cm by 7 cm"],
            "Both × 1.5.",
          ],
          [
            "Which is similar to a 2 cm by 5 cm rectangle?",
            "4 cm by 10 cm",
            ["4 cm by 7 cm", "3 cm by 6 cm"],
            "Both × 2.",
          ],
        ],
      ]),

      reworded(
        S9,
        SIMILAR,
        "How tall is the tree?",
        { tag: "Real life", start: "The post and tree make similar triangles with their shadows." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Similar shapes: every length times the same scale factor.**"],
        TWICE,
        [
          "**Similar shapes: every length times the same scale factor.**",
          "Scale factor = new ÷ old.",
          "Multiply, never add.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Enlargement.

const ENLARGE = "y9-similarity/enlargement";
const enlargeMethod = [
  "Take each corner's coordinates.",
  "Multiply both by the scale factor.",
  "Plot the new corners and join them.",
];
const T: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 3 },
];
const GROWN: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
  shapes: [
    { points: T, label: "A" },
    { points: T.map((p) => ({ x: p.x * 2, y: p.y * 2 })), tone: "image", label: "B" },
  ],
};
const pointAt = (p: string) => p.replace(/-/g, "−");

const enlargement = stepped(find(S9, ENLARGE), {
  method: enlargeMethod,
  variation: {
    relationship: "enlarging about (0, 0) multiplies every coordinate",
    unknowns: ["image", "scale factor"],
    surface: ["fractions", "negative scale factors", "bigger factors"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Enlargement",
        ["**Enlarge about (0, 0): multiply every coordinate by the scale factor.**"],
        GROWN,
        "Every length doubles here; the angles stay the same.",
      ),
      reworded(S9, ENLARGE, "Enlarge by scale factor 2, about (0, 0)", { tag: "The rule" }),

      reworded(S9, ENLARGE, "Double both numbers in (2, 3)", { tag: "Check you remember" }),
      reworded(
        S9,
        ENLARGE,
        "A triangle's sides are 2, 3 and 4 cm. Every side doubles. How long is the longest side now?",
        { tag: "Check you remember", title: "Sides of 2, 3 and 4 cm all double. The longest?" },
      ),

      methodCard("The method", enlargeMethod, GROWN),
      workedFrom(S9, ENLARGE),
      calc(
        "Your turn",
        "Enlarge (3, 1) by scale factor 3, about (0, 0).",
        undefined,
        [
          ["New x: $3 \\times 3 =$", "9", "Multiply."],
          ["New y: $1 \\times 3 =$", "3", "Multiply."],
        ],
        "(3, 1) goes to (9, 3).",
      ),

      calc(
        "Practise",
        "Enlarge (8, 4) by scale factor $\\frac14$, about (0, 0).",
        undefined,
        [
          ["New x:", "2", "A quarter of 8."],
          ["New y:", "1", "A quarter of 4."],
        ],
        "(8, 4) goes to (2, 1).",
      ),
      ...owned(S9, ENLARGE, "Together", "Practise"),
      reworded(S9, ENLARGE, "Scale factor −1", {
        tag: "Practise",
        text: "A went through (0, 0) to B. Name it.",
      }),
      ...owned(S9, ENLARGE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Enlarge (4, 2) about (0, 0). Watch what changes.",
        [
          ask("Scale factor 3?", "(12, 6)", "Multiply both.", "(12, 6).", {
            asks: "image",
            others: ["(7, 5)", "(12, 2)"],
          }),
          ask("Scale factor $\\frac12$?", "(2, 1)", "Halve both.", "(2, 1).", {
            asks: "image",
            changed: "A fraction.",
            others: ["(8, 4)", "(3.5, 1.5)"],
          }),
          ask("Scale factor −1?", pointAt("(-4, -2)"), "Change both signs.", "(−4, −2).", {
            asks: "image",
            changed: "Negative.",
            others: [pointAt("(4, -2)"), pointAt("(-4, 2)")],
          }),
          ask("It goes to (10, 5). Scale factor?", "2.5", "10 ÷ 4.", "2.5.", {
            asks: "scale factor",
            changed: "Backwards.",
            others: ["6", "3"],
          }),
        ],
        "Multiply both coordinates by the scale factor.",
      ),

      questionSet(
        "Variation",
        "Enlarge (3, 1) about (0, 0). Watch what changes.",
        [
          ask("Scale factor 2?", "(6, 2)", "Multiply both.", "(6, 2).", {
            asks: "image",
            others: ["(5, 3)", "(6, 1)"],
            expect: [
              "Kai adds 2 to each: (5, 3). Right?",
              "No",
              "A scale factor multiplies: (6, 2).",
              [["Yes", "Scale factors multiply."]],
            ],
          }),
          ask("Scale factor 4?", "(12, 4)", "Multiply both.", "(12, 4).", {
            asks: "image",
            changed: "Scale factor 4.",
            others: ["(7, 5)", "(12, 1)"],
          }),
          ask(
            "Scale factor $\\frac13$?",
            "(1, $\\frac13$)",
            "A third of each.",
            "(1, $\\frac13$).",
            {
              asks: "image",
              changed: "A third.",
              others: ["(9, 3)", pointAt("(0, -2)")],
            },
          ),
          ask("Scale factor −2?", pointAt("(-6, -2)"), "Double, then change signs.", "(−6, −2).", {
            asks: "image",
            changed: "Negative.",
            others: ["(6, 2)", pointAt("(1, -1)")],
          }),
        ],
        "Multiply, whatever the scale factor.",
      ),
      reworded(
        S9,
        ENLARGE,
        "Where did it go wrong?",
        { text: "Kai enlarges (3, 1) by scale factor 2, about (0, 0)." },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "(2, 5), scale factor 3, about (0, 0)?",
            "(6, 15)",
            ["(5, 8)", "(6, 5)"],
            "Multiply both.",
          ],
          [
            "(4, 1), scale factor 3, about (0, 0)?",
            "(12, 3)",
            ["(7, 4)", "(12, 1)"],
            "Multiply both.",
          ],
        ],
        [
          [
            "(6, 4), scale factor $\\frac12$, about (0, 0)?",
            "(3, 2)",
            ["(12, 8)", "(5.5, 3.5)"],
            "Halve both.",
          ],
          [
            "(8, 2), scale factor $\\frac12$, about (0, 0)?",
            "(4, 1)",
            ["(16, 4)", "(7.5, 1.5)"],
            "Halve both.",
          ],
        ],
        [
          [
            "(3, 2), scale factor −1, about (0, 0)?",
            pointAt("(-3, -2)"),
            [pointAt("(3, -2)"), "(2, 3)"],
            "Change both signs.",
          ],
          [
            "(1, 5), scale factor −1, about (0, 0)?",
            pointAt("(-1, -5)"),
            [pointAt("(-1, 5)"), "(5, 1)"],
            "Change both signs.",
          ],
        ],
      ]),

      reworded(S9, ENLARGE, "The projector", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Enlarge about (0, 0): multiply every coordinate by the scale factor.**"],
        GROWN,
        [
          "**Enlarge about (0, 0): multiply every coordinate by the scale factor.**",
          "Scale factor $\\frac12$ makes it smaller.",
          "Scale factor −1 goes through the centre and out.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Proof.

const PROOF = "y9-similarity/proof";
const proofMethod = [
  "Find an angle you know a fact about.",
  "Write the step and its reason.",
  "Chain the steps until you reach what you want.",
];
const PROVE = picOf(PROOF, "Prove it: a triangle's angles make 180°");
const RULES = [
  "Alternate angles are equal",
  "Corresponding angles are equal",
  "Co-interior angles add to 180°",
];
const which = (pic: DrawingPic, right: string, extra: Record<string, unknown>) =>
  ask("Which fact gives x?", right, "Look at where x sits.", `${right}.`, {
    asks: "reason",
    others: RULES.filter((r) => r !== right),
    picture: pic,
    ...extra,
  });

const proof = stepped(find(S9, PROOF), {
  method: proofMethod,
  variation: {
    relationship: "a proof: steps with reasons that work for every case",
    unknowns: ["reason", "angle", "proof"],
    surface: ["Z, F and C angles", "more examples", "a counter-example"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Proving it",
        ["**A proof is a chain of steps, each with a reason, for every case.**"],
        PROVE,
        "Measuring some cases is never a proof.",
      ),
      reworded(S9, PROOF, "Angles and parallel lines", { tag: "The rule" }),

      ...owned(S9, PROOF, "Warm-up", "Check you remember"),

      methodCard("The method", proofMethod, PROVE),
      workedFrom(S9, PROOF),
      calc(
        "Your turn",
        "Find y.",
        lines(60, ["up-right", "60°"], ["down-right", "y"]),
        [
          [
            "The Z angle at the top:",
            "60",
            "Alternate to the 60°.",
            { after: "°", reason: REASON.zAngles },
          ],
          [
            "$y = 180 - 60 =$",
            "120",
            "Next to it on the line.",
            { after: "°", reason: REASON.straightLine },
          ],
        ],
        "$y = 120°$.",
      ),

      calc(
        "Practise",
        "Find b.",
        lines(70, ["up-right", "70°"], ["down-right", "b"]),
        [
          [
            "$b = 180 - 70 =$",
            "110",
            "Same side, between the lines.",
            { after: "°", reason: REASON.cAngles },
          ],
        ],
        "$b = 110°$.",
      ),
      reworded(S9, PROOF, "Find a and b", { tag: "Practise" }),
      reworded(S9, PROOF, "An isosceles triangle", {
        tag: "Practise",
        start: "The triangle is isosceles. Find x.",
      }),
      ...owned(S9, PROOF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Name the fact. Watch what changes.",
        [
          which(
            lines(65, ["up-right", "65°"], ["down-left", "x"]),
            "Alternate angles are equal",
            {},
          ),
          which(
            lines(65, ["up-right", "65°"], ["up-right", "x"]),
            "Corresponding angles are equal",
            {
              changed: "Same position.",
            },
          ),
          which(
            lines(65, ["up-right", "65°"], ["down-right", "x"]),
            "Co-interior angles add to 180°",
            {
              changed: "Same side, between.",
            },
          ),
          ask("Find x.", "115", "Co-interior.", "115°.", {
            unit: "°",
            asks: "angle",
            changed: "Now the angle.",
            picture: lines(65, ["up-right", "65°"], ["down-right", "x"]),
          }),
        ],
        "Z and F: equal. C: add to 180°.",
      ),

      questionSet(
        "Variation",
        "Is it a proof? Watch what changes.",
        [
          ask(
            "Three triangles each make 180°. A proof?",
            "No: only those three",
            "What about the rest?",
            "No.",
            {
              asks: "proof",
              others: ["Yes"],
              expect: [
                "Ava measured three triangles: 180° each. Does that prove it?",
                "No",
                "It only checks those three, not every triangle.",
                [["Yes", "There are endless triangles."]],
              ],
            },
          ),
          ask(
            "Ten triangles each make 180°. A proof?",
            "No: still only ten",
            "Still not every case.",
            "No.",
            {
              asks: "proof",
              changed: "More examples.",
              others: ["Yes"],
            },
          ),
          ask(
            "Angle facts show it for any triangle. A proof?",
            "Yes",
            "Every case at once.",
            "Yes.",
            {
              asks: "proof",
              changed: "A general argument.",
              others: ["No: it needs measuring"],
            },
          ),
          ask(
            "One triangle doesn't make 180°. What would that show?",
            "The claim is false",
            "One is enough.",
            "It's false.",
            {
              asks: "proof",
              changed: "A counter-example.",
              others: ["Nothing", "It's true for most"],
            },
          ),
        ],
        "Examples can disprove; only a general argument proves.",
      ),
      reworded(
        S9,
        PROOF,
        "Where did it go wrong?",
        { text: "Parallel lines, one angle 70°. Jo finds three more." },
        "Spot the mistake",
      ),

      own(S9, PROOF, "Exit check"),

      reworded(
        S9,
        PROOF,
        "Prove it: a triangle's angles make 180°",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A proof is a chain of steps, each with a reason, for every case.**"],
        PROVE,
        [
          "**A proof is a chain of steps, each with a reason, for every case.**",
          "Z and F angles are equal; C angles add to 180°.",
          "Examples aren't proof; one counter-example disproves.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y9SimilarityStepped: [string, UnitLesson[]][] = [
  [SURFACE, [surfaceArea]],
  [CYL, [cylinderVolume]],
  [SIMILAR, [similarShapes]],
  [ENLARGE, [enlargement]],
  [PROOF, [proof]],
];
