// GCSE Foundation, "Area and volume", on the stepped template (docs/proposals/lesson-stepped.md):
// areas of triangles and trapezia, volumes of prisms, and volumes of cylinders. Every shape and
// solid is drawn with its measurements on it.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfArea } from "./gf-area.ts";
import { trap, tri } from "./redraft-gf-formulae.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { UnitLesson } from "./types.ts";
import { cylinder, prism } from "./y9-similarity.ts";

const AR = gfArea;
const SHAPES = "A measurement fact: the numbers are the picture.";
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Triangles, parallelograms and trapezia.

const AREA = "gf-area/area";
const areaMethod = [
  "Pick the formula: triangle, parallelogram or trapezium.",
  "Use the perpendicular height, not the slant.",
  "Work it out; give the units squared.",
];
const TRAP = trap("3 cm", "7 cm", "4 cm");

const area = stepped(find(AR, AREA), {
  method: areaMethod,
  variation: {
    relationship: "area from a base and a perpendicular height",
    unknowns: ["area"],
    surface: ["triangles", "trapezia", "taller or wider"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three formulae",
        ["**Every area formula uses the perpendicular height.**"],
        TRAP,
        "$\\frac12(3 + 7) \\times 4 = 20$ cm².",
      ),
      reworded(AR, AREA, "Why the trapezium formula works", { tag: "The rule" }),

      ...owned(AR, AREA, "Warm-up", "Check you remember"),

      methodCard("The method", areaMethod, TRAP),
      workedFrom(AR, AREA),
      calc(
        "Your turn",
        "Find the area.",
        tri("14 cm", "5 cm"),
        [
          ["Half the base:", "7", "Halve it."],
          ["Area:", "35", "Times the height.", { after: "cm²" }],
        ],
        "35 cm².",
      ),

      calc(
        "Practise",
        "Find the area.",
        trap("6 cm", "10 cm", "5 cm"),
        [
          ["Half of $a + b$:", "8", "Add the parallel sides, halve."],
          ["Area:", "40", "Times the height.", { after: "cm²" }],
        ],
        "40 cm².",
      ),
      ...owned(AR, AREA, "Together", "Practise"),
      ...owned(AR, AREA, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the area. Watch what changes.",
        [
          ask("Find the area.", "24", "Half the base × height.", "24 cm².", {
            asks: "area",
            unit: "cm²",
            picture: tri("8 cm", "6 cm"),
          }),
          ask("Find the area now.", "36", "Half of a + b, × height.", "36 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "A trapezium.",
            picture: trap("4 cm", "8 cm", "6 cm"),
          }),
          ask("And this one?", "36", "Half the base × height.", "36 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "Taller.",
            picture: tri("8 cm", "9 cm"),
          }),
          ask("And this?", "24", "Half the base × height.", "24 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "Longer and flatter.",
            picture: tri("16 cm", "3 cm"),
          }),
        ],
        "The same area can come from different shapes.",
      ),

      questionSet(
        "Variation",
        "Find the area. Watch what changes.",
        [
          ask("Find the area.", "30", "Half of a + b, × height.", "30 cm².", {
            asks: "area",
            unit: "cm²",
            picture: trap("2 cm", "8 cm", "6 cm"),
            expect: [
              "Ola adds the parallel sides but forgets to halve. Right?",
              "No",
              "Halve $(a + b)$ first: a trapezium isn't a rectangle.",
              [["Yes", "Would the trapezium fill the rectangle?"]],
            ],
          }),
          ask("Find the area now.", "36", "Half of a + b, × height.", "36 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "A wider top.",
            picture: trap("4 cm", "8 cm", "6 cm"),
          }),
          ask("And this one?", "15", "Half of a + b, × height.", "15 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "Half the height.",
            picture: trap("2 cm", "8 cm", "3 cm"),
          }),
          ask("And this?", "42", "Half of a + b, × height.", "42 cm².", {
            asks: "area",
            unit: "cm²",
            changed: "A longer base.",
            picture: trap("2 cm", "12 cm", "6 cm"),
          }),
        ],
        "Halve the sum of the parallel sides.",
      ),
      own(AR, AREA, "Spot the mistake"),

      own(AR, AREA, "Exit check"),

      reworded(
        AR,
        AREA,
        "“How many bags of compost (5 m² each) for the 32 m² bed?”",
        { tag: "Real life", title: "A 32 m² bed; a bag covers 5 m². Bags?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Every area formula uses the perpendicular height.**"],
        TRAP,
        [
          "**Every area formula uses the perpendicular height.**",
          "Triangle $\\frac12 bh$; parallelogram $bh$; trapezium $\\frac12(a + b)h$.",
          "Round bags up: 6.4 bags means 7.",
        ],
        DONE,
      ),
    ],
    SHAPES,
  ),
});

// ---------------------------------------------------------------------------------------------
// Volume of prisms.

const PRISMS = "gf-area/prisms";
const prismMethod = [
  "Find the cross-section: the shape that repeats.",
  "Work out its area.",
  "Multiply by the length. Units cubed.",
];
const WEDGE = prism("3 cm", "4 cm", "5 cm", "10 cm");

const prisms = stepped(find(AR, PRISMS), {
  method: prismMethod,
  variation: {
    relationship: "volume = cross-section × length",
    unknowns: ["volume", "cross-section"],
    surface: ["longer prisms", "bigger ends", "working backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Layers of the cross-section",
        ["**Volume of a prism = area of the cross-section × length.**"],
        WEDGE,
        "The end is $\\frac12 \\times 3 \\times 4 = 6$ cm²; × 10 = 60 cm³.",
      ),
      reworded(AR, PRISMS, "Stack the layers", { tag: "The rule" }),

      ...owned(AR, PRISMS, "Warm-up", "Check you remember"),

      methodCard("The method", prismMethod, WEDGE),
      workedFrom(AR, PRISMS),
      calc(
        "Your turn",
        "Find the volume.",
        prism("6 cm", "5 cm", "7.8 cm", "12 cm"),
        [
          ["Cross-section:", "15", "Half of base × height.", { after: "cm²" }],
          ["Volume:", "180", "Times the length.", { after: "cm³" }],
        ],
        "180 cm³.",
      ),

      calc(
        "Practise",
        "Cross-section 32 cm², volume 256 cm³. Length?",
        undefined,
        [["$256 \\div 32 =$", "8", "Volume ÷ cross-section.", { after: "cm" }]],
        "8 cm.",
      ),
      ...owned(AR, PRISMS, "Together", "Practise"),
      reworded(AR, PRISMS, "Trapezium cross-section 18 cm², length 10 cm. Volume?", {
        tag: "Practise",
      }),
      reworded(AR, PRISMS, "A tent: triangle end, base 2 m, height 1.5 m, length 3 m. Volume?", {
        tag: "Practise",
        title: "Find the tent's volume.",
        picture: prism("2 m", "1.5 m", "1.8 m", "3 m"),
      }),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          ask("Cross-section 12 cm², length 5 cm. Volume?", "60", "12 × 5.", "60 cm³.", {
            asks: "volume",
            unit: "cm³",
          }),
          ask("Cross-section 12 cm², length 10 cm. Volume?", "120", "12 × 10.", "120 cm³.", {
            asks: "volume",
            unit: "cm³",
            changed: "Twice as long.",
          }),
          ask("Volume 120 cm³, length 10 cm. Cross-section?", "12", "120 ÷ 10.", "12 cm².", {
            asks: "cross-section",
            unit: "cm²",
            changed: "Backwards.",
          }),
          ask("Triangle end: base 6, height 4. Length 5. Volume?", "60", "12 × 5.", "60 cm³.", {
            asks: "volume",
            unit: "cm³",
            changed: "Find the end first.",
          }),
        ],
        "Cross-section × length, or divide to go back.",
      ),

      questionSet(
        "Variation",
        "Find the volume. Watch what changes.",
        [
          ask("Find the volume.", "120", "Half of 6 × 4, × 10.", "120 cm³.", {
            asks: "volume",
            unit: "cm³",
            picture: prism("6 cm", "4 cm", "7.2 cm", "10 cm"),
            expect: [
              "Kai forgets to halve for the triangle end. Right?",
              "No",
              "A triangle is half of base × height.",
              [["Yes", "Is the end a rectangle?"]],
            ],
          }),
          ask("Find the volume now.", "60", "Half as long.", "60 cm³.", {
            asks: "volume",
            unit: "cm³",
            changed: "Half as long.",
            picture: prism("6 cm", "4 cm", "7.2 cm", "5 cm"),
          }),
          ask("And this one?", "120", "Half of 6 × 8, × 5.", "120 cm³.", {
            asks: "volume",
            unit: "cm³",
            changed: "Taller.",
            picture: prism("6 cm", "8 cm", "10 cm", "5 cm"),
          }),
          ask("And this?", "120", "Half of 3 × 4, × 20.", "120 cm³.", {
            asks: "volume",
            unit: "cm³",
            changed: "A smaller end, longer.",
            picture: prism("3 cm", "4 cm", "5 cm", "20 cm"),
          }),
        ],
        "The slant side isn't used.",
      ),
      own(AR, PRISMS, "Spot the mistake"),

      own(AR, PRISMS, "Exit check"),

      reworded(
        AR,
        PRISMS,
        "“The bar's triangular end has base 4 cm and height 3 cm; it's 20 cm long. Work out its volume.”",
        {
          tag: "Real life",
          title: "Find the chocolate bar's volume.",
          picture: prism("4 cm", "3 cm", "5 cm", "20 cm"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Volume of a prism = area of the cross-section × length.**"],
        WEDGE,
        [
          "**Volume of a prism = area of the cross-section × length.**",
          "Triangle end: halve base × height.",
          "Units are cubed: cm³.",
        ],
        DONE,
      ),
    ],
    SHAPES,
  ),
});

// ---------------------------------------------------------------------------------------------
// Volume of cylinders.

const CYLINDERS = "gf-area/cylinders";
const cylMethod = [
  "Find the radius: halve a diameter.",
  "Circle area: πr².",
  "Multiply by the height.",
];
const TIN = cylinder("5 cm", "4 cm");

const cylinders = stepped(find(AR, CYLINDERS), {
  method: cylMethod,
  variation: {
    relationship: "V = πr²h",
    unknowns: ["volume"],
    surface: ["taller", "wider", "diameters", "working backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A circular prism",
        ["**A cylinder is a circular prism: V = πr²h.**"],
        TIN,
        "$\\pi \\times 25 \\times 4 = 100\\pi$ cm³.",
      ),

      ...owned(AR, CYLINDERS, "Warm-up", "Check you remember"),

      methodCard("The method", cylMethod, TIN),
      workedFrom(AR, CYLINDERS),
      calc(
        "Your turn",
        "Find the volume, in terms of π.",
        cylinder("2 cm", "7 cm"),
        [
          ["$r^2 =$", "4", "The radius squared."],
          ["Volume: $?\\pi$, ? =", "28", "Times the height."],
        ],
        "$28\\pi$ cm³.",
      ),

      calc(
        "Practise",
        "Find the volume, in terms of π.",
        cylinder("6 cm", "5 cm", true),
        [
          ["Radius:", "3", "Half the diameter."],
          ["Volume: $?\\pi$, ? =", "45", "$3^2 \\times 5$."],
        ],
        "$45\\pi$ cm³.",
      ),
      ...owned(AR, CYLINDERS, "Together", "Practise"),
      ...owned(AR, CYLINDERS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "In terms of π. Watch what changes.",
        [
          pick("The volume?", "$36\\pi$", ["$12\\pi$", "$24\\pi$"], "$3^2 \\times 4$.", {
            asks: "volume",
            picture: cylinder("3 cm", "4 cm"),
          }),
          pick("The volume now?", "$72\\pi$", ["$36\\pi$", "$24\\pi$"], "Twice as tall.", {
            asks: "volume",
            changed: "Twice as tall.",
            picture: cylinder("3 cm", "8 cm"),
          }),
          pick("And this one?", "$144\\pi$", ["$72\\pi$", "$48\\pi$"], "$6^2 \\times 4$.", {
            asks: "volume",
            changed: "Twice the radius.",
            picture: cylinder("6 cm", "4 cm"),
          }),
          pick("And this?", "$36\\pi$", ["$144\\pi$", "$24\\pi$"], "Radius 3.", {
            asks: "volume",
            changed: "A diameter.",
            picture: cylinder("6 cm", "4 cm", true),
          }),
        ],
        "Double the radius: four times the volume.",
      ),

      questionSet(
        "Variation",
        "In terms of π. Watch what changes.",
        [
          pick("The volume?", "$50\\pi$", ["$20\\pi$", "$10\\pi$"], "$5^2 \\times 2$.", {
            asks: "volume",
            picture: cylinder("5 cm", "2 cm"),
            expect: [
              "Mia doubles the radius instead of squaring it. Right?",
              "No",
              "$r^2$ means $r \\times r$.",
              [["Yes", "What does squared mean?"]],
            ],
          }),
          pick("The volume now?", "$100\\pi$", ["$50\\pi$", "$40\\pi$"], "Twice as tall.", {
            asks: "volume",
            changed: "Taller.",
            picture: cylinder("5 cm", "4 cm"),
          }),
          pick("And this one?", "$50\\pi$", ["$200\\pi$", "$20\\pi$"], "Radius 5.", {
            asks: "volume",
            changed: "A diameter.",
            picture: cylinder("10 cm", "2 cm", true),
          }),
          pick("$V = 50\\pi$, $r = 5$. Height?", "2", ["10", "5"], "50 ÷ 25.", {
            asks: "volume",
            changed: "Backwards.",
          }),
        ],
        "Square the radius; never double it.",
      ),
      own(AR, CYLINDERS, "Spot the mistake"),

      own(AR, CYLINDERS, "Exit check"),

      reworded(
        AR,
        CYLINDERS,
        "“A tin has radius 4 cm and height 11 cm. Does it hold 500 cm³? Show your working.”",
        { tag: "Real life", title: "Radius 4 cm, height 11 cm. Does it hold 500 cm³?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A cylinder is a circular prism: V = πr²h.**"],
        TIN,
        [
          "**A cylinder is a circular prism: V = πr²h.**",
          "Diameter 8: use $r = 4$.",
          "$r^2$ is $r \\times r$, not $2r$.",
        ],
        DONE,
      ),
    ],
    SHAPES,
  ),
});

export const gfAreaStepped: [string, UnitLesson[]][] = [
  [AREA, [area]],
  [PRISMS, [prisms]],
  [CYLINDERS, [cylinders]],
];
