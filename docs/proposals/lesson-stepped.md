# Proposal: the stepped lesson template

Status: **agreed on 21 November 2026**, with the owner's answers below. The owner reviewed the
five other pilot lessons on 22 November 2026 and approved the template for every lesson. The owner designed this plan for "The angle
in a semicircle" (GCSE Higher, `gh-circles/semicircle`), reviewed it live and asked for it to be
summarised as a template of principles for the other lessons. The six circle theorem lessons and
the five other pilot lessons use it (rollout steps 1 and 2 below).

It is simpler than the unit plan (The problem, Warm-up, Discover… Exit check), and it is written
for weaker readers. It keeps everything already agreed:

- variation ([proposal](lesson-variation.md));
- diagrams first, Explore and hands-on answers ([proposal](lesson-interactive.md));
- few words, with Dot's bubbles (part 4 of that proposal).

## The parts

Every lesson has the same parts, in this order: seven always, and a real-life problem where one fits. Each part has a job, a set of screens to do
it with, and principles that keep it short and clear.

### 1. The rule

**Job:** show the one thing the lesson teaches before anything else, so the pupil knows where it
is going.

- **One screen with the rule.**
  - The rule is a single bold sentence of 12 words or fewer, on a diagram that shows it with
    everything labelled, the angles that aren't part of the rule too.
  - Dot's bubble adds the one condition that matters ("AB is a diameter").
- **Then an Explore** where the pupil drags the diagram and watches the rule hold.
  - Every part is labelled live, with the values in readouts underneath.
  - There is no prediction first: the pupil explores straight away, then is asked "What did
    you notice?".
- **Drags stop before the diagram degenerates**, for example before two points meet or an angle
  gets thinner than about 20°, so labels always have room.
- For a topic without a diagram, the rule is the key fact or relationship, such as
  "part = percentage × whole". The Explore is a slider, a hundred square, or a number to slide
  along a number line, watching what it rounds to or becomes.

### 2. Check you remember

**Job:** check the two or three things the method needs, so a gap shows before it gets in the way.

- One quick screen for each thing: tap, choose or type, on a diagram where there is one.
- They check only what the pupil knew before the lesson. Nothing that needs the lesson's new
  idea comes here: a question like "Is ABCD a cyclic quadrilateral?" belongs at the end.
- They are exactly the prerequisites of the method's steps, and no more. For the semicircle:
  - which line is the diameter;
  - what a triangle's angles add up to;
  - a missing angle in a right-angled triangle.
- A wrong answer gets Dot's hint, which names the fact.

### 3. The method

**Job:** show how to do it, then let the pupil do it with every step scaffolded.

- **The method card:** two to four steps, each one short line. The same words are used
  everywhere the method appears, and the Method button brings it back.
- **Watch the method:** a worked example revealed a line at a time.
  - Each line shows the maths, and the written reason in brackets, worded from the shared list.
  - Dot's bubble on a line explains it, and never holds what is needed to answer.
- **Your turn:** the same kind of question on a calc screen, where the pupil types the answer on
  each line in turn ("90° + 25° = ☐", then "180° − 115° = ☐"). The first one can give the fact
  from the rule on the diagram (C marked 90°).

### 4. Practise

**Job:** repeat the method until it is automatic, then move the missing value.

- **One more calc screen** with every line to type, including the line that uses the rule
  ("ACB = ☐", then the reason).
- **A tap round**, where it helps to spot the parts quickly: the same tap question on three or
  four diagrams of different shapes, one at a time, such as "Tap two opposite angles" on
  cyclic quadrilaterals of every shape. Where more than one answer is right, any of them is
  accepted.
- **A set of four to six short questions** with the same method each time:
  - the missing value moves round the diagram (B, then A, then C), and each move is pointed out
    in "What's changed";
  - turned and reflected diagrams come in here too;
  - each question is on its diagram, with the values on the diagram and only "Find …" in words.

### 5. Variation

**Job:** show the same rule in the new looks pupils will meet in exams.

- Three or four questions, each a different look:
  - algebra (x and 2x);
  - a combined diagram (two triangles on one diameter);
  - a context;
  - the rule as one step of a longer problem;
  - a non-example, where the rule doesn't apply.
- Each is pointed out in "What's changed".
- **Where a change is to predict** ("the angle goes up by 10°: what happens to the other?"),
  the diagram before the change sits beside the one now, and the change and the question come
  just above the choices.
- **Spot the mistake:** someone else's working, set out in their exercise book with their name
  on it, one line wrong. The pupil taps the wrong line. It looks like a pupil's book, so it is
  never mistaken for answers to choose from.

### 6. Exit check

**Job:** show which pupils need the lesson again.

- Two or three questions, with no hints, and quick to answer (typing or choosing).
- Each is on its diagram, and they ask for different unknowns.
- A wrong answer comes back at the end with new numbers.

### 7. A real-life problem (where one fits)

**Job:** use the rule in the world, once the pupil can do it.

- One problem pupils recognise, after the exit check, such as the laptop screen at 110° for
  angles on a straight line.
- It is left out where the topic has no honest real-life use, as for circle theorems.

### 8. Summary

**Job:** finish on what to remember, and give the pupil something to keep.

- The rule in bold, and the diagram with every value marked.
- **"Write this in your book":** a ruled card with:
  - the rule;
  - what to draw;
  - the method in one sentence;
  - a worked example with its reasons, as the pupil would set it out in their book.
- Dot's bubble says to copy it into their book.

## Principles for every part

- **Diagrams first.** Any question about a shape, angle, graph or chart is asked on its diagram,
  with the given values on the diagram and only what to find in words.
- **Think of a visual first, everywhere.** For every question, ask first whether a picture would
  help: a number line, a place value chart, a bar model, a hundred square, a balance. Not every
  question needs one, and a question in words is fine when a picture would add nothing.
- **Few words.**
  - Questions of 12 words or fewer.
  - Dot's bubbles and hints of 15 words or fewer.
  - At most 40 words to read before the pupil acts.
  - A reading age of 9 to 10.
- **Three kinds of words, kept apart.**
  - What to do: the question.
  - The working: the maths, with the written reason in brackets.
  - Explainers and hints: from Dot, in a bubble.
- **Reasons from one list.** Written reasons come from `REASON` in `unit-lessons/reasons.ts`,
  worded the same in every lesson. A new reason is added there.
- **One rule per lesson.** If a lesson needs two rules, it is two lessons.
- **Labels stay with their angles.** Each angle's value sits by its own arc, and every arc on a
  diagram has the same radius. No name sits on a line, and a drag stops before labels have no
  room.
- **Checked in a browser.** Every lesson is played through at 390 × 844 in light and dark mode,
  and every Explore is dragged to both ends of its range.

## Writing a lesson from the template

Before any screens, write a short plan for the lesson. The tests and the review check the lesson
against it.

| Plan item      | For "The angle in a semicircle"                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| The rule       | The angle in a semicircle is 90°.                                                                              |
| Explore        | Drag C round the circle; watch angles C, A and B.                                                              |
| Prerequisites  | Spot the diameter; angles in a triangle add up to 180°; missing angle in a right-angled triangle.              |
| Method         | Angle C is 90°. Add the two angles you know. Take the total away from 180°.                                    |
| Reasons        | angle in a semicircle is 90°; angles in a triangle add up to 180°.                                             |
| Where it moves | The missing angle at B, at A, at C.                                                                            |
| Variations     | x and 2x; x and 4x; two triangles on one diameter.                                                             |
| Book notes     | The rule; draw the circle, diameter AB and point C; add the two you know and take from 180°; a worked example. |

## In the code and the tests

- A lesson on this plan sets `plan: "stepped"`. Its screens are tagged with the parts:
  - The rule;
  - Check you remember;
  - Method, Worked example and Your turn;
  - Practise;
  - Variation;
  - Exit check;
  - Real life (where it fits);
  - Summary.
- The tests check:
  - the parts, in order, with only the real-life problem optional;
  - a summary with book notes;
  - a calc screen;
  - at least three changes pointed out;
  - every unknown on the variation map asked;
  - the word limits;
  - the diagram-first rules;
  - reasons from the shared list.
- The new pieces are the **calc** screen (`calc-screen.tsx`) and the **book** card on a summary.

## Rollout

1. **The rest of the circle theorems** (five lessons), one PR, to check the template on a whole
   unit. Then the owner reviews.
2. **The other pilot lessons:** angles on a straight line (Y7), percentages (Y7), circle area (Y8),
   the sine ratio (Y9) and sharing in a ratio (GCSE Foundation). These test the template on
   number, algebra and trigonometry. Each has a real-life problem after its exit check: the laptop
   screen, the best test score, the round rug, the kite string and the shared prize.
3. **Year by year**, Year 7 to GCSE Higher, in the batches already agreed. Each batch's PR lists
   every lesson's plan (the table above). The batches go in smaller PRs of two or three units,
   so each one is live, and can be reviewed, sooner. Year 7 is done: all 72 lessons are on
   the template. Year 8 is done too: all 51 lessons, and Year 9: all 38. Number and algebra questions are marked
   words-only with a reason; geometry, graphs and charts ask every question on its picture.

## The owner's answers

1. **Exit check:** yes, a short check before the summary.
2. **The real-life problem** comes at the end, after the exit check, where it fits. It won't always
   apply, as for circle theorems.
3. **The order of rollout** above is right.
4. **The prerequisites** checked in the five pilot lessons are good and correct.
5. **Visuals:** not every question needs one, but a visual is always thought of first.
6. **The template** is good to expand to every other lesson.
