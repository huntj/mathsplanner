// A badge's mark: its shape in gold once earned, or outlined until then, with a star at its heart.
import type { Badge, BadgeShape } from "@mathsplanner/learning";

const OUTLINES: Record<BadgeShape, string> = {
  circle: "M24 3a21 21 0 1 1 0 42a21 21 0 1 1 0-42z",
  star: "M24 2l5.6 7.3 9-1.6-1.6 9L44.3 22l-7.3 5.6 1.6 9-9-1.6L24 42l-5.6-7.3-9 1.6 1.6-9L3.7 22l7.3-5.6-1.6-9 9 1.6z",
  shield: "M24 3l18 6v12c0 11-7.6 19.8-18 24C13.6 40.8 6 32 6 21V9z",
  hexagon: "M24 2.5l19 11v21l-19 11-19-11v-21z",
};

export function BadgeMark({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <svg
      className={`badge-mark${earned ? " earned" : ""}`}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path d={OUTLINES[badge.shape]} className="badge-body" />
      <path
        d="M24 15l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"
        className="badge-star"
      />
    </svg>
  );
}
