import { DEPTHS, NUMBERS, type Statement } from "@mathsplanner/core";
import { renderQuestion } from "@mathsplanner/render";
import { useEffect, useMemo, useState } from "react";
import {
  DEPTH_NAMES,
  generatorFor,
  neededBy,
  PRACTICE_URL,
  STAGE_NAMES,
  statementById,
  type GeneratorInfo,
} from "./data.ts";
import { formatRoute, statementRoute, type Route, type StatementRoute } from "./route.ts";

interface Props {
  route: StatementRoute;
  navigate: (route: Route, replace?: boolean) => void;
}

const randomSeed = () => Math.floor(Math.random() * 1_000_000);

function StatementLinks({ label, list }: { label: string; list: readonly Statement[] }) {
  return (
    <div className="links">
      <h2>{label}</h2>
      {list.length === 0 ? (
        <p className="muted">None</p>
      ) : (
        <ul>
          {list.map((s) => (
            <li key={s.id}>
              <a href={formatRoute(statementRoute(s.id))}>
                <code>{s.id}</code> {s.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Details({ statement }: { statement: Statement }) {
  const facts = [
    STAGE_NAMES[statement.stage],
    `strand ${statement.strand}`,
    statement.source,
    statement.statutory ? "statutory" : "non-statutory",
    statement.years && `Year ${statement.years.join(" and ")}`,
    statement.tier && (statement.tier === "F" ? "both tiers" : "Higher tier only"),
    statement.option && `option ${statement.option}`,
  ].filter(Boolean);
  return <p className="facts">{facts.join(" · ")}</p>;
}

function QuestionPanel({
  info,
  route,
  navigate,
}: { info: GeneratorInfo; route: StatementRoute } & Pick<Props, "navigate">) {
  const { generator, example } = info;
  const [copied, setCopied] = useState(false);
  const update = (change: Partial<StatementRoute>, replace = false) =>
    navigate({ ...route, version: generator.version, ...change }, replace);

  // Every view gets a full key in its URL, so the address bar is always a working link.
  const complete =
    route.depth !== undefined && route.seed !== undefined && route.version !== undefined;
  useEffect(() => {
    if (!complete) {
      update(
        {
          depth: route.depth ?? generator.depths[0],
          seed: route.seed ?? randomSeed(),
          version: route.version ?? generator.version,
        },
        true,
      );
    }
  });

  const result = useMemo(() => {
    if (route.depth === undefined || route.seed === undefined) return undefined;
    try {
      const question = generator.generate({
        depth: route.depth,
        numbers: route.numbers,
        seed: route.seed,
      });
      return {
        html: renderQuestion(question, {
          showAnswers: route.showAnswers,
          showSolution: route.showSolution,
        }),
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [generator, route.depth, route.numbers, route.seed, route.showAnswers, route.showSolution]);

  if (!complete || !result || route.depth === undefined || route.seed === undefined) return null;
  const seed = route.seed;

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="question-panel" aria-label="Question">
      {example && (
        <p className="banner">
          Example placeholder: this generator shows how the gallery works and has not been reviewed.
          It will be replaced by a real generator.
        </p>
      )}
      {route.version !== generator.version && (
        <p className="banner warning">
          This link was made with generator version {route.version}; you are seeing version{" "}
          {generator.version}, which may differ.
        </p>
      )}
      <div className="controls">
        <fieldset className="depths">
          <legend>Depth</legend>
          {DEPTHS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={route.depth === d}
              disabled={!generator.depths.includes(d)}
              title={
                generator.depths.includes(d) ? DEPTH_NAMES[d] : `${DEPTH_NAMES[d]} (not supported)`
              }
              onClick={() => update({ depth: d })}
            >
              {d} <span>{DEPTH_NAMES[d]}</span>
            </button>
          ))}
        </fieldset>
        <label>
          Numbers
          <select
            value={route.numbers}
            onChange={(e) => update({ numbers: e.target.value as StatementRoute["numbers"] })}
          >
            {NUMBERS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Seed
          <input
            type="number"
            min={0}
            value={seed}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (Number.isSafeInteger(value) && value >= 0) update({ seed: value }, true);
            }}
          />
        </label>
        <div className="buttons">
          <button
            type="button"
            onClick={() => update({ seed: Math.max(0, seed - 1) })}
            disabled={seed === 0}
          >
            Previous
          </button>
          <button type="button" onClick={() => update({ seed: seed + 1 })}>
            Next
          </button>
          <button type="button" onClick={() => update({ seed: randomSeed() })}>
            Random seed
          </button>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={route.showAnswers}
            onChange={(e) => update({ showAnswers: e.target.checked }, true)}
          />
          Answers and misconceptions
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={route.showSolution}
            onChange={(e) => update({ showSolution: e.target.checked }, true)}
          />
          Worked solution
        </label>
        <button type="button" className="primary" onClick={() => void copyLink()}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        {!example && (
          <a
            className="button"
            href={`${PRACTICE_URL}#/session?${new URLSearchParams({
              statements: generator.id,
              depths: generator.depths.join(","),
              numbers: route.numbers,
              count: "10",
              seed: String(seed),
              feedback: "each",
            })
              .toString()
              .replace(/%2C/g, ",")}`}
          >
            Practise this
          </a>
        )}
      </div>
      {"error" in result ? (
        <p className="banner error" role="alert">
          Could not generate this question: {result.error}
        </p>
      ) : (
        <div className="question-card" dangerouslySetInnerHTML={{ __html: result.html }} />
      )}
      <p className="key">
        <code>
          {generator.id} · depth {route.depth} · {route.numbers} · seed {seed} · v
          {generator.version}
        </code>
      </p>
    </section>
  );
}

export function StatementPage({ route, navigate }: Props) {
  const statement = statementById.get(route.id);
  if (!statement) {
    return (
      <>
        <h1>Not found</h1>
        <p>
          There is no statement <code>{route.id}</code>. <a href="#/">Back to all statements</a>
        </p>
      </>
    );
  }
  const info = generatorFor(statement.id);
  const needs = statement.needs.flatMap((id) => statementById.get(id) ?? []);

  return (
    <>
      <p className="breadcrumb">
        <a href="#/">All statements</a> / {STAGE_NAMES[statement.stage]}
      </p>
      <h1>
        <code>{statement.id}</code> {statement.text}
      </h1>
      <Details statement={statement} />
      {info ? (
        <QuestionPanel info={info} route={route} navigate={navigate} />
      ) : (
        <p className="banner">
          No generator yet. See{" "}
          <a href="https://github.com/huntj/mathsplanner/blob/main/CONTRIBUTING.md#claiming-a-statement">
            how to claim a statement
          </a>
          .
        </p>
      )}
      <div className="related">
        <StatementLinks label="Needs" list={needs} />
        <StatementLinks label="Needed by" list={neededBy.get(statement.id) ?? []} />
      </div>
    </>
  );
}
