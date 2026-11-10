# Proposal: Maths City, a city-building version of Learn Maths

Status: **agreed on 10 November 2026.** Nothing is built yet. This answers the
[brief](city-game-brief.md); the first playable version is planned at the end.

## In short

Maths City is a second way to play the Learn Maths course. The pupil's year is a map. Each unit
is a **zone** with one outcrop of raw material for each skill. To work an outcrop the pupil puts
a **machine** beside it, and the price of the machine is the skill's lesson. Finishing any lesson
**powers** every machine for half an hour, and what the machines make pays for homes, shops,
parks and, in time, monuments. Nothing is made without practising, and nothing a pupil has built
is ever taken away.

It is a new app, `apps/city`, published beside Learn Maths on the same site. The two apps share
one learning record, so a skill learnt in either counts in both. The generators, course data,
marking, lessons and lesson screens are shared through workspace packages, not copied.

## The owner's aims, and how the design meets them

1. **It paces itself to the pupil.** Questions come at the level the pupil has reached on each
   skill. A lesson cannot be failed: a wrong answer gets its feedback and comes back with new
   numbers. Prices rise only as the pupil's own city grows, so at every stage a lesson buys about
   one new building, for a pupil on their third skill or their seventieth.
2. **Effort shows.** Every finished lesson pays, whatever the pupil's accuracy or speed. Each
   year's city is kept for good. Landmarks reward lessons done and days practised; monuments
   reward mastery, which here means finishing a skill's deeper levels, so every pupil can reach
   them.
3. **The lessons stay.** A machine cannot be built any other way: the skill's lesson, with its
   exit check, is what brings it to life. It is the most rewarding thing a pupil can do in the
   game.

## Decided with the owner

- **Same site, shared progress.** The game is published at `learnmaths.jedhunt.co.uk/city/` and
  shares Learn Maths' learning record.
- **A city per year, kept.** Each year is its own map and economy. Finished cities stay in an
  atlas, and each year's monument is carried into the next.
- **Lessons power the city.** Machines run only on power, and power comes only from lessons.
- **Place value first.** Year 7's first unit is the zone in the first playable version.

## Where the brief and the aims pull apart

| The brief                                                  | The trouble                                                                               | Recommended                                                                                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| A fresh world each year                                    | Aim 2: last year's grand city is left behind                                              | A city per year, all kept in an atlas and still growing through reviews, with each year's monument carried forward                     |
| Machines produce every second, always                      | Leaving the game open would beat practising                                               | Each finished lesson runs every machine for 30 minutes of real time. No lesson, no production                                          |
| Production "accelerates dramatically" with mastery         | Aims 1 and 2: a city's size would follow attainment, not effort                           | Gentle tiers, from 2 a minute to 8. Income grows mostly with the number of machines. Nothing that is bought makes machines faster      |
| Mastery tracked by accuracy streaks and diagnostic tests   | Aim 1: a streak punishes the pupil who finds it hard, and is lost in one slip             | Keep Learn Maths' levels: a level is reached by finishing its lesson. The unit review is the zone's test                               |
| A lesson, then question sets, before the machine is active | Aim 3: the lesson is only a hurdle. The first reward is ten minutes away                  | The lesson alone brings the machine to life. Question sets are its upgrades                                                            |
| Buildings placed freely                                    | Phones, keyboards and old Chromebooks                                                     | A free choice of square on a grid                                                                                                      |
| Its own site and subdomain                                 | A browser keeps each site's storage apart, so the game could not see Learn Maths progress | A folder of the Learn Maths site. No new repository, key or DNS record                                                                 |
| A machine slows down when its review is due                | "Practice over punishment"                                                                | The same sums, said kindly: a machine checked on time runs **tuned**, half as fast again. A machine that is due runs at its plain rate |
| Monuments come only from mastery                           | Aim 2: effort alone should also earn something grand                                      | Monuments from mastery and **landmarks** from effort                                                                                   |

## How the game maps to what exists

The brief's mapping holds, with three changes: the lesson builds the machine, power is new, and
upkeep is a bonus.

| In the game             | In the repository                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| A year's city           | A course section in `data/course.json`, on a map seeded for the pupil and year            |
| A zone and its material | A unit. Its topic family (`families.ts`) gives the material and the zone's colour         |
| An outcrop              | A skill                                                                                   |
| Building a machine      | The skill's unit lesson, ending in its exit check                                         |
| Upgrading a machine     | A lesson of eight generated questions at the skill's next level (`planLesson`)            |
| A machine's tier        | The skill's level: Learn, Practise, Picture, Reason (mastered), Legendary (`skillLevels`) |
| A tune-up               | A review of skills that are due (`memory.ts`, `reviewPlan`)                               |
| A repair job            | "Fix my mistakes" (`mistakesPlan`)                                                        |
| The zone's survey       | The unit review. The year review is the survey of the whole city                          |
| Power                   | New: 30 minutes for each lesson finished                                                  |
| The learning record     | `Progress`, as now, under the same storage key                                            |
| The city's save         | New: where things are, what is in stock and how much power is left                        |

A machine's tier is never saved. It is read from the learning record each time, so the city can
never disagree with what the pupil has learnt.

## 1. The core loop

Every session is the same four beats: **learn** (a lesson, a question set or a tune-up),
**power** (the machines run), **collect** (materials come in) and **build**.

### The first ten minutes

| Time  | What the pupil does                                                                                                                                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00  | Dot says hello and asks for the pupil's year (skipped if Learn Maths already knows it). The map appears: a camp, a small meadow and four grey outcrops. One of them glows.                                                         |
| 0:30  | They tap the glowing outcrop. A sheet slides up: "Stone. Build a quarry here to dig it. Lesson: What's it worth?" They choose one of the lit squares beside the outcrop, scaffolding goes up, and they press **Start the lesson**. |
| 1:00  | The unit lesson plays, as in Learn Maths: a house price to read, a warm-up, the place value chart, a worked example, their turn, a mistake to spot, and the exit check.                                                            |
| 6:00  | Back on the map the scaffolding falls away and the quarry starts work. A crate of 60 stone arrives, the power dial shows 30 minutes, and the stone counter ticks up by 2 a minute.                                                 |
| 6:30  | Dot points at the Build button. A cottage costs 40 stone. They pick a square, and the city has its first home and its first rank: **hamlet**.                                                                                      |
| 7:00  | They tap the quarry: "Upgrade: answer 8 questions." The Learn level plays, with friendly numbers.                                                                                                                                  |
| 10:00 | The quarry grows a crane and makes 3 a minute. Another crate arrives, power is back near an hour, and there is stone for a second cottage and a path. The quarry offers its next upgrade, which will open the second outcrop.      |

In ten minutes the pupil has done one lesson and one question set, about the same learning as ten
minutes of Learn Maths, and has a working quarry and the start of a village.

### The fiftieth hour

By now Year 7 is nearly done: about 70 machines, most of them gold, and about 500 buildings. The
pupil opens the game after a weekend away.

1. **While you were away.** The machines ran for the 50 minutes of power that were left: 31,000
   materials are waiting. Nothing was lost by staying away; the machines just stopped when the
   power ran out.
2. **Tune-ups.** Five machines have a spanner on them: their skills are due for review. One
   tune-up (eight mixed questions on the skills most overdue) puts four of them back to tuned,
   and adds 30 minutes of power.
3. **A repair job.** Dot has noticed a mistake that keeps coming back, such as adding the tops
   and the bottoms of fractions. "Fix my mistakes" sets questions aimed at it.
4. **Something new.** The last zone, Probability, has one outcrop left. Its lesson builds the
   seventy-second machine.
5. **Gold.** A Legendary set on a favourite skill gilds its machine and earns a statue.
6. **Build.** A lesson now earns about 24,000 materials. The pupil swaps a street of cottages for
   townhouses, lays a park beside the Angle facts monument, and is two thirds of the way to the
   year's monument, which will stand in their Year 8 city too.

A session is still short lessons, each followed by something to spend. What has changed is the
size of the city and the mix: less new work, more review and deeper levels.

### What opens what

- **Within a zone**, outcrops open in course order. The next one opens when the skill before it
  is finished, by the same rule as Learn Maths' path, so the two apps always agree.
- **The next zone** is surveyed when the zone before it is finished. A teacher's link can open any
  zone at once.
- **A skill already learnt in Learn Maths** has no lesson to do: its outcrop says "Ready to
  build", and the machine goes up at the tier the pupil has earned.
- **A skill with no unit lesson** (years whose lessons are not yet written) is built by its first
  question set, which opens on a worked example, as in Learn Maths.

## 2. The economy

A small economy, met one piece at a time.

### Materials

There are four raw materials, one for each strand. A year's zones bring them in one at a time: in
Year 7, stone from the first unit, ore from the second, timber from the fourth and sand from the
twelfth, which gives the late game something new to build with.

| Material | Strand                            | Machine     | Year 7 skills |
| -------- | --------------------------------- | ----------- | ------------: |
| Stone    | Number, calculation and fractions | Quarry      |            28 |
| Ore      | Algebra                           | Mine        |            12 |
| Timber   | Geometry and measures             | Timber yard |            19 |
| Sand     | Ratio, statistics and probability | Sand pit    |            13 |

### Machines

A machine costs no materials. Its price is its lesson. Its rate depends only on the skill's level:

| The skill has reached       | A minute | Looks like                     |
| --------------------------- | -------: | ------------------------------ |
| Lesson done                 |        2 | A hand-worked site             |
| Learn                       |        3 | A crane                        |
| Practise                    |        4 | An engine house                |
| Picture (where a skill has) |        5 | A conveyor                     |
| Reason: mastered            |        6 | A full works, with a gold roof |
| Legendary                   |        8 | Gilded, with a flag            |

A finished skill is in the review schedule (after 1, 3, 7, 14, 30 and 60 days). While its review
is not due, its machine runs **tuned**, half as fast again: 6, 9 and 12 a minute for Practise,
Reason and Legendary. When the review falls due, the machine goes back to its plain rate and
shows a spanner until a tune-up.

### Power and crates

- **A finished lesson adds 30 minutes of power**: a unit lesson, a question set, a tune-up, a
  unit review or a repair job. A short refresh of one skill (six questions) adds 20.
- **Power runs down in real time**, whether the game is open or closed, and every machine works
  while there is any. There is no limit on how much can be saved up, and it never expires, so a
  pupil who does six lessons in one sitting gets all three hours.
- **Each lesson also pays a crate at once**: ten minutes of the city's output, and never less
  than 60.

So a lesson is worth 40 minutes of the city's output, a quarter of it straight away. Nothing else
makes materials. Leaving the game open earns nothing once the power has gone, and changing the
device's clock earns nothing either.

### Workshops and components

Three workshops turn raw materials into components for larger buildings. A workshop is bought
once and placed anywhere. While the city has power it converts by itself, 6 components a minute,
and can be switched off.

| Workshop     | Makes  | From               |
| ------------ | ------ | ------------------ |
| Mason's Yard | Blocks | 10 stone           |
| Frame Works  | Frames | 6 timber and 4 ore |
| Glassworks   | Panes  | 10 sand            |

### What there is to build

- **Homes**: cottage, terrace, townhouse, mansion block. A home can be rebuilt in place as the
  next size up.
- **Shops and civic buildings**: a well, a market, a school, a library, a station, a museum.
- **Green and paved**: paths, trees, gardens, parks, squares and fountains.
- **Landmarks**, for effort: a plan arrives at 25, 50, 100, 200 and 300 lessons done in this
  city, and at 10, 30, 60 and 100 days practised. A clock tower, a bandstand, a lighthouse.
- **Monuments**, for mastery, from the **Architect's Office**:
  - a **zone monument** when every skill in the zone is mastered and its unit review is done
    (17 in Year 7), in the zone's colour and on the zone's theme;
  - a **statue** for each Legendary skill;
  - the **year monument** when the year review is done and half the zone monuments stand. It
    gains a gold finish when all of them do, and a copy stands in every later city.

Every building adds to the city's **population**, one number that only goes up, shown on the map
and in the atlas.

### Example numbers: the Place value zone

The first playable version has four quarries and one material. A pupil who finishes each skill in
turn (its lesson, then its levels; the first skill has a Picture level, so one more than the
others), then masters all four, sees this. The economy test checks these figures.

| After lesson | Machines | Stone a minute | The lesson earned |
| -----------: | -------: | -------------: | ----------------: |
|            1 |        1 |              2 |               120 |
|            2 |        1 |              3 |               150 |
|            4 |        1 |            7.5 |               300 |
|            7 |        2 |           13.5 |               540 |
|           10 |        3 |           19.5 |               780 |
|           13 |        4 |           25.5 |             1,020 |
|           17 |        4 |             36 |             1,440 |

Lessons 14 to 17 are the Reason level of each skill, which masters it. With the unit review, the
zone comes to 18 lessons and about 21,000 stone when they are done in one sitting, since power
saved up early is spent at the later, faster rates. It is spent like this:

| Building           |                              Costs | About          |
| ------------------ | ---------------------------------: | -------------- |
| Path               |                            5 stone |                |
| Cottage            | 40 stone, 8% more for each one had | 1 lesson early |
| Well               |                          150 stone | 1 lesson       |
| Mason's Yard       |                          400 stone | 1 lesson       |
| Architect's Office |                          60 blocks | 1 lesson       |
| The zone monument  |                         400 blocks | 3 lessons      |

That is the monument, both special buildings and about 45 cottages with their paths: a small
town from two hours' work, with the monument as the last thing built.

## 3. Growth over months

**Income is tied to learning, and to nothing else.** A city's output is the sum of its machines'
rates, and a machine's rate comes only from the skill's level and whether its review is in date.
Nothing that can be bought makes a machine faster. So income cannot compound, as it does in most
idle games, and the numbers cannot run away:

| Rank       | Machines | A lesson earns about |
| ---------- | -------: | -------------------: |
| Hamlet     |        1 |         120 to 1,000 |
| Village    |        8 |                1,600 |
| Town       |       20 |                4,000 |
| Borough    |       40 |                8,000 |
| City       |       60 |               12,000 |
| Metropolis |       72 |               14,000 |

With every Year 7 skill mastered and tuned a lesson earns about 26,000, and with every one
Legendary about 35,000. That is a rise of about 250 times over a year, steady rather than
explosive. In the economy test a typical pupil makes about six million materials over the whole year, a keen one
about seven million and one who never tunes up or masters a skill about one and a half million, so
every number in the game can be shown in full, with no made-up units.

**Prices follow the same curve.** Ranks come from machines built, which is learning, and each
rank opens new buildings priced from what a lesson earns at that rank:

| Kind of building  | Costs about              |
| ----------------- | ------------------------ |
| Ordinary          | 1 lesson                 |
| Civic or grand    | 4 lessons                |
| Landmark          | 6 lessons                |
| Zone monument     | 8 lessons, in components |
| The year monument | 30 lessons               |

Each copy of a building costs a little more than the last (8%), which moves the pupil on to the
next kind as their rank rises. Because income and prices both follow the pupil's own progress, a
pupil who learns slowly meets the same game as a fast one: about one new building for each lesson
at every stage. That is what "paces itself" means in the economy.

**Where a pupil's time goes.** Year 7 is 72 unit lessons, about 290 question sets up to Legendary,
17 unit reviews and about 90 tune-ups: around 35 hours of maths, and nearer 50 with the building.
The work changes as the year goes on: new lessons at first; then upgrades and mastery; then
tune-ups, Legendary sets and the year monument. A pupil who finishes early starts the next year's
city.

**Between years.** Each year's city has its own materials, power and ranks, so Year 8 starts
small again and the same price list works. Earlier cities stay in the **atlas**: they can be
visited and built in, and they keep growing, because the review schedule runs to 60 days and
their skills go on falling due. The year monument from each finished city stands in the main
square of every later one.

**A test keeps it honest.** `economy.test.ts` plays three made-up pupils (slow, typical, keen)
through Year 7 from the course data and the price list, and fails if lessons for each building
leaves the range 0.5 to 4, if a pupil can afford nothing for three lessons in a row, or if any
number passes ten million. The price list is data, so it is tuned by changing a table and
running the test.

## 4. The map

**A square grid, drawn in SVG by React, with no new dependency.**

- **Why not free placement?** Free placement needs a fine pointer, and its overlaps are hard to
  judge on a phone and impossible by keyboard. On a grid the pupil still chooses where
  everything goes.
- **Why not canvas or PixiJS?** The game has no frame loop: production is worked out from the
  clock, and the screen changes once a second or when the pupil acts. SVG gives real elements to
  focus, label and style, follows the light and dark themes through CSS, stays sharp at every
  zoom, and is what the lesson pictures already use. PixiJS would add a large dependency and
  WebGL, which is unreliable on old school Chromebooks.
- **The view** is front-on, like a board game seen from a little above: square tiles, with each
  building drawn taller than its tile so that it overlaps the row behind. Rows are drawn back to
  front. Up, down, left and right mean what they say, which an isometric view would lose.
- **The art** is flat-colour SVG drawn in code, as Dot and the lesson pictures are: one symbol
  for each building and tier, placed with `<use>`. It is the game's own, in the Learn Maths
  colours, with each zone in its topic family's colour.
- **Size.** A tile is 48 px at normal zoom, so a phone shows about 8 by 12 tiles and a
  Chromebook about 28 by 14. The Year 7 map is about 48 by 36 tiles. Only what is on screen is
  drawn.
- **Layout.** The map is made from a seed kept in the city's save, so each pupil's is their own.
  Zones lie along a winding road in course order, each a patch of ground with its outcrops, and
  the land between and around them is free to build on. Zones not yet surveyed are under mist. A
  test makes many maps and checks each outcrop has a free square beside it and that every zone
  can be reached.
- **Touch.** Drag to move the map, buttons (and pinch) to zoom, tap a tile for a sheet that
  slides up with what it is and what can be done. Building is two taps: choose from the Build
  menu, then tap a lit square.
- **Keyboard.** The map is one grid: arrow keys move a cursor tile, Enter opens its sheet, B
  opens the Build menu, plus and minus zoom. Each tile has a spoken name, such as "Quarry, tier
  3, needs a tune-up".
- **Without the map.** A **Works** tab lists every zone and machine with its buttons, so every
  lesson can be reached from a plain list by screen reader, by keyboard or on a very small
  screen.
- **Reduced motion.** With `prefers-reduced-motion`, smoke, cranes and counting animations are
  off, the map never moves by itself, and counters change without rolling.
- **Speed.** A full city draws a few hundred `<use>` elements, which is well within what a
  Chromebook manages. The fourth PR below tests this early with a made-up full city.

## 5. Sharing progress with Learn Maths

The game shares the learning record and adds its own save beside it.

- **One learning record.** Skills, levels, the review schedule, mistakes, unit lessons done, XP,
  streak and badges stay in the `Progress` object under Learn Maths' storage key. Both apps read
  and write it through the same package, so a lesson in the city counts towards the daily goal
  and streak, and a skill learnt in Learn Maths is ready to build in the city.
- **The city's save** is a second versioned object under its own key: for each year, the map's
  seed, where machines and buildings are, the stock of each material, power left, and plans
  earned. It is changed only by pure functions and checked on reading, as `progress.ts` is.
- **Two tabs.** If both apps are open, each rereads the record before it writes, and when the
  browser says the other tab has changed it.
- **This needs the same site.** A browser keeps storage apart for each subdomain, which is why
  the game is a folder of the Learn Maths site (section 7).
- **Moving device.** The transfer code planned for Learn Maths (step 8 of its proposal) will
  carry both objects.

## 6. Teachers

As in Learn Maths: no accounts, no class dashboard, nothing leaves the device.

- **Teacher mode** is the same switch, kept in the shared record. In the city it opens every
  zone and outcrop, lets any level of a skill be tried, and offers **See an example city**, a
  half-built Year 7, so a teacher can look round without earning one.
- **Links**, in the same form as Learn Maths': `#/start?year=Y7` starts a pupil in a year, and
  `#/zone/y7-angles` opens a zone and moves the map to it, for "today we are on angles".
- **A city report** the pupil can show or print: for each zone, the skills built, finished and
  mastered, with lessons done in the last few weeks. The pupil types their name only to print.
- **Classroom manners.** Sound obeys the same switch as Learn Maths, and no lesson has a timer.

## 7. Publishing

The brief suggests a second site repository and subdomain. That would stop the game sharing
progress (section 5), so instead it is a folder of the existing site:
**https://learnmaths.jedhunt.co.uk/city/**.

- `learn.yml` builds `apps/city` as well, and copies its build into `city/` of the Learn Maths
  build before publishing. It also runs when `apps/city/**` changes.
- Both apps are always published together from one commit, so they can never disagree about the
  shape of the shared record.
- **There is no one-off set-up for the owner.**
- Learn Maths gets a link to the city on its You page, and the city links back.

## Shared packages

Two new packages hold what both apps need. Everything is moved, with its tests, not copied.

**`@mathsplanner/learning`**: the course and the learning record. No React.

| From `apps/learn/src`                                   | What it is                                                |
| ------------------------------------------------------- | --------------------------------------------------------- |
| `course.ts`, `families.ts`                              | Sections, units, skill levels, topic families             |
| `skills.ts`                                             | Levels from the generators, and the question for an item  |
| `lesson.ts`, `practice.ts`                              | Planning, playing and recording lessons and reviews       |
| `memory.ts`                                             | The review schedule                                       |
| `progress.ts`, `rewards.ts`                             | The record, its storage, XP, streaks and badges           |
| `misconceptions.ts`                                     | Wording for misconceptions                                |
| `unit-lessons/`                                         | The unit lessons (data), their types and `OPEN_TO_PUPILS` |
| `lesson.test.ts`, `practice.test.ts`, `rewards.test.ts` | Their tests                                               |

**`@mathsplanner/lesson-player`**: the screens that play a lesson, in React.

| From `apps/learn/src`                             | What it is                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| `LessonView.tsx`                                  | A lesson of generated questions, with its Check panel               |
| `UnitLessonView.tsx`, `unit-screens.tsx`          | A unit lesson and its kinds of screen                               |
| `unit-ui.tsx`, `Picture.tsx`, `LineGraph.tsx`     | Their parts and pictures                                            |
| `labels.ts`, `fit.ts`, `sounds.ts`, `feedback.ts` | Helpers they use                                                    |
| `Dot.tsx`, `BadgeMark.tsx`, the icons they use    | Dot and the marks on the end screen                                 |
| The lesson rules in `styles.css`                  | A `lesson.css` that takes each app's colours, as `widgets.css` does |
| `unit-lessons.test.ts`                            | The check that every screen can be done                             |

**What stays in `apps/learn`**: its shell (`App.tsx`), the path, the skill sheet, the Practise,
You and welcome views, the example progress and its own styles.

**What is the city's own**: the map, the art, the city's save, the economy and the price list.

The existing packages (`core`, `generators`, `marking`, `render`, `ui`, `diagrams`) are used as
they are.

## The first playable version

Year 7, one zone (Place value), four quarries, stone and blocks, cottages and paths, the Mason's
Yard, the Architect's Office and one monument. Seven small PRs, each leaving `main` working and
Learn Maths unchanged for pupils:

1. **`@mathsplanner/learning`.** Move the logic, the lesson data and their tests out of
   `apps/learn`, which then imports them. No change in behaviour; the tests pass as they are.
2. **`@mathsplanner/lesson-player`.** Move the lesson screens and split their styles out. Learn
   Maths is played through in a browser at phone size, light and dark, to show nothing moved.
3. **The city's engine.** `apps/city` (`pnpm city`), with the city's save, power, production from
   the clock, crates, prices and ranks as pure, tested functions, and the economy test. On
   screen, only the counters.
4. **The map.** The seeded one-zone map, its drawing in SVG, moving and zooming, the keyboard
   cursor, the tile sheet, and the first art: ground, outcrops, the camp. Tried with a made-up
   full city for speed.
5. **The learning loop.** Put a quarry beside an outcrop; its lesson plays; the quarry comes to
   life; question sets upgrade it and change how it looks; power and crates; tune-ups when a
   skill is due. All from the shared record.
6. **Building.** The Build menu, cottages, paths and the well; the Mason's Yard and blocks; the
   Architect's Office and the monument, unlocked by mastering the zone; population and rank.
7. **Publishing and a play-through.** The workflow change, the links between the apps, the
   Works tab, `apps/city/README.md`, and the whole version played in a browser at 390 × 844 and
   at 1366 × 768, in light and dark, by touch and by keyboard.

Then it is tried with pupils before anything is built wider.

## After the first version

In the order they would be built, each a proposal update or a PR of its own:

1. The rest of Year 7: 17 zones, four materials, three workshops, the full price list, landmarks,
   zone monuments and the year monument.
2. The atlas, a second year's city, and the keepsake.
3. Teacher links, the example city and the city report.
4. Art and sound in depth: more buildings for each rank, so two cities do not look alike.

## Open questions

These do not block the first version. Most are best answered by watching pupils play it.

1. **Should an upgrade need most questions put right?** In Learn Maths a level is reached by
   finishing its lesson, however many answers were wrong first. The city makes each level worth
   more, so guessing through might tempt some pupils. The design keeps Learn Maths' rule, since
   changing it would change both apps.
2. **Two places to work.** Should the next zone open a skill early, where the statement data
   says that is safe, so a pupil stuck on one skill has somewhere else to go?
3. **The power dial.** It counts down, but nothing is lost at zero. If pupils feel hurried by
   it, it can show minutes earned today instead.
4. **Names.** "Maths City", the materials, the buildings and the monuments are working names.
5. **Primary years.** Years 1 to 6 have no unit lessons yet, so their machines would be built by
   a question set. The city may be best kept to Years 7 to 9 until they do.

## Risks

- **The second PR is large**, though it only moves files: `styles.css` is 3,600 lines and has to
  be split. It gets its own browser play-through of Learn Maths.
- **The art is the long job.** The first version needs about fifteen drawings, a full year
  nearer a hundred. Drawing in code keeps them consistent and small, but they still take time.
- **The numbers are a first draft.** The economy test and the price table are there so they can
  be tuned without touching the game.
