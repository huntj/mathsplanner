# MathsPlanner: Design Document

Oct 14, 2026 · @J · updated Oct 19, 2026 with the decisions below

MathsPlanner is an open-source TypeScript library and web app that generates unlimited, reproducible questions for every statement in the EYFS to Year 13 progression map, at five depths of understanding, with LaTeX maths, SVG diagrams, worked solutions, auto-marking and print export.

## Goals and principles

The repository will be public so any teacher, school or developer can use, adapt and improve it. Success means every one of the 686 statements has a generator that can tell a teacher whether a student has mastered it, not just whether they can follow a method.

**Licensing.** Code under the MIT licence (`LICENSE`); generated questions, archetype text and the misconception catalogue (`data/misconceptions.json`) under CC BY 4.0 (`LICENSE-CONTENT`), so schools can reuse them freely with attribution. Statement wording is paraphrased from national curriculum documents (Open Government Licence v3) and Pearson specifications; Pearson content references are used only as identifiers (`NOTICE`).

**Scope.** MathsPlanner covers the curriculum currently in force (the national curriculum, the EYFS framework and the Pearson Edexcel specifications in the progression map). It does not plan for the new national curriculum due in 2028.

**Design rules**

1. **Generate once, render anywhere.** A generator returns a plain data object; it never produces HTML, SVG or LaTeX layout itself. Renderers turn that object into web, print or any future format.
2. **Reuse before writing.** A generator is mostly configuration: which archetypes, which diagram types, which parameter ranges, which misconceptions. Anything used by two statements moves into a shared package.
3. **Reproducible.** Every question is fully determined by statement ID, depth, number setting and seed, so a link or a worksheet can always be regenerated exactly.
4. **Exact maths.** Fractions, surds, π and algebra stay exact until display; floating point is used only for drawing.
5. **Mastery over procedure.** Depth 4 and 5 questions must be answerable only by someone who understands the idea, and every wrong option must be a real misconception.
6. **Diagrams tell the truth.** Shapes are drawn to scale unless the question deliberately says "not drawn to scale", and every label sits where a careful teacher would put it.
7. **Accessible by default.** Maths renders with MathML for screen readers; every SVG has a text description; colour is never the only signal.
8. **Tested at scale.** Every generator is run across hundreds of seeds in CI before it can be merged.

## Architecture

A question flows one way: generators read the statement data, combine core maths with an archetype, and output a plain Question object; everything visual or interactive happens downstream of that object.

&#91;embedded content: package architecture · data to generators to outputs\]

Because the Question is data, the render package serves both the gallery and print export, and the marking package can run in the practice app without knowing how the question was generated. The diagram engine is the only place SVG is produced, so improving it improves every statement at once.

## Statement data

The progression map becomes one versioned file, `data/statements.json`, which is the single source of truth for IDs, wording and prerequisites; generators are keyed to it. `pnpm coverage` lists statements that lack a generator (a report, which never fails) and fails if any generator points at a missing ID.

```typescript
interface Statement {
  id: string;            // "Y6-FR-03", "GH-A18", "AL-P7.4"
  stage: Stage;          // "N" | "R" | "Y1" … "Y9" | "GF" | "GH" | "AL" | "FM" | "CM"
  strand: string;        // "FR", "ALG", "N", "P7", "CP", "FS1" …
  text: string;          // the "I can…" wording
  needs: string[];       // prerequisite IDs
  years?: (12 | 13)[];   // KS5 recommended year; some statements span both
  tier?: "F" | "H";      // GCSE tier: "F" (GF) is tested on both tiers, "H" (GH) is Higher only
  option?: "FP1" | "FP2" | "FS1" | "FS2" | "FM1" | "FM2" | "D1" | "D2"; // Further Maths option
  source: string;        // "NC KS2", "Edexcel 1MA1", "Edexcel 9MA0" …
  statutory: boolean;
}
```

Stage and strand come from the ID, as do tier (GF or GH) and option; KS3 statements use the map's recommended Year 7, 8 and 9 split exactly. `source` names the section the statement comes from: Development Matters (Nursery), EYFS framework (Reception), NC KS1, NC KS2, NC KS3, Edexcel 1MA1, Edexcel 9MA0, Edexcel 9FM0 or Edexcel 7MC0. `statutory` is true only for national curriculum content (Years 1 to 9) and the Reception Early Learning Goals; Nursery Development Matters and all qualification specifications are false.

A script, `pnpm data:import`, parses the progression map's Markdown export into this shape, and `pnpm data:check` checks it against a JSON Schema in `data/schema/`: no ID appears twice, every Needs ID exists, the graph has no cycles, and the counts match the map's summary table. Edits after import are made in the JSON by pull request, so changes are reviewed and versioned.

## Mastery model

Every question is set by two independent dials: **depth** (how well the student must understand) and **numbers** (how awkward the arithmetic is). A statement counts as mastered when a student succeeds at depth 4 or 5 with standard numbers; success only at depth 1, however hard the numbers, shows procedural fluency.

| Depth | Name | Tests whether the student can… | Example for Y6-FR-03 (add fractions) |
| --- | --- | --- | --- |
| 1 | Fluency | Carry out the skill in its standard form | ⅓ + ¼ |
| 2 | Varied fluency | Use the skill when the layout or unknown changes | ⅓ + ? = 7/12 |
| 3 | Representation | Move between diagrams, words and symbols | Which bar model shows ⅓ + ¼? |
| 4 | Reasoning | Explain, justify or find an error | Sam says ⅓ + ¼ = 2/7. Which explanation of his mistake is correct? |
| 5 | Problem solving | Use the idea in a non-routine or multi-step problem, often with a prerequisite | Find two different unit fractions that add to 7/12. |

| Numbers | Meaning | Fraction example |
| --- | --- | --- |
| friendly | Small, familiar values; answers are whole or simple | Denominators 2, 3, 4, 6 |
| standard | Typical values for the stage | Denominators up to 12 |
| stretch | Larger, less familiar or awkward values that load working memory | Denominators to 30, mixed numbers |

Each generator declares which depths it supports. Some early statements, such as counting to 5 in Nursery, may only make sense to depth 3; the gallery shows which cells of the 5 × 3 grid each statement fills. Later, the app can use the prerequisite graph to step back: a wrong answer at depth 4 whose misconception belongs to an earlier statement routes the student to that statement's depth 1 to 3 questions.

## Question schema

Every generator returns a `Question`: plain, serialisable JSON with no rendering code, so the same object drives the web app, the print export and any future consumer such as an API.

```typescript
type Depth = 1 | 2 | 3 | 4 | 5;
type Numbers = "friendly" | "standard" | "stretch";

interface Question {
  key: { statementId: string; depth: Depth; numbers: Numbers; seed: number; version: string };
  archetype: ArchetypeId;            // "standard", "spot-the-mistake", …
  stem: Rich;                        // the question text
  diagrams: DiagramSpec[];           // referenced from Rich by index
  parts: Part[];                     // one or more answerable parts
  solution: SolutionStep[];          // worked solution
  meta: { calculator: boolean; marks: number; minutes: number; tags: string[] };
}

// Text and maths interleaved; maths is LaTeX, rendered by KaTeX.
type Rich = Array<
  | { t: "text"; v: string }
  | { t: "math"; v: string; display?: boolean }
  | { t: "diagram"; i: number }
>;

interface Part {
  label?: string;                    // "(a)"
  prompt: Rich;
  answer: AnswerSpec;                // see Answer input and auto-marking
  marks: number;
  misconceptions: Misconception[];   // predictable wrong answers
}

interface Misconception {
  code: string;                      // "FR.ADD.TOPS-AND-BOTTOMS"
  answer: AnswerValue;               // the wrong answer it produces
  feedback: Rich;                    // what to tell the student
  remediate?: string;                // statement ID to step back to
}

interface SolutionStep { say: Rich; math?: string; diagram?: number }
```

Misconception codes live in a shared catalogue, `data/misconceptions.json`, so the same error (for example adding numerators and denominators) is recognised everywhere it appears and teachers see consistent misconceptions in the results they export. `key.version` is the generator's version, so a stored question can still be regenerated identically after the generator changes.

## Archetypes

Fifteen archetypes supply the question structure for every statement; a generator only provides the maths (a correct example, how to make it wrong, how to represent it), and the archetype builds the stem, answer options, marking and solution layout. This is where most of the code reuse comes from.

| Archetype | Depth | What the student does | Marked by | Generator must supply |
| --- | --- | --- | --- | --- |
| standard | 1 | Answer a direct question | value or expression | a problem and its answer |
| missing-value | 2 | Find an unknown in any position | value | an equation-like relationship |
| reverse | 2 | Work backwards from the answer | value | the inverse relationship |
| varied-form | 2 | Same skill, unfamiliar layout or wording | value | alternative layouts |
| match-representations | 3 | Match a symbol, diagram and words | matching | 2 or more representations |
| choose-the-diagram | 3 | Pick the diagram that shows the maths | choice | correct and misconception diagrams |
| draw-or-plot | 3 | Plot, shade or construct | interactive check | the target object and tolerance |
| spot-the-mistake | 4 | Find the wrong line of working | choice | a worked solution and an error |
| explain-the-error | 4 | Pick the correct explanation of a mistake | choice | misconception codes |
| always-sometimes-never | 4 | Judge a general claim | choice + reason | a claim and counterexamples |
| true-or-false-why | 4 | Judge a statement and pick the reason | choice + reason | a statement and reasons |
| odd-one-out | 4 | Find the item that breaks the pattern | choice + reason | equivalent items and one impostor |
| compare-methods | 4 | Judge which method works or is efficient | choice | two or more methods |
| open-construction | 5 | Find an example meeting conditions | condition check | a validator, not a fixed answer |
| multi-step-context | 5 | Solve a non-routine problem combining statements | value or expression | a chain using prerequisite generators |

**Choice-marked versions.** Some single-answer questions are best answered by choosing: naming a shape, an angle type, or a value with its reason. `A.choice` builds a standard, varied-form or reverse question marked by choice, with each wrong option tied, where it can be, to a misconception code. Options are shuffled and given neutral letters, so the markup never reveals the answer.

**open-construction** matters most for mastery: "find two unit fractions that add to 7/12" has several right answers, so the part is marked by a function that checks the conditions rather than against a stored answer. **multi-step-context** reuses the generators of prerequisite statements, so a GCSE ratio problem can call the Year 6 ratio generator for one of its steps.

## Diagram engine

All visuals come from one package, `@mathsplanner/diagrams`, which turns a small JSON `DiagramSpec` into a self-contained SVG string with no browser dependency, so the same code draws on screen, in print and in tests. Generators describe *what* to draw; the engine decides *where* labels go.

| Diagram type | Covers | Key behaviours |
| --- | --- | --- |
| geometry | Polygons, triangles, circles, angles, parallel lines, constructions, loci, circle theorems, bearings, 3D sketches | Angle arcs sized to the angle; right-angle squares; labels placed on the angle bisector outside the arc; side labels on the outward normal; equal-side ticks and parallel arrows; optional "not drawn to scale" distortion |
| cartesian | Coordinate grids, straight lines, curves, regions, transformations, gradients and areas, kinematics graphs | Nice tick spacing; four-quadrant or first-quadrant; adaptive sampling with asymptote detection (1/x, tan x); shaded regions and inequalities; tangents and chords |
| number-line | Counting, negatives, fractions, decimals, inequalities, error intervals | Any scale and range; open and closed circles; jumps for calculation strategies |
| bar-model | Part-whole, comparison, fractions, ratio, percentages | Proportional bars, braces with labels, unknowns marked |
| counters | Ten frames, dot patterns, place-value counters, arrays, base-10 blocks | Subitising layouts, regrouping |
| measure | Clocks, rulers, scales, jugs, thermometers, protractors | Scale reading at any interval |
| chart | Pictograms, bar, line, pie, scatter, histograms, box plots, cumulative frequency, frequency polygons | Exact data-driven geometry; unequal class widths |
| probability | Tree diagrams, Venn diagrams, sample-space grids, two-way tables, frequency trees | Branch probabilities in LaTeX; up to three sets |
| network | Graphs and networks for Decision Maths, activity networks, Gantt charts | Automatic layout with fixed-position override |
| complex | Argand diagrams, loci in the complex plane | Modulus-argument arcs |
| vector | Vectors on grids and in geometric figures | Arrowheads, midpoint markers |

**Label placement** is the hardest part to get right and is shared by every type: each label proposes candidate positions in priority order, and a solver picks the set with no overlaps between labels, lines and arcs, moving earlier labels aside where that frees a spot. Overlaps it cannot avoid are reported, never hidden, and the quality checks fail a generator on them. The one exception is axis numbers on graphs: one that would sit on a curve tries the other side of the axis or a small shift, and is otherwise left out, as on a hand-drawn graph.

**Label text.** Labels are written in LaTeX but drawn as real SVG text, so every SVG is self-contained and works in print, downloads and tests without KaTeX's stylesheet. The engine lays out a classroom subset (numbers, italic variables, operators with KaTeX's spacing, degrees, powers and subscripts, fractions, roots, Greek letters, `\text`, `\mathrm`) in KaTeX's fonts, measured with KaTeX's own font metrics so each label's size is known before placement. LaTeX outside the subset throws, so a generator's tests catch it.

**Truth checks.** Specs are checked against the drawing before it is shown. For geometry: every stated angle and right angle matches the drawing; stated lengths share one scale; sides with equal tick marks are equal; sides with parallel arrows are parallel; and polygons have area. When a diagram is flagged not to scale, the angle and length checks give way to a check that the stated angles still add up. Number lines, graphs and bar models check their values fit the axes and parts. The renderer refuses a diagram that fails.

**Specs and builders.** Geometry specs give named points in maths coordinates, so the drawing is to scale by construction. Curves on graphs are expressions in x, such as `x^2 - 3x + 2` or `2sin(x)`, parsed by a small safe parser rather than evaluated. Builders such as `anglesOnLine`, `anglesAtPoint`, `regularPolygon`, `triangleSSS` and `triangleASA` turn the numbers a generator knows into specs, so generators never compute coordinates by hand. Fifty reference diagrams, with SVG snapshot tests, cover the four Phase 3 types; the gallery's Diagrams page shows them for review.

**Accessibility.** Every spec produces a text description as well as the SVG, for example "Triangle ABC. Angle A is 52°. Angle B is a right angle. Side AC is 8 cm."

## Answer input and auto-marking

Every part declares an `AnswerSpec`, which decides both the input widget shown and how the response is marked; marking runs in the browser and returns the score, the matched misconception if any, and the feedback to show.

| Answer type | Input widget | Marking rule | Used for |
| --- | --- | --- | --- |
| number | Numeric field | Exact, or within a tolerance or to stated accuracy (d.p., s.f.) | Most depth 1 and 2 numeric answers |
| exact | Maths keyboard (MathLive) | Equivalent value, plus an optional required form | Fractions, surds, π, expressions, equations |
| coordinate | Paired fields or click on grid | Exact or within tolerance | Coordinates, vectors |
| choice | Buttons | Correct option; wrong options map to misconceptions | Depth 3 and 4 archetypes |
| multi-select | Checkboxes | All correct options and no others; partial credit optional | Select all that apply |
| choice-with-reason | Two button groups | Both parts correct | always-sometimes-never, true-or-false-why |
| order | Drag to sort, or move up and down with buttons | Exact order | Ordering numbers, steps of a proof |
| match | Drag to pair, or choose a partner from a list | All pairs correct | match-representations |
| plot | Interactive SVG: tap to place points, draw a protractor arm, or construct with an on-screen protractor; arrow keys work too | Geometric tolerance | Plotting, transformations, inequalities, constructions |
| condition | Any of the above | A validator function checks the conditions | open-construction |
| free-text | Text box | Not auto-marked; flagged for teacher review, shown with a mark scheme | Optional written explanations |

**Form matters.** "Write in its simplest form" or "give your answer in the form a√b" is enforced: `exact` answers carry a `form` rule (simplest, mixed number, improper, factorised, expanded, standard form, a√b, and so on). A right value in the wrong form gets a specific message rather than a cross.

**Equivalence.** Student LaTeX from MathLive is parsed with the open-source Cortex Compute Engine and compared to the expected answer by exact symbolic simplification first, then by evaluation at random points for expressions as a fallback, so 2(x + 3) and 2x + 6 both pass when no form is required. The engine is large, so it loads only when a question needs it: `prepareMarking(question)` fetches it before an exact answer is marked, and marking itself stays synchronous.

**Partial marks and misconceptions.** A choice-with-reason part scores half for the right choice with a wrong reason, or the reverse. Every wrong option, and every wrong reason, can carry a misconception code; in a choice-with-reason part a `choice` misconception names a reason, whichever option goes with it. A plot part lists the points the student places (`place`), and diagrams report their coordinate frame so a tap becomes a point in the diagram's own units.

**Misconception detection.** Before marking a response wrong, it is compared against each misconception's answer; a match returns that misconception's feedback and remediation link.

## Writing a generator

A generator is one file, `generators/<stage>/<ID>.ts`, that picks parameters from a seeded random source and hands the maths to archetypes; the example below for Y6-FR-03 (add and subtract fractions with different denominators) is about 70 lines and covers all five depths.

```typescript
import { defineGenerator, frac, pick, latex as L } from "@mathsplanner/core";
import { barModel } from "@mathsplanner/diagrams";
import * as A from "@mathsplanner/archetypes";

export default defineGenerator({
  id: "Y6-FR-03",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.ADD.KEEP-ONE-DENOMINATOR"],

  // Parameters depend only on rng and the numbers dial.
  params(rng, numbers) {
    const dens = { friendly: [2, 3, 4, 6], standard: [2, 3, 4, 5, 6, 8, 10, 12], stretch: [6, 7, 8, 9, 12, 15, 20, 24] }[numbers];
    const [d1, d2] = rng.distinct(dens, 2, (a, b) => a % b !== 0 && b % a !== 0);
    const a = frac(rng.int(1, d1 - 1), d1);
    const b = frac(rng.int(1, d2 - 1), d2);
    return { a, b, op: rng.pick(["+", "-"]) };
  },

  // Reject parameter sets that make bad questions.
  accept: ({ a, b, op }) => op === "+" || a.gt(b),

  build({ a, b, op }, depth, rng) {
    const answer = op === "+" ? a.add(b) : a.sub(b);
    const wrong = {
      "FR.ADD.TOPS-AND-BOTTOMS": frac(a.n + (op === "+" ? b.n : -b.n), a.d + b.d),
      "FR.ADD.KEEP-ONE-DENOMINATOR": frac(a.n + (op === "+" ? b.n : -b.n), a.d),
    };
    const expr = L`${a} ${op} ${b}`;

    switch (depth) {
      case 1: return A.standard({ ask: expr, answer, form: "simplest" });
      case 2: return A.missingValue({ relation: [a, op, b, "=", answer], hide: rng.pick([1, 2]) });
      case 3: return A.chooseTheDiagram({
        prompt: expr,
        correct: barModel.sum(a, b, op),
        distractors: [barModel.sum(a, b, op, { equalParts: false }), barModel.sum(a, frac(b.n, a.d), op)],
      });
      case 4: return A.explainTheError({ claim: L`${expr} = ${wrong["FR.ADD.TOPS-AND-BOTTOMS"]}`, codes: Object.keys(wrong) });
      case 5: return A.openConstruction({
        prompt: L`Find two different unit fractions with a sum of ${answer}.`,
        check: (x, y) => x.isUnit() && y.isUnit() && !x.eq(y) && x.add(y).eq(answer),
        requireExists: true, // reject seeds where no solution exists
      });
    }
  },

  solution: ({ a, b, op }) => A.steps.commonDenominator(a, b, op),
});
```

**Contract.** A generator must be pure (same inputs, same output), must not render anything, must declare every depth it supports, and must list the misconception codes it can produce. `defineGenerator` wraps it with seeding, retries when `accept` or `requireExists` rejects a parameter set (a generator can also call `reject()` from `params` or `build`), and checks the result: every misconception used is declared, every diagram reference exists, and the question is plain JSON. `createRegistry` attaches the statement metadata from `data/statements.json`.

**Seeding.** Parameters are drawn from a stream seeded by statement ID, numbers setting and seed but not depth, so one seed shows the same numbers at every depth unless a depth rejects them; `build` gets its own stream that also depends on depth. Open-construction parts keep their validator function outside the JSON: `generate` returns the plain Question, and `generateFull` also returns the validators for marking.

**In practice.** The example above shows the shape of a generator; the real API differs in small ways. Wrong answers are listed per part as `wrong: [{ code, value, feedback }]`, `verify(params, question)` is part of the definition, solutions are `solution: [{ say, math }]` steps passed to each archetype, and a generator can call `reject()` from `params` or `build` as well as using `accept`. The Phase 4 generators in `packages/generators/src` are working examples; `ks2/Y5-GEO-04.ts` is a short one.

**Ambiguous answers.** A right answer can have several correct names: a square is also a rectangle, a rhombus, a parallelogram, a kite and a trapezium, and a diameter is also a chord. A wrong option must be definitely wrong, so shape generators pick distractors with `wrongNames` and build match sets with `distinctKinds`, both driven by the shape hierarchy in `generators/src/shared/shapes.ts`. The same care applies anywhere one answer is a special case of another.

**Shared helpers** in `@mathsplanner/core` cover the repeated maths: rationals with BigInt, surds, polynomials, angle and triangle builders, "nice" number pickers (Pythagorean triples, integer-root quadratics, terminating decimals), unit conversion, and LaTeX formatting that prints fractions, mixed numbers and signs correctly. Helpers that only generators need live in `packages/generators/src/shared/`: angle pickers and distractor filters, turns, the shape hierarchy, marked triangle pairs (which read the congruence condition back from their marks), and circles with sectors and segments.

## Quality

No generator is merged until it passes automated checks across 500 seeds at every depth and number setting it supports, and a human has reviewed a sample in the gallery.

| Check | What it catches | How |
| --- | --- | --- |
| Answer verification | Wrong answers | Each generator ships an independent `verify` that recomputes the answer a different way (e.g. by evaluation instead of algebra) |
| Misconception distinctness | Distractors equal to the right answer or to each other | Compared after simplification |
| Degeneracy | Impossible or trivial questions: zero-length sides, angles of 0°, answers of 1 or 0 where unwanted | Per-type rules in `@mathsplanner/core` |
| Number niceness | Answers messier than the numbers dial allows | Declared bounds per setting |
| Diagram truth | Drawings that contradict the numbers | Geometry truth checks on every spec |
| Label collisions | Overlapping labels or labels crossing lines | Placement solver reports unresolved overlaps |
| Determinism | Same key giving different questions | Generate twice, compare JSON |
| Visual regression | Unintended changes to diagrams | SVG snapshot tests for fixed seeds |
| Coverage | Statements without generators; depths missing; generators naming unknown statements | `pnpm coverage` compares against statements.json: missing generators are reported, unknown IDs fail |
| Accessibility | Missing descriptions, low contrast | Lint on every SVG and rendered page |

Each generator's test runs the checks with `assertQuality` from `packages/generators/src/quality.ts`, which generates every depth and numbers setting for 500 seeds (set `QUALITY_SEEDS` to change this locally) and reports failures by check, depth, setting and seed. Alongside the table above it checks that every question renders, every solution is non-empty, and every misconception code is in `data/misconceptions.json`. Visual regression is covered by snapshots of fixed seeds.

Tests use Vitest with fast-check for property-based testing. GitHub Actions runs everything on each pull request and publishes the gallery as a preview site, so reviewers click through real questions rather than reading code.

**Human review.** Each statement has a review checklist in the gallery: is depth 4 genuinely about understanding, are the distractors misconceptions students really make, would a teacher put this in front of a class? Reviews are recorded in the generator file's header so the coverage dashboard can show reviewed and unreviewed statements.

**AI-assisted contributions** are accepted. They must pass the same automated checks as any other contribution, be disclosed in the pull request (which tool, and what it did), and carry a recorded human teacher review in the generator file header before they are merged.

## Repository layout and tooling

The repo is a pnpm workspace monorepo in TypeScript, hosted at github.com/huntj/mathsplanner: small packages others can install on their own (for example just the diagram engine), published under the `@mathsplanner` scope, plus two apps.

```text
mathsplanner/
├─ data/
│  ├─ statements.json          # from the progression map
│  ├─ misconceptions.json      # shared misconception catalogue
│  └─ schema/                  # JSON Schemas for both files
├─ packages/
│  ├─ core/                    # schema types, seeded RNG, exact maths, LaTeX helpers, defineGenerator
│  ├─ diagrams/                # DiagramSpec → SVG, label placement, truth checks
│  ├─ archetypes/              # the 15 question patterns and solution-step builders
│  ├─ marking/                 # AnswerSpec checking, equivalence, form rules
│  ├─ render/                  # Question → HTML (KaTeX + SVG), used by web and print
│  └─ generators/              # one file per statement, by stage: eyfs/, ks1/ … ks5/; coverage and `new` scripts
├─ apps/
│  ├─ gallery/                 # browse every statement × depth × numbers × seed; review checklist
│  └─ practice/                # student-facing web app with input widgets and marking; stateless
├─ tools/
│  ├─ import-map/              # progression map → statements.json; data:check
│  └─ print/                   # worksheet builder → PDF via headless Chromium
└─ .github/workflows/          # test, gallery preview, release
```

**The practice app is stateless.** It has no accounts and stores no student results, so there is no personal data to protect. The teacher exports results at the end of a session as CSV or prints them.

| Concern | Choice | Why |
| --- | --- | --- |
| Language | TypeScript, strict mode | One language for generators, browser and print |
| Runtime | Current Node LTS (Node 24) | Long support window |
| Workspace | pnpm workspaces | Fast, strict dependency handling across packages |
| Lint and format | ESLint with typescript-eslint, and Prettier | Consistent code without review comments about style |
| Data validation | JSON Schema, checked with Ajv | Statement and misconception files are validated in CI |
| Maths display | KaTeX with MathML output | Fast, accurate, accessible, works server-side for print |
| Maths input | MathLive | Open-source maths keyboard producing LaTeX |
| Equivalence | Cortex Compute Engine | Parses LaTeX and checks symbolic equality |
| Apps | React with Vite | Widely known, so contributors can join easily |
| Print | HTML to PDF with Playwright | Same rendering as the web, so diagrams are built once |
| Tests | Vitest and fast-check | Fast unit and property-based tests |
| Hosting | GitHub Pages for the gallery and practice app | Free for public repos |

**Gallery links.** The gallery keeps its state in the URL hash, so it runs on GitHub Pages without a server, and every question view is a complete key: `#/s/Y5-GEO-04?depth=1&numbers=standard&seed=42&v=0.1.0`. Opening a link regenerates the question exactly; if the generator has changed version since, the gallery says so.

**Print export.** The print tool lays out a worksheet in A4 HTML (questions, then a separate answers and worked-solutions section), with options for number of questions, depth mix, seed, and the reduced-ink style teachers prefer for photocopying, then prints to PDF. Every sheet carries its seed so it can be regenerated.

**Contributing.** A `CONTRIBUTING.md` explains how to claim a statement (one GitHub issue per statement, generated automatically from statements.json), the generator contract, the quality checks, the review checklist, and the policy for AI-assisted contributions. A `pnpm new Y5-FR-04` command scaffolds a generator file, a test file and a gallery entry from a template.

## Roadmap

The build runs in eight phases; each ends with a check that must pass before the next starts, and phase 4's angles and geometry slice is the test of the whole design, chosen because it stresses the diagram engine hardest.

| Phase | Delivers | Exit criteria |
| --- | --- | --- |
| 0. Foundations | Public repo, licences, workspace, CI, CONTRIBUTING, statements.json imported | CI green; all 686 statements load with valid prerequisites |
| 1. Core | Schema types, seeded RNG, exact rationals and surds, LaTeX helpers, defineGenerator | Property tests pass for the maths library |
| 2. Render and gallery | Question → HTML with KaTeX; gallery browsing by ID, depth, numbers, seed | A placeholder generator displays and regenerates identically from a link |
| 3. Diagram engine, first types | geometry, cartesian, number-line, bar-model, with label placement and truth checks | 50 reference diagrams reviewed with no label collisions |
| 4. Vertical slice: angles and geometry | About 40 generators following the angles and geometry chain, from turns and right angles (Y1-POS-01, Y3-GEO-02) to circle theorems (GH-G10); all 15 archetypes implemented | Every slice statement passes quality checks at all its depths; a teacher review agrees depth 4 tests understanding |
| 5. Marking and practice app | All answer types, input widgets, misconception feedback; stateless, with results exported by the teacher as CSV or print | Every slice question can be answered and marked in the browser |
| 6. Print export | A4 worksheets with answers and worked solutions | A mixed-depth worksheet prints correctly from a seed |
| 7. Scale out | Remaining diagram types and generators, strand by strand following the prerequisite graph; contributor issues opened | Coverage dashboard shows every statement generated and reviewed |

Phases 0 to 6 are complete: Phase 4's 36 generators pass every automated check and have a recorded teacher review of depth 4. In Phase 5 a test marks every slice question (the right answer scores full marks and every recorded misconception is caught), and the practice app is published at /practice/ beside the gallery. In Phase 6 worksheets are rendered by `renderWorksheet` in `@mathsplanner/render` (print mode adds answer lines, working space and true-size construction canvases), printed from the practice app's worksheet page or to PDF by `tools/print` through Playwright with an installed Chrome or Edge, and a test prints a mixed-depth worksheet from a seed.

Phase 7 started with number and place value, Nursery to Year 9 (67 statements). Statements that share a skill across years share a family in `packages/generators/src/shared/npv.ts` (digit value, comparing, numbers in words, counting in steps, more or less, number lines, rounding, negatives, Roman numerals, problems), so each year's file only sets its number ranges; KS3 generators are written individually, with a shared standard-form helper that keeps digits exact. Addition and subtraction (Nursery to Year 5, 22 statements) followed the same pattern in `shared/as.ts`: column methods worked line by line with carrying and exchanging slips, mental methods with number-line jumps, missing numbers, estimating and checking, and word problems of one to three steps. Multiplication and division (Year 1 to Year 6, 30 statements) is in `shared/md.ts`: times tables with arrays, short and long multiplication, short and long division with remainders interpreted in context, mental methods, factors, primes and word problems. Misconception codes remediate to the earliest statement that teaches the skill, so the powers-of-ten and order-of-operations codes first used in KS3 now point to Y5-MD-07 and Y6-MD-06. Fractions, decimals and percentages (Year 1 to Year 7, 45 statements) are in `shared/fr.ts`: naming fractions with bars, fractions of amounts, counting in tenths and hundredths, equivalents, adding and subtracting (same, related and different denominators, and mixed numbers), comparing, fraction–decimal–percentage equivalents, and rounding and comparing decimals. Exact answers are Rationals marked by value; Year 6 answers also require the simplest form. Ratio and proportion (17 statements) and algebra (29 statements) followed for KS2 and KS3. Algebraic answers are exact LaTeX marked by the compute engine, with expanded and factorised forms checked; graphs use the cartesian diagram, and the label placer now lets a required label (such as the origin) push out optional tick numbers rather than overlap them. Statistics (Year 2 to Year 8, 14 statements) added the chart diagram type: bar charts, pictograms with part symbols and pie charts, drawn from their data, with descriptions that do not give the data away when reading the chart is the question; line graphs use the cartesian type. Probability (KS3, 5 statements) added the probability type with two-set Venn diagrams. Measurement (Nursery to Year 6, 43 statements) extended the measure type beyond protractors to analogue clocks (with optional Roman numerals), centimetre rulers with an object along them, measuring jugs, thermometers and weighing-scale dials, each checked against its numbers; `shared/mea.ts` holds time words, money, scale picking, rectilinear shapes on squared grids, labelled L-shapes, cuboids (outlined or built from cubes), triangles and parallelograms. The last geometry, position and pattern statements up to Year 9 (35) completed KS3: `shared/pos.ts` handles coordinates and transformations (translations, reflections, rotations, enlargements) on cartesian grids; `shared/solids.ts` sketches cubes, cuboids, prisms, pyramids, cylinders, cones and spheres in oblique projection with hidden edges dashed, and draws nets on squared paper (the cube nets are checked by rolling a cube); and the counters type gained a pattern layout, a row of filled and empty shapes with dashed gaps, for the early-years repeating patterns. GCSE Foundation (the 87 statements both tiers share) followed in `src/ks4/`, one strand at a time: number, algebra, ratio, geometry, then probability and statistics. The probability type gained tree diagrams, both probability trees and frequency trees, laid out leaf by leaf, with branch labels lifted clear of sloping branches. Histograms with equal class widths are shaded rectangles on the cartesian type, and a script test fails any generator source that writes a LaTeX command with a single backslash. GCSE Higher (the 40 Higher-only statements) completed GCSE: surd answers use the core Surd type, so they are exact and simplified; trigonometric graphs use the cartesian type in degrees; the chart type gained box plots (one to three on a shared scale, each from its five-number summary); and diagram labels gained `\mathbf` for vectors. KS5 (224 statements) is in `src/ks5/`. A level Maths (106) came first, pure then statistics then mechanics, with shared helpers for trigonometry (`trig.ts`: exact values, radians as multiples of π, solving in a range), vectors (`vec.ts`) and distributions (`dist.ts`: binomial, normal and Poisson probabilities, computed rather than read from tables). Further Maths (80) followed: core pure, then the optional further pure, statistics, mechanics and decision maths papers, with `cplx.ts` for complex numbers, `mat.ts` for matrices and determinants, and `dec.ts` for small networks (given as edge lists or tables, with Kruskal's and Dijkstra's algorithms to find the answers and greedy walks to model the misconceptions). Core Maths (38) finished the map, with contexts from finance, insurance, surveys and production planning. New misconception families include CALC (calculus), MECH (mechanics), CPLX (complex numbers), MAT (matrices) and DEC (decision maths). Writing KS5 also fixed two marking bugs: an exact answer such as 9e − 24 was read as scientific notation, and stripping spaces joined a command to the next letter (`\pi r` became `\pir`); both are now covered by tests. The counters diagram type draws ten frames, fingers, tally marks, part-whole models and place-value counters. The gallery's coverage page reads each generator's header and shows generated and reviewed statements by stage. Every statement now has a generator; Phase 7's exit criterion also needs a teacher review of each one, so reviewing is what remains. Contributor issues are not opened yet.

Phases 0 to 6 are the core build; phase 7 is where most generators get written and where outside contributors can help in parallel, one statement per pull request.

## Decisions

The open questions from the first draft are settled; the sections above reflect them.

- [x] **Name and owner.** The project is MathsPlanner, hosted on a personal GitHub account (github.com/huntj/mathsplanner). The package scope is `@mathsplanner`.
- [x] **Vertical slice.** Phase 4's slice is angles and geometry rather than fractions, so that strand is completed first and the diagram engine is tested hardest.
- [x] **Practice app.** Stateless: no accounts and no stored student results. Results are exported by the teacher as CSV or print.
- [x] **Curriculum version.** Current curriculum only. There is no `curriculum` field and no plan for migrating to the 2028 national curriculum.
- [x] **AI-assisted contributions.** Accepted. They must pass the same automated checks, be disclosed in the pull request, and carry a recorded human teacher review in the generator file header.
- [x] **KS3 years.** KS3 statements use the progression map's recommended Year 7, 8 and 9 split exactly.
- [x] **Diagram labels.** Labels are drawn as SVG text in KaTeX's fonts, measured with KaTeX's font metrics, rather than as KaTeX HTML embedded in the SVG, so every diagram is a self-contained SVG.
- [x] **KS5 years.** Some KS5 statements are recommended for both Year 12 and Year 13, so `year` became `years: (12 | 13)[]`.
