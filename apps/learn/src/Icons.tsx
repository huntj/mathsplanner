// Line icons: one for each topic family, drawn on the path's nodes, and a few for the app itself.
// They take the text colour, so they work on any background.
import type { ReactNode } from "react";
import type { Family } from "./families.ts";

function Icon({
  children,
  size = 24,
  label,
}: {
  children: ReactNode;
  size?: number;
  label?: string;
}) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {children}
    </svg>
  );
}

const FAMILY_ICONS: Record<Family, ReactNode> = {
  number: (
    <text
      x="12"
      y="16.2"
      textAnchor="middle"
      fontSize="11.5"
      fontWeight="600"
      fill="currentColor"
      stroke="none"
      style={{ fontFamily: "var(--display)" }}
    >
      123
    </text>
  ),
  calculation: <path d="M7 4v8M3 8h8M14 15l6 6M20 15l-6 6" />,
  // A circle with a quarter shaded.
  fractions: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V3a9 9 0 0 1 9 9z" fill="currentColor" />
    </>
  ),
  algebra: (
    <>
      <path d="M4 7c3 0 4 2 5 5s2 5 5 5M14 7c-3 0-6 7-10 10" />
      <path d="M17 6h4M19 4v4" />
    </>
  ),
  // Two parts of a ratio.
  ratio: (
    <>
      <rect x="3" y="9" width="6" height="11" rx="1" />
      <rect x="15" y="4" width="6" height="16" rx="1" />
      <circle cx="12" cy="10" r="0.9" fill="currentColor" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" />
    </>
  ),
  // A ruler.
  measures: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
    </>
  ),
  // A triangle with one angle marked.
  geometry: (
    <>
      <path d="M3 20h18L9 5z" />
      <path d="M7.5 20a4 4 0 0 0-1.4-3.5" />
    </>
  ),
  statistics: <path d="M4 20V12M10 20V6M16 20v-9M22 20H2" />,
  // A dice face.
  probability: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="16" cy="16" r="1.3" fill="currentColor" />
    </>
  ),
};

export const FamilyIcon = ({ family, size }: { family: Family; size?: number }) => (
  <Icon {...(size ? { size } : {})}>{FAMILY_ICONS[family]}</Icon>
);

export const LockIcon = ({ size }: { size?: number }) => (
  <Icon {...(size ? { size } : {})}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);

export const StarIcon = ({ size, label }: { size?: number; label?: string }) => (
  <Icon {...(size ? { size } : {})} {...(label ? { label } : {})}>
    <path
      d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1-4.4-4.3 6.1-.9z"
      fill="currentColor"
    />
  </Icon>
);

/** A streak: a row of dots, each a day practised. */
export const StreakIcon = ({ size, label }: { size?: number; label?: string }) => (
  <Icon {...(size ? { size } : {})} {...(label ? { label } : {})}>
    <circle cx="4.5" cy="15" r="2" fill="currentColor" stroke="none" />
    <circle cx="11" cy="12.5" r="3" fill="currentColor" stroke="none" />
    <circle cx="19" cy="9" r="4" fill="currentColor" stroke="none" />
  </Icon>
);

export const CheckIcon = ({ size }: { size?: number }) => (
  <Icon {...(size ? { size } : {})}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

/** A unit review: a stack of cards. */
export const ReviewIcon = ({ size }: { size?: number }) => (
  <Icon {...(size ? { size } : {})}>
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M7 5h10M9 2h6" />
  </Icon>
);

export const PathIcon = () => (
  <Icon>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
    <circle cx="8" cy="5" r="2.5" />
    <path d="M8.3 16.9l7.5-3.8M16 10.6L10 6.5" />
  </Icon>
);

export const PersonIcon = () => (
  <Icon>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Icon>
);
