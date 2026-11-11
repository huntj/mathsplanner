// Maths City. So far: the counters and the map of the first zone, Place value. The lessons and the
// buildings come in the next steps (see docs/proposals/city-game.md). Adding #demo to the address
// shows a made-up full Year 7 city instead, to see how a busy map draws; it is never saved.
import type { Stage } from "@mathsplanner/core";
import { dayKey, loadProgress, sectionFor, STORAGE_KEY, YEARS } from "@mathsplanner/learning";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadSave, newCity, settle, storeSave, withCity, type City } from "./city.ts";
import { CityScreen } from "./CityScreen.tsx";
import { demoCity } from "./demo.ts";
import { makeMap } from "./map.ts";
import { machinesOf, ratesOf } from "./works.ts";

/** The year to show until the pupil has chosen one in Learn Maths. */
const FIRST_YEAR: Stage = "Y7";
/** The zones built so far. */
const ZONES = ["y7-place-value"];
/** How often the stock on screen is brought up to date, and how often it is stored. */
const TICK = 1000;
const STORE_EVERY = 10;

const yearNameOf = (stage: Stage) => YEARS.find((y) => y.stage === stage)?.name ?? stage;
const skillsIn = (stage: Stage) =>
  sectionFor(stage)?.units.reduce((n, u) => n + u.skills.length, 0) ?? 0;

function Demo() {
  const demo = useMemo(() => demoCity(sectionFor("Y7")?.units ?? [], 2026), []);
  return (
    <CityScreen
      yearName="Year 7"
      skillsInYear={skillsIn("Y7")}
      map={demo.map}
      city={demo.city}
      machines={demo.machines}
      now={0}
      note="A made-up city, to try the map."
    />
  );
}

function Game() {
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

  const map = useMemo(
    () => makeMap(sectionFor(stage)?.units.filter((u) => ZONES.includes(u.id)) ?? [], city.seed),
    [stage, city.seed],
  );

  return (
    <CityScreen
      yearName={yearNameOf(stage)}
      skillsInYear={skillsIn(stage)}
      map={map}
      city={city}
      machines={machinesOf(city, progress, dayKey(new Date(now)))}
      now={now}
    />
  );
}

export function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const changed = () => setHash(window.location.hash);
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  return hash === "#demo" ? <Demo /> : <Game />;
}
