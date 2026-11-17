# Proposal: variation in the learning stage of every lesson

Status: **agreed on 17 November 2026**, with the owner's answers at the end. Building has started with the pilot. It covers the 398 split lessons
from Year 7 to GCSE Higher (`packages/learning/src/unit-lessons/`).

## In short

Every lesson keeps its shape: The problem, Warm-up, Discover, the learning stage, Watch out, Spot
the mistake, Back to the problem and Exit check. What changes is the **learning stage**, the part
where the pupil learns the method. Today that is one worked example, two "Together" questions and
two "Your turn" questions, and the variation between them is whatever the writer chose.

In the new learning stage, the pupil:

1. sees the **method** written once, in the same words every time it appears;
2. studies a worked example beside a near-identical question to try (an **example-problem pair**);
3. finishes a **faded example**, where the first steps are done and the pupil does the rest;
4. works through a **variation set**: one method, questions that look different, changing one
   thing at a time, with "Reflect, Expect, Check" at the key changes;
5. works through an **unknown set**: the same relationship with the answer moved to each part of
   the question in turn;
6. tries two questions alone, mixed, before Watch out.

The exit check then asks for the answer in different places too, so a pupil can't pass by
recognising one type of question.

The work is done in steps:

1. Small additions to the lesson player.
2. A pilot of five lessons for the owner to try.
3. A fixed review checklist.
4. The years in order, Year 7 to GCSE Higher, one or two PRs each.

## Why

### Variation theory

Pupils learn what matters in a question by seeing what changes and what stays the same. If every
example looks alike, they learn the look, not the maths. Two kinds of variation help.

- **Procedural variation** keeps the method fixed while the question changes. Questions vary in
  their numbers, units, context, wording, diagram and orientation, and in **which part is
  unknown**. Pupils see the many types of question they will meet, and that the same method
  answers them all.
- **Conceptual variation** shows the idea in different forms (a bar model, a diagram, words,
  symbols) and next to **non-examples**: things that look similar but are not the idea.

### Craig Barton's practice

Craig Barton's approach (in _Reflect, Expect, Check_ and _How I Wish I'd Taught Maths_) turns
this into classroom routines that suit an app.

- **Example-problem pairs.** A worked example sits beside a question that differs only in its
  numbers. The pupil copies the structure straight away, while the example is in view.
- **Intelligent practice.** Questions come in a deliberate order, changing one thing at a time.
  Before each answer the pupil **reflects** (what changed?), **expects** (what will that do to the
  answer?) and **checks** (was I right?). The questions become a chain of small predictions, not
  a list of separate sums.
- **Fading.** Steps are taken away one at a time (completing the last step, then the last two)
  until the pupil does the whole question.

### Where the answer is

Most relationships have three or more parts, and any one of them can be the question:

| Skill               | Relationship               | Each part as the unknown                                                           |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| Percentages         | part = percentage × whole  | find the part, the percentage or the whole                                         |
| Area of a rectangle | area = length × width      | find the area, or a missing side                                                   |
| Angles on a line    | a + b = 180°               | find either angle, or an angle written as $2x$                                     |
| Speed               | distance = speed × time    | find any one of the three                                                          |
| Ratio               | parts and the total        | share a total, or find the total or the other part from one part or the difference |
| SOH CAH TOA         | $\sin\theta = \frac{O}{H}$ | find O (multiply), H (divide) or $\theta$ (inverse)                                |
| Equations           | $3x + 5 = 20$              | the unknown on the left, on the right, or on both sides                            |

A pupil who has only met "find the part" often fails "find the whole", even though it is the
same relationship. Moving the unknown on purpose, with a picture that shows which box is
missing, teaches them to ask "**what am I given, and what is missing?**" before reaching for a
method.

### Weaker learners

The new learning stage helps pupils who find maths hard in four ways.

- **One method, worded the same everywhere.** The method card for, say, percentage change says
  the same thing in Year 8, GCSE Foundation and GCSE Higher.
- **Small steps, with the example in view.** The example stays on screen while the pupil does
  its twin. The faded example comes before the pupil does a whole question alone.
- **Changes that are easy to spot.** In a variation set, what changed is highlighted, so the
  pupil's attention goes to the thing that matters.
- **Help that points back.** "Show me the example" brings back the worked example, and a second
  wrong answer opens the method card at the step that went wrong.

## The new learning stage

### An example: percentages in Year 8

Today the lesson "What percentage is it?" has:

- a worked example (42 out of 60);
- two "Together" questions (£12 out of £80, and 50 cm out of 2 m);
- two "Your turn" questions.

Every question asks for the percentage, and that is the only position covered.

The new version:

| Screen        | Tag                         | What the pupil does                                                                                                                                                                                      |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method        | Method                      | Reads it: "Part ÷ whole, then × 100." It stays one tap away for the rest of the lesson.                                                                                                                  |
| Pair          | Example and try             | Sees 42 out of 60 = 70% worked; then does 36 out of 60 below it.                                                                                                                                         |
| Faded         | Finish it                   | £12 out of £80: the fraction and the division are done; the pupil turns 0.15 into 15%.                                                                                                                   |
| Variation set | Same method, different look | 12 out of 80 → 24 out of 80 (_expect: double_) → 24 out of 160 (_expect: half_) → 50 cm out of 2 m (units) → 3 of 12 squares shaded (picture) → "Ali got 42/60. What is that as a percentage?" (wording) |
| Unknown set   | Where's the answer?         | A bar model with the missing box marked: £12 of £80 is ?%, then 15% of £80 is £?, then £12 is 15% of £?.                                                                                                 |
| Your turn ×2  | Your turn                   | One "find the whole" and one in a new context, alone.                                                                                                                                                    |

The exit check has one question for each place the unknown can be, each with its retry.

### A second example: SOH CAH TOA in Year 9

- **Method:** "Label H, O and A. Pick the ratio with the two sides you know or want. Put the
  numbers in. Rearrange if the unknown is on the bottom."
- **Variation set:** the same triangle turned four ways; then the angle at the other corner, so
  O and A swap; then a ramp drawn as a picture.
- **Unknown set:**
  - O unknown: $O = H \sin\theta$, multiply;
  - H unknown: $H = \frac{O}{\sin\theta}$, divide;
  - $\theta$ unknown: inverse sine.

  Each is shown as "what's given, what's missing" before the working.

### Size

The learning stage grows from 5 screens to about 7. The variation set and the unknown set are
each **one screen holding a short sequence**, so lessons go from about 14 screens to about 16.

To keep lessons short for weaker pupils, the second Warm-up can go when the pair already recaps
it. This is question 1 for the owner.

## Changes to the lesson player

These are small and reusable. Each comes with tests in `unit-lessons.test.ts`.

1. **Method card.** A lesson gets `method: string[]` (two to four short steps). A "Method" button
   shows it on every learning-stage screen.
2. **Pair screen** (`pair`). A worked example (the existing `worked` steps) above a question in
   the same layout. On a phone the example folds to one line once the pupil starts answering, and
   unfolds with a tap.
3. **Faded steps.** `steps` stages can be marked `given`: shown done, not asked. The `fade`
   builder makes the faded version of a worked example.
4. **Set screen** (`set`). A short sequence of questions on one screen, each answered before the
   next appears, with earlier ones kept above. Each item can carry:
   - `changed`: the words to highlight;
   - `expect`: a prediction question asked before the answer, such as "Will the answer be
     bigger, smaller or the same?" or "Doubled?";
   - `asks`: which part of the relationship it asks for.

   After the pupil answers, the app says whether their prediction was right.

5. **Unknown picture.** A small "relationship" picture (a bar model, a formula triangle or a
   labelled shape) with the asked-for part shown as "?" and highlighted. It is drawn from the
   item's `asks`, so the "?" moves as the questions do.
6. **"Show me the example."** On learning-stage questions, a hint button that shows the lesson's
   worked example again.

The new screens follow the existing patterns: keyboard use, light and dark themes, phone width,
and KaTeX that keeps maths on one line. Nothing is stored beyond what lessons store now.

## A variation map for every skill

Before a lesson is rewritten, its skill gets a short **variation map** in the lesson file:

```ts
variation: {
  method: "percentage-of",        // a shared method card, the same in every year
  relationship: "part = percentage × whole",
  unknowns: ["part", "percentage", "whole"],
  surface: ["numbers", "units", "context", "picture", "wording"],
  nonExamples: ["percentage change (that's a different method)"],
}
```

- **Shared method cards** live in one file, `methods.ts`. Where a method returns in a later year
  (percentages in Y7, Y8, GF and GH), the later lesson reuses the card and adds to it, never
  rewords it.
- **Some skills have one natural unknown**, such as "simplify a surd". Their map gives the
  reversed question instead ("which surd simplifies to $3\sqrt2$?") or says "single position"
  with a reason, which the owner can see.
- **The test reads the map** and checks the lesson against it:
  - the variation set changes at least three different surface features;
  - the unknown set covers every listed unknown;
  - the exit check asks for at least two different unknowns when the map lists two or more.

## The review checklist

Every lesson is reviewed against the same list. It goes in the PR, with any lesson that falls
short named.

1. **Map:** the variation map is written and matches the skill's statement.
2. **Method:** one method, in the shared words, used in every learning-stage question.
3. **Pair:** the example and its twin differ only in their numbers, and the numbers are friendly.
4. **Fade:** the faded example leaves the pupil one or two steps, not the whole question.
5. **Variation set:** four to six items in a sensible order, changing one thing at a time, with
   the change highlighted. "Expect" is used at the two or three changes that teach something
   (doubling, halving, swapping a side). The numbers stay easy until the method is secure.
6. **Unknown set:** every unknown in the map, each with the picture showing what's missing.
7. **Your turn and exit check:** mixed positions and at least one new context. The exit check's
   retries move the unknown too.
8. **Non-example:** where the map lists one, "Watch out" or the variation set includes it ("this
   one looks the same but isn't").
9. **Weaker learners:** short sentences; no new idea in a question's wording; and a first wrong
   answer gets a hint that points back to the method step.
10. **Checks pass:**
    - the lesson tests;
    - a script that recomputes every numerical answer;
    - a play-through at 390 × 844 in light and dark mode, with the contact sheets looked at and
      anything cramped fixed.

## How the work runs

### Step 1: the player (one PR)

The method card, pair, faded steps, set screen, unknown picture, "Show me the example", the
`variation` map type and the new tests. The current lessons don't change in this step.

### Step 2: the pilot (one PR, then a stop)

Five lessons, chosen because the unknown moves in them most clearly:

1. Year 7, angles on a straight line (`y7-angles/half-turn`): find either angle, or $x$ when
   the angles are $2x$ and $x + 30$.
2. Year 7, percentages (`y7-fdp/percentages`): find the part, the percentage or the whole.
3. Year 8, the area of a circle (`y8-area/circle-area`): find the area, or the radius or
   diameter from the area.
4. Year 9, the sine ratio (`y9-trigonometry/sine`): find the opposite side or the hypotenuse,
   with the triangle turned different ways.
5. GCSE Foundation, sharing in a ratio (`gf-ratio-1/part-part`): share a total, or find the
   total or the other part from one part or from the difference.

They're published in teacher mode only, so the owner can try them on a phone before any pupil
sees them. **Work stops here for the owner's review**, and the template and checklist are
adjusted before going further.

### Step 3: the years, in order

| Batch           | Lessons | PRs                                                                 |
| --------------- | ------- | ------------------------------------------------------------------- |
| Year 7          | 72      | 2 (number and algebra, then geometry and statistics)                |
| Year 8          | 51      | 1                                                                   |
| Year 9          | 38      | 1                                                                   |
| GCSE Foundation | 176     | 4 (number, algebra, ratio and geometry, statistics and probability) |
| GCSE Higher     | 61      | 1                                                                   |

Year 7 goes first because its methods are the ones later years build on. For each batch:

1. **Write the maps for the whole batch first**, in a table in the PR description, so the owner
   can see the plan at a glance.
2. Rewrite the learning stages and exit checks against the checklist. Leave The problem,
   Discover, Watch out and Spot the mistake alone unless the review finds a fault in them.
3. Run the checks in item 10, then the full lint, typecheck, test and data check.
4. Open the PR. Its description includes the checklist, any lesson that falls short, and a few
   before and after screenshots.
5. Merge when CI is green, then confirm the change is live.

Each rewritten lesson keeps its id, so pupils who finished it keep their progress, and their
worked-example skips still apply.

## What this does not change

- **Practice questions.** These still come from the generators. A later step could check that
  each generator's depths also move the unknown. That's worth doing, but it's a separate piece of
  work.
- **Years 1 to 6.** They have no split lessons yet. When they get them, they'll be written to the
  new template from the start.
- **Pupil data.** Nothing is stored or sent beyond what lessons store now.

## The owner's answers

1. **Length.** About 16 screens is fine. The number of screens can vary: some lessons need more,
   some fewer.
2. **Reflect, Expect, Check.** Ask for a prediction only at the two or three changes that teach
   something.
3. **Pilot.** Start with the circle theorems, the hardest topic to teach, and do the five lessons
   above as well. The one Higher lesson that holds every theorem is split into smaller lessons,
   each with its own method, so a pupil meets one or two theorems at a time.
