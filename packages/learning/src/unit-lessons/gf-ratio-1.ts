// GCSE Foundation, "Ratio", as five short lessons, one just before each skill: fractions in ratio
// problems, one quantity as a fraction of another, ratio notation and simplest form, and sharing
// in a ratio from a part or from the whole. Each recaps the Key Stage 3 idea quickly, builds it to
// GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-ratio-1";

export const gfRatio1: UnitLesson[] = [
  lesson(
    U,
    "fractions-in-ratio",
    "GF-N11",
    "Fractions and ratio",
    "Turn a ratio into fractions of the whole, and back.",
    [
      problem(
        "The class",
        [
          "In a class, boys : girls = 3 : 5. “What fraction of the class are girls?” And “$\\frac25$ of a bag are red sweets; the rest are green. Write red : green.”",
          "By the end of this lesson, you can switch between ratios and fractions both ways.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Boys", parts: 3 },
            { label: "Girls", parts: 5 },
          ],
        },
      ),
      typed("Warm-up", "Parts in the ratio 3 : 5", "8", "Add them.", "8 parts."),
      choose("Warm-up", "$1 - \\frac25$", "$\\frac35$", "What's left.", [
        ["$\\frac15$", "Five fifths minus two."],
      ]),
      explain(
        "Discover",
        "Parts and the whole",
        [
          "In 3 : 5 there are 8 parts. Boys are $\\frac38$ of the **whole**; girls $\\frac58$.",
          "Back the other way: if $\\frac25$ are red, then $\\frac35$ are green, so red : green = 2 : 3.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Red", parts: 2 },
            { label: "Green", parts: 3 },
          ],
        },
      ),
      choose("Discover", "Boys : girls = 3 : 5. Fraction of boys", "$\\frac38$", "3 parts of 8.", [
        ["$\\frac35$", "That compares boys with girls."],
        ["$\\frac53$", "Part over whole."],
      ]),
      worked(
        "The class",
        "Boys : girls = 3 : 5. What fraction are girls?",
        [
          ["$3 + 5 = 8$ parts", "The whole."],
          ["Girls: $\\frac58$", "Part over whole."],
        ],
        "Fractions of the whole use the total number of parts.",
      ),
      steps(
        "Together",
        "$\\frac25$ are red; the rest green",
        "Write red : green.",
        [
          [
            "Green fraction:",
            "$\\frac35$",
            ["$\\frac25$", "The rest: $1 - \\frac25$."],
            "$\\frac35$",
          ],
          ["Red : green =", "2 : 3", ["2 : 5", "Compare part with part."], "2 : 3"],
        ],
        "Fifths: 2 red, 3 green.",
      ),
      choose(
        "Together",
        "Cats : dogs = 4 : 1. What fraction are dogs?",
        "$\\frac15$",
        "1 part of 5.",
        [
          ["$\\frac14$", "5 parts in all."],
          ["$\\frac41$", "That's the ratio."],
        ],
      ),
      choose(
        "Your turn",
        "Paint: blue : white = 2 : 7. Fraction that is blue",
        "$\\frac29$",
        "2 of 9.",
        [["$\\frac27$", "There are 9 parts."]],
      ),
      choose(
        "Your turn",
        "$\\frac34$ of a team are adults; the rest children. Adults : children",
        "3 : 1",
        "$\\frac34$ and $\\frac14$.",
        [
          ["3 : 4", "Compare part with part."],
          ["4 : 3", "Adults first."],
        ],
      ),
      choose(
        "Watch out",
        "Boys : girls = 2 : 3. Raj says $\\frac23$ are boys. Is he right?",
        "No: 5 parts, so $\\frac25$ are boys",
        "$\\frac23$ compares boys with girls.",
        [["Yes", "Count every part."]],
      ),
      mistake(
        "$\\frac38$ of a garden is grass; the rest is paving. Mia writes grass : paving.",
        ["Grass: $\\frac38$", "Paving: $\\frac58$", "Grass : paving = 3 : 8"],
        2,
        "Compare part with part: 3 : 5.",
      ),
      choose(
        "Back to the problem",
        "“Boys : girls = 3 : 5. What fraction of the class are girls?”",
        "$\\frac58$",
        "5 parts of 8.",
        [
          ["$\\frac53$", "Part over whole."],
          ["$\\frac35$", "That's boys to girls."],
        ],
      ),
      quiz([
        [
          ["A : B = 1 : 4. Fraction A", "$\\frac15$", ["$\\frac14$", "$\\frac45$"], "1 of 5."],
          ["A : B = 5 : 2. Fraction B", "$\\frac27$", ["$\\frac25$", "$\\frac57$"], "2 of 7."],
        ],
        [
          [
            "$\\frac13$ are red, rest blue. Red : blue",
            "1 : 2",
            ["1 : 3", "2 : 1"],
            "$\\frac13$ and $\\frac23$.",
          ],
          [
            "$\\frac25$ are tea, rest coffee. Tea : coffee",
            "2 : 3",
            ["2 : 5", "3 : 2"],
            "$\\frac25$ and $\\frac35$.",
          ],
        ],
        [
          [
            "3 : 7. Fraction that is the 7 part",
            "$\\frac{7}{10}$",
            ["$\\frac73$", "$\\frac37$"],
            "7 of 10.",
          ],
          [
            "9 : 1. Fraction that is the 9 part",
            "$\\frac{9}{10}$",
            ["$\\frac91$", "$\\frac19$"],
            "9 of 10.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fraction-of-another",
    "GF-R3",
    "One quantity as a fraction of another",
    "Part over whole, in the same units, simplified.",
    [
      problem("Screen time", [
        "Kai spends 40 minutes of his 2-hour evening gaming. “What fraction of the evening is that? Give your answer in its simplest form.”",
        "By the end of this lesson, you can write any amount as a fraction of another.",
      ]),
      typed("Warm-up", "How many minutes in 2 hours?", "120", "$2 \\times 60$.", "120."),
      choose("Warm-up", "Simplify $\\frac{40}{120}$", "$\\frac13$", "Divide by 40.", [
        ["$\\frac{4}{12}$", "Not simplest."],
        ["$\\frac{40}{12}$", "Simplify top and bottom."],
      ]),
      explain(
        "Discover",
        "Same units first",
        [
          "Write the part over the whole, **in the same units**, then simplify.",
          "40 minutes of 2 hours: $\\frac{40}{120} = \\frac13$.",
        ],
        { kind: "maths", tex: "\\frac{40 \\text{ min}}{120 \\text{ min}} = \\frac13" },
      ),
      choose("Discover", "50p as a fraction of £2", "$\\frac14$", "$\\frac{50}{200}$.", [
        ["$\\frac{50}{2}$", "Same units: 200p."],
        ["$\\frac{1}{25}$", "Part over whole."],
      ]),
      worked(
        "Screen time",
        "40 minutes as a fraction of 2 hours.",
        [
          ["2 hours = 120 minutes", "Same units."],
          ["$\\frac{40}{120} = \\frac13$", "Simplify."],
        ],
        "A third of the evening.",
      ),
      steps(
        "Together",
        "300 m as a fraction of 2 km",
        "Units.",
        [
          ["2 km =", "2000 m", ["200 m", "1 km = 1000 m."], "$\\frac{300}{2000}$"],
          [
            "Simplest form:",
            "$\\frac{3}{20}$",
            ["$\\frac{3}{2}$", "Divide by 100."],
            "$\\frac{3}{20}$",
          ],
        ],
        "Same units, then simplify.",
      ),
      choose(
        "Together",
        "18 out of 30 pupils walk. Fraction?",
        "$\\frac35$",
        "$\\frac{18}{30}$, divide by 6.",
        [
          ["$\\frac{18}{30}$", "Simplify."],
          ["$\\frac{30}{18}$", "Part over whole."],
        ],
      ),
      choose("Your turn", "250 g as a fraction of 1 kg", "$\\frac14$", "$\\frac{250}{1000}$.", [
        ["$\\frac{250}{1}$", "Same units."],
        ["$\\frac{1}{250}$", "Part over whole."],
      ]),
      choose(
        "Your turn",
        "15 minutes as a fraction of an hour",
        "$\\frac14$",
        "$\\frac{15}{60}$.",
        [
          ["$\\frac{15}{100}$", "An hour is 60 minutes."],
          ["$\\frac{1}{15}$", "Part over whole."],
        ],
      ),
      choose(
        "Watch out",
        "Asked for 20 cm as a fraction of 1 m, Jo writes $\\frac{20}{1}$. What's wrong?",
        "Same units: $\\frac{20}{100} = \\frac15$",
        "1 m = 100 cm.",
        [["Nothing", "$\\frac{20}{1}$ means 20 times as big."]],
      ),
      mistake(
        "Ed writes 45 seconds as a fraction of 3 minutes.",
        ["3 minutes = 180 seconds", "$\\frac{180}{45}$", "= 4"],
        1,
        "Part over whole: $\\frac{45}{180} = \\frac14$.",
      ),
      choose(
        "Back to the problem",
        "“40 minutes of a 2-hour evening. What fraction, in simplest form?”",
        "$\\frac13$",
        "$\\frac{40}{120}$.",
        [
          ["$\\frac{40}{2}$", "Same units."],
          ["$\\frac{2}{40}$", "Part over whole."],
        ],
      ),
      quiz([
        [
          [
            "20 minutes of an hour",
            "$\\frac13$",
            ["$\\frac15$", "$\\frac{20}{100}$"],
            "$\\frac{20}{60}$.",
          ],
          [
            "45 minutes of an hour",
            "$\\frac34$",
            ["$\\frac{45}{100}$", "$\\frac43$"],
            "$\\frac{45}{60}$.",
          ],
        ],
        [
          [
            "40 cm of 2 m",
            "$\\frac15$",
            ["$\\frac{40}{2}$", "$\\frac{1}{20}$"],
            "$\\frac{40}{200}$.",
          ],
          [
            "600 g of 2 kg",
            "$\\frac{3}{10}$",
            ["$\\frac{600}{2}$", "$\\frac{3}{100}$"],
            "$\\frac{600}{2000}$.",
          ],
        ],
        [
          [
            "12 of 16 people",
            "$\\frac34$",
            ["$\\frac{16}{12}$", "$\\frac{12}{100}$"],
            "Divide by 4.",
          ],
          [
            "35 of 50 people",
            "$\\frac{7}{10}$",
            ["$\\frac{50}{35}$", "$\\frac{35}{100}$"],
            "Divide by 5.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "notation",
    "GF-R4",
    "Ratio notation",
    "Write ratios with :, in the same units, in simplest form.",
    [
      problem("The recipe", [
        "A recipe uses 400 g of flour and 1.5 kg of potatoes. “Write the ratio flour : potatoes in its simplest form.”",
        "By the end of this lesson, you can simplify any ratio, even with different units or decimals.",
      ]),
      typed("Warm-up", "1.5 kg in grams", "1500", "Times 1000.", "1500 g."),
      typed("Warm-up", "HCF of 400 and 1500", "100", "Both divide by 100.", "100."),
      explain(
        "Discover",
        "Simplify like a fraction",
        [
          "Divide every part by the same number, until they share no common factor. Make the units the same first.",
          "Clear decimals by multiplying: 1.5 : 2 → 3 : 4.",
        ],
        { kind: "maths", tex: "400 : 1500 = 4 : 15" },
      ),
      choose("Discover", "Simplify 12 : 18", "2 : 3", "Divide by 6.", [
        ["4 : 6", "Not simplest: divide by 2 again."],
        ["3 : 2", "Keep the order."],
      ]),
      worked(
        "The recipe",
        "400 g flour : 1.5 kg potatoes, simplest form.",
        [
          ["400 : 1500", "Same units: grams."],
          ["4 : 15", "Divide by 100."],
        ],
        "4 and 15 share no factor: simplest form.",
      ),
      steps(
        "Together",
        "Simplify 2.5 : 1.5",
        "Decimals.",
        [
          ["Multiply by 10:", "25 : 15", ["2.5 : 1.5", "Clear the decimals."], "25 : 15"],
          ["Divide by 5:", "5 : 3", ["3 : 5", "Keep the order."], "5 : 3"],
        ],
        "Whole numbers, no common factor.",
      ),
      choose("Together", "Simplify 6 : 9 : 15", "2 : 3 : 5", "Divide all by 3.", [
        ["6 : 9 : 15", "They share 3."],
        ["2 : 3 : 15", "Divide every part."],
      ]),
      choose("Your turn", "Simplify 35 : 21", "5 : 3", "Divide by 7.", [
        ["3 : 5", "Keep the order."],
        ["7 : 4.2", "Use whole numbers."],
      ]),
      choose("Your turn", "50p : £3 in simplest form", "1 : 6", "50 : 300.", [
        ["50 : 3", "Same units."],
        ["1 : 60", "£3 is 300p."],
      ]),
      choose(
        "Watch out",
        "Ana simplifies 20 cm : 1 m as 20 : 1. What's wrong?",
        "Same units: 20 : 100 = 1 : 5",
        "1 m = 100 cm.",
        [["Nothing", "20 : 1 says the first is bigger."]],
      ),
      mistake(
        "Leo simplifies 24 : 36.",
        ["Divide by 2: 12 : 18", "Divide by 2: 6 : 9", "So 6 : 9"],
        2,
        "6 and 9 still share 3: simplest form 2 : 3.",
      ),
      choose(
        "Back to the problem",
        "“400 g flour : 1.5 kg potatoes, in simplest form.”",
        "4 : 15",
        "400 : 1500.",
        [
          ["400 : 1.5", "Same units."],
          ["8 : 3", "1.5 kg is 1500 g."],
        ],
      ),
      quiz([
        [
          ["Simplify 15 : 25", "3 : 5", ["5 : 3", "1 : 5"], "Divide by 5."],
          ["Simplify 16 : 40", "2 : 5", ["5 : 2", "4 : 10"], "Divide by 8."],
        ],
        [
          ["Simplify 1.2 : 0.8", "3 : 2", ["12 : 8", "2 : 3"], "×10, ÷4."],
          ["Simplify 0.6 : 1.5", "2 : 5", ["6 : 15", "5 : 2"], "×10, ÷3."],
        ],
        [
          ["30 min : 2 hours", "1 : 4", ["30 : 2", "15 : 1"], "30 : 120."],
          ["£1.20 : 80p", "3 : 2", ["120 : 8", "1.2 : 80"], "120 : 80."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "part-part",
    "GF-R5.a",
    "Sharing in a ratio",
    "Total parts, value of one part, then each share.",
    [
      problem(
        "The prize",
        [
          "Ali and Ben share £120 in the ratio 3 : 5. And in another question: “Ali gets £45 more than Ben…” How much does each get?",
          "By the end of this lesson, you can share any amount, and solve problems from a difference.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Ali", parts: 3, each: "?" },
            { label: "Ben", parts: 5, each: "?" },
          ],
          total: "£120",
        },
      ),
      typed("Warm-up", "Work out $120 \\div 8$", "15", "Eights in 120.", "15."),
      typed("Warm-up", "Work out $15 \\times 5$", "75", "Times.", "75."),
      explain(
        "Discover",
        "Value of one part",
        [
          "Add the parts to find the total number of parts. Divide the amount by it: that's **one part**. Then multiply for each share.",
          "Check: the shares add to the original amount.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Ali", parts: 3, each: "£15" },
            { label: "Ben", parts: 5, each: "£15" },
          ],
          total: "£120",
        },
      ),
      choose("Discover", "£120 in 3 : 5. One part is", "£15", "$120 \\div 8$.", [
        ["£40", "There are 8 parts, not 3."],
        ["£24", "8 parts, not 5."],
      ]),
      worked(
        "The prize",
        "Share £120 in 3 : 5.",
        [
          ["8 parts; one part = £15", "$120 \\div 8$."],
          ["Ali: $3 \\times 15 = £45$; Ben: $5 \\times 15 = £75$", "Multiply."],
        ],
        "Check: $45 + 75 = 120$ ✓",
      ),
      steps(
        "Together",
        "Red : blue = 2 : 7. There are 35 more blue than red",
        "How many red?",
        [
          ["The difference is", "5 parts", ["9 parts", "$7 - 2$."], "5 parts = 35"],
          ["One part is 7, so red is", "14", ["35", "$2 \\times 7$."], "14 red"],
        ],
        "Blue: 49. Check: $49 - 14 = 35$ ✓",
      ),
      choose("Together", "Share 60 in 1 : 2 : 3", "10, 20, 30", "6 parts of 10.", [
        ["20, 20, 20", "Unequal shares."],
        ["6, 12, 18", "60 ÷ 6 = 10."],
      ]),
      typed("Your turn", "Share £90 in 4 : 5. The larger share?", "50", "9 parts of £10.", "£50.", {
        wrong: [["18", "That's one part × 1.8."]],
      }),
      typed(
        "Your turn",
        "Boys : girls = 3 : 4. There are 12 girls. How many boys?",
        "9",
        "One part is 3.",
        "9 boys.",
        { wrong: [["16", "12 is the girls' 4 parts."]] },
      ),
      choose(
        "Watch out",
        "Sharing £40 in 3 : 5, Kim gives £3 and £5. What's wrong?",
        "Those are parts, not pounds: one part is £5, so £15 and £25",
        "Find one part first.",
        [["Nothing", "They must add to £40."]],
      ),
      mistake(
        "Raj shares 72 sweets in 5 : 3.",
        ["8 parts", "One part: $72 \\div 8 = 8$", "Shares: 40 and 24"],
        1,
        "$72 \\div 8 = 9$: shares 45 and 27.",
      ),
      choose(
        "Back to the problem",
        "“Share £120 in the ratio 3 : 5.”",
        "£45 and £75",
        "One part £15.",
        [
          ["£40 and £80", "8 parts, not 3."],
          ["£36 and £84", "Check: one part is £15."],
        ],
      ),
      quiz([
        [
          ["Share 50 in 2 : 3", "20 and 30", ["25 and 25", "10 and 40"], "Parts of 10."],
          ["Share 56 in 3 : 4", "24 and 32", ["28 and 28", "21 and 35"], "Parts of 8."],
        ],
        [
          ["Ratio 2 : 5, the 2 part is 14. The 5 part?", "35", ["17", "70"], "One part 7."],
          ["Ratio 3 : 8, the 8 part is 40. The 3 part?", "15", ["35", "24"], "One part 5."],
        ],
        [
          ["Ratio 1 : 4, difference 30. Smaller?", "10", ["30", "6"], "3 parts = 30."],
          ["Ratio 3 : 7, difference 20. Larger?", "35", ["15", "20"], "4 parts = 20."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "part-whole",
    "GF-R5.b",
    "Part and whole",
    "Use the fraction of the whole a part makes.",
    [
      problem(
        "The orange drink",
        [
          "Orange squash is $\\frac15$ of a drink. A jug holds 1.5 litres. How much squash? And if 300 ml is squash, what's the water : squash ratio?",
          "By the end of this lesson, you can move between parts and wholes.",
        ],
        { kind: "bars", rows: [{ label: "Drink", parts: 5, shaded: 1 }], total: "1.5 litres" },
      ),
      typed("Warm-up", "1.5 litres in ml", "1500", "Times 1000.", "1500 ml."),
      typed("Warm-up", "$\\frac15$ of 1500", "300", "Divide by 5.", "300."),
      explain(
        "Discover",
        "Part : whole",
        [
          "A **part : whole** ratio compares one part with the total. If squash is $\\frac15$ of the drink, squash : drink = 1 : 5.",
          "Then squash : water is 1 : 4, because the whole is 5 parts.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Squash", parts: 1 },
            { label: "Water", parts: 4 },
          ],
        },
      ),
      choose(
        "Discover",
        "Squash is $\\frac15$ of the drink. Squash : water",
        "1 : 4",
        "1 part squash, 4 water.",
        [["1 : 5", "That's squash to the whole drink."]],
      ),
      worked(
        "The drink",
        "Squash $\\frac15$ of 1.5 litres.",
        [
          ["$\\frac15$ of 1500 ml = 300 ml", "The squash."],
          ["Water: 1200 ml", "The rest."],
          ["Water : squash = 4 : 1", "1200 : 300."],
        ],
        "The whole is all five parts.",
      ),
      steps(
        "Together",
        "A class: girls : whole class = 2 : 5. There are 30 pupils",
        "How many boys?",
        [
          ["Girls:", "12", ["15", "$\\frac25$ of 30."], "12 girls"],
          ["Boys:", "18", ["12", "$30 - 12$."], "18 boys"],
        ],
        "Boys : girls = 3 : 2.",
      ),
      choose(
        "Together",
        "Concrete: cement is 1 part in 6. Cement : the rest",
        "1 : 5",
        "6 parts in all.",
        [["1 : 6", "That's cement to the whole."]],
      ),
      typed(
        "Your turn",
        "$\\frac38$ of a 400 g bag is nuts. Grams of nuts?",
        "150",
        "$400 \\div 8 \\times 3$.",
        "150 g.",
        { unit: "g" },
      ),
      choose(
        "Your turn",
        "Profit is $\\frac{2}{7}$ of sales. Profit : costs",
        "2 : 5",
        "7 parts: 2 profit, 5 costs.",
        [["2 : 7", "That's profit to sales."]],
      ),
      choose(
        "Watch out",
        "Squash : water = 1 : 4. Ivy says squash is $\\frac14$ of the drink. Right?",
        "No: 5 parts in all, so $\\frac15$",
        "Part : part isn't part : whole.",
        [["Yes", "Count both parts."]],
      ),
      mistake(
        "A drink is 1 part squash to 3 parts water; 2 litres total. Ola finds the squash.",
        ["Squash is $\\frac13$", "$\\frac13$ of 2 litres", "= 0.67 litres"],
        0,
        "4 parts in all: squash is $\\frac14$, so 0.5 litres.",
      ),
      choose(
        "Back to the problem",
        "“Squash is $\\frac15$ of 1.5 litres of drink. Write water : squash.”",
        "4 : 1",
        "1200 ml : 300 ml.",
        [
          ["5 : 1", "The whole isn't water."],
          ["1 : 4", "Water first."],
        ],
      ),
      quiz([
        [
          ["$\\frac14$ red, the rest blue. Red : blue", "1 : 3", ["1 : 4", "3 : 1"], "4 parts."],
          ["$\\frac35$ red, the rest blue. Red : blue", "3 : 2", ["3 : 5", "2 : 3"], "5 parts."],
        ],
        [
          ["$\\frac27$ of 63", "18", ["9", "31.5"], "$9 \\times 2$."],
          ["$\\frac58$ of 64", "40", ["8", "102.4"], "$8 \\times 5$."],
        ],
        [
          [
            "1 : 4 part : part. Fraction of the whole for the 1",
            "$\\frac15$",
            ["$\\frac14$", "$\\frac45$"],
            "5 parts.",
          ],
          [
            "2 : 3 part : part. Fraction of the whole for the 3",
            "$\\frac35$",
            ["$\\frac32$", "$\\frac23$"],
            "5 parts.",
          ],
        ],
      ]),
    ],
  ),
];
