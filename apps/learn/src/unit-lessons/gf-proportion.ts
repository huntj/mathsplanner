// GCSE Foundation, "Proportion", as four short lessons, one just before each skill: direct
// proportion, inverse proportion, proportion graphs and equations, and reading y ∝ 1/x. Each
// recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and
// ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gf-proportion";
const inverse: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
  curves: [{ kind: "inverse", k: 12 }],
  points: [
    { x: 2, y: 6 },
    { x: 3, y: 4 },
    { x: 4, y: 3 },
    { x: 6, y: 2 },
  ],
};
const direct: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 },
  lines: [{ m: 2, c: 0 }],
};

export const gfProportion: UnitLesson[] = [
  lesson(
    U,
    "direct",
    "GF-R10.a",
    "Direct proportion",
    "Find one, then scale: double one and the other doubles.",
    [
      problem("Best buy", [
        "6 pens cost £4.20. “How much do 10 pens cost?” And a car uses 8 litres for 100 km: how much for 350 km?",
        "By the end of this lesson, you can solve any direct proportion problem.",
      ]),
      typed("Warm-up", "$4.20 \\div 6$", "0.7", "Divide.", "0.70."),
      typed("Warm-up", "$0.7 \\times 10$", "7", "Times.", "7."),
      explain(
        "Discover",
        "Unitary method",
        [
          "Two quantities are in **direct proportion** if, when one doubles, so does the other. Their ratio stays the same.",
          "**Find one first**: the cost of 1 pen, or the fuel for 1 km. Then multiply.",
        ],
        {
          kind: "table",
          head: ["Pens", "6", "1", "10"],
          rows: [["Cost", "£4.20", "£0.70", "£7.00"]],
        },
      ),
      choose("Discover", "3 kg cost £7.50. 1 kg costs", "£2.50", "$7.50 \\div 3$.", [
        ["£22.50", "Divide."],
        ["£4.50", "$7.50 \\div 3$."],
      ]),
      worked(
        "The pens",
        "6 pens cost £4.20. Cost of 10?",
        [
          ["1 pen: $4.20 \\div 6 = £0.70$", "Find one."],
          ["10 pens: $0.70 \\times 10 = £7$", "Scale."],
        ],
        "£7.00.",
      ),
      steps(
        "Together",
        "8 litres per 100 km",
        "Fuel for 350 km.",
        [
          ["Per km:", "0.08 litres", ["12.5 litres", "$8 \\div 100$."], "0.08 l/km"],
          ["For 350 km:", "28 litres", ["43.75 litres", "$0.08 \\times 350$."], "28 litres"],
        ],
        "Or: 350 km is 3.5 lots of 100 km.",
      ),
      choose(
        "Together",
        "Which is better value: 4 for £3 or 7 for £5?",
        "7 for £5",
        "71p each beats 75p.",
        [
          ["4 for £3", "75p each."],
          ["They're the same", "75p vs 71p."],
        ],
      ),
      typed(
        "Your turn",
        "5 tickets cost £42. Cost of 8, in pounds?",
        "67.2",
        "£8.40 each.",
        "£67.20.",
        { wrong: [["45", "Don't add 3."]] },
      ),
      typed(
        "Your turn",
        "A recipe for 4 uses 300 g. For 6 people, in grams?",
        "450",
        "75 g each.",
        "450 g.",
        { unit: "g" },
      ),
      choose(
        "Watch out",
        "6 pens £4.20. Kim says 10 pens cost £8.20, adding £1 per extra pen. What's wrong?",
        "Proportion multiplies: each pen is 70p, so £7",
        "Find one, then scale.",
        [["Nothing", "Each pen is 70p, not £1."]],
      ),
      mistake(
        "Raj scales: 3 workers lay 90 bricks an hour; 5 workers?",
        ["Per worker: 30 bricks", "5 workers: $30 + 5$", "35 bricks"],
        1,
        "Multiply: $30 \\times 5 = 150$ bricks.",
      ),
      typed(
        "Back to the problem",
        "“6 pens cost £4.20. Work out the cost of 10 pens.”",
        "7",
        "70p each.",
        "£7.",
        { wrong: [["8.2", "Multiply by 10, not add."]] },
      ),
      quiz([
        [
          ["4 cost £10. 6 cost", "£15", ["£12", "£16"], "£2.50 each."],
          ["5 cost £8. 3 cost", "£4.80", ["£6", "£5"], "£1.60 each."],
        ],
        [
          ["200 g for 5 people. For 8", "320 g", ["203 g", "250 g"], "40 g each."],
          ["150 ml for 3. For 7", "350 ml", ["154 ml", "300 ml"], "50 ml each."],
        ],
        [
          [
            "Better value: 3 for £2.40 or 5 for £3.75?",
            "5 for £3.75",
            ["3 for £2.40", "same"],
            "75p vs 80p.",
          ],
          [
            "Better value: 2 for £1.60 or 6 for £5.10?",
            "2 for £1.60",
            ["6 for £5.10", "same"],
            "80p vs 85p.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "inverse",
    "GF-R10.b",
    "Inverse proportion",
    "More of one means less of the other: the product stays the same.",
    [
      problem("Painting a fence", [
        "4 painters take 6 hours to paint a fence. “How long would 3 painters take?” More painters, less time.",
        "By the end of this lesson, you can solve inverse proportion problems.",
      ]),
      typed("Warm-up", "$4 \\times 6$", "24", "Times.", "24."),
      typed("Warm-up", "$24 \\div 3$", "8", "Divide.", "8."),
      explain(
        "Discover",
        "The total stays the same",
        [
          "In **inverse proportion**, doubling one **halves** the other. Their **product** stays the same.",
          "4 painters × 6 hours = 24 painter-hours of work. With 3 painters: $24 \\div 3 = 8$ hours.",
        ],
        {
          kind: "table",
          head: ["Painters", "1", "3", "4", "8"],
          rows: [["Hours", "24", "8", "6", "3"]],
        },
      ),
      choose(
        "Discover",
        "Which is inverse proportion?",
        "Speed and time for a fixed journey",
        "Faster means less time.",
        [
          ["Pens and their cost", "That's direct."],
          ["Hours worked and pay", "That's direct."],
        ],
      ),
      worked(
        "The fence",
        "4 painters take 6 hours. 3 painters?",
        [
          ["Total work: $4 \\times 6 = 24$ painter-hours", "Multiply."],
          ["3 painters: $24 \\div 3 = 8$ hours", "Divide."],
        ],
        "Fewer painters, more time ✓",
      ),
      steps(
        "Together",
        "A journey takes 3 hours at 40 mph",
        "Time at 60 mph?",
        [
          ["Distance (the product):", "120 miles", ["43 miles", "$40 \\times 3$."], "120"],
          ["At 60 mph:", "2 hours", ["4.5 hours", "$120 \\div 60$."], "2 h"],
        ],
        "Faster, less time.",
      ),
      choose(
        "Together",
        "Food for 10 dogs lasts 6 days. For 15 dogs it lasts",
        "4 days",
        "60 dog-days ÷ 15.",
        [
          ["9 days", "More dogs: less time."],
          ["11 days", "Multiply, then divide."],
        ],
      ),
      typed(
        "Your turn",
        "5 machines take 12 hours. 6 machines?",
        "10",
        "$60 \\div 6$.",
        "10 hours.",
        { unit: "hours", wrong: [["14.4", "More machines: less time."]] },
      ),
      typed(
        "Your turn",
        "8 people share prize money: £150 each. With 12 people, each gets?",
        "100",
        "$1200 \\div 12$.",
        "£100.",
        { wrong: [["225", "More people: less each."]] },
      ),
      choose(
        "Watch out",
        "4 painters take 6 hours. Ed says 8 painters take 12 hours. What's wrong?",
        "More painters means less time: 3 hours",
        "Inverse: double one, halve the other.",
        [["Nothing", "Twice the painters, half the time."]],
      ),
      mistake(
        "Mia: 6 taps fill a tank in 10 minutes. 4 taps?",
        ["Fewer taps: more time", "$10 \\times \\frac46$", "6.7 minutes"],
        1,
        "Multiply by $\\frac64$: $60 \\div 4 = 15$ minutes.",
      ),
      typed(
        "Back to the problem",
        "“4 painters take 6 hours. How long would 3 painters take?”",
        "8",
        "24 painter-hours ÷ 3.",
        "8 hours.",
        { unit: "hours", wrong: [["4.5", "Fewer painters: more time."]] },
      ),
      quiz([
        [
          ["3 workers, 8 days. 6 workers", "4 days", ["16 days", "11 days"], "24 ÷ 6."],
          ["2 pumps, 9 hours. 3 pumps", "6 hours", ["13.5 hours", "10 hours"], "18 ÷ 3."],
        ],
        [
          ["At 30 mph, 4 h. At 40 mph", "3 h", ["5.3 h", "3.5 h"], "120 ÷ 40."],
          ["At 50 km/h, 3 h. At 75 km/h", "2 h", ["4.5 h", "2.5 h"], "150 ÷ 75."],
        ],
        [
          [
            "Inverse proportion keeps",
            "the product the same",
            ["the ratio the same", "the sum the same"],
            "Product.",
          ],
          [
            "Double one in inverse proportion: the other",
            "halves",
            ["doubles", "stays"],
            "Halves.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "graphs",
    "GF-R10.c",
    "Proportion graphs and equations",
    "Direct: y = kx, a line through 0. Inverse: y = k/x, a curve.",
    [
      problem(
        "Which graph?",
        [
          "“Here are four graphs. Which shows $y$ directly proportional to $x$?” And “$y$ is directly proportional to $x$; $y = 15$ when $x = 3$. Find $y$ when $x = 7$.”",
          "By the end of this lesson, you can recognise proportion graphs and write their equations.",
        ],
        direct,
      ),
      choose("Warm-up", "Does $y = 2x$ go through (0, 0)?", "Yes", "$2 \\times 0 = 0$.", [
        ["No", "Substitute $x = 0$."],
      ]),
      typed("Warm-up", "$15 \\div 3$", "5", "Divide.", "5."),
      explain(
        "Discover",
        "Two shapes",
        [
          "**Direct proportion**: $y = kx$. A straight line **through the origin**. $k$ is the gradient.",
          "**Inverse proportion**: $y = \\frac{k}{x}$. A curve that gets closer and closer to the axes, never touching.",
        ],
        inverse,
      ),
      choose(
        "Discover",
        "Which shows direct proportion?",
        "A straight line through (0, 0)",
        "$y = kx$.",
        [
          ["A straight line through (0, 3)", "Not through the origin."],
          ["A curve falling to the axes", "That's inverse."],
        ],
      ),
      worked(
        "Find k",
        "$y \\propto x$; $y = 15$ when $x = 3$. Find $y$ when $x = 7$.",
        [
          ["$y = kx$: $15 = 3k$, so $k = 5$", "Find $k$."],
          ["$y = 5x$; when $x = 7$, $y = 35$", "Use the equation."],
        ],
        "Find $k$, write the equation, use it.",
      ),
      steps(
        "Together",
        "$y \\propto \\frac1x$; $y = 6$ when $x = 2$",
        "Find $y$ when $x = 4$.",
        [
          [
            "$y = \\frac{k}{x}$: $6 = \\frac{k}{2}$, so $k =$",
            "12",
            ["3", "Multiply: $6 \\times 2$."],
            "$y = \\frac{12}{x}$",
          ],
          ["When $x = 4$:", "$y = 3$", ["$y = 48$", "$12 \\div 4$."], "3"],
        ],
        "Double $x$, halve $y$ ✓",
      ),
      choose(
        "Together",
        "Which equation shows inverse proportion?",
        "$y = \\frac{20}{x}$",
        "$k$ over $x$.",
        [
          ["$y = 20x$", "That's direct."],
          ["$y = x + 20$", "Not proportion."],
        ],
      ),
      typed(
        "Your turn",
        "$y \\propto x$, $y = 12$ when $x = 4$. $y$ when $x = 10$?",
        "30",
        "$k = 3$.",
        "30.",
        { wrong: [["18", "Proportion multiplies: $k = 3$."]] },
      ),
      typed(
        "Your turn",
        "$y = \\frac{k}{x}$, $y = 5$ when $x = 6$. $y$ when $x = 10$?",
        "3",
        "$k = 30$.",
        "3.",
        { wrong: [["8.33", "Inverse: $30 \\div 10$."]] },
      ),
      choose(
        "Watch out",
        "Ben says $y = 3x + 2$ is direct proportion because it's a straight line. Right?",
        "No: it doesn't go through the origin",
        "$y = kx$ only.",
        [["Yes", "At $x = 0$, $y = 2$."]],
      ),
      mistake(
        "Ivy: $y \\propto x$, $y = 8$ when $x = 2$. Find $y$ when $x = 5$.",
        ["$y = kx$, $8 = 2k$", "$k = 16$", "$y = 80$"],
        1,
        "$k = 8 \\div 2 = 4$, so $y = 20$.",
      ),
      choose(
        "Back to the problem",
        "“$y \\propto x$; $y = 15$ when $x = 3$. Find $y$ when $x = 7$.”",
        "35",
        "$y = 5x$.",
        [
          ["19", "Multiply: $k = 5$."],
          ["45", "$5 \\times 7$."],
        ],
      ),
      quiz([
        [
          ["$y \\propto x$: $y = 10$ at $x = 2$. At $x = 6$", "30", ["14", "60"], "$k = 5$."],
          ["$y \\propto x$: $y = 21$ at $x = 3$. At $x = 5$", "35", ["23", "105"], "$k = 7$."],
        ],
        [
          ["$y = \\frac{k}{x}$: $y = 4$ at $x = 3$. At $x = 6$", "2", ["8", "24"], "$k = 12$."],
          ["$y = \\frac{k}{x}$: $y = 10$ at $x = 2$. At $x = 5$", "4", ["25", "100"], "$k = 20$."],
        ],
        [
          [
            "Graph of $y = kx$",
            "straight line through 0",
            ["curve", "line through (0, k)"],
            "Direct.",
          ],
          ["Graph of $y = \\frac{k}{x}$", "curve", ["straight line", "line through 0"], "Inverse."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "interpret",
    "GF-R13",
    "Reading proportion statements",
    "y ∝ x and y ∝ 1/x: what happens when one changes.",
    [
      problem(
        "What happens if…",
        [
          "“$P$ is inversely proportional to $V$. What happens to $P$ when $V$ is doubled?” And “$C \\propto n$: what if $n$ trebles?”",
          "By the end of this lesson, you can reason about proportion without numbers.",
        ],
        inverse,
      ),
      choose("Warm-up", "$\\propto$ means", "is proportional to", "A symbol for proportion.", [
        ["is equal to", "Proportional, not equal."],
      ]),
      typed("Warm-up", "$\\frac{12}{2 \\times 3}$", "2", "$12 \\div 6$.", "2."),
      explain(
        "Discover",
        "Reading the symbols",
        [
          "$y \\propto x$: $y = kx$. Multiply $x$ by a number, and $y$ is multiplied by the **same** number.",
          "$y \\propto \\frac1x$: $y = \\frac{k}{x}$. Multiply $x$ by a number, and $y$ is **divided** by it.",
        ],
        {
          kind: "table",
          head: ["Change in $x$", "$y \\propto x$", "$y \\propto \\frac1x$"],
          rows: [
            ["× 2", "× 2", "÷ 2"],
            ["× 3", "× 3", "÷ 3"],
          ],
        },
      ),
      choose("Discover", "$y \\propto x$ and $x$ is halved. $y$", "is halved", "Same change.", [
        ["doubles", "That's inverse."],
        ["stays the same", "It changes with $x$."],
      ]),
      worked(
        "Pressure and volume",
        "$P \\propto \\frac1V$. $V$ is doubled. What happens to $P$?",
        [
          ["$P = \\frac{k}{V}$", "Write the equation."],
          ["$\\frac{k}{2V} = \\frac12 \\cdot \\frac{k}{V}$", "Double $V$."],
          ["$P$ is halved", "Inverse."],
        ],
        "Double one, halve the other.",
      ),
      steps(
        "Together",
        "$C \\propto n$. $n$ trebles",
        "Reason.",
        [
          [
            "$C = kn$, so with $3n$:",
            "$C$ trebles",
            ["$C$ is divided by 3", "Direct: same change."],
            "× 3",
          ],
          ["If $C$ was £20, now it's", "£60", ["£23", "× 3."], "£60"],
        ],
        "Direct: same multiplier.",
      ),
      choose(
        "Together",
        "$t \\propto \\frac1s$ (time and speed). Speed × 4. Time",
        "÷ 4",
        "Inverse.",
        [
          ["× 4", "Faster: less time."],
          ["− 4", "Multiply or divide, not subtract."],
        ],
      ),
      choose(
        "Your turn",
        "$y \\propto \\frac1x$, $x$ is divided by 5. $y$",
        "× 5",
        "Inverse: opposite.",
        [["÷ 5", "That's direct."]],
      ),
      choose(
        "Your turn",
        "Write “$A$ is inversely proportional to $B$” as an equation",
        "$A = \\frac{k}{B}$",
        "$k$ over $B$.",
        [
          ["$A = kB$", "That's direct."],
          ["$A = B - k$", "Not proportion."],
        ],
      ),
      choose(
        "Watch out",
        "Raj says if $y \\propto \\frac1x$ and $x$ goes up by 2, $y$ goes down by 2. Right?",
        "No: multiplying $x$ by 2 divides $y$ by 2; adding isn't the same",
        "Proportion is about multiplying.",
        [["Yes", "Try $y = \\frac{12}{x}$: $x$ from 2 to 4 halves $y$ from 6 to 3."]],
      ),
      mistake(
        "Kai: $y \\propto x$; $y = 6$ when $x = 2$. $x$ becomes 6.",
        ["$x$ is multiplied by 3", "So $y$ is divided by 3", "$y = 2$"],
        1,
        "Direct: $y$ is multiplied by 3: $y = 18$.",
      ),
      choose(
        "Back to the problem",
        "“$P$ is inversely proportional to $V$. What happens to $P$ when $V$ is doubled?”",
        "$P$ is halved",
        "Inverse.",
        [
          ["$P$ doubles", "That's direct."],
          ["$P$ stays the same", "It depends on $V$."],
        ],
      ),
      quiz([
        [
          ["$y \\propto x$, $x$ × 4: $y$", "× 4", ["÷ 4", "+ 4"], "Same."],
          ["$y \\propto x$, $x$ ÷ 2: $y$", "÷ 2", ["× 2", "− 2"], "Same."],
        ],
        [
          ["$y \\propto \\frac1x$, $x$ × 3: $y$", "÷ 3", ["× 3", "− 3"], "Opposite."],
          ["$y \\propto \\frac1x$, $x$ ÷ 4: $y$", "× 4", ["÷ 4", "+ 4"], "Opposite."],
        ],
        [
          [
            "“$m$ is directly proportional to $n$”",
            "$m = kn$",
            ["$m = \\frac{k}{n}$", "$m = n + k$"],
            "Direct.",
          ],
          [
            "“$p$ is inversely proportional to $q$”",
            "$p = \\frac{k}{q}$",
            ["$p = kq$", "$p = q - k$"],
            "Inverse.",
          ],
        ],
      ]),
    ],
  ),
];
