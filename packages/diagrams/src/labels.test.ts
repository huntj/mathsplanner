import { describe, expect, it } from "vitest";
import { segmentHitsRect } from "./geom.ts";
import { placeLabels, type LabelRequest } from "./labels.ts";
import { layoutLabel } from "./text.ts";

const text = layoutLabel("ABC");
const request = (id: string, ...candidates: [number, number][]): LabelRequest => ({
  id,
  text,
  candidates,
});

describe("segmentHitsRect", () => {
  const r = { x: 0, y: 0, w: 10, h: 10 };
  it("detects crossing, inside and missing segments", () => {
    expect(
      segmentHitsRect(
        [
          [-5, 5],
          [15, 5],
        ],
        r,
      ),
    ).toBe(true);
    expect(
      segmentHitsRect(
        [
          [2, 2],
          [3, 3],
        ],
        r,
      ),
    ).toBe(true);
    expect(
      segmentHitsRect(
        [
          [-5, -5],
          [-1, 20],
        ],
        r,
      ),
    ).toBe(false);
    expect(
      segmentHitsRect(
        [
          [-5, 12],
          [15, 12],
        ],
        r,
      ),
    ).toBe(false);
    expect(
      segmentHitsRect(
        [
          [-5, -5],
          [15, 15],
        ],
        r,
      ),
    ).toBe(true);
  });
});

describe("placeLabels", () => {
  it("takes the first free candidate", () => {
    const { placements, collisions } = placeLabels([request("a", [0, 0], [100, 0])], []);
    expect(collisions).toEqual([]);
    expect(placements[0]?.candidate).toBe(0);
  });

  it("skips candidates blocked by lines or other labels", () => {
    const { placements, collisions } = placeLabels(
      [request("first", [0, 0]), request("second", [0, 0], [0, 5], [200, 0])],
      [
        {
          id: "line",
          segment: [
            [-50, 5],
            [50, 5],
          ],
        },
      ],
    );
    // "first" has no free spot, so it is reported; "second" moves out of the way.
    expect(collisions.map((c) => c.label)).toEqual(["first"]);
    expect(placements[1]?.candidate).toBe(2);
  });

  it("moves an earlier label to make room for a later one", () => {
    const { placements, collisions } = placeLabels(
      [request("movable", [0, 0], [300, 0]), request("stuck", [0, 0])],
      [],
    );
    expect(collisions).toEqual([]);
    expect(placements.map((p) => [p.id, p.candidate])).toEqual([
      ["movable", 1],
      ["stuck", 0],
    ]);
  });

  it("reports every overlap it cannot avoid, once each", () => {
    const { collisions } = placeLabels(
      [request("a", [0, 0]), request("b", [0, 0])],
      [
        {
          id: "curve",
          segment: [
            [-50, 0],
            [50, 0],
          ],
        },
        {
          id: "curve",
          segment: [
            [-50, 1],
            [50, 1],
          ],
        },
      ],
    );
    expect(collisions).toEqual([
      { label: "a", with: "curve" },
      { label: "b", with: "curve" },
      { label: "b", with: "a" },
    ]);
  });

  it("leaves out an optional label rather than overlap", () => {
    const { placements, collisions } = placeLabels(
      [{ ...request("tick", [0, 0]), optional: true }],
      [
        {
          id: "curve",
          segment: [
            [-50, 0],
            [50, 0],
          ],
        },
      ],
    );
    expect(placements).toEqual([]);
    expect(collisions).toEqual([]);
  });
});
