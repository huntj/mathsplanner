# @mathsplanner/learn

Learn Maths, the pupils' app: a Duolingo-style path through the years with Dot, the mascot. See the [proposal](../../docs/proposals/learn-app.md) for the whole plan.

A first visit has Dot say hello, then asks for the pupil's year and a daily goal. The path shows the year's units from `data/course.json`, each in its topic's colour, with its skills as a winding line of nodes and a unit review at the end. A ring round each node shows the levels done, and each skill's levels come from the depths its generator supports (`skillLevels` in `src/course.ts`). Finished skills are coloured, mastered ones gold with a tick and legendary ones gold with a star; the first unfinished skill is the current one, with Dot beside it, and the skills after it are locked. Tapping a node opens a sheet with the skill, its levels and what each asks. The pupil's page shows their streak, XP and skills finished and mastered, and holds their preferences (daily goal, colours, sounds and challenge mode). **See an example**, on the welcome and the pupil's page, fills in example progress about halfway through Year 7.

Progress is kept only in the browser's local storage (`src/progress.ts`): one versioned object, changed by pure functions and checked whenever it is read back, so anything unreadable starts afresh. Lessons arrive in step 4.

Run it locally with `pnpm learn` (http://localhost:5175). `vite build --mode single` inlines the fonts, for hosts that serve only the page and its scripts.
