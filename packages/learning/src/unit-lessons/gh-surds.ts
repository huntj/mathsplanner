// GCSE Higher, "Counting, powers and surds", as six short lessons, one just before each skill: the
// product rule for counting, estimating powers and roots, fractional indices, simplifying surds,
// calculating exactly with surds and rationalising denominators. Each recaps the Foundation idea
// quickly, builds it to Higher level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-surds";

const lock: Picture = {
  kind: "table",
  head: ["Wheel", "1st", "2nd", "3rd", "4th"],
  rows: [["Choices", "10", "10", "10", "10"]],
};

export const ghSurds: UnitLesson[] = [
  lesson(
    U,
    "product-rule",
    "GH-N5",
    "The product rule for counting",
    "Multiply the number of choices at each stage.",
    [
      problem(
        "The bike lock",
        [
          "A bike lock has 4 wheels, each with the digits 0 to 9. “How many different codes are there?” And “How many if no digit can be repeated?”",
          "By the end of this lesson, you can count arrangements like these without listing them.",
        ],
        lock,
      ),
      typed("Warm-up", "A meal: 3 starters and 4 mains. How many pairs?", "12", "3 × 4.", "12."),
      typed("Warm-up", "$10 \\times 9 \\times 8$", "720", "Multiply.", "720."),
      explain(
        "Discover",
        "Multiply the choices",
        [
          "If one choice can be made in $a$ ways and the next in $b$ ways, together there are $a \\times b$ ways. This is the **product rule**.",
          "Without repeats, each stage has one fewer choice: $10 \\times 9 \\times 8 \\times 7$.",
        ],
        lock,
      ),
      choose(
        "Discover",
        "Codes with repeats allowed",
        "$10^4 = 10\\,000$",
        "10 choices for each of 4 wheels.",
        [
          ["40", "Multiply, don't add."],
          ["$4^{10}$", "10 choices, 4 times."],
        ],
        { picture: lock },
      ),
      worked(
        "No repeats",
        "How many 4-digit codes with no digit repeated?",
        [
          ["1st wheel: 10, 2nd: 9, 3rd: 8, 4th: 7", "One fewer each time."],
          ["$10 \\times 9 \\times 8 \\times 7 = 5040$", "Product rule."],
        ],
        "5040 codes.",
      ),
      steps(
        "Together",
        "Arrange the letters of MATHS",
        "Five different letters.",
        [
          ["Choices for the first letter:", "5", ["1", "Any of the 5."], "5"],
          [
            "Total:",
            "$5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$",
            ["$5 \\times 5 = 25$", "One fewer each time."],
            "120",
          ],
        ],
        "$5 \\times 4 \\times 3 \\times 2 \\times 1$ is written $5!$ (5 factorial).",
      ),
      choose(
        "Together",
        "A number plate has 2 letters (A–Z) then 3 digits. How many?",
        "$26^2 \\times 10^3$",
        "Each position multiplied.",
        [
          ["$26 + 26 + 10 + 10 + 10$", "Multiply."],
          ["$26 \\times 2 \\times 10 \\times 3$", "Choices per position, not positions."],
        ],
      ),
      typed(
        "Your turn",
        "How many 3-digit PINs using 1 to 6, repeats allowed?",
        "216",
        "$6^3$.",
        "216.",
      ),
      typed("Your turn", "And with no repeats?", "120", "$6 \\times 5 \\times 4$.", "120.", {
        wrong: [["216", "That allows repeats."]],
      }),
      choose(
        "Watch out",
        "Ivy counts 3 shirts and 5 trousers as 8 outfits. What's wrong?",
        "Each shirt goes with each pair: 15",
        "Multiply.",
        [["Nothing", "Adding counts the items, not the pairs."]],
      ),
      mistake(
        "Ben counts 3-letter codes from A, B, C, D with no repeats.",
        ["First: 4 choices", "Second: 4 choices", "Third: 4 choices: 64"],
        1,
        "No repeats: 3 choices second and 2 third. 24.",
      ),
      typed(
        "Back to the problem",
        "“How many codes if no digit can be repeated?”",
        "5040",
        "$10 \\times 9 \\times 8 \\times 7$.",
        "5040 codes.",
        { wrong: [["10000", "That allows repeats."]] },
      ),
      quiz([
        [
          ["4 shirts, 6 ties: outfits", "24", ["10", "46"], "Multiply."],
          ["5 drinks, 3 snacks: pairs", "15", ["8", "53"], "Multiply."],
        ],
        [
          ["Arrangements of 4 different books", "24", ["16", "4"], "$4!$."],
          ["Arrangements of 3 different cards", "6", ["9", "3"], "$3!$."],
        ],
        [
          ["2-digit codes, 0–9, no repeats", "90", ["100", "19"], "$10 \\times 9$."],
          ["3-letter codes, A–E, no repeats", "60", ["125", "15"], "$5 \\times 4 \\times 3$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "estimate",
    "GH-N6",
    "Estimating powers and roots",
    "Find the whole numbers either side, then judge.",
    [
      problem("Without a calculator", [
        "“Estimate $\\sqrt{50}$ to 1 decimal place.” And “Estimate $\\sqrt[3]{70}$.” Non-calculator papers ask these.",
        "By the end of this lesson, you can estimate any root or power.",
      ]),
      typed("Warm-up", "$7^2$", "49", "7 × 7.", "49."),
      typed("Warm-up", "$4^3$", "64", "4 × 4 × 4.", "64."),
      explain("Discover", "Squeeze it", [
        "Find the square (or cube) numbers either side. $49 < 50 < 64$, so $7 < \\sqrt{50} < 8$.",
        "50 is very close to 49, so $\\sqrt{50}$ is just over 7: about 7.1.",
      ]),
      choose("Discover", "$\\sqrt{50}$ is between", "7 and 8", "49 and 64.", [
        ["25 and 26", "Halving isn't rooting."],
        ["6 and 7", "$7^2 = 49 < 50$."],
      ]),
      worked(
        "Cube root",
        "Estimate $\\sqrt[3]{70}$.",
        [
          ["$4^3 = 64$, $5^3 = 125$", "Cubes either side."],
          ["70 is close to 64", "Near the lower end."],
          ["About 4.1", "Just over 4."],
        ],
        "Check: $4.1^3 \\approx 68.9$.",
      ),
      steps(
        "Together",
        "Estimate $\\sqrt{90}$",
        "Squares either side.",
        [
          ["Either side:", "81 and 100", ["80 and 100", "Use square numbers."], "9 and 10"],
          [
            "90 is",
            "about halfway, so ≈ 9.5",
            ["nearly 10, so 9.9", "90 is 9 above 81, 10 below 100."],
            "≈ 9.5",
          ],
        ],
        "$9.5^2 = 90.25$: close.",
      ),
      choose("Together", "Estimate $2.9^3$", "about 27", "$3^3$.", [
        ["about 9", "That's a square."],
        ["about 87", "Cube, don't × 3."],
      ]),
      choose("Your turn", "$\\sqrt{27}$ is between", "5 and 6", "25 and 36.", [
        ["3 and 4", "That's the cube root."],
        ["13 and 14", "Halving isn't rooting."],
      ]),
      typed(
        "Your turn",
        "Estimate $\\sqrt[3]{1001}$ to the nearest whole number",
        "10",
        "$10^3 = 1000$.",
        "10.",
      ),
      choose(
        "Watch out",
        "Raj says $\\sqrt{50} \\approx 25$. What's wrong?",
        "He halved: the root is about 7",
        "$25^2 = 625$.",
        [["Nothing", "Square roots aren't halves."]],
      ),
      mistake(
        "Kim estimates $\\sqrt{60}$.",
        ["$49 < 60 < 64$", "So between 7 and 8", "60 is nearer 49, so ≈ 7.2"],
        2,
        "60 is 11 above 49 but only 4 below 64: nearer 8, about 7.7.",
      ),
      choose(
        "Back to the problem",
        "“Estimate $\\sqrt{50}$ to 1 decimal place.”",
        "7.1",
        "Just over 7.",
        [
          ["7.5", "50 is very close to 49."],
          ["25", "Not half."],
        ],
      ),
      quiz([
        [
          ["$\\sqrt{40}$ is between", "6 and 7", ["5 and 6", "20 and 21"], "36 and 49."],
          ["$\\sqrt{75}$ is between", "8 and 9", ["7 and 8", "37 and 38"], "64 and 81."],
        ],
        [
          ["$\\sqrt[3]{30}$ is between", "3 and 4", ["5 and 6", "10 and 11"], "27 and 64."],
          ["$\\sqrt[3]{120}$ is between", "4 and 5", ["10 and 11", "3 and 4"], "64 and 125."],
        ],
        [
          ["Best estimate of $\\sqrt{99}$", "9.9", ["9.5", "49.5"], "Just under 10."],
          ["Best estimate of $\\sqrt{17}$", "4.1", ["4.5", "8.5"], "Just over 4."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fractional-indices",
    "GH-N7",
    "Fractional indices",
    "A power of ½ is a square root; ⅓ a cube root; the top is a power.",
    [
      problem("Exact values", [
        "“Work out the exact value of $8^{\\frac23}$.” And “$16^{-\\frac12}$.” No calculator.",
        "By the end of this lesson, you can do both.",
      ]),
      typed("Warm-up", "$\\sqrt[3]{8}$", "2", "$2^3 = 8$.", "2."),
      typed("Warm-up", "$2^{-1}$, as a fraction", "1/2", "Negative: reciprocal.", "$\\frac12$."),
      explain("Discover", "Root, then power", [
        "$a^{\\frac12} = \\sqrt{a}$, since $a^{\\frac12} \\times a^{\\frac12} = a^1$. Likewise $a^{\\frac13} = \\sqrt[3]{a}$.",
        "In $a^{\\frac{m}{n}}$, the bottom $n$ is the root and the top $m$ the power: **root first**, it keeps numbers small. A minus sign means **one over**.",
      ]),
      choose("Discover", "$25^{\\frac12}$", "5", "$\\sqrt{25}$.", [
        ["12.5", "Not half of 25."],
        ["625", "That's $25^2$."],
      ]),
      worked(
        "The first",
        "Find $8^{\\frac23}$.",
        [
          ["$\\sqrt[3]{8} = 2$", "Root (bottom)."],
          ["$2^2 = 4$", "Power (top)."],
        ],
        "$8^{\\frac23} = 4$.",
      ),
      steps(
        "Together",
        "Find $16^{-\\frac12}$",
        "Deal with the minus last.",
        [
          ["$16^{\\frac12} =$", "4", ["8", "Square root, not half."], "4"],
          [
            "With the minus:",
            "$\\frac14$",
            ["−4", "A negative power is a reciprocal."],
            "$\\frac14$",
          ],
        ],
        "$16^{-\\frac12} = \\frac14$.",
      ),
      choose("Together", "$27^{\\frac23}$", "9", "$3^2$.", [
        ["18", "Not $\\frac23$ of 27."],
        ["729", "That's $27^2$."],
      ]),
      typed("Your turn", "$125^{\\frac13}$", "5", "Cube root.", "5."),
      typed("Your turn", "$4^{\\frac32}$", "8", "$\\sqrt4 = 2$, $2^3$.", "8."),
      choose(
        "Watch out",
        "Zoe says $9^{\\frac12} = 4.5$. What's wrong?",
        "A power of ½ is a square root: 3",
        "Not halving.",
        [["Nothing", "$4.5^2 \\ne 9$."]],
      ),
      mistake(
        "Leo finds $64^{-\\frac13}$.",
        ["$\\sqrt[3]{64} = 4$", "Negative: $-4$", "So $-4$"],
        1,
        "A negative power means one over: $\\frac14$.",
      ),
      typed("Back to the problem", "“Work out $8^{\\frac23}$.”", "4", "Root then power.", "4.", {
        wrong: [["16/3", "It's not × ⅔."]],
      }),
      quiz([
        [
          ["$36^{\\frac12}$", "6", ["18", "1296"], "Root."],
          ["$49^{\\frac12}$", "7", ["24.5", "2401"], "Root."],
        ],
        [
          ["$9^{\\frac32}$", "27", ["13.5", "729"], "$3^3$."],
          ["$16^{\\frac34}$", "8", ["12", "4096"], "$2^3$."],
        ],
        [
          ["$25^{-\\frac12}$", "$\\frac15$", ["−5", "$-\\frac{25}{2}$"], "Reciprocal."],
          ["$8^{-\\frac13}$", "$\\frac12$", ["−2", "$-\\frac83$"], "Reciprocal."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "simplify-surds",
    "GH-N8.a",
    "Simplifying surds",
    "Find the biggest square factor: √50 = √25 × √2 = 5√2.",
    [
      problem("The exact diagonal", [
        "A square has side 5 cm. “Find the length of the diagonal. Give your answer as a surd in its simplest form.”",
        "By the end of this lesson, you can write it as $5\\sqrt2$ cm.",
      ]),
      typed("Warm-up", "$5^2 + 5^2$", "50", "25 + 25.", "50."),
      typed("Warm-up", "The biggest square number that divides 50", "25", "50 = 25 × 2.", "25."),
      explain("Discover", "Split off a square", [
        "A **surd** is a root that isn't a whole number, like $\\sqrt2$. Use $\\sqrt{ab} = \\sqrt a \\times \\sqrt b$.",
        "Find the biggest square factor: $\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt2$.",
      ]),
      choose("Discover", "$\\sqrt{12}$ simplified", "$2\\sqrt3$", "$\\sqrt{4 \\times 3}$.", [
        ["$3\\sqrt2$", "$9 \\times 2 = 18$."],
        ["$6\\sqrt2$", "$\\sqrt{12} \\ne \\sqrt{72}$."],
      ]),
      worked(
        "The diagonal",
        "Side 5 cm. Diagonal as a surd?",
        [
          ["$d^2 = 5^2 + 5^2 = 50$", "Pythagoras."],
          ["$d = \\sqrt{50} = \\sqrt{25}\\sqrt2$", "Square factor."],
          ["$= 5\\sqrt2$ cm", "Simplest form."],
        ],
        "Exact: no rounding.",
      ),
      steps(
        "Together",
        "Simplify $\\sqrt{72}$",
        "Biggest square factor.",
        [
          [
            "Biggest square factor:",
            "36",
            ["4", "4 works, but 36 is bigger."],
            "$72 = 36 \\times 2$",
          ],
          ["So", "$6\\sqrt2$", ["$2\\sqrt{18}$", "Not fully simplified."], "$6\\sqrt2$"],
        ],
        "Using 4 first gives $2\\sqrt{18}$: keep going.",
      ),
      choose("Together", "$\\sqrt{45}$ simplified", "$3\\sqrt5$", "$\\sqrt{9 \\times 5}$.", [
        ["$5\\sqrt3$", "$25 \\times 3 = 75$."],
        ["$9\\sqrt5$", "$\\sqrt9 = 3$."],
      ]),
      choose("Your turn", "$\\sqrt{200}$ simplified", "$10\\sqrt2$", "$\\sqrt{100 \\times 2}$.", [
        ["$2\\sqrt{10}$", "That's $\\sqrt{40}$."],
        ["$100\\sqrt2$", "$\\sqrt{100} = 10$."],
      ]),
      choose("Your turn", "$\\sqrt{48}$ simplified", "$4\\sqrt3$", "$\\sqrt{16 \\times 3}$.", [
        ["$2\\sqrt{12}$", "Keep going."],
        ["$3\\sqrt4$", "That's 6."],
      ]),
      choose(
        "Watch out",
        "Ivy writes $\\sqrt{9 + 16} = 3 + 4$. What's wrong?",
        "Roots split over ×, not +: it's 5",
        "$\\sqrt{25} = 5$.",
        [["Nothing", "$3 + 4 = 7 \\ne 5$."]],
      ),
      mistake(
        "Ben simplifies $\\sqrt{80}$.",
        ["$\\sqrt{80} = \\sqrt{4 \\times 20}$", "$= 2\\sqrt{20}$", "Answer $2\\sqrt{20}$"],
        2,
        "Not simplest: $\\sqrt{20} = 2\\sqrt5$, so $4\\sqrt5$.",
      ),
      choose(
        "Back to the problem",
        "“Find the diagonal as a surd in its simplest form.”",
        "$5\\sqrt2$ cm",
        "$\\sqrt{50}$.",
        [
          ["$\\sqrt{50}$ cm", "Not simplest."],
          ["7.07 cm", "Not exact."],
        ],
      ),
      quiz([
        [
          ["$\\sqrt{18}$", "$3\\sqrt2$", ["$2\\sqrt3$", "$9\\sqrt2$"], "$9 \\times 2$."],
          ["$\\sqrt{8}$", "$2\\sqrt2$", ["$4\\sqrt2$", "$2\\sqrt4$"], "$4 \\times 2$."],
        ],
        [
          ["$\\sqrt{75}$", "$5\\sqrt3$", ["$3\\sqrt5$", "$25\\sqrt3$"], "$25 \\times 3$."],
          ["$\\sqrt{98}$", "$7\\sqrt2$", ["$2\\sqrt7$", "$49\\sqrt2$"], "$49 \\times 2$."],
        ],
        [
          [
            "$\\sqrt{a} \\times \\sqrt{b} =$",
            "$\\sqrt{ab}$",
            ["$\\sqrt{a + b}$", "$ab$"],
            "Product rule.",
          ],
          [
            "$\\sqrt{a + b}$ equals $\\sqrt a + \\sqrt b$",
            "never, unless one is 0",
            ["always", "when a = b"],
            "No.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exact-surds",
    "GH-N8.b",
    "Calculating exactly with surds",
    "Collect like surds; expand brackets like algebra.",
    [
      problem("The exact area", [
        "A rectangle is $(3 + \\sqrt2)$ cm by $(3 - \\sqrt2)$ cm. “Show that its area is a whole number.”",
        "By the end of this lesson, you can expand surd brackets exactly.",
      ]),
      typed("Warm-up", "$\\sqrt2 \\times \\sqrt2$", "2", "Root times itself.", "2."),
      choose("Warm-up", "$(a + b)(a - b) =$", "$a^2 - b^2$", "Difference of two squares.", [
        ["$a^2 + b^2$", "The middle terms cancel, leaving minus."],
        ["$a^2 - 2ab + b^2$", "That's $(a - b)^2$."],
      ]),
      explain("Discover", "Surds behave like letters", [
        "Like surds collect: $3\\sqrt5 + 2\\sqrt5 = 5\\sqrt5$, like $3x + 2x = 5x$. Unlike ones ($\\sqrt2 + \\sqrt3$) don't.",
        "Expand brackets term by term, then use $\\sqrt a \\times \\sqrt a = a$.",
      ]),
      choose("Discover", "$\\sqrt{12} + \\sqrt{27}$", "$5\\sqrt3$", "$2\\sqrt3 + 3\\sqrt3$.", [
        ["$\\sqrt{39}$", "Roots don't add like that."],
        ["$6\\sqrt3$", "$2 + 3 = 5$."],
      ]),
      worked(
        "The area",
        "Expand $(3 + \\sqrt2)(3 - \\sqrt2)$.",
        [
          ["$9 - 3\\sqrt2 + 3\\sqrt2 - 2$", "Four terms."],
          ["$= 7$", "Surd terms cancel."],
        ],
        "A whole number: 7 cm².",
      ),
      steps(
        "Together",
        "Expand $(2 + \\sqrt5)^2$",
        "Write it twice.",
        [
          [
            "Terms:",
            "$4 + 2\\sqrt5 + 2\\sqrt5 + 5$",
            ["$4 + 5$", "Don't forget the middle terms."],
            "Four terms",
          ],
          [
            "Simplify:",
            "$9 + 4\\sqrt5$",
            ["$9 + 2\\sqrt5$", "Two lots of $2\\sqrt5$."],
            "$9 + 4\\sqrt5$",
          ],
        ],
        "Squaring a bracket gives a middle term.",
      ),
      choose("Together", "$\\sqrt3(4 + \\sqrt3)$", "$4\\sqrt3 + 3$", "Multiply each term.", [
        ["$4\\sqrt3 + \\sqrt3$", "$\\sqrt3 \\times \\sqrt3 = 3$."],
        ["$7\\sqrt3$", "Unlike terms."],
      ]),
      choose("Your turn", "$5\\sqrt2 - \\sqrt8$", "$3\\sqrt2$", "$\\sqrt8 = 2\\sqrt2$.", [
        ["$4\\sqrt2$", "$\\sqrt8 = 2\\sqrt2$, not $\\sqrt2$."],
        ["$7\\sqrt2$", "Subtract, don't add."],
      ]),
      choose("Your turn", "$(1 + \\sqrt3)(1 - \\sqrt3)$", "−2", "$1 - 3$.", [
        ["4", "$1 - 3$, not $1 + 3$."],
        ["$1 - \\sqrt3$", "Expand fully."],
      ]),
      choose(
        "Watch out",
        "Kim writes $(1 + \\sqrt2)^2 = 1 + 2 = 3$. What's wrong?",
        "She missed $2\\sqrt2$: it's $3 + 2\\sqrt2$",
        "Square a bracket fully.",
        [["Nothing", "Like $(a + b)^2 \\ne a^2 + b^2$."]],
      ),
      mistake(
        "Leo works out $2\\sqrt3 \\times 4\\sqrt3$.",
        ["$2 \\times 4 = 8$", "$\\sqrt3 \\times \\sqrt3 = \\sqrt3$", "So $8\\sqrt3$"],
        1,
        "$\\sqrt3 \\times \\sqrt3 = 3$, so the answer is $8 \\times 3 = 24$.",
      ),
      choose(
        "Back to the problem",
        "“Show that the area is a whole number.”",
        "$9 - 2 = 7$",
        "The surd terms cancel.",
        [
          ["$9 + 2 = 11$", "$\\sqrt2 \\times -\\sqrt2 = -2$."],
          ["$9 - 6\\sqrt2$", "The middle terms cancel."],
        ],
      ),
      quiz([
        [
          ["$4\\sqrt7 + 3\\sqrt7$", "$7\\sqrt7$", ["$7\\sqrt{14}$", "$12\\sqrt7$"], "Like surds."],
          ["$6\\sqrt5 - 2\\sqrt5$", "$4\\sqrt5$", ["$4$", "$4\\sqrt{10}$"], "Like surds."],
        ],
        [
          ["$\\sqrt5 \\times \\sqrt5$", "5", ["25", "$2\\sqrt5$"], "Itself."],
          ["$3\\sqrt2 \\times \\sqrt2$", "6", ["$3\\sqrt4$", "$3\\sqrt2$"], "$3 \\times 2$."],
        ],
        [
          ["$(4 + \\sqrt3)(4 - \\sqrt3)$", "13", ["19", "16"], "$16 - 3$."],
          ["$(5 + \\sqrt2)(5 - \\sqrt2)$", "23", ["27", "25"], "$25 - 2$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "rationalise",
    "GH-N8.c",
    "Rationalising denominators",
    "Multiply top and bottom to clear the surd from the bottom.",
    [
      problem("Simplest form", [
        "“Write $\\frac{6}{\\sqrt3}$ in the form $a\\sqrt3$.” And “Rationalise $\\frac{1}{3 + \\sqrt2}$.”",
        "By the end of this lesson, you can clear surds from the bottom of any fraction.",
      ]),
      typed("Warm-up", "$\\sqrt3 \\times \\sqrt3$", "3", "Itself.", "3."),
      typed("Warm-up", "$(3 + \\sqrt2)(3 - \\sqrt2)$", "7", "$9 - 2$.", "7."),
      explain("Discover", "Times by a clever 1", [
        "**Rationalising** means rewriting a fraction with no surd in the denominator. Multiplying by $\\frac{\\sqrt3}{\\sqrt3}$ is multiplying by 1, so the value doesn't change.",
        "For $3 + \\sqrt2$ on the bottom, multiply by $3 - \\sqrt2$ on top and bottom: the difference of two squares clears the surd.",
      ]),
      choose(
        "Discover",
        "To rationalise $\\frac{5}{\\sqrt2}$, multiply top and bottom by",
        "$\\sqrt2$",
        "Makes 2 on the bottom.",
        [
          ["2", "$2\\sqrt2$ is still a surd."],
          ["5", "That changes nothing on the bottom."],
        ],
      ),
      worked(
        "The first",
        "Write $\\frac{6}{\\sqrt3}$ as $a\\sqrt3$.",
        [
          [
            "$\\frac{6}{\\sqrt3} \\times \\frac{\\sqrt3}{\\sqrt3} = \\frac{6\\sqrt3}{3}$",
            "Clear the bottom.",
          ],
          ["$= 2\\sqrt3$", "Cancel."],
        ],
        "$a = 2$.",
      ),
      steps(
        "Together",
        "Rationalise $\\frac{1}{3 + \\sqrt2}$",
        "Change the sign.",
        [
          [
            "Multiply top and bottom by",
            "$3 - \\sqrt2$",
            ["$3 + \\sqrt2$", "Same sign leaves a surd."],
            "$3 - \\sqrt2$",
          ],
          [
            "Bottom becomes",
            "$9 - 2 = 7$",
            ["$9 + 2$", "Difference of two squares."],
            "$\\frac{3 - \\sqrt2}{7}$",
          ],
        ],
        "No surd on the bottom.",
      ),
      choose(
        "Together",
        "$\\frac{10}{\\sqrt5}$ rationalised",
        "$2\\sqrt5$",
        "$\\frac{10\\sqrt5}{5}$.",
        [
          ["$\\frac{\\sqrt{10}}{5}$", "Multiply the top too."],
          ["$10\\sqrt5$", "Divide by 5."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac{4}{\\sqrt2}$ rationalised",
        "$2\\sqrt2$",
        "$\\frac{4\\sqrt2}{2}$.",
        [
          ["$4\\sqrt2$", "Divide by 2."],
          ["$\\sqrt2$", "$4 \\div 2 = 2$."],
        ],
      ),
      choose(
        "Your turn",
        "To rationalise $\\frac{2}{1 - \\sqrt5}$, multiply by",
        "$\\frac{1 + \\sqrt5}{1 + \\sqrt5}$",
        "Change the sign.",
        [
          ["$\\frac{1 - \\sqrt5}{1 - \\sqrt5}$", "Keeps a surd on the bottom."],
          ["$\\frac{\\sqrt5}{\\sqrt5}$", "Doesn't clear it."],
        ],
      ),
      choose(
        "Watch out",
        "Raj multiplies only the bottom of $\\frac{3}{\\sqrt3}$ by $\\sqrt3$. What's wrong?",
        "Multiply top and bottom, or the value changes",
        "Times by 1.",
        [["Nothing", "$\\frac33 \\ne \\frac{3}{\\sqrt3}$."]],
      ),
      mistake(
        "Zoe rationalises $\\frac{1}{2 + \\sqrt3}$.",
        [
          "Multiply by $\\frac{2 - \\sqrt3}{2 - \\sqrt3}$",
          "Bottom: $4 + 3 = 7$",
          "So $\\frac{2 - \\sqrt3}{7}$",
        ],
        1,
        "The bottom is $4 - 3 = 1$, so the answer is $2 - \\sqrt3$.",
      ),
      choose(
        "Back to the problem",
        "“Rationalise $\\frac{1}{3 + \\sqrt2}$.”",
        "$\\frac{3 - \\sqrt2}{7}$",
        "Difference of two squares.",
        [
          ["$\\frac{3 + \\sqrt2}{7}$", "Sign changes."],
          ["$\\frac{3 - \\sqrt2}{11}$", "$9 - 2 = 7$."],
        ],
      ),
      quiz([
        [
          [
            "$\\frac{1}{\\sqrt7}$",
            "$\\frac{\\sqrt7}{7}$",
            ["$\\sqrt7$", "$\\frac17$"],
            "× $\\sqrt7$.",
          ],
          [
            "$\\frac{1}{\\sqrt5}$",
            "$\\frac{\\sqrt5}{5}$",
            ["$\\sqrt5$", "$\\frac15$"],
            "× $\\sqrt5$.",
          ],
        ],
        [
          [
            "$\\frac{12}{\\sqrt3}$",
            "$4\\sqrt3$",
            ["$12\\sqrt3$", "$\\frac{\\sqrt3}{4}$"],
            "$\\frac{12\\sqrt3}{3}$.",
          ],
          [
            "$\\frac{14}{\\sqrt7}$",
            "$2\\sqrt7$",
            ["$14\\sqrt7$", "$\\frac{\\sqrt7}{2}$"],
            "$\\frac{14\\sqrt7}{7}$.",
          ],
        ],
        [
          [
            "Multiply $\\frac{1}{4 - \\sqrt3}$ by",
            "$\\frac{4 + \\sqrt3}{4 + \\sqrt3}$",
            ["$\\frac{4 - \\sqrt3}{4 - \\sqrt3}$", "$\\frac{\\sqrt3}{\\sqrt3}$"],
            "Change the sign.",
          ],
          [
            "Multiply $\\frac{1}{5 + \\sqrt2}$ by",
            "$\\frac{5 - \\sqrt2}{5 - \\sqrt2}$",
            ["$\\frac{5 + \\sqrt2}{5 + \\sqrt2}$", "$\\frac{\\sqrt2}{\\sqrt2}$"],
            "Change the sign.",
          ],
        ],
      ]),
    ],
  ),
];
