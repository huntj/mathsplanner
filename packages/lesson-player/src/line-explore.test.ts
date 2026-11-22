import type { LineScene } from "@mathsplanner/learning/unit-lessons";
import { describe, expect, it } from "vitest";
import { lineText, lineValue, sceneReadouts } from "./interactive-screens.tsx";

describe("a number-line Explore's readouts", () => {
  it("rounds half up, past float error", () => {
    expect(lineValue({ label: "", round: 1 }, 3.45)).toBe(3.5);
    expect(lineValue({ label: "", round: 2 }, 1.005)).toBe(1.01);
    expect(lineValue({ label: "", round: 1 }, 7.96)).toBe(8);
    expect(lineValue({ label: "", nearest: 10 }, 45)).toBe(50);
    expect(lineValue({ label: "", nearest: 100 }, 1249)).toBe(1200);
  });

  it("rounds to significant figures at any size", () => {
    expect(lineValue({ label: "", sf: 1 }, 0.0347)).toBe(0.03);
    expect(lineValue({ label: "", sf: 2 }, 0.0347)).toBe(0.035);
    expect(lineValue({ label: "", sf: 1 }, 4562)).toBe(5000);
    expect(lineValue({ label: "", sf: 2 }, 96)).toBe(96);
  });

  it("works out what a number becomes, with no float dust", () => {
    expect(lineValue({ label: "", times: 10 }, 0.07)).toBe(0.7);
    expect(lineValue({ label: "", plus: 0.2 }, 0.1)).toBe(0.3);
    expect(lineValue({ label: "", power: 2 }, 1.1)).toBe(1.21);
  });

  it("rounds a readout to the places asked for", () => {
    const scene: LineScene = {
      kind: "line",
      min: 1,
      max: 100,
      step: 1,
      start: 30,
      tick: 10,
      dp: 0,
      readouts: [{ label: "Square root", power: 0.5, dp: 2 }],
    };
    expect(sceneReadouts(scene, 30)[0]?.value).toBe("5.48");
    expect(sceneReadouts(scene, 36)[0]?.value).toBe("6.00");
  });

  it("writes a number with a true minus and the places asked for", () => {
    expect(lineText(-3)).toBe("−3");
    expect(lineText(8, 1)).toBe("8.0");
    expect(lineText(0.30000000000000004)).toBe("0.3");
  });
});
