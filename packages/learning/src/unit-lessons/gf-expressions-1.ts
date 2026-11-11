// GCSE Foundation, "Expressions", as five short lessons, one just before each skill: algebraic
// notation, the words (expression, equation, formula, identity, term, factor), collecting like
// terms, expanding a bracket and factorising. Each recaps the Key Stage 3 idea quickly, builds it
// to GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-expressions-1";

export const gfExpressions1: UnitLesson[] = [
  lesson(
    U,
    "notation",
    "GF-A1",
    "Algebra's shorthand",
    "Read and write ab, 3a, a², a/b and brackets.",
    [
      problem("The phone bill", [
        "A phone bill is £12 a month plus 5p for each of $t$ texts. In pounds, that's $12 + 0.05t$.",
        "Algebra packs a sentence into a few symbols. By the end of this lesson, you can read and write them both ways.",
      ]),
      choose("Warm-up", "$3n$ means", "3 times $n$", "A number next to a letter is multiplied.", [
        ["3 add $n$", "Adding would be $3 + n$."],
        ["30-something", "$3n$ is $3 \\times n$."],
      ]),
      choose("Warm-up", "If $n = 4$, $3n$ is", "12", "$3 \\times 4$.", [
        ["34", "It's 3 times 4, not the digits side by side."],
        ["7", "That adds."],
      ]),
      explain(
        "Discover",
        "The rules of the shorthand",
        [
          "$ab$ means $a \\times b$. $a^2$ means $a \\times a$. $\\frac{a}{b}$ means $a \\div b$.",
          "Numbers go first ($3a$, not $a3$), and $1a$ is written just $a$. $2(a + 3)$ means 2 lots of $(a + 3)$.",
        ],
        { kind: "maths", tex: "3a^2b = 3 \\times a \\times a \\times b" },
      ),
      choose(
        "Discover",
        "What's the difference between $2a$ and $a^2$?",
        "$2a = a + a$; $a^2 = a \\times a$",
        "Try $a = 5$: $2a = 10$ but $a^2 = 25$.",
        [["They're the same", "Try $a = 5$: 10 and 25."]],
      ),
      worked(
        "Write it in algebra",
        "Write “multiply $x$ by 4, then subtract 3, then divide by 2”.",
        [
          ["$4x$", "Multiply by 4."],
          ["$4x - 3$", "Subtract 3."],
          ["$\\frac{4x - 3}{2}$", "The fraction line divides all of it."],
        ],
        "The order of the words becomes the order of the operations.",
      ),
      steps(
        "Together",
        "Write $y \\times y \\times 5 \\times y$",
        "$y \\times y \\times 5 \\times y$",
        [
          [
            "The number goes first:",
            "$5 \\times y \\times y \\times y$",
            ["$y \\times y \\times y \\times 5$", "Write the number first."],
            "$5 \\times y^3$",
          ],
          ["In shorthand:", "$5y^3$", ["$(5y)^3$", "Only the $y$ is cubed."], "$5y^3$"],
        ],
        "$5y^3$: five lots of $y$ cubed.",
      ),
      choose(
        "Together",
        "“Add 3 to $n$, then multiply by 6”",
        "$6(n + 3)$",
        "Brackets: the 6 multiplies all of $n + 3$.",
        [
          ["$6n + 3$", "That multiplies first, then adds."],
          ["$n + 18$", "Only 3 would be multiplied."],
        ],
      ),
      choose("Your turn", "Write $p \\div 4$", "$\\frac{p}{4}$", "Division as a fraction.", [
        ["$4p$", "That's $4 \\times p$."],
        ["$\\frac{4}{p}$", "That's $4 \\div p$."],
      ]),
      choose("Your turn", "$(3t)^2$ means", "$9t^2$", "$3t \\times 3t$.", [
        ["$3t^2$", "The bracket squares the 3 too."],
        ["$6t$", "Squaring isn't doubling."],
      ]),
      choose(
        "Watch out",
        "Ella writes “$a$ squared” as $a2$. What's wrong?",
        "The 2 must be a power: $a^2$",
        "$a2$ would be read as $2a$ or nonsense.",
        [["Nothing", "Powers go up high: $a^2$."]],
      ),
      mistake(
        "Kim writes “double $x$, then add 5, then square it”.",
        ["Double $x$: $2x$", "Add 5: $2x + 5$", "Square it: $2x + 5^2$"],
        2,
        "The whole thing is squared: $(2x + 5)^2$.",
      ),
      choose(
        "Back to the problem",
        "“Write an expression for the cost in pounds of $m$ months at £12, plus 5p for each of $t$ texts.”",
        "$12m + 0.05t$",
        "£12 each month and £0.05 each text.",
        [
          ["$12 + 0.05t$", "There are $m$ months."],
          ["$12m + 5t$", "5p is £0.05 in pounds."],
        ],
      ),
      quiz([
        [
          [
            "$4ab$ means",
            "$4 \\times a \\times b$",
            ["$4 + a + b$", "$4a + b$"],
            "Side by side: multiply.",
          ],
          ["$7xy$ means", "$7 \\times x \\times y$", ["$7 + x + y$", "$7x + y$"], "Multiply."],
        ],
        [
          [
            "“Subtract 2 from $n$, then halve”",
            "$\\frac{n - 2}{2}$",
            ["$\\frac{n}{2} - 2$", "$2 - \\frac{n}{2}$"],
            "Subtract first.",
          ],
          ["“Add 1 to $n$, then times by 4”", "$4(n + 1)$", ["$4n + 1$", "$n + 4$"], "Add first."],
        ],
        [
          ["$m \\times m \\times 2$", "$2m^2$", ["$(2m)^2$", "$m2$"], "Number first, $m$ squared."],
          ["$k \\times 3 \\times k$", "$3k^2$", ["$(3k)^2$", "$3k$"], "Number first, $k$ squared."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "vocabulary",
    "GF-A3",
    "The words of algebra",
    "Tell expressions, equations, formulae and identities apart; spot terms and factors.",
    [
      problem("The exam question", [
        "“Here are four things: $3x + 2$, $3x + 2 = 11$, $A = lw$, $2(x + 1) \\equiv 2x + 2$. Write E for expression, Q for equation, F for formula, I for identity.”",
        "By the end of this lesson, you'll know each word and why it matters.",
      ]),
      choose(
        "Warm-up",
        "Which has an equals sign?",
        "$3x + 2 = 11$",
        "An equation says two things are equal.",
        [["$3x + 2$", "No equals sign."]],
      ),
      choose("Warm-up", "In $3x + 2$, how many terms?", "2", "$3x$ and $2$, separated by +.", [
        ["3", "$3x$ is one term."],
        ["1", "+ separates terms."],
      ]),
      explain(
        "Discover",
        "Four words",
        [
          "An **expression** has no equals sign: $3x + 2$. An **equation** is true for particular values: $3x + 2 = 11$ ($x = 3$).",
          "A **formula** links quantities: $A = lw$. An **identity** is true for **every** value: $2(x + 1) \\equiv 2x + 2$, with the sign ≡.",
        ],
        {
          kind: "table",
          head: ["Word", "Example"],
          rows: [
            ["Expression", "$3x + 2$"],
            ["Equation", "$3x + 2 = 11$"],
            ["Formula", "$A = lw$"],
            ["Identity", "$2(x+1) \\equiv 2x+2$"],
          ],
        },
      ),
      explain(
        "Discover",
        "Terms and factors",
        [
          "**Terms** are the parts added or subtracted: $4x^2 - 3x + 7$ has three terms.",
          "**Factors** multiply together: in $4x^2$, the factors include 4, $x$ and $x^2$.",
        ],
        {
          kind: "maths",
          tex: "\\underbrace{4x^2}_{\\text{term}} - \\underbrace{3x}_{\\text{term}} + \\underbrace{7}_{\\text{term}}",
        },
      ),
      worked(
        "Sort them",
        "Is $5(y - 1) = 5y - 5$ an equation or an identity?",
        [
          ["Try $y = 0$: $-5 = -5$ ✓", "True."],
          ["Try $y = 10$: $45 = 45$ ✓", "True again."],
          ["Expand the left: it's always $5y - 5$", "True for every $y$."],
        ],
        "An identity: write it with ≡.",
      ),
      steps(
        "Together",
        "Which is it?",
        "$v = u + at$",
        [
          [
            "It links several quantities, so it's",
            "a formula",
            ["an identity", "It isn't true for any values at all."],
            "Formula",
          ],
          [
            "How many terms on the right?",
            "2",
            ["3", "$at$ is one term: $a \\times t$."],
            "$u$ and $at$",
          ],
        ],
        "A formula: give values for $u$, $a$, $t$ and it gives $v$.",
      ),
      choose("Together", "$x^2 = 9$ is", "an equation", "True only for $x = 3$ or $-3$.", [
        ["an identity", "$x = 1$ makes it false."],
        ["an expression", "It has an equals sign."],
      ]),
      choose("Your turn", "$a + a \\equiv 2a$ is", "an identity", "True for every $a$.", [
        ["an equation", "Every value works: identity."],
        ["a formula", "It doesn't link different quantities."],
      ]),
      choose("Your turn", "Which is a factor of $6xy$?", "$3y$", "$6xy = 3y \\times 2x$.", [
        ["$6 + x$", "Factors multiply, not add."],
        ["$y^2$", "There's only one $y$."],
      ]),
      choose(
        "Watch out",
        "Ben says $2x + 3$ is an equation. Is he right?",
        "No: no equals sign, so it's an expression",
        "You can't solve an expression.",
        [["Yes", "There's nothing for it to equal."]],
      ),
      mistake(
        "Leah counts the terms of $5a^2 - 2ab + 3$.",
        ["$5a^2$ is one term", "$2ab$ is two terms: $2a$ and $b$", "So there are 4 terms"],
        1,
        "$2ab$ is one term ($2 \\times a \\times b$). There are 3 terms.",
      ),
      choose(
        "Back to the problem",
        "“$3x + 2$, $3x + 2 = 11$, $A = lw$, $2(x+1) \\equiv 2x + 2$.”",
        "E, Q, F, I",
        "Expression, equation, formula, identity.",
        [
          ["E, Q, I, F", "$A = lw$ links quantities: formula."],
          ["Q, Q, F, I", "$3x + 2$ has no equals sign."],
        ],
      ),
      quiz([
        [
          ["$4y - 1$ is", "an expression", ["an equation", "an identity"], "No equals sign."],
          ["$7m + 2n$ is", "an expression", ["an equation", "a formula"], "No equals sign."],
        ],
        [
          [
            "$3(x + 2) \\equiv 3x + 6$ is",
            "an identity",
            ["an equation", "an expression"],
            "True for all $x$.",
          ],
          [
            "$x + x + x \\equiv 3x$ is",
            "an identity",
            ["an equation", "a formula"],
            "True for all $x$.",
          ],
        ],
        [
          ["Terms in $x^2 + 4x - 5$", "3", ["2", "5"], "$x^2$, $4x$, $-5$."],
          ["Terms in $2a - b + c - 8$", "4", ["3", "1"], "Four parts."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "like-terms",
    "GF-A4.a",
    "Collecting like terms",
    "Add and subtract terms with exactly the same letters and powers.",
    [
      problem("The fence", [
        "A garden is a shape with sides $2x + 3$, $x - 1$, $2x + 3$ and $x - 1$ metres. What is its perimeter?",
        "Adding long expressions is messy. By the end of this lesson, you can tidy any of them.",
      ]),
      typed("Warm-up", "Simplify $a + a + a$", "3a", "Three lots of $a$.", "$3a$."),
      typed("Warm-up", "Simplify $5b - 2b$", "3b", "5 lots take 2 lots.", "$3b$."),
      explain(
        "Discover",
        "Like terms",
        [
          "**Like terms** have exactly the same letters and powers: $3x$ and $-5x$; $2x^2$ and $x^2$; $4ab$ and $ba$.",
          "Only like terms can be collected. $x$ and $x^2$ are **not** like terms.",
        ],
        { kind: "maths", tex: "3x + 2y - x + 4y = 2x + 6y" },
      ),
      choose(
        "Discover",
        "Which are like terms?",
        "$3ab$ and $-ba$",
        "$ab = ba$: same letters, same powers.",
        [
          ["$2x$ and $2x^2$", "Different powers."],
          ["$5y$ and $5$", "One has a letter, one doesn't."],
        ],
      ),
      worked(
        "Tidy up",
        "Simplify $4x^2 + 3x - x^2 + 5 - 7x$.",
        [
          ["$x^2$ terms: $4x^2 - x^2 = 3x^2$", "Group with their signs."],
          ["$x$ terms: $3x - 7x = -4x$", "Keep the minus."],
          ["$3x^2 - 4x + 5$", "Put them together."],
        ],
        "Each term carries the sign in front of it.",
      ),
      steps(
        "Together",
        "Simplify $2a + 5b - 3a + b$",
        "$2a + 5b - 3a + b$",
        [
          ["$a$ terms:", "$-a$", ["$5a$", "$2a - 3a$: the minus goes with 3a."], "$-a$"],
          ["$b$ terms:", "$6b$", ["$5b$", "$b$ is $1b$."], "$-a + 6b$"],
        ],
        "Or $6b - a$.",
      ),
      choose("Together", "Simplify $3xy + 2yx - xy$", "$4xy$", "$xy = yx$: $3 + 2 - 1 = 4$.", [
        ["$5xy - xy$", "Not finished: collect them all."],
        ["$4x^2y^2$", "Adding doesn't multiply."],
      ]),
      typed(
        "Your turn",
        "Simplify $6m - 2n - m + 5n$",
        ["5m+3n", "3n+5m"],
        "$m$ terms, then $n$ terms.",
        "$5m + 3n$.",
        { wrong: [["7m+3n", "$6m - m = 5m$."]] },
      ),
      choose("Your turn", "Simplify $x^2 + 2x + 3x^2 - x$", "$4x^2 + x$", "$x^2$: 4. $x$: 1.", [
        ["$5x^3$", "Unlike terms can't be combined."],
        ["$4x^2 + 3x$", "$2x - x = x$."],
      ]),
      choose(
        "Watch out",
        "Sam writes $3x + 2 = 5x$. What's wrong?",
        "$3x$ and 2 aren't like terms: it stays $3x + 2$",
        "A number isn't an $x$ term.",
        [["Nothing", "Try $x = 2$: $3x + 2 = 8$, but $5x = 10$."]],
      ),
      mistake(
        "Raj simplifies $5p - 3q - 2p + q$.",
        ["$5p - 2p = 3p$", "$-3q + q = -4q$", "$3p - 4q$"],
        1,
        "$-3q + q = -2q$, so $3p - 2q$.",
      ),
      typed(
        "Back to the problem",
        "“The sides are $2x + 3$, $x - 1$, $2x + 3$ and $x - 1$ m. Write the perimeter in its simplest form.”",
        ["6x+4", "4+6x"],
        "Add all four sides; collect $x$ terms and numbers.",
        "$6x + 4$ m.",
        { wrong: [["3x+2", "That's only two sides."]] },
      ),
      quiz([
        [
          ["$7a - 2a + a$", "$6a$", ["$4a$", "$5a$"], "7 − 2 + 1."],
          ["$9b - 4b + 2b$", "$7b$", ["$3b$", "$11b$"], "9 − 4 + 2."],
        ],
        [
          [
            "$3x + 4y - x - 6y$",
            "$2x - 2y$",
            ["$2x + 10y$", "$4x - 2y$"],
            "Signs stay with terms.",
          ],
          ["$5x - y - 2x + 3y$", "$3x + 2y$", ["$3x - 4y$", "$7x + 2y$"], "Signs stay with terms."],
        ],
        [
          ["Like terms to $4m^2$", "$-m^2$", ["$4m$", "$m^3$"], "Same power."],
          ["Like terms to $2pq$", "$7qp$", ["$2p$", "$pq^2$"], "Same letters and powers."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "expand",
    "GF-A4.b",
    "Expanding a bracket",
    "Multiply every term inside by the term outside.",
    [
      problem("Two prices", [
        "Tickets cost £$(x + 4)$ each. Write the cost of 6 tickets without brackets. And simplify $3(2a - 1) - 2(a - 5)$.",
        "By the end of this lesson, you can expand any single bracket, even with negatives.",
      ]),
      typed("Warm-up", "Work out $6 \\times 4$", "24", "Six fours.", "24."),
      typed("Warm-up", "Work out $-2 \\times -5$", "10", "Same signs.", "10."),
      explain(
        "Discover",
        "Everything inside",
        [
          "$6(x + 4)$ is 6 lots of $x + 4$: six $x$'s and six 4s. Multiply **every** term inside by the term outside.",
          "As a grid: 6 times $x$ is $6x$, 6 times 4 is 24.",
        ],
        { kind: "table", head: ["×", "$x$", "$+4$"], rows: [["$6$", "$6x$", "$+24$"]] },
      ),
      choose("Discover", "Expand $a(a + 3)$", "$a^2 + 3a$", "$a \\times a$ and $a \\times 3$.", [
        ["$2a + 3$", "$a \\times a = a^2$."],
        ["$a^2 + 3$", "Multiply the 3 too."],
      ]),
      worked(
        "Negatives",
        "Expand $-2(a - 5)$.",
        [
          ["$-2 \\times a = -2a$", "First term."],
          ["$-2 \\times -5 = +10$", "Two negatives: positive."],
          ["$-2a + 10$", "Put together."],
        ],
        "The sign belongs to the number outside.",
      ),
      steps(
        "Together",
        "Expand and simplify $3(2a - 1) - 2(a - 5)$",
        "$3(2a - 1) - 2(a - 5)$",
        [
          [
            "First bracket:",
            "$6a - 3$",
            ["$6a - 1$", "Times both terms by 3."],
            "$6a - 3 - 2(a - 5)$",
          ],
          [
            "Second bracket ($-2$ outside):",
            "$-2a + 10$",
            ["$-2a - 10$", "$-2 \\times -5 = +10$."],
            "$6a - 3 - 2a + 10$",
          ],
        ],
        "Collect: $4a + 7$.",
      ),
      choose(
        "Together",
        "Expand $4y(2y - 3)$",
        "$8y^2 - 12y$",
        "$4y \\times 2y$ and $4y \\times -3$.",
        [
          ["$8y - 12y$", "$y \\times y = y^2$."],
          ["$8y^2 - 3$", "Multiply the −3 too."],
        ],
      ),
      typed(
        "Your turn",
        "Expand $5(3n + 2)$",
        ["15n+10", "10+15n"],
        "Times both terms by 5.",
        "$15n + 10$.",
        { wrong: [["15n+2", "Multiply the 2 too."]] },
      ),
      choose(
        "Your turn",
        "Expand and simplify $2(x + 3) + 4(x - 1)$",
        "$6x + 2$",
        "$2x + 6 + 4x - 4$.",
        [
          ["$6x + 10$", "$4 \\times -1 = -4$."],
          ["$6x + 2x$", "6 and −4 are numbers."],
        ],
      ),
      choose(
        "Watch out",
        "Jo expands $3(x + 4)$ as $3x + 4$. What's wrong?",
        "The 3 multiplies the 4 too: $3x + 12$",
        "Every term inside.",
        [["Nothing", "Try $x = 1$: $3 \\times 5 = 15$, but $3 + 4 = 7$."]],
      ),
      mistake(
        "Tom simplifies $10 - 2(x - 3)$.",
        ["$-2 \\times x = -2x$", "$-2 \\times -3 = -6$", "$10 - 2x - 6 = 4 - 2x$"],
        1,
        "Two negatives make a positive: $+6$. So $16 - 2x$.",
      ),
      typed(
        "Back to the problem",
        "“Write an expression, without brackets, for the cost of 6 tickets at £$(x + 4)$.”",
        ["6x+24", "24+6x"],
        "6 lots of $x + 4$.",
        "$6x + 24$ pounds.",
        { wrong: [["6x+4", "Each ticket has the +4."]] },
      ),
      quiz([
        [
          ["$7(m - 2)$", "$7m - 14$", ["$7m - 2$", "$7m + 14$"], "Both terms × 7."],
          ["$4(k - 3)$", "$4k - 12$", ["$4k - 3$", "$4k + 12$"], "Both terms × 4."],
        ],
        [
          ["$-3(y + 2)$", "$-3y - 6$", ["$-3y + 6$", "$-3y + 2$"], "−3 × 2."],
          ["$-5(p - 1)$", "$-5p + 5$", ["$-5p - 5$", "$-5p - 1$"], "−5 × −1."],
        ],
        [
          ["$x(x - 7)$", "$x^2 - 7x$", ["$2x - 7$", "$x^2 - 7$"], "$x \\times x$."],
          ["$2t(t + 5)$", "$2t^2 + 10t$", ["$3t + 10$", "$2t^2 + 5$"], "$2t \\times t$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "factorise",
    "GF-A4.c",
    "Factorising",
    "Take out the highest common factor: expanding in reverse.",
    [
      problem("Undo it", [
        "Expanding turns $4(3x + 5)$ into $12x + 20$. The exam asks: “Factorise fully $12x + 20$.”",
        "That means going backwards. By the end of this lesson, you can factorise fully, with letters too.",
      ]),
      typed(
        "Warm-up",
        "Highest common factor of 12 and 20",
        "4",
        "The biggest number dividing both.",
        "4.",
      ),
      typed(
        "Warm-up",
        "Expand $4(3x + 5)$",
        ["12x+20", "20+12x"],
        "Times both terms by 4.",
        "$12x + 20$.",
      ),
      explain(
        "Discover",
        "Expand backwards",
        [
          "To factorise, find the **highest common factor** (HCF) of every term and write it outside the bracket.",
          "Inside goes what each term is divided by. Check by expanding.",
        ],
        { kind: "maths", tex: "12x + 20 = 4(3x + 5)" },
      ),
      choose(
        "Discover",
        "The HCF of $6a$ and $9a^2$ is",
        "$3a$",
        "3 divides 6 and 9; $a$ divides both.",
        [
          ["$3$", "There's an $a$ in both terms too."],
          ["$9a$", "9 doesn't divide 6."],
        ],
      ),
      worked(
        "Factorise fully",
        "Factorise fully $6a + 9a^2$.",
        [
          ["HCF: $3a$", "Numbers and letters."],
          ["$6a \\div 3a = 2$, $9a^2 \\div 3a = 3a$", "Divide each term."],
          ["$3a(2 + 3a)$", "Check: $6a + 9a^2$ ✓"],
        ],
        "“Fully” means take out the highest common factor.",
      ),
      steps(
        "Together",
        "Factorise fully $10y - 15$",
        "$10y - 15$",
        [
          ["HCF of 10 and 15:", "5", ["10", "10 doesn't divide 15."], "$5(\\ldots)$"],
          ["Inside:", "$2y - 3$", ["$2y - 15$", "Divide −15 by 5 too."], "$5(2y - 3)$"],
        ],
        "Check: $10y - 15$ ✓",
      ),
      choose("Together", "Factorise fully $x^2 + 7x$", "$x(x + 7)$", "Both terms contain $x$.", [
        ["$x(x + 7x)$", "$7x \\div x = 7$."],
        ["$7x(x + 1)$", "7 doesn't divide $x^2$."],
      ]),
      choose("Your turn", "Factorise fully $8p + 12$", "$4(2p + 3)$", "HCF 4.", [
        ["$2(4p + 6)$", "Not fully: 4p and 6 still share 2."],
        ["$4(2p + 12)$", "$12 \\div 4 = 3$."],
      ]),
      choose("Your turn", "Factorise fully $14m^2 - 21m$", "$7m(2m - 3)$", "HCF $7m$.", [
        ["$7(2m^2 - 3m)$", "Not fully: $m$ is common too."],
        ["$m(14m - 21)$", "Not fully: 7 is common too."],
      ]),
      choose(
        "Watch out",
        "Ava factorises $12x + 18$ as $2(6x + 9)$. Is it fully factorised?",
        "No: 6x and 9 share 3. Fully: $6(2x + 3)$",
        "Take out the highest common factor.",
        [["Yes", "Check the bracket: 6 and 9 share 3."]],
      ),
      mistake(
        "Kai factorises $5a + 5$.",
        ["HCF is 5", "$5a \\div 5 = a$", "$5(a + 0)$"],
        2,
        "$5 \\div 5 = 1$, not 0: $5(a + 1)$.",
      ),
      choose(
        "Back to the problem",
        "“Factorise fully $12x + 20$.”",
        "$4(3x + 5)$",
        "HCF 4. Check by expanding.",
        [
          ["$2(6x + 10)$", "Not fully: 6x and 10 share 2."],
          ["$4(3x + 20)$", "$20 \\div 4 = 5$."],
        ],
      ),
      quiz([
        [
          ["Factorise fully $6x + 15$", "$3(2x + 5)$", ["$3(2x + 15)$", "$6(x + 15)$"], "HCF 3."],
          ["Factorise fully $8y + 20$", "$4(2y + 5)$", ["$2(4y + 10)$", "$4(2y + 20)$"], "HCF 4."],
        ],
        [
          ["Factorise fully $a^2 - 5a$", "$a(a - 5)$", ["$5a(a - 1)$", "$a(a - 5a)$"], "HCF $a$."],
          ["Factorise fully $b^2 + 9b$", "$b(b + 9)$", ["$9b(b + 1)$", "$b(b + 9b)$"], "HCF $b$."],
        ],
        [
          [
            "Factorise fully $4t^2 + 10t$",
            "$2t(2t + 5)$",
            ["$2(2t^2 + 5t)$", "$t(4t + 10)$"],
            "HCF $2t$.",
          ],
          [
            "Factorise fully $9w^2 - 6w$",
            "$3w(3w - 2)$",
            ["$3(3w^2 - 2w)$", "$w(9w - 6)$"],
            "HCF $3w$.",
          ],
        ],
      ]),
    ],
  ),
];
