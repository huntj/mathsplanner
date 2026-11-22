// GCSE Foundation, "Circles", on the stepped template (docs/proposals/lesson-stepped.md): the
// parts of a circle, circumference and area, composite shapes, spheres, pyramids and cones, arc
// length, sector area and finding a sector's angle. Every measurement is asked on its drawing:
// the circle, sector, sphere or cone carries the numbers, and the words say what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfCircles, part } from "./gf-circles.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Picture, Point, Screen, UnitLesson } from "./types.ts";
import { measured } from "./y8-area.ts";

const CI = gfCircles;
const NUMBER = "A circle fact in words: there is nothing to measure.";
type Item = DrawingPic["items"][number];
const P = (x: number, y: number): Point => ({ x, y });
const O = P(0, 0);
const ring = (c: Point, r: number): Item[] => [
  { arc: c, r, from: 0, to: 180 },
  { arc: c, r, from: 180, to: 360 },
];
const at = (deg: number, r: number) =>
  P(r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180));
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A lesson's own worked example, drawn. */
const workedOn = (id: string, picture: Picture): Screen => {
  const w = workedFrom(CI, id);
  return w.kind === "worked" ? { ...w, picture } : w;
};

/** A circle with its circumference or area written below, its radius marked to find. */
const given = (what: string): Picture => {
  const pic = measured("r", "?");
  return pic.kind === "drawing"
    ? { ...pic, items: [...pic.items, { text: what, at: P(0, -1.3) }] }
    : pic;
};

/** Half a circle on its diameter, the diameter labelled. */
const semi = (label: string): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -3.5, xMax: 3.5, yMin: -1, yMax: 3.3 },
  items: [
    { arc: O, r: 3, from: 0, to: 180 },
    { line: [P(-3, 0), P(3, 0)] },
    { side: [P(-3, 0), P(3, 0)], label, inside: P(0, 1) },
  ],
});

/** A quarter of a circle, one radius labelled. */
const quarter = (label: string): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -0.8, xMax: 3.5, yMin: -1, yMax: 3.3 },
  items: [
    { arc: O, r: 3, from: 0, to: 90 },
    { line: [O, P(3, 0)] },
    { line: [O, P(0, 3)] },
    { side: [O, P(3, 0)], label, inside: P(1, 1) },
  ],
});

/** A sector: its angle, one radius labelled, and the arc or area written beside it. */
const sec = (deg: number, angle: string, radius: string, note?: string): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -3.6, xMax: 3.8, yMin: -1, yMax: 3.8 },
  items: [
    { arc: O, r: 3, from: 0, to: deg },
    { line: [O, P(3, 0)] },
    { line: [O, at(deg, 3)] },
    { angle: O, from: 0, to: deg, label: angle },
    { side: [O, P(3, 0)], label: radius, inside: at(deg / 2, 1.5) },
    ...(note ? [{ text: note, at: P(deg > 120 ? 2.2 : -1.6, -0.8) }] : []),
  ],
});

/** The region between two radii, or between a chord and its arc. */
const region = (which: "sector" | "segment", size: number): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5 },
  items: [
    ...ring(O, 3),
    { dot: O },
    ...(which === "sector"
      ? ([
          { line: [O, at(90 - size / 2, 3)], tone: "find" },
          { line: [O, at(90 + size / 2, 3)], tone: "find" },
        ] as Item[])
      : ([{ line: [at(90 - size / 2, 3), at(90 + size / 2, 3)], tone: "find" }] as Item[])),
  ],
});

/** A sphere: its outline, equator and a radius (or diameter) labelled. */
const sphere = (label: string, across: "r" | "d" = "r"): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5 },
  items: [
    ...ring(O, 3),
    { arc: O, r: 3, ry: 0.8, from: 180, to: 360 },
    { arc: O, r: 3, ry: 0.8, from: 0, to: 180, dashed: true },
    { dot: O },
    { line: [across === "d" ? P(0, -3) : O, P(0, 3)], tone: "find" },
    { side: [across === "d" ? P(0, -3) : O, P(0, 3)], label, inside: P(-1, 0) },
  ],
});

/** Half a sphere on its flat circle, a radius labelled. */
const hemi = (label: string): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -3.5, xMax: 3.5, yMin: -1.2, yMax: 3.4 },
  items: [
    { arc: O, r: 3, from: 0, to: 180 },
    { arc: O, r: 3, ry: 0.8, from: 180, to: 360 },
    { arc: O, r: 3, ry: 0.8, from: 0, to: 180 },
    { dot: O },
    { line: [O, P(0, 3)], tone: "find" },
    { side: [O, P(0, 3)], label, inside: P(-1, 1.5) },
  ],
});

/** A cone: radius, height (or slant) labelled. */
const cone = (r: string, h: string, slant = false): DrawingPic => {
  const top = P(0, 5);
  return {
    kind: "drawing",
    frame: { xMin: -3.5, xMax: 3.5, yMin: -1.4, yMax: 5.3 },
    items: [
      { arc: O, r: 2.5, ry: 0.6, from: 180, to: 360 },
      { arc: O, r: 2.5, ry: 0.6, from: 0, to: 180, dashed: true },
      { line: [P(-2.5, 0), top] },
      { line: [P(2.5, 0), top] },
      { line: [O, P(2.5, 0)] },
      { dot: O },
      { text: r, at: P(1.25, -1) },
      slant
        ? { side: [P(2.5, 0), top], label: h, inside: P(0, 2) }
        : { line: [O, top], dashed: true },
      ...(slant ? [] : [{ side: [O, top], label: h, inside: P(1, 2) } as Item]),
    ],
  };
};

/** A square-based pyramid: the base side and the height labelled. */
const pyramid = (side: string, h: string): DrawingPic => {
  const [a, b, c, d] = [P(-3.5, 0), P(2, 0), P(3.5, 1.4), P(-2, 1.4)];
  const top = P(0, 5.5);
  const mid = P(0, 0.7);
  return {
    kind: "drawing",
    frame: { xMin: -4, xMax: 4, yMin: -1.2, yMax: 5.8 },
    items: [
      { line: [a, b] },
      { line: [b, c] },
      { line: [c, d], dashed: true },
      { line: [d, a], dashed: true },
      { line: [a, top] },
      { line: [b, top] },
      { line: [c, top] },
      { line: [d, top], dashed: true },
      { line: [mid, top], dashed: true },
      { side: [a, b], label: side, inside: mid },
      { text: h, at: P(0.8, 1.9) },
    ],
  };
};

/** A running track: a rectangle with a semicircle on each end. */
const TRACK: DrawingPic = {
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(10, 0)] },
    { line: [P(0, 6), P(10, 6)] },
    { line: [P(0, 0), P(0, 6)], dashed: true, tone: "soft" },
    { line: [P(10, 0), P(10, 6)], dashed: true, tone: "soft" },
    { arc: P(0, 3), r: 3, from: 90, to: 270 },
    { arc: P(10, 3), r: 3, from: -90, to: 90 },
    { side: [P(0, 0), P(10, 0)], label: "100 m", inside: P(5, 3) },
    { side: [P(10, 0), P(10, 6)], label: "60 m", inside: P(5, 3) },
  ],
};

/** A square with a round hole: the side and the hole's radius labelled. */
const holed = (side: string, r: string): DrawingPic => {
  const mid = P(3, 3);
  return {
    kind: "drawing",
    items: [
      { line: [P(0, 0), P(6, 0)] },
      { line: [P(6, 0), P(6, 6)] },
      { line: [P(6, 6), P(0, 6)] },
      { line: [P(0, 6), P(0, 0)] },
      { side: [P(0, 0), P(6, 0)], label: side, inside: mid },
      ...ring(mid, 1.8),
      { line: [mid, P(4.8, 3)] },
      { dot: mid },
      { text: r, at: P(3.9, 3.45) },
    ],
  };
};

/** A rectangle with a semicircle on its right-hand end. */
const roundEnd = (across: string, up: string): DrawingPic => ({
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(6, 0)] },
    { line: [P(0, 4), P(6, 4)] },
    { line: [P(0, 0), P(0, 4)] },
    { line: [P(6, 0), P(6, 4)], dashed: true, tone: "soft" },
    { arc: P(6, 2), r: 2, from: -90, to: 90 },
    { side: [P(0, 0), P(6, 0)], label: across, inside: P(3, 2) },
    { side: [P(0, 0), P(0, 4)], label: up, inside: P(3, 2) },
  ],
});

// ---------------------------------------------------------------------------------------------
// Parts of a circle.

const PARTS = "gf-circles/vocabulary";
const partsMethod = [
  "Through the centre? Radius or diameter.",
  "Crosses the circle: a chord. Touches once: a tangent.",
  "Two radii make a sector; a chord makes a segment.",
];
const NAMED: DrawingPic = {
  kind: "drawing",
  frame: { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.8 },
  items: [
    ...ring(O, 3),
    { dot: O },
    { line: [O, P(3, 0)] },
    { text: "radius", at: P(1.5, 0.4) },
    { line: [P(-2.6, -1.5), P(2.6, -1.5)] },
    { text: "chord", at: P(0, -1.1) },
    { line: [P(-3, 3), P(3, 3)] },
    { text: "tangent", at: P(0, 3.4) },
  ],
};
const name = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  pick(
    "Name the highlighted line.",
    right,
    ["Radius", "Diameter", "Chord", "Tangent"].filter((n) => n !== right).slice(0, 2),
    "Through the centre? Touching or crossing?",
    { asks: "line", picture, ...extra },
  );
const area = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  pick(
    "Name the region the lines cut off.",
    right,
    ["Sector", "Segment", "Chord"].filter((n) => n !== right),
    "Two radii, or a chord?",
    { asks: "region", picture, ...extra },
  );

const parts = stepped(find(CI, PARTS), {
  method: partsMethod,
  variation: {
    relationship: "each part named by where it runs",
    unknowns: ["line", "region"],
    surface: ["through the centre", "touching or crossing", "sector or segment"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Name the parts",
        ["**Lines: radius, diameter, chord, tangent. Regions: sector and segment.**"],
        NAMED,
        "A pizza slice is a sector. A chord cuts off a segment.",
      ),
      reworded(CI, PARTS, "What is the highlighted line?", { tag: "The rule" }, "Discover"),

      ...owned(CI, PARTS, "Warm-up", "Check you remember"),

      methodCard("The method", partsMethod, NAMED),
      workedOn(PARTS, region("sector", 70)),
      calc(
        "Your turn",
        "Use the circle.",
        measured("r", "5 cm"),
        [
          ["Diameter:", "10", "Twice the radius.", { after: "cm" }],
          ["Longest chord:", "10", "The diameter is the longest chord.", { after: "cm" }],
        ],
        "A diameter is the longest chord.",
      ),

      calc(
        "Practise",
        "Use the circle.",
        measured("d", "18 cm"),
        [
          ["Radius:", "9", "Half the diameter.", { after: "cm" }],
          ["Longest chord:", "18", "The diameter.", { after: "cm" }],
        ],
        "Radius 9 cm; longest chord 18 cm.",
      ),
      ...owned(CI, PARTS, "Together", "Practise"),
      ...owned(CI, PARTS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Name each line. Watch what changes.",
        [
          name(part("radius"), "Radius"),
          name(part("diameter"), "Diameter", { changed: "Right across." }),
          name(part("chord"), "Chord", { changed: "Not through the centre." }),
          name(part("tangent"), "Tangent", { changed: "Outside, touching once." }),
        ],
        "Through the centre, across, or touching once.",
      ),

      questionSet(
        "Variation",
        "Name each region. Watch what changes.",
        [
          area(region("sector", 70), "Sector", {
            expect: [
              "Kim calls a pizza slice a segment. Right?",
              "No",
              "A slice is cut by two radii: a sector.",
              [["Yes", "Is a slice cut by a chord, or two radii?"]],
            ],
          }),
          area(region("segment", 110), "Segment", { changed: "A chord, not two radii." }),
          area(region("sector", 150), "Sector", { changed: "A bigger slice." }),
          area(region("segment", 60), "Segment", { changed: "A smaller piece." }),
        ],
        "Two radii: sector. A chord: segment.",
      ),
      own(CI, PARTS, "Spot the mistake"),

      own(CI, PARTS, "Exit check"),

      reworded(
        CI,
        PARTS,
        "“The region between a chord and the minor arc” is the",
        { tag: "Real life", picture: region("segment", 110) },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Lines: radius, diameter, chord, tangent. Regions: sector and segment.**"],
        NAMED,
        [
          "**Lines: radius, diameter, chord, tangent. Regions: sector and segment.**",
          "Diameter = 2 × radius: the longest chord.",
          "A tangent meets the radius at 90°.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Circumference and area.

const CA = "gf-circles/circumference-area";
const caMethod = [
  "Radius or diameter? Find both.",
  "$C = \\pi d$. $A = \\pi r^2$.",
  "Round only at the end.",
];
const CA_RULE = measured("r", "4 cm");
const areaOf = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  ask("Find the area, to 1 d.p.", right, "Radius first, then π r².", `${right} cm².`, {
    unit: "cm²",
    asks: "area",
    picture,
    ...extra,
  });

const circumferenceArea = stepped(find(CI, CA), {
  method: caMethod,
  variation: {
    relationship: "C = πd and A = πr²",
    unknowns: ["area", "circumference", "radius"],
    surface: ["radius or diameter", "round the edge", "working backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two formulae",
        ["**Circumference** $C = \\pi d$. **Area** $A = \\pi r^2$: use the radius."],
        CA_RULE,
        "Here $C = 8\\pi$ cm and $A = 16\\pi$ cm².",
      ),
      reworded(CI, CA, "Circumference of a circle with radius 4", {
        tag: "The rule",
        title: "Find the circumference, in terms of π.",
        picture: measured("r", "4"),
      }),

      ...owned(CI, CA, "Warm-up", "Check you remember"),

      methodCard("The method", caMethod, CA_RULE),
      workedOn(CA, measured("d", "1.2 m")),
      calc(
        "Your turn",
        "Find the area, to 1 d.p.",
        measured("d", "10 cm"),
        [
          ["Radius:", "5", "Half the diameter.", { after: "cm" }],
          ["Area:", "78.5", "π × 5².", { after: "cm²" }],
        ],
        "78.5 cm².",
      ),

      calc(
        "Practise",
        "Find the circumference and area, to 1 d.p.",
        measured("r", "6 cm"),
        [
          ["$C =$", "37.7", "π × 12.", { after: "cm" }],
          ["$A =$", "113.1", "π × 36.", { after: "cm²" }],
        ],
        "37.7 cm and 113.1 cm².",
      ),
      ...owned(CI, CA, "Together", "Practise"),
      ...owned(CI, CA, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each area. Watch what changes.",
        [
          areaOf(measured("r", "3 cm"), "28.3"),
          areaOf(measured("d", "6 cm"), "28.3", { changed: "The diameter is marked." }),
          areaOf(measured("r", "6 cm"), "113.1", { changed: "Double the radius." }),
          areaOf(measured("d", "3 cm"), "7.1", { changed: "A small diameter." }),
        ],
        "Double the radius: four times the area.",
      ),

      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          areaOf(measured("r", "3 cm"), "28.3", {
            expect: [
              "Radius 3. Ola works out the area as $\\pi \\times 6$. Right?",
              "No",
              "$r^2 = 3 \\times 3 = 9$: $9\\pi = 28.3$.",
              [["Yes", "Is $3^2$ equal to 6?"]],
            ],
          }),
          ask("Find the circumference, to 1 d.p.", "18.8", "π × 6.", "18.8 cm.", {
            unit: "cm",
            asks: "circumference",
            changed: "Round the edge.",
            picture: measured("r", "3 cm"),
          }),
          ask("Find the radius.", "5", "÷ π, then halve.", "5 cm.", {
            unit: "cm",
            asks: "radius",
            changed: "Work backwards.",
            picture: given("C = 31.4 cm"),
          }),
          ask("Find the radius, to the nearest cm.", "4", "÷ π, then √.", "4 cm.", {
            unit: "cm",
            asks: "radius",
            changed: "Back from the area.",
            picture: given("A = 50.3 cm²"),
          }),
        ],
        "Area: square the radius. Backwards: undo each step.",
      ),
      own(CI, CA, "Spot the mistake"),

      own(CI, CA, "Exit check"),

      reworded(
        CI,
        CA,
        "“Diameter 1.2 m. Area of the top, to 2 d.p.?”",
        {
          tag: "Real life",
          title: "A round table top. Area, to 2 d.p.?",
          picture: measured("d", "1.2 m"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Circumference** $C = \\pi d$. **Area** $A = \\pi r^2$: use the radius."],
        CA_RULE,
        [
          "**Circumference** $C = \\pi d$. **Area** $A = \\pi r^2$: use the radius.",
          "$r^2$ is $r \\times r$, not $2r$.",
          "Round only at the end.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Composite shapes with circles.

const COMP = "gf-circles/composite";
const compMethod = [
  "Split into rectangles and circle parts.",
  "Area: add the pieces, or take away a hole.",
  "Perimeter: add only the outside edges.",
];
const SEMI = semi("10 cm");
const areaIs = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  ask("Find the area, to 1 d.p.", right, "What fraction of a circle?", `${right} cm².`, {
    unit: "cm²",
    asks: "area",
    picture,
    ...extra,
  });
const around = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  ask("Find the perimeter, to 1 d.p.", right, "Curve plus straight edges.", `${right} cm.`, {
    unit: "cm",
    asks: "perimeter",
    picture,
    ...extra,
  });

const composite = stepped(find(CI, COMP), {
  method: compMethod,
  variation: {
    relationship: "circle parts added to straight edges",
    unknowns: ["area", "perimeter"],
    surface: ["quarter or half", "a hole", "a rectangle too"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Pieces",
        ["**Area: add the pieces, or take away a hole. Perimeter: outside edges only.**"],
        SEMI,
        "A semicircle's perimeter: half the curve, plus the diameter.",
      ),
      reworded(CI, COMP, "Two semicircles of diameter 60 m make a circle of radius", {
        tag: "The rule",
      }),

      ...owned(CI, COMP, "Warm-up", "Check you remember"),

      methodCard("The method", compMethod, SEMI),
      workedOn(COMP, TRACK),
      calc(
        "Your turn",
        "Find the area, to 1 d.p.",
        semi("12 cm"),
        [
          ["Radius:", "6", "Half the diameter.", { after: "cm" }],
          ["Area:", "56.5", "Half of π × 6².", { after: "cm²" }],
        ],
        "56.5 cm².",
      ),

      calc(
        "Practise",
        "Find the perimeter, to 1 d.p.",
        semi("6 cm"),
        [
          ["Curved edge:", "9.4", "Half of π × 6.", { after: "cm" }],
          ["Perimeter:", "15.4", "Add the straight edge.", { after: "cm" }],
        ],
        "15.4 cm.",
      ),
      reworded(CI, COMP, "The inner edge of the track", { tag: "Practise", picture: TRACK }),
      reworded(CI, COMP, "A square of side 10 with a circle of radius 3 cut out. Area left", {
        tag: "Practise",
        title: "The area left, in terms of π?",
        picture: holed("10", "3"),
      }),
      ...owned(CI, COMP, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each area. Watch what changes.",
        [
          areaIs(quarter("4 cm"), "12.6"),
          areaIs(semi("4 cm"), "6.3", { changed: "Half, on a diameter." }),
          areaIs(quarter("8 cm"), "50.3", { changed: "Double the radius." }),
          areaIs(holed("10 cm", "3 cm"), "71.7", { changed: "A square with a hole." }),
        ],
        "A fraction of a circle; take away a hole.",
      ),

      questionSet(
        "Variation",
        "Find each perimeter. Watch what changes.",
        [
          around(quarter("6 cm"), "21.4", {
            expect: [
              "Quarter circle, radius 6. Mia adds one radius to the arc. Right?",
              "No",
              "Two straight edges: arc $+ 6 + 6 = 21.4$.",
              [["Yes", "How many straight edges are there?"]],
            ],
          }),
          around(semi("12 cm"), "30.8", { changed: "Half a circle." }),
          around(quarter("10 cm"), "35.7", { changed: "A bigger radius." }),
          around(roundEnd("8 cm", "6 cm"), "31.4", { changed: "A rectangle too." }),
        ],
        "Every outside edge, straight or curved.",
      ),
      own(CI, COMP, "Spot the mistake"),

      own(CI, COMP, "Exit check"),

      reworded(
        CI,
        COMP,
        "“Area inside the track (100 m by 60 m, semicircular ends)?”",
        { tag: "Real life", title: "What area is inside the running track?", picture: TRACK },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Area: add the pieces, or take away a hole. Perimeter: outside edges only.**"],
        SEMI,
        [
          "**Area: add the pieces, or take away a hole. Perimeter: outside edges only.**",
          "Semicircle perimeter: half of πd, plus d.",
          "Quarter circle perimeter: the arc plus two radii.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Spheres.

const SPH = "gf-circles/spheres";
const sphMethod = [
  "Find the radius.",
  "Volume $\\frac43 \\pi r^3$. Surface $4\\pi r^2$.",
  "Hemisphere: halve, then add the flat circle.",
];
const SPHERE = sphere("r");
const inPi = (
  prompt: string,
  picture: Picture,
  right: string,
  others: string[],
  asks: string,
  extra: Record<string, unknown> = {},
) => pick(prompt, right, others, "Use the radius.", { asks, picture, ...extra });

const spheres = stepped(find(CI, SPH), {
  method: sphMethod,
  variation: {
    relationship: "volume and surface from the radius",
    unknowns: ["volume", "surface"],
    surface: ["double the radius", "a diameter", "a hemisphere"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two formulae",
        ["**Volume** $V = \\frac43 \\pi r^3$. **Surface area** $A = 4\\pi r^2$."],
        SPHERE,
        "A hemisphere is half a sphere, plus a flat circle.",
      ),
      reworded(CI, SPH, "Volume of a sphere, radius 3, in terms of π", {
        tag: "The rule",
        title: "Find the volume, in terms of π.",
        picture: sphere("3"),
      }),

      ...owned(CI, SPH, "Warm-up", "Check you remember"),

      methodCard("The method", sphMethod, SPHERE),
      workedOn(SPH, sphere("11 cm")),
      calc(
        "Your turn",
        "Find the volume, in terms of π.",
        sphere("9 cm"),
        [
          ["$r^3 =$", "729", "9 × 9 × 9."],
          ["$V = \\frac43 \\times 729\\pi =$", "972", "729 ÷ 3 × 4.", { after: "π cm³" }],
        ],
        "$972\\pi$ cm³.",
      ),

      calc(
        "Practise",
        "Find the surface area, in terms of π.",
        sphere("7 cm"),
        [
          ["$r^2 =$", "49", "7 × 7."],
          ["$A = 4 \\times 49\\pi =$", "196", "4 × 49.", { after: "π cm²" }],
        ],
        "$196\\pi$ cm².",
      ),
      ...owned(CI, SPH, "Together", "Practise"),
      ...owned(CI, SPH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Volume, in terms of π. Watch what changes.",
        [
          inPi("Find the volume.", sphere("3 cm"), "$36\\pi$", ["$12\\pi$", "$108\\pi$"], "volume"),
          inPi(
            "Find the volume.",
            sphere("6 cm"),
            "$288\\pi$",
            ["$72\\pi$", "$48\\pi$"],
            "volume",
            {
              changed: "Double the radius.",
            },
          ),
          inPi("Find the volume.", hemi("3 cm"), "$18\\pi$", ["$36\\pi$", "$9\\pi$"], "volume", {
            changed: "Half a sphere.",
          }),
          inPi(
            "Find the volume.",
            sphere("6 cm", "d"),
            "$36\\pi$",
            ["$288\\pi$", "$12\\pi$"],
            "volume",
            { changed: "A diameter." },
          ),
        ],
        "Double the radius: eight times the volume.",
      ),

      questionSet(
        "Variation",
        "Surface area, in terms of π. Watch what changes.",
        [
          inPi(
            "Find the total surface area.",
            hemi("4 cm"),
            "$48\\pi$",
            ["$32\\pi$", "$64\\pi$"],
            "surface",
            {
              expect: [
                "Hemisphere, radius 4. Kai halves $64\\pi$ and stops at $32\\pi$. Right?",
                "No",
                "Add the flat circle: $32\\pi + 16\\pi = 48\\pi$.",
                [["Yes", "What is the hemisphere sitting on?"]],
              ],
            },
          ),
          inPi(
            "Find the total surface area.",
            hemi("2 cm"),
            "$12\\pi$",
            ["$8\\pi$", "$16\\pi$"],
            "surface",
            {
              changed: "A smaller radius.",
            },
          ),
          inPi(
            "Find the total surface area.",
            hemi("6 cm"),
            "$108\\pi$",
            ["$72\\pi$", "$144\\pi$"],
            "surface",
            {
              changed: "A bigger radius.",
            },
          ),
          inPi(
            "Find the surface area.",
            sphere("6 cm"),
            "$144\\pi$",
            ["$108\\pi$", "$72\\pi$"],
            "surface",
            {
              changed: "A whole sphere.",
            },
          ),
        ],
        "Curved half, plus the flat circle.",
      ),
      own(CI, SPH, "Spot the mistake"),

      own(CI, SPH, "Exit check"),

      reworded(
        CI,
        SPH,
        "“Radius 11 cm. Work out the volume.”",
        { tag: "Real life", title: "A football. Work out its volume.", picture: sphere("11 cm") },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Volume** $V = \\frac43 \\pi r^3$. **Surface area** $A = 4\\pi r^2$."],
        SPHERE,
        [
          "**Volume** $V = \\frac43 \\pi r^3$. **Surface area** $A = 4\\pi r^2$.",
          "Volume uses $r^3$; area uses $r^2$.",
          "Hemisphere surface: $2\\pi r^2 + \\pi r^2$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Pyramids and cones.

const CONES = "gf-circles/cones-pyramids";
const coneMethod = [
  "Find the base area.",
  "× the height, then ÷ 3.",
  "Cone's curved area: $\\pi r l$, with the slant $l$.",
];
const CONE = cone("r", "h");

const cones = stepped(find(CI, CONES), {
  method: coneMethod,
  variation: {
    relationship: "a third of base area × height",
    unknowns: ["volume", "curved"],
    surface: ["double the height", "double the radius", "the slant"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A third of the prism",
        ["**A pyramid or cone holds a third:** $V = \\frac13 \\times$ base area $\\times h$."],
        CONE,
        "A cone's curved area is $\\pi r l$, using the slant $l$.",
      ),
      reworded(CI, CONES, "Volume of a pyramid with base area 30 cm² and height 9 cm", {
        tag: "The rule",
        title: "Base area 30 cm², height 9 cm. The pyramid's volume?",
      }),

      ...owned(CI, CONES, "Warm-up", "Check you remember"),

      methodCard("The method", coneMethod, CONE),
      workedOn(CONES, pyramid("6 cm", "8 cm")),
      calc(
        "Your turn",
        "Square base. Find the volume.",
        pyramid("4 cm", "6 cm"),
        [
          ["Base area:", "16", "4 × 4.", { after: "cm²" }],
          ["Volume:", "32", "16 × 6 ÷ 3.", { after: "cm³" }],
        ],
        "32 cm³.",
      ),

      calc(
        "Practise",
        "Find the volume, in terms of π.",
        cone("6 cm", "4 cm"),
        [
          ["Base area:", "36", "π × 6².", { after: "π cm²" }],
          ["Volume:", "48", "36π × 4 ÷ 3.", { after: "π cm³" }],
        ],
        "$48\\pi$ cm³.",
      ),
      ...owned(CI, CONES, "Together", "Practise"),
      ...owned(CI, CONES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each volume. Watch what changes.",
        [
          pick("Square base. Volume in cm³?", "30", ["90", "13"], "9 × 10 ÷ 3.", {
            asks: "volume",
            picture: pyramid("3 cm", "10 cm"),
          }),
          pick("Square base. Volume in cm³?", "120", ["60", "360"], "36 × 10 ÷ 3.", {
            asks: "volume",
            picture: pyramid("6 cm", "10 cm"),
            changed: "Double the base side.",
          }),
          pick("Square base. Volume in cm³?", "60", ["180", "120"], "36 × 5 ÷ 3.", {
            asks: "volume",
            picture: pyramid("6 cm", "5 cm"),
            changed: "Half the height.",
          }),
          pick("Volume, in terms of π?", "$15\\pi$", ["$45\\pi$", "$5\\pi$"], "9π × 5 ÷ 3.", {
            asks: "volume",
            picture: cone("3 cm", "5 cm"),
            changed: "A cone.",
          }),
        ],
        "Base area × height ÷ 3.",
      ),

      questionSet(
        "Variation",
        "Cones, in terms of π. Watch what changes.",
        [
          pick("Find the volume.", "$32\\pi$", ["$96\\pi$", "$8\\pi$"], "16π × 6 ÷ 3.", {
            asks: "volume",
            picture: cone("4 cm", "6 cm"),
            expect: [
              "Cone, radius 4, height 6. Raj gets $96\\pi$. Right?",
              "No",
              "That's the cylinder. Divide by 3: $32\\pi$.",
              [["Yes", "A cone is what fraction of its cylinder?"]],
            ],
          }),
          pick("Find the volume.", "$64\\pi$", ["$192\\pi$", "$32\\pi$"], "16π × 12 ÷ 3.", {
            asks: "volume",
            picture: cone("4 cm", "12 cm"),
            changed: "Double the height.",
          }),
          pick("Find the volume.", "$128\\pi$", ["$64\\pi$", "$384\\pi$"], "64π × 6 ÷ 3.", {
            asks: "volume",
            picture: cone("8 cm", "6 cm"),
            changed: "Double the radius.",
          }),
          pick("Find the curved area.", "$15\\pi$", ["$9\\pi$", "$45\\pi$"], "π × 3 × 5.", {
            asks: "curved",
            picture: cone("3 cm", "5 cm", true),
            changed: "The slant, not the height.",
          }),
        ],
        "Volume: ÷ 3. Curved area: π r l.",
      ),
      own(CI, CONES, "Spot the mistake"),

      own(CI, CONES, "Exit check"),

      reworded(
        CI,
        CONES,
        "“A cone has radius 3 cm and height 10 cm. Work out its volume.”",
        {
          tag: "Real life",
          title: "An ice-cream cone. Work out its volume.",
          picture: cone("3 cm", "10 cm"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A pyramid or cone holds a third:** $V = \\frac13 \\times$ base area $\\times h$."],
        CONE,
        [
          "**A pyramid or cone holds a third:** $V = \\frac13 \\times$ base area $\\times h$.",
          "Cone: $V = \\frac13 \\pi r^2 h$.",
          "Curved area $\\pi r l$ uses the slant.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Arc length.

const ARCS = "gf-circles/arcs";
const arcMethod = [
  "Fraction of the circle: $\\frac{\\theta}{360}$.",
  "Circumference: $\\pi d$.",
  "Multiply. Sector perimeter: add two radii.",
];
const ARC = sec(60, "60°", "6 cm");
const arcIs = (
  picture: Picture,
  right: string,
  others: string[],
  extra: Record<string, unknown> = {},
) =>
  pick("Find the arc length, in terms of π.", right, others, "Fraction × πd.", {
    asks: "arc",
    picture,
    ...extra,
  });
const rim = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  ask("Find the sector's perimeter, to 1 d.p.", right, "Arc plus two radii.", `${right} cm.`, {
    unit: "cm",
    asks: "perimeter",
    picture,
    ...extra,
  });

const arcs = stepped(find(CI, ARCS), {
  method: arcMethod,
  variation: {
    relationship: "an arc as a fraction of the circumference",
    unknowns: ["arc", "perimeter"],
    surface: ["the angle", "the radius", "a wide sector"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A fraction of the way round",
        ["**An arc is a fraction of the circumference:** $\\frac{\\theta}{360} \\times \\pi d$."],
        ARC,
        "$\\frac{60}{360} = \\frac16$ of $12\\pi$: $2\\pi$ cm.",
      ),
      reworded(CI, ARCS, "A 90° arc is what fraction of the circle?", { tag: "The rule" }),

      ...owned(CI, ARCS, "Warm-up", "Check you remember"),

      methodCard("The method", arcMethod, ARC),
      workedFrom(CI, ARCS),
      calc(
        "Your turn",
        "Find the arc length, in terms of π.",
        sec(120, "120°", "3 cm"),
        [
          ["Circumference:", "6", "π × the diameter.", { after: "π cm" }],
          ["Arc:", "2", "$\\frac13$ of $6\\pi$.", { after: "π cm" }],
        ],
        "$2\\pi$ cm.",
      ),

      calc(
        "Practise",
        "Find the sector's perimeter, to 1 d.p.",
        sec(90, "90°", "12 cm"),
        [
          ["Arc:", "18.8", "$\\frac14$ of $24\\pi$.", { after: "cm" }],
          ["Perimeter:", "42.8", "Add two radii.", { after: "cm" }],
        ],
        "42.8 cm.",
      ),
      ...owned(CI, ARCS, "Together", "Practise"),
      ...owned(CI, ARCS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Arc lengths. Watch what changes.",
        [
          arcIs(sec(90, "90°", "6 cm"), "$3\\pi$", ["$9\\pi$", "$12\\pi$"]),
          arcIs(sec(120, "120°", "6 cm"), "$4\\pi$", ["$3\\pi$", "$12\\pi$"], {
            changed: "A bigger angle.",
          }),
          arcIs(sec(60, "60°", "6 cm"), "$2\\pi$", ["$6\\pi$", "$\\pi$"], {
            changed: "A smaller angle.",
          }),
          arcIs(sec(60, "60°", "12 cm"), "$4\\pi$", ["$2\\pi$", "$24\\pi$"], {
            changed: "Double the radius.",
          }),
        ],
        "The angle's fraction of the whole circumference.",
      ),

      questionSet(
        "Variation",
        "Sector perimeters. Watch what changes.",
        [
          rim(sec(90, "90°", "4 cm"), "14.3", {
            expect: [
              "90°, radius 10. Mia takes the circumference as $10\\pi$. Right?",
              "No",
              "$C = 2\\pi r = 20\\pi$, so the arc is $5\\pi$.",
              [["Yes", "Is 10 the radius or the diameter?"]],
            ],
          }),
          rim(sec(90, "90°", "8 cm"), "28.6", { changed: "Double the radius." }),
          rim(sec(45, "45°", "8 cm"), "22.3", { changed: "Half the angle." }),
          rim(sec(150, "150°", "6 cm"), "27.7", { changed: "A wide sector." }),
        ],
        "Arc, plus two radii.",
      ),
      own(CI, ARCS, "Spot the mistake"),

      own(CI, ARCS, "Exit check"),

      reworded(
        CI,
        ARCS,
        "“Radius 15 cm, 72° slice. How long is the crust?”",
        {
          tag: "Real life",
          title: "A pizza slice. How long is the crust?",
          picture: sec(72, "72°", "15 cm"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**An arc is a fraction of the circumference:** $\\frac{\\theta}{360} \\times \\pi d$."],
        ARC,
        [
          "**An arc is a fraction of the circumference:** $\\frac{\\theta}{360} \\times \\pi d$.",
          "$C = 2\\pi r$: double the radius.",
          "Sector perimeter: arc + 2 radii.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Sector area.

const SECT = "gf-circles/sectors";
const sectMethod = [
  "Fraction of the circle: $\\frac{\\theta}{360}$.",
  "Circle's area: $\\pi r^2$.",
  "Multiply.",
];
const SECTOR = sec(45, "45°", "4 cm");
const sectorIs = (
  prompt: string,
  picture: Picture,
  right: string,
  others: string[],
  asks: string,
  extra: Record<string, unknown> = {},
) => pick(prompt, right, others, "Fraction × the whole.", { asks, picture, ...extra });

const sectors = stepped(find(CI, SECT), {
  method: sectMethod,
  variation: {
    relationship: "a sector as a fraction of the circle",
    unknowns: ["area", "arc"],
    surface: ["the angle", "double the radius", "arc or area"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A fraction of the area",
        ["**A sector is a fraction of the circle:** $\\frac{\\theta}{360} \\times \\pi r^2$."],
        SECTOR,
        "$\\frac{45}{360} = \\frac18$ of $16\\pi$: $2\\pi$ cm².",
      ),
      reworded(CI, SECT, "A 180° sector of radius 6 has area", { tag: "The rule" }),

      ...owned(CI, SECT, "Warm-up", "Check you remember"),

      methodCard("The method", sectMethod, SECTOR),
      workedOn(SECT, sec(135, "135°", "4 m")),
      calc(
        "Your turn",
        "Find the area, in terms of π.",
        sec(120, "120°", "6 cm"),
        [
          ["Circle's area:", "36", "π × 6².", { after: "π cm²" }],
          ["Sector:", "12", "$\\frac13$ of $36\\pi$.", { after: "π cm²" }],
        ],
        "$12\\pi$ cm².",
      ),

      calc(
        "Practise",
        "Find the area, to 1 d.p.",
        sec(150, "150°", "4 cm"),
        [
          ["Circle's area:", "16", "π × 4².", { after: "π cm²" }],
          ["Sector:", "20.9", "$\\frac{150}{360} \\times 16\\pi$.", { after: "cm²" }],
        ],
        "20.9 cm².",
      ),
      ...owned(CI, SECT, "Together", "Practise"),
      ...owned(CI, SECT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Areas, in terms of π. Watch what changes.",
        [
          sectorIs(
            "Find the area.",
            sec(90, "90°", "6 cm"),
            "$9\\pi$",
            ["$3\\pi$", "$36\\pi$"],
            "area",
          ),
          sectorIs(
            "Find the area.",
            sec(30, "30°", "6 cm"),
            "$3\\pi$",
            ["$9\\pi$", "$\\pi$"],
            "area",
            {
              changed: "A third of the angle.",
            },
          ),
          sectorIs(
            "Find the area.",
            sec(30, "30°", "12 cm"),
            "$12\\pi$",
            ["$6\\pi$", "$3\\pi$"],
            "area",
            {
              changed: "Double the radius.",
            },
          ),
          sectorIs(
            "Find the area.",
            sec(120, "120°", "3 cm"),
            "$3\\pi$",
            ["$9\\pi$", "$\\pi$"],
            "area",
            {
              changed: "Wider, but smaller.",
            },
          ),
        ],
        "Double the radius: four times the area.",
      ),

      questionSet(
        "Variation",
        "Area or arc, in terms of π. Watch what changes.",
        [
          sectorIs(
            "Find the area.",
            sec(120, "120°", "3 cm"),
            "$3\\pi$",
            ["$2\\pi$", "$9\\pi$"],
            "area",
            {
              expect: [
                "120°, radius 3. Ali uses $6\\pi$ as the circle's area. Right?",
                "No",
                "$6\\pi$ is the circumference. Area $= \\pi r^2 = 9\\pi$.",
                [["Yes", "Is $6\\pi$ the area or the circumference?"]],
              ],
            },
          ),
          sectorIs(
            "Find the arc length.",
            sec(120, "120°", "3 cm"),
            "$2\\pi$",
            ["$3\\pi$", "$6\\pi$"],
            "arc",
            {
              changed: "Arc, not area.",
            },
          ),
          sectorIs(
            "Find the area.",
            sec(120, "120°", "6 cm"),
            "$12\\pi$",
            ["$6\\pi$", "$4\\pi$"],
            "area",
            {
              changed: "Double the radius.",
            },
          ),
          sectorIs(
            "Find the arc length.",
            sec(120, "120°", "6 cm"),
            "$4\\pi$",
            ["$12\\pi$", "$2\\pi$"],
            "arc",
            {
              changed: "Arc again.",
            },
          ),
        ],
        "Area: πr². Arc: 2πr.",
      ),
      own(CI, SECT, "Spot the mistake"),

      own(CI, SECT, "Exit check"),

      reworded(
        CI,
        SECT,
        "“135°, reaches 4 m. What area does it water?”",
        {
          tag: "Real life",
          title: "A garden sprinkler. What area does it water?",
          picture: sec(135, "135°", "4 m"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A sector is a fraction of the circle:** $\\frac{\\theta}{360} \\times \\pi r^2$."],
        SECTOR,
        [
          "**A sector is a fraction of the circle:** $\\frac{\\theta}{360} \\times \\pi r^2$.",
          "Area uses $\\pi r^2$; arcs use $2\\pi r$.",
          "Give answers in π, or round at the end.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Finding a sector's angle.

const ANGLE = "gf-circles/sector-angle";
const angleMethod = [
  "The whole: $2\\pi r$ for an arc, $\\pi r^2$ for an area.",
  "Fraction = part ÷ whole.",
  "× 360°.",
];
const BACK = sec(90, "?", "4 cm", "arc 2π cm");
const angleIs = (
  picture: Picture,
  right: string,
  others: string[],
  extra: Record<string, unknown> = {},
) =>
  pick("Find the angle.", right, others, "Part ÷ whole × 360.", {
    asks: "angle",
    picture,
    ...extra,
  });

const sectorAngle = stepped(find(CI, ANGLE), {
  method: angleMethod,
  variation: {
    relationship: "the angle as a fraction of 360°",
    unknowns: ["angle"],
    surface: ["a longer arc", "from the area", "a smaller circle"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Work backwards",
        ["**What fraction of the circle is it? Take that fraction of 360°.**"],
        BACK,
        "$2\\pi$ of $8\\pi$ is $\\frac14$: $90°$.",
      ),
      reworded(CI, ANGLE, "An arc is $\\frac14$ of the circumference. Its angle", {
        tag: "The rule",
      }),

      ...owned(CI, ANGLE, "Warm-up", "Check you remember"),

      methodCard("The method", angleMethod, BACK),
      workedOn(ANGLE, sec(150, "?", "6 cm", "arc 5π")),
      calc(
        "Your turn",
        "Find the angle.",
        sec(72, "?", "5 cm", "arc 2π cm"),
        [
          ["Circumference:", "10", "2 × π × 5.", { after: "π cm" }],
          ["Angle:", "72", "$\\frac{2\\pi}{10\\pi} \\times 360$.", { after: "°" }],
        ],
        "72°.",
      ),

      calc(
        "Practise",
        "Find the angle.",
        sec(90, "?", "6 cm", "area 9π cm²"),
        [
          ["Circle's area:", "36", "π × 6².", { after: "π cm²" }],
          ["Angle:", "90", "$\\frac{9\\pi}{36\\pi} \\times 360$.", { after: "°" }],
        ],
        "90°.",
      ),
      ...owned(CI, ANGLE, "Together", "Practise"),
      ...owned(CI, ANGLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "From the arc. Watch what changes.",
        [
          angleIs(sec(90, "?", "6 cm", "arc 3π cm"), "90°", ["45°", "180°"]),
          angleIs(sec(60, "?", "6 cm", "arc 2π cm"), "60°", ["30°", "120°"], {
            changed: "A shorter arc.",
          }),
          angleIs(sec(120, "?", "6 cm", "arc 4π cm"), "120°", ["60°", "240°"], {
            changed: "A longer arc.",
          }),
          angleIs(sec(90, "?", "4 cm", "arc 2π cm"), "90°", ["60°", "45°"], {
            changed: "A smaller circle.",
          }),
        ],
        "Arc ÷ circumference × 360.",
      ),

      questionSet(
        "Variation",
        "From the area. Watch what changes.",
        [
          angleIs(sec(90, "?", "6 cm", "area 9π cm²"), "90°", ["45°", "180°"], {
            expect: [
              "Kim finds an arc is half the circumference, then does $\\frac12 \\times 180$. Right?",
              "No",
              "A full turn is 360°: $\\frac12 \\times 360 = 180°$.",
              [["Yes", "How many degrees in a full turn?"]],
            ],
          }),
          angleIs(sec(120, "?", "6 cm", "area 12π cm²"), "120°", ["60°", "240°"], {
            changed: "More area.",
          }),
          angleIs(sec(60, "?", "6 cm", "area 6π cm²"), "60°", ["30°", "120°"], {
            changed: "Less area.",
          }),
          angleIs(sec(120, "?", "3 cm", "area 3π cm²"), "120°", ["30°", "60°"], {
            changed: "A smaller circle.",
          }),
        ],
        "Area ÷ πr² × 360.",
      ),
      own(CI, ANGLE, "Spot the mistake"),

      own(CI, ANGLE, "Exit check"),

      reworded(
        CI,
        ANGLE,
        "“Radius 6 cm, arc length 5π cm. Find the angle.”",
        {
          tag: "Real life",
          title: "A fan opens to this arc. Find its angle.",
          picture: sec(150, "?", "6 cm", "arc 5π cm"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**What fraction of the circle is it? Take that fraction of 360°.**"],
        BACK,
        [
          "**What fraction of the circle is it? Take that fraction of 360°.**",
          "Arc ÷ $2\\pi r$, or area ÷ $\\pi r^2$.",
          "Multiply by 360, not 180.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfCirclesStepped: [string, UnitLesson[]][] = [
  [PARTS, [parts]],
  [CA, [circumferenceArea]],
  [COMP, [composite]],
  [SPH, [spheres]],
  [CONES, [cones]],
  [ARCS, [arcs]],
  [SECT, [sectors]],
  [ANGLE, [sectorAngle]],
];
