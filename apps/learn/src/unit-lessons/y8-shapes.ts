// Year 8, "Angles and shapes", as six short lessons, one just before each skill: alternate and
// corresponding angles where a line crosses parallel lines, naming the parts of a triangle, when
// two triangles must be congruent, the properties of quadrilaterals and circles, and the faces,
// edges and vertices of solids. Each starts from something quick, builds the idea a step at a
// time, names the common mistakes, and ends on an exit check.
import type { DrawingPic, Point, ShapePic, UnitLesson } from "./types.ts";

const ALTERNATE = "Y8-GEO-05.a";
const CORRESPONDING = "Y8-GEO-05.b";
const NAMING = "Y8-GEO-02.a";
const CONGRUENT = "Y8-GEO-02.b";
const PROPERTIES = "Y8-GEO-03";
const SOLIDS = "Y8-GEO-06";

type Corner = "up-right" | "up-left" | "down-left" | "down-right";
interface Mark {
  on: "lower" | "upper";
  corner: Corner;
  label: string;
}

const off = (p: Point, deg: number, d: number): Point => ({
  x: p.x + d * Math.cos((deg * Math.PI) / 180),
  y: p.y + d * Math.sin((deg * Math.PI) / 180),
});

/** Two parallel lines crossed by a line at `deg`, with angles marked at the crossings. */
function parallels(deg: number, marks: Mark[], crossing = true): DrawingPic {
  const lower = { x: 2.4, y: 0 };
  const upper = { x: 2.4 + 3 / Math.tan((deg * Math.PI) / 180), y: 3 };
  const range: Record<Corner, [number, number]> = {
    "up-right": [0, deg],
    "up-left": [deg, 180],
    "down-left": [180, 180 + deg],
    "down-right": [180 + deg, 360],
  };
  return {
    kind: "drawing",
    items: [
      {
        line: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
        ],
        ...(crossing ? { arrow: 1 } : {}),
      },
      {
        line: [
          { x: 0, y: 3 },
          { x: 6, y: 3 },
        ],
        ...(crossing ? { arrow: 1 } : {}),
      },
      { line: [off(lower, 180 + deg, 1.2), off(upper, deg, 1.2)], tone: "soft" },
      ...marks.map((m) => ({
        angle: m.on === "lower" ? lower : upper,
        from: range[m.corner][0],
        to: range[m.corner][1],
        label: m.label,
      })),
    ],
  };
}

const triangle = (names: string[], extra: Partial<ShapePic> = {}): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 2, y: 4 },
  ],
  names,
  ...extra,
});

/** Two congruent triangles, one flipped over. */
const TWINS: DrawingPic = {
  kind: "drawing",
  items: [
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ],
    [
      { x: 4, y: 0 },
      { x: 1.2, y: 2.8 },
    ],
    [
      { x: 1.2, y: 2.8 },
      { x: 0, y: 0 },
    ],
    [
      { x: 9, y: 0 },
      { x: 5, y: 0 },
    ],
    [
      { x: 5, y: 0 },
      { x: 7.8, y: 2.8 },
    ],
    [
      { x: 7.8, y: 2.8 },
      { x: 9, y: 0 },
    ],
  ].map((line) => ({ line: line as [Point, Point] })),
};

const PRISM: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
      ],
    },
    {
      line: [
        { x: 3, y: 0 },
        { x: 1.5, y: 2.4 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 2.4 },
        { x: 0, y: 0 },
      ],
    },
    {
      line: [
        { x: 3, y: 0 },
        { x: 6, y: 1.4 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 2.4 },
        { x: 4.5, y: 3.8 },
      ],
    },
    {
      line: [
        { x: 6, y: 1.4 },
        { x: 4.5, y: 3.8 },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 3, y: 1.4 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      line: [
        { x: 3, y: 1.4 },
        { x: 6, y: 1.4 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      line: [
        { x: 3, y: 1.4 },
        { x: 4.5, y: 3.8 },
      ],
      dashed: true,
      tone: "soft",
    },
  ],
};

const SQUARE_PYRAMID: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 5.5, y: 1.2 },
      ],
    },
    {
      line: [
        { x: 5.5, y: 1.2 },
        { x: 1.5, y: 1.2 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      line: [
        { x: 1.5, y: 1.2 },
        { x: 0, y: 0 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 2.75, y: 4 },
      ],
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 2.75, y: 4 },
      ],
    },
    {
      line: [
        { x: 5.5, y: 1.2 },
        { x: 2.75, y: 4 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 1.2 },
        { x: 2.75, y: 4 },
      ],
      dashed: true,
      tone: "soft",
    },
  ],
};

export const y8Shapes: UnitLesson[] = [
  {
    unit: "y8-shapes",
    id: "y8-shapes/alternate",
    before: ALTERNATE,
    title: "Z angles",
    summary: "Alternate angles, on either side of a line crossing parallel lines, are equal.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The level crossing",
        text: [
          "A road crosses two parallel railway lines. At the first rail, the road makes a 70° angle. A surveyor needs the angle on the other side of the road at the second rail.",
          "She can't reach it to measure. By the end of this lesson, you can find it without measuring.",
        ],
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "?" },
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Angles on a straight line",
        text: "One angle on a straight line is 70°. What is the other?",
        answers: ["110"],
        unit: "°",
        hint: "Angles on a straight line add to 180°.",
        done: "$180 - 70 = 110°$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Two lines cross. One angle is 70°. The angle opposite it is",
        options: [
          { text: "70°", correct: true, feedback: "Vertically opposite angles are equal." },
          { text: "110°", feedback: "110° is next to it. The opposite one matches." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The same four angles",
        text: [
          "The arrows show the two lines are **parallel**: they point the same way and never meet.",
          "So the crossing line cuts each of them at the same slant, making the same four angles at both crossings.",
        ],
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "lower", corner: "up-left", label: "110°" },
          { on: "upper", corner: "up-right", label: "70°" },
          { on: "upper", corner: "up-left", label: "110°" },
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Find y",
        text: "y is between the parallel lines, on the other side of the crossing line from the 70°.",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "y" },
        ]),
        options: [
          {
            text: "70°",
            correct: true,
            feedback: "y is vertically opposite the top 70°, so it's 70° too.",
          },
          { text: "110°", feedback: "y is less than a right angle." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Alternate angles",
        text: [
          "Angles between the parallels, on **alternate** sides of the crossing line, are equal.",
          "Trace them and you draw a **Z** (sometimes back to front).",
        ],
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "70°" },
        ]),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find x",
        problem: "Find x, and give a reason.",
        picture: parallels(55, [
          { on: "lower", corner: "up-right", label: "55°" },
          { on: "upper", corner: "down-left", label: "x" },
        ]),
        steps: [
          { line: "Both between the parallels", why: "Inside the two lines." },
          { line: "On opposite sides of the crossing line", why: "A Z shape." },
          { line: "$x = 55°$ (alternate angles are equal)", why: "Always give the reason." },
        ],
        done: "Spot the Z; write the reason.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find x",
        picture: parallels(60, [
          { on: "lower", corner: "up-left", label: "120°" },
          { on: "upper", corner: "down-right", label: "x" },
        ]),
        start: "Find x.",
        stages: [
          {
            prompt: "The two angles make",
            options: [
              { text: "a Z: they're alternate", correct: true, feedback: "" },
              { text: "an F", feedback: "One is above a line, the other below: a Z." },
            ],
            then: "Alternate angles",
          },
          {
            prompt: "So x is",
            options: [
              { text: "120°", correct: true, feedback: "" },
              { text: "60°", feedback: "Alternate angles are equal, not adding to 180°." },
            ],
            then: "$x = 120°$",
          },
        ],
        done: "The Z can be wide: alternate angles can be obtuse too.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Two steps",
        picture: parallels(65, [
          { on: "lower", corner: "up-right", label: "65°" },
          { on: "upper", corner: "down-right", label: "z" },
        ]),
        start: "Find z.",
        stages: [
          {
            prompt:
              "The angle next to z, at the top crossing (down-left), is alternate to the 65°. So it's",
            options: [
              { text: "65°", correct: true, feedback: "" },
              { text: "115°", feedback: "Alternate angles are equal." },
            ],
            then: "65°",
          },
          {
            prompt: "z sits next to it on a straight line, so z is",
            options: [
              { text: "115°", correct: true, feedback: "" },
              { text: "65°", feedback: "On a straight line, they add to 180°." },
            ],
            then: "$z = 180 - 65 = 115°$",
          },
        ],
        done: "Chain the rules: alternate, then a straight line.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find a",
        picture: parallels(50, [
          { on: "lower", corner: "up-right", label: "50°" },
          { on: "upper", corner: "down-left", label: "a" },
        ]),
        answers: ["50"],
        unit: "°",
        wrong: [{ answer: "130", feedback: "It's a Z: alternate angles are equal." }],
        hint: "Trace a Z from the 50°.",
        done: "$a = 50°$, alternate angles.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find b",
        picture: parallels(75, [
          { on: "upper", corner: "down-right", label: "105°" },
          { on: "lower", corner: "up-left", label: "b" },
        ]),
        answers: ["105"],
        unit: "°",
        wrong: [{ answer: "75", feedback: "Alternate angles are equal: b matches the 105°." }],
        hint: "Between the lines, opposite sides of the crossing line.",
        done: "$b = 105°$, alternate angles.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "No arrows: are these alternate angles equal?",
        picture: {
          kind: "drawing",
          items: [
            {
              line: [
                { x: 0, y: 0 },
                { x: 6, y: 0 },
              ],
            },
            {
              line: [
                { x: 0, y: 2.6 },
                { x: 6, y: 3.6 },
              ],
            },
            {
              line: [
                { x: 2, y: -1 },
                { x: 4, y: 4.4 },
              ],
              tone: "soft",
            },
          ],
        },
        options: [
          {
            text: "Not necessarily: the lines aren't parallel",
            correct: true,
            feedback: "The Z rule only works for parallel lines, shown by arrows.",
          },
          { text: "Yes, always", feedback: "These lines tilt towards each other." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Pip finds y. The 70° and y are alternate angles.",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "y" },
        ]),
        lines: ["They make a Z", "Alternate angles add to 180°", "$y = 110°$"],
        wrong: 1,
        why: "Alternate angles are **equal**: $y = 70°$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The level crossing",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "?" },
        ]),
        options: [
          {
            text: "70°: alternate angles",
            correct: true,
            feedback: "A Z between the rails. No measuring needed.",
          },
          { text: "110°", feedback: "They're alternate: equal." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find x.",
            picture: parallels(65, [
              { on: "lower", corner: "up-right", label: "65°" },
              { on: "upper", corner: "down-left", label: "x" },
            ]),
            options: ["65°", "115°", "25°"],
            answers: ["65°"],
            why: "Alternate angles are equal.",
            retry: {
              prompt: "Find the angle marked x here.",
              picture: parallels(80, [
                { on: "lower", corner: "up-right", label: "80°" },
                { on: "upper", corner: "down-left", label: "x" },
              ]),
              options: ["80°", "100°", "10°"],
              answers: ["80°"],
              why: "Alternate angles are equal.",
            },
          },
          {
            prompt: "Alternate angles make which letter?",
            options: ["Z", "F", "C"],
            answers: ["Z"],
            why: "A Z between the parallels.",
            retry: {
              prompt: "Alternate angles are",
              options: ["equal", "add to 180°", "add to 90°"],
              answers: ["equal"],
              why: "When the lines are parallel.",
            },
          },
          {
            prompt: "Find x.",
            picture: parallels(60, [
              { on: "upper", corner: "down-right", label: "120°" },
              { on: "lower", corner: "up-left", label: "x" },
            ]),
            options: ["120°", "60°", "240°"],
            answers: ["120°"],
            why: "Alternate angles are equal.",
            retry: {
              prompt: "Find the angle marked x in this one.",
              picture: parallels(45, [
                { on: "upper", corner: "down-right", label: "135°" },
                { on: "lower", corner: "up-left", label: "x" },
              ]),
              options: ["135°", "45°", "225°"],
              answers: ["135°"],
              why: "Alternate angles are equal.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-shapes",
    id: "y8-shapes/corresponding",
    before: CORRESPONDING,
    title: "F angles",
    summary: "Corresponding angles, in the same place at each crossing, are equal.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A ladder of shelves",
        text: [
          "Shelves are fixed parallel on a wall, with a sloping support crossing them. The support meets the bottom shelf at 65°.",
          "At what angle must it meet the top shelf, in the same position? By the end of this lesson, you'll know straight away.",
        ],
        picture: parallels(65, [
          { on: "lower", corner: "up-right", label: "65°" },
          { on: "upper", corner: "up-right", label: "?" },
        ]),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Alternate angles make a Z. They are",
        options: [
          { text: "equal", correct: true, feedback: "When the lines are parallel." },
          { text: "add to 180°", feedback: "Alternate angles are equal." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Angles on a straight line: 65° and ?",
        answers: ["115"],
        unit: "°",
        hint: "They add to 180°.",
        done: "$180 - 65 = 115°$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Slide it up",
        text: "Slide the bottom crossing up the line until it sits on the top crossing. Where does the 70° land?",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "up-right", label: "x" },
        ]),
        options: [
          {
            text: "Exactly on x, so x = 70°",
            correct: true,
            feedback: "Both crossings are the same slant.",
          },
          { text: "Next to x, so x = 110°", feedback: "It lands in the same position: on x." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Corresponding angles",
        text: [
          "Angles in the **same position** at each crossing are **corresponding** angles. They are equal.",
          "Trace them and you draw an **F** (perhaps flipped or upside down).",
        ],
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "up-right", label: "70°" },
        ]),
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "F, Z or C?",
        groups: [
          "Corresponding (F): equal",
          "Alternate (Z): equal",
          "Co-interior (C): add to 180°",
        ],
        items: [
          { text: "Same position at each crossing", group: 0, why: "Slide one onto the other." },
          { text: "Between the lines, opposite sides", group: 1, why: "A Z." },
          { text: "Between the lines, same side", group: 2, why: "A C: they add to 180°." },
        ],
        done: "F and Z angles are equal; C angles add to 180°.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find x",
        problem: "Find x, and give a reason.",
        picture: parallels(55, [
          { on: "lower", corner: "down-left", label: "55°" },
          { on: "upper", corner: "down-left", label: "x" },
        ]),
        steps: [
          { line: "Both below their line, left of the crossing line", why: "Same position." },
          { line: "$x = 55°$ (corresponding angles are equal)", why: "An F shape." },
        ],
        done: "Same position, same size.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find x",
        picture: parallels(60, [
          { on: "lower", corner: "up-left", label: "120°" },
          { on: "upper", corner: "up-left", label: "x" },
        ]),
        start: "Find x.",
        stages: [
          {
            prompt: "The angles are",
            options: [
              { text: "corresponding: same position", correct: true, feedback: "" },
              { text: "alternate", feedback: "Both are above their line, on the same side: an F." },
            ],
            then: "Corresponding",
          },
          {
            prompt: "So x is",
            options: [
              { text: "120°", correct: true, feedback: "" },
              { text: "60°", feedback: "Corresponding angles are equal." },
            ],
            then: "$x = 120°$",
          },
        ],
        done: "$x = 120°$, corresponding angles.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The C shape",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-right", label: "z" },
        ]),
        start: "Find z. Both are between the lines, on the same side.",
        stages: [
          {
            prompt: "The angle above z, at the top crossing, corresponds to the 70°. So it's",
            options: [
              { text: "70°", correct: true, feedback: "" },
              { text: "110°", feedback: "Corresponding angles are equal." },
            ],
            then: "70°",
          },
          {
            prompt: "z is next to it on a straight line, so z is",
            options: [
              { text: "110°", correct: true, feedback: "" },
              { text: "70°", feedback: "On a straight line they add to 180°." },
            ],
            then: "$z = 110°$",
          },
        ],
        done: "That's why co-interior (C) angles add to 180°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find a",
        picture: parallels(50, [
          { on: "lower", corner: "down-right", label: "130°" },
          { on: "upper", corner: "down-right", label: "a" },
        ]),
        answers: ["130"],
        unit: "°",
        wrong: [{ answer: "50", feedback: "Same position: corresponding angles are equal." }],
        hint: "Is it in the same position at the other crossing?",
        done: "$a = 130°$, corresponding angles.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find b",
        picture: parallels(75, [
          { on: "lower", corner: "up-right", label: "75°" },
          { on: "upper", corner: "down-right", label: "b" },
        ]),
        answers: ["105"],
        unit: "°",
        wrong: [{ answer: "75", feedback: "This is a C shape: they add to 180°." }],
        hint: "Between the lines, same side: co-interior.",
        done: "$b = 180 - 75 = 105°$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Which pair is NOT equal?",
        options: [
          {
            text: "Co-interior (C) angles",
            correct: true,
            feedback: "They add to 180°. Only the F and Z pairs are equal.",
          },
          { text: "Corresponding (F) angles", feedback: "F angles are equal." },
          { text: "Alternate (Z) angles", feedback: "Z angles are equal." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Cal finds x.",
        picture: parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "up-left", label: "x" },
        ]),
        lines: ["x is at the other crossing", "So x corresponds to the 70°", "$x = 70°$"],
        wrong: 1,
        why: "x is on the **other side** of the crossing line, so it's not in the same position. It corresponds to 110°: $x = 110°$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The shelves",
        picture: parallels(65, [
          { on: "lower", corner: "up-right", label: "65°" },
          { on: "upper", corner: "up-right", label: "?" },
        ]),
        options: [
          {
            text: "65°: corresponding angles",
            correct: true,
            feedback: "Same position, same angle.",
          },
          { text: "115°", feedback: "It's an F: equal." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find x.",
            picture: parallels(70, [
              { on: "lower", corner: "down-left", label: "70°" },
              { on: "upper", corner: "down-left", label: "x" },
            ]),
            options: ["70°", "110°", "20°"],
            answers: ["70°"],
            why: "Corresponding angles are equal.",
            retry: {
              prompt: "Find the angle marked x here.",
              picture: parallels(50, [
                { on: "lower", corner: "down-left", label: "50°" },
                { on: "upper", corner: "down-left", label: "x" },
              ]),
              options: ["50°", "130°", "40°"],
              answers: ["50°"],
              why: "Corresponding angles are equal.",
            },
          },
          {
            prompt: "Corresponding angles make which letter?",
            options: ["F", "Z", "C"],
            answers: ["F"],
            why: "Same position at each crossing.",
            retry: {
              prompt: "Co-interior angles",
              options: ["add to 180°", "are equal", "add to 360°"],
              answers: ["add to 180°"],
              why: "A C shape between the lines.",
            },
          },
          {
            prompt: "Find x.",
            picture: parallels(60, [
              { on: "lower", corner: "up-right", label: "60°" },
              { on: "upper", corner: "down-right", label: "x" },
            ]),
            options: ["120°", "60°", "30°"],
            answers: ["120°"],
            why: "Co-interior angles add to 180°.",
            retry: {
              prompt: "Find the angle marked x in this one.",
              picture: parallels(80, [
                { on: "lower", corner: "up-right", label: "80°" },
                { on: "upper", corner: "down-right", label: "x" },
              ]),
              options: ["100°", "80°", "10°"],
              answers: ["100°"],
              why: "Co-interior angles add to 180°.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-shapes",
    id: "y8-shapes/naming",
    before: NAMING,
    title: "Naming a triangle",
    summary: "Capital letters for corners, small letters for the sides opposite them.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Which side?",
        text: [
          "Your teacher says: “Find side b, and the angle ABC.” Which side, and which angle, do they mean?",
          "Maths has a standard way to name the parts of a triangle, so everyone means the same thing. By the end of this lesson, you'll use it.",
        ],
        picture: triangle(["A", "B", "C"]),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "How many sides and corners does a triangle have?",
        options: [
          { text: "3 sides and 3 corners", correct: true, feedback: "Tri means three." },
          { text: "3 sides and 6 corners", feedback: "Count the corners: 3." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Side AB joins",
        picture: triangle(["A", "B", "C"]),
        options: [
          { text: "corner A to corner B", correct: true, feedback: "Name a side by its two ends." },
          { text: "corner C to corner A", feedback: "That's side CA." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Opposite sides",
        text: [
          "Corners get capital letters: A, B, C. The side **opposite** a corner, the one it doesn't touch, gets the same letter, small.",
          "So side a is opposite A, side b is opposite B, and side c is opposite C.",
        ],
        picture: triangle(["A", "B", "C"], { sides: ["c", "a", "b"] }),
      },
      {
        kind: "label",
        tag: "Discover",
        title: "Label the sides a, b and c",
        shape: triangle(["A", "B", "C"]),
        chips: [
          { mark: "a", name: "side a", why: "Side a is opposite corner A: it doesn't touch A." },
          { mark: "b", name: "side b", why: "Side b is opposite corner B: it doesn't touch B." },
          { mark: "c", name: "side c", why: "Side c is opposite corner C: it doesn't touch C." },
        ],
        answers: ["c", "a", "b"],
        done: "Each side is named after the corner it faces.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Naming angles",
        text: [
          "The angle at B is written $\\angle ABC$: go from A, to B, to C. The **middle** letter is the corner.",
          "When it's clear, just write $\\angle B$.",
        ],
        picture: triangle(["A", "B", "C"], { angles: [null, "?", null] }),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Read the names",
        problem: "In triangle PQR, what is side q, and where is $\\angle PRQ$?",
        picture: triangle(["P", "Q", "R"]),
        steps: [
          { line: "Side q is opposite Q: it's PR", why: "The side that doesn't touch Q." },
          { line: "$\\angle PRQ$ is at R", why: "The middle letter is the corner." },
        ],
        done: "Small letter: the opposite side. Middle letter: the corner.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Triangle XYZ",
        picture: triangle(["X", "Y", "Z"]),
        start: "Triangle XYZ",
        stages: [
          {
            prompt: "Side x is",
            options: [
              { text: "YZ", correct: true, feedback: "" },
              { text: "XY", feedback: "XY touches X. Side x is opposite X." },
            ],
            then: "$x = YZ$",
          },
          {
            prompt: "$\\angle XZY$ is the angle at",
            options: [
              { text: "Z", correct: true, feedback: "" },
              { text: "X", feedback: "The middle letter is the corner." },
            ],
            then: "At Z",
          },
        ],
        done: "Side x = YZ; $\\angle XZY$ is at Z.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which side is opposite angle Q?",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 3, y: 4 },
          ],
          names: ["P", "Q", "R"],
          angles: [null, "?", null],
        },
        options: [
          {
            text: "PR",
            correct: true,
            feedback: "PR is across the triangle from Q: it doesn't touch Q.",
          },
          { text: "PQ", feedback: "PQ touches Q. The opposite side doesn't." },
          { text: "QR", feedback: "QR touches Q. The opposite side doesn't." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "In triangle DEF, side e is",
        picture: triangle(["D", "E", "F"]),
        options: [
          { text: "DF", correct: true, feedback: "Opposite E: it doesn't touch E." },
          { text: "DE", feedback: "DE touches E." },
          { text: "EF", feedback: "EF touches E." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "$\\angle LMN$ is the angle at",
        picture: triangle(["L", "M", "N"]),
        options: [
          { text: "M", correct: true, feedback: "The middle letter." },
          { text: "L", feedback: "The corner is the middle letter." },
          { text: "N", feedback: "The corner is the middle letter." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Kim says $\\angle ABC$ is the angle at A, because A comes first. Is she right?",
        options: [
          {
            text: "No: the middle letter, B, is the corner",
            correct: true,
            feedback: "A and C are the ends of the two arms; B is where they meet.",
          },
          { text: "Yes", feedback: "Trace A to B to C: you turn at B." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo labels triangle ABC.",
        lines: ["Side a is opposite A: BC", "Side b touches B: AB", "Side c is opposite C: AB"],
        wrong: 1,
        why: "Side b is **opposite** B: it's AC. It mustn't touch B.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "“Find side b, and the angle ABC.”",
        picture: triangle(["A", "B", "C"]),
        options: [
          {
            text: "Side AC, and the angle at B",
            correct: true,
            feedback: "b is opposite B; the middle letter is the corner.",
          },
          { text: "Side AB, and the angle at A", feedback: "b is opposite B, and ∠ABC is at B." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "In triangle ABC, side a is",
            options: ["BC", "AB", "AC"],
            answers: ["BC"],
            why: "Opposite A.",
            retry: {
              prompt: "In triangle ABC, side c is",
              options: ["AB", "BC", "AC"],
              answers: ["AB"],
              why: "Opposite C.",
            },
          },
          {
            prompt: "$\\angle PQR$ is the angle at",
            options: ["Q", "P", "R"],
            answers: ["Q"],
            why: "The middle letter.",
            retry: {
              prompt: "$\\angle RPQ$ is the angle at",
              options: ["P", "R", "Q"],
              answers: ["P"],
              why: "The middle letter.",
            },
          },
          {
            prompt: "In triangle XYZ, which side is y?",
            options: ["XZ", "XY", "YZ"],
            answers: ["XZ"],
            why: "Opposite Y.",
            retry: {
              prompt: "In triangle XYZ, which side is z?",
              options: ["XY", "YZ", "XZ"],
              answers: ["XY"],
              why: "Opposite Z.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-shapes",
    id: "y8-shapes/congruent",
    before: CONGRUENT,
    title: "Exactly the same",
    summary: "SSS, SAS, ASA or RHS: enough facts to fix a triangle.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Matching roof trusses",
        text: [
          "A builder needs two triangular roof trusses exactly the same. She checks only some measurements on each.",
          "Which measurements are enough to be sure? By the end of this lesson, you'll know the four tests.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 2, y: 4 },
          ],
          sides: ["6 m", "5.7 m", "4.5 m"],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A shape is turned over. Is it still the same shape and size?",
        options: [
          { text: "Yes", correct: true, feedback: "Flipping or turning doesn't change it." },
          { text: "No", feedback: "Its sides and angles haven't changed." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Two triangles have the same angles, 50°, 60° and 70°. Must they be the same size?",
        options: [
          {
            text: "No: one can be an enlargement",
            correct: true,
            feedback: "Same shape, different size.",
          },
          { text: "Yes", feedback: "Draw a small one and a big one with the same angles." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Congruent",
        text: [
          "**Congruent** shapes are exactly the same shape and size: one fits exactly on the other, perhaps turned or flipped.",
          "You don't need to check all six sides and angles. Some sets of three facts fix the triangle completely.",
        ],
        picture: TWINS,
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The four tests",
        text: [
          "**SSS**: all three sides match. **SAS**: two sides and the angle **between** them.",
          "**ASA**: two angles and the side between them. **RHS**: a right angle, the hypotenuse and one other side.",
        ],
        picture: {
          kind: "table",
          head: ["Test", "What matches"],
          rows: [
            ["SSS", "3 sides"],
            ["SAS", "2 sides + angle between"],
            ["ASA", "2 angles + side between"],
            ["RHS", "right angle, hypotenuse, side"],
          ],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Which test?",
        problem: "Two triangles both have sides 5 cm and 7 cm, with 40° between them. Congruent?",
        steps: [
          { line: "Two sides match: 5 and 7", why: "S, S." },
          { line: "The angle is between them", why: "A, in the middle." },
          { line: "Congruent, by SAS", why: "Two sides and the included angle fix it." },
        ],
        done: "Check where the angle is: it must be between the sides.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which test?",
        start: "Two triangles: each has angles 50° and 60°, with a 4 cm side between them.",
        stages: [
          {
            prompt: "What matches?",
            options: [
              { text: "two angles and the side between", correct: true, feedback: "" },
              { text: "two sides and an angle", feedback: "Only one side is given." },
            ],
            then: "A, S, A",
          },
          {
            prompt: "So",
            options: [
              { text: "congruent, by ASA", correct: true, feedback: "" },
              { text: "not enough to tell", feedback: "ASA is one of the four tests." },
            ],
            then: "Congruent (ASA)",
          },
        ],
        done: "ASA fixes the triangle.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Right-angled",
        start: "Two right-angled triangles both have hypotenuse 13 cm and a side of 5 cm.",
        stages: [
          {
            prompt: "What matches?",
            options: [
              { text: "right angle, hypotenuse, side", correct: true, feedback: "" },
              { text: "three sides", feedback: "Only two sides are given." },
            ],
            then: "R, H, S",
          },
          {
            prompt: "So",
            options: [
              { text: "congruent, by RHS", correct: true, feedback: "" },
              { text: "not enough", feedback: "RHS is enough for right-angled triangles." },
            ],
            then: "Congruent (RHS)",
          },
        ],
        done: "RHS works only with a right angle.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Both triangles have sides 6, 8 and 9 cm. Congruent?",
        options: [
          {
            text: "Yes, by SSS",
            correct: true,
            feedback: "Three matching sides fix the triangle.",
          },
          { text: "We can't tell", feedback: "Three sides are enough." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Both have angles 30°, 70° and 80°. Congruent?",
        options: [
          {
            text: "Not necessarily",
            correct: true,
            feedback: "AAA gives the same shape, but not always the same size.",
          },
          { text: "Yes, by AAA", feedback: "AAA isn't a test: one could be bigger." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sides 5 and 7, with a 40° angle that is NOT between them. Is that SAS?",
        options: [
          {
            text: "No: SAS needs the angle between the two sides",
            correct: true,
            feedback: "With the angle elsewhere, two different triangles can fit.",
          },
          { text: "Yes", feedback: "The A must be in the middle: between the S and S." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zara compares two triangles.",
        lines: [
          "Both have angles 45°, 45° and 90°",
          "All three angles match",
          "So they're congruent",
        ],
        wrong: 2,
        why: "Matching angles only prove the same shape. Without a matching side, one could be bigger.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The roof trusses",
        text: "The builder checks that the three sides of each truss are 6 m, 5.7 m and 4.5 m.",
        options: [
          {
            text: "Enough: congruent by SSS",
            correct: true,
            feedback: "Three matching sides fix the triangle.",
          },
          { text: "Not enough: check the angles too", feedback: "Three sides fix the angles too." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Two sides and the angle between them match. Test?",
            options: ["SAS", "SSS", "ASA"],
            answers: ["SAS"],
            why: "Side, angle between, side.",
            retry: {
              prompt: "Two angles and the side between them match. Test?",
              options: ["ASA", "SAS", "RHS"],
              answers: ["ASA"],
              why: "Angle, side between, angle.",
            },
          },
          {
            prompt: "Which is NOT a test for congruence?",
            options: ["AAA", "SSS", "RHS"],
            answers: ["AAA"],
            why: "Same angles can be different sizes.",
            retry: {
              prompt: "Which of these doesn't prove congruence?",
              options: [
                "Three equal angles",
                "Three equal sides",
                "Two sides and the angle between",
              ],
              answers: ["Three equal angles"],
              why: "One could be an enlargement.",
            },
          },
          {
            prompt: "Right angle, hypotenuse 10 cm and side 6 cm match. Test?",
            options: ["RHS", "SAS", "SSS"],
            answers: ["RHS"],
            why: "Right angle, hypotenuse, side.",
            retry: {
              prompt: "Right angle, hypotenuse 17 cm and side 8 cm match. Test?",
              options: ["RHS", "ASA", "SSS"],
              answers: ["RHS"],
              why: "Right angle, hypotenuse, side.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-shapes",
    id: "y8-shapes/properties",
    before: PROPERTIES,
    title: "Shape properties",
    summary: "Each family of shapes has its own rules: sides, angles, diagonals.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Is it a square?",
        text: [
          "A builder measures a window frame: all four sides are 80 cm. “It's a square,” he says.",
          "Is he right? By the end of this lesson, you can say what else he'd need to check.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 5.5, y: 3.7 },
            { x: 1.5, y: 3.7 },
          ],
          sides: ["80 cm", "80 cm", "80 cm", "80 cm"],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The angles in a quadrilateral add to",
        answers: ["360"],
        unit: "°",
        hint: "Cut it into two triangles.",
        done: "Two triangles: $2 \\times 180 = 360°$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A rectangle's angles are all",
        options: [
          { text: "90°", correct: true, feedback: "Four right angles." },
          { text: "different", feedback: "Every rectangle has four right angles." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Families of quadrilaterals",
        text: [
          "A **rhombus** has four equal sides. A **square** is a rhombus with right angles.",
          "So four equal sides alone don't make a square: the angles matter too.",
        ],
        picture: {
          kind: "table",
          head: ["Shape", "Sides", "Angles"],
          rows: [
            ["Square", "4 equal", "all 90°"],
            ["Rhombus", "4 equal", "opposite equal"],
            ["Rectangle", "opposite equal", "all 90°"],
            ["Parallelogram", "opposite equal", "opposite equal"],
          ],
        },
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "Which shape has it?",
        groups: ["Parallelogram", "Kite", "Trapezium"],
        items: [
          {
            text: "Two pairs of parallel sides",
            group: 0,
            why: "A parallelogram's opposite sides are parallel.",
          },
          {
            text: "Diagonals cut each other in half",
            group: 0,
            why: "A parallelogram's diagonals bisect each other.",
          },
          {
            text: "Exactly one pair of parallel sides",
            group: 2,
            why: "That is what makes a trapezium.",
          },
          {
            text: "Two pairs of equal sides next to each other",
            group: 1,
            why: "A kite's equal sides are next to each other.",
          },
          {
            text: "One line of symmetry, corner to corner",
            group: 1,
            why: "A kite folds along one diagonal.",
          },
        ],
        done: "Each family of quadrilaterals has its own properties.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Why opposite angles of a parallelogram are equal",
        problem: "A parallelogram has one angle of 70°. Find the others.",
        steps: [
          {
            line: "Next angle: $180 - 70 = 110°$",
            why: "Co-interior angles between parallel sides add to 180°.",
          },
          { line: "Then 70°, then 110°", why: "Same reason, all the way round." },
          { line: "70°, 110°, 70°, 110°", why: "Opposite angles are equal; total 360° ✓" },
        ],
        done: "Properties come from reasons, like parallel-line angles.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "An isosceles triangle",
        start: "An isosceles triangle has two equal sides. Its top angle is 40°.",
        stages: [
          {
            prompt: "The two base angles are",
            options: [
              { text: "equal", correct: true, feedback: "" },
              { text: "different", feedback: "Fold it down the middle: they match." },
            ],
            then: "Equal base angles",
          },
          {
            prompt: "Each base angle is",
            options: [
              { text: "70°", correct: true, feedback: "" },
              { text: "140°", feedback: "$180 - 40 = 140$, shared between two angles." },
            ],
            then: "$(180 - 40) \\div 2 = 70°$",
          },
        ],
        done: "Isosceles: two equal sides, two equal angles.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "What is the blue line called?",
        picture: {
          kind: "drawing",
          items: [
            { arc: { x: 0, y: 0 }, r: 3, from: 0, to: 180 },
            { arc: { x: 0, y: 0 }, r: 3, from: 180, to: 360 },
            { dot: { x: 0, y: 0 } },
            {
              line: [
                { x: -2.6, y: 1.5 },
                { x: 2.6, y: 1.5 },
              ],
              tone: "find",
            },
          ],
        },
        options: [
          {
            text: "A chord",
            correct: true,
            feedback:
              "A chord joins two points on the circle. A chord through the centre is a diameter.",
          },
          { text: "A radius", feedback: "A radius goes from the centre to the edge." },
          {
            text: "A diameter",
            feedback: "A diameter goes through the centre. This line doesn't.",
          },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A kite has angles 110°, 110° and 60°. Find the fourth",
        answers: ["80"],
        unit: "°",
        hint: "They add to 360°.",
        done: "$360 - 110 - 110 - 60 = 80°$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which shape's diagonals cross at right angles?",
        options: [
          { text: "A rhombus", correct: true, feedback: "And a square and a kite too." },
          {
            text: "A rectangle",
            feedback:
              "A rectangle's diagonals are equal, but don't cross at 90° (unless it's a square).",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Is a square a rectangle?",
        options: [
          {
            text: "Yes: it has four right angles and opposite sides equal",
            correct: true,
            feedback:
              "A square has every property of a rectangle, and more. It's a special rectangle.",
          },
          {
            text: "No: a rectangle has two long sides",
            feedback: "A rectangle only needs opposite sides equal.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Amy finds the base angles of an isosceles triangle with top angle 50°.",
        lines: ["The base angles are equal", "Each is $180 - 50 = 130°$", "So 130° and 130°"],
        wrong: 1,
        why: "The 130° is shared between both base angles: $130 \\div 2 = 65°$ each.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Four sides of 80 cm",
        text: "Is the window frame a square?",
        options: [
          {
            text: "Not yet: it could be a rhombus. Check for a right angle",
            correct: true,
            feedback:
              "Equal sides make a rhombus. A right angle (or equal diagonals) makes it a square.",
          },
          { text: "Yes: four equal sides", feedback: "A rhombus has four equal sides too." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A shape with exactly one pair of parallel sides is a",
            options: ["trapezium", "parallelogram", "kite"],
            answers: ["trapezium"],
            why: "Exactly one pair.",
            retry: {
              prompt: "A shape with two pairs of equal sides next to each other is a",
              options: ["kite", "rectangle", "trapezium"],
              answers: ["kite"],
              why: "Equal sides next to each other.",
            },
          },
          {
            prompt: "A parallelogram has an angle of 65°. The angle next to it is",
            options: ["115°", "65°", "25°"],
            answers: ["115°"],
            why: "They add to 180°.",
            retry: {
              prompt: "A parallelogram has an angle of 120°. The angle next to it is",
              options: ["60°", "120°", "240°"],
              answers: ["60°"],
              why: "They add to 180°.",
            },
          },
          {
            prompt: "An isosceles triangle has top angle 80°. Each base angle is",
            options: ["50°", "100°", "80°"],
            answers: ["50°"],
            why: "$(180 - 80) \\div 2$.",
            retry: {
              prompt: "An isosceles triangle has top angle 20°. Each base angle is",
              options: ["80°", "160°", "20°"],
              answers: ["80°"],
              why: "$(180 - 20) \\div 2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-shapes",
    id: "y8-shapes/solids",
    before: SOLIDS,
    title: "Faces, edges, vertices",
    summary: "Count the faces, edges and vertices of solids to describe and build them.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A chocolate box",
        text: [
          "A chocolate box is a triangular prism. The designer needs to know how many pieces of card to cut, and how many edges to glue.",
          "By the end of this lesson, you can count them, and spot a rule that links them.",
        ],
        picture: PRISM,
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "How many faces does a cube have?",
        options: [
          { text: "6", correct: true, feedback: "Like a dice." },
          { text: "4", feedback: "Don't forget the top and bottom." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which of these has a curved surface?",
        options: [
          { text: "A cylinder", correct: true, feedback: "Its side curves round." },
          { text: "A cube", feedback: "A cube is all flat faces." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Faces, edges, vertices",
        text: [
          "A **face** is a flat surface. An **edge** is where two faces meet. A **vertex** is a corner, where edges meet.",
          "A cuboid has 6 faces, 12 edges and 8 vertices.",
        ],
        picture: { kind: "cuboid", w: 4, d: 2, h: 3 },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "How many edges does a cuboid have?",
        picture: { kind: "cuboid", w: 4, d: 2, h: 3 },
        answers: ["12"],
        wrong: [
          { answer: "6", feedback: "6 is the number of faces. Edges are where two faces meet." },
          { answer: "8", feedback: "8 is the number of vertices, the corners." },
        ],
        hint: "4 round the top, 4 round the bottom, and 4 going up.",
        done: "12 edges.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The triangular prism",
        problem: "Count the faces, edges and vertices of a triangular prism.",
        picture: PRISM,
        steps: [
          { line: "Faces: 2 triangles + 3 rectangles = 5", why: "The ends and the sides." },
          { line: "Edges: 3 + 3 + 3 = 9", why: "Round each end, plus 3 joining them." },
          { line: "Vertices: 3 + 3 = 6", why: "3 corners at each end." },
        ],
        done: "Count in groups: ends first, then what joins them.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A square-based pyramid",
        picture: SQUARE_PYRAMID,
        start: "A square base, with four triangles meeting at the top.",
        stages: [
          {
            prompt: "Faces:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "4", feedback: "Don't forget the square base." },
            ],
            then: "5 faces",
          },
          {
            prompt:
              "Edges: 4 round the base, and 4 up to the top. Vertices: 4 on the base, and 1 at the top.",
            options: [
              { text: "8 edges, 5 vertices", correct: true, feedback: "" },
              { text: "4 edges, 4 vertices", feedback: "Include the edges and vertex at the top." },
            ],
            then: "8 edges, 5 vertices",
          },
        ],
        done: "5 faces, 8 edges, 5 vertices.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Spot the rule",
        text: "Cuboid: 6 faces, 8 vertices, 12 edges. Prism: 5, 6, 9. Pyramid: 5, 5, 8. What is faces + vertices − edges?",
        options: [
          {
            text: "Always 2",
            correct: true,
            feedback: "6 + 8 − 12 = 2, 5 + 6 − 9 = 2, 5 + 5 − 8 = 2. This is Euler's rule.",
          },
          { text: "Always 0", feedback: "Try the cuboid: 6 + 8 − 12." },
        ],
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "A triangular prism",
        picture: PRISM,
        template: "It has [] faces, [] edges and [] vertices.",
        bank: ["$5$", "$6$", "$8$", "$9$", "$12$"],
        answers: ["$5$", "$9$", "$6$"],
        hint: "2 triangles and 3 rectangles make the faces. Count the corners: 3 at each end.",
        done: "5 faces, 9 edges, 6 vertices.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which solid?",
        text: "It has one flat face, one curved surface and one vertex.",
        options: [
          {
            text: "A cone",
            correct: true,
            feedback: "A flat circle at the bottom, a curved surface, and a point at the top.",
          },
          { text: "A cylinder", feedback: "A cylinder has two flat faces and no vertex." },
          { text: "A sphere", feedback: "A sphere has no flat face and no vertex." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Rob counts a cube's edges by looking at the drawing: 9. Why is he wrong?",
        picture: { kind: "cuboid", w: 3, d: 3, h: 3 },
        options: [
          {
            text: "Some edges are hidden at the back",
            correct: true,
            feedback: "A cube has 12 edges. Count all of them, seen or not: 4 top, 4 bottom, 4 up.",
          },
          { text: "He's right", feedback: "Three edges are hidden at the back." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tia describes a cylinder.",
        lines: ["2 flat faces: top and bottom", "1 curved surface", "8 vertices"],
        wrong: 2,
        why: "A cylinder has no corners: 0 vertices. Its edges are the two circles.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The chocolate box",
        picture: PRISM,
        text: "How many pieces of card (faces), and how many edges to glue?",
        options: [
          {
            text: "5 pieces, 9 edges",
            correct: true,
            feedback: "2 triangles and 3 rectangles; 9 edges.",
          },
          { text: "6 pieces, 12 edges", feedback: "That's a cuboid." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many vertices does a cuboid have?",
            options: ["8", "6", "12"],
            answers: ["8"],
            why: "4 on top, 4 underneath.",
            retry: {
              prompt: "How many faces does a cuboid have?",
              options: ["6", "8", "12"],
              answers: ["6"],
              why: "Top, bottom and four sides.",
            },
          },
          {
            prompt: "A square-based pyramid has how many edges?",
            options: ["8", "5", "4"],
            answers: ["8"],
            why: "4 round the base, 4 up to the top.",
            retry: {
              prompt: "A triangular prism has how many edges?",
              options: ["9", "6", "5"],
              answers: ["9"],
              why: "3 at each end, 3 joining them.",
            },
          },
          {
            prompt: "A solid has 7 faces and 10 vertices. Edges? (F + V − E = 2)",
            options: ["15", "17", "3"],
            answers: ["15"],
            why: "$7 + 10 - 2 = 15$.",
            retry: {
              prompt: "A solid has 8 faces and 12 vertices. Edges? (F + V − E = 2)",
              options: ["18", "20", "4"],
              answers: ["18"],
              why: "$8 + 12 - 2 = 18$.",
            },
          },
        ],
      },
    ],
  },
];
