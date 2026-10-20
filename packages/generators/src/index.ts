// @mathsplanner/generators: one generator per statement, by key stage. See docs/design.md.
import type { Generator } from "@mathsplanner/core";
import exampleY5Geo04 from "./examples/Y5-GEO-04.ts";

/** Reviewed generators. None yet: the first arrive with the Phase 4 angles and geometry slice. */
export const generators: Generator[] = [];

/** Unreviewed placeholders that exercise the gallery; real generators replace them. */
export const examples: Generator[] = [exampleY5Geo04 as Generator];
