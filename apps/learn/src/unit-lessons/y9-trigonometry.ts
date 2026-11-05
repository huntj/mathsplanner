// Year 9, "Pythagoras and trigonometry", as six short lessons, each just before the skill it
// leads into: the longest side, a shorter side, then the sine, cosine and tangent ratios one at a
// time, and working back to an angle. Each opens on a real problem the pupil can't solve yet,
// warms up what it builds on, finds the idea, works an example, does one together, gives one to
// try, spots a common mistake, solves the opening problem, and ends on an exit check.
import type { DrawingPic, LabelSides, ShapePic, UnitLesson } from "./types.ts";

const PYTHAGORAS = "Y9-GEO-01.a";
const SIDE = "Y9-GEO-01.b";
const ANGLE = "Y9-GEO-01.c";

/**
 * A right-angled triangle with the angle θ at the bottom left, drawn to match it, and the right
 * angle at the bottom right. Labels are for the bottom (adjacent), the upright (opposite) and the
 * hypotenuse.
 */
function right(
  deg: number,
  bottom: string | null,
  upright: string | null,
  hyp: string | null,
  angle: string,
): ShapePic {
  const h = Math.min(6 * Math.tan((deg * Math.PI) / 180), 9);
  return {
    kind: "shape",
    points: [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: h },
    ],
    sides: [bottom, upright, hyp],
    angles: [angle, null, null],
    square: [1],
  };
}

interface Tri {
  /** The angle θ, drawn to size. */
  deg: number;
  /** θ at the top corner instead of the bottom left. */
  top?: boolean;
  /** Turned anticlockwise by this many degrees, after a flip if asked. */
  turn?: number;
  flip?: boolean;
  opp?: string | null;
  adj?: string | null;
  hyp?: string | null;
  /** θ's label: "θ" unless set; "" for none. */
  angle?: string;
}

/**
 * A right-angled triangle any way round, for labelling its sides from θ. Its sides run from the
 * bottom-left corner to the right angle (0), the right angle to the top (1), and the top back (2).
 */
function tri(t: Tri): ShapePic {
  const base = t.top ? 90 - t.deg : t.deg;
  const h = Math.min(6 * Math.tan((base * Math.PI) / 180), 9);
  const a = ((t.turn ?? 0) * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 100) / 100;
  const points = [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 6, y: h },
  ].map((p) => {
    const x = t.flip ? -p.x : p.x;
    return {
      x: round(x * Math.cos(a) - p.y * Math.sin(a)),
      y: round(x * Math.sin(a) + p.y * Math.cos(a)),
    };
  });
  const theta = t.angle ?? "θ";
  return {
    kind: "shape",
    points,
    sides: t.top
      ? [t.opp ?? null, t.adj ?? null, t.hyp ?? null]
      : [t.adj ?? null, t.opp ?? null, t.hyp ?? null],
    angles: t.top ? [null, null, theta] : [theta, null, null],
    square: [1],
  };
}

const HOA = [
  {
    mark: "H",
    name: "hypotenuse",
    why: "The hypotenuse is across from the right angle, and the longest side.",
  },
  {
    mark: "O",
    name: "opposite",
    why: "The opposite side is across from θ: it doesn't touch θ at all.",
  },
  { mark: "A", name: "adjacent", why: "The adjacent side touches θ, and isn't the hypotenuse." },
];

/** Label a triangle's sides H, O and A from θ. */
function label(title: string, t: Tri, done: string, text?: string): LabelSides & { tag: string } {
  return {
    kind: "label",
    tag: "Label the sides",
    title,
    ...(text ? { text } : {}),
    shape: tri(t),
    chips: HOA,
    answers: t.top ? ["O", "A", "H"] : ["A", "O", "H"],
    done,
  };
}

/** Tap just the hypotenuse. */
function hypotenuse(
  title: string,
  t: Tri,
  done: string,
  text?: string,
): LabelSides & { tag: string } {
  return {
    kind: "label",
    tag: "Discover",
    title,
    ...(text ? { text } : {}),
    shape: tri({ ...t, angle: "" }),
    chips: HOA.slice(0, 1),
    answers: [null, null, "H"],
    done,
  };
}

/** Two shorter sides and the hypotenuse, as in a 3, 4, 5 triangle. */
const legs = (a: string | null, b: string | null, c: string | null): ShapePic =>
  right(36.87, a, b, c, "");

const squares: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 0, y: 3 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 0, y: 3 },
        { x: 0, y: 0 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 0, y: -4 },
      ],
    },
    {
      line: [
        { x: 0, y: -4 },
        { x: 4, y: -4 },
      ],
    },
    {
      line: [
        { x: 4, y: -4 },
        { x: 4, y: 0 },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: -3, y: 0 },
      ],
    },
    {
      line: [
        { x: -3, y: 0 },
        { x: -3, y: 3 },
      ],
    },
    {
      line: [
        { x: -3, y: 3 },
        { x: 0, y: 3 },
      ],
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 7, y: 4 },
      ],
    },
    {
      line: [
        { x: 7, y: 4 },
        { x: 3, y: 7 },
      ],
    },
    {
      line: [
        { x: 3, y: 7 },
        { x: 0, y: 3 },
      ],
    },
    { text: "16", at: { x: 2, y: -2 } },
    { text: "9", at: { x: -1.5, y: 1.5 } },
    { text: "25", at: { x: 3.5, y: 3.5 } },
  ],
};

const SOHCAHTOA =
  "\\begin{aligned} \\sin\\theta &= \\frac{\\text{opp}}{\\text{hyp}} \\\\ \\cos\\theta &= \\frac{\\text{adj}}{\\text{hyp}} \\\\ \\tan\\theta &= \\frac{\\text{opp}}{\\text{adj}} \\end{aligned}";

export const y9Trigonometry: UnitLesson[] = [
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/longest-side",
    before: PYTHAGORAS,
    title: "The longest side",
    summary: "Find the long side of a right-angled triangle from the other two.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Cutting the corner",
        text: [
          "A park is a rectangle, 40 m by 30 m. Sam walks round two sides to the far corner: 70 m. Ali cuts straight across.",
          "How much shorter is Ali's walk? By the end of this lesson, you can work it out.",
        ],
        picture: {
          kind: "drawing",
          items: [
            {
              line: [
                { x: 0, y: 0 },
                { x: 8, y: 0 },
              ],
            },
            {
              line: [
                { x: 8, y: 0 },
                { x: 8, y: 6 },
              ],
            },
            {
              line: [
                { x: 8, y: 6 },
                { x: 0, y: 6 },
              ],
            },
            {
              line: [
                { x: 0, y: 6 },
                { x: 0, y: 0 },
              ],
            },
            {
              line: [
                { x: 0, y: 0 },
                { x: 8, y: 6 },
              ],
              dashed: true,
              tone: "find",
            },
            { text: "40 m", at: { x: 4, y: -0.7 } },
            { text: "30 m", at: { x: 9, y: 3 } },
            { text: "?", at: { x: 3.6, y: 3.3 }, tone: "find" },
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $7^2$?",
        answers: ["49"],
        wrong: [{ answer: "14", feedback: "That is $7 \\times 2$. Squaring is $7 \\times 7$." }],
        hint: "$7^2 = 7 \\times 7$.",
        done: "$7 \\times 7 = 49$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\sqrt{144}$?",
        answers: ["12"],
        wrong: [
          {
            answer: "72",
            feedback: "That is half of 144. A square root asks: what times itself is 144?",
          },
        ],
        hint: "What number times itself makes 144?",
        done: "$12 \\times 12 = 144$. A square root undoes a square.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Squares on the sides",
        text: [
          "Draw a square on each side of a right-angled triangle. The two small squares together make the big one: $9 + 16 = 25$.",
          "The longest side, across from the right angle, is the **hypotenuse**.",
        ],
        picture: squares,
      },
      hypotenuse(
        "Tap the hypotenuse",
        { deg: 36.87 },
        "Across from the right angle, and the longest side.",
        "Pick H, then tap the side it goes on.",
      ),
      hypotenuse(
        "And in this one?",
        { deg: 30, turn: 125, flip: true },
        "However the triangle is turned, the hypotenuse is across from the right angle.",
        "The triangle is turned round. Find the right angle first.",
      ),
      {
        kind: "choice",
        tag: "Discover",
        title: "Does it always work?",
        text: "Each row is the three sides of a right-angled triangle.",
        picture: {
          kind: "table",
          head: ["a", "b", "c", "$a^2 + b^2$", "$c^2$"],
          rows: [
            ["3", "4", "5", "25", "25"],
            ["5", "12", "13", "169", "169"],
            ["6", "8", "?", "100", "?"],
          ],
        },
        options: [
          {
            text: "10",
            correct: true,
            feedback:
              "$c^2 = 100$, so $c = \\sqrt{100} = 10$. It works every time: that is **Pythagoras' theorem**.",
          },
          { text: "14", feedback: "That adds the sides. It is the squares that add: $36 + 64$." },
          { text: "100", feedback: "100 is $c^2$. Take the square root." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Finding the hypotenuse",
        picture: legs("5 cm", "12 cm", "c"),
        problem: "The shorter sides are 5 cm and 12 cm. Find the hypotenuse, c.",
        steps: [
          { line: "$c^2 = 5^2 + 12^2$", why: "Square the two shorter sides and add them." },
          { line: "$c^2 = 25 + 144 = 169$", why: "Work out the squares." },
          { line: "$c = \\sqrt{169} = 13$ cm", why: "Take the square root to undo the square." },
        ],
        done: "13 cm. Check: the hypotenuse is the longest side, and 13 is longer than 5 and 12 ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Shorter sides of 8 cm and 15 cm",
        picture: legs("8 cm", "15 cm", "c"),
        start: "Find the hypotenuse, c.",
        stages: [
          {
            prompt: "What do you work out first?",
            options: [
              { text: "$8^2 + 15^2$", correct: true, feedback: "" },
              { text: "$8 + 15$", feedback: "It is the squares that add, not the sides." },
              {
                text: "$15^2 - 8^2$",
                feedback: "Taking away is for a shorter side. The hypotenuse adds.",
              },
            ],
            then: "$c^2 = 64 + 225 = 289$",
          },
          {
            prompt: "So c is",
            options: [
              { text: "$\\sqrt{289} = 17$ cm", correct: true, feedback: "" },
              { text: "$289$ cm", feedback: "289 is $c^2$. Take the square root." },
              {
                text: "$144.5$ cm",
                feedback: "Halving doesn't undo squaring: take the square root.",
              },
            ],
            then: "$c = 17$ cm",
          },
        ],
        done: "Square, add, square root.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Shorter sides of 7 cm and 24 cm",
        text: "One more together, step by step.",
        picture: tri({ deg: 16.26, flip: true, adj: "24 cm", opp: "7 cm", hyp: "c", angle: "" }),
        start: "Find the hypotenuse, c.",
        stages: [
          {
            prompt: "What do you work out first?",
            options: [
              { text: "$7^2 + 24^2$", correct: true, feedback: "" },
              { text: "$7 + 24$", feedback: "It is the squares that add, not the sides." },
              {
                text: "$24^2 - 7^2$",
                feedback: "Taking away is for a shorter side. The hypotenuse adds.",
              },
            ],
            then: "$c^2 = 49 + 576 = 625$",
          },
          {
            prompt: "So c is",
            options: [
              { text: "$\\sqrt{625} = 25$ cm", correct: true, feedback: "" },
              { text: "$625$ cm", feedback: "625 is $c^2$. Take the square root." },
              {
                text: "$312.5$ cm",
                feedback: "Halving doesn't undo squaring: take the square root.",
              },
            ],
            then: "$c = 25$ cm",
          },
        ],
        done: "Square, add, square root, every time. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Shorter sides of 9 cm and 12 cm",
        text: "Find the hypotenuse.",
        picture: legs("12 cm", "9 cm", "?"),
        answers: ["15"],
        unit: "cm",
        wrong: [
          { answer: "225", feedback: "225 is $c^2$. Take the square root." },
          { answer: "21", feedback: "Add the squares, not the sides." },
        ],
        hint: "$9^2 + 12^2 = 81 + 144$.",
        done: "$\\sqrt{225} = 15$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Not a whole number",
        text: "The shorter sides are 4 cm and 7 cm. Find the hypotenuse, to 1 decimal place.",
        answers: ["8.1"],
        unit: "cm",
        wrong: [{ answer: "65", feedback: "65 is $c^2$. Take the square root." }],
        hint: "$4^2 + 7^2 = 65$, then square root.",
        done: "$\\sqrt{65} = 8.06\\ldots \\approx 8.1$ cm.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Jo found the hypotenuse when the shorter sides are 6 cm and 8 cm.",
        lines: ["$c^2 = 6^2 + 8^2$", "$c^2 = 12 + 16$", "$c^2 = 28$", "$c = 5.3$ cm"],
        wrong: 1,
        why: "$6^2$ means $6 \\times 6 = 36$, not $6 \\times 2$. So $c^2 = 36 + 64 = 100$, and $c = 10$ cm. And 5.3 cm can't be right: it is shorter than the 8 cm side.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Cutting the corner",
        text: "Ali cuts across the 40 m by 30 m park. How many metres shorter is that than Sam's 70 m?",
        picture: {
          kind: "drawing",
          items: [
            {
              line: [
                { x: 0, y: 0 },
                { x: 8, y: 0 },
              ],
            },
            {
              line: [
                { x: 8, y: 0 },
                { x: 8, y: 6 },
              ],
            },
            {
              line: [
                { x: 0, y: 0 },
                { x: 8, y: 6 },
              ],
              dashed: true,
              tone: "find",
            },
            { text: "40 m", at: { x: 4, y: -0.7 } },
            { text: "30 m", at: { x: 9, y: 3 } },
          ],
        },
        answers: ["20"],
        unit: "m",
        wrong: [
          { answer: "50", feedback: "50 m is Ali's walk. How much shorter is it than 70 m?" },
        ],
        hint: "Find the diagonal with Pythagoras, then take it from 70 m.",
        done: "Ali walks $\\sqrt{40^2 + 30^2} = \\sqrt{2500} = 50$ m: 20 m shorter.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The shorter sides are 6 cm and 8 cm. Find the hypotenuse.",
            answers: ["10"],
            unit: "cm",
            why: "$\\sqrt{36 + 64} = \\sqrt{100} = 10$.",
            retry: {
              prompt: "The shorter sides are 9 cm and 40 cm. Find the hypotenuse.",
              answers: ["41"],
              unit: "cm",
              why: "$\\sqrt{81 + 1600} = \\sqrt{1681} = 41$.",
            },
          },
          {
            prompt: "The shorter sides are 5 cm and 9 cm. Find the hypotenuse, to 1 decimal place.",
            answers: ["10.3"],
            unit: "cm",
            why: "$\\sqrt{25 + 81} = \\sqrt{106} = 10.3$.",
            retry: {
              prompt:
                "The shorter sides are 3 cm and 7 cm. Find the hypotenuse, to 1 decimal place.",
              answers: ["7.6"],
              unit: "cm",
              why: "$\\sqrt{9 + 49} = \\sqrt{58} = 7.6$.",
            },
          },
          {
            prompt: "Which side of a right-angled triangle is the hypotenuse?",
            options: [
              "The longest, across from the right angle",
              "Either of the shorter sides",
              "The one along the bottom",
            ],
            answers: ["The longest, across from the right angle"],
            why: "The hypotenuse is always across from the right angle, and always the longest.",
            retry: {
              prompt:
                "Sides of 7, 24 and 25 make a right-angled triangle. Which is the hypotenuse?",
              options: ["25", "24", "7"],
              answers: ["25"],
              why: "The hypotenuse is the longest side: 25. Check: $49 + 576 = 625 = 25^2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/shorter-side",
    before: PYTHAGORAS,
    title: "A shorter side",
    summary: "Turn Pythagoras round to find one of the shorter sides.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Will the ladder reach?",
        text: [
          "A 5 m ladder leans against a wall, with its foot 1.4 m out from the wall.",
          "The window ledge is 4.5 m up. Will the ladder reach it?",
        ],
        picture: right(73.74, "1.4 m", "?", "5 m", ""),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The hypotenuse",
        text: "The shorter sides are 3 cm and 4 cm. Find the hypotenuse.",
        answers: ["5"],
        unit: "cm",
        hint: "$3^2 + 4^2$, then square root.",
        done: "$\\sqrt{9 + 16} = 5$ cm.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $13^2 - 5^2$?",
        answers: ["144"],
        wrong: [
          {
            answer: "64",
            feedback: "$13 - 5 = 8$ and $8^2 = 64$, but square each number first: $169 - 25$.",
          },
        ],
        hint: "Square each number first, then take away.",
        done: "$169 - 25 = 144$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Going the other way",
        text: "In a 6, 8, 10 triangle, you know the hypotenuse is 10 and one side is 6. How do you get the 8?",
        picture: legs("6", "?", "10"),
        options: [
          {
            text: "$\\sqrt{10^2 - 6^2}$",
            correct: true,
            feedback:
              "$6^2 + b^2 = 10^2$, so take 36 from both sides: $b^2 = 100 - 36 = 64$, and $b = 8$.",
          },
          {
            text: "$\\sqrt{10^2 + 6^2}$",
            feedback: "That gives 11.7, longer than the hypotenuse: impossible for a shorter side.",
          },
          { text: "$10 - 6$", feedback: "Work with the squares, not the sides." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Pythagoras, turned round",
        text: [
          "To find a shorter side: the hypotenuse squared, take away the other side squared, then square root.",
          "Adding finds the longest side; taking away finds a shorter one.",
        ],
        picture: { kind: "maths", tex: "a^2 = c^2 - b^2" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Finding a shorter side",
        picture: legs("5 cm", "a", "13 cm"),
        problem: "The hypotenuse is 13 cm and one side is 5 cm. Find the other side, a.",
        steps: [
          {
            line: "$a^2 = 13^2 - 5^2$",
            why: "The hypotenuse squared, take away the other side squared.",
          },
          { line: "$a^2 = 169 - 25 = 144$", why: "Work out the squares." },
          { line: "$a = \\sqrt{144} = 12$ cm", why: "Square root." },
        ],
        done: "12 cm. Check: it is shorter than the 13 cm hypotenuse ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 17 cm, one side 8 cm",
        picture: legs("8 cm", "a", "17 cm"),
        start: "Find the other side, a.",
        stages: [
          {
            prompt: "What do you work out first?",
            options: [
              { text: "$17^2 - 8^2$", correct: true, feedback: "" },
              { text: "$17^2 + 8^2$", feedback: "Adding gives a side longer than the hypotenuse." },
              { text: "$17 - 8$", feedback: "Work with the squares." },
            ],
            then: "$a^2 = 289 - 64 = 225$",
          },
          {
            prompt: "So a is",
            options: [
              { text: "$15$ cm", correct: true, feedback: "" },
              { text: "$225$ cm", feedback: "225 is $a^2$: square root it." },
              { text: "$112.5$ cm", feedback: "Square root, don't halve." },
            ],
            then: "$a = \\sqrt{225} = 15$ cm",
          },
        ],
        done: "Square, take away, square root.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 26 cm, one side 10 cm",
        text: "One more together, step by step.",
        picture: tri({ deg: 22.62, flip: true, adj: "a", opp: "10 cm", hyp: "26 cm", angle: "" }),
        start: "Find the other side, a.",
        stages: [
          {
            prompt: "What do you work out first?",
            options: [
              { text: "$26^2 - 10^2$", correct: true, feedback: "" },
              {
                text: "$26^2 + 10^2$",
                feedback: "Adding gives a side longer than the hypotenuse.",
              },
              { text: "$26 - 10$", feedback: "Work with the squares." },
            ],
            then: "$a^2 = 676 - 100 = 576$",
          },
          {
            prompt: "So a is",
            options: [
              { text: "$24$ cm", correct: true, feedback: "" },
              { text: "$576$ cm", feedback: "576 is $a^2$: square root it." },
              { text: "$288$ cm", feedback: "Square root, don't halve." },
            ],
            then: "$a = \\sqrt{576} = 24$ cm",
          },
        ],
        done: "Square, take away, square root. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 10 cm, one side 6 cm",
        text: "Find the other side.",
        answers: ["8"],
        unit: "cm",
        wrong: [{ answer: "11.7", feedback: "For a shorter side, take away: $100 - 36$." }],
        hint: "$10^2 - 6^2 = 100 - 36$.",
        done: "$\\sqrt{64} = 8$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 9 cm, one side 4 cm",
        text: "Find the other side, to 1 decimal place.",
        answers: ["8.1"],
        unit: "cm",
        wrong: [
          { answer: "9.8", feedback: "That adds. For a shorter side, take away: $81 - 16$." },
        ],
        hint: "$9^2 - 4^2 = 65$, then square root.",
        done: "$\\sqrt{65} = 8.1$ cm.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kim found a shorter side when the hypotenuse is 15 cm and the other side is 9 cm.",
        lines: ["$a^2 = 15^2 + 9^2$", "$a^2 = 225 + 81$", "$a^2 = 306$", "$a = 17.5$ cm"],
        wrong: 0,
        why: "For a shorter side, take away: $a^2 = 15^2 - 9^2 = 144$, so $a = 12$ cm. 17.5 cm can't be right: it is longer than the hypotenuse.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Add or take away?",
        groups: ["Add the squares", "Take away the squares"],
        items: [
          { text: "Finding the hypotenuse", group: 0, why: "The longest side comes from adding." },
          {
            text: "Finding a shorter side",
            group: 1,
            why: "A shorter side comes from taking away.",
          },
          {
            text: "The side across from the right angle",
            group: 0,
            why: "That is the hypotenuse: add.",
          },
          {
            text: "You know the hypotenuse already",
            group: 1,
            why: "Then you want a shorter side: take away.",
          },
        ],
        done: "Ask: is the side I want the longest? If so, add; if not, take away.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Will the ladder reach?",
        text: "The 5 m ladder's foot is 1.4 m from the wall. How high up the wall does it reach?",
        picture: right(73.74, "1.4 m", "?", "5 m", ""),
        answers: ["4.8"],
        unit: "m",
        wrong: [{ answer: "5.2", feedback: "That adds. The wall is a shorter side: take away." }],
        hint: "$5^2 - 1.4^2 = 25 - 1.96$.",
        done: "$\\sqrt{23.04} = 4.8$ m: it reaches the 4.5 m window ledge ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The hypotenuse is 25 cm and one side is 7 cm. Find the other side.",
            answers: ["24"],
            unit: "cm",
            why: "$\\sqrt{625 - 49} = \\sqrt{576} = 24$.",
            retry: {
              prompt: "The hypotenuse is 13 cm and one side is 12 cm. Find the other side.",
              answers: ["5"],
              unit: "cm",
              why: "$\\sqrt{169 - 144} = \\sqrt{25} = 5$.",
            },
          },
          {
            prompt:
              "The hypotenuse is 12 cm and one side is 5 cm. Find the other side, to 1 decimal place.",
            answers: ["10.9"],
            unit: "cm",
            why: "$\\sqrt{144 - 25} = \\sqrt{119} = 10.9$.",
            retry: {
              prompt:
                "The hypotenuse is 8 cm and one side is 3 cm. Find the other side, to 1 decimal place.",
              answers: ["7.4"],
              unit: "cm",
              why: "$\\sqrt{64 - 9} = \\sqrt{55} = 7.4$.",
            },
          },
          {
            prompt:
              "A right-angled triangle has a hypotenuse of 10 cm. Which could be one of its other sides?",
            options: ["6 cm", "12 cm", "10 cm"],
            answers: ["6 cm"],
            why: "The other sides are always shorter than the hypotenuse.",
            retry: {
              prompt:
                "A right-angled triangle has a hypotenuse of 7 cm. Which could be one of its other sides?",
              options: ["9 cm", "7 cm", "5 cm"],
              answers: ["5 cm"],
              why: "The other sides are always shorter than the hypotenuse.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/sine",
    before: SIDE,
    title: "The sine ratio",
    summary: "Use the angle and the hypotenuse to find the side across from the angle.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How high is the kite?",
        text: [
          "A kite flies on a 30 m string, at an angle of 40° to the ground.",
          "Pythagoras needs two sides, but here we know one side and an angle. How high is the kite?",
        ],
        picture: right(40, null, "?", "30 m", "40°"),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which side is the hypotenuse?",
        picture: right(34, "p", "q", "r", ""),
        options: [
          {
            text: "r",
            correct: true,
            feedback: "r is across from the right angle, and the longest.",
          },
          { text: "p", feedback: "p touches the right angle. The hypotenuse is across from it." },
          { text: "q", feedback: "q touches the right angle. The hypotenuse is across from it." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 19.284 to 1 decimal place",
        answers: ["19.3"],
        hint: "Look at the second decimal place: 8.",
        done: "19.3.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Naming the sides from an angle",
        text: [
          "From the angle θ: the **opposite** side is across from it, the **adjacent** side is next to it, and the **hypotenuse** is the longest.",
        ],
        picture: right(34, "adjacent", "opposite", "hypotenuse", "θ"),
      },
      label(
        "Label the sides from θ",
        { deg: 34 },
        "H is across from the right angle, O is across from θ, and A touches θ.",
        "Pick H, O or A, then tap the side it goes on.",
      ),
      label(
        "θ has moved",
        { deg: 34, top: true },
        "The hypotenuse never moves. Which side is opposite and which adjacent depends on where θ is.",
        "Now θ is at the top. Label the sides from θ again.",
      ),
      label(
        "Turned round",
        { deg: 40, turn: 180, flip: true },
        "Right angle first, for H. Then across from θ is O, and the side left, touching θ, is A.",
        "The same kind of triangle, turned and flipped.",
      ),
      label(
        "Any way round",
        { deg: 55, turn: 150, flip: true, top: true },
        "You can label a right-angled triangle any way round: H, then O, then A.",
      ),
      label(
        "A steep one",
        { deg: 70, turn: 300 },
        "θ is big here, so the opposite side is long. It's still not the hypotenuse: that's across from the right angle.",
        "Careful: the longest-looking side next to θ isn't always the adjacent.",
      ),
      label(
        "One more, at speed",
        { deg: 20, top: true, turn: 60, flip: true },
        "H across from the right angle, O across from θ, A touching θ. That's the first step of every trigonometry question.",
        "Find the right angle, then θ.",
      ),
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the pattern",
        text: "Three right-angled triangles, all with a 30° angle.",
        picture: {
          kind: "table",
          head: ["Hypotenuse", "Opposite", "Opposite ÷ hypotenuse"],
          rows: [
            ["2", "1", "0.5"],
            ["6", "3", "0.5"],
            ["10", "?", "0.5"],
          ],
        },
        options: [
          {
            text: "5",
            correct: true,
            feedback:
              "For 30°, opposite ÷ hypotenuse is always 0.5, however big the triangle. That fixed number is the **sine** of 30°: $\\sin 30° = 0.5$.",
          },
          { text: "7", feedback: "The ratio stays 0.5: half of 10." },
          {
            text: "20",
            feedback: "Opposite ÷ hypotenuse is 0.5, so the opposite is half the hypotenuse.",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Every angle has a sine",
        text: [
          "Each angle has its own fixed opposite ÷ hypotenuse, its sine. Your calculator knows them: $\\sin 40° = 0.643$.",
          "So the opposite side = the hypotenuse × sin θ.",
        ],
        picture: { kind: "maths", tex: "\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Using sin",
        picture: right(35, null, "x", "10 cm", "35°"),
        problem: "The hypotenuse is 10 cm and the angle is 35°. Find x.",
        steps: [
          {
            line: "x is opposite the 35°, and 10 cm is the hypotenuse: use sin.",
            why: "Label the sides from the angle first.",
          },
          { line: "$\\sin 35° = \\frac{x}{10}$", why: "sin is opposite ÷ hypotenuse." },
          { line: "$x = 10 \\times \\sin 35°$", why: "Multiply both sides by 10." },
          { line: "$x = 10 \\times 0.574 = 5.7$ cm", why: "A calculator gives sin 35°." },
        ],
        done: "5.7 cm. Check: it is shorter than the 10 cm hypotenuse ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 12 cm, angle 25°",
        picture: right(25, null, "x", "12 cm", "25°"),
        start: "Find x.",
        stages: [
          {
            prompt: "Label the sides from the 25°: x is",
            options: [
              {
                text: "Opposite, and 12 cm is the hypotenuse: use sin",
                correct: true,
                feedback: "",
              },
              {
                text: "Adjacent, and 12 cm is the hypotenuse: use cos",
                feedback: "x doesn't touch the 25°: it's across from it, the opposite.",
              },
              {
                text: "The hypotenuse",
                feedback: "The hypotenuse is across from the right angle: that's the 12 cm.",
              },
            ],
            then: "x is O and 12 cm is H: use sin.",
          },
          {
            prompt: "Write the ratio:",
            options: [
              { text: "$\\sin 25° = \\frac{x}{12}$", correct: true, feedback: "" },
              {
                text: "$\\sin 25° = \\frac{12}{x}$",
                feedback: "sin is opposite ÷ hypotenuse: x on top.",
              },
              {
                text: "$\\sin 25° = x \\times 12$",
                feedback: "sin is a division: opposite ÷ hypotenuse.",
              },
            ],
            then: "$\\sin 25° = \\frac{x}{12}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$12 \\sin 25° = 5.1$ cm", correct: true, feedback: "" },
              {
                text: "$\\frac{\\sin 25°}{12} = 0.04$ cm",
                feedback: "Multiply by 12 to undo ÷ 12.",
              },
              {
                text: "$\\frac{12}{\\sin 25°} = 28.4$ cm",
                feedback: "That is longer than the hypotenuse: impossible.",
              },
            ],
            then: "$x = 12 \\times 0.423 = 5.1$ cm",
          },
        ],
        done: "Label, write the ratio, rearrange, calculate.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 9 cm, angle 62°",
        text: "The same steps again, with the triangle turned round.",
        picture: tri({ deg: 62, top: true, flip: true, opp: "x", hyp: "9 cm", angle: "62°" }),
        start: "Find x.",
        stages: [
          {
            prompt: "Label the sides from the 62°: x is",
            options: [
              {
                text: "Opposite, and 9 cm is the hypotenuse: use sin",
                correct: true,
                feedback: "",
              },
              {
                text: "Adjacent, and 9 cm is the hypotenuse: use cos",
                feedback: "x doesn't touch the 62°: it's across from it, the opposite.",
              },
              {
                text: "The hypotenuse",
                feedback: "The hypotenuse is across from the right angle: that's the 9 cm.",
              },
            ],
            then: "x is O and 9 cm is H: use sin.",
          },
          {
            prompt: "Write the ratio:",
            options: [
              { text: "$\\sin 62° = \\frac{x}{9}$", correct: true, feedback: "" },
              {
                text: "$\\sin 62° = \\frac{9}{x}$",
                feedback: "sin is opposite ÷ hypotenuse: x on top.",
              },
            ],
            then: "$\\sin 62° = \\frac{x}{9}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$9 \\sin 62° = 7.9$ cm", correct: true, feedback: "" },
              {
                text: "$\\frac{9}{\\sin 62°} = 10.2$ cm",
                feedback: "That is longer than the hypotenuse: impossible.",
              },
              { text: "$\\frac{\\sin 62°}{9} = 0.1$ cm", feedback: "Multiply by 9 to undo ÷ 9." },
            ],
            then: "$x = 9 \\times 0.883 = 7.9$ cm",
          },
        ],
        done: "Label, write the ratio, rearrange, calculate. Now it's your turn.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 20 cm, angle 30°",
        text: "Find the side opposite the angle.",
        picture: right(30, null, "?", "20 cm", "30°"),
        answers: ["10"],
        unit: "cm",
        hint: "$x = 20 \\sin 30°$, and $\\sin 30° = 0.5$.",
        done: "$20 \\times 0.5 = 10$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 7 cm, angle 52°",
        text: "Find the side opposite the angle, to 1 decimal place.",
        picture: right(52, null, "?", "7 cm", "52°"),
        answers: ["5.5"],
        unit: "cm",
        wrong: [{ answer: "0.1", feedback: "Multiply by 7: $x = 7 \\sin 52°$." }],
        hint: "$x = 7 \\sin 52°$.",
        done: "$7 \\times 0.788 = 5.5$ cm.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ravi found the side opposite a 40° angle, with a hypotenuse of 8 cm.",
        lines: ["$\\sin 40° = \\frac{x}{8}$", "$x = \\frac{\\sin 40°}{8}$", "$x = 0.08$ cm"],
        wrong: 1,
        why: "To undo ÷ 8, multiply by 8: $x = 8 \\sin 40° = 5.1$ cm. 0.08 cm is far too small for a triangle with an 8 cm side.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How high is the kite?",
        text: "The string is 30 m, at 40° to the ground. How high is the kite, to 1 decimal place?",
        picture: right(40, null, "?", "30 m", "40°"),
        answers: ["19.3"],
        unit: "m",
        wrong: [{ answer: "23", feedback: "That uses cos. The height is opposite the 40°: sin." }],
        hint: "The height is opposite the angle, and the string is the hypotenuse.",
        done: "$30 \\sin 40° = 30 \\times 0.643 = 19.3$ m.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt:
              "The hypotenuse is 15 cm and the angle is 30°. Find the side opposite the angle.",
            answers: ["7.5"],
            unit: "cm",
            why: "$15 \\sin 30° = 15 \\times 0.5 = 7.5$.",
            retry: {
              prompt:
                "The hypotenuse is 9 cm and the angle is 30°. Find the side opposite the angle.",
              answers: ["4.5"],
              unit: "cm",
              why: "$9 \\sin 30° = 9 \\times 0.5 = 4.5$.",
            },
          },
          {
            prompt:
              "The hypotenuse is 10 cm and the angle is 48°. Find the opposite side, to 1 decimal place.",
            answers: ["7.4"],
            unit: "cm",
            why: "$10 \\sin 48° = 10 \\times 0.743 = 7.4$.",
            retry: {
              prompt:
                "The hypotenuse is 6 cm and the angle is 70°. Find the opposite side, to 1 decimal place.",
              answers: ["5.6"],
              unit: "cm",
              why: "$6 \\sin 70° = 6 \\times 0.940 = 5.6$.",
            },
          },
          {
            prompt:
              "You know the hypotenuse, and want the side across from the angle. Which ratio?",
            options: ["sin", "cos", "tan"],
            answers: ["sin"],
            why: "Opposite and hypotenuse: sin.",
            retry: {
              prompt: "Which ratio is opposite ÷ hypotenuse?",
              options: ["tan", "sin", "cos"],
              answers: ["sin"],
              why: "sin θ = opposite ÷ hypotenuse.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/cosine",
    before: SIDE,
    title: "The cosine ratio",
    summary: "Use the angle and the hypotenuse to find the side next to the angle.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Will the ramp fit?",
        text: [
          "A ramp is 6 m long and slopes at 10° to the ground. There is a 5.8 m space for it along the ground.",
          "How far along the ground does the ramp reach? Will it fit?",
        ],
        picture: right(10, "?", null, "6 m", "10°"),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "The side x is next to the angle, and is not the hypotenuse. It is the…",
        picture: right(34, "x", null, null, "θ"),
        options: [
          { text: "adjacent", correct: true, feedback: "Next to the angle: adjacent." },
          { text: "opposite", feedback: "The opposite is across from the angle." },
          {
            text: "hypotenuse",
            feedback: "The hypotenuse is the longest, across from the right angle.",
          },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $8 \\sin 30°$",
        answers: ["4"],
        hint: "$\\sin 30° = 0.5$.",
        done: "$8 \\times 0.5 = 4$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the pattern",
        text: "Three right-angled triangles, all with a 60° angle.",
        picture: {
          kind: "table",
          head: ["Hypotenuse", "Adjacent", "Adjacent ÷ hypotenuse"],
          rows: [
            ["2", "1", "0.5"],
            ["6", "3", "0.5"],
            ["10", "?", "0.5"],
          ],
        },
        options: [
          {
            text: "5",
            correct: true,
            feedback:
              "For 60°, adjacent ÷ hypotenuse is always 0.5. That fixed number is the **cosine** of 60°: $\\cos 60° = 0.5$.",
          },
          { text: "8", feedback: "The ratio is 0.5: the adjacent is half the hypotenuse." },
          {
            text: "20",
            feedback: "Adjacent ÷ hypotenuse is 0.5, so the adjacent is half the hypotenuse.",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Every angle has a cosine",
        text: [
          "Each angle has its own fixed adjacent ÷ hypotenuse, its cosine. $\\cos 10° = 0.985$.",
          "So the adjacent side = the hypotenuse × cos θ. Use cos when the side is next to the angle; sin when it is across.",
        ],
        picture: { kind: "maths", tex: "\\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}" },
      },
      label(
        "Which side is adjacent?",
        { deg: 50, turn: 270 },
        "cos uses A, the side touching θ, and H.",
        "cos uses the adjacent side. Label the sides from θ.",
      ),
      label(
        "And here?",
        { deg: 30, top: true, flip: true, turn: 20 },
        "H across from the right angle, O across from θ, A touching θ.",
      ),
      {
        kind: "worked",
        tag: "Worked example",
        title: "Using cos",
        picture: right(50, "x", null, "8 cm", "50°"),
        problem: "The hypotenuse is 8 cm and the angle is 50°. Find x.",
        steps: [
          {
            line: "x is next to the 50°, and 8 cm is the hypotenuse: use cos.",
            why: "Label the sides from the angle.",
          },
          { line: "$\\cos 50° = \\frac{x}{8}$", why: "cos is adjacent ÷ hypotenuse." },
          { line: "$x = 8 \\cos 50°$", why: "Multiply both sides by 8." },
          { line: "$x = 8 \\times 0.643 = 5.1$ cm", why: "A calculator gives cos 50°." },
        ],
        done: "5.1 cm, shorter than the hypotenuse ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 15 cm, angle 20°",
        picture: right(20, "x", null, "15 cm", "20°"),
        start: "Find x.",
        stages: [
          {
            prompt: "x is next to the angle. Which ratio?",
            options: [
              { text: "cos: adjacent and hypotenuse", correct: true, feedback: "" },
              {
                text: "sin: opposite and hypotenuse",
                feedback: "x is next to the angle, not across from it.",
              },
              {
                text: "tan: opposite and adjacent",
                feedback: "We know the hypotenuse, so it's sin or cos.",
              },
            ],
            then: "$\\cos 20° = \\frac{x}{15}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$15 \\cos 20° = 14.1$ cm", correct: true, feedback: "" },
              {
                text: "$15 \\sin 20° = 5.1$ cm",
                feedback: "That finds the side across from the angle.",
              },
              {
                text: "$\\frac{\\cos 20°}{15} = 0.06$ cm",
                feedback: "Multiply by 15 to undo ÷ 15.",
              },
            ],
            then: "$x = 15 \\times 0.940 = 14.1$ cm",
          },
        ],
        done: "Next to the angle with the hypotenuse known: cos.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Hypotenuse 11 cm, angle 35°",
        text: "The same steps again, with the triangle turned round.",
        picture: tri({ deg: 35, turn: 90, flip: true, adj: "x", hyp: "11 cm", angle: "35°" }),
        start: "Find x.",
        stages: [
          {
            prompt: "Label the sides from the 35°: x is",
            options: [
              {
                text: "Adjacent, and 11 cm is the hypotenuse: use cos",
                correct: true,
                feedback: "",
              },
              {
                text: "Opposite, and 11 cm is the hypotenuse: use sin",
                feedback: "x touches the 35°: it's the adjacent side.",
              },
              {
                text: "The hypotenuse",
                feedback: "The hypotenuse is across from the right angle: that's the 11 cm.",
              },
            ],
            then: "x is A and 11 cm is H: use cos.",
          },
          {
            prompt: "Write the ratio:",
            options: [
              { text: "$\\cos 35° = \\frac{x}{11}$", correct: true, feedback: "" },
              {
                text: "$\\cos 35° = \\frac{11}{x}$",
                feedback: "cos is adjacent ÷ hypotenuse: x on top.",
              },
            ],
            then: "$\\cos 35° = \\frac{x}{11}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$11 \\cos 35° = 9.0$ cm", correct: true, feedback: "" },
              { text: "$11 \\sin 35° = 6.3$ cm", feedback: "That finds the opposite side." },
              {
                text: "$\\frac{11}{\\cos 35°} = 13.4$ cm",
                feedback: "That is longer than the hypotenuse: impossible.",
              },
            ],
            then: "$x = 11 \\times 0.819 = 9.0$ cm",
          },
        ],
        done: "Label, write the ratio, rearrange, calculate. Now it's your turn.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 10 cm, angle 60°",
        text: "Find the side next to the angle.",
        picture: right(60, "?", null, "10 cm", "60°"),
        answers: ["5"],
        unit: "cm",
        hint: "$x = 10 \\cos 60°$, and $\\cos 60° = 0.5$.",
        done: "$10 \\times 0.5 = 5$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Hypotenuse 9 cm, angle 35°",
        text: "Find the side next to the angle, to 1 decimal place.",
        picture: right(35, "?", null, "9 cm", "35°"),
        answers: ["7.4"],
        unit: "cm",
        wrong: [{ answer: "5.2", feedback: "That uses sin. The side is next to the angle: cos." }],
        hint: "$x = 9 \\cos 35°$.",
        done: "$9 \\times 0.819 = 7.4$ cm.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia found x, next to a 40° angle, with a hypotenuse of 12 cm.",
        lines: [
          "x is next to the angle, so use sin.",
          "$\\sin 40° = \\frac{x}{12}$",
          "$x = 12 \\sin 40° = 7.7$ cm",
        ],
        wrong: 0,
        why: "Next to the angle is the adjacent, which needs cos: $x = 12 \\cos 40° = 9.2$ cm.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "sin or cos?",
        groups: ["sin", "cos"],
        items: [
          { text: "Opposite and hypotenuse", group: 0, why: "sin is opposite ÷ hypotenuse." },
          { text: "Adjacent and hypotenuse", group: 1, why: "cos is adjacent ÷ hypotenuse." },
          {
            text: "x across from the angle, hypotenuse known",
            group: 0,
            why: "Across from the angle: opposite, so sin.",
          },
          {
            text: "x next to the angle, hypotenuse known",
            group: 1,
            why: "Next to the angle: adjacent, so cos.",
          },
        ],
        done: "Across from the angle: sin. Next to it: cos.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Will the ramp fit?",
        text: "The ramp is 6 m long at 10° to the ground. How far along the ground does it reach, to 1 decimal place?",
        picture: right(10, "?", null, "6 m", "10°"),
        answers: ["5.9"],
        unit: "m",
        wrong: [
          {
            answer: "1",
            feedback: "That is the height, from sin. Along the ground is next to the angle: cos.",
          },
        ],
        hint: "Along the ground is next to the 10° angle, and the ramp is the hypotenuse.",
        done: "$6 \\cos 10° = 6 \\times 0.985 = 5.9$ m: too long for the 5.8 m space.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt:
              "The hypotenuse is 20 cm and the angle is 60°. Find the side next to the angle.",
            answers: ["10"],
            unit: "cm",
            why: "$20 \\cos 60° = 20 \\times 0.5 = 10$.",
            retry: {
              prompt:
                "The hypotenuse is 14 cm and the angle is 60°. Find the side next to the angle.",
              answers: ["7"],
              unit: "cm",
              why: "$14 \\cos 60° = 14 \\times 0.5 = 7$.",
            },
          },
          {
            prompt:
              "The hypotenuse is 11 cm and the angle is 25°. Find the side next to the angle, to 1 decimal place.",
            answers: ["10.0"],
            unit: "cm",
            why: "$11 \\cos 25° = 11 \\times 0.906 = 10.0$.",
            retry: {
              prompt:
                "The hypotenuse is 5 cm and the angle is 40°. Find the side next to the angle, to 1 decimal place.",
              answers: ["3.8"],
              unit: "cm",
              why: "$5 \\cos 40° = 5 \\times 0.766 = 3.8$.",
            },
          },
          {
            prompt: "Which ratio uses the adjacent side and the hypotenuse?",
            options: ["sin", "cos", "tan"],
            answers: ["cos"],
            why: "cos θ = adjacent ÷ hypotenuse.",
            retry: {
              prompt: "You know the hypotenuse, and want the side next to the angle. Which ratio?",
              options: ["tan", "sin", "cos"],
              answers: ["cos"],
              why: "Next to the angle with the hypotenuse: cos.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/tangent",
    before: SIDE,
    title: "The tangent ratio",
    summary: "When the hypotenuse isn't involved, use the opposite and adjacent sides.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How tall is the tree?",
        text: [
          "You stand 20 m from a tree. The angle up from the ground to its top is 35°.",
          "You can't reach the top to measure it, and the hypotenuse is unknown. How tall is the tree?",
        ],
        picture: right(35, "20 m", "?", null, "35°"),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which ratio uses the opposite and the hypotenuse?",
        options: [
          { text: "sin", correct: true, feedback: "sin θ = opposite ÷ hypotenuse." },
          { text: "cos", feedback: "cos is adjacent ÷ hypotenuse." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $6 \\cos 60°$",
        answers: ["3"],
        hint: "$\\cos 60° = 0.5$.",
        done: "$6 \\times 0.5 = 3$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the pattern",
        text: "Three right-angled triangles, all with a 45° angle.",
        picture: {
          kind: "table",
          head: ["Adjacent", "Opposite", "Opposite ÷ adjacent"],
          rows: [
            ["1", "1", "1"],
            ["3", "3", "1"],
            ["7", "?", "1"],
          ],
        },
        options: [
          {
            text: "7",
            correct: true,
            feedback:
              "For 45°, opposite ÷ adjacent is always 1. That fixed number is the **tangent** of 45°: $\\tan 45° = 1$.",
          },
          { text: "14", feedback: "Opposite ÷ adjacent is 1: the two sides are equal." },
          { text: "3.5", feedback: "The ratio is 1, not 0.5." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "SOH CAH TOA",
        text: [
          "The third ratio, the tangent, needs no hypotenuse: opposite = adjacent × tan θ.",
          "To choose: which two sides are involved? Opposite and hypotenuse: sin. Adjacent and hypotenuse: cos. Opposite and adjacent: tan.",
        ],
        picture: { kind: "maths", tex: SOHCAHTOA },
      },
      label(
        "No hypotenuse needed",
        { deg: 40, flip: true },
        "tan uses just O and A. The hypotenuse is left out.",
        "Label all three sides from θ.",
      ),
      label(
        "Once more",
        { deg: 25, top: true, turn: 180 },
        "Opposite and adjacent are the two tan uses.",
      ),
      {
        kind: "worked",
        tag: "Worked example",
        title: "Using tan",
        picture: right(40, "6 cm", "x", null, "40°"),
        problem: "The adjacent side is 6 cm and the angle is 40°. Find x.",
        steps: [
          {
            line: "x is opposite, and 6 cm is adjacent. No hypotenuse: use tan.",
            why: "Name the two sides involved.",
          },
          { line: "$\\tan 40° = \\frac{x}{6}$", why: "tan is opposite ÷ adjacent." },
          { line: "$x = 6 \\tan 40°$", why: "Multiply both sides by 6." },
          { line: "$x = 6 \\times 0.839 = 5.0$ cm", why: "A calculator gives tan 40°." },
        ],
        done: "5.0 cm.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Adjacent 10 cm, angle 30°",
        picture: right(30, "10 cm", "x", null, "30°"),
        start: "Find x.",
        stages: [
          {
            prompt: "Which two sides are involved?",
            options: [
              { text: "Opposite and adjacent: tan", correct: true, feedback: "" },
              {
                text: "Opposite and hypotenuse: sin",
                feedback: "10 cm is next to the angle: the adjacent, not the hypotenuse.",
              },
              {
                text: "Adjacent and hypotenuse: cos",
                feedback: "x is across from the angle: the opposite.",
              },
            ],
            then: "$\\tan 30° = \\frac{x}{10}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$10 \\tan 30° = 5.8$ cm", correct: true, feedback: "" },
              {
                text: "$10 \\sin 30° = 5$ cm",
                feedback: "sin needs the hypotenuse; 10 cm is the adjacent.",
              },
              {
                text: "$\\frac{10}{\\tan 30°} = 17.3$ cm",
                feedback: "x is on top: multiply by 10.",
              },
            ],
            then: "$x = 10 \\times 0.577 = 5.8$ cm",
          },
        ],
        done: "No hypotenuse involved: tan.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Adjacent 9 m, angle 52°",
        text: "The same steps again, with the triangle turned round.",
        picture: tri({ deg: 52, flip: true, adj: "9 m", opp: "x", angle: "52°" }),
        start: "Find x.",
        stages: [
          {
            prompt: "Label the sides from the 52°. Which two are involved?",
            options: [
              { text: "x is opposite and 9 m adjacent: use tan", correct: true, feedback: "" },
              {
                text: "x is opposite and 9 m the hypotenuse: use sin",
                feedback:
                  "9 m touches the 52° and isn't across from the right angle: it's the adjacent.",
              },
              {
                text: "x is adjacent and 9 m the hypotenuse: use cos",
                feedback: "x is across from the 52°: the opposite.",
              },
            ],
            then: "x is O and 9 m is A: use tan.",
          },
          {
            prompt: "Write the ratio:",
            options: [
              { text: "$\\tan 52° = \\frac{x}{9}$", correct: true, feedback: "" },
              {
                text: "$\\tan 52° = \\frac{9}{x}$",
                feedback: "tan is opposite ÷ adjacent: x on top.",
              },
            ],
            then: "$\\tan 52° = \\frac{x}{9}$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$9 \\tan 52° = 11.5$ m", correct: true, feedback: "" },
              { text: "$\\frac{9}{\\tan 52°} = 7.0$ m", feedback: "x is on top: multiply by 9." },
              {
                text: "$9 \\sin 52° = 7.1$ m",
                feedback: "sin needs the hypotenuse; 9 m is the adjacent.",
              },
            ],
            then: "$x = 9 \\times 1.280 = 11.5$ m",
          },
        ],
        done: "Label, pick the ratio, rearrange, calculate. Now it's your turn.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Adjacent 8 cm, angle 45°",
        text: "Find the side opposite the angle.",
        picture: right(45, "8 cm", "?", null, "45°"),
        answers: ["8"],
        unit: "cm",
        hint: "$\\tan 45° = 1$.",
        done: "$8 \\tan 45° = 8$ cm: a 45° triangle has two equal sides.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Adjacent 4 cm, angle 62°",
        text: "Find the side opposite the angle, to 1 decimal place.",
        picture: right(62, "4 cm", "?", null, "62°"),
        answers: ["7.5"],
        unit: "cm",
        wrong: [{ answer: "3.5", feedback: "That uses sin. With opposite and adjacent, use tan." }],
        hint: "$x = 4 \\tan 62°$.",
        done: "$4 \\times 1.881 = 7.5$ cm.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sam found x, opposite a 55° angle, with the adjacent side 5 cm.",
        lines: [
          "Opposite and adjacent are involved: use tan.",
          "$\\tan 55° = \\frac{5}{x}$",
          "$x = \\frac{5}{\\tan 55°} = 3.5$ cm",
        ],
        wrong: 1,
        why: "tan is opposite ÷ adjacent, so $\\tan 55° = \\frac{x}{5}$ and $x = 5 \\tan 55° = 7.1$ cm.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "sin, cos or tan?",
        groups: ["sin", "cos", "tan"],
        items: [
          { text: "Opposite and hypotenuse", group: 0, why: "SOH: sin is opposite ÷ hypotenuse." },
          { text: "Adjacent and hypotenuse", group: 1, why: "CAH: cos is adjacent ÷ hypotenuse." },
          { text: "Opposite and adjacent", group: 2, why: "TOA: tan is opposite ÷ adjacent." },
          {
            text: "The hypotenuse isn't involved",
            group: 2,
            why: "Only tan leaves out the hypotenuse.",
          },
        ],
        done: "SOH CAH TOA: pick the ratio with the two sides involved.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How tall is the tree?",
        text: "You stand 20 m away; the angle up to the top is 35°. How tall is the tree, to 1 decimal place?",
        picture: right(35, "20 m", "?", null, "35°"),
        answers: ["14.0"],
        unit: "m",
        wrong: [{ answer: "11.5", feedback: "That uses sin. You know the adjacent (20 m): tan." }],
        hint: "The height is opposite the 35°; the 20 m is adjacent.",
        done: "$20 \\tan 35° = 20 \\times 0.700 = 14.0$ m.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The adjacent side is 12 cm and the angle is 45°. Find the opposite side.",
            answers: ["12"],
            unit: "cm",
            why: "$12 \\tan 45° = 12 \\times 1 = 12$.",
            retry: {
              prompt: "The adjacent side is 9 cm and the angle is 45°. Find the opposite side.",
              answers: ["9"],
              unit: "cm",
              why: "$9 \\tan 45° = 9 \\times 1 = 9$.",
            },
          },
          {
            prompt:
              "The adjacent side is 5 cm and the angle is 50°. Find the opposite side, to 1 decimal place.",
            answers: ["6.0"],
            unit: "cm",
            why: "$5 \\tan 50° = 5 \\times 1.192 = 6.0$.",
            retry: {
              prompt:
                "The adjacent side is 7 cm and the angle is 20°. Find the opposite side, to 1 decimal place.",
              answers: ["2.5"],
              unit: "cm",
              why: "$7 \\tan 20° = 7 \\times 0.364 = 2.5$.",
            },
          },
          {
            prompt: "You know the adjacent side and want the opposite. Which ratio?",
            options: ["sin", "cos", "tan"],
            answers: ["tan"],
            why: "Opposite and adjacent: tan.",
            retry: {
              prompt: "You know the hypotenuse and want the opposite. Which ratio?",
              options: ["tan", "cos", "sin"],
              answers: ["sin"],
              why: "Opposite and hypotenuse: sin.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-trigonometry",
    id: "y9-trigonometry/angles",
    before: ANGLE,
    title: "Working back to an angle",
    summary: "Know two sides? Use the inverse to find the angle.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Is the ramp steep enough to be safe?",
        text: [
          "A wheelchair ramp must slope at no more than 5°. A ramp rises 0.5 m over 6 m along the ground.",
          "We know two sides. Is the ramp's angle allowed?",
        ],
        picture: right(15, "6 m", "0.5 m", null, "?"),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Find $\\tan 30°$, to 2 decimal places",
        answers: ["0.58"],
        hint: "Use a calculator: tan 30.",
        done: "$\\tan 30° = 0.577\\ldots \\approx 0.58$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "The opposite is 4 and the adjacent is 7. Which ratio?",
        options: [
          { text: "tan", correct: true, feedback: "Opposite and adjacent: tan." },
          { text: "sin", feedback: "sin needs the hypotenuse." },
          { text: "cos", feedback: "cos needs the hypotenuse." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Going backwards",
        text: [
          "sin, cos and tan turn an angle into a ratio. To turn a ratio back into an angle, use the **inverse**: $\\sin^{-1}$, $\\cos^{-1}$ or $\\tan^{-1}$ (shift, then the button, on a calculator).",
          "$\\tan 45° = 1$, so $\\tan^{-1}(1) = 45°$.",
        ],
        picture: { kind: "maths", tex: "\\tan 45° = 1 \\iff \\tan^{-1}(1) = 45°" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$\\sin 30° = 0.5$. So what is $\\sin^{-1}(0.5)$?",
        options: [
          {
            text: "30°",
            correct: true,
            feedback: "The inverse goes back: from the ratio 0.5 to the angle, 30°.",
          },
          {
            text: "0.5°",
            feedback: "0.5 is the ratio. The inverse gives the angle that makes it.",
          },
          { text: "60°", feedback: "$\\sin 60° = 0.866$. Which angle has a sine of 0.5?" },
        ],
      },
      label(
        "Label from θ first",
        { deg: 35, turn: 270, top: true },
        "Labelled sides tell you the ratio, whether you want a side or an angle.",
        "Before choosing a ratio, label the sides from θ.",
      ),
      {
        kind: "worked",
        tag: "Worked example",
        title: "Finding an angle",
        picture: right(29.74, "7 cm", "4 cm", null, "θ"),
        problem: "The opposite is 4 cm and the adjacent is 7 cm. Find θ.",
        steps: [
          { line: "Opposite and adjacent: use tan.", why: "Name the two sides." },
          { line: "$\\tan\\theta = \\frac{4}{7}$", why: "tan is opposite ÷ adjacent." },
          {
            line: "$\\theta = \\tan^{-1}\\left(\\frac{4}{7}\\right)$",
            why: "The inverse turns the ratio back into an angle.",
          },
          { line: "$\\theta = 29.7°$", why: "A calculator does $\\tan^{-1}$." },
        ],
        done: "29.7°.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Opposite 5 cm, hypotenuse 9 cm",
        picture: right(33.75, null, "5 cm", "9 cm", "θ"),
        start: "Find θ.",
        stages: [
          {
            prompt: "Which ratio?",
            options: [
              { text: "$\\sin\\theta = \\frac{5}{9}$", correct: true, feedback: "" },
              {
                text: "$\\cos\\theta = \\frac{5}{9}$",
                feedback: "5 cm is across from θ: the opposite.",
              },
              {
                text: "$\\tan\\theta = \\frac{5}{9}$",
                feedback: "9 cm is the hypotenuse, which tan doesn't use.",
              },
            ],
            then: "$\\sin\\theta = \\frac{5}{9}$",
          },
          {
            prompt: "So θ is",
            options: [
              {
                text: "$\\sin^{-1}\\left(\\frac{5}{9}\\right) = 33.7°$",
                correct: true,
                feedback: "",
              },
              {
                text: "$\\sin\\left(\\frac{5}{9}\\right) = 0.01°$",
                feedback: "That gives a ratio of a tiny angle. Use the inverse.",
              },
              {
                text: "$\\frac{5}{9} \\times 90 = 50°$",
                feedback: "Angles and ratios aren't in proportion. Use the inverse.",
              },
            ],
            then: "$\\theta = 33.7°$",
          },
        ],
        done: "Ratio, then inverse.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Opposite 8 cm, adjacent 5 cm",
        text: "The same steps again, with the triangle turned round.",
        picture: tri({ deg: 58, turn: 90, flip: true, opp: "8 cm", adj: "5 cm" }),
        start: "Find θ.",
        stages: [
          {
            prompt: "Label the sides from θ. Which two are involved?",
            options: [
              { text: "8 cm is opposite and 5 cm adjacent: use tan", correct: true, feedback: "" },
              {
                text: "8 cm is the hypotenuse: use sin",
                feedback: "The hypotenuse is across from the right angle. Neither side we know is.",
              },
              {
                text: "8 cm is adjacent: use cos",
                feedback: "8 cm is across from θ: the opposite.",
              },
            ],
            then: "8 cm is O and 5 cm is A: use tan.",
          },
          {
            prompt: "Write the ratio:",
            options: [
              { text: "$\\tan\\theta = \\frac{8}{5}$", correct: true, feedback: "" },
              {
                text: "$\\tan\\theta = \\frac{5}{8}$",
                feedback: "tan is opposite ÷ adjacent: 8 on top.",
              },
            ],
            then: "$\\tan\\theta = \\frac{8}{5} = 1.6$",
          },
          {
            prompt: "So θ is",
            options: [
              { text: "$\\tan^{-1}(1.6) = 58.0°$", correct: true, feedback: "" },
              {
                text: "$\\tan(1.6) = 0.03°$",
                feedback: "That gives a ratio of a tiny angle. Use the inverse.",
              },
              {
                text: "$1.6 \\times 45 = 72°$",
                feedback: "Angles and ratios aren't in proportion. Use the inverse.",
              },
            ],
            then: "$\\theta = 58.0°$",
          },
        ],
        done: "Label, pick the ratio, then the inverse. Now it's your turn.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Adjacent 5 cm, hypotenuse 9 cm",
        text: "Find the angle between them, to 1 decimal place.",
        picture: right(56.25, "5 cm", null, "9 cm", "θ"),
        answers: ["56.3"],
        unit: "°",
        wrong: [{ answer: "33.7", feedback: "That uses sin. Adjacent and hypotenuse: cos." }],
        hint: "$\\theta = \\cos^{-1}\\left(\\frac{5}{9}\\right)$.",
        done: "$\\cos^{-1}(0.556) = 56.3°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Opposite 3 cm, adjacent 3 cm",
        text: "Find θ.",
        picture: right(45, "3 cm", "3 cm", null, "θ"),
        answers: ["45"],
        unit: "°",
        hint: "$\\tan\\theta = \\frac33 = 1$.",
        done: "$\\tan^{-1}(1) = 45°$: equal sides make 45°.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo found θ with the opposite 6 cm and the adjacent 8 cm.",
        lines: [
          "$\\tan\\theta = \\frac{6}{8} = 0.75$",
          "$\\theta = \\tan(0.75)$",
          "$\\theta = 0.01°$",
        ],
        wrong: 1,
        why: "To get back to an angle, use the inverse: $\\theta = \\tan^{-1}(0.75) = 36.9°$. An angle of 0.01° would make a flat triangle.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Is the ramp allowed?",
        text: "The ramp rises 0.5 m over 6 m along the ground. What angle does it make with the ground, to 1 decimal place?",
        picture: right(15, "6 m", "0.5 m", null, "θ"),
        answers: ["4.8"],
        unit: "°",
        wrong: [
          {
            answer: "85.2",
            feedback:
              "That is the angle at the top. Use tan θ = 0.5 ÷ 6 for the angle at the ground.",
          },
        ],
        hint: "$\\tan\\theta = \\frac{0.5}{6}$.",
        done: "$\\tan^{-1}(0.083) = 4.8°$: under 5°, so the ramp is allowed ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The opposite is 1 cm and the hypotenuse is 2 cm. Find θ.",
            answers: ["30"],
            unit: "°",
            why: "$\\sin^{-1}\\left(\\frac12\\right) = 30°$.",
            retry: {
              prompt: "The opposite is 5 cm and the hypotenuse is 10 cm. Find θ.",
              answers: ["30"],
              unit: "°",
              why: "$\\sin^{-1}\\left(\\frac{5}{10}\\right) = \\sin^{-1}(0.5) = 30°$.",
            },
          },
          {
            prompt: "The opposite is 7 cm and the adjacent is 4 cm. Find θ, to 1 decimal place.",
            answers: ["60.3"],
            unit: "°",
            why: "$\\tan^{-1}\\left(\\frac74\\right) = 60.3°$.",
            retry: {
              prompt:
                "The adjacent is 3 cm and the hypotenuse is 8 cm. Find θ, to 1 decimal place.",
              answers: ["68.0"],
              unit: "°",
              why: "$\\cos^{-1}\\left(\\frac38\\right) = 68.0°$.",
            },
          },
          {
            prompt: "Which turns a ratio back into an angle?",
            options: ["$\\tan^{-1}$", "$\\tan$", "$\\sqrt{\\;}$"],
            answers: ["$\\tan^{-1}$"],
            why: "The inverse, $\\tan^{-1}$, goes from a ratio back to an angle.",
            retry: {
              prompt: "$\\cos\\theta = 0.5$. Which gives θ?",
              options: ["$\\cos(0.5)$", "$\\cos^{-1}(0.5)$", "$0.5 \\times 90$"],
              answers: ["$\\cos^{-1}(0.5)$"],
              why: "$\\theta = \\cos^{-1}(0.5) = 60°$.",
            },
          },
        ],
      },
    ],
  },
];
