// Year 7, "Sequences and equations", on the stepped template (docs/proposals/lesson-stepped.md):
// term-to-term rules on growing patterns, the nth term in a table, and one-step and two-step
// equations on a balance.
import {
  ask,
  calc,
  choose,
  explain,
  methodCard,
  questionSet,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, own, owned, reworded, stepped } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Equations } from "./y7-equations.ts";

const ALGEBRA = "Algebra: the numbers and letters are the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const stacks = (counts: number[]): Picture => ({ kind: "stacks", counts });
const nthTable = (rule: string, terms: string[]): Picture => ({
  kind: "table",
  head: ["n", ...terms.map((_, i) => String(i + 1))],
  rows: [[rule, ...terms]],
});

/** A question with no picture is algebra in words: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: ALGEBRA }
      : s,
  );

const list = y7Equations;

// ---------------------------------------------------------------------------------------------
// Term-to-term rules.

const TERM = "y7-equations/term-to-term";
const termMethod = [
  "Find the gap between each pair of terms.",
  "Check the gap is the same each time.",
  "Use the rule to find the next terms.",
];

const termToTerm = stepped(find(list, TERM), {
  method: termMethod,
  variation: {
    relationship: "a sequence and the rule from one term to the next",
    unknowns: ["next term", "rule", "earlier term"],
    surface: ["adding", "taking away", "times", "growing gaps", "fences"],
  },
  screens: worded([
    explain(
      "The rule",
      "What comes next?",
      ["**A term-to-term rule gets from one term to the next.**"],
      stacks([3, 5, 7, 9]),
      "3, 5, 7, 9: start at 3, and add 2 each time.",
    ),
    reworded(list, TERM, "How many squares in term 5?", { tag: "The rule" }),

    ...owned(list, TERM, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $6 \\times 3$?", "18", "3 sixes.", "18."),

    methodCard("The method", termMethod, stacks([3, 5, 7, 9])),
    worked(
      "Watch the method",
      "The rule is 'times by 3'. The first term is 2. Find the next three.",
      [
        { line: "$2 \\times 3 = 6$" },
        { line: "$6 \\times 3 = 18$", note: "Use the rule on each new term." },
        { line: "$18 \\times 3 = 54$" },
      ],
      "2, 6, 18, 54.",
    ),
    calc(
      "Your turn",
      "40, 34, 28, … Find the next two terms.",
      undefined,
      [
        ["The rule: take away", "6", "40 to 34, and 34 to 28."],
        ["Next term:", "22", "28 − 6."],
        ["Then:", "16", "22 − 6."],
      ],
      "22, 16.",
    ),

    calc(
      "Practise",
      "Find the 6th term of 7, 12, 17, …",
      undefined,
      [
        ["The rule: add", "5", "7 to 12, and 12 to 17."],
        ["4th: 22, 5th: 27, 6th:", "32", "Add 5 again."],
      ],
      "32.",
    ),
    ...owned(list, TERM, "Together", "Practise").filter((s) => s.kind === "fill"),
    questionSet(
      "Practise",
      "4, 10, 16, … Watch what changes.",
      [
        ask("What comes next?", "22", "Add 6.", "22.", { asks: "next term" }),
        ask("What is the rule? Add…", "6", "4 to 10 is 6.", "Add 6.", {
          asks: "rule",
          changed: "Now the rule.",
        }),
        ask("?, 10, 16, 22. What is the first term?", "4", "Go back: take 6.", "4.", {
          asks: "earlier term",
          changed: "Now go backwards.",
        }),
        ask("3, 6, 12, 24, … What comes next?", "48", "It doubles.", "48.", {
          asks: "next term",
          changed: "A times rule.",
        }),
      ],
      "Find the gap, check it, then use it: forwards or back.",
    ),

    questionSet(
      "Variation",
      "What comes next? Watch what changes.",
      [
        ask("2, 4, 8, … What comes next?", "16", "It doubles.", "16.", {
          asks: "next term",
          expect: [
            "Sam adds 2 to get 10. Is he right?",
            "No: it doubles, so 16",
            "4 to 8 adds 4, not 2. Check every gap: it doubles.",
            [["Yes", "Check the gap from 4 to 8."]],
          ],
        }),
        ask("2, 4, 6, … What comes next?", "8", "Add 2.", "8.", {
          asks: "next term",
          changed: "The gaps are all 2 now.",
        }),
        ask("1, 4, 9, 16, … What comes next?", "25", "The gaps are 3, 5, 7…", "25.", {
          asks: "next term",
          changed: "The gaps grow: 3, 5, 7.",
        }),
        ask("100, 90, 80, … What comes next?", "70", "Take away 10.", "70.", {
          asks: "next term",
          changed: "Going down.",
        }),
      ],
      "Check every gap before you use the rule.",
    ),
    own(list, TERM, "Spot the mistake"),

    own(list, TERM, "Exit check"),

    reworded(list, TERM, "Fence panels", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A term-to-term rule gets from one term to the next.**"],
      stacks([3, 5, 7, 9]),
      [
        "**A term-to-term rule gets from one term to the next.**",
        "Check every gap: 2, 4, 8 doubles; it doesn't add 2.",
        "3, 5, 7, 9: start at 3, add 2.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The nth term.

const NTH = "y7-equations/position-to-term";
const nthMethod = [
  "Put the position in for n.",
  "Work it out: times first.",
  "The number with n is the gap.",
];

const nthTerm = stepped(find(list, NTH), {
  method: nthMethod,
  variation: {
    relationship: "a position, the nth term rule, and the term",
    unknowns: ["term", "position", "nth term"],
    surface: ["the first term", "big positions", "taking away", "fences"],
  },
  screens: worded([
    explain(
      "The rule",
      "Any term at once",
      ["**The nth term jumps straight to any term.**"],
      nthTable("2n + 1", ["3", "5", "7"]),
      "The number with n is the jump between terms: here, 2.",
    ),
    reworded(list, NTH, "A machine for any term", { tag: "The rule" }),

    ...owned(list, NTH, "Warm-up", "Check you remember"),
    typed("Check you remember", "If $n = 4$, what is $3n$?", "12", "3 times 4.", "12."),

    methodCard("The method", nthMethod, nthTable("3n + 2", ["5", "8", "11"])),
    worked(
      "Watch the method",
      "The nth term is $3n + 2$. Find the 20th term.",
      [{ line: "$n = 20$", note: "The 20th term: n is 20." }, { line: "$3 \\times 20 + 2 = 62$" }],
      "62.",
    ),
    calc(
      "Your turn",
      "Find the 10th term of $3n + 2$.",
      undefined,
      [
        ["$3 \\times 10 =$", "30", "n is 10. Times first."],
        ["$30 + 2 =$", "32", "Then add 2."],
      ],
      "32.",
    ),

    calc(
      "Practise",
      "Find the 50th term of $2n - 5$.",
      undefined,
      [
        ["$2 \\times 50 =$", "100", "n is 50. Times first."],
        ["$100 - 5 =$", "95", "Then take 5."],
      ],
      "95.",
    ),
    ...owned(list, NTH, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("$4n + 1$: what is the 5th term?", "21", "4 × 5 + 1.", "21.", { asks: "term" }),
        ask("$10n - 3$: what is the 1st term?", "7", "10 × 1 − 3.", "7.", {
          asks: "term",
          changed: "A different rule, the first term.",
        }),
        ask("$2n + 1$: which term is 21?", "10", "2n + 1 = 21, so n = 10.", "The 10th.", {
          asks: "position",
          changed: "Now find the position.",
        }),
        ask("Which nth term gives 4, 7, 10, …?", "$3n + 1$", "The gap is 3.", "$3n + 1$.", {
          asks: "nth term",
          changed: "Now find the rule.",
          others: ["$n + 3$", "$4n$"],
          picture: nthTable("?", ["4", "7", "10"]),
        }),
      ],
      "Put n in to find a term; the gap gives the number with n.",
    ),

    questionSet(
      "Variation",
      "Find each term. Watch what changes.",
      [
        ask("$3n + 4$: what is the 1st term?", "7", "3 × 1 + 4.", "7.", {
          asks: "term",
          expect: [
            "Kim writes 34 for the 1st term. Is she right?",
            "No: it's 7",
            "$3n$ is 3 times n: 3 × 1 + 4 = 7.",
            [["Yes", "$3n$ means 3 × n, not the digits 3 and 1."]],
          ],
        }),
        ask("$3n + 4$: what is the 2nd term?", "10", "3 × 2 + 4.", "10.", {
          asks: "term",
          changed: "The next position.",
        }),
        ask("$3n - 4$: what is the 1st term?", "-1", "3 × 1 − 4.", "−1.", {
          asks: "term",
          changed: "Take away instead.",
        }),
        ask("$4n + 3$: what is the 100th term?", "403", "4 × 100 + 3.", "403.", {
          asks: "term",
          changed: "A big position.",
        }),
      ],
      "n is the position, whatever the rule.",
    ),
    own(list, NTH, "Spot the mistake"),

    own(list, NTH, "Exit check"),

    reworded(list, NTH, "The 100th panel", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The nth term jumps straight to any term.**"],
      nthTable("2n + 1", ["3", "5", "7"]),
      [
        "**The nth term jumps straight to any term.**",
        "Put the position in for n: $3n + 2$, 20th term is 62.",
        "The number with n is the gap between terms.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// One-step equations.

const ONE = "y7-equations/one-step";
const oneMethod = [
  "See what's done to x.",
  "Do the inverse to both sides.",
  "Check: put x back in.",
];

const oneStep = stepped(find(list, ONE), {
  method: oneMethod,
  variation: {
    relationship: "an equation and the value of x that balances it",
    unknowns: ["add", "subtract", "times", "divide"],
    surface: ["x on the right", "the number first", "dividing", "weights"],
  },
  screens: worded([
    explain(
      "The rule",
      "Balancing equations",
      ["**An equation is a balance: do the same to both sides.**"],
      maths("x + 4 = 9 \\;\\Rightarrow\\; x = 9 - 4 = 5"),
      "Undo what's done to x with its inverse.",
    ),
    reworded(list, ONE, "Solve $x + 4 = 9$", { tag: "The rule" }, "Discover"),

    ...owned(list, ONE, "Warm-up", "Check you remember"),
    choose("Check you remember", "What undoes × 5?", "÷ 5", "Divide undoes times.", [
      ["− 5", "Take away undoes add."],
      ["+ 5", "That adds more."],
    ]),

    methodCard("The method", oneMethod, maths("5x = 35 \\;\\Rightarrow\\; x = 7")),
    worked(
      "Watch the method",
      "Solve $5x = 35$.",
      [
        { line: "$5x$ means $5 \\times x$", note: "So divide to undo it." },
        { line: "$\\frac{5x}{5} = \\frac{35}{5}$" },
        { line: "$x = 7$" },
      ],
      "$x = 7$. Check: 5 × 7 = 35.",
    ),
    calc(
      "Your turn",
      "Solve $x - 6 = 10$.",
      undefined,
      [
        ["Add 6 to both sides: $x =$", "16", "Adding undoes − 6."],
        ["Check: $16 - 6 =$", "10", "Put x back in."],
      ],
      "$x = 16$.",
    ),

    calc(
      "Practise",
      "Solve $\\frac{x}{3} = 7$.",
      undefined,
      [
        ["Times both sides by 3: $x =$", "21", "Times undoes ÷ 3."],
        ["Check: $21 \\div 3 =$", "7", "Put x back in."],
      ],
      "$x = 21$.",
    ),
    ...owned(list, ONE, "Together", "Practise").filter((s) => s.kind === "balance"),
    questionSet(
      "Practise",
      "Solve each one. Watch what changes.",
      [
        ask("Solve $x + 12 = 30$.", "18", "Take 12 from both sides.", "$x = 18$.", { asks: "add" }),
        ask("Solve $x - 4 = 9$.", "13", "Add 4 to both sides.", "$x = 13$.", {
          asks: "subtract",
          changed: "Take away instead of add.",
        }),
        ask("Solve $6x = 42$.", "7", "Divide both sides by 6.", "$x = 7$.", {
          asks: "times",
          changed: "Now times.",
        }),
        ask("Solve $\\frac{x}{4} = 5$.", "20", "Times both sides by 4.", "$x = 20$.", {
          asks: "divide",
          changed: "Now divide.",
        }),
      ],
      "Whatever is done to x, do the inverse to both sides.",
    ),

    questionSet(
      "Variation",
      "Solve each one. Watch what changes.",
      [
        ask("Solve $4x = 20$.", "5", "Divide both sides by 4.", "$x = 5$.", {
          asks: "times",
          expect: [
            "Ali takes 4 from both sides. Is that right?",
            "No: divide by 4",
            "$4x$ is 4 times x, so divide: x = 5.",
            [["Yes", "Take away undoes add, not times."]],
          ],
        }),
        ask("Solve $20 = 4x$.", "5", "Divide both sides by 4.", "$x = 5$.", {
          asks: "times",
          changed: "x is on the right now.",
        }),
        ask("Solve $4 + x = 20$.", "16", "Take 4 from both sides.", "$x = 16$.", {
          asks: "add",
          changed: "The number comes first.",
        }),
        ask("Solve $\\frac{x}{4} = 20$.", "80", "Times both sides by 4.", "$x = 80$.", {
          asks: "divide",
          changed: "Divided by 4 this time.",
        }),
      ],
      "Find what's done to x, wherever it sits, and undo it.",
    ),
    own(list, ONE, "Spot the mistake"),

    own(list, ONE, "Exit check"),

    reworded(list, ONE, "The mystery weight", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**An equation is a balance: do the same to both sides.**"],
      maths("x + 4 = 9 \\;\\Rightarrow\\; x = 5"),
      [
        "**An equation is a balance: do the same to both sides.**",
        "Undo + with −, and × with ÷.",
        "$5x = 35$: divide both sides by 5, $x = 7$.",
        "Check: put x back in.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Two-step equations.

const TWO = "y7-equations/two-step";
const twoMethod = [
  "Undo the + or − on both sides.",
  "Undo the × or ÷ on both sides.",
  "Check: put x back in.",
];

const twoStep = stepped(find(list, TWO), {
  method: twoMethod,
  variation: {
    relationship: "a two-step equation and the value of x that balances it",
    unknowns: ["plus", "minus", "divide"],
    surface: ["the order of undoing", "brackets", "x on the right", "negative answers", "taxis"],
  },
  screens: worded([
    explain(
      "The rule",
      "Two-step equations",
      ["**Undo in reverse: the + or − first, then the ×.**"],
      maths("2x + 3 = 17 \\;\\Rightarrow\\; 2x = 14 \\;\\Rightarrow\\; x = 7"),
      "The last thing done to x comes off first.",
    ),
    reworded(list, TWO, "Solve $2x + 5 = 17$", { tag: "The rule" }, "Discover"),

    ...owned(list, TWO, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $3 \\times 5 + 2$?", "17", "× first.", "17."),

    methodCard(
      "The method",
      twoMethod,
      maths("3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5"),
    ),
    worked(
      "Watch the method",
      "Solve $3x - 4 = 11$.",
      [
        { line: "Add 4 to both sides: $3x = 15$", note: "The − 4 comes off first." },
        { line: "Divide both sides by 3: $x = 5$" },
        { line: "Check: $3 \\times 5 - 4 = 11$" },
      ],
      "$x = 5$.",
    ),
    calc(
      "Your turn",
      "Solve $2x + 7 = 19$.",
      undefined,
      [
        ["Take 7 from both sides: $2x =$", "12", "The + 7 comes off first."],
        ["Divide both sides by 2: $x =$", "6", "Then undo the × 2."],
      ],
      "$x = 6$.",
    ),

    calc(
      "Practise",
      "Solve $\\frac{x}{4} + 2 = 5$.",
      undefined,
      [
        ["Take 2 from both sides: $\\frac{x}{4} =$", "3", "The + 2 first."],
        ["Times both sides by 4: $x =$", "12", "Then undo the ÷ 4."],
      ],
      "$x = 12$.",
    ),
    ...owned(list, TWO, "Together", "Practise"),
    questionSet(
      "Practise",
      "Solve each one. Watch what changes.",
      [
        ask("Solve $3x + 2 = 20$.", "6", "Take 2, then divide by 3.", "$x = 6$.", { asks: "plus" }),
        ask("Solve $5x - 1 = 24$.", "5", "Add 1, then divide by 5.", "$x = 5$.", {
          asks: "minus",
          changed: "Take away instead of add.",
        }),
        ask("Solve $\\frac{x}{2} - 3 = 4$.", "14", "Add 3, then times by 2.", "$x = 14$.", {
          asks: "divide",
          changed: "Now x is divided.",
        }),
        ask("Solve $2x + 10 = 10$.", "0", "Take 10: $2x = 0$.", "$x = 0$.", {
          asks: "plus",
          changed: "The answer is 0.",
        }),
      ],
      "The + or − comes off first, then the × or ÷.",
    ),

    questionSet(
      "Variation",
      "Solve each one. Watch what changes.",
      [
        ask("Solve $3x + 6 = 21$.", "5", "Take 6, then divide by 3.", "$x = 5$.", {
          asks: "plus",
          expect: [
            "Tom divides by 3 first: $x + 6 = 7$. Is that right?",
            "No",
            "Dividing by 3 divides the 6 too. Take 6 first.",
            [["Yes", "21 ÷ 3 is 7, but 6 ÷ 3 is 2, not 6."]],
          ],
        }),
        ask("Solve $3(x + 6) = 21$.", "1", "Divide by 3 first: $x + 6 = 7$.", "$x = 1$.", {
          asks: "plus",
          changed: "Brackets: now the × comes off first.",
          expect: [
            "In $3(x + 6)$, which was done last?",
            "the × 3",
            "The bracket is worked out, then times 3, so divide first.",
            [["the + 6", "The + 6 is inside the bracket: it came first."]],
          ],
        }),
        ask("Solve $21 = 3x + 6$.", "5", "Take 6, then divide by 3.", "$x = 5$.", {
          asks: "plus",
          changed: "x is on the right.",
        }),
        ask("Solve $3x + 6 = 0$.", "-2", "Take 6: $3x = -6$.", "$x = -2$.", {
          asks: "plus",
          changed: "A negative answer.",
        }),
      ],
      "Undo in reverse order: what was done last comes off first.",
    ),
    own(list, TWO, "Spot the mistake"),

    own(list, TWO, "Exit check"),

    reworded(list, TWO, "A taxi ride", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Undo in reverse: the + or − first, then the ×.**"],
      maths("2x + 3 = 17 \\;\\Rightarrow\\; 2x = 14 \\;\\Rightarrow\\; x = 7"),
      [
        "**Undo in reverse: the + or − first, then the ×.**",
        "$3x - 4 = 11$: add 4, $3x = 15$; divide by 3, $x = 5$.",
        "Brackets change the order: $3(x + 6) = 21$, divide first.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7EquationsStepped: [string, UnitLesson[]][] = [
  [TERM, [termToTerm]],
  [NTH, [nthTerm]],
  [ONE, [oneStep]],
  [TWO, [twoStep]],
];
