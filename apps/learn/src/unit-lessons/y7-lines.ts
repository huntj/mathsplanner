// Year 7, "Lines, symmetry and measuring", as four short lessons, one just before each skill:
// the words and notation for lines and angles, mirror lines and rotational symmetry, measuring
// lines and angles, and scale drawings and maps. Each starts from something quick, builds the
// idea a step at a time, names the common mistakes, and ends on an exit check.
import { regular, through } from "./geometry.ts";
import type { ShapePic, UnitLesson } from "./types.ts";

const WORDS = "Y7-GEO-04.a";
const SYMMETRY = "Y7-GEO-04.b";
const MEASURE = "Y7-GEO-03.a";
const SCALE = "Y7-GEO-03.b";

const hexagon = regular(6, 3, 90);
const rect: ShapePic["points"] = [
  { x: -2.5, y: 1.5 },
  { x: 2.5, y: 1.5 },
  { x: 2.5, y: -1.5 },
  { x: -2.5, y: -1.5 },
];
const abcd: ShapePic = {
  kind: "shape",
  points: [
    { x: 0, y: 3 },
    { x: 5, y: 3 },
    { x: 5, y: 0 },
    { x: 0, y: 0 },
  ],
  names: ["A", "B", "C", "D"],
  square: [0, 1, 2, 3],
};

export const y7Lines: UnitLesson[] = [
  {
    unit: "y7-lines",
    id: "y7-lines/words",
    before: WORDS,
    title: "Talking about lines and angles",
    summary: "Name angles by size and by letters, and lines as parallel or perpendicular.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Reading a plan",
        text: [
          "A builder's plan says: '∠ABC is a right angle, AB is parallel to DC, and the roof angle is obtuse.'",
          "What does that mean? By the end of this lesson, you can read the language of shapes.",
        ],
        picture: abcd,
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A right angle is",
        options: [
          { text: "a quarter turn: 90°", correct: true, feedback: "Like the corner of a book." },
          { text: "a half turn: 180°", feedback: "A half turn is a straight line." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A full turn is",
        options: [
          { text: "360°", correct: true, feedback: "All the way round." },
          { text: "100°", feedback: "Degrees aren't out of 100: a full turn is 360°." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Angles by size",
        text: [
          "**Acute**: less than 90°. **Right**: exactly 90°. **Obtuse**: between 90° and 180°. **Reflex**: between 180° and 360°.",
          "Compare with a right angle first: smaller is acute; bigger, but less than a straight line, is obtuse.",
        ],
        picture: {
          kind: "angles",
          rays: [0, 50, 140],
          arcs: [
            { from: 0, to: 1, label: "acute" },
            { from: 1, to: 2, label: "obtuse" },
          ],
        },
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "Acute, obtuse or reflex?",
        groups: ["Acute", "Obtuse", "Reflex"],
        items: [
          { text: "45°", group: 0, why: "Less than 90°." },
          { text: "89°", group: 0, why: "Just under 90°." },
          { text: "120°", group: 1, why: "Between 90° and 180°." },
          { text: "175°", group: 1, why: "Just under a straight line." },
          { text: "200°", group: 2, why: "More than 180°." },
          { text: "300°", group: 2, why: "More than 180°." },
        ],
        done: "Compare with 90° and 180°.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Names with letters",
        text: [
          "Corners get capital letters. The side from A to B is **AB**. The angle at B, between BA and BC, is **∠ABC**: the middle letter is the corner.",
          "**Parallel** lines never meet. **Perpendicular** lines meet at a right angle.",
        ],
        picture: abcd,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Reading a rectangle",
        picture: abcd,
        problem: "In rectangle ABCD, describe AB and DC, AB and BC, and ∠BCD.",
        steps: [
          { line: "AB and DC are parallel", why: "Opposite sides of a rectangle never meet." },
          { line: "AB and BC are perpendicular", why: "They meet at a right angle at B." },
          { line: "∠BCD is the right angle at C", why: "The middle letter, C, is the corner." },
        ],
        done: "Letters let us point to exactly the line or angle we mean.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which angle is ∠ABC?",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 4, y: 3 },
            { x: 7, y: 0 },
          ],
          names: ["A", "B", "C"],
          angles: [null, "?", null],
        },
        start: "Look at the middle letter.",
        stages: [
          {
            prompt: "∠ABC is the angle at",
            options: [
              { text: "B", correct: true, feedback: "" },
              { text: "A", feedback: "The middle letter is the corner." },
            ],
            then: "At B",
          },
          {
            prompt: "It looks",
            options: [
              { text: "obtuse: more than 90°", correct: true, feedback: "" },
              { text: "acute", feedback: "It's wider than a right angle." },
            ],
            then: "An obtuse angle at B",
          },
        ],
        done: "Middle letter, then size.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Parallel or perpendicular?",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
          lines: [
            { m: 1, c: 0 },
            { m: 1, c: 3 },
            { m: -1, c: 5 },
          ],
        },
        start: "Three lines.",
        stages: [
          {
            prompt: "The two going up at the same slope are",
            options: [
              { text: "parallel", correct: true, feedback: "" },
              { text: "perpendicular", feedback: "They never meet: parallel." },
            ],
            then: "Parallel",
          },
          {
            prompt: "The one going down crosses them at",
            options: [
              { text: "right angles: perpendicular", correct: true, feedback: "" },
              { text: "nowhere", feedback: "It crosses both lines." },
            ],
            then: "Perpendicular",
          },
        ],
        done: "Never meet: parallel. Meet at 90°: perpendicular.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "In rectangle ABCD, which side is parallel to AD?",
        picture: abcd,
        options: [
          { text: "BC", correct: true, feedback: "Opposite sides." },
          { text: "AB", feedback: "AB meets AD at a right angle: perpendicular." },
          { text: "DC", feedback: "DC meets AD at D: perpendicular." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "An angle of 210° is",
        options: [
          { text: "reflex", correct: true, feedback: "More than 180°." },
          { text: "obtuse", feedback: "Obtuse stops at 180°." },
          { text: "acute", feedback: "Acute is less than 90°." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Mo says ∠PQR is the angle at P. Is he right?",
        options: [
          {
            text: "No: it's the angle at Q, the middle letter",
            correct: true,
            feedback:
              "The first and last letters are the ends of the arms; the middle letter is the corner.",
          },
          { text: "Yes", feedback: "The angle is always at the middle letter." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Isla sorts three angles.",
        lines: ["30° is acute", "100° is obtuse", "190° is obtuse too"],
        wrong: 2,
        why: "Obtuse angles stop at 180°. 190° is **reflex**.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Reading a plan",
        text: "'∠ABC is a right angle, and AB is parallel to DC.'",
        picture: abcd,
        options: [
          {
            text: "The corner at B is 90°, and AB and DC never meet",
            correct: true,
            feedback: "Now you can read the builder's language.",
          },
          {
            text: "The corner at A is 90°, and AB meets DC",
            feedback: "∠ABC is at B, and parallel lines never meet.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "An angle of 95° is",
            options: ["obtuse", "acute", "reflex"],
            answers: ["obtuse"],
            why: "Between 90° and 180°.",
            retry: {
              prompt: "An angle of 75° is",
              options: ["acute", "obtuse", "reflex"],
              answers: ["acute"],
              why: "Less than 90°.",
            },
          },
          {
            prompt: "∠XYZ is the angle at",
            options: ["Y", "X", "Z"],
            answers: ["Y"],
            why: "The middle letter.",
            retry: {
              prompt: "∠DEF is the angle at",
              options: ["E", "D", "F"],
              answers: ["E"],
              why: "The middle letter.",
            },
          },
          {
            prompt: "Lines that meet at a right angle are",
            options: ["perpendicular", "parallel"],
            answers: ["perpendicular"],
            why: "Perpendicular: at 90°.",
            retry: {
              prompt: "Lines that never meet are",
              options: ["parallel", "perpendicular"],
              answers: ["parallel"],
              why: "Parallel: always the same distance apart.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-lines",
    id: "y7-lines/symmetry",
    before: SYMMETRY,
    title: "Symmetry",
    summary:
      "Mirror lines fold a shape onto itself; rotational symmetry counts how often it fits in a turn.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Designing a logo",
        text: [
          "A company wants a logo that looks the same from lots of directions, in a regular hexagon.",
          "How many mirror lines does it have, and how many times does it fit on itself as it turns? By the end of this lesson, you can count both.",
        ],
        picture: { kind: "shape", points: hexagon },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Fold a square in half, corner to corner. Do the halves match?",
        options: [
          { text: "Yes", correct: true, feedback: "The diagonal of a square is a mirror line." },
          { text: "No", feedback: "Try it with a square of paper: the corners meet." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many degrees in a full turn?",
        answers: ["360"],
        unit: "°",
        hint: "All the way round.",
        done: "360°.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Mirror lines",
        text: [
          "A **line of symmetry** (mirror line) folds a shape so the two halves match exactly.",
          "A square has 4: two across the middle, and both diagonals.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: -2, y: 2 },
            { x: 2, y: 2 },
            { x: 2, y: -2 },
            { x: -2, y: -2 },
          ],
          mirrors: [through(0, 2.8), through(90, 2.8), through(45, 3.4), through(135, 3.4)],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How many lines of symmetry does a rectangle have?",
        picture: { kind: "shape", points: rect },
        revealPicture: {
          kind: "shape",
          points: rect,
          mirrors: [through(0, 3.2), through(90, 2.2)],
        },
        options: [
          {
            text: "2",
            correct: true,
            feedback:
              "Across the middle each way. Fold along a diagonal and the corners don't meet.",
          },
          {
            text: "4",
            feedback:
              "The diagonals aren't mirror lines: fold a rectangle along one and the corners miss.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Rotational symmetry",
        text: "Turn an equilateral triangle about its centre. How many times does it look the same in one full turn?",
        picture: { kind: "shape", points: regular(3, 3, 90), dots: [{ x: 0, y: 0 }] },
        options: [
          {
            text: "3",
            correct: true,
            feedback: "Every 120° it fits on itself: its **order** of rotational symmetry is 3.",
          },
          { text: "1", feedback: "It fits after a full turn, but also sooner: every 120°." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A square",
        problem: "Find a square's lines of symmetry and its order of rotational symmetry.",
        steps: [
          { line: "Lines of symmetry: 4", why: "Two across the middle, two diagonals." },
          {
            line: "Order of rotational symmetry: 4",
            why: "It fits on itself every quarter turn: 4 times in a full turn.",
          },
        ],
        done: "For regular polygons, both equal the number of sides.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A regular pentagon",
        picture: { kind: "shape", points: regular(5, 3, 90) },
        start: "A regular pentagon has 5 equal sides.",
        stages: [
          {
            prompt:
              "Lines of symmetry: each goes from a corner to the middle of the opposite side. How many?",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "10", feedback: "One from each corner: 5." },
            ],
            then: "5 lines",
          },
          {
            prompt: "Order of rotational symmetry:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "1", feedback: "It fits every fifth of a turn: 5 times." },
            ],
            then: "Order 5",
          },
        ],
        done: "Regular: lines = order = number of sides.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A parallelogram",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 7, y: 3 },
            { x: 2, y: 3 },
          ],
          dots: [{ x: 3.5, y: 1.5 }],
        },
        start: "A parallelogram that isn't a rectangle.",
        stages: [
          {
            prompt: "Lines of symmetry:",
            options: [
              { text: "0", correct: true, feedback: "" },
              { text: "2", feedback: "Fold it any way and the halves don't match: it's slanted." },
            ],
            then: "No mirror lines",
          },
          {
            prompt: "But turn it half way round. Order of rotational symmetry:",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "1", feedback: "After half a turn it fits on itself again." },
            ],
            then: "Order 2",
          },
        ],
        done: "A shape can have rotational symmetry without any mirror lines.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "How many lines of symmetry does an isosceles triangle have?",
        picture: {
          kind: "shape",
          points: [
            { x: -2, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 4 },
          ],
        },
        revealPicture: {
          kind: "shape",
          points: [
            { x: -2, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 4 },
          ],
          mirrors: [
            [
              { x: 0, y: -0.5 },
              { x: 0, y: 4.5 },
            ],
          ],
        },
        options: [
          { text: "1", correct: true, feedback: "Down the middle." },
          { text: "3", feedback: "That's an equilateral triangle. Isosceles has just one." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Order of rotational symmetry of a regular octagon",
        answers: ["8"],
        hint: "It fits every eighth of a turn.",
        done: "8.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ali says a rectangle has 4 lines of symmetry, like a square. Is he right?",
        options: [
          {
            text: "No: just 2. The diagonals aren't mirror lines",
            correct: true,
            feedback:
              "Fold a rectangle along a diagonal and the corners don't meet. It's the most common symmetry mistake.",
          },
          { text: "Yes", feedback: "Try folding a sheet of A4 corner to corner." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eva describes a shape with no symmetry at all, like the letter F.",
        lines: [
          "It has no lines of symmetry",
          "It only fits on itself after a full turn",
          "So its order of rotational symmetry is 0",
        ],
        wrong: 2,
        why: "Every shape fits on itself after a full turn, so the smallest order is **1**, not 0.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Designing a logo",
        text: "The logo is a regular hexagon.",
        picture: { kind: "shape", points: hexagon },
        revealPicture: {
          kind: "shape",
          points: hexagon,
          mirrors: [0, 30, 60, 90, 120, 150].map((d) => through(d, 3.6)),
        },
        options: [
          {
            text: "6 lines of symmetry, rotational order 6",
            correct: true,
            feedback:
              "Three corner to corner and three side to side; it fits every sixth of a turn.",
          },
          {
            text: "3 lines, order 3",
            feedback: "Corner to corner gives 3; side to side gives 3 more.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many lines of symmetry does an equilateral triangle have?",
            answers: ["3"],
            why: "One from each corner.",
            retry: {
              prompt: "How many lines of symmetry does a square have?",
              answers: ["4"],
              why: "Two across, two diagonals.",
            },
          },
          {
            prompt: "What is the order of rotational symmetry of a rectangle?",
            answers: ["2"],
            why: "It fits after half a turn.",
            retry: {
              prompt: "What is the order of rotational symmetry of a regular hexagon?",
              answers: ["6"],
              why: "Every sixth of a turn.",
            },
          },
          {
            prompt: "The smallest order of rotational symmetry any shape can have is",
            options: ["1", "0", "2"],
            answers: ["1"],
            why: "Every shape fits after a full turn.",
            retry: {
              prompt: "A shape with no symmetry has rotational order",
              options: ["1", "0", "360"],
              answers: ["1"],
              why: "It fits once, after a full turn.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-lines",
    id: "y7-lines/measuring",
    before: MEASURE,
    title: "Measuring",
    summary: "Measure lines with a ruler and angles with a protractor, estimating first.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Clock hands",
        text: [
          "At 2 o'clock, the hands of a clock make an angle. At 4 o'clock, a bigger one.",
          "How big are they? By the end of this lesson, you can estimate and measure angles, and lines.",
        ],
        picture: {
          kind: "angles",
          rays: [30, 90],
          arcs: [{ from: 0, to: 1, label: "?", find: true }],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many millimetres in 1 cm?",
        answers: ["10"],
        unit: "mm",
        hint: "The small marks on a ruler.",
        done: "10 mm.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Half a right angle is how many degrees?",
        answers: ["45"],
        unit: "°",
        hint: "$90 \\div 2$.",
        done: "45°.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "How long is the line?",
        text: "Careful: it doesn't start at 0.",
        picture: { kind: "ruler", from: 1, to: 7.4 },
        answers: ["6.4"],
        unit: "cm",
        wrong: [{ answer: "7.4", feedback: "The line starts at 1, not 0. Take 1 away." }],
        hint: "End minus start: $7.4 - 1$.",
        done: "$7.4 - 1 = 6.4$ cm. Start at 0, or take the start away.",
      },
      {
        kind: "dial",
        tag: "Discover",
        title: "Estimate: make about 135°",
        text: "No protractor yet. 135° is a right angle and half another.",
        target: 135,
        within: 15,
        protractor: false,
        hint: "Go past the right angle by half again.",
        done: "Estimating first tells you if a measurement is silly.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Using a protractor",
        text: [
          "Put the centre on the corner, and line 0 up with one arm. Count round from that 0 to the other arm.",
          "A protractor has two scales. Use the one that starts at 0 on your arm, and check against your estimate.",
        ],
        picture: { kind: "angles", rays: [0, 72], arcs: [{ from: 0, to: 1, label: "72°" }] },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Measuring 72°",
        picture: {
          kind: "angles",
          rays: [0, 72],
          arcs: [{ from: 0, to: 1, label: "?", find: true }],
        },
        problem: "Measure the angle.",
        steps: [
          { line: "Estimate: less than 90°, so acute, about 70°", why: "Always estimate first." },
          { line: "Centre on the corner; 0 on the bottom arm", why: "Line up carefully." },
          {
            line: "Read 72° on the scale starting at 0",
            why: "Not 108° on the other scale: that's obtuse.",
          },
        ],
        done: "72°: close to the estimate ✓",
      },
      {
        kind: "dial",
        tag: "Together",
        title: "Measure: make exactly 72°",
        text: "Use the protractor's scale from 0.",
        target: 72,
        within: 1,
        protractor: true,
        hint: "Count from 0 on the right-hand arm.",
        done: "72°: acute, as estimated.",
      },
      {
        kind: "dial",
        tag: "Together",
        title: "Make a reflex angle of 250°",
        text: "Go past the straight line.",
        target: 250,
        within: 3,
        protractor: true,
        hint: "180° is a half turn; 70° more.",
        done: "250° = 180° + 70°.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How long is the line?",
        picture: { kind: "ruler", from: 2, to: 6.5 },
        answers: ["4.5"],
        unit: "cm",
        wrong: [{ answer: "6.5", feedback: "It starts at 2. Take 2 away." }],
        hint: "$6.5 - 2$.",
        done: "4.5 cm.",
      },
      {
        kind: "dial",
        tag: "Your turn",
        title: "Make 125°",
        target: 125,
        within: 2,
        protractor: true,
        hint: "Past 90°: obtuse.",
        done: "125°.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Zoe measures an acute angle and reads 140°. What happened?",
        options: [
          {
            text: "She read the wrong scale: it's 40°",
            correct: true,
            feedback:
              "Acute angles are under 90°, so 140° can't be right. The two scales add to 180°. Estimating first catches this.",
          },
          { text: "Nothing: some acute angles are 140°", feedback: "Acute means less than 90°." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai measures a line that runs from 3 cm to 8.5 cm on a ruler.",
        lines: ["The line ends at 8.5 cm", "So it's 8.5 cm long", "That's 85 mm"],
        wrong: 1,
        why: "It starts at 3, not 0: $8.5 - 3 = 5.5$ cm.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Clock hands",
        picture: {
          kind: "angles",
          rays: [30, 90],
          arcs: [{ from: 0, to: 1, label: "?", find: true }],
        },
        start: "A clock face is a full turn, 360°, split into 12 hours.",
        stages: [
          {
            prompt: "Each hour is",
            options: [
              { text: "$360 \\div 12 = 30°$", correct: true, feedback: "" },
              { text: "12°", feedback: "Share 360° between 12." },
            ],
            then: "30° per hour",
          },
          {
            prompt: "At 2 o'clock the hands are 2 hours apart:",
            options: [
              { text: "60°", correct: true, feedback: "" },
              { text: "2°", feedback: "Two lots of 30°." },
            ],
            then: "60°, and at 4 o'clock, 120°",
          },
        ],
        done: "60°: acute. At 4 o'clock, 120°: obtuse.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A line runs from 1 cm to 5.3 cm on a ruler. How long is it, in cm?",
            answers: ["4.3"],
            why: "$5.3 - 1$.",
            retry: {
              prompt: "A line runs from 2 cm to 9.1 cm on a ruler. How long is it, in cm?",
              answers: ["7.1"],
              why: "$9.1 - 2$.",
            },
          },
          {
            prompt: "An angle looks a bit more than a right angle. Which reading fits?",
            options: ["105°", "75°", "15°"],
            answers: ["105°"],
            why: "Just over 90°.",
            retry: {
              prompt: "An angle looks about half a right angle. Which reading fits?",
              options: ["45°", "135°", "90°"],
              answers: ["45°"],
              why: "Half of 90°.",
            },
          },
          {
            prompt: "On a clock, how many degrees between the hands at 3 o'clock?",
            answers: ["90"],
            why: "$3 \\times 30$.",
            retry: {
              prompt: "On a clock, how many degrees between the hands at 1 o'clock?",
              answers: ["30"],
              why: "One hour: 30°.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-lines",
    id: "y7-lines/scale",
    before: SCALE,
    title: "Scale drawings",
    summary: "Use a scale to turn lengths on a map or plan into real lengths, and back.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How far is the walk?",
        text: [
          "On a map, 1 cm stands for 2 km. Two villages are 3.4 cm apart on the map.",
          "How far apart are they really? By the end of this lesson, you can read any map.",
        ],
        picture: { kind: "ruler", from: 0, to: 3.4 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times 2$?",
        answers: ["6"],
        hint: "Double 3.",
        done: "6.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 \\div 2$?",
        answers: ["5"],
        hint: "Half of 10.",
        done: "5.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What a scale means",
        text: [
          "A **scale** like '1 cm to 2 km' means every 1 cm on the map is 2 km in real life.",
          "So 3 cm on the map is $3 \\times 2 = 6$ km. To go from map to real, multiply.",
        ],
        picture: {
          kind: "maths",
          tex: "1 \\text{ cm} \\to 2 \\text{ km} \\qquad 3 \\text{ cm} \\to 6 \\text{ km}",
        },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Map to real",
        text: "The scale is 1 cm to 5 m. A wall is 4 cm long on the plan. How long is it really?",
        answers: ["20"],
        unit: "m",
        hint: "$4 \\times 5$.",
        done: "20 m.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Real to map",
        problem: "Scale 1 cm to 4 m. A garden is 18 m long. How long should it be drawn?",
        steps: [
          { line: "Real to map: divide", why: "Every 4 m becomes 1 cm." },
          { line: "$18 \\div 4 = 4.5$ cm", why: "How many 4s in 18." },
        ],
        done: "Map to real: multiply. Real to map: divide.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A plan of a room",
        start: "Scale 1 cm to 50 cm. The room is 8 cm long on the plan.",
        stages: [
          {
            prompt: "Plan to real:",
            options: [
              { text: "$8 \\times 50 = 400$ cm", correct: true, feedback: "" },
              { text: "$8 \\div 50$", feedback: "Plan to real: multiply." },
            ],
            then: "400 cm",
          },
          {
            prompt: "In metres:",
            options: [
              { text: "4 m", correct: true, feedback: "" },
              { text: "40 m", feedback: "100 cm = 1 m." },
            ],
            then: "4 m",
          },
        ],
        done: "Check units at the end.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Drawing a path",
        start: "Scale 1 cm to 3 km. A path is 12 km.",
        stages: [
          {
            prompt: "Real to map:",
            options: [
              { text: "$12 \\div 3 = 4$ cm", correct: true, feedback: "" },
              {
                text: "$12 \\times 3 = 36$ cm",
                feedback: "Real to map: divide. A map is smaller!",
              },
            ],
            then: "4 cm",
          },
        ],
        done: "A map distance is always smaller than the real one.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Map to real",
        text: "Scale 1 cm to 10 km. Two towns are 6.5 cm apart on the map. How far apart are they?",
        answers: ["65"],
        unit: "km",
        hint: "$6.5 \\times 10$.",
        done: "65 km.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Real to map",
        text: "Scale 1 cm to 2 m. A fence is 15 m long. How long on the drawing?",
        answers: ["7.5"],
        unit: "cm",
        wrong: [{ answer: "30", feedback: "Real to map: divide." }],
        hint: "$15 \\div 2$.",
        done: "7.5 cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Scale 1 cm to 5 km; real distance 20 km. Max draws it 100 cm long. What's wrong?",
        options: [
          {
            text: "He multiplied. Real to map divides: 4 cm",
            correct: true,
            feedback:
              "A map must be smaller than real life. Multiplying the wrong way is the common slip.",
          },
          { text: "Nothing", feedback: "A 1 m line for a map? Divide: $20 \\div 5 = 4$ cm." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Scale 1 cm to 25 m. Ana measures 3 cm on the plan.",
        lines: ["Plan to real: multiply", "$3 \\times 25 = 75$", "So it's 75 cm"],
        wrong: 2,
        why: "The scale is in metres: 75 **m**. Keep the units from the scale.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How far is the walk?",
        text: "1 cm to 2 km; the villages are 3.4 cm apart on the map.",
        picture: { kind: "ruler", from: 0, to: 3.4 },
        answers: ["6.8"],
        unit: "km",
        wrong: [{ answer: "1.7", feedback: "Map to real: multiply." }],
        hint: "$3.4 \\times 2$.",
        done: "6.8 km apart.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Scale 1 cm to 3 km. 5 cm on the map is how many km?",
            answers: ["15"],
            why: "$5 \\times 3$.",
            retry: {
              prompt: "Scale 1 cm to 4 km. 7 cm on the map is how many km?",
              answers: ["28"],
              why: "$7 \\times 4$.",
            },
          },
          {
            prompt: "Scale 1 cm to 5 m. A 30 m wall is drawn how many cm long?",
            answers: ["6"],
            why: "$30 \\div 5$.",
            retry: {
              prompt: "Scale 1 cm to 2 m. A 9 m wall is drawn how many cm long?",
              answers: ["4.5"],
              why: "$9 \\div 2$.",
            },
          },
          {
            prompt: "Going from real life to the map, you",
            options: ["divide by the scale", "multiply by the scale"],
            answers: ["divide by the scale"],
            why: "Maps are smaller.",
            retry: {
              prompt: "Going from the map to real life, you",
              options: ["multiply by the scale", "divide by the scale"],
              answers: ["multiply by the scale"],
              why: "Real life is bigger.",
            },
          },
        ],
      },
    ],
  },
];
