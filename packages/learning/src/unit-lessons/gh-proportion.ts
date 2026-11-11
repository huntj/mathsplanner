// GCSE Higher, "Proportion and rates of change", as four short lessons, one just before each
// skill: equations for direct and inverse proportion (with powers and roots), recognising their
// graphs, converting units in algebra, and rates of change from chords and tangents. Each recaps
// the Foundation idea quickly, builds it to Higher level, names the common mistakes and ends on
// an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-proportion";

const directSquare: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 4, yMin: -1, yMax: 10 },
  curves: [{ kind: "quadratic", a: 1, b: 0, c: 0 }],
};
const inverse: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
  curves: [{ kind: "inverse", k: 4 }],
};
const straight: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 5, yMin: -1, yMax: 8 },
  lines: [{ m: 1.5, c: 0 }],
};
const chordTangent: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 5, yMin: -1, yMax: 10 },
  curves: [{ kind: "quadratic", a: 0.5, b: 0, c: 0 }],
  lines: [
    { m: 2, c: -2 },
    { m: 2, c: 0 },
  ],
  points: [
    { x: 0, y: 0 },
    { x: 4, y: 8 },
    { x: 2, y: 2 },
  ],
};

export const ghProportion: UnitLesson[] = [
  lesson(
    U,
    "equations",
    "GH-R13",
    "Proportion equations",
    "y ∝ x² means y = kx²; y ∝ 1/√x means y = k/√x. Find k, then use it.",
    [
      problem(
        "Stopping distance",
        [
          "A car's braking distance $d$ is directly proportional to the square of its speed $v$. At 20 mph, $d = 6$ m. “Find $d$ at 50 mph.”",
          "By the end of this lesson, you can write and use proportion equations.",
        ],
        directSquare,
      ),
      typed("Warm-up", "$y = kx$, $y = 12$ when $x = 3$. $k$", "4", "$12 \\div 3$.", "4."),
      typed("Warm-up", "$20^2$", "400", "Square.", "400."),
      explain(
        "Discover",
        "Write it with k",
        [
          "“$y$ is proportional to $x^2$” is written $y \\propto x^2$, so $y = kx^2$. “Inversely proportional to $\\sqrt x$”: $y = \\frac{k}{\\sqrt x}$.",
          "Substitute the pair you're given to find $k$. Write the full equation, then use it.",
        ],
        directSquare,
      ),
      choose(
        "Discover",
        "$y$ is inversely proportional to $x^2$",
        "$y = \\frac{k}{x^2}$",
        "Inverse: divide.",
        [
          ["$y = kx^2$", "That's direct."],
          ["$y = \\frac{x^2}{k}$", "$k$ goes on top."],
        ],
      ),
      worked(
        "The car",
        "$d = kv^2$, $d = 6$ when $v = 20$.",
        [
          ["$6 = k \\times 400$, so $k = 0.015$", "Find $k$."],
          ["$d = 0.015v^2$", "Equation."],
          ["At 50: $0.015 \\times 2500 = 37.5$ m", "Use it."],
        ],
        "2.5 times the speed: 6.25 times the distance.",
      ),
      steps(
        "Together",
        "$y \\propto \\frac{1}{\\sqrt x}$; $y = 6$ when $x = 4$. Find $y$ when $x = 9$.",
        "Find $k$ first.",
        [
          ["$6 = \\frac{k}{\\sqrt4}$, so $k =$", "12", ["3", "$6 \\times 2$."], "12"],
          ["$y = \\frac{12}{\\sqrt9} =$", "4", ["$\\frac43$", "$\\sqrt9 = 3$."], "4"],
        ],
        "$y = \\frac{12}{\\sqrt x}$.",
      ),
      choose("Together", "$y \\propto x^3$. If $x$ doubles, $y$", "is multiplied by 8", "$2^3$.", [
        ["doubles", "Cubed."],
        ["is multiplied by 6", "$2^3$, not $2 \\times 3$."],
      ]),
      typed("Your turn", "$y = kx^2$; $y = 50$ when $x = 5$. $k$", "2", "$50 \\div 25$.", "2."),
      typed("Your turn", "So $y$ when $x = 3$", "18", "$2 \\times 9$.", "18."),
      choose(
        "Watch out",
        "Ivy writes “$y$ inversely proportional to $x$” as $y = kx$. What's wrong?",
        "Inverse means $y = \\frac{k}{x}$",
        "Divide.",
        [["Nothing", "As $x$ grows, $y$ must shrink."]],
      ),
      mistake(
        "Ben solves: $y \\propto x^2$, $y = 20$ when $x = 2$. Find $y$ when $x = 6$.",
        ["$20 = k \\times 2$, $k = 10$", "$y = 10x^2$", "$y = 360$"],
        0,
        "Square the 2: $20 = 4k$, $k = 5$, so $y = 180$.",
      ),
      typed(
        "Back to the problem",
        "“Find $d$ at 50 mph.”",
        "37.5",
        "$0.015 \\times 2500$.",
        "37.5 m.",
        { unit: "m", wrong: [["15", "That's direct to $v$, not $v^2$."]] },
      ),
      quiz([
        [
          ["$y \\propto x$, $y = 15$ at $x = 5$. $y$ at $x = 8$", "24", ["18", "40"], "$k = 3$."],
          ["$y \\propto x$, $y = 14$ at $x = 2$. $y$ at $x = 5$", "35", ["17", "70"], "$k = 7$."],
        ],
        [
          [
            "$y \\propto \\frac1x$, $y = 6$ at $x = 2$. $y$ at $x = 4$",
            "3",
            ["12", "8"],
            "$k = 12$.",
          ],
          [
            "$y \\propto \\frac1x$, $y = 10$ at $x = 3$. $y$ at $x = 6$",
            "5",
            ["20", "13"],
            "$k = 30$.",
          ],
        ],
        [
          ["$y \\propto x^2$: $x$ triples, $y$ ×", "9", ["3", "6"], "$3^2$."],
          [
            "$y \\propto \\frac{1}{x^2}$: $x$ doubles, $y$ ×",
            "$\\frac14$",
            ["$\\frac12$", "4"],
            "$\\frac{1}{2^2}$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "graphs",
    "GH-R14",
    "Graphs of proportion",
    "Direct: through the origin. Inverse: a curve that never meets the axes.",
    [
      problem(
        "Which relationship?",
        [
          "“Match each graph to $y \\propto x$, $y \\propto x^2$ or $y \\propto \\frac1x$.” Exam questions often show a sketch and ask for the relationship.",
          "By the end of this lesson, you can tell them apart.",
        ],
        inverse,
      ),
      choose("Warm-up", "$y = 1.5x$ is", "a straight line through the origin", "Direct.", [
        ["a curve", "Power 1."],
        ["horizontal", "Gradient 1.5."],
      ]),
      typed("Warm-up", "$y = \\frac4x$ when $x = 2$", "2", "$4 \\div 2$.", "2."),
      explain(
        "Discover",
        "Three shapes",
        [
          "For $y \\propto x$, a **straight line** through (0, 0). For $y \\propto x^2$, **half a ∪** through (0, 0), getting steeper.",
          "For $y \\propto \\frac1x$, a **falling curve** that never touches either axis. As one doubles, the other halves.",
        ],
        straight,
      ),
      choose(
        "Discover",
        "Which graph is this?",
        "$y \\propto \\frac1x$",
        "Never meets the axes.",
        [
          ["$y \\propto x$", "That's straight."],
          ["$y \\propto x^2$", "That passes the origin."],
        ],
        { picture: inverse },
      ),
      worked(
        "Check a table",
        "$x$: 1, 2, 4; $y$: 8, 4, 2.",
        [
          ["$xy$: 8, 8, 8", "Constant product."],
          ["So $y = \\frac{8}{x}$: inverse", "Product constant."],
        ],
        "For direct, $\\frac{y}{x}$ is constant instead.",
      ),
      steps(
        "Together",
        "$x$: 1, 2, 3; $y$: 3, 12, 27",
        "Which?",
        [
          ["$\\frac{y}{x}$: 3, 6, 9", "not constant", ["constant", "It grows."], "Not linear"],
          [
            "$\\frac{y}{x^2}$: 3, 3, 3, so",
            "$y = 3x^2$",
            ["$y = 3x$", "Check $x = 2$."],
            "$y \\propto x^2$",
          ],
        ],
        "Test each ratio.",
        directSquare,
      ),
      choose(
        "Together",
        "Which graph is this?",
        "$y \\propto x$",
        "Straight, through the origin.",
        [
          ["$y \\propto x^2$", "That curves."],
          ["$y \\propto \\frac1x$", "That falls."],
        ],
        { picture: straight },
      ),
      choose(
        "Your turn",
        "A straight line not through the origin shows",
        "not direct proportion",
        "Must pass (0, 0).",
        [
          ["direct proportion", "$y = 0$ when $x = 0$ is needed."],
          ["inverse proportion", "That curves."],
        ],
      ),
      choose(
        "Your turn",
        "$x$: 2, 4, 8; $y$: 10, 5, 2.5. The relationship",
        "$y \\propto \\frac1x$",
        "$xy = 20$.",
        [
          ["$y \\propto x$", "$y$ falls."],
          ["$y \\propto x^2$", "$y$ falls."],
        ],
      ),
      choose(
        "Watch out",
        "Kim says any straight line shows direct proportion. What's wrong?",
        "It must pass through the origin",
        "$y = 0$ at $x = 0$.",
        [["Nothing", "$y = 2x + 3$ isn't proportional."]],
      ),
      mistake(
        "Leo looks at $y = \\frac{6}{x}$.",
        [
          "As $x$ increases, $y$ decreases",
          "So it's a straight line sloping down",
          "Gradient negative",
        ],
        1,
        "It's a curve: the product is constant, not the change.",
      ),
      choose(
        "Back to the problem",
        "“Which relationship does the falling curve show?”",
        "$y \\propto \\frac1x$",
        "Never meets the axes.",
        [
          ["$y \\propto x$", "Straight."],
          ["$y \\propto -x$", "That's a line."],
        ],
        { picture: inverse },
      ),
      quiz([
        [
          ["Direct proportion graph passes through", "(0, 0)", ["(0, 1)", "(1, 0)"], "Origin."],
          [
            "$y \\propto x^2$ graph is",
            "a curve through (0, 0)",
            ["a straight line", "never touching the axes"],
            "Half ∪.",
          ],
        ],
        [
          [
            "Constant product $xy$ means",
            "inverse proportion",
            ["direct proportion", "no relationship"],
            "$y = \\frac kx$.",
          ],
          [
            "Constant ratio $\\frac yx$ means",
            "direct proportion",
            ["inverse proportion", "a square"],
            "$y = kx$.",
          ],
        ],
        [
          ["$x$ doubles, $y$ halves", "inverse", ["direct", "square"], "Product constant."],
          ["$x$ doubles, $y$ doubles", "direct", ["inverse", "square"], "Ratio constant."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "units",
    "GH-R1",
    "Changing units in algebra",
    "Square the conversion for area, cube it for volume.",
    [
      problem("Square metres to square centimetres", [
        "“A rectangle measures $x$ m by $2x$ m. Write its area in cm².” And “Convert $5$ m³ to cm³.”",
        "By the end of this lesson, you can convert units for lengths, areas and volumes, with letters too.",
      ]),
      typed("Warm-up", "1 m in cm", "100", "Centi.", "100 cm."),
      typed("Warm-up", "$100^2$", "10000", "Square.", "10 000."),
      explain("Discover", "Each dimension converts", [
        "1 m = 100 cm, so 1 m² = 100 × 100 = 10 000 cm², and 1 m³ = 100³ = 1 000 000 cm³.",
        "With letters: convert each length first, then multiply. Or convert the area at the end using the squared factor.",
      ]),
      choose("Discover", "1 cm² in mm²", "100", "10 × 10.", [
        ["10", "Square it."],
        ["1000", "That's cm³ to mm³."],
      ]),
      worked(
        "The rectangle",
        "$x$ m by $2x$ m, in cm².",
        [
          ["Lengths: $100x$ cm and $200x$ cm", "Convert first."],
          ["Area: $20\\,000x^2$ cm²", "Multiply."],
        ],
        "Check: $2x^2$ m² × 10 000 = $20\\,000x^2$ cm².",
      ),
      steps(
        "Together",
        "Convert 5 m³ to cm³",
        "Cube the factor.",
        [
          ["1 m³ =", "1 000 000 cm³", ["100 cm³", "Cube 100."], "$10^6$"],
          ["5 m³ =", "5 000 000 cm³", ["500 cm³", "× $10^6$."], "$5 \\times 10^6$ cm³"],
        ],
        "Volumes convert by the cube.",
      ),
      choose("Together", "A speed of $v$ m/s in km/h", "$3.6v$", "× 3600 ÷ 1000.", [
        ["$\\frac{v}{3.6}$", "That's km/h to m/s."],
        ["$60v$", "Seconds to hours is × 3600."],
      ]),
      typed("Your turn", "3 m² in cm²", "30000", "× 10 000.", "30 000 cm².", {
        unit: "cm²",
        wrong: [["300", "Square the 100."]],
      }),
      typed("Your turn", "2000 cm³ in litres", "2", "1000 cm³ = 1 litre.", "2 litres.", {
        unit: "litres",
      }),
      choose(
        "Watch out",
        "Ola converts 4 m² to 400 cm². What's wrong?",
        "Area uses 100²: 40 000 cm²",
        "Square.",
        [["Nothing", "Each side converts."]],
      ),
      mistake(
        "Ben converts a cube of side $a$ cm to mm³.",
        ["Side: $10a$ mm", "Volume: $10a^3$ mm³", "Done"],
        1,
        "Cube the whole side: $(10a)^3 = 1000a^3$ mm³.",
      ),
      choose(
        "Back to the problem",
        "“Write the area of $x$ m by $2x$ m in cm².”",
        "$20\\,000x^2$ cm²",
        "$2x^2 \\times 10\\,000$.",
        [
          ["$200x^2$ cm²", "Square the 100."],
          ["$2x^2$ cm²", "Convert."],
        ],
      ),
      quiz([
        [
          ["1 m² in cm²", "10 000", ["100", "1000"], "$100^2$."],
          ["1 km² in m²", "1 000 000", ["1000", "10 000"], "$1000^2$."],
        ],
        [
          ["1 m³ in cm³", "1 000 000", ["1000", "100"], "$100^3$."],
          ["1 cm³ in mm³", "1000", ["100", "10"], "$10^3$."],
        ],
        [
          ["10 m/s in km/h", "36", ["0.36", "600"], "× 3.6."],
          ["72 km/h in m/s", "20", ["259.2", "1.2"], "÷ 3.6."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "rates",
    "GH-R15",
    "Rates of change on curves",
    "A chord gives the average rate; a tangent gives the rate at an instant.",
    [
      problem(
        "Average and instant",
        [
          "A ball rolls down a ramp: $d = \\frac{t^2}{2}$ metres after $t$ seconds. “Find its average speed over the first 4 s, and estimate its speed at $t = 2$.”",
          "By the end of this lesson, you can find both from the graph.",
        ],
        chordTangent,
      ),
      typed("Warm-up", "$d$ at $t = 4$", "8", "$16 \\div 2$.", "8."),
      typed("Warm-up", "Gradient from (0, 0) to (4, 8)", "2", "$\\frac84$.", "2."),
      explain(
        "Discover",
        "Chord or tangent",
        [
          "A **chord** joins two points on the curve. Its gradient is the **average rate of change** between them.",
          "A **tangent** touches at one point. Its gradient is the **instantaneous rate of change** there. On a distance–time graph, these are average speed and speed at that moment.",
        ],
        chordTangent,
      ),
      choose(
        "Discover",
        "Average speed over 0–4 s uses",
        "the chord from (0, 0) to (4, 8)",
        "Two points.",
        [
          ["the tangent at $t = 2$", "That's instant."],
          ["the area", "That's for velocity–time."],
        ],
        { picture: chordTangent },
      ),
      worked(
        "The ball",
        "Average and instant.",
        [
          ["Chord: $\\frac{8 - 0}{4 - 0} = 2$ m/s", "Average."],
          ["Tangent at $t = 2$ through (2, 2) and (4, 6): gradient 2 m/s", "Instant."],
        ],
        "Here they're equal: at the midpoint time, for this curve.",
        chordTangent,
      ),
      steps(
        "Together",
        "Speed at $t = 3$",
        "Draw a tangent.",
        [
          [
            "A tangent at (3, 4.5) passes through",
            "(1, −1.5) and (4, 7.5)",
            ["(0, 0) and (4, 8)", "That's the chord."],
            "Two points on it",
          ],
          ["Gradient:", "3 m/s", ["2 m/s", "$\\frac{9}{3}$."], "3 m/s"],
        ],
        "Faster as it rolls.",
      ),
      choose(
        "Together",
        "Units of the gradient of a distance–time graph",
        "m/s",
        "Distance per time.",
        [
          ["m", "That's distance."],
          ["m/s²", "That's velocity–time."],
        ],
      ),
      typed(
        "Your turn",
        "Average rate of change from (1, 3) to (5, 11)",
        "2",
        "$\\frac{8}{4}$.",
        "2.",
      ),
      choose(
        "Your turn",
        "To find a rate of change at an instant, use",
        "a tangent",
        "Touches once.",
        [
          ["a chord", "That's average."],
          ["the area", "Not a rate."],
        ],
      ),
      choose(
        "Watch out",
        "Kim uses a chord to give the speed at $t = 2$. What's wrong?",
        "A chord gives an average; use a tangent at $t = 2$",
        "Instant.",
        [["Nothing", "Different questions."]],
      ),
      mistake(
        "Leo finds the average speed from $t = 1$ to $t = 3$.",
        ["$d(1) = 0.5$, $d(3) = 4.5$", "Gradient: $\\frac{4.5}{3}$", "1.5 m/s"],
        1,
        "Change over change: $\\frac{4.5 - 0.5}{3 - 1} = 2$ m/s.",
      ),
      choose(
        "Back to the problem",
        "“Average speed over 4 s and speed at $t = 2$?”",
        "Both 2 m/s",
        "Chord and tangent.",
        [
          ["8 m/s and 2 m/s", "Divide by time."],
          ["2 m/s and 4 m/s", "Tangent gradient is 2."],
        ],
        { picture: chordTangent },
      ),
      quiz([
        [
          [
            "A chord's gradient gives",
            "the average rate",
            ["the rate at a point", "the area"],
            "Two points.",
          ],
          [
            "A tangent's gradient gives",
            "the rate at a point",
            ["the average rate", "the total"],
            "Touches once.",
          ],
        ],
        [
          ["(0, 0) to (5, 20): average rate", "4", ["20", "5"], "$\\frac{20}{5}$."],
          ["(2, 10) to (6, 30): average rate", "5", ["7.5", "20"], "$\\frac{20}{4}$."],
        ],
        [
          ["Distance–time: gradient means", "speed", ["acceleration", "distance"], "Rate."],
          ["Velocity–time: gradient means", "acceleration", ["speed", "distance"], "Rate."],
        ],
      ]),
    ],
  ),
];
