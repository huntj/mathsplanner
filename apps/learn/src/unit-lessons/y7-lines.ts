// Year 7, "Lines, symmetry and measuring": the words for angles and lines, turning a line to
// estimate and measure angles, reading a ruler, mirror lines and rotational symmetry, and scale
// drawings.
import { regular, through } from "./geometry.ts";
import type { UnitLesson } from "./types.ts";

const hexagon = regular(6, 3, 90);

export const y7Lines: UnitLesson = {
  unit: "y7-lines",
  title: "Turns, lines and mirrors",
  summary: "Turn, measure and fold your way round shapes and angles.",
  screens: [
    {
      kind: "explain",
      title: "An angle is a turn",
      text: [
        "An angle measures how far a line turns. A full turn is 360°.",
        "Less than 90° is **acute**, exactly 90° is a **right angle**, between 90° and 180° is **obtuse**, and more than 180° is **reflex**.",
      ],
      picture: {
        kind: "angles",
        rays: [0, 50, 180],
        arcs: [
          { from: 0, to: 1, label: "acute" },
          { from: 1, to: 2, label: "obtuse" },
        ],
      },
    },
    {
      kind: "sort",
      title: "Acute, obtuse or reflex?",
      groups: ["Acute", "Obtuse", "Reflex"],
      items: [
        { text: "35°", group: 0, why: "35° is less than a right angle, 90°: acute." },
        { text: "120°", group: 1, why: "120° is between 90° and 180°: obtuse." },
        { text: "200°", group: 2, why: "200° is more than a half turn, 180°: reflex." },
        { text: "89°", group: 0, why: "Just under 90°, so still acute." },
        { text: "91°", group: 1, why: "Just over 90°, so obtuse." },
        { text: "300°", group: 2, why: "More than 180°: reflex." },
      ],
      done: "Acute < 90° < obtuse < 180° < reflex < 360°.",
    },
    {
      kind: "dial",
      title: "Estimate: make about 135°",
      text: "No protractor this time. Turn the line by eye.",
      target: 135,
      within: 12,
      protractor: false,
      hint: "135° is a right angle and half another one: halfway between straight up and flat.",
      done: "Estimating first helps you spot when you have read the wrong scale on a protractor.",
    },
    {
      kind: "dial",
      title: "Measure: make exactly 72°",
      text: "Now use the protractor. Count up from 0 on the base line.",
      target: 72,
      within: 1,
      protractor: true,
      hint: "Start at 0 on the base line and count up the scale: 70 is the long mark, then 2 more.",
      done: "Always start from 0 on the line the angle starts from.",
    },
    {
      kind: "dial",
      title: "Make a reflex angle of 250°",
      target: 250,
      within: 1,
      protractor: true,
      hint: "250° is a half turn, 180°, and 70° more.",
      done: "To draw a reflex angle with a half-circle protractor, draw $360 - 250 = 110°$ the other way.",
    },
    {
      kind: "answer",
      title: "How long is the line?",
      picture: { kind: "ruler", from: 1, to: 7.4 },
      answers: ["6.4"],
      unit: "cm",
      wrong: [
        { answer: "7.4", feedback: "The line starts at 1, not 0. Take 1 from where it ends." },
        { answer: "64", feedback: "That is in millimetres. Give it in centimetres." },
      ],
      hint: "Find where each end is, then take one from the other.",
      done: "$7.4 - 1 = 6.4$ cm. Each small mark is 1 mm, a tenth of a centimetre.",
    },
    {
      kind: "choice",
      title: "Which angle is $\\angle ABC$?",
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
      options: [
        {
          text: "The angle at B",
          correct: true,
          feedback: "$\\angle ABC$ is the angle at the middle letter, B, between BA and BC.",
        },
        { text: "The angle at A", feedback: "The middle letter tells you the corner: B." },
        { text: "The side from A to C", feedback: "The ∠ sign means an angle, not a side." },
      ],
    },
    {
      kind: "choice",
      title: "In this rectangle, AB and DC are…",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 3 },
          { x: 5, y: 3 },
          { x: 5, y: 0 },
          { x: 0, y: 0 },
        ],
        names: ["A", "B", "C", "D"],
        square: [0, 1, 2, 3],
      },
      options: [
        {
          text: "Parallel",
          correct: true,
          feedback:
            "They never meet, however far they go. AB and BC meet at a right angle: they are **perpendicular**.",
        },
        {
          text: "Perpendicular",
          feedback: "Perpendicular lines meet at right angles, like AB and BC.",
        },
        { text: "Neither", feedback: "Extend them: they never meet." },
      ],
    },
    {
      kind: "choice",
      title: "How many lines of symmetry does a regular hexagon have?",
      picture: { kind: "shape", points: hexagon },
      revealPicture: {
        kind: "shape",
        points: hexagon,
        mirrors: [0, 30, 60, 90, 120, 150].map((d) => through(d, 3.6)),
      },
      options: [
        {
          text: "6",
          correct: true,
          feedback: "Three join opposite corners, and three join the middles of opposite sides.",
        },
        {
          text: "3",
          feedback: "Corner to corner gives 3. Middle of side to middle of side gives 3 more.",
        },
        {
          text: "12",
          feedback:
            "Each line of symmetry joins two sides or two corners, so there are half that many.",
        },
      ],
    },
    {
      kind: "choice",
      title: "How many lines of symmetry does a rectangle have?",
      picture: {
        kind: "shape",
        points: [
          { x: -2.5, y: 1.5 },
          { x: 2.5, y: 1.5 },
          { x: 2.5, y: -1.5 },
          { x: -2.5, y: -1.5 },
        ],
      },
      revealPicture: {
        kind: "shape",
        points: [
          { x: -2.5, y: 1.5 },
          { x: 2.5, y: 1.5 },
          { x: 2.5, y: -1.5 },
          { x: -2.5, y: -1.5 },
        ],
        mirrors: [through(0, 3.2), through(90, 2.2)],
      },
      options: [
        {
          text: "2",
          correct: true,
          feedback:
            "Across the middle each way. Fold along a diagonal and the corners do not meet.",
        },
        {
          text: "4",
          feedback:
            "The diagonals are not mirror lines: fold a rectangle along one and the corners miss.",
        },
        { text: "0", feedback: "Fold it in half across the middle: the two halves match." },
      ],
    },
    {
      kind: "choice",
      title: "Rotational symmetry",
      text: "Turn an equilateral triangle about its centre. How many times does it look the same in one full turn?",
      picture: {
        kind: "shape",
        points: regular(3, 3, 90),
        dots: [{ x: 0, y: 0 }],
      },
      options: [
        {
          text: "3",
          correct: true,
          feedback: "Every 120° it fits on itself: its **order** of rotational symmetry is 3.",
        },
        { text: "1", feedback: "It fits after a full turn, but also sooner: every 120°." },
        { text: "6", feedback: "It has 3 corners, so it fits on itself 3 times in a turn." },
      ],
    },
    {
      kind: "answer",
      title: "Read the map",
      text: "A map's scale is 1 cm to 5 km. Two towns are 3.4 cm apart on the map. How far apart are they?",
      picture: { kind: "ruler", from: 0, to: 3.4 },
      answers: ["17"],
      unit: "km",
      wrong: [
        { answer: "8.4", feedback: "Each centimetre stands for 5 km, so multiply, not add." },
      ],
      hint: "Each 1 cm on the map is 5 km for real.",
      done: "$3.4 \\times 5 = 17$ km.",
    },
    {
      kind: "answer",
      title: "Scale up a drawing",
      text: "On a drawing with a scale of 1 : 50, a room is 8 cm long. How long is the real room, in metres?",
      answers: ["4"],
      unit: "m",
      wrong: [{ answer: "400", feedback: "400 is in centimetres. 100 cm make 1 m." }],
      hint: "1 : 50 means everything is 50 times bigger for real.",
      done: "$8 \\times 50 = 400$ cm, which is 4 m.",
    },
    {
      kind: "explain",
      title: "Turns, lines and mirrors",
      text: [
        "Angles: acute < 90°, obtuse < 180°, reflex > 180°. Estimate, then measure from 0.",
        "Parallel lines never meet; perpendicular lines meet at right angles. $\\angle ABC$ is the angle at B.",
        "Mirror lines fold a shape onto itself; rotational symmetry counts how often it fits in a turn.",
        "A scale multiplies every length by the same amount.",
      ],
      picture: { kind: "shape", points: hexagon, mirrors: [through(90, 3.6)] },
    },
  ],
};
