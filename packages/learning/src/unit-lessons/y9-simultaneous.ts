// Year 9, "Simultaneous equations and inequalities", as three short lessons, one just before
// each skill: elimination (take one clue from the other), substitution (swap one letter for what
// it equals), and inequalities solved like equations and drawn on a number line. Each starts from
// something quick, builds the method a step at a time, names the common mistakes, and ends on an
// exit check.
import type { UnitLesson } from "./types.ts";

const ELIMINATE = "Y9-ALG-06.a";
const SUBSTITUTE = "Y9-ALG-06.b";
const INEQUALITY = "Y9-ALG-09";

export const y9Simultaneous: UnitLesson[] = [
  {
    unit: "y9-simultaneous",
    id: "y9-simultaneous/elimination",
    before: ELIMINATE,
    title: "Two clues",
    summary: "Solve two equations together by taking one from the other, to get rid of a letter.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Cinema tickets",
        text: [
          "Two adults and a child pay £26 at the cinema. One adult and a child pay £17.",
          "How much is each ticket? By the end of this lesson, you can find both.",
        ],
        picture: {
          kind: "table",
          rows: [
            ["2 adults + 1 child", "£26"],
            ["1 adult + 1 child", "£17"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $x + 4 = 9$",
        answers: ["5"],
        hint: "Take 4 from both sides.",
        done: "$x = 5$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "$(3x + y) - (x + y) =$",
        options: [
          {
            text: "$2x$",
            correct: true,
            feedback: "$3x - x = 2x$, and $y - y = 0$: the y's vanish.",
          },
          { text: "$2x + 2y$", feedback: "$y - y = 0$." },
          { text: "$4x + 2y$", feedback: "That adds them." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Coffee and cake",
        text: "2 coffees and a cake cost £7. 1 coffee and a cake cost £5. How much is a coffee, in pounds?",
        picture: {
          kind: "table",
          rows: [
            ["2 coffees + 1 cake", "£7"],
            ["1 coffee + 1 cake", "£5"],
          ],
        },
        answers: ["2"],
        hint: "The only difference between the orders is one coffee.",
        done: "The difference is one coffee, and £2. So a coffee is £2.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "And the cake?",
        text: "A coffee is £2, and 1 coffee and a cake cost £5. How much is the cake, in pounds?",
        answers: ["3"],
        hint: "$2 + \\text{cake} = 5$.",
        done: "£3. Check with the first order: $2 + 2 + 3 = 7$ ✓",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Elimination",
        text: [
          "Two equations with two unknowns are **simultaneous equations**. You just solved some: with c for coffee and k for cake, $2c + k = 7$ and $c + k = 5$.",
          "Taking one from the other **eliminates** a letter, leaving one equation with one unknown.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 2c + k &= 7 \\\\ c + k &= 5 \\\\ \\text{take away: } c &= 2 \\end{aligned}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Take one from the other",
        problem: "Solve $3x + y = 11$ and $x + y = 5$.",
        steps: [
          { line: "$2x = 6$", why: "Take the second from the first: $3x - x$, $y - y$, $11 - 5$." },
          { line: "$x = 3$", why: "Divide by 2." },
          { line: "$3 + y = 5$, so $y = 2$", why: "Put x back into either equation." },
        ],
        done: "Check in the first: $3 \\times 3 + 2 = 11$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $x + y = 10$ and $x - y = 4$",
        start: "$x + y = 10$ and $x - y = 4$",
        stages: [
          {
            prompt: "One has $+y$ and the other $-y$. To get rid of y,",
            options: [
              { text: "add them: $2x = 14$", correct: true, feedback: "" },
              {
                text: "take them away: $2y = 6$",
                feedback: "That works too, but adding cancels y straight away: $+y - y = 0$.",
              },
            ],
            then: "$2x = 14$, so $x = 7$",
          },
          {
            prompt: "Put $x = 7$ into $x + y = 10$:",
            options: [
              { text: "$y = 3$", correct: true, feedback: "" },
              { text: "$y = 17$", feedback: "$7 + y = 10$: take 7 away." },
            ],
            then: "$y = 3$",
          },
        ],
        done: "Check: $7 - 3 = 4$ ✓. Different signs: add. Same signs: subtract.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Make them match first",
        start: "$2x + 3y = 13$ and $x + y = 5$",
        stages: [
          {
            prompt: "Nothing matches yet. Multiply the second equation by 2, so both have $2x$:",
            options: [
              { text: "$2x + 2y = 10$", correct: true, feedback: "" },
              { text: "$2x + y = 10$", feedback: "Multiply every term by 2." },
              { text: "$2x + 2y = 5$", feedback: "Multiply the 5 by 2 too." },
            ],
            then: "$2x + 2y = 10$",
          },
          {
            prompt: "Take it from the first equation:",
            options: [
              { text: "$y = 3$", correct: true, feedback: "" },
              { text: "$5y = 23$", feedback: "Subtract: $3y - 2y$ and $13 - 10$." },
            ],
            then: "$y = 3$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$2$", correct: true, feedback: "" },
              { text: "$8$", feedback: "$x + 3 = 5$." },
            ],
            then: "$x = 2$",
          },
        ],
        done: "Check: $2 \\times 2 + 3 \\times 3 = 13$ ✓",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        text: "$4x + y = 14$ and $2x + y = 8$.",
        answers: ["3"],
        wrong: [{ answer: "2", feedback: "That's y. Take one from the other: $2x = 6$." }],
        hint: "Take the second from the first: the y's cancel.",
        done: "$2x = 6$, so $x = 3$, and $y = 2$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find y",
        text: "$2x + 3y = 12$ and $2x + y = 8$.",
        answers: ["2"],
        wrong: [{ answer: "3", feedback: "That's x. Take one from the other: $2y = 4$." }],
        hint: "The x's match: take one from the other.",
        done: "$2y = 4$, so $y = 2$, and $x = 3$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "To get rid of y in $5x + 2y = 16$ and $3x - 2y = 0$, you should",
        options: [
          {
            text: "add: $+2y$ and $-2y$ cancel",
            correct: true,
            feedback: "Different signs: add. Taking away would give $2y - (-2y) = 4y$.",
          },
          {
            text: "subtract",
            feedback: "$2y - (-2y) = 4y$: the y's don't go. Different signs, so add.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Cal solves $3x + 2y = 16$ and $x + 2y = 8$.",
        lines: ["Subtract: $2x = 8$", "$x = 4$", "$4 + 2y = 8$, so $y = 6$"],
        wrong: 2,
        why: "$4 + 2y = 8$ gives $2y = 4$, so $y = 2$. Check: $12 + 4 = 16$ ✓",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Cinema tickets",
        start: "With a for adult and c for child: $2a + c = 26$ and $a + c = 17$.",
        stages: [
          {
            prompt: "Take the second from the first:",
            options: [
              { text: "$a = 9$", correct: true, feedback: "" },
              {
                text: "$3a + 2c = 43$",
                feedback: "That adds them. Take one away to get rid of c.",
              },
            ],
            then: "An adult ticket is £9",
          },
          {
            prompt: "So a child ticket is",
            options: [
              { text: "£8", correct: true, feedback: "" },
              { text: "£17", feedback: "$9 + c = 17$." },
            ],
            then: "A child ticket is £8",
          },
        ],
        done: "Check: $2 \\times 9 + 8 = 26$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$x + y = 9$ and $x - y = 3$. Find x.",
            answers: ["6"],
            why: "Add: $2x = 12$.",
            retry: {
              prompt: "$x + y = 12$ and $x - y = 2$. Find x.",
              answers: ["7"],
              why: "Add: $2x = 14$.",
            },
          },
          {
            prompt: "$2x + y = 11$ and $x + y = 7$. Find x.",
            answers: ["4"],
            why: "Subtract: $x = 4$.",
            retry: {
              prompt: "$3x + y = 17$ and $x + y = 7$. Find x.",
              answers: ["5"],
              why: "Subtract: $2x = 10$.",
            },
          },
          {
            prompt: "To get rid of y in $4x + 3y = 18$ and $2x - 3y = 0$, you",
            options: ["add them", "subtract them"],
            answers: ["add them"],
            why: "Different signs: add.",
            retry: {
              prompt: "To get rid of y in $5x + 2y = 9$ and $x + 2y = 5$, you",
              options: ["subtract them", "add them"],
              answers: ["subtract them"],
              why: "Same signs: subtract.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-simultaneous",
    id: "y9-simultaneous/substitution",
    before: SUBSTITUTE,
    title: "Swap it in",
    summary: "When one equation says what a letter equals, swap it into the other.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A phone and its case",
        text: [
          "A phone and its case cost £130 together. The phone costs £100 more than the case.",
          "How much is the case? (It isn't £30!) By the end of this lesson, you can be sure.",
        ],
        picture: { kind: "maths", tex: "p + c = 130 \\qquad p = c + 100" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x + 1$. Find y when $x = 3$.",
        answers: ["7"],
        hint: "$2 \\times 3 + 1$.",
        done: "$6 + 1 = 7$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $3x + (2x + 1)$",
        options: [
          { text: "$5x + 1$", correct: true, feedback: "$3x + 2x = 5x$, and the + 1 stays." },
          { text: "$6x + 1$", feedback: "Add the x's: $3x + 2x$." },
          { text: "$5x$", feedback: "Don't lose the + 1." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Start with a number",
        text: "You know $y = 4$, and $3x + y = 10$. What is x?",
        answers: ["2"],
        hint: "Put 4 in place of y: $3x + 4 = 10$.",
        done: "$3x + 4 = 10$, so $3x = 6$ and $x = 2$. Swapping y for what it equals left one unknown.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Substitution",
        text: [
          "When one equation says $y = \\ldots$, you can swap y for that in the other equation. That's **substitution**.",
          "Swap in all of it, in a bracket: then there's only x left.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} y &= 2x + 1 \\\\ 3x + y &= 16 \\\\ 3x + (2x + 1) &= 16 \\end{aligned}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Seen on a graph",
        text: "Each equation is a line: $y = -3x + 11$ and $y = -x + 5$. Where is the answer?",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 6, yMin: -3, yMax: 11 },
          lines: [
            { m: -3, c: 11 },
            { m: -1, c: 5 },
          ],
          star: { x: 3, y: 2 },
        },
        options: [
          {
            text: "Where the lines cross, at (3, 2)",
            correct: true,
            feedback: "That point is on both lines, so it fits both equations at once.",
          },
          {
            text: "Where each line meets the y-axis",
            feedback: "Those points fit only one equation each.",
          },
          { text: "There is no answer", feedback: "The lines cross, so there is one." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Swap y in",
        problem: "Solve $y = 2x + 1$ and $3x + y = 16$.",
        steps: [
          { line: "$3x + (2x + 1) = 16$", why: "Swap y for $2x + 1$, all of it." },
          { line: "$5x + 1 = 16$", why: "Collect the x's." },
          { line: "$5x = 15$, so $x = 3$", why: "Solve as usual." },
          { line: "$y = 2 \\times 3 + 1 = 7$", why: "Put x back into $y = 2x + 1$." },
        ],
        done: "Check: $3 \\times 3 + 7 = 16$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $y = x + 2$ and $2x + y = 11$",
        start: "$y = x + 2$ and $2x + y = 11$",
        stages: [
          {
            prompt: "Swap y for $x + 2$:",
            options: [
              { text: "$2x + x + 2 = 11$", correct: true, feedback: "" },
              { text: "$2x + x = 11$", feedback: "Bring the + 2 too: y is all of $x + 2$." },
            ],
            then: "$3x + 2 = 11$",
          },
          {
            prompt: "Solve:",
            options: [
              { text: "$x = 3$", correct: true, feedback: "" },
              { text: "$x = 4.33$", feedback: "Take 2 away first: $3x = 9$." },
            ],
            then: "$x = 3$",
          },
          {
            prompt: "So y is",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "3", feedback: "$y = x + 2 = 3 + 2$." },
            ],
            then: "$y = 5$",
          },
        ],
        done: "Check: $2 \\times 3 + 5 = 11$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $x = 2y$ and $x + y = 12$",
        start: "$x = 2y$ and $x + y = 12$",
        stages: [
          {
            prompt: "This time x is given. Swap it in:",
            options: [
              { text: "$2y + y = 12$", correct: true, feedback: "" },
              { text: "$2 + y = 12$", feedback: "x is $2y$, not 2." },
            ],
            then: "$3y = 12$, so $y = 4$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "8", correct: true, feedback: "" },
              { text: "6", feedback: "$x = 2y = 2 \\times 4$." },
            ],
            then: "$x = 8$",
          },
        ],
        done: "Swap whichever letter you know.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        text: "$y = 3x$ and $x + y = 20$.",
        answers: ["5"],
        wrong: [{ answer: "15", feedback: "That's y. Swap in: $x + 3x = 20$." }],
        hint: "$x + 3x = 20$.",
        done: "$4x = 20$, so $x = 5$ and $y = 15$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find y",
        text: "$y = x - 1$ and $2x + 3y = 17$.",
        answers: ["3"],
        wrong: [{ answer: "4", feedback: "That's x. Then $y = x - 1$." }],
        hint: "$2x + 3(x - 1) = 17$: expand the bracket.",
        done: "$2x + 3x - 3 = 17$, so $5x = 20$, $x = 4$ and $y = 3$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "With $y = 2x + 1$ and $4x - y = 7$, Sam writes $4x - 2x + 1 = 7$. What's wrong?",
        options: [
          {
            text: "The minus takes away all of y: $4x - (2x + 1) = 4x - 2x - 1$",
            correct: true,
            feedback:
              "Without a bracket, the + 1 keeps the wrong sign. Always substitute in a bracket.",
          },
          { text: "Nothing", feedback: "$-y = -(2x + 1) = -2x - 1$, not $-2x + 1$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ola solves $y = x + 3$ and $2x + y = 15$.",
        lines: ["$2x + x + 3 = 15$", "$3x = 18$", "$x = 6$"],
        wrong: 1,
        why: "Take 3 from both sides: $3x = 12$, so $x = 4$ and $y = 7$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A phone and its case",
        start: "$p + c = 130$ and $p = c + 100$.",
        stages: [
          {
            prompt: "Swap p for $c + 100$:",
            options: [
              { text: "$c + 100 + c = 130$", correct: true, feedback: "" },
              {
                text: "$100 + c = 130$",
                feedback: "There's still the case's own c: $(c + 100) + c$.",
              },
            ],
            then: "$2c + 100 = 130$",
          },
          {
            prompt: "So the case costs",
            options: [
              { text: "£15", correct: true, feedback: "" },
              { text: "£30", feedback: "Then the phone would be £130, and both together £160." },
            ],
            then: "$2c = 30$, so $c = 15$",
          },
        ],
        done: "The case is £15 and the phone £115: £100 more, and £130 together ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$y = 2x$ and $x + y = 9$. Find x.",
            answers: ["3"],
            why: "$x + 2x = 9$, so $x = 3$.",
            retry: {
              prompt: "$y = 3x$ and $x + y = 16$. Find x.",
              answers: ["4"],
              why: "$x + 3x = 16$, so $x = 4$.",
            },
          },
          {
            prompt: "$y = x + 4$ and $2x + y = 13$. Find x.",
            answers: ["3"],
            why: "$2x + x + 4 = 13$, so $3x = 9$.",
            retry: {
              prompt: "$y = x - 2$ and $x + y = 10$. Find x.",
              answers: ["6"],
              why: "$x + x - 2 = 10$, so $2x = 12$.",
            },
          },
          {
            prompt: "On a graph, the solution of two simultaneous equations is",
            options: ["where the lines cross", "where they meet the y-axis", "the steeper line"],
            answers: ["where the lines cross"],
            why: "That point is on both lines.",
            retry: {
              prompt: "Two equations' lines are parallel. The equations have",
              options: ["no solution", "one solution", "two solutions"],
              answers: ["no solution"],
              why: "Parallel lines never cross.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-simultaneous",
    id: "y9-simultaneous/inequalities",
    before: INEQUALITY,
    title: "Inequalities",
    summary: "Solve an inequality like an equation, then show it on a number line.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How many boxes?",
        text: [
          "A lift can carry at most 600 kg. The 75 kg operator rides with boxes weighing 25 kg each.",
          "How many boxes can go up at once? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "maths", tex: "75 + 25b \\le 600" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $3x - 2 = 10$",
        answers: ["4"],
        hint: "Add 2, then divide by 3.",
        done: "$3x = 12$, so $x = 4$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is true?",
        options: [
          {
            text: "$5 > 3$",
            correct: true,
            feedback: "5 is greater than 3. The wide end faces the bigger number.",
          },
          { text: "$3 > 5$", feedback: "> means greater than. 3 isn't greater than 5." },
          { text: "$5 < 3$", feedback: "< means less than. 5 isn't less than 3." },
        ],
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "Which numbers fit $x > 3$?",
        groups: ["Fit", "Don't fit"],
        items: [
          { text: "4", group: 0, why: "4 is more than 3." },
          { text: "10", group: 0, why: "10 is more than 3." },
          { text: "3.5", group: 0, why: "3.5 is more than 3: not just whole numbers." },
          { text: "3", group: 1, why: "3 isn't more than 3. That's the one people get wrong." },
          { text: "2", group: 1, why: "2 is less than 3." },
          { text: "−5", group: 1, why: "−5 is less than 3." },
        ],
        done: "An inequality has lots of answers: every number that fits.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "On a number line",
        text: [
          "$x > 3$ means every number bigger than 3, but not 3 itself: an **open** circle at 3, and an arrow on.",
          "$x \\ge 3$ includes 3: a **filled** circle.",
        ],
        picture: {
          kind: "number-line",
          min: -2,
          max: 8,
          step: 1,
          interval: { from: 3, fromClosed: false },
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What does this show?",
        picture: {
          kind: "number-line",
          min: -5,
          max: 3,
          step: 1,
          interval: { to: -1, toClosed: true },
        },
        options: [
          {
            text: "$x \\le -1$",
            correct: true,
            feedback: "Everything up to −1, and −1 itself: the circle is filled.",
          },
          { text: "$x < -1$", feedback: "The circle is filled, so −1 is included." },
          { text: "$x \\ge -1$", feedback: "The arrow points left, to the smaller numbers." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Solve it like an equation",
        picture: {
          kind: "number-line",
          min: -1,
          max: 8,
          step: 1,
          interval: { to: 4, toClosed: false },
        },
        problem: "Solve $3x - 2 < 10$, and show it on a number line.",
        steps: [
          { line: "$3x < 12$", why: "Add 2 to both sides, just like an equation." },
          { line: "$x < 4$", why: "Divide both sides by 3. The sign stays the same way round." },
          {
            line: "Open circle at 4, arrow to the left",
            why: "< leaves 4 out; smaller numbers are to the left.",
          },
        ],
        done: "Any number below 4 works: 3, 2.5, −10…",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $2x + 5 \\ge 11$",
        start: "$2x + 5 \\ge 11$",
        stages: [
          {
            prompt: "Take 5 from both sides:",
            options: [
              { text: "$2x \\ge 6$", correct: true, feedback: "" },
              { text: "$2x \\ge 16$", feedback: "Take 5 away, don't add it." },
            ],
            then: "$2x \\ge 6$",
          },
          {
            prompt: "Divide by 2:",
            options: [
              { text: "$x \\ge 3$", correct: true, feedback: "" },
              {
                text: "$x \\le 3$",
                feedback: "Dividing by a positive number keeps the sign the same way round.",
              },
            ],
            then: "$x \\ge 3$",
            picture: {
              kind: "number-line",
              min: -1,
              max: 8,
              step: 1,
              interval: { from: 3, fromClosed: true },
            },
          },
        ],
        done: "≥ includes 3: a filled circle.",
      },
      {
        kind: "place",
        tag: "Together",
        title: "Whole numbers that fit",
        text: "Mark each whole number that fits $-2 < x \\le 1$.",
        line: { kind: "number-line", min: -4, max: 4, step: 1 },
        targets: [
          { value: -1, label: "$-1$" },
          { value: 0, label: "$0$" },
          { value: 1, label: "$1$" },
        ],
        hint: "−2 isn't included (<), but 1 is (≤).",
        done: "−1, 0 and 1. The < leaves −2 out; the ≤ lets 1 in.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Solve $4x + 1 > 13$",
        options: [
          { text: "$x > 3$", correct: true, feedback: "$4x > 12$, so $x > 3$." },
          { text: "$x < 3$", feedback: "The sign stays the same way round." },
          { text: "$x > 3.5$", feedback: "Take 1 away first: $4x > 12$." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The biggest whole number that fits $5x - 3 < 22$",
        answers: ["4"],
        wrong: [{ answer: "5", feedback: "$x < 5$ leaves 5 out." }],
        hint: "Solve: $5x < 25$, so $x < 5$.",
        done: "$x < 5$, so the biggest whole number is 4.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "$x < 4$. Is 4 a solution?",
        options: [
          {
            text: "No: < means strictly less, so 4 is left out",
            correct: true,
            feedback: "That's why the circle at 4 is open. Only ≤ would let 4 in.",
          },
          { text: "Yes", feedback: "4 isn't less than 4." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eve solves $2x + 3 \\le 9$ and draws it.",
        lines: ["$2x \\le 6$", "$x \\le 3$", "An open circle at 3, arrow to the left"],
        wrong: 2,
        why: "≤ includes 3, so the circle is **filled**. Open circles are for < and >.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "How many boxes?",
        start: "$75 + 25b \\le 600$",
        stages: [
          {
            prompt: "Take 75 from both sides:",
            options: [
              { text: "$25b \\le 525$", correct: true, feedback: "" },
              { text: "$25b \\le 675$", feedback: "Take 75 away, don't add it." },
            ],
            then: "$25b \\le 525$",
          },
          {
            prompt: "Divide by 25:",
            options: [
              { text: "$b \\le 21$", correct: true, feedback: "" },
              {
                text: "$b \\le 24$",
                feedback: "That ignores the operator: $600 \\div 25$. Take the 75 kg off first.",
              },
            ],
            then: "$b \\le 21$",
          },
        ],
        done: "At most 21 boxes. Check: $75 + 21 \\times 25 = 600$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Solve $x + 4 > 9$.",
            options: ["$x > 5$", "$x > 13$", "$x < 5$"],
            answers: ["$x > 5$"],
            why: "Take 4 from both sides.",
            retry: {
              prompt: "Solve $x - 3 \\le 2$.",
              options: ["$x \\le 5$", "$x \\le -1$", "$x \\ge 5$"],
              answers: ["$x \\le 5$"],
              why: "Add 3 to both sides.",
            },
          },
          {
            prompt: "Solve $3x \\ge 12$.",
            options: ["$x \\ge 4$", "$x \\ge 9$", "$x \\le 4$"],
            answers: ["$x \\ge 4$"],
            why: "Divide by 3.",
            retry: {
              prompt: "Solve $2x - 1 < 7$.",
              options: ["$x < 4$", "$x < 3$", "$x > 4$"],
              answers: ["$x < 4$"],
              why: "$2x < 8$, so $x < 4$.",
            },
          },
          {
            prompt: "Which is drawn with a filled circle?",
            options: ["$x \\ge 2$", "$x > 2$", "$x < 2$"],
            answers: ["$x \\ge 2$"],
            why: "≥ includes 2.",
            retry: {
              prompt: "Which is drawn with an open circle?",
              options: ["$x < 5$", "$x \\le 5$", "$x \\ge 5$"],
              answers: ["$x < 5$"],
              why: "< leaves 5 out.",
            },
          },
        ],
      },
    ],
  },
];
