// GCSE Higher, "Pythagoras and trigonometry", as six short lessons, one just before each skill: the
// sine rule, the cosine rule, choosing a method for any triangle, trigonometry in 3D, Pythagoras
// in 3D and the area ½ab sin C. Each recaps the Foundation idea quickly, builds it to Higher
// level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gh-trigonometry";
const P = (x: number, y: number): Point => ({ x, y });

/** A triangle ABC that isn't right-angled, with optional side and angle labels. */
function triangle(
  sides: [ab: string, bc: string, ca: string],
  angles: [a: string, b: string, c: string],
): DrawingPic {
  const A = P(0, 0);
  const B = P(6, 0);
  const C = P(2, 3.2);
  const items: DrawingPic["items"] = [
    { line: [A, B] },
    { line: [B, C] },
    { line: [C, A] },
    { text: "A", at: P(-0.35, -0.3) },
    { text: "B", at: P(6.35, -0.3) },
    { text: "C", at: P(2, 3.6) },
  ];
  const inside = P(2.7, 1.1);
  if (sides[0]) items.push({ side: [A, B], label: sides[0], inside });
  if (sides[1]) items.push({ side: [B, C], label: sides[1], inside });
  if (sides[2]) items.push({ side: [C, A], label: sides[2], inside });
  // Directions of each side from each corner, in degrees.
  const deg = (p: Point, q: Point) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  if (angles[0]) items.push({ angle: A, from: 0, to: deg(A, C), label: angles[0] });
  if (angles[1]) items.push({ angle: B, from: deg(B, C), to: 180, label: angles[1] });
  if (angles[2]) items.push({ angle: C, from: deg(C, A), to: deg(C, B) + 360, label: angles[2] });
  return { kind: "drawing", items };
}

const sineRule = triangle(["", "a", "8 cm"], ["40°", "65°", ""]);
const cosineRule = triangle(["7 cm", "?", "5 cm"], ["60°", "", ""]);
const areaPic = triangle(["9 cm", "", "6 cm"], ["50°", "", ""]);
const box: Picture = {
  kind: "cuboid",
  w: 4,
  d: 3,
  h: 12,
  labels: ["4 cm", "3 cm", "12 cm"],
};

export const ghTrigonometry: UnitLesson[] = [
  lesson(
    U,
    "sine-rule",
    "GH-G22.a",
    "The sine rule",
    "a / sin A = b / sin B: each side over the sine of its opposite angle.",
    [
      problem(
        "No right angle",
        [
          "In triangle ABC, angle A = 40°, angle B = 65° and AC = 8 cm. “Find BC. Give your answer to 3 significant figures.”",
          "SOH CAH TOA needs a right angle. By the end of this lesson, you won't.",
        ],
        sineRule,
      ),
      typed("Warm-up", "The third angle, C, in degrees", "75", "180 − 40 − 65.", "75°.", {
        unit: "°",
      }),
      choose(
        "Warm-up",
        "The side opposite angle A is",
        "BC",
        "Across from A.",
        [
          ["AB", "That touches A."],
          ["AC", "That touches A."],
        ],
        { picture: sineRule },
      ),
      explain(
        "Discover",
        "Pairs of opposites",
        [
          "Label each side with the small letter of the angle opposite it: $a$ is opposite A. Then $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$.",
          "Use it when you know a side and its opposite angle, plus one more side or angle.",
        ],
        sineRule,
      ),
      choose(
        "Discover",
        "AC = 8 cm is side",
        "$b$",
        "Opposite B.",
        [
          ["$a$", "$a$ is BC."],
          ["$c$", "$c$ is AB."],
        ],
        { picture: sineRule },
      ),
      worked(
        "Find BC",
        "$\\frac{a}{\\sin 40°} = \\frac{8}{\\sin 65°}$",
        [
          ["$a = \\frac{8 \\sin 40°}{\\sin 65°}$", "Multiply by sin 40°."],
          ["$= 5.67$ cm", "3 s.f."],
        ],
        "BC = 5.67 cm.",
        sineRule,
      ),
      steps(
        "Together",
        "Finding an angle",
        "$a = 7$, $b = 9$, B = 70°. Find A.",
        [
          [
            "Flip the rule:",
            "$\\frac{\\sin A}{7} = \\frac{\\sin 70°}{9}$",
            ["$\\frac{\\sin A}{9} = \\frac{\\sin 70°}{7}$", "Each side with its own angle."],
            "Sines on top",
          ],
          ["$\\sin A = 0.7309$, so A =", "47.0°", ["0.73°", "Use $\\sin^{-1}$."], "47.0°"],
        ],
        "For an angle, put the sines on top.",
      ),
      choose(
        "Together",
        "Which pair do you need for the sine rule?",
        "a side and its opposite angle",
        "A complete pair.",
        [
          ["two sides and the angle between", "That's the cosine rule."],
          ["three sides", "Cosine rule."],
        ],
      ),
      typed(
        "Your turn",
        "$\\frac{x}{\\sin 30°} = \\frac{10}{\\sin 90°}$. $x$",
        "5",
        "$10 \\times 0.5$.",
        "5.",
      ),
      typed(
        "Your turn",
        "$\\frac{x}{\\sin 50°} = \\frac{12}{\\sin 80°}$. $x$ to 3 s.f.",
        "9.33",
        "$\\frac{12 \\sin 50°}{\\sin 80°}$.",
        "9.33.",
        { wrong: [["15.4", "Multiply by sin 50°, divide by sin 80°."]] },
      ),
      choose(
        "Watch out",
        "Ivy pairs side $a$ with angle B. What's wrong?",
        "Each side goes with the angle opposite it",
        "a with A.",
        [["Nothing", "Label opposites first."]],
      ),
      mistake(
        "Ben finds BC with A = 40°, B = 65°, AC = 8.",
        [
          "$\\frac{a}{\\sin 40°} = \\frac{8}{\\sin 65°}$",
          "$a = \\frac{8 \\sin 65°}{\\sin 40°}$",
          "$= 11.3$ cm",
        ],
        1,
        "Multiply by sin 40°: $a = \\frac{8 \\sin 40°}{\\sin 65°} = 5.67$.",
      ),
      typed(
        "Back to the problem",
        "“Find BC to 3 significant figures.”",
        "5.67",
        "$\\frac{8 \\sin 40°}{\\sin 65°}$.",
        "5.67 cm.",
        { unit: "cm", picture: sineRule, wrong: [["11.3", "The sines are the wrong way up."]] },
      ),
      quiz([
        [
          [
            "The sine rule links",
            "sides and opposite angles",
            ["three sides", "two sides and the included angle"],
            "Pairs.",
          ],
          [
            "To find an angle, put",
            "the sines on top",
            ["the sides on top", "the cosines on top"],
            "Flip.",
          ],
        ],
        [
          ["$\\frac{a}{\\sin 30°} = \\frac{6}{\\sin 30°}$. $a$", "6", ["3", "12"], "Equal angles."],
          [
            "$\\frac{a}{\\sin 90°} = \\frac{4}{\\sin 30°}$. $a$",
            "8",
            ["2", "4"],
            "$\\frac{4}{0.5}$.",
          ],
        ],
        [
          ["Side $c$ is opposite", "angle C", ["angle A", "angle B"], "Opposites."],
          ["A triangle's angles add to", "180°", ["360°", "90°"], "Always."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "cosine-rule",
    "GH-G22.b",
    "The cosine rule",
    "a² = b² + c² − 2bc cos A: Pythagoras with a correction.",
    [
      problem(
        "Two sides and the angle",
        [
          "AB = 7 cm, AC = 5 cm and angle A = 60°. “Find BC.” The sine rule has no complete pair here.",
          "By the end of this lesson, you can find it.",
        ],
        cosineRule,
      ),
      typed("Warm-up", "$\\cos 60°$", "0.5", "Exact value.", "0.5."),
      typed("Warm-up", "$7^2 + 5^2$", "74", "49 + 25.", "74."),
      explain(
        "Discover",
        "Pythagoras, adjusted",
        [
          "$a^2 = b^2 + c^2 - 2bc \\cos A$, where A is the angle **between** sides $b$ and $c$, opposite $a$.",
          "If A = 90°, cos A = 0 and it's just Pythagoras. To find an angle: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.",
        ],
        cosineRule,
      ),
      choose(
        "Discover",
        "Use the cosine rule when you know",
        "two sides and the angle between them",
        "Or three sides.",
        [
          ["a side and its opposite angle", "Sine rule."],
          ["two angles", "Sine rule."],
        ],
      ),
      worked(
        "Find BC",
        "$a^2 = 5^2 + 7^2 - 2(5)(7)\\cos 60°$",
        [
          ["$= 74 - 35 = 39$", "$70 \\times 0.5$."],
          ["$a = \\sqrt{39} = 6.24$ cm", "3 s.f."],
        ],
        "BC = 6.24 cm.",
        cosineRule,
      ),
      steps(
        "Together",
        "Three sides: 5, 6 and 8. Find the largest angle.",
        "Opposite the 8.",
        [
          [
            "$\\cos A =$",
            "$\\frac{25 + 36 - 64}{60}$",
            ["$\\frac{64 + 36 - 25}{60}$", "Subtract the opposite side."],
            "$-\\frac{3}{60} = -0.05$",
          ],
          ["A =", "92.9°", ["87.1°", "A negative cosine gives an obtuse angle."], "92.9°"],
        ],
        "Negative cosine: obtuse.",
      ),
      choose(
        "Together",
        "In $a^2 = b^2 + c^2 - 2bc \\cos A$, A is",
        "the angle opposite $a$",
        "Between $b$ and $c$.",
        [
          ["any angle", "It must face $a$."],
          ["the angle between $a$ and $b$", "Opposite $a$."],
        ],
      ),
      typed(
        "Your turn",
        "$a^2 = 3^2 + 4^2 - 2(3)(4)\\cos 90°$. $a$",
        "5",
        "$\\cos 90° = 0$.",
        "5.",
      ),
      typed(
        "Your turn",
        "Sides 6 and 10 with 120° between. Third side, to 3 s.f.",
        "14",
        "$36 + 100 + 60 = 196$.",
        "14.0.",
        { wrong: [["8.72", "$\\cos 120° = -0.5$: add 60."]] },
      ),
      choose(
        "Watch out",
        "Kim works out $74 - 70 \\cos 60°$ as $4 \\cos 60°$. What's wrong?",
        "Multiply first: $70 \\cos 60° = 35$",
        "Order of operations.",
        [["Nothing", "$74 - 35 = 39$."]],
      ),
      mistake(
        "Leo finds the angle opposite 7 in a 4, 5, 7 triangle.",
        ["$\\cos A = \\frac{4^2 + 5^2 + 7^2}{2(4)(5)}$", "$= \\frac{90}{40}$", "Error: cos > 1"],
        0,
        "Subtract the opposite side: $\\frac{16 + 25 - 49}{40} = -0.2$, so A = 101.5°.",
      ),
      typed("Back to the problem", "“Find BC.” To 3 s.f.", "6.24", "$\\sqrt{39}$.", "6.24 cm.", {
        unit: "cm",
        picture: cosineRule,
        wrong: [["8.60", "Subtract $2bc \\cos A$."]],
      }),
      quiz([
        [
          [
            "Cosine rule for a side needs",
            "two sides and the included angle",
            ["one side, two angles", "a pair"],
            "SAS.",
          ],
          ["Cosine rule for an angle needs", "three sides", ["two angles", "one side"], "SSS."],
        ],
        [
          ["$\\cos A$ negative means A is", "obtuse", ["acute", "90°"], "Over 90°."],
          [
            "If A = 90°, the cosine rule becomes",
            "Pythagoras",
            ["the sine rule", "SOH CAH TOA"],
            "cos 90° = 0.",
          ],
        ],
        [
          ["$a^2 = 2^2 + 2^2 - 8\\cos 60°$. $a$", "2", ["4", "$\\sqrt8$"], "$8 - 4 = 4$."],
          ["$a^2 = 3^2 + 3^2 - 18\\cos 60°$. $a$", "3", ["9", "$\\sqrt{18}$"], "$18 - 9$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "any-triangle",
    "GH-G20.c",
    "Choosing a method for any triangle",
    "Right-angled: SOH CAH TOA. Otherwise: a pair → sine rule; no pair → cosine rule.",
    [
      problem("Which rule?", [
        "A ship sails 12 km on a bearing of 040°, then 8 km on a bearing of 130°. “How far is it from its start?”",
        "The angle between the legs is 90°. By the end of this lesson, you can choose the right tool for any triangle.",
      ]),
      choose(
        "Warm-up",
        "A right-angled triangle with two sides known: third side by",
        "Pythagoras",
        "No angles needed.",
        [
          ["the sine rule", "Pythagoras is quicker."],
          ["the cosine rule", "It works, but Pythagoras is simpler."],
        ],
      ),
      typed("Warm-up", "130 − 40", "90", "Subtract.", "90."),
      explain("Discover", "A decision", [
        "**Right angle?** Pythagoras or SOH CAH TOA. **Not right-angled:** if you have a side **and its opposite angle**, use the sine rule; if not (SAS or SSS), use the cosine rule.",
        "Sketch the triangle and mark what you know first.",
      ]),
      choose(
        "Discover",
        "Sides 6 and 9, angle 50° between them. Find the third side.",
        "cosine rule",
        "SAS.",
        [
          ["sine rule", "No complete pair."],
          ["SOH CAH TOA", "No right angle."],
        ],
      ),
      worked(
        "The ship",
        "Legs 12 km and 8 km at 90°.",
        [
          ["Right angle: Pythagoras", "Choose."],
          ["$\\sqrt{144 + 64} = \\sqrt{208} = 14.4$ km", "3 s.f."],
        ],
        "Always check for a right angle first.",
      ),
      steps(
        "Together",
        "Angles 35° and 80°, side 10 opposite 80°. Find the side opposite 35°.",
        "Choose, then solve.",
        [
          ["Method:", "sine rule", ["cosine rule", "There's a pair: 10 and 80°."], "Sine rule"],
          [
            "$x = \\frac{10 \\sin 35°}{\\sin 80°}$ =",
            "5.82",
            ["16.5", "Sines the right way."],
            "5.82",
          ],
        ],
        "A complete pair: sine rule.",
      ),
      choose("Together", "Three sides known; find an angle.", "cosine rule", "SSS.", [
        ["sine rule", "No angle known."],
        ["Pythagoras", "Not right-angled."],
      ]),
      choose(
        "Your turn",
        "Two angles and any side",
        "sine rule",
        "Find the third angle, then pair.",
        [
          ["cosine rule", "You'll have a pair."],
          ["Pythagoras", "No right angle."],
        ],
      ),
      choose("Your turn", "Right-angled, one side and one angle", "SOH CAH TOA", "Right angle.", [
        ["sine rule", "Overkill."],
        ["cosine rule", "Overkill."],
      ]),
      choose(
        "Watch out",
        "Raj uses SOH CAH TOA in a triangle with no right angle. What's wrong?",
        "SOH CAH TOA only works with a right angle",
        "Sine or cosine rule.",
        [["Nothing", "The ratios assume 90°."]],
      ),
      mistake(
        "Zoe has sides 5 and 7 with 40° between them.",
        ["A pair? 40° with 5", "Use the sine rule", "…"],
        0,
        "40° is between the sides, not opposite either: use the cosine rule.",
      ),
      typed(
        "Back to the problem",
        "“How far is the ship from its start?” 3 s.f.",
        "14.4",
        "$\\sqrt{208}$.",
        "14.4 km.",
        { unit: "km", wrong: [["20", "Pythagoras, not adding."]] },
      ),
      quiz([
        [
          [
            "SAS (two sides, included angle)",
            "cosine rule",
            ["sine rule", "Pythagoras"],
            "No pair.",
          ],
          ["SSS (three sides)", "cosine rule", ["sine rule", "SOH CAH TOA"], "No angle."],
        ],
        [
          ["ASA (two angles, a side)", "sine rule", ["cosine rule", "Pythagoras"], "Pair."],
          [
            "A side and its opposite angle, plus another angle",
            "sine rule",
            ["cosine rule", "Pythagoras"],
            "Pair.",
          ],
        ],
        [
          [
            "Right-angled, two sides, find the third",
            "Pythagoras",
            ["sine rule", "cosine rule"],
            "Simplest.",
          ],
          [
            "First check for",
            "a right angle",
            ["an obtuse angle", "equal sides"],
            "Simplest tools.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "trig-3d",
    "GH-G20.b",
    "Trigonometry in 3D",
    "Find the right-angled triangle inside the solid, then use SOH CAH TOA.",
    [
      problem(
        "The angle with the base",
        [
          "A box is 4 cm by 3 cm by 12 cm tall. “Find the angle between the long diagonal and the base.”",
          "By the end of this lesson, you can find angles inside solids.",
        ],
        box,
      ),
      typed("Warm-up", "Diagonal of the 4 by 3 base", "5", "$\\sqrt{16 + 9}$.", "5 cm.", {
        unit: "cm",
      }),
      choose("Warm-up", "$\\tan \\theta = \\frac{12}{5}$. $\\theta$", "67.4°", "$\\tan^{-1}$.", [
        ["2.4°", "Use $\\tan^{-1}$."],
        ["22.6°", "That's $\\tan^{-1}\\frac{5}{12}$."],
      ]),
      explain(
        "Discover",
        "A flat triangle inside",
        [
          "The angle between a line and a plane is in a right-angled triangle: the line, its 'shadow' on the plane, and the vertical drop.",
          "Find the shadow's length first (often a 2D diagonal by Pythagoras), then use SOH CAH TOA.",
        ],
        box,
      ),
      choose(
        "Discover",
        "The shadow of the long diagonal on the base is",
        "the base diagonal, 5 cm",
        "Directly below.",
        [
          ["the 4 cm edge", "Below the whole diagonal."],
          ["the 12 cm edge", "That's vertical."],
        ],
      ),
      worked(
        "The box",
        "Angle between the diagonal and the base.",
        [
          ["Base diagonal: 5 cm", "Pythagoras."],
          ["$\\tan \\theta = \\frac{12}{5}$", "Opposite 12, adjacent 5."],
          ["$\\theta = 67.4°$", "1 d.p."],
        ],
        "Sketch the triangle on its own.",
        box,
      ),
      steps(
        "Together",
        "A square-based pyramid: base 6 cm, vertical height 4 cm. Angle between a slant edge and the base?",
        "Find the shadow.",
        [
          [
            "Half the base diagonal:",
            "$\\frac{\\sqrt{72}}{2} = 4.24$ cm",
            ["3 cm", "To a corner, not an edge midpoint."],
            "4.24 cm",
          ],
          [
            "$\\tan \\theta = \\frac{4}{4.24}$, so $\\theta =$",
            "43.3°",
            ["46.7°", "Opposite over adjacent."],
            "43.3°",
          ],
        ],
        "The apex sits above the centre.",
      ),
      choose(
        "Together",
        "Which triangle gives the angle between a line and a plane?",
        "line, its shadow, and the vertical",
        "Right-angled.",
        [
          ["any face", "The line isn't on a face."],
          ["two edges", "Use the shadow."],
        ],
      ),
      typed(
        "Your turn",
        "Shadow 8 cm, height 6 cm. Line length?",
        "10",
        "$\\sqrt{64 + 36}$.",
        "10 cm.",
        { unit: "cm" },
      ),
      typed(
        "Your turn",
        "And the angle with the plane, to 1 d.p.",
        "36.9",
        "$\\tan^{-1}\\frac68$.",
        "36.9°.",
        { unit: "°" },
      ),
      choose(
        "Watch out",
        "Ola uses an edge of the base as the shadow of the diagonal. What's wrong?",
        "The shadow is directly under the whole line: the base diagonal",
        "Look straight down.",
        [["Nothing", "The edge only lies under part of it."]],
      ),
      mistake(
        "Ben finds the box angle.",
        ["Base diagonal 5 cm", "$\\tan \\theta = \\frac{5}{12}$", "$\\theta = 22.6°$"],
        1,
        "That's the angle with the vertical. With the base: $\\tan \\theta = \\frac{12}{5}$, 67.4°.",
      ),
      typed(
        "Back to the problem",
        "“Find the angle between the diagonal and the base.” 1 d.p.",
        "67.4",
        "$\\tan^{-1}\\frac{12}{5}$.",
        "67.4°.",
        { unit: "°", picture: box },
      ),
      quiz([
        [
          ["Cuboid 3 by 4 base: base diagonal", "5", ["7", "12"], "Pythagoras."],
          ["Cuboid 6 by 8 base: base diagonal", "10", ["14", "48"], "Pythagoras."],
        ],
        [
          [
            "Angle with the base: use opposite =",
            "the height",
            ["the base diagonal", "the long diagonal"],
            "Vertical.",
          ],
          ["…and adjacent =", "the shadow", ["the height", "an edge"], "Along the base."],
        ],
        [
          [
            "First step in a 3D problem",
            "find a right-angled triangle",
            ["use the sine rule", "add the edges"],
            "Flatten.",
          ],
          ["$\\tan \\theta = 1$ gives", "45°", ["1°", "90°"], "Equal sides."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "pythagoras-3d",
    "GH-G20.a",
    "Pythagoras in 3D",
    "The long diagonal of a cuboid is √(a² + b² + c²).",
    [
      problem(
        "Will it fit?",
        [
          "A box is 4 cm by 3 cm by 12 cm. “Will a 13.5 cm pencil fit inside it?”",
          "By the end of this lesson, you can find the longest length inside a cuboid.",
        ],
        box,
      ),
      typed("Warm-up", "$\\sqrt{3^2 + 4^2}$", "5", "$\\sqrt{25}$.", "5."),
      typed("Warm-up", "$\\sqrt{5^2 + 12^2}$", "13", "$\\sqrt{169}$.", "13."),
      explain(
        "Discover",
        "Twice Pythagoras",
        [
          "The long diagonal is the hypotenuse of a triangle whose base is the diagonal of the bottom face. Do Pythagoras on the base, then again with the height.",
          "In one go: $d = \\sqrt{a^2 + b^2 + c^2}$.",
        ],
        box,
      ),
      choose(
        "Discover",
        "Long diagonal of a 4 by 3 by 12 box",
        "13 cm",
        "$\\sqrt{16 + 9 + 144}$.",
        [
          ["19 cm", "Not adding the edges."],
          ["$\\sqrt{19}$ cm", "Square each edge."],
        ],
        { picture: box },
      ),
      worked(
        "The pencil",
        "Box 4 × 3 × 12.",
        [
          ["Long diagonal: $\\sqrt{16 + 9 + 144} = 13$ cm", "Pythagoras in 3D."],
          ["13.5 > 13", "Compare."],
          ["No, it won't fit", "Conclude."],
        ],
        "A 12.9 cm pencil would.",
        box,
      ),
      steps(
        "Together",
        "A cube of side 5 cm: the long diagonal",
        "Same formula.",
        [
          ["$d^2 =$", "75", ["25", "$25 + 25 + 25$."], "75"],
          ["$d =$", "$5\\sqrt3 = 8.66$ cm", ["15 cm", "Square root."], "8.66 cm"],
        ],
        "Exact: $5\\sqrt3$.",
      ),
      choose(
        "Together",
        "A pyramid's apex is 8 cm above the centre of a square base whose half-diagonal is 6 cm. Slant edge?",
        "10 cm",
        "$\\sqrt{36 + 64}$.",
        [
          ["14 cm", "Pythagoras, not adding."],
          ["$\\sqrt{28}$", "Add the squares."],
        ],
      ),
      typed(
        "Your turn",
        "Cuboid 2 by 3 by 6: long diagonal",
        "7",
        "$\\sqrt{4 + 9 + 36}$.",
        "7 cm.",
        { unit: "cm" },
      ),
      typed("Your turn", "Cuboid 1 by 2 by 2: long diagonal", "3", "$\\sqrt{1 + 4 + 4}$.", "3."),
      choose(
        "Watch out",
        "Kim adds the three edges: 4 + 3 + 12 = 19. What's wrong?",
        "Square, add, square root",
        "Pythagoras.",
        [["Nothing", "19 is longer than the box allows."]],
      ),
      mistake(
        "Leo finds the long diagonal of a 6 × 8 × 10 box.",
        ["Base diagonal: $\\sqrt{36 + 64} = 10$", "Long diagonal: $\\sqrt{10 + 100}$", "$= 10.5$"],
        1,
        "Square the base diagonal: $\\sqrt{100 + 100} = 14.1$.",
      ),
      choose(
        "Back to the problem",
        "“Will a 13.5 cm pencil fit?”",
        "No: the longest space is 13 cm",
        "13.5 > 13.",
        [
          ["Yes: the box is 12 cm tall and 19 cm round", "Use the diagonal."],
          ["Yes: 13.5 < 19", "The edges don't add."],
        ],
        { picture: box },
      ),
      quiz([
        [
          ["Long diagonal of 1 × 1 × 1 cube", "$\\sqrt3$", ["3", "1"], "$\\sqrt{1 + 1 + 1}$."],
          ["Long diagonal of 2 × 2 × 1", "3", ["5", "$\\sqrt5$"], "$\\sqrt{4 + 4 + 1}$."],
        ],
        [
          [
            "$d = \\sqrt{a^2 + b^2 + c^2}$ gives",
            "the long diagonal",
            ["the volume", "the surface area"],
            "Corner to corner.",
          ],
          [
            "Pythagoras in 3D uses",
            "two right-angled triangles",
            ["the sine rule", "one triangle"],
            "Base, then up.",
          ],
        ],
        [
          ["Cuboid 3 × 4 × 12: base diagonal", "5", ["13", "7"], "$\\sqrt{9 + 16}$."],
          ["Cuboid 3 × 4 × 12: long diagonal", "13", ["19", "5"], "$\\sqrt{25 + 144}$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "area-sine",
    "GH-G23",
    "Area = ½ab sin C",
    "Two sides and the angle between them give the area.",
    [
      problem(
        "The garden plot",
        [
          "A triangular plot has sides 9 m and 6 m with 50° between them. “Find its area. Give your answer to 3 significant figures.”",
          "There's no perpendicular height. By the end of this lesson, you won't need one.",
        ],
        areaPic,
      ),
      typed("Warm-up", "Area of a triangle, base 9, height 4", "18", "½ × 9 × 4.", "18."),
      typed("Warm-up", "$\\sin 30°$", "0.5", "Exact value.", "0.5."),
      explain(
        "Discover",
        "Height from sine",
        [
          "The height from C to AB is $6 \\sin 50°$ (SOH CAH TOA). So area = $\\frac12 \\times 9 \\times 6 \\sin 50°$.",
          "In general: **Area = ½ab sin C**, where C is the angle **between** sides $a$ and $b$.",
        ],
        areaPic,
      ),
      choose(
        "Discover",
        "Which angle goes in the formula?",
        "the one between the two sides",
        "Included angle.",
        [
          ["any angle", "It must be between them."],
          ["the right angle", "There isn't one."],
        ],
      ),
      worked(
        "The plot",
        "Sides 9 and 6, angle 50° between.",
        [
          ["$\\frac12 \\times 9 \\times 6 \\times \\sin 50°$", "Formula."],
          ["$= 27 \\sin 50° = 20.7$ m²", "3 s.f."],
        ],
        "About 21 square metres.",
        areaPic,
      ),
      steps(
        "Together",
        "Area 30 cm², sides 10 and 8. Find the angle between them.",
        "Work backwards.",
        [
          [
            "$30 = \\frac12(10)(8)\\sin C$, so $\\sin C =$",
            "0.75",
            ["3.75", "$30 \\div 40$."],
            "0.75",
          ],
          ["C =", "48.6°", ["0.75°", "$\\sin^{-1}$."], "48.6° (or 131.4°)"],
        ],
        "Sine gives two possible angles: check the diagram.",
      ),
      choose(
        "Together",
        "An equilateral triangle of side 4: area",
        "$4\\sqrt3$",
        "$\\frac12 \\times 16 \\times \\frac{\\sqrt3}{2}$.",
        [
          ["8", "sin 60°, not 1."],
          ["16", "Halve and use sin 60°."],
        ],
      ),
      typed(
        "Your turn",
        "Sides 10 and 12, angle 30° between. Area",
        "30",
        "$\\frac12 \\times 120 \\times 0.5$.",
        "30.",
        { wrong: [["60", "Halve."]] },
      ),
      typed(
        "Your turn",
        "Sides 5 and 7, angle 90° between. Area",
        "17.5",
        "$\\sin 90° = 1$.",
        "17.5.",
      ),
      choose(
        "Watch out",
        "Ivy uses an angle that isn't between the two sides. What's wrong?",
        "The angle must be between the sides you use",
        "Included.",
        [["Nothing", "Otherwise the height is wrong."]],
      ),
      mistake(
        "Ben finds the plot's area.",
        ["$9 \\times 6 \\times \\sin 50°$", "$= 54 \\times 0.766$", "$= 41.4$ m²"],
        0,
        "Don't forget the ½: 20.7 m².",
      ),
      typed(
        "Back to the problem",
        "“Find its area to 3 s.f.”",
        "20.7",
        "$27 \\sin 50°$.",
        "20.7 m².",
        { unit: "m²", picture: areaPic, wrong: [["41.4", "Halve it."]] },
      ),
      quiz([
        [
          [
            "Sides 4 and 6, 30° between: area",
            "6",
            ["12", "24"],
            "$\\frac12 \\times 24 \\times 0.5$.",
          ],
          [
            "Sides 8 and 5, 30° between: area",
            "10",
            ["20", "40"],
            "$\\frac12 \\times 40 \\times 0.5$.",
          ],
        ],
        [
          [
            "The angle in ½ab sin C is",
            "between $a$ and $b$",
            ["opposite $a$", "any"],
            "Included.",
          ],
          ["If C = 90°, the formula gives", "½ab", ["ab", "0"], "sin 90° = 1."],
        ],
        [
          ["Sides 2 and 2, 90° between: area", "2", ["4", "1"], "½ × 4."],
          ["Sides 6 and 6, 90° between: area", "18", ["36", "12"], "½ × 36."],
        ],
      ]),
    ],
  ),
];
