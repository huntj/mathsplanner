# @mathsplanner/core

The foundation every generator builds on: the `Statement` and `Question` schema types, a seeded random source so every question is reproducible from its key, exact rationals (BigInt), surds and polynomials, "nice" number pickers, LaTeX formatting helpers and `defineGenerator`, which wraps a generator with seeding, retries and statement metadata. In Phase 0 it holds only the `Statement` data types used by the importer; everything else arrives in Phase 1.
