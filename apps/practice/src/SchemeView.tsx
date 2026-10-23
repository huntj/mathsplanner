// The scheme-of-work planner: choose a course, then fill six half-terms a year with statements and
// steps, in teaching order, by ticking or dragging them from the list. Each item shows its
// prerequisites and whether they come first. Each half-term makes homework or a test from the
// existing generators. The scheme is kept in the page's link (and the browser remembers the last
// one); it is shared as that link or as a downloaded file, so nothing is stored on a server.
import { DEPTHS, type Depth } from "@mathsplanner/core";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  CommonControls,
  DEPTH_NAMES,
  DepthSelect,
  PaperActions,
  useCommon,
} from "./PaperViews.tsx";
import {
  COURSES,
  courseById,
  coursePool,
  draftScheme,
  earlierItems,
  emptyScheme,
  fileName,
  formatScheme,
  halfTermName,
  MAX_TITLE,
  MAX_WEEKS,
  needsOf,
  parseScheme,
  placeItem,
  placesOf,
  readSchemeFile,
  removeItem,
  schemeFile,
  TERMS,
  yearSoFar,
  type Course,
  type Need,
  type Place,
  type Scheme,
} from "./scheme.ts";
import { generatorFor, statementById, type Route, type SessionSpec } from "./session.ts";
import { StatementPicker } from "./StatementPicker.tsx";

type Navigate = (route: Route, replace?: boolean) => void;

const STORE = "mathsplanner:scheme";

/** The last scheme this browser edited, if any; storage can be blocked, so failures are ignored. */
function stored(): Scheme | undefined {
  try {
    const hash = window.localStorage.getItem(STORE);
    return hash ? parseScheme(hash.split("?")[1] ?? "") : undefined;
  } catch {
    return undefined;
  }
}

function remember(scheme: Scheme) {
  try {
    window.localStorage.setItem(STORE, formatScheme(scheme));
  } catch {
    // Private windows can refuse storage; the link still holds the scheme.
  }
}

/** Opens a downloaded scheme file chosen by the teacher. */
function OpenFile({
  onOpen,
  onError,
}: {
  onOpen: (s: Scheme) => void;
  onError: (m: string) => void;
}) {
  return (
    <label className="file-button">
      <input
        type="file"
        accept=".json,application/json"
        className="visually-hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            onOpen(readSchemeFile(await file.text()));
          } catch (err) {
            onError(err instanceof Error ? err.message : String(err));
          }
        }}
      />
      Open a file
    </label>
  );
}

export function SchemeView({
  scheme,
  navigate,
}: {
  scheme: Scheme | undefined;
  navigate: Navigate;
}) {
  useEffect(() => {
    if (scheme) remember(scheme);
  }, [scheme]);
  return scheme ? (
    <SchemeEditor scheme={scheme} navigate={navigate} />
  ) : (
    <SchemeStart navigate={navigate} />
  );
}

function SchemeStart({ navigate }: { navigate: Navigate }) {
  const [courseId, setCourseId] = useState("Y7");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const last = useMemo(stored, []);
  const course = courseById.get(courseId) ?? (COURSES[0] as Course);
  const open = (scheme: Scheme) => navigate({ page: "scheme", scheme });
  const name = title.trim().slice(0, MAX_TITLE) || undefined;

  return (
    <>
      <h1>Plan a scheme of work</h1>
      <p className="lede">
        Plan a year, a key stage or a course in half-terms, six a year, by choosing statements and
        their steps for each one. Each item shows what it needs first, and each half-term makes
        homework and tests. The scheme lives in its link: share the link, or download it as a file
        for your department. Nothing is stored on a server.
      </p>
      {last && (
        <p className="banner">
          This browser remembers <strong>{last.title}</strong>.{" "}
          <button type="button" className="link" onClick={() => open(last)}>
            Carry on with it
          </button>
        </p>
      )}
      <div className="controls">
        <label>
          Year or course
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <optgroup label="One year">
              {COURSES.filter((c) => c.years.length === 1).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Courses and key stages">
              {COURSES.filter((c) => c.years.length > 1).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.years.length} years
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <label>
          Title
          <input
            value={title}
            maxLength={MAX_TITLE}
            placeholder={`${course.name} scheme of work`}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>
      <p className="count">
        {coursePool(course).length} statements over {course.years.length * 6} half-terms
        {course.years.length > 1 && ` (${course.years.join(", ")})`}
      </p>
      <div className="session-buttons">
        <button type="button" className="primary" onClick={() => open(draftScheme(course, name))}>
          Start from a draft
        </button>
        <button type="button" onClick={() => open(emptyScheme(course, name))}>
          Start empty
        </button>
        <OpenFile onOpen={open} onError={setError} />
      </div>
      <p className="muted">
        A draft puts every statement in the course into prerequisite order, split into its steps,
        and shares them across the half-terms by their weeks. Move things to suit your school.
      </p>
      {error && <p className="banner error">{error}</p>}
    </>
  );
}

interface Action {
  term: number;
  kind: "homework" | "test";
}

function SchemeEditor({ scheme, navigate }: { scheme: Scheme; navigate: Navigate }) {
  const course = courseById.get(scheme.course) ?? (COURSES[0] as Course);
  const update = (next: Scheme) => navigate({ page: "scheme", scheme: next }, true);
  const places = useMemo(() => placesOf(scheme), [scheme]);
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
        <label className="title-field no-print">
          Title
          <input
            value={scheme.title}
            maxLength={MAX_TITLE}
            onChange={(e) => update({ ...scheme, title: e.target.value })}
            onBlur={() =>
              update({ ...scheme, title: scheme.title.trim() || `${course.name} scheme of work` })
            }
          />
        </label>
        <p className="count">
          {course.name} · {planned} item{planned === 1 ? "" : "s"} planned ·{" "}
          {scheme.halfTerms.reduce((sum, h) => sum + h.weeks, 0)} weeks
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
        <ActionDialog
          scheme={scheme}
          course={course}
          action={action}
          navigate={navigate}
          close={() => setAction(undefined)}
        />
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
  update: (s: Scheme) => void;
}

function HalfTermCard(p: CardProps) {
  const { scheme, course, term } = p;
  const h = scheme.halfTerms[term] ?? { weeks: 0, items: [] };
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
            onChange={(e) =>
              setWeeks(Math.min(MAX_WEEKS, Math.max(1, Math.round(Number(e.target.value)) || 1)))
            }
          />
          weeks
        </label>
        <span className="print-only muted">{h.weeks} weeks</span>
      </header>
      <p className="count small">
        {h.items.length} item{h.items.length === 1 ? "" : "s"}
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
          return (
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
                </span>
                <div className="item-foot">
                  <Needs
                    needs={needs[i] ?? []}
                    course={course}
                    onAdd={(need) => p.update(placeItem(scheme, need, term, i))}
                  />
                  <span className="item-buttons no-print">
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
            </li>
          );
        })}
        {(h.items.length === 0 || p.over === h.items.length) && (
          <li className={`placeholder no-print${p.over === h.items.length ? " drop-here" : ""}`}>
            {p.over !== undefined ? "Drop here" : "Drag statements here, or tick them in the list."}
          </li>
        )}
      </ol>
      <div className="buttons no-print">
        <button type="button" disabled={!h.items.length} onClick={() => p.onAction("homework")}>
          Homework
        </button>
        <button type="button" disabled={!h.items.length} onClick={() => p.onAction("test")}>
          Test
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

/** Homework or a test for one half-term, as a dialog over the scheme. */
function ActionDialog({
  scheme,
  course,
  action,
  navigate,
  close,
}: {
  scheme: Scheme;
  course: Course;
  action: Action;
  navigate: Navigate;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  const { term, kind } = action;
  const name = halfTermName(course, term);
  return (
    <dialog ref={ref} className="scheme-dialog" onClose={close}>
      <form method="dialog" className="dialog-close">
        <button type="submit" aria-label="Close">
          ×
        </button>
      </form>
      {kind === "homework" ? (
        <Homework scheme={scheme} term={term} name={name} navigate={navigate} />
      ) : (
        <Test scheme={scheme} course={course} term={term} name={name} navigate={navigate} />
      )}
    </dialog>
  );
}

function Homework({
  scheme,
  term,
  name,
  navigate,
}: {
  scheme: Scheme;
  term: number;
  name: string;
  navigate: Navigate;
}) {
  const c = useCommon({ count: 10, feedback: "each" });
  const [depths, setDepths] = useState<Depth[]>([1, 2, 3, 4]);
  const earlier = earlierItems(scheme, term);
  const [recall, setRecall] = useState(earlier.length ? 3 : 0);
  const items = scheme.halfTerms[term]?.items ?? [];
  const review = Math.min(recall, c.count - 1);
  const spec: SessionSpec | undefined = depths.length
    ? {
        statements: items,
        depths,
        numbers: c.numbers,
        count: c.count,
        seed: c.seed,
        feedback: c.feedback,
        title: `${name} homework`,
        ...(review > 0 && earlier.length ? { review: { statements: earlier, count: review } } : {}),
      }
    : undefined;
  return (
    <>
      <h2>{name} homework</h2>
      <p className="muted">
        A practice set from this half-term&apos;s {items.length} item{items.length === 1 ? "" : "s"}
        {earlier.length > 0 &&
          ", with some questions from earlier half-terms for retrieval practice"}
        . Share the link, or print it as a worksheet.
      </p>
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
      </div>
      <div className="controls">
        {earlier.length > 0 && (
          <label>
            From earlier half-terms
            <input
              type="number"
              min={0}
              max={Math.max(0, c.count - 1)}
              value={review}
              onChange={(e) => setRecall(Math.max(0, Math.round(Number(e.target.value)) || 0))}
            />
          </label>
        )}
        <CommonControls c={c} marks={false} />
      </div>
      {depths.length === 0 && <p className="banner warning">Choose at least one depth.</p>}
      <PaperActions spec={spec} navigate={navigate} print="Print a worksheet" />
    </>
  );
}

function Test({
  scheme,
  course,
  term,
  name,
  navigate,
}: {
  scheme: Scheme;
  course: Course;
  term: number;
  name: string;
  navigate: Navigate;
}) {
  const c = useCommon({ count: 15, feedback: "end" });
  const [start, setStart] = useState<Depth>(1);
  const [end, setEnd] = useState<Depth>(4);
  const [cumulative, setCumulative] = useState(false);
  const first = term - (term % 6);
  const items = cumulative ? yearSoFar(scheme, term) : (scheme.halfTerms[term]?.items ?? []);
  const title =
    cumulative && first < term
      ? `${halfTermName(course, first)} to ${TERMS[term % 6]} test`
      : `${name} test`;
  const spec: SessionSpec = {
    statements: items,
    depths: DEPTHS.filter((d) => d >= Math.min(start, end) && d <= Math.max(start, end)),
    numbers: c.numbers,
    count: c.count,
    seed: c.seed,
    feedback: c.feedback,
    title,
    paper: { kind: "set", start, end, marks: c.marks },
  };
  return (
    <>
      <h2>{title}</h2>
      <p className="muted">
        A test paper that builds from one depth to another, and can aim at a total number of marks.
      </p>
      {first < term && (
        <fieldset className="radio">
          <legend>Covers</legend>
          <label className="check">
            <input
              type="radio"
              name="covers"
              checked={!cumulative}
              onChange={() => setCumulative(false)}
            />
            {name} only
          </label>
          <label className="check">
            <input
              type="radio"
              name="covers"
              checked={cumulative}
              onChange={() => setCumulative(true)}
            />
            The year so far, from {halfTermName(course, first)}
          </label>
        </fieldset>
      )}
      <div className="controls">
        <DepthSelect label="Start at depth" value={start} onChange={setStart} />
        <DepthSelect label="End at depth" value={end} onChange={setEnd} />
        <CommonControls c={c} />
      </div>
      <PaperActions spec={spec} navigate={navigate} />
    </>
  );
}
