# Proposal: Learn Maths, a Duolingo-style practice app for pupils

Status: **agreed on 29 October 2026.** Steps 1 and 2 are built: the course data with Year 7 as
the pilot section (`data/course.txt`, `pnpm data:course`) and the shared answer widgets
(`@mathsplanner/ui`); steps 3 to 10 are to do.

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

**Skill levels.** Each skill climbs through up to five levels, using only the depths its
generator supports, so the levels come from the generators when the app runs rather than from
`course.json` (a skill with fewer depths has fewer levels):

| Level | Name      | Questions                                        |
| ----: | --------- | ------------------------------------------------ |
|     1 | Learn     | Depth 1, friendly numbers, worked example first  |
|     2 | Practise  | Depths 1 and 2, standard numbers                 |
|     3 | Picture   | Depths 2 and 3, standard numbers                 |
|     4 | Reason    | Depth 4, standard numbers: the skill is mastered |
|     5 | Legendary | Depth 5 and stretch numbers: an optional extra   |

Levels 1 to 3 move a pupil along the path; level 4 is the gold "mastered" mark; level 5 is for
pupils who want more.

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
`apps/learn` on every push to `main` and pushes the result to that repository, whose Pages then
serves it. The one-off set-up, done at step 9:

1. **Create the repository** `huntj/learnmaths`, public (free GitHub Pages needs a public
   repository) and empty.
2. **Give this repository permission to push to it.** Make an SSH key pair; add the public key to
   `learnmaths` under Settings → Deploy keys, with write access; add the private key to
   `mathsplanner` under Settings → Secrets and variables → Actions, as `LEARN_DEPLOY_KEY`.
3. **Turn on Pages** in `learnmaths` (Settings → Pages: deploy from the `main` branch), set the
   custom domain to `learnmaths.jedhunt.co.uk`, and tick "Enforce HTTPS" once the certificate is
   issued. The workflow also writes a `CNAME` file so the domain survives each deploy.
4. **Add the DNS record at Fasthosts**: in the jedhunt.co.uk DNS settings, a `CNAME` record with
   host `learnmaths` pointing to `huntj.github.io`. Changes can take a few hours to spread.
5. **Verify the domain with GitHub** (recommended): GitHub account Settings → Pages → Add a domain
   gives a `TXT` record to add at Fasthosts, which stops anyone else's repository claiming a
   jedhunt.co.uk subdomain.

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
   its tests, the first visit and settings.
4. **The lesson**: building a lesson from a skill and level, check and banner, re-asking mistakes,
   worked examples and the end screen.
5. **Practice and repetition**: the review schedule, fading nodes, the practice hub, mistakes,
   unit and section reviews.
6. **Motivation**: XP, daily goal, streaks and freezes, badges, challenge mode, Dot's artwork
   and moments, the logo and colour scheme, and sounds.
7. **Topics and placement**: the Topics tab, topic colours on the path, the placement and
   jump-ahead tests.
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
