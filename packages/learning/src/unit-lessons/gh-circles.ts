// GCSE Higher, "Circles and vectors", as four short lessons, one just before each skill: the
// equation of a circle centred at the origin, the tangent to a circle at a point, the circle
// theorems, and vector proofs. Each recaps the Foundation idea quickly, builds it to Higher level,
// names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const U = "gh-circles";
const P = (x: number, y: number): Point => ({ x, y });

/** The circle x² + y² = 25 on axes, with the point (3, 4) and optionally its radius and tangent. */
function circle(withTangent: boolean): DrawingPic {
  const items: DrawingPic["items"] = [
    { line: [P(-6, 0), P(6, 0)], arrow: 1, tone: "soft" },
    { line: [P(0, -6), P(0, 6)], arrow: 1, tone: "soft" },
    { arc: P(0, 0), r: 5, from: 0, to: 360 },
    { dot: P(3, 4) },
    { text: "(3, 4)", at: P(4.7, 4.7) },
    { text: "5", at: P(5.4, -0.4) },
    { text: "−5", at: P(-5.5, -0.4) },
  ];
  if (withTangent) {
    // The tangent at (3, 4) has gradient −3/4: y = −¾x + 25/4.
    items.push(
      { line: [P(0, 0), P(3, 4)], dashed: true },
      { line: [P(-1, 7), P(7, 1)], tone: "find" },
    );
  }
  return { kind: "drawing", frame: { xMin: -6.5, xMax: 7.5, yMin: -6.5, yMax: 7.5 }, items };
}

const plain = circle(false);
const tangent = circle(true);

/** A circle with centre O, an arc AB, the angle at the centre and one at the circumference. */
const theorem: DrawingPic = {
  kind: "drawing",
  items: [
    { arc: P(0, 0), r: 3, from: 0, to: 360 },
    { dot: P(0, 0) },
    { text: "O", at: P(0.35, 0.35) },
    { line: [P(-2.6, -1.5), P(0, 0)] },
    { line: [P(2.6, -1.5), P(0, 0)] },
    { line: [P(-2.6, -1.5), P(0, 3)] },
    { line: [P(2.6, -1.5), P(0, 3)] },
    { text: "A", at: P(-3, -1.8) },
    { text: "B", at: P(3, -1.8) },
    { text: "C", at: P(0, 3.4) },
    { angle: P(0, 0), from: 210, to: 330, label: "2x" },
    { angle: P(0, 3), from: 240, to: 300, label: "x" },
  ],
};
const triangleVectors: DrawingPic = {
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(6, 0)], arrow: 1, tone: "find" },
    { line: [P(0, 0), P(2, 4)], arrow: 1, tone: "find" },
    { line: [P(2, 4), P(6, 0)] },
    { line: [P(1, 2), P(4, 2)], dashed: true },
    { dot: P(1, 2) },
    { dot: P(4, 2) },
    { text: "O", at: P(-0.35, -0.3) },
    { text: "A", at: P(6.35, -0.3) },
    { text: "B", at: P(2, 4.4) },
    { text: "M", at: P(0.6, 2.2) },
    { text: "N", at: P(4.45, 2.25) },
    { text: "a", at: P(3, -0.45), tone: "find" },
    { text: "b", at: P(0.6, 3.1), tone: "find" },
  ],
};

export const ghCircles: UnitLesson[] = [
  lesson(
    U,
    "circle-equation",
    "GH-A16.a",
    "The equation of a circle",
    "x² + y² = r² is a circle centred at the origin with radius r.",
    [
      problem(
        "On the circle?",
        [
          "“The circle $x^2 + y^2 = 25$ is drawn. Is the point (3, 4) on it?” And “Find where the circle crosses the $y$-axis.”",
          "By the end of this lesson, you can use the equation of a circle.",
        ],
        plain,
      ),
      typed("Warm-up", "$3^2 + 4^2$", "25", "9 + 16.", "25."),
      typed("Warm-up", "$\\sqrt{25}$", "5", "Square root.", "5."),
      explain(
        "Discover",
        "Pythagoras again",
        [
          "Any point $(x, y)$ on a circle of radius $r$ about the origin is $r$ away from (0, 0). By Pythagoras, $x^2 + y^2 = r^2$.",
          "So $x^2 + y^2 = 25$ has radius 5. A point is on the circle if its coordinates make the equation true.",
        ],
        plain,
      ),
      choose("Discover", "Radius of $x^2 + y^2 = 49$", "7", "$\\sqrt{49}$.", [
        ["49", "That's $r^2$."],
        ["24.5", "Square root, not half."],
      ]),
      worked(
        "The point",
        "Is (3, 4) on $x^2 + y^2 = 25$?",
        [
          ["$3^2 + 4^2 = 9 + 16 = 25$", "Substitute."],
          ["Yes, it's on the circle", "True."],
        ],
        "Crosses the $y$-axis where $x = 0$: $y = \\pm 5$.",
        plain,
      ),
      steps(
        "Together",
        "Write the equation of a circle centred at (0, 0) through (6, 8)",
        "Find $r^2$.",
        [
          ["$r^2 = 6^2 + 8^2 =$", "100", ["14", "Square each."], "100"],
          [
            "Equation:",
            "$x^2 + y^2 = 100$",
            ["$x^2 + y^2 = 10$", "Use $r^2$."],
            "$x^2 + y^2 = 100$",
          ],
        ],
        "Radius 10.",
      ),
      choose("Together", "Is (2, 3) on $x^2 + y^2 = 13$?", "yes", "4 + 9 = 13.", [
        ["no", "4 + 9 = 13."],
      ]),
      typed("Your turn", "Radius of $x^2 + y^2 = 81$", "9", "$\\sqrt{81}$.", "9."),
      choose(
        "Your turn",
        "$x^2 + y^2 = 16$ crosses the $x$-axis at",
        "(4, 0) and (−4, 0)",
        "$y = 0$.",
        [
          ["(16, 0)", "$x^2 = 16$."],
          ["(0, 4) and (0, −4)", "That's the $y$-axis."],
        ],
      ),
      choose(
        "Watch out",
        "Zoe says $x^2 + y^2 = 36$ has radius 36. What's wrong?",
        "36 is $r^2$: the radius is 6",
        "Square root.",
        [["Nothing", "$6^2 = 36$."]],
      ),
      mistake(
        "Ben checks whether (1, 5) is on $x^2 + y^2 = 25$.",
        ["$1 + 5 = 6$", "$6 \\ne 25$", "Not on it"],
        0,
        "Square each: $1 + 25 = 26 \\ne 25$. Still not on it, but the working must square.",
      ),
      choose(
        "Back to the problem",
        "“Is (3, 4) on the circle? Where does it cross the $y$-axis?”",
        "Yes; at (0, 5) and (0, −5)",
        "25 and ±5.",
        [
          ["No; at (0, 25)", "$3^2 + 4^2 = 25$."],
          ["Yes; at (5, 0) only", "The $y$-axis, ±."],
        ],
        { picture: plain },
      ),
      quiz([
        [
          ["Radius of $x^2 + y^2 = 64$", "8", ["64", "32"], "$\\sqrt{64}$."],
          ["Radius of $x^2 + y^2 = 2$", "$\\sqrt2$", ["2", "1"], "$\\sqrt2$."],
        ],
        [
          [
            "Circle, centre (0, 0), radius 3",
            "$x^2 + y^2 = 9$",
            ["$x^2 + y^2 = 3$", "$x + y = 3$"],
            "$r^2$.",
          ],
          [
            "Circle, centre (0, 0), radius 10",
            "$x^2 + y^2 = 100$",
            ["$x^2 + y^2 = 10$", "$x + y = 10$"],
            "$r^2$.",
          ],
        ],
        [
          ["Is (0, −6) on $x^2 + y^2 = 36$?", "yes", ["no", "only if r = 36"], "0 + 36."],
          ["Is (4, 4) on $x^2 + y^2 = 16$?", "no", ["yes", "only half"], "32 ≠ 16."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "tangent",
    "GH-A16.b",
    "The tangent to a circle",
    "The tangent is perpendicular to the radius: use the negative reciprocal gradient.",
    [
      problem(
        "Touching at (3, 4)",
        [
          "“Find the equation of the tangent to $x^2 + y^2 = 25$ at the point (3, 4).”",
          "By the end of this lesson, you can find it in three steps.",
        ],
        tangent,
      ),
      typed(
        "Warm-up",
        "Gradient from (0, 0) to (3, 4), as a fraction",
        "4/3",
        "$\\frac{4}{3}$.",
        "$\\frac43$.",
      ),
      choose(
        "Warm-up",
        "Perpendicular to gradient $\\frac43$",
        "$-\\frac34$",
        "Flip and change sign.",
        [
          ["$\\frac34$", "Change the sign."],
          ["$-\\frac43$", "Flip it."],
        ],
      ),
      explain(
        "Discover",
        "Radius, then perpendicular",
        [
          "A tangent meets the radius at **90°**. So: find the gradient of the radius from (0, 0) to the point; the tangent's gradient is its negative reciprocal.",
          "Then use $y = mx + c$ through the point.",
        ],
        tangent,
      ),
      choose("Discover", "The tangent and the radius meet at", "90°", "Circle theorem.", [
        ["45°", "Always a right angle."],
        ["any angle", "Always 90°."],
      ]),
      worked(
        "The tangent",
        "At (3, 4) on $x^2 + y^2 = 25$.",
        [
          ["Radius gradient: $\\frac43$; tangent: $-\\frac34$", "Perpendicular."],
          ["$4 = -\\frac34(3) + c$, so $c = \\frac{25}{4}$", "Substitute."],
          ["$y = -\\frac34 x + \\frac{25}{4}$ (or $3x + 4y = 25$)", "Equation."],
        ],
        "Neat check: $3x + 4y = 25$ uses the point's own coordinates.",
        tangent,
      ),
      steps(
        "Together",
        "Tangent to $x^2 + y^2 = 10$ at (1, 3)",
        "Same steps.",
        [
          ["Radius gradient 3, tangent gradient", "$-\\frac13$", ["−3", "Flip it."], "$-\\frac13$"],
          [
            "$3 = -\\frac13 + c$, so",
            "$c = \\frac{10}{3}$",
            ["$c = 3$", "Add $\\frac13$."],
            "$y = -\\frac13 x + \\frac{10}{3}$",
          ],
        ],
        "Or $x + 3y = 10$.",
      ),
      choose(
        "Together",
        "Tangent at (0, 5) to $x^2 + y^2 = 25$",
        "$y = 5$",
        "Radius vertical, tangent horizontal.",
        [
          ["$x = 0$", "That's the radius line."],
          ["$y = 5x$", "Horizontal."],
        ],
      ),
      choose("Your turn", "Tangent gradient at (4, 2) on $x^2 + y^2 = 20$", "−2", "Radius ½.", [
        ["½", "That's the radius."],
        ["2", "Change the sign."],
      ]),
      typed("Your turn", "Its $y$-intercept", "10", "$2 = -8 + c$.", "$c = 10$.", { unit: "c =" }),
      choose(
        "Watch out",
        "Kim uses the radius's gradient for the tangent. What's wrong?",
        "The tangent is perpendicular to the radius",
        "Negative reciprocal.",
        [["Nothing", "They meet at 90°."]],
      ),
      mistake(
        "Leo finds the tangent at (3, 4).",
        ["Radius gradient $\\frac43$", "Tangent gradient $-\\frac43$", "$y = -\\frac43 x + 8$"],
        1,
        "Flip as well: $-\\frac34$.",
      ),
      choose(
        "Back to the problem",
        "“Find the tangent at (3, 4).”",
        "$3x + 4y = 25$",
        "$y = -\\frac34 x + \\frac{25}{4}$.",
        [
          ["$4x + 3y = 25$", "Gradient would be $-\\frac43$."],
          ["$y = \\frac43 x$", "That's the radius."],
        ],
        { picture: tangent },
      ),
      quiz([
        [
          ["Radius to (5, 0): tangent is", "vertical, $x = 5$", ["horizontal", "$y = 5$"], "⊥."],
          ["Radius to (0, −3): tangent is", "$y = -3$", ["$x = -3$", "$y = 3$"], "⊥."],
        ],
        [
          ["Radius gradient 2: tangent gradient", "$-\\frac12$", ["−2", "$\\frac12$"], "⊥."],
          [
            "Radius gradient $-\\frac25$: tangent gradient",
            "$\\frac52$",
            ["$-\\frac52$", "$\\frac25$"],
            "⊥.",
          ],
        ],
        [
          ["Tangent meets radius at", "90°", ["180°", "60°"], "Theorem."],
          [
            "Tangent to $x^2 + y^2 = r^2$ at $(a, b)$",
            "$ax + by = r^2$",
            ["$ax + by = r$", "$bx + ay = r^2$"],
            "Shortcut.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "circle-theorems",
    "GH-G10",
    "Circle theorems",
    "Learn the rules, then give each one as your reason.",
    [
      problem(
        "Find x, giving reasons",
        [
          "In the circle, the angle at the centre O is $2x$ and the angle at C on the circumference is $x$. “If angle AOB = 130°, find angle ACB. Give a reason.”",
          "By the end of this lesson, you can use and explain the circle theorems.",
        ],
        theorem,
      ),
      typed("Warm-up", "Half of 130", "65", "Divide by 2.", "65."),
      typed("Warm-up", "Angles in a triangle add to", "180", "Rule.", "180°.", { unit: "°" }),
      explain(
        "Discover",
        "The main theorems",
        [
          "**Centre**: the angle at the centre is twice the angle at the circumference. **Semicircle**: the angle in a semicircle is 90°. **Same segment**: angles in the same segment are equal.",
          "**Cyclic quadrilateral**: opposite angles add to 180°. **Tangent**: meets the radius at 90°; two tangents from a point are equal. **Alternate segment**: the angle between tangent and chord equals the angle in the alternate segment.",
        ],
        theorem,
      ),
      choose("Discover", "An angle in a semicircle is", "90°", "Theorem.", [
        ["180°", "That's the straight diameter."],
        ["45°", "Always 90°."],
      ]),
      worked(
        "The problem",
        "AOB = 130°.",
        [
          ["ACB = 130° ÷ 2 = 65°", "Half."],
          [
            "Reason: the angle at the centre is twice the angle at the circumference",
            "Write the theorem.",
          ],
        ],
        "Marks are for the reason as well as the number.",
        theorem,
      ),
      steps(
        "Together",
        "A cyclic quadrilateral has one angle 112°. Find the opposite angle.",
        "Theorem first.",
        [
          [
            "Rule:",
            "opposite angles add to 180°",
            ["they're equal", "Cyclic: they add to 180°."],
            "Opposite angles",
          ],
          ["Angle:", "68°", ["112°", "180 − 112."], "68°"],
        ],
        "Reason: opposite angles of a cyclic quadrilateral sum to 180°.",
      ),
      choose(
        "Together",
        "Two angles stand on the same arc, on the same side. One is 40°. The other is",
        "40°",
        "Same segment.",
        [
          ["80°", "That's at the centre."],
          ["140°", "That's cyclic opposite."],
        ],
      ),
      choose("Your turn", "A tangent and a radius meet at P. The angle there", "90°", "Theorem.", [
        ["45°", "Always 90°."],
        ["180°", "Perpendicular."],
      ]),
      typed(
        "Your turn",
        "Angle at the centre 84°. Angle at the circumference on the same arc",
        "42",
        "Half.",
        "42°.",
        { unit: "°" },
      ),
      choose(
        "Watch out",
        "Ivy doubles the circumference angle to find the circumference angle on another arc. What's wrong?",
        "Doubling only works between centre and circumference on the same arc",
        "Check which angles.",
        [["Nothing", "Same-segment angles are equal, not doubled."]],
      ),
      mistake(
        "Ben finds angle ACB with AOB = 130°.",
        ["Centre angle 130°", "Circumference angle = 2 × 130°", "260°"],
        1,
        "The centre angle is twice the circumference angle: 65°.",
      ),
      choose(
        "Back to the problem",
        "“Find angle ACB. Give a reason.”",
        "65°: angle at the centre is twice the angle at the circumference",
        "Number and reason.",
        [
          ["65°", "Give the reason too."],
          ["130°: same segment", "That's the centre angle."],
        ],
        { picture: theorem },
      ),
      quiz([
        [
          ["Angle in a semicircle", "90°", ["180°", "60°"], "Theorem."],
          ["Cyclic quadrilateral opposite angles add to", "180°", ["360°", "90°"], "Theorem."],
        ],
        [
          ["Centre angle 100°: circumference angle", "50°", ["200°", "100°"], "Half."],
          ["Circumference angle 35°: centre angle", "70°", ["17.5°", "35°"], "Double."],
        ],
        [
          [
            "Tangents from a point are",
            "equal in length",
            ["perpendicular", "parallel"],
            "Theorem.",
          ],
          ["Angles in the same segment are", "equal", ["supplementary", "doubled"], "Theorem."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "vector-proof",
    "GH-G25",
    "Vector proofs",
    "Show two vectors are multiples to prove lines parallel or points in a line.",
    [
      problem(
        "The midpoint theorem",
        [
          "In triangle OAB, $\\overrightarrow{OA}$ = **a** and $\\overrightarrow{OB}$ = **b**. M and N are the midpoints of OB and AB. “Prove that MN is parallel to OA.”",
          "By the end of this lesson, you can prove facts like this with vectors.",
        ],
        triangleVectors,
      ),
      choose("Warm-up", "$\\overrightarrow{AB}$", "**b** − **a**", "A → O → B.", [
        ["**a** − **b**", "That's BA."],
        ["**a** + **b**", "Against **a**."],
      ]),
      choose("Warm-up", "$\\overrightarrow{OM}$, M the midpoint of OB", "½**b**", "Halfway.", [
        ["**b**", "Half of it."],
        ["2**b**", "Half."],
      ]),
      explain(
        "Discover",
        "Multiples mean parallel",
        [
          "If one vector is a number times another, like $\\overrightarrow{MN} = \\frac12\\mathbf{a}$, the lines are **parallel**.",
          "If $\\overrightarrow{PQ} = k\\overrightarrow{QR}$ and they share point Q, then P, Q and R are on one straight line: they're **collinear**.",
        ],
        triangleVectors,
      ),
      choose(
        "Discover",
        "$\\overrightarrow{PQ} = 3\\mathbf{c}$ and $\\overrightarrow{RS} = \\mathbf{c}$ mean",
        "PQ is parallel to RS and 3 times as long",
        "Multiple.",
        [
          ["they're perpendicular", "Multiples are parallel."],
          ["they're the same line", "Parallel, maybe apart."],
        ],
      ),
      worked(
        "The proof",
        "Find $\\overrightarrow{MN}$.",
        [
          [
            "$\\overrightarrow{MN} = \\overrightarrow{MB} + \\overrightarrow{BN} = \\frac12\\mathbf{b} + \\frac12(\\mathbf{a} - \\mathbf{b})$",
            "Route M → B → N.",
          ],
          ["$= \\frac12\\mathbf{a}$", "Simplify."],
          ["$\\overrightarrow{MN}$ is a multiple of **a**, so MN ∥ OA", "Conclude."],
        ],
        "And MN is half as long as OA.",
        triangleVectors,
      ),
      steps(
        "Together",
        "$\\overrightarrow{PQ} = 2\\mathbf{a} + \\mathbf{b}$, $\\overrightarrow{QR} = 6\\mathbf{a} + 3\\mathbf{b}$. Are P, Q, R in a line?",
        "Look for a multiple.",
        [
          [
            "$\\overrightarrow{QR} =$",
            "$3(2\\mathbf{a} + \\mathbf{b}) = 3\\overrightarrow{PQ}$",
            ["not a multiple", "Factor out 3."],
            "3 times PQ",
          ],
          [
            "They share Q, so P, Q, R are",
            "collinear",
            ["parallel but apart", "They share a point."],
            "Collinear",
          ],
        ],
        "State both: a multiple and a shared point.",
      ),
      choose("Together", "Which is parallel to 2**a** − 4**b**?", "**a** − 2**b**", "Half of it.", [
        ["**a** − 4**b**", "Not a multiple."],
        ["2**a** + 4**b**", "Sign changes."],
      ]),
      choose(
        "Your turn",
        "$\\overrightarrow{AB} = \\mathbf{a} + 2\\mathbf{b}$, $\\overrightarrow{CD} = 3\\mathbf{a} + 6\\mathbf{b}$",
        "AB ∥ CD",
        "CD = 3AB.",
        [
          ["AB ⊥ CD", "Multiples are parallel."],
          ["unrelated", "Factorise."],
        ],
      ),
      choose("Your turn", "To prove collinear you need", "a multiple and a shared point", "Both.", [
        ["only a multiple", "That's only parallel."],
        ["only a shared point", "They could bend."],
      ]),
      choose(
        "Watch out",
        "Kim proves AB ∥ BC and concludes A, B, C are parallel lines. What's wrong?",
        "With shared point B, they're collinear: one line",
        "Same line.",
        [["Nothing", "Parallel lines through one point are the same line."]],
      ),
      mistake(
        "Leo finds $\\overrightarrow{MN}$.",
        [
          "$\\overrightarrow{MB} = \\frac12\\mathbf{b}$",
          "$\\overrightarrow{BN} = \\frac12(\\mathbf{b} - \\mathbf{a})$",
          "$\\overrightarrow{MN} = \\mathbf{b} - \\frac12\\mathbf{a}$",
        ],
        1,
        "B to N goes towards A: $\\frac12(\\mathbf{a} - \\mathbf{b})$.",
      ),
      choose(
        "Back to the problem",
        "“Prove MN is parallel to OA.” The key line:",
        "$\\overrightarrow{MN} = \\frac12\\mathbf{a}$, a multiple of $\\overrightarrow{OA}$",
        "Multiple.",
        [
          ["MN looks parallel", "Prove it."],
          ["$\\overrightarrow{MN} = \\mathbf{a} + \\mathbf{b}$", "Check the route."],
        ],
        { picture: triangleVectors },
      ),
      quiz([
        [
          [
            "4**a** + 2**b** is parallel to",
            "2**a** + **b**",
            ["**a** + 2**b**", "4**a** − 2**b**"],
            "Half.",
          ],
          [
            "3**a** − 6**b** is parallel to",
            "**a** − 2**b**",
            ["**a** + 2**b**", "3**a** + 6**b**"],
            "Third.",
          ],
        ],
        [
          ["Collinear means", "on one straight line", ["parallel", "perpendicular"], "One line."],
          [
            "A multiple of a vector is",
            "parallel to it",
            ["perpendicular to it", "equal to it"],
            "Same direction.",
          ],
        ],
        [
          [
            "$\\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$; midpoint M of AB from A",
            "½(**b** − **a**)",
            ["½(**a** + **b**)", "**b** − ½**a**"],
            "Half of AB.",
          ],
          [
            "Then $\\overrightarrow{OM}$ (from O, $\\overrightarrow{OA} = \\mathbf{a}$)",
            "½(**a** + **b**)",
            ["½(**b** − **a**)", "**a** + **b**"],
            "**a** + ½(**b** − **a**).",
          ],
        ],
      ]),
    ],
  ),
];
