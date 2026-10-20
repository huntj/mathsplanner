import { NUMBERS } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { assertQuality } from "../quality.ts";
import generator from "./Y8-GEO-02.ts";

describe("Y8-GEO-02", () => {
  it("passes the quality checks across 500 seeds", () => {
    assertQuality(generator);
  }, 120_000);

  it("keeps fixed seeds unchanged", () => {
    const fixed = generator.depths.flatMap((depth) =>
      NUMBERS.map((numbers) => generator.generate({ depth, numbers, seed: 1 })),
    );
    expect(fixed).toMatchSnapshot();
  });
});
