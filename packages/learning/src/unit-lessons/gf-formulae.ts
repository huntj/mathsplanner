// GCSE Foundation, "Formulae and substitution", as four short lessons, one just before each
// skill: substituting into expressions, into formulae (scientific ones too), using standard
// formulae, and changing the subject. Each recaps the Key Stage 3 idea quickly, builds it to GCSE
// level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-formulae";

export const gfFormulae: UnitLesson[] = [
  lesson(
    U,
    "expressions",
    "GF-A2.a",
    "Substituting into expressions",
    "Swap letters for numbers, then follow the order of operations.",
    [
      problem("The exam question", [
        "“$a = 3$, $b = -2$. Work out the value of $a^2 - 4b$.” Two pupils get 1 and 17.",
        "Negatives and powers trip people up. By the end of this lesson, you'll get it right every time.",
      ]),
      typed("Warm-up", "If $n = 5$, what is $3n$?", "15", "$3 \\times 5$.", "15."),
      typed("Warm-up", "Work out $-4 \\times -2$", "8", "Same signs.", "8."),
      explain(
        "Discover",
        "Brackets round every number",
        [
          "Replace each letter with its value **in brackets**, then use the order of operations.",
          "Brackets stop sign slips: $a^2 - 4b$ with $b = -2$ becomes $(3)^2 - 4(-2)$.",
        ],
        { kind: "maths", tex: "(3)^2 - 4(-2) = 9 + 8 = 17" },
      ),
      choose("Discover", "If $x = -3$, $x^2 =$", "9", "$(-3)^2 = -3 \\times -3$.", [
        ["−9", "Squaring a negative gives a positive."],
        ["−6", "Squaring isn't doubling."],
      ]),
      worked(
        "Two letters",
        "$p = 4$, $q = -1$. Work out $\\frac{5p + q}{p - q}$.",
        [
          ["Top: $5(4) + (-1) = 19$", "Substitute with brackets."],
          ["Bottom: $4 - (-1) = 5$", "Subtracting a negative adds."],
          ["$19 \\div 5 = 3.8$", "Then divide."],
        ],
        "Work out the top and bottom separately.",
      ),
      steps(
        "Together",
        "$m = 2$, $n = -5$. Work out $3m^2 + mn$",
        "$3m^2 + mn$",
        [
          ["$3m^2 = 3(2)^2 =$", "12", ["36", "Square first, then times 3."], "$12 + mn$"],
          ["$mn = (2)(-5) =$", "−10", ["−3", "Multiply, don't add."], "$12 + (-10)$"],
        ],
        "$12 - 10 = 2$.",
      ),
      choose("Together", "$t = -4$. Work out $10 - t$", "14", "$10 - (-4) = 14$.", [
        ["6", "Subtracting a negative adds."],
        ["−14", "$10 + 4 = 14$."],
      ]),
      typed("Your turn", "$x = 6$, $y = -2$. Work out $2x + 3y$", "6", "$12 + (-6)$.", "6.", {
        wrong: [["18", "$3 \\times -2 = -6$."]],
      }),
      typed(
        "Your turn",
        "$k = -1$. Work out $k^3 + 2k^2$",
        "1",
        "$(-1)^3 = -1$, $(-1)^2 = 1$.",
        "$-1 + 2 = 1$.",
        { wrong: [["-3", "$(-1)^2 = +1$."]] },
      ),
      choose(
        "Watch out",
        "For $x = 4$, Leo works out $3x^2$ as $12^2 = 144$. What's wrong?",
        "Only $x$ is squared: $3 \\times 16 = 48$",
        "Powers come before multiplying.",
        [["Nothing", "$3x^2$ means $3 \\times x^2$."]],
      ),
      mistake(
        "$a = 5$, $b = -3$. Mia works out $a - b^2$.",
        ["$b^2 = (-3)^2 = 9$", "$a - b^2 = 5 - 9$", "$= 14$"],
        2,
        "$5 - 9 = -4$.",
      ),
      choose(
        "Back to the problem",
        "“$a = 3$, $b = -2$. Work out $a^2 - 4b$.”",
        "17",
        "$9 - 4(-2) = 9 + 8$.",
        [
          ["1", "$-4 \\times -2 = +8$."],
          ["−5", "$a^2 = 9$."],
        ],
      ),
      quiz([
        [
          ["$x = -2$: $x^2 + 3x$", "−2", ["10", "−10"], "$4 - 6$."],
          ["$x = -3$: $x^2 + 2x$", "3", ["15", "−15"], "$9 - 6$."],
        ],
        [
          ["$p = 3$, $q = 5$: $\\frac{p + q}{2}$", "4", ["5.5", "8"], "$8 \\div 2$."],
          ["$p = 7$, $q = 1$: $\\frac{p - q}{3}$", "2", ["6.67", "6"], "$6 \\div 3$."],
        ],
        [
          ["$a = 2$: $5a^2$", "20", ["100", "10"], "$5 \\times 4$."],
          ["$a = 3$: $2a^2$", "18", ["36", "12"], "$2 \\times 9$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "formulae",
    "GF-A2.b",
    "Using formulae",
    "Substitute into formulae, including from science.",
    [
      problem("The falling stone", [
        "A stone dropped from rest falls $s = \\frac12 g t^2$ metres in $t$ seconds, with $g = 9.8$. How far in 3 seconds?",
        "Science is full of formulae like this. By the end of this lesson, you can use any of them.",
      ]),
      typed("Warm-up", "Work out $3^2$", "9", "$3 \\times 3$.", "9."),
      typed("Warm-up", "Work out $\\frac12 \\times 9.8$", "4.9", "Half of 9.8.", "4.9."),
      explain(
        "Discover",
        "Subject and variables",
        [
          "In $v = u + at$, $v$ is the **subject**: the one the formula works out. $u$, $a$ and $t$ are the inputs.",
          "Substitute the inputs, then follow the order of operations. Give units with the answer.",
        ],
        { kind: "maths", tex: "v = u + at" },
      ),
      choose(
        "Discover",
        "$v = u + at$, $u = 5$, $a = 2$, $t = 3$. $v =$",
        "11",
        "$5 + 2 \\times 3$.",
        [
          ["21", "Multiply before adding."],
          ["10", "$at = 6$."],
        ],
      ),
      worked(
        "The stone",
        "Use $s = \\frac12 g t^2$ with $g = 9.8$ and $t = 3$.",
        [
          ["$t^2 = 9$", "Powers first."],
          ["$s = 0.5 \\times 9.8 \\times 9$", "Substitute."],
          ["$s = 44.1$ m", "Units."],
        ],
        "Square $t$ before anything else.",
      ),
      steps(
        "Together",
        "Convert 20°C using $F = \\frac95 C + 32$",
        "$C = 20$",
        [
          ["$\\frac95 \\times 20 =$", "36", ["11.1", "$20 \\div 5 \\times 9$."], "$36 + 32$"],
          ["So $F =$", "68", ["36", "Add the 32."], "68°F"],
        ],
        "20°C is 68°F.",
      ),
      steps(
        "Together",
        "Kinetic energy $E = \\frac12 m v^2$, $m = 4$, $v = 5$",
        "$E = \\frac12 m v^2$",
        [
          ["$v^2 =$", "25", ["10", "Square, don't double."], "$E = 0.5 \\times 4 \\times 25$"],
          ["$E =$", "50", ["100", "Half of $4 \\times 25$."], "50 joules"],
        ],
        "$E = 50$ J.",
      ),
      typed(
        "Your turn",
        "$P = 2(l + w)$, $l = 7$, $w = 4$. Find $P$",
        "22",
        "Brackets first.",
        "$2 \\times 11 = 22$.",
        { wrong: [["18", "Times all of $l + w$ by 2."]] },
      ),
      typed(
        "Your turn",
        "$A = \\pi r^2$, $r = 5$. Find $A$ to 1 d.p.",
        "78.5",
        "$\\pi \\times 25$.",
        "78.5.",
        { wrong: [["246.7", "Square the 5 only."]] },
      ),
      choose(
        "Watch out",
        "$F = \\frac95 C + 32$ with $C = -10$. Ade gets 50. What's wrong?",
        "$\\frac95 \\times -10 = -18$, so $F = 14$",
        "Keep the negative.",
        [["Nothing", "$\\frac95 \\times -10$ is negative."]],
      ),
      mistake(
        "Using $v^2 = u^2 + 2as$, $u = 3$, $a = 4$, $s = 2$, Ben finds $v$.",
        ["$v^2 = 9 + 2 \\times 4 \\times 2$", "$v^2 = 25$", "$v = 25$"],
        2,
        "That's $v^2$. Take the square root: $v = 5$.",
      ),
      typed(
        "Back to the problem",
        "“Use $s = \\frac12 g t^2$, $g = 9.8$, to find how far the stone falls in 3 seconds.”",
        "44.1",
        "$0.5 \\times 9.8 \\times 9$.",
        "44.1 m.",
        { unit: "m", wrong: [["14.7", "Square $t$: $3^2 = 9$."]] },
      ),
      quiz([
        [
          ["$v = u + at$: $u = 2$, $a = 3$, $t = 4$", "14", ["20", "9"], "$2 + 12$."],
          ["$v = u + at$: $u = 0$, $a = 5$, $t = 6$", "30", ["11", "56"], "$0 + 30$."],
        ],
        [
          ["$E = mc^2$: $m = 2$, $c = 3$", "18", ["36", "12"], "$2 \\times 9$."],
          ["$E = mc^2$: $m = 5$, $c = 2$", "20", ["100", "14"], "$5 \\times 4$."],
        ],
        [
          ["$C = 2\\pi r$, $r = 4$, to 1 d.p.", "25.1", ["50.3", "12.6"], "$8\\pi$."],
          ["$C = 2\\pi r$, $r = 10$, to 1 d.p.", "62.8", ["314.2", "31.4"], "$20\\pi$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "standard",
    "GF-A5.a",
    "Standard formulae",
    "Know and use the formulae for area, volume, speed and more.",
    [
      problem("Which formula?", [
        "“A car travels 150 km in 2.5 hours. A trapezium has parallel sides 6 cm and 10 cm, height 4 cm.” The exam doesn't always give the formula.",
        "By the end of this lesson, you'll know which formula to use, and use it.",
      ]),
      choose("Warm-up", "The area of a rectangle is", "length × width", "$A = lw$.", [
        ["length + width", "That's half the perimeter."],
      ]),
      typed("Warm-up", "Work out $150 \\div 2.5$", "60", "$1500 \\div 25$.", "60."),
      explain(
        "Discover",
        "Formulae to know",
        [
          "Rectangle $A = lw$; triangle $A = \\frac12 bh$; trapezium $A = \\frac12(a + b)h$; circle $A = \\pi r^2$, $C = \\pi d$.",
          "Prism $V = $ area of cross-section × length. Speed $= \\frac{\\text{distance}}{\\text{time}}$. Density $= \\frac{\\text{mass}}{\\text{volume}}$.",
        ],
        {
          kind: "table",
          head: ["Thing", "Formula"],
          rows: [
            ["Trapezium", "$\\frac12(a+b)h$"],
            ["Circle", "$\\pi r^2$"],
            ["Speed", "$d \\div t$"],
            ["Density", "$m \\div V$"],
          ],
        },
      ),
      choose(
        "Discover",
        "Which formula gives a triangle's area?",
        "$\\frac12 bh$",
        "Half the rectangle round it.",
        [
          ["$bh$", "That's the whole rectangle."],
          ["$\\frac12(a+b)h$", "That's a trapezium."],
        ],
      ),
      worked(
        "The trapezium",
        "Parallel sides 6 cm and 10 cm, height 4 cm. Find the area.",
        [
          ["$A = \\frac12(a + b)h$", "Trapezium."],
          ["$= \\frac12(6 + 10) \\times 4$", "Substitute."],
          ["$= 8 \\times 4 = 32$ cm²", "Units squared."],
        ],
        "Add the parallel sides, halve, times the height.",
      ),
      steps(
        "Together",
        "A car goes 150 km in 2.5 hours",
        "Find its average speed.",
        [
          [
            "Formula:",
            "speed = distance ÷ time",
            ["speed = distance × time", "km per hour: divide."],
            "$150 \\div 2.5$",
          ],
          ["Speed:", "60 km/h", ["375 km/h", "That multiplies."], "60 km/h"],
        ],
        "The units tell you the formula: km/h is km ÷ h.",
      ),
      steps(
        "Together",
        "A cuboid is 5 cm by 3 cm by 2 cm",
        "Find its volume.",
        [
          ["$V = lwh =$", "30 cm³", ["10 cm³", "Multiply all three."], "30 cm³"],
          ["The units are", "cm³", ["cm²", "Three lengths multiplied: cubed."], "30 cm³"],
        ],
        "Volume units are cubed.",
      ),
      typed(
        "Your turn",
        "A triangle has base 8 cm and height 5 cm. Area?",
        "20",
        "$\\frac12 \\times 8 \\times 5$.",
        "20 cm².",
        { unit: "cm²", wrong: [["40", "Halve it."]] },
      ),
      typed("Your turn", "Mass 60 g, volume 20 cm³. Density?", "3", "Mass ÷ volume.", "3 g/cm³.", {
        unit: "g/cm³",
        wrong: [["1200", "Divide, don't multiply."]],
      }),
      choose(
        "Watch out",
        "For a triangle with sides 5, 8 and 6 cm and height 4 cm on the 8 cm base, Jo uses the 5 cm side as the height. What's wrong?",
        "The height must be perpendicular to the base: 4 cm",
        "Slanted sides aren't heights.",
        [["Nothing", "The height meets the base at 90°."]],
      ),
      mistake(
        "Raj finds a circle's area, radius 3 cm.",
        ["$A = \\pi r^2$", "$= \\pi \\times 6$", "$= 18.8$ cm²"],
        1,
        "$r^2 = 3^2 = 9$, not $2 \\times 3$: $A = 28.3$ cm².",
      ),
      typed(
        "Back to the problem",
        "“Work out the area of a trapezium with parallel sides 6 cm and 10 cm and height 4 cm.”",
        "32",
        "$\\frac12(6 + 10) \\times 4$.",
        "32 cm².",
        { unit: "cm²", wrong: [["240", "Add the parallel sides, don't multiply."]] },
      ),
      quiz([
        [
          ["Area of a triangle, base 10, height 6", "30", ["60", "16"], "Half of 60."],
          ["Area of a triangle, base 7, height 4", "14", ["28", "11"], "Half of 28."],
        ],
        [
          ["Speed: 90 km in 1.5 h", "60 km/h", ["135 km/h", "45 km/h"], "$90 \\div 1.5$."],
          ["Speed: 200 km in 2.5 h", "80 km/h", ["500 km/h", "40 km/h"], "$200 \\div 2.5$."],
        ],
        [
          ["Trapezium: 3 and 5, height 2", "8", ["16", "15"], "$\\frac12 \\times 8 \\times 2$."],
          ["Trapezium: 4 and 8, height 5", "30", ["60", "160"], "$\\frac12 \\times 12 \\times 5$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "rearrange",
    "GF-A5.b",
    "Changing the subject",
    "Undo operations to make a different letter the subject.",
    [
      problem("How long will it take?", [
        "$v = u + at$ gives speed. But you want the time $t$ when you know $v$, $u$ and $a$.",
        "Rearranging makes a formula answer a new question. By the end of this lesson, you can do it.",
      ]),
      typed("Warm-up", "Solve $3x + 2 = 14$", "4", "Subtract 2, divide by 3.", "$x = 4$."),
      choose("Warm-up", "The inverse of “add $u$” is", "subtract $u$", "Undo with the opposite.", [
        ["divide by $u$", "Subtract undoes add."],
      ]),
      explain(
        "Discover",
        "Like solving an equation",
        [
          "Rearranging is solving, but with letters: do the same to both sides to get the new subject on its own.",
          "Undo operations in reverse order: what was done last is undone first.",
        ],
        {
          kind: "maths",
          tex: "\\begin{aligned} v &= u + at \\\\ v - u &= at \\\\ t &= \\frac{v - u}{a} \\end{aligned}",
        },
      ),
      choose(
        "Discover",
        "Make $x$ the subject of $y = x - 7$",
        "$x = y + 7$",
        "Add 7 to both sides.",
        [
          ["$x = y - 7$", "Undo − 7 by adding 7."],
          ["$x = 7y$", "There's no multiplying."],
        ],
      ),
      worked(
        "Make $t$ the subject",
        "Rearrange $v = u + at$ to make $t$ the subject.",
        [
          ["$v - u = at$", "Subtract $u$ from both sides."],
          ["$\\frac{v - u}{a} = t$", "Divide both sides by $a$."],
          ["$t = \\frac{v - u}{a}$", "Write the subject on the left."],
        ],
        "Two steps: undo + $u$, then undo × $a$.",
      ),
      steps(
        "Together",
        "Make $r$ the subject of $C = 2\\pi r$",
        "$C = 2\\pi r$",
        [
          [
            "$r$ is multiplied by $2\\pi$, so",
            "divide both sides by $2\\pi$",
            ["subtract $2\\pi$", "$2\\pi r$ is times, not plus."],
            "$\\frac{C}{2\\pi} = r$",
          ],
          [
            "So",
            "$r = \\frac{C}{2\\pi}$",
            ["$r = C - 2\\pi$", "Divide, don't subtract."],
            "$r = \\frac{C}{2\\pi}$",
          ],
        ],
        "A circle with $C = 31.4$ has $r \\approx 5$.",
      ),
      steps(
        "Together",
        "Make $x$ the subject of $y = \\frac{x}{3} + 4$",
        "$y = \\frac{x}{3} + 4$",
        [
          [
            "Undo + 4:",
            "$y - 4 = \\frac{x}{3}$",
            ["$3y = x + 4$", "Undo the last step first: + 4."],
            "$y - 4 = \\frac{x}{3}$",
          ],
          [
            "Undo ÷ 3:",
            "$x = 3(y - 4)$",
            ["$x = 3y - 4$", "Multiply all of $y - 4$ by 3."],
            "$x = 3(y - 4)$",
          ],
        ],
        "Or $x = 3y - 12$.",
      ),
      choose(
        "Your turn",
        "Make $w$ the subject of $P = 2l + 2w$",
        "$w = \\frac{P - 2l}{2}$",
        "Subtract $2l$, then halve.",
        [
          ["$w = P - 2l - 2$", "Undo × 2 by dividing."],
          ["$w = \\frac{P}{2} - 2l$", "Halve all of $P - 2l$."],
        ],
      ),
      choose(
        "Your turn",
        "Make $h$ the subject of $A = \\frac12 bh$",
        "$h = \\frac{2A}{b}$",
        "Times by 2, divide by $b$.",
        [
          ["$h = \\frac{A}{2b}$", "Undo ÷ 2 by multiplying by 2."],
          ["$h = 2A - b$", "Divide by $b$."],
        ],
      ),
      choose(
        "Watch out",
        "Sam makes $x$ the subject of $y = 4x + 1$ by dividing by 4 first: $x = \\frac{y}{4} + 1$. What's wrong?",
        "Undo + 1 first: $x = \\frac{y - 1}{4}$",
        "Dividing by 4 would divide the 1 too.",
        [["Nothing", "Try $x = 2$: $y = 9$, but $\\frac94 + 1 = 3.25$."]],
      ),
      mistake(
        "Tom makes $a$ the subject of $v = u + at$.",
        ["$v - u = at$", "$v - u - t = a$", "$a = v - u - t$"],
        1,
        "$t$ multiplies $a$: divide by $t$. $a = \\frac{v - u}{t}$.",
      ),
      choose(
        "Back to the problem",
        "“Rearrange $v = u + at$ to make $t$ the subject.”",
        "$t = \\frac{v - u}{a}$",
        "Subtract $u$, then divide by $a$.",
        [
          ["$t = \\frac{v}{a} - u$", "Subtract $u$ before dividing."],
          ["$t = v - u - a$", "Divide by $a$."],
        ],
      ),
      quiz([
        [
          [
            "Make $x$ the subject: $y = 5x$",
            "$x = \\frac{y}{5}$",
            ["$x = y - 5$", "$x = 5y$"],
            "Divide by 5.",
          ],
          [
            "Make $x$ the subject: $y = 8x$",
            "$x = \\frac{y}{8}$",
            ["$x = y - 8$", "$x = 8y$"],
            "Divide by 8.",
          ],
        ],
        [
          [
            "Make $x$ the subject: $y = 2x - 3$",
            "$x = \\frac{y + 3}{2}$",
            ["$x = \\frac{y}{2} + 3$", "$x = 2y + 3$"],
            "Add 3, halve.",
          ],
          [
            "Make $x$ the subject: $y = 3x + 6$",
            "$x = \\frac{y - 6}{3}$",
            ["$x = \\frac{y}{3} - 6$", "$x = 3y - 6$"],
            "Subtract 6, divide by 3.",
          ],
        ],
        [
          [
            "Make $m$ the subject: $F = ma$",
            "$m = \\frac{F}{a}$",
            ["$m = Fa$", "$m = F - a$"],
            "Divide by $a$.",
          ],
          [
            "Make $d$ the subject: $s = \\frac{d}{t}$",
            "$d = st$",
            ["$d = \\frac{s}{t}$", "$d = s - t$"],
            "Multiply by $t$.",
          ],
        ],
      ]),
    ],
  ),
];
