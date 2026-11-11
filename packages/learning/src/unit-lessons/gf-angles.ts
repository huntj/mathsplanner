// GCSE Foundation, "Angles", as four short lessons, one just before each skill: angles with
// parallel lines, in triangles and in polygons, and proving results with reasons. Each recaps the
// Key Stage 3 idea quickly, builds it to GCSE level ("give reasons for your answer"), names the
// common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import { parallels, regular } from "./geometry.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const U = "gf-angles";
const P = (x: number, y: number): Point => ({ x, y });

/** A triangle with angles a, b and c, and the parallel line through its top drawn or not. */
const proofTriangle = (parallel: boolean): DrawingPic => ({
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(6, 0)] },
    { line: [P(0, 0), P(2, 3)] },
    { line: [P(6, 0), P(2, 3)] },
    ...(parallel
      ? [
          {
            line: [P(-1, 3), P(6, 3)] as [Point, Point],
            dashed: true as const,
            tone: "soft" as const,
          },
        ]
      : []),
    { angle: P(0, 0), from: 0, to: 56.3, label: "a" },
    { angle: P(6, 0), from: 143.1, to: 180, label: "b" },
    { angle: P(2, 3), from: 236.3, to: 323.1, label: "c" },
  ],
});

export const gfAngles: UnitLesson[] = [
  lesson(
    U,
    "parallel",
    "GF-G3.a",
    "Angles and parallel lines",
    "Alternate and corresponding angles are equal; co-interior add to 180°.",
    [
      problem(
        "Give reasons",
        [
          "“Find the size of angle $x$. Give reasons for your answer.” Half the marks are for the reasons, written properly.",
          "By the end of this lesson, you can find angles across parallel lines and name each rule.",
        ],
        parallels(65, [
          { on: "lower", corner: "up-right", label: "65°" },
          { on: "upper", corner: "down-right", label: "x" },
        ]),
      ),
      typed(
        "Warm-up",
        "Angles on a straight line: 65° and ?",
        "115",
        "They add to 180°.",
        "115°.",
        { unit: "°" },
      ),
      choose(
        "Warm-up",
        "Two lines cross. Vertically opposite angles are",
        "equal",
        "Opposite each other at the crossing.",
        [["add to 180°", "That's angles on a line."]],
      ),
      explain(
        "Discover",
        "Three rules",
        [
          "Across parallel lines: **alternate** angles are equal (a Z), **corresponding** angles are equal (an F), **co-interior** angles add to 180° (a C).",
          "In an exam, write the rule's name as the reason: “alternate angles are equal”.",
        ],
        parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "70°" },
        ]),
      ),
      {
        kind: "sort",
        tag: "Discover",
        title: "Which rule?",
        groups: ["Equal", "Add to 180°"],
        items: [
          {
            text: "Alternate angles (Z)",
            group: 0,
            why: "Either side of the crossing line, between the parallels.",
          },
          { text: "Corresponding angles (F)", group: 0, why: "Same position at each crossing." },
          { text: "Co-interior angles (C)", group: 1, why: "Same side, between the parallels." },
          { text: "Vertically opposite angles", group: 0, why: "Opposite at a crossing." },
          { text: "Angles on a straight line", group: 1, why: "A half turn." },
        ],
        done: "Learn the names: they're your reasons.",
      },
      worked(
        "Find x with reasons",
        "Find $x$.",
        [
          ["The 65° and $x$ are between the parallels, on the same side", "A C shape."],
          ["Co-interior angles add to 180°", "The reason."],
          ["$x = 180 - 65 = 115°$", "The answer."],
        ],
        "Answer plus the rule's name.",
        parallels(65, [
          { on: "lower", corner: "up-right", label: "65°" },
          { on: "upper", corner: "down-right", label: "x" },
        ]),
      ),
      steps(
        "Together",
        "Find $y$",
        "Two steps.",
        [
          [
            "The angle at the top crossing, down-left, is alternate to 55°, so it's",
            "55°",
            ["125°", "Alternate angles are equal."],
            "55°",
          ],
          [
            "$y$ is on a straight line with it, so $y =$",
            "125°",
            ["55°", "Angles on a line add to 180°."],
            "125°",
          ],
        ],
        "Two reasons: alternate angles, then angles on a straight line.",
        parallels(55, [
          { on: "lower", corner: "up-right", label: "55°" },
          { on: "upper", corner: "up-left", label: "y" },
        ]),
      ),
      choose(
        "Together",
        "Which reason fits?",
        "Corresponding angles are equal",
        "Same position at each crossing: an F.",
        [
          ["Alternate angles are equal", "They're on the same side of the crossing line."],
          ["Co-interior angles add to 180°", "They're equal here."],
        ],
        {
          picture: parallels(60, [
            { on: "lower", corner: "down-left", label: "60°" },
            { on: "upper", corner: "down-left", label: "a" },
          ]),
        },
      ),
      typed("Your turn", "Find $a$", "50", "Trace a Z.", "$a = 50°$: alternate angles are equal.", {
        unit: "°",
        picture: parallels(50, [
          { on: "lower", corner: "up-right", label: "50°" },
          { on: "upper", corner: "down-left", label: "a" },
        ]),
        wrong: [["130", "A Z: alternate angles are equal."]],
      }),
      typed(
        "Your turn",
        "Find $b$",
        "105",
        "Same side, between the lines.",
        "$b = 105°$: co-interior angles add to 180°.",
        {
          unit: "°",
          picture: parallels(75, [
            { on: "lower", corner: "up-right", label: "75°" },
            { on: "upper", corner: "down-right", label: "b" },
          ]),
          wrong: [["75", "A C: they add to 180°."]],
        },
      ),
      choose(
        "Watch out",
        "Ben writes the reason “Z angles”. Full marks?",
        "No: write “alternate angles are equal”",
        "Exams want the proper names.",
        [["Yes", "Use the mathematical name."]],
      ),
      mistake(
        "Pip finds $y$. The 70° and $y$ are alternate.",
        ["They make a Z", "Alternate angles add to 180°", "$y = 110°$"],
        1,
        "Alternate angles are equal: $y = 70°$.",
        parallels(70, [
          { on: "lower", corner: "up-right", label: "70°" },
          { on: "upper", corner: "down-left", label: "y" },
        ]),
      ),
      choose(
        "Back to the problem",
        "“Find $x$. Give reasons for your answer.”",
        "115°, because co-interior angles add to 180°",
        "Answer and reason.",
        [
          ["115°", "Give the reason too."],
          ["65°, because alternate angles are equal", "They're on the same side: co-interior."],
        ],
        {
          picture: parallels(65, [
            { on: "lower", corner: "up-right", label: "65°" },
            { on: "upper", corner: "down-right", label: "x" },
          ]),
        },
      ),
      quiz([
        [
          [
            "Find $x$",
            "80°",
            ["100°", "10°"],
            "Alternate angles are equal.",
            parallels(80, [
              { on: "lower", corner: "up-right", label: "80°" },
              { on: "upper", corner: "down-left", label: "x" },
            ]),
          ],
          [
            "Find the angle marked $x$",
            "45°",
            ["135°", "55°"],
            "Alternate angles are equal.",
            parallels(45, [
              { on: "lower", corner: "up-right", label: "45°" },
              { on: "upper", corner: "down-left", label: "x" },
            ]),
          ],
        ],
        [
          ["Co-interior angles", "add to 180°", ["are equal", "add to 360°"], "A C shape."],
          ["Corresponding angles", "are equal", ["add to 180°", "add to 90°"], "An F shape."],
        ],
        [
          [
            "Find $x$",
            "120°",
            ["60°", "30°"],
            "Co-interior.",
            parallels(60, [
              { on: "lower", corner: "up-right", label: "60°" },
              { on: "upper", corner: "down-right", label: "x" },
            ]),
          ],
          [
            "Find the angle marked $x$",
            "100°",
            ["80°", "10°"],
            "Co-interior.",
            parallels(80, [
              { on: "lower", corner: "up-right", label: "80°" },
              { on: "upper", corner: "down-right", label: "x" },
            ]),
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "triangles",
    "GF-G3.b",
    "Angles in triangles",
    "Angles add to 180°; the exterior angle equals the two opposite interior angles.",
    [
      problem(
        "The roof",
        [
          "A roof is an isosceles triangle. One base angle is 35°. And the wall meets the roof's edge outside the triangle at an exterior angle. What are the angles?",
          "By the end of this lesson, you can find any angle in a triangle, with reasons.",
        ],
        { kind: "shape", points: [P(0, 0), P(8, 0), P(4, 2.8)], angles: ["35°", null, null] },
      ),
      typed("Warm-up", "Angles of a triangle add to", "180", "A straight line.", "180°.", {
        unit: "°",
      }),
      typed("Warm-up", "Two angles are 50° and 60°. The third?", "70", "$180 - 110$.", "70°.", {
        unit: "°",
      }),
      explain(
        "Discover",
        "Two rules",
        [
          "Angles in a triangle add to **180°**. In an isosceles triangle, the two **base angles** (opposite the equal sides) are equal.",
          "An **exterior angle** equals the sum of the two **opposite interior** angles.",
        ],
        { kind: "shape", points: [P(0, 0), P(6, 0), P(2, 4)], angles: ["a", null, "b"] },
      ),
      choose(
        "Discover",
        "Interior angles 50° and 70°, not next to the exterior angle. The exterior angle is",
        "120°",
        "$50 + 70$.",
        [
          ["60°", "That's the third interior angle."],
          ["110°", "Add the two opposite angles."],
        ],
      ),
      worked(
        "The roof",
        "Isosceles, base angle 35°. Find the top angle.",
        [
          ["The other base angle is 35°", "Base angles of an isosceles triangle are equal."],
          ["$180 - 35 - 35 = 110°$", "Angles in a triangle add to 180°."],
        ],
        "Two reasons, two marks.",
      ),
      steps(
        "Together",
        "Isosceles, top angle 40°",
        "Find a base angle.",
        [
          ["The two base angles share", "140°", ["180°", "$180 - 40$."], "140°"],
          ["Each base angle is", "70°", ["140°", "They're equal: halve."], "70°"],
        ],
        "Halve what's left.",
      ),
      steps(
        "Together",
        "Exterior angle 130°, one opposite interior angle 75°",
        "Find the other.",
        [
          [
            "Exterior = sum of opposite interior, so",
            "$75 + x = 130$",
            ["$75 + x = 180$", "Exterior equals the two opposite angles."],
            "$x = 55°$",
          ],
          [
            "The third interior angle (next to the exterior) is",
            "50°",
            ["130°", "$180 - 130$."],
            "50°",
          ],
        ],
        "Check: $75 + 55 + 50 = 180$ ✓",
      ),
      typed(
        "Your turn",
        "Right-angled triangle with a 28° angle. The third angle?",
        "62",
        "$180 - 90 - 28$.",
        "62°.",
        { unit: "°", wrong: [["152", "Include the right angle."]] },
      ),
      typed(
        "Your turn",
        "Isosceles, base angle 52°. Top angle?",
        "76",
        "$180 - 52 - 52$.",
        "76°.",
        { unit: "°", wrong: [["128", "Both base angles are 52°."]] },
      ),
      choose(
        "Watch out",
        "Kai says an isosceles triangle's equal angles can be 100° each. Possible?",
        "No: 200° is already more than 180°",
        "Equal angles must each be under 90°.",
        [["Yes", "$100 + 100 > 180$."]],
      ),
      mistake(
        "Ola finds the base angles of an isosceles triangle with top angle 50°.",
        ["The base angles are equal", "Each is $180 - 50 = 130°$", "So 130° and 130°"],
        1,
        "Share the 130°: each base angle is 65°.",
      ),
      choose(
        "Back to the problem",
        "“The roof is isosceles with base angle 35°. Find the top angle. Give reasons.”",
        "110°: base angles of an isosceles triangle are equal; angles in a triangle add to 180°",
        "Both reasons.",
        [
          ["110°", "Give reasons."],
          ["145°: angles add to 180°", "Both base angles are 35°."],
        ],
      ),
      quiz([
        [
          ["Angles 45° and 85°. Third?", "50°", ["130°", "40°"], "$180 - 130$."],
          ["Angles 62° and 71°. Third?", "47°", ["133°", "57°"], "$180 - 133$."],
        ],
        [
          ["Isosceles, top angle 70°: base angle", "55°", ["110°", "70°"], "$110 \\div 2$."],
          ["Isosceles, top angle 24°: base angle", "78°", ["156°", "24°"], "$156 \\div 2$."],
        ],
        [
          ["Opposite interior 40° and 65°: exterior", "105°", ["75°", "25°"], "Add."],
          ["Opposite interior 30° and 85°: exterior", "115°", ["65°", "55°"], "Add."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "polygons",
    "GF-G3.c",
    "Angles in polygons",
    "Interior sum (n − 2) × 180°; exterior angles add to 360°.",
    [
      problem(
        "The tiled floor",
        [
          "Regular hexagons tile a floor with no gaps; regular pentagons don't. The exam asks: “Show why regular pentagons can't tessellate.”",
          "By the end of this lesson, you can work out any polygon's angles, and prove things with them.",
        ],
        { kind: "shape", points: regular(6, 3, 0) },
      ),
      typed("Warm-up", "How many sides does a pentagon have?", "5", "Penta- means five.", "5."),
      typed("Warm-up", "Work out $3 \\times 180$", "540", "$300 \\times 1.8$.", "540."),
      explain(
        "Discover",
        "Triangles inside",
        [
          "From one corner, an $n$-sided polygon splits into $(n - 2)$ triangles. So its interior angles add to $(n - 2) \\times 180°$.",
          "Walk round any polygon and you turn through 360°: the **exterior angles add to 360°**. Interior + exterior = 180° at each corner.",
        ],
        { kind: "maths", tex: "\\text{sum} = (n - 2) \\times 180°" },
      ),
      choose("Discover", "Interior angles of a hexagon add to", "720°", "$4 \\times 180$.", [
        ["1080°", "$(6 - 2)$, not 6."],
        ["360°", "That's a quadrilateral."],
      ]),
      worked(
        "A regular pentagon",
        "Find its interior and exterior angles.",
        [
          ["Exterior: $360 \\div 5 = 72°$", "Exterior angles add to 360°."],
          ["Interior: $180 - 72 = 108°$", "They make a straight line."],
        ],
        "Check: $5 \\times 108 = 540 = 3 \\times 180$ ✓",
      ),
      steps(
        "Together",
        "Why pentagons don't tessellate",
        "Angles round a point.",
        [
          ["Three pentagons at a point make", "324°", ["360°", "$3 \\times 108$."], "324°"],
          [
            "Four would make 432°. So",
            "they can't fill 360° exactly",
            ["they fit", "Neither 3 nor 4 gives 360°."],
            "A gap or an overlap",
          ],
        ],
        "108 doesn't divide 360.",
      ),
      steps(
        "Together",
        "A regular polygon has exterior angle 24°",
        "How many sides?",
        [
          [
            "Exterior angles add to",
            "360°",
            ["180°", "Walking round: a full turn."],
            "$360 \\div 24$",
          ],
          ["Sides:", "15", ["7.5", "$360 \\div 24 = 15$."], "15 sides"],
        ],
        "Number of sides = 360 ÷ exterior angle.",
      ),
      typed(
        "Your turn",
        "Interior angle sum of an octagon",
        "1080",
        "$(8 - 2) \\times 180$.",
        "1080°.",
        { unit: "°", wrong: [["1440", "$n - 2$ triangles."]] },
      ),
      typed(
        "Your turn",
        "Interior angle of a regular decagon (10 sides)",
        "144",
        "Exterior $360 \\div 10 = 36$.",
        "$180 - 36 = 144°$.",
        { unit: "°", wrong: [["36", "That's the exterior angle."]] },
      ),
      choose(
        "Watch out",
        "Zara says a hexagon splits into 6 triangles from one corner. What's wrong?",
        "From one corner it's $6 - 2 = 4$ triangles",
        "Two sides touch the starting corner.",
        [["Nothing", "Draw it: 4 triangles."]],
      ),
      mistake(
        "Sam finds the exterior angle of a regular hexagon.",
        ["Interior sum $720°$", "Each interior angle 120°", "Exterior angle $360 - 120 = 240°$"],
        2,
        "Interior and exterior make a straight line: $180 - 120 = 60°$.",
      ),
      choose(
        "Back to the problem",
        "“Show why regular pentagons can't tessellate.”",
        "Each interior angle is 108°, and 360 isn't a multiple of 108",
        "Angles round a point must make 360°.",
        [
          ["Pentagons have 5 sides", "Show it with angles."],
          ["Each angle is 72°", "72° is the exterior angle."],
        ],
      ),
      quiz([
        [
          ["Interior sum of a pentagon", "540°", ["900°", "360°"], "$3 \\times 180$."],
          ["Interior sum of a heptagon", "900°", ["1260°", "720°"], "$5 \\times 180$."],
        ],
        [
          ["Exterior angle of a regular octagon", "45°", ["135°", "60°"], "$360 \\div 8$."],
          ["Exterior angle of a regular 12-gon", "30°", ["150°", "15°"], "$360 \\div 12$."],
        ],
        [
          ["Regular polygon, exterior 40°: sides", "9", ["4.5", "40"], "$360 \\div 40$."],
          ["Regular polygon, exterior 20°: sides", "18", ["9", "20"], "$360 \\div 20$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "proof",
    "GF-G6",
    "Proving angle facts",
    "Use known facts, with reasons, to prove new ones.",
    [
      problem(
        "Prove it",
        [
          "“Prove that the angles in a triangle add up to 180°.” You've used this fact for years. Can you show why it's always true?",
          "By the end of this lesson, you can write a short geometric proof with a reason at every step.",
        ],
        proofTriangle(false),
      ),
      choose("Warm-up", "Alternate angles are", "equal", "A Z shape between parallel lines.", [
        ["add to 180°", "That's co-interior."],
      ]),
      choose("Warm-up", "Angles on a straight line add to", "180°", "A half turn.", [
        ["360°", "That's round a point."],
      ]),
      explain(
        "Discover",
        "What a proof is",
        [
          "A **proof** shows something is true for **every** case, not just the ones you tried. Each line uses a known fact, with its reason.",
          "For the triangle: draw a line through the top corner parallel to the base.",
        ],
        proofTriangle(true),
      ),
      choose(
        "Discover",
        "At the top, next to $c$, the angles under the parallel line are",
        "$a$ and $b$, by alternate angles",
        "Each makes a Z with the base.",
        [["$c$ and $c$", "They're alternate to $a$ and $b$."]],
      ),
      worked(
        "The proof",
        "Prove that the angles in a triangle add to 180°.",
        [
          ["Draw a line through the top, parallel to the base", "Construction."],
          ["The angles beside $c$ equal $a$ and $b$", "Alternate angles are equal."],
          [
            "$a$, $c$ and $b$ lie on a straight line, so $a + b + c = 180°$",
            "Angles on a straight line add to 180°.",
          ],
        ],
        "Every step has a reason, so it works for every triangle.",
      ),
      steps(
        "Together",
        "Prove the exterior angle equals the two opposite interior angles",
        "Triangle with angles $a$, $b$, $c$; exterior angle $e$ next to $c$.",
        [
          [
            "$c + e = 180°$ because",
            "angles on a straight line add to 180°",
            ["alternate angles", "$c$ and $e$ make a straight line."],
            "$c + e = 180$",
          ],
          [
            "$a + b + c = 180°$, so",
            "$e = a + b$",
            ["$e = c$", "Both equal 180 minus $c$."],
            "$e = a + b$",
          ],
        ],
        "Two facts combine into a new one.",
      ),
      choose(
        "Together",
        "Why isn't checking three triangles a proof?",
        "A proof must work for every triangle",
        "Examples show it's likely, not always.",
        [["Three is enough", "There are infinitely many triangles."]],
      ),
      choose(
        "Your turn",
        "In a parallelogram, the first angle is $x$. Show the next is $180 - x$. Reason:",
        "Co-interior angles add to 180°",
        "Opposite sides are parallel.",
        [["Alternate angles are equal", "They're on the same side: co-interior."]],
      ),
      choose(
        "Your turn",
        "Prove a quadrilateral's angles add to 360°. First step:",
        "Split it into two triangles with a diagonal",
        "Each triangle gives 180°.",
        [["Measure the angles", "A proof doesn't measure."]],
      ),
      choose(
        "Watch out",
        "Jo's proof says “$x = 70°$”. Why might she lose marks?",
        "No reason given",
        "Every line needs its reason.",
        [["Wrong answer", "The answer may be right; the reason is missing."]],
      ),
      mistake(
        "Leo proves angles in a triangle add to 180°.",
        [
          "Draw a line through the top, parallel to the base",
          "The angles beside the top angle are corresponding to the base angles",
          "They lie on a straight line, so they add to 180°",
        ],
        1,
        "They're alternate angles (Z shapes), not corresponding.",
      ),
      choose(
        "Back to the problem",
        "“Prove that the angles in a triangle add up to 180°.” The key step is",
        "Draw a parallel line; use alternate angles, then angles on a straight line",
        "Reasons at every step.",
        [
          ["Measure lots of triangles", "That's evidence, not proof."],
          ["Use the fact that they add to 180°", "That assumes what you're proving."],
        ],
      ),
      quiz([
        [
          ["A proof must work for", "every case", ["most cases", "the examples"], "Always true."],
          ["A proof needs", "a reason at each step", ["a diagram only", "measuring"], "Reasons."],
        ],
        [
          [
            "Triangle proof uses",
            "alternate angles",
            ["co-interior angles", "vertically opposite"],
            "Z shapes.",
          ],
          [
            "Exterior angle proof uses",
            "angles on a straight line",
            ["alternate angles", "parallel lines"],
            "With the 180° sum.",
          ],
        ],
        [
          [
            "Quadrilateral angle sum proof",
            "two triangles: 2 × 180°",
            ["four right angles", "measuring"],
            "Split it.",
          ],
          [
            "Pentagon angle sum proof",
            "three triangles: 3 × 180°",
            ["five triangles", "measuring"],
            "From one corner.",
          ],
        ],
      ]),
    ],
  ),
];
