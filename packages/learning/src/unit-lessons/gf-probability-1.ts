// GCSE Foundation, "Probability", as six short lessons, one just before each skill: recording
// outcomes in tables and frequency trees, fairness and expected outcomes, relative frequency on
// the 0 to 1 scale, probabilities that sum to 1, why bigger samples are better, and listing
// outcomes in tables and grids. Each recaps the Key Stage 3 idea quickly, builds it to GCSE
// level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gf-probability-1";
const P = (x: number, y: number): Point => ({ x, y });

/** A frequency tree: a total, split two ways, each split two ways again. */
function frequencyTree(
  total: string,
  first: [string, string],
  second: [string, string, string, string],
): DrawingPic {
  const root = P(0, 3);
  const mid = [P(3, 4.6), P(3, 1.4)];
  const leaves = [P(6.6, 5.4), P(6.6, 3.8), P(6.6, 2.2), P(6.6, 0.6)];
  const items: DrawingPic["items"] = [{ text: total, at: P(-0.4, 3) }];
  mid.forEach((m, i) => {
    items.push({ line: [P(0.4, 3), P(m.x - 0.9, m.y)] }, { text: first[i] ?? "", at: P(m.x, m.y) });
  });
  leaves.forEach((l, i) => {
    const m = mid[i < 2 ? 0 : 1] ?? root;
    items.push(
      { line: [P(m.x + 0.9, m.y), P(l.x - 1.6, l.y)] },
      { text: second[i] ?? "", at: P(l.x, l.y) },
    );
  });
  return { kind: "drawing", items };
}

const totals = Array.from({ length: 36 }, (_, i) => String(Math.floor(i / 6) + (i % 6) + 2));
const dice: Picture = {
  kind: "grid",
  cols: 6,
  rows: 6,
  shaded: 0,
  colLabels: ["1", "2", "3", "4", "5", "6"],
  rowLabels: ["1", "2", "3", "4", "5", "6"],
  values: totals,
};

export const gfProbability1: UnitLesson[] = [
  lesson(
    U,
    "frequency-trees",
    "GF-P1",
    "Tables and frequency trees",
    "Record outcomes in two-way tables and frequency trees, and read them.",
    [
      problem(
        "The school trip",
        [
          "100 pupils chose a trip: 60 are boys. 35 of the boys chose the zoo; 25 of the girls chose the zoo. The rest chose the museum.",
          "“Complete the frequency tree” and “How many girls chose the museum?” By the end of this lesson, you can do both.",
        ],
        frequencyTree("100", ["60 boys", "40 girls"], ["35 zoo", "? museum", "25 zoo", "? museum"]),
      ),
      typed("Warm-up", "Work out $100 - 60$", "40", "Subtract.", "40."),
      typed("Warm-up", "Work out $60 - 35$", "25", "Subtract.", "25."),
      explain(
        "Discover",
        "Each split adds up",
        [
          "A **frequency tree** splits a total into groups, then splits each group again. The numbers on each split add up to the number before it.",
          "A **two-way table** holds the same information in rows and columns, with totals.",
        ],
        {
          kind: "table",
          head: ["", "Zoo", "Museum", "Total"],
          rows: [
            ["Boys", "35", "25", "60"],
            ["Girls", "25", "15", "40"],
            ["Total", "60", "40", "100"],
          ],
        },
      ),
      choose("Discover", "In the tree, girls who chose the museum", "15", "$40 - 25$.", [
        ["25", "25 girls chose the zoo."],
        ["65", "Use the girls' total, 40."],
      ]),
      worked(
        "Complete the tree",
        "Fill in the museum branches.",
        [
          ["Boys: $60 - 35 = 25$ museum", "The boys' split adds to 60."],
          ["Girls: $40 - 25 = 15$ museum", "The girls' split adds to 40."],
        ],
        "Check: $35 + 25 + 25 + 15 = 100$ ✓",
        frequencyTree(
          "100",
          ["60 boys", "40 girls"],
          ["35 zoo", "25 museum", "25 zoo", "15 museum"],
        ),
      ),
      steps(
        "Together",
        "A two-way table: 30 pupils",
        "18 have a pet. 10 of the 16 girls have a pet.",
        [
          ["Boys:", "14", ["16", "$30 - 16$."], "14 boys"],
          ["Boys with a pet:", "8", ["10", "$18 - 10$."], "8"],
        ],
        "So $14 - 8 = 6$ boys have no pet.",
      ),
      choose(
        "Together",
        "From the table, what fraction of pupils chose the zoo?",
        "$\\frac{60}{100}$",
        "60 of 100.",
        [
          ["$\\frac{35}{60}$", "That's the fraction of boys."],
          ["$\\frac{25}{40}$", "That's the girls."],
        ],
      ),
      typed(
        "Your turn",
        "200 cars: 120 are electric. 90 electric cars are white. How many electric cars aren't white?",
        "30",
        "$120 - 90$.",
        "30.",
        { wrong: [["110", "Use the electric total, 120."]] },
      ),
      typed(
        "Your turn",
        "In the table, how many boys chose the museum?",
        "25",
        "Read the row.",
        "25.",
      ),
      choose(
        "Watch out",
        "Kim's tree has 60 boys splitting into 35 and 30. What's wrong?",
        "The split must add to 60: 35 and 25",
        "Branches add to the number before.",
        [["Nothing", "$35 + 30 = 65$, not 60."]],
      ),
      mistake(
        "Leo completes the girls' branches: 40 girls, 25 chose the zoo.",
        ["Girls: 40", "Zoo: 25", "Museum: $40 + 25 = 65$"],
        2,
        "Subtract: $40 - 25 = 15$.",
      ),
      typed(
        "Back to the problem",
        "“How many girls chose the museum?”",
        "15",
        "$40 - 25$.",
        "15 girls.",
        { wrong: [["25", "25 boys chose the museum."]] },
      ),
      quiz([
        [
          ["50 people: 30 adults. Children?", "20", ["80", "30"], "$50 - 30$."],
          ["80 people: 45 adults. Children?", "35", ["125", "45"], "$80 - 45$."],
        ],
        [
          ["40 girls, 25 like football. Don't?", "15", ["65", "25"], "$40 - 25$."],
          ["60 boys, 42 like football. Don't?", "18", ["102", "42"], "$60 - 42$."],
        ],
        [
          [
            "In a frequency tree, each split",
            "adds up to the number before",
            ["doubles", "is equal"],
            "Add up.",
          ],
          [
            "A two-way table's totals",
            "add across and down",
            ["are always 100", "are the biggest"],
            "Totals.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "expected",
    "GF-P2",
    "Fair games and expected outcomes",
    "Expected number = probability × number of trials.",
    [
      problem("The fair", [
        "A fair dice is rolled 300 times. How many sixes would you expect? And is a game fair if you win on 1 or 2 and I win on 3, 4, 5 or 6?",
        "By the end of this lesson, you can predict outcomes and spot unfair games.",
      ]),
      choose("Warm-up", "P(6) on a fair dice", "$\\frac16$", "1 way in 6.", [
        ["$\\frac56$", "That's not a 6."],
        ["6", "Probabilities are at most 1."],
      ]),
      typed("Warm-up", "Work out $\\frac16 \\times 300$", "50", "$300 \\div 6$.", "50."),
      explain(
        "Discover",
        "Fair and expected",
        [
          "**Fair** (or unbiased) means each outcome is equally likely. **Random** means you can't predict any single result.",
          "**Expected number** = probability × number of trials. It's what happens on average, not a guarantee.",
        ],
        { kind: "maths", tex: "\\text{expected} = P \\times n" },
      ),
      choose(
        "Discover",
        "Win on 1 or 2; lose on 3–6. Is it fair?",
        "No: you win with $\\frac26$, I win with $\\frac46$",
        "Unequal chances.",
        [["Yes", "Count: 2 outcomes against 4."]],
      ),
      worked(
        "300 rolls",
        "How many sixes do you expect in 300 rolls?",
        [
          ["P(6) = $\\frac16$", "Fair dice."],
          ["$\\frac16 \\times 300 = 50$", "Probability × trials."],
        ],
        "Expect about 50; it might be 47 or 53.",
      ),
      steps(
        "Together",
        "A spinner: P(red) = 0.3. Spun 80 times",
        "Expected reds.",
        [
          ["Expected =", "$0.3 \\times 80$", ["$0.3 + 80$", "Multiply."], "$0.3 \\times 80$"],
          ["So", "24", ["0.0375", "$0.3 \\times 80 = 24$."], "24 reds"],
        ],
        "About 24.",
      ),
      choose(
        "Together",
        "A coin is flipped 50 times and lands heads 31 times. Biased?",
        "Maybe: try many more flips",
        "31 isn't far from 25 with only 50 flips.",
        [
          ["Definitely", "Small samples vary a lot."],
          ["No: it must be fair", "It could be biased."],
        ],
      ),
      typed(
        "Your turn",
        "P(win) = $\\frac{2}{5}$. Played 60 times: expected wins?",
        "24",
        "$60 \\div 5 \\times 2$.",
        "24.",
        { wrong: [["12", "Two fifths, not one."]] },
      ),
      typed("Your turn", "A fair coin is flipped 120 times. Expected tails?", "60", "Half.", "60."),
      choose(
        "Watch out",
        "Expected 50 sixes in 300 rolls. Jo gets 46 and says the dice is unfair. Is she right?",
        "No: expected is an average; small differences happen",
        "46 is close to 50.",
        [["Yes", "Random results vary around the expected number."]],
      ),
      mistake(
        "P(red) = 0.15. Ola expects reds in 200 spins.",
        ["Expected = P × n", "$0.15 \\times 200$", "= 3"],
        2,
        "$0.15 \\times 200 = 30$.",
      ),
      typed(
        "Back to the problem",
        "“A fair dice is rolled 300 times. How many sixes would you expect?”",
        "50",
        "$\\frac16 \\times 300$.",
        "50 sixes.",
        { wrong: [["6", "Multiply by 300."]] },
      ),
      quiz([
        [
          ["P = 0.2, 150 trials: expected", "30", ["0.2", "750"], "$0.2 \\times 150$."],
          ["P = 0.4, 90 trials: expected", "36", ["0.4", "225"], "$0.4 \\times 90$."],
        ],
        [
          ["Fair dice, 240 rolls: expected 3s", "40", ["24", "80"], "$240 \\div 6$."],
          ["Fair dice, 120 rolls: expected evens", "60", ["20", "40"], "$\\frac12 \\times 120$."],
        ],
        [
          [
            "A fair game gives each player",
            "equal chances",
            ["more wins", "a prize"],
            "Equally likely.",
          ],
          ["Expected number is", "an average", ["guaranteed", "the maximum"], "Not certain."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "relative-frequency",
    "GF-P3",
    "Relative frequency",
    "Estimate probability from experiments: times it happened ÷ trials.",
    [
      problem(
        "The drawing pin",
        [
          "A drawing pin is dropped 200 times and lands point up 130 times. Estimate the probability it lands point up. Expected in 1000 drops?",
          "You can't count equally likely outcomes here. By the end of this lesson, you can estimate anyway.",
        ],
        { kind: "table", head: ["Point up", "Point down", "Total"], rows: [["130", "70", "200"]] },
      ),
      typed(
        "Warm-up",
        "Write $\\frac{130}{200}$ as a decimal",
        "0.65",
        "$130 \\div 200$.",
        "0.65.",
      ),
      typed("Warm-up", "Work out $0.65 \\times 1000$", "650", "Times 1000.", "650."),
      explain(
        "Discover",
        "From an experiment",
        [
          "**Relative frequency** = number of times it happened ÷ number of trials. It's an estimate of the probability, on the 0 to 1 scale.",
          "Use it when outcomes aren't equally likely, or to test whether something is fair.",
        ],
        { kind: "maths", tex: "\\text{relative frequency} = \\frac{130}{200} = 0.65" },
      ),
      choose(
        "Discover",
        "A coin lands heads 23 times in 50. Relative frequency of heads",
        "0.46",
        "$23 \\div 50$.",
        [
          ["0.23", "Divide by 50, not 100."],
          ["0.5", "That's the theoretical probability."],
        ],
      ),
      worked(
        "The pin",
        "Estimate P(point up), then the expected number in 1000 drops.",
        [
          ["$\\frac{130}{200} = 0.65$", "Relative frequency."],
          ["$0.65 \\times 1000 = 650$", "Use it as a probability."],
        ],
        "About 650 point up.",
      ),
      steps(
        "Together",
        "A spinner: red 12, blue 28, green 40 times",
        "Estimate P(green).",
        [
          ["Total trials:", "80", ["40", "Add all three."], "80"],
          ["P(green) ≈", "0.5", ["40", "$40 \\div 80$."], "0.5"],
        ],
        "Relative frequency: 0.5.",
      ),
      choose(
        "Together",
        "Which estimate is most reliable?",
        "The one from 1000 trials",
        "More trials, better estimate.",
        [
          ["The one from 10 trials", "Too few."],
          ["They're all the same", "Bigger samples are more reliable."],
        ],
      ),
      typed(
        "Your turn",
        "A ball is caught 36 times in 60 throws. Relative frequency?",
        "0.6",
        "$36 \\div 60$.",
        "0.6.",
        { wrong: [["0.36", "Divide by 60."]] },
      ),
      typed(
        "Your turn",
        "Relative frequency 0.15. Expected in 400 trials?",
        "60",
        "$0.15 \\times 400$.",
        "60.",
      ),
      choose(
        "Watch out",
        "A dice lands on 6 four times in 10 rolls. Raj says P(6) = 0.4 exactly. What's wrong?",
        "That's an estimate from very few trials",
        "Relative frequency estimates; it isn't exact.",
        [["Nothing", "Ten rolls is far too few to be sure."]],
      ),
      mistake(
        "A coin: 18 heads, 22 tails. Mia estimates P(heads).",
        ["Heads: 18", "Trials: 22", "P(heads) ≈ $\\frac{18}{22}$"],
        1,
        "Trials are all 40 throws: $\\frac{18}{40} = 0.45$.",
      ),
      choose(
        "Back to the problem",
        "“Estimate the probability the pin lands point up.”",
        "0.65",
        "$130 \\div 200$.",
        [
          ["0.5", "Not equally likely."],
          ["130", "Divide by the trials."],
        ],
      ),
      quiz([
        [
          ["45 successes in 150 trials", "0.3", ["0.45", "3.33"], "$45 \\div 150$."],
          ["32 successes in 80 trials", "0.4", ["0.32", "2.5"], "$32 \\div 80$."],
        ],
        [
          ["Rel. freq. 0.2, 500 trials: expected", "100", ["0.2", "25"], "$0.2 \\times 500$."],
          ["Rel. freq. 0.35, 200 trials: expected", "70", ["35", "0.35"], "$0.35 \\times 200$."],
        ],
        [
          ["Relative frequency is", "an estimate", ["exact", "always 0.5"], "From experiments."],
          [
            "Relative frequency is most reliable with",
            "many trials",
            ["few trials", "one trial"],
            "Bigger samples.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sum-to-one",
    "GF-P4",
    "Probabilities add to 1",
    "Exhaustive, mutually exclusive outcomes add to 1: find a missing one.",
    [
      problem(
        "The biased spinner",
        [
          "A spinner lands on red, blue, green or yellow. P(red) = 0.2, P(blue) = 0.35, and green and yellow are equally likely.",
          "“Work out P(green).” By the end of this lesson, you can find any missing probability.",
        ],
        {
          kind: "table",
          head: ["Colour", "Red", "Blue", "Green", "Yellow"],
          rows: [["Probability", "0.2", "0.35", "$x$", "$x$"]],
        },
      ),
      typed("Warm-up", "Work out $1 - 0.55$", "0.45", "What adds to 0.55 to make 1?", "0.45."),
      typed("Warm-up", "Solve $2x = 0.45$", "0.225", "Halve.", "$x = 0.225$."),
      explain(
        "Discover",
        "Something must happen",
        [
          "Outcomes that can't happen together are **mutually exclusive**; if they cover everything, they're **exhaustive**. Their probabilities **add to 1**.",
          "So P(not A) = 1 − P(A).",
        ],
        { kind: "maths", tex: "P(\\text{not } A) = 1 - P(A)" },
      ),
      choose("Discover", "P(rain) = 0.7. P(no rain) =", "0.3", "$1 - 0.7$.", [
        ["0.7", "Rain or not: add to 1."],
        ["1.7", "Never above 1."],
      ]),
      worked(
        "The spinner",
        "Find P(green).",
        [
          ["$0.2 + 0.35 + x + x = 1$", "They add to 1."],
          ["$2x = 0.45$", "Subtract 0.55."],
          ["$x = 0.225$", "Halve."],
        ],
        "Check: $0.2 + 0.35 + 0.225 + 0.225 = 1$ ✓",
      ),
      steps(
        "Together",
        "P(A) = 0.1, P(B) = $x$, P(C) = $3x$",
        "Find $x$.",
        [
          ["$0.1 + 4x = 1$, so", "$4x = 0.9$", ["$3x = 0.9$", "$x + 3x = 4x$."], "$4x = 0.9$"],
          ["$x =$", "0.225", ["0.3", "$0.9 \\div 4$."], "0.225"],
        ],
        "So P(C) = 0.675.",
      ),
      choose(
        "Together",
        "Which set of probabilities is impossible?",
        "0.5, 0.4, 0.3",
        "They add to 1.2.",
        [
          ["0.5, 0.25, 0.25", "Those add to 1."],
          ["0.1, 0.1, 0.8", "Those add to 1."],
        ],
      ),
      typed("Your turn", "Win 0.45, draw 0.2. P(lose)?", "0.35", "$1 - 0.65$.", "0.35."),
      typed(
        "Your turn",
        "P(A) = 0.4, P(B) = $x$, P(C) = $2x$. Find $x$",
        "0.2",
        "$3x = 0.6$.",
        "$x = 0.2$.",
        { wrong: [["0.6", "That's $3x$: divide by 3."]] },
      ),
      choose(
        "Watch out",
        "Ed says P(late) = 0.3 and P(on time) = 0.6 cover everything. What's wrong?",
        "They only add to 0.9: something else (early?) has 0.1",
        "Exhaustive outcomes add to exactly 1.",
        [["Nothing", "$0.3 + 0.6 = 0.9$."]],
      ),
      mistake(
        "Kim finds $x$: red 0.3, blue $x$, green $x$.",
        ["$0.3 + 2x = 1$", "$2x = 0.7$", "$x = 1.4$"],
        2,
        "Divide by 2: $x = 0.35$.",
      ),
      typed(
        "Back to the problem",
        "“Work out P(green).”",
        "0.225",
        "$1 - 0.55 = 0.45$, halved.",
        "0.225.",
        { wrong: [["0.45", "Green and yellow share it."]] },
      ),
      quiz([
        [
          ["P(A) = 0.62. P(not A)?", "0.38", ["0.62", "1.62"], "$1 - 0.62$."],
          ["P(B) = 0.09. P(not B)?", "0.91", ["0.09", "0.1"], "$1 - 0.09$."],
        ],
        [
          ["0.2, 0.3, $x$. $x$?", "0.5", ["0.25", "1.5"], "$1 - 0.5$."],
          ["0.15, 0.25, $x$. $x$?", "0.6", ["0.4", "0.3"], "$1 - 0.4$."],
        ],
        [
          ["0.1, $x$, $x$. $x$?", "0.45", ["0.9", "0.05"], "$0.9 \\div 2$."],
          ["0.4, $x$, $2x$. $x$?", "0.2", ["0.6", "0.3"], "$0.6 \\div 3$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "large-samples",
    "GF-P5",
    "Bigger samples",
    "With more trials, relative frequency gets closer to the true probability.",
    [
      problem("Is it biased?", [
        "Two pupils test a dice. Amir rolls it 12 times and gets three 6s. Bea rolls it 600 times and gets 104 6s. Who has the better estimate, and is it fair?",
        "By the end of this lesson, you'll know why the number of trials matters.",
      ]),
      typed("Warm-up", "$\\frac16$ as a decimal, to 2 d.p.", "0.17", "$1 \\div 6$.", "0.17."),
      typed("Warm-up", "$104 \\div 600$, to 2 d.p.", "0.17", "Divide.", "0.17."),
      {
        kind: "spin",
        tag: "Discover",
        title: "Spin it lots",
        text: "A is a quarter of the spinner, B a quarter, C half. Spin many times and watch the fractions settle.",
        sectors: [
          { label: "A", size: 1 },
          { label: "B", size: 1 },
          { label: "C", size: 2 },
        ],
        spins: 200,
        done: "With more spins, the fractions settle near $\\frac14$, $\\frac14$ and $\\frac12$.",
      },
      explain(
        "Discover",
        "The law of large numbers",
        [
          "A few trials can give odd results by chance. As the number of trials grows, the relative frequency **tends towards** the theoretical probability.",
          "So a large, unbiased sample gives a reliable estimate.",
        ],
        {
          kind: "table",
          head: ["Rolls", "Sixes", "Rel. freq."],
          rows: [
            ["12", "3", "0.25"],
            ["600", "104", "0.17"],
          ],
        },
      ),
      worked(
        "Amir and Bea",
        "Who has the better estimate, and is the dice fair?",
        [
          ["Amir: $3 \\div 12 = 0.25$", "Only 12 rolls."],
          ["Bea: $104 \\div 600 = 0.17$", "600 rolls."],
          ["Bea's is better; 0.17 ≈ $\\frac16$, so it looks fair", "More trials."],
        ],
        "Bigger sample, more reliable.",
      ),
      steps(
        "Together",
        "A coin: 7 heads in 10 flips; 5030 in 10 000",
        "Compare.",
        [
          [
            "Relative frequencies:",
            "0.7 and 0.503",
            ["0.7 and 5.03", "Divide by 10 000."],
            "0.7 and 0.503",
          ],
          [
            "Which suggests the coin is fair?",
            "the 10 000 flips: 0.503 ≈ 0.5",
            ["the 10 flips", "Ten is too few."],
            "Fair",
          ],
        ],
        "Small samples can mislead.",
      ),
      choose(
        "Together",
        "To check a spinner is fair, it's best to",
        "spin it hundreds of times",
        "More trials, better estimate.",
        [
          ["spin it 5 times", "Too few."],
          ["look at it", "Test it."],
        ],
      ),
      choose("Your turn", "Which sample is most reliable?", "500 trials", "The most trials.", [
        ["50 trials", "Fewer."],
        ["5 trials", "Far too few."],
      ]),
      choose(
        "Your turn",
        "A dice gives six 6s in 10 rolls. Is it definitely biased?",
        "No: 10 rolls is too few to say",
        "Roll it many more times.",
        [["Yes", "Chance alone can do that."]],
      ),
      choose(
        "Watch out",
        "Zoe says: “After five heads, tails is due.” Is she right?",
        "No: each flip is independent, still 0.5",
        "Coins don't remember.",
        [["Yes", "The next flip doesn't depend on the last."]],
      ),
      mistake(
        "Ben tests a coin.",
        ["Flip it 6 times: 5 heads", "Relative frequency 0.83", "So the coin is biased"],
        2,
        "6 flips is far too few. Flip hundreds of times before deciding.",
      ),
      choose(
        "Back to the problem",
        "“Amir: three 6s in 12 rolls. Bea: 104 in 600. Whose estimate is more reliable? Give a reason.”",
        "Bea's: she rolled many more times",
        "More trials, more reliable.",
        [
          ["Amir's: 0.25 is easier", "Fewer trials are less reliable."],
          ["They're equally good", "600 trials beats 12."],
        ],
      ),
      quiz([
        [
          [
            "Relative frequency gets closer to the true probability with",
            "more trials",
            ["fewer trials", "one trial"],
            "Large numbers.",
          ],
          [
            "The more trials, the",
            "more reliable the estimate",
            ["less reliable", "the same"],
            "Large numbers.",
          ],
        ],
        [
          [
            "8 heads in 10 flips proves bias?",
            "No",
            ["Yes", "Only if it's a new coin"],
            "Too few.",
          ],
          [
            "2 sixes in 3 rolls proves bias?",
            "No",
            ["Yes", "Only if they're in a row"],
            "Too few.",
          ],
        ],
        [
          ["Best estimate of P(red)", "520 of 1000", ["4 of 5", "6 of 10"], "Most trials."],
          ["Best estimate of P(win)", "310 of 1000", ["3 of 10", "1 of 3"], "Most trials."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sample-space",
    "GF-P6.a",
    "Sample space grids",
    "List every outcome of two events in a grid, then count.",
    [
      problem(
        "Two dice",
        [
          "Two fair dice are rolled and the scores added. “Work out the probability of a total of 8.”",
          "Listing in your head misses some. By the end of this lesson, a grid finds them all.",
        ],
        dice,
      ),
      typed("Warm-up", "How many outcomes for one dice?", "6", "1 to 6.", "6."),
      typed("Warm-up", "Work out $6 \\times 6$", "36", "Times.", "36."),
      explain(
        "Discover",
        "A sample space grid",
        [
          "A **sample space** lists every outcome. For two dice, a 6 by 6 grid: one dice across, one down, the total in each square.",
          "All 36 squares are equally likely, so P(event) = squares you want ÷ 36.",
        ],
        dice,
      ),
      {
        kind: "shade",
        tag: "Discover",
        title: "Shade every total of 8",
        text: "Tap each square where the total is 8.",
        cols: 6,
        rows: 6,
        target: 5,
        cells: [11, 16, 21, 26, 31],
        colLabels: ["1", "2", "3", "4", "5", "6"],
        rowLabels: ["1", "2", "3", "4", "5", "6"],
        values: totals,
        hint: "Look for 2 + 6, 3 + 5, 4 + 4 and so on, both ways round.",
        done: "5 squares: P(8) = $\\frac{5}{36}$.",
      },
      worked(
        "Total of 8",
        "Find P(total of 8).",
        [
          ["Squares with 8: 2+6, 3+5, 4+4, 5+3, 6+2", "From the grid."],
          ["$\\frac{5}{36}$", "5 out of 36."],
        ],
        "Every square is equally likely.",
      ),
      steps(
        "Together",
        "Spin a 1–4 spinner and flip a coin",
        "Sample space.",
        [
          ["Number of outcomes:", "8", ["6", "$4 \\times 2$."], "8"],
          ["P(even and heads):", "$\\frac28$", ["$\\frac12$", "2H and 4H: 2 of 8."], "$\\frac14$"],
        ],
        "List: 1H, 1T, 2H, 2T, 3H, 3T, 4H, 4T.",
      ),
      choose("Together", "Two dice: P(double)?", "$\\frac{6}{36}$", "1+1 to 6+6: six squares.", [
        ["$\\frac{1}{6}$ of 6", "Count the squares: 6 of 36."],
        ["$\\frac{1}{36}$", "There are six doubles."],
      ]),
      choose(
        "Your turn",
        "Two dice: P(total of 7)?",
        "$\\frac{6}{36}$",
        "1+6, 2+5, 3+4, 4+3, 5+2, 6+1.",
        [
          ["$\\frac{1}{11}$", "Totals aren't equally likely."],
          ["$\\frac{3}{36}$", "Count both orders."],
        ],
      ),
      choose("Your turn", "Two dice: P(total greater than 10)?", "$\\frac{3}{36}$", "11, 11, 12.", [
        ["$\\frac{2}{36}$", "5+6 and 6+5 are different."],
        ["$\\frac{1}{36}$", "Count 11s too."],
      ]),
      choose(
        "Watch out",
        "Ivy says totals 2 to 12 are 11 outcomes, so P(7) = $\\frac{1}{11}$. What's wrong?",
        "The totals aren't equally likely: count the 36 squares",
        "7 has six squares; 2 has one.",
        [["Nothing", "Use the equally likely squares."]],
      ),
      mistake(
        "Sam finds P(total of 4) with two dice.",
        ["Totals of 4: 1+3, 2+2", "That's 2 squares", "P = $\\frac{2}{36}$"],
        0,
        "3+1 counts too: 3 squares, $\\frac{3}{36}$.",
      ),
      choose(
        "Back to the problem",
        "“Two fair dice are rolled. Work out the probability of a total of 8.”",
        "$\\frac{5}{36}$",
        "Five squares of 36.",
        [
          ["$\\frac{1}{11}$", "Totals aren't equally likely."],
          ["$\\frac{8}{36}$", "Count the squares that total 8."],
        ],
      ),
      quiz([
        [
          [
            "Two dice: P(total 2)",
            "$\\frac{1}{36}$",
            ["$\\frac{2}{36}$", "$\\frac{1}{11}$"],
            "Only 1+1.",
          ],
          [
            "Two dice: P(total 12)",
            "$\\frac{1}{36}$",
            ["$\\frac{2}{36}$", "$\\frac{1}{11}$"],
            "Only 6+6.",
          ],
        ],
        [
          [
            "Two dice: P(total 6)",
            "$\\frac{5}{36}$",
            ["$\\frac{6}{36}$", "$\\frac{1}{6}$ of 36"],
            "1+5 … 5+1.",
          ],
          [
            "Two dice: P(total 9)",
            "$\\frac{4}{36}$",
            ["$\\frac{5}{36}$", "$\\frac{9}{36}$"],
            "3+6 … 6+3.",
          ],
        ],
        [
          ["Outcomes: two coins", "4", ["2", "3"], "HH, HT, TH, TT."],
          ["Outcomes: a coin and a dice", "12", ["8", "6"], "$2 \\times 6$."],
        ],
      ]),
    ],
  ),
];
