# Proposal: Learn Maths, a Duolingo-style practice app for pupils

Status: **agreed on 29 October 2026.** Steps 1 to 6 are built: the course data with Year 7 as
the pilot section, then every other year: Years 1 to 9, GCSE Foundation and GCSE Higher (`data/course.txt`, `pnpm data:course`), the shared answer widgets
(`@mathsplanner/ui`), and the app with its path, progress, first visit, lessons, practice and
rewards (`apps/learn`, `pnpm learn`); steps 7 to 10 are to do.

## Why

The planner and the practice app are built for teachers: a teacher chooses statements and depths
and hands a link to the class. Pupils also need somewhere to practise on their own, a little and
often, that remembers what they have done, brings back what they are forgetting and makes coming
back each day feel good. Duolingo does this well for languages, and its shape suits maths: a
path of short lessons through the years, each skill revisited until it sticks, with streaks and
small rewards for practising.

MathsPlanner already has what such an app needs underneath: every statement from Year 1 to GCSE
split into single skills (the sub-statements), a generator for each that makes unlimited
questions at five depths, prerequisites linking them, 75 topics grouping them, marking that names
the misconception behind a wrong answer, and an input widget for every answer type. This
proposal is a new app on top of those, aimed at pupils.

The app is **Learn Maths** (`apps/learn`), at **learnmaths.jedhunt.co.uk**.

## Decisions

1. **Years 1 to 11.** The course runs from Year 1 to GCSE Foundation and Higher: about 790 skills
   in 11 sections. The early years are left out because they need an adult to read and count
   with the child, and A level is left out to begin with; both can be added later from the same
   data.
2. **Progress stays on the device.** XP, streaks and each skill's progress are kept in the
   browser. There are no accounts, no server and nothing about a pupil sent anywhere, so no
   children's personal data is held. A transfer code or file moves progress to another device.
   There are no leagues or friends, since these need a server.
3. **Its own subdomain**, learnmaths.jedhunt.co.uk, with its own look, built from this repository
   and published through a second GitHub repository (see [hosting](#hosting)).
4. **Teachers connect by link.** A teacher can send a link that sets a starting year, opens a
   unit or sets a mixed practice of chosen skills. A pupil can show or download a summary of
   their progress. There is no class dashboard.
5. **Practice over punishment.** There are no hearts or lives by default: a wrong answer gives the
   misconception feedback and the worked solution, and a fresh question on the same skill comes
   back later in the lesson. Pupils who like a challenge can turn on an optional **challenge
   mode** with hearts (below). Rewards are for practising (XP, streaks, badges), never for speed
   alone.
6. **The look is our own.** The app borrows Duolingo's mechanics, not its branding: its own
   mascot, colours, sounds and name.
7. **Mastery means depth 4 or 5.** As in the design document, a skill is only shown as mastered
   when a pupil succeeds at depth 4 or 5 with standard numbers.
8. **Year 7 is the pilot.** It is built, reviewed and tried with a class first; the other years
   follow as their generators are reviewed.
9. **Problems are reported through a simple form**, opened from any question with its key filled
   in (see [content quality](#content-quality)).
10. **No analytics.** No tracking, cookies or page counters of any kind.
11. **Dot is the mascot**: a round little character, a decimal point come to life, who changes
    into the shape of each topic's icon (a triangle for angles, a pie for fractions), so the
    mascot and the topic colours tell the same story. Dot's artwork, the logo and the colour
    scheme come from Dot, in step 6.

## How the course is built

| Duolingo     | Learn Maths                                                                           |
| ------------ | ------------------------------------------------------------------------------------- |
| Course       | Maths, Year 1 to GCSE                                                                 |
| Section      | A year: Year 1 to Year 9, then GCSE Foundation and GCSE Higher (11 sections)          |
| Unit         | 3 to 8 skills from one year, mostly one topic, e.g. _Year 7 · Angle facts_            |
| Path node    | A skill: a sub-statement, or a statement that has none                                |
| Skill levels | Up to five levels per skill, climbing through the depths and numbers settings (below) |
| Lesson       | About 8 questions, roughly 5 minutes                                                  |
| Unit review  | A mixed lesson at the end of each unit (the chest on the path)                        |
| Jump ahead   | A short test that unlocks a later unit or year                                        |
| Guidebook    | Each unit's worked examples, one per skill, from the generators' solutions            |

Sizes per section, from the current data:

| Section         | Statements | Skills | Topics |
| --------------- | ---------: | -----: | -----: |
| Year 1          |         21 |     44 |     10 |
| Year 2          |         33 |     62 |     12 |
| Year 3          |         33 |     61 |     13 |
| Year 4          |         42 |     65 |     18 |
| Year 5          |         47 |     80 |     18 |
| Year 6          |         48 |     72 |     26 |
| Year 7          |         31 |     72 |     19 |
| Year 8          |         26 |     51 |     20 |
| Year 9          |         19 |     35 |     16 |
| GCSE Foundation |         87 |    176 |     41 |
| GCSE Higher     |         40 |     61 |     27 |

**The path is a text file.** `data/course.txt`, in the same style as `topics.txt`, lists each
section, its units (each with a name and a topic) and their skills in the order they are learnt,
so a teacher can reorder, split, merge and rename units without code. `pnpm data:course` checks it
and writes `data/course.json` for the app. The checks: every skill of a section's year appears
exactly once, every unit holds 3 to 8 skills and has a known topic, and a skill comes after any
skill it needs in the same section (a prerequisite with sub-statements stands for all of them).

**New sections start from a draft.** `pnpm data:course --draft Y8 "Year 8"` prints a first draft:
a unit for each topic, topics ordered so that each comes after the topics it needs, any skill
moved after the skills it needs where topics depend on each other, large topics split, and small
units marked for merging. The draft is then tidied by hand.

**Year 7** has 17 units. It was drafted, then tidied so the strands alternate (number, algebra,
geometry, number…) rather than six number units in a row, and small topics were merged
(sequences with equations, volume with area, percentages with fractions and decimals):

| #   | Unit                                | Skills |
| --- | ----------------------------------- | -----: |
| 1   | Place value and ordering            |      4 |
| 2   | Algebra notation                    |      4 |
| 3   | Calculating                         |      5 |
| 4   | Lines, symmetry and measuring       |      4 |
| 5   | Order of operations                 |      4 |
| 6   | Simplifying and substituting        |      4 |
| 7   | Factors, multiples and primes       |      4 |
| 8   | Angle facts                         |      6 |
| 9   | Fractions, decimals and percentages |      3 |
| 10  | Sequences and equations             |      4 |
| 11  | Powers and roots                    |      4 |
| 12  | Ratio                               |      6 |
| 13  | Units and measures                  |      3 |
| 14  | Perimeter, area and volume          |      6 |
| 15  | Rounding and estimating             |      4 |
| 16  | Averages and range                  |      4 |
| 17  | Probability                         |      3 |

**GCSE Higher** has 13 units and 61 skills: the Higher-only statements, which
pupils meet after GCSE Foundation. Its draft had many one- and two-skill topics, merged by
strand:

| #   | Unit                                  | Skills |
| --- | ------------------------------------- | -----: |
| 1   | Counting, powers and surds            |      6 |
| 2   | Expressions and proof                 |      6 |
| 3   | Transformations and similarity        |      3 |
| 4   | Recurring decimals and bounds         |      3 |
| 5   | Functions, lines and quadratics       |      6 |
| 6   | Probability                           |      3 |
| 7   | Equations, iteration and inequalities |      6 |
| 8   | Pythagoras and trigonometry           |      6 |
| 9   | Sequences and growth                  |      3 |
| 10  | Graphs of functions                   |      7 |
| 11  | Proportion and rates of change        |      4 |
| 12  | Circles and vectors                   |      4 |
| 13  | Histograms and box plots              |      4 |

**GCSE Foundation** has 35 units and 176 skills. Strands alternate as in the other years; where
the statement data says a skill needs one in a later unit, that unit was moved earlier, which is
why straight-line graphs come before the shape units:

| #   | Unit                                       | Skills |
| --- | ------------------------------------------ | -----: |
| 1   | Place value and calculation                |      8 |
| 2   | Expressions                                |      5 |
| 3   | Formulae and substitution                  |      4 |
| 4   | Straight-line graphs and functions         |      7 |
| 5   | 2D and 3D shapes                           |      6 |
| 6   | Coordinates and transformations            |      6 |
| 7   | Congruence and similarity                  |      3 |
| 8   | Angles                                     |      4 |
| 9   | Factors, primes and listing                |      4 |
| 10  | Expanding and factorising                  |      4 |
| 11  | Fractions, decimals and percentages        |      3 |
| 12  | Probability                                |      6 |
| 13  | Powers, roots and surds                    |      7 |
| 14  | Equations                                  |      4 |
| 15  | Perimeter and area                         |      3 |
| 16  | Ratio                                      |      5 |
| 17  | Rounding, estimation and standard form     |      8 |
| 18  | Sequences                                  |      7 |
| 19  | Representing data and sampling             |      7 |
| 20  | Ratio problems                             |      4 |
| 21  | Percentages                                |      4 |
| 22  | Measures and units                         |      3 |
| 23  | Scale drawings, constructions and bearings |      6 |
| 24  | Simultaneous equations and inequalities    |      4 |
| 25  | Averages, spread and correlation           |      6 |
| 26  | Proportion                                 |      4 |
| 27  | Circles                                    |      8 |
| 28  | Quadratics                                 |      5 |
| 29  | Compound measures and rates                |      6 |
| 30  | Pythagoras and trigonometry                |      5 |
| 31  | Graphs of functions                        |      5 |
| 32  | Growth, decay and interest                 |      3 |
| 33  | More probability                           |      5 |
| 34  | Proof and identities                       |      3 |
| 35  | Vectors                                    |      4 |

**Year 8** has 12 units, drafted and tidied the same way. The statement data puts changing the
subject of a formula before solving harder equations, so formulae open that unit; nth terms join
expressions; and probability, which has one Year 8 skill, joins the data unit:

| #   | Unit                                 | Skills |
| --- | ------------------------------------ | -----: |
| 1   | Standard form                        |      3 |
| 2   | Expressions and sequences            |      4 |
| 3   | Circles and area                     |      3 |
| 4   | Percentages                          |      4 |
| 5   | Formulae and equations               |      5 |
| 6   | Angles and shapes                    |      6 |
| 7   | Coordinates and straight-line graphs |      6 |
| 8   | Ratio and proportion                 |      3 |
| 9   | Scale drawings and constructions     |      5 |
| 10  | Rates                                |      3 |
| 11  | Transformations                      |      3 |
| 12  | Data and probability                 |      6 |

Each new section also needs its reasoning questions varied (see `variety.test.ts`): Year 8's
generators gained three claims each, with different right answers, at depth 4.

**Year 9** has 9 units. Similar shapes come before Pythagoras and trigonometry, which the
statement data says need them, and small topics are merged (indices with standard form, inverse
proportion with compound change, inequalities with simultaneous equations):

| #   | Unit                                    | Skills |
| --- | --------------------------------------- | -----: |
| 1   | Standard form and indices               |      5 |
| 2   | Shapes, similarity and enlargement      |      5 |
| 3   | Factorising and proof                   |      3 |
| 4   | Straight-line graphs                    |      5 |
| 5   | Pythagoras and trigonometry             |      3 |
| 6   | Simultaneous equations and inequalities |      3 |
| 7   | Compound change and inverse proportion  |      3 |
| 8   | Graphs and sequences                    |      4 |
| 9   | Probability                             |      4 |

**Year 1** has 10 units and 44 skills. Turns come after fractions, since quarter turns need
quarters:

| #   | Unit                          | Skills |
| --- | ----------------------------- | -----: |
| 1   | Counting to 100               |      4 |
| 2   | Numbers to 20                 |      4 |
| 3   | Number bonds                  |      4 |
| 4   | Counting in 2s, 5s and 10s    |      3 |
| 5   | Comparing measures            |      4 |
| 6   | Adding and subtracting        |      5 |
| 7   | Groups, sharing and fractions |      5 |
| 8   | Shapes and position           |      5 |
| 9   | Measuring and money           |      5 |
| 10  | Time                          |      5 |

**Year 2** has 15 units and 62 skills. Written addition is split so that number facts and
adding tens and ones come before adding two 2-digit numbers and three 1-digit numbers:

| #   | Unit                       | Skills |
| --- | -------------------------- | -----: |
| 1   | Counting in steps          |      3 |
| 2   | Tens and ones              |      3 |
| 3   | Number facts               |      4 |
| 4   | 2D and 3D shapes           |      6 |
| 5   | Comparing numbers          |      3 |
| 6   | Adding and subtracting     |      5 |
| 7   | Times tables, odd and even |      4 |
| 8   | Patterns and turns         |      4 |
| 9   | Multiplying and dividing   |      4 |
| 10  | Fractions                  |      5 |
| 11  | Measuring                  |      4 |
| 12  | Comparing measures         |      3 |
| 13  | Money                      |      4 |
| 14  | Time                       |      4 |
| 15  | Charts and tables          |      6 |

**Year 3** has 14 units and 61 skills. Angles come before the unit on lines, as perpendicular
lines need right angles:

| #   | Unit                                | Skills |
| --- | ----------------------------------- | -----: |
| 1   | Place value                         |      5 |
| 2   | Counting in steps                   |      3 |
| 3   | Adding and subtracting in your head |      3 |
| 4   | Angles                              |      4 |
| 5   | Times tables                        |      4 |
| 6   | Shapes and lines                    |      4 |
| 7   | Written adding and subtracting      |      5 |
| 8   | Fractions                           |      4 |
| 9   | Multiplying and dividing            |      5 |
| 10  | Tenths and comparing fractions      |      5 |
| 11  | Length, mass, capacity and money    |      5 |
| 12  | Telling the time                    |      5 |
| 13  | Time facts                          |      4 |
| 14  | Charts and tables                   |      5 |

**Year 4** has 14 units and 65 skills. Rounding comes before written addition and subtraction,
which use it to estimate and check, and the times tables come before the written methods:

| #   | Unit                            | Skills |
| --- | ------------------------------- | -----: |
| 1   | Place value                     |      5 |
| 2   | Counting and negative numbers   |      4 |
| 3   | Rounding                        |      4 |
| 4   | Adding and subtracting          |      4 |
| 5   | Times tables                    |      6 |
| 6   | Shapes and symmetry             |      4 |
| 7   | Multiplying and dividing        |      6 |
| 8   | Fractions                       |      4 |
| 9   | Angles and coordinates          |      5 |
| 10  | Decimals                        |      7 |
| 11  | Comparing and rounding decimals |      3 |
| 12  | Measures, perimeter and area    |      6 |
| 13  | Time                            |      4 |
| 14  | Bar charts and time graphs      |      3 |

**Year 5** has 16 units and 80 skills. Fractions are split into two units, before and after the
shapes unit, so a pupil does not meet eleven fraction skills in a row:

| #   | Unit                               | Skills |
| --- | ---------------------------------- | -----: |
| 1   | Place value                        |      5 |
| 2   | Negative numbers and rounding      |      5 |
| 3   | Adding and subtracting             |      5 |
| 4   | Angles                             |      4 |
| 5   | Factors, multiples and primes      |      6 |
| 6   | Multiplying and dividing           |      5 |
| 7   | Squares, cubes and problems        |      3 |
| 8   | Fractions                          |      6 |
| 9   | Angles, shapes and transformations |      8 |
| 10  | Adding and multiplying fractions   |      4 |
| 11  | Decimals                           |      6 |
| 12  | Rounding decimals                  |      3 |
| 13  | Percentages                        |      4 |
| 14  | Perimeter, area and volume         |      7 |
| 15  | Measures and time                  |      6 |
| 16  | Line graphs and tables             |      3 |

**Year 6** has 15 units and 72 skills. Circles join the shapes unit, as naming the parts of a
circle needs drawing shapes first, and number units alternate with geometry and algebra:

| #   | Unit                                    | Skills |
| --- | --------------------------------------- | -----: |
| 1   | Place value and negative numbers        |      5 |
| 2   | Angles                                  |      3 |
| 3   | Multiplying and dividing                |      5 |
| 4   | Factors, primes and order of operations |      5 |
| 5   | Fractions                               |      5 |
| 6   | Coordinates and transformations         |      3 |
| 7   | Fractions, decimals and percentages     |      5 |
| 8   | Decimals                                |      4 |
| 9   | Shapes, angles and circles              |      8 |
| 10  | Rounding and problem solving            |      5 |
| 11  | Formulae, sequences and equations       |      5 |
| 12  | Ratio and percentages                   |      5 |
| 13  | Measures and converting units           |      5 |
| 14  | Area and volume                         |      6 |
| 15  | Pie charts, line graphs and the mean    |      3 |

Most primary generators are built from shared families or a parent statement's generator, so
their claims are added with `withClaims`, which leaves the shared definition alone.

**Skill levels.** Each skill climbs through up to five levels, using only the depths its
generator supports, so the levels come from the generators when the app runs rather than from
`course.json` (a skill with fewer depths has fewer levels):

| Level     | Questions                                                    | When                         |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| Learn     | Depth 1, friendly numbers, worked example first              | Always                       |
| Practise  | Depths 1 and 2, standard numbers                             | The generator has depth 2    |
| Picture   | Depth 3, standard numbers                                    | The generator has depth 3    |
| Reason    | Depth 4, standard numbers: the skill is mastered             | The generator has depth 4    |
| Legendary | Depth 5, or the deepest depth there is, with stretch numbers | Always, as an optional extra |

The levels before Reason move a pupil along the path; Reason is the gold "mastered" mark;
Legendary is for pupils who want more. Most Year 7 skills (69 of 72) have generators for depths
1, 2 and 4 only, so they climb Learn, Practise, Reason and Legendary, and two lessons finish a
skill on the path. Adding depth 3 and 5 questions to the sub-statement generators would give
them the Picture level and a true depth 5 Legendary, without any change to the app.

**Topics across the years.** Every topic has a colour and an icon, used on its units in the path,
so a pupil sees "fractions again" at a glance. A **Topics** tab shows each topic as its own
journey through the years (Fractions: Year 1 halves and quarters up to GCSE algebraic fractions)
with progress in each year, and a "practise this topic" button that mixes the pupil's completed
skills in that topic.

## The lesson

1. A new skill opens on a short worked example (the generator's solution, step by step) and a
   "try one with me" question.
2. About 6 questions on the skill at the level's depths, then 2 review questions from earlier
   skills that are due (below), interleaved rather than left to the end.
3. **Check** shows a green or red banner at the bottom: a right answer gets a short cheer; a
   wrong one gets the misconception feedback ("It looks like you added the tops and the
   bottoms") and a "show me how" button for the worked solution.
4. A wrong answer brings a fresh question on the same skill and depth (new numbers, not the same
   question again) back at the end of the lesson. The lesson ends when every one has been
   answered correctly once.
5. The end screen shows XP, accuracy, the streak and any badge, then the skill's progress on the
   path.

**Variety.** A skill practised again should not mean the same question with new numbers. Each
skill's reasoning questions (depth 4) come from a bank of claims with different right answers, in
true-or-false and always-sometimes-never forms, and the app prefers a form of question the pupil
has not seen in the lesson or lately on that skill. Before this, 69 of the 72 Year 7 skills asked
one claim at depth 4, with the same right answer every time. A test now keeps every skill on the
path to at least three forms, with no answer right more than 70% of the time.

Every question is made from a generator key (statement, depth, numbers, seed), so lessons are
deterministic, need no server, and a problem report can name the exact question.

## Practice and repetition

Practice is the heart of the app, so it has its own tab as well as being mixed into lessons.

- **Memory strength.** Each skill a pupil has started has a box from 1 to 6 with review gaps of
  1, 3, 7, 14, 30 and 60 days (a Leitner schedule). A right answer in review moves it up a box,
  a wrong one moves it down two. When its review is due, the skill's node on the path starts to
  fade, inviting a quick refresh.
- **Mistakes.** Misconceptions a pupil has shown are remembered by code. A "fix my mistakes"
  lesson sets questions whose distractors include those misconceptions, and where the
  misconception's `remediate` points to an earlier statement, that skill is added too: the
  stepping-back that the design document plans.
- **Practice hub.** One tap for a 5-minute mixed review of what is due; a topic practice; a
  "fix my mistakes" lesson; and a timed challenge on mastered skills, for fluency.
- **Unit and section reviews.** Each unit ends with a review lesson, and each section has a
  mixed test drawn the same way as the planner's year tests.

## Motivation, gently

- **XP**: 10 for a lesson, plus small bonuses for a perfect lesson and for reviews.
- **Daily goal** chosen at the start (1, 2, 3 or 5 lessons a day) and a **streak** of days the
  goal was met. A 7-day streak earns a streak freeze (up to 2 held), so one missed day does not
  wipe it out.
- **Badges** for milestones: first lesson, first mastered skill, a unit, a year, streaks of 7, 30
  and 100 days, a misconception fixed, a topic followed through every year.
- **Challenge mode**, off by default and switched on in settings: a lesson starts with 3 hearts,
  each wrong answer loses one, and losing all three ends the lesson early (the pupil can retry
  at once, never wait or pay). Finishing with hearts left earns double XP and counts towards a
  challenge badge. Hearts never affect progress through the path or the review schedule.
- **Dot** greets, cheers and nudges, taking the shape of the topic being practised, with a few
  short animations; sounds on by default
  with a mute switch, and all motion turned down for `prefers-reduced-motion`.
- **No ads, no purchases, no gems, no leagues.**

## First visit and moving around

1. A greeting from Dot, then a daily goal and **your year**.
2. Optionally take a **placement test** (about 15 questions, drawn like a year test from the
   previous year and this one) to start further along the path. Earlier sections are then marked
   "tested out", and are still open to practise.
3. Within a section the path is in order, but any unit can be reached with a short
   **jump-ahead** test, and a teacher's link opens its unit straight away. Pupils are never
   locked out of their own year's work.

## Teacher links and sharing progress

- **Links** that a teacher makes in the planner (a "share to Learn Maths" button next to a
  scheme's week or a homework) or by hand:
  - `#/start?year=Y7`: start a new pupil in a year;
  - `#/unit/y7-angles`: open a unit;
  - `#/set?skills=GF-A4.b,GF-A4.d&depths=1,2,4&count=10&title=Expanding`: a set practice, shown
    as a card at the top of the path ("From your teacher: Expanding") until it is done.
- **Progress summary**: a page a pupil can show, print or download as CSV, with skills started
  and mastered by year and topic, streak, and lesson history for the last few weeks. The pupil
  types their name only when printing or downloading; it is not stored.

## Under the bonnet

- **`apps/learn`**, a Vite, React and TypeScript app like the practice app, designed for phones
  first and then tablets and laptops.
- **Shared answer widgets.** The widgets, plot canvas and answer drafts move from
  `apps/practice` into a new package, `@mathsplanner/ui`, used by both apps, so a widget fix
  helps both. The bottom Check button and banner are Learn Maths' own.
- **The course data** is `data/course.json`, built by `pnpm data:course` (above), with its types
  (`CourseFile`, `CourseSection`, `CourseUnit`) in `@mathsplanner/core`.
- **Progress** is one versioned JSON object in local storage, changed only by pure, tested
  functions (start lesson, answer, finish lesson, review due), with a migration for each version
  so progress survives updates. Export and import as a file and as a short copyable code. The
  design keeps the door open for an optional sync later without changing the format.
- **Works offline and installs to the home screen** as a progressive web app: the generators run
  in the browser, so once loaded the app needs no connection. The generators are split by key
  stage and loaded when a section needs them, so a Year 7 pupil does not download GCSE.
- **Quality guard in CI**: every skill in the course has a generator and makes a lesson at every
  level across 50 seeds with no errors, and an end-to-end test plays a lesson at phone size with
  Playwright.
- **Accessibility**: large tap targets, keyboard use, screen-reader text for diagrams (already
  produced), good contrast in light and dark themes, and an optional dyslexia-friendly font.

## Hosting

GitHub Pages allows one custom domain per repository, and this one already serves
mathsplanner.jedhunt.co.uk, so Learn Maths is published through a second repository,
`huntj/learnmaths`, which holds only the built site. A workflow here (`learn.yml`) builds
`apps/learn` on every push to `main` and pushes the result to the `gh-pages` branch of that
repository, whose Pages then serves it. It was brought forward from step 9 so pupils could
play-test Year 7 early; the one-off set-up is in [deploy-learn-maths.md](../deploy-learn-maths.md):

1. **Create the repository** `huntj/learnmaths`, public (free GitHub Pages needs a public
   repository) and empty.
2. **Give this repository permission to push to it**: a deploy key with write access on
   `learnmaths`, and its private half as the `LEARN_DEPLOY_KEY` Actions secret here.
3. **Merge to `main`** and run the workflow once, so the `gh-pages` branch exists.
4. **Turn on Pages** in `learnmaths` from the `gh-pages` branch, with the custom domain
   `learnmaths.jedhunt.co.uk` and "Enforce HTTPS". The workflow writes a `CNAME` file so the
   domain survives each deploy.
5. **Add the DNS record at Fasthosts**: a `CNAME` record with host `learnmaths` pointing to
   `huntj.github.io`.
6. **Verify the domain with GitHub** (recommended), with a `TXT` record at Fasthosts.

Until the report-a-problem form (step 8), the You page has an "About this test version" card,
with a feedback link when the `LEARN_FEEDBACK_URL` repository variable is set.

## Content quality

All 686 statements have generators, but only 36 have a teacher review, and pupils working alone
are less likely than a teacher to notice a bad question. So:

- every question has a **report a problem** button that opens a simple form (a Google Form or
  similar) in a new tab, with the question's key and the app's version already filled in; the
  pupil picks what is wrong (the answer, the wording, the diagram, too hard, something else) and
  can add a comment. The form asks for no name or email, and nothing is sent from the app
  itself;
- sections are released as they are reviewed, starting with Year 7, and marked "beta" until then;
- the teacher review of Year 7's generators is planned into the steps below.

## Steps

0. **Agree this proposal.** **Done.**
1. **The course data**: `data/course.txt`, `pnpm data:course`, `data/course.json` and its checks,
   with Year 7's units tidied by hand. **Done.**
2. **Shared widgets**: move them into `@mathsplanner/ui` and switch the practice app over, with
   its tests still passing. **Done**: the widgets, plot canvas and drafts are in
   `packages/ui`, with their layout in `widgets.css`, which takes each app's colours.
3. **The app shell and path**: `apps/learn`, the section and unit path, the progress store with
   its tests, the first visit and settings. **Done**: Dot's welcome (year and daily goal), the
   path with units in their topic colours and each skill's levels as a ring, a sheet for each
   skill, the pupil's page with preferences, and example progress for a look around.
4. **The lesson**: building a lesson from a skill and level, check and banner, re-asking mistakes,
   worked examples and the end screen. **Done**: eight questions with two reviews mixed in, a
   "Show me" for a pupil who is stuck, and the misconceptions shown kept for step 5. The body
   font is Andika, chosen for young readers, whose zero has no slash to be mistaken for the empty
   set.
5. **Practice and repetition**: the review schedule, fading nodes, the practice hub, mistakes,
   unit and section reviews. **Done**: the Leitner schedule (`memory.ts`), due skills fading on
   the path with a "Refresh this skill" on their sheet, the Practise tab (a review of what is
   due, or extra practice; "Fix my mistakes", whose questions are chosen because they offer the
   pupil's own misconceptions as wrong answers; the open unit reviews; and how well the
   finished skills are remembered), unit reviews and a year review at the end of the path,
   with bonus XP the first time. Answer boxes gained keys for the minus sign, fraction bar,
   powers and roots, since phone number keyboards often lack a minus.
6. **Motivation**: XP, daily goal, streaks and freezes, badges, challenge mode, the timed
   challenge on mastered skills (moved here from the practice hub, as it is a challenge too),
   Dot's artwork and moments, the logo and colour scheme, and sounds. **Done**: streak freezes
   (one for every seven days of streak, two at most, spent on a missed day when the app next
   opens), sixteen badges, challenge mode (a heart lost for each wrong answer, double XP for
   finishing with one left, nothing lost for running out), a 90-second speed round on finished
   skills (which counts towards the daily goal with five right), sounds made in the browser, Dot
   in each topic family's shape, and the logo. The badge for following a topic through every
   year waits for more years in the course.
7. **Topics and placement**: the Topics tab with topic practice, topic colours on the path, the
   placement and jump-ahead tests.
8. **Teacher links and sharing**: the link routes, the "From your teacher" card, the progress
   summary and transfer code, the problem-report form, and a "share to Learn Maths" button in
   the planner.
9. **Offline and hosting**: the progressive web app, generators split by key stage, the deploy
   workflow, the second repository and the subdomain.
10. **Pilot** Year 7 with a class, alongside a teacher review of its 72 skills' generators, then
    tune lesson length, levels and the review schedule from what pupils and the teacher say,
    and release the other sections as they are reviewed.

Steps 2 to 4 make Year 7 playable; it is worth trying with pupils before steps 5 to 9 are
polished.

**Since play-testing began** (3 November 2026), the plan is:

- **Teacher mode. Done.** A switch on the You page, or "I’m a teacher" on the first screen, opens
  every skill, unit review and year review, and puts a Try button on each level of a skill, so a
  teacher can look through a year without unlocking it. A level tried this way counts as reached
  (never as a step back). The You page also lets anyone change year; progress in every year is
  kept.
- **Every year group. Done.** Years 1 to 9, GCSE Foundation and GCSE Higher are all on the path,
  each tidied into units with its reasoning questions varied (`withClaims` and `orClaims` in
  `shared/variety.ts`). Every skill on the path passes `variety.test.ts`.
- **Learning the idea first. Years 7 to 9 done.** A unit can open with a lesson, in the style
  of a Brilliant course: short screens where the pupil discovers the idea by doing, before the
  unit's skills, covering the unit's big idea and every skill in it. Every unit in Years 7, 8
  and 9 has one. Years 7 and 8 have been reviewed and are open to pupils; Year 9 is in teacher
  mode for review. Year 9's include the laws of indices found by writing powers out, enlarging
  shapes from a centre by tapping where their corners go, factorising as a number puzzle, a
  first proof, gradients from any two points, Pythagoras' squares and the fixed ratios behind
  sin, cos and tan, simultaneous equations as crossing lines, compound interest and inverse
  proportion, quadratic curves, and dice sample spaces shaded square by square. Lessons are data
  built from reusable screen kinds (`apps/learn/src/unit-lessons/`), so the next ones are
  mostly writing. Each shows only in teacher mode until it is reviewed, then its unit goes in
  `OPEN_TO_PUPILS`. Once a unit's lesson is done, its skills skip their worked examples.
- **Smaller lessons, through the unit. Years 7 to 9 done.** A unit's one lesson can be split into
  several, each sitting on the path just before the skill it teaches, and each teaching one idea
  in more depth. Every split lesson follows the same plan: a real problem the pupil can't solve
  yet; a warm-up of what it builds on; discovering the idea; a worked example shown a step at a
  time, one done together and some to try (I do, we do, you do); spotting the mistake in someone
  else's working; solving the opening problem; and an exit check, where a wrong answer comes back
  once more at the end with new numbers. The pilot splits three units: Year 7 angle facts (six
  lessons), Year 8 formulae and equations (five), and Year 9 Pythagoras and trigonometry (six:
  the longest side, a shorter side, sine, cosine, tangent, and working back to an angle). After
  review, the other units follow a year at a time. A finished lesson skips the worked examples
  of the skills it teaches. After the first review, each lesson builds up more slowly: every one
  works a second example together before the pupil goes alone, and the trigonometry lessons
  have the pupil label a triangle's sides H, O and A by tapping them (six times, turned
  different ways, before the sine ratio is used), with each worked step starting from the
  labels. **Year 9** is now split throughout: 38 lessons, one before each skill, open to pupils
  after review. Each starts from something quick the pupil can already do and builds the method
  up a step at a time, with real contexts (light years, a growing world population, a tin of
  soup, a tree's shadow, a ramp, gym prices, savings, a car's value, a thrown ball, a dice
  game), and names its common mistakes twice: a "Watch out" question that puts the mistake to
  the pupil, and a "Spot the mistake" in someone's working. **Years 7 and 8** are split the same
  way and replace their single lessons for pupils straight away: 72 lessons across Year 7's 17
  units and 51 across Year 8's 12, one before each skill, with contexts such as the coldest city,
  a diver below sea level, a recipe for six, a bike wheel, a level crossing, a treasure map, two taxi fares,
  a round rug and a real gold ring. The two pilot units, Year 7 angle facts and Year 8 formulae
  and equations, now have a "Watch out" question in every lesson too.
- **Question previews** (later): from a skill's sheet, see one question at each level without
  starting a lesson.
