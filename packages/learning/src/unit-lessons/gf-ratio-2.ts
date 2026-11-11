// GCSE Foundation, "Ratio problems", as four short lessons, one just before each skill: ratio in
// conversions, comparisons, scaling and mixing; multiplicative relationships as ratios or
// fractions; proportion as equal ratios; and ratios as fractions and straight lines. Each recaps
// the Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gf-ratio-2";
const paint: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 5, yMin: 0, yMax: 15 },
  lines: [{ m: 3, c: 0 }],
  points: [
    { x: 1, y: 3 },
    { x: 2, y: 6 },
    { x: 4, y: 12 },
  ],
};

export const gfRatio2: UnitLesson[] = [
  lesson(
    U,
    "applying",
    "GF-R5.c",
    "Using ratio",
    "Convert currencies, scale recipes and mix in a ratio.",
    [
      problem("Holiday money and paint", [
        "£1 = €1.15. How many euros for £240? And grey paint is black : white = 1 : 4. How much of each for 7.5 litres?",
        "By the end of this lesson, you can solve ratio problems like these in context.",
      ]),
      typed("Warm-up", "Work out $240 \\times 1.15$", "276", "$240 + 36$.", "276."),
      typed("Warm-up", "Work out $7.5 \\div 5$", "1.5", "Halve 3.", "1.5."),
      explain(
        "Discover",
        "Scale, then convert",
        [
          "An exchange rate is a ratio: £1 : €1.15. **Pounds to euros**, multiply; **euros to pounds**, divide.",
          "For mixing, share the total in the ratio: find one part, then each amount.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Black", parts: 1 },
            { label: "White", parts: 4 },
          ],
          total: "7.5 litres",
        },
      ),
      choose("Discover", "€92 into pounds, at £1 = €1.15", "£80", "$92 \\div 1.15$.", [
        ["£105.80", "That multiplies: euros to pounds, divide."],
        ["£92", "Convert."],
      ]),
      worked(
        "The paint",
        "Black : white = 1 : 4, 7.5 litres.",
        [
          ["5 parts; one part = 1.5 litres", "$7.5 \\div 5$."],
          ["Black 1.5 litres, white 6 litres", "1 part and 4 parts."],
        ],
        "Check: $1.5 + 6 = 7.5$ ✓",
      ),
      steps(
        "Together",
        "Which is better value?",
        "Shop A: £1 buys €1.15. Shop B: €1.20 per £1 but a £3 fee on £200.",
        [
          ["A gives for £200:", "€230", ["€200", "$200 \\times 1.15$."], "€230"],
          ["B gives (£197 changed):", "€236.40", ["€240", "The fee leaves £197."], "B is better"],
        ],
        "Compare like with like.",
      ),
      choose("Together", "A recipe for 4 uses 200 g flour. For 10 people?", "500 g", "50 g each.", [
        ["206 g", "Scale, don't add."],
        ["800 g", "That's for 16."],
      ]),
      typed(
        "Your turn",
        "£1 = 1.25 US dollars. How many dollars for £60?",
        "75",
        "$60 \\times 1.25$.",
        "75 dollars.",
        { wrong: [["48", "Pounds to dollars: multiply."]] },
      ),
      typed(
        "Your turn",
        "Concrete: cement : sand = 1 : 3. Cement in 20 kg?",
        "5",
        "4 parts of 5 kg.",
        "5 kg.",
        { unit: "kg", wrong: [["6.67", "There are 4 parts."]] },
      ),
      choose(
        "Watch out",
        "To change €115 into pounds, Raj multiplies by 1.15. What's wrong?",
        "Euros to pounds: divide, giving £100",
        "Euros are worth less than pounds here.",
        [["Nothing", "Multiplying makes it bigger, but pounds should be fewer."]],
      ),
      mistake(
        "Mia scales a recipe: 3 eggs for 12 cakes. Eggs for 20 cakes?",
        ["Cakes per egg: 4", "20 cakes need $20 \\div 4$", "= 6 eggs"],
        2,
        "$20 \\div 4 = 5$ eggs.",
      ),
      choose(
        "Back to the problem",
        "“£1 = €1.15. How many euros for £240?”",
        "€276",
        "$240 \\times 1.15$.",
        [
          ["€208.70", "Pounds to euros: multiply."],
          ["€241.15", "Multiply, don't add."],
        ],
      ),
      quiz([
        [
          ["£1 = €1.2. Euros for £50", "€60", ["€41.67", "€51.20"], "× 1.2."],
          ["£1 = €1.1. Euros for £300", "€330", ["€272.73", "€301.10"], "× 1.1."],
        ],
        [
          ["£1 = €1.25. Pounds for €100", "£80", ["£125", "£98.75"], "÷ 1.25."],
          ["£1 = €1.6. Pounds for €48", "£30", ["£76.80", "£46.40"], "÷ 1.6."],
        ],
        [
          [
            "Red : yellow = 2 : 3, 15 litres. Red",
            "6 litres",
            ["9 litres", "5 litres"],
            "One part 3.",
          ],
          [
            "Squash : water = 1 : 5, 1.2 litres. Squash",
            "0.2 litres",
            ["0.24 litres", "1 litre"],
            "One part 0.2.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "multiplicative",
    "GF-R6",
    "Ratio as a multiplier",
    "If A : B = 3 : 1, then A = 3B and B = ⅓A.",
    [
      problem("Ages and lengths", [
        "Ali is 3 times as old as his son. “Write the ratio of their ages.” And “A rope is $\\frac25$ the length of a cable. Write rope : cable.”",
        "By the end of this lesson, you can switch between “times as”, fractions and ratios.",
      ]),
      choose("Warm-up", "A : B = 6 : 2 simplifies to", "3 : 1", "Divide by 2.", [
        ["6 : 1", "Divide both."],
        ["1 : 3", "Keep the order."],
      ]),
      typed("Warm-up", "Work out $\\frac25 \\times 10$", "4", "Two fifths of 10.", "4."),
      explain(
        "Discover",
        "Ratios as multipliers",
        [
          "If A is 3 times B, then A : B = 3 : 1, and B is $\\frac13$ of A.",
          "If A is $\\frac25$ of B, then A : B = 2 : 5. The fraction compares one with the other, not with a total.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Rope", parts: 2 },
            { label: "Cable", parts: 5 },
          ],
        },
      ),
      choose("Discover", "Ali is 3 times as old as his son. Ali : son", "3 : 1", "Ali = 3 × son.", [
        ["1 : 3", "Ali first: the bigger."],
        ["1 : 4", "That's son to total."],
      ]),
      worked(
        "The rope",
        "A rope is $\\frac25$ the length of a cable. Write rope : cable.",
        [
          ["Rope = $\\frac25$ × cable", "The fraction."],
          ["Rope : cable = 2 : 5", "Numerator : denominator."],
        ],
        "Check: a 10 m cable has a 4 m rope: 4 : 10 = 2 : 5 ✓",
      ),
      steps(
        "Together",
        "Boys : girls = 4 : 5",
        "Write as a fraction.",
        [
          [
            "Boys are what fraction of the girls?",
            "$\\frac45$",
            ["$\\frac49$", "That's of the whole class."],
            "$\\frac45$",
          ],
          ["Girls = ? × boys", "$\\frac54$", ["$\\frac45$", "Girls are more."], "$\\frac54$"],
        ],
        "Part compared with part.",
      ),
      choose("Together", "$y = 6x$. The ratio $x : y$", "1 : 6", "For every 1 of $x$, 6 of $y$.", [
        ["6 : 1", "That's $y : x$."],
      ]),
      choose("Your turn", "A is 5 times B. A : B", "5 : 1", "A = 5B.", [
        ["1 : 5", "Keep the order."],
      ]),
      choose(
        "Your turn",
        "Cats : dogs = 2 : 3. Cats are what fraction of dogs?",
        "$\\frac23$",
        "Compare part with part.",
        [
          ["$\\frac25$", "That's cats of all."],
          ["$\\frac32$", "That's dogs of cats."],
        ],
      ),
      choose(
        "Watch out",
        "A : B = 2 : 3. Jo says A is $\\frac25$ of B. What's wrong?",
        "$\\frac25$ is A out of the total; A is $\\frac23$ of B",
        "Of the other part, not the whole.",
        [["Nothing", "Check: B = 3 gives A = 2: $\\frac23$."]],
      ),
      mistake(
        "Kai: “Tom earns $\\frac34$ as much as Sue.”",
        ["Tom = $\\frac34$ × Sue", "Tom : Sue = 3 : 4", "Sue earns $\\frac34$ as much as Tom"],
        2,
        "Sue earns $\\frac43$ as much as Tom.",
      ),
      choose(
        "Back to the problem",
        "“A rope is $\\frac25$ the length of a cable. Write the ratio rope : cable.”",
        "2 : 5",
        "Numerator : denominator.",
        [
          ["2 : 3", "That would make $\\frac25$ of the total."],
          ["5 : 2", "Rope first."],
        ],
      ),
      quiz([
        [
          ["A is 4 times B. A : B", "4 : 1", ["1 : 4", "4 : 5"], "A = 4B."],
          ["P is half of Q. P : Q", "1 : 2", ["2 : 1", "1 : 3"], "P = ½Q."],
        ],
        [
          [
            "A : B = 3 : 8. A as a fraction of B",
            "$\\frac38$",
            ["$\\frac{3}{11}$", "$\\frac83$"],
            "Part to part.",
          ],
          [
            "A : B = 5 : 2. B as a fraction of A",
            "$\\frac25$",
            ["$\\frac27$", "$\\frac52$"],
            "Part to part.",
          ],
        ],
        [
          ["$y = 4x$: $x : y$", "1 : 4", ["4 : 1", "1 : 5"], "Per 1 of $x$."],
          ["$b = \\frac13 a$: $a : b$", "3 : 1", ["1 : 3", "1 : 4"], "$a = 3b$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "equal-ratios",
    "GF-R7",
    "Proportion as equal ratios",
    "Two quantities are in proportion when their ratios are equal.",
    [
      problem("Is it the same mix?", [
        "Recipe A: 3 cups of oats to 2 of milk. Recipe B: 7.5 cups of oats to 5 of milk. “Are the recipes in the same proportion? Show how you know.”",
        "By the end of this lesson, you can test and use equal ratios.",
      ]),
      choose("Warm-up", "Simplify 7.5 : 5", "3 : 2", "Times 2, then ÷ 5.", [
        ["7 : 5", "Don't drop the decimal."],
        ["15 : 5", "Simplify fully."],
      ]),
      typed(
        "Warm-up",
        "Solve $\\frac{x}{4} = \\frac{9}{12}$",
        "3",
        "$\\frac{9}{12} = \\frac34$.",
        "$x = 3$.",
      ),
      explain(
        "Discover",
        "Equal ratios",
        [
          "Quantities are in **proportion** when their ratios are equal: 3 : 2 = 6 : 4 = 7.5 : 5.",
          "To test: simplify both, or check that one is the other multiplied by the same number.",
        ],
        { kind: "table", head: ["Oats", "3", "6", "7.5"], rows: [["Milk", "2", "4", "5"]] },
      ),
      choose("Discover", "Is 4 : 6 = 10 : 15?", "Yes: both simplify to 2 : 3", "Equal ratios.", [
        ["No: 4 + 6 ≠ 10 + 15", "Compare by multiplying, not adding."],
      ]),
      worked(
        "The recipes",
        "Are 3 : 2 and 7.5 : 5 in proportion?",
        [
          ["$7.5 \\div 3 = 2.5$ and $5 \\div 2 = 2.5$", "The same multiplier."],
          ["Yes: B is A × 2.5", "Equal ratios."],
        ],
        "Same multiplier for both parts.",
      ),
      steps(
        "Together",
        "3 : 5 = 12 : $x$",
        "Find $x$.",
        [
          ["3 to 12 is", "× 4", ["+ 9", "Multiply."], "× 4"],
          ["So $x =$", "20", ["14", "$5 \\times 4$."], "$x = 20$"],
        ],
        "Do the same to both parts.",
      ),
      choose("Together", "Which is in the same proportion as 2 : 7?", "6 : 21", "Both × 3.", [
        ["4 : 9", "+2 to each isn't proportion."],
        ["7 : 2", "Order matters."],
      ]),
      typed("Your turn", "5 : 8 = 15 : $x$", "24", "× 3.", "$x = 24$.", {
        wrong: [["18", "Multiply, don't add 10."]],
      }),
      choose(
        "Your turn",
        "Are 4 : 10 and 6 : 15 in proportion?",
        "Yes: both 2 : 5",
        "Simplify each.",
        [["No", "Simplify both first."]],
      ),
      choose(
        "Watch out",
        "Sam says 2 : 3 and 4 : 5 are in proportion because each adds 2. Right?",
        "No: proportion multiplies; 2 : 3 = 4 : 6",
        "Adding the same keeps differences, not ratios.",
        [["Yes", "$\\frac23 \\ne \\frac45$."]],
      ),
      mistake(
        "Ola finds $x$ in 6 : 9 = $x$ : 15.",
        ["6 : 9 simplifies to 2 : 3", "15 is 3 × 5", "So $x = 2 + 5 = 7$"],
        2,
        "Multiply: $x = 2 \\times 5 = 10$.",
      ),
      choose(
        "Back to the problem",
        "“Are 3 : 2 and 7.5 : 5 in the same proportion? Show how you know.”",
        "Yes: both parts × 2.5",
        "Equal multipliers.",
        [
          ["No: 7.5 isn't whole", "Ratios can use decimals."],
          ["Yes: both add to a multiple of 5", "Compare by multiplying."],
        ],
      ),
      quiz([
        [
          ["2 : 3 = $x$ : 12", "8", ["11", "6"], "× 4."],
          ["4 : 7 = 20 : $x$", "35", ["23", "28"], "× 5."],
        ],
        [
          ["Same as 3 : 4?", "9 : 12", ["5 : 6", "4 : 3"], "× 3."],
          ["Same as 5 : 2?", "15 : 6", ["7 : 4", "2 : 5"], "× 3."],
        ],
        [
          [
            "Equal ratios have",
            "the same multiplier for both parts",
            ["the same difference", "the same total"],
            "Multiply.",
          ],
          ["Test proportion by", "simplifying both", ["adding both", "subtracting"], "Simplify."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "linear-functions",
    "GF-R8",
    "Ratios, fractions and straight lines",
    "A fixed ratio gives a straight line through the origin: y = kx.",
    [
      problem(
        "Paint mixes",
        [
          "Paint is red : white = 1 : 3. Plot white against red for different amounts. “What do you notice? Write an equation linking them.”",
          "By the end of this lesson, you'll see a ratio as a graph and a formula.",
        ],
        paint,
      ),
      typed("Warm-up", "Red : white = 1 : 3. White for 2 litres red?", "6", "× 3.", "6 litres."),
      typed("Warm-up", "White for 4 litres red?", "12", "× 3.", "12 litres."),
      explain(
        "Discover",
        "A straight line through zero",
        [
          "Every point (red, white) in the same ratio lies on a straight line **through the origin**: no red means no white.",
          "Its equation is $w = 3r$. The gradient, 3, is the ratio white ÷ red.",
        ],
        paint,
      ),
      choose("Discover", "The gradient of the paint line is", "3", "White ÷ red.", [
        ["$\\frac13$", "That's red ÷ white."],
        ["1", "Up 3 for each 1 across."],
      ]),
      worked(
        "The equation",
        "Red : white = 1 : 3. Write an equation.",
        [
          ["For every 1 red, 3 white", "The ratio."],
          ["$w = 3r$", "A straight line through (0, 0)."],
        ],
        "Also, red is $\\frac14$ of the paint: $r = \\frac14 \\times$ total.",
      ),
      steps(
        "Together",
        "Is (5, 16) on the paint line?",
        "Check.",
        [
          ["For $r = 5$, $w$ should be", "15", ["16", "$3 \\times 5$."], "15"],
          [
            "So (5, 16) is",
            "not on the line: a different mix",
            ["on the line", "16 ≠ 15."],
            "Not the same ratio",
          ],
        ],
        "Off the line means a different ratio.",
      ),
      choose(
        "Together",
        "Sugar : flour = 2 : 5. The equation linking flour $f$ and sugar $s$",
        "$f = 2.5s$",
        "$5 \\div 2 = 2.5$.",
        [
          ["$f = 5s$", "For 2 sugar, 5 flour."],
          ["$f = s + 3$", "A ratio multiplies."],
        ],
      ),
      choose(
        "Your turn",
        "Which graph shows a fixed ratio?",
        "A straight line through (0, 0)",
        "$y = kx$.",
        [
          ["A straight line through (0, 5)", "At 0, there'd still be 5."],
          ["A curve", "Ratios give straight lines."],
        ],
      ),
      choose("Your turn", "$y = 4x$: the ratio $x : y$", "1 : 4", "For each 1 of $x$, 4 of $y$.", [
        ["4 : 1", "That's $y : x$."],
      ]),
      choose(
        "Watch out",
        "A taxi costs £3 plus £2 a mile. Is cost : miles a fixed ratio?",
        "No: the line doesn't go through (0, 0)",
        "£3 even at 0 miles.",
        [["Yes: it's a straight line", "Straight isn't enough: through the origin too."]],
      ),
      mistake(
        "Ali writes the equation for juice : water = 1 : 4.",
        ["For every 1 juice, 4 water", "So $w = j + 4$", "Graph: a straight line"],
        1,
        "A ratio multiplies: $w = 4j$, through the origin.",
      ),
      choose(
        "Back to the problem",
        "“Red : white = 1 : 3. What do you notice about the graph, and what's its equation?”",
        "A straight line through the origin: $w = 3r$",
        "Fixed ratio.",
        [
          ["A curve: $w = r^3$", "Ratios give straight lines."],
          ["A line through (0, 3): $w = r + 3$", "No red means no white."],
        ],
      ),
      quiz([
        [
          ["A : B = 1 : 5. Equation for B", "$B = 5A$", ["$A = 5B$", "$B = A + 5$"], "Multiply."],
          [
            "A : B = 2 : 1. Equation for B",
            "$B = \\frac12 A$",
            ["$B = 2A$", "$B = A - 1$"],
            "Half.",
          ],
        ],
        [
          ["A fixed ratio graph passes through", "(0, 0)", ["(0, 1)", "(1, 0)"], "Origin."],
          ["The gradient of $y = 7x$", "7", ["$\\frac17$", "0"], "$k$."],
        ],
        [
          ["Is (3, 12) on $y = 4x$?", "Yes", ["No", "Only if $x = 4$"], "$4 \\times 3 = 12$."],
          ["Is (2, 9) on $y = 4x$?", "No", ["Yes", "Only if $x = 9$"], "$4 \\times 2 = 8$."],
        ],
      ]),
    ],
  ),
];
