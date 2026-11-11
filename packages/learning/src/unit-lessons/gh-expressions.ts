// GCSE Higher, "Expressions and proof", as six short lessons, one just before each skill: using
// identities, writing algebraic proofs, expanding three brackets, factorising ax² + bx + c,
// simplifying algebraic fractions and simplifying expressions with surds. Each recaps the
// Foundation idea quickly, builds it to Higher level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gh-expressions";

export const ghExpressions: UnitLesson[] = [
  lesson(
    U,
    "identities",
    "GH-A3",
    "Using identities",
    "Expand and match coefficients to find unknown constants.",
    [
      problem("Find a and b", [
        "“$(x + a)^2 + b \\equiv x^2 + 6x + 11$. Find the values of $a$ and $b$.”",
        "By the end of this lesson, you can find constants by comparing both sides of an identity.",
      ]),
      choose("Warm-up", "$(x + 3)^2$ expands to", "$x^2 + 6x + 9$", "$(x + 3)(x + 3)$.", [
        ["$x^2 + 9$", "Middle term missing."],
        ["$x^2 + 3x + 9$", "Two lots of $3x$."],
      ]),
      typed("Warm-up", "If $2a = 6$, $a =$", "3", "Divide by 2.", "3."),
      explain("Discover", "Match the coefficients", [
        "An identity (≡) is true for every $x$, so the coefficients of $x^2$, of $x$ and the constants must match on both sides.",
        "Expand one side, line it up with the other and compare term by term.",
      ]),
      choose("Discover", "$ax + 5 \\equiv 3x + b$ means", "$a = 3$ and $b = 5$", "Match terms.", [
        ["$a = 5$ and $b = 3$", "Match $x$ with $x$."],
        ["any $a$ and $b$", "It must hold for every $x$."],
      ]),
      worked(
        "The problem",
        "$(x + a)^2 + b \\equiv x^2 + 6x + 11$.",
        [
          ["LHS $= x^2 + 2ax + a^2 + b$", "Expand."],
          ["$x$ terms: $2a = 6$, so $a = 3$", "Compare."],
          ["Constants: $9 + b = 11$, so $b = 2$", "Compare."],
        ],
        "$a = 3$, $b = 2$.",
      ),
      steps(
        "Together",
        "$3(x + p) - 2 \\equiv 3x + 10$. Find $p$.",
        "Expand and compare.",
        [
          ["LHS:", "$3x + 3p - 2$", ["$3x + p - 2$", "Multiply $p$ by 3."], "$3x + 3p - 2$"],
          ["Constants:", "$3p - 2 = 10$, so $p = 4$", ["$p = 12$", "$3p = 12$."], "$p = 4$"],
        ],
        "Check: $3(x + 4) - 2 = 3x + 10$.",
      ),
      choose(
        "Together",
        "$(x + 5)(x + q) \\equiv x^2 + 8x + 15$. $q =$",
        "3",
        "$5 + q = 8$ and $5q = 15$.",
        [
          ["8", "That's the sum."],
          ["15", "That's the product."],
        ],
      ),
      typed(
        "Your turn",
        "$a(x - 2) \\equiv 4x - 8$. $a =$",
        "4",
        "Match the $x$ terms.",
        "$a = 4$.",
      ),
      typed(
        "Your turn",
        "$(x - 1)^2 + c \\equiv x^2 - 2x + 7$. $c =$",
        "6",
        "$1 + c = 7$.",
        "$c = 6$.",
      ),
      choose(
        "Watch out",
        "Ben solves $(x + a)^2 \\equiv x^2 + 10x + 25$ by trying $x = 0$ only. What's the risk?",
        "Matching every coefficient checks it fully",
        "One value might be lucky.",
        [["Nothing", "Compare all terms."]],
      ),
      mistake(
        "Kim finds $a$ in $(x + a)^2 \\equiv x^2 + 8x + 16$.",
        ["LHS $= x^2 + ax + a^2$", "So $a = 8$", "Check: $64 \\ne 16$"],
        0,
        "The middle term is $2ax$, so $2a = 8$ and $a = 4$.",
      ),
      choose(
        "Back to the problem",
        "“Find $a$ and $b$.”",
        "$a = 3$, $b = 2$",
        "$2a = 6$, $a^2 + b = 11$.",
        [
          ["$a = 6$, $b = 11$", "Match after expanding."],
          ["$a = 3$, $b = 11$", "$9 + b = 11$."],
        ],
      ),
      quiz([
        [
          ["$5(x + k) \\equiv 5x + 20$. $k$", "4", ["20", "15"], "$5k = 20$."],
          ["$2(x + k) \\equiv 2x + 14$. $k$", "7", ["14", "12"], "$2k = 14$."],
        ],
        [
          ["$(x + a)^2 \\equiv x^2 + 12x + 36$. $a$", "6", ["12", "36"], "$2a = 12$."],
          ["$(x + a)^2 \\equiv x^2 + 4x + 4$. $a$", "2", ["4", "1"], "$2a = 4$."],
        ],
        [
          ["An identity holds", "for every value", ["for one value", "for no values"], "≡."],
          [
            "To find constants, compare",
            "coefficients",
            ["only the constants", "one value"],
            "Term by term.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "proof",
    "GH-A6",
    "Algebraic proof",
    "Write general numbers with letters and show the result for all of them.",
    [
      problem("Prove it", [
        "“Prove that the difference between the squares of two consecutive odd numbers is always a multiple of 8.”",
        "By the end of this lesson, you can write a full algebraic proof.",
      ]),
      choose(
        "Warm-up",
        "Consecutive odd numbers",
        "$2n + 1$ and $2n + 3$",
        "Odd numbers go up in 2s.",
        [
          ["$2n + 1$ and $2n + 2$", "$2n + 2$ is even."],
          ["$n$ and $n + 2$", "$n$ could be even."],
        ],
      ),
      choose("Warm-up", "$(2n + 3)^2$ expands to", "$4n^2 + 12n + 9$", "Square the bracket.", [
        ["$4n^2 + 9$", "Middle term missing."],
        ["$4n^2 + 6n + 9$", "Twice $6n$."],
      ]),
      explain("Discover", "A proof covers every case", [
        "Choose letters that describe any number of the right kind. Expand and simplify. Then **factorise** to show the property, and finish with a sentence.",
        "Even: $2n$. Odd: $2n + 1$. Multiple of 8: $8 \\times$ (a whole number).",
      ]),
      choose(
        "Discover",
        "To show something is a multiple of 8, write it as",
        "$8 \\times$ a whole number",
        "Factor of 8.",
        [
          ["$8 +$ something", "Not a multiple."],
          ["an example", "Not a proof."],
        ],
      ),
      worked(
        "The proof",
        "Odd numbers $2n + 1$ and $2n + 3$.",
        [
          ["$(2n + 3)^2 - (2n + 1)^2$", "Difference of squares."],
          ["$= 4n^2 + 12n + 9 - 4n^2 - 4n - 1 = 8n + 8$", "Expand and simplify."],
          ["$= 8(n + 1)$: a multiple of 8", "Factorise and conclude."],
        ],
        "Every pair of consecutive odd numbers.",
      ),
      steps(
        "Together",
        "Prove $(n + 1)^2 - (n - 1)^2$ is a multiple of 4",
        "Expand.",
        [
          [
            "Expand:",
            "$n^2 + 2n + 1 - n^2 + 2n - 1$",
            ["$n^2 + 2n + 1 - n^2 - 2n + 1$", "Minus every term of the second."],
            "$4n$",
          ],
          [
            "Conclude:",
            "$4n$ is 4 × a whole number",
            ["$4n$ is even", "True, but say multiple of 4."],
            "A multiple of 4",
          ],
        ],
        "Brackets after a minus: change every sign.",
      ),
      choose(
        "Together",
        "Show $n^2 + n$ is always even. Factorise:",
        "$n(n + 1)$: one of two consecutive numbers is even",
        "Product of consecutive integers.",
        [
          ["$n^2 + n = 2n$", "Not true."],
          ["Try $n = 3$: 12", "An example."],
        ],
      ),
      choose(
        "Your turn",
        "The sum of three consecutive even numbers",
        "$6n + 6 = 6(n + 1)$",
        "$2n + 2n + 2 + 2n + 4$.",
        [
          ["$6n$", "Add the 2 and the 4."],
          ["$3n + 6$", "Even numbers are $2n$."],
        ],
      ),
      choose("Your turn", "So it's always a multiple of", "6", "$6(n + 1)$.", [
        ["4", "Not always."],
        ["12", "Try 2, 4, 6: 12, but 4, 6, 8: 18."],
      ]),
      choose(
        "Watch out",
        "Ivy writes the two odd numbers as $2n + 1$ and $2m + 1$ for consecutive odds. What's wrong?",
        "Consecutive means linked: use $2n + 1$ and $2n + 3$",
        "Different letters lose the link.",
        [["Nothing", "That's for any two odd numbers."]],
      ),
      mistake(
        "Leo expands $(2n + 3)^2 - (2n + 1)^2$.",
        ["$4n^2 + 12n + 9 - 4n^2 + 4n + 1$", "$= 16n + 10$", "Not a multiple of 8"],
        0,
        "Subtract every term: $-4n^2 - 4n - 1$. Then $8n + 8$.",
      ),
      choose(
        "Back to the problem",
        "The key line of the proof:",
        "$8n + 8 = 8(n + 1)$",
        "Factor of 8.",
        [
          ["$9 - 1 = 8$", "One example."],
          ["$8n + 8$ is even", "Show the 8."],
        ],
      ),
      quiz([
        [
          ["Any even number", "$2n$", ["$n + 2$", "$2n + 1$"], "2 × n."],
          [
            "Consecutive even numbers",
            "$2n$, $2n + 2$",
            ["$2n$, $2n + 1$", "$n$, $n + 2$"],
            "Up in 2s.",
          ],
        ],
        [
          ["$4(n + 3)$ is a multiple of", "4", ["3", "12"], "Factor 4."],
          ["$10n + 15 = 5(2n + 3)$, a multiple of", "5", ["10", "15"], "Factor 5."],
        ],
        [
          ["A proof must work for", "every case", ["three examples", "the first case"], "General."],
          [
            "End a proof with",
            "a conclusion sentence",
            ["an example", "a question"],
            "Say what's shown.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "three-binomials",
    "GH-A4.a",
    "Expanding three brackets",
    "Expand two, then multiply the result by the third.",
    [
      problem("The volume", [
        "A cuboid measures $(x + 1)$ by $(x + 2)$ by $(x + 3)$. “Show that its volume is $x^3 + 6x^2 + 11x + 6$.”",
        "By the end of this lesson, you can expand three brackets.",
      ]),
      choose("Warm-up", "$(x + 1)(x + 2)$", "$x^2 + 3x + 2$", "Four terms, collect.", [
        ["$x^2 + 2$", "Middle terms."],
        ["$x^2 + 3x + 3$", "$1 \\times 2 = 2$."],
      ]),
      choose("Warm-up", "$x(x^2 + 3x + 2)$", "$x^3 + 3x^2 + 2x$", "Each term × $x$.", [
        ["$x^3 + 3x + 2$", "Every term."],
        ["$x^2 + 3x^2 + 2x$", "$x \\times x^2 = x^3$."],
      ]),
      explain("Discover", "Two, then the third", [
        "Expand any two brackets first. Then multiply every term of that answer by every term of the third bracket.",
        "With three brackets there are 8 products before collecting. Set them out in a grid or in rows.",
      ]),
      choose(
        "Discover",
        "How many products before collecting in $(a + b)(c + d)(e + f)$?",
        "8",
        "$2 \\times 2 \\times 2$.",
        [
          ["6", "Each term of each bracket."],
          ["4", "That's two brackets."],
        ],
      ),
      worked(
        "The cuboid",
        "Expand $(x + 1)(x + 2)(x + 3)$.",
        [
          ["$(x + 1)(x + 2) = x^2 + 3x + 2$", "First two."],
          ["$(x^2 + 3x + 2)(x + 3) = x^3 + 3x^2 + 3x^2 + 9x + 2x + 6$", "Times the third."],
          ["$= x^3 + 6x^2 + 11x + 6$", "Collect."],
        ],
        "As required.",
      ),
      steps(
        "Together",
        "Expand $(x + 2)(x - 1)(x + 4)$",
        "Start with the first two.",
        [
          [
            "$(x + 2)(x - 1) =$",
            "$x^2 + x - 2$",
            ["$x^2 - x - 2$", "$2x - x = +x$."],
            "$x^2 + x - 2$",
          ],
          [
            "Times $(x + 4)$:",
            "$x^3 + 5x^2 + 2x - 8$",
            ["$x^3 + 5x^2 - 2x - 8$", "$4x - 2x = 2x$."],
            "$x^3 + 5x^2 + 2x - 8$",
          ],
        ],
        "Check the constant: $2 \\times -1 \\times 4 = -8$.",
      ),
      choose(
        "Together",
        "The constant term of $(x + 2)(x + 3)(x + 5)$",
        "30",
        "$2 \\times 3 \\times 5$.",
        [
          ["10", "Multiply, don't add."],
          ["$x$", "It's a number."],
        ],
      ),
      choose("Your turn", "$(x + 1)^3$", "$x^3 + 3x^2 + 3x + 1$", "$(x^2 + 2x + 1)(x + 1)$.", [
        ["$x^3 + 1$", "Missing middle terms."],
        ["$x^3 + 3x + 1$", "Missing $3x^2$."],
      ]),
      typed(
        "Your turn",
        "The coefficient of $x^2$ in $(x + 1)(x + 2)(x + 4)$",
        "7",
        "1 + 2 + 4.",
        "7.",
      ),
      choose(
        "Watch out",
        "Ola writes $(x + 2)^3 = x^3 + 8$. What's wrong?",
        "Cubing a bracket has middle terms: $x^3 + 6x^2 + 12x + 8$",
        "Expand fully.",
        [["Nothing", "Try $x = 1$: 27 vs 9."]],
      ),
      mistake(
        "Zoe expands $(x + 1)(x + 1)(x - 2)$.",
        [
          "$(x + 1)^2 = x^2 + 2x + 1$",
          "Times $(x - 2)$: $x^3 - 2x^2 + 2x^2 - 4x + x - 2$",
          "$= x^3 - 3x + 2$",
        ],
        2,
        "The constant is $1 \\times -2 = -2$: $x^3 - 3x - 2$.",
      ),
      choose(
        "Back to the problem",
        "“Show the volume is $x^3 + 6x^2 + 11x + 6$.” The $x$ term comes from",
        "$9x + 2x$",
        "After the third bracket.",
        [
          ["$3x + 3x$", "Those are $x^2$ terms."],
          ["$1 + 2 + 3$", "That gives $6x^2$."],
        ],
      ),
      quiz([
        [
          ["Constant of $(x + 1)(x + 4)(x + 5)$", "20", ["10", "9"], "Multiply."],
          ["Constant of $(x - 1)(x + 2)(x + 3)$", "−6", ["6", "4"], "Multiply."],
        ],
        [
          ["$x^2$ coefficient of $(x + 1)(x + 3)(x + 5)$", "9", ["15", "8"], "Sum."],
          ["$x^2$ coefficient of $(x + 2)(x + 2)(x + 1)$", "5", ["4", "3"], "Sum."],
        ],
        [
          ["Three brackets: products before collecting", "8", ["6", "9"], "2 × 2 × 2."],
          ["Highest power in three linear brackets", "$x^3$", ["$x^2$", "$x^6$"], "One $x$ each."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "factorise-ax2",
    "GH-A4.b",
    "Factorising ax² + bx + c",
    "Find two numbers that multiply to ac and add to b, then split the middle.",
    [
      problem("Harder quadratics", [
        "“Factorise $2x^2 + 7x + 3$.” With a number in front of $x^2$, the Foundation method needs one more step.",
        "By the end of this lesson, you can factorise these.",
      ]),
      choose("Warm-up", "Factorise $x^2 + 5x + 6$", "$(x + 2)(x + 3)$", "2 × 3 = 6, 2 + 3 = 5.", [
        ["$(x + 1)(x + 6)$", "1 + 6 = 7."],
        ["$(x + 5)(x + 1)$", "Product 5."],
      ]),
      typed(
        "Warm-up",
        "Two numbers that multiply to 6 and add to 7. The larger?",
        "6",
        "1 and 6.",
        "1 and 6.",
      ),
      explain("Discover", "Split the middle term", [
        "For $ax^2 + bx + c$, find two numbers that multiply to $a \\times c$ and add to $b$.",
        "Use them to split $bx$ into two terms, then factorise in pairs.",
      ]),
      choose("Discover", "For $2x^2 + 7x + 3$: multiply to", "6", "$a \\times c = 2 \\times 3$.", [
        ["3", "Multiply $a$ by $c$."],
        ["7", "That's the sum."],
      ]),
      worked(
        "Split it",
        "Factorise $2x^2 + 7x + 3$.",
        [
          ["Numbers: 1 and 6 (× 6, + 7)", "ac = 6."],
          ["$2x^2 + x + 6x + 3$", "Split the middle."],
          ["$x(2x + 1) + 3(2x + 1) = (2x + 1)(x + 3)$", "In pairs."],
        ],
        "Check by expanding.",
      ),
      steps(
        "Together",
        "Factorise $3x^2 - 10x + 8$",
        "ac = 24.",
        [
          [
            "Multiply to 24, add to −10:",
            "−4 and −6",
            ["4 and 6", "They must add to −10."],
            "−4, −6",
          ],
          [
            "Split and pair:",
            "$(3x - 4)(x - 2)$",
            ["$(3x - 2)(x - 4)$", "Expand to check: $-12x - 2x$."],
            "$(3x - 4)(x - 2)$",
          ],
        ],
        "$3x^2 - 6x - 4x + 8$.",
      ),
      choose("Together", "$2x^2 - x - 3 =$", "$(2x - 3)(x + 1)$", "ac = −6: −3 and 2.", [
        ["$(2x + 3)(x - 1)$", "Gives $+x$."],
        ["$(2x - 1)(x + 3)$", "Gives $+5x$."],
      ]),
      choose("Your turn", "$5x^2 + 11x + 2 =$", "$(5x + 1)(x + 2)$", "ac = 10: 1 and 10.", [
        ["$(5x + 2)(x + 1)$", "Gives $7x$."],
        ["$(5x + 1)(x + 1)$", "Constant 1."],
      ]),
      choose("Your turn", "$4x^2 - 9 =$", "$(2x - 3)(2x + 3)$", "Difference of two squares.", [
        ["$(4x - 3)(x + 3)$", "Gives $9x$."],
        ["$(2x - 9)(2x + 1)$", "Constant −9 but middle −16x."],
      ]),
      choose(
        "Watch out",
        "Ben factorises $2x^2 + 7x + 3$ as $(x + 1)(x + 6)$. What's wrong?",
        "He ignored the 2: expand to check",
        "That gives $x^2 + 7x + 6$.",
        [["Nothing", "The $x^2$ coefficient doesn't match."]],
      ),
      mistake(
        "Kim factorises $3x^2 + 5x + 2$.",
        ["ac = 6: 2 and 3", "$3x^2 + 2x + 3x + 2$", "$= (3x + 3)(x + 2)$"],
        2,
        "Pairs: $x(3x + 2) + 1(3x + 2) = (3x + 2)(x + 1)$.",
      ),
      choose(
        "Back to the problem",
        "“Factorise $2x^2 + 7x + 3$.”",
        "$(2x + 1)(x + 3)$",
        "Split $7x$ as $x + 6x$.",
        [
          ["$(2x + 3)(x + 1)$", "Gives $5x$."],
          ["$(x + 1)(x + 6)$", "Gives $x^2$."],
        ],
      ),
      quiz([
        [
          [
            "$2x^2 + 5x + 2$",
            "$(2x + 1)(x + 2)$",
            ["$(2x + 2)(x + 1)$", "$(x + 1)(x + 4)$"],
            "ac = 4: 1, 4.",
          ],
          [
            "$2x^2 + 5x + 3$",
            "$(2x + 3)(x + 1)$",
            ["$(2x + 1)(x + 3)$", "$(x + 2)(x + 3)$"],
            "ac = 6: 2, 3.",
          ],
        ],
        [
          [
            "$3x^2 + 7x + 2$",
            "$(3x + 1)(x + 2)$",
            ["$(3x + 2)(x + 1)$", "$(x + 1)(x + 6)$"],
            "ac = 6: 1, 6.",
          ],
          [
            "$3x^2 + 5x + 2$",
            "$(3x + 2)(x + 1)$",
            ["$(3x + 1)(x + 2)$", "$(x + 2)(x + 3)$"],
            "ac = 6: 2, 3.",
          ],
        ],
        [
          ["For $ax^2 + bx + c$, the pair multiplies to", "$ac$", ["$c$", "$b$"], "a × c."],
          ["…and adds to", "$b$", ["$a$", "$ac$"], "Middle."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "algebraic-fractions",
    "GH-A4.c",
    "Simplifying algebraic fractions",
    "Factorise top and bottom, then cancel whole brackets.",
    [
      problem("Simplify fully", [
        "“Simplify fully $\\frac{x^2 - 9}{x^2 + 5x + 6}$.” And “Write $\\frac{2}{x} + \\frac{3}{x + 1}$ as a single fraction.”",
        "By the end of this lesson, you can do both.",
      ]),
      choose("Warm-up", "$\\frac{12}{18}$ simplified", "$\\frac23$", "Cancel 6.", [
        ["$\\frac{6}{9}$", "Cancel more."],
        ["$\\frac{1}{6}$", "Divide both by 6."],
      ]),
      choose("Warm-up", "Factorise $x^2 - 9$", "$(x - 3)(x + 3)$", "Difference of squares.", [
        ["$(x - 9)(x + 1)$", "Gives $-8x$."],
        ["$(x - 3)^2$", "Gives $-6x$."],
      ]),
      explain("Discover", "Cancel factors, not terms", [
        "Factorise the top and the bottom fully. Then cancel any bracket that appears in both.",
        "To add or subtract, use a common denominator, as with number fractions: multiply each top by what its bottom is missing.",
      ]),
      choose(
        "Discover",
        "Can you cancel the $x$ in $\\frac{x + 3}{x}$?",
        "No: $x$ is not a factor of the top",
        "Only whole factors cancel.",
        [["Yes, giving 3", "Try $x = 1$: 4, not 3."]],
      ),
      worked(
        "Simplify",
        "$\\frac{x^2 - 9}{x^2 + 5x + 6}$",
        [
          ["$= \\frac{(x - 3)(x + 3)}{(x + 2)(x + 3)}$", "Factorise both."],
          ["$= \\frac{x - 3}{x + 2}$", "Cancel $(x + 3)$."],
        ],
        "Fully simplified.",
      ),
      steps(
        "Together",
        "Write $\\frac{2}{x} + \\frac{3}{x + 1}$ as one fraction",
        "Common denominator.",
        [
          ["Denominator:", "$x(x + 1)$", ["$x + x + 1$", "Multiply the bottoms."], "$x(x + 1)$"],
          [
            "Top:",
            "$2(x + 1) + 3x = 5x + 2$",
            ["$2 + 3 = 5$", "Each top times the other bottom."],
            "$\\frac{5x + 2}{x(x + 1)}$",
          ],
        ],
        "Like $\\frac23 + \\frac34$.",
      ),
      choose(
        "Together",
        "$\\frac{2x + 6}{4}$ simplified",
        "$\\frac{x + 3}{2}$",
        "Factor 2 on top.",
        [
          ["$\\frac{2x + 3}{2}$", "Divide every term by 2."],
          ["$x + \\frac64$", "Factorise first."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac{x^2 + 3x}{x^2 - 9}$",
        "$\\frac{x}{x - 3}$",
        "$\\frac{x(x + 3)}{(x - 3)(x + 3)}$.",
        [
          ["$\\frac{3x}{-9}$", "Cancel factors, not terms."],
          ["$\\frac{x + 3}{x - 3}$", "Top is $x(x + 3)$."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac{1}{x} - \\frac{1}{x + 2}$",
        "$\\frac{2}{x(x + 2)}$",
        "$(x + 2) - x$ on top.",
        [
          ["$\\frac{0}{2}$", "Common denominator first."],
          ["$\\frac{-2}{x(x + 2)}$", "$x + 2 - x = +2$."],
        ],
      ),
      choose(
        "Watch out",
        "Ivy cancels the $x^2$ in $\\frac{x^2 + 1}{x^2 + 4}$. What's wrong?",
        "$x^2$ is a term, not a factor of both",
        "Nothing cancels here.",
        [["Nothing", "Try $x = 1$: $\\frac25 \\ne \\frac14$."]],
      ),
      mistake(
        "Leo simplifies $\\frac{x^2 - 4}{x - 2}$.",
        ["$\\frac{x^2 - 4}{x - 2}$", "Cancel $x$: $\\frac{x - 4}{-2}$", "Answer"],
        1,
        "Factorise: $\\frac{(x - 2)(x + 2)}{x - 2} = x + 2$.",
      ),
      choose(
        "Back to the problem",
        "“Simplify fully $\\frac{x^2 - 9}{x^2 + 5x + 6}$.”",
        "$\\frac{x - 3}{x + 2}$",
        "Cancel $(x + 3)$.",
        [
          ["$\\frac{-9}{5x + 6}$", "Cancel factors, not terms."],
          ["$\\frac{x + 3}{x + 2}$", "The top is $(x - 3)(x + 3)$."],
        ],
      ),
      quiz([
        [
          ["$\\frac{3x + 9}{3}$", "$x + 3$", ["$x + 9$", "$3x + 3$"], "Factor 3."],
          ["$\\frac{5x - 10}{5}$", "$x - 2$", ["$x - 10$", "$5x - 2$"], "Factor 5."],
        ],
        [
          ["$\\frac{x^2 - 1}{x + 1}$", "$x - 1$", ["$x$", "$x^2$"], "Difference of squares."],
          [
            "$\\frac{x^2 - 25}{x - 5}$",
            "$x + 5$",
            ["$x - 5$", "$x + 25$"],
            "Difference of squares.",
          ],
        ],
        [
          [
            "$\\frac{1}{x} + \\frac{1}{2x}$",
            "$\\frac{3}{2x}$",
            ["$\\frac{2}{3x}$", "$\\frac{1}{3x}$"],
            "$\\frac{2 + 1}{2x}$.",
          ],
          [
            "$\\frac{1}{x} + \\frac{2}{3x}$",
            "$\\frac{5}{3x}$",
            ["$\\frac{3}{4x}$", "$\\frac{2}{3x}$"],
            "$\\frac{3 + 2}{3x}$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "surd-expressions",
    "GH-A4.d",
    "Simplifying expressions with surds",
    "Simplify each surd, then collect, expand or rationalise.",
    [
      problem("In the form a + b√c", [
        "“Show that $\\frac{(4 + \\sqrt3)(4 - \\sqrt3)}{\\sqrt{13}}$ can be written as $\\sqrt{13}$.” And “Expand $(2 + \\sqrt3)^2$, giving your answer as $a + b\\sqrt3$.”",
        "By the end of this lesson, you can combine all your surd skills.",
      ]),
      choose("Warm-up", "$\\sqrt{27}$", "$3\\sqrt3$", "$9 \\times 3$.", [
        ["$9\\sqrt3$", "$\\sqrt9 = 3$."],
        ["$3\\sqrt9$", "Simplify fully."],
      ]),
      typed("Warm-up", "$(4 + \\sqrt3)(4 - \\sqrt3)$", "13", "$16 - 3$.", "13."),
      explain("Discover", "One step at a time", [
        "Simplify every surd first, collect like surds, expand brackets, and rationalise any surd on the bottom.",
        "Give the answer in the form asked, such as $a + b\\sqrt c$ with whole numbers $a$, $b$ and $c$.",
      ]),
      choose("Discover", "$\\sqrt{50} + \\sqrt{18}$", "$8\\sqrt2$", "$5\\sqrt2 + 3\\sqrt2$.", [
        ["$\\sqrt{68}$", "Simplify first."],
        ["$15\\sqrt2$", "Add, don't multiply."],
      ]),
      worked(
        "The first",
        "$\\frac{(4 + \\sqrt3)(4 - \\sqrt3)}{\\sqrt{13}}$",
        [
          ["Top: $16 - 3 = 13$", "Difference of squares."],
          ["$\\frac{13}{\\sqrt{13}} = \\frac{13\\sqrt{13}}{13} = \\sqrt{13}$", "Rationalise."],
        ],
        "As required.",
      ),
      steps(
        "Together",
        "Expand $(2 + \\sqrt3)^2$ as $a + b\\sqrt3$",
        "Square the bracket.",
        [
          ["Terms:", "$4 + 2\\sqrt3 + 2\\sqrt3 + 3$", ["$4 + 3$", "Middle terms."], "Four terms"],
          ["Collect:", "$7 + 4\\sqrt3$", ["$7 + 2\\sqrt3$", "Two lots."], "$a = 7$, $b = 4$"],
        ],
        "$7 + 4\\sqrt3$.",
      ),
      choose("Together", "$\\sqrt2(\\sqrt8 + 3)$", "$4 + 3\\sqrt2$", "$\\sqrt{16} + 3\\sqrt2$.", [
        ["$\\sqrt{10} + 3$", "Multiply both terms."],
        ["$7\\sqrt2$", "Unlike terms."],
      ]),
      choose(
        "Your turn",
        "$(\\sqrt5 + 1)(\\sqrt5 + 3)$",
        "$8 + 4\\sqrt5$",
        "$5 + 3\\sqrt5 + \\sqrt5 + 3$.",
        [
          ["$8$", "Middle terms add."],
          ["$5 + 4\\sqrt5$", "Add the 3."],
        ],
      ),
      choose("Your turn", "$\\frac{\\sqrt{20}}{\\sqrt5}$", "2", "$\\sqrt{4}$.", [
        ["$\\sqrt{15}$", "Divide, don't subtract."],
        ["4", "$\\sqrt4 = 2$."],
      ]),
      choose(
        "Watch out",
        "Raj writes $\\sqrt{12} + \\sqrt3 = \\sqrt{15}$. What's wrong?",
        "Simplify first: $2\\sqrt3 + \\sqrt3 = 3\\sqrt3$",
        "Roots don't add.",
        [["Nothing", "$\\sqrt{15} \\ne 3\\sqrt3$."]],
      ),
      mistake(
        "Zoe expands $(3 - \\sqrt2)^2$.",
        ["$9 - 3\\sqrt2 - 3\\sqrt2 + 2$", "$= 11 - 6\\sqrt2$", "Then $= 5\\sqrt2$"],
        2,
        "$11$ and $6\\sqrt2$ are unlike: the answer stays $11 - 6\\sqrt2$.",
      ),
      choose(
        "Back to the problem",
        "“Expand $(2 + \\sqrt3)^2$ as $a + b\\sqrt3$.”",
        "$7 + 4\\sqrt3$",
        "$4 + 4\\sqrt3 + 3$.",
        [
          ["$7$", "Middle terms."],
          ["$4 + 3\\sqrt3$", "Square each part properly."],
        ],
      ),
      quiz([
        [
          [
            "$\\sqrt{8} + \\sqrt{32}$",
            "$6\\sqrt2$",
            ["$\\sqrt{40}$", "$8\\sqrt2$"],
            "$2\\sqrt2 + 4\\sqrt2$.",
          ],
          [
            "$\\sqrt{12} + \\sqrt{75}$",
            "$7\\sqrt3$",
            ["$\\sqrt{87}$", "$9\\sqrt3$"],
            "$2\\sqrt3 + 5\\sqrt3$.",
          ],
        ],
        [
          ["$(1 + \\sqrt2)^2$", "$3 + 2\\sqrt2$", ["$3$", "$1 + 2\\sqrt2$"], "$1 + 2\\sqrt2 + 2$."],
          ["$(1 + \\sqrt5)^2$", "$6 + 2\\sqrt5$", ["$6$", "$1 + 2\\sqrt5$"], "$1 + 2\\sqrt5 + 5$."],
        ],
        [
          [
            "$\\frac{6}{\\sqrt2}$",
            "$3\\sqrt2$",
            ["$6\\sqrt2$", "$\\frac{\\sqrt2}{3}$"],
            "Rationalise.",
          ],
          [
            "$\\frac{10}{\\sqrt2}$",
            "$5\\sqrt2$",
            ["$10\\sqrt2$", "$\\frac{\\sqrt2}{5}$"],
            "Rationalise.",
          ],
        ],
      ]),
    ],
  ),
];
