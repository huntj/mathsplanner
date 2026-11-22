// Year 8, "Standard form" and "Expressions", on the stepped template
// (docs/proposals/lesson-stepped.md): writing and comparing numbers in standard form, numbers
// that go on for ever, two brackets as a rectangle, brackets with negatives, writing formulae,
// and the nth term.
import {
  ask,
  calc,
  explain,
  explore,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
} from "./build.ts";
import {
  find,
  numberLine,
  own,
  owned,
  reworded,
  stepped,
  tagged,
  worded,
  workedFrom,
} from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y8Expressions } from "./y8-expressions.ts";
import { y8StandardForm } from "./y8-standard-form.ts";

const NUMBER = "A number fact: the digits are the picture.";
const ALGEBRA = "Algebra: the expression is the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
/** Two brackets times out as a grid: one bracket down the side, the other along the top. */
const grid = (side: string[], top: string[], cells: string[][]): Picture => ({
  kind: "table",
  head: ["×", ...top],
  rows: side.map((s, i) => [s, ...(cells[i] ?? [])]),
});

// ---------------------------------------------------------------------------------------------
// Standard form: writing it.

const SF = y8StandardForm;
const WRITE = "y8-standard-form/write";
const writeMethod = [
  "Put the point after the first digit that isn't 0: that's A.",
  "Count the places the digits move.",
  "Big numbers: a positive power. Small numbers: a negative power.",
];

const write = stepped(find(SF, WRITE), {
  method: writeMethod,
  variation: {
    relationship: "an ordinary number and its standard form",
    unknowns: ["standard form", "ordinary number", "power"],
    surface: ["big numbers", "small numbers", "A over 10", "space"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Too many zeros",
        ["**Standard form is A × 10ⁿ, with A from 1 up to 10.**"],
        maths("4\\,600\\,000 = 4.6 \\times 10^6"),
        "One digit before the point in A; the power counts the places moved.",
      ),
      tagged(
        "The rule",
        explore(
          "Slide the power",
          {
            kind: "line",
            min: -4,
            max: 6,
            step: 1,
            start: 3,
            tick: 1,
            every: 2,
            dp: 0,
            readouts: [{ label: "10 to this power", power: 1 }],
          },
          [
            "What did you notice?",
            "Each step up multiplies by 10",
            "10³ is 1000, 10⁴ is 10 000: one more place each time.",
            [
              [
                "The power is the number of zeros, even below 0",
                "Slide below 0: they get smaller.",
              ],
              ["Each step up adds 10", "1000 to 10 000 is times 10, not add 10."],
            ],
          ],
          "Each power of 10 is one more place.",
          { text: "Slide the power. Watch the number it stands for." },
        ),
      ),
      ...owned(SF, WRITE, "Warm-up", "Check you remember"),
      typed(
        "Check you remember",
        "Work out $3.7 \\times 10\\,000$.",
        ["37000", "37 000"],
        "Move the digits 4 places.",
        "37 000.",
      ),

      methodCard("The method", writeMethod, maths("0.0052 = 5.2 \\times 10^{-3}")),
      workedFrom(SF, WRITE),
      calc(
        "Your turn",
        "Write 37 000 in standard form.",
        undefined,
        [
          ["A =", "3.7", "One digit before the point."],
          [
            "The power: 3.7 to 37 000 is",
            "4",
            "Count the places the digits move.",
            { after: "places" },
          ],
        ],
        "$3.7 \\times 10^4$.",
      ),

      calc(
        "Practise",
        "Write 0.0052 in standard form.",
        undefined,
        [
          ["A =", "5.2", "Start at the first digit that isn't 0."],
          ["The power:", "-3", "Small number: the power is negative."],
        ],
        "$5.2 \\times 10^{-3}$.",
      ),
      ...owned(SF, WRITE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask(
            "Write 8 100 000 in standard form.",
            "$8.1 \\times 10^6$",
            "6 places.",
            "$8.1 \\times 10^6$.",
            {
              asks: "standard form",
              others: ["$81 \\times 10^5$", "$8.1 \\times 10^5$"],
            },
          ),
          ask(
            "Write $7.4 \\times 10^3$ as an ordinary number.",
            "7400",
            "Move 3 places.",
            "7400.",
            {
              asks: "ordinary number",
              changed: "Now back to ordinary.",
            },
          ),
          ask(
            "Write 0.06 in standard form.",
            "$6 \\times 10^{-2}$",
            "2 places, small.",
            "$6 \\times 10^{-2}$.",
            {
              asks: "standard form",
              changed: "A small number.",
              others: ["$6 \\times 10^2$", "$0.6 \\times 10^{-1}$"],
            },
          ),
          ask(
            "$920\\,000 = 9.2 \\times 10^{?}$. The power?",
            "5",
            "9.2 to 920 000 is 5 places.",
            "5.",
            {
              asks: "power",
              changed: "Just the power.",
            },
          ),
        ],
        "A from 1 to 10; the power counts the places.",
      ),

      questionSet(
        "Variation",
        "Standard form? Watch what changes.",
        [
          ask(
            "Is $45 \\times 10^3$ in standard form?",
            "No",
            "45 is more than 10.",
            "No: $4.5 \\times 10^4$.",
            {
              asks: "standard form",
              others: ["Yes"],
              expect: [
                "Sam writes 45 000 as $45 \\times 10^3$. Is it standard form?",
                "No",
                "A must be less than 10: $4.5 \\times 10^4$.",
                [["Yes", "It's the right value, but A is too big."]],
              ],
            },
          ),
          ask(
            "Write 450 000 in standard form.",
            "$4.5 \\times 10^5$",
            "10 times bigger: one more power.",
            "$4.5 \\times 10^5$.",
            {
              asks: "standard form",
              changed: "10 times bigger.",
              others: ["$45 \\times 10^4$", "$4.5 \\times 10^4$"],
            },
          ),
          ask(
            "Write 0.00045 in standard form.",
            "$4.5 \\times 10^{-4}$",
            "4 places, small.",
            "$4.5 \\times 10^{-4}$.",
            {
              asks: "standard form",
              changed: "Now tiny.",
              others: ["$4.5 \\times 10^4$", "$45 \\times 10^{-5}$"],
            },
          ),
          ask(
            "Write 4.5 in standard form.",
            "$4.5 \\times 10^0$",
            "No places moved.",
            "$4.5 \\times 10^0$.",
            {
              asks: "standard form",
              changed: "Already between 1 and 10.",
              others: ["$4.5 \\times 10^1$", "$45 \\times 10^{-1}$"],
            },
          ),
        ],
        "Bigger numbers, bigger powers; numbers under 1, negative powers.",
      ),
      own(SF, WRITE, "Spot the mistake"),

      own(SF, WRITE, "Exit check"),

      reworded(
        SF,
        WRITE,
        "The Sun is 150 000 000 km away",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Standard form is A × 10ⁿ, with A from 1 up to 10.**"],
        maths("4\\,600\\,000 = 4.6 \\times 10^6"),
        [
          "**Standard form is A × 10ⁿ, with A from 1 up to 10.**",
          "Big numbers: positive power. Small: negative power.",
          "$0.0052 = 5.2 \\times 10^{-3}$",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Standard form: comparing.

const COMPARE = "y8-standard-form/compare";
const compareMethod = [
  "Compare the powers first: the bigger power is bigger.",
  "Same power? Compare the numbers in front.",
  "Negative powers: −3 is bigger than −7.",
];

const compare = stepped(find(SF, COMPARE), {
  method: compareMethod,
  variation: {
    relationship: "numbers in standard form and their order",
    unknowns: ["bigger", "smaller", "order"],
    surface: ["same power", "negative powers", "planets"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Which is bigger?",
        ["**Compare the powers first. Only if they match, compare A.**"],
        maths("9.9 \\times 10^3 < 1.1 \\times 10^4"),
        "A is never 10 or more, so it can't make up a whole power.",
      ),
      reworded(SF, COMPARE, "Write them out. Which is bigger?", { tag: "The rule" }),

      ...owned(SF, COMPARE, "Warm-up", "Check you remember"),
      typed(
        "Check you remember",
        "Which is bigger: −3 or −7?",
        ["-3", "−3"],
        "Further right is bigger.",
        "−3.",
        {
          picture: numberLine(
            -8,
            0,
            1,
            [-7, -3].map((n) => [n, String(n).replace("-", "−")] as [number, string]),
          ),
        },
      ),

      methodCard(
        "The method",
        compareMethod,
        maths("8 \\times 10^4 < 2.9 \\times 10^5 < 3.4 \\times 10^5"),
      ),
      workedFrom(SF, COMPARE),
      calc(
        "Your turn",
        "Which is bigger: $9 \\times 10^{-4}$ or $4 \\times 10^{-3}$?",
        undefined,
        [
          ["The bigger power is", "-3", "−3 is bigger than −4."],
          ["So the bigger number has A =", "4", "The one with power −3."],
        ],
        "$4 \\times 10^{-3}$ = 0.004 is bigger than 0.0009.",
      ),

      calc(
        "Practise",
        "Which is bigger: $4.2 \\times 10^6$ or $3.9 \\times 10^6$?",
        undefined,
        [["Same power, so the bigger A:", "4.2", "Compare the numbers in front."]],
        "$4.2 \\times 10^6$.",
      ),
      ...owned(SF, COMPARE, "Together", "Practise"),
      questionSet(
        "Practise",
        "Which one? Watch what changes.",
        [
          ask(
            "Which is bigger: $6 \\times 10^3$ or $1.5 \\times 10^4$?",
            "$1.5 \\times 10^4$",
            "Power 4 beats power 3.",
            "$1.5 \\times 10^4$.",
            {
              asks: "bigger",
              others: ["$6 \\times 10^3$"],
            },
          ),
          ask(
            "Which is smaller: $6 \\times 10^3$ or $1.5 \\times 10^4$?",
            "$6 \\times 10^3$",
            "Power 3 is less.",
            "$6 \\times 10^3$.",
            {
              asks: "smaller",
              changed: "Now the smaller one.",
              others: ["$1.5 \\times 10^4$"],
            },
          ),
          ask(
            "Which is bigger: $4 \\times 10^{-2}$ or $4 \\times 10^{-6}$?",
            "$4 \\times 10^{-2}$",
            "−2 beats −6.",
            "$4 \\times 10^{-2}$.",
            {
              asks: "bigger",
              changed: "Negative powers.",
              others: ["$4 \\times 10^{-6}$"],
            },
          ),
          ask(
            "Which is biggest?",
            "$5 \\times 10^{-3}$",
            "−3 is the biggest power.",
            "$5 \\times 10^{-3}$.",
            {
              asks: "order",
              changed: "Three numbers.",
              others: ["$8 \\times 10^{-5}$", "$1 \\times 10^{-4}$"],
            },
          ),
        ],
        "Powers first, then A.",
      ),

      questionSet(
        "Variation",
        "Which is bigger? Watch what changes.",
        [
          ask(
            "Which is bigger: $8 \\times 10^2$ or $2 \\times 10^3$?",
            "$2 \\times 10^3$",
            "800 is less than 2000.",
            "$2 \\times 10^3$.",
            {
              asks: "bigger",
              others: ["$8 \\times 10^2$"],
              expect: [
                "Zak picks $8 \\times 10^2$, as 8 beats 2. Right?",
                "No",
                "Compare powers first: 800 is less than 2000.",
                [["Yes", "Write them out: 800 and 2000."]],
              ],
            },
          ),
          ask(
            "Which is bigger: $7.1 \\times 10^5$ or $7.09 \\times 10^5$?",
            "$7.1 \\times 10^5$",
            "Same power: 7.1 beats 7.09.",
            "$7.1 \\times 10^5$.",
            {
              asks: "bigger",
              changed: "The same power.",
              others: ["$7.09 \\times 10^5$"],
            },
          ),
          ask(
            "Which is bigger: $6 \\times 10^{-4}$ or $6 \\times 10^{-7}$?",
            "$6 \\times 10^{-4}$",
            "−4 beats −7.",
            "$6 \\times 10^{-4}$.",
            {
              asks: "bigger",
              changed: "Same A, negative powers.",
              others: ["$6 \\times 10^{-7}$"],
            },
          ),
          ask(
            "Which is bigger: $1 \\times 10^0$ or $9 \\times 10^{-1}$?",
            "$1 \\times 10^0$",
            "1 beats 0.9.",
            "$1 \\times 10^0$ = 1.",
            {
              asks: "bigger",
              changed: "Either side of 1.",
              others: ["$9 \\times 10^{-1}$"],
            },
          ),
        ],
        "The power decides first, even when A looks bigger.",
      ),
      own(SF, COMPARE, "Spot the mistake"),

      own(SF, COMPARE, "Exit check"),

      reworded(
        SF,
        COMPARE,
        "Earth $6.0 \\times 10^{24}$ kg, Mars $6.4 \\times 10^{23}$ kg",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Compare the powers first. Only if they match, compare A.**"],
        maths("9.9 \\times 10^3 < 1.1 \\times 10^4"),
        [
          "**Compare the powers first. Only if they match, compare A.**",
          "$8 \\times 10^2 = 800 < 2 \\times 10^3 = 2000$",
          "Negative powers: $10^{-3}$ is bigger than $10^{-7}$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// For ever.

const FOREVER = "y8-standard-form/for-ever";
const foreverMethod = [
  "Write both numbers with the same number of decimal places.",
  "Add a digit on the end to fit one between.",
  "There's always another: the numbers never run out.",
];

const forever = stepped(find(SF, FOREVER), {
  method: foreverMethod,
  variation: {
    relationship: "numbers go on for ever, and always fit between",
    unknowns: ["between", "biggest"],
    surface: ["decimals", "fractions", "negatives", "googols"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "For ever",
        ["**There's no biggest number, and always one more in between.**"],
        numberLine(0.35, 0.36, 0.001, [[0.355, "0.355"]], { every: 5 }),
        "Zoom in on any gap and more numbers appear.",
      ),
      reworded(SF, FOREVER, "Zoom in", { tag: "The rule" }),
      reworded(SF, FOREVER, "Zoom in again", { tag: "The rule" }),

      ...owned(SF, FOREVER, "Warm-up", "Check you remember"),
      typed(
        "Check you remember",
        "Write 2.7 with two decimal places.",
        "2.70",
        "Add a 0.",
        "2.70.",
      ),

      methodCard("The method", foreverMethod, maths("2.710 < 2.715 < 2.720")),
      workedFrom(SF, FOREVER),
      calc(
        "Your turn",
        "Find a number between 2.3 and 2.31.",
        numberLine(2.3, 2.31, 0.001, [], { every: 5 }),
        [
          ["2.3 with two places:", "2.30", "Add a 0."],
          ["A number between, with three places:", "2.305", "Halfway: 2.30 and 5 thousandths."],
        ],
        "2.305, and many more.",
      ),

      calc(
        "Practise",
        "Find a fraction between $\\frac14$ and $\\frac12$.",
        undefined,
        [
          ["$\\frac12$ in quarters:", "2/4", "Same-size parts."],
          ["In eighths, between $\\frac28$ and $\\frac48$:", "3/8", "Cut finer to fit one in."],
        ],
        "$\\frac38$.",
      ),
      ...owned(SF, FOREVER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("A number between 6.2 and 6.3?", "6.25", "Add a digit.", "6.25 works.", {
            asks: "between",
            others: ["6.35", "6.02"],
          }),
          ask("A number between 6.25 and 6.26?", "6.255", "Add another digit.", "6.255.", {
            asks: "between",
            changed: "A smaller gap.",
            others: ["6.265", "6.3"],
          }),
          ask(
            "A fraction between $\\frac15$ and $\\frac25$?",
            "$\\frac{3}{10}$",
            "Use tenths.",
            "$\\frac{3}{10}$.",
            {
              asks: "between",
              changed: "Fractions.",
              others: ["$\\frac35$", "$\\frac{1}{10}$"],
            },
          ),
          ask("Is there a smallest number above 0?", "No", "Halve any one.", "No.", {
            asks: "biggest",
            changed: "Now the smallest.",
            others: ["Yes"],
          }),
        ],
        "There's always room for more.",
      ),

      questionSet(
        "Variation",
        "Find a number between. Watch what changes.",
        [
          ask("A number between 0.35 and 0.36?", "0.355", "Add a digit.", "0.355.", {
            asks: "between",
            others: ["0.37", "0.305"],
            expect: [
              "Jo says nothing fits between 0.35 and 0.36. Right?",
              "No",
              "0.351, 0.355, 0.359… all fit between.",
              [["Yes", "Add a decimal place and look again."]],
            ],
          }),
          ask("A number between −1 and −1.1?", "-1.05", "Between, below zero.", "−1.05.", {
            asks: "between",
            changed: "Below zero.",
            others: ["-0.5", "-1.2"],
          }),
          ask("A number between 0.999 and 1?", "0.9995", "Add a digit.", "0.9995.", {
            asks: "between",
            changed: "Right next to 1.",
            others: ["1.001", "0.99"],
          }),
          ask("Is a googol + 1 bigger than a googol?", "Yes", "Add 1 to anything.", "Yes.", {
            asks: "biggest",
            changed: "A huge number.",
            others: ["No"],
          }),
        ],
        "No gap is too small, and no number is the biggest.",
      ),
      own(SF, FOREVER, "Spot the mistake"),

      own(SF, FOREVER, "Exit check"),

      reworded(
        SF,
        FOREVER,
        "Mia and Theo",
        { tag: "Real life", text: "Who is right?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**There's no biggest number, and always one more in between.**"],
        numberLine(0.35, 0.36, 0.001, [[0.355, "0.355"]], { every: 5 }),
        [
          "**There's no biggest number, and always one more in between.**",
          "Add a decimal place to fit a number between: 2.715.",
          "Any number + 1 is bigger, so there's no biggest.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Two brackets.

const EX = y8Expressions;
const TWO = "y8-expressions/two-brackets";
const twoMethod = [
  "Draw a grid: one bracket down the side, one along the top.",
  "Multiply to fill all four boxes.",
  "Add them up: collect the x terms.",
];

const twoBrackets = stepped(find(EX, TWO), {
  method: twoMethod,
  variation: {
    relationship: "two brackets and the expression they multiply out to",
    unknowns: ["x term", "number term", "whole expansion"],
    surface: ["a squared bracket", "2x in a bracket", "gardens"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two brackets",
        ["**Two brackets make a rectangle: add its four pieces.**"],
        grid(
          ["x", "3"],
          ["x", "2"],
          [
            ["x²", "2x"],
            ["3x", "6"],
          ],
        ),
        "$(x + 3)(x + 2) = x^2 + 5x + 6$",
      ),
      reworded(EX, TWO, "Spot the pattern", {
        tag: "The rule",
        text: "In $(x + a)(x + b)$, the number with $x$ is",
        picture: maths(
          "\\begin{array}{l} (x + 3)(x + 2) = x^2 + 5x + 6 \\\\ (x + 4)(x + 5) = x^2 + 9x + 20 \\end{array}",
        ),
      }),

      ...owned(EX, TWO, "Warm-up", "Check you remember"),
      typed("Check you remember", "Simplify $2x + 3x$.", "5x", "Like terms.", "$5x$."),

      methodCard(
        "The method",
        twoMethod,
        grid(
          ["x", "6"],
          ["x", "1"],
          [
            ["x²", "x"],
            ["6x", "6"],
          ],
        ),
      ),
      workedFrom(EX, TWO),
      calc(
        "Your turn",
        "Expand $(x + 2)(x + 7)$.",
        grid(
          ["x", "2"],
          ["x", "7"],
          [
            ["?", "?"],
            ["?", "?"],
          ],
        ),
        [
          ["The x terms: $7x + 2x =$", "9x", "The two middle boxes."],
          ["The number: $2 \\times 7 =$", "14", "The last box."],
        ],
        "$x^2 + 9x + 14$.",
      ),

      calc(
        "Practise",
        "Expand $(2x + 1)(x + 3)$.",
        grid(
          ["2x", "1"],
          ["x", "3"],
          [
            ["?", "?"],
            ["?", "?"],
          ],
        ),
        [
          ["$2x \\times x =$", "2x^2", "The first box."],
          ["The x terms: $6x + x =$", "7x", "The two middle boxes."],
          ["The number: $1 \\times 3 =$", "3", "The last box."],
        ],
        "$2x^2 + 7x + 3$.",
      ),
      ...owned(EX, TWO, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask(
            "Expand $(x + 2)(x + 5)$.",
            "$x^2 + 7x + 10$",
            "2 + 5 and 2 × 5.",
            "$x^2 + 7x + 10$.",
            {
              asks: "whole expansion",
              others: ["$x^2 + 10x + 7$", "$x^2 + 10$"],
            },
          ),
          ask("In $(x + 3)(x + 6)$, the x term is", "9x", "3x + 6x.", "$9x$.", {
            asks: "x term",
            changed: "Just the x term.",
          }),
          ask("In $(x + 3)(x + 6)$, the number term is", "18", "3 × 6.", "18.", {
            asks: "number term",
            changed: "Just the number.",
          }),
          ask(
            "Expand $(3x + 1)(x + 2)$.",
            "$3x^2 + 7x + 2$",
            "6x + x for the middle.",
            "$3x^2 + 7x + 2$.",
            {
              asks: "whole expansion",
              changed: "3x in a bracket.",
              others: ["$3x^2 + 3x + 2$", "$4x^2 + 7x + 2$"],
            },
          ),
        ],
        "Four boxes, then collect.",
      ),

      questionSet(
        "Variation",
        "Expand each one. Watch what changes.",
        [
          ask("Expand $(x + 3)^2$.", "$x^2 + 6x + 9$", "$(x + 3)(x + 3)$.", "$x^2 + 6x + 9$.", {
            asks: "whole expansion",
            others: ["$x^2 + 9$", "$x^2 + 3x + 9$"],
            expect: [
              "Kai squares each term: $x^2 + 9$. Right?",
              "No",
              "$(x + 3)^2$ is $(x + 3)(x + 3)$: four boxes, $x^2 + 6x + 9$.",
              [["Yes", "Draw the grid: two 3x boxes are missing."]],
            ],
          }),
          ask("Expand $(x + 6)^2$.", "$x^2 + 12x + 36$", "$(x + 6)(x + 6)$.", "$x^2 + 12x + 36$.", {
            asks: "whole expansion",
            changed: "A different square.",
            others: ["$x^2 + 36$", "$x^2 + 6x + 36$"],
          }),
          ask("Expand $(x + 1)(x + 1)$.", "$x^2 + 2x + 1$", "Twice x.", "$x^2 + 2x + 1$.", {
            asks: "whole expansion",
            changed: "Written as two brackets.",
            others: ["$x^2 + 1$", "$x^2 + x + 1$"],
          }),
          ask(
            "Expand $(x + 10)(x + 1)$.",
            "$x^2 + 11x + 10$",
            "10 + 1 and 10 × 1.",
            "$x^2 + 11x + 10$.",
            {
              asks: "whole expansion",
              changed: "Very different numbers.",
              others: ["$x^2 + 10x + 11$", "$x^2 + 10$"],
            },
          ),
        ],
        "A squared bracket is two brackets: never just square each term.",
      ),
      own(EX, TWO, "Spot the mistake"),

      own(EX, TWO, "Exit check"),

      reworded(
        EX,
        TWO,
        "The garden, $(x + 3)$ by $(x + 2)$",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Two brackets make a rectangle: add its four pieces.**"],
        grid(
          ["x", "3"],
          ["x", "2"],
          [
            ["x²", "2x"],
            ["3x", "6"],
          ],
        ),
        [
          "**Two brackets make a rectangle: add its four pieces.**",
          "$(x + 3)(x + 2) = x^2 + 5x + 6$",
          "$(x + 3)^2 = x^2 + 6x + 9$, not $x^2 + 9$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Brackets with negatives.

const NEG = "y8-expressions/negatives";
const negMethod = [
  "Keep each sign with its number in the grid.",
  "Multiply with the sign rules.",
  "Collect the x terms, signs and all.",
];

const negatives = stepped(find(EX, NEG), {
  method: negMethod,
  variation: {
    relationship: "brackets with negatives and the expression they multiply out to",
    unknowns: ["x term", "number term", "whole expansion"],
    surface: ["one negative", "two negatives", "a squared bracket", "photos"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Brackets with negatives",
        ["**Keep each sign with its number, then use the grid.**"],
        grid(
          ["x", "−4"],
          ["x", "3"],
          [
            ["x²", "3x"],
            ["−4x", "−12"],
          ],
        ),
        "$(x - 4)(x + 3) = x^2 - x - 12$",
      ),

      ...owned(EX, NEG, "Warm-up", "Check you remember"),
      reworded(EX, NEG, "Collect $3x - 4x$", { tag: "Check you remember" }),

      methodCard(
        "The method",
        negMethod,
        grid(
          ["x", "−4"],
          ["x", "3"],
          [
            ["x²", "3x"],
            ["−4x", "−12"],
          ],
        ),
      ),
      workedFrom(EX, NEG),
      calc(
        "Your turn",
        "Expand $(x - 5)(x - 2)$.",
        grid(
          ["x", "−5"],
          ["x", "−2"],
          [
            ["?", "?"],
            ["?", "?"],
          ],
        ),
        [
          ["The x terms: $-2x - 5x =$", "-7x", "Both negative."],
          ["The number: $-5 \\times -2 =$", "10", "Negative times negative."],
        ],
        "$x^2 - 7x + 10$.",
      ),

      calc(
        "Practise",
        "Expand $(x + 6)(x - 2)$.",
        grid(
          ["x", "6"],
          ["x", "−2"],
          [
            ["?", "?"],
            ["?", "?"],
          ],
        ),
        [
          ["The x terms: $-2x + 6x =$", "4x", "Collect, signs and all."],
          ["The number: $6 \\times -2 =$", "-12", "Positive times negative."],
        ],
        "$x^2 + 4x - 12$.",
      ),
      ...owned(EX, NEG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask(
            "Expand $(x - 3)(x + 7)$.",
            "$x^2 + 4x - 21$",
            "−3x + 7x, and −3 × 7.",
            "$x^2 + 4x - 21$.",
            {
              asks: "whole expansion",
              others: ["$x^2 - 4x - 21$", "$x^2 + 4x + 21$"],
            },
          ),
          ask("In $(x - 6)(x - 2)$, the number term is", "12", "−6 × −2.", "12.", {
            asks: "number term",
            changed: "Just the number.",
          }),
          ask("In $(x - 6)(x - 2)$, the x term is", "-8x", "−6x − 2x.", "$-8x$.", {
            asks: "x term",
            changed: "Just the x term.",
          }),
        ],
        "Signs stay with their numbers.",
      ),

      questionSet(
        "Variation",
        "Expand each one. Watch what changes.",
        [
          ask("Expand $(x - 3)^2$.", "$x^2 - 6x + 9$", "$(x - 3)(x - 3)$.", "$x^2 - 6x + 9$.", {
            asks: "whole expansion",
            others: ["$x^2 + 9$", "$x^2 - 9$"],
            expect: [
              "Mo writes $(x - 3)^2 = x^2 + 9$. What's wrong?",
              "The −6x is missing",
              "$(x - 3)(x - 3)$ has two −3x boxes: $x^2 - 6x + 9$.",
              [["Nothing", "Draw the grid: four boxes."]],
            ],
          }),
          ask("Expand $(x + 3)(x - 3)$.", "$x^2 - 9$", "+3x and −3x cancel.", "$x^2 - 9$.", {
            asks: "whole expansion",
            changed: "One plus, one minus.",
            others: ["$x^2 + 9$", "$x^2 - 6x - 9$"],
          }),
          ask("Expand $(x - 1)(x - 1)$.", "$x^2 - 2x + 1$", "Two −x boxes.", "$x^2 - 2x + 1$.", {
            asks: "whole expansion",
            changed: "Small numbers.",
            others: ["$x^2 + 1$", "$x^2 - 2x - 1$"],
          }),
          ask(
            "Expand $(2x - 1)(x + 3)$.",
            "$2x^2 + 5x - 3$",
            "6x − x for the middle.",
            "$2x^2 + 5x - 3$.",
            {
              asks: "whole expansion",
              changed: "2x in a bracket.",
              others: ["$2x^2 + 7x - 3$", "$2x^2 + 5x + 3$"],
            },
          ),
        ],
        "The grid handles the signs, if each sign stays with its number.",
      ),
      own(EX, NEG, "Spot the mistake"),

      own(EX, NEG, "Exit check"),

      reworded(
        EX,
        NEG,
        "The photo, $(x - 4)$ by $(x + 3)$",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Keep each sign with its number, then use the grid.**"],
        grid(
          ["x", "−4"],
          ["x", "3"],
          [
            ["x²", "3x"],
            ["−4x", "−12"],
          ],
        ),
        [
          "**Keep each sign with its number, then use the grid.**",
          "$(x - 4)(x + 3) = x^2 - x - 12$",
          "$(x - 3)^2 = x^2 - 6x + 9$",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Write it in algebra.

const MODEL = "y8-expressions/model";
const modelMethod = [
  "Give a letter to what changes.",
  "Times it by the cost of each one.",
  "Add anything paid once.",
];

const model = stepped(find(EX, MODEL), {
  method: modelMethod,
  variation: {
    relationship: "a situation and the formula for it",
    unknowns: ["formula", "value"],
    surface: ["taxis", "tickets", "ages", "perimeters", "pence and pounds"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Write it in algebra",
        ["**What changes gets a letter; what's paid once is added.**"],
        maths("C = 2m + 3"),
        "£2 a mile, plus £3 to start.",
      ),
      reworded(EX, MODEL, "The formula as a graph", { tag: "The rule" }),

      reworded(EX, MODEL, "The taxi: how much, in pounds, for 4 miles?", {
        tag: "Check you remember",
        title: "Taxi: cost of 4 miles, in pounds?",
      }),
      reworded(EX, MODEL, "Pens cost 40p each. How much, in pence, for 5 pens?", {
        tag: "Check you remember",
      }),
      typed("Check you remember", "If $n = 4$, what is $8n + 5$?", "37", "8 × 4 + 5.", "37."),

      methodCard("The method", modelMethod, maths("C = 8n + 5")),
      workedFrom(EX, MODEL),
      calc(
        "Your turn",
        "A plumber: £40 call-out, plus £25 an hour. Cost for h hours?",
        undefined,
        [
          ["For h hours: $25 \\times$", "h", "The letter for the hours."],
          ["Paid once:", "40", "The call-out fee.", { after: "pounds" }],
        ],
        "$C = 25h + 40$.",
      ),

      calc(
        "Practise",
        "Film club: £12 to join, £6 a film. Cost of 5 films?",
        undefined,
        [
          ["$6 \\times 5 =$", "30", "The films."],
          ["$30 + 12 =$", "42", "Add the joining fee once.", { after: "pounds" }],
        ],
        "£42: $C = 6f + 12$.",
      ),
      reworded(EX, MODEL, "The perimeter", {
        tag: "Practise",
        start: "A rectangle is $x$ cm wide and 5 cm longer.",
      }),
      reworded(
        EX,
        MODEL,
        "A phone plan costs £10 a month plus 5p a text. Which formula gives the cost in pence for $t$ texts?",
        {
          tag: "Practise",
          title: "£10 a month plus 5p a text. Pence for $t$ texts?",
        },
      ),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask(
            "Pears 25p each, plus a 5p bag. Cost of $n$ pears?",
            "$25n + 5$",
            "Times the pears; add the bag.",
            "$25n + 5$.",
            {
              asks: "formula",
              others: ["$30n$", "$5n + 25$"],
            },
          ),
          ask("$C = 3n + 7$. Find C when $n = 5$.", "22", "3 × 5 + 7.", "22.", {
            asks: "value",
            changed: "Now use a formula.",
          }),
          ask(
            "A rectangle is $x$ by $x + 1$. Its perimeter?",
            "$4x + 2$",
            "Two of each side.",
            "$4x + 2$.",
            {
              asks: "formula",
              changed: "A shape.",
              others: ["$2x + 1$", "$4x + 1$"],
            },
          ),
        ],
        "Letter for what changes; add what's paid once.",
      ),

      questionSet(
        "Variation",
        "Write each formula. Watch what changes.",
        [
          ask(
            "Tickets £8 each, one popcorn £5. Cost for n tickets?",
            "$8n + 5$",
            "Popcorn once.",
            "$8n + 5$.",
            {
              asks: "formula",
              others: ["$13n$", "$5n + 8$"],
              expect: [
                "Ali writes $C = 13n$. What's wrong?",
                "That's a popcorn per ticket",
                "The popcorn is bought once: $8n + 5$.",
                [["Nothing", "13n adds £5 for every ticket."]],
              ],
            },
          ),
          ask(
            "Tickets £8 each, a popcorn with each. Cost for n?",
            "$13n$",
            "£13 per person.",
            "$13n$.",
            {
              asks: "formula",
              changed: "Now a popcorn with each ticket.",
              others: ["$8n + 5$", "$8n + 13$"],
            },
          ),
          ask(
            "Sam is s; his sister is 3 years younger. Together?",
            "$2s - 3$",
            "$s + s - 3$.",
            "$2s - 3$.",
            {
              asks: "formula",
              changed: "Ages.",
              others: ["$s - 3$", "$3s$"],
            },
          ),
          ask(
            "£5 a month plus 2p a text. Pence for t texts?",
            "$2t + 500$",
            "£5 is 500p.",
            "$2t + 500$.",
            {
              asks: "formula",
              changed: "Mixed units.",
              others: ["$2t + 5$", "$502t$"],
            },
          ),
        ],
        "Read what's per item and what's once.",
      ),
      reworded(
        EX,
        MODEL,
        "Where did it go wrong?",
        { text: "Gym: £20 to join, £15 a month. Jay's cost for $m$ months:" },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Apples 30p each, plus a 10p bag. Cost of $a$ apples?",
            "$30a + 10$",
            ["$40a$", "$10a + 30$"],
            "30p per apple; the bag once.",
          ],
          [
            "Buns 40p each, plus a 5p bag. Cost of $b$ buns?",
            "$40b + 5$",
            ["$45b$", "$5b + 40$"],
            "40p per bun; the bag once.",
          ],
        ],
        [
          [
            "A square has side $x + 2$. Its perimeter?",
            "$4x + 8$",
            ["$4x + 2$", "$x + 8$"],
            "Four sides of $x + 2$.",
          ],
          [
            "A square has side $x + 3$. Its perimeter?",
            "$4x + 12$",
            ["$4x + 3$", "$x + 12$"],
            "Four sides of $x + 3$.",
          ],
        ],
        [
          ["$C = 5n + 2$. Find $C$ when $n = 4$.", "22", ["11", "28"], "$5 \\times 4 + 2 = 22$."],
          ["$C = 4n + 3$. Find $C$ when $n = 5$.", "23", ["12", "35"], "$4 \\times 5 + 3 = 23$."],
        ],
      ]),

      reworded(EX, MODEL, "The taxi: $C = 2m + 3$", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**What changes gets a letter; what's paid once is added.**"],
        maths("C = 2m + 3"),
        [
          "**What changes gets a letter; what's paid once is added.**",
          "Taxi: £3 to start, £2 a mile: $C = 2m + 3$.",
          "Check the units: pence or pounds.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The nth term.

const NTH = "y8-expressions/nth-term";
const nthMethod = [
  "Find the difference: the times table.",
  "Write that times table under the sequence.",
  "Add or take the gap: that's the nth term.",
];
const nthTable = (rows: [string, string[]][]): Picture => ({
  kind: "table",
  head: ["n", "1", "2", "3", "4"],
  rows: rows.map(([label, terms]) => [label, ...terms]),
});

const nthTerm = stepped(find(EX, NTH), {
  method: nthMethod,
  variation: {
    relationship: "a linear sequence and its nth term",
    unknowns: ["nth term", "term", "difference"],
    surface: ["above the table", "below the table", "going down", "matchsticks"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The nth term",
        ["**The difference gives the times table; adjust to fit.**"],
        nthTable([
          ["4n", ["4", "8", "12", "16"]],
          ["sequence", ["5", "9", "13", "17"]],
        ]),
        "Each term is 1 more than the 4 times table: $4n + 1$.",
      ),
      reworded(EX, NTH, "Find the rule for any term", { tag: "The rule" }),

      ...owned(EX, NTH, "Warm-up", "Check you remember"),
      typed(
        "Check you remember",
        "What comes next? 30, 26, 22, 18, …",
        "14",
        "Down 4 each time.",
        "14.",
      ),

      methodCard(
        "The method",
        nthMethod,
        nthTable([
          ["5n", ["5", "10", "15", "20"]],
          ["sequence", ["7", "12", "17", "22"]],
        ]),
      ),
      workedFrom(EX, NTH),
      calc(
        "Your turn",
        "Find the nth term of 7, 10, 13, 16, …",
        nthTable([["sequence", ["7", "10", "13", "16"]]]),
        [
          ["The difference:", "3", "10 − 7."],
          ["Each term is 3n plus", "4", "7 − 3."],
        ],
        "$3n + 4$.",
      ),

      calc(
        "Practise",
        "Find the nth term of 4, 10, 16, 22, …",
        undefined,
        [
          ["The difference:", "6", "10 − 4."],
          ["6n is 6, so each term is 6n minus", "2", "6 − 4."],
        ],
        "$6n - 2$.",
      ),
      ...owned(EX, NTH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask(
            "The nth term of 4, 7, 10, 13, …",
            "$3n + 1$",
            "Difference 3, then +1.",
            "$3n + 1$.",
            {
              asks: "nth term",
              others: ["$n + 3$", "$3n + 4$"],
            },
          ),
          ask(
            "The nth term of 2, 7, 12, 17, …",
            "$5n - 3$",
            "Difference 5, then −3.",
            "$5n - 3$.",
            {
              asks: "nth term",
              changed: "Below the times table.",
              others: ["$n + 5$", "$5n + 2$"],
            },
          ),
          ask("$3n - 1$: what is the 10th term?", "29", "3 × 10 − 1.", "29.", {
            asks: "term",
            changed: "Now use it.",
          }),
          ask("What is the difference in $7n - 4$?", "7", "The number with n.", "7.", {
            asks: "difference",
            changed: "Read the rule.",
          }),
        ],
        "Difference first, then adjust.",
      ),

      questionSet(
        "Variation",
        "Find the nth term. Watch what changes.",
        [
          ask("The nth term of 5, 9, 13, …", "$4n + 1$", "Up 4: 4n.", "$4n + 1$.", {
            asks: "nth term",
            others: ["$n + 4$", "$4n + 5$"],
            expect: [
              "Lily writes $n + 4$, as it goes up 4. Right?",
              "No: $4n + 1$",
              "Up 4 each time means the 4 times table: $4n$, then +1.",
              [["Yes", "Try n = 2: n + 4 gives 6, not 9."]],
            ],
          }),
          ask("The nth term of 6, 10, 14, …", "$4n + 2$", "Up 4, then +2.", "$4n + 2$.", {
            asks: "nth term",
            changed: "One more each term.",
            others: ["$4n + 6$", "$n + 4$"],
          }),
          ask(
            "The nth term of 30, 26, 22, 18, …",
            "$34 - 4n$",
            "Down 4: −4n, plus 34.",
            "$34 - 4n$.",
            {
              asks: "nth term",
              changed: "Going down.",
              others: ["$4n + 26$", "$30 - 4n$"],
            },
          ),
          ask("The nth term of 6, 8, 10, 12, …", "$2n + 4$", "Up 2, then +4.", "$2n + 4$.", {
            asks: "nth term",
            changed: "Up 2.",
            others: ["$4n + 2$", "$2n + 6$"],
          }),
        ],
        "The difference is the number with n, going up or down.",
      ),
      own(EX, NTH, "Spot the mistake"),

      own(EX, NTH, "Exit check"),

      reworded(EX, NTH, "The pentagons: 5, 9, 13, …", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**The difference gives the times table; adjust to fit.**"],
        nthTable([
          ["4n", ["4", "8", "12", "16"]],
          ["sequence", ["5", "9", "13", "17"]],
        ]),
        [
          "**The difference gives the times table; adjust to fit.**",
          "5, 9, 13, 17: $4n + 1$",
          "Going down 3 each time: $-3n$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y8NumberStepped: [string, UnitLesson[]][] = [
  [WRITE, [write]],
  [COMPARE, [compare]],
  [FOREVER, [forever]],
  [TWO, [twoBrackets]],
  [NEG, [negatives]],
  [MODEL, [model]],
  [NTH, [nthTerm]],
];
