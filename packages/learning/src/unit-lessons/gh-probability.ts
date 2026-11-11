// GCSE Higher, "Probability", as three short lessons, one just before each skill: conditional
// probability from two-way tables, from tree diagrams and from Venn diagrams. Each recaps the
// Foundation idea quickly, builds it to Higher level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import { probabilityTree } from "./gf-probability-2.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-probability";

const travel: Picture = {
  kind: "table",
  head: ["", "Bus", "Walk", "Car", "Total"],
  rows: [
    ["Year 10", "30", "40", "10", "80"],
    ["Year 11", "20", "35", "15", "70"],
    ["Total", "50", "75", "25", "150"],
  ],
};
const umbrella = probabilityTree(
  [
    ["0.4", "Rain"],
    ["0.6", "Dry"],
  ],
  [
    ["0.9", "Umbrella"],
    ["0.1", "None"],
    ["0.2", "Umbrella"],
    ["0.8", "None"],
  ],
);
const clubs: Picture = {
  kind: "venn",
  a: "Drama",
  b: "Music",
  onlyA: ["14"],
  both: ["6"],
  onlyB: ["10"],
  neither: ["20"],
};

export const ghProbability: UnitLesson[] = [
  lesson(
    U,
    "two-way",
    "GH-P9.a",
    "Conditional probability from tables",
    "Given that… means: only look at that row or column.",
    [
      problem(
        "How pupils travel",
        [
          "The table shows how 150 pupils get to school. “A Year 11 pupil is chosen at random. Find the probability they walk.”",
          "By the end of this lesson, you can find probabilities when you're told something already.",
        ],
        travel,
      ),
      typed("Warm-up", "How many Year 11 pupils?", "70", "Row total.", "70.", { picture: travel }),
      typed("Warm-up", "How many Year 11 pupils walk?", "35", "Read the table.", "35.", {
        picture: travel,
      }),
      explain(
        "Discover",
        "A smaller total",
        [
          "A **conditional** probability is found when you already know something: “given that the pupil is in Year 11”.",
          "The total shrinks to just that group. P(walk | Year 11) means walkers in Year 11 ÷ all of Year 11.",
        ],
        travel,
      ),
      choose(
        "Discover",
        "P(walk | Year 11) uses which total?",
        "70",
        "Only Year 11.",
        [
          ["150", "That's everyone."],
          ["75", "That's all walkers."],
        ],
        { picture: travel },
      ),
      worked(
        "The problem",
        "P(walks, given Year 11)",
        [
          ["35 walk, out of 70 in Year 11", "Restrict to the row."],
          ["$\\frac{35}{70} = \\frac12$", "Simplify."],
        ],
        "Compare P(walk) for everyone: $\\frac{75}{150} = \\frac12$ too.",
        travel,
      ),
      steps(
        "Together",
        "A pupil who comes by car is chosen. P(Year 10)?",
        "Restrict to the column.",
        [
          ["Car total:", "25", ["10", "That's Year 10 by car."], "25"],
          [
            "P(Year 10 | car) =",
            "$\\frac{10}{25} = \\frac25$",
            ["$\\frac{10}{80}$", "Given car: out of 25."],
            "$\\frac25$",
          ],
        ],
        "“Given” tells you the total.",
        travel,
      ),
      choose(
        "Together",
        "P(bus | Year 10)",
        "$\\frac{30}{80}$",
        "Year 10 row.",
        [
          ["$\\frac{30}{50}$", "That's P(Year 10 | bus)."],
          ["$\\frac{30}{150}$", "Restrict to Year 10."],
        ],
        { picture: travel },
      ),
      typed("Your turn", "P(Year 11 | bus), simplified", "2/5", "20 of 50.", "$\\frac25$.", {
        picture: travel,
        wrong: [["20/70", "Given bus: out of 50."]],
      }),
      typed("Your turn", "P(walk | Year 10), simplified", "1/2", "40 of 80.", "$\\frac12$.", {
        picture: travel,
      }),
      choose(
        "Watch out",
        "Ola finds P(walk | Year 11) as $\\frac{35}{150}$. What's wrong?",
        "Given Year 11: divide by 70",
        "Smaller total.",
        [["Nothing", "That's P(Year 11 and walks)."]],
      ),
      mistake(
        "Ben finds P(Year 10 | walks).",
        ["Walkers in Year 10: 40", "Year 10 total: 80", "$\\frac{40}{80} = \\frac12$"],
        1,
        "Given walks: the total is all 75 walkers. $\\frac{40}{75} = \\frac{8}{15}$.",
      ),
      typed(
        "Back to the problem",
        "“A Year 11 pupil is chosen. Find the probability they walk.”",
        "1/2",
        "35 of 70.",
        "$\\frac12$.",
        { picture: travel, wrong: [["35/150", "Out of Year 11 only."]] },
      ),
      quiz([
        [
          [
            "P(car | Year 11)",
            "$\\frac{15}{70}$",
            ["$\\frac{15}{25}$", "$\\frac{15}{150}$"],
            "Year 11 row.",
          ],
          [
            "P(car | Year 10)",
            "$\\frac{10}{80}$",
            ["$\\frac{10}{25}$", "$\\frac{10}{150}$"],
            "Year 10 row.",
          ],
        ],
        [
          [
            "P(Year 10 | bus)",
            "$\\frac{30}{50}$",
            ["$\\frac{30}{80}$", "$\\frac{30}{150}$"],
            "Bus column.",
          ],
          [
            "P(Year 11 | walk)",
            "$\\frac{35}{75}$",
            ["$\\frac{35}{70}$", "$\\frac{35}{150}$"],
            "Walk column.",
          ],
        ],
        [
          ["“Given that” changes the", "total", ["numerator only", "nothing"], "Restrict."],
          ["P(A | B) is read", "A given B", ["A and B", "A or B"], "Notation."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "trees",
    "GH-P9.b",
    "Conditional probability from trees",
    "Second branches depend on the first; P(A | B) = P(A and B) ÷ P(B).",
    [
      problem(
        "Rain and umbrellas",
        [
          "P(rain) = 0.4. If it rains, Mo takes an umbrella with probability 0.9; if dry, 0.2. “Mo has an umbrella. Find the probability it is raining.”",
          "By the end of this lesson, you can work backwards through a tree.",
        ],
        umbrella,
      ),
      typed("Warm-up", "P(rain and umbrella)", "0.36", "$0.4 \\times 0.9$.", "0.36.", {
        picture: umbrella,
      }),
      typed("Warm-up", "P(dry and umbrella)", "0.12", "$0.6 \\times 0.2$.", "0.12.", {
        picture: umbrella,
      }),
      explain(
        "Discover",
        "Divide by the given",
        [
          "The second branches of the tree are already conditional: 0.9 is P(umbrella | rain).",
          "To go the other way, use **P(A | B) = P(A and B) ÷ P(B)**: find every path where B happens, add them, and divide.",
        ],
        umbrella,
      ),
      choose(
        "Discover",
        "P(umbrella) is",
        "0.36 + 0.12 = 0.48",
        "Both umbrella paths.",
        [
          ["0.9 + 0.2", "Multiply along first."],
          ["0.36", "Include the dry path."],
        ],
        { picture: umbrella },
      ),
      worked(
        "The problem",
        "P(rain | umbrella)",
        [
          ["P(rain and umbrella) = 0.36", "One path."],
          ["P(umbrella) = 0.48", "Both paths."],
          ["$\\frac{0.36}{0.48} = 0.75$", "Divide."],
        ],
        "Seeing the umbrella makes rain much likelier than 0.4.",
        umbrella,
      ),
      steps(
        "Together",
        "P(dry | no umbrella)",
        "Same method.",
        [
          ["P(no umbrella):", "0.04 + 0.48 = 0.52", ["0.1 + 0.8", "Multiply along first."], "0.52"],
          [
            "P(dry | none) =",
            "$\\frac{0.48}{0.52} = 0.923$",
            ["0.48", "Divide by 0.52."],
            "0.923 (3 s.f.)",
          ],
        ],
        "Given no umbrella, it's very likely dry.",
        umbrella,
      ),
      choose(
        "Together",
        "Which branch value is P(umbrella | dry)?",
        "0.2",
        "Second branch after Dry.",
        [
          ["0.12", "That's P(dry and umbrella)."],
          ["0.6", "That's P(dry)."],
        ],
        { picture: umbrella },
      ),
      typed(
        "Your turn",
        "P(A) = 0.5, P(B | A) = 0.6, P(B | not A) = 0.2. P(B)",
        "0.4",
        "$0.3 + 0.1$.",
        "0.4.",
      ),
      typed("Your turn", "So P(A | B)", "0.75", "$0.3 \\div 0.4$.", "0.75.", {
        wrong: [["0.6", "That's P(B | A)."]],
      }),
      choose(
        "Watch out",
        "Kim says P(rain | umbrella) = 0.9, read off the tree. What's wrong?",
        "0.9 is P(umbrella | rain): the other way round",
        "Order matters.",
        [["Nothing", "Divide 0.36 by 0.48."]],
      ),
      mistake(
        "Leo finds P(rain | umbrella).",
        ["P(rain and umbrella) = 0.36", "Divide by P(rain) = 0.4", "= 0.9"],
        1,
        "Divide by P(umbrella) = 0.48: 0.75.",
      ),
      typed(
        "Back to the problem",
        "“Mo has an umbrella. Find the probability it is raining.”",
        "0.75",
        "$0.36 \\div 0.48$.",
        "0.75.",
        { picture: umbrella, wrong: [["0.36", "Divide by P(umbrella)."]] },
      ),
      quiz([
        [
          ["P(A and B) = 0.2, P(B) = 0.5. P(A | B)", "0.4", ["0.1", "0.7"], "Divide."],
          ["P(A and B) = 0.3, P(B) = 0.6. P(A | B)", "0.5", ["0.18", "0.9"], "Divide."],
        ],
        [
          [
            "Second branches on a tree are",
            "conditional",
            ["independent always", "totals"],
            "Given the first.",
          ],
          ["P(A | B) =", "P(A and B) ÷ P(B)", ["P(A) × P(B)", "P(B) ÷ P(A)"], "Formula."],
        ],
        [
          ["P(umbrella) on the tree", "0.48", ["1.1", "0.36"], "Add paths."],
          ["P(no umbrella) on the tree", "0.52", ["0.9", "0.48"], "Add paths."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "venn",
    "GH-P9.c",
    "Conditional probability from Venn diagrams",
    "Given A: only look inside circle A.",
    [
      problem(
        "Drama and music",
        [
          "The Venn diagram shows 50 pupils' clubs. “A pupil in the music club is chosen. Find the probability they are also in drama.”",
          "By the end of this lesson, you can find P(A | B) from a Venn diagram.",
        ],
        clubs,
      ),
      typed("Warm-up", "How many in music?", "16", "10 + 6.", "16.", { picture: clubs }),
      typed("Warm-up", "How many in both?", "6", "The overlap.", "6.", { picture: clubs }),
      explain(
        "Discover",
        "Inside the given circle",
        [
          "P(Drama | Music): the pupil is in the music circle, so the total is everyone in that circle. Count the part also in drama: the overlap.",
          "In symbols, P(A | B) = n(A ∩ B) ÷ n(B).",
        ],
        clubs,
      ),
      choose(
        "Discover",
        "P(Drama | Music) uses the total",
        "16",
        "The music circle.",
        [
          ["50", "Given music only."],
          ["20", "That's drama."],
        ],
        { picture: clubs },
      ),
      worked(
        "The problem",
        "P(Drama | Music)",
        [
          ["Music circle: 16", "Total."],
          ["Also in drama: 6", "Overlap."],
          ["$\\frac{6}{16} = \\frac38$", "Simplify."],
        ],
        "Not the same as P(Music | Drama).",
        clubs,
      ),
      steps(
        "Together",
        "P(Music | Drama)",
        "The other way round.",
        [
          ["Drama circle:", "20", ["14", "Include the overlap."], "20"],
          [
            "P =",
            "$\\frac{6}{20} = \\frac{3}{10}$",
            ["$\\frac{6}{16}$", "That's given music."],
            "$\\frac{3}{10}$",
          ],
        ],
        "Swap the condition, change the total.",
        clubs,
      ),
      choose(
        "Together",
        "P(Music | not in Drama)",
        "$\\frac{10}{30}$",
        "Outside drama: 10 + 20.",
        [
          ["$\\frac{10}{50}$", "Given not drama: 30."],
          ["$\\frac{10}{16}$", "Given not drama."],
        ],
        { picture: clubs },
      ),
      typed(
        "Your turn",
        "P(neither | not in Music), simplified",
        "10/17",
        "20 of 34.",
        "$\\frac{20}{34} = \\frac{10}{17}$.",
        { picture: clubs },
      ),
      choose(
        "Your turn",
        "P(Drama ∪ Music) as a fraction of 50",
        "$\\frac{30}{50}$",
        "14 + 6 + 10.",
        [
          ["$\\frac{36}{50}$", "The overlap once."],
          ["$\\frac{6}{50}$", "That's ∩."],
        ],
        { picture: clubs },
      ),
      choose(
        "Watch out",
        "Zoe finds P(Drama | Music) as $\\frac{6}{50}$. What's wrong?",
        "That's P(both); given music, divide by 16",
        "Change the total.",
        [["Nothing", "“Given” shrinks the total."]],
      ),
      mistake(
        "Ed finds P(Music | Drama).",
        ["Drama only: 14", "Overlap: 6", "$\\frac{6}{14}$"],
        2,
        "The drama circle is 14 + 6 = 20: $\\frac{6}{20}$.",
      ),
      typed(
        "Back to the problem",
        "“A music club pupil is chosen. Find the probability they are also in drama.”",
        "3/8",
        "6 of 16.",
        "$\\frac38$.",
        { picture: clubs, wrong: [["6/50", "Out of the music circle."]] },
      ),
      quiz([
        [
          [
            "n(A) = 12, n(A ∩ B) = 3. P(B | A)",
            "$\\frac14$",
            ["$\\frac{3}{15}$", "$\\frac13$"],
            "3 of 12.",
          ],
          [
            "n(A) = 20, n(A ∩ B) = 5. P(B | A)",
            "$\\frac14$",
            ["$\\frac15$", "$\\frac{5}{25}$"],
            "5 of 20.",
          ],
        ],
        [
          ["P(A | B) uses the total", "n(B)", ["n(A)", "everyone"], "Given B."],
          ["P(B | A) uses the total", "n(A)", ["n(B)", "everyone"], "Given A."],
        ],
        [
          ["P(A | B) = P(B | A)", "not always", ["always", "never"], "Different totals."],
          [
            "If P(A | B) = P(A), A and B are",
            "independent",
            ["mutually exclusive", "impossible"],
            "No effect.",
          ],
        ],
      ]),
    ],
  ),
];
