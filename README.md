# MathsPlanner

An open-source maths question generator for every learning statement in England, from Nursery to Year 13. For each of the 686 "I can…" statements in the [progression map](docs/progression-map.md), MathsPlanner will generate unlimited, reproducible questions at five depths of understanding, with LaTeX maths, SVG diagrams, worked solutions, auto-marking and print export.

The aim is to tell a teacher whether a student has **mastered** a statement, not just whether they can follow a method: depth 4 and 5 questions are answerable only with real understanding, and every wrong option is a misconception students actually have.

## Status

**Phases 0 to 3 are complete.** The repository has its workspace, tooling, licences and CI; all 686 statements are imported into [`data/statements.json`](data/statements.json) with a validated prerequisite graph; `@mathsplanner/core` provides the question schema, a seeded random source, exact rationals and surds, LaTeX helpers and `defineGenerator`; `@mathsplanner/render` turns questions into accessible HTML; and `@mathsplanner/diagrams` draws geometry, graphs, number lines and bar models as self-contained SVG, with label placement and checks that every drawing matches its numbers. The [gallery](https://huntj.github.io/mathsplanner/) browses every statement and the [50 reference diagrams](https://huntj.github.io/mathsplanner/#/diagrams). No real generators exist yet: the gallery shows one unreviewed example (Y5-GEO-04). See the [roadmap in the design document](docs/design.md#roadmap) for the phases ahead; Phase 4's first vertical slice is angles and geometry.

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
| `pnpm data:import` | Re-imports `docs/progression-map.md` into `data/statements.json` (overwrites edits made since) |
| `pnpm coverage`    | Lists statements without a generator; fails if a generator names an unknown statement          |
| `pnpm gallery`     | Runs the gallery locally at http://localhost:5173                                              |
| `pnpm new <ID>`    | Scaffolds a generator and its test for a statement                                             |

## Repository layout

```text
data/          statements.json, misconceptions.json and their JSON Schemas
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
