# Maths City: brief for version 2

The starting point for a second version of Learn Maths: an incremental, city-building game built
on the same generators, course and lessons. This is a brief, not a design. The design document,
`docs/proposals/city-game.md`, comes next and is reviewed by the owner before any code is written.

## The owner's aims

1. **It paces itself to the pupil.** Every pupil, whatever they find easy or hard, makes steady
   progress. The game rewards what they can do now and stretches them from there.
2. **Effort shows.** A pupil who puts in lots of time ends up with a grand city: impressive
   buildings and monuments that are clearly theirs.
3. **The lessons stay.** The short lessons that teach each skill are part of the game, not
   something to skip past, because they are what helps pupils learn.

## The original brief

The owner's brainstorm, kept as written.

> **1. Core Concept & User Experience**
> The game adapts a bite-sized, lesson-by-lesson progression—similar to language learning
> apps—but creates a fully realized spatial world. Students navigate a fresh, dynamically
> generated world each academic year, ensuring a unique map for every curriculum stage.
>
> **2. Spatial Unlocks & Extraction Mechanics**
> The game begins on a blank map featuring singular resource nodes. To begin harvesting, students
> must construct specific extraction machines—such as a rock mining rig—directly adjacent to a
> node.
>
> Constructing a machine triggers an embedded lesson, followed by dynamically generated question
> sets. Successfully answering questions transitions the machine from depleted to active,
> initiating real-time resource generation per second.
>
> **3. Progressive Mastery & Upgrades**
> Each zone features an independent mastery level reflecting student fluency, tracked through
> accuracy streaks and diagnostic tests. As a student's mastery improves, the production turnover
> rate accelerates dramatically, generating resources much faster. Visually, the extraction
> structures transform from basic sites into advanced facilities.
>
> **4. Free-Form Processing & Monument Construction**
> Refined materials are routed to processing facilities—such as the Architect's Office—which
> players place freely on the map. These facilities convert basic inputs into advanced building
> components.
>
> Crucially, monumental unlocks are intrinsically tied to mastery. Mastering geometry, for example,
> unlocks elite blueprints within the Architect's Office, eventually enabling students to
> construct massive, prestigious monuments that define their metropolis.

## What already exists to build on

Most of the learning side is already built in Learn Maths. A starting mapping, for the design to
confirm or change:

| In the game                     | Already in the repository                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| A year's world                  | A course section (`data/course.json`, Year 1 to GCSE), with a map seeded per pupil and year                                    |
| A zone, with its resource       | A unit, with its topic (number, algebra, geometry…) and topic colour                                                           |
| An extraction machine on a node | A skill                                                                                                                        |
| The embedded lesson on building | The skill's unit lesson (`apps/learn/src/unit-lessons/`, one before each skill, with an exit check)                            |
| The question set that activates | A lesson of generated questions (`apps/learn/src/lesson.ts`, `skills.ts`), marked by `@mathsplanner/marking`                   |
| Machine tiers and mastery       | A skill's levels, from its generator's depths (`skillLevels` in `apps/learn/src/course.ts`), and finished, mastered, legendary |
| A machine needing maintenance   | The review schedule: a skill falls due after 1, 3, 7, 14, 30 and 60 days (`apps/learn/src/memory.ts`)                          |
| A repair job                    | "Fix my mistakes": questions aimed at misconceptions the pupil has shown                                                       |
| A zone's diagnostic test        | The unit review; the year review for the whole world                                                                           |
| Saving                          | Versioned progress in local storage (`apps/learn/src/progress.ts`)                                                             |

The game should reuse these through the workspace packages, moving shared logic out of
`apps/learn` into a package where both apps need it, rather than copying it.

## Suggestions for the design to weigh

- **Two kinds of reward, so every pupil builds something grand.** Effort (questions answered,
  lessons finished, days practised) earns everyday building materials, so a hard-working pupil who
  finds maths difficult still grows a big city. Mastery (levels reached, skills mastered, reviews
  passed) unlocks prestige blueprints and monuments. Effort makes the city big; mastery makes it
  remarkable.
- **Pace by the pupil's own level.** Production should scale with how far the pupil has come on
  each skill, not with raw speed or with how they compare to others. The generators' depths
  already give gentler questions at lower levels.
- **Practice, not absence, should grow the city.** Real-time production is satisfying, but
  production while away should fill a store that caps after a few hours, so that practising,
  rather than leaving the game open, is what builds a grand city.
- **Spaced review as maintenance, gently.** A skill that falls due could make its machine slow
  down until a short refresh, which turns the review schedule into part of the game. A machine
  should never be destroyed or resources taken away.
- **The lessons are the gate.** Building a skill's first machine plays its lesson and then its
  questions. Teacher mode can open everything, as in Learn Maths.
- **A new world each year, a keepsake from the last.** Each year's map is fresh, but a finished
  year's monument could carry into the next world, so earlier work stays visible.
- **No purchases, adverts or timers that pressure pupils.** No pupil data leaves the device.
- **Original art and names.** City-building is a genre to work in; the buildings, monuments and
  style should be the game's own.

## Questions for the design to settle

1. The core loop, step by step, for a pupil's first ten minutes and their fiftieth hour.
2. Resources: how many, which topics they come from, what processing turns them into, and what
   each building needs. A small, readable economy beats a large one.
3. How production rates, upgrade tiers and costs grow, so the city keeps growing for a pupil
   who plays for months without the numbers running away.
4. What the map looks like and how it is drawn (grid or free placement; SVG, canvas or a
   library such as PixiJS), working well on phones and school Chromebooks, by touch and keyboard,
   with reduced motion respected.
5. Whether the game shares progress with Learn Maths, so skills already learnt there start built,
   or starts fresh.
6. What a teacher can see or set, if anything, without accounts or pupil data leaving the device.
7. Where it is published: a new app, `apps/city`, deployed like `apps/learn` (see
   `docs/deploy-learn-maths.md`) to its own site repository and subdomain. That needs a one-off
   set-up by the owner.

## First playable version

A thin slice through every layer, to try with pupils before building wide:

- Year 7 only, with one zone (one unit), its resource nodes and its machines.
- Place a machine next to a node; its lesson and questions play; the machine comes alive and
  produces resources each second.
- Levelling the skill up speeds the machine and changes how it looks.
- One processing building and one small monument, unlocked by mastering the zone.
- Progress saved in the browser, and the whole slice checked in a browser at phone size.
