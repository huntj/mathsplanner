import { NUMBERS } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { assertQuality } from "../quality.ts";
import generator from "./GH-G19.ts";

describe("GH-G19", () => {
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
