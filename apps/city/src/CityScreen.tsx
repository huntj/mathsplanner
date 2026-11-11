// The game's one screen so far: the counters across the top, the map filling the rest, zoom
// buttons, and a sheet that slides up for the square that was chosen.
import { useEffect, useMemo, useState } from "react";
import { population, powerLeft, type City, type Tile } from "./city.ts";
import {
  GOOD_NAMES,
  GOODS,
  MATERIALS,
  rankOf,
  sumOf,
  totalRates,
  type Good,
  type MachineState,
} from "./economy.ts";
import type { WorldMap } from "./map.ts";
import { MapView, ZOOMS } from "./MapView.tsx";
import { placedIn, thingAt } from "./tiles.ts";

const whole = (n: number) => Math.floor(n).toLocaleString("en-GB");

/** Minutes of power as "1 h 5 min" or "42 min 10 s". */
export function powerText(minutes: number): string {
  const seconds = Math.ceil(minutes * 60);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} h ${m} min`;
  return m > 0 ? `${m} min ${seconds % 60} s` : `${seconds} s`;
}

export function CityScreen({
  yearName,
  skillsInYear,
  map,
  city,
  machines,
  now,
  note,
}: {
  yearName: string;
  skillsInYear: number;
  map: WorldMap;
  city: City;
  machines: readonly MachineState[];
  now: number;
  /** A line under the title, for the made-up city. */
  note?: string;
}) {
  const [zoomAt, setZoomAt] = useState(2);
  const [cursor, setCursor] = useState<Tile>(map.camp);
  const [open, setOpen] = useState<Tile>();
  const zoom = ZOOMS[zoomAt] ?? 1;
  const step = (by: 1 | -1) => setZoomAt((z) => Math.min(ZOOMS.length - 1, Math.max(0, z + by)));

  // The stock changes every second, but the map is redrawn only when something on it does:
  // machineKey stands for the machines, which are a new list each time.
  const machineKey = machines.map((m) => `${m.skill}:${m.tier}:${m.rate}:${m.due}`).join("|");
  const placed = useMemo(
    () => placedIn(city, machines),
    [city.machines, city.buildings, machineKey],
  );

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(undefined);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const built = machines.filter((m) => m.tier > 0);
  const rates = totalRates(built);
  const power = powerLeft(city, now);
  const rateOf = (good: Good) => MATERIALS.reduce((n, m) => (m === good ? rates[m] : n), 0);
  const shown = GOODS.filter((g) => g === "stone" || city.stock[g] >= 1 || rateOf(g) > 0);
  const chosen = open ? thingAt(map, placed, open) : undefined;

  return (
    <div className="city">
      <header className="hud">
        <div className="hud-title">
          <h1>Maths City</h1>
          <p>
            {yearName} · {rankOf(built.length, skillsInYear)} · {whole(population(city))} people
          </p>
          {note && <p className="hud-note">{note}</p>}
        </div>
        <ul className="chips" aria-label="Your city">
          <li className="chip">
            <span className="chip-name">Power</span>
            <span className="chip-value">{power > 0 ? powerText(power) : "None"}</span>
            <span className="chip-note">
              {power > 0 ? `${sumOf(rates)} a minute` : "Finish a lesson"}
            </span>
          </li>
          {shown.map((good) => (
            <li className="chip" key={good}>
              <span className="chip-name">{GOOD_NAMES[good]}</span>
              <span className="chip-value">{whole(city.stock[good])}</span>
              {power > 0 && rateOf(good) > 0 && (
                <span className="chip-note">+{rateOf(good)} a minute</span>
              )}
            </li>
          ))}
        </ul>
      </header>

      <div className="map-area">
        <MapView
          map={map}
          placed={placed}
          zoom={zoom}
          cursor={cursor}
          marked={open !== undefined}
          onCursor={setCursor}
          onOpen={setOpen}
          onZoom={step}
        />

        <div className="zoom">
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoomAt === ZOOMS.length - 1}
            onClick={() => step(1)}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoomAt === 0}
            onClick={() => step(-1)}
          >
            −
          </button>
        </div>
      </div>

      {chosen && (
        <section
          className={`sheet ${chosen.family ? `family-${chosen.family}` : ""}`}
          role="status"
        >
          <div className="sheet-text">
            <h2>{chosen.title}</h2>
            {chosen.skill && <p className="sheet-skill">{chosen.skill}</p>}
            <p>{chosen.text}</p>
          </div>
          <button type="button" className="sheet-close" onClick={() => setOpen(undefined)}>
            Close
          </button>
        </section>
      )}
    </div>
  );
}
