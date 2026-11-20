# Proposal: diagrams first, and answers you drag

Status: **agreed on 18 November 2026**, with the owner's answers below. Building has started with step 1. It adds to the agreed
[variation proposal](lesson-variation.md) and runs in the same batches, Year 7 to GCSE Higher.

## In short

The owner asked for these things across every lesson from Year 7 to GCSE Higher:

1. **Diagrams first.** Questions about shapes, angles, graphs and charts show the diagram, with
   the given values on it, as pupils will meet them in exams. Circle theorem questions in
   particular should have no worded-only questions.
2. **See the changes.** Interactive diagrams the pupil can drag, so they watch what changes and
   what stays the same.
3. **Answer by doing.** Where it fits, the pupil answers by drawing or dragging rather than
   typing, for example dragging the top of a bar to draw a bar chart.
4. **Few words** (added on 20 November 2026). Instructions and text are kept to a minimum, as
   reading ages vary. Text that explains what is happening goes in a bubble beside the working,
   so pupils can tell it apart from the words they need to answer (part 4).

An audit of all 398 lessons (6396 questions, counting each exit-check question and its retry)
found how far there is to go:

| Stage           | Questions | With a diagram now | Worded, but about a shape, graph or chart | Hands-on screens now |
| --------------- | --------: | -----------------: | ----------------------------------------: | -------------------: |
| Year 7          |      1124 |          117 (10%) |                                       129 |           59 of 1030 |
| Year 8          |       779 |          145 (19%) |                                       209 |            53 of 725 |
| Year 9          |       598 |          118 (20%) |                                       174 |            57 of 574 |
| GCSE Foundation |      2783 |            86 (3%) |                                       714 |           40 of 2467 |
| GCSE Higher     |      1112 |          183 (16%) |                                       296 |             0 of 936 |
| **All**         |  **6396** |      **649 (10%)** |                                  **1522** |      **209 of 5732** |

Only 60 of the 2418 exit-check questions have a diagram. Many exit-check questions about
diagrams test recall ("A scatter graph shows…") rather than asking the pupil to read or draw one.

The plan has four parts, each described below:

- **diagram-first questions**, with a test that enforces them;
- **Explore** screens, where the pupil drags part of a diagram and watches what changes;
- **answer screens you drag or tap**;
- **few words, with explainers in a bubble**.

They are built first, then used in the circle theorems pilot. After the owner's review, they go
year by year together with the variation work.

## 1. Diagram-first questions

### The rules

- **Show it.** In a lesson about shapes, angles, graphs, charts, tables or diagrams, every
  question shows its diagram, including in the exit check.
- **Values go on the diagram, not in words.** "O is the centre. Angle AOB = 130°. Find angle ACB."
  becomes a diagram with 130° marked at O, a "?" at C, and the words "Find angle ACB. Give a
  reason."
- **Words only say what to find**: "Find x.", "Find the length AB to 1 d.p.", "Which bar is
  wrong?". A reason, chosen from options, stays in words, with the diagram above it.
- **Do, don't recall.** A recall question about a diagram is replaced by a task on a real one.
  For example, "A scatter graph shows…" becomes "Here is a scatter graph. Which describes it?".
- **Drawn accurately from the numbers**, as the circle theorem diagrams are now, so what a pupil
  sees is true. Where a question needs a diagram that is not to scale, it says so.

### New diagrams

These pictures will be generated from the numbers in each question:

- pie charts;
- histograms with unequal bars;
- box plots;
- cumulative frequency curves;
- frequency polygons;
- dot plots;
- pictograms;
- probability tree diagrams;
- scales and dials to read;
- maps with bearings;
- 3D solids with labelled edges;
- parallel lines with a transversal;
- polygons with interior and exterior angles;
- vectors on squared paper.

The Venn diagram, number line, coordinate grid, bar chart, hundred square and triangles already
exist.

### A test that holds it

In diagram topics, `unit-lessons.test.ts` will fail any question whose words name a shape, angle,
graph or chart but which has no diagram. A question can opt out only with `wordsOnly` and a
reason, so every exception is visible in review.

### Example: the circle theorems exit check

Today:

- "Angle AOB = 150°. Angle ACB?" in words, with options.

Diagram-first:

- the circle drawn with 150° at O and "?" at C;
- the words "Find angle ACB.";
- the retry: the same diagram turned, with 96° at O.

## 2. Explore: see what changes

**Explore** is a new screen: a diagram with handles the pupil can drag, and measurements that
update live. It sits in **Discover**, and works as Reflect, Expect, Check:

1. The pupil predicts what will happen.
2. They drag the diagram to check.
3. A short question asks what stayed the same.

| Lesson                    | The pupil drags                  | And watches                                                        |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------ |
| The angle at the centre   | C round the circle               | angle ACB stay half of angle AOB, until C crosses to the minor arc |
| Angles on a straight line | the dividing line                | the two angles change, but always add to 180°                      |
| Triangle angle sum        | a corner                         | three angles change, their sum stays 180°                          |
| Parallel lines            | the transversal                  | alternate and corresponding angles stay equal                      |
| Similar shapes            | a scale slider                   | lengths ×k, areas ×k², volumes ×k³                                 |
| SOH CAH TOA               | the hypotenuse, at a fixed angle | O ÷ H stays the same                                               |
| Averages                  | one value on a dot plot          | the mean moves, the median may not                                 |
| Area of a rectangle       | a side                           | the area, and why doubling one side doubles it                     |
| Graph transformations     | sliders for a and b              | y = f(x + a) + b move left, right, up and down                     |
| Proportion                | a k slider                       | y = kx² and y = k/x keep their shapes                              |

It's built as one small, reusable dynamic-geometry piece, not a new screen per topic. A screen
is described as data:

- points, which can be fixed, on a circle, on a line, or free on a grid;
- lines and arcs between them;
- measurements: angles, lengths, areas and ratios;
- optional sliders.

Handles snap to sensible values and move by keyboard too (Tab, then the arrow keys).

## 3. Answers you draw or drag

### New answer screens

| Screen         | What the pupil does                                                            | Where it's used most                                                                             |
| -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Drag bars**  | Drags the top of each bar to its value; snaps to the scale                     | Bar charts, vertical line charts, histograms (frequency density), frequency diagrams             |
| **Pie**        | Drags each slice's edge to its angle; snaps to 5°                              | Drawing pie charts                                                                               |
| **Box plot**   | Drags the five markers along a scale                                           | Drawing box plots from data or quartiles                                                         |
| **Tap**        | Taps a part of a diagram: an angle, side, point, bar, slice or region          | "Tap the angle equal to x", "tap the diameter", "tap the modal bar", "tap where the lines cross" |
| **Table fill** | Types into blank cells of a table                                              | Tables of values before plotting, two-way tables, frequency trees, ratio tables                  |
| **Interval**   | Drags the ends on a number line and taps each end open or closed               | Inequalities, error intervals, bounds                                                            |
| **Bar model**  | Drags dividers to split a bar, or builds bars from boxes                       | Ratio, fractions of amounts, percentages, equations                                              |
| **Colour in**  | Taps parts of a bar model or shape to colour them, to show a fraction or ratio | Fractions, equivalent fractions, ratio, percentages                                              |
| **Venn drag**  | Drags items into the right region                                              | Venn diagrams in probability, HCF and LCM, set notation                                          |
| **Tree fill**  | Types probabilities onto the branches                                          | Probability trees                                                                                |
| **Move shape** | Drags, turns and flips a shape onto its image                                  | Transformations                                                                                  |
| **Vector**     | Drags an arrow's tip on squared paper                                          | Column vectors, adding vectors                                                                   |
| **Scale**      | Drags a pointer to a reading                                                   | Reading scales, measures, rounding to the nearest mark                                           |

### Existing ones to use far more

These already exist and are used in only a few lessons today:

- **Plot**: tap points on a grid, and join them into a line or curve;
- **Drag line**: lines of best fit, tangents;
- **Slider**;
- **Place**: put a value on a number line;
- **Shade**: shade squares, sample spaces, regions;
- **Dial**: angles, bearings;
- **Morph**;
- **Label**;
- **Balance**;
- **Sort**;
- **Order**;
- **Fill**;
- **Spin**;
- **Machine**.

### What every hands-on screen does

- Works by touch and by keyboard, with a spoken description for screen readers.
- Snaps to sensible values, and gives a nudge after a wrong try, never a penalty.
- Fits a 390-pixel-wide phone in light and dark mode.
- Is covered by the "can be done" test in `unit-lessons.test.ts`.

Hands-on answers can be used in the learning stage's sets, so a variation set can be five bar
charts to draw, each changing one thing.

## 4. Few words, and explainers in a bubble

Added on 20 November 2026 at the owner's request. Pupils' reading ages vary widely, so
instructions and other text are kept to a minimum. Text that explains what is happening is set
apart in a bubble, so a pupil can always tell the words they need to answer from the words that
only explain.

### Three kinds of words

| Kind              | What it is                                                  | Where it goes                                                     | Example (circle theorems)                                                                  |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **What to do**    | the question or instruction                                 | on the page, under the title, as now                              | "Find angle ACB. Give a reason."                                                           |
| **The working**   | what a pupil writes in the answer: the maths and its reason | in the working, in the working's style, as in a model exam answer | "ACB = 130° ÷ 2 = 65°" and "(angle at the centre is twice the angle at the circumference)" |
| **The explainer** | why a step is done, or what to notice                       | in a **speech bubble** beside the working line it explains        | "You need to state the angle and also give a reason why this is true."                     |

So the reason a pupil must write is part of the method and the working, and is worded the same
way every time. The bubble only says why or what to look at, and never holds anything needed to
answer the question.

### The bubble

- It comes from the lesson's character, with a tail pointing to the line of working it explains,
  in a colour kept for explainers in both themes.
- There is at most one bubble per line of working, and one idea per bubble.
- It is used on worked examples, the example in an example-and-try, the given steps of a faded
  example, the method card, Discover, and the line an Explore ends on.
- Hints and feedback stay in the answer bar at the bottom, which is already set apart.

```
  Find angle ACB. Give a reason.          ← what to do
  [diagram: 130° at O, ? at C]

  ACB = 130° ÷ 2 = 65°                    ← the working
  (angle at the centre is twice     ╭───────────────────────────────╮
   the angle at the circumference)  │ You need to state the angle   │ ← the explainer
                                  ◁─┤ and also give a reason why    │
                                    │ this is true.                 │
                                    ╰───────────────────────────────╯
```

### Word limits

These are measured on every new or redrafted lesson, and the tests hold them:

- **Instructions:** one sentence, at most 12 words. A real-life problem may take up to 25, in two
  short sentences. Given values go on the diagram, not in the words (part 1).
- **Bubbles:** at most 15 words.
- **A screen:** at most 40 words to read before the pupil can act, bubbles included.
- **Plain words:** short sentences, everyday words, and no idioms. Maths words are taught once, in
  Discover, and then used the same way every time. The target is a reading age of about 9.
- **Discover and the problem:** one or two short lines, with the picture doing the rest. Anything
  longer becomes a bubble or a picture.

Today 349 of the 5834 screens ask for more than 40 words before the pupil acts, and 501 of the
7560 questions are longer than 12 words. There are also 1043 steps of working whose single
"why" line mixes the written reason with the explanation. Each year batch fixes its own.

### In the player and the tests

- A step of working becomes its line, an optional written `reason` shown in the working, and an
  optional `note` shown in the bubble, in place of today's single `why`. A method card's step can
  carry a note too.
- The tests count words against the limits above. They check that a written reason uses the
  method's wording, and that a bubble repeats no value from its question.

### Rollout

The 11 pilot lessons are done first, in one PR, and go to pupils as before. After that, every
year batch in "How the work runs" applies these rules to its lessons along with the variation and
diagram work.

## How it fits the lesson plan

| Part                                   | With this proposal                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| The problem                            | a real diagram, as in an exam                                                                                                |
| Warm-up                                | recap, with a diagram where there is one                                                                                     |
| Discover                               | an **Explore** screen with Reflect, Expect, Check                                                                            |
| Method, example and try, faded example | as agreed, on diagrams                                                                                                       |
| Same method, different look            | diagrams that change one thing at a time (turned, moved, scaled), some answered by dragging                                  |
| Where's the answer?                    | the "?" moves round the diagram                                                                                              |
| Your turn                              | hands-on where it fits                                                                                                       |
| Watch out, Spot the mistake            | on diagrams                                                                                                                  |
| Exit check                             | diagram-first: every question in a diagram topic shows its diagram, answered by typing or choosing, so the check stays quick |

## How the work runs

1. **Diagrams and Explore** (one PR, then a short stop):
   - the diagram-first test;
   - the new picture kinds;
   - **Tap** and **Explore**;
   - the 11 pilot lessons upgraded. The circle theorems get no worded-only questions, exit checks
     with diagrams, an Explore screen in each lesson and Tap questions. The other five pilot
     lessons get diagram-first questions and an Explore screen.

   The owner tries them in teacher mode before more is built.

2. **The other answer screens** (one PR): Drag bars, Pie, Box plot, Table fill, Interval, Bar
   model, Venn drag, Tree fill, Move shape, Vector and Scale. Each is shown in use in at least one
   lesson.
3. **The years in order**, in the batches of the variation proposal:
   - Year 7: two PRs;
   - Year 8: one PR;
   - Year 9: one PR;
   - GCSE Foundation: four PRs;
   - GCSE Higher: one PR.

   Each batch now covers variation, diagram-first questions and hands-on answers together. Its
   PR lists, for every lesson:
   - the variation map;
   - which questions became diagrams;
   - which answers became hands-on.

   The appendix below is the starting plan for each unit.

The checks for every batch stay the same:

- lint, typecheck, tests and the data check pass;
- a script recomputes every number;
- every changed lesson is played through at phone size in light and dark mode, and its
  screenshots are looked at.

## The owner's answers

1. **Exit checks** stay quick to answer (typing or choosing), and every question in a diagram
   topic is diagram-first.
2. **Answer screens: be creative.** The owner has a separate site with many ways to interact,
   such as bar models that pupils colour in to show a fraction. The list in part 3 is a starting
   point, not a limit. Colouring in a bar model or a shape to show a fraction is added to it.
3. **Explore** comes before the method, and can be interleaved with questions where a topic works
   best that way.
4. **The pilot lessons go to pupils** each time they are improved. Redrafted lessons in the
   pilot are now shown to pupils as well as teachers.

## Appendix: the audit and plan for every unit

- "Drawn now" counts questions with a diagram today.
- "Worded, should be drawn" counts questions with no diagram whose words name a shape, angle,
  graph or chart.
- "Hands-on screens" counts screens answered by dragging, tapping a diagram, plotting and so on.

### Year 7

| Unit                                | Questions | Drawn now | Worded, should be drawn | Hands-on screens now | Plan                                                                                                                                      |
| ----------------------------------- | --------: | --------: | ----------------------: | -------------------: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Place value and ordering            |        57 |         7 |                       0 |             10 of 60 | Place on a number line; place value chart                                                                                                 |
| Algebra notation                    |        59 |         0 |                       3 |              4 of 56 | Function machine; area model for 3(x + 2)                                                                                                 |
| Calculating                         |        82 |         3 |                       0 |              2 of 75 | Bar models and number-line jumps; drag to split a bar                                                                                     |
| Lines, symmetry and measuring       |        61 |        14 |                      18 |              5 of 59 | Every angle and shape drawn; tap the right angle, the parallel sides, the line of symmetry; Dial to draw angles                           |
| Order of operations                 |        62 |         0 |                       1 |              0 of 56 | Build the calculation from chips (exists)                                                                                                 |
| Simplifying and substituting        |        58 |         0 |                       5 |              6 of 56 | Area model; sort like terms (exists)                                                                                                      |
| Factors, multiples and primes       |        58 |         1 |                       0 |              6 of 56 | Drag numbers into a Venn for HCF and LCM; factor tree (exists); arrays                                                                    |
| Angle facts                         |       107 |        64 |                      32 |              5 of 89 | Diagram-first; Explore: drag a line and watch the angles on it or round a point stay at 180° or 360°; tap the equal angle                 |
| Fractions, decimals and percentages |        58 |         7 |                       1 |              0 of 45 | Shade a hundred square (exists); a 0–100% bar to drag; Place on a number line                                                             |
| Sequences and equations             |        58 |         2 |                       0 |              6 of 56 | Balance (exists); bar models                                                                                                              |
| Powers and roots                    |        59 |         3 |                       5 |              4 of 58 | Squares and cubes drawn as arrays and cubes                                                                                               |
| Ratio                               |        94 |         2 |                       1 |              1 of 83 | Bar model: drag to split a bar in a ratio; ratio table to fill                                                                            |
| Units and measures                  |        46 |         0 |                       0 |              2 of 43 | Read and set scales by dragging a pointer; conversion number lines                                                                        |
| Perimeter, area and volume          |        93 |        14 |                      63 |              4 of 84 | Diagram-first for every shape; Explore: stretch a rectangle or triangle and watch its area; tap to split a compound shape; Morph (exists) |
| Rounding and estimating             |        64 |         0 |                       0 |              0 of 56 | Drag to the nearest mark on a number line                                                                                                 |
| Averages and range                  |        64 |         0 |                       0 |              0 of 56 | Explore: drag one value on a dot plot and watch the mean, median and range change; Drag bars                                              |
| Probability                         |        44 |         0 |                       0 |              4 of 42 | Place on the probability scale; Spin (exists); sample space grid (exists)                                                                 |

### Year 8

| Unit                                 | Questions | Drawn now | Worded, should be drawn | Hands-on screens now | Plan                                                                                                                              |
| ------------------------------------ | --------: | --------: | ----------------------: | -------------------: | --------------------------------------------------------------------------------------------------------------------------------- |
| Standard form                        |        48 |         0 |                       0 |              3 of 45 | Place on a number line of powers of ten                                                                                           |
| Expressions and sequences            |        61 |         0 |                       5 |              4 of 58 | Area model to expand and factorise                                                                                                |
| Circles and area                     |        58 |        16 |                      37 |              1 of 45 | Diagram-first; Explore: drag the radius and watch area and circumference; Morph (exists)                                          |
| Percentages                          |        63 |         0 |                       0 |              1 of 56 | Percentage bar to drag; multiplier number line                                                                                    |
| Formulae and equations               |        77 |         6 |                      12 |              5 of 71 | Balance (exists); Table fill                                                                                                      |
| Angles and shapes                    |        92 |        34 |                      47 |              4 of 87 | Diagram-first; Explore: drag a polygon's corner and watch the angle sum; tap alternate and corresponding angles on parallel lines |
| Coordinates and straight-line graphs |        84 |        31 |                      31 |             17 of 87 | Table fill, then Plot (exists); Drag line and Slider (exist); diagram-first                                                       |
| Ratio and proportion                 |        45 |         1 |                       9 |              1 of 41 | Bar model splitting; double number line                                                                                           |
| Scale drawings and constructions     |        75 |        10 |                      33 |              3 of 68 | Step-by-step constructions (exist); Dial for bearings from north                                                                  |
| Rates                                |        48 |         1 |                      11 |              0 of 42 | Draw the distance–time graph with Plot; read a rate off a graph                                                                   |
| Transformations                      |        39 |        11 |                       9 |              9 of 42 | Draw the image by Plot (exists); Move shape: drag, turn and flip onto the image                                                   |
| Data and probability                 |        89 |        35 |                      15 |              5 of 83 | Drag bars to draw bar charts; Pie: drag the slices; Plot a scatter graph and Drag line for the line of best fit; pictograms drawn |

### Year 9

| Unit                                    | Questions | Drawn now | Worded, should be drawn | Hands-on screens now | Plan                                                                                                         |
| --------------------------------------- | --------: | --------: | ----------------------: | -------------------: | ------------------------------------------------------------------------------------------------------------ |
| Standard form and indices               |        76 |         2 |                       2 |             14 of 80 | Arrays and number lines; little to draw                                                                      |
| Shapes, similarity and enlargement      |        75 |        25 |                      36 |              7 of 72 | Diagram-first; Explore: a scale slider that enlarges a shape and shows the length, area and volume factors   |
| Factorising and proof                   |        45 |         0 |                       0 |              6 of 46 | Area model                                                                                                   |
| Straight-line graphs                    |        81 |        10 |                      47 |              3 of 74 | Diagram-first graphs; Table fill; tap the intercept; Drag line                                               |
| Pythagoras and trigonometry             |       100 |        44 |                      47 |             13 of 94 | Label the sides (exists); Explore: drag the hypotenuse longer at a fixed angle and watch O ÷ H stay the same |
| Simultaneous equations and inequalities |        49 |         3 |                      26 |              2 of 45 | Plot both lines and tap where they cross; Balance for elimination                                            |
| Compound change and inverse proportion  |        50 |         2 |                       0 |              1 of 45 | Percentage bars; multiplier chains                                                                           |
| Graphs and sequences                    |        60 |        17 |                      12 |              7 of 60 | Plot curves from a Table fill; tap roots and the turning point                                               |
| Probability                             |        62 |        15 |                       4 |              4 of 58 | Venn: drag outcomes into regions; Tree fill: write probabilities on the branches                             |

### GCSE Foundation

| Unit                                       | Questions | Drawn now | Worded, should be drawn | Hands-on screens now | Plan                                                                                     |
| ------------------------------------------ | --------: | --------: | ----------------------: | -------------------: | ---------------------------------------------------------------------------------------- |
| Place value and calculation                |       124 |         0 |                       3 |             1 of 112 | Bar models; little to draw                                                               |
| Expressions                                |        79 |         0 |                       2 |              0 of 70 | Area model                                                                               |
| Formulae and substitution                  |        64 |         0 |                      18 |              0 of 56 | Function machine; substitution tables                                                    |
| Straight-line graphs and functions         |       106 |         0 |                      74 |              6 of 98 | Diagram-first for every graph question; Table fill; tap the gradient triangle; Drag line |
| 2D and 3D shapes                           |        95 |         4 |                      62 |              1 of 84 | Diagram-first; tap the faces, edges and vertices of a solid; nets that fold              |
| Coordinates and transformations            |        81 |        10 |                      18 |             15 of 84 | Move shape; Plot the image (exists); tap the centre of rotation                          |
| Congruence and similarity                  |        48 |         0 |                      23 |              0 of 42 | Diagram-first; Explore: scale slider                                                     |
| Angles                                     |        63 |        10 |                      45 |              1 of 56 | Diagram-first; Explore: parallel lines with a dragged transversal; tap the equal angles  |
| Factors, primes and listing                |        62 |         0 |                       1 |              2 of 56 | Venn drag; factor tree (exists)                                                          |
| Expanding and factorising                  |        64 |         0 |                       1 |              0 of 56 | Area model                                                                               |
| Fractions, decimals and percentages        |        48 |         0 |                       0 |              0 of 42 | Shade and percentage bars                                                                |
| Probability                                |        94 |         0 |                       3 |              2 of 84 | Frequency trees and two-way tables with gaps to fill; Spin (exists)                      |
| Powers, roots and surds                    |       112 |         0 |                      13 |              0 of 98 | Little to draw                                                                           |
| Equations                                  |        62 |         0 |                       9 |              2 of 56 | Balance (exists); bar models                                                             |
| Perimeter and area                         |        46 |         0 |                      39 |              2 of 42 | Diagram-first for every shape; Explore: drag a side and watch area and volume            |
| Ratio                                      |        90 |         6 |                       0 |              0 of 72 | Bar model splitting (pilot started)                                                      |
| Rounding, estimation and standard form     |       128 |         0 |                       6 |             0 of 112 | Drag to the nearest mark; bounds as an Interval on a number line                         |
| Sequences                                  |       111 |         0 |                       6 |              1 of 98 | Build the next pattern; Plot terms                                                       |
| Representing data and sampling             |       112 |         2 |                      30 |              0 of 98 | Drag bars; Pie; Plot and Drag line for scatter graphs; time series to plot               |
| Ratio problems                             |        64 |         0 |                      11 |              0 of 56 | Bar models; ratio tables                                                                 |
| Percentages                                |        64 |         0 |                       0 |              0 of 56 | Percentage bars                                                                          |
| Measures and units                         |        48 |         0 |                       0 |              0 of 42 | Scales to read and set; map scales on a drawn map                                        |
| Scale drawings, constructions and bearings |        93 |         1 |                      35 |              4 of 85 | Constructions step by step (exist); Dial for bearings; shade a locus                     |
| Simultaneous equations and inequalities    |        64 |         6 |                      23 |              0 of 56 | Plot both lines and tap the crossing                                                     |
| Averages, spread and correlation           |        95 |         3 |                      10 |              1 of 84 | Explore: drag a value and watch the averages; grouped tables to fill                     |
| Proportion                                 |        64 |         0 |                      14 |              0 of 56 | Plot proportion graphs; double number lines                                              |
| Circles                                    |       128 |         2 |                     111 |             0 of 112 | Diagram-first; Explore: drag the radius; Morph (exists)                                  |
| Quadratics                                 |        80 |        10 |                      47 |              0 of 70 | Table fill, then Plot; tap roots, intercept and turning point                            |
| Compound measures and rates                |        96 |         1 |                      30 |              0 of 84 | Distance–time graphs to draw; compound measure triangles                                 |
| Pythagoras and trigonometry                |        78 |         1 |                      36 |              2 of 70 | Label the sides; Explore the ratios; diagram-first                                       |
| Graphs of functions                        |        80 |         5 |                      35 |              0 of 70 | Table fill and Plot for cubic, reciprocal and real-life graphs                           |
| Growth, decay and interest                 |        48 |         0 |                       0 |              0 of 42 | Plot growth; Explore: a multiplier slider                                                |
| More probability                           |        80 |        18 |                       0 |              0 of 70 | Venn drag; Tree fill; sample spaces (exist)                                              |
| Proof and identities                       |        48 |         0 |                       0 |              0 of 42 | Little to draw                                                                           |
| Vectors                                    |        64 |         7 |                       9 |              0 of 56 | Drag the arrow to draw a vector on the grid                                              |

### GCSE Higher

| Unit                                  | Questions | Drawn now | Worded, should be drawn | Hands-on screens now | Plan                                                                                                             |
| ------------------------------------- | --------: | --------: | ----------------------: | -------------------: | ---------------------------------------------------------------------------------------------------------------- |
| Counting, powers and surds            |        96 |         1 |                       4 |              0 of 84 | Little to draw                                                                                                   |
| Expressions and proof                 |        96 |         0 |                       2 |              0 of 84 | Area model for three brackets                                                                                    |
| Transformations and similarity        |        48 |         4 |                      18 |              0 of 42 | Move shape, including negative enlargements; tap invariant points                                                |
| Recurring decimals and bounds         |        48 |         0 |                       2 |              0 of 42 | Bounds as an Interval                                                                                            |
| Functions, lines and quadratics       |        96 |         1 |                      26 |              0 of 84 | Plot; Explore: completing the square as a graph shift                                                            |
| Probability                           |        48 |        22 |                       0 |              0 of 42 | Tree fill; Venn; two-way tables                                                                                  |
| Equations, iteration and inequalities |        96 |        10 |                      22 |              0 of 84 | Shade regions for inequalities; Plot to solve graphically; iteration on a cobweb picture                         |
| Pythagoras and trigonometry           |        96 |         8 |                      53 |              0 of 84 | Diagram-first triangles; Explore: sine and cosine rules as a triangle is dragged                                 |
| Sequences and growth                  |        48 |         3 |                       0 |              0 of 42 | Plot terms                                                                                                       |
| Graphs of functions                   |       112 |        12 |                      54 |              0 of 98 | Explore: translate and reflect graphs with sliders; draw a tangent with Drag line; trapezia under a curve        |
| Proportion and rates of change        |        64 |         6 |                      24 |              0 of 56 | Plot; Explore: a k slider for y = kx² and y = k/x                                                                |
| Circles and vectors                   |       200 |       104 |                      78 |             0 of 138 | Diagram-first circle theorems with Explore (drag the point round the circle) and Tap; circle equations on a grid |
| Histograms and box plots              |        64 |        12 |                      13 |              0 of 56 | Drag bars for histograms; Plot cumulative frequency; Box plot to drag                                            |
