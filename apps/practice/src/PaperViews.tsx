// Setting up a year test or a unit test. Both make an ordinary session link with a paper attached,
// so the paper can be printed as a worksheet or taken on screen, exactly like a practice set.
import { DEPTHS, NUMBERS, type Depth, type Numbers } from "@mathsplanner/core";
import { useMemo, useState } from "react";
import {
  stageName,
  STAGE_NAMES,
  TOPICS,
  topicOf,
  unitPool,
  yearPool,
  type TopicId,
} from "./papers.ts";
import {
  DEFAULT_SHEET,
  formatRoute,
  itemMarks,
  MAX_MARKS,
  MAX_QUESTIONS,
  specTitle,
  practisable,
  sessionItems,
  statements,
  type FeedbackMode,
  type Paper,
  type Route,
  type SessionSpec,
} from "./session.ts";

export const DEPTH_NAMES: Record<Depth, string> = {
  1: "Fluency",
  2: "Varied fluency",
  3: "Representation",
  4: "Reasoning",
  5: "Problem solving",
};

const randomSeed = () => Math.floor(Math.random() * 1_000_000);
const STAGES = Object.keys(STAGE_NAMES);
const hasQuestions = new Set(practisable.map((s) => s.id));
const clamp = (v: string, lo: number, hi: number, fallback: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && v !== "" ? Math.min(hi, Math.max(lo, n)) : fallback;
};

type Navigate = (route: Route) => void;

/** The settings every paper shares: size, mark total, numbers, feedback and seed. */
export function useCommon(
  initial: { count: number; feedback: FeedbackMode } = { count: 20, feedback: "end" },
) {
  const [count, setCount] = useState(initial.count);
  const [marks, setMarks] = useState(0);
  const [numbers, setNumbers] = useState<Numbers>("standard");
  const [feedback, setFeedback] = useState<FeedbackMode>(initial.feedback);
  const [seed, setSeed] = useState(randomSeed);
  return {
    count,
    setCount,
    marks,
    setMarks,
    numbers,
    setNumbers,
    feedback,
    setFeedback,
    seed,
    setSeed,
  };
}

export function CommonControls({
  c,
  marks = true,
}: {
  c: ReturnType<typeof useCommon>;
  /** Whether to offer a mark total, which only papers use. */
  marks?: boolean;
}) {
  return (
    <>
      <label>
        Questions
        <input
          type="number"
          min={1}
          max={MAX_QUESTIONS}
          value={c.count}
          onChange={(e) => c.setCount(clamp(e.target.value, 1, MAX_QUESTIONS, 1))}
        />
      </label>
      {marks && (
        <label>
          Marks
          <input
            type="number"
            min={0}
            max={MAX_MARKS}
            value={c.marks || ""}
            placeholder="Any"
            onChange={(e) => c.setMarks(clamp(e.target.value, 0, MAX_MARKS, 0))}
          />
        </label>
      )}
      <label>
        Numbers
        <select value={c.numbers} onChange={(e) => c.setNumbers(e.target.value as Numbers)}>
          {NUMBERS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="radio">
        <legend>On screen</legend>
        <label className="check">
          <input
            type="radio"
            name="feedback"
            checked={c.feedback === "end"}
            onChange={() => c.setFeedback("end")}
          />
          Marks only at the end
        </label>
        <label className="check">
          <input
            type="radio"
            name="feedback"
            checked={c.feedback === "each"}
            onChange={() => c.setFeedback("each")}
          />
          Feedback after each question
        </label>
      </fieldset>
      <label>
        Seed
        <span className="seed">
          <input
            type="number"
            min={0}
            value={c.seed}
            onChange={(e) => c.setSeed(clamp(e.target.value, 0, Number.MAX_SAFE_INTEGER, 0))}
          />
          <button type="button" onClick={() => c.setSeed(randomSeed())}>
            New
          </button>
        </span>
      </label>
    </>
  );
}

/** The paper that the settings make, with its total marks, its link and what to do with it. */
export function PaperActions({
  spec,
  navigate,
  print = "Print the paper",
}: {
  spec: SessionSpec | undefined;
  navigate: Navigate;
  print?: string;
}) {
  const [copied, setCopied] = useState(false);
  const items = useMemo(() => (spec ? sessionItems(spec) : []), [spec]);
  const total = useMemo(
    () => (spec ? items.reduce((sum, item) => sum + itemMarks(item, spec.numbers), 0) : 0),
    [items, spec],
  );
  const link =
    spec && items.length
      ? `${window.location.href.split("#")[0]}${formatRoute({ page: "session", spec })}`
      : "";
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const target = spec?.paper?.marks ?? 0;
  return (
    <>
      {spec && items.length > 0 && (
        <p className="count">
          {items.length} question{items.length === 1 ? "" : "s"} · {total} mark
          {total === 1 ? "" : "s"}
          {target > 0 && total !== target && (
            <>
              {" "}
              (aiming for {target}. Marks follow depth: depths 1 and 2 are usually worth 1 mark,
              depths 4 and 5 worth 2 or 3. Change the number of questions or the depths to get
              closer)
            </>
          )}{" "}
          · drawn from {new Set(spec.statements).size} statements
        </p>
      )}
      {spec && items.length === 0 && (
        <p className="banner warning">There are no questions for these settings. Choose more.</p>
      )}
      <div className="share">
        <label>
          Link for your class
          <input readOnly value={link} onFocus={(e) => e.target.select()} />
        </label>
        <div className="buttons">
          <button type="button" disabled={!link} onClick={() => void copy()}>
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            className="primary"
            disabled={!link || !spec}
            onClick={() =>
              spec &&
              navigate({
                page: "worksheet",
                spec,
                sheet: { ...DEFAULT_SHEET, title: specTitle(spec, DEFAULT_SHEET.title) },
              })
            }
          >
            {print}
          </button>
          <button
            type="button"
            disabled={!link || !spec}
            onClick={() => spec && navigate({ page: "session", spec })}
          >
            Take it on screen
          </button>
        </div>
      </div>
    </>
  );
}

export function DepthSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Depth;
  onChange: (d: Depth) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(Number(e.target.value) as Depth)}>
        {DEPTHS.map((d) => (
          <option key={d} value={d}>
            {d} {DEPTH_NAMES[d]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function YearTestView({ navigate }: { navigate: Navigate }) {
  const c = useCommon();
  const [stage, setStage] = useState("Y5");
  const [start, setStart] = useState<Depth>(1);
  const [end, setEnd] = useState<Depth>(4);
  const pool = useMemo(
    () => yearPool(statements, stage).filter((id) => hasQuestions.has(id)),
    [stage],
  );
  const spec = useMemo<SessionSpec | undefined>(() => {
    if (pool.length === 0) return undefined;
    const paper: Paper = { kind: "year", stage, start, end, marks: c.marks };
    const depths = DEPTHS.filter((d) => d >= Math.min(start, end) && d <= Math.max(start, end));
    return {
      statements: pool,
      depths,
      numbers: c.numbers,
      count: c.count,
      seed: c.seed,
      feedback: c.feedback,
      paper,
    };
  }, [pool, stage, start, end, c.marks, c.numbers, c.count, c.seed, c.feedback]);

  return (
    <>
      <h1>Year test</h1>
      <p className="lede">
        A paper drawn from everything in one year. The questions start at one depth and build up (or
        down) to another, and can aim at a total number of marks. Print it, or share the link so
        students take it on screen.
      </p>
      <div className="controls">
        <label>
          Year
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {stageName(s)}
              </option>
            ))}
          </select>
        </label>
        <DepthSelect label="Start at depth" value={start} onChange={setStart} />
        <DepthSelect label="End at depth" value={end} onChange={setEnd} />
        <CommonControls c={c} />
      </div>
      <PaperActions spec={spec} navigate={navigate} />
    </>
  );
}

export function UnitTestView({ navigate }: { navigate: Navigate }) {
  const c = useCommon();
  const [topic, setTopic] = useState<TopicId>("algebra");
  const [stages, setStages] = useState<string[]>(["Y7", "Y8"]);
  const [depths, setDepths] = useState<Depth[]>([1, 2, 3, 4]);

  // How many statements each stage has in this topic, so empty years can be hidden.
  const perStage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of statements)
      if (hasQuestions.has(s.id) && topicOf(s) === topic)
        counts.set(s.stage, (counts.get(s.stage) ?? 0) + 1);
    return counts;
  }, [topic]);
  const chosen = stages.filter((s) => perStage.has(s));
  const pool = useMemo(
    () => unitPool(statements, topic, chosen).filter((id) => hasQuestions.has(id)),
    [topic, chosen.join()],
  );
  const spec = useMemo<SessionSpec | undefined>(() => {
    if (pool.length === 0 || depths.length === 0) return undefined;
    const paper: Paper = { kind: "unit", topic, stages: chosen, marks: c.marks };
    return {
      statements: pool,
      depths,
      numbers: c.numbers,
      count: c.count,
      seed: c.seed,
      feedback: c.feedback,
      paper,
    };
  }, [pool, depths, topic, chosen.join(), c.marks, c.numbers, c.count, c.seed, c.feedback]);

  const toggleStage = (s: string) =>
    setStages((xs) =>
      xs.includes(s) ? xs.filter((x) => x !== s) : STAGES.filter((x) => x === s || xs.includes(x)),
    );

  return (
    <>
      <h1>Unit test</h1>
      <p className="lede">
        A paper on one topic, across the years you choose and at the depths you choose, to test a
        strand of maths. Questions run from the lowest depth to the highest.
      </p>
      <div className="controls">
        <label>
          Topic
          <select value={topic} onChange={(e) => setTopic(e.target.value as TopicId)}>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="years">
        <legend>Years</legend>
        {STAGES.filter((s) => perStage.has(s)).map((s) => (
          <label key={s} className="check">
            <input type="checkbox" checked={stages.includes(s)} onChange={() => toggleStage(s)} />
            {stageName(s)} <span className="muted">({perStage.get(s)})</span>
          </label>
        ))}
      </fieldset>
      <div className="controls">
        <fieldset className="depths">
          <legend>Depths</legend>
          {DEPTHS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={depths.includes(d)}
              onClick={() =>
                setDepths((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d].sort()))
              }
            >
              {d} <span>{DEPTH_NAMES[d]}</span>
            </button>
          ))}
        </fieldset>
        <CommonControls c={c} />
      </div>
      {chosen.length === 0 && <p className="banner warning">Choose at least one year.</p>}
      <PaperActions spec={spec} navigate={navigate} />
    </>
  );
}
