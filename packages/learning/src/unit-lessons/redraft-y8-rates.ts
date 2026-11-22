// Year 8, "Ratio and proportion" and "Rates", on the stepped template
// (docs/proposals/lesson-stepped.md): ratios as fractions, finding one first, proportion graphs,
// speed, best buys and density. These are number work, with bar models, tables and graphs where
// they show the idea.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y8Rates } from "./y8-rates.ts";
import { y8Ratio } from "./y8-ratio.ts";

const NUMBER = "A number problem: the amounts are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const RA = y8Ratio;
const RT = y8Rates;

// ---------------------------------------------------------------------------------------------
// Ratios and fractions.

const FRACTIONS = "y8-ratio/fractions";
const fractionsMethod = [
  "Add the parts to find the whole.",
  "Each share is its parts over the whole.",
  "Part to part: one share over the other.",
];
const TWO_THREE: Picture = {
  kind: "bars",
  rows: [
    { label: "A", parts: 2, each: "" },
    { label: "B", parts: 3, each: "" },
  ],
};

const fractions = stepped(find(RA, FRACTIONS), {
  method: fractionsMethod,
  variation: {
    relationship: "a ratio and the fractions it makes",
    unknowns: ["fraction of the whole", "part to part", "multiplier"],
    surface: ["more water", "equal parts", "mixing paint"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Ratios and fractions",
        ["**In a : b there are a + b parts. A is a out of a + b.**"],
        TWO_THREE,
        "2 : 3 has 5 parts: A is $\\frac25$ of the whole.",
      ),
      reworded(RA, FRACTIONS, "Ratios are fractions in disguise", { tag: "The rule" }),

      ...owned(RA, FRACTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", fractionsMethod, TWO_THREE),
      workedFrom(RA, FRACTIONS),
      calc(
        "Your turn",
        "Tea : milk = 3 : 1.",
        undefined,
        [
          ["Parts in all:", "4", "3 + 1."],
          ["Tea is 3 out of", "4", "Its parts over the whole."],
        ],
        "Tea is $\\frac34$ of the drink.",
      ),

      calc(
        "Practise",
        "Red : white = 1 : 3. You have 5 litres of red.",
        undefined,
        [
          ["White = 3 × red =", "15", "Three times as much.", { after: "litres" }],
          ["Total paint:", "20", "5 + 15.", { after: "litres" }],
        ],
        "15 litres of white: 20 litres in all.",
      ),
      ...owned(RA, FRACTIONS, "Together", "Practise"),
      questionSet(
        "Practise",
        "A : B = 3 : 5. Watch what changes.",
        [
          ask("What fraction is A?", "$\\frac38$", "3 out of 8 parts.", "$\\frac38$.", {
            asks: "fraction of the whole",
            others: ["$\\frac35$", "$\\frac58$"],
          }),
          ask("What fraction is B?", "$\\frac58$", "5 out of 8 parts.", "$\\frac58$.", {
            asks: "fraction of the whole",
            changed: "Now B.",
            others: ["$\\frac53$", "$\\frac38$"],
          }),
          ask("A is what fraction of B?", "$\\frac35$", "Part over part.", "$\\frac35$.", {
            asks: "part to part",
            changed: "Part to part.",
            others: ["$\\frac38$", "$\\frac53$"],
          }),
          ask("B = ? × A", "$\\frac53$", "5 over 3.", "$\\frac53$.", {
            asks: "multiplier",
            changed: "As a multiplier.",
            others: ["$\\frac35$", "2"],
          }),
        ],
        "Whole: add the parts. Part to part: one over the other.",
      ),

      questionSet(
        "Variation",
        "Squash : water. What fraction is squash?",
        [
          ask("1 : 3", "$\\frac14$", "4 parts in all.", "$\\frac14$.", {
            asks: "fraction of the whole",
            others: ["$\\frac13$", "$\\frac34$"],
            expect: [
              "Ella says squash is $\\frac13$ of the drink. Right?",
              "No",
              "1 : 3 has 4 parts: squash is $\\frac14$.",
              [["Yes", "Count all the parts: 1 + 3."]],
            ],
          }),
          ask("1 : 5", "$\\frac16$", "6 parts in all.", "$\\frac16$.", {
            asks: "fraction of the whole",
            changed: "More water.",
            others: ["$\\frac15$", "$\\frac56$"],
          }),
          ask("2 : 3", "$\\frac25$", "5 parts in all.", "$\\frac25$.", {
            asks: "fraction of the whole",
            changed: "More squash.",
            others: ["$\\frac23$", "$\\frac35$"],
          }),
          ask("1 : 1", "$\\frac12$", "2 parts in all.", "$\\frac12$.", {
            asks: "fraction of the whole",
            changed: "Equal parts.",
            others: ["1", "$\\frac11$"],
          }),
        ],
        "Always add the parts first.",
      ),
      reworded(
        RA,
        FRACTIONS,
        "Where did it go wrong?",
        { text: "Red to white is 1 : 3. Ola doubles the red." },
        "Spot the mistake",
      ),

      own(RA, FRACTIONS, "Exit check"),

      reworded(
        RA,
        FRACTIONS,
        "Squash and water, 1 : 4",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In a : b there are a + b parts. A is a out of a + b.**"],
        TWO_THREE,
        [
          "**In a : b there are a + b parts. A is a out of a + b.**",
          "1 : 4 squash: squash is $\\frac15$, not $\\frac14$.",
          "Part to part: A is $\\frac23$ of B in 2 : 3.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Find one first.

const ONE = "y8-ratio/find-one";
const oneMethod = [
  "Divide to find the value for one.",
  "Multiply by how many you need.",
  "Check it makes sense: more items, more cost.",
];
const FLOUR: Picture = {
  kind: "table",
  head: ["People", "1", "4", "6"],
  rows: [["Flour", "75 g", "300 g", "450 g"]],
};

const findOne = stepped(find(RA, ONE), {
  method: oneMethod,
  variation: {
    relationship: "amounts in direct proportion",
    unknowns: ["one", "many", "number"],
    surface: ["doubling", "halving", "backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Find one first",
        ["**Find the value for one, then multiply.**"],
        FLOUR,
        "Proportion multiplies; it never adds.",
      ),
      reworded(RA, ONE, "Direct proportion", { tag: "The rule" }),

      ...owned(RA, ONE, "Warm-up", "Check you remember"),

      methodCard("The method", oneMethod, FLOUR),
      workedFrom(RA, ONE),
      calc(
        "Your turn",
        "6 eggs cost £1.80. How much for 10?",
        undefined,
        [
          ["1 egg:", "30", "$180 \\div 6$.", { after: "p" }],
          ["10 eggs:", "300", "$30 \\times 10$.", { after: "p" }],
        ],
        "£3.00.",
      ),

      calc(
        "Practise",
        "250 g of pasta feeds 2. How much for 5?",
        undefined,
        [
          ["1 person:", "125", "$250 \\div 2$.", { after: "g" }],
          ["5 people:", "625", "$125 \\times 5$.", { after: "g" }],
        ],
        "625 g.",
      ),
      reworded(RA, ONE, "Find one first", { tag: "Practise" }),
      reworded(RA, ONE, "Best buy", {
        tag: "Practise",
        start: "6 eggs for £1.50, or 10 for £2.30. Better value?",
      }),
      questionSet(
        "Practise",
        "4 cinema tickets cost £34. Watch what changes.",
        [
          ask("Cost of 1 ticket, in £?", "8.5", "$34 \\div 4$.", "£8.50.", { asks: "one" }),
          ask("Cost of 6 tickets, in £?", "51", "$8.50 \\times 6$.", "£51.", {
            asks: "many",
            changed: "Now 6.",
          }),
          ask("Cost of 10 tickets, in £?", "85", "$8.50 \\times 10$.", "£85.", {
            asks: "many",
            changed: "Now 10.",
          }),
          ask("How many tickets for £68?", "8", "$68 \\div 8.50$.", "8 tickets.", {
            asks: "number",
            changed: "Backwards.",
          }),
        ],
        "One first, then any number.",
      ),

      questionSet(
        "Variation",
        "200 g of flour feeds 4. Watch what changes.",
        [
          ask("Flour for 6, in g?", "300", "50 g each.", "300 g.", {
            asks: "many",
            expect: [
              "Max adds 2 g for 2 more people: 202 g. Right?",
              "No",
              "Find one first: 50 g each, so 300 g.",
              [["Yes", "Proportion multiplies; it doesn't add."]],
            ],
          }),
          ask("Flour for 8, in g?", "400", "Double the people.", "400 g.", {
            asks: "many",
            changed: "Double the people.",
          }),
          ask("Flour for 2, in g?", "100", "Half the people.", "100 g.", {
            asks: "many",
            changed: "Half the people.",
          }),
          ask("Flour for 1, in g?", "50", "200 ÷ 4.", "50 g.", {
            asks: "one",
            changed: "Just one.",
          }),
        ],
        "Double the people, double the flour.",
      ),
      reworded(
        RA,
        ONE,
        "Where did it go wrong?",
        { text: "3 kg of apples cost £4.20. Pia finds 5 kg." },
        "Spot the mistake",
      ),

      own(RA, ONE, "Exit check"),

      reworded(RA, ONE, "Pancakes for 6", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Find the value for one, then multiply.**"],
        FLOUR,
        [
          "**Find the value for one, then multiply.**",
          "300 g for 4: 75 g each, so 450 g for 6.",
          "Proportion multiplies; it never adds.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Proportion graphs.

const GRAPH = "y8-ratio/graph";
const graphMethod = [
  "Write $y = kx$.",
  "Put in one pair of values to find k.",
  "Use k to find any other value.",
];
const line = (m: number, c: number): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 },
  lines: [{ m, c }],
});

const proportionGraph = stepped(find(RA, GRAPH), {
  method: graphMethod,
  variation: {
    relationship: "y = kx: direct proportion as a line through (0, 0)",
    unknowns: ["k", "y", "x", "proportional?"],
    surface: ["steep and flat lines", "a start-up charge", "sloping down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Proportion graphs",
        ["**Direct proportion is y = kx: a straight line through (0, 0).**"],
        line(2, 0),
        "k is the rate: here, £2 a kilogram.",
      ),
      reworded(RA, GRAPH, "Plot the cost of apples", { tag: "The rule" }),
      reworded(RA, GRAPH, "y = kx", { tag: "The rule" }),

      ...owned(RA, GRAPH, "Warm-up", "Check you remember"),

      methodCard("The method", graphMethod, line(2, 0)),
      workedFrom(RA, GRAPH),
      calc(
        "Your turn",
        "$y = kx$, $y = 12$ at $x = 3$. Find y at $x = 5$.",
        undefined,
        [
          ["$12 = k \\times 3$, so $k =$", "4", "Divide by 3."],
          ["$y = 4 \\times 5 =$", "20", "Use k."],
        ],
        "$y = 20$.",
      ),

      calc(
        "Practise",
        "$y = kx$, $y = 21$ at $x = 7$. Find y at $x = 4$.",
        undefined,
        [
          ["$k =$", "3", "$21 \\div 7$."],
          ["$y = 3 \\times 4 =$", "12", "Use k."],
        ],
        "$y = 12$.",
      ),
      ...owned(RA, GRAPH, "Together", "Practise"),
      questionSet(
        "Practise",
        "$y = kx$, and $y = 18$ when $x = 6$.",
        [
          ask("Find k.", "3", "$18 \\div 6$.", "3.", { asks: "k" }),
          ask("Find y when $x = 10$.", "30", "$3 \\times 10$.", "30.", {
            asks: "y",
            changed: "Now use k.",
          }),
          ask("Find x when $y = 27$.", "9", "$27 \\div 3$.", "9.", {
            asks: "x",
            changed: "Backwards.",
          }),
          ask(
            "Is $y = 3x + 1$ direct proportion?",
            "No",
            "Not through (0, 0).",
            "No: + 1 lifts it off (0, 0).",
            {
              asks: "proportional?",
              changed: "A new rule.",
              others: ["Yes"],
            },
          ),
        ],
        "Find k once, then use it.",
      ),

      questionSet(
        "Variation",
        "Is it direct proportion? Watch what changes.",
        [
          ask("Is this direct proportion?", "No", "Look at (0, 0).", "No: it starts at 3.", {
            asks: "proportional?",
            others: ["Yes"],
            picture: line(2, 3),
            expect: [
              "A taxi costs £3, then £2 a mile. Proportional?",
              "No",
              "At 0 miles it still costs £3: not through (0, 0).",
              [["Yes", "Check the start: 0 miles isn't £0."]],
            ],
          }),
          ask("Is this direct proportion?", "Yes", "Straight, through (0, 0).", "Yes: $y = 2x$.", {
            asks: "proportional?",
            changed: "Through (0, 0).",
            others: ["No"],
            picture: line(2, 0),
          }),
          ask(
            "Is this direct proportion?",
            "Yes",
            "Straight, through (0, 0).",
            "Yes: $y = 0.5x$.",
            {
              asks: "proportional?",
              changed: "Flatter.",
              others: ["No"],
              picture: line(0.5, 0),
            },
          ),
          ask(
            "Is this direct proportion?",
            "No",
            "It goes down.",
            "No: one grows as the other shrinks.",
            {
              asks: "proportional?",
              changed: "Sloping down.",
              others: ["Yes"],
              picture: line(-1, 5),
            },
          ),
        ],
        "Straight and through (0, 0): nothing else will do.",
      ),
      reworded(
        RA,
        GRAPH,
        "Where did it go wrong?",
        { text: "$y = kx$, $y = 12$ at $x = 3$. Rio finds y at $x = 5$." },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "$y = kx$, $y = 12$ at $x = 4$. Find y at $x = 10$.",
            "30",
            ["18", "120"],
            "$k = 3$, so $y = 30$.",
          ],
          [
            "$y = kx$, $y = 10$ at $x = 2$. Find y at $x = 7$.",
            "35",
            ["15", "70"],
            "$k = 5$, so $y = 35$.",
          ],
        ],
        [
          [
            "Which is direct proportion?",
            "$y = 7x$",
            ["$y = 7x + 1$", "$y = x^2$"],
            "Straight, through (0, 0).",
          ],
          [
            "Which of these is direct proportion?",
            "$y = 0.5x$",
            ["$y = x - 2$", "$y = 10 - x$"],
            "Straight, through (0, 0).",
          ],
        ],
        [
          [
            "A direct proportion graph must",
            "be straight and go through (0, 0)",
            ["just be straight", "go through (0, 1)"],
            "It's $y = kx$.",
          ],
          [
            "At $x = 0$, a direct proportion graph has",
            "$y = 0$",
            ["$y = 1$", "$y = k$"],
            "$y = k \\times 0 = 0$.",
          ],
        ],
      ]),

      reworded(
        RA,
        GRAPH,
        "Plan A: 5p a minute. Plan B: £1 plus 3p a minute",
        { tag: "Real life", text: "Which is in direct proportion?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Direct proportion is y = kx: a straight line through (0, 0).**"],
        line(2, 0),
        [
          "**Direct proportion is y = kx: a straight line through (0, 0).**",
          "Find k from one pair: $10 = 4k$, $k = 2.5$.",
          "A start-up charge means it isn't proportional.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Speed.

const SPEED = "y8-rates/speed";
const speedMethod = [
  "Write the time in hours.",
  "Speed = distance ÷ time.",
  "Distance = speed × time. Time = distance ÷ speed.",
];
const SDT = maths("\\text{speed} = \\text{distance} \\div \\text{time}");

const speed = stepped(find(RT, SPEED), {
  method: speedMethod,
  variation: {
    relationship: "speed = distance ÷ time",
    unknowns: ["speed", "distance", "time"],
    surface: ["minutes", "half hours", "quarter hours"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Speed",
        ["**Speed = distance ÷ time.**"],
        SDT,
        "80 km/h: 80 km in each hour.",
      ),
      reworded(RT, SPEED, "A rate is a 'per'", { tag: "The rule" }),
      reworded(RT, SPEED, "You travel at 50 km/h for 2 hours. How far?", { tag: "The rule" }),

      ...owned(RT, SPEED, "Warm-up", "Check you remember"),

      methodCard("The method", speedMethod, SDT),
      workedFrom(RT, SPEED),
      calc(
        "Your turn",
        "A bus goes 90 km in 1 hour 30 minutes. Speed?",
        undefined,
        [
          ["Time in hours:", "1.5", "30 minutes is half an hour."],
          ["$90 \\div 1.5 =$", "60", "Distance ÷ time.", { after: "km/h" }],
        ],
        "60 km/h.",
      ),

      calc(
        "Practise",
        "At 50 km/h, how long for 125 km?",
        undefined,
        [
          ["$125 \\div 50 =$", "2.5", "Distance ÷ speed.", { after: "hours" }],
          ["That's 2 hours and", "30", "0.5 of an hour.", { after: "minutes" }],
        ],
        "2 hours 30 minutes.",
      ),
      reworded(RT, SPEED, "Minutes to hours", {
        tag: "Practise",
        start: "30 km in 20 minutes. Speed in km/h?",
      }),
      reworded(RT, SPEED, "How long?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "A car. Watch what changes.",
        [
          ask("120 km in 2 hours. Speed?", "60", "120 ÷ 2.", "60 km/h.", {
            unit: "km/h",
            asks: "speed",
          }),
          ask("60 km/h for 3 hours. Distance?", "180", "60 × 3.", "180 km.", {
            unit: "km",
            asks: "distance",
            changed: "Now distance.",
          }),
          ask("60 km/h for 90 km. Time?", "1.5", "90 ÷ 60.", "1.5 hours.", {
            unit: "hours",
            asks: "time",
            changed: "Now time.",
          }),
          ask("60 km/h for 30 minutes. Distance?", "30", "Half an hour.", "30 km.", {
            unit: "km",
            asks: "distance",
            changed: "Minutes.",
          }),
        ],
        "One rule, rearranged.",
      ),

      questionSet(
        "Variation",
        "150 km. Find the speed. Watch what changes.",
        [
          ask("In 1 hour 30 minutes?", "100", "150 ÷ 1.5.", "100 km/h.", {
            unit: "km/h",
            asks: "speed",
            expect: [
              "For 1 hour 30 minutes, Ken divides by 1.3. Right?",
              "No",
              "30 minutes is 0.5 hours: divide by 1.5.",
              [["Yes", "1 hour 30 minutes is 1.5 hours."]],
            ],
          }),
          ask("In 3 hours?", "50", "150 ÷ 3.", "50 km/h.", {
            unit: "km/h",
            asks: "speed",
            changed: "Twice the time.",
          }),
          ask("In 30 minutes?", "300", "150 ÷ 0.5.", "300 km/h.", {
            unit: "km/h",
            asks: "speed",
            changed: "Half an hour.",
          }),
          ask("In 15 minutes?", "600", "150 ÷ 0.25.", "600 km/h.", {
            unit: "km/h",
            asks: "speed",
            changed: "A quarter of an hour.",
          }),
        ],
        "Less time for the same distance means faster.",
      ),
      own(RT, SPEED, "Spot the mistake"),

      own(RT, SPEED, "Exit check"),

      reworded(
        RT,
        SPEED,
        "Train: 240 km in 3 h. Car: 30 km in 20 min.",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Speed = distance ÷ time.**"],
        SDT,
        [
          "**Speed = distance ÷ time.**",
          "Distance = speed × time; time = distance ÷ speed.",
          "Minutes to hours: 30 minutes is 0.5 hours.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Best buy.

const BEST = "y8-rates/best-buy";
const bestMethod = [
  "Find each unit price: cost ÷ amount.",
  "Use the same units: pence, grams.",
  "The lower unit price is better value.",
];
const UNIT = maths("\\text{unit price} = \\text{cost} \\div \\text{amount}");

const bestBuy = stepped(find(RT, BEST), {
  method: bestMethod,
  variation: {
    relationship: "the unit price decides the better value",
    unknowns: ["unit price", "better value"],
    surface: ["big packs", "equal value", "different units"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Best buy",
        ["**The lower the unit price, the better the value.**"],
        UNIT,
        "Unit price: the cost of one item, one gram, one litre.",
      ),
      reworded(RT, BEST, "Unit price", { tag: "The rule" }),

      ...owned(RT, BEST, "Warm-up", "Check you remember"),

      methodCard("The method", bestMethod, UNIT),
      workedFrom(RT, BEST),
      calc(
        "Your turn",
        "5 rolls for £1.50, or 8 for £2.24?",
        undefined,
        [
          ["5 rolls: one costs", "30", "$150 \\div 5$.", { after: "p" }],
          ["8 rolls: one costs", "28", "$224 \\div 8$.", { after: "p" }],
        ],
        "8 for £2.24 is better value.",
      ),

      calc(
        "Practise",
        "2 litres for £1.80, or 3 litres for £2.55?",
        undefined,
        [
          ["2 litres: per litre", "90", "$180 \\div 2$.", { after: "p" }],
          ["3 litres: per litre", "85", "$255 \\div 3$.", { after: "p" }],
        ],
        "3 litres for £2.55 is better value.",
      ),
      reworded(RT, BEST, "Another way: grams per penny", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Batteries. Watch what changes.",
        [
          ask("6 cost £3.00. One, in pence?", "50", "300 ÷ 6.", "50p.", { asks: "unit price" }),
          ask("10 cost £4.50. One, in pence?", "45", "450 ÷ 10.", "45p.", {
            asks: "unit price",
            changed: "A bigger pack.",
          }),
          ask(
            "Better value: 6 for £3.00, or 10 for £4.80?",
            "10 for £4.80",
            "50p against 48p.",
            "10 for £4.80.",
            {
              asks: "better value",
              changed: "Compare two.",
              others: ["6 for £3.00"],
            },
          ),
          ask(
            "Better value: 6 for £3.00, or 12 for £6.60?",
            "6 for £3.00",
            "50p against 55p.",
            "6 for £3.00.",
            {
              asks: "better value",
              changed: "The big pack isn't always better.",
              others: ["12 for £6.60"],
            },
          ),
        ],
        "Compare the price of one.",
      ),

      questionSet(
        "Variation",
        "Which is better value? Watch what changes.",
        [
          ask("3 for £1.50, or 5 for £2.40?", "5 for £2.40", "50p against 48p.", "5 for £2.40.", {
            asks: "better value",
            others: ["3 for £1.50"],
            expect: [
              "Tom picks 3 for £1.50, as it costs less. Right?",
              "No",
              "50p each against 48p each: 5 for £2.40.",
              [["Yes", "Compare the price of one."]],
            ],
          }),
          ask("3 for £1.50, or 5 for £2.60?", "3 for £1.50", "50p against 52p.", "3 for £1.50.", {
            asks: "better value",
            changed: "The big pack costs more.",
            others: ["5 for £2.60"],
          }),
          ask(
            "3 for £1.50, or 6 for £3.00?",
            "The same",
            "50p each both ways.",
            "The same: 50p each.",
            {
              asks: "better value",
              changed: "Twice as many, twice the price.",
              others: ["3 for £1.50", "6 for £3.00"],
            },
          ),
          ask(
            "300 g for £1.50, or 1 kg for £4.80?",
            "1 kg for £4.80",
            "0.5p against 0.48p a gram.",
            "1 kg for £4.80.",
            {
              asks: "better value",
              changed: "Different units.",
              others: ["300 g for £1.50"],
            },
          ),
        ],
        "The price of one decides, never the price of the pack.",
      ),
      own(RT, BEST, "Spot the mistake"),

      own(RT, BEST, "Exit check"),

      reworded(
        RT,
        BEST,
        "500 g for £2.40, or 750 g for £3.45?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The lower the unit price, the better the value.**"],
        UNIT,
        [
          "**The lower the unit price, the better the value.**",
          "Unit price = cost ÷ amount.",
          "Same units first: pence and grams.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Density.

const DENSITY = "y8-rates/density";
const densityMethod = [
  "Density = mass ÷ volume.",
  "Mass = density × volume.",
  "Volume = mass ÷ density. Check the units.",
];
const DMV = maths("\\text{density} = \\text{mass} \\div \\text{volume}");

const density = stepped(find(RT, DENSITY), {
  method: densityMethod,
  variation: {
    relationship: "density = mass ÷ volume",
    unknowns: ["density", "mass", "volume"],
    surface: ["bigger blocks", "less dense than water", "floating"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Density",
        ["**Density = mass ÷ volume.**"],
        DMV,
        "Water is 1 g/cm³: each cm³ weighs 1 g.",
      ),
      reworded(RT, DENSITY, "Wood floats on water. Its density is", { tag: "The rule" }),

      ...owned(RT, DENSITY, "Warm-up", "Check you remember"),

      methodCard("The method", densityMethod, DMV),
      workedFrom(RT, DENSITY),
      calc(
        "Your turn",
        "Find the density. Its mass is 90 g.",
        { kind: "cuboid", w: 5, d: 2, h: 3, labels: ["5 cm", "2 cm", "3 cm"] },
        [
          ["Volume:", "30", "5 × 2 × 3.", { after: "cm³" }],
          ["Density: $90 \\div 30 =$", "3", "Mass ÷ volume.", { after: "g/cm³" }],
        ],
        "3 g/cm³.",
      ),

      calc(
        "Practise",
        "Density 2.5 g/cm³, volume 40 cm³. Mass?",
        undefined,
        [["$2.5 \\times 40 =$", "100", "Density × volume.", { after: "g" }]],
        "100 g.",
      ),
      reworded(RT, DENSITY, "Find the mass", {
        tag: "Practise",
        start: "Aluminium: 2.7 g/cm³. Find the mass of 20 cm³.",
      }),
      reworded(RT, DENSITY, "Find the volume", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Mass 60 g, volume 15 cm³. Density?", "4", "60 ÷ 15.", "4 g/cm³.", {
            unit: "g/cm³",
            asks: "density",
          }),
          ask("Density 4 g/cm³, volume 15 cm³. Mass?", "60", "4 × 15.", "60 g.", {
            unit: "g",
            asks: "mass",
            changed: "Now the mass.",
          }),
          ask("Density 4 g/cm³, mass 60 g. Volume?", "15", "60 ÷ 4.", "15 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Now the volume.",
          }),
          ask("Density 4 g/cm³, volume 30 cm³. Mass?", "120", "4 × 30.", "120 g.", {
            unit: "g",
            asks: "mass",
            changed: "Double the volume.",
          }),
        ],
        "One rule, three ways round.",
      ),

      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          ask("Density 8 g/cm³, volume 10 cm³. Mass?", "80", "8 × 10.", "80 g.", {
            unit: "g",
            asks: "mass",
            expect: [
              "8 g/cm³ and 10 cm³: Ava divides to get 0.8 g. Right?",
              "No",
              "Mass = density × volume: 80 g.",
              [["Yes", "Each cm³ is 8 g, and there are 10."]],
            ],
          }),
          ask("Density 8 g/cm³, mass 80 g. Volume?", "10", "80 ÷ 8.", "10 cm³.", {
            unit: "cm³",
            asks: "volume",
            changed: "Now the volume.",
          }),
          ask("Density 0.8 g/cm³, volume 10 cm³. Mass?", "8", "0.8 × 10.", "8 g.", {
            unit: "g",
            asks: "mass",
            changed: "Less dense than water.",
          }),
          ask(
            "Does a 0.8 g/cm³ block float on water?",
            "Yes",
            "Water is 1 g/cm³.",
            "Yes: it's less dense.",
            {
              asks: "density",
              changed: "Compare with water.",
              others: ["No"],
            },
          ),
        ],
        "Mass: multiply. Density and volume: divide.",
      ),
      reworded(
        RT,
        DENSITY,
        "Where did it go wrong?",
        { text: "Sid finds the density: 300 g, 100 cm³." },
        "Spot the mistake",
      ),

      own(RT, DENSITY, "Exit check"),

      reworded(RT, DENSITY, "The ring: 38 g, 2 cm³", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Density = mass ÷ volume.**"],
        DMV,
        [
          "**Density = mass ÷ volume.**",
          "Mass = density × volume.",
          "Less than 1 g/cm³ floats on water.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y8RatesStepped: [string, UnitLesson[]][] = [
  [FRACTIONS, [fractions]],
  [ONE, [findOne]],
  [GRAPH, [proportionGraph]],
  [SPEED, [speed]],
  [BEST, [bestBuy]],
  [DENSITY, [density]],
];
