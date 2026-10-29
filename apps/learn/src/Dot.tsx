// Dot, the mascot: a decimal point come to life. Later steps teach Dot to take the shape of the topic
// being practised; for now Dot is round, and happy or cheering.

export type Mood = "happy" | "cheer";

export function Dot({ size = 64, mood = "happy" }: { size?: number; mood?: Mood }) {
  return (
    <svg
      className={`dot dot-${mood}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Dot"
    >
      <ellipse cx="50" cy="93" rx="26" ry="4" className="dot-shadow" />
      <g className="dot-body">
        <circle cx="50" cy="52" r="38" className="dot-fill" />
        <circle cx="36" cy="36" r="9" className="dot-shine" />
        <ellipse cx="38" cy="50" rx="5" ry="7" className="dot-eye" />
        <ellipse cx="62" cy="50" rx="5" ry="7" className="dot-eye" />
        <circle cx="39.5" cy="47.5" r="1.8" className="dot-glint" />
        <circle cx="63.5" cy="47.5" r="1.8" className="dot-glint" />
        <circle cx="29" cy="63" r="5" className="dot-cheek" />
        <circle cx="71" cy="63" r="5" className="dot-cheek" />
        {mood === "cheer" ? (
          <path d="M39 62 Q50 76 61 62 Z" className="dot-mouth-open" />
        ) : (
          <path d="M41 63 Q50 71 59 63" className="dot-mouth" />
        )}
      </g>
    </svg>
  );
}
