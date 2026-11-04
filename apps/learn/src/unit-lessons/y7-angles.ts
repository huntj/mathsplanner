// Year 7, "Angle facts", as six short lessons, one just before each skill: a full turn, a half
// turn, crossing lines, a triangle, any polygon, and regular polygons. Each opens on a real
// problem, warms up what it builds on, finds the idea, works an example, does one together,
// gives some to try, spots a common mistake, solves the opening problem, and ends on an exit check.
import { regular } from "./geometry.ts";
import type { AnglesPic, DrawingPic, Point, ShapePic, UnitLesson } from "./types.ts";

const POINT = "Y7-GEO-05.a";
const LINE = "Y7-GEO-05.b";
const OPPOSITE = "Y7-GEO-05.c";
const TRIANGLE = "Y7-GEO-06.a";
const POLYGON = "Y7-GEO-06.b";
const REGULAR = "Y7-GEO-06.c";

const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (deg: number, r: number, from: Point = { x: 0, y: 0 }): Point => ({
  x: Math.round((from.x + r * Math.cos(rad(deg))) * 100) / 100,
  y: Math.round((from.y + r * Math.sin(rad(deg))) * 100) / 100,
});

/** Angles round a point or on a line: rays, and a label for the gap after each one. */
const fan = (rays: number[], labels: (string | null)[], find = "x"): AnglesPic => ({
  kind: "angles",
  rays,
  arcs: labels.flatMap((label, i) =>
    label === null
      ? []
      : [
          {
            from: i,
            to: (i + 1) % rays.length,
            label,
            ...(label === find ? { find: true as const } : {}),
          },
        ],
  ),
});

/** Two straight lines crossing, at rays a, 180 - a, 180 + a and 360 - a. */
const cross = (a: number, labels: (string | null)[], find = "x"): AnglesPic =>
  fan([a, 180 - a, 180 + a, 360 - a], labels, find);

/** A triangle drawn to match its angles at the bottom left and bottom right. */
function triangle(
  left: number,
  right: number,
  labels: (string | null)[],
  square?: number,
): ShapePic {
  const t = 7 / (1 / Math.tan(rad(left)) + 1 / Math.tan(rad(right)));
  const top = {
    x: Math.round((t / Math.tan(rad(left))) * 100) / 100,
    y: Math.round(t * 100) / 100,
  };
  return {
    kind: "shape",
    points: [{ x: 0, y: 0 }, { x: 7, y: 0 }, top],
    angles: labels,
    ...(square === undefined ? {} : { square: [square] }),
  };
}

/** A right-angled triangle, the right angle at the bottom right. */
function rightAngled(left: number, labels: (string | null)[]): ShapePic {
  return {
    kind: "shape",
    points: [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: Math.round(6 * Math.tan(rad(left)) * 100) / 100 },
    ],
    angles: labels,
    square: [1],
  };
}

/** A polygon split into triangles by the diagonals from its first corner. */
function split(points: Point[], angles?: (string | null)[]): ShapePic {
  const first = points[0] ?? { x: 0, y: 0 };
  return {
    kind: "shape",
    points,
    dashed: points.slice(2, -1).map((p) => [first, p] as [Point, Point]),
    ...(angles ? { angles } : {}),
  };
}

const quad = [
  { x: 0, y: 0 },
  { x: 6, y: 0 },
  { x: 5, y: 4 },
  { x: 1, y: 3 },
];
const pentagon = regular(5, 3, 90);
const hexagon = regular(6, 3, 90);
const octagon = regular(8, 3, 90);
const garden = [
  { x: 0, y: 0 },
  { x: 6, y: 0 },
  { x: 7, y: 3.5 },
  { x: 3.5, y: 6 },
  { x: -0.8, y: 3.6 },
];

/** A pizza with slices cut at these angles round its centre, labelled between the cuts. */
function pizza(cuts: number[], labels: string[]): DrawingPic {
  return {
    kind: "drawing",
    items: [
      { arc: { x: 0, y: 0 }, r: 3, from: 0, to: 360 },
      ...cuts.map((c) => ({ line: [{ x: 0, y: 0 }, at(c, 3)] as [Point, Point] })),
      ...labels.map((text, i) => {
        const a = cuts[i] ?? 0;
        const b = cuts[(i + 1) % cuts.length] ?? 0;
        const mid = (a + ((b - a + 360) % 360) / 2) % 360;
        return { text, at: at(mid, 1.7), ...(text === "?" ? { tone: "find" as const } : {}) };
      }),
    ],
  };
}

/** A laptop opened on a desk: the screen 110° from the keyboard. */
const laptop: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: -1, y: 0 },
        { x: 8, y: 0 },
      ],
      tone: "soft",
    },
    {
      line: [
        { x: 0.5, y: 0 },
        { x: 5, y: 0 },
      ],
    },
    { line: [{ x: 5, y: 0 }, at(70, 4.5, { x: 5, y: 0 })] },
    { text: "110°", at: { x: 4.1, y: 0.8 } },
    { text: "?", at: { x: 6.1, y: 0.7 }, tone: "find" },
    { text: "desk", at: { x: 1.5, y: -0.6 } },
  ],
};

/** Open scissors: blades to the right, 35° apart, and handles to the left. */
const scissors: DrawingPic = {
  kind: "drawing",
  items: [
    { line: [at(197.5, 3.5), at(17.5, 5)] },
    { line: [at(162.5, 3.5), at(-17.5, 5)] },
    { arc: at(197.5, 4.2), r: 0.7, from: 0, to: 360 },
    { arc: at(162.5, 4.2), r: 0.7, from: 0, to: 360 },
    { dot: { x: 0, y: 0 } },
    { text: "35°", at: { x: 1.6, y: 0 } },
    { text: "?", at: { x: -1.6, y: 0 }, tone: "find" },
    { text: "blades", at: { x: 4.4, y: 2.5 } },
    { text: "handles", at: { x: -4.2, y: 2.7 } },
  ],
};

/** A roof: two slopes each meeting the flat beam at 35°. */
const roof: DrawingPic = {
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
        { x: 0, y: 0 },
        { x: 4, y: 2.8 },
      ],
    },
    {
      line: [
        { x: 8, y: 0 },
        { x: 4, y: 2.8 },
      ],
    },
    {
      line: [
        { x: 0.6, y: 0 },
        { x: 0.6, y: -1.5 },
      ],
      tone: "soft",
    },
    {
      line: [
        { x: 7.4, y: 0 },
        { x: 7.4, y: -1.5 },
      ],
      tone: "soft",
    },
    { text: "35°", at: { x: 1.6, y: 0.4 } },
    { text: "35°", at: { x: 6.4, y: 0.4 } },
    { text: "?", at: { x: 4, y: 2.1 }, tone: "find" },
  ],
};

/** Regular pentagons of side 2, each with a corner at the origin, turned by these angles. */
function pentagons(turns: number[]): DrawingPic {
  const items: DrawingPic["items"] = [];
  for (const turn of turns) {
    let p: Point = { x: 0, y: 0 };
    for (let k = 0; k < 5; k++) {
      const q = at(turn + 72 * k, 2, p);
      items.push({ line: [p, q] });
      p = q;
    }
  }
  items.push({ text: "?", at: at(342, 1.5), tone: "find" });
  return { kind: "drawing", items };
}

export const y7Angles: UnitLesson[] = [
  {
    unit: "y7-angles",
    id: "y7-angles/full-turn",
    before: POINT,
    title: "A full turn",
    summary: "Angles that meet at a point make a full turn: 360°.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The last slice",
        text: [
          "Three friends cut slices from a round pizza. At the centre, their slices make angles of 80°, 115° and 95°.",
          "What angle does the slice that's left make? By the end of this lesson, you can work it out.",
        ],
        picture: pizza([0, 80, 195, 290], ["80°", "115°", "95°", "?"]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $360 - 150$?",
        answers: ["210"],
        hint: "$360 - 100 = 260$, then take 50 more.",
        done: "$360 - 150 = 210$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many right angles make a full turn?",
        answers: ["4"],
        wrong: [{ answer: "2", feedback: "Two right angles make a half turn. Keep going round." }],
        hint: "Turn a quarter at a time until you face the same way again.",
        done: "Four quarter turns make a full turn: $4 \\times 90° = 360°$.",
      },
      {
        kind: "dial",
        tag: "Discover",
        title: "Turn three quarters of the way round",
        text: "Each quarter turn is a right angle, 90°.",
        target: 270,
        within: 5,
        protractor: true,
        hint: "Three right angles: $90 + 90 + 90$.",
        done: "Three quarter turns: 270°. One more brings you all the way round, to 360°.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "All the way round",
        text: [
          "Angles that meet at a point fill a full turn, so they add up to **360°**.",
          "Here, $90° + 110° + 160° = 360°$.",
        ],
        picture: fan([0, 90, 200], ["90°", "110°", "160°"]),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the missing angle",
        picture: fan([0, 120, 230], ["120°", "110°", "x"]),
        problem: "Three angles meet at a point: 120°, 110° and x. Find x.",
        steps: [
          { line: "$120° + 110° = 230°$", why: "Add the angles you know." },
          {
            line: "$x = 360° - 230° = 130°$",
            why: "Angles round a point add to 360°, so x is what's left.",
          },
        ],
        done: "$x = 130°$. Check: $120 + 110 + 130 = 360$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Four angles meet at a point",
        picture: fan([0, 75, 160, 250], ["75°", "85°", "90°", "x"]),
        start: "Find x.",
        stages: [
          {
            prompt: "The four angles add up to",
            options: [
              { text: "360°", correct: true, feedback: "" },
              { text: "180°", feedback: "180° is a straight line. These go all the way round." },
              { text: "90°", feedback: "90° is a quarter turn. These go all the way round." },
            ],
            then: "$75 + 85 + 90 + x = 360$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "110°", correct: true, feedback: "" },
              { text: "250°", feedback: "250° is the three you know, added. Take it from 360°." },
              { text: "−70°", feedback: "That takes 250 from 180. Round a point, use 360." },
            ],
            then: "$x = 360 - 250 = 110°$",
          },
        ],
        done: "Add what you know, and take it from 360°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        picture: fan([0, 140, 250], ["140°", "110°", "x"]),
        answers: ["110"],
        unit: "°",
        wrong: [
          { answer: "250", feedback: "250° is the two you know, added. Take it from 360°." },
          { answer: "-70", feedback: "Round a point is 360°, not 180°." },
        ],
        hint: "Angles round a point add up to 360°.",
        done: "$360 - 140 - 110 = 110°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Three equal angles",
        text: "Three equal angles meet at a point. How big is each one?",
        picture: fan([90, 210, 330], ["x", "x", "x"]),
        answers: ["120"],
        unit: "°",
        wrong: [{ answer: "60", feedback: "60° each makes 180°. Round a point is 360°." }],
        hint: "Share 360° between the three.",
        done: "$360 \\div 3 = 120°$.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ravi finds x, where 150°, 130° and x meet at a point.",
        picture: fan([0, 150, 280], ["150°", "130°", "x"]),
        lines: [
          "$150° + 130° = 280°$",
          "Angles round a point add up to 180°",
          "$x = 180° - 280° = -100°$",
        ],
        wrong: 1,
        why: "Round a point is a full turn: 360°. So $x = 360 - 280 = 80°$. A negative angle was a clue that something went wrong.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The last slice",
        text: "The slices taken make 80°, 115° and 95° at the centre. What angle does the last slice make?",
        picture: pizza([0, 80, 195, 290], ["80°", "115°", "95°", "?"]),
        answers: ["70"],
        unit: "°",
        wrong: [
          { answer: "290", feedback: "290° is the three slices taken. What's left of 360°?" },
        ],
        hint: "The slices meet at the centre, so they add up to 360°.",
        done: "$360 - 80 - 115 - 95 = 70°$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find x.",
            picture: fan([0, 100, 240], ["100°", "140°", "x"]),
            answers: ["120"],
            unit: "°",
            why: "$360 - 100 - 140 = 120°$.",
            retry: {
              prompt: "Find y.",
              picture: fan([0, 95, 260], ["95°", "165°", "y"], "y"),
              answers: ["100"],
              unit: "°",
              why: "$360 - 95 - 165 = 100°$.",
            },
          },
          {
            prompt: "Five equal angles meet at a point. How big is each?",
            answers: ["72"],
            unit: "°",
            why: "$360 \\div 5 = 72°$.",
            retry: {
              prompt: "Six equal angles meet at a point. How big is each?",
              answers: ["60"],
              unit: "°",
              why: "$360 \\div 6 = 60°$.",
            },
          },
          {
            prompt: "Angles of 200° and x meet at a point. What is x?",
            options: ["160°", "20°", "200°"],
            answers: ["160°"],
            why: "$360 - 200 = 160°$.",
            retry: {
              prompt: "Angles of 90°, 90° and x meet at a point. What is x?",
              options: ["180°", "0°", "90°"],
              answers: ["180°"],
              why: "$360 - 90 - 90 = 180°$: a straight line.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-angles",
    id: "y7-angles/half-turn",
    before: LINE,
    title: "A half turn",
    summary: "Angles on a straight line make a half turn: 180°.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How far back?",
        text: [
          "A laptop sits open on a desk. Its screen is at 110° to the keyboard.",
          "What angle does the back of the screen make with the desk? By the end of this lesson, you can work it out.",
        ],
        picture: laptop,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Angles round a point",
        picture: fan([0, 150, 240], ["150°", "90°", "x"]),
        answers: ["120"],
        unit: "°",
        hint: "Angles round a point add up to 360°.",
        done: "$360 - 150 - 90 = 120°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $180 - 65$?",
        answers: ["115"],
        wrong: [
          { answer: "125", feedback: "Count up from 65: 35 more is 100, then 80 more is 180." },
        ],
        hint: "$180 - 60 = 120$, then take 5 more.",
        done: "$180 - 65 = 115$.",
      },
      {
        kind: "dial",
        tag: "Discover",
        title: "Turn half way round",
        text: "Turn the ray until it points the opposite way.",
        target: 180,
        within: 4,
        protractor: true,
        hint: "Two right angles: $90 + 90$.",
        done: "A half turn is 180°, and the two rays make a straight line.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Find x on the straight line",
        picture: fan([0, 130, 180], ["130°", "x"]),
        options: [
          {
            text: "50°",
            correct: true,
            feedback: "Angles on a straight line add up to **180°**: $180 - 130 = 50$.",
          },
          {
            text: "130°",
            feedback: "x is not the same angle: together they make a straight line.",
          },
          { text: "230°", feedback: "On a straight line it is 180°, not 360°." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the missing angle",
        picture: fan([0, 48, 180], ["48°", "x"]),
        problem: "Angles of 48° and x sit on a straight line. Find x.",
        steps: [
          { line: "$x + 48° = 180°$", why: "Angles on a straight line add up to 180°." },
          { line: "$x = 180° - 48° = 132°$", why: "Take away the angle you know." },
        ],
        done: "$x = 132°$. Check: $132 + 48 = 180$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Three angles on a line",
        picture: fan([0, 40, 115, 180], ["40°", "x", "65°"]),
        start: "Find x.",
        stages: [
          {
            prompt: "The three angles add up to",
            options: [
              { text: "180°", correct: true, feedback: "" },
              {
                text: "360°",
                feedback: "360° is all the way round. These sit on a straight line.",
              },
              { text: "90°", feedback: "90° is a right angle. These sit on a straight line." },
            ],
            then: "$40 + x + 65 = 180$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "75°", correct: true, feedback: "" },
              { text: "105°", feedback: "105° is the two you know, added. Take it from 180°." },
              { text: "255°", feedback: "x is part of a straight line, so less than 180°." },
            ],
            then: "$x = 180 - 105 = 75°$",
          },
        ],
        done: "Add what you know, and take it from 180°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        picture: fan([0, 155, 180], ["155°", "x"]),
        answers: ["25"],
        unit: "°",
        wrong: [{ answer: "205", feedback: "Angles on a straight line add up to 180°, not 360°." }],
        hint: "Angles on a straight line add up to 180°.",
        done: "$180 - 155 = 25°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Two equal angles",
        text: "Two equal angles x and an angle of 50° sit on a straight line. Find x.",
        picture: fan([0, 65, 130, 180], ["x", "x", "50°"]),
        answers: ["65"],
        unit: "°",
        wrong: [{ answer: "130", feedback: "130° is both x's together. Share it between them." }],
        hint: "The two x's make $180 - 50 = 130°$ between them.",
        done: "$2x = 130°$, so $x = 65°$.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia finds x, where 35°, 60° and x sit on a straight line.",
        picture: fan([0, 35, 95, 180], ["35°", "60°", "x"]),
        lines: ["$35° + 60° + x = 180°$", "$95° + x = 180°$", "$x = 180° + 95°$", "$x = 275°$"],
        wrong: 2,
        why: "To undo + 95, take 95 away: $x = 180 - 95 = 85°$. An angle on a straight line can't be more than 180°.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Could they make a straight line?",
        text: "Two angles sit side by side. Sort them.",
        groups: ["Straight line", "Not a straight line"],
        items: [
          { text: "120° and 60°", group: 0, why: "$120 + 60 = 180$." },
          { text: "135° and 45°", group: 0, why: "$135 + 45 = 180$." },
          { text: "90° and 90°", group: 0, why: "Two right angles make 180°." },
          { text: "100° and 70°", group: 1, why: "$100 + 70 = 170$, not 180." },
          { text: "145° and 45°", group: 1, why: "$145 + 45 = 190$, not 180." },
          { text: "110° and 80°", group: 1, why: "$110 + 80 = 190$, not 180." },
        ],
        done: "Only pairs that add to exactly 180° make a straight line.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How far back?",
        text: "The screen is at 110° to the keyboard, which lies flat on the desk. What angle does the back of the screen make with the desk?",
        picture: laptop,
        answers: ["70"],
        unit: "°",
        wrong: [
          {
            answer: "250",
            feedback: "The keyboard and desk make a straight line: use 180°, not 360°.",
          },
        ],
        hint: "The 110° and the angle behind the screen sit on the straight line of the desk.",
        done: "$180 - 110 = 70°$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find x.",
            picture: fan([0, 62, 180], ["62°", "x"]),
            answers: ["118"],
            unit: "°",
            why: "$180 - 62 = 118°$.",
            retry: {
              prompt: "Find y.",
              picture: fan([0, 37, 180], ["37°", "y"], "y"),
              answers: ["143"],
              unit: "°",
              why: "$180 - 37 = 143°$.",
            },
          },
          {
            prompt: "Angles of x, x and 40° sit on a straight line. Find x.",
            answers: ["70"],
            unit: "°",
            why: "$2x = 180 - 40 = 140$, so $x = 70°$.",
            retry: {
              prompt: "Three equal angles sit on a straight line. How big is each?",
              answers: ["60"],
              unit: "°",
              why: "$180 \\div 3 = 60°$.",
            },
          },
          {
            prompt: "Can angles of 120° and 70° make a straight line?",
            options: ["No: they add to 190°", "Yes: they add to 180°"],
            answers: ["No: they add to 190°"],
            why: "$120 + 70 = 190$, more than 180.",
            retry: {
              prompt: "Can angles of 125° and 55° make a straight line?",
              options: ["Yes: they add to 180°", "No: they add to 170°"],
              answers: ["Yes: they add to 180°"],
              why: "$125 + 55 = 180$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-angles",
    id: "y7-angles/crossing-lines",
    before: OPPOSITE,
    title: "Crossing lines",
    summary: "Where two straight lines cross, opposite angles are equal.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Open scissors",
        text: [
          "A pair of scissors is open, with its blades at 35° to each other.",
          "What angle do the handles make? And the angle between a blade and a handle? By the end of this lesson, you can work them out.",
        ],
        picture: scissors,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A straight line",
        picture: fan([0, 35, 180], ["35°", "x"]),
        answers: ["145"],
        unit: "°",
        hint: "Angles on a straight line add up to 180°.",
        done: "$180 - 35 = 145°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round a point",
        picture: fan([0, 100, 220], ["100°", "120°", "x"]),
        answers: ["140"],
        unit: "°",
        hint: "Angles round a point add up to 360°.",
        done: "$360 - 100 - 120 = 140°$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two lines cross",
        text: [
          "Two straight lines cross and make four angles: a, b, c and d.",
          "a and c are across from each other. So are b and d. They are called **vertically opposite** angles.",
        ],
        picture: cross(35, ["a", "b", "c", "d"], ""),
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "Why are opposite angles equal?",
        picture: cross(35, ["a", "70°", "c", null], ""),
        start: "b is 70°.",
        stages: [
          {
            prompt: "a and b sit on a straight line. So a is",
            options: [
              { text: "110°", correct: true, feedback: "" },
              { text: "70°", feedback: "a and b make a straight line together: $a + 70 = 180$." },
              { text: "290°", feedback: "On a straight line it's 180°, not 360°." },
            ],
            then: "$a = 180 - 70 = 110°$",
          },
          {
            prompt: "b and c sit on a straight line too. So c is",
            options: [
              { text: "110°", correct: true, feedback: "" },
              { text: "70°", feedback: "b and c make a straight line together: $70 + c = 180$." },
            ],
            then: "$c = 180 - 70 = 110°$",
          },
        ],
        done: "a and c are both $180° - b$, so they are always equal. **Vertically opposite angles are equal.**",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find all three",
        picture: cross(20, ["140°", "x", "y", "z"], ""),
        problem: "Two straight lines cross. One angle is 140°. Find x, y and z.",
        steps: [
          { line: "$y = 140°$", why: "y is vertically opposite the 140°, so they are equal." },
          { line: "$x = 180° - 140° = 40°$", why: "x and the 140° sit on a straight line." },
          { line: "$z = 40°$", why: "z is vertically opposite x." },
        ],
        done: "Check: $140 + 40 + 140 + 40 = 360$ ✓, a full turn.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find a and b",
        picture: cross(50, ["80°", "a", "b", null], ""),
        start: "Two straight lines cross. One angle is 80°.",
        stages: [
          {
            prompt: "b is opposite the 80°. So b is",
            options: [
              { text: "80°", correct: true, feedback: "" },
              { text: "100°", feedback: "Opposite angles are equal." },
              { text: "280°", feedback: "Opposite angles are equal." },
            ],
            then: "$b = 80°$",
          },
          {
            prompt: "a is next to the 80°, on a straight line. So a is",
            options: [
              { text: "100°", correct: true, feedback: "" },
              { text: "80°", feedback: "a is next to the 80°, not opposite it." },
            ],
            then: "$a = 180 - 80 = 100°$",
          },
        ],
        done: "Opposite: equal. Next to each other: add to 180°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find y",
        picture: cross(30, ["120°", "y", null, null], "y"),
        answers: ["60"],
        unit: "°",
        wrong: [{ answer: "120", feedback: "y is next to the 120°, not opposite it." }],
        hint: "y and the 120° sit together on a straight line.",
        done: "$180 - 120 = 60°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "With a letter",
        text: "Two straight lines cross. Opposite angles are $2x$ and $80°$. Find x.",
        picture: cross(50, ["80°", null, "2x", null], "2x"),
        answers: ["40"],
        unit: "°",
        wrong: [{ answer: "80", feedback: "80° is $2x$. What is x?" }],
        hint: "Opposite angles are equal, so $2x = 80$.",
        done: "$2x = 80$, so $x = 40°$.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Two straight lines cross. One angle is 65°. Leo finds the other three.",
        picture: cross(57.5, ["65°", null, null, null], ""),
        lines: [
          "The angle next to 65° is $180° - 65° = 115°$.",
          "The angle opposite 65° is $180° - 65° = 115°$ as well.",
          "So the four angles add to $65 + 115 + 115 + 115 = 410°$.",
        ],
        wrong: 1,
        why: "Opposite angles are equal: the one opposite 65° is 65°. Then the four add to 360°, as they must round a point. 410° was a clue.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Open scissors",
        text: "The blades are at 35° to each other.",
        picture: scissors,
        start: "The blades and handles are two straight lines crossing at the pivot.",
        stages: [
          {
            prompt: "The handles are opposite the blades. They make",
            options: [
              { text: "35°", correct: true, feedback: "" },
              {
                text: "145°",
                feedback: "The handles are across from the blades: opposite angles are equal.",
              },
              {
                text: "325°",
                feedback: "The handles are across from the blades: opposite angles are equal.",
              },
            ],
            then: "The handles make 35°.",
          },
          {
            prompt: "A blade and the handle next to it make",
            options: [
              { text: "145°", correct: true, feedback: "" },
              { text: "35°", feedback: "They're next to each other, so they add to 180°." },
            ],
            then: "$180 - 35 = 145°$",
          },
        ],
        done: "Open the blades wider, and the handles open by just as much.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Two straight lines cross. Find x.",
            picture: cross(35, ["110°", null, "x", null]),
            answers: ["110"],
            unit: "°",
            why: "x is vertically opposite the 110°.",
            retry: {
              prompt: "Two straight lines cross. Find y.",
              picture: cross(25, ["130°", null, "y", null], "y"),
              answers: ["130"],
              unit: "°",
              why: "y is vertically opposite the 130°.",
            },
          },
          {
            prompt: "Two straight lines cross. Find x.",
            picture: cross(40, ["100°", "x", null, null]),
            answers: ["80"],
            unit: "°",
            why: "x is next to the 100°, on a straight line: $180 - 100 = 80°$.",
            retry: {
              prompt: "Two straight lines cross. Find y.",
              picture: cross(55, ["70°", "y", null, null], "y"),
              answers: ["110"],
              unit: "°",
              why: "y is next to the 70°, on a straight line: $180 - 70 = 110°$.",
            },
          },
          {
            prompt: "Two straight lines cross. Which angles are always equal?",
            options: ["Vertically opposite angles", "Angles next to each other", "All four angles"],
            answers: ["Vertically opposite angles"],
            why: "Opposite angles are equal; angles next to each other add to 180°.",
            retry: {
              prompt: "Two straight lines cross. One angle is 90°. What are the other three?",
              options: ["90°, 90° and 90°", "90°, 270° and 90°", "45°, 90° and 45°"],
              answers: ["90°, 90° and 90°"],
              why: "The opposite one is 90°, and the two next to it are $180 - 90 = 90°$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-angles",
    id: "y7-angles/triangle",
    before: TRIANGLE,
    title: "Inside a triangle",
    summary: "The angles in any triangle add up to 180°.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The top of the roof",
        text: [
          "A roof's two sloping sides each meet the flat beam at 35°.",
          "What angle do they make at the top? By the end of this lesson, you can work it out.",
        ],
        picture: roof,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A straight line",
        picture: fan([0, 72, 180], ["72°", "x"]),
        answers: ["108"],
        unit: "°",
        hint: "Angles on a straight line add up to 180°.",
        done: "$180 - 72 = 108°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $180 - 50 - 70$?",
        answers: ["60"],
        wrong: [{ answer: "200", feedback: "Take away both: $180 - 50 = 130$, then $130 - 70$." }],
        hint: "$180 - 50 = 130$ first.",
        done: "$180 - 50 - 70 = 60$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Tear off the corners",
        text: "A paper triangle has angles of 50°, 60° and 70°. Tear off the corners and put them side by side. What do they make?",
        picture: fan([0, 50, 110, 180], ["50°", "60°", "70°"]),
        options: [
          {
            text: "A straight line: 180°",
            correct: true,
            feedback:
              "$50 + 60 + 70 = 180$. It happens with every triangle: the angles in a triangle add up to **180°**.",
          },
          {
            text: "A full turn: 360°",
            feedback: "Look at the picture: the corners only reach half way round.",
          },
          {
            text: "A right angle: 90°",
            feedback: "Look at the picture: they go past a right angle.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the missing angle",
        picture: triangle(48, 67, ["48°", "67°", "x"]),
        problem: "A triangle has angles of 48°, 67° and x. Find x.",
        steps: [
          { line: "$48° + 67° = 115°$", why: "Add the angles you know." },
          { line: "$x = 180° - 115° = 65°$", why: "The angles in a triangle add up to 180°." },
        ],
        done: "$x = 65°$. Check: $48 + 67 + 65 = 180$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A right-angled triangle",
        picture: rightAngled(34, ["34°", null, "x"]),
        start: "Find x.",
        stages: [
          {
            prompt: "The square in the corner means that angle is",
            options: [
              { text: "90°", correct: true, feedback: "" },
              { text: "180°", feedback: "The square marks a right angle." },
              { text: "45°", feedback: "The square marks a right angle." },
            ],
            then: "$34 + 90 + x = 180$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "56°", correct: true, feedback: "" },
              { text: "146°", feedback: "Take away the right angle as well as the 34°." },
              { text: "236°", feedback: "x is inside a triangle, so less than 180°." },
            ],
            then: "$x = 180 - 124 = 56°$",
          },
        ],
        done: "In a right-angled triangle, the other two angles add up to 90°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        picture: triangle(72, 59, ["72°", "59°", "x"]),
        answers: ["49"],
        unit: "°",
        wrong: [{ answer: "131", feedback: "131° is the two you know, added. Take it from 180°." }],
        hint: "The three angles add up to 180°.",
        done: "$180 - 72 - 59 = 49°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "An isosceles triangle",
        text: "An isosceles triangle has two equal angles at its base. The angle at the top is 40°. Find a base angle.",
        picture: triangle(70, 70, ["x", "x", "40°"]),
        answers: ["70"],
        unit: "°",
        wrong: [{ answer: "140", feedback: "140° is both base angles. Share it between the two." }],
        hint: "The two base angles share $180 - 40 = 140°$.",
        done: "$140 \\div 2 = 70°$.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "An isosceles triangle has 50° at the top. Kai finds the base angles.",
        picture: triangle(65, 65, ["?", "?", "50°"]),
        lines: [
          "The triangle is isosceles, so two of its angles are equal.",
          "So the base angles are both 50°, the same as the top.",
          "$50° + 50° + 50° = 150°$",
        ],
        wrong: 1,
        why: "The equal angles are the two at the base. They share $180 - 50 = 130°$, so each is 65°. And 150° was a clue: a triangle's angles make 180°.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Could they be a triangle's angles?",
        groups: ["Yes", "No"],
        items: [
          { text: "60°, 60°, 60°", group: 0, why: "$60 + 60 + 60 = 180$." },
          { text: "90°, 45°, 45°", group: 0, why: "$90 + 45 + 45 = 180$." },
          { text: "100°, 50°, 30°", group: 0, why: "$100 + 50 + 30 = 180$." },
          { text: "90°, 90°, 10°", group: 1, why: "$90 + 90 + 10 = 190$." },
          { text: "120°, 40°, 30°", group: 1, why: "$120 + 40 + 30 = 190$." },
          { text: "80°, 70°, 20°", group: 1, why: "$80 + 70 + 20 = 170$." },
        ],
        done: "A triangle's three angles always add to exactly 180°.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The top of the roof",
        text: "Each slope meets the beam at 35°. What angle do the slopes make at the top?",
        picture: roof,
        answers: ["110"],
        unit: "°",
        wrong: [{ answer: "145", feedback: "Take away both 35° angles." }],
        hint: "The roof and the beam make a triangle.",
        done: "$180 - 35 - 35 = 110°$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find x.",
            picture: triangle(55, 75, ["55°", "75°", "x"]),
            answers: ["50"],
            unit: "°",
            why: "$180 - 55 - 75 = 50°$.",
            retry: {
              prompt: "Find y.",
              picture: triangle(38, 94, ["38°", "94°", "y"]),
              answers: ["48"],
              unit: "°",
              why: "$180 - 38 - 94 = 48°$.",
            },
          },
          {
            prompt: "A right-angled triangle has an angle of 27°. Find the third angle.",
            picture: rightAngled(27, ["27°", null, "x"]),
            answers: ["63"],
            unit: "°",
            why: "$180 - 90 - 27 = 63°$.",
            retry: {
              prompt: "A right-angled triangle has an angle of 52°. Find the third angle.",
              picture: rightAngled(52, ["52°", null, "y"]),
              answers: ["38"],
              unit: "°",
              why: "$180 - 90 - 52 = 38°$.",
            },
          },
          {
            prompt: "An isosceles triangle has 30° at the top. Find a base angle.",
            answers: ["75"],
            unit: "°",
            why: "The base angles share $180 - 30 = 150°$: $75°$ each.",
            retry: {
              prompt: "An isosceles triangle has 80° at the top. Find a base angle.",
              answers: ["50"],
              unit: "°",
              why: "The base angles share $180 - 80 = 100°$: $50°$ each.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-angles",
    id: "y7-angles/polygons",
    before: POLYGON,
    title: "Any polygon",
    summary: "Split a polygon into triangles to find its angle sum.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The garden corner",
        text: [
          "A garden is a five-sided shape. A fence post at each corner is set at 100°, 120°, 110° and 95°.",
          "What angle is the last corner? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "shape", points: garden, angles: ["100°", "120°", "110°", "95°", "?"] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A triangle",
        picture: triangle(70, 45, ["70°", "45°", "x"]),
        answers: ["65"],
        unit: "°",
        hint: "The angles in a triangle add up to 180°.",
        done: "$180 - 70 - 45 = 65°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times 180$?",
        answers: ["540"],
        hint: "$3 \\times 100 = 300$ and $3 \\times 80 = 240$.",
        done: "$300 + 240 = 540$.",
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "The angles in a quadrilateral",
        picture: split(quad),
        start: "Draw a diagonal across a quadrilateral.",
        stages: [
          {
            prompt: "How many triangles does it make?",
            options: [
              { text: "2", correct: true, feedback: "" },
              {
                text: "4",
                feedback: "Count the triangles in the picture: one diagonal makes two.",
              },
            ],
            then: "Two triangles.",
          },
          {
            prompt: "So a quadrilateral's angles add up to",
            options: [
              { text: "360°", correct: true, feedback: "" },
              { text: "180°", feedback: "That's one triangle. There are two." },
              { text: "720°", feedback: "There are two triangles, not four." },
            ],
            then: "$2 \\times 180° = 360°$",
          },
        ],
        done: "The angles of the triangles make up the angles of the quadrilateral.",
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "The angles in a pentagon",
        picture: split(pentagon),
        start: "A pentagon has 5 sides.",
        stages: [
          {
            prompt: "The diagonals from one corner split it into how many triangles?",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "5", feedback: "Count the triangles in the picture." },
              { text: "2", feedback: "Count again: there are three." },
            ],
            then: "It splits into 3 triangles.",
          },
          {
            prompt: "So the pentagon's angles add up to",
            options: [
              { text: "540°", correct: true, feedback: "" },
              { text: "900°", feedback: "There are 3 triangles, not 5." },
              { text: "360°", feedback: "That is a quadrilateral, with 2 triangles." },
            ],
            then: "$3 \\times 180° = 540°$",
          },
        ],
        done: "Each time, there are 2 fewer triangles than sides.",
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Spot the pattern",
        picture: {
          kind: "table",
          head: ["Sides", "Triangles", "Angle sum"],
          rows: [
            ["3", "1", "180°"],
            ["4", "2", "360°"],
            ["5", "3", "540°"],
          ],
        },
        template: "A hexagon's angles add to [] and a decagon's (10 sides) to []",
        bank: ["720°", "900°", "1080°", "1440°", "1800°"],
        answers: ["720°", "1440°"],
        hint: "Each extra side adds one more triangle: sides − 2 triangles.",
        done: "A polygon with n sides makes $n - 2$ triangles, so its angles add to $(n - 2) \\times 180°$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The angles in an octagon",
        picture: split(octagon),
        problem: "Find the angle sum of an octagon, a polygon with 8 sides.",
        steps: [
          {
            line: "$8 - 2 = 6$ triangles",
            why: "The diagonals from one corner make 2 fewer triangles than sides.",
          },
          { line: "$6 \\times 180° = 1080°$", why: "Each triangle's angles add to 180°." },
        ],
        done: "An octagon's angles add up to 1080°.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A missing angle in a quadrilateral",
        picture: { kind: "shape", points: quad, angles: ["75°", "110°", "90°", "x"] },
        start: "Find x.",
        stages: [
          {
            prompt: "A quadrilateral's angles add up to",
            options: [
              { text: "360°", correct: true, feedback: "" },
              { text: "180°", feedback: "180° is a triangle. A quadrilateral makes two." },
              {
                text: "540°",
                feedback: "540° is a pentagon. A quadrilateral makes two triangles.",
              },
            ],
            then: "$75 + 110 + 90 + x = 360$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "85°", correct: true, feedback: "" },
              { text: "275°", feedback: "275° is the three you know, added. Take it from 360°." },
              { text: "−95°", feedback: "That takes 275 from 180. Use the quadrilateral's 360°." },
            ],
            then: "$x = 360 - 275 = 85°$",
          },
        ],
        done: "Find the angle sum first, then take away the angles you know.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Seven sides",
        text: "Find the angle sum of a heptagon, a polygon with 7 sides.",
        answers: ["900"],
        unit: "°",
        wrong: [
          { answer: "1260", feedback: "That uses 7 triangles. There are $7 - 2 = 5$." },
          { answer: "1080", feedback: "That uses 6 triangles. There are $7 - 2 = 5$." },
        ],
        hint: "$7 - 2 = 5$ triangles.",
        done: "$5 \\times 180° = 900°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A missing angle in a pentagon",
        picture: { kind: "shape", points: pentagon, angles: ["120°", "95°", "105°", "110°", "x"] },
        answers: ["110"],
        unit: "°",
        wrong: [
          { answer: "430", feedback: "430° is the four you know, added. Take it from 540°." },
        ],
        hint: "A pentagon's angles add up to 540°.",
        done: "$540 - 120 - 95 - 105 - 110 = 110°$.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zara finds the angle sum of a hexagon.",
        picture: split(hexagon),
        lines: [
          "A hexagon has 6 sides.",
          "So it splits into 6 triangles.",
          "$6 \\times 180° = 1080°$",
        ],
        wrong: 1,
        why: "The diagonals from one corner make $6 - 2 = 4$ triangles. Count them in the picture. So the angles add to $4 \\times 180° = 720°$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The garden corner",
        text: "Four corners of the five-sided garden are 100°, 120°, 110° and 95°. What is the last corner?",
        picture: { kind: "shape", points: garden, angles: ["100°", "120°", "110°", "95°", "?"] },
        answers: ["115"],
        unit: "°",
        wrong: [{ answer: "-65", feedback: "Five sides make 3 triangles: use 540°, not 360°." }],
        hint: "A pentagon's angles add up to $3 \\times 180 = 540°$.",
        done: "$540 - 100 - 120 - 110 - 95 = 115°$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find the angle sum of a pentagon.",
            answers: ["540"],
            unit: "°",
            why: "$(5 - 2) \\times 180 = 540°$.",
            retry: {
              prompt: "Find the angle sum of a polygon with 9 sides.",
              answers: ["1260"],
              unit: "°",
              why: "$(9 - 2) \\times 180 = 1260°$.",
            },
          },
          {
            prompt: "Find x.",
            picture: { kind: "shape", points: quad, angles: ["85°", "100°", "95°", "x"] },
            answers: ["80"],
            unit: "°",
            why: "$360 - 85 - 100 - 95 = 80°$.",
            retry: {
              prompt: "Find y.",
              picture: { kind: "shape", points: quad, angles: ["60°", "120°", "70°", "y"] },
              answers: ["110"],
              unit: "°",
              why: "$360 - 60 - 120 - 70 = 110°$.",
            },
          },
          {
            prompt:
              "The diagonals from one corner split a polygon with n sides into how many triangles?",
            options: ["$n - 2$", "$n$", "$n - 1$"],
            answers: ["$n - 2$"],
            why: "Two fewer than the sides: 4 sides make 2, 5 make 3.",
            retry: {
              prompt:
                "The diagonals from one corner split a 12-sided polygon into how many triangles?",
              options: ["10", "12", "11"],
              answers: ["10"],
              why: "$12 - 2 = 10$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-angles",
    id: "y7-angles/regular",
    before: REGULAR,
    title: "Regular polygons",
    summary: "Find the angles of a regular polygon, inside and out.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Tiling a floor",
        text: [
          "Regular hexagon tiles fit together with no gaps. Regular pentagons don't: put three together at a corner, and a gap is left.",
          "How big is the gap? By the end of this lesson, you can work it out.",
        ],
        picture: pentagons([0, 108, 216]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Angle sum of a hexagon",
        text: "A hexagon has 6 sides. What do its angles add up to?",
        answers: ["720"],
        unit: "°",
        wrong: [{ answer: "1080", feedback: "A hexagon makes $6 - 2 = 4$ triangles, not 6." }],
        hint: "$(6 - 2) \\times 180°$.",
        done: "$4 \\times 180° = 720°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $360 \\div 8$?",
        answers: ["45"],
        hint: "Half of 360 is 180, half again is 90, and half again is…",
        done: "$360 \\div 8 = 45$.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "One angle of a regular hexagon",
        text: "A regular hexagon's six angles are all equal, and add up to 720°.",
        picture: { kind: "shape", points: hexagon, angles: ["?", null, null, null, null, null] },
        answers: ["120"],
        unit: "°",
        wrong: [
          { answer: "720", feedback: "720° is all six together. Share it between the 6 angles." },
        ],
        hint: "Share the total between the 6 equal angles.",
        done: "$720 \\div 6 = 120°$. That is the **interior angle**.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Walk round the outside",
        text: [
          "Walk round any polygon. At each corner you turn through the **exterior angle**.",
          "One lap is a full turn, so the exterior angles of any polygon add up to 360°. Inside and outside sit on a straight line, so interior + exterior = 180° at each corner.",
        ],
        picture: {
          kind: "shape",
          points: hexagon,
          dashed: [[hexagon[0] ?? { x: 0, y: 0 }, { x: 1.56, y: 3.9 }]],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Two ways to the same angle",
        text: "A regular hexagon's six exterior angles share 360°: $360 \\div 6 = 60°$ each. So its interior angle is",
        options: [
          {
            text: "120°",
            correct: true,
            feedback: "$180 - 60 = 120°$: the same as sharing out 720°.",
          },
          {
            text: "60°",
            feedback: "60° is the exterior angle. Interior and exterior add to 180°.",
          },
          {
            text: "300°",
            feedback: "Interior and exterior sit on a straight line: 180°, not 360°.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A regular octagon",
        picture: {
          kind: "shape",
          points: octagon,
          angles: ["?", null, null, null, null, null, null, null],
        },
        problem: "Find the exterior and interior angles of a regular octagon, with 8 sides.",
        steps: [
          {
            line: "Exterior: $360° \\div 8 = 45°$",
            why: "The 8 equal exterior angles share a full turn.",
          },
          {
            line: "Interior: $180° - 45° = 135°$",
            why: "Interior and exterior sit on a straight line.",
          },
        ],
        done: "Check: $8 \\times 135 = 1080 = (8 - 2) \\times 180$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A regular decagon",
        start: "A regular decagon has 10 equal sides and angles.",
        stages: [
          {
            prompt: "Its exterior angle is",
            options: [
              { text: "36°", correct: true, feedback: "" },
              {
                text: "18°",
                feedback: "Share 360°, not 180°: the exterior angles make a full turn.",
              },
              {
                text: "144°",
                feedback: "That's the interior angle. Start with the exterior: share 360°.",
              },
            ],
            then: "$360 \\div 10 = 36°$",
          },
          {
            prompt: "So its interior angle is",
            options: [
              { text: "144°", correct: true, feedback: "" },
              { text: "324°", feedback: "Interior and exterior add to 180°, not 360°." },
            ],
            then: "$180 - 36 = 144°$",
          },
        ],
        done: "Exterior first: $360 \\div n$. Then interior: 180 − exterior.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A regular pentagon",
        text: "Find the interior angle of a regular pentagon.",
        picture: { kind: "shape", points: pentagon, angles: ["?", null, null, null, null] },
        answers: ["108"],
        unit: "°",
        wrong: [{ answer: "72", feedback: "72° is the exterior angle. Take it from 180°." }],
        hint: "Exterior: $360 \\div 5$. Then take it from 180°.",
        done: "Exterior $360 \\div 5 = 72°$, so interior $180 - 72 = 108°$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many sides?",
        text: "A regular polygon has exterior angles of 30°. How many sides does it have?",
        answers: ["12"],
        wrong: [{ answer: "6", feedback: "Six 30° turns make 180°, only half a lap." }],
        hint: "How many 30° turns make a full turn of 360°?",
        done: "$360 \\div 30 = 12$ sides.",
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sam finds the exterior angle of a regular hexagon.",
        lines: [
          "A regular hexagon's angles add up to 720°.",
          "So each interior angle is $720° \\div 6 = 120°$.",
          "The exterior angle is $360° - 120° = 240°$.",
        ],
        wrong: 2,
        why: "Interior and exterior sit on a straight line: $180 - 120 = 60°$. Check: six 60° turns make 360° ✓",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Will the tiles fit?",
        text: "Regular tiles meet at a corner. Do they fill the 360° round it exactly?",
        groups: ["No gaps", "Gaps"],
        items: [
          { text: "Equilateral triangles", group: 0, why: "Six 60° angles make 360°." },
          { text: "Squares", group: 0, why: "Four 90° angles make 360°." },
          { text: "Regular hexagons", group: 0, why: "Three 120° angles make 360°." },
          { text: "Regular pentagons", group: 1, why: "108° doesn't go into 360° exactly." },
          { text: "Regular octagons", group: 1, why: "135° doesn't go into 360° exactly." },
        ],
        done: "A regular shape tiles only if its interior angle goes into 360° exactly.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Tiling a floor",
        text: "Three regular pentagons meet at a corner. How big is the gap left?",
        picture: pentagons([0, 108, 216]),
        answers: ["36"],
        unit: "°",
        wrong: [
          { answer: "324", feedback: "324° is the three pentagons' angles. What's left of 360°?" },
        ],
        hint: "A regular pentagon's interior angle is 108°. What do three of them leave of 360°?",
        done: "$3 \\times 108 = 324$, leaving $360 - 324 = 36°$. A hexagon's 120° fits three times exactly.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find the exterior angle of a regular polygon with 9 sides.",
            answers: ["40"],
            unit: "°",
            why: "$360 \\div 9 = 40°$.",
            retry: {
              prompt: "Find the exterior angle of a regular polygon with 12 sides.",
              answers: ["30"],
              unit: "°",
              why: "$360 \\div 12 = 30°$.",
            },
          },
          {
            prompt: "Find the interior angle of a regular polygon with 12 sides.",
            answers: ["150"],
            unit: "°",
            why: "Exterior $360 \\div 12 = 30°$, so interior $180 - 30 = 150°$.",
            retry: {
              prompt: "Find the interior angle of a regular polygon with 9 sides.",
              answers: ["140"],
              unit: "°",
              why: "Exterior $360 \\div 9 = 40°$, so interior $180 - 40 = 140°$.",
            },
          },
          {
            prompt: "A regular polygon has exterior angles of 20°. How many sides does it have?",
            answers: ["18"],
            why: "$360 \\div 20 = 18$.",
            retry: {
              prompt: "A regular polygon has exterior angles of 24°. How many sides does it have?",
              answers: ["15"],
              why: "$360 \\div 24 = 15$.",
            },
          },
        ],
      },
    ],
  },
];
