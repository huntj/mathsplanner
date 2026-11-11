# @mathsplanner/lesson-player

The screens that play a lesson, in React. They were moved out of `apps/learn` so that Learn Maths and Maths City (see the [proposal](../../docs/proposals/city-game.md)) play the same lessons from one copy. The lessons themselves, and what happens to a pupil's progress when one is finished, are in [`@mathsplanner/learning`](../learning/README.md).

- `LessonView.tsx`: a lesson of generated questions, with Check, the feedback panel and the end screen.
- `UnitLessonView.tsx`, `unit-screens.tsx`, `unit-ui.tsx`: a unit lesson and each kind of screen it can show.
- `Picture.tsx`, `LineGraph.tsx`, `labels.ts`: the pictures a screen can show, and where their labels go.
- `Dot.tsx`, `Icons.tsx`, `BadgeMark.tsx`, `sounds.ts`: Dot and the logo, the icons, the badge marks and the sounds.
- `fit.ts`: shrinks a piece of maths that is too wide for its line. An app calls `watchMaths` once on its root.
- `unit-lessons.test.ts`: checks that every screen of every unit lesson can be done.

Import `@mathsplanner/lesson-player/lesson.css` after the app's own stylesheet. It styles only the lesson screens. It takes its colours from the app's CSS variables and builds on the app's base styles for buttons and topic families, which each app sets for itself, as with `@mathsplanner/ui/widgets.css`.

Like `@mathsplanner/learning`, the package is used from its TypeScript source and has no build of its own.
