// GCSE Foundation, "Perimeter and area", as three short lessons, one just before each skill: the
// areas of triangles, parallelograms and trapezia, the volume of prisms, and the volume of
// cylinders. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common
// mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Point, ShapePic, UnitLesson } from "./types.ts";

const U = "gf-area";
const P = (x: number, y: number): Point => ({ x, y });
const shape = (points: Point[], extra: Partial<ShapePic> = {}): ShapePic => ({
  kind: "shape",
  points,
  ...extra,
});
const trapezium = shape([P(0, 0), P(8, 0), P(6, 4), P(2, 4)], {
  sides: ["10 cm", null, "6 cm", null],
  dashed: [[P(2, 4), P(2, 0)]],
});

export const gfArea: UnitLesson[] = [
  lesson(
    U,
    "area",
    "GF-G16.a",
    "Triangles, parallelograms and trapezia",
    "Use the perpendicular height in every area formula.",
    [
      problem(
        "The flower bed",
        [
          "A flower bed is a trapezium: parallel sides 10 m and 6 m, 4 m apart. A bag of compost covers 5 m². How many bags?",
          "By the end of this lesson, you can find the area, and finish the question.",
        ],
        trapezium,
      ),
      typed("Warm-up", "Area of a 6 by 4 rectangle", "24", "Length × width.", "24."),
      typed("Warm-up", "Half of 24", "12", "Halve.", "12."),
      explain(
        "Discover",
        "Three formulae",
        [
          "**Triangle**: $\\frac12 bh$. **Parallelogram**: $bh$. **Trapezium**: $\\frac12(a + b)h$, where $a$ and $b$ are the parallel sides.",
          "Each uses the **perpendicular** height: at right angles to the base, not the slanted side.",
        ],
        shape([P(0, 0), P(6, 0), P(8, 3), P(2, 3)], {
          sides: ["6 cm", null, null, null],
          dashed: [[P(2, 3), P(2, 0)]],
        }),
      ),
      {
        kind: "morph",
        tag: "Discover",
        title: "Why the trapezium formula works",
        text: "Turn a copy of the trapezium round and put it beside the first.",
        shape: "trapezium",
        dims: [6, 10, 4, 2],
        done: "Two trapezia make a parallelogram, $(a + b)$ long and $h$ high. One is half of that: $\\frac12(a + b)h$.",
      },
      worked(
        "The flower bed",
        "Find the area and the number of bags.",
        [
          ["$\\frac12(10 + 6) \\times 4$", "Trapezium."],
          ["$= 8 \\times 4 = 32$ m²", "Area."],
          ["$32 \\div 5 = 6.4$, so 7 bags", "Round up: 6 bags isn't enough."],
        ],
        "Real-life answers often need rounding up.",
      ),
      steps(
        "Together",
        "A triangle: base 9 cm, height 7 cm, slant side 8 cm",
        "Find its area.",
        [
          [
            "Which lengths?",
            "base 9 and height 7",
            ["9 and 8", "8 is slanted: use the perpendicular height."],
            "$\\frac12 \\times 9 \\times 7$",
          ],
          ["Area:", "31.5 cm²", ["63 cm²", "Halve it."], "31.5 cm²"],
        ],
        "Ignore the slant side.",
      ),
      choose(
        "Together",
        "A parallelogram: base 12, slant side 5, height 4. Area?",
        "48",
        "$12 \\times 4$.",
        [
          ["60", "Use the height, not the slant."],
          ["24", "No half for a parallelogram."],
        ],
      ),
      typed(
        "Your turn",
        "Trapezium: parallel sides 5 and 9, height 6",
        "42",
        "$\\frac12 \\times 14 \\times 6$.",
        "42.",
        {
          wrong: [
            ["84", "Halve it."],
            ["270", "Add the parallel sides."],
          ],
        },
      ),
      typed(
        "Your turn",
        "Triangle area 30 cm², base 12 cm. Height?",
        "5",
        "$\\frac12 \\times 12 \\times h = 30$.",
        "5 cm.",
        { unit: "cm", wrong: [["2.5", "$6h = 30$."]] },
      ),
      choose(
        "Watch out",
        "For a parallelogram, Sam multiplies the base by the slanted side. What's wrong?",
        "Use the perpendicular height",
        "Slant sides are longer than the height.",
        [["Nothing", "Area uses the height at 90° to the base."]],
      ),
      mistake(
        "Ola finds a trapezium's area: sides 8 and 4, height 3.",
        ["$a + b = 12$", "$12 \\times 3 = 36$", "Area = 36"],
        2,
        "Halve it: $\\frac12 \\times 36 = 18$.",
      ),
      typed(
        "Back to the problem",
        "“How many bags of compost (5 m² each) for the 32 m² bed?”",
        "7",
        "6.4, so round up.",
        "7 bags.",
        {
          wrong: [
            ["6", "6 bags only cover 30 m²."],
            ["6.4", "You can't buy 0.4 of a bag."],
          ],
        },
      ),
      quiz([
        [
          ["Triangle, base 10, height 6", "30", ["60", "16"], "$\\frac12 \\times 60$."],
          ["Triangle, base 8, height 5", "20", ["40", "13"], "$\\frac12 \\times 40$."],
        ],
        [
          ["Parallelogram, base 7, height 4", "28", ["14", "11"], "$7 \\times 4$."],
          ["Parallelogram, base 9, height 3", "27", ["13.5", "12"], "$9 \\times 3$."],
        ],
        [
          ["Trapezium, 4 and 6, height 5", "25", ["50", "120"], "$\\frac12 \\times 10 \\times 5$."],
          ["Trapezium, 3 and 7, height 4", "20", ["40", "84"], "$\\frac12 \\times 10 \\times 4$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "prisms",
    "GF-G16.b",
    "Volume of prisms",
    "Volume = area of the cross-section × length.",
    [
      problem(
        "The chocolate bar",
        [
          "A chocolate bar is a triangular prism: its triangular end has base 4 cm and height 3 cm, and it's 20 cm long. What's its volume?",
          "By the end of this lesson, you can find the volume of any prism.",
        ],
        { kind: "cuboid", w: 5, d: 2, h: 2, cubes: true },
      ),
      typed(
        "Warm-up",
        "Volume of a 5 by 2 by 2 cuboid",
        "20",
        "$5 \\times 2 \\times 2$.",
        "20 cm³.",
        { unit: "cm³" },
      ),
      typed("Warm-up", "Area of a triangle, base 4, height 3", "6", "$\\frac12 \\times 12$.", "6."),
      explain(
        "Discover",
        "Layers of the cross-section",
        [
          "A **prism** has the same cross-section all the way along. Its volume is the area of that cross-section, stacked up its length.",
          "So **volume = area of cross-section × length**. Units are cubed: cm³, m³.",
        ],
        { kind: "cuboid", w: 5, d: 2, h: 2, cubes: true },
      ),
      {
        kind: "morph",
        tag: "Discover",
        title: "Stack the layers",
        text: "Each layer is the cross-section. Slide to stack them.",
        shape: "cuboid",
        dims: [4, 3, 5],
        done: "Area of one layer × number of layers = volume.",
      },
      worked(
        "The chocolate bar",
        "Triangular end: base 4, height 3. Length 20. Find the volume.",
        [
          ["Cross-section: $\\frac12 \\times 4 \\times 3 = 6$ cm²", "The triangle."],
          ["Volume: $6 \\times 20 = 120$ cm³", "Times the length."],
        ],
        "Find the end's area first.",
      ),
      steps(
        "Together",
        "An L-shaped prism: cross-section 14 cm², length 9 cm",
        "Volume.",
        [
          [
            "Volume = area × length:",
            "$14 \\times 9$",
            ["$14 + 9$", "Multiply."],
            "$14 \\times 9$",
          ],
          ["So", "126 cm³", ["23 cm³", "$14 \\times 9 = 126$."], "126 cm³"],
        ],
        "Any shape of cross-section works.",
      ),
      steps(
        "Together",
        "A prism has volume 240 cm³ and length 12 cm",
        "Find the cross-section's area.",
        [
          ["Area × 12 = 240, so area =", "20 cm²", ["2880 cm²", "Divide."], "20 cm²"],
          ["Units:", "cm²", ["cm³", "An area is squared."], "20 cm²"],
        ],
        "Rearrange: area = volume ÷ length.",
      ),
      typed(
        "Your turn",
        "Trapezium cross-section 18 cm², length 10 cm. Volume?",
        "180",
        "$18 \\times 10$.",
        "180 cm³.",
        { unit: "cm³" },
      ),
      typed(
        "Your turn",
        "A tent: triangle end, base 2 m, height 1.5 m, length 3 m. Volume?",
        "4.5",
        "$\\frac12 \\times 2 \\times 1.5 = 1.5$; times 3.",
        "4.5 m³.",
        { unit: "m³", wrong: [["9", "Halve for the triangle."]] },
      ),
      choose(
        "Watch out",
        "Ivy multiplies all the lengths she can see on a triangular prism: base, height, slant side and length. What's wrong?",
        "Volume uses the cross-section's area × length: not every length",
        "Find the triangle's area first.",
        [["Nothing", "The slant side isn't needed."]],
      ),
      mistake(
        "Kai finds a triangular prism's volume: base 6, height 4, length 10.",
        ["Cross-section: $6 \\times 4 = 24$", "Volume: $24 \\times 10 = 240$", "240 cm³"],
        0,
        "A triangle's area is half: 12 cm², so 120 cm³.",
      ),
      typed(
        "Back to the problem",
        "“The bar's triangular end has base 4 cm and height 3 cm; it's 20 cm long. Work out its volume.”",
        "120",
        "$6 \\times 20$.",
        "120 cm³.",
        { unit: "cm³", wrong: [["240", "Halve for the triangle."]] },
      ),
      quiz([
        [
          ["Cross-section 25 cm², length 8 cm", "200 cm³", ["33 cm³", "200 cm²"], "× length."],
          ["Cross-section 12 cm², length 15 cm", "180 cm³", ["27 cm³", "180 cm²"], "× length."],
        ],
        [
          [
            "Triangle end base 5, height 4, length 10",
            "100 cm³",
            ["200 cm³", "19 cm³"],
            "Area 10, × 10.",
          ],
          [
            "Triangle end base 6, height 2, length 7",
            "42 cm³",
            ["84 cm³", "15 cm³"],
            "Area 6, × 7.",
          ],
        ],
        [
          ["Volume 90, length 9. Cross-section?", "10 cm²", ["810 cm²", "81 cm²"], "$90 \\div 9$."],
          [
            "Volume 150, length 6. Cross-section?",
            "25 cm²",
            ["900 cm²", "144 cm²"],
            "$150 \\div 6$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "cylinders",
    "GF-G16.c",
    "Volume of cylinders",
    "A cylinder is a circular prism: V = πr²h.",
    [
      problem("The tin of soup", [
        "A soup tin has radius 4 cm and height 11 cm. Does it hold 500 cm³ of soup?",
        "By the end of this lesson, you can find the volume of any cylinder.",
      ]),
      choose(
        "Warm-up",
        "Area of a circle, radius 4, in terms of π",
        "$16\\pi$",
        "$\\pi \\times 4^2$.",
        [
          ["$8\\pi$", "That's the circumference."],
          ["$4\\pi$", "Square the radius."],
        ],
      ),
      typed("Warm-up", "Work out $16 \\times 11$", "176", "$160 + 16$.", "176."),
      explain(
        "Discover",
        "A circular prism",
        [
          "A cylinder is a prism with a circle for its cross-section. So volume = area of circle × height.",
          "$V = \\pi r^2 h$. Use the radius: halve a diameter first.",
        ],
        { kind: "maths", tex: "V = \\pi r^2 h" },
      ),
      choose(
        "Discover",
        "A cylinder with radius 3 and height 10: volume in terms of π",
        "$90\\pi$",
        "$\\pi \\times 9 \\times 10$.",
        [
          ["$30\\pi$", "Square the radius."],
          ["$60\\pi$", "$3^2 = 9$, not 6."],
        ],
      ),
      worked(
        "The soup tin",
        "Radius 4 cm, height 11 cm. Volume?",
        [
          ["$V = \\pi \\times 4^2 \\times 11$", "Formula."],
          ["$= 176\\pi = 552.9$ cm³", "Calculate."],
          ["552.9 > 500, so yes", "Answer the question."],
        ],
        "It holds 500 cm³ with room to spare.",
      ),
      steps(
        "Together",
        "A pipe: diameter 10 cm, length 2 m (200 cm)",
        "Volume.",
        [
          ["Radius:", "5 cm", ["10 cm", "Halve the diameter."], "$r = 5$"],
          [
            "Volume:",
            "$5000\\pi$ cm³",
            ["$20000\\pi$ cm³", "$5^2 = 25$, not 100."],
            "$\\pi \\times 25 \\times 200$",
          ],
        ],
        "Same units throughout: cm.",
      ),
      steps(
        "Together",
        "A cylinder holds $72\\pi$ cm³ and has radius 3 cm",
        "Find its height.",
        [
          [
            "$\\pi \\times 9 \\times h = 72\\pi$, so $9h =$",
            "72",
            ["$72\\pi$", "Divide both sides by π."],
            "$9h = 72$",
          ],
          ["$h =$", "8 cm", ["63 cm", "$72 \\div 9$."], "8 cm"],
        ],
        "Rearrange to find a missing length.",
      ),
      typed(
        "Your turn",
        "Radius 2, height 5: volume to 1 d.p.",
        "62.8",
        "$\\pi \\times 4 \\times 5$.",
        "62.8.",
        { wrong: [["31.4", "$2^2 = 4$."]] },
      ),
      choose(
        "Your turn",
        "Diameter 6, height 4: volume in terms of π",
        "$36\\pi$",
        "$r = 3$: $\\pi \\times 9 \\times 4$.",
        [
          ["$144\\pi$", "Halve the diameter first."],
          ["$24\\pi$", "$3^2 = 9$."],
        ],
      ),
      choose(
        "Watch out",
        "For a tin with diameter 8 cm, Tom uses $r = 8$. What's wrong?",
        "The radius is half the diameter: 4 cm",
        "Using 8 makes it 4 times too big.",
        [["Nothing", "Check: is 8 the diameter or the radius?"]],
      ),
      mistake(
        "Mia finds a cylinder's volume: radius 5, height 3.",
        ["$V = \\pi r^2 h$", "$= \\pi \\times 10 \\times 3$", "$= 30\\pi$"],
        1,
        "$5^2 = 25$, not 10: $75\\pi$.",
      ),
      choose(
        "Back to the problem",
        "“A tin has radius 4 cm and height 11 cm. Does it hold 500 cm³? Show your working.”",
        "Yes: $V = 176\\pi \\approx 553$ cm³",
        "$\\pi \\times 16 \\times 11$.",
        [
          ["No: $V = 44\\pi \\approx 138$ cm³", "Square the radius."],
          ["No: $V = 352$ cm³", "Use π."],
        ],
      ),
      quiz([
        [
          [
            "Radius 2, height 10, in terms of π",
            "$40\\pi$",
            ["$20\\pi$", "$400\\pi$"],
            "$4 \\times 10$.",
          ],
          [
            "Radius 5, height 4, in terms of π",
            "$100\\pi$",
            ["$40\\pi$", "$80\\pi$"],
            "$25 \\times 4$.",
          ],
        ],
        [
          [
            "Diameter 10, height 2, in terms of π",
            "$50\\pi$",
            ["$200\\pi$", "$20\\pi$"],
            "$r = 5$.",
          ],
          [
            "Diameter 4, height 9, in terms of π",
            "$36\\pi$",
            ["$144\\pi$", "$72\\pi$"],
            "$r = 2$.",
          ],
        ],
        [
          ["$V = 45\\pi$, $r = 3$. Height?", "5", ["15", "405"], "$9h = 45$."],
          ["$V = 64\\pi$, $r = 4$. Height?", "4", ["16", "1024"], "$16h = 64$."],
        ],
      ]),
    ],
  ),
];
