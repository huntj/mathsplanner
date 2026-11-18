# @mathsplanner/learning

The course as a pupil meets it, the lessons made from it and the pupil's learning record. It was moved out of `apps/learn` so that Learn Maths and Maths City (see the [proposal](../../docs/proposals/city-game.md)) share one copy. Nothing here draws anything, so it has no React.

- `course.ts`, `families.ts`: the sections, units and skills of `data/course.json`, each skill's levels (from the depths its generator supports) and each topic's family.
- `skills.ts`: a skill's levels and misconceptions from its generator, and the question for a lesson item.
- `lesson.ts`, `practice.ts`: planning a lesson or review, playing it through, and recording it when it is finished.
- `memory.ts`: the review schedule, a Leitner system of six boxes.
- `progress.ts`, `rewards.ts`: the pupil's progress, kept only in the browser's local storage as one versioned object changed by pure functions, with XP, streaks, freezes and badges.
- `misconceptions.ts`: the catalogue's wording for a misconception.
- `unit-lessons/redrafts.ts`: lessons redrafted with variation in their learning stage (see the [proposal](../../docs/proposals/lesson-variation.md)). Each is keyed by the id of the lesson it replaces and may split it into several. Teachers see every redraft in place of its original; pupils see those listed in `LIVE_REDRAFTS` (the pilots, which go to pupils each time they improve) and keep the originals of the rest. `redraft()` in `build.ts` keeps a lesson's own problem, warm-ups, discovery and mistakes, and can `swap` any of them for a diagram-first version, mark one `wordsOnly` with the reason, and put screens such as an Explore `before` the method. In the geometry and statistics topics, and graphs, every redrafted question is asked on a diagram, with the given values on the diagram and only what to find in words ([proposal](../../docs/proposals/lesson-interactive.md)); the tests check this. `circle-pictures.ts` draws circle theorem diagrams accurately from where each point sits, and can make their lines, angles and tangents tappable.
- `unit-lessons/`: the unit lessons, as data, one file per unit. Import them from `@mathsplanner/learning/unit-lessons`. The screens that play them are in [`@mathsplanner/lesson-player`](../lesson-player/README.md), whose `unit-lessons.test.ts` checks that every screen can be done.

The package is used from its TypeScript source, by the apps' Vite builds and by Vitest. It has no build of its own, as it reads `data/` directly.
