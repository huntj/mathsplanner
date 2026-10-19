## What this changes

<!-- One statement or one logical change. For a generator, give the statement ID and its "I can…" text. -->

Closes #

## Type of change

- [ ] New generator
- [ ] Change to an existing generator (version bumped if questions change)
- [ ] Statement or misconception data
- [ ] Shared package (core, diagrams, archetypes, marking, render)
- [ ] App, tooling, docs or CI

## Checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm data:check` pass locally
- [ ] `pnpm coverage` reports no unknown statement IDs
- [ ] No secrets, tokens or student data are included

For generators:

- [ ] The file is at `packages/generators/src/<key stage>/<ID>.ts` with a complete header (`@statement`, `@author`, `@ai-assisted`)
- [ ] Every supported depth and numbers setting passes the checks across 500 seeds
- [ ] Every misconception code is in `data/misconceptions.json`
- [ ] It ships an independent `verify`
- [ ] A teacher has reviewed it in the gallery against the [review checklist](../CONTRIBUTING.md#review-checklist) and is recorded with `@reviewed` in the header

## AI assistance

- [ ] No AI tools were used
- [ ] AI tools were used (required: say which tool and what it did below)

<!-- e.g. "Claude drafted the params and depth 1-3 builders; I rewrote depth 4 and wrote verify." -->

## Notes for reviewers

<!-- Anything you are unsure about, seeds worth looking at, screenshots from the gallery. -->
