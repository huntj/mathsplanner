// GCSE Foundation, "Circles", as eight short lessons, one just before each skill: the parts of a
// circle, circumference and area, composite shapes, spheres, pyramids and cones, arc lengths,
// sector areas, and finding a sector's angle. Each recaps the Key Stage 3 idea quickly, builds it
// to GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const U = "gf-circles";
const P = (x: number, y: number): Point => ({ x, y });
type Item = DrawingPic["items"][number];
const ring = (r: number): Item[] => [
  { arc: P(0, 0), r, from: 0, to: 180 },
  { arc: P(0, 0), r, from: 180, to: 360 },
];

/** A circle with one part picked out. */
function part(which: "radius" | "diameter" | "chord" | "tangent"): DrawingPic {
  const pick: Record<typeof which, Item> = {
    radius: { line: [P(0, 0), P(3, 0)], tone: "find" },
    diameter: { line: [P(-3, 0), P(3, 0)], tone: "find" },
    chord: { line: [P(-2.6, 1.5), P(2.6, 1.5)], tone: "find" },
    tangent: { line: [P(-3, 3), P(3, 3)], tone: "find" },
  };
  return {
    kind: "drawing",
    frame: { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.6 },
    items: [...ring(3), { dot: P(0, 0) }, pick[which]],
  };
}

/** A sector of radius 3 with angle `deg`, its two radii and arc. */
function sector(deg: number, label: string): DrawingPic {
  const end = P(3 * Math.cos((deg * Math.PI) / 180), 3 * Math.sin((deg * Math.PI) / 180));
  return {
    kind: "drawing",
    frame: { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5 },
    items: [
      { arc: P(0, 0), r: 3, from: 0, to: deg },
      { line: [P(0, 0), P(3, 0)] },
      { line: [P(0, 0), end] },
      { angle: P(0, 0), from: 0, to: deg, label },
    ],
  };
}

export const gfCircles: UnitLesson[] = [
  lesson(
    U,
    "vocabulary",
    "GF-G9",
    "Parts of a circle",
    "Radius, diameter, chord, tangent, arc, sector and segment.",
    [
      problem(
        "Name the parts",
        [
          "Exam questions say things like “the tangent at A meets the chord BC…” or “find the area of the minor segment.”",
          "By the end of this lesson, you'll know every part of a circle by name.",
        ],
        part("chord"),
      ),
      choose(
        "Warm-up",
        "The distance across a circle through the centre",
        "diameter",
        "Twice the radius.",
        [["radius", "That's centre to edge."]],
      ),
      choose("Warm-up", "The distance round a circle", "circumference", "Its perimeter.", [
        ["diameter", "That's across."],
      ]),
      explain(
        "Discover",
        "The words",
        [
          "**Radius**: centre to edge. **Diameter**: edge to edge through the centre. **Chord**: any line joining two points on the circle. **Tangent**: a line touching the circle at one point.",
          "An **arc** is part of the circumference. A **sector** is a slice between two radii (like pizza). A **segment** is the region between a chord and its arc.",
        ],
        part("tangent"),
      ),
      choose(
        "Discover",
        "What is the highlighted line?",
        "A chord",
        "Joins two points on the circle.",
        [
          ["A diameter", "It doesn't pass through the centre."],
          ["A tangent", "It crosses the circle."],
        ],
        { picture: part("chord") },
      ),
      worked(
        "Sort them",
        "Name the region between two radii, and the region between a chord and an arc.",
        [
          ["Between two radii: a sector", "A slice."],
          ["Between a chord and an arc: a segment", "Cut off by a chord."],
        ],
        "Sector: slice. Segment: cut.",
      ),
      steps(
        "Together",
        "A line touches the circle at exactly one point",
        "Name it.",
        [
          ["It's a", "tangent", ["chord", "A chord crosses at two points."], "Tangent"],
          [
            "It meets the radius at that point at",
            "90°",
            ["45°", "A tangent is perpendicular to the radius."],
            "90°",
          ],
        ],
        "That right angle is useful later.",
      ),
      choose(
        "Together",
        "What is the highlighted line?",
        "A tangent",
        "Touches at one point.",
        [
          ["A chord", "A chord joins two points."],
          ["An arc", "An arc is curved."],
        ],
        { picture: part("tangent") },
      ),
      choose("Your turn", "The longest chord in a circle is", "a diameter", "Through the centre.", [
        ["a radius", "A radius isn't a chord."],
        ["a tangent", "A tangent isn't inside."],
      ]),
      choose("Your turn", "Part of the circumference is", "an arc", "A curved piece.", [
        ["a sector", "That's a region."],
        ["a chord", "That's straight."],
      ]),
      choose(
        "Watch out",
        "Kim calls a pizza slice a segment. What's the right word?",
        "Sector: it's between two radii",
        "A segment is cut off by a chord.",
        [["Segment is right", "Slices from the centre are sectors."]],
      ),
      mistake(
        "Leo describes a circle of radius 5 cm.",
        ["Its radius is 5 cm", "Its diameter is 2.5 cm", "A chord can be up to 10 cm"],
        1,
        "The diameter is twice the radius: 10 cm.",
      ),
      choose(
        "Back to the problem",
        "“The region between a chord and the minor arc” is the",
        "minor segment",
        "Chord and arc.",
        [
          ["minor sector", "Sectors need two radii."],
          ["tangent", "A tangent is a line."],
        ],
      ),
      quiz([
        [
          ["Centre to edge", "radius", ["diameter", "chord"], "Radius."],
          ["Edge to edge through the centre", "diameter", ["radius", "tangent"], "Diameter."],
        ],
        [
          ["A slice between two radii", "sector", ["segment", "arc"], "Sector."],
          ["A region cut off by a chord", "segment", ["sector", "radius"], "Segment."],
        ],
        [
          ["A tangent meets the radius at", "90°", ["45°", "180°"], "Perpendicular."],
          ["A line touching at one point", "tangent", ["chord", "diameter"], "Tangent."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "circumference-area",
    "GF-G17.a",
    "Circumference and area",
    "C = πd = 2πr and A = πr².",
    [
      problem(
        "The round table",
        [
          "A round table has diameter 1.2 m. “How much edging tape goes round it? What's the area of the top?” Give answers to 2 decimal places.",
          "By the end of this lesson, you can find both from a radius or a diameter.",
        ],
        part("diameter"),
      ),
      typed("Warm-up", "Radius of a circle with diameter 1.2 m", "0.6", "Halve.", "0.6 m.", {
        unit: "m",
      }),
      typed("Warm-up", "$0.6^2$", "0.36", "$0.6 \\times 0.6$.", "0.36."),
      explain(
        "Discover",
        "Two formulae",
        [
          "**Circumference** $C = \\pi d = 2\\pi r$: a little over 3 diameters. **Area** $A = \\pi r^2$: always use the **radius**.",
          "Use the π button, and round only at the end.",
        ],
        { kind: "maths", tex: "C = \\pi d \\qquad A = \\pi r^2" },
      ),
      choose("Discover", "Circumference of a circle with radius 4", "$8\\pi$", "$2\\pi r$.", [
        ["$16\\pi$", "That's the area."],
        ["$4\\pi$", "Use $2r$."],
      ]),
      worked(
        "The table",
        "Diameter 1.2 m. Circumference and area to 2 d.p.",
        [
          ["$C = \\pi \\times 1.2 = 3.77$ m", "Edging."],
          ["$A = \\pi \\times 0.6^2 = 1.13$ m²", "Radius 0.6."],
        ],
        "Area uses the radius.",
      ),
      steps(
        "Together",
        "Area of a circle, diameter 10 cm",
        "Radius first.",
        [
          ["Radius:", "5 cm", ["10 cm", "Halve the diameter."], "$r = 5$"],
          ["Area:", "78.54 cm²", ["314.16 cm²", "That uses $r = 10$."], "$25\\pi$"],
        ],
        "$25\\pi = 78.54$ cm².",
      ),
      steps(
        "Together",
        "A circle has circumference 31.4 cm",
        "Find its radius.",
        [
          [
            "$2\\pi r = 31.4$, so $r =$",
            "$31.4 \\div 2\\pi$",
            ["$31.4 \\div \\pi$", "That's the diameter."],
            "$\\frac{31.4}{2\\pi}$",
          ],
          ["So", "5.0 cm", ["10 cm", "That's the diameter."], "≈ 5 cm"],
        ],
        "Rearrange the formula.",
      ),
      typed(
        "Your turn",
        "Area of a circle, radius 7 cm, to 1 d.p.",
        "153.9",
        "$49\\pi$.",
        "153.9 cm².",
        { unit: "cm²", wrong: [["44", "That's the circumference."]] },
      ),
      typed(
        "Your turn",
        "Circumference, diameter 15 cm, to 1 d.p.",
        "47.1",
        "$15\\pi$.",
        "47.1 cm.",
        { unit: "cm" },
      ),
      choose(
        "Watch out",
        "Raj finds the area with diameter 8 as $\\pi \\times 8^2$. What's wrong?",
        "Use the radius, 4: $16\\pi$",
        "Area is $\\pi r^2$.",
        [["Nothing", "That's 4 times too big."]],
      ),
      mistake(
        "Ola finds the area of a circle with radius 3.",
        ["$A = \\pi r^2$", "$= \\pi \\times 6$", "$= 18.8$"],
        1,
        "$r^2 = 9$: $A = 9\\pi = 28.3$.",
      ),
      choose(
        "Back to the problem",
        "“Diameter 1.2 m. Area of the top, to 2 d.p.?”",
        "1.13 m²",
        "$\\pi \\times 0.36$.",
        [
          ["4.52 m²", "That uses the diameter."],
          ["3.77 m²", "That's the circumference."],
        ],
      ),
      quiz([
        [
          ["Area, radius 2, to 1 d.p.", "12.6", ["6.3", "12.5"], "$4\\pi$."],
          ["Area, radius 6, to 1 d.p.", "113.1", ["37.7", "113"], "$36\\pi$."],
        ],
        [
          ["Circumference, radius 5, to 1 d.p.", "31.4", ["78.5", "15.7"], "$10\\pi$."],
          ["Circumference, diameter 9, to 1 d.p.", "28.3", ["63.6", "56.5"], "$9\\pi$."],
        ],
        [
          ["Area uses the", "radius", ["diameter", "circumference"], "$\\pi r^2$."],
          ["$C = \\pi d$ uses the", "diameter", ["radius", "area"], "$d$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "composite",
    "GF-G17.b",
    "Composite shapes with circles",
    "Add or subtract the pieces; include every edge for perimeter.",
    [
      problem("The running track", [
        "A track is a 100 m by 60 m rectangle with a semicircle on each short end. “Find the area inside the track and the length of the inner edge.”",
        "By the end of this lesson, you can split shapes with curves into pieces.",
      ]),
      typed("Warm-up", "Two semicircles make", "1", "A whole circle.", "1 circle."),
      typed("Warm-up", "$100 \\times 60$", "6000", "Times.", "6000."),
      explain(
        "Discover",
        "Pieces",
        [
          "Split the shape into rectangles, triangles and circle parts. **Area**: add the pieces (or subtract a hole).",
          "**Perimeter**: add only the **outside** edges: straight sides plus curved arcs. Don't count joins inside the shape.",
        ],
        {
          kind: "drawing",
          frame: { xMin: -4.5, xMax: 14.5, yMin: -0.5, yMax: 6.5 },
          items: [
            { line: [P(0, 0), P(10, 0)] },
            { line: [P(0, 6), P(10, 6)] },
            { arc: P(0, 3), r: 3, from: 90, to: 270 },
            { arc: P(10, 3), r: 3, from: -90, to: 90 },
            { line: [P(0, 0), P(0, 6)], dashed: true, tone: "soft" },
            { line: [P(10, 0), P(10, 6)], dashed: true, tone: "soft" },
          ],
        },
      ),
      choose(
        "Discover",
        "Two semicircles of diameter 60 m make a circle of radius",
        "30 m",
        "Half of 60.",
        [["60 m", "60 is the diameter."]],
      ),
      worked(
        "The track's area",
        "Rectangle 100 by 60, semicircle on each end.",
        [
          ["Rectangle: 6000 m²", "$100 \\times 60$."],
          ["Circle (two halves), radius 30: $900\\pi = 2827.4$ m²", "$\\pi r^2$."],
          ["Total: 8827.4 m²", "Add."],
        ],
        "Two semicircles make one circle.",
      ),
      steps(
        "Together",
        "The inner edge of the track",
        "Perimeter.",
        [
          [
            "Straight parts:",
            "200 m",
            ["320 m", "The 60 m ends are replaced by curves."],
            "$100 + 100$",
          ],
          [
            "Curves (one whole circumference):",
            "188.5 m",
            ["94.2 m", "Two semicircles: $\\pi \\times 60$."],
            "Total 388.5 m",
          ],
        ],
        "Don't include the dashed joins.",
      ),
      choose(
        "Together",
        "A square of side 10 with a circle of radius 3 cut out. Area left",
        "$100 - 9\\pi$",
        "Subtract the hole.",
        [
          ["$100 + 9\\pi$", "Cut out: subtract."],
          ["$100 - 6\\pi$", "$r^2 = 9$."],
        ],
      ),
      typed(
        "Your turn",
        "Semicircle, radius 4: area to 1 d.p.",
        "25.1",
        "$\\frac12 \\times 16\\pi$.",
        "25.1.",
        { wrong: [["50.3", "Half a circle."]] },
      ),
      typed(
        "Your turn",
        "Semicircle, diameter 10: perimeter to 1 d.p.",
        "25.7",
        "Half of $10\\pi$ plus 10.",
        "25.7.",
        { wrong: [["15.7", "Add the straight diameter."]] },
      ),
      choose(
        "Watch out",
        "Ed finds a semicircle's perimeter as half the circumference only. What's missing?",
        "The straight diameter edge",
        "Perimeter goes all the way round.",
        [["Nothing", "A semicircle has a straight side too."]],
      ),
      mistake(
        "Mia finds the perimeter of a quarter circle, radius 6.",
        ["Arc: $\\frac14 \\times 12\\pi = 9.42$", "Add one radius: 6", "Perimeter: 15.42"],
        1,
        "A quarter circle has two straight radii: $9.42 + 12 = 21.42$.",
      ),
      choose(
        "Back to the problem",
        "“Area inside the track (100 m by 60 m, semicircular ends)?”",
        "8827.4 m²",
        "$6000 + 900\\pi$.",
        [
          ["7413.7 m²", "Two semicircles: a whole circle."],
          ["17 309.7 m²", "Radius 30, not 60."],
        ],
      ),
      quiz([
        [
          [
            "Quarter circle, radius 2: area to 1 d.p.",
            "3.1",
            ["12.6", "6.3"],
            "$\\frac14 \\times 4\\pi$.",
          ],
          [
            "Semicircle, radius 6: area to 1 d.p.",
            "56.5",
            ["113.1", "18.8"],
            "$\\frac12 \\times 36\\pi$.",
          ],
        ],
        [
          ["Semicircle, diameter 4: perimeter to 1 d.p.", "10.3", ["6.3", "12.6"], "$2\\pi + 4$."],
          [
            "Semicircle, diameter 12: perimeter to 1 d.p.",
            "30.8",
            ["18.8", "37.7"],
            "$6\\pi + 12$.",
          ],
        ],
        [
          [
            "A shape with a hole: area",
            "big minus hole",
            ["big plus hole", "just the hole"],
            "Subtract.",
          ],
          [
            "Perimeter of a composite shape includes",
            "outside edges only",
            ["every line", "inside joins"],
            "Outside.",
          ],
        ],
      ]),
    ],
  ),

  lesson(U, "spheres", "GF-G17.c", "Spheres", "V = 4/3 πr³ and surface area = 4πr².", [
    problem("The football", [
      "A football has radius 11 cm. “Work out its volume and surface area.” The formulae are given on the exam paper; using them is the skill.",
      "By the end of this lesson, you can use both, and hemispheres too.",
    ]),
    typed("Warm-up", "$3^3$", "27", "$3 \\times 3 \\times 3$.", "27."),
    typed("Warm-up", "$\\frac43 \\times 27$", "36", "$27 \\div 3 \\times 4$.", "36."),
    explain(
      "Discover",
      "Two formulae",
      [
        "Sphere: **volume** $V = \\frac43 \\pi r^3$; **surface area** $A = 4\\pi r^2$. Both use the radius.",
        "A **hemisphere** is half a sphere: half the volume, and half the curved area **plus** the flat circle on top.",
      ],
      { kind: "maths", tex: "V = \\tfrac43 \\pi r^3 \\qquad A = 4\\pi r^2" },
    ),
    choose(
      "Discover",
      "Volume of a sphere, radius 3, in terms of π",
      "$36\\pi$",
      "$\\frac43 \\times 27\\pi$.",
      [
        ["$12\\pi$", "Cube the radius."],
        ["$108\\pi$", "$\\frac43 \\times 27 = 36$."],
      ],
    ),
    worked(
      "The football",
      "Radius 11 cm. Volume and surface area to 3 s.f.",
      [
        ["$V = \\frac43 \\pi \\times 1331 = 5580$ cm³", "$11^3 = 1331$."],
        ["$A = 4\\pi \\times 121 = 1520$ cm²", "$11^2 = 121$."],
      ],
      "Cube for volume, square for area.",
    ),
    steps(
      "Together",
      "A hemisphere of radius 6 cm",
      "Total surface area.",
      [
        ["Curved part: half of $4\\pi r^2$:", "$72\\pi$", ["$144\\pi$", "Half."], "$72\\pi$"],
        [
          "Plus the flat circle, $\\pi r^2 = 36\\pi$:",
          "$108\\pi$",
          ["$72\\pi$", "Include the flat face."],
          "$108\\pi$ cm²",
        ],
      ],
      "$108\\pi \\approx 339$ cm².",
    ),
    choose(
      "Together",
      "A sphere has diameter 10. Volume to 3 s.f.",
      "524",
      "$r = 5$: $\\frac43 \\pi \\times 125$.",
      [
        ["4190", "That uses $r = 10$."],
        ["314", "That's the surface area."],
      ],
    ),
    typed(
      "Your turn",
      "Surface area of a sphere, radius 5, to 1 d.p.",
      "314.2",
      "$4\\pi \\times 25$.",
      "314.2.",
      { wrong: [["523.6", "That's the volume."]] },
    ),
    typed(
      "Your turn",
      "Volume of a hemisphere, radius 3, in terms of π (number only)",
      "18",
      "Half of $36\\pi$.",
      "$18\\pi$.",
      { wrong: [["36", "Half a sphere."]] },
    ),
    choose(
      "Watch out",
      "Zoe uses $r^2$ in the sphere's volume. What's wrong?",
      "Volume uses $r^3$",
      "Volumes are cubed.",
      [["Nothing", "$\\frac43 \\pi r^3$."]],
    ),
    mistake(
      "Kai finds a hemisphere's surface area, radius 4.",
      ["Half of $4\\pi \\times 16 = 32\\pi$", "So $32\\pi$", "≈ 100.5 cm²"],
      1,
      "Add the flat circle, $16\\pi$: total $48\\pi \\approx 150.8$ cm².",
    ),
    choose(
      "Back to the problem",
      "“Radius 11 cm. Work out the volume.”",
      "5580 cm³",
      "$\\frac43 \\pi \\times 1331$.",
      [
        ["1520 cm³", "That's the surface area."],
        ["507 cm³", "Cube the radius."],
      ],
    ),
    quiz([
      [
        ["Volume, radius 3 (in π)", "$36\\pi$", ["$12\\pi$", "$27\\pi$"], "$\\frac43 \\times 27$."],
        [
          "Volume, radius 6 (in π)",
          "$288\\pi$",
          ["$48\\pi$", "$216\\pi$"],
          "$\\frac43 \\times 216$.",
        ],
      ],
      [
        [
          "Surface area, radius 2 (in π)",
          "$16\\pi$",
          ["$8\\pi$", "$\\frac{32}{3}\\pi$"],
          "$4 \\times 4$.",
        ],
        [
          "Surface area, radius 10 (in π)",
          "$400\\pi$",
          ["$40\\pi$", "$1333\\pi$"],
          "$4 \\times 100$.",
        ],
      ],
      [
        ["Hemisphere surface includes", "a flat circle", ["no flat face", "two circles"], "Top."],
        ["Sphere volume uses", "$r^3$", ["$r^2$", "$r$"], "Cubed."],
      ],
    ]),
  ]),

  lesson(
    U,
    "cones-pyramids",
    "GF-G17.d",
    "Pyramids and cones",
    "Volume = ⅓ × base area × height; a cone's curved area is πrl.",
    [
      problem("The ice-cream cone", [
        "A cone has radius 3 cm and height 10 cm. “Work out its volume.” And a square-based pyramid: base 6 cm, height 8 cm.",
        "By the end of this lesson, you can find both volumes, and a cone's surface area.",
      ]),
      typed("Warm-up", "Area of a 6 by 6 square", "36", "$6^2$.", "36."),
      typed("Warm-up", "$\\frac13 \\times 36 \\times 8$", "96", "$12 \\times 8$.", "96."),
      explain(
        "Discover",
        "A third of the prism",
        [
          "A **pyramid** or **cone** holds exactly a third of the prism or cylinder with the same base and height: $V = \\frac13 \\times$ base area $\\times h$.",
          "Cone: $V = \\frac13 \\pi r^2 h$; curved surface $= \\pi r l$, where $l$ is the **slant height**.",
        ],
        { kind: "maths", tex: "V_{\\text{cone}} = \\tfrac13 \\pi r^2 h" },
      ),
      choose(
        "Discover",
        "Volume of a pyramid with base area 30 cm² and height 9 cm",
        "90 cm³",
        "$\\frac13 \\times 30 \\times 9$.",
        [
          ["270 cm³", "Take a third."],
          ["39 cm³", "Multiply, don't add."],
        ],
      ),
      worked(
        "The pyramid",
        "Square base 6 cm, height 8 cm. Volume?",
        [
          ["Base area: 36 cm²", "$6 \\times 6$."],
          ["$V = \\frac13 \\times 36 \\times 8 = 96$ cm³", "A third."],
        ],
        "96 cm³.",
      ),
      steps(
        "Together",
        "The cone: radius 3, height 10",
        "Volume.",
        [
          ["Base area $\\pi r^2$:", "$9\\pi$", ["$6\\pi$", "$3^2 = 9$."], "$9\\pi$"],
          [
            "$V = \\frac13 \\times 9\\pi \\times 10 =$",
            "$30\\pi$",
            ["$90\\pi$", "Take a third."],
            "$30\\pi \\approx 94.2$ cm³",
          ],
        ],
        "A third of the cylinder's $90\\pi$.",
      ),
      steps(
        "Together",
        "Cone curved surface: radius 5, slant height 13",
        "Use $\\pi r l$.",
        [
          ["$\\pi r l =$", "$65\\pi$", ["$25\\pi$", "$5 \\times 13$."], "$65\\pi$"],
          [
            "Total, with the base $25\\pi$:",
            "$90\\pi$",
            ["$65\\pi$", "Add the circle base."],
            "$90\\pi \\approx 283$ cm²",
          ],
        ],
        "Slant height, not vertical height.",
      ),
      typed(
        "Your turn",
        "Cone: radius 6, height 5. Volume in terms of π (number only)",
        "60",
        "$\\frac13 \\times 36 \\times 5$.",
        "$60\\pi$.",
        { wrong: [["180", "Take a third."]] },
      ),
      typed(
        "Your turn",
        "Pyramid: base 4 by 5, height 9. Volume",
        "60",
        "$\\frac13 \\times 20 \\times 9$.",
        "60.",
        { wrong: [["180", "Take a third."]] },
      ),
      choose(
        "Watch out",
        "For a cone's curved area, Ivy uses the vertical height. What's wrong?",
        "Use the slant height $l$",
        "The curved surface runs up the slant.",
        [["Nothing", "$\\pi r l$ needs the slant."]],
      ),
      mistake(
        "Raj finds a cone's volume: radius 4, height 6.",
        ["Base: $\\pi \\times 16$", "$16\\pi \\times 6 = 96\\pi$", "Volume $96\\pi$"],
        1,
        "Take a third: $32\\pi$.",
      ),
      choose(
        "Back to the problem",
        "“A cone has radius 3 cm and height 10 cm. Work out its volume.”",
        "$30\\pi \\approx 94.2$ cm³",
        "$\\frac13 \\pi r^2 h$.",
        [
          ["$90\\pi$", "That's the cylinder."],
          ["$10\\pi$", "$r^2 = 9$."],
        ],
      ),
      quiz([
        [
          ["Pyramid: base 12 cm², height 5", "20 cm³", ["60 cm³", "17 cm³"], "⅓ × 60."],
          ["Pyramid: base 27 cm², height 4", "36 cm³", ["108 cm³", "31 cm³"], "⅓ × 108."],
        ],
        [
          ["Cone: $r = 3$, $h = 4$ (in π)", "$12\\pi$", ["$36\\pi$", "$4\\pi$"], "⅓ × 9 × 4."],
          ["Cone: $r = 2$, $h = 9$ (in π)", "$12\\pi$", ["$36\\pi$", "$6\\pi$"], "⅓ × 4 × 9."],
        ],
        [
          [
            "Cone curved area: $r = 4$, $l = 10$ (in π)",
            "$40\\pi$",
            ["$160\\pi$", "$16\\pi$"],
            "$\\pi r l$.",
          ],
          [
            "Cone curved area: $r = 3$, $l = 7$ (in π)",
            "$21\\pi$",
            ["$63\\pi$", "$9\\pi$"],
            "$\\pi r l$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "arcs",
    "GF-G18.a",
    "Arc length",
    "An arc is a fraction of the circumference: θ/360 × πd.",
    [
      problem(
        "The pizza crust",
        [
          "A pizza of radius 15 cm is cut into slices of 72°. “How long is the crust on one slice?”",
          "By the end of this lesson, you can find any arc length.",
        ],
        sector(72, "72°"),
      ),
      typed(
        "Warm-up",
        "$\\frac{72}{360}$ as a fraction in simplest form",
        "1/5",
        "Divide by 72.",
        "$\\frac15$.",
      ),
      typed(
        "Warm-up",
        "Circumference, radius 15, in terms of π (number only)",
        "30",
        "$2\\pi \\times 15$.",
        "$30\\pi$.",
      ),
      explain(
        "Discover",
        "A fraction of the way round",
        [
          "An arc with angle θ is $\\frac{\\theta}{360}$ of the whole circle, so its length is that fraction of the circumference.",
          "Arc length $= \\frac{\\theta}{360} \\times 2\\pi r$.",
        ],
        { kind: "maths", tex: "\\text{arc} = \\frac{\\theta}{360} \\times 2\\pi r" },
      ),
      choose(
        "Discover",
        "A 90° arc is what fraction of the circle?",
        "$\\frac14$",
        "$\\frac{90}{360}$.",
        [
          ["$\\frac19$", "$\\frac{90}{360} = \\frac14$."],
          ["$\\frac12$", "That's 180°."],
        ],
      ),
      worked(
        "The crust",
        "Radius 15 cm, angle 72°. Arc length?",
        [
          ["$\\frac{72}{360} = \\frac15$", "Fraction of the circle."],
          ["$\\frac15 \\times 30\\pi = 6\\pi = 18.8$ cm", "Of the circumference."],
        ],
        "18.8 cm of crust.",
      ),
      steps(
        "Together",
        "Arc of 120°, radius 9",
        "Arc length.",
        [
          ["Fraction:", "$\\frac13$", ["$\\frac{1}{120}$", "$\\frac{120}{360}$."], "$\\frac13$"],
          [
            "Arc:",
            "$6\\pi$",
            ["$27\\pi$", "$\\frac13 \\times 18\\pi$, not area."],
            "$6\\pi \\approx 18.8$",
          ],
        ],
        "Circumference, not area.",
      ),
      choose(
        "Together",
        "Perimeter of the sector: radius 9, arc $6\\pi$",
        "$6\\pi + 18$",
        "Arc plus two radii.",
        [
          ["$6\\pi$", "Add the straight edges."],
          ["$6\\pi + 9$", "Two radii."],
        ],
      ),
      typed(
        "Your turn",
        "Arc: 45°, radius 8, in terms of π (number only)",
        "2",
        "$\\frac18 \\times 16\\pi$.",
        "$2\\pi$.",
        { wrong: [["8", "That's the sector area."]] },
      ),
      typed(
        "Your turn",
        "Arc: 60°, radius 6, to 1 d.p.",
        "6.3",
        "$\\frac16 \\times 12\\pi$.",
        "6.3.",
        { wrong: [["18.8", "That's the area."]] },
      ),
      choose(
        "Watch out",
        "Ed uses $\\pi r^2$ for an arc length. What's wrong?",
        "Arc length uses the circumference, $2\\pi r$",
        "Length, not area.",
        [["Nothing", "$\\pi r^2$ gives an area."]],
      ),
      mistake(
        "Mia finds a 90° arc, radius 10.",
        ["Fraction: $\\frac{90}{360} = \\frac14$", "Circumference: $10\\pi$", "Arc: $2.5\\pi$"],
        1,
        "Circumference is $2\\pi r = 20\\pi$: arc $5\\pi$.",
      ),
      choose(
        "Back to the problem",
        "“Radius 15 cm, 72° slice. How long is the crust?”",
        "18.8 cm",
        "$\\frac15 \\times 30\\pi$.",
        [
          ["141.4 cm", "That's the area."],
          ["94.2 cm", "That's the whole circumference."],
        ],
      ),
      quiz([
        [
          ["Arc: 90°, radius 4 (in π)", "$2\\pi$", ["$4\\pi$", "$8\\pi$"], "¼ × 8π."],
          ["Arc: 180°, radius 5 (in π)", "$5\\pi$", ["$10\\pi$", "$25\\pi$"], "½ × 10π."],
        ],
        [
          [
            "Arc: 30°, radius 12 (in π)",
            "$2\\pi$",
            ["$12\\pi$", "$24\\pi$"],
            "$\\frac{1}{12} \\times 24\\pi$.",
          ],
          [
            "Arc: 40°, radius 9 (in π)",
            "$2\\pi$",
            ["$9\\pi$", "$18\\pi$"],
            "$\\frac19 \\times 18\\pi$.",
          ],
        ],
        [
          ["Sector perimeter is", "arc + 2 radii", ["arc only", "arc + 1 radius"], "All edges."],
          ["Arc length uses", "$2\\pi r$", ["$\\pi r^2$", "$4\\pi r^2$"], "Circumference."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sectors",
    "GF-G18.b",
    "Sector area",
    "A sector is a fraction of the circle's area: θ/360 × πr².",
    [
      problem(
        "The lawn sprinkler",
        [
          "A sprinkler turns through 135° and reaches 4 m. “What area of lawn does it water?”",
          "By the end of this lesson, you can find any sector's area.",
        ],
        sector(135, "135°"),
      ),
      typed(
        "Warm-up",
        "$\\frac{135}{360}$ in simplest form",
        "3/8",
        "Divide by 45.",
        "$\\frac38$.",
      ),
      typed(
        "Warm-up",
        "Area of a circle, radius 4, in terms of π (number only)",
        "16",
        "$\\pi \\times 16$.",
        "$16\\pi$.",
      ),
      explain(
        "Discover",
        "A fraction of the area",
        [
          "A sector with angle θ is $\\frac{\\theta}{360}$ of the circle, so its area is that fraction of $\\pi r^2$.",
          "Sector area $= \\frac{\\theta}{360} \\times \\pi r^2$.",
        ],
        { kind: "maths", tex: "\\text{sector} = \\frac{\\theta}{360} \\times \\pi r^2" },
      ),
      choose("Discover", "A 180° sector of radius 6 has area", "$18\\pi$", "Half of $36\\pi$.", [
        ["$6\\pi$", "That's the arc length."],
        ["$36\\pi$", "That's the whole circle."],
      ]),
      worked(
        "The sprinkler",
        "135°, radius 4 m. Area watered?",
        [
          ["$\\frac{135}{360} = \\frac38$", "Fraction."],
          ["$\\frac38 \\times 16\\pi = 6\\pi = 18.8$ m²", "Of the area."],
        ],
        "18.8 m² of lawn.",
      ),
      steps(
        "Together",
        "Sector: 40°, radius 9",
        "Area.",
        [
          ["Fraction:", "$\\frac19$", ["$\\frac{1}{40}$", "$\\frac{40}{360}$."], "$\\frac19$"],
          [
            "Area:",
            "$9\\pi$",
            ["$2\\pi$", "That's the arc. Use $81\\pi$."],
            "$9\\pi \\approx 28.3$",
          ],
        ],
        "Area uses $\\pi r^2$.",
      ),
      choose(
        "Together",
        "A pie chart sector of 60° in a circle of radius 5",
        "$\\frac{25\\pi}{6}$",
        "$\\frac16 \\times 25\\pi$.",
        [
          ["$\\frac{5\\pi}{3}$", "That's the arc."],
          ["$25\\pi$", "Take $\\frac16$."],
        ],
      ),
      typed(
        "Your turn",
        "Sector: 90°, radius 10, to 1 d.p.",
        "78.5",
        "$\\frac14 \\times 100\\pi$.",
        "78.5.",
        { wrong: [["15.7", "That's the arc."]] },
      ),
      typed(
        "Your turn",
        "Sector: 72°, radius 5, in terms of π (number only)",
        "5",
        "$\\frac15 \\times 25\\pi$.",
        "$5\\pi$.",
        { wrong: [["2", "That's the arc."]] },
      ),
      choose(
        "Watch out",
        "Jo finds a sector area with $2\\pi r$. What's wrong?",
        "Area uses $\\pi r^2$",
        "$2\\pi r$ gives the arc length.",
        [["Nothing", "Area needs $r^2$."]],
      ),
      mistake(
        "Ali finds the area of a 120° sector, radius 3.",
        ["Fraction: $\\frac13$", "Area of the circle: $6\\pi$", "Sector: $2\\pi$"],
        1,
        "Circle area is $\\pi \\times 9 = 9\\pi$: sector $3\\pi$.",
      ),
      choose(
        "Back to the problem",
        "“135°, reaches 4 m. What area does it water?”",
        "18.8 m²",
        "$\\frac38 \\times 16\\pi$.",
        [
          ["9.4 m²", "That's the arc length."],
          ["50.3 m²", "That's the whole circle."],
        ],
      ),
      quiz([
        [
          ["Sector: 90°, radius 4 (in π)", "$4\\pi$", ["$2\\pi$", "$16\\pi$"], "¼ × 16π."],
          ["Sector: 180°, radius 2 (in π)", "$2\\pi$", ["$4\\pi$", "$\\pi$"], "½ × 4π."],
        ],
        [
          ["Sector: 60°, radius 6 (in π)", "$6\\pi$", ["$2\\pi$", "$36\\pi$"], "⅙ × 36π."],
          [
            "Sector: 30°, radius 6 (in π)",
            "$3\\pi$",
            ["$\\pi$", "$36\\pi$"],
            "$\\frac{1}{12} \\times 36\\pi$.",
          ],
        ],
        [
          ["Sector area uses", "$\\pi r^2$", ["$2\\pi r$", "$\\pi d$"], "Area."],
          [
            "Sector fraction",
            "$\\frac{\\theta}{360}$",
            ["$\\frac{\\theta}{180}$", "$\\frac{360}{\\theta}$"],
            "Of a full turn.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sector-angle",
    "GF-G18.c",
    "Finding a sector's angle",
    "Work backwards: θ = arc ÷ circumference × 360.",
    [
      problem(
        "Back to the angle",
        [
          "A sector of radius 6 cm has an arc length of 5π cm. “Find the angle of the sector.”",
          "By the end of this lesson, you can work back to the angle from an arc or an area.",
        ],
        sector(150, "?"),
      ),
      typed(
        "Warm-up",
        "Circumference, radius 6, in terms of π (number only)",
        "12",
        "$2\\pi \\times 6$.",
        "$12\\pi$.",
      ),
      typed("Warm-up", "$\\frac{5}{12} \\times 360$", "150", "$5 \\times 30$.", "150."),
      explain(
        "Discover",
        "What fraction is it?",
        [
          "Find what fraction of the whole the arc (or area) is, then that fraction of 360°.",
          "$\\theta = \\frac{\\text{arc}}{2\\pi r} \\times 360$ or $\\theta = \\frac{\\text{sector area}}{\\pi r^2} \\times 360$.",
        ],
        { kind: "maths", tex: "\\theta = \\frac{5\\pi}{12\\pi} \\times 360 = 150°" },
      ),
      choose(
        "Discover",
        "An arc is $\\frac14$ of the circumference. Its angle",
        "90°",
        "$\\frac14 \\times 360$.",
        [
          ["45°", "A quarter of 360."],
          ["25°", "Fractions of 360, not 100."],
        ],
      ),
      worked(
        "The sector",
        "Radius 6, arc $5\\pi$. Angle?",
        [
          ["Circumference: $12\\pi$", "Whole."],
          ["Fraction: $\\frac{5\\pi}{12\\pi} = \\frac{5}{12}$", "The π cancels."],
          ["$\\theta = \\frac{5}{12} \\times 360 = 150°$", "Of a full turn."],
        ],
        "150°.",
      ),
      steps(
        "Together",
        "From an area: radius 10, sector area $25\\pi$",
        "Angle.",
        [
          [
            "Circle area:",
            "$100\\pi$",
            ["$20\\pi$", "That's the circumference."],
            "$\\frac{25\\pi}{100\\pi} = \\frac14$",
          ],
          ["Angle:", "90°", ["25°", "$\\frac14 \\times 360$."], "90°"],
        ],
        "Area over area.",
      ),
      choose(
        "Together",
        "Radius 4, arc length $2\\pi$. Angle",
        "90°",
        "$\\frac{2\\pi}{8\\pi} = \\frac14$.",
        [
          ["45°", "Circumference is $8\\pi$."],
          ["180°", "$\\frac{2}{8}$, not $\\frac12$."],
        ],
      ),
      typed(
        "Your turn",
        "Radius 9, arc $3\\pi$. Angle?",
        "60",
        "$\\frac{3\\pi}{18\\pi} = \\frac16$.",
        "60°.",
        { unit: "°" },
      ),
      typed(
        "Your turn",
        "Radius 6, sector area $12\\pi$. Angle?",
        "120",
        "$\\frac{12\\pi}{36\\pi} = \\frac13$.",
        "120°.",
        { unit: "°", wrong: [["360", "Divide by the circle's area."]] },
      ),
      choose(
        "Watch out",
        "Arc $5\\pi$, radius 6. Ben divides by $\\pi r^2 = 36\\pi$. What's wrong?",
        "An arc compares with the circumference, $12\\pi$",
        "Length with length.",
        [["Nothing", "Area with area, length with length."]],
      ),
      mistake(
        "Kim finds the angle: radius 5, arc length $5\\pi$.",
        [
          "Circumference: $10\\pi$",
          "Fraction: $\\frac{5\\pi}{10\\pi} = \\frac12$",
          "Angle: $\\frac12 \\times 180 = 90°$",
        ],
        2,
        "A full turn is 360°: $\\frac12 \\times 360 = 180°$.",
      ),
      choose(
        "Back to the problem",
        "“Radius 6 cm, arc length 5π cm. Find the angle.”",
        "150°",
        "$\\frac{5}{12} \\times 360$.",
        [
          ["50°", "Divide by $12\\pi$, not $36\\pi$."],
          ["75°", "$\\frac{5}{12} \\times 360 = 150$."],
        ],
      ),
      quiz([
        [
          ["Radius 3, arc $2\\pi$: angle", "120°", ["60°", "240°"], "$\\frac{2}{6} \\times 360$."],
          ["Radius 5, arc $\\pi$: angle", "36°", ["72°", "18°"], "$\\frac{1}{10} \\times 360$."],
        ],
        [
          ["Radius 4, area $4\\pi$: angle", "90°", ["45°", "180°"], "$\\frac{4}{16} \\times 360$."],
          ["Radius 3, area $3\\pi$: angle", "120°", ["60°", "40°"], "$\\frac{3}{9} \\times 360$."],
        ],
        [
          [
            "From an arc, divide by",
            "the circumference",
            ["the area", "the radius"],
            "Length/length.",
          ],
          [
            "From an area, divide by",
            "the circle's area",
            ["the circumference", "360"],
            "Area/area.",
          ],
        ],
      ]),
    ],
  ),
];
