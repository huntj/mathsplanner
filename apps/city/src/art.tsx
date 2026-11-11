// The map's art: flat-colour SVG drawn in code, one symbol for each thing, placed with <use>. A
// symbol is one square wide (TILE) and a square and a half tall, so anything tall overlaps the row
// behind it; its own square is the bottom two thirds. Colours come from CSS variables (styles.css),
// so the same drawings serve the light and dark themes.
import type { BuildingType, Material } from "./economy.ts";

/** A square's side, in the map's own units. */
export const TILE = 48;
/** How far a symbol rises above its square. */
export const RISE = 24;

export type Art =
  "tree" | "pond" | "camp" | `outcrop-${Material}` | "site" | `machine-${Material}` | BuildingType;

/** The id a symbol has in the page. */
export const artId = (art: Art) => `art-${art}`;

const shadow = <ellipse cx="24" cy="62" rx="17" ry="5" fill="var(--map-shadow)" />;

/** A machine: a shed in its material's colour with a chimney, and a heap of what it makes. */
const machine = (material: Material) => (
  <symbol id={artId(`machine-${material}`)} viewBox="0 0 48 72" key={`machine-${material}`}>
    {shadow}
    <rect x="30" y="20" width="6" height="18" fill="var(--map-wall-deep)" />
    <rect x="8" y="34" width="30" height="26" rx="2" fill="var(--map-wall)" />
    <path d="M5 36 L23 22 L41 36 Z" fill={`var(--map-${material})`} />
    <rect x="19" y="46" width="9" height="14" rx="1" fill="var(--map-wall-deep)" />
    <path d="M30 62 q7 -14 14 0 Z" fill={`var(--map-${material})`} />
  </symbol>
);

const OUTCROPS: Record<Material, React.ReactNode> = {
  stone: (
    <>
      <path d="M6 62 L11 42 L22 36 L30 46 L28 62 Z" fill="var(--map-stone)" />
      <path d="M24 62 L28 44 L38 40 L44 52 L42 62 Z" fill="var(--map-stone-deep)" />
      <path d="M11 42 L22 36 L20 48 Z" fill="var(--map-stone-light)" />
    </>
  ),
  ore: (
    <>
      <path d="M5 62 L12 40 L24 34 L32 48 L30 62 Z" fill="var(--map-stone-deep)" />
      <path d="M26 62 L30 46 L40 42 L44 62 Z" fill="var(--map-stone)" />
      <path d="M14 48 l5 -4 l4 5 l-5 4 Z M32 52 l4 -3 l3 4 l-4 3 Z" fill="var(--map-ore)" />
    </>
  ),
  timber: (
    <>
      <rect x="11" y="50" width="4" height="12" fill="var(--map-trunk)" />
      <path d="M13 22 L23 52 L3 52 Z" fill="var(--map-timber)" />
      <rect x="31" y="52" width="4" height="10" fill="var(--map-trunk)" />
      <path d="M33 30 L42 54 L24 54 Z" fill="var(--map-leaf-deep)" />
    </>
  ),
  sand: (
    <>
      <path d="M3 62 Q14 38 26 54 Q34 42 45 62 Z" fill="var(--map-sand)" />
      <path d="M26 54 Q34 42 45 62 L30 62 Z" fill="var(--map-sand-deep)" />
    </>
  ),
};

const outcrop = (material: Material) => (
  <symbol id={artId(`outcrop-${material}`)} viewBox="0 0 48 72" key={`outcrop-${material}`}>
    {shadow}
    {OUTCROPS[material]}
  </symbol>
);

/** A small house; the larger buildings get their own drawings as they are added. */
const house = (art: BuildingType, roof: string, wide = false) => (
  <symbol id={artId(art)} viewBox="0 0 48 72" key={art}>
    {shadow}
    <rect
      x={wide ? 5 : 10}
      y="38"
      width={wide ? 38 : 28}
      height="23"
      rx="2"
      fill="var(--map-wall)"
    />
    <path d={wide ? "M2 40 L24 22 L46 40 Z" : "M6 40 L24 24 L42 40 Z"} fill={roof} />
    <rect x="21" y="48" width="7" height="13" rx="1" fill="var(--map-wall-deep)" />
    <rect x={wide ? 9 : 13} y="44" width="6" height="6" fill="var(--map-window)" />
    <rect x={wide ? 33 : 31} y="44" width="6" height="6" fill="var(--map-window)" />
  </symbol>
);

/** Every symbol, to put once inside the map's <defs>. */
export function ArtDefs() {
  return (
    <>
      <symbol id={artId("tree")} viewBox="0 0 48 72">
        {shadow}
        <rect x="21" y="44" width="6" height="18" rx="2" fill="var(--map-trunk)" />
        <circle cx="24" cy="32" r="15" fill="var(--map-leaf)" />
        <circle cx="18" cy="27" r="7" fill="var(--map-leaf-light)" />
      </symbol>
      <symbol id={artId("pond")} viewBox="0 0 48 72">
        <rect x="3" y="28" width="42" height="38" rx="15" fill="var(--map-water)" />
        <path
          d="M12 44 q5 -4 10 0 M24 54 q5 -4 10 0"
          fill="none"
          stroke="var(--map-water-light)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </symbol>
      <symbol id={artId("camp")} viewBox="0 0 48 72">
        {shadow}
        <path d="M4 62 L22 26 L40 62 Z" fill="var(--map-tent)" />
        <path d="M22 26 L27 62 L17 62 Z" fill="var(--map-tent-deep)" />
        <rect x="21" y="10" width="2" height="18" fill="var(--map-trunk)" />
        <path d="M23 10 L35 15 L23 20 Z" fill="var(--dot)" />
        <circle cx="39" cy="55" r="7" fill="var(--dot)" />
        <circle cx="37" cy="54" r="1.2" fill="var(--dot-ink)" />
        <circle cx="41.5" cy="54" r="1.2" fill="var(--dot-ink)" />
      </symbol>
      <symbol id={artId("site")} viewBox="0 0 48 72">
        {shadow}
        <path
          d="M10 62 V34 H38 V62 M10 48 H38 M24 34 V62"
          fill="none"
          stroke="var(--map-trunk)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </symbol>
      {(["stone", "ore", "timber", "sand"] as const).flatMap((m) => [outcrop(m), machine(m)])}
      <symbol id={artId("path")} viewBox="0 0 48 72">
        <rect x="1" y="25" width="46" height="46" rx="6" fill="var(--map-road)" />
      </symbol>
      {house("cottage", "var(--map-roof)")}
      <symbol id={artId("well")} viewBox="0 0 48 72">
        {shadow}
        <rect x="14" y="46" width="20" height="15" rx="3" fill="var(--map-stone)" />
        <path d="M12 38 L24 28 L36 38 Z" fill="var(--map-roof)" />
        <path d="M15 38 V47 M33 38 V47" stroke="var(--map-trunk)" strokeWidth="3" />
      </symbol>
      {house("masons-yard", "var(--map-stone-deep)", true)}
      {house("architects-office", "var(--biro)", true)}
      <symbol id={artId("place-value-monument")} viewBox="0 0 48 72">
        {shadow}
        <rect x="8" y="6" width="32" height="56" rx="3" fill="var(--map-gold)" />
        <path
          d="M12 18 H36 M12 32 H36 M12 46 H36"
          stroke="var(--map-trunk)"
          strokeWidth="2"
          fill="none"
        />
        <g fill="var(--dot)">
          <circle cx="17" cy="18" r="4" />
          <circle cx="26" cy="18" r="4" />
          <circle cx="22" cy="32" r="4" />
          <circle cx="31" cy="46" r="4" />
        </g>
      </symbol>
    </>
  );
}
