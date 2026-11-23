// GCSE Higher, "Trigonometry", on the stepped template (docs/proposals/lesson-stepped.md): the
// sine rule, the cosine rule, choosing a method, trigonometry and Pythagoras in 3D, and area as
// ½ab sin C. Every triangle question is asked on its triangle (or cuboid): the sides and angles
// are labelled, and the words say only what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { areaPic, box, cosineRule, ghTrigonometry, sineRule, triangle } from "./gh-trigonometry.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { tri } from "./y9-trigonometry.ts";

const TR = ghTrigonometry;
const NUMBER = "A calculation: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const cuboid = (w: number, d: number, h: number): Picture => ({
  kind: "cuboid",
  w,
  d,
  h,
  labels: [`${w} cm`, `${d} cm`, `${h} cm`],
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// The sine rule.

const SINE = "gh-trigonometry/sine-rule";
const sineMethod = [
  "Label sides by the opposite angle: $a$ faces A.",
  "Find a side with its opposite angle: a pair.",
  "$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$; solve.",
];
const SINE_RULE = maths("\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}");
const side = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find BC, to 3 s.f.", right, others, "Pair each side with its opposite angle.", {
    asks: "side",
    picture,
    ...extra,
  });
const angle = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find angle A, to 1 d.p.", right, others, "$\\sin A = \\frac{a \\sin B}{b}$.", {
    asks: "angle",
    picture,
    ...extra,
  });

const sineRuleLesson = stepped(find(TR, SINE), {
  method: sineMethod,
  variation: {
    relationship: "sides over the sines of their opposite angles",
    unknowns: ["side", "angle"],
    surface: ["a longer side", "a bigger angle", "a new pair"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Pairs of opposites",
        ["**Each side over the sine of its opposite angle: they're all equal.**"],
        SINE_RULE,
        "You need one full pair: a side and the angle opposite it.",
      ),
      reworded(TR, SINE, "AC = 8 cm is side", {
        tag: "The rule",
        title: "Which letter names side AC?",
      }),

      ...owned(TR, SINE, "Warm-up", "Check you remember"),

      methodCard("The method", sineMethod, SINE_RULE),
      workedFrom(TR, SINE),
      calc(
        "Your turn",
        "Find BC, to 3 s.f.",
        triangle(["", "a", "10 cm"], ["30°", "80°", ""]),
        [
          [
            "$a = \\frac{10 \\sin 30°}{\\sin 80°} =$",
            "5.08",
            "Multiply, then divide.",
            { after: "cm" },
          ],
        ],
        "BC = 5.08 cm.",
      ),

      calc(
        "Practise",
        "Find angle A, to 1 d.p.",
        triangle(["", "5 cm", "8 cm"], ["?", "65°", ""]),
        [
          ["$\\sin A = \\frac{5 \\sin 65°}{8}$, to 4 d.p.:", "0.5664", "5 × sin 65° ÷ 8."],
          ["$A =$", "34.5", "$\\sin^{-1}$.", { after: "°" }],
        ],
        "A = 34.5°.",
      ),
      ...owned(TR, SINE, "Together", "Practise"),
      ...owned(TR, SINE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find a side. Watch what changes.",
        [
          side(sineRule, "5.67 cm", ["11.3 cm", "6.04 cm"]),
          side(
            triangle(["", "a", "12 cm"], ["40°", "65°", ""]),
            "8.51 cm",
            ["5.67 cm", "16.9 cm"],
            {
              changed: "A longer side.",
            },
          ),
          side(triangle(["", "a", "8 cm"], ["50°", "70°", ""]), "6.52 cm", ["9.81 cm", "5.67 cm"], {
            changed: "New angles.",
          }),
          side(
            triangle(["", "a", "10 cm"], ["30°", "80°", ""]),
            "5.08 cm",
            ["19.7 cm", "5.00 cm"],
            {
              changed: "A new pair.",
            },
          ),
        ],
        "Side ÷ sin of its opposite angle, both sides.",
      ),

      questionSet(
        "Variation",
        "Find an angle. Watch what changes.",
        [
          angle(triangle(["", "5 cm", "8 cm"], ["?", "65°", ""]), "34.5°", ["65°", "28.3°"], {
            expect: [
              "Ben writes $a = \\frac{8 \\sin 65°}{\\sin 40°}$. Right?",
              "No",
              "$a$ pairs with A: $a = \\frac{8 \\sin 40°}{\\sin 65°}$.",
              [["Yes", "Which angle is opposite $a$?"]],
            ],
          }),
          angle(triangle(["", "6 cm", "8 cm"], ["?", "65°", ""]), "42.8°", ["34.5°", "48.6°"], {
            changed: "A longer $a$.",
          }),
          angle(triangle(["", "6 cm", "10 cm"], ["?", "65°", ""]), "32.9°", ["42.8°", "36.9°"], {
            changed: "A longer $b$.",
          }),
          angle(triangle(["", "6 cm", "10 cm"], ["?", "80°", ""]), "36.2°", ["32.9°", "80°"], {
            changed: "A bigger angle B.",
          }),
        ],
        "Sines on top to find an angle.",
      ),
      own(TR, SINE, "Spot the mistake"),

      own(TR, SINE, "Exit check"),

      reworded(
        TR,
        SINE,
        "“Find BC to 3 significant figures.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Each side over the sine of its opposite angle: they're all equal.**"],
        SINE_RULE,
        [
          "**Each side over the sine of its opposite angle: they're all equal.**",
          "Side $a$ faces angle A.",
          "Finding an angle: put the sines on top.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// The cosine rule.

const COS = "gh-trigonometry/cosine-rule";
const cosMethod = [
  "A is the angle between $b$ and $c$, opposite $a$.",
  "Side: $a^2 = b^2 + c^2 - 2bc \\cos A$.",
  "Angle: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.",
];
const COS_RULE = maths("a^2 = b^2 + c^2 - 2bc \\cos A");
const third = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find BC, to 3 s.f.", right, others, "Multiply $2bc \\cos A$ first.", {
    asks: "side",
    picture,
    ...extra,
  });
const largest = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find angle A, to 1 d.p.", right, others, "$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.", {
    asks: "angle",
    picture,
    ...extra,
  });

const cosineRuleLesson = stepped(find(TR, COS), {
  method: cosMethod,
  variation: {
    relationship: "Pythagoras with a correction",
    unknowns: ["side", "angle"],
    surface: ["a right angle", "obtuse", "acute"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Pythagoras, adjusted",
        ["**Two sides and the angle between them give the third side.**"],
        COS_RULE,
        "At 90°, cos A = 0: it's just Pythagoras.",
      ),
      reworded(TR, COS, "Use the cosine rule when you know", { tag: "The rule" }),

      ...owned(TR, COS, "Warm-up", "Check you remember"),

      methodCard("The method", cosMethod, COS_RULE),
      workedFrom(TR, COS),
      calc(
        "Your turn",
        "Find BC.",
        triangle(["10 cm", "?", "6 cm"], ["120°", "", ""]),
        [
          ["$a^2 = 36 + 100 - 120 \\cos 120° =$", "196", "cos 120° = −0.5."],
          ["$a =$", "14", "√196.", { after: "cm" }],
        ],
        "BC = 14 cm.",
      ),

      calc(
        "Practise",
        "Find angle A, to 1 d.p.",
        triangle(["6 cm", "8 cm", "5 cm"], ["?", "", ""]),
        [
          ["$\\cos A = \\frac{25 + 36 - 64}{60} =$", "-0.05", "−3 ÷ 60."],
          ["$A =$", "92.9", "$\\cos^{-1}$.", { after: "°" }],
        ],
        "A = 92.9°: obtuse, as cos A is negative.",
      ),
      ...owned(TR, COS, "Together", "Practise"),
      ...owned(TR, COS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find a side. Watch what changes.",
        [
          third(cosineRule, "6.24 cm", ["2 cm", "8.60 cm"]),
          third(triangle(["7 cm", "?", "5 cm"], ["90°", "", ""]), "8.60 cm", ["6.24 cm", "12 cm"], {
            changed: "A right angle.",
          }),
          third(
            triangle(["7 cm", "?", "5 cm"], ["120°", "", ""]),
            "10.4 cm",
            ["6.24 cm", "8.60 cm"],
            {
              changed: "Obtuse.",
            },
          ),
          third(triangle(["8 cm", "?", "5 cm"], ["60°", "", ""]), "7 cm", ["9.43 cm", "6.24 cm"], {
            changed: "A longer side.",
          }),
        ],
        "A bigger angle makes a longer opposite side.",
      ),

      questionSet(
        "Variation",
        "Find angle A. Watch what changes.",
        [
          largest(triangle(["5 cm", "7 cm", "4 cm"], ["?", "", ""]), "101.5°", ["78.5°", "44.4°"], {
            expect: [
              "For cos A, Leo writes $\\frac{4^2 + 5^2 + 7^2}{2(4)(5)}$. Right?",
              "No",
              "Subtract the opposite side: $\\frac{16 + 25 - 49}{40}$.",
              [["Yes", "Can a cosine be more than 1?"]],
            ],
          }),
          largest(triangle(["6 cm", "8 cm", "5 cm"], ["?", "", ""]), "92.9°", ["87.1°", "101.5°"], {
            changed: "New sides.",
          }),
          largest(triangle(["5 cm", "7 cm", "3 cm"], ["?", "", ""]), "120°", ["60°", "101.5°"], {
            changed: "More obtuse.",
          }),
          largest(triangle(["8 cm", "7 cm", "5 cm"], ["?", "", ""]), "60°", ["120°", "92.9°"], {
            changed: "Acute.",
          }),
        ],
        "Negative cosine: obtuse angle.",
      ),
      own(TR, COS, "Spot the mistake"),

      own(TR, COS, "Exit check"),

      reworded(
        TR,
        COS,
        "“Find BC.” To 3 s.f.",
        { tag: "Real life", picture: cosineRule },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Two sides and the angle between them give the third side.**"],
        COS_RULE,
        [
          "**Two sides and the angle between them give the third side.**",
          "Angle: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.",
          "Multiply $2bc \\cos A$ before subtracting.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Choosing a method for any triangle.

const ANY = "gh-trigonometry/any-triangle";
const anyMethod = [
  "A right angle? Pythagoras or SOH CAH TOA.",
  "A side and its opposite angle? Sine rule.",
  "No pair? Cosine rule.",
];
const CHOICES = ["SOH CAH TOA", "Sine rule", "Cosine rule"];
const choose = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "Which method finds the marked side or angle?",
    right,
    CHOICES.filter((c) => c !== right),
    "Right angle? A pair? Neither?",
    { asks: "method", picture, ...extra },
  );
const SAS = triangle(["6 cm", "x", "9 cm"], ["50°", "", ""]);
const ASA = triangle(["", "x", "10 cm"], ["35°", "80°", ""]);
const SSS = triangle(["5 cm", "7 cm", "8 cm"], ["?", "", ""]);
const RIGHT = tri({ deg: 35, angle: "35°", hyp: "10 cm", opp: "x" });

const anyTriangle = stepped(find(TR, ANY), {
  method: anyMethod,
  variation: {
    relationship: "the facts given choose the method",
    unknowns: ["method", "length"],
    surface: ["a pair", "three sides", "a right angle"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A decision",
        ["**Right angle: SOH CAH TOA. A pair: sine rule. No pair: cosine rule.**"],
        SAS,
        "Here the angle sits between two sides: cosine rule.",
      ),
      reworded(TR, ANY, "Sides 6 and 9, angle 50° between them. Find the third side.", {
        tag: "The rule",
        title: "Which method finds the third side?",
        picture: SAS,
      }),

      ...owned(TR, ANY, "Warm-up", "Check you remember"),

      methodCard("The method", anyMethod, SAS),
      workedFrom(TR, ANY),
      calc(
        "Your turn",
        "Find x, to 3 s.f.",
        ASA,
        [
          [
            "A pair, so the sine rule: $x =$",
            "5.82",
            "$\\frac{10 \\sin 35°}{\\sin 80°}$.",
            { after: "cm" },
          ],
        ],
        "x = 5.82 cm.",
      ),

      calc(
        "Practise",
        "Find x, to 3 s.f.",
        SAS,
        [
          ["No pair, so the cosine rule: $x^2 =$, to 1 d.p.:", "47.6", "36 + 81 − 108 cos 50°."],
          ["$x =$", "6.90", "Square root.", { after: "cm" }],
        ],
        "x = 6.90 cm.",
      ),
      ...owned(TR, ANY, "Together", "Practise"),
      ...owned(TR, ANY, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Choose the method. Watch what changes.",
        [
          choose(SAS, "Cosine rule"),
          choose(ASA, "Sine rule", { changed: "A pair." }),
          choose(SSS, "Cosine rule", { changed: "Three sides." }),
          choose(RIGHT, "SOH CAH TOA", { changed: "A right angle." }),
        ],
        "Look for a right angle first, then a pair.",
      ),

      questionSet(
        "Variation",
        "Find x, to 3 s.f. Watch what changes.",
        [
          pick("Find x.", "6.90 cm", ["11.4 cm", "4.24 cm"], "Cosine rule.", {
            asks: "length",
            picture: SAS,
            expect: [
              "Sides 5 and 7 with 40° between. Zoe uses the sine rule. Right?",
              "No",
              "40° isn't opposite either side: no pair, so the cosine rule.",
              [["Yes", "Is the 40° opposite a known side?"]],
            ],
          }),
          pick("Find x.", "5.82 cm", ["17.2 cm", "10 cm"], "Sine rule.", {
            asks: "length",
            picture: ASA,
            changed: "A pair.",
          }),
          pick("Find x.", "5.74 cm", ["8.19 cm", "7.00 cm"], "SOH CAH TOA: sin.", {
            asks: "length",
            picture: RIGHT,
            changed: "A right angle.",
          }),
          pick("Find x.", "7.52 cm", ["4.37 cm", "6.90 cm"], "Cosine rule.", {
            asks: "length",
            picture: triangle(["6 cm", "x", "9 cm"], ["56°", "", ""]),
            changed: "A wider angle.",
          }),
        ],
        "Choose first, then calculate.",
      ),
      own(TR, ANY, "Spot the mistake"),

      own(TR, ANY, "Exit check"),

      reworded(
        TR,
        ANY,
        "“How far is the ship from its start?” 3 s.f.",
        {
          tag: "Real life",
          title: "A ship sails 12 km, turns 90°, then 8 km. How far from the start?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Right angle: SOH CAH TOA. A pair: sine rule. No pair: cosine rule.**"],
        SAS,
        [
          "**Right angle: SOH CAH TOA. A pair: sine rule. No pair: cosine rule.**",
          "A pair: a side and its opposite angle.",
          "SOH CAH TOA needs a right angle.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Trigonometry in 3D.

const T3D = "gh-trigonometry/trig-3d";
const t3dMethod = [
  "Find the line's shadow on the plane.",
  "Make a right-angled triangle: line, shadow, height.",
  "Use SOH CAH TOA for the angle.",
];
const SHADOW = maths("\\tan \\theta = \\frac{\\text{height}}{\\text{shadow}}");
const tilt = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick(
    "Angle between the long diagonal and the base, to 1 d.p.",
    right,
    others,
    "Base diagonal, then tan.",
    { asks: "angle", picture, ...extra },
  );

const trig3d = stepped(find(TR, T3D), {
  method: t3dMethod,
  variation: {
    relationship: "a right-angled triangle inside a solid",
    unknowns: ["shadow", "angle"],
    surface: ["a bigger base", "a shorter box", "a taller box"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A flat triangle inside",
        ["**Find the right-angled triangle inside the solid, then use SOH CAH TOA.**"],
        box,
        "The diagonal's shadow on the base is the base diagonal.",
      ),
      reworded(TR, T3D, "The shadow of the long diagonal on the base is", {
        tag: "The rule",
        picture: box,
      }),

      ...owned(TR, T3D, "Warm-up", "Check you remember"),

      methodCard("The method", t3dMethod, SHADOW),
      workedFrom(TR, T3D),
      calc(
        "Your turn",
        "A line's shadow is 8 cm; it rises 6 cm.",
        undefined,
        [
          ["Length of the line:", "10", "√(64 + 36).", { after: "cm" }],
          ["Angle with the plane, to 1 d.p.:", "36.9", "tan⁻¹(6 ÷ 8).", { after: "°" }],
        ],
        "36.9°.",
      ),

      calc(
        "Practise",
        "Angle between the long diagonal and the base.",
        cuboid(3, 4, 5),
        [
          ["Base diagonal:", "5", "√(9 + 16).", { after: "cm" }],
          ["Angle:", "45", "tan⁻¹(5 ÷ 5).", { after: "°" }],
        ],
        "45°.",
      ),
      ...owned(TR, T3D, "Together", "Practise"),
      ...owned(TR, T3D, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The base diagonal. Watch what changes.",
        [
          pick("Find the base diagonal.", "5 cm", ["7 cm", "12 cm"], "√(3² + 4²).", {
            asks: "shadow",
            picture: box,
          }),
          pick("Find the base diagonal.", "10 cm", ["14 cm", "5 cm"], "√(6² + 8²).", {
            asks: "shadow",
            picture: cuboid(6, 8, 5),
            changed: "A bigger base.",
          }),
          pick("Find the base diagonal.", "13 cm", ["17 cm", "12 cm"], "√(5² + 12²).", {
            asks: "shadow",
            picture: cuboid(5, 12, 4),
            changed: "A long base.",
          }),
          pick("Find the base diagonal.", "$4\\sqrt2$ cm", ["8 cm", "4 cm"], "√(4² + 4²).", {
            asks: "shadow",
            picture: cuboid(4, 4, 4),
            changed: "A cube.",
          }),
        ],
        "The shadow lies on the base, corner to corner.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          tilt(box, "67.4°", ["22.6°", "71.6°"], {
            expect: [
              "Ben uses $\\tan \\theta = \\frac{5}{12}$ for the box. Right?",
              "No",
              "Opposite the angle is the height: $\\tan \\theta = \\frac{12}{5}$.",
              [["Yes", "Which side is opposite the angle at the base?"]],
            ],
          }),
          tilt(cuboid(6, 8, 10), "45°", ["51.3°", "38.7°"], { changed: "A bigger base." }),
          tilt(cuboid(6, 8, 5), "26.6°", ["63.4°", "32.0°"], { changed: "A shorter box." }),
          tilt(cuboid(6, 8, 20), "63.4°", ["26.6°", "68.2°"], { changed: "A taller box." }),
        ],
        "tan θ = height ÷ base diagonal.",
      ),
      own(TR, T3D, "Spot the mistake"),

      own(TR, T3D, "Exit check"),

      reworded(
        TR,
        T3D,
        "“Find the angle between the diagonal and the base.” 1 d.p.",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the right-angled triangle inside the solid, then use SOH CAH TOA.**"],
        box,
        [
          "**Find the right-angled triangle inside the solid, then use SOH CAH TOA.**",
          "The shadow is the base diagonal.",
          "tan θ = height ÷ shadow.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Pythagoras in 3D.

const P3D = "gh-trigonometry/pythagoras-3d";
const p3dMethod = [
  "Square the three edges.",
  "Add them.",
  "Square root: $d = \\sqrt{a^2 + b^2 + c^2}$.",
];
const DIAG = maths("d = \\sqrt{a^2 + b^2 + c^2}");
const long = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find the long diagonal.", right, others, "Square, add, square root.", {
    asks: "diagonal",
    picture,
    ...extra,
  });

const pythagoras3d = stepped(find(TR, P3D), {
  method: p3dMethod,
  variation: {
    relationship: "three edges and the long diagonal",
    unknowns: ["diagonal", "base"],
    surface: ["a cube", "bigger edges", "a surd"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Twice Pythagoras",
        ["**The long diagonal of a cuboid is the square root of the three edges squared, added.**"],
        box,
        "Base diagonal first, then up the height.",
      ),
      reworded(TR, P3D, "Long diagonal of a 4 by 3 by 12 box", {
        tag: "The rule",
        title: "Find the box's long diagonal.",
      }),

      ...owned(TR, P3D, "Warm-up", "Check you remember"),

      methodCard("The method", p3dMethod, DIAG),
      workedFrom(TR, P3D),
      calc(
        "Your turn",
        "Find the long diagonal.",
        cuboid(2, 3, 6),
        [
          ["$2^2 + 3^2 + 6^2 =$", "49", "4 + 9 + 36."],
          ["$d =$", "7", "√49.", { after: "cm" }],
        ],
        "7 cm.",
      ),

      calc(
        "Practise",
        "Find the long diagonal.",
        cuboid(2, 4, 4),
        [
          ["$2^2 + 4^2 + 4^2 =$", "36", "4 + 16 + 16."],
          ["$d =$", "6", "√36.", { after: "cm" }],
        ],
        "6 cm.",
      ),
      reworded(TR, P3D, "A cube of side 5 cm: the long diagonal", { tag: "Practise" }),
      reworded(
        TR,
        P3D,
        "A pyramid's apex is 8 cm above the centre of a square base whose half-diagonal is 6 cm. Slant edge?",
        { tag: "Practise", title: "Apex 8 cm above the centre; half-diagonal 6 cm. Slant edge?" },
      ),
      ...owned(TR, P3D, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The long diagonal. Watch what changes.",
        [
          long(cuboid(1, 2, 2), "3 cm", ["5 cm", "9 cm"]),
          long(cuboid(2, 6, 9), "11 cm", ["17 cm", "121 cm"], { changed: "Bigger edges." }),
          long(cuboid(5, 5, 5), "$5\\sqrt3$ cm", ["15 cm", "$5\\sqrt2$ cm"], {
            changed: "A cube.",
          }),
          long(cuboid(3, 4, 12), "13 cm", ["19 cm", "$\\sqrt{19}$ cm"], { changed: "A tall box." }),
        ],
        "Square, add, square root: never just add.",
      ),

      questionSet(
        "Variation",
        "A 6 by 8 by 10 box. Watch what changes.",
        [
          pick("Its base diagonal", "10 cm", ["14 cm", "100 cm"], "√(36 + 64).", {
            asks: "base",
            picture: cuboid(6, 8, 10),
            expect: [
              "Leo gets base diagonal 10, then writes $\\sqrt{10 + 100}$. Right?",
              "No",
              "Square the 10 too: $\\sqrt{100 + 100} = 14.1$.",
              [["Yes", "Was the 10 squared?"]],
            ],
          }),
          pick("Its long diagonal, to 3 s.f.", "14.1 cm", ["10.5 cm", "24 cm"], "√(100 + 100).", {
            asks: "diagonal",
            picture: cuboid(6, 8, 10),
            changed: "Up the height.",
          }),
          pick(
            "Its long diagonal, as a surd",
            "$10\\sqrt2$ cm",
            ["$\\sqrt{24}$ cm", "20 cm"],
            "√200.",
            {
              asks: "diagonal",
              picture: cuboid(6, 8, 10),
              changed: "Exactly.",
            },
          ),
          pick("A 6 by 8 by 24 box's long diagonal", "26 cm", ["38 cm", "34 cm"], "√(100 + 576).", {
            asks: "diagonal",
            picture: cuboid(6, 8, 24),
            changed: "Taller.",
          }),
        ],
        "Square every length before adding.",
      ),
      own(TR, P3D, "Spot the mistake"),

      own(TR, P3D, "Exit check"),

      reworded(
        TR,
        P3D,
        "“Will a 13.5 cm pencil fit?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The long diagonal of a cuboid is the square root of the three edges squared, added.**"],
        DIAG,
        [
          "**The long diagonal of a cuboid is the square root of the three edges squared, added.**",
          "$d = \\sqrt{a^2 + b^2 + c^2}$.",
          "4 + 3 + 12 is not the diagonal.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Area = ½ab sin C.

const AREA = "gh-trigonometry/area-sine";
const areaMethod = [
  "Find two sides and the angle between them.",
  "Multiply: $\\frac12 \\times a \\times b \\times \\sin C$.",
  "Working back: $\\sin C = \\frac{2 \\times \\text{area}}{ab}$.",
];
const HALF = maths("\\text{Area} = \\tfrac12 ab \\sin C");
const areaOf = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find the area, to 3 s.f.", right, others, "½ × side × side × sin(angle between).", {
    asks: "area",
    picture,
    ...extra,
  });

const areaSine = stepped(find(TR, AREA), {
  method: areaMethod,
  variation: {
    relationship: "two sides and the angle between",
    unknowns: ["area", "angle"],
    surface: ["a right angle", "an obtuse angle", "working back"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Height from sine",
        ["**Area = ½ab sin C, with C the angle between sides a and b.**"],
        areaPic,
        "The height is $6 \\sin 50°$: SOH CAH TOA.",
      ),
      reworded(TR, AREA, "Which angle goes in the formula?", { tag: "The rule" }),

      ...owned(TR, AREA, "Warm-up", "Check you remember"),

      methodCard("The method", areaMethod, HALF),
      workedFrom(TR, AREA),
      calc(
        "Your turn",
        "Find the area, to 3 s.f.",
        triangle(["10 cm", "", "8 cm"], ["45°", "", ""]),
        [
          [
            "$\\frac12 \\times 10 \\times 8 \\times \\sin 45° =$",
            "28.3",
            "40 × sin 45°.",
            { after: "cm²" },
          ],
        ],
        "28.3 cm².",
      ),

      calc(
        "Practise",
        "Area 30 cm²; sides 10 and 8. Find the angle between.",
        undefined,
        [
          ["$\\sin C = \\frac{30}{40} =$", "0.75", "Area ÷ 40."],
          ["$C =$, to 1 d.p.:", "48.6", "sin⁻¹ 0.75.", { after: "°" }],
        ],
        "48.6°.",
      ),
      ...owned(TR, AREA, "Together", "Practise"),
      ...owned(TR, AREA, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Sides 4 and 6. Watch what changes.",
        [
          pick("30° between", "6", ["12", "24"], "12 × sin 30°.", { asks: "area" }),
          pick("90° between", "12", ["6", "24"], "sin 90° = 1.", {
            asks: "area",
            changed: "A right angle.",
          }),
          pick("150° between", "6", ["−6", "12"], "sin 150° = sin 30°.", {
            asks: "area",
            changed: "Obtuse.",
          }),
          pick("Area 12: the angle between", "90°", ["30°", "60°"], "sin C = 1.", {
            asks: "angle",
            changed: "Working back.",
          }),
        ],
        "sin of an obtuse angle equals sin of its supplement.",
      ),

      questionSet(
        "Variation",
        "Find the area. Watch what changes.",
        [
          areaOf(areaPic, "20.7 cm²", ["41.4 cm²", "13.8 cm²"], {
            expect: [
              "Ben works out $9 \\times 6 \\times \\sin 50°$. Right?",
              "No",
              "Half of that: $\\frac12 \\times 9 \\times 6 \\times \\sin 50° = 20.7$.",
              [["Yes", "Where is the ½?"]],
            ],
          }),
          areaOf(
            triangle(["9 cm", "", "6 cm"], ["130°", "", ""]),
            "20.7 cm²",
            ["−20.7 cm²", "41.4 cm²"],
            {
              changed: "Obtuse: the same sine.",
            },
          ),
          areaOf(
            triangle(["12 cm", "", "10 cm"], ["30°", "", ""]),
            "30 cm²",
            ["60 cm²", "52.0 cm²"],
            {
              changed: "New sides.",
            },
          ),
          areaOf(
            triangle(["8 cm", "", "8 cm"], ["60°", "", ""]),
            "27.7 cm²",
            ["16 cm²", "32 cm²"],
            {
              changed: "Equal sides.",
            },
          ),
        ],
        "Don't forget the half.",
      ),
      own(TR, AREA, "Spot the mistake"),

      own(TR, AREA, "Exit check"),

      reworded(
        TR,
        AREA,
        "“Find its area to 3 s.f.”",
        { tag: "Real life", title: "A triangular plot of land. Find its area, to 3 s.f." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Area = ½ab sin C, with C the angle between sides a and b.**"],
        HALF,
        [
          "**Area = ½ab sin C, with C the angle between sides a and b.**",
          "The angle must be between the two sides.",
          "Remember the half.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghTrigonometryStepped: [string, UnitLesson[]][] = [
  [SINE, [sineRuleLesson]],
  [COS, [cosineRuleLesson]],
  [ANY, [anyTriangle]],
  [T3D, [trig3d]],
  [P3D, [pythagoras3d]],
  [AREA, [areaSine]],
];
