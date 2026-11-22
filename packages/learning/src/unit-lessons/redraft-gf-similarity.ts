// GCSE Foundation, "Congruence and similarity", on the stepped template
// (docs/proposals/lesson-stepped.md): how lengths, areas and volumes scale, the congruence tests,
// and missing lengths in similar shapes. Similar triangles are drawn side by side with their
// matching sides labelled; the scale-factor rules and tests are words.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfSimilarity } from "./gf-similarity.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Picture, Point, ShapePic, UnitLesson } from "./types.ts";
import { triangle } from "./y7-angles.ts";

const SIM = gfSimilarity;
const WORDS = "A rule about scale: the words are the picture.";
const p = (x: number, y: number): Point => ({ x, y });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

/** Two similar right-angled triangles side by side: base and height labelled on each. The second
 * is drawn at scale s. */
const twins = (
  small: [string | null, string | null],
  big: [string | null, string | null],
  s = 2,
): DrawingPic => {
  const one = (o: number, k: number, [base, up]: [string | null, string | null]) => {
    const [a, b, c] = [p(o, 0), p(o + 2 * k, 0), p(o, 1.5 * k)];
    const mid = p(o + 0.6 * k, 0.5 * k);
    return [
      { line: [a, b] as [Point, Point] },
      { line: [b, c] as [Point, Point] },
      { line: [c, a] as [Point, Point] },
      ...(base ? [{ side: [a, b] as [Point, Point], label: base, inside: mid }] : []),
      ...(up ? [{ side: [a, c] as [Point, Point], label: up, inside: mid }] : []),
    ];
  };
  return { kind: "drawing", items: [...one(0, 1, small), ...one(3.6, s, big)] };
};

// ---------------------------------------------------------------------------------------------
// Lengths, areas and volumes.

const RATIO = "gf-similarity/ratio";
const ratioMethod = [
  "Find the length scale factor, k.",
  "Areas: multiply by k². Volumes: by k³.",
  "Going smaller: divide instead.",
];
const NINE: Picture = { kind: "grid", cols: 3, rows: 3, shaded: 1 };

const ratio = stepped(find(SIM, RATIO), {
  method: ratioMethod,
  variation: {
    relationship: "length, area and volume scale factors",
    unknowns: ["factor"],
    surface: ["perimeters", "areas", "volumes", "fractions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Lengths, areas, volumes",
        ["**Lengths × k, areas × k², volumes × k³.**"],
        NINE,
        "Area uses two lengths; volume uses three.",
      ),
      reworded(SIM, RATIO, "Lengths are multiplied by 3. Areas are multiplied by", {
        tag: "The rule",
      }),

      ...owned(SIM, RATIO, "Warm-up", "Check you remember"),

      methodCard("The method", ratioMethod, NINE),
      workedFrom(SIM, RATIO),
      calc(
        "Your turn",
        "Similar shapes: lengths × 6.",
        undefined,
        [
          ["Areas ×", "36", "$6^2$."],
          ["Volumes ×", "216", "$6^3$."],
        ],
        "Areas × 36, volumes × 216.",
      ),

      calc(
        "Practise",
        "Similar cylinders: heights 6 cm and 24 cm.",
        undefined,
        [
          ["$k =$", "4", "24 ÷ 6."],
          ["Volumes ×", "64", "$4^3$."],
        ],
        "The big one holds 64 times as much.",
      ),
      ...owned(SIM, RATIO, "Together", "Practise"),
      reworded(SIM, RATIO, "A map scale doubles every length. A field's area on the map", {
        tag: "Practise",
      }),
      reworded(SIM, RATIO, "Two similar jugs, heights 10 cm and 30 cm. The big one holds", {
        tag: "Practise",
        title: "Similar jugs, 10 cm and 30 cm tall. The big one holds",
      }),
      questionSet(
        "Practise",
        "Lengths × 3. Watch what changes.",
        [
          ask("Perimeter ×", "3", "A length.", "3.", { asks: "factor" }),
          ask("Area ×", "9", "$3^2$.", "9.", { asks: "factor", changed: "Two lengths." }),
          ask("Volume ×", "27", "$3^3$.", "27.", { asks: "factor", changed: "Three lengths." }),
          ask("Surface area ×", "9", "Still an area.", "9.", {
            asks: "factor",
            changed: "An area again.",
          }),
        ],
        "Count the lengths it uses.",
      ),

      questionSet(
        "Variation",
        "Find the area factor. Watch what changes.",
        [
          ask("Lengths × 3", "9", "$3^2$.", "9.", {
            asks: "factor",
            expect: [
              "Lengths × 3: Zak says areas × 6. Right?",
              "No",
              "Areas multiply by $3^2 = 9$, not $3 \\times 2$.",
              [["Yes", "Square it; don't double it."]],
            ],
          }),
          ask("Lengths × 7", "49", "$7^2$.", "49.", { asks: "factor", changed: "Bigger k." }),
          ask("Lengths × ½", ["0.25", "1/4", "¼"], "$(\\frac12)^2$.", "¼.", {
            asks: "factor",
            changed: "Smaller.",
          }),
          ask("Lengths × 10", "100", "$10^2$.", "100.", {
            asks: "factor",
            changed: "Ten times.",
          }),
        ],
        "Areas: square the length factor.",
      ),
      reworded(SIM, RATIO, "Where did it go wrong?", {
        text: "Rugs 1 m and 3 m long, priced by area. Small: £20.",
      }),

      own(SIM, RATIO, "Exit check"),

      reworded(
        SIM,
        RATIO,
        "“Each length of a box is doubled. How many times more does it hold?”",
        { tag: "Real life", title: "Each length doubles. How many times more does it hold?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Lengths × k, areas × k², volumes × k³.**"],
        NINE,
        [
          "**Lengths × k, areas × k², volumes × k³.**",
          "Double the lengths: areas × 4, volumes × 8.",
          "Square for area; don't double.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Congruent triangles.

const CONGRUENCE = "gf-similarity/congruence";
const congMethod = [
  "List the matching sides and angles.",
  "Match them to SSS, SAS, ASA or RHS.",
  "Write each fact with a reason, then the test.",
];
const TESTS: Picture = {
  kind: "table",
  head: ["Test", "What matches"],
  rows: [
    ["SSS", "three sides"],
    ["SAS", "two sides and the angle between"],
    ["ASA", "two angles and a side"],
    ["RHS", "right angle, hypotenuse, a side"],
  ],
};
const named = (t: ShapePic, names: string[]): ShapePic => ({ ...t, names });

const congruence = stepped(find(SIM, CONGRUENCE), {
  method: congMethod,
  variation: {
    relationship: "the facts that prove two triangles identical",
    unknowns: ["test", "congruent"],
    surface: ["angles only", "where the angle is", "right angles"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Four tests",
        ["**SSS, SAS, ASA or RHS proves two triangles congruent.**"],
        TESTS,
        "Matching angles alone (AAA) only prove similar.",
      ),
      reworded(SIM, CONGRUENCE, "Sides 5 and 7 with 40° between them, in both triangles. Test?", {
        tag: "The rule",
      }),

      ...owned(SIM, CONGRUENCE, "Warm-up", "Check you remember"),

      methodCard("The method", congMethod, TESTS),
      workedFrom(SIM, CONGRUENCE),
      calc(
        "Your turn",
        "ABC and DEF are congruent.",
        named(
          {
            kind: "shape",
            points: [p(0, 0), p(4, 0), p(1, 3)],
            sides: ["7 cm", "8 cm", "5 cm"],
          },
          ["A", "B", "C"],
        ),
        [
          ["DE =", "7", "It matches AB.", { after: "cm" }],
          ["EF =", "8", "It matches BC.", { after: "cm" }],
        ],
        "Matching sides are equal.",
      ),

      calc(
        "Practise",
        "PQR and XYZ are congruent.",
        named(triangle(50, 60, ["50°", "60°", null]), ["P", "Q", "R"]),
        [
          ["∠X =", "50", "It matches ∠P.", { after: "°" }],
          ["∠Z =", "70", "Angles add to 180°.", { after: "°" }],
        ],
        "Matching angles are equal.",
      ),
      reworded(SIM, CONGRUENCE, "Which test?", {
        tag: "Practise",
        start: "Both: angles 50° and 60°, with 4 cm between them.",
      }),
      reworded(
        SIM,
        CONGRUENCE,
        "Two right-angled triangles share hypotenuse 13 cm and a side of 5 cm.",
        {
          tag: "Practise",
          title: "Right-angled triangles: both have hypotenuse 13 cm, side 5 cm.",
        },
      ),
      ...owned(SIM, CONGRUENCE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which test? Watch what changes.",
        [
          pick("Three pairs of sides equal", "SSS", ["SAS", "ASA"], "Side, side, side.", {
            asks: "test",
          }),
          pick("Two sides and the angle between", "SAS", ["SSS", "ASA"], "Side, angle, side.", {
            asks: "test",
            changed: "An angle instead of a side.",
          }),
          pick("Two angles and a side", "ASA", ["SAS", "RHS"], "Angle, side, angle.", {
            asks: "test",
            changed: "Two angles.",
          }),
          pick(
            "Right angle, hypotenuse and a side",
            "RHS",
            ["SAS", "SSS"],
            "Right, hypotenuse, side.",
            {
              asks: "test",
              changed: "A right angle.",
            },
          ),
        ],
        "Name the test by what matches.",
      ),

      questionSet(
        "Variation",
        "Congruent? Watch what changes.",
        [
          pick(
            "All three angles equal",
            "Not necessarily",
            ["Yes, by AAA"],
            "One could be bigger.",
            {
              asks: "congruent",
              expect: [
                "Zara says matching angles prove congruence. Right?",
                "No",
                "Same angles, but one could be bigger: only similar.",
                [["Yes", "Could one be an enlargement?"]],
              ],
            },
          ),
          pick(
            "Two angles and a side equal",
            "Yes, by ASA",
            ["Not necessarily"],
            "A side fixes the size.",
            {
              asks: "congruent",
              changed: "A side too.",
            },
          ),
          pick(
            "Two sides, and an angle not between them",
            "Not necessarily",
            ["Yes, by SAS"],
            "SAS needs the angle between.",
            { asks: "congruent", changed: "The angle moved." },
          ),
          pick(
            "Two sides and the angle between",
            "Yes, by SAS",
            ["Not necessarily"],
            "The angle is between.",
            {
              asks: "congruent",
              changed: "The angle between.",
            },
          ),
        ],
        "Angles alone never fix the size.",
      ),
      own(SIM, CONGRUENCE, "Spot the mistake"),

      own(SIM, CONGRUENCE, "Exit check"),

      reworded(
        SIM,
        CONGRUENCE,
        "“AB = DE, BC = EF and AC = DF. Prove the triangles are congruent.”",
        { tag: "Real life", title: "AB = DE, BC = EF, AC = DF. Why congruent?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**SSS, SAS, ASA or RHS proves two triangles congruent.**"],
        TESTS,
        [
          "**SSS, SAS, ASA or RHS proves two triangles congruent.**",
          "SAS needs the angle between the sides.",
          "AAA proves similar, not congruent.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Similar shapes.

const SIMILAR = "gf-similarity/similar";
const simMethod = [
  "Find a pair of matching sides.",
  "Scale factor = big ÷ small.",
  "Multiply to go bigger; divide to go smaller.",
];
const DOUBLE = twins(["4 cm", "3 cm"], ["8 cm", "6 cm"]);

const similar = stepped(find(SIM, SIMILAR), {
  method: simMethod,
  variation: {
    relationship: "matching sides share one scale factor",
    unknowns: ["length"],
    surface: ["whole scale factors", "decimals", "going smaller"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Similar shapes",
        ["**Find the scale factor from matching sides, then multiply.**"],
        DOUBLE,
        "Scale factor 2: every length doubles; the angles stay.",
      ),
      reworded(SIM, SIMILAR, "Sides 4 cm and 10 cm match. Scale factor small to big?", {
        tag: "The rule",
      }),

      ...owned(SIM, SIMILAR, "Warm-up", "Check you remember"),

      methodCard("The method", simMethod, DOUBLE),
      workedFrom(SIM, SIMILAR),
      calc(
        "Your turn",
        "The triangles are similar. Find x.",
        twins(["5 cm", "4 cm"], ["15 cm", "x"], 2.6),
        [
          ["Scale factor:", "3", "Big ÷ small."],
          ["x =", "12", "Multiply.", { after: "cm" }],
        ],
        "x = 12 cm.",
      ),

      calc(
        "Practise",
        "The triangles are similar. Find x.",
        twins(["6 cm", "x"], ["9 cm", "6 cm"], 1.5),
        [
          ["Scale factor:", "1.5", "Big ÷ small."],
          ["x =", "4", "Divide: it's on the small one.", { after: "cm" }],
        ],
        "x = 4 cm.",
      ),
      ...owned(SIM, SIMILAR, "Together", "Practise"),
      reworded(SIM, SIMILAR, "Similar rectangles: 5 cm wide ↔ 20 cm wide. A 3 cm side becomes?", {
        tag: "Practise",
        title: "Rectangles: 5 cm ↔ 20 cm wide. A 3 cm side becomes?",
      }),
      reworded(SIM, SIMILAR, "Similar triangles: 10 cm ↔ 4 cm. A 7.5 cm side becomes?", {
        tag: "Practise",
      }),
      questionSet(
        "Practise",
        "Similar triangles. Find x. Watch what changes.",
        [
          ask("Find x.", "6", "Scale factor 2.", "6 cm.", {
            asks: "length",
            unit: "cm",
            picture: twins(["4 cm", "3 cm"], ["8 cm", "x"]),
          }),
          ask("Find x now.", "9", "Scale factor 3.", "9 cm.", {
            asks: "length",
            unit: "cm",
            changed: "A bigger scale factor.",
            picture: twins(["4 cm", "3 cm"], ["12 cm", "x"], 2.6),
          }),
          ask("And now?", "7.5", "Scale factor 2.5.", "7.5 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Not a whole number.",
            picture: twins(["4 cm", "3 cm"], ["10 cm", "x"], 2.3),
          }),
          ask("Find x on the small one.", "3", "Divide by 3.", "3 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Find the small side.",
            picture: twins(["4 cm", "x"], ["12 cm", "9 cm"], 2.6),
          }),
        ],
        "One scale factor fits every pair.",
      ),

      questionSet(
        "Variation",
        "Similar triangles. Find x. Watch what changes.",
        [
          ask("Find x.", "4", "Scale factor 2.", "4 cm.", {
            asks: "length",
            unit: "cm",
            picture: twins(["3 cm", "2 cm"], ["6 cm", "x"]),
            expect: [
              "3 cm became 6 cm, so Nia adds 3 to get x. Right?",
              "No",
              "It doubled: × 2, so x = 4.",
              [["Yes", "Add or multiply?"]],
            ],
          }),
          ask("Find x now.", "6", "Scale factor 3.", "6 cm.", {
            asks: "length",
            unit: "cm",
            changed: "× 3.",
            picture: twins(["3 cm", "2 cm"], ["9 cm", "x"], 2.6),
          }),
          ask("And now?", "3", "Scale factor 1.5.", "3 cm.", {
            asks: "length",
            unit: "cm",
            changed: "× 1.5.",
            picture: twins(["3 cm", "2 cm"], ["4.5 cm", "x"], 1.5),
          }),
          ask("And this one?", "1", "Scale factor ½.", "1 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Smaller.",
            picture: twins(["3 cm", "2 cm"], ["1.5 cm", "x"], 0.6),
          }),
        ],
        "Similar shapes multiply; they never add.",
      ),
      own(SIM, SIMILAR, "Spot the mistake"),

      own(SIM, SIMILAR, "Exit check"),

      reworded(
        SIM,
        SIMILAR,
        "“A 2 m pole casts a 3 m shadow; a tree casts a 15 m shadow. Work out the height of the tree.”",
        { tag: "Real life", title: "Pole 2 m, shadow 3 m. Tree's shadow 15 m. Its height?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the scale factor from matching sides, then multiply.**"],
        DOUBLE,
        [
          "**Find the scale factor from matching sides, then multiply.**",
          "Scale factor = big ÷ small.",
          "3 cm to 5 cm is × $\\frac53$, not + 2.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    WORDS,
  ),
});

export const gfSimilarityStepped: [string, UnitLesson[]][] = [
  [RATIO, [ratio]],
  [CONGRUENCE, [congruence]],
  [SIMILAR, [similar]],
];
