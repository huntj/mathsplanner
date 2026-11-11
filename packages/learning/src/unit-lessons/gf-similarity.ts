// GCSE Foundation, "Congruence and similarity", as three short lessons, one just before each
// skill: comparing lengths, areas and volumes with ratio, the congruence tests, and finding
// missing lengths in similar shapes. Each recaps the Key Stage 3 idea quickly, builds it to GCSE
// level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Point, ShapePic, UnitLesson } from "./types.ts";

const U = "gf-similarity";
const P = (x: number, y: number): Point => ({ x, y });
const tri = (k: number, sides: (string | null)[], names?: string[]): ShapePic => ({
  kind: "shape",
  points: [P(0, 0), P(4 * k, 0), P(1 * k, 3 * k)],
  sides,
  ...(names ? { names } : {}),
});

export const gfSimilarity: UnitLesson[] = [
  lesson(
    U,
    "ratio",
    "GF-R12",
    "Lengths, areas and volumes",
    "Scale lengths by k, areas by k² and volumes by k³.",
    [
      problem(
        "The bigger box",
        [
          "A box is made twice as long, twice as wide and twice as tall. Does it hold twice as much? And how much more card does it need?",
          "Most people guess “twice”. By the end of this lesson, you'll know the real answers, and why.",
        ],
        { kind: "cuboid", w: 2, d: 2, h: 2, cubes: true },
      ),
      typed("Warm-up", "Work out $2^2$", "4", "$2 \\times 2$.", "4."),
      typed("Warm-up", "Work out $2^3$", "8", "$2 \\times 2 \\times 2$.", "8."),
      explain(
        "Discover",
        "Count the squares",
        [
          "Double the sides of a 1 cm square: it becomes 2 cm by 2 cm, which holds **4** small squares.",
          "Areas use two lengths, so they scale by $2 \\times 2 = 4$. Volumes use three, so they scale by $2 \\times 2 \\times 2 = 8$.",
        ],
        { kind: "grid", cols: 2, rows: 2, shaded: 1 },
      ),
      choose(
        "Discover",
        "Lengths are multiplied by 3. Areas are multiplied by",
        "9",
        "$3 \\times 3$.",
        [
          ["3", "Area uses two lengths."],
          ["6", "$3^2$, not $3 \\times 2$."],
        ],
      ),
      worked(
        "The bigger box",
        "Every length doubles. Compare the volumes and surface areas.",
        [
          ["Length scale factor $k = 2$", "Every length doubles."],
          ["Area: $k^2 = 4$ times", "Card needed."],
          ["Volume: $k^3 = 8$ times", "What it holds."],
        ],
        "Twice the size holds 8 times as much.",
      ),
      steps(
        "Together",
        "Two similar triangles, sides 3 cm and 6 cm",
        "Compare.",
        [
          ["Length scale factor:", "2", ["3", "$6 \\div 3$."], "$k = 2$"],
          ["The bigger has area", "4 times as much", ["2 times as much", "Area: $k^2$."], "×4"],
        ],
        "Ratio of areas $1 : 4$.",
      ),
      steps(
        "Together",
        "Ratio of lengths $1 : 3$",
        "Areas and volumes.",
        [
          ["Ratio of areas:", "$1 : 9$", ["$1 : 3$", "Square it."], "$1 : 9$"],
          ["Ratio of volumes:", "$1 : 27$", ["$1 : 9$", "Cube it."], "$1 : 27$"],
        ],
        "Lengths $1 : k$, areas $1 : k^2$, volumes $1 : k^3$.",
      ),
      choose(
        "Your turn",
        "A map scale doubles every length. A field's area on the map",
        "is 4 times bigger",
        "$2^2$.",
        [["doubles", "Area: square the length factor."]],
      ),
      choose(
        "Your turn",
        "Two similar jugs, heights 10 cm and 30 cm. The big one holds",
        "27 times as much",
        "$3^3$.",
        [
          ["3 times as much", "Volume: cube it."],
          ["9 times as much", "That's area."],
        ],
      ),
      choose(
        "Watch out",
        "Ed says doubling a cube's sides doubles its volume. What's wrong?",
        "Volume uses three lengths: $2^3 = 8$ times",
        "Count the small cubes: 8.",
        [["Nothing", "A 2 by 2 by 2 cube holds 8 unit cubes."]],
      ),
      mistake(
        "Similar rugs: lengths 1 m and 3 m. The small one costs £20 (by area).",
        ["Length scale factor: 3", "Area scale factor: 6", "So the big one costs £120"],
        1,
        "Area scale factor is $3^2 = 9$: £180.",
      ),
      choose(
        "Back to the problem",
        "“Each length of a box is doubled. How many times more does it hold?”",
        "8 times",
        "$2^3$.",
        [
          ["2 times", "Volume uses three lengths."],
          ["4 times", "That's the area."],
        ],
      ),
      quiz([
        [
          ["Lengths × 4. Areas ×", "16", ["4", "8"], "$4^2$."],
          ["Lengths × 5. Areas ×", "25", ["5", "10"], "$5^2$."],
        ],
        [
          ["Lengths × 2. Volumes ×", "8", ["2", "4"], "$2^3$."],
          ["Lengths × 3. Volumes ×", "27", ["9", "3"], "$3^3$."],
        ],
        [
          ["Lengths $1 : 2$. Areas", "$1 : 4$", ["$1 : 2$", "$1 : 8$"], "Square."],
          ["Lengths $2 : 3$. Areas", "$4 : 9$", ["$2 : 3$", "$8 : 27$"], "Square."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "congruence",
    "GF-G5",
    "Congruent triangles",
    "SSS, SAS, ASA or RHS prove two triangles are identical.",
    [
      problem(
        "The proof question",
        [
          "“Prove that triangles ABC and DEF are congruent.” You need to name a test and give the matching facts.",
          "By the end of this lesson, you'll know the four tests and how to write the answer.",
        ],
        tri(1, ["4 cm", "3.2 cm", "3.2 cm"], ["A", "B", "C"]),
      ),
      choose(
        "Warm-up",
        "Congruent shapes are",
        "identical in shape and size",
        "One fits exactly on the other.",
        [["the same shape, any size", "That's similar."]],
      ),
      choose(
        "Warm-up",
        "Two triangles have the same three angles. Must they be congruent?",
        "No: one could be bigger",
        "Same angles only proves similar.",
        [["Yes", "An enlargement has the same angles."]],
      ),
      explain(
        "Discover",
        "The four tests",
        [
          "**SSS**: three sides match. **SAS**: two sides and the angle **between** them. **ASA** (or AAS): two angles and a corresponding side.",
          "**RHS**: a right angle, the hypotenuse and one other side. AAA and SSA don't prove congruence.",
        ],
        {
          kind: "table",
          head: ["Test", "What matches"],
          rows: [
            ["SSS", "3 sides"],
            ["SAS", "2 sides + angle between"],
            ["ASA", "2 angles + side"],
            ["RHS", "right angle, hyp, side"],
          ],
        },
      ),
      choose(
        "Discover",
        "Sides 5 and 7 with 40° between them, in both triangles. Test?",
        "SAS",
        "Two sides and the included angle.",
        [
          ["SSS", "Only two sides are known."],
          ["ASA", "One angle, two sides."],
        ],
      ),
      worked(
        "Write the proof",
        "AB = DE, BC = EF, ∠ABC = ∠DEF. Prove ABC and DEF are congruent.",
        [
          ["AB = DE (given)", "Side."],
          ["∠ABC = ∠DEF (given)", "The angle between them."],
          ["BC = EF (given), so congruent by SAS", "Side; name the test."],
        ],
        "List each pair with a reason, then the test.",
      ),
      steps(
        "Together",
        "Which test?",
        "Each has angles 50° and 60°, and the side between them is 4 cm.",
        [
          [
            "What matches?",
            "two angles and the side between",
            ["two sides and an angle", "Only one side is given."],
            "A, S, A",
          ],
          ["So", "congruent by ASA", ["not enough", "ASA is a test."], "ASA"],
        ],
        "ASA fixes the triangle.",
      ),
      choose(
        "Together",
        "Two right-angled triangles share hypotenuse 13 cm and a side of 5 cm.",
        "Congruent by RHS",
        "Right angle, hypotenuse, side.",
        [
          ["Not enough", "RHS works for right-angled triangles."],
          ["Congruent by SSS", "Only two sides are given."],
        ],
      ),
      choose(
        "Your turn",
        "Sides 6, 8 and 9 cm in both. Congruent?",
        "Yes, by SSS",
        "Three sides fix it.",
        [["Can't tell", "SSS is enough."]],
      ),
      choose(
        "Your turn",
        "Angles 30°, 70° and 80° in both. Congruent?",
        "Not necessarily",
        "AAA isn't a test.",
        [["Yes, by AAA", "One could be an enlargement."]],
      ),
      choose(
        "Watch out",
        "Sides 5 and 7 with a 40° angle NOT between them. Is that SAS?",
        "No: SAS needs the angle between the two sides",
        "Otherwise two different triangles can fit.",
        [["Yes", "The angle must be included."]],
      ),
      mistake(
        "Zara proves two triangles congruent.",
        ["Both have angles 45°, 45°, 90°", "All three angles match", "So they're congruent (AAA)"],
        2,
        "AAA isn't a test: they're similar, not necessarily congruent.",
      ),
      choose(
        "Back to the problem",
        "“AB = DE, BC = EF and AC = DF. Prove the triangles are congruent.”",
        "Congruent by SSS: all three pairs of sides are equal",
        "Name the test and the facts.",
        [
          ["Congruent: they look the same", "Give the test."],
          ["Congruent by AAA", "Sides are given, not angles."],
        ],
      ),
      quiz([
        [
          ["Two sides and the included angle", "SAS", ["SSS", "AAA"], "Side, angle, side."],
          ["Two angles and the side between", "ASA", ["SAS", "RHS"], "Angle, side, angle."],
        ],
        [
          ["Which does NOT prove congruence?", "AAA", ["SSS", "RHS"], "Same shape, any size."],
          [
            "Which of these does not prove congruence?",
            "SSA",
            ["SAS", "ASA"],
            "Angle not between.",
          ],
        ],
        [
          ["Right angle, hypotenuse 10, side 6:", "RHS", ["SAS", "SSS"], "R, H, S."],
          ["Right angle, hypotenuse 17, side 8:", "RHS", ["ASA", "SSS"], "R, H, S."],
        ],
      ]),
    ],
  ),

  lesson(U, "similar", "GF-G19", "Similar shapes", "Find the scale factor, then missing lengths.", [
    problem(
      "The tree's shadow",
      [
        "A 2 m pole casts a 3 m shadow. At the same time, a tree casts a 15 m shadow. The triangles are similar. How tall is the tree?",
        "By the end of this lesson, you can find missing lengths in any similar shapes.",
      ],
      tri(1, ["3 m", null, "2 m"]),
    ),
    typed("Warm-up", "Work out $15 \\div 3$", "5", "Fives.", "5."),
    typed("Warm-up", "Work out $2 \\times 5$", "10", "Times.", "10."),
    explain(
      "Discover",
      "Similar means scaled",
      [
        "**Similar** shapes have equal angles, and every length multiplied by the same **scale factor**.",
        "Find the scale factor from one pair of matching sides: big ÷ small. Then multiply (or divide) the others.",
      ],
      tri(1.5, ["6 cm", null, "4.5 cm"]),
    ),
    choose(
      "Discover",
      "Sides 4 cm and 10 cm match. Scale factor small to big?",
      "2.5",
      "$10 \\div 4$.",
      [
        ["6", "Divide, don't subtract."],
        ["0.4", "That's big to small."],
      ],
    ),
    worked(
      "The tree",
      "Pole 2 m, shadow 3 m. Tree's shadow 15 m. Find the tree's height.",
      [
        ["Scale factor: $15 \\div 3 = 5$", "Matching sides: the shadows."],
        ["Tree: $2 \\times 5 = 10$ m", "Scale the height."],
      ],
      "The tree is 10 m tall.",
    ),
    steps(
      "Together",
      "Similar triangles: 6 cm ↔ 9 cm, and 4 cm ↔ ?",
      "Find the missing side.",
      [
        ["Scale factor:", "1.5", ["3", "$9 \\div 6$, not $9 - 6$."], "1.5"],
        ["Missing side:", "6 cm", ["7 cm", "$4 \\times 1.5$."], "6 cm"],
      ],
      "Multiply, don't add.",
    ),
    steps(
      "Together",
      "Going smaller: 12 cm ↔ 8 cm, and 15 cm ↔ ?",
      "Big to small.",
      [
        ["Scale factor big to small:", "$\\frac23$", ["4", "$8 \\div 12$."], "$\\frac23$"],
        ["Missing side:", "10 cm", ["11 cm", "$15 \\times \\frac23$."], "10 cm"],
      ],
      "Or divide by 1.5.",
    ),
    typed(
      "Your turn",
      "Similar rectangles: 5 cm wide ↔ 20 cm wide. A 3 cm side becomes?",
      "12",
      "Scale factor 4.",
      "12 cm.",
      { unit: "cm", wrong: [["18", "Multiply by 4, don't add 15."]] },
    ),
    typed(
      "Your turn",
      "Similar triangles: 10 cm ↔ 4 cm. A 7.5 cm side becomes?",
      "3",
      "Scale factor 0.4.",
      "3 cm.",
      { unit: "cm", wrong: [["1.5", "$7.5 \\times 0.4$."]] },
    ),
    choose(
      "Watch out",
      "Sides 3 cm ↔ 5 cm. Ivy adds 2 to every side. What's wrong?",
      "Similar shapes multiply: scale factor $\\frac53$",
      "Adding changes the shape.",
      [["Nothing", "A 6 cm side would become 8, not 10."]],
    ),
    mistake(
      "Kai finds a missing side: 8 cm ↔ 12 cm, and ? ↔ 9 cm.",
      ["Scale factor: $12 \\div 8 = 1.5$", "Missing side: $9 \\times 1.5$", "= 13.5 cm"],
      1,
      "The missing side is on the small shape: divide, $9 \\div 1.5 = 6$ cm.",
    ),
    typed(
      "Back to the problem",
      "“A 2 m pole casts a 3 m shadow; a tree casts a 15 m shadow. Work out the height of the tree.”",
      "10",
      "Scale factor 5.",
      "10 m.",
      { unit: "m", wrong: [["14", "Multiply by 5, don't add 12."]] },
    ),
    quiz([
      [
        ["4 cm ↔ 12 cm; 5 cm ↔ ?", "15 cm", ["13 cm", "20 cm"], "× 3."],
        ["2 cm ↔ 7 cm; 6 cm ↔ ?", "21 cm", ["11 cm", "12 cm"], "× 3.5."],
      ],
      [
        ["10 cm ↔ 5 cm; 8 cm ↔ ?", "4 cm", ["3 cm", "16 cm"], "÷ 2."],
        ["9 cm ↔ 6 cm; 12 cm ↔ ?", "8 cm", ["9 cm", "18 cm"], "× $\\frac23$."],
      ],
      [
        ["Similar shapes have", "equal angles", ["equal sides", "equal areas"], "Same shape."],
        [
          "In similar shapes, lengths are",
          "multiplied by the same number",
          ["increased by the same amount", "equal"],
          "Scale factor.",
        ],
      ],
    ]),
  ]),
];
