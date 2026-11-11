// GCSE Foundation, "Straight-line graphs and functions", as seven short lessons, one just before
// each skill: functions as machines, plotting lines, parallel lines, a line from a point and a
// gradient, a line through two points, and what gradients and intercepts mean. Each recaps the
// Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Range, Rule, UnitLesson } from "./types.ts";

const U = "gf-straight-line";
const open: Range = { xMin: -4, xMax: 4, yMin: -6, yMax: 8 };
const graph = (lines: Rule[], points: { x: number; y: number }[] = [], range = open): Picture => ({
  kind: "graph",
  range,
  ...(lines.length ? { lines } : {}),
  ...(points.length ? { points } : {}),
});

export const gfStraightLine: UnitLesson[] = [
  lesson(
    U,
    "functions",
    "GF-A7",
    "Functions",
    "A function turns each input into one output by a rule.",
    [
      problem("The exchange booth", [
        "A booth changes pounds to euros: it multiplies by 1.2, then takes off a €2 fee. What do you get for £50? How much did you change if you got €40?",
        "That's a function: input, rule, output. By the end of this lesson, you can run one forwards and backwards.",
      ]),
      typed("Warm-up", "Work out $50 \\times 1.2$", "60", "Half of 1.2 is 0.6.", "60."),
      typed("Warm-up", "Work out $42 \\div 1.2$", "35", "$420 \\div 12$.", "35."),
      {
        kind: "machine",
        tag: "Discover",
        title: "Feed the machine",
        rule: { m: 3, c: -1 },
        inputs: [1, 2, 3, 4, 5],
        shown: 2,
        decoys: { 3: [9, 6], 4: [12, 7], 5: [15, 9] },
      },
      explain(
        "Discover",
        "Input, rule, output",
        [
          "A **function** takes an input $x$ and gives exactly one output. Here: times 3, then subtract 1, written $x \\to 3x - 1$.",
          "To find the input from an output, run the machine backwards with inverse operations.",
        ],
        { kind: "maths", tex: "x \\xrightarrow{\\times 3} \\xrightarrow{-1} 3x - 1" },
      ),
      worked(
        "The exchange booth",
        "Rule: × 1.2, then − 2. Find the output for 50.",
        [
          ["$50 \\times 1.2 = 60$", "First step."],
          ["$60 - 2 = 58$", "Second step."],
        ],
        "£50 gives €58.",
      ),
      steps(
        "Together",
        "Backwards: the output was 40",
        "Rule: × 1.2, then − 2.",
        [
          ["Undo − 2:", "42", ["38", "Add 2 to undo − 2."], "42"],
          ["Undo × 1.2:", "35", ["50.4", "Divide by 1.2."], "35"],
        ],
        "£35 was changed.",
      ),
      choose(
        "Together",
        "The function is $x \\to \\frac{x}{2} + 5$. Output for 8?",
        "9",
        "$8 \\div 2 + 5$.",
        [
          ["6.5", "Divide first, then add."],
          ["21", "That multiplies by 2."],
        ],
      ),
      typed("Your turn", "Rule: × 4, then + 3. Output for 6?", "27", "$24 + 3$.", "27.", {
        wrong: [["36", "Multiply first."]],
      }),
      typed(
        "Your turn",
        "Rule: × 4, then + 3. The output is 31. Input?",
        "7",
        "Subtract 3, then ÷ 4.",
        "7.",
        { wrong: [["8.5", "Undo + 3 first."]] },
      ),
      choose(
        "Watch out",
        "Rule: + 2, then × 5. Ed says the output for 3 is 17. What's wrong?",
        "He did × first. $(3 + 2) \\times 5 = 25$",
        "Follow the order of the machine.",
        [["Nothing", "Add 2 first: 5, then × 5."]],
      ),
      mistake(
        "Rule: × 2, then − 6. The output is 10. Jen finds the input.",
        ["Undo × 2: $10 \\div 2 = 5$", "Undo − 6: $5 + 6 = 11$", "Input: 11"],
        0,
        "Undo the last step first: $10 + 6 = 16$, then $16 \\div 2 = 8$.",
      ),
      typed(
        "Back to the problem",
        "“A booth multiplies by 1.2, then subtracts 2. Leah gets €40. How many pounds did she change?”",
        "35",
        "Add 2, then divide by 1.2.",
        "£35. Check: $35 \\times 1.2 - 2 = 40$ ✓",
        { wrong: [["31.67", "Add 2 before dividing."]] },
      ),
      quiz([
        [
          ["$x \\to 2x + 7$: output for 5", "17", ["24", "14"], "$10 + 7$."],
          ["$x \\to 3x - 4$: output for 6", "14", ["6", "22"], "$18 - 4$."],
        ],
        [
          ["$x \\to 2x + 7$: input for 21", "7", ["14", "49"], "$(21 - 7) \\div 2$."],
          ["$x \\to 5x - 3$: input for 22", "5", ["3.8", "107"], "$(22 + 3) \\div 5$."],
        ],
        [
          ["$x \\to \\frac{x}{4} - 1$: output for 12", "2", ["11", "47"], "$3 - 1$."],
          ["$x \\to \\frac{x}{3} + 2$: output for 15", "7", ["17", "51"], "$5 + 2$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "plot",
    "GF-A9.a",
    "Plotting straight lines",
    "Make a table of values, plot the points and join them with a ruler.",
    [
      problem("The exam question", [
        "“Complete the table of values for $y = 2x - 1$, from $x = -2$ to $x = 2$, and draw the graph.”",
        "By the end of this lesson, you can do the table, the plotting and the line, including the negatives.",
      ]),
      typed("Warm-up", "$y = 2x - 1$. Find $y$ when $x = 3$", "5", "$6 - 1$.", "5."),
      typed("Warm-up", "$y = 2x - 1$. Find $y$ when $x = -2$", "-5", "$-4 - 1$.", "−5.", {
        wrong: [["-3", "$2 \\times -2 = -4$, then − 1."]],
      }),
      explain(
        "Discover",
        "Table, points, line",
        [
          "Substitute each $x$ to get $y$. Each pair $(x, y)$ is a point. For $y = mx + c$, the points always line up.",
          "Plot at least three points: two fix the line, and the third checks it.",
        ],
        {
          kind: "table",
          head: ["$x$", "−2", "−1", "0", "1", "2"],
          rows: [["$y$", "−5", "−3", "−1", "1", "3"]],
        },
      ),
      {
        kind: "plot",
        tag: "Discover",
        title: "Plot $y = 2x - 1$",
        text: "Plot each point from the table.",
        scene: { range: open },
        targets: [
          { x: -2, y: -5 },
          { x: -1, y: -3 },
          { x: 0, y: -1 },
          { x: 1, y: 1 },
          { x: 2, y: 3 },
        ],
        table: true,
        rule: { m: 2, c: -1 },
        hint: "Across to $x$ (left for negatives), then up or down to $y$.",
        done: "A straight line through every point.",
      },
      worked(
        "A table for $y = 4 - x$",
        "Complete the table for $x = -1, 0, 1, 2, 3$.",
        [
          ["$x = -1$: $4 - (-1) = 5$", "Subtracting a negative adds."],
          ["$x = 0$: 4; $x = 1$: 3; $x = 2$: 2; $x = 3$: 1", "Down 1 each time."],
        ],
        "Even steps in $y$ are a good check.",
      ),
      {
        kind: "plot",
        tag: "Together",
        title: "Plot $y = 4 - x$",
        scene: { range: open },
        targets: [
          { x: -1, y: 5 },
          { x: 0, y: 4 },
          { x: 1, y: 3 },
          { x: 2, y: 2 },
          { x: 3, y: 1 },
        ],
        table: true,
        rule: { m: -1, c: 4 },
        hint: "Across to $x$, then up to $y$.",
        done: "This one slopes down.",
      },
      choose("Together", "Which point is on $y = 3x + 2$?", "$(-1, -1)$", "$3(-1) + 2 = -1$ ✓", [
        ["$(-1, 5)$", "$3 \\times -1 = -3$, plus 2 is −1."],
        ["$(1, 3)$", "$3 + 2 = 5$, not 3."],
      ]),
      {
        kind: "plot",
        tag: "Your turn",
        title: "Plot $y = x + 2$",
        scene: { range: open },
        targets: [
          { x: -3, y: -1 },
          { x: 0, y: 2 },
          { x: 2, y: 4 },
        ],
        table: true,
        rule: { m: 1, c: 2 },
        hint: "Across to $x$, then up or down to $y$.",
        done: "Three points: two to draw, one to check.",
      },
      choose(
        "Your turn",
        "In the table for $y = 5 - 2x$, what is $y$ when $x = -2$?",
        "9",
        "$5 - 2(-2) = 5 + 4$.",
        [
          ["1", "$-2 \\times -2 = +4$."],
          ["−9", "Check the signs."],
        ],
      ),
      choose(
        "Watch out",
        "Three of Ali's points line up; the fourth doesn't. What should he do?",
        "Recheck that point's calculation",
        "$y = mx + c$ always makes a straight line.",
        [["Draw a curve through all four", "The graph must be straight."]],
      ),
      mistake(
        "Ola fills in the table for $y = 3x - 2$.",
        ["$x = 1$: $y = 1$", "$x = 0$: $y = -2$", "$x = -1$: $y = -1$"],
        2,
        "$3(-1) - 2 = -5$.",
      ),
      choose(
        "Back to the problem",
        "“Complete the table for $y = 2x - 1$ for $x = -2$ to 2.”",
        "−5, −3, −1, 1, 3",
        "Up 2 each time.",
        [
          ["−3, −1, −1, 1, 3", "$x = -2$: $-4 - 1 = -5$."],
          ["−5, −3, 1, 1, 3", "$x = 0$: $y = -1$."],
        ],
      ),
      quiz([
        [
          ["$y = 3x + 1$: $y$ when $x = -2$", "−5", ["7", "−7"], "$-6 + 1$."],
          ["$y = 2x + 3$: $y$ when $x = -3$", "−3", ["9", "−9"], "$-6 + 3$."],
        ],
        [
          ["Which is on $y = 2x + 5$?", "$(-2, 1)$", ["$(1, 2)$", "$(0, 2)$"], "$-4 + 5 = 1$."],
          ["Which is on $y = 4 - 3x$?", "$(2, -2)$", ["$(2, 10)$", "$(0, -3)$"], "$4 - 6 = -2$."],
        ],
        [
          ["How many points fix a straight line?", "2", ["1", "4"], "Two; a third checks it."],
          [
            "Why plot a third point?",
            "To check",
            ["It's needed to draw", "To make a curve"],
            "Two fix it; three check it.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "parallel",
    "GF-A9.b",
    "Parallel lines",
    "Parallel lines have the same gradient: the same m.",
    [
      problem(
        "Railway tracks",
        [
          "Two straight rails never meet. One follows $y = 3x + 1$. Which of $y = 3x - 4$, $y = 4x + 1$ and $y = \\frac13 x + 1$ could be the other?",
          "By the end of this lesson, you can spot parallel lines from their equations.",
        ],
        graph([
          { m: 3, c: 1 },
          { m: 3, c: -4 },
        ]),
      ),
      choose("Warm-up", "In $y = 5x - 2$, the gradient is", "5", "The number multiplying $x$.", [
        ["−2", "That's the intercept."],
      ]),
      choose("Warm-up", "Parallel lines", "never meet", "They have the same steepness.", [
        ["meet at right angles", "That's perpendicular."],
      ]),
      explain(
        "Discover",
        "Same gradient, different intercept",
        [
          "In $y = mx + c$, $m$ sets the steepness. Lines with the **same gradient** go up at the same rate, so they never meet: they're **parallel**.",
          "Different $c$ just slides the line up or down.",
        ],
        graph([
          { m: 2, c: 3 },
          { m: 2, c: 0 },
          { m: 2, c: -3 },
        ]),
      ),
      {
        kind: "slider",
        tag: "Discover",
        title: "Slide it parallel",
        text: "Slide $c$ in $y = 2x + c$ to move the line through the star. Does its steepness change?",
        range: open,
        vary: "c",
        start: { m: 2, c: 0 },
        min: -5,
        max: 5,
        star: { x: 1, y: 5 },
        done: "$c = 3$. The line moved but stayed parallel: same $m = 2$.",
      },
      worked(
        "Find a parallel line",
        "Write the equation of a line parallel to $y = 4x - 1$ through $(0, 6)$.",
        [
          ["Parallel: same gradient, $m = 4$", "Same steepness."],
          ["Through $(0, 6)$: $c = 6$", "It crosses the $y$-axis at 6."],
          ["$y = 4x + 6$", "Put them together."],
        ],
        "Same $m$, new $c$.",
      ),
      steps(
        "Together",
        "Is $2y = 6x + 4$ parallel to $y = 3x - 1$?",
        "Rearrange first.",
        [
          [
            "Divide by 2:",
            "$y = 3x + 2$",
            ["$y = 6x + 2$", "Divide every term by 2."],
            "$y = 3x + 2$",
          ],
          [
            "Gradients 3 and 3, so",
            "parallel",
            ["not parallel", "Same $m$: parallel."],
            "Parallel",
          ],
        ],
        "Always get $y$ on its own first.",
      ),
      choose(
        "Together",
        "Which is parallel to $y = -2x + 5$?",
        "$y = 1 - 2x$",
        "That's $y = -2x + 1$: $m = -2$.",
        [
          ["$y = 2x + 5$", "Gradient 2, not −2."],
          ["$y = 5x - 2$", "Gradient 5."],
        ],
      ),
      choose(
        "Your turn",
        "A line parallel to $y = x + 7$ through $(0, -3)$",
        "$y = x - 3$",
        "$m = 1$, $c = -3$.",
        [
          ["$y = -3x + 7$", "Keep the gradient: 1."],
          ["$y = 7x - 3$", "$m$ is 1, not 7."],
        ],
      ),
      choose(
        "Your turn",
        "Are $y = 4x$ and $y = 4x + 2$ parallel?",
        "Yes: both have gradient 4",
        "Same $m$.",
        [["No: one has no $c$", "$y = 4x$ has $c = 0$. Same gradient."]],
      ),
      choose(
        "Watch out",
        "Ben says $y = 3x + 1$ and $y = 3 + x$ are parallel because both have a 3. Is he right?",
        "No: their gradients are 3 and 1",
        "Only the number with $x$ matters.",
        [["Yes", "$y = 3 + x$ has gradient 1."]],
      ),
      mistake(
        "Kai checks if $3y = 6x - 9$ is parallel to $y = 6x$.",
        ["The first has 6x", "The second has 6x", "So they're parallel"],
        0,
        "Make $y$ the subject: $y = 2x - 3$, gradient 2. Not parallel.",
      ),
      choose(
        "Back to the problem",
        "“One rail is $y = 3x + 1$. Which line is parallel to it?”",
        "$y = 3x - 4$",
        "Same gradient, 3.",
        [
          ["$y = 4x + 1$", "Gradient 4."],
          ["$y = \\frac13 x + 1$", "Gradient $\\frac13$."],
        ],
      ),
      quiz([
        [
          [
            "Parallel to $y = 5x + 2$?",
            "$y = 5x - 7$",
            ["$y = 2x + 5$", "$y = -5x + 2$"],
            "Gradient 5.",
          ],
          [
            "Parallel to $y = -x + 4$?",
            "$y = 3 - x$",
            ["$y = x + 4$", "$y = 4x - 1$"],
            "Gradient −1.",
          ],
        ],
        [
          [
            "Parallel to $y = 2x$ through $(0, 5)$",
            "$y = 2x + 5$",
            ["$y = 5x + 2$", "$y = 2x - 5$"],
            "$m = 2$, $c = 5$.",
          ],
          [
            "Parallel to $y = 6x - 1$ through $(0, 3)$",
            "$y = 6x + 3$",
            ["$y = 3x + 6$", "$y = 6x - 3$"],
            "$m = 6$, $c = 3$.",
          ],
        ],
        [
          ["Gradient of $2y = 8x + 6$", "4", ["8", "3"], "$y = 4x + 3$."],
          ["Gradient of $3y = 9x - 3$", "3", ["9", "−1"], "$y = 3x - 1$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "point-gradient",
    "GF-A9.c",
    "A line from a point and a gradient",
    "Substitute the point into y = mx + c to find c.",
    [
      problem("The ramp", [
        "A ramp rises with gradient 2 and passes through the point $(3, 11)$ on a plan. What is its equation?",
        "The point isn't on the $y$-axis, so you can't read $c$. By the end of this lesson, you can find it.",
      ]),
      typed("Warm-up", "Solve $11 = 6 + c$", "5", "Subtract 6.", "$c = 5$."),
      choose("Warm-up", "In $y = 2x + c$, the gradient is", "2", "The number with $x$.", [
        ["$c$", "$c$ is the intercept."],
      ]),
      explain(
        "Discover",
        "Use the point to find c",
        [
          "You know $m$, so $y = mx + c$ has one unknown: $c$. The point's $x$ and $y$ must fit the equation.",
          "Substitute them, then solve for $c$.",
        ],
        graph([{ m: 2, c: 5 }], [{ x: 3, y: 11 }], { xMin: -2, xMax: 4, yMin: -1, yMax: 13 }),
      ),
      choose(
        "Discover",
        "Line $y = 2x + c$ through $(3, 11)$. Substitute:",
        "$11 = 2(3) + c$",
        "$x = 3$, $y = 11$.",
        [["$3 = 2(11) + c$", "The $x$ value goes with $x$."]],
      ),
      worked(
        "The ramp",
        "Find the line with gradient 2 through $(3, 11)$.",
        [
          ["$y = 2x + c$", "Gradient 2."],
          ["$11 = 6 + c$, so $c = 5$", "Substitute the point."],
          ["$y = 2x + 5$", "Write the equation."],
        ],
        "Check: $2(3) + 5 = 11$ ✓",
      ),
      steps(
        "Together",
        "Gradient −3, through $(2, 1)$",
        "$y = -3x + c$",
        [
          [
            "Substitute $(2, 1)$:",
            "$1 = -6 + c$",
            ["$2 = -3 + c$", "$x = 2$, $y = 1$."],
            "$1 = -6 + c$",
          ],
          ["So $c =$", "7", ["−5", "Add 6 to both sides."], "$y = -3x + 7$"],
        ],
        "Check: $-6 + 7 = 1$ ✓",
      ),
      choose(
        "Together",
        "Gradient $\\frac12$ through $(4, 0)$",
        "$y = \\frac12 x - 2$",
        "$0 = 2 + c$, so $c = -2$.",
        [
          ["$y = \\frac12 x + 4$", "$c$ isn't the $x$ value."],
          ["$y = 4x + \\frac12$", "The gradient is $\\frac12$."],
        ],
      ),
      choose("Your turn", "Gradient 4 through $(1, 9)$", "$y = 4x + 5$", "$9 = 4 + c$.", [
        ["$y = 4x + 9$", "9 is $y$ at $x = 1$, not at 0."],
        ["$y = 9x + 4$", "Gradient is 4."],
      ]),
      choose("Your turn", "Gradient −1 through $(-2, 6)$", "$y = -x + 4$", "$6 = 2 + c$.", [
        ["$y = -x + 8$", "$-1 \\times -2 = +2$."],
        ["$y = -x + 6$", "6 isn't on the $y$-axis."],
      ]),
      choose(
        "Watch out",
        "Line with gradient 3 through $(2, 10)$. Sam writes $y = 3x + 10$. What's wrong?",
        "10 is $y$ at $x = 2$, not where it crosses the axis. $c = 4$",
        "Substitute: $10 = 6 + c$.",
        [["Nothing", "Check: $3(2) + 10 = 16$, not 10."]],
      ),
      mistake(
        "Gradient 5 through $(-1, 2)$. Ivy finds $c$.",
        ["$2 = 5(-1) + c$", "$2 = -5 + c$", "$c = -3$"],
        2,
        "Add 5: $c = 7$. So $y = 5x + 7$.",
      ),
      choose(
        "Back to the problem",
        "“Find the equation of the line with gradient 2 through $(3, 11)$.”",
        "$y = 2x + 5$",
        "$11 = 6 + c$.",
        [
          ["$y = 2x + 11$", "11 is $y$ when $x = 3$."],
          ["$y = 3x + 11$", "Gradient is 2."],
        ],
      ),
      quiz([
        [
          [
            "Gradient 3 through $(1, 7)$",
            "$y = 3x + 4$",
            ["$y = 3x + 7$", "$y = 7x + 3$"],
            "$7 = 3 + c$.",
          ],
          [
            "Gradient 2 through $(4, 3)$",
            "$y = 2x - 5$",
            ["$y = 2x + 3$", "$y = 3x + 2$"],
            "$3 = 8 + c$.",
          ],
        ],
        [
          [
            "Gradient −2 through $(3, 0)$",
            "$y = -2x + 6$",
            ["$y = -2x - 6$", "$y = -2x + 3$"],
            "$0 = -6 + c$.",
          ],
          [
            "Gradient −4 through $(1, 2)$",
            "$y = -4x + 6$",
            ["$y = -4x - 2$", "$y = -4x + 2$"],
            "$2 = -4 + c$.",
          ],
        ],
        [
          [
            "First step: substitute",
            "the point's $x$ and $y$",
            ["the gradient for $y$", "$c = y$"],
            "To find $c$.",
          ],
          [
            "After finding $m$, you find $c$ by",
            "substituting a point",
            ["reading the gradient", "doubling $m$"],
            "Then solve.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "two-points",
    "GF-A9.d",
    "A line through two points",
    "Find the gradient from the two points, then c.",
    [
      problem(
        "Two readings",
        [
          "A taxi meter reads £7 after 2 miles and £13 after 5 miles. The graph is straight. What's its equation?",
          "By the end of this lesson, you can find the line through any two points.",
        ],
        graph(
          [{ m: 2, c: 3 }],
          [
            { x: 2, y: 7 },
            { x: 5, y: 13 },
          ],
          { xMin: 0, xMax: 6, yMin: 0, yMax: 15 },
        ),
      ),
      typed("Warm-up", "Work out $\\frac{13 - 7}{5 - 2}$", "2", "$6 \\div 3$.", "2."),
      typed("Warm-up", "Solve $7 = 4 + c$", "3", "Subtract 4.", "$c = 3$."),
      explain(
        "Discover",
        "Gradient = change in y ÷ change in x",
        [
          "Between two points, the gradient is how far up, divided by how far across.",
          "Then use either point to find $c$, as before.",
        ],
        { kind: "maths", tex: "m = \\frac{y_2 - y_1}{x_2 - x_1}" },
      ),
      choose(
        "Discover",
        "Gradient between $(1, 2)$ and $(3, 8)$",
        "3",
        "$\\frac{8 - 2}{3 - 1} = \\frac62$.",
        [
          ["$\\frac13$", "Up over across, not across over up."],
          ["6", "Divide by the change in $x$, 2."],
        ],
      ),
      worked(
        "The taxi",
        "Find the line through $(2, 7)$ and $(5, 13)$.",
        [
          ["$m = \\frac{13 - 7}{5 - 2} = 2$", "Up 6, across 3."],
          ["$7 = 2(2) + c$, so $c = 3$", "Substitute a point."],
          ["$y = 2x + 3$", "£3 to start, £2 a mile."],
        ],
        "Check with the other point: $2(5) + 3 = 13$ ✓",
      ),
      steps(
        "Together",
        "The line through $(-1, 5)$ and $(2, -1)$",
        "Two points.",
        [
          ["Gradient:", "−2", ["2", "$y$ went down 6 while $x$ went up 3."], "$m = -2$"],
          ["Substitute $(2, -1)$:", "$c = 3$", ["$c = -1$", "$-1 = -4 + c$."], "$y = -2x + 3$"],
        ],
        "Check: $-2(-1) + 3 = 5$ ✓",
      ),
      choose(
        "Together",
        "Gradient between $(0, 4)$ and $(4, 6)$",
        "$\\frac12$",
        "$\\frac{2}{4}$.",
        [
          ["2", "Up 2, across 4: $2 \\div 4$."],
          ["$\\frac{10}{4}$", "Subtract, don't add."],
        ],
      ),
      choose(
        "Your turn",
        "The line through $(1, 1)$ and $(3, 9)$",
        "$y = 4x - 3$",
        "$m = 4$; $1 = 4 + c$.",
        [
          ["$y = 4x + 1$", "Find $c$ by substituting."],
          ["$y = \\frac14 x + \\frac34$", "Up over across: $8 \\div 2$."],
        ],
      ),
      choose(
        "Your turn",
        "The line through $(0, -2)$ and $(2, 4)$",
        "$y = 3x - 2$",
        "$m = 3$; it crosses at −2.",
        [
          ["$y = 2x - 2$", "Up 6, across 2: 3."],
          ["$y = 3x + 4$", "The intercept is −2."],
        ],
      ),
      choose(
        "Watch out",
        "Points $(1, 4)$ and $(3, 10)$. Mo does $\\frac{3 - 1}{10 - 4} = \\frac13$. What's wrong?",
        "He's done across over up; gradient is up over across = 3",
        "Change in $y$ on top.",
        [["Nothing", "Steep lines have big gradients: up 6, across 2."]],
      ),
      mistake(
        "Points $(2, 3)$ and $(4, 11)$. Pia finds the line.",
        ["$m = \\frac{11 - 3}{4 - 2} = 4$", "$3 = 4(2) + c$", "$c = 11$"],
        2,
        "$3 = 8 + c$, so $c = -5$: $y = 4x - 5$.",
      ),
      choose(
        "Back to the problem",
        "“The meter reads £7 after 2 miles and £13 after 5 miles. Find the equation of the line.”",
        "$y = 2x + 3$",
        "Gradient 2, intercept 3.",
        [
          ["$y = 3x + 2$", "Gradient: $6 \\div 3 = 2$."],
          ["$y = 2x + 7$", "7 is at $x = 2$."],
        ],
      ),
      quiz([
        [
          ["Gradient: $(1, 3)$ and $(3, 7)$", "2", ["$\\frac12$", "4"], "$4 \\div 2$."],
          ["Gradient: $(0, 1)$ and $(2, 9)$", "4", ["$\\frac14$", "8"], "$8 \\div 2$."],
        ],
        [
          [
            "Line through $(0, 5)$ and $(1, 8)$",
            "$y = 3x + 5$",
            ["$y = 5x + 3$", "$y = 8x + 5$"],
            "$m = 3$, $c = 5$.",
          ],
          [
            "Line through $(0, -1)$ and $(2, 3)$",
            "$y = 2x - 1$",
            ["$y = -x + 2$", "$y = 3x - 1$"],
            "$m = 2$, $c = -1$.",
          ],
        ],
        [
          ["Gradient: $(1, 6)$ and $(4, 0)$", "−2", ["2", "$-\\frac12$"], "Down 6, across 3."],
          ["Gradient: $(0, 9)$ and $(3, 0)$", "−3", ["3", "$-\\frac13$"], "Down 9, across 3."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "gradients",
    "GF-A10.a",
    "What a gradient means",
    "The gradient is how much y changes for each 1 of x: a rate.",
    [
      problem(
        "Filling a bath",
        [
          "A straight-line graph shows the water in a bath: from 20 litres to 80 litres in 5 minutes. The exam asks: “Work out the gradient and say what it represents.”",
          "By the end of this lesson, you can find a gradient from a graph and explain it in context.",
        ],
        {
          kind: "table",
          head: ["Time (min)", "0", "1", "2", "5"],
          rows: [["Water (litres)", "20", "32", "44", "80"]],
        },
      ),
      typed("Warm-up", "Work out $60 \\div 5$", "12", "Six tens and a fifth.", "12."),
      choose(
        "Warm-up",
        "A line slopes down from left to right. Its gradient is",
        "negative",
        "As $x$ increases, $y$ decreases.",
        [["positive", "Positive slopes up."]],
      ),
      explain(
        "Discover",
        "Rise over run",
        [
          "Pick two points on the line. Gradient $= \\frac{\\text{change in } y}{\\text{change in } x}$: how much $y$ changes for every 1 across.",
          "In a real graph, it's a **rate**, with units: litres **per** minute, pounds **per** mile.",
        ],
        { kind: "maths", tex: "\\text{gradient} = \\frac{80 - 20}{5 - 0} = 12" },
      ),
      {
        kind: "build",
        tag: "Discover",
        title: "Read the gradient",
        text: "Find where it crosses the $y$-axis, then count one step.",
        range: { xMin: -4, xMax: 4, yMin: -4, yMax: 6 },
        rule: { m: -2, c: 1 },
        ms: [-2, 2, -1],
        cs: [1, -1, 2],
        hint: "It crosses at 1 and goes down 2 for each 1 across.",
      },
      worked(
        "The bath",
        "Find the gradient, and say what it represents.",
        [
          ["$\\frac{80 - 20}{5 - 0} = 12$", "Up 60 litres in 5 minutes."],
          ["12 litres per minute", "Units of $y$ per unit of $x$."],
          ["The rate the bath fills", "In context."],
        ],
        "Always give the meaning, with units.",
      ),
      steps(
        "Together",
        "A phone battery: 90% at 0 h, 30% at 4 h",
        "Gradient and meaning.",
        [
          ["Gradient:", "−15", ["15", "It goes down: negative."], "−15"],
          [
            "It means",
            "it loses 15% per hour",
            ["it lasts 15 hours", "A rate: per hour."],
            "−15% per hour",
          ],
        ],
        "Negative gradient: decreasing.",
      ),
      choose("Together", "Which line is steepest?", "$y = -5x + 1$", "Size of the gradient: 5.", [
        ["$y = 3x + 8$", "3 is less steep than 5."],
        ["$y = x + 10$", "Gradient 1."],
      ]),
      typed("Your turn", "Gradient between $(2, 1)$ and $(6, 13)$", "3", "$12 \\div 4$.", "3.", {
        wrong: [["0.33", "Up over across."]],
      }),
      choose(
        "Your turn",
        "A graph of cost (£) against hours worked has gradient 9. This means",
        "£9 per hour",
        "The rate of pay.",
        [
          ["9 hours", "The gradient is a rate."],
          ["£9 to start", "That's the intercept."],
        ],
      ),
      choose(
        "Watch out",
        "A graph's axes go up in 5s. Ed counts squares and gets gradient 2. What's wrong?",
        "Use the values on the axes, not squares",
        "Scales differ: read the numbers.",
        [["Nothing", "Each square up is 5, not 1."]],
      ),
      mistake(
        "Kim finds the gradient from $(0, 50)$ to $(10, 20)$.",
        ["Change in $y$: $20 - 50 = -30$", "Change in $x$: 10", "Gradient: 3"],
        2,
        "$-30 \\div 10 = -3$: it's negative.",
      ),
      choose(
        "Back to the problem",
        "“The bath goes from 20 to 80 litres in 5 minutes. Work out the gradient and say what it represents.”",
        "12: it fills at 12 litres per minute",
        "Rate, with units.",
        [
          ["12: the bath holds 12 litres", "The gradient is a rate."],
          ["20: the water at the start", "That's the intercept."],
        ],
      ),
      quiz([
        [
          ["Gradient: $(0, 2)$ to $(4, 10)$", "2", ["8", "0.5"], "$8 \\div 4$."],
          ["Gradient: $(1, 1)$ to $(3, 11)$", "5", ["10", "0.2"], "$10 \\div 2$."],
        ],
        [
          [
            "Distance (km) against time (h), gradient 40, means",
            "40 km per hour",
            ["40 hours", "40 km at the start"],
            "Rate.",
          ],
          ["Cost (£) against kg, gradient 3, means", "£3 per kg", ["3 kg", "£3 to start"], "Rate."],
        ],
        [
          ["Gradient: $(0, 8)$ to $(2, 0)$", "−4", ["4", "−0.25"], "Down 8, across 2."],
          ["Gradient: $(0, 6)$ to $(3, 0)$", "−2", ["2", "−0.5"], "Down 6, across 3."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "intercepts",
    "GF-A10.b",
    "What an intercept means",
    "Where a line crosses the y-axis is its starting value.",
    [
      problem(
        "The plumber's charges",
        [
          "A plumber's charges are a straight line: £50 for 1 hour, £80 for 2 hours. The exam asks: “Find the y-intercept and explain what it means.”",
          "By the end of this lesson, you can find intercepts and say what they mean.",
        ],
        { kind: "table", head: ["Hours", "1", "2", "3"], rows: [["Cost (£)", "50", "80", "110"]] },
      ),
      choose("Warm-up", "Where does $y = 3x + 7$ cross the $y$-axis?", "$(0, 7)$", "$c = 7$.", [
        ["$(7, 0)$", "On the $y$-axis, $x = 0$."],
        ["$(0, 3)$", "3 is the gradient."],
      ]),
      typed("Warm-up", "$y = 3x + 7$. Find $y$ when $x = 0$", "7", "$3 \\times 0 + 7$.", "7."),
      explain(
        "Discover",
        "Two intercepts",
        [
          "The **y-intercept** is where $x = 0$: the value of $c$ in $y = mx + c$. In context, it's the **starting value**.",
          "The **x-intercept** is where $y = 0$: solve $mx + c = 0$.",
        ],
        graph(
          [{ m: 2, c: -4 }],
          [
            { x: 0, y: -4 },
            { x: 2, y: 0 },
          ],
        ),
      ),
      choose(
        "Discover",
        "Where does $y = 2x - 4$ cross the $x$-axis?",
        "$(2, 0)$",
        "$2x - 4 = 0$, so $x = 2$.",
        [
          ["$(0, -4)$", "That's the $y$-axis."],
          ["$(-4, 0)$", "Solve $2x - 4 = 0$."],
        ],
      ),
      worked(
        "The plumber",
        "£50 for 1 hour, £80 for 2 hours. Find the $y$-intercept.",
        [
          ["Gradient: £30 per hour", "Up 30 for each hour."],
          ["$50 = 30(1) + c$, so $c = 20$", "Substitute."],
          ["£20: the call-out charge", "The cost for 0 hours."],
        ],
        "The intercept is the starting value.",
      ),
      steps(
        "Together",
        "A candle: $h = 24 - 3t$ cm after $t$ hours",
        "Intercepts in context.",
        [
          [
            "$h$-intercept (at $t = 0$):",
            "24 cm, its height at the start",
            ["3 cm", "That's the rate."],
            "24 cm",
          ],
          [
            "$t$-intercept ($h = 0$):",
            "8 hours, when it burns out",
            ["24 hours", "Solve $24 - 3t = 0$."],
            "8 hours",
          ],
        ],
        "Both intercepts have a meaning.",
      ),
      choose(
        "Together",
        "A gym costs $C = 25m + 40$. The 40 means",
        "a £40 joining fee",
        "Paid at $m = 0$.",
        [["£40 a month", "The monthly cost is the gradient, 25."]],
      ),
      choose("Your turn", "$x$-intercept of $y = 3x + 6$", "$(-2, 0)$", "$3x + 6 = 0$.", [
        ["$(2, 0)$", "$3x = -6$."],
        ["$(0, 6)$", "That's the $y$-intercept."],
      ]),
      choose(
        "Your turn",
        "A tank: $V = 500 - 20t$ litres. The 500 means",
        "it starts with 500 litres",
        "At $t = 0$.",
        [["it drains 500 litres a minute", "The rate is 20."]],
      ),
      choose(
        "Watch out",
        "On a graph with axes starting at 10, not 0, Jo reads the intercept where the line meets the left edge. What's wrong?",
        "The intercept is at $x = 0$; check where the axis really is",
        "The left edge isn't always $x = 0$.",
        [["Nothing", "If the $x$-axis starts at 10, the left edge isn't $x = 0$."]],
      ),
      mistake(
        "Ali finds where $y = 4x - 8$ crosses the $x$-axis.",
        ["Set $y = 0$", "$4x - 8 = 0$, so $4x = -8$", "$x = -2$"],
        1,
        "Add 8: $4x = 8$, so $x = 2$.",
      ),
      choose(
        "Back to the problem",
        "“The cost is £50 for 1 hour and £80 for 2 hours. Find the $y$-intercept and explain what it means.”",
        "£20: the call-out charge before any work",
        "Cost at 0 hours.",
        [
          ["£50: the first hour", "Find $c$: $50 - 30$."],
          ["£30: the hourly rate", "That's the gradient."],
        ],
      ),
      quiz([
        [
          ["$y$-intercept of $y = 5x - 3$", "$(0, -3)$", ["$(0, 5)$", "$(-3, 0)$"], "$c = -3$."],
          ["$y$-intercept of $y = -2x + 9$", "$(0, 9)$", ["$(0, -2)$", "$(9, 0)$"], "$c = 9$."],
        ],
        [
          ["$x$-intercept of $y = 2x - 10$", "$(5, 0)$", ["$(-5, 0)$", "$(0, -10)$"], "$2x = 10$."],
          ["$x$-intercept of $y = 5x + 15$", "$(-3, 0)$", ["$(3, 0)$", "$(0, 15)$"], "$5x = -15$."],
        ],
        [
          [
            "A taxi: $C = 2d + 3$. The 3 is",
            "the fixed charge",
            ["the cost per mile", "the distance"],
            "At $d = 0$.",
          ],
          [
            "Savings: $S = 10w + 50$. The 50 is",
            "the starting amount",
            ["the weekly saving", "the weeks"],
            "At $w = 0$.",
          ],
        ],
      ]),
    ],
  ),
];
