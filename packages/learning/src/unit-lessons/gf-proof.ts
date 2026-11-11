// GCSE Foundation, "Algebraic argument", as three short lessons, one just before each skill:
// telling equations from identities, showing two expressions are equivalent, and using algebra to
// support an argument. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names
// the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-proof";

export const gfProof: UnitLesson[] = [
  lesson(
    U,
    "equation-identity",
    "GF-A6.a",
    "Equations and identities",
    "An equation is true for some values; an identity (≡) for all.",
    [
      problem("True sometimes, or always?", [
        "“Which of these is an identity? $3(x + 2) = 3x + 6$ or $3x + 2 = 11$. Give a reason.”",
        "By the end of this lesson, you can tell them apart and use the ≡ sign.",
      ]),
      typed("Warm-up", "Solve $3x + 2 = 11$", "3", "Subtract 2, divide by 3.", "$x = 3$.", {
        unit: "x =",
      }),
      typed("Warm-up", "Expand $3(x + 2)$", "3x+6", "Multiply each term.", "$3x + 6$."),
      explain("Discover", "Sometimes or always", [
        "An **equation** is true only for certain values: $3x + 2 = 11$ only when $x = 3$.",
        "An **identity** is true for every value: both sides are the same expression. It's written with **≡**: $3(x + 2) \\equiv 3x + 6$.",
        "A **formula** links quantities, like $A = \\pi r^2$. An **expression** has no equals sign at all.",
      ]),
      choose("Discover", "$2(x + 5) \\equiv 2x + 10$ is", "an identity", "True for every $x$.", [
        ["an equation", "No single solution: always true."],
        ["a formula", "It doesn't link different quantities."],
      ]),
      worked(
        "Test it",
        "Is $x^2 + 2x \\equiv x(x + 2)$?",
        [
          ["Expand: $x(x + 2) = x^2 + 2x$", "Simplify one side."],
          ["Both sides are identical", "So it's an identity."],
        ],
        "Make one side look like the other.",
      ),
      steps(
        "Together",
        "Is $4x - 1 = 2x + 7$ an identity?",
        "Check.",
        [
          [
            "Try $x = 0$:",
            "−1 and 7: not equal",
            ["equal", "$4(0) - 1 = -1$."],
            "Not true for $x = 0$",
          ],
          [
            "So it's",
            "an equation (true when $x = 4$)",
            ["an identity", "One value fails."],
            "Equation",
          ],
        ],
        "One counter-example rules out an identity.",
      ),
      choose("Together", "Which is a formula?", "$v = u + at$", "Links quantities.", [
        ["$5x - 3$", "An expression."],
        ["$x + 4 = 9$", "An equation."],
      ]),
      choose("Your turn", "$5(x - 1) \\equiv 5x - 5$ is", "an identity", "Expand.", [
        ["an equation", "Always true."],
      ]),
      choose("Your turn", "$x^2 = 9$ is", "an equation", "True for $\\pm 3$ only.", [
        ["an identity", "Try $x = 1$."],
        ["an expression", "It has an equals sign."],
      ]),
      choose(
        "Watch out",
        "Ivy says $2x + 3 = 3 + 2x$ is an equation. What's wrong?",
        "It's true for every $x$: an identity",
        "Same terms, reordered.",
        [["Nothing", "Try any value: always equal."]],
      ),
      mistake(
        "Ben checks whether $(x + 1)^2 \\equiv x^2 + 1$.",
        ["Try $x = 0$: 1 = 1", "So it's true", "It's an identity"],
        1,
        "One value isn't enough: $x = 1$ gives 4 and 2. Not an identity.",
      ),
      choose(
        "Back to the problem",
        "“Which is an identity? Give a reason.”",
        "$3(x + 2) = 3x + 6$: it's true for all $x$",
        "Expanding gives the same.",
        [
          ["$3x + 2 = 11$: it has a solution", "Only true for $x = 3$."],
          ["Both", "One has a single solution."],
        ],
      ),
      quiz([
        [
          ["$a + b \\equiv b + a$ is", "an identity", ["an equation", "a formula"], "Always."],
          ["$2y = 10$ is", "an equation", ["an identity", "an expression"], "$y = 5$ only."],
        ],
        [
          ["$F = ma$ is", "a formula", ["an identity", "an expression"], "Links quantities."],
          ["$4x^2 - 3$ is", "an expression", ["an equation", "a formula"], "No equals."],
        ],
        [
          ["≡ means", "identically equal", ["approximately", "not equal"], "For all values."],
          [
            "To show it's NOT an identity",
            "find one value that fails",
            ["try one value that works", "expand once"],
            "Counter-example.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "show-equivalent",
    "GF-A6.b",
    "Show that two expressions are equal",
    "Work on one side until it matches the other, showing each step.",
    [
      problem("Show that", [
        "“Show that $(x + 3)^2 - 9 \\equiv x(x + 6)$.” A ‘show that’ question already tells you the answer: the marks are for the steps.",
        "By the end of this lesson, you can set out a convincing algebraic argument.",
      ]),
      choose("Warm-up", "Expand $(x + 3)^2$", "$x^2 + 6x + 9$", "$(x + 3)(x + 3)$.", [
        ["$x^2 + 9$", "You missed the two $3x$ terms."],
        ["$x^2 + 6x + 6$", "$3 \\times 3 = 9$."],
      ]),
      choose("Warm-up", "Expand $x(x + 6)$", "$x^2 + 6x$", "Multiply each term by $x$.", [
        ["$x^2 + 6$", "$x \\times 6 = 6x$."],
        ["$2x + 6$", "$x \\times x = x^2$."],
      ]),
      explain("Discover", "One side at a time", [
        "Start with one side (usually the messier one). Expand and simplify, one line at a time, until you reach the other side.",
        "Don't treat it as an equation to solve, and don't move terms across. Finish by writing the other side.",
      ]),
      choose(
        "Discover",
        "In a ‘show that’, you should",
        "simplify one side until it matches the other",
        "Show every step.",
        [
          ["solve for $x$", "It's true for all $x$."],
          ["just write ‘they're equal’", "No marks without working."],
        ],
      ),
      worked(
        "The question",
        "Show that $(x + 3)^2 - 9 \\equiv x(x + 6)$.",
        [
          ["LHS $= x^2 + 6x + 9 - 9$", "Expand."],
          ["$= x^2 + 6x$", "Simplify."],
          ["$= x(x + 6) =$ RHS", "Factorise."],
        ],
        "LHS: left-hand side. RHS: right-hand side.",
      ),
      steps(
        "Together",
        "Show that $4(x + 2) - 2(x - 1) \\equiv 2(x + 5)$",
        "Simplify the left.",
        [
          [
            "Expand:",
            "$4x + 8 - 2x + 2$",
            ["$4x + 8 - 2x - 2$", "$-2 \\times -1 = +2$."],
            "$4x + 8 - 2x + 2$",
          ],
          ["Collect:", "$2x + 10 = 2(x + 5)$", ["$2x + 6$", "8 + 2 = 10."], "= RHS"],
        ],
        "Each line follows from the last.",
      ),
      choose(
        "Together",
        "Which side should you start from in $(2x + 1)^2 \\equiv 4x^2 + 4x + 1$?",
        "The left: it needs expanding",
        "Messier side.",
        [["The right: it's longer", "It's already simplified."]],
      ),
      typed("Your turn", "Simplify $3(x + 4) - x$", "2x+12", "$3x + 12 - x$.", "$2x + 12$."),
      choose("Your turn", "$2x + 12$ also equals", "$2(x + 6)$", "Factorise.", [
        ["$2(x + 12)$", "That's $2x + 24$."],
        ["$x + 6$", "Halved."],
      ]),
      choose(
        "Watch out",
        "Kim proves it by trying $x = 2$ in both sides. What's wrong?",
        "One value isn't a proof: use algebra",
        "It must work for all $x$.",
        [["Nothing", "Checking a value is not showing."]],
      ),
      mistake(
        "Leo shows $(x - 2)^2 + 4x \\equiv x^2 + 4$.",
        ["LHS $= x^2 + 4 + 4x$", "Collect", "Doesn't match"],
        0,
        "$(x - 2)^2 = x^2 - 4x + 4$. Then $+4x$ gives $x^2 + 4$ = RHS.",
      ),
      choose(
        "Back to the problem",
        "After expanding, $(x + 3)^2 - 9$ becomes",
        "$x^2 + 6x$, which is $x(x + 6)$",
        "So LHS = RHS.",
        [
          ["$x^2 + 9 - 9 = x^2$", "You missed $6x$."],
          ["$x^2 + 6x + 18$", "$9 - 9 = 0$."],
        ],
      ),
      quiz([
        [
          ["$2(x + 3) + 4 \\equiv$", "$2x + 10$", ["$2x + 7$", "$2x + 14$"], "$2x + 6 + 4$."],
          ["$3(x - 1) + 5 \\equiv$", "$3x + 2$", ["$3x + 4$", "$3x - 8$"], "$3x - 3 + 5$."],
        ],
        [
          ["$(x + 1)^2 - 1 \\equiv$", "$x(x + 2)$", ["$x^2$", "$x^2 + 1$"], "$x^2 + 2x$."],
          ["$(x + 2)^2 - 4 \\equiv$", "$x(x + 4)$", ["$x^2$", "$x^2 + 4$"], "$x^2 + 4x$."],
        ],
        [
          [
            "In a ‘show that’, the marks are for",
            "the steps",
            ["the final line", "the guess"],
            "Working.",
          ],
          [
            "You finish by",
            "reaching the other side",
            ["solving for $x$", "substituting a number"],
            "LHS = RHS.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "argument",
    "GF-A6.c",
    "Algebra in an argument",
    "Use 2n for even, 2n + 1 for odd, and show what's always true.",
    [
      problem("The sum of three numbers", [
        "“Prove that the sum of any three consecutive whole numbers is a multiple of 3.”",
        "By the end of this lesson, you can write an argument like this with algebra.",
      ]),
      typed("Warm-up", "$4 + 5 + 6$", "15", "Add.", "15: a multiple of 3."),
      typed("Warm-up", "Simplify $n + (n + 1) + (n + 2)$", "3n+3", "Collect.", "$3n + 3$."),
      explain("Discover", "Letters for any number", [
        "Examples can suggest a rule but never prove it. Use letters so the argument covers every case.",
        "Any whole number: $n$. Consecutive: $n$, $n + 1$, $n + 2$. Even: $2n$. Odd: $2n + 1$. A multiple of 3: $3 \\times$ something.",
      ]),
      choose(
        "Discover",
        "Which always stands for an odd number?",
        "$2n + 1$",
        "One more than even.",
        [
          ["$n + 1$", "Could be even."],
          ["$3n$", "Could be even (n = 2)."],
        ],
      ),
      worked(
        "The proof",
        "Prove the sum of three consecutive numbers is a multiple of 3.",
        [
          ["$n + (n + 1) + (n + 2) = 3n + 3$", "Add them."],
          ["$= 3(n + 1)$", "Factorise."],
          ["3 times a whole number, so a multiple of 3", "Conclude."],
        ],
        "Always finish with a sentence.",
      ),
      steps(
        "Together",
        "Prove that odd + odd is even",
        "Two odd numbers.",
        [
          [
            "Write them as:",
            "$2a + 1$ and $2b + 1$",
            ["$2n + 1$ and $2n + 1$", "That makes them the same number."],
            "Different letters",
          ],
          [
            "Sum:",
            "$2a + 2b + 2 = 2(a + b + 1)$",
            ["$2a + 2b + 1$", "1 + 1 = 2."],
            "2 × whole number: even",
          ],
        ],
        "Use different letters for different numbers.",
      ),
      choose(
        "Together",
        "To show a number is even, write it as",
        "$2 \\times$ (a whole number)",
        "Factor of 2.",
        [
          ["$2 + $ something", "Not always even."],
          ["an example", "That's not a proof."],
        ],
      ),
      typed("Your turn", "Simplify $2n + 2n + 2$", "4n+2", "Collect.", "$4n + 2$."),
      choose("Your turn", "$4n + 2 = 2(2n + 1)$ shows it's", "even", "2 × whole number.", [
        ["odd", "It has a factor of 2."],
        ["a multiple of 4", "$2n + 1$ is odd."],
      ]),
      choose(
        "Watch out",
        "Zoe tests 1 + 2 + 3, 4 + 5 + 6 and 10 + 11 + 12, then says ‘proved’. What's wrong?",
        "Examples aren't a proof: use $n$",
        "There are infinitely many cases.",
        [["Nothing", "Three examples can't cover every number."]],
      ),
      mistake(
        "Ed proves odd + odd is even.",
        ["Odd numbers: $2n + 1$, $2n + 1$", "Sum $4n + 2 = 2(2n + 1)$", "Even"],
        0,
        "Using $n$ for both makes them the same odd number. Use $2a + 1$ and $2b + 1$.",
      ),
      choose(
        "Back to the problem",
        "“Prove the sum of any three consecutive whole numbers is a multiple of 3.” The key line:",
        "$3n + 3 = 3(n + 1)$",
        "3 times a whole number.",
        [
          ["$1 + 2 + 3 = 6$", "An example."],
          ["$3n + 3$ is bigger than 3", "That doesn't show a multiple."],
        ],
      ),
      quiz([
        [
          ["An even number", "$2n$", ["$n + 2$", "$2n + 1$"], "2 × n."],
          ["An odd number", "$2n + 1$", ["$n + 1$", "$2n$"], "Even + 1."],
        ],
        [
          ["$2(3n + 2)$ is always", "even", ["odd", "a multiple of 3"], "Factor 2."],
          ["$3(n + 4)$ is always", "a multiple of 3", ["even", "odd"], "Factor 3."],
        ],
        [
          ["Examples can", "suggest a rule", ["prove a rule", "never help"], "Not proof."],
          [
            "Two different odd numbers",
            "$2a + 1$, $2b + 1$",
            ["$2n + 1$, $2n + 1$", "$2n$, $2n + 1$"],
            "Different letters.",
          ],
        ],
      ]),
    ],
  ),
];
