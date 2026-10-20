import { DEPTHS, STAGES, type Stage, type Statement } from "@mathsplanner/core";
import { generatorFor, STAGE_NAMES, statements } from "./data.ts";
import { formatRoute, statementRoute, type ListRoute, type Route } from "./route.ts";

interface Props {
  route: ListRoute;
  navigate: (route: Route, replace?: boolean) => void;
}

function matches(s: Statement, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !q || s.id.toLowerCase().includes(q) || s.text.toLowerCase().includes(q);
}

/** The depths a statement's generator covers, as five small cells. */
function DepthCells({ id }: { id: string }) {
  const info = generatorFor(id);
  const depths: readonly number[] = info?.generator.depths ?? [];
  return (
    <span
      className="depth-cells"
      aria-label={info ? `Depths ${depths.join(", ")}` : "No generator"}
    >
      {DEPTHS.map((d) => (
        <span key={d} className={depths.includes(d) ? "on" : ""} />
      ))}
    </span>
  );
}

export function StatementList({ route, navigate }: Props) {
  const shown = statements.filter(
    (s) =>
      (!route.stage || s.stage === route.stage) &&
      (!route.generatedOnly || generatorFor(s.id)) &&
      matches(s, route.query),
  );
  const byStage = STAGES.map(
    (stage) => [stage, shown.filter((s) => s.stage === stage)] as const,
  ).filter(([, list]) => list.length > 0);
  const update = (change: Partial<ListRoute>) => navigate({ ...route, ...change }, true);

  return (
    <>
      <h1>Statements</h1>
      <p className="lede">
        Every learning statement from Nursery to Year 13. Pick one to see its generator, at any
        depth, numbers setting and seed.
      </p>
      <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
        <label>
          Search
          <input
            type="search"
            value={route.query}
            placeholder="ID or wording, e.g. angle"
            onChange={(e) => update({ query: e.target.value })}
          />
        </label>
        <label>
          Stage
          <select
            value={route.stage}
            onChange={(e) => update({ stage: e.target.value as Stage | "" })}
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_NAMES[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={route.generatedOnly}
            onChange={(e) => update({ generatedOnly: e.target.checked })}
          />
          With a generator only
        </label>
      </form>
      <p className="count" aria-live="polite">
        {shown.length} of {statements.length} statements
      </p>
      {byStage.map(([stage, list]) => (
        <section key={stage}>
          <h2>
            {STAGE_NAMES[stage]} <span className="muted">({list.length})</span>
          </h2>
          <ul className="statement-list">
            {list.map((s) => (
              <li key={s.id}>
                <a href={formatRoute(statementRoute(s.id))}>
                  <code>{s.id}</code>
                  <span className="text">{s.text}</span>
                  <DepthCells id={s.id} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
