// GCSE Foundation, "Rounding, estimation and standard form", as eight short lessons, one just
// before each skill: estimating, rounding to decimal places and significant figures, error
// intervals for rounding and truncation, limits of accuracy, and writing and calculating with
// standard form. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the
// common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-rounding";

export const gfRounding: UnitLesson[] = [
  lesson(
    U,
    "estimate",
    "GF-N14",
    "Estimating",
    "Round every number to 1 significant figure, then calculate.",
    [
      problem("Is the calculator right?", [
        "“By rounding each number to 1 significant figure, estimate $\\dfrac{48.7 \\times 3.1}{0.52}$.” Your calculator says 290.3. Is that sensible?",
        "By the end of this lesson, you can estimate fast and use it to check answers.",
      ]),
      typed("Warm-up", "Round 48.7 to the nearest 10", "50", "8 rounds up.", "50."),
      typed("Warm-up", "Work out $150 \\div 0.5$", "300", "How many halves in 150?", "300."),
      explain(
        "Discover",
        "One significant figure",
        [
          "Round each number to **1 significant figure**: its first non-zero digit, with zeros after. 48.7 → 50, 3.1 → 3, 0.52 → 0.5.",
          "Then do the easy calculation. Use ≈ for “approximately equal to”.",
        ],
        {
          kind: "maths",
          tex: "\\frac{48.7 \\times 3.1}{0.52} \\approx \\frac{50 \\times 3}{0.5} = 300",
        },
      ),
      choose("Discover", "0.52 to 1 significant figure", "0.5", "The first non-zero digit is 5.", [
        ["1", "Look at the first non-zero digit."],
        ["0.52", "One figure only."],
      ]),
      worked(
        "The estimate",
        "Estimate $\\dfrac{48.7 \\times 3.1}{0.52}$.",
        [
          ["$\\approx \\dfrac{50 \\times 3}{0.5}$", "Each to 1 s.f."],
          ["$= \\dfrac{150}{0.5} = 300$", "Dividing by 0.5 doubles."],
        ],
        "290.3 is close to 300: sensible.",
      ),
      steps(
        "Together",
        "Estimate $\\sqrt{63} \\times 4.9$",
        "Roots too.",
        [
          ["$\\sqrt{63} \\approx$", "8", ["31.5", "$\\sqrt{64} = 8$."], "$8 \\times 5$"],
          ["So", "≈ 40", ["≈ 400", "$8 \\times 5 = 40$."], "≈ 40"],
        ],
        "Use a nearby square number.",
      ),
      choose("Together", "Estimate $\\dfrac{297}{5.8}$", "50", "$300 \\div 6$.", [
        ["5", "$300 \\div 6 = 50$."],
        ["1800", "Divide, don't multiply."],
      ]),
      choose("Your turn", "Estimate $6.8 \\times 41.2$", "280", "$7 \\times 40$.", [
        ["240", "6.8 rounds to 7."],
        ["2800", "$7 \\times 40 = 280$."],
      ]),
      choose("Your turn", "Estimate $\\frac{396}{19.8}$", "20", "$400 \\div 20$.", [
        ["2", "$400 \\div 20 = 20$."],
        ["200", "Check the division."],
      ]),
      choose(
        "Watch out",
        "Raj rounds 0.38 to 0 to estimate $5.2 \\div 0.38$. What's wrong?",
        "To 1 s.f. it's 0.4, not 0: $5 \\div 0.4 = 12.5$",
        "Never round to zero: you can't divide by it.",
        [["Nothing", "1 significant figure keeps the 4."]],
      ),
      mistake(
        "Ella estimates $\\frac{21.3 + 9.8}{4.1}$.",
        ["$\\approx \\frac{20 + 10}{4}$", "$= 20 + 2.5$", "$= 22.5$"],
        1,
        "The fraction line divides all of the top: $30 \\div 4 = 7.5$.",
      ),
      choose(
        "Back to the problem",
        "“Estimate $\\dfrac{48.7 \\times 3.1}{0.52}$ by rounding to 1 s.f.”",
        "300",
        "$\\frac{50 \\times 3}{0.5}$.",
        [
          ["75", "Dividing by 0.5 doubles: 300."],
          ["30", "$150 \\div 0.5 = 300$."],
        ],
      ),
      quiz([
        [
          ["Estimate $19.7 \\times 5.2$", "100", ["95", "120"], "$20 \\times 5$."],
          ["Estimate $31 \\times 9.8$", "300", ["270", "310"], "$30 \\times 10$."],
        ],
        [
          [
            "Estimate $\\frac{8.9 \\times 6.1}{2.9}$",
            "18",
            ["54", "20"],
            "$\\frac{9 \\times 6}{3}$.",
          ],
          [
            "Estimate $\\frac{41 \\times 2.1}{3.9}$",
            "20",
            ["80", "10"],
            "$\\frac{40 \\times 2}{4}$.",
          ],
        ],
        [
          ["0.0067 to 1 s.f.", "0.007", ["0.0067", "0.01"], "First non-zero digit."],
          ["0.83 to 1 s.f.", "0.8", ["1", "0.83"], "First non-zero digit."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "decimal-places",
    "GF-N15.a",
    "Rounding to decimal places",
    "Look at the next digit: 5 or more rounds up.",
    [
      problem("The bill", [
        "Three friends split a £47 bill: $47 \\div 3 = 15.666…$. “Give your answer to 2 decimal places.” How much does each pay?",
        "By the end of this lesson, you can round to any number of decimal places.",
      ]),
      typed("Warm-up", "Round 3.7 to the nearest whole number", "4", "7 rounds up.", "4."),
      typed("Warm-up", "Round 12.4 to the nearest whole number", "12", "4 rounds down.", "12."),
      explain(
        "Discover",
        "The deciding digit",
        [
          "To round to 2 decimal places, look at the **third** decimal place: 5 or more, round up; 4 or less, leave it.",
          "Keep the zeros you need: 2.399 to 2 d.p. is 2.40, not 2.4.",
        ],
        { kind: "maths", tex: "15.66\\underline{6} \\to 15.67" },
      ),
      choose("Discover", "3.14159 to 2 d.p.", "3.14", "The third decimal, 1, rounds down.", [
        ["3.15", "Look at the 1."],
        ["3.1", "Two decimal places."],
      ]),
      worked(
        "The bill",
        "Round 15.666… to 2 d.p.",
        [
          ["Deciding digit: the third, 6", "5 or more."],
          ["15.67", "Round up."],
        ],
        "Each pays £15.67 (and one penny is left over).",
      ),
      steps(
        "Together",
        "Round 0.0849 to 2 d.p.",
        "0.0849",
        [
          ["The deciding digit is", "4", ["9", "The third decimal place."], "Round down"],
          ["So", "0.08", ["0.09", "4 rounds down."], "0.08"],
        ],
        "Only the next digit decides.",
      ),
      choose("Together", "Round 7.995 to 2 d.p.", "8.00", "9 + 1 carries: 7.99 → 8.00.", [
        ["7.10", "The carry goes into the units."],
        ["8", "Show 2 decimal places."],
      ]),
      typed("Your turn", "Round 4.738 to 1 d.p.", "4.7", "Look at the 3.", "4.7.", {
        wrong: [["4.8", "3 rounds down."]],
      }),
      typed("Your turn", "Round 12.6052 to 3 d.p.", "12.605", "Look at the 2.", "12.605."),
      choose(
        "Watch out",
        "Kai rounds 2.45 to 1 d.p. by first rounding to 2.5, then 3. What's wrong?",
        "Round once, from the original: 2.45 → 2.5",
        "Rounding twice can change the answer.",
        [["Nothing", "Asked for 1 d.p.: 2.5."]],
      ),
      mistake(
        "Zoe rounds 6.098 to 2 d.p.",
        ["The deciding digit is 8", "Round up the 9", "6.10 written as 6.1"],
        2,
        "Keep both decimal places: 6.10.",
      ),
      choose(
        "Back to the problem",
        "“£47 is split between 3. Give each share to 2 d.p.”",
        "£15.67",
        "15.666… rounds up.",
        [
          ["£15.66", "The next digit is 6: round up."],
          ["£15.7", "Two decimal places."],
        ],
      ),
      quiz([
        [
          ["2.346 to 2 d.p.", "2.35", ["2.34", "2.3"], "6 rounds up."],
          ["5.812 to 2 d.p.", "5.81", ["5.82", "5.8"], "2 rounds down."],
        ],
        [
          ["0.6666 to 1 d.p.", "0.7", ["0.6", "0.67"], "6 rounds up."],
          ["9.94 to 1 d.p.", "9.9", ["10.0", "9.94"], "4 rounds down."],
        ],
        [
          ["3.996 to 2 d.p.", "4.00", ["3.10", "4"], "Carry."],
          ["1.0951 to 2 d.p.", "1.10", ["1.09", "1.1"], "5 rounds up."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "significant-figures",
    "GF-N15.b",
    "Significant figures",
    "Count from the first non-zero digit; keep place value with zeros.",
    [
      problem("The crowd", [
        "A stadium holds 54 837 people; a grain of sand weighs 0.000 674 g. “Write each to 2 significant figures.”",
        "Decimal places can't handle both. By the end of this lesson, significant figures can.",
      ]),
      typed("Warm-up", "Round 54 837 to the nearest thousand", "55000", "8 rounds up.", "55 000."),
      choose(
        "Warm-up",
        "In 0.000674, the first non-zero digit is",
        "6",
        "Leading zeros don't count.",
        [["0", "Zeros before it aren't significant."]],
      ),
      explain(
        "Discover",
        "Count from the first non-zero digit",
        [
          "The first **significant figure** is the first non-zero digit. To 2 s.f., keep two significant digits, then decide with the third.",
          "Fill with zeros to keep the place value: 54 837 → 55 000 (not 55). Zeros at the start of a decimal aren't significant: 0.000674 → 0.00067.",
        ],
        { kind: "maths", tex: "54\\,837 \\to 55\\,000 \\qquad 0.000674 \\to 0.00067" },
      ),
      choose("Discover", "3.0571 to 3 s.f.", "3.06", "3, 0, 5; the 7 rounds up.", [
        ["3.05", "7 rounds the 5 up."],
        ["3.057", "Three figures."],
      ]),
      worked(
        "The crowd and the sand",
        "Write 54 837 and 0.000674 to 2 s.f.",
        [
          ["54 837: keep 5, 4; next digit 8 → 55 000", "Fill with zeros."],
          ["0.000674: keep 6, 7; next 4 → 0.00067", "Leading zeros stay."],
        ],
        "Same number of significant figures, very different sizes.",
      ),
      steps(
        "Together",
        "Round 0.07952 to 2 s.f.",
        "0.07952",
        [
          [
            "The first two significant digits are",
            "7 and 9",
            ["0 and 7", "Leading zeros don't count."],
            "Look at the 5",
          ],
          ["So", "0.080", ["0.079", "5 rounds the 9 up: 79 → 80."], "0.080"],
        ],
        "The final 0 is significant: keep it.",
      ),
      choose("Together", "Round 2 846 to 1 s.f.", "3 000", "2 rounds up because of the 8.", [
        ["3", "Keep the place value."],
        ["2 000", "8 rounds up."],
      ]),
      typed("Your turn", "Round 0.004528 to 2 s.f.", "0.0045", "Look at the 2.", "0.0045.", {
        wrong: [["0.0046", "2 rounds down."]],
      }),
      typed("Your turn", "Round 76 512 to 3 s.f.", "76500", "Look at the 1.", "76 500.", {
        wrong: [["765", "Fill with zeros."]],
      }),
      choose(
        "Watch out",
        "Jo rounds 6 284 to 2 s.f. and writes 63. What's wrong?",
        "Keep the place value: 6 300",
        "63 is a much smaller number.",
        [["Nothing", "6 284 is about 6 300."]],
      ),
      mistake(
        "Ali rounds 0.0306 to 2 s.f.",
        ["First significant figure: 3", "Then 0, then 6", "0.0306 → 0.03"],
        2,
        "Two figures are 3 and 0, and 6 rounds up: 0.031.",
      ),
      choose(
        "Back to the problem",
        "“Write 54 837 and 0.000674 to 2 s.f.”",
        "55 000 and 0.00067",
        "Count from the first non-zero digit.",
        [
          ["55 and 0.00067", "Fill 55 with zeros."],
          ["54 000 and 0.0007", "Check the deciding digits."],
        ],
      ),
      quiz([
        [
          ["4 562 to 2 s.f.", "4 600", ["46", "4 500"], "6 rounds up."],
          ["81 349 to 2 s.f.", "81 000", ["81", "82 000"], "3 rounds down."],
        ],
        [
          ["0.006 25 to 2 s.f.", "0.0063", ["0.0062", "0.006"], "5 rounds up."],
          ["0.4071 to 2 s.f.", "0.41", ["0.40", "0.4"], "7 rounds up."],
        ],
        [
          ["39.96 to 3 s.f.", "40.0", ["39.9", "40"], "Carry."],
          ["9.995 to 3 s.f.", "10.0", ["9.99", "10"], "Carry."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "error-intervals",
    "GF-N15.c",
    "Error intervals for rounding",
    "Half a unit either side: lower ≤ x < upper.",
    [
      problem("Rounded measurements", [
        "A plank's length is 2.4 m, to 1 decimal place. “Write the error interval for the length, $l$.” The real length could be a little more or less.",
        "By the end of this lesson, you can write error intervals for any rounding.",
      ]),
      typed("Warm-up", "Half of 0.1", "0.05", "Halve.", "0.05."),
      typed("Warm-up", "Work out $2.4 - 0.05$", "2.35", "Subtract.", "2.35."),
      explain(
        "Discover",
        "Half a unit each way",
        [
          "A number rounded to the nearest unit could be up to **half a unit** away. To 1 d.p., the unit is 0.1, so half is 0.05.",
          "So 2.4 to 1 d.p. means $2.35 \\le l < 2.45$: 2.35 rounds up to 2.4, but 2.45 would round to 2.5.",
        ],
        {
          kind: "number-line",
          min: 2.3,
          max: 2.5,
          step: 0.05,
          interval: { from: 2.35, to: 2.45, fromClosed: true, toClosed: false },
        },
      ),
      choose(
        "Discover",
        "A mass is 60 kg to the nearest 10 kg. The lower bound",
        "55 kg",
        "Half of 10 is 5.",
        [
          ["50 kg", "Half a unit below: 55."],
          ["59.5 kg", "The unit is 10, not 1."],
        ],
      ),
      worked(
        "The plank",
        "2.4 m to 1 d.p. Write the error interval.",
        [
          ["Unit 0.1; half is 0.05", "How far it could be."],
          ["$2.35 \\le l < 2.45$", "≤ at the bottom, < at the top."],
        ],
        "2.45 itself would round up, so it's not included.",
      ),
      steps(
        "Together",
        "A crowd is 3 400 to the nearest hundred",
        "Error interval.",
        [
          ["Half of 100:", "50", ["5", "The unit is 100."], "±50"],
          [
            "The interval:",
            "$3350 \\le n < 3450$",
            ["$3350 < n \\le 3450$", "≤ at the bottom, < at the top."],
            "$3350 \\le n < 3450$",
          ],
        ],
        "For whole people, $3350 \\le n \\le 3449$ also works.",
      ),
      choose(
        "Together",
        "$x = 7.36$ to 2 d.p. Error interval",
        "$7.355 \\le x < 7.365$",
        "Half of 0.01 is 0.005.",
        [
          ["$7.35 \\le x < 7.37$", "Half a unit: 0.005."],
          ["$7.355 < x \\le 7.365$", "The signs are the other way."],
        ],
      ),
      typed(
        "Your turn",
        "A length is 15 cm to the nearest cm. The upper bound?",
        "15.5",
        "Half a unit up.",
        "15.5 cm.",
        { unit: "cm" },
      ),
      choose(
        "Your turn",
        "A time is 12.6 s to 1 d.p. Error interval",
        "$12.55 \\le t < 12.65$",
        "± 0.05.",
        [
          ["$12.5 \\le t < 12.7$", "Half of 0.1 is 0.05."],
          ["$12.6 \\le t < 12.7$", "It could be a bit below 12.6."],
        ],
      ),
      choose(
        "Watch out",
        "Ben writes the error interval for 2.4 (1 d.p.) as $2.35 \\le l \\le 2.45$. What's wrong?",
        "2.45 rounds to 2.5, so use < at the top",
        "The upper bound isn't included.",
        [["Nothing", "Round 2.45 to 1 d.p.: it gives 2.5."]],
      ),
      mistake(
        "Kim writes the interval for 80, to the nearest 10.",
        ["Half of 10 is 5", "Lower bound 75", "$75 \\le x < 80$"],
        2,
        "Upper bound is 85: $75 \\le x < 85$.",
      ),
      choose(
        "Back to the problem",
        "“$l$ = 2.4 m to 1 d.p. Write the error interval for $l$.”",
        "$2.35 \\le l < 2.45$",
        "± 0.05, with < at the top.",
        [
          ["$2.3 \\le l < 2.5$", "Half of 0.1 is 0.05."],
          ["$2.35 < l \\le 2.45$", "≤ at the bottom."],
        ],
      ),
      quiz([
        [
          [
            "7 to the nearest whole: interval",
            "$6.5 \\le x < 7.5$",
            ["$6 \\le x < 8$", "$6.5 < x \\le 7.5$"],
            "± 0.5.",
          ],
          [
            "30 to the nearest 10: interval",
            "$25 \\le x < 35$",
            ["$20 \\le x < 40$", "$29.5 \\le x < 30.5$"],
            "± 5.",
          ],
        ],
        [
          ["5.8 to 1 d.p.: lower bound", "5.75", ["5.7", "5.85"], "− 0.05."],
          ["0.3 to 1 d.p.: upper bound", "0.35", ["0.4", "0.25"], "+ 0.05."],
        ],
        [
          [
            "500 to the nearest 100: interval",
            "$450 \\le x < 550$",
            ["$400 \\le x < 600$", "$495 \\le x < 505$"],
            "± 50.",
          ],
          [
            "2000 to the nearest 1000: interval",
            "$1500 \\le x < 2500$",
            ["$1000 \\le x < 3000$", "$1950 \\le x < 2050$"],
            "± 500.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "truncation",
    "GF-N15.d",
    "Error intervals for truncation",
    "Truncating chops digits off: the interval goes up a whole unit.",
    [
      problem("The chopped number", [
        "A calculator display can only show 1 decimal place, so it chops off the rest: 3.89 shows as 3.8. “The display shows 3.8. Write the error interval.”",
        "Chopping isn't rounding. By the end of this lesson, you'll know the difference.",
      ]),
      typed("Warm-up", "Round 3.89 to 1 d.p.", "3.9", "9 rounds up.", "3.9."),
      choose("Warm-up", "Chop 3.89 after 1 decimal place", "3.8", "Just drop the 9.", [
        ["3.9", "That's rounding."],
      ]),
      explain(
        "Discover",
        "Truncating",
        [
          "To **truncate** is to cut off digits without rounding. 3.89 truncated to 1 d.p. is 3.8.",
          "Any number from 3.8 up to (not including) 3.9 truncates to 3.8: $3.8 \\le x < 3.9$. The interval goes up **one whole unit**.",
        ],
        {
          kind: "number-line",
          min: 3.7,
          max: 4,
          step: 0.1,
          interval: { from: 3.8, to: 3.9, fromClosed: true, toClosed: false },
        },
      ),
      choose("Discover", "Truncated to 1 d.p., which shows 4.2?", "4.29", "Drop the 9.", [
        ["4.15", "That truncates to 4.1."],
        ["4.31", "That's 4.3."],
      ]),
      worked(
        "The display",
        "It shows 3.8 (truncated to 1 d.p.). Error interval?",
        [
          ["Lower bound: 3.8", "3.8 itself truncates to 3.8."],
          ["Upper bound: 3.9 (not included)", "One unit up."],
          ["$3.8 \\le x < 3.9$", "The interval."],
        ],
        "Compare rounding: $3.75 \\le x < 3.85$.",
      ),
      steps(
        "Together",
        "A number truncated to the nearest whole is 12",
        "Error interval.",
        [
          ["Lower bound:", "12", ["11.5", "Truncating never rounds up."], "12"],
          ["Upper bound:", "13", ["12.5", "A whole unit up."], "$12 \\le x < 13$"],
        ],
        "12.999… still truncates to 12.",
      ),
      choose(
        "Together",
        "Rounded vs truncated: 5.6 to 1 d.p. Which interval is truncation?",
        "$5.6 \\le x < 5.7$",
        "One whole unit up.",
        [["$5.55 \\le x < 5.65$", "That's rounding."]],
      ),
      choose(
        "Your turn",
        "7.42 truncated to 1 d.p. gives 7.4. Error interval for 7.4 (truncated)?",
        "$7.4 \\le x < 7.5$",
        "One unit up.",
        [["$7.35 \\le x < 7.45$", "That's rounding."]],
      ),
      typed(
        "Your turn",
        "A number truncated to 2 d.p. is 0.63. The upper bound?",
        "0.64",
        "One unit of 0.01 up.",
        "0.64.",
        { wrong: [["0.635", "That's for rounding."]] },
      ),
      choose(
        "Watch out",
        "Jo writes the truncation interval for 3.8 as $3.75 \\le x < 3.85$. What's wrong?",
        "That's for rounding; truncation gives $3.8 \\le x < 3.9$",
        "Truncating never goes up.",
        [["Nothing", "3.77 would truncate to 3.7."]],
      ),
      mistake(
        "Ed finds the truncation interval for 25 (to the nearest whole).",
        ["Lower bound 25", "Upper bound 25.5", "$25 \\le x < 25.5$"],
        1,
        "Truncation goes up a whole unit: $25 \\le x < 26$.",
      ),
      choose(
        "Back to the problem",
        "“The display shows 3.8, truncated to 1 d.p. Write the error interval.”",
        "$3.8 \\le x < 3.9$",
        "Up one whole unit.",
        [
          ["$3.75 \\le x < 3.85$", "That's rounding."],
          ["$3.8 < x \\le 3.9$", "3.8 is included; 3.9 isn't."],
        ],
      ),
      quiz([
        [
          [
            "Truncated to whole: 9. Interval",
            "$9 \\le x < 10$",
            ["$8.5 \\le x < 9.5$", "$9 \\le x < 9.5$"],
            "Up one.",
          ],
          [
            "Truncated to whole: 40. Interval",
            "$40 \\le x < 41$",
            ["$39.5 \\le x < 40.5$", "$40 \\le x < 40.5$"],
            "Up one.",
          ],
        ],
        [
          [
            "Truncated to 1 d.p.: 2.7. Interval",
            "$2.7 \\le x < 2.8$",
            ["$2.65 \\le x < 2.75$", "$2.7 \\le x < 2.75$"],
            "Up 0.1.",
          ],
          [
            "Truncated to 1 d.p.: 0.5. Interval",
            "$0.5 \\le x < 0.6$",
            ["$0.45 \\le x < 0.55$", "$0.5 \\le x < 0.55$"],
            "Up 0.1.",
          ],
        ],
        [
          ["Truncating 6.999 to 1 d.p.", "6.9", ["7.0", "7"], "Chop."],
          ["Truncating 1.48 to 1 d.p.", "1.4", ["1.5", "1.48"], "Chop."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "limits",
    "GF-N16",
    "Limits of accuracy",
    "Use upper and lower bounds in a calculation.",
    [
      problem("The fence", [
        "A fence panel is 1.8 m to 1 d.p. You need 10 panels in a row. “What is the greatest possible total length?”",
        "Rounding errors add up. By the end of this lesson, you can find the greatest and least possible values.",
      ]),
      typed("Warm-up", "Upper bound of 1.8 (to 1 d.p.)", "1.85", "+ 0.05.", "1.85."),
      typed("Warm-up", "Work out $1.85 \\times 10$", "18.5", "Times 10.", "18.5."),
      explain(
        "Discover",
        "Bounds in calculations",
        [
          "The **upper bound** and **lower bound** are the ends of the error interval. Use them to find the range of possible answers.",
          "For a total, add upper bounds for the greatest, lower bounds for the least.",
        ],
        { kind: "maths", tex: "1.75 \\le l < 1.85" },
      ),
      choose(
        "Discover",
        "Greatest possible total of 10 panels, each 1.8 m (1 d.p.)",
        "18.5 m",
        "$10 \\times 1.85$.",
        [
          ["18 m", "Use the upper bound."],
          ["18.05 m", "Each panel could be 0.05 longer."],
        ],
      ),
      worked(
        "The fence",
        "Find the greatest and least possible lengths.",
        [
          ["Least: $10 \\times 1.75 = 17.5$ m", "Lower bound."],
          ["Greatest: $10 \\times 1.85 = 18.5$ m", "Upper bound."],
        ],
        "Between 17.5 m and 18.5 m.",
      ),
      steps(
        "Together",
        "A rectangle 6 cm by 4 cm, each to the nearest cm",
        "Greatest possible area.",
        [
          ["Upper bounds:", "6.5 and 4.5", ["7 and 5", "Half a unit up."], "6.5, 4.5"],
          ["Greatest area:", "29.25 cm²", ["24 cm²", "$6.5 \\times 4.5$."], "29.25 cm²"],
        ],
        "Least: $5.5 \\times 3.5 = 19.25$ cm².",
      ),
      choose(
        "Together",
        "A 50 kg lift limit; people weigh 70 kg to the nearest 10 kg. Safest bound to use per person?",
        "75 kg, the upper bound",
        "Safety: assume the heaviest.",
        [
          ["65 kg", "That's the lightest."],
          ["70 kg", "They could weigh more."],
        ],
      ),
      typed(
        "Your turn",
        "10 boxes, each 2.4 kg to 1 d.p. Least total?",
        "23.5",
        "$10 \\times 2.35$.",
        "23.5 kg.",
        { unit: "kg" },
      ),
      typed(
        "Your turn",
        "A square has side 5 cm to the nearest cm. Greatest perimeter?",
        "22",
        "$4 \\times 5.5$.",
        "22 cm.",
        { unit: "cm" },
      ),
      choose(
        "Watch out",
        "For the greatest total, Ivy uses 1.84 for each panel, not 1.85. Is that needed?",
        "No: use the upper bound, 1.85",
        "1.849… gets ever closer; we use 1.85.",
        [["Yes", "The bound is 1.85 even though it's not included."]],
      ),
      mistake(
        "Raj finds the least area of a 3 m by 2 m rug (to the nearest m).",
        [
          "Lower bounds: 2.5 and 1.5",
          "$2.5 \\times 1.5 = 3.75$",
          "Least area 3.75 m², greatest 6 m²",
        ],
        2,
        "Greatest uses upper bounds: $3.5 \\times 2.5 = 8.75$ m².",
      ),
      choose(
        "Back to the problem",
        "“10 panels, each 1.8 m to 1 d.p. What is the greatest possible total length?”",
        "18.5 m",
        "$10 \\times 1.85$.",
        [
          ["18 m", "Use upper bounds."],
          ["19 m", "1.85, not 1.9."],
        ],
      ),
      quiz([
        [
          [
            "5 items, 3.2 kg each (1 d.p.). Greatest total",
            "16.25 kg",
            ["16 kg", "16.5 kg"],
            "$5 \\times 3.25$.",
          ],
          [
            "4 items, 2.6 kg each (1 d.p.). Least total",
            "10.2 kg",
            ["10.4 kg", "10 kg"],
            "$4 \\times 2.55$.",
          ],
        ],
        [
          [
            "Square, side 8 cm (nearest cm). Least area",
            "56.25 cm²",
            ["64 cm²", "49 cm²"],
            "$7.5^2$.",
          ],
          [
            "Square, side 3 cm (nearest cm). Greatest area",
            "12.25 cm²",
            ["9 cm²", "16 cm²"],
            "$3.5^2$.",
          ],
        ],
        [
          [
            "For the greatest total, use",
            "upper bounds",
            ["lower bounds", "rounded values"],
            "Biggest.",
          ],
          [
            "For the least total, use",
            "lower bounds",
            ["upper bounds", "rounded values"],
            "Smallest.",
          ],
        ],
      ]),
    ],
  ),

  lesson(U, "standard-form", "GF-N9.a", "Writing standard form", "A × 10ⁿ with 1 ≤ A < 10.", [
    problem("Sun and virus", [
      "The Sun is 150 000 000 km away; a virus is 0.000 000 12 m across. “Write both in standard form.”",
      "By the end of this lesson, you can write huge and tiny numbers neatly, and convert back.",
    ]),
    typed("Warm-up", "Work out $10^4$", "10000", "A 1 and four zeros.", "10 000."),
    typed("Warm-up", "Work out $1.5 \\times 100$", "150", "Digits move 2 places.", "150."),
    explain(
      "Discover",
      "One digit before the point",
      [
        "**Standard form** is $A \\times 10^n$ with $1 \\le A < 10$. The power counts how many places the digits move.",
        "Big numbers have positive powers; small numbers negative: $0.0052 = 5.2 \\times 10^{-3}$.",
      ],
      { kind: "maths", tex: "150\\,000\\,000 = 1.5 \\times 10^8" },
    ),
    choose("Discover", "Which is standard form?", "$4.5 \\times 10^4$", "$1 \\le 4.5 < 10$.", [
      ["$45 \\times 10^3$", "45 is more than 10."],
      ["$0.45 \\times 10^5$", "0.45 is less than 1."],
    ]),
    worked(
      "The Sun and the virus",
      "Write 150 000 000 and 0.000 000 12 in standard form.",
      [
        ["150 000 000: 1.5, moved 8 places → $1.5 \\times 10^8$", "Big: positive power."],
        ["0.000 000 12: 1.2, moved 7 places → $1.2 \\times 10^{-7}$", "Tiny: negative power."],
      ],
      "Count the places the point moves.",
    ),
    steps(
      "Together",
      "Write $3.07 \\times 10^5$ as an ordinary number",
      "Undo.",
      [
        [
          "Move the digits",
          "5 places left",
          ["5 places right", "A positive power makes it bigger."],
          "307 000",
        ],
        ["So", "307 000", ["30 700", "Count 5 places."], "307 000"],
      ],
      "Fill the gaps with zeros.",
    ),
    choose(
      "Together",
      "$8.1 \\times 10^{-4}$ as an ordinary number",
      "0.00081",
      "4 places smaller.",
      [
        ["81 000", "A negative power makes it small."],
        ["0.0081", "Count 4 places."],
      ],
    ),
    choose("Your turn", "0.0039 in standard form", "$3.9 \\times 10^{-3}$", "3 places.", [
      ["$39 \\times 10^{-4}$", "A must be less than 10."],
      ["$3.9 \\times 10^{3}$", "It's tiny: negative."],
    ]),
    choose("Your turn", "64 000 in standard form", "$6.4 \\times 10^4$", "4 places.", [
      ["$64 \\times 10^3$", "A must be less than 10."],
      ["$6.4 \\times 10^3$", "That's 6 400."],
    ]),
    choose(
      "Watch out",
      "Sam writes 45 000 as $45 \\times 10^3$. Is it standard form?",
      "No: A must be under 10: $4.5 \\times 10^4$",
      "One digit before the point.",
      [["Yes", "It equals 45 000, but 45 is too big."]],
    ),
    mistake(
      "Leah writes 0.0076 in standard form.",
      ["$A = 7.6$", "The point moves 3 places", "$7.6 \\times 10^3$"],
      2,
      "It's tiny, so the power is negative: $7.6 \\times 10^{-3}$.",
    ),
    choose(
      "Back to the problem",
      "“Write 150 000 000 in standard form.”",
      "$1.5 \\times 10^8$",
      "8 places.",
      [
        ["$15 \\times 10^7$", "A must be under 10."],
        ["$1.5 \\times 10^7$", "Count again: 8."],
      ],
    ),
    quiz([
      [
        [
          "7 200 000",
          "$7.2 \\times 10^6$",
          ["$72 \\times 10^5$", "$7.2 \\times 10^5$"],
          "6 places.",
        ],
        ["930 000", "$9.3 \\times 10^5$", ["$93 \\times 10^4$", "$9.3 \\times 10^4$"], "5 places."],
      ],
      [
        [
          "0.00058",
          "$5.8 \\times 10^{-4}$",
          ["$5.8 \\times 10^{4}$", "$58 \\times 10^{-5}$"],
          "4 places.",
        ],
        [
          "0.061",
          "$6.1 \\times 10^{-2}$",
          ["$6.1 \\times 10^{2}$", "$61 \\times 10^{-3}$"],
          "2 places.",
        ],
      ],
      [
        ["$2.5 \\times 10^3$", "2500", ["25 000", "0.0025"], "3 places."],
        ["$4 \\times 10^{-2}$", "0.04", ["400", "0.004"], "2 places."],
      ],
    ]),
  ]),

  lesson(
    U,
    "calculate",
    "GF-N9.b",
    "Calculating in standard form",
    "Multiply the numbers, add the powers, then tidy up.",
    [
      problem("The exam question", [
        "“Work out $(3 \\times 10^4) \\times (5 \\times 10^6)$. Give your answer in standard form.” No calculator.",
        "By the end of this lesson, you can multiply, divide, add and subtract in standard form.",
      ]),
      typed("Warm-up", "Work out $3 \\times 5$", "15", "Times.", "15."),
      choose("Warm-up", "$10^4 \\times 10^6 =$", "$10^{10}$", "Add the powers.", [
        ["$10^{24}$", "Add, don't multiply."],
        ["$100^{10}$", "Add the powers of 10."],
      ]),
      explain(
        "Discover",
        "Numbers, then powers",
        [
          "**Multiply**: multiply the numbers and add the powers. **Divide**: divide the numbers and subtract the powers.",
          "If the number isn't between 1 and 10, **tidy up**: $15 \\times 10^{10} = 1.5 \\times 10^{11}$.",
        ],
        { kind: "maths", tex: "15 \\times 10^{10} = 1.5 \\times 10^{11}" },
      ),
      choose(
        "Discover",
        "Tidy $0.6 \\times 10^5$ into standard form",
        "$6 \\times 10^4$",
        "0.6 is 6 × 10⁻¹.",
        [
          ["$6 \\times 10^6$", "Making A bigger makes the power smaller."],
          ["$0.6 \\times 10^5$", "A must be at least 1."],
        ],
      ),
      worked(
        "The exam question",
        "Work out $(3 \\times 10^4) \\times (5 \\times 10^6)$.",
        [
          ["$3 \\times 5 = 15$", "Numbers."],
          ["$10^4 \\times 10^6 = 10^{10}$", "Add powers."],
          ["$15 \\times 10^{10} = 1.5 \\times 10^{11}$", "Tidy up."],
        ],
        "Check A is between 1 and 10.",
      ),
      steps(
        "Together",
        "Work out $(8 \\times 10^9) \\div (2 \\times 10^3)$",
        "Divide.",
        [
          ["$8 \\div 2 =$", "4", ["16", "Divide."], "$4 \\times 10^{?}$"],
          ["$10^9 \\div 10^3 =$", "$10^6$", ["$10^3$", "Subtract: $9 - 3$."], "$4 \\times 10^6$"],
        ],
        "Already in standard form.",
      ),
      steps(
        "Together",
        "Work out $(4 \\times 10^5) + (3 \\times 10^4)$",
        "Adding: make the powers match.",
        [
          [
            "$3 \\times 10^4 =$",
            "$0.3 \\times 10^5$",
            ["$3 \\times 10^5$", "That's ten times bigger."],
            "$4 \\times 10^5 + 0.3 \\times 10^5$",
          ],
          [
            "So",
            "$4.3 \\times 10^5$",
            ["$7 \\times 10^9$", "You can't add powers when adding."],
            "$4.3 \\times 10^5$",
          ],
        ],
        "Or write as ordinary numbers: 400 000 + 30 000.",
      ),
      choose(
        "Your turn",
        "$(2 \\times 10^3) \\times (4 \\times 10^5)$",
        "$8 \\times 10^8$",
        "Multiply 2 and 4; add 3 and 5.",
        [
          ["$8 \\times 10^{15}$", "Add the powers."],
          ["$6 \\times 10^8$", "Multiply 2 and 4."],
        ],
      ),
      choose(
        "Your turn",
        "$(6 \\times 10^7) \\times (5 \\times 10^{-2})$",
        "$3 \\times 10^6$",
        "$30 \\times 10^5$ tidied.",
        [
          ["$30 \\times 10^5$", "Tidy: A must be under 10."],
          ["$3 \\times 10^{-14}$", "Add powers: $7 + (-2) = 5$."],
        ],
      ),
      choose(
        "Watch out",
        "Ben adds $(2 \\times 10^3) + (5 \\times 10^3)$ and gets $7 \\times 10^6$. What's wrong?",
        "When adding, the powers don't add: $7 \\times 10^3$",
        "2 thousand + 5 thousand = 7 thousand.",
        [["Nothing", "2000 + 5000 = 7000."]],
      ),
      mistake(
        "Mia works out $(9 \\times 10^8) \\div (3 \\times 10^2)$.",
        ["$9 \\div 3 = 3$", "$10^8 \\div 10^2 = 10^4$", "$3 \\times 10^4$"],
        1,
        "Subtract the powers: $10^6$, so $3 \\times 10^6$.",
      ),
      choose(
        "Back to the problem",
        "“Work out $(3 \\times 10^4) \\times (5 \\times 10^6)$ in standard form.”",
        "$1.5 \\times 10^{11}$",
        "$15 \\times 10^{10}$ tidied.",
        [
          ["$15 \\times 10^{10}$", "Not standard form."],
          ["$1.5 \\times 10^{24}$", "Add the powers."],
        ],
      ),
      quiz([
        [
          [
            "$(3 \\times 10^2) \\times (2 \\times 10^4)$",
            "$6 \\times 10^6$",
            ["$6 \\times 10^8$", "$5 \\times 10^6$"],
            "Add powers.",
          ],
          [
            "$(4 \\times 10^3) \\times (2 \\times 10^2)$",
            "$8 \\times 10^5$",
            ["$8 \\times 10^6$", "$6 \\times 10^5$"],
            "Add powers.",
          ],
        ],
        [
          [
            "$(9 \\times 10^6) \\div (3 \\times 10^2)$",
            "$3 \\times 10^4$",
            ["$3 \\times 10^3$", "$6 \\times 10^4$"],
            "Subtract powers.",
          ],
          [
            "$(8 \\times 10^5) \\div (4 \\times 10^1)$",
            "$2 \\times 10^4$",
            ["$2 \\times 10^5$", "$4 \\times 10^4$"],
            "Subtract powers.",
          ],
        ],
        [
          [
            "$(5 \\times 10^3) \\times (4 \\times 10^2)$",
            "$2 \\times 10^6$",
            ["$20 \\times 10^5$", "$2 \\times 10^5$"],
            "$20 \\times 10^5$.",
          ],
          [
            "$(6 \\times 10^4) \\times (5 \\times 10^3)$",
            "$3 \\times 10^8$",
            ["$30 \\times 10^7$", "$3 \\times 10^7$"],
            "$30 \\times 10^7$.",
          ],
        ],
      ]),
    ],
  ),
];
