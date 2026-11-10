# CLAUDE.md

Guidance for Claude Code sessions in this repository. Read it before starting work.

## What this is

MathsPlanner: a pnpm monorepo of maths question generators and the apps built on them.

- `packages/generators`: one pure generator per curriculum statement (`<key stage>/<ID>.ts`), each
  making unlimited questions at several depths from a seed. The contract is in `CONTRIBUTING.md`
  and `docs/design.md`.
- `packages/core`, `marking`, `render`, `ui`, `diagrams`, `archetypes`: the question model,
  answer marking, KaTeX rendering, answer widgets and diagrams that every app shares.
- `data/`: curriculum statements, misconceptions, topics and `course.json`, which orders each
  year (`Y1`… `Y9`, GCSE) into units of skills. Edit `course.txt` and run `pnpm data:course`.
- `apps/learn`: Learn Maths, the pupils' app, live at https://learnmaths.jedhunt.co.uk. Read its
  README before changing it.
- `apps/gallery`, `apps/practice`: the generator gallery and a practice app.
- `docs/proposals/`: design documents. New apps and big features start as one, reviewed by the
  owner before any code.

## Commands

Node 24 (`.nvmrc`) and pnpm 12 via Corepack.

```sh
pnpm install
pnpm lint          # eslint . && prettier --check .
pnpm typecheck
pnpm test          # the whole suite takes several minutes: run the files you changed first
pnpm data:check
pnpm learn         # Learn Maths dev server
```

- Run Vitest from the repository root, naming the files: `npx vitest run apps/learn/src/unit-lessons.test.ts`.
  Running it from inside an app directory resolves packages wrongly.
- Format with `npx prettier --write <files>` before committing; CI fails on unformatted files.
- TypeScript is strict, with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`: no
  non-null assertions (`!`); narrow instead.

## How work is done here

- **Design first.** For a new app or a large feature, write `docs/proposals/<name>.md` and stop
  for the owner's review before building.
- **Small steps.** One branch and one PR per coherent piece, using `.github/pull_request_template.md`.
  Never push to `main`.
- **Check it in a browser.** Tests are not enough for anything a pupil sees. Chromium and
  Playwright are installed: play every changed screen through at phone size (390 × 844) in light
  and dark mode, look at the screenshots, and fix what is cramped, wrapped or wrong.
- **Before a PR:** lint, typecheck, the relevant tests and `pnpm data:check` pass locally.
- **After a PR:** wait for CI to go green, then merge and confirm the change is live. Changes to
  `apps/learn`, `packages/` or `data/` publish through `.github/workflows/learn.yml` to the
  `huntj/learnmaths` GitHub Pages site within minutes. If the site still shows the old build
  (check `last-modified`), run the workflow again.
- Report honestly: say what was checked, what was not, and anything still open.

## Writing for pupils

- British English and UK maths terms (maths, metres, colour; "x squared", "times by").
- Short, plain sentences. Real contexts pupils recognise. Name the common mistakes.
- Maths in words goes between dollar signs and is rendered by KaTeX. Keep plain text (no `$`)
  where a string is shown outside KaTeX, such as lesson summaries and bar-model labels.
- Pupils' progress lives only in the browser's local storage. No accounts, no tracking and no
  pupil data leaves the device or enters the repository.

## Learn Maths lessons

Unit lessons are data in `packages/learning/src/unit-lessons/`, one file per unit, split into one
lesson before each skill. Each follows one plan: The problem, Warm-up, Discover, Worked example,
Together, Your turn, Watch out, Spot the mistake, Back to the problem, Exit check.
`unit-lessons.test.ts` checks every screen can be completed. A new unit shows only in teacher
mode until it is added to `OPEN_TO_PUPILS` in `index.ts`.
