// The whole plan: every half-term as a card, its items in teaching order and grouped into weeks,
// with each item's prerequisites, beside a list of the course's statements to tick or drag in.
// Each half-term opens its weekly homework, a test, a prerequisite check, or the guided set-up.
import { useMemo, useState, type DragEvent } from "react";
import {
  Dialog,
  HalfTermTest,
  PrerequisiteCheck,
  WeeklyHomework,
  type Navigate,
} from "./SchemeDialogs.tsx";
import {
  COURSES,
  courseById,
  coursePool,
  coverage,
  defaultTitle,
  fileName,
  formatScheme,
  halfTermName,
  lessonsOf,
  MAX_CLASS,
  MAX_LESSONS,
  MAX_TITLE,
  MAX_WEEKS,
  needsOf,
  placeItem,
  placesOf,
  prerequisitesOf,
  removeItem,
  schemeFile,
  setLessons,
  weekPlan,
  type Course,
  type Need,
  type Place,
  type Scheme,
} from "./scheme.ts";
import { OpenFile } from "./SchemeStart.tsx";
import { generatorFor, statementById } from "./session.ts";
import { StatementPicker } from "./StatementPicker.tsx";

interface Action {
  term: number;
  kind: "homework" | "test" | "check";
}

const clampInt = (v: string, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Math.round(Number(v)) || lo));

export function SchemeEditor({ scheme, navigate }: { scheme: Scheme; navigate: Navigate }) {
  const course = courseById.get(scheme.course) ?? (COURSES[0] as Course);
  const update = (next: Scheme) => navigate({ page: "scheme", scheme: next }, true);
  const places = useMemo(() => placesOf(scheme), [scheme]);
  const covered = useMemo(() => coverage(scheme), [scheme]);
  const [target, setTarget] = useState(0);
  const [query, setQuery] = useState("");
  const [unplanned, setUnplanned] = useState(false);
  const [over, setOver] = useState<Place>();
  const [action, setAction] = useState<Action>();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => coursePool(course), [course]);
  const direct = new Map<string, number>();
  scheme.halfTerms.forEach((h, t) => h.items.forEach((id) => direct.set(id, t)));
  const offered = unplanned ? pool.filter((s) => !places.has(s.id)) : pool;
  const planned = direct.size;

  const link = `${window.location.href.split("#")[0]}${formatScheme(scheme)}`;
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([schemeFile(scheme)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName(scheme);
    a.click();
    URL.revokeObjectURL(url);
  };

  const drop = (term: number, index: number | undefined, e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(undefined);
    const id = e.dataTransfer.getData("text/plain");
    if (generatorFor(id)) update(placeItem(scheme, id, term, index));
  };
  const dragStart = (id: string, e: DragEvent) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const years = course.years.map((year, y) => ({
    year,
    terms: scheme.halfTerms.slice(y * 6, y * 6 + 6).map((_, i) => y * 6 + i),
  }));
  const statutory = covered?.unplanned.filter((s) => s.statutory) ?? [];

  return (
    <div className="scheme">
      <div className="scheme-head">
        <p className="breadcrumb no-print">
          <button
            type="button"
            className="link"
            onClick={() => navigate({ page: "scheme", scheme: undefined })}
          >
            Schemes of work
          </button>{" "}
          / {course.name}
        </p>
        <h1>{scheme.title}</h1>
        <div className="controls no-print">
          <label className="title-field">
            Title
            <input
              value={scheme.title}
              maxLength={MAX_TITLE}
              onChange={(e) => update({ ...scheme, title: e.target.value })}
              onBlur={() =>
                update({
                  ...scheme,
                  title: scheme.title.trim() || defaultTitle(course, scheme.className),
                })
              }
            />
          </label>
          <label>
            Class
            <input
              value={scheme.className}
              maxLength={MAX_CLASS}
              placeholder="e.g. 7X2"
              onChange={(e) => update({ ...scheme, className: e.target.value })}
              onBlur={() => update({ ...scheme, className: scheme.className.trim() })}
            />
          </label>
          <label>
            Lessons a week
            <input
              type="number"
              min={1}
              max={MAX_LESSONS}
              value={scheme.lessonsPerWeek}
              onChange={(e) =>
                update({ ...scheme, lessonsPerWeek: clampInt(e.target.value, 1, MAX_LESSONS) })
              }
            />
          </label>
        </div>
        <p className="count">
          {course.name}
          {scheme.className && ` · ${scheme.className}`} · {planned} item{planned === 1 ? "" : "s"}{" "}
          planned · {scheme.halfTerms.reduce((sum, h) => sum + h.weeks, 0)} weeks of{" "}
          {scheme.lessonsPerWeek} lessons
        </p>
        <div className="share no-print">
          <label>
            Link to this scheme
            <input readOnly value={link} onFocus={(e) => e.target.select()} />
          </label>
          <div className="buttons">
            <button type="button" onClick={() => void copy()}>
              {copied ? "Link copied" : "Copy link"}
            </button>
            <button type="button" onClick={download}>
              Download file
            </button>
            <OpenFile
              onOpen={(s) => {
                setError("");
                navigate({ page: "scheme", scheme: s });
              }}
              onError={setError}
            />
            <button type="button" onClick={() => window.print()}>
              Print overview
            </button>
          </div>
        </div>
        {error && <p className="banner error no-print">{error}</p>}
        {covered && covered.all.length > 0 && (
          <details className="coverage no-print">
            <summary>
              <strong>Coverage:</strong>{" "}
              {covered.all.length - covered.unplanned.length - covered.partly.length} of{" "}
              {covered.all.length} {course.years.length === 1 ? course.years[0] : course.name}{" "}
              statements planned
              {covered.partly.length > 0 && `, ${covered.partly.length} in part`}
              {statutory.length > 0 && (
                <span className="warn-count">
                  {" "}
                  · ⚠ {statutory.length} statutory not yet planned
                </span>
              )}
            </summary>
            {covered.unplanned.length + covered.partly.length === 0 ? (
              <p className="muted">Everything is planned.</p>
            ) : (
              <>
                {course.part === 0 && (
                  <p className="muted small">
                    GCSE and Core Maths statements have no set year, so some of these will be taught
                    next year.
                  </p>
                )}
                <ul className="coverage-list">
                  {[...covered.unplanned, ...covered.partly].map((s) => (
                    <li key={s.id}>
                      <span>
                        <code>{s.id}</code> {s.text}
                        {s.statutory && <span className="badge">statutory</span>}
                        {covered.partly.includes(s) && <span className="badge">some steps</span>}
                      </span>
                      <button type="button" onClick={() => update(placeItem(scheme, s.id, target))}>
                        Add to {halfTermName(course, target, true)}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </details>
        )}
      </div>

      <div className="scheme-layout">
        <div className="years">
          {years.map(({ year, terms }) => (
            <section key={year}>
              {course.years.length > 1 && <h2>{year}</h2>}
              <div className="half-terms">
                {terms.map((term) => (
                  <HalfTermCard
                    key={term}
                    scheme={scheme}
                    course={course}
                    term={term}
                    places={places}
                    over={over?.term === term ? over.index : undefined}
                    targeted={target === term}
                    onTarget={() => setTarget(term)}
                    onOver={(index) =>
                      setOver((o) => (o?.term === term && o.index === index ? o : { term, index }))
                    }
                    onLeave={() => setOver(undefined)}
                    onDrop={(index, e) => drop(term, index, e)}
                    onDragStart={dragStart}
                    onAction={(kind) => setAction({ term, kind })}
                    onGuide={() => navigate({ page: "scheme", scheme, guide: term })}
                    update={update}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="scheme-picker no-print">
          <h2>Statements</h2>
          <p className="muted small">
            Tick to add to the chosen half-term, or drag into any half-term. A ticked statement
            includes all its steps; open its steps to plan them one by one.
          </p>
          <div className="controls">
            <label>
              Add to
              <select value={target} onChange={(e) => setTarget(Number(e.target.value))}>
                {scheme.halfTerms.map((_, t) => (
                  <option key={t} value={t}>
                    {halfTermName(course, t)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Search
              <input
                type="search"
                value={query}
                placeholder="ID or words"
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={unplanned}
                onChange={(e) => setUnplanned(e.target.checked)}
              />
              Only what is not yet planned
            </label>
          </div>
          <StatementPicker
            statements={offered}
            query={query}
            isChosen={(id) => direct.has(id)}
            onToggle={(id) =>
              update(direct.has(id) ? removeItem(scheme, id) : placeItem(scheme, id, target))
            }
            note={(id) => {
              const t = direct.get(id);
              return t === undefined ? null : (
                <span className="planned">{halfTermName(course, t, true)}</span>
              );
            }}
            onDragStart={dragStart}
          />
        </aside>
      </div>

      {action && (
        <Dialog close={() => setAction(undefined)}>
          {action.kind === "homework" ? (
            <WeeklyHomework
              scheme={scheme}
              course={course}
              term={action.term}
              navigate={navigate}
              update={update}
            />
          ) : action.kind === "test" ? (
            <HalfTermTest scheme={scheme} course={course} term={action.term} navigate={navigate} />
          ) : (
            <PrerequisiteCheck
              scheme={scheme}
              ids={prerequisitesOf(scheme, action.term)}
              name={halfTermName(course, action.term)}
              seedOffset={action.term}
              navigate={navigate}
            />
          )}
        </Dialog>
      )}
    </div>
  );
}

interface CardProps {
  scheme: Scheme;
  course: Course;
  term: number;
  places: Map<string, Place>;
  /** Where a dragged item would land, if over this half-term. */
  over: number | undefined;
  targeted: boolean;
  onTarget: () => void;
  onOver: (index: number) => void;
  onLeave: () => void;
  onDrop: (index: number | undefined, e: DragEvent) => void;
  onDragStart: (id: string, e: DragEvent) => void;
  onAction: (kind: Action["kind"]) => void;
  onGuide: () => void;
  update: (s: Scheme) => void;
}

function HalfTermCard(p: CardProps) {
  const { scheme, course, term } = p;
  const h = scheme.halfTerms[term] ?? { weeks: 0, items: [] };
  const plan = weekPlan(scheme, term);
  const needs = h.items.map((id) => needsOf(scheme, p.places, id));
  const warnings = needs.filter((ns) =>
    ns.some((n) => n.status === "later" || n.status === "missing"),
  ).length;
  const last = scheme.halfTerms.length - 1;
  const setWeeks = (weeks: number) =>
    p.update({
      ...scheme,
      halfTerms: scheme.halfTerms.map((x, i) => (i === term ? { ...x, weeks } : x)),
    });
  const over = plan.lessons - plan.capacity;

  return (
    <section
      className={`half-term${p.targeted ? " targeted" : ""}`}
      aria-label={halfTermName(course, term)}
      onDragOver={(e) => {
        e.preventDefault();
        p.onOver(h.items.length);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) p.onLeave();
      }}
      onDrop={(e) => p.onDrop(undefined, e)}
    >
      <header>
        <h3>{halfTermName(course, term)}</h3>
        <label className="weeks no-print">
          <input
            type="number"
            min={1}
            max={MAX_WEEKS}
            value={h.weeks}
            aria-label={`Weeks in ${halfTermName(course, term)}`}
            onChange={(e) => setWeeks(clampInt(e.target.value, 1, MAX_WEEKS))}
          />
          weeks
        </label>
        <span className="print-only muted">{h.weeks} weeks</span>
      </header>
      <p className="count small">
        {h.items.length} item{h.items.length === 1 ? "" : "s"} · {plan.lessons} of {plan.capacity}{" "}
        lessons
        {over > 0 && <span className="warn-count"> · ⚠ {over} too many</span>}
        {warnings > 0 && (
          <span className="warn-count">
            {" "}
            · ⚠ {warnings} before {warnings === 1 ? "its" : "their"} prerequisites
          </span>
        )}
        {!p.targeted && (
          <>
            {" "}
            ·{" "}
            <button type="button" className="link no-print" onClick={p.onTarget}>
              add here
            </button>
          </>
        )}
        {p.targeted && <span className="no-print"> · ticked statements go here</span>}
      </p>
      <ol className="items">
        {h.items.map((id, i) => {
          const s = statementById.get(id);
          const up = i > 0 ? [term, i - 1] : term > 0 ? [term - 1, Infinity] : undefined;
          const down =
            i < h.items.length - 1 ? [term, i + 2] : term < last ? [term + 1, 0] : undefined;
          const week = plan.starts[i] ?? 0;
          const newWeek = i === 0 || plan.starts[i - 1] !== week;
          const lessons = lessonsOf(scheme, id);
          return [
            newWeek && (
              <li key={`week-${week}`} className="week-label" aria-hidden="true">
                Week {week + 1}
              </li>
            ),
            <li
              key={id}
              className={p.over === i ? "drop-before" : undefined}
              draggable
              onDragStart={(e) => p.onDragStart(id, e)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                p.onOver(i);
              }}
              onDrop={(e) => p.onDrop(i, e)}
            >
              <span className="handle no-print" aria-hidden="true">
                ⋮⋮
              </span>
              <div className="item">
                <span>
                  <code>{id}</code> {s?.text}
                  <span className="visually-hidden">, week {week + 1}</span>
                </span>
                <div className="item-foot">
                  <Needs
                    needs={needs[i] ?? []}
                    course={course}
                    onAdd={(need) => p.update(placeItem(scheme, need, term, i))}
                  />
                  <span className="item-buttons no-print">
                    <select
                      aria-label={`Lessons for ${id}`}
                      title="Lessons"
                      value={lessons}
                      onChange={(e) => p.update(setLessons(scheme, id, Number(e.target.value)))}
                    >
                      {Array.from({ length: MAX_LESSONS }, (_, n) => (
                        <option key={n} value={n + 1}>
                          {n + 1} lesson{n ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`Move ${id} up`}
                      disabled={!up}
                      onClick={() => up && p.update(placeItem(scheme, id, up[0] ?? 0, up[1]))}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${id} down`}
                      disabled={!down}
                      onClick={() => down && p.update(placeItem(scheme, id, down[0] ?? 0, down[1]))}
                    >
                      ↓
                    </button>
                    <select
                      aria-label={`Move ${id} to another half-term`}
                      value={term}
                      onChange={(e) => p.update(placeItem(scheme, id, Number(e.target.value)))}
                    >
                      {scheme.halfTerms.map((_, t) => (
                        <option key={t} value={t}>
                          {halfTermName(course, t, true)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`Remove ${id}`}
                      onClick={() => p.update(removeItem(scheme, id))}
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </li>,
          ];
        })}
        {(h.items.length === 0 || p.over === h.items.length) && (
          <li className={`placeholder no-print${p.over === h.items.length ? " drop-here" : ""}`}>
            {p.over !== undefined
              ? "Drop here"
              : "Choose topics, drag statements here, or tick them in the list."}
          </li>
        )}
      </ol>
      <div className="buttons no-print">
        <button type="button" onClick={p.onGuide}>
          Topics
        </button>
        <button type="button" disabled={!h.items.length} onClick={() => p.onAction("homework")}>
          Homework
        </button>
        <button type="button" disabled={!h.items.length} onClick={() => p.onAction("test")}>
          Test
        </button>
        <button type="button" disabled={!h.items.length} onClick={() => p.onAction("check")}>
          Check prerequisites
        </button>
      </div>
    </section>
  );
}

const STATUS_TEXT: Record<Need["status"], string> = {
  earlier: "taught earlier",
  later: "taught later",
  missing: "not in the scheme",
  prior: "from an earlier year",
};
const STATUS_MARK: Record<Need["status"], string> = {
  earlier: "✓",
  later: "⚠",
  missing: "⚠",
  prior: "",
};

/** An item's prerequisites, each marked by whether it is taught first. */
function Needs({
  needs,
  course,
  onAdd,
}: {
  needs: Need[];
  course: Course;
  onAdd: (id: string) => void;
}) {
  if (needs.length === 0) return null;
  return (
    <span className="needs">
      <span className="muted">Needs</span>
      {needs.map((n) => {
        const where = n.place ? `, in ${halfTermName(course, n.place.term)}` : "";
        const text = statementById.get(n.id)?.text ?? "";
        const title = `${n.id}: ${text} (${STATUS_TEXT[n.status]}${where})`;
        const body = (
          <>
            {STATUS_MARK[n.status] && <span aria-hidden="true">{STATUS_MARK[n.status]} </span>}
            {n.id}
            <span className="visually-hidden">
              , {STATUS_TEXT[n.status]}
              {where}
            </span>
          </>
        );
        const kind = n.status === "earlier" ? "ok" : n.status === "prior" ? "prior" : "warn";
        return n.status === "missing" && generatorFor(n.id) ? (
          <button
            key={n.id}
            type="button"
            className={`need ${kind}`}
            title={`${title}. Add it just before.`}
            onClick={() => onAdd(n.id)}
          >
            {body} <span aria-hidden="true">+</span>
            <span className="visually-hidden">: add it just before</span>
          </button>
        ) : (
          <span key={n.id} className={`need ${kind}`} title={title}>
            {body}
          </span>
        );
      })}
    </span>
  );
}
