// Year 9, "Probability", as four short lessons, one just before each skill: listing every outcome
// in tables and grids, sorting into Venn diagrams, the probability of a single event (ways ÷ all
// the equally likely outcomes), and of combined events from a sample space. Each starts from
// something quick, builds the method a step at a time, names the common mistakes, and ends on an
// exit check.
import type { UnitLesson, VennPic } from "./types.ts";

const GRIDS = "Y9-PRO-01.a";
const VENN = "Y9-PRO-01.b";
const SINGLE = "Y9-PRO-02.a";
const COMBINED = "Y9-PRO-02.b";

const die = ["1", "2", "3", "4", "5", "6"];
const totals = Array.from({ length: 36 }, (_, i) => String(Math.floor(i / 6) + (i % 6) + 2));
/** The squares of the two-dice grid whose total passes a test. */
const where = (test: (total: number) => boolean) =>
  totals.flatMap((t, i) => (test(Number(t)) ? [i] : []));
const sevens = where((t) => t === 7);
const tens = where((t) => t === 10);
const sevenUp = where((t) => t >= 7);
const diceGrid = {
  kind: "grid" as const,
  cols: 6,
  rows: 6,
  shaded: 0,
  colLabels: die,
  rowLabels: die,
  values: totals,
};

const evenSquare: VennPic = {
  kind: "venn",
  a: "Even",
  b: "Square",
  onlyA: ["2", "6", "8", "10"],
  both: ["4"],
  onlyB: ["1", "9"],
  neither: ["3", "5", "7"],
};
/** A Venn diagram of club members, a count in each region known so far (none in the others). */
const clubs = (football: string[], both: string[], tennis: string[]): VennPic => ({
  kind: "venn",
  a: "Football",
  b: "Tennis",
  onlyA: football,
  both,
  onlyB: tennis,
  neither: [],
});

export const y9Probability: UnitLesson[] = [
  {
    unit: "y9-probability",
    id: "y9-probability/listing",
    before: GRIDS,
    title: "Listing every outcome",
    summary: "Use a table or grid to list every possible outcome, without missing any.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The meal deal",
        text: [
          "A café's meal deal is one main and one drink. There are 3 mains and 4 drinks. Lily says that makes 7 different meal deals.",
          "Is she right? By the end of this lesson, you can count them properly.",
        ],
        picture: {
          kind: "table",
          head: ["Mains", "Drinks"],
          rows: [
            ["Pizza", "Juice"],
            ["Pasta", "Water"],
            ["Salad", "Milk"],
            ["", "Tea"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many ways can one dice land?",
        answers: ["6"],
        hint: "1, 2, 3, …",
        done: "6: 1, 2, 3, 4, 5 or 6.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $6 \\times 6$?",
        answers: ["36"],
        hint: "Six sixes.",
        done: "36.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Two coins are flipped. How many outcomes are there?",
        picture: {
          kind: "table",
          head: ["", "Head", "Tail"],
          rows: [
            ["Head", "HH", "HT"],
            ["Tail", "TH", "TT"],
          ],
        },
        options: [
          {
            text: "4",
            correct: true,
            feedback: "HH, HT, TH and TT. Every first coin with every second coin: $2 \\times 2$.",
          },
          { text: "3", feedback: "HT (head first) and TH (tail first) are different outcomes." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A sample space",
        text: [
          "Roll two dice and add them. Every first dice with every second dice gives $6 \\times 6 = 36$ outcomes.",
          "This grid is the **sample space**: each square is one outcome, showing its total. A grid makes sure none are missed.",
        ],
        picture: diceGrid,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A spinner and a coin",
        picture: {
          kind: "table",
          head: ["", "1", "2", "3"],
          rows: [
            ["H", "1H", "2H", "3H"],
            ["T", "1T", "2T", "3T"],
          ],
        },
        problem: "A spinner shows 1, 2 or 3, and a coin is flipped. List every outcome.",
        steps: [
          {
            line: "Put the spinner along the top, the coin down the side",
            why: "One thing on each edge of the table.",
          },
          {
            line: "Fill every square: 1H, 2H, 3H, 1T, 2T, 3T",
            why: "Every spinner number with every coin side.",
          },
          { line: "6 outcomes: $3 \\times 2$", why: "Count them, or multiply." },
        ],
        done: "6 outcomes. The table shows them all, so none are missed.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Mains and drinks",
        start: "2 mains (pizza, pasta) and 3 drinks (juice, water, milk).",
        stages: [
          {
            prompt: "How many meals have pizza?",
            options: [
              { text: "3: one with each drink", correct: true, feedback: "" },
              { text: "1", feedback: "Pizza and juice, pizza and water, pizza and milk." },
            ],
            then: "Pizza: 3 meals",
          },
          {
            prompt: "So how many meals altogether?",
            options: [
              { text: "$2 \\times 3 = 6$", correct: true, feedback: "" },
              { text: "$2 + 3 = 5$", feedback: "Pasta also goes with all 3 drinks: 3 + 3." },
            ],
            then: "6 meals",
          },
        ],
        done: "Every one of the first with every one of the second: multiply.",
      },
      {
        kind: "shade",
        tag: "Together",
        title: "Shade every way to score 10",
        cols: 6,
        rows: 6,
        target: 3,
        cells: tens,
        colLabels: die,
        rowLabels: die,
        values: totals,
        hint: "Find every square showing 10: (4, 6), (5, 5) and (6, 4).",
        done: "3 ways. (4, 6) and (6, 4) are different outcomes.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Two dice: how many ways to score 6?",
        picture: diceGrid,
        answers: ["5"],
        wrong: [
          {
            answer: "3",
            feedback: "(1, 5) and (5, 1) are different: count every square showing 6.",
          },
        ],
        hint: "Count the squares showing 6.",
        done: "5: (1, 5), (2, 4), (3, 3), (4, 2), (5, 1).",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A 4-sided spinner and a dice",
        text: "How many outcomes are there?",
        answers: ["24"],
        wrong: [
          {
            answer: "10",
            feedback: "That adds. Each spinner number goes with all 6 dice numbers: multiply.",
          },
        ],
        hint: "$4 \\times 6$.",
        done: "24.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Two dice can total anything from 2 to 12. Are all the totals equally likely?",
        options: [
          {
            text: "No: 7 can happen 6 ways, but 2 only 1 way",
            correct: true,
            feedback:
              "The 36 squares are equally likely; the 11 totals aren't. Count squares, not totals.",
          },
          {
            text: "Yes: there are 11 totals",
            feedback: "Look at the grid: 7 appears 6 times, 2 just once.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sam lists the outcomes for two coins.",
        lines: [
          "Two coins can land HH, HT or TT",
          "That's 3 outcomes",
          "So the chance of two heads is $\\frac13$",
        ],
        wrong: 0,
        why: "HT and TH are different: the first coin could be the head, or the second. There are 4 outcomes, and $P(\\text{HH}) = \\frac14$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The meal deal",
        text: "3 mains and 4 drinks. How many different meal deals are there?",
        answers: ["12"],
        wrong: [
          { answer: "7", feedback: "That adds them, like Lily. Each main goes with all 4 drinks." },
        ],
        hint: "Each of the 3 mains goes with each of the 4 drinks.",
        done: "$3 \\times 4 = 12$ meal deals. Lily's 7 only added them.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A coin is flipped and a dice is rolled. How many outcomes are there?",
            answers: ["12"],
            why: "$2 \\times 6$.",
            retry: {
              prompt: "Two 4-sided spinners are spun. How many outcomes are there?",
              answers: ["16"],
              why: "$4 \\times 4$.",
            },
          },
          {
            prompt: "Two dice: how many ways can they total 4?",
            picture: diceGrid,
            answers: ["3"],
            why: "(1, 3), (2, 2), (3, 1).",
            retry: {
              prompt: "Two dice: how many ways can they total 11?",
              picture: diceGrid,
              answers: ["2"],
              why: "(5, 6) and (6, 5).",
            },
          },
          {
            prompt: "3 starters and 5 mains. How many two-course meals?",
            options: ["15", "8", "35"],
            answers: ["15"],
            why: "$3 \\times 5$.",
            retry: {
              prompt: "4 shirts and 3 pairs of trousers. How many outfits?",
              options: ["12", "7", "43"],
              answers: ["12"],
              why: "$4 \\times 3$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-probability",
    id: "y9-probability/venn",
    before: VENN,
    title: "Venn diagrams",
    summary:
      "Sort things into two overlapping circles, and read what's in both, either or neither.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Sports clubs",
        text: [
          "In a class of 30, 18 play football, 12 play tennis, and 5 play both.",
          "How many play neither? (It isn't 0!) By the end of this lesson, you can sort it out.",
        ],
        picture: clubs([], ["5"], []),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many multiples of 3 are there from 1 to 12?",
        answers: ["4"],
        hint: "3, 6, …",
        done: "4: 3, 6, 9 and 12.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is even and a multiple of 3?",
        options: [
          { text: "6", correct: true, feedback: "6 is even, and $6 = 2 \\times 3$." },
          { text: "9", feedback: "9 is a multiple of 3, but odd." },
          { text: "8", feedback: "8 is even, but not a multiple of 3." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A Venn diagram",
        text: [
          "Numbers 1 to 10. Circle A holds the multiples of 2; circle B the multiples of 3.",
          "6 is in both, so it goes in the **overlap**. Numbers in neither go outside the circles, but inside the box.",
        ],
        picture: {
          kind: "venn",
          a: "×2",
          b: "×3",
          onlyA: ["2", "4", "8", "10"],
          both: ["6"],
          onlyB: ["3", "9"],
          neither: ["1", "5", "7"],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "With numbers up to 12, where would 12 go?",
        options: [
          {
            text: "In the overlap: it's even and a multiple of 3",
            correct: true,
            feedback: "Anything in both sets goes in the middle.",
          },
          { text: "In the ×2 circle only", feedback: "12 is a multiple of 3 as well." },
          { text: "Outside", feedback: "12 is in both sets." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Even and square, 1 to 10",
        picture: evenSquare,
        problem: "Sort 1 to 10 into a Venn diagram: even numbers, and square numbers.",
        steps: [
          { line: "Both: 4", why: "Even and square ($2^2$): the overlap first." },
          { line: "Even only: 2, 6, 8, 10", why: "The rest of the even numbers." },
          { line: "Square only: 1, 9", why: "The rest of the squares." },
          { line: "Neither: 3, 5, 7", why: "Everything left goes outside." },
        ],
        done: "All 10 numbers, each in exactly one place.",
      },
      {
        kind: "sort",
        tag: "Together",
        title: "Even and square",
        text: "Sort the numbers into the Venn diagram's regions.",
        groups: ["Even only", "Both", "Square only", "Neither"],
        items: [
          { text: "2", group: 0, why: "2 is even, but not a square number." },
          { text: "4", group: 1, why: "4 is even, and $4 = 2^2$." },
          { text: "9", group: 2, why: "$9 = 3^2$, but 9 is odd." },
          { text: "6", group: 0, why: "6 is even, but not square." },
          { text: "1", group: 2, why: "$1 = 1^2$, and 1 is odd." },
          { text: "5", group: 3, why: "5 is odd and not square." },
        ],
        done: "Overlap first, then each circle, then outside.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Cats and dogs",
        text: "20 people: 12 like cats, 10 like dogs, 4 like both.",
        start: "Start with the overlap: 4.",
        stages: [
          {
            prompt: "Cats only:",
            options: [
              { text: "$12 - 4 = 8$", correct: true, feedback: "" },
              { text: "12", feedback: "The 12 includes the 4 who like both." },
            ],
            then: "Cats only: 8",
          },
          {
            prompt: "Dogs only:",
            options: [
              { text: "$10 - 4 = 6$", correct: true, feedback: "" },
              { text: "10", feedback: "Take off the 4 in the overlap." },
            ],
            then: "Dogs only: 6",
          },
          {
            prompt: "Neither:",
            options: [
              { text: "$20 - 8 - 4 - 6 = 2$", correct: true, feedback: "" },
              { text: "$20 - 12 - 10 = -2$", feedback: "That counts the 4 who like both twice." },
            ],
            then: "Neither: 2",
          },
        ],
        done: "Fill the overlap first, so no one is counted twice.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Even and square",
        text: "A number from 1 to 10 is picked at random. What is the probability it is even and square?",
        picture: evenSquare,
        answers: ["1/10", "0.1"],
        wrong: [
          { answer: "7/10", feedback: "That's even **or** square. 'And' means the overlap only." },
        ],
        hint: "'And' means both: the overlap.",
        done: "Only 4: $\\frac{1}{10}$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Even or square",
        text: "How many numbers from 1 to 10 are even or square (or both)?",
        picture: evenSquare,
        answers: ["7"],
        wrong: [
          { answer: "8", feedback: "4 is in both circles, but count it once." },
          { answer: "1", feedback: "That's 'and'. 'Or' means anywhere in either circle." },
        ],
        hint: "Everything inside the circles.",
        done: "2, 6, 8, 10, 4, 1, 9: 7 numbers.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "18 play football, 5 play both. Sam writes 18 in the 'football only' part. Is he right?",
        options: [
          {
            text: "No: football only is $18 - 5 = 13$",
            correct: true,
            feedback:
              "The 18 includes the 5 who play both. Putting the whole 18 outside the overlap counts them twice.",
          },
          { text: "Yes", feedback: "Then the football circle would hold 18 + 5 = 23 people." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Numbers 1 to 10: even, and square. Ola finds P(even or square).",
        picture: evenSquare,
        lines: [
          "Even: 5 numbers",
          "Square: 3 numbers",
          "Even or square: $5 + 3 = 8$, so $\\frac{8}{10}$",
        ],
        wrong: 2,
        why: "4 is in both, so it was counted twice. There are 7 numbers: $\\frac{7}{10}$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Sports clubs",
        picture: clubs([], ["5"], []),
        start: "30 in the class: 18 football, 12 tennis, 5 both.",
        stages: [
          {
            prompt: "Football only:",
            options: [
              { text: "$18 - 5 = 13$", correct: true, feedback: "" },
              { text: "18", feedback: "Take off the 5 who play both." },
            ],
            then: "13",
          },
          {
            prompt: "Tennis only:",
            options: [
              { text: "$12 - 5 = 7$", correct: true, feedback: "" },
              { text: "12", feedback: "Take off the 5 who play both." },
            ],
            then: "7",
          },
          {
            prompt: "Neither:",
            options: [
              { text: "$30 - 13 - 5 - 7 = 5$", correct: true, feedback: "" },
              { text: "$30 - 18 - 12 = 0$", feedback: "That counts the 5 who play both twice." },
            ],
            then: "5",
          },
        ],
        done: "5 play neither. Adding 18 and 12 counts the 5 who play both twice.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A Venn diagram of multiples of 2 and of 5. Where does 10 go?",
            options: ["In the overlap", "In the ×2 circle only", "Outside"],
            answers: ["In the overlap"],
            why: "10 is a multiple of both.",
            retry: {
              prompt: "A Venn diagram of multiples of 2 and of 5. Where does 7 go?",
              options: ["Outside", "In the overlap", "In the ×5 circle only"],
              answers: ["Outside"],
              why: "7 is a multiple of neither.",
            },
          },
          {
            prompt: "15 like apples, 9 like pears, 4 like both. How many like apples only?",
            answers: ["11"],
            why: "$15 - 4 = 11$.",
            retry: {
              prompt: "20 like tea, 14 like coffee, 6 like both. How many like coffee only?",
              answers: ["8"],
              why: "$14 - 6 = 8$.",
            },
          },
          {
            prompt: "In a Venn diagram, 'A and B' means",
            options: ["the overlap", "everything in either circle", "outside both"],
            answers: ["the overlap"],
            why: "In both at once.",
            retry: {
              prompt: "In a Venn diagram, 'A or B' means",
              options: ["everything in either circle", "the overlap only", "outside both"],
              answers: ["everything in either circle"],
              why: "In one, the other, or both.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-probability",
    id: "y9-probability/single",
    before: SINGLE,
    title: "How likely?",
    summary:
      "The probability of an event: the ways it can happen ÷ all the equally likely outcomes.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A bag of sweets",
        text: [
          "A bag has 20 sweets: 8 strawberry, 5 lemon and 7 lime. You don't like lime.",
          "If you pick one without looking, what's the chance it's one you like? By the end of this lesson, you can say exactly.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "Strawberry", parts: 8, shaded: 8 },
            { label: "Lemon", parts: 5, shaded: 5 },
            { label: "Lime", parts: 7 },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $\\frac{5}{10}$",
        options: [
          { text: "$\\frac12$", correct: true, feedback: "Divide top and bottom by 5." },
          { text: "$\\frac15$", feedback: "Divide both by 5: $\\frac{1}{2}$." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "3 red, 5 blue and 2 green counters. How many counters?",
        answers: ["10"],
        hint: "Add them.",
        done: "10.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Rolling a 7 on an ordinary dice is",
        options: [
          {
            text: "impossible: probability 0",
            correct: true,
            feedback: "A dice only goes up to 6.",
          },
          { text: "unlikely", feedback: "It can't happen at all: impossible." },
          { text: "even chance", feedback: "There's no 7 on a dice." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "What's the probability of rolling a 4 on a dice?",
        text: "Give it as a fraction.",
        answers: ["1/6"],
        wrong: [{ answer: "4/6", feedback: "There's only one 4 on a dice." }],
        hint: "One 4, out of six equally likely numbers.",
        done: "$\\frac16$: 1 way, out of 6 equally likely outcomes.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Probability",
        text: [
          "When every outcome is **equally likely**: probability = the ways it can happen ÷ the total number of outcomes.",
          "It's always from 0 (impossible) to 1 (certain).",
        ],
        picture: {
          kind: "maths",
          tex: "P(\\text{event}) = \\frac{\\text{ways it can happen}}{\\text{all the outcomes}}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Counters in a bag",
        problem:
          "A bag has 3 red, 5 blue and 2 green counters. One is picked at random. Find P(red).",
        steps: [
          { line: "Ways: 3 red counters", why: "Each counter is equally likely." },
          { line: "All the outcomes: $3 + 5 + 2 = 10$", why: "Every counter could be picked." },
          { line: "$P(\\text{red}) = \\frac{3}{10}$", why: "Ways ÷ all." },
        ],
        done: "$\\frac{3}{10}$, or 0.3.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "P(blue)",
        start: "The same bag: 3 red, 5 blue, 2 green.",
        stages: [
          {
            prompt: "P(blue) =",
            options: [
              { text: "$\\frac{5}{10}$", correct: true, feedback: "" },
              {
                text: "$\\frac13$",
                feedback: "There are 3 colours, but not equally many of each. Count counters.",
              },
              { text: "$\\frac{5}{5}$", feedback: "Divide by all the counters, 10." },
            ],
            then: "$\\frac{5}{10}$",
          },
          {
            prompt: "Simplified:",
            options: [
              { text: "$\\frac12$", correct: true, feedback: "" },
              { text: "$\\frac15$", feedback: "Divide top and bottom by 5." },
            ],
            then: "$\\frac12$",
          },
        ],
        done: "An even chance.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "P(not green)",
        start: "The same bag: 3 red, 5 blue, 2 green.",
        stages: [
          {
            prompt: "Counters that aren't green:",
            options: [
              { text: "$3 + 5 = 8$", correct: true, feedback: "" },
              { text: "2", feedback: "That's the green ones. We want the others." },
            ],
            then: "8 ways",
          },
          {
            prompt: "So P(not green) =",
            options: [
              { text: "$\\frac{8}{10} = \\frac45$", correct: true, feedback: "" },
              { text: "$\\frac{2}{10}$", feedback: "That's P(green)." },
            ],
            then: "$\\frac45$",
          },
        ],
        done: "Or: $1 - P(\\text{green}) = 1 - \\frac{2}{10}$. Probabilities of 'happens' and 'doesn't' add to 1.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(even) on a dice",
        text: "Give it as a fraction.",
        answers: ["1/2", "3/6"],
        wrong: [{ answer: "1/6", feedback: "There are three even numbers: 2, 4 and 6." }],
        hint: "2, 4 and 6.",
        done: "$\\frac36 = \\frac12$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A spinner",
        text: "A spinner has 8 equal sections; 3 are red. What is P(not red)? Give it as a fraction.",
        picture: {
          kind: "spinner",
          sectors: [
            { label: "R", size: 3 },
            { label: "B", size: 3 },
            { label: "Y", size: 2 },
          ],
        },
        answers: ["5/8"],
        wrong: [{ answer: "3/8", feedback: "That's P(red). Not red is the other 5." }],
        hint: "$8 - 3 = 5$ sections aren't red.",
        done: "$\\frac58$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A bag has red, blue and green counters. Is P(blue) = $\\frac13$?",
        options: [
          {
            text: "Only if there are equal numbers of each",
            correct: true,
            feedback:
              "Count counters, not colours. With 3 red, 5 blue and 2 green, P(blue) is $\\frac{5}{10}$.",
          },
          {
            text: "Yes: 3 colours",
            feedback:
              "The colours aren't equally likely unless there are equally many counters of each.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy finds the probability of rolling more than 4 on a dice.",
        lines: [
          "More than 4 means 4, 5 and 6",
          "That's 3 ways out of 6",
          "So the probability is $\\frac12$",
        ],
        wrong: 0,
        why: "'More than 4' leaves 4 out: just 5 and 6. That's $\\frac26 = \\frac13$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A bag of sweets",
        text: "8 strawberry, 5 lemon, 7 lime. What's the probability of picking one you like (not lime)? Give it as a fraction.",
        answers: ["13/20"],
        wrong: [
          { answer: "7/20", feedback: "That's P(lime). You want the others." },
          { answer: "2/3", feedback: "Count sweets, not flavours: 13 of the 20." },
        ],
        hint: "$8 + 5$ sweets you like, out of 20.",
        done: "$\\frac{13}{20}$: better than an even chance.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "4 red and 6 blue counters. What is P(red), as a fraction?",
            answers: ["4/10", "2/5"],
            why: "4 out of 10.",
            retry: {
              prompt: "2 red and 8 blue counters. What is P(red), as a fraction?",
              answers: ["2/10", "1/5"],
              why: "2 out of 10.",
            },
          },
          {
            prompt: "On a dice, what is P(a number less than 3), as a fraction?",
            answers: ["2/6", "1/3"],
            why: "1 and 2: 2 out of 6.",
            retry: {
              prompt: "On a dice, what is P(a multiple of 3), as a fraction?",
              answers: ["2/6", "1/3"],
              why: "3 and 6: 2 out of 6.",
            },
          },
          {
            prompt: "P(rain) = 0.3. What is P(no rain)?",
            answers: ["0.7"],
            why: "$1 - 0.3$.",
            retry: {
              prompt: "P(win) = 0.15. What is P(not win)?",
              answers: ["0.85"],
              why: "$1 - 0.15$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-probability",
    id: "y9-probability/combined",
    before: COMBINED,
    title: "Two at once",
    summary: "For two events together, count in the sample space: ways ÷ all the outcomes.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A dice game",
        text: [
          "In a game you roll two dice. You win if the total is 7 or more.",
          "Is it a fair game? What's your chance of winning? By the end of this lesson, you can work it out.",
        ],
        picture: diceGrid,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Two dice: how many outcomes?",
        answers: ["36"],
        hint: "$6 \\times 6$.",
        done: "36.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "One dice: what is P(6)?",
        text: "Give it as a fraction.",
        answers: ["1/6"],
        hint: "One 6, out of 6.",
        done: "$\\frac16$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Two coins: what is P(one head and one tail)?",
        picture: {
          kind: "table",
          head: ["", "Head", "Tail"],
          rows: [
            ["Head", "HH", "HT"],
            ["Tail", "TH", "TT"],
          ],
        },
        options: [
          {
            text: "$\\frac{2}{4} = \\frac12$",
            correct: true,
            feedback: "HT and TH: 2 of the 4 equally likely outcomes.",
          },
          { text: "$\\frac13$", feedback: "There are 4 outcomes, not 3: HT and TH are different." },
          {
            text: "$\\frac14$",
            feedback: "There are two ways: head then tail, or tail then head.",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Count in the sample space",
        text: [
          "Each square of the sample space is equally likely. So the probability is the squares that fit ÷ all the squares.",
          "For two dice, that's out of 36.",
        ],
        picture: diceGrid,
      },
      {
        kind: "shade",
        tag: "Discover",
        title: "Shade every way to score 7",
        cols: 6,
        rows: 6,
        target: 6,
        cells: sevens,
        colLabels: die,
        rowLabels: die,
        values: totals,
        hint: "Find every square showing 7. They run in a diagonal line.",
        done: "6 ways out of 36: $P(7) = \\frac{6}{36} = \\frac16$. No total is more likely.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "P(a total of 10)",
        picture: { ...diceGrid, shaded: 3, cells: tens },
        problem: "Two dice are rolled. Find P(a total of 10).",
        steps: [
          { line: "Squares showing 10: (4, 6), (5, 5), (6, 4)", why: "Count them in the grid." },
          { line: "3 out of 36", why: "Ways ÷ all the outcomes." },
          { line: "$\\frac{3}{36} = \\frac{1}{12}$", why: "Simplify." },
        ],
        done: "$\\frac{1}{12}$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "P(a double)",
        picture: diceGrid,
        start: "Two dice are rolled. A double is when both show the same.",
        stages: [
          {
            prompt: "How many doubles are there?",
            options: [
              { text: "6: (1, 1) up to (6, 6)", correct: true, feedback: "" },
              { text: "1", feedback: "Any matching pair counts: 1 and 1, 2 and 2, …" },
            ],
            then: "6 ways",
          },
          {
            prompt: "So P(a double) =",
            options: [
              { text: "$\\frac{6}{36} = \\frac16$", correct: true, feedback: "" },
              { text: "$\\frac{6}{12}$", feedback: "There are 36 outcomes, not 12." },
            ],
            then: "$\\frac16$",
          },
        ],
        done: "The doubles run down the diagonal of the grid.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A spinner and a coin",
        picture: {
          kind: "table",
          head: ["", "1", "2", "3"],
          rows: [
            ["H", "1H", "2H", "3H"],
            ["T", "1T", "2T", "3T"],
          ],
        },
        start: "Spin 1, 2 or 3 and flip a coin. Find P(an odd number and a head).",
        stages: [
          {
            prompt: "Outcomes that fit:",
            options: [
              { text: "1H and 3H: 2 ways", correct: true, feedback: "" },
              { text: "1H, 3H, 1T, 3T: 4 ways", feedback: "It must be a head too." },
            ],
            then: "2 ways",
          },
          {
            prompt: "So the probability is",
            options: [
              { text: "$\\frac26 = \\frac13$", correct: true, feedback: "" },
              { text: "$\\frac25$", feedback: "There are 6 outcomes in the table." },
            ],
            then: "$\\frac13$",
          },
        ],
        done: "List them, count them, divide.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(a total of 4)",
        text: "Two dice. Give it as a fraction.",
        picture: diceGrid,
        answers: ["3/36", "1/12"],
        wrong: [
          { answer: "1/11", feedback: "There are 36 equally likely outcomes, not 11 totals." },
        ],
        hint: "(1, 3), (2, 2), (3, 1).",
        done: "$\\frac{3}{36} = \\frac{1}{12}$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(both dice even)",
        text: "Two dice. Give it as a fraction.",
        picture: diceGrid,
        answers: ["9/36", "1/4"],
        wrong: [
          {
            answer: "3/36",
            feedback: "Each dice has 3 even numbers, and every pair counts: $3 \\times 3$.",
          },
        ],
        hint: "Rows 2, 4, 6 and columns 2, 4, 6.",
        done: "$3 \\times 3 = 9$ squares: $\\frac{9}{36} = \\frac14$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Totals go from 2 to 12: 11 of them. So is P(7) = $\\frac{1}{11}$?",
        options: [
          {
            text: "No: the 36 squares are equally likely, and 6 show 7",
            correct: true,
            feedback: "So $P(7) = \\frac{6}{36}$. The totals aren't equally likely.",
          },
          { text: "Yes", feedback: "Totals aren't equally likely: 7 has 6 squares, 2 has just 1." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai finds P(at least one 6) with two dice.",
        picture: diceGrid,
        lines: [
          "The first dice shows 6 in 6 squares",
          "The second shows 6 in 6 squares",
          "So 12 squares: $\\frac{12}{36}$",
        ],
        wrong: 2,
        why: "(6, 6) was counted twice. There are 11 squares: $\\frac{11}{36}$.",
      },
      {
        kind: "shade",
        tag: "Back to the problem",
        title: "A dice game",
        text: "You win with a total of 7 or more. Shade every winning square.",
        cols: 6,
        rows: 6,
        target: sevenUp.length,
        cells: sevenUp,
        colLabels: die,
        rowLabels: die,
        values: totals,
        hint: "Every square showing 7, 8, 9, 10, 11 or 12.",
        done: "21 of 36: $P(\\text{win}) = \\frac{21}{36} = \\frac{7}{12}$, more than half. The game favours you.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Two dice. What is P(a total of 2), as a fraction?",
            answers: ["1/36"],
            why: "Only (1, 1).",
            retry: {
              prompt: "Two dice. What is P(a total of 12), as a fraction?",
              answers: ["1/36"],
              why: "Only (6, 6).",
            },
          },
          {
            prompt: "Two coins. What is P(two tails), as a fraction?",
            answers: ["1/4"],
            why: "TT is 1 of 4.",
            retry: {
              prompt: "Two coins. What is P(two heads), as a fraction?",
              answers: ["1/4"],
              why: "HH is 1 of 4.",
            },
          },
          {
            prompt: "Two dice. What is P(a total of 9), as a fraction?",
            answers: ["4/36", "1/9"],
            why: "(3, 6), (4, 5), (5, 4), (6, 3).",
            retry: {
              prompt: "Two dice. What is P(a total of 5), as a fraction?",
              answers: ["4/36", "1/9"],
              why: "(1, 4), (2, 3), (3, 2), (4, 1).",
            },
          },
        ],
      },
    ],
  },
];
