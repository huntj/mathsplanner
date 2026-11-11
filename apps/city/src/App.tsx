// Maths City. So far it shows only the counters: the city's rank, power, output and stock, worked
// out from the clock once a second. The map, the lessons and the buildings come in the next steps
// (see docs/proposals/city-game.md).
import type { Stage } from "@mathsplanner/core";
import { dayKey, loadProgress, sectionFor, STORAGE_KEY, YEARS } from "@mathsplanner/learning";
import { useEffect, useRef, useState } from "react";
import {
  loadSave,
  newCity,
  population,
  powerLeft,
  settle,
  storeSave,
  withCity,
  type City,
} from "./city.ts";
import { GOOD_NAMES, GOODS, MATERIALS, rankOf, sumOf, type Good } from "./economy.ts";
import { builtMachines, machinesOf, ratesOf } from "./works.ts";

/** The year to show until the pupil has chosen one in Learn Maths. */
const FIRST_YEAR: Stage = "Y7";
/** How often the stock on screen is brought up to date, and how often it is stored. */
const TICK = 1000;
const STORE_EVERY = 10;

const whole = (n: number) => Math.floor(n).toLocaleString("en-GB");

/** Minutes of power as "1 h 5 min" or "42 min 10 s". */
export function powerText(minutes: number): string {
  const seconds = Math.ceil(minutes * 60);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} h ${m} min`;
  return m > 0 ? `${m} min ${seconds % 60} s` : `${seconds} s`;
}

export function App() {
  const [progress, setProgress] = useState(() => loadProgress());
  const stage = progress.settings.stage ?? FIRST_YEAR;
  const [city, setCity] = useState<City>(
    () => loadSave().cities[stage] ?? newCity(Math.floor(Math.random() * 2 ** 31), Date.now()),
  );
  const [now, setNow] = useState(() => Date.now());

  // Lessons done in Learn Maths, in another tab, change what the machines make.
  useEffect(() => {
    const reread = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(loadProgress());
    };
    window.addEventListener("storage", reread);
    return () => window.removeEventListener("storage", reread);
  }, []);

  // Once a second the stock is brought up to date from the clock; now and then it is stored.
  const latest = useRef(city);
  useEffect(() => {
    let ticks = 0;
    const store = () => storeSave(withCity(loadSave(), stage, latest.current));
    const tick = () => {
      const time = Date.now();
      const rates = ratesOf(latest.current, progress, dayKey(new Date(time)));
      latest.current = settle(latest.current, rates, time);
      setCity(latest.current);
      setNow(time);
      if (++ticks % STORE_EVERY === 0) store();
    };
    const timer = window.setInterval(tick, TICK);
    window.addEventListener("pagehide", store);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pagehide", store);
    };
  }, [progress, stage]);

  const today = dayKey(new Date(now));
  const section = sectionFor(stage);
  const machines = builtMachines(machinesOf(city, progress, today));
  const rates = ratesOf(city, progress, today);
  const rateOf = (good: Good) => MATERIALS.reduce((n, m) => (m === good ? rates[m] : n), 0);
  const power = powerLeft(city, now);
  const skills = section?.units.reduce((n, u) => n + u.skills.length, 0) ?? 0;
  const yearName = YEARS.find((y) => y.stage === stage)?.name ?? stage;

  return (
    <main className="city">
      <header className="city-head">
        <h1>Maths City</h1>
        <p className="city-year">
          {yearName} · {rankOf(machines.length, skills)}
        </p>
      </header>

      <section className="counters" aria-label="Your city">
        <div className="counter">
          <span className="counter-name">Machines</span>
          <span className="counter-value">{machines.length}</span>
        </div>
        <div className="counter">
          <span className="counter-name">Population</span>
          <span className="counter-value">{whole(population(city))}</span>
        </div>
        <div className="counter wide">
          <span className="counter-name">Power</span>
          <span className="counter-value">{power > 0 ? powerText(power) : "None"}</span>
          <span className="counter-note">
            {power > 0
              ? `Making ${sumOf(rates).toLocaleString("en-GB")} a minute`
              : "Finish a lesson to start the machines."}
          </span>
        </div>
      </section>

      <section className="counters" aria-label="In stock">
        {GOODS.map((good) => (
          <div className="counter" key={good}>
            <span className="counter-name">{GOOD_NAMES[good]}</span>
            <span className="counter-value">{whole(city.stock[good])}</span>
            {power > 0 && rateOf(good) > 0 && (
              <span className="counter-note">+{rateOf(good)} a minute</span>
            )}
          </div>
        ))}
      </section>

      <p className="city-note">The map is on its way. For now, these are your city’s numbers.</p>
    </main>
  );
}
