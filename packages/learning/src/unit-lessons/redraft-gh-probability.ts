// GCSE Higher, "Conditional probability", on the stepped template
// (docs/proposals/lesson-stepped.md): from two-way tables, from trees and from Venn diagrams. The
// table, tree or Venn diagram carries the numbers; the words say which probability to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { probabilityTree } from "./gf-probability-2.ts";
import { clubs, ghProbability, travel, umbrella } from "./gh-probability.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PB = ghProbability;
const NUMBER = "A probability: the numbers are the picture.";
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Conditional probability from tables.

const TABLE = "gh-probability/two-way";
const tableMethod = [
  "Find the row or column you're given.",
  "Its total is the bottom of the fraction.",
  "The cell you want is the top.",
];
const PETS: Picture = {
  kind: "table",
  head: ["", "Cat", "Dog", "Total"],
  rows: [
    ["Boys", "8", "12", "20"],
    ["Girls", "14", "6", "20"],
    ["Total", "22", "18", "40"],
  ],
};
const given = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "The given group's total goes on the bottom.", {
    asks: "given",
    picture: travel,
    ...extra,
  });

const twoWay = stepped(find(PB, TABLE), {
  method: tableMethod,
  variation: {
    relationship: "a smaller total after “given”",
    unknowns: ["given", "pets"],
    surface: ["a column, not a row", "the other way round", "the whole table"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A smaller total",
        ["**“Given that” shrinks the total to just that row or column.**"],
        travel,
        "P(walk | Year 11): walkers in Year 11 ÷ all of Year 11.",
      ),
      reworded(PB, TABLE, "P(walk | Year 11) uses which total?", { tag: "The rule" }),

      ...owned(PB, TABLE, "Warm-up", "Check you remember"),

      methodCard("The method", tableMethod, travel),
      workedFrom(PB, TABLE),
      calc(
        "Your turn",
        "Pets of 40 pupils. P(dog | girl)?",
        PETS,
        [
          ["Girls in all:", "20", "The girls' row total."],
          ["Girls with a dog:", "6", "Read the cell."],
        ],
        "$\\frac{6}{20} = \\frac{3}{10}$.",
      ),

      calc(
        "Practise",
        "Pets of 40 pupils. P(boy | cat)?",
        PETS,
        [
          ["Cat owners in all:", "22", "The cat column total."],
          ["Boys with a cat:", "8", "Read the cell."],
        ],
        "$\\frac{8}{22} = \\frac{4}{11}$.",
      ),
      ...owned(PB, TABLE, "Together", "Practise"),
      ...owned(PB, TABLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Pets of 40 pupils. Watch what changes.",
        [
          pick(
            "P(cat | boy)",
            "$\\frac{8}{20}$",
            ["$\\frac{8}{40}$", "$\\frac{8}{22}$"],
            "Out of the boys.",
            {
              asks: "pets",
              picture: PETS,
            },
          ),
          pick(
            "P(boy | cat)",
            "$\\frac{8}{22}$",
            ["$\\frac{8}{20}$", "$\\frac{8}{40}$"],
            "Out of the cat owners.",
            {
              asks: "pets",
              picture: PETS,
              changed: "The other way round.",
            },
          ),
          pick(
            "P(boy and cat)",
            "$\\frac{8}{40}$",
            ["$\\frac{8}{20}$", "$\\frac{8}{22}$"],
            "Out of everyone.",
            {
              asks: "pets",
              picture: PETS,
              changed: "No “given”.",
            },
          ),
          pick(
            "P(dog | girl)",
            "$\\frac{6}{20}$",
            ["$\\frac{6}{18}$", "$\\frac{6}{40}$"],
            "Out of the girls.",
            {
              asks: "pets",
              picture: PETS,
              changed: "Girls and dogs.",
            },
          ),
        ],
        "The “given” group sets the total.",
      ),

      questionSet(
        "Variation",
        "How pupils travel. Watch what changes.",
        [
          given(
            "P(Year 10 | walks)",
            "$\\frac{40}{75}$",
            ["$\\frac{40}{80}$", "$\\frac{40}{150}$"],
            {
              expect: [
                "For P(Year 10 | walks), Ben divides by the Year 10 total. Right?",
                "No",
                "Given walks: divide by all the walkers, 75.",
                [["Yes", "Which group are you told about?"]],
              ],
            },
          ),
          given(
            "P(walks | Year 10)",
            "$\\frac{40}{80}$",
            ["$\\frac{40}{75}$", "$\\frac{40}{150}$"],
            {
              changed: "The other way round.",
            },
          ),
          given("P(car | Year 11)", "$\\frac{15}{70}$", ["$\\frac{15}{25}$", "$\\frac{15}{150}$"], {
            changed: "Another cell.",
          }),
          given("P(Year 11 | car)", "$\\frac{15}{25}$", ["$\\frac{15}{70}$", "$\\frac{15}{150}$"], {
            changed: "Swapped again.",
          }),
        ],
        "P(A | B) and P(B | A) have different totals.",
      ),
      own(PB, TABLE, "Spot the mistake"),

      own(PB, TABLE, "Exit check"),

      reworded(
        PB,
        TABLE,
        "“A Year 11 pupil is chosen. Find the probability they walk.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**“Given that” shrinks the total to just that row or column.**"],
        travel,
        [
          "**“Given that” shrinks the total to just that row or column.**",
          "P(A | B): divide by the total of B.",
          "P(A | B) is not P(B | A).",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Conditional probability from trees.

const TREE = "gh-probability/trees";
const treeMethod = [
  "Second branches are already conditional.",
  "P(B): add every path that ends in B.",
  "P(A | B) = P(A and B) ÷ P(B).",
];
const TRAIN = probabilityTree(
  [
    ["0.3", "Snow"],
    ["0.7", "Clear"],
  ],
  [
    ["0.5", "Late"],
    ["0.5", "On time"],
    ["0.1", "Late"],
    ["0.9", "On time"],
  ],
);
const backwards = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply along, add the paths, then divide.", {
    asks: "reverse",
    picture: TRAIN,
    ...extra,
  });

const trees = stepped(find(PB, TREE), {
  method: treeMethod,
  variation: {
    relationship: "a tree read backwards",
    unknowns: ["path", "reverse"],
    surface: ["the other outcome", "the other branch", "the opposite question"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Divide by the given",
        ["**To go backwards: P(A | B) = P(A and B) ÷ P(B).**"],
        umbrella,
        "The second branches are already “given the first”.",
      ),
      reworded(PB, TREE, "P(umbrella) is", { tag: "The rule" }),

      ...owned(PB, TREE, "Warm-up", "Check you remember"),

      methodCard("The method", treeMethod, umbrella),
      workedFrom(PB, TREE),
      calc(
        "Your turn",
        "Train journeys. Use the tree.",
        TRAIN,
        [
          ["P(snow and late):", "0.15", "Multiply along."],
          ["P(clear and late):", "0.07", "Multiply along."],
          ["P(late):", "0.22", "Add both paths."],
        ],
        "P(late) = 0.22.",
      ),

      calc(
        "Practise",
        "The train is late. Was it snowing?",
        TRAIN,
        [["P(snow | late), to 2 d.p.:", "0.68", "0.15 ÷ 0.22."]],
        "About 0.68.",
      ),
      ...owned(PB, TREE, "Together", "Practise"),
      ...owned(PB, TREE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Train journeys. Watch what changes.",
        [
          pick("P(snow and late)", "0.15", ["0.8", "0.5"], "Multiply along.", {
            asks: "path",
            picture: TRAIN,
          }),
          pick("P(clear and on time)", "0.63", ["1.6", "0.9"], "Multiply along.", {
            asks: "path",
            picture: TRAIN,
            changed: "The other path.",
          }),
          pick("P(late)", "0.22", ["0.6", "0.15"], "Add both late paths.", {
            asks: "path",
            picture: TRAIN,
            changed: "Two paths.",
          }),
          pick("P(on time)", "0.78", ["1.4", "0.63"], "1 − P(late).", {
            asks: "path",
            picture: TRAIN,
            changed: "On time.",
          }),
        ],
        "Multiply along; add across.",
      ),

      questionSet(
        "Variation",
        "Read it backwards. Watch what changes.",
        [
          backwards("P(snow | late), to 2 d.p.", "0.68", ["0.5", "0.15"], {
            expect: [
              "Leo finds P(rain | umbrella) by dividing by P(rain). Right?",
              "No",
              "Given umbrella: divide by P(umbrella) = 0.48.",
              [["Yes", "Which event are you told happened?"]],
            ],
          }),
          backwards("P(clear | late), to 2 d.p.", "0.32", ["0.1", "0.07"], {
            changed: "The other cause.",
          }),
          backwards("P(snow | on time), to 2 d.p.", "0.19", ["0.5", "0.15"], {
            changed: "On time.",
          }),
          backwards("P(late | snow)", "0.5", ["0.68", "0.15"], {
            changed: "The opposite question.",
          }),
        ],
        "Forwards: read the branch. Backwards: divide.",
      ),
      own(PB, TREE, "Spot the mistake"),

      own(PB, TREE, "Exit check"),

      reworded(
        PB,
        TREE,
        "“Mo has an umbrella. Find the probability it is raining.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**To go backwards: P(A | B) = P(A and B) ÷ P(B).**"],
        umbrella,
        [
          "**To go backwards: P(A | B) = P(A and B) ÷ P(B).**",
          "Second branches are already conditional.",
          "P(B): add every path ending in B.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Conditional probability from Venn diagrams.

const VENN = "gh-probability/venn";
const vennMethod = [
  "Find the given circle (or region).",
  "Its total is the bottom.",
  "The part also in the other set is the top.",
];
const inside = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Only count inside the given region.", {
    asks: "given",
    picture: clubs,
    ...extra,
  });

const venn = stepped(find(PB, VENN), {
  method: vennMethod,
  variation: {
    relationship: "a circle as the new total",
    unknowns: ["given"],
    surface: ["the other circle", "outside a circle", "both together"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inside the given circle",
        ["**Given A: only look inside circle A. Its total is the bottom.**"],
        clubs,
        "P(Drama | Music) counts the overlap out of the music circle.",
      ),
      reworded(PB, VENN, "P(Drama | Music) uses the total", { tag: "The rule" }),

      ...owned(PB, VENN, "Warm-up", "Check you remember"),

      methodCard("The method", vennMethod, clubs),
      workedFrom(PB, VENN),
      calc(
        "Your turn",
        "Clubs of 50 pupils. P(Music | Drama)?",
        clubs,
        [
          ["The drama circle:", "20", "14 + 6."],
          ["Also in music:", "6", "The overlap."],
        ],
        "$\\frac{6}{20} = \\frac{3}{10}$.",
      ),

      calc(
        "Practise",
        "Clubs of 50 pupils. P(Drama | not in Music)?",
        clubs,
        [
          ["Outside music:", "34", "14 + 20."],
          ["In drama:", "14", "Drama only."],
        ],
        "$\\frac{14}{34} = \\frac{7}{17}$.",
      ),
      ...owned(PB, VENN, "Together", "Practise"),
      ...owned(PB, VENN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which total? Watch what changes.",
        [
          inside("Given Music", "16", ["50", "6"]),
          inside("Given Drama", "20", ["14", "50"], { changed: "The other circle." }),
          inside("Given not in Drama", "30", ["20", "36"], { changed: "Outside a circle." }),
          inside("Given in a club", "30", ["50", "36"], { changed: "Either circle." }),
        ],
        "The given region's count is the bottom.",
      ),

      questionSet(
        "Variation",
        "Clubs of 50 pupils. Watch what changes.",
        [
          inside("P(Music | Drama)", "$\\frac{6}{20}$", ["$\\frac{6}{14}$", "$\\frac{6}{50}$"], {
            expect: [
              "For P(Music | Drama), Ed divides by drama only: 14. Right?",
              "No",
              "The drama circle includes the overlap: 20.",
              [["Yes", "Is the overlap inside the drama circle?"]],
            ],
          }),
          inside("P(Drama | Music)", "$\\frac{6}{16}$", ["$\\frac{6}{20}$", "$\\frac{6}{50}$"], {
            changed: "The other way round.",
          }),
          inside(
            "P(Music | not Drama)",
            "$\\frac{10}{30}$",
            ["$\\frac{10}{16}$", "$\\frac{10}{50}$"],
            {
              changed: "Outside drama.",
            },
          ),
          inside("P(both | in a club)", "$\\frac{6}{30}$", ["$\\frac{6}{50}$", "$\\frac{6}{36}$"], {
            changed: "Either club.",
          }),
        ],
        "Count only inside the given region.",
      ),
      own(PB, VENN, "Spot the mistake"),

      own(PB, VENN, "Exit check"),

      reworded(
        PB,
        VENN,
        "“A music club pupil is chosen. Find the probability they are also in drama.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Given A: only look inside circle A. Its total is the bottom.**"],
        clubs,
        [
          "**Given A: only look inside circle A. Its total is the bottom.**",
          "A circle's total includes the overlap.",
          "P(A | B) is usually not P(B | A).",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghProbabilityStepped: [string, UnitLesson[]][] = [
  [TABLE, [twoWay]],
  [TREE, [trees]],
  [VENN, [venn]],
];
