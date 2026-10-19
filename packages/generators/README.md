# @mathsplanner/generators

One generator per statement in `data/statements.json`, at `src/<key stage>/<ID>.ts` (`eyfs`, `ks1` … `ks5`). Each picks parameters from a seeded random source and hands the maths to archetypes. This package also holds `pnpm coverage`, which lists statements without a generator and fails if a generator names an unknown statement, and the `pnpm new <ID>` scaffold (a stub until Phase 1). Code is MIT; question text is CC BY 4.0. Generators are written from Phase 4 onwards.
