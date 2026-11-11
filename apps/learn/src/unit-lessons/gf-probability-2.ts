// GCSE Foundation, "Probability 2", as five short lessons, one just before each skill: Venn
// diagrams and set notation, probability trees, sample spaces, independent events and dependent
// events. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common
// mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gf-probability-2";
const P = (x: number, y: number): Point => ({ x, y });

/**
 * A two-stage probability tree. `first` labels the two first branches and their outcomes;
 * `second` the four second branches, top to bottom. Probabilities sit beside each branch.
 */
function probabilityTree(
  first: [prob: string, name: string][],
  second: [prob: string, name: string][],
): DrawingPic {
  const mid = [P(3, 4.4), P(3, 1.6)];
  const leaves = [P(6.6, 5.4), P(6.6, 3.6), P(6.6, 2.4), P(6.6, 0.6)];
  const items: DrawingPic["items"] = [];
  mid.forEach((m, i) => {
    const [prob, name] = first[i] ?? ["", ""];
    items.push(
      { line: [P(0, 3), P(m.x - 0.6, m.y)] },
      { text: prob, at: P(1.1, i === 0 ? 4.2 : 1.8) },
      { text: name, at: P(m.x, m.y) },
    );
  });
  leaves.forEach((l, i) => {
    const m = mid[i < 2 ? 0 : 1] ?? P(3, 3);
    const [prob, name] = second[i] ?? ["", ""];
    items.push(
      { line: [P(m.x + 0.6, m.y), P(l.x - 0.9, l.y)] },
      { text: prob, at: P(4.6, (m.y + l.y) / 2 + (l.y > m.y ? 0.45 : -0.45)) },
      { text: name, at: P(l.x, l.y) },
    );
  });
  return { kind: "drawing", items };
}

const coinTree = probabilityTree(
  [
    ["½", "H"],
    ["½", "T"],
  ],
  [
    ["½", "H"],
    ["½", "T"],
    ["½", "H"],
    ["½", "T"],
  ],
);
const busTree = probabilityTree(
  [
    ["0.3", "Late"],
    ["0.7", "On time"],
  ],
  [
    ["0.3", "Late"],
    ["0.7", "On time"],
    ["0.3", "Late"],
    ["0.7", "On time"],
  ],
);
const sweetTree = probabilityTree(
  [
    ["3/5", "Red"],
    ["2/5", "Green"],
  ],
  [
    ["2/4", "Red"],
    ["2/4", "Green"],
    ["3/4", "Red"],
    ["1/4", "Green"],
  ],
);
const sports: Picture = {
  kind: "venn",
  a: "Football",
  b: "Tennis",
  onlyA: ["12"],
  both: ["5"],
  onlyB: ["8"],
  // A thin space keeps this 5 distinct from the 5 in the overlap: Venn values must be unique.
  neither: ["5\u2009"],
};
const spinnerDice: Picture = {
  kind: "grid",
  cols: 6,
  rows: 3,
  shaded: 0,
  colLabels: ["1", "2", "3", "4", "5", "6"],
  rowLabels: ["A", "B", "C"],
  values: [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
  ],
};

export const gfProbability2: UnitLesson[] = [
  lesson(
    U,
    "venn",
    "GF-P6.b",
    "Venn diagrams and set notation",
    "Read A ∩ B, A ∪ B and A′ from a Venn diagram.",
    [
      problem(
        "Football and tennis",
        [
          "30 pupils were asked which sports they play. The Venn diagram shows the results. “A pupil is chosen at random. Find P(Football ∩ Tennis).”",
          "By the end of this lesson, you can read set notation and find probabilities like this.",
        ],
        sports,
      ),
      typed("Warm-up", "How many pupils play only football?", "12", "Left part only.", "12.", {
        picture: sports,
      }),
      typed("Warm-up", "How many play both?", "5", "The overlap.", "5.", { picture: sports }),
      explain(
        "Discover",
        "The symbols",
        [
          "**A ∩ B** (A and B): the overlap. **A ∪ B** (A or B, or both): everything inside either circle. **A′** (not A): everything outside circle A.",
          "**ξ** is the universal set: everyone. Add every number in the box to check the total.",
        ],
        sports,
      ),
      choose(
        "Discover",
        "Football ∪ Tennis contains",
        "25 pupils",
        "12 + 5 + 8.",
        [
          ["20", "Don't forget the overlap."],
          ["30", "That includes the 5 outside."],
        ],
        { picture: sports },
      ),
      worked(
        "The question",
        "Find P(Football ∩ Tennis).",
        [
          ["Overlap: 5", "Both."],
          ["Total: 12 + 5 + 8 + 5 = 30", "Everyone."],
          ["P = $\\frac{5}{30} = \\frac16$", "Simplify."],
        ],
        "Probability = number in the region ÷ total.",
        sports,
      ),
      steps(
        "Together",
        "Find P(Football′)",
        "Not football.",
        [
          ["Outside the football circle:", "8 + 5 = 13", ["5", "Include tennis only too."], "13"],
          [
            "P(Football′) =",
            "$\\frac{13}{30}$",
            ["$\\frac{13}{17}$", "Out of everyone."],
            "$\\frac{13}{30}$",
          ],
        ],
        "Check: $\\frac{17}{30} + \\frac{13}{30} = 1$.",
        sports,
      ),
      choose(
        "Together",
        "Which region is Tennis ∩ Football′?",
        "Tennis only: 8",
        "Tennis but not football.",
        [
          ["The overlap: 5", "That's football too."],
          ["Outside both: 5", "Not tennis."],
        ],
        { picture: sports },
      ),
      typed(
        "Your turn",
        "P(Tennis), as a fraction",
        "13/30",
        "8 + 5 in tennis.",
        "$\\frac{13}{30}$.",
        { picture: sports, wrong: [["8/30", "Include the overlap."]] },
      ),
      typed("Your turn", "P(neither sport), simplified", "1/6", "5 out of 30.", "$\\frac16$.", {
        picture: sports,
      }),
      choose(
        "Watch out",
        "Ivy says Football has 12 pupils. What's wrong?",
        "The football circle includes the overlap: 17",
        "12 + 5.",
        [["Nothing", "12 is football only."]],
      ),
      mistake(
        "Ben finds n(Football ∪ Tennis).",
        ["Football: 17", "Tennis: 13", "17 + 13 = 30"],
        2,
        "The 5 in both are counted twice: 25.",
      ),
      typed(
        "Back to the problem",
        "“Find P(Football ∩ Tennis).” Simplified.",
        "1/6",
        "5 out of 30.",
        "$\\frac16$.",
        { picture: sports, wrong: [["5/25", "Out of all 30."]] },
      ),
      quiz([
        [
          ["A ∩ B means", "in A and B", ["in A or B", "not in A"], "Overlap."],
          ["A ∪ B means", "in A or B or both", ["in both only", "in neither"], "Union."],
        ],
        [
          ["A′ means", "not in A", ["in A", "in A and B"], "Complement."],
          ["ξ means", "everything", ["the overlap", "nothing"], "Universal set."],
        ],
        [
          ["n(A) = 10, n(B) = 8, n(A ∩ B) = 3. n(A ∪ B)?", "15", ["18", "21"], "10 + 8 − 3."],
          ["n(A) = 9, n(B) = 6, n(A ∩ B) = 2. n(A ∪ B)?", "13", ["15", "17"], "9 + 6 − 2."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "trees",
    "GF-P6.c",
    "Probability trees",
    "Multiply along the branches, add between outcomes.",
    [
      problem(
        "The late bus",
        [
          "The bus is late with probability 0.3 each day. “Draw a tree diagram for Monday and Tuesday. Find the probability it is late on exactly one day.”",
          "By the end of this lesson, you can draw and use a probability tree.",
        ],
        busTree,
      ),
      typed("Warm-up", "$0.3 \\times 0.7$", "0.21", "Multiply.", "0.21."),
      typed("Warm-up", "P(not late) if P(late) = 0.3", "0.7", "$1 - 0.3$.", "0.7."),
      explain(
        "Discover",
        "Along, then add",
        [
          "Each set of branches from a point adds to 1. To find the probability of a path, **multiply along** the branches.",
          "If more than one path gives what you want, **add** their probabilities.",
        ],
        coinTree,
      ),
      choose(
        "Discover",
        "Two coins: P(H then H)",
        "$\\frac14$",
        "$\\frac12 \\times \\frac12$.",
        [
          ["$\\frac12$", "Multiply along."],
          ["1", "Don't add along a path."],
        ],
        { picture: coinTree },
      ),
      worked(
        "The bus",
        "P(late on exactly one day)?",
        [
          ["Late, on time: $0.3 \\times 0.7 = 0.21$", "Path 1."],
          ["On time, late: $0.7 \\times 0.3 = 0.21$", "Path 2."],
          ["$0.21 + 0.21 = 0.42$", "Add the paths."],
        ],
        "Exactly one: two paths.",
        busTree,
      ),
      steps(
        "Together",
        "P(late on at least one day)",
        "Use the complement.",
        [
          ["P(on time both days):", "0.49", ["1.4", "Multiply: $0.7 \\times 0.7$."], "0.49"],
          ["P(at least one late):", "0.51", ["0.49", "$1 - 0.49$."], "0.51"],
        ],
        "‘At least one’: 1 − P(none).",
        busTree,
      ),
      choose(
        "Together",
        "P(late both days)",
        "0.09",
        "$0.3 \\times 0.3$.",
        [
          ["0.6", "Multiply, don't add."],
          ["0.3", "Two days."],
        ],
        { picture: busTree },
      ),
      typed("Your turn", "P(on time both days)", "0.49", "$0.7 \\times 0.7$.", "0.49.", {
        picture: busTree,
      }),
      choose("Your turn", "Check: the four paths add to", "1", "0.09 + 0.21 + 0.21 + 0.49.", [
        ["2", "All outcomes add to 1."],
      ]),
      choose(
        "Watch out",
        "Raj adds along a path: 0.3 + 0.3. What's wrong?",
        "Multiply along a path",
        "Both must happen.",
        [["Nothing", "0.6 for both would be too likely."]],
      ),
      mistake(
        "Kim finds P(late on exactly one day).",
        ["Late, on time: 0.21", "That's the answer", "0.21"],
        1,
        "On time then late is another path: 0.42.",
      ),
      typed(
        "Back to the problem",
        "“Find the probability it is late on exactly one day.”",
        "0.42",
        "Two paths of 0.21.",
        "0.42.",
        { picture: busTree, wrong: [["0.21", "There are two paths."]] },
      ),
      quiz([
        [
          ["P(A) = 0.4. Two days: P(A both)", "0.16", ["0.8", "0.4"], "$0.4^2$."],
          ["P(A) = 0.5. Two days: P(A both)", "0.25", ["1", "0.5"], "$0.5^2$."],
        ],
        [
          ["Branches from one point add to", "1", ["0", "2"], "Every outcome."],
          ["Along a path you", "multiply", ["add", "subtract"], "And."],
        ],
        [
          [
            "P(rain) = 0.2. P(rain on at least one of two days)",
            "0.36",
            ["0.4", "0.04"],
            "$1 - 0.8^2$.",
          ],
          ["P(win) = 0.1. P(win at least one of two)", "0.19", ["0.2", "0.01"], "$1 - 0.9^2$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sample-spaces",
    "GF-P7",
    "Sample spaces",
    "List every equally likely outcome, then count.",
    [
      problem(
        "Spinner and dice",
        [
          "A spinner shows A, B or C. A dice shows 1 to 6. Both are used once. “Find the probability of getting B and an even number.”",
          "By the end of this lesson, you can list all the outcomes and count them.",
        ],
        spinnerDice,
      ),
      typed("Warm-up", "Outcomes for one dice", "6", "1 to 6.", "6."),
      typed("Warm-up", "$3 \\times 6$", "18", "Multiply.", "18."),
      explain(
        "Discover",
        "All the outcomes",
        [
          "A **sample space** lists every possible outcome. For two events, a grid (or a list) works best.",
          "The number of outcomes is the product: 3 spinner results × 6 dice results = 18 outcomes.",
        ],
        spinnerDice,
      ),
      choose("Discover", "How many outcomes for two coins?", "4", "HH, HT, TH, TT.", [
        ["3", "HT and TH are different."],
        ["2", "Two each."],
      ]),
      worked(
        "The question",
        "P(B and even)?",
        [
          ["B2, B4, B6: 3 outcomes", "Find them."],
          ["Out of 18", "All outcomes."],
          ["P = $\\frac{3}{18} = \\frac16$", "Simplify."],
        ],
        "Count the matching outcomes.",
        spinnerDice,
      ),
      steps(
        "Together",
        "P(A or a 6)",
        "Count carefully.",
        [
          ["A row: A1 to A6", "6", ["1", "A with any number."], "6"],
          ["Plus the other 6s:", "B6, C6: 8 in total", ["9", "Don't count A6 twice."], "8"],
        ],
        "P = $\\frac{8}{18} = \\frac49$.",
        spinnerDice,
      ),
      choose("Together", "Two dice: how many outcomes?", "36", "6 × 6.", [
        ["12", "6 + 6 is not the count."],
        ["11", "That's the totals 2 to 12."],
      ]),
      typed("Your turn", "Two dice: how many ways to total 7?", "6", "1+6, 2+5, … 6+1.", "6."),
      typed("Your turn", "So P(total 7), simplified", "1/6", "6 out of 36.", "$\\frac16$."),
      choose(
        "Watch out",
        "Ed says P(total 12) = $\\frac{1}{11}$, as there are 11 totals. What's wrong?",
        "Totals aren't equally likely: 12 is 1 way in 36",
        "$\\frac{1}{36}$.",
        [["Nothing", "7 is much likelier than 12."]],
      ),
      mistake(
        "Zoe lists outcomes for a coin and a spinner (1, 2, 3).",
        ["H1, H2, H3", "T1, T2", "5 outcomes"],
        1,
        "T3 is missing: 6 outcomes.",
      ),
      typed(
        "Back to the problem",
        "“Find the probability of getting B and an even number.”",
        "1/6",
        "3 out of 18.",
        "$\\frac16$.",
        { picture: spinnerDice, wrong: [["3/6", "Out of all 18."]] },
      ),
      quiz([
        [
          ["Coin and dice: outcomes", "12", ["8", "6"], "2 × 6."],
          ["Two spinners, 1–4 each: outcomes", "16", ["8", "4"], "4 × 4."],
        ],
        [
          [
            "Two dice: P(double)",
            "$\\frac16$",
            ["$\\frac{1}{36}$", "$\\frac{1}{12}$"],
            "6 doubles.",
          ],
          [
            "Two dice: P(total 2)",
            "$\\frac{1}{36}$",
            ["$\\frac{1}{11}$", "$\\frac16$"],
            "Only 1+1.",
          ],
        ],
        [
          [
            "Coin and dice: P(H and 5)",
            "$\\frac{1}{12}$",
            ["$\\frac18$", "$\\frac23$"],
            "1 in 12.",
          ],
          [
            "Coin and dice: P(T and odd)",
            "$\\frac14$",
            ["$\\frac12$", "$\\frac{1}{12}$"],
            "3 in 12.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "independent",
    "GF-P8.a",
    "Independent events",
    "If one doesn't affect the other, P(A and B) = P(A) × P(B).",
    [
      problem("Penalties", [
        "Ana scores a penalty with probability 0.8. Each kick is independent. “Find the probability she scores all three of her next three penalties.”",
        "By the end of this lesson, you can find probabilities of independent events.",
      ]),
      typed("Warm-up", "$0.8 \\times 0.8$", "0.64", "Multiply.", "0.64."),
      typed("Warm-up", "$0.64 \\times 0.8$", "0.512", "Multiply.", "0.512."),
      explain("Discover", "Not affecting each other", [
        "Events are **independent** if one happening doesn't change the probability of the other: coin flips, separate dice rolls, replaced cards.",
        "For independent events: **P(A and B) = P(A) × P(B)**.",
      ]),
      choose(
        "Discover",
        "Which are independent?",
        "Rolling a 6, then flipping heads",
        "Neither affects the other.",
        [
          ["Taking two sweets without replacing", "The first changes the second."],
          ["Rain and carrying an umbrella", "Rain makes umbrellas likelier."],
        ],
      ),
      worked(
        "Ana",
        "P(scores all three)?",
        [
          ["$0.8 \\times 0.8 \\times 0.8$", "Independent."],
          ["$= 0.512$", "Multiply."],
        ],
        "About a 51% chance.",
      ),
      steps(
        "Together",
        "P(misses all three)",
        "Miss first.",
        [
          ["P(miss) =", "0.2", ["0.8", "$1 - 0.8$."], "0.2"],
          ["P(miss all three) =", "0.008", ["0.6", "Multiply: $0.2^3$."], "0.008"],
        ],
        "Very unlikely.",
      ),
      choose(
        "Together",
        "A dice is rolled twice. P(6 both times)",
        "$\\frac{1}{36}$",
        "$\\frac16 \\times \\frac16$.",
        [
          ["$\\frac13$", "Don't add."],
          ["$\\frac{1}{12}$", "$6 \\times 6 = 36$."],
        ],
      ),
      typed("Your turn", "P(head) = 0.5. P(three heads in a row)", "0.125", "$0.5^3$.", "0.125."),
      typed("Your turn", "P(Ana scores at least one of three)", "0.992", "$1 - 0.008$.", "0.992.", {
        wrong: [["0.512", "That's all three."]],
      }),
      choose(
        "Watch out",
        "After 5 heads, Ben says tails is ‘due’. What's wrong?",
        "Flips are independent: still ½",
        "The coin has no memory.",
        [["Nothing", "Each flip is ½."]],
      ),
      mistake(
        "Kim finds P(Ana scores both of two).",
        ["P(score) = 0.8", "$0.8 + 0.8$", "= 1.6"],
        1,
        "Multiply: 0.64. A probability can't be over 1.",
      ),
      typed(
        "Back to the problem",
        "“Find the probability she scores all three.”",
        "0.512",
        "$0.8^3$.",
        "0.512.",
        { wrong: [["2.4", "Multiply, don't add."]] },
      ),
      quiz([
        [
          ["P(A) = 0.3, P(B) = 0.5, independent. P(A and B)", "0.15", ["0.8", "0.2"], "Multiply."],
          ["P(A) = 0.6, P(B) = 0.5, independent. P(A and B)", "0.3", ["1.1", "0.1"], "Multiply."],
        ],
        [
          [
            "Independent means",
            "one doesn't affect the other",
            ["they can't both happen", "they're equally likely"],
            "No effect.",
          ],
          ["A coin after 3 tails: P(H)", "½", ["more than ½", "less than ½"], "No memory."],
        ],
        [
          ["P(red light) = 0.4. Two lights: P(both red)", "0.16", ["0.8", "0.4"], "$0.4^2$."],
          ["P(red light) = 0.4. Two lights: P(neither red)", "0.36", ["0.6", "0.2"], "$0.6^2$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "dependent",
    "GF-P8.b",
    "Dependent events",
    "Without replacement, the second probabilities change.",
    [
      problem(
        "Sweets from a bag",
        [
          "A bag has 3 red and 2 green sweets. Tom takes one, eats it, then takes another. “Find the probability both are red.”",
          "By the end of this lesson, you can handle probabilities that change.",
        ],
        sweetTree,
      ),
      typed("Warm-up", "P(red first)", "3/5", "3 of 5.", "$\\frac35$."),
      typed(
        "Warm-up",
        "$\\frac35 \\times \\frac24$, simplified",
        "3/10",
        "$\\frac{6}{20}$.",
        "$\\frac{3}{10}$.",
      ),
      explain(
        "Discover",
        "One fewer each time",
        [
          "Taking without replacing changes the bag: one fewer sweet in total, and one fewer of the colour taken.",
          "These are **dependent** events. Second-branch probabilities depend on the first outcome.",
        ],
        sweetTree,
      ),
      choose("Discover", "After a red is eaten, P(red next)", "$\\frac24$", "2 red left of 4.", [
        ["$\\frac35$", "The bag has changed."],
        ["$\\frac34$", "That's after a green."],
      ]),
      worked(
        "Both red",
        "P(red then red)?",
        [
          ["$\\frac35 \\times \\frac24$", "Along the top path."],
          ["$= \\frac{6}{20} = \\frac{3}{10}$", "Simplify."],
        ],
        "Compare with replacement: $\\frac{9}{25}$.",
        sweetTree,
      ),
      steps(
        "Together",
        "P(one of each colour)",
        "Two paths.",
        [
          [
            "Red then green:",
            "$\\frac{6}{20}$",
            ["$\\frac{6}{25}$", "Out of 4 the second time."],
            "$\\frac35 \\times \\frac24$",
          ],
          [
            "Green then red:",
            "$\\frac{6}{20}$, total $\\frac{12}{20} = \\frac35$",
            ["$\\frac{6}{20}$ only", "Add both paths."],
            "$\\frac35$",
          ],
        ],
        "Two paths: add them.",
        sweetTree,
      ),
      choose(
        "Together",
        "P(both green)",
        "$\\frac{1}{10}$",
        "$\\frac25 \\times \\frac14$.",
        [
          ["$\\frac{4}{25}$", "That's with replacement."],
          ["$\\frac15$", "Multiply along."],
        ],
        { picture: sweetTree },
      ),
      typed(
        "Your turn",
        "4 blue, 1 yellow, no replacement. P(blue, blue), simplified",
        "3/5",
        "$\\frac45 \\times \\frac34$.",
        "$\\frac35$.",
      ),
      choose(
        "Your turn",
        "A card is taken from a pack and not replaced. The second draw is",
        "dependent",
        "The pack has changed.",
        [["independent", "One card fewer."]],
      ),
      choose(
        "Watch out",
        "Ivy uses $\\frac35 \\times \\frac35$ for two reds without replacement. What's wrong?",
        "After one red, it's 2 out of 4",
        "Change the second fraction.",
        [["Nothing", "That's with replacement."]],
      ),
      mistake(
        "Leo finds P(green, green) without replacement.",
        ["First: $\\frac25$", "Second: $\\frac24$", "$\\frac{4}{20} = \\frac15$"],
        1,
        "Only 1 green is left out of 4: $\\frac14$. So $\\frac{1}{10}$.",
      ),
      typed(
        "Back to the problem",
        "“Find the probability both are red.” Simplified.",
        "3/10",
        "$\\frac35 \\times \\frac24$.",
        "$\\frac{3}{10}$.",
        { picture: sweetTree, wrong: [["9/25", "That's with replacement."]] },
      ),
      quiz([
        [
          [
            "5 red, 5 blue, no replacement. P(red, red)",
            "$\\frac29$",
            ["$\\frac14$", "$\\frac{1}{2}$"],
            "$\\frac{5}{10} \\times \\frac49$.",
          ],
          [
            "6 red, 4 blue, no replacement. P(red, red)",
            "$\\frac13$",
            ["$\\frac{9}{25}$", "$\\frac35$"],
            "$\\frac{6}{10} \\times \\frac59$.",
          ],
        ],
        [
          [
            "Without replacement, the second total",
            "goes down by 1",
            ["stays the same", "goes up by 1"],
            "One taken.",
          ],
          [
            "With replacement, events are",
            "independent",
            ["dependent", "impossible"],
            "Bag restored.",
          ],
        ],
        [
          [
            "2 red, 1 blue. No replacement. P(blue, blue)",
            "0",
            ["$\\frac19$", "$\\frac13$"],
            "Only one blue.",
          ],
          [
            "3 red, 1 blue. No replacement. P(blue, blue)",
            "0",
            ["$\\frac{1}{16}$", "$\\frac14$"],
            "Only one blue.",
          ],
        ],
      ]),
    ],
  ),
];
