# Contributing to MathsPlanner

Thank you for helping. MathsPlanner needs two kinds of expertise: **teachers**, who know which questions reveal understanding and which mistakes students really make, and **developers**, who turn that into generators. Many contributions need both, so pairing up is encouraged.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Code you contribute is licensed under MIT and question content under CC BY 4.0 (see [README](README.md#licences)).

## Ways to help

- **Write a generator** for a statement (the main work from Phase 4 onwards).
- **Review a generator** as a teacher, using the [review checklist](#review-checklist).
- **Suggest a misconception** for the shared catalogue, using the _Misconception suggestion_ issue form.
- **Fix the statement data**: wording, prerequisites or anything listed in [docs/data-report.md](docs/data-report.md).
- **Report a bug** with the _Bug report_ issue form.

## Setting up

You need Node 24 (see `.nvmrc`) and pnpm via Corepack.

```bash
corepack enable
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm data:check
```

## Claiming a statement

Each statement in [`data/statements.json`](data/statements.json) gets one generator, and each generator gets one GitHub issue and one pull request.

1. Find the statement's issue. Issues will be opened automatically from `statements.json` when generators are opened up to contributors (Phase 7); until then, search the issues for the statement ID and, if there is none, open one with the _Statement generator_ form.
2. Comment on the issue to claim it. A maintainer assigns it to you. If you can no longer work on it, say so on the issue so someone else can pick it up; claims with no activity for 30 days may be released.
3. Check the statement's prerequisites (`needs`). Generators for prerequisites should usually exist first, because depth 5 and multi-step questions reuse them.
4. Run `pnpm new <ID>` to scaffold the generator and its test file (a gallery entry will be added too once the gallery exists, in Phase 2). The scaffold's test fails until you write `build`.
5. Open one pull request per statement, filling in the template.

## The generator contract

A generator lives at `packages/generators/src/<key stage>/<ID>.ts`, where the key stage folder is `eyfs`, `ks1`, `ks2`, `ks3`, `ks4` or `ks5`. It is mostly configuration: parameter ranges, archetypes, diagrams and misconceptions. The full specification is in [docs/design.md](docs/design.md#writing-a-generator). In short, a generator must:

- **be pure**: the same statement ID, depth, numbers setting and seed always give the same question, using only the seeded random source it is given;
- **not render anything**: it returns a plain `Question` object, never HTML, SVG or LaTeX layout;
- **keep maths exact**: fractions, surds, π and algebra stay exact until display;
- **declare every depth it supports** (1 to 5) and handle all three numbers settings (friendly, standard, stretch);
- **list every misconception code it can produce**, each one in `data/misconceptions.json`, and make every wrong option a real misconception;
- **ship an independent `verify`** that recomputes the answer a different way;
- **reject bad parameter sets** with `accept` (or `requireExists` for open-construction) rather than producing degenerate questions;
- **bump its `version`** whenever a change would alter the question produced for an existing key.

Draw diagrams with the builders in `@mathsplanner/diagrams` (for example `anglesOnLine` or `triangleSSS`) rather than computing coordinates by hand, and check in your tests that every diagram renders with no `collisions` and no `problems`.

Anything two statements need belongs in a shared package (`@mathsplanner/core`, `@mathsplanner/archetypes` or `@mathsplanner/diagrams`), not in a generator.

### Generator file header

Every generator starts with a header that records who wrote it, whether AI helped, and the teacher review. The coverage dashboard will read it, so keep the format exact:

```ts
/**
 * @statement Y6-FR-03
 * @author @your-github-handle
 * @ai-assisted no
 * @reviewed 2026-11-02 @teacher-github-handle (KS2 teacher): depths 1-5, all numbers settings
 */
```

- `@ai-assisted` is `no`, or `yes:` followed by the tool and what it did, for example `yes: Claude drafted params and build; author rewrote depth 4`.
- `@reviewed` is added by, or on behalf of, the reviewing teacher once they have checked the generator in the gallery. Add a new `@reviewed` line for each later review. A generator without one counts as unreviewed.

## Quality checks

No generator is merged until it passes the automated checks across **500 seeds at every depth and numbers setting it supports**, and a teacher has reviewed it. CI runs:

| Check                      | What it catches                                                       |
| -------------------------- | --------------------------------------------------------------------- |
| Answer verification        | Wrong answers, by comparing with the generator's independent `verify` |
| Misconception distinctness | Distractors equal to the answer or to each other                      |
| Degeneracy                 | Zero-length sides, 0° angles, unwanted answers of 0 or 1              |
| Number niceness            | Answers messier than the numbers setting allows                       |
| Diagram truth              | Drawings that contradict the numbers                                  |
| Label collisions           | Overlapping labels or labels crossing lines                           |
| Determinism                | The same key giving different questions                               |
| Visual regression          | Unintended diagram changes (SVG snapshots)                            |
| Coverage                   | Generators naming unknown statements (`pnpm coverage`)                |
| Accessibility              | Missing text descriptions, low contrast                               |

These checks are built during Phases 1 to 5; today CI runs lint, typecheck, tests and `pnpm data:check`. Run the same locally before opening a pull request:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm data:check && pnpm coverage
```

## Review checklist

Reviewers (ideally a teacher of the relevant phase) click through the generator in the gallery (run `pnpm gallery` on the pull request's branch until pull request previews exist), across several seeds at every depth and numbers setting, and check:

- [ ] Every question matches the statement and its stage; nothing needs content the student has not met (check `needs`).
- [ ] Depth 1 to 3 questions test fluency, varied fluency and representation as described in the [mastery model](docs/design.md#mastery-model).
- [ ] Depth 4 questions can only be answered by someone who understands the idea, not by following a procedure.
- [ ] Depth 5 questions are genuinely non-routine.
- [ ] Every distractor is a mistake students really make, and its feedback would help a student who made it.
- [ ] The numbers settings feel right: friendly is friendly, stretch is a stretch but fair.
- [ ] Diagrams are to scale (or say "not drawn to scale"), and labels sit where a careful teacher would put them.
- [ ] Wording is clear, uses UK spelling and conventions, and suits the age group.
- [ ] Worked solutions use methods taught at this stage.
- [ ] You would put these questions in front of a class.

Record the review in the generator's header (see above) and approve the pull request.

## AI-assisted contributions

AI-assisted contributions are welcome on the same terms as any other, with three extra requirements:

1. **Same checks.** They must pass exactly the same automated checks; there are no exemptions.
2. **Disclosure.** Say in the pull request that AI was used, which tool, and for what, and set `@ai-assisted` in the generator header.
3. **Recorded teacher review.** A human teacher must review the generator in the gallery against the review checklist and be recorded with `@reviewed` in the header before it is merged. The author can be that teacher if they are one, but the review must be done by a person, not a model.

You are responsible for everything you submit, whoever or whatever drafted it: check that you understand it and that it contains nothing you do not have the right to contribute.

## Changing the statement data

`data/statements.json` was imported from [docs/progression-map.md](docs/progression-map.md) and is now the source of truth: change it by pull request, not by editing the map and re-importing. Keep IDs stable, because generators and saved questions refer to them. Run `pnpm data:check` before pushing; it fails on duplicate or missing IDs, prerequisite cycles and count mismatches, and prints warnings worth a look. Explain the reason for the change, with a source where possible.

## Pull requests

- One statement, or one logical change, per pull request.
- Small, focused commits with clear messages.
- Fill in the pull request template, including the AI disclosure.
- Never commit secrets, tokens or student data.
