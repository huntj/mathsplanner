# MathsPlanner

An open-source maths question generator for every learning statement in England, from Nursery to Year 13. For each of the 686 "I can…" statements in the [progression map](docs/progression-map.md), MathsPlanner will generate unlimited, reproducible questions at five depths of understanding, with LaTeX maths, SVG diagrams, worked solutions, auto-marking and print export.

The aim is to tell a teacher whether a student has **mastered** a statement, not just whether they can follow a method: depth 4 and 5 questions are answerable only with real understanding, and every wrong option is a misconception students actually have.

## Status

**Phases 0 to 6 are complete.** The repository has its workspace, tooling, licences and CI; all 686 statements are imported into [`data/statements.json`](data/statements.json) with a validated prerequisite graph; `@mathsplanner/core` provides the question schema, a seeded random source, exact rationals and surds, LaTeX helpers and `defineGenerator`; `@mathsplanner/render` turns questions into accessible HTML; and `@mathsplanner/diagrams` draws geometry, graphs, number lines and bar models as self-contained SVG, with label placement and checks that every drawing matches its numbers. The [gallery](https://mathsplanner.jedhunt.co.uk/) browses every statement and the [50 reference diagrams](https://mathsplanner.jedhunt.co.uk/#/diagrams).

**Phase 7, scaling out, has a generator for every statement; teacher reviews are what remain.** Generators were written strand by strand along the prerequisite graph, starting with number and place value (all 67 statements, Nursery to Year 9), then addition and subtraction (all 22, Nursery to Year 5), then multiplication and division (all 30, Year 1 to Year 6), then fractions, decimals and percentages (all 45, Year 1 to Year 7), ratio and proportion (all 17 in KS2 and KS3), algebra (all 29 in KS2 and KS3), statistics (all 14, Year 2 to Year 8), probability (all 5 in KS3), measurement (all 43, Nursery to Year 6), and the remaining geometry, position and pattern statements (35, Nursery to Year 9), so every statement from Nursery to Year 9 now has a generator. GCSE followed: first the 87 statements both tiers share, then the 40 Higher-only statements, so every GCSE statement now has a generator too. KS5 completed the map: A level Maths (pure, statistics and mechanics), Further Maths (core pure and all six options: further pure 1 and 2, further statistics 1 and 2, further mechanics 1 and 2, and decision maths 1 and 2) and Core Maths, so **every one of the 686 statements now has a generator**. Written methods are worked line by line, the early years use a counters diagram (ten frames, fingers, tally marks, part-whole models and place-value counters), and new diagram types draw bar charts, pictograms, pie charts, Venn diagrams, clocks, rulers, jugs, thermometers, weighing scales, 3D solids, nets, repeating patterns, histograms, box plots and probability and frequency trees. The gallery's [coverage page](https://mathsplanner.jedhunt.co.uk/#/coverage) shows which statements have a generator and which have a teacher review: all 686 have a generator, and 36 are reviewed so far. The KS5 generators are the newest and most need a teacher's review.

**Phase 6, print export, is done.** In the practice app, set up questions as for a session and choose **Print a worksheet**: an A4 sheet with name and date lines, numbered questions with answer lines and working space, then answer pages with worked solutions and the wrong answers to watch for. Construction questions are drawn at true size, so they can be finished with a ruler and protractor, and a reduced-ink option suits photocopying. `pnpm print` makes the same sheet as a PDF. Every sheet carries its seed and link, so it can be printed again exactly.

**Year tests and unit tests.** The practice app also makes test papers. A **year test** draws from everything in one year or course: choose the number of questions, a mark total to aim for, and the depth to start and end at, and the questions build from one to the other. A **unit test** covers one topic (number, algebra, geometry and so on) across the years and depths you choose. Either can be printed like a worksheet or taken on screen from a shared link.

**Phase 5, marking and the practice app, is done.** `@mathsplanner/marking` marks every answer type and names the misconception behind a wrong answer. The [practice app](https://mathsplanner.jedhunt.co.uk/practice/) lets a teacher choose statements, depths and numbers and share one link; students answer with a widget for each answer type (including drawing angles with an on-screen protractor), get feedback after each question or only at the end, and download or print their results as CSV. Nothing is stored.

**Phase 4, the angles and geometry slice, is done.** 36 generators cover the chain from turns and right angles (Y1-POS-01) to circle theorems (GH-G10), with a protractor diagram, all 15 archetypes, and 45 misconception codes. Each passes the automated quality checks across 500 seeds at every depth and numbers setting, and each has a recorded teacher review of depth 4. See the [roadmap in the design document](docs/design.md#roadmap) for the phases ahead.

| Stage                        | Statements |
| ---------------------------- | ---------: |
| EYFS (Nursery and Reception) |         35 |
| KS1 (Years 1 and 2)          |         54 |
| KS2 (Years 3 to 6)           |        170 |
| KS3 (Years 7 to 9)           |         76 |
| KS4 (GCSE, Edexcel 1MA1)     |        127 |
| A level Maths (9MA0)         |        106 |
| Further Maths (9FM0)         |         80 |
| Core Maths (7MC0)            |         38 |
| **Total**                    |    **686** |

## Quick start

You need Node 24 (the current LTS; see `.nvmrc`) and pnpm, which Node's Corepack provides.

```bash
corepack enable
pnpm install
pnpm test
```

| Command            | What it does                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `pnpm test`        | Runs every test with Vitest                                                                    |
| `pnpm lint`        | ESLint and a Prettier check (`pnpm format` fixes formatting)                                   |
| `pnpm typecheck`   | Strict TypeScript across every package                                                         |
| `pnpm build`       | Builds each package to `dist/`                                                                 |
| `pnpm data:check`  | Validates `data/` and the prerequisite graph                                                   |
| `pnpm data:course` | Checks `data/course.txt`, the Learn Maths path, and writes `data/course.json`                  |
| `pnpm data:import` | Re-imports `docs/progression-map.md` into `data/statements.json` (overwrites edits made since) |
| `pnpm coverage`    | Lists statements without a generator; fails if a generator names an unknown statement          |
| `pnpm gallery`     | Runs the gallery locally at http://localhost:5173                                              |
| `pnpm practice`    | Runs the practice app locally at http://localhost:5174                                         |
| `pnpm print`       | Prints a worksheet to PDF with an installed Chrome or Edge (`pnpm print --help` for options)   |
| `pnpm new <ID>`    | Scaffolds a generator and its test for a statement                                             |

## Repository layout

```text
data/          statements.json, misconceptions.json, topics, the Learn Maths course and schemas
docs/          design document, progression map and data report
packages/      core, diagrams, archetypes, marking, render, generators
apps/          gallery (browse and review) and practice (student-facing, stateless)
tools/         import-map (statement import and checks) and print (worksheets to PDF)
```

The [design document](docs/design.md) explains the architecture, the mastery model and the generator contract. [docs/data-report.md](docs/data-report.md) lists questions about the statement data that are waiting for review.

## Contributing

Teachers and developers are both welcome, and AI-assisted contributions are accepted with disclosure and a recorded teacher review. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## Licences

- **Code** is licensed under the [MIT licence](LICENSE).
- **Generated question content, archetype text and `data/misconceptions.json`** are licensed under [CC BY 4.0](LICENSE-CONTENT), so schools can reuse them freely with attribution.
- **Statement wording** is paraphrased from national curriculum documents (Open Government Licence v3) and Pearson Edexcel specifications; Pearson content references are used only as identifiers. See [NOTICE](NOTICE).

MathsPlanner is not affiliated with the Department for Education or Pearson.
