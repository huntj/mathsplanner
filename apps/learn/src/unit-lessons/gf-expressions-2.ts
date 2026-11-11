// GCSE Foundation, "Expanding and factorising", as four short lessons, one just before each
// skill: expanding two brackets, factorising x² + bx + c, the difference of two squares, and the
// laws of indices in algebra. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level,
// names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gf-expressions-2";
const grid = (a: string, b: string, cells: [string, string, string, string]): Picture => ({
  kind: "table",
  head: ["×", "$x$", b],
  rows: [
    ["$x$", cells[0], cells[1]],
    [a, cells[2], cells[3]],
  ],
});

export const gfExpressions2: UnitLesson[] = [
  lesson(
    U,
    "expand",
    "GF-A4.d",
    "Expanding two brackets",
    "Four pieces from a grid, then collect like terms.",
    [
      problem("The exam question", [
        "“Expand and simplify $(x + 5)(x - 3)$.” It's on almost every Foundation paper, worth 2 marks.",
        "By the end of this lesson, you'll get both marks every time, negatives included.",
      ]),
      typed(
        "Warm-up",
        "Expand $3(x + 4)$",
        ["3x+12", "12+3x"],
        "Times both terms by 3.",
        "$3x + 12$.",
      ),
      typed("Warm-up", "Work out $5 \\times -3$", "-15", "Different signs.", "−15."),
      explain(
        "Discover",
        "A grid of four pieces",
        [
          "$(x + 5)(x - 3)$ is like the area of a rectangle: multiply each term in one bracket by each term in the other.",
          "Keep each sign with its number: the pieces are $x^2$, $-3x$, $+5x$ and $-15$.",
        ],
        grid("$+5$", "$-3$", ["$x^2$", "$-3x$", "$5x$", "$-15$"]),
      ),
      choose(
        "Discover",
        "In $(x + a)(x + b)$, the number in front of $x$ is",
        "$a + b$",
        "$5 + (-3) = 2$; the number at the end is $a \\times b$.",
        [["$a \\times b$", "That's the number at the end."]],
      ),
      worked(
        "The exam question",
        "Expand and simplify $(x + 5)(x - 3)$.",
        [
          ["$x^2 - 3x + 5x - 15$", "Four pieces."],
          ["$x^2 + 2x - 15$", "Collect $-3x + 5x$."],
        ],
        "Check with $x = 1$: $6 \\times -2 = -12$, and $1 + 2 - 15 = -12$ ✓",
      ),
      steps(
        "Together",
        "Expand $(x - 4)(x - 6)$",
        "$(x - 4)(x - 6)$",
        [
          ["The $x$ terms:", "$-10x$", ["$-2x$", "$-4x - 6x$."], "$x^2 - 10x\\ldots$"],
          [
            "The number:",
            "$+24$",
            ["$-24$", "Two negatives multiply to a positive."],
            "$x^2 - 10x + 24$",
          ],
        ],
        "Check with $x = 0$: $(-4)(-6) = 24$ ✓",
      ),
      steps(
        "Together",
        "Expand $(2x + 3)(x - 1)$",
        "$(2x + 3)(x - 1)$",
        [
          ["$2x \\times x =$", "$2x^2$", ["$3x$", "Multiply: $2x^2$."], "$2x^2\\ldots$"],
          [
            "The $x$ terms $-2x + 3x$:",
            "$+x$",
            ["$+5x$", "$2x \\times -1 = -2x$."],
            "$2x^2 + x - 3$",
          ],
        ],
        "The $a + b$ shortcut only works when both start with plain $x$.",
      ),
      choose(
        "Your turn",
        "Expand $(x + 7)(x + 2)$",
        "$x^2 + 9x + 14$",
        "$7 + 2$ and $7 \\times 2$.",
        [
          ["$x^2 + 14x + 9$", "Add for the middle, multiply for the end."],
          ["$x^2 + 14$", "Don't lose the middle terms."],
        ],
      ),
      choose("Your turn", "Expand $(x - 5)^2$", "$x^2 - 10x + 25$", "$(x - 5)(x - 5)$.", [
        ["$x^2 + 25$", "Two middle terms: $-5x - 5x$."],
        ["$x^2 - 25$", "$-5 \\times -5 = +25$, and there's a middle term."],
      ]),
      choose(
        "Watch out",
        "Kai writes $(x + 3)^2 = x^2 + 9$. What's wrong?",
        "It's $(x + 3)(x + 3) = x^2 + 6x + 9$",
        "Squaring a bracket means two brackets.",
        [["Nothing", "Try $x = 1$: $16 \\ne 10$."]],
      ),
      mistake(
        "Ola expands $(x - 6)(x - 1)$.",
        ["$x^2 - x - 6x$", "$-6 \\times -1 = -6$", "$x^2 - 7x - 6$"],
        1,
        "Two negatives make a positive: $+6$. So $x^2 - 7x + 6$.",
      ),
      choose(
        "Back to the problem",
        "“Expand and simplify $(x + 5)(x - 3)$.”",
        "$x^2 + 2x - 15$",
        "$-3x + 5x = 2x$; $5 \\times -3 = -15$.",
        [
          ["$x^2 - 2x - 15$", "$5x - 3x = +2x$."],
          ["$x^2 + 2x + 15$", "$5 \\times -3$ is negative."],
        ],
      ),
      quiz([
        [
          [
            "$(x + 4)(x + 3)$",
            "$x^2 + 7x + 12$",
            ["$x^2 + 12x + 7$", "$x^2 + 12$"],
            "Add, multiply.",
          ],
          ["$(x + 6)(x + 1)$", "$x^2 + 7x + 6$", ["$x^2 + 6x + 7$", "$x^2 + 6$"], "Add, multiply."],
        ],
        [
          [
            "$(x - 2)(x + 8)$",
            "$x^2 + 6x - 16$",
            ["$x^2 - 6x - 16$", "$x^2 + 6x + 16$"],
            "$-2 + 8$; $-2 \\times 8$.",
          ],
          [
            "$(x + 3)(x - 7)$",
            "$x^2 - 4x - 21$",
            ["$x^2 + 4x - 21$", "$x^2 - 4x + 21$"],
            "$3 - 7$; $3 \\times -7$.",
          ],
        ],
        [
          ["$(x + 4)^2$", "$x^2 + 8x + 16$", ["$x^2 + 16$", "$x^2 + 4x + 16$"], "Two brackets."],
          ["$(x - 3)^2$", "$x^2 - 6x + 9$", ["$x^2 + 9$", "$x^2 - 9$"], "Two brackets."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "factorise-quadratics",
    "GF-A4.e",
    "Factorising quadratics",
    "Find two numbers that multiply to c and add to b.",
    [
      problem("Backwards again", [
        "“Factorise $x^2 + 7x + 12$.” Later it unlocks solving quadratic equations.",
        "Expanding gave you $x^2 + 7x + 12$ from $(x + 3)(x + 4)$. By the end of this lesson, you can go back the other way.",
      ]),
      choose(
        "Warm-up",
        "Two numbers multiply to 12 and add to 7",
        "3 and 4",
        "$3 \\times 4 = 12$, $3 + 4 = 7$.",
        [
          ["2 and 6", "They add to 8."],
          ["1 and 12", "They add to 13."],
        ],
      ),
      choose(
        "Warm-up",
        "Expand $(x + 3)(x + 4)$",
        "$x^2 + 7x + 12$",
        "Add for the middle, multiply for the end.",
        [
          ["$x^2 + 12x + 7$", "Add 3 and 4 for the middle."],
          ["$x^2 + 12$", "Don't lose the middle terms."],
        ],
      ),
      explain(
        "Discover",
        "Product and sum",
        [
          "$(x + p)(x + q) = x^2 + (p + q)x + pq$. So to factorise $x^2 + bx + c$, find two numbers that **multiply** to $c$ and **add** to $b$.",
          "Signs: if $c$ is negative, one number is negative. If $c$ is positive and $b$ negative, both are negative.",
        ],
        grid("$+4$", "$+3$", ["$x^2$", "$3x$", "$4x$", "$12$"]),
      ),
      choose(
        "Discover",
        "Factorising $x^2 - 5x + 6$: the two numbers are",
        "−2 and −3",
        "Multiply to +6, add to −5.",
        [
          ["2 and 3", "They add to +5."],
          ["−6 and 1", "They multiply to −6."],
        ],
      ),
      worked(
        "The exam question",
        "Factorise $x^2 + 7x + 12$.",
        [
          ["Pairs multiplying to 12: 1, 12; 2, 6; 3, 4", "List them."],
          ["3 + 4 = 7 ✓", "The pair that adds to 7."],
          ["$(x + 3)(x + 4)$", "Write the brackets."],
        ],
        "Check by expanding.",
      ),
      steps(
        "Together",
        "Factorise $x^2 + 2x - 15$",
        "Product −15, sum +2.",
        [
          [
            "One number is negative, because the product is",
            "negative",
            ["positive", "−15 is negative."],
            "One positive, one negative",
          ],
          ["The pair:", "+5 and −3", ["−5 and +3", "They add to −2."], "$(x + 5)(x - 3)$"],
        ],
        "Check: $-3x + 5x = 2x$ ✓",
      ),
      choose(
        "Together",
        "Factorise $x^2 - 8x + 15$",
        "$(x - 3)(x - 5)$",
        "Multiply to 15, add to −8.",
        [
          ["$(x + 3)(x + 5)$", "That gives $+8x$."],
          ["$(x - 1)(x - 15)$", "They add to −16."],
        ],
      ),
      choose(
        "Your turn",
        "Factorise $x^2 + 9x + 20$",
        "$(x + 4)(x + 5)$",
        "4 × 5 = 20, 4 + 5 = 9.",
        [
          ["$(x + 2)(x + 10)$", "They add to 12."],
          ["$(x + 9)(x + 20)$", "That's not it: multiply to 20."],
        ],
      ),
      choose(
        "Your turn",
        "Factorise $x^2 - x - 12$",
        "$(x - 4)(x + 3)$",
        "Multiply to −12, add to −1.",
        [
          ["$(x + 4)(x - 3)$", "That gives $+x$."],
          ["$(x - 6)(x + 2)$", "They add to −4."],
        ],
      ),
      choose(
        "Watch out",
        "Sam factorises $x^2 + 5x + 6$ as $(x + 1)(x + 6)$. What's wrong?",
        "1 + 6 = 7, not 5: it's $(x + 2)(x + 3)$",
        "The pair must also add to $b$.",
        [["Nothing", "Expand it: $x^2 + 7x + 6$."]],
      ),
      mistake(
        "Ivy factorises $x^2 - 2x - 8$.",
        ["Multiply to −8, add to −2", "The pair is +4 and −2", "$(x + 4)(x - 2)$"],
        1,
        "+4 and −2 add to +2. Use −4 and +2: $(x - 4)(x + 2)$.",
      ),
      choose(
        "Back to the problem",
        "“Factorise $x^2 + 7x + 12$.”",
        "$(x + 3)(x + 4)$",
        "3 × 4 = 12 and 3 + 4 = 7.",
        [
          ["$(x + 2)(x + 6)$", "They add to 8."],
          ["$x(x + 7) + 12$", "Fully factorise into two brackets."],
        ],
      ),
      quiz([
        [
          [
            "$x^2 + 6x + 8$",
            "$(x + 2)(x + 4)$",
            ["$(x + 1)(x + 8)$", "$(x + 6)(x + 8)$"],
            "2 and 4.",
          ],
          [
            "$x^2 + 8x + 15$",
            "$(x + 3)(x + 5)$",
            ["$(x + 1)(x + 15)$", "$(x + 8)(x + 15)$"],
            "3 and 5.",
          ],
        ],
        [
          [
            "$x^2 - 7x + 10$",
            "$(x - 2)(x - 5)$",
            ["$(x + 2)(x + 5)$", "$(x - 1)(x - 10)$"],
            "−2 and −5.",
          ],
          [
            "$x^2 - 9x + 18$",
            "$(x - 3)(x - 6)$",
            ["$(x + 3)(x + 6)$", "$(x - 2)(x - 9)$"],
            "−3 and −6.",
          ],
        ],
        [
          [
            "$x^2 + x - 6$",
            "$(x + 3)(x - 2)$",
            ["$(x - 3)(x + 2)$", "$(x + 6)(x - 1)$"],
            "+3 and −2.",
          ],
          [
            "$x^2 - 3x - 10$",
            "$(x - 5)(x + 2)$",
            ["$(x + 5)(x - 2)$", "$(x - 10)(x + 1)$"],
            "−5 and +2.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "difference-of-squares",
    "GF-A4.f",
    "The difference of two squares",
    "a² − b² = (a + b)(a − b).",
    [
      problem("A quick trick", [
        "“Factorise $x^2 - 49$.” There's no $x$ term, so the usual pair seems not to work. And how could you work out $51^2 - 49^2$ in your head?",
        "By the end of this lesson, you can do both in seconds.",
      ]),
      typed("Warm-up", "Work out $7^2$", "49", "$7 \\times 7$.", "49."),
      choose(
        "Warm-up",
        "Two numbers multiply to −49 and add to 0",
        "7 and −7",
        "$7 \\times -7 = -49$, $7 - 7 = 0$.",
        [["−7 and −7", "They multiply to +49."]],
      ),
      explain(
        "Discover",
        "The middle terms cancel",
        [
          "Expand $(x + 7)(x - 7)$: $x^2 - 7x + 7x - 49 = x^2 - 49$. The middle terms cancel out.",
          "So a **difference of two squares** always factorises: $a^2 - b^2 = (a + b)(a - b)$.",
        ],
        grid("$+7$", "$-7$", ["$x^2$", "$-7x$", "$7x$", "$-49$"]),
      ),
      choose("Discover", "Which is a difference of two squares?", "$x^2 - 25$", "$x^2 - 5^2$.", [
        ["$x^2 + 25$", "A sum, not a difference."],
        ["$x^2 - 20$", "20 isn't a square number."],
      ]),
      worked(
        "Factorise",
        "Factorise $x^2 - 49$.",
        [
          ["$x^2 - 49 = x^2 - 7^2$", "Spot the squares."],
          ["$(x + 7)(x - 7)$", "$a^2 - b^2 = (a + b)(a - b)$."],
        ],
        "Check: the middle terms cancel ✓",
      ),
      steps(
        "Together",
        "Factorise $9y^2 - 16$",
        "$9y^2 - 16$",
        [
          [
            "As squares:",
            "$(3y)^2 - 4^2$",
            ["$(9y)^2 - 16^2$", "$9y^2 = (3y)^2$."],
            "$(3y)^2 - 4^2$",
          ],
          [
            "So",
            "$(3y + 4)(3y - 4)$",
            ["$(3y - 4)^2$", "One plus, one minus."],
            "$(3y + 4)(3y - 4)$",
          ],
        ],
        "Check: $9y^2 - 12y + 12y - 16$ ✓",
      ),
      steps(
        "Together",
        "Work out $51^2 - 49^2$",
        "Use the pattern with numbers.",
        [
          [
            "$51^2 - 49^2 =$",
            "$(51 + 49)(51 - 49)$",
            ["$(51 - 49)^2$", "A difference of squares."],
            "$100 \\times 2$",
          ],
          ["So", "200", ["4", "$100 \\times 2$."], "200"],
        ],
        "No calculator needed.",
      ),
      choose("Your turn", "Factorise $x^2 - 64$", "$(x + 8)(x - 8)$", "$64 = 8^2$.", [
        ["$(x - 8)^2$", "That gives $-16x$."],
        ["$(x + 32)(x - 2)$", "Use the square root of 64."],
      ]),
      choose("Your turn", "Factorise $4x^2 - 1$", "$(2x + 1)(2x - 1)$", "$(2x)^2 - 1^2$.", [
        ["$(4x + 1)(4x - 1)$", "$\\sqrt{4x^2} = 2x$."],
        ["$(2x - 1)^2$", "One plus, one minus."],
      ]),
      choose(
        "Watch out",
        "Can $x^2 + 36$ be factorised the same way?",
        "No: it's a sum, not a difference",
        "Only $a^2 - b^2$ works.",
        [["Yes: $(x + 6)(x - 6)$", "That expands to $x^2 - 36$."]],
      ),
      mistake(
        "Leo factorises $x^2 - 81$.",
        ["$81 = 9^2$", "So $x^2 - 9^2$", "$(x - 9)(x - 9)$"],
        2,
        "One bracket is plus: $(x + 9)(x - 9)$.",
      ),
      choose(
        "Back to the problem",
        "“Factorise $x^2 - 49$.”",
        "$(x + 7)(x - 7)$",
        "Difference of two squares.",
        [
          ["$(x - 7)^2$", "That's $x^2 - 14x + 49$."],
          ["$x(x - 49)$", "That's $x^2 - 49x$."],
        ],
      ),
      quiz([
        [
          ["$x^2 - 9$", "$(x + 3)(x - 3)$", ["$(x - 3)^2$", "$(x + 9)(x - 1)$"], "$3^2$."],
          ["$x^2 - 100$", "$(x + 10)(x - 10)$", ["$(x - 10)^2$", "$(x + 50)(x - 2)$"], "$10^2$."],
        ],
        [
          [
            "$25x^2 - 4$",
            "$(5x + 2)(5x - 2)$",
            ["$(25x + 2)(x - 2)$", "$(5x - 2)^2$"],
            "$(5x)^2 - 2^2$.",
          ],
          [
            "$16x^2 - 9$",
            "$(4x + 3)(4x - 3)$",
            ["$(16x + 3)(x - 3)$", "$(4x - 3)^2$"],
            "$(4x)^2 - 3^2$.",
          ],
        ],
        [
          ["$21^2 - 19^2$", "80", ["4", "40"], "$40 \\times 2$."],
          ["$102^2 - 98^2$", "800", ["16", "400"], "$200 \\times 4$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "indices",
    "GF-A4.g",
    "Indices in algebra",
    "Add powers when multiplying, subtract when dividing, multiply for a power of a power.",
    [
      problem("Simplify", [
        "“Simplify $3x^4 \\times 5x^2$” and “$\\dfrac{12y^7}{4y^3}$” and “$(2a^3)^2$”. Three questions, three laws.",
        "By the end of this lesson, you'll know each law and why it works.",
      ]),
      choose("Warm-up", "$x^3$ means", "$x \\times x \\times x$", "Three $x$'s multiplied.", [
        ["$3x$", "That's $x + x + x$."],
      ]),
      typed("Warm-up", "Work out $3 \\times 5$", "15", "Times.", "15."),
      explain(
        "Discover",
        "Count the letters",
        [
          "$x^4 \\times x^2 = (x \\cdot x \\cdot x \\cdot x)(x \\cdot x) = x^6$: **add** the powers. $\\frac{x^7}{x^3}$: cancel 3, leaving $x^4$: **subtract**.",
          "$(x^3)^2 = x^3 \\times x^3 = x^6$: **multiply**. Numbers in front are multiplied or divided as usual.",
        ],
        {
          kind: "maths",
          tex: "x^a \\times x^b = x^{a+b} \\quad \\frac{x^a}{x^b} = x^{a-b} \\quad (x^a)^b = x^{ab}",
        },
      ),
      choose("Discover", "$x^5 \\times x^3 =$", "$x^8$", "Add the powers.", [
        ["$x^{15}$", "Multiply only for a power of a power."],
        ["$2x^8$", "There's no 2."],
      ]),
      worked(
        "All three",
        "Simplify $3x^4 \\times 5x^2$.",
        [
          ["Numbers: $3 \\times 5 = 15$", "Multiply."],
          ["Letters: $x^4 \\times x^2 = x^6$", "Add powers."],
          ["$15x^6$", "Together."],
        ],
        "Numbers and letters separately.",
      ),
      steps(
        "Together",
        "Simplify $\\dfrac{12y^7}{4y^3}$",
        "Divide.",
        [
          ["Numbers:", "3", ["8", "$12 \\div 4$."], "$3\\ldots$"],
          ["Letters:", "$y^4$", ["$y^{10}$", "Subtract when dividing."], "$3y^4$"],
        ],
        "$3y^4$.",
      ),
      steps(
        "Together",
        "Simplify $(2a^3)^2$",
        "Power of a power.",
        [
          ["$2^2 =$", "4", ["2", "Square the 2 too."], "$4\\ldots$"],
          ["$(a^3)^2 =$", "$a^6$", ["$a^5$", "Multiply the powers."], "$4a^6$"],
        ],
        "Everything in the bracket is squared.",
      ),
      choose("Your turn", "Simplify $2m^3 \\times 4m$", "$8m^4$", "$m = m^1$: $3 + 1$.", [
        ["$8m^3$", "$m$ is $m^1$."],
        ["$6m^4$", "Multiply 2 and 4."],
      ]),
      choose("Your turn", "Simplify $\\dfrac{20p^6}{5p^2}$", "$4p^4$", "$20 \\div 5$, $6 - 2$.", [
        ["$4p^3$", "Subtract: $6 - 2$."],
        ["$15p^4$", "Divide 20 by 5."],
      ]),
      choose(
        "Watch out",
        "Jo writes $x^2 \\times x^3 = x^6$. What's wrong?",
        "Add the powers: $x^5$",
        "Multiply powers only for $(x^2)^3$.",
        [["Nothing", "Count: two $x$'s then three: five."]],
      ),
      mistake(
        "Raj simplifies $(3b^4)^2$.",
        ["Square the bracket", "$(b^4)^2 = b^8$", "Answer: $3b^8$"],
        2,
        "Square the 3 too: $9b^8$.",
      ),
      choose(
        "Back to the problem",
        "“Simplify $3x^4 \\times 5x^2$.”",
        "$15x^6$",
        "Multiply numbers, add powers.",
        [
          ["$15x^8$", "Add the powers, don't multiply."],
          ["$8x^6$", "Multiply 3 and 5."],
        ],
      ),
      quiz([
        [
          ["$a^4 \\times a^5$", "$a^9$", ["$a^{20}$", "$a^1$"], "Add."],
          ["$k^2 \\times k^6$", "$k^8$", ["$k^{12}$", "$k^4$"], "Add."],
        ],
        [
          ["$\\dfrac{x^9}{x^4}$", "$x^5$", ["$x^{13}$", "$x^{2.25}$"], "Subtract."],
          ["$\\dfrac{y^{10}}{y^2}$", "$y^8$", ["$y^5$", "$y^{12}$"], "Subtract."],
        ],
        [
          ["$(m^3)^4$", "$m^{12}$", ["$m^7$", "$4m^3$"], "Multiply."],
          ["$(2n^2)^3$", "$8n^6$", ["$2n^6$", "$6n^5$"], "Cube the 2, multiply powers."],
        ],
      ]),
    ],
  ),
];
