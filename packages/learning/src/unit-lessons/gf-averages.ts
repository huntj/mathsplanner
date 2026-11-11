// GCSE Foundation, "Averages, spread and correlation", as six short lessons, one just before each
// skill: mean, median and mode; estimating the mean of grouped data; range and outliers;
// describing a population; correlation and causation; and lines of best fit. Each recaps the Key
// Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Point, Rule, UnitLesson } from "./types.ts";

const U = "gf-averages";
const scatter = (points: Point[], lines: Rule[] = []): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
  points,
  ...(lines.length ? { lines } : {}),
});
const revision = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 5 },
  { x: 6, y: 6 },
  { x: 7, y: 8 },
  { x: 8, y: 8 },
];
const grouped: Picture = {
  kind: "table",
  head: ["Time $t$ (min)", "Frequency", "Midpoint"],
  rows: [
    ["$0 \\le t < 10$", "4", "5"],
    ["$10 \\le t < 20$", "10", "15"],
    ["$20 \\le t < 30$", "6", "25"],
  ],
};

export const gfAverages: UnitLesson[] = [
  lesson(
    U,
    "averages",
    "GF-S4.a",
    "Mean, median and mode",
    "Three averages, and when each is best.",
    [
      problem("The salaries", [
        "A small firm pays £18k, £20k, £21k, £22k and £99k. The boss says the average pay is £36k. “Is the mean a good average here? Give a reason.”",
        "By the end of this lesson, you can find each average and choose the right one.",
      ]),
      typed("Warm-up", "$18 + 20 + 21 + 22 + 99$", "180", "Add.", "180."),
      typed("Warm-up", "$180 \\div 5$", "36", "Divide.", "36."),
      explain(
        "Discover",
        "Three averages",
        [
          "**Mean**: add them all, divide by how many. **Median**: the middle value once they're in order. **Mode**: the most common value.",
          "The mean is pulled by extreme values; the median isn't. The mode is the only one for non-numbers.",
        ],
        { kind: "maths", tex: "\\text{mean} = \\frac{\\text{total}}{\\text{number of values}}" },
      ),
      choose("Discover", "Median of 3, 9, 4, 7, 2", "4", "In order: 2, 3, 4, 7, 9.", [
        ["9", "Order them first."],
        ["5", "That's the mean."],
      ]),
      worked(
        "The salaries",
        "Find the mean and median. Which is better?",
        [
          ["Mean: $180 \\div 5 = £36$k", "Pulled up by £99k."],
          ["Median: £21k", "The middle value."],
          ["The median: the £99k outlier distorts the mean", "Reason."],
        ],
        "Most workers earn far less than £36k.",
      ),
      steps(
        "Together",
        "Median of 12, 15, 8, 10, 20, 14",
        "Even number of values.",
        [
          [
            "In order:",
            "8, 10, 12, 14, 15, 20",
            ["12, 15, 8, …", "Sort them."],
            "8, 10, 12, 14, 15, 20",
          ],
          [
            "The middle two are 12 and 14, so the median is",
            "13",
            ["12", "Halfway between them."],
            "13",
          ],
        ],
        "With an even count, average the middle two.",
      ),
      steps(
        "Together",
        "Find a missing value",
        "Four numbers have mean 6. Three are 4, 5 and 9.",
        [
          ["Total of all four:", "24", ["6", "Mean × number: $6 \\times 4$."], "24"],
          ["Missing value:", "6", ["18", "$24 - 18$."], "6"],
        ],
        "Total = mean × count.",
      ),
      typed("Your turn", "Mean of 7, 3, 8, 6", "6", "$24 \\div 4$.", "6."),
      choose("Your turn", "Mode of 2, 5, 5, 3, 5, 2", "5", "It appears three times.", [
        ["2", "2 appears twice."],
        ["3.67", "That's the mean."],
      ]),
      choose(
        "Watch out",
        "Ivy finds the median of 9, 2, 7 as 2. What's wrong?",
        "Put them in order first: 2, 7, 9, so 7",
        "The median needs ordered data.",
        [["Nothing", "2 is just the middle as written."]],
      ),
      mistake(
        "Leo finds the mean of 4, 6, 8, 10.",
        ["Total: 28", "Number of values: 4", "Mean: $28 \\div 2 = 14$"],
        2,
        "Divide by the number of values, 4: mean 7.",
      ),
      choose(
        "Back to the problem",
        "“Pay: £18k, £20k, £21k, £22k, £99k. Is the mean a good average? Give a reason.”",
        "No: the £99k outlier pulls it up; the median £21k is more typical",
        "Name the outlier.",
        [
          ["Yes: it uses every value", "That's why it's distorted."],
          ["No: the mode is best", "There's no mode."],
        ],
      ),
      quiz([
        [
          ["Mean of 2, 4, 6, 8", "5", ["4", "20"], "$20 \\div 4$."],
          ["Mean of 10, 20, 30", "20", ["60", "15"], "$60 \\div 3$."],
        ],
        [
          ["Median of 5, 1, 9, 3, 7", "5", ["9", "3"], "1, 3, 5, 7, 9."],
          ["Median of 4, 8, 2, 6", "5", ["8", "4"], "2, 4, 6, 8."],
        ],
        [
          ["Best average with an outlier", "median", ["mean", "range"], "Not distorted."],
          ["Average for favourite colours", "mode", ["mean", "median"], "Non-numbers."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "grouped",
    "GF-S4.b",
    "Averages from grouped data",
    "Estimate the mean with midpoints; find the modal class.",
    [
      problem(
        "Homework times",
        [
          "20 pupils' homework times are grouped. The exam asks: “Work out an estimate for the mean time.” Why only an estimate?",
          "By the end of this lesson, you can estimate the mean and find the modal class.",
        ],
        grouped,
      ),
      typed("Warm-up", "Midpoint of $10 \\le t < 20$", "15", "Halfway.", "15."),
      typed(
        "Warm-up",
        "$4 \\times 5 + 10 \\times 15 + 6 \\times 25$",
        "320",
        "$20 + 150 + 150$.",
        "320.",
      ),
      explain(
        "Discover",
        "Midpoints stand in",
        [
          "We don't know the exact times, so use each class's **midpoint** as a typical value. Midpoint × frequency estimates each class's total.",
          "Estimated mean = total of (midpoint × frequency) ÷ total frequency. The **modal class** has the highest frequency.",
        ],
        grouped,
      ),
      choose("Discover", "The modal class", "$10 \\le t < 20$", "Frequency 10.", [
        ["$20 \\le t < 30$", "Frequency 6."],
        ["10", "The class, not the frequency."],
      ]),
      worked(
        "The estimate",
        "Estimate the mean time.",
        [
          ["$4 \\times 5 + 10 \\times 15 + 6 \\times 25 = 320$", "Midpoint × frequency."],
          ["$320 \\div 20 = 16$ minutes", "Divide by the total frequency."],
        ],
        "An estimate, because we used midpoints.",
      ),
      steps(
        "Together",
        "Masses: $0 \\le m < 4$ (3), $4 \\le m < 8$ (5), $8 \\le m < 12$ (2)",
        "Estimate the mean.",
        [
          [
            "$3 \\times 2 + 5 \\times 6 + 2 \\times 10 =$",
            "56",
            ["24", "Use midpoints: 2, 6, 10."],
            "56",
          ],
          ["Mean ≈", "5.6", ["18.7", "Divide by 10 (the total frequency), not 3."], "5.6 kg"],
        ],
        "Divide by the frequencies' total.",
      ),
      choose(
        "Together",
        "Which class holds the median of 20 values?",
        "The class with the 10th and 11th",
        "Count up the frequencies.",
        [["The middle class", "Count, don't just pick the middle row."]],
      ),
      typed(
        "Your turn",
        "Midpoints 5, 15 with frequencies 2, 8: estimated mean",
        "13",
        "$(10 + 120) \\div 10$.",
        "13.",
      ),
      choose(
        "Your turn",
        "In the homework table, the median class",
        "$10 \\le t < 20$",
        "The 10th and 11th are in it (4 + 10).",
        [
          ["$0 \\le t < 10$", "Only 4 values there."],
          ["$20 \\le t < 30$", "Values 15–20."],
        ],
      ),
      choose(
        "Watch out",
        "Ed divides 320 by 3 (the number of classes). What's wrong?",
        "Divide by the total frequency, 20",
        "There are 20 pupils, not 3.",
        [["Nothing", "Mean is per pupil."]],
      ),
      mistake(
        "Mia estimates a mean.",
        ["Frequencies 4, 10, 6", "$4 + 10 + 6 = 20$", "Mean = $20 \\div 3$"],
        2,
        "Multiply each frequency by its midpoint, add (320), then ÷ 20 = 16.",
      ),
      typed(
        "Back to the problem",
        "“Work out an estimate for the mean homework time.”",
        "16",
        "$320 \\div 20$.",
        "16 minutes.",
        { unit: "minutes", wrong: [["106.7", "Divide by 20, not 3."]] },
      ),
      quiz([
        [
          ["Midpoint of $20 \\le x < 40$", "30", ["20", "40"], "Halfway."],
          ["Midpoint of $5 \\le x < 15$", "10", ["5", "15"], "Halfway."],
        ],
        [
          ["Midpoints 10, 30; frequencies 3, 1. Mean ≈", "15", ["20", "60"], "$60 \\div 4$."],
          ["Midpoints 5, 15; frequencies 1, 3. Mean ≈", "12.5", ["10", "50"], "$50 \\div 4$."],
        ],
        [
          [
            "Grouped means are estimates because",
            "we use midpoints",
            ["the data is wrong", "they're rounded"],
            "Exact values unknown.",
          ],
          [
            "The modal class has",
            "the highest frequency",
            ["the middle value", "the widest range"],
            "Most common.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "range-outliers",
    "GF-S4.c",
    "Range, outliers and comparing",
    "Compare an average and a spread, in context.",
    [
      problem("Two teams", [
        "Team A's scores: 12, 14, 15, 15, 16. Team B's: 5, 10, 15, 20, 25. “Compare the scores of the two teams.”",
        "A good comparison needs two things. By the end of this lesson, you'll write one.",
      ]),
      typed("Warm-up", "Range of 12, 14, 15, 15, 16", "4", "$16 - 12$.", "4."),
      typed("Warm-up", "Median of 5, 10, 15, 20, 25", "15", "The middle.", "15."),
      explain(
        "Discover",
        "Average and spread",
        [
          "The **range** (highest − lowest) measures **spread**: how consistent the data is. An **outlier** is a value far from the rest.",
          "To compare, give an **average** and a **spread**, and say what each means in context.",
        ],
        {
          kind: "table",
          head: ["", "Median", "Range"],
          rows: [
            ["Team A", "15", "4"],
            ["Team B", "15", "20"],
          ],
        },
      ),
      choose(
        "Discover",
        "Which team is more consistent?",
        "Team A: smaller range",
        "Range 4 against 20.",
        [
          ["Team B", "Bigger range means less consistent."],
          ["Neither", "The ranges differ."],
        ],
      ),
      worked(
        "Compare",
        "Compare the two teams.",
        [
          ["Both medians are 15: on average, they score the same", "Average."],
          ["A's range 4 < B's range 20: A is more consistent", "Spread."],
        ],
        "Two comparisons, each in context.",
      ),
      steps(
        "Together",
        "Spot the outlier",
        "Times: 32, 35, 31, 34, 79 seconds.",
        [
          ["The outlier is", "79", ["31", "Far from the rest."], "79"],
          ["Range without it:", "4", ["48", "$35 - 31$."], "4"],
        ],
        "An outlier can make the range misleading.",
      ),
      choose(
        "Together",
        "A comparison sentence that earns the mark",
        "“A's median is higher, so A scored more on average.”",
        "Value and meaning.",
        [
          ["“A's median is 18 and B's is 15.”", "Say what it means."],
          ["“A is better.”", "Use the statistics."],
        ],
      ),
      choose(
        "Your turn",
        "Class X: mean 62, range 10. Class Y: mean 58, range 30. Which is true?",
        "X did better on average and was more consistent",
        "Higher mean, smaller range.",
        [
          ["Y was more consistent", "Y's range is bigger."],
          ["They're the same", "Compare both measures."],
        ],
      ),
      choose(
        "Your turn",
        "What does a larger range show?",
        "The data is more spread out",
        "Less consistent.",
        [["A higher average", "Range is spread, not average."]],
      ),
      choose(
        "Watch out",
        "Ben says Team B is better because its range is bigger. Is that right?",
        "No: a bigger range means less consistent, not better",
        "Range is spread.",
        [["Yes", "Range doesn't measure how high scores are."]],
      ),
      mistake(
        "Kim compares two runners.",
        ["A's median 12.1 s, B's 12.4 s", "A's median is lower", "So B is faster"],
        2,
        "Lower times are faster: A is faster on average.",
      ),
      choose(
        "Back to the problem",
        "“Compare the scores of Team A and Team B.”",
        "Same median (15), but A is more consistent: range 4 vs 20",
        "Average and spread, in context.",
        [
          ["B is better: range 20", "Range isn't better or worse."],
          ["A scored more", "The medians are equal."],
        ],
      ),
      quiz([
        [
          ["Range of 3, 8, 2, 11", "9", ["8", "11"], "$11 - 2$."],
          ["Range of 45, 52, 38, 60", "22", ["15", "60"], "$60 - 38$."],
        ],
        [
          ["Outlier in 4, 5, 5, 6, 30", "30", ["4", "5"], "Far away."],
          ["Outlier in 100, 2, 3, 4, 3", "100", ["2", "4"], "Far away."],
        ],
        [
          [
            "Smaller range means",
            "more consistent",
            ["higher average", "fewer values"],
            "Less spread.",
          ],
          [
            "A comparison needs",
            "an average and a spread",
            ["only the mean", "only the range"],
            "Both.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "populations",
    "GF-S5",
    "Statistics about a population",
    "Use averages and spread from a sample to describe a population, with care.",
    [
      problem("The survey report", [
        "A random sample of 50 pupils from a school of 1000 has mean screen time 3.2 hours a day, range 6 hours. “What can you say about the whole school?”",
        "By the end of this lesson, you can draw sensible conclusions, and know their limits.",
      ]),
      choose("Warm-up", "The population here is", "all 1000 pupils", "Everyone in the school.", [
        ["the 50 pupils", "That's the sample."],
      ]),
      typed("Warm-up", "$3.2 \\times 1000$", "3200", "Times.", "3200."),
      explain(
        "Discover",
        "From sample to population",
        [
          "A random sample's mean and spread **estimate** the population's. Bigger random samples give better estimates.",
          "Say “about” or “estimate”, and mention limits: the sample may not represent everyone.",
        ],
        {
          kind: "table",
          head: ["Sample", "Value"],
          rows: [
            ["Size", "50"],
            ["Mean", "3.2 h"],
            ["Range", "6 h"],
          ],
        },
      ),
      choose(
        "Discover",
        "A sensible conclusion",
        "Pupils at the school average about 3.2 hours a day",
        "An estimate.",
        [
          ["Every pupil watches exactly 3.2 hours", "That's an average, not everyone."],
          ["Nothing can be said", "A random sample does tell us something."],
        ],
      ),
      worked(
        "Total time",
        "Estimate the total daily screen time for the school.",
        [
          ["Mean ≈ 3.2 h per pupil", "From the sample."],
          ["$3.2 \\times 1000 = 3200$ hours", "Scale up."],
        ],
        "About 3200 hours a day, as an estimate.",
      ),
      steps(
        "Together",
        "Could the estimate be wrong?",
        "Think about the sample.",
        [
          [
            "If the 50 were all from Year 11,",
            "they may not represent the school",
            ["the estimate is exact", "One year group may differ."],
            "Possible bias",
          ],
          [
            "A better sample would be",
            "random from every year, and bigger",
            ["the first 50 at the gate", "That's not random."],
            "Random and larger",
          ],
        ],
        "Know the limits.",
      ),
      choose(
        "Together",
        "Two schools' samples: means 3.2 h and 2.8 h. Fair conclusion?",
        "The first school's pupils probably average more screen time",
        "“Probably”: samples vary.",
        [["Every pupil at the first school watches more", "Averages, not individuals."]],
      ),
      choose(
        "Your turn",
        "A sample of 10 shows mean height 160 cm. How reliable?",
        "Not very: 10 is small",
        "Bigger samples are more reliable.",
        [["Very reliable", "Small samples vary a lot."]],
      ),
      typed(
        "Your turn",
        "Sample mean £4 spent a day; 600 pupils. Estimated total a day, in pounds?",
        "2400",
        "$4 \\times 600$.",
        "£2400.",
      ),
      choose(
        "Watch out",
        "A newspaper says “the average family has 2.4 children, so most families have 2.4 children.” What's wrong?",
        "An average needn't be any actual value",
        "No family has 2.4 children.",
        [["Nothing", "Averages summarise, not describe each one."]],
      ),
      mistake(
        "Raj concludes from a gym survey.",
        [
          "Asked 40 gym members",
          "Mean exercise: 5 hours a week",
          "So people in the town exercise 5 hours a week",
        ],
        2,
        "Gym members aren't typical of the town: the sample is biased.",
      ),
      choose(
        "Back to the problem",
        "“Mean 3.2 hours, range 6 hours, random sample of 50. What can you say about the school?”",
        "Pupils average about 3.2 hours, with a wide spread",
        "Estimate, with spread.",
        [
          ["All pupils watch 3.2 hours", "That's the mean, not everyone."],
          ["Most watch 6 hours", "6 is the range, a spread."],
        ],
      ),
      quiz([
        [
          ["Sample results give", "estimates", ["exact answers", "nothing"], "Estimates."],
          [
            "More reliable estimates come from",
            "bigger random samples",
            ["smaller samples", "friends"],
            "Size and randomness.",
          ],
        ],
        [
          ["Mean 2.5 per person, 400 people: total ≈", "1000", ["160", "402.5"], "× 400."],
          ["Mean 0.8 per person, 250 people: total ≈", "200", ["312.5", "250.8"], "× 250."],
        ],
        [
          ["An average describes", "a typical value", ["every value", "the biggest"], "Typical."],
          ["The range describes", "spread", ["average", "total"], "Spread."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "correlation",
    "GF-S6.a",
    "Correlation",
    "Positive, negative or none, and correlation isn't causation.",
    [
      problem(
        "Revision and results",
        [
          "A scatter graph shows hours of revision against test score. “Describe the correlation” and “Does revising cause higher scores? Explain.”",
          "By the end of this lesson, you can describe correlation and say what it does and doesn't prove.",
        ],
        scatter(revision),
      ),
      choose(
        "Warm-up",
        "These points go",
        "up from left to right",
        "As $x$ grows, $y$ grows.",
        [["down from left to right", "Look again."]],
        { picture: scatter(revision) },
      ),
      choose("Warm-up", "A scatter graph shows", "two variables", "One across, one up.", [
        ["one total", "Pairs of values."],
      ]),
      explain(
        "Discover",
        "Three kinds",
        [
          "**Positive** correlation: both increase together. **Negative**: one increases as the other decreases. **No correlation**: no pattern.",
          "**Correlation isn't causation**: two things can change together because of a third factor, or by chance.",
        ],
        scatter(revision),
      ),
      {
        kind: "sort",
        tag: "Discover",
        title: "Which correlation?",
        groups: ["Positive", "Negative", "None"],
        items: [
          {
            text: "Height and shoe size",
            group: 0,
            why: "Taller people tend to have bigger feet.",
          },
          { text: "Age of a car and its value", group: 1, why: "Older cars are worth less." },
          { text: "Shoe size and IQ", group: 2, why: "No link." },
          { text: "Temperature and coats sold", group: 1, why: "Warmer, fewer coats." },
        ],
        done: "As one increases, what does the other do?",
      },
      worked(
        "Describe it",
        "Describe the revision graph.",
        [
          ["Positive correlation", "Points go up together."],
          ["Pupils who revise more tend to score higher", "In context."],
        ],
        "Name it, then say what it means.",
        scatter(revision),
      ),
      steps(
        "Together",
        "Ice cream sales and sunburn cases both rise in summer",
        "Does one cause the other?",
        [
          ["The correlation is", "positive", ["negative", "Both go up."], "Positive"],
          [
            "The cause is",
            "hot, sunny weather drives both",
            ["ice cream causes sunburn", "A third factor."],
            "Not causation",
          ],
        ],
        "Correlation, not causation.",
      ),
      choose(
        "Together",
        "Strong correlation means",
        "the points lie close to a straight line",
        "A clear pattern.",
        [["the points are high up", "Strength is about how close to a line."]],
      ),
      choose(
        "Your turn",
        "Hours of TV and test score: as one rises the other falls",
        "negative correlation",
        "Opposite directions.",
        [["positive correlation", "Positive means both rise."]],
      ),
      choose(
        "Your turn",
        "Which is causation, not just correlation?",
        "Pressing the accelerator and the car speeding up",
        "One directly makes the other happen.",
        [["Towns with more churches have more crime", "Bigger towns have more of both."]],
      ),
      choose(
        "Watch out",
        "A scatter graph shows correlation between shoe size and reading age in children. Do big feet help reading?",
        "No: age affects both",
        "A hidden third variable.",
        [["Yes", "Older children have bigger feet and read better."]],
      ),
      mistake(
        "Jo describes a graph where points fall from left to right.",
        ["As $x$ increases, $y$ decreases", "There's a pattern", "So there's no correlation"],
        2,
        "A falling pattern is negative correlation.",
      ),
      choose(
        "Back to the problem",
        "“Describe the correlation. Does revising cause higher scores?”",
        "Positive correlation; it suggests a link, but correlation alone doesn't prove cause",
        "Careful wording.",
        [
          ["Negative; no", "The points rise."],
          ["Positive; yes, definitely", "Correlation alone doesn't prove it."],
        ],
      ),
      quiz([
        [
          ["Both increase together", "positive", ["negative", "none"], "Same direction."],
          ["One rises, one falls", "negative", ["positive", "none"], "Opposite."],
        ],
        [
          ["Correlation proves cause", "False", ["True", "Only if strong"], "Not alone."],
          [
            "Two things correlate because of a third factor. That factor is",
            "a hidden variable",
            ["the cause of the graph", "an outlier"],
            "Lurking.",
          ],
        ],
        [
          [
            "Points close to a line show",
            "strong correlation",
            ["weak correlation", "no correlation"],
            "Close.",
          ],
          [
            "Points widely scattered with a slight trend",
            "weak correlation",
            ["strong correlation", "causation"],
            "Loose.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "best-fit",
    "GF-S6.b",
    "Lines of best fit",
    "Draw a line through the trend to estimate; beware extrapolating.",
    [
      problem(
        "Predict a score",
        [
          "“Draw a line of best fit. Use it to estimate the score of a pupil who revised 4.5 hours.” And “Why is it unwise to estimate for 20 hours?”",
          "By the end of this lesson, you can draw a line of best fit and use it sensibly.",
        ],
        scatter(revision),
      ),
      choose(
        "Warm-up",
        "The correlation here is",
        "positive",
        "Rising.",
        [["negative", "Rising points: positive."]],
        { picture: scatter(revision) },
      ),
      typed("Warm-up", "$y = x + 0.5$ when $x = 4.5$", "5", "$4.5 + 0.5$.", "5."),
      explain(
        "Discover",
        "Through the middle of the points",
        [
          "A **line of best fit** is a straight line through the middle of the points, roughly as many above as below. It doesn't have to pass through (0, 0).",
          "Reading inside the data range is **interpolation** (reliable). Beyond it is **extrapolation** (risky).",
        ],
        scatter(revision, [{ m: 1, c: 0.5 }]),
      ),
      choose(
        "Discover",
        "A good line of best fit",
        "follows the trend, with points either side",
        "Balance.",
        [
          ["joins the first and last points", "It should follow all of them."],
          ["goes through every point", "Usually impossible."],
        ],
      ),
      worked(
        "Estimate",
        "Estimate the score for 4.5 hours.",
        [
          ["Go up from 4.5 to the line", "Interpolation."],
          ["Across to the score axis: about 5", "Read."],
        ],
        "About 5 marks: inside the data, so fairly reliable.",
        scatter(revision, [{ m: 1, c: 0.5 }]),
      ),
      steps(
        "Together",
        "20 hours of revision?",
        "Outside the data.",
        [
          ["The data only goes up to", "8 hours", ["20 hours", "Read the axis."], "8 hours"],
          [
            "So estimating for 20 hours is",
            "extrapolation: unreliable",
            ["interpolation", "It's beyond the data."],
            "Unreliable",
          ],
        ],
        "The pattern may not continue: marks can't exceed the maximum.",
      ),
      choose(
        "Together",
        "From the line, a score of 7 needs about",
        "6.5 hours",
        "Across from 7, down.",
        [
          ["7 hours", "Read from the line."],
          ["3 hours", "Across to the line, then down."],
        ],
        { picture: scatter(revision, [{ m: 1, c: 0.5 }]) },
      ),
      choose(
        "Your turn",
        "Interpolation means estimating",
        "within the range of the data",
        "Inside.",
        [["beyond the data", "That's extrapolation."]],
      ),
      choose(
        "Your turn",
        "With no correlation, a line of best fit is",
        "not useful",
        "There's no trend.",
        [["very accurate", "No trend to follow."]],
      ),
      choose(
        "Watch out",
        "Sam forces his line through (0, 0). Is that needed?",
        "No: it should follow the points, wherever it starts",
        "Only if the data suggests it.",
        [["Yes", "Lines of best fit can start anywhere."]],
      ),
      mistake(
        "Ola uses a line of best fit.",
        [
          "Data from 1 to 8 hours",
          "Line gives 5 marks at 4.5 h",
          "So 20 h gives 20.5 marks, which is reliable",
        ],
        2,
        "20 hours is far outside the data: extrapolation is unreliable.",
      ),
      choose(
        "Back to the problem",
        "“Why is it unwise to estimate the score for 20 hours?”",
        "It's outside the data: the trend may not continue",
        "Extrapolation.",
        [
          ["The line is wrong", "The line is fine within the data."],
          ["It's interpolation", "It's beyond the data."],
        ],
      ),
      quiz([
        [
          [
            "A line of best fit should",
            "follow the trend",
            ["join the ends", "go through (0, 0)"],
            "Balanced.",
          ],
          [
            "Points above and below the line should be",
            "roughly balanced",
            ["all above", "all below"],
            "Middle.",
          ],
        ],
        [
          [
            "Estimating inside the data",
            "interpolation",
            ["extrapolation", "correlation"],
            "Inside.",
          ],
          [
            "Estimating beyond the data",
            "extrapolation",
            ["interpolation", "causation"],
            "Outside.",
          ],
        ],
        [
          ["More reliable:", "interpolation", ["extrapolation", "both the same"], "Within data."],
          ["Line of best fit needs", "correlation", ["no correlation", "an outlier"], "A trend."],
        ],
      ]),
    ],
  ),
];
