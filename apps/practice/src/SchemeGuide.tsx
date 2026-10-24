// The guided set-up, one half-term at a time: choose topics, and for each topic MathsPlanner
// suggests statements: this year's (ticked), what they build on from earlier years, next year's
// for stretch, and prerequisites from other topics. Ticking places a statement in the half-term,
// beside the rest of its topic; the plan page shows the result.
import type { Statement } from "@mathsplanner/core";
import { useState } from "react";
import { Dialog, PrerequisiteCheck, type Navigate } from "./SchemeDialogs.tsx";
import {
  COURSES,
  courseById,
  halfTermName,
  MAX_WEEKS,
  placeItem,
  removeItem,
  statementYears,
  weekPlan,
  type Course,
  type Scheme,
} from "./scheme.ts";
import { stageName } from "./papers.ts";
import { statementById, stepsOf } from "./session.ts";
import { StatementPicker } from "./StatementPicker.tsx";
import { courseTopics, mainTopic, suggest, topicById, topicsOf } from "./topics.ts";

/** "Year 5", "GCSE" or "Year 12" for a statement. */
function yearLabel(s: Statement): string {
  const [first] = statementYears(s);
  if (s.stage === "GF" || s.stage === "GH") return stageName(s.stage);
  if (first >= 12) return `${stageName(s.stage)}, Year ${first}`;
  return stageName(s.stage);
}

type Group = "earlier" | "this" | "stretch" | "other";

export function SchemeGuide({
  scheme,
  term,
  navigate,
}: {
  scheme: Scheme;
  term: number;
  navigate: Navigate;
}) {
  const course = courseById.get(scheme.course) ?? (COURSES[0] as Course);
  const update = (next: Scheme) => navigate({ page: "scheme", scheme: next, guide: term }, true);
  const go = (guide?: number) =>
    navigate(guide === undefined ? { page: "scheme", scheme } : { page: "scheme", scheme, guide });
  // Topics opened here but with nothing ticked yet; the rest come from the half-term's items.
  const [opened, setOpened] = useState<string[]>([]);
  const [check, setCheck] = useState<string>();

  const h = scheme.halfTerms[term] ?? { weeks: 1, items: [] };
  const where = new Map<string, number>();
  scheme.halfTerms.forEach((x, t) => x.items.forEach((id) => where.set(id, t)));
  const here = (id: string) => where.get(id) === term;
  const topics = courseTopics(course);
  // Where each topic is planned, for the chips.
  const topicTerms = new Map<string, Set<number>>();
  for (const [id, t] of where) {
    const topic = mainTopic(id);
    if (topic) topicTerms.set(topic, (topicTerms.get(topic) ?? new Set()).add(t));
  }
  const shown = [
    ...new Set([...h.items.map(mainTopic).filter((t): t is string => !!t), ...opened]),
  ];
  const plan = weekPlan(scheme, term);
  const year0 = term - (term % 6);
  const name = halfTermName(course, term);

  /**
   * Puts a statement into this half-term beside its topic: what is needed first goes before the
   * topic's first item, the rest after its last.
   */
  const add = (s: Scheme, id: string, topic: string, group: Group) => {
    const items = s.halfTerms[term]?.items ?? [];
    const inTopic = items
      .map((x, i) => (topicsOf(x).includes(topic) ? i : -1))
      .filter((i) => i >= 0);
    const at =
      group === "earlier" || group === "other"
        ? (inTopic[0] ?? items.length)
        : (inTopic.at(-1) ?? items.length - 1) + 1;
    return placeItem(s, id, term, at);
  };
  const openTopic = (topic: string) => {
    if (!shown.includes(topic)) setOpened((o) => [...o, topic]);
    // This year's statements go in straight away, unless they are planned elsewhere already.
    let next = scheme;
    for (const s of suggest(course, topic).thisYear)
      if (!where.has(s.id) && !(stepsOf.get(s.id) ?? []).some((x) => where.has(x.id)))
        next = add(next, s.id, topic, "this");
    if (next !== scheme) update(next);
  };
  const removeTopic = (topic: string) => {
    let next = scheme;
    for (const id of h.items) if (mainTopic(id) === topic) next = removeItem(next, id);
    setOpened((o) => o.filter((t) => t !== topic));
    update(next);
  };

  return (
    <div className="scheme guide">
      <p className="breadcrumb">
        <button type="button" className="link" onClick={() => go()}>
          {scheme.title}
        </button>{" "}
        / {name}
      </p>
      <h1>
        {scheme.className ? `${scheme.className}: ` : ""}
        {name}
      </h1>
      <nav className="term-steps" aria-label="Half-terms">
        {scheme.halfTerms.slice(year0, year0 + 6).map((x, i) => (
          <button
            key={i}
            type="button"
            aria-current={year0 + i === term ? "step" : undefined}
            onClick={() => go(year0 + i)}
          >
            {halfTermName(course, year0 + i, true)}
            <span className="muted"> · {x.items.length}</span>
          </button>
        ))}
      </nav>
      <p className="count">
        <label className="weeks inline">
          <input
            type="number"
            min={1}
            max={MAX_WEEKS}
            value={h.weeks}
            aria-label={`Weeks in ${name}`}
            onChange={(e) =>
              update({
                ...scheme,
                halfTerms: scheme.halfTerms.map((x, i) =>
                  i === term
                    ? {
                        ...x,
                        weeks: Math.min(
                          MAX_WEEKS,
                          Math.max(1, Math.round(Number(e.target.value)) || 1),
                        ),
                      }
                    : x,
                ),
              })
            }
          />
          weeks
        </label>{" "}
        × {scheme.lessonsPerWeek} lessons = {plan.capacity} lessons ·{" "}
        <strong>{plan.lessons} planned</strong>
        {plan.lessons > plan.capacity && (
          <span className="warn-count"> · ⚠ {plan.lessons - plan.capacity} too many</span>
        )}
      </p>
      <progress
        className="lesson-bar"
        max={Math.max(plan.capacity, plan.lessons)}
        value={plan.lessons}
        aria-label="Lessons planned"
      />

      <h2>Topics for {name}</h2>
      <p className="muted small">
        Choose a topic to add this year&apos;s statements for it, then add anything the class needs
        first or is ready to stretch into. A topic planned in another half-term shows where.
      </p>
      <div className="topic-chips" role="group" aria-label="Topics">
        {topics.map((t) => {
          const elsewhere = [...(topicTerms.get(t.id) ?? [])].filter((x) => x !== term);
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={shown.includes(t.id)}
              onClick={() => (shown.includes(t.id) ? undefined : openTopic(t.id))}
            >
              {t.name}
              <span className="chip-note">
                {elsewhere.length
                  ? ` · ${elsewhere.map((x) => halfTermName(course, x, true)).join(", ")}`
                  : ` · ${t.count}`}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 && (
        <p className="banner">Choose a topic above to start planning {name}.</p>
      )}
      {shown.map((topic) => (
        <TopicCard
          key={topic}
          topic={topic}
          course={course}
          term={term}
          where={where}
          here={here}
          onToggle={(id, group) =>
            update(here(id) ? removeItem(scheme, id) : add(scheme, id, topic, group))
          }
          onRemove={() => removeTopic(topic)}
          onCheck={() => setCheck(topic)}
        />
      ))}

      {h.items.length > 0 && (
        <section className="guide-order">
          <h2>{name} in order</h2>
          <ol>
            {h.items.map((id, i) => {
              const newWeek = i === 0 || plan.starts[i - 1] !== plan.starts[i];
              return (
                <li key={id}>
                  {newWeek && <span className="week-tag">Week {(plan.starts[i] ?? 0) + 1}</span>}
                  <code>{id}</code> {statementById.get(id)?.text}
                </li>
              );
            })}
          </ol>
          <p className="muted small">Change the order, lessons and weeks on the plan page.</p>
        </section>
      )}

      <div className="session-buttons guide-nav">
        <button type="button" disabled={term === year0} onClick={() => go(term - 1)}>
          ← {term > year0 ? halfTermName(course, term - 1) : "Previous"}
        </button>
        {term < year0 + 5 && (
          <button type="button" className="primary" onClick={() => go(term + 1)}>
            Next: {halfTermName(course, term + 1)} →
          </button>
        )}
        <button
          type="button"
          className={term === year0 + 5 ? "primary" : undefined}
          onClick={() => go()}
        >
          See the whole plan
        </button>
      </div>

      {check && (
        <Dialog close={() => setCheck(undefined)}>
          <PrerequisiteCheck
            scheme={scheme}
            ids={(() => {
              const s = suggest(course, check);
              const needed = s.earlier.filter((x) => s.neededFirst.has(x.id));
              return [...(needed.length ? needed : s.earlier), ...s.otherTopics]
                .map((x) => x.id)
                .filter((id) => !where.has(id) || (where.get(id) ?? 0) >= term);
            })()}
            name={topicById.get(check)?.name ?? check}
            seedOffset={50 + term}
            navigate={navigate}
          />
        </Dialog>
      )}
    </div>
  );
}

function TopicCard({
  topic,
  course,
  term,
  where,
  here,
  onToggle,
  onRemove,
  onCheck,
}: {
  topic: string;
  course: Course;
  term: number;
  where: Map<string, number>;
  here: (id: string) => boolean;
  onToggle: (id: string, group: Group) => void;
  onRemove: () => void;
  onCheck: () => void;
}) {
  const s = suggest(course, topic);
  const elsewhere = (id: string) => where.has(id) && where.get(id) !== term;
  const note = (label?: (id: string) => string) => (id: string) => {
    const t = where.get(id);
    const text =
      t !== undefined && t !== term ? `in ${halfTermName(course, t, true)}` : (label?.(id) ?? "");
    return text ? <span className="planned">{text}</span> : null;
  };
  const year = (id: string) => {
    const st = statementById.get(id);
    return st ? yearLabel(st) : "";
  };
  const groups: {
    group: Group;
    title: string;
    list: Statement[];
    label?: (id: string) => string;
  }[] = [
    {
      group: "earlier",
      title: "From earlier years",
      list: s.earlier,
      label: (id) => `${year(id)}${s.neededFirst.has(id) ? " · needed first" : ""}`,
    },
    { group: "this", title: `${course.years[0] ?? "This year"}`, list: s.thisYear },
    { group: "stretch", title: "Stretch: next year", list: s.stretch, label: year },
    {
      group: "other",
      title: "Also needed, from other topics",
      list: s.otherTopics,
      label: (id) => `${topicById.get(mainTopic(id) ?? "")?.name ?? ""} · ${year(id)}`,
    },
  ];
  const ticked = [...s.earlier, ...s.thisYear, ...s.stretch, ...s.otherTopics].filter((x) =>
    here(x.id),
  ).length;

  return (
    <section className="topic-card" aria-label={topicById.get(topic)?.name}>
      <header>
        <h3>{topicById.get(topic)?.name ?? topic}</h3>
        <span className="muted small">{ticked} in this half-term</span>
        <span className="buttons">
          {(s.earlier.length > 0 || s.otherTopics.length > 0) && (
            <button type="button" onClick={onCheck}>
              Check prerequisites
            </button>
          )}
          <button type="button" onClick={onRemove}>
            Remove topic
          </button>
        </span>
      </header>
      {groups
        .filter((g) => g.list.length > 0)
        .map((g) => (
          <div key={g.group} className={`topic-group ${g.group}`}>
            <h4>{g.title}</h4>
            <StatementPicker
              statements={g.list}
              query=""
              isChosen={here}
              isDisabled={elsewhere}
              onToggle={(id) => onToggle(id, g.group)}
              note={note(g.label)}
            />
          </div>
        ))}
      {s.thisYear.length === 0 && (
        <p className="muted small">
          {topicById.get(topic)?.name} has nothing of its own in {course.name}.
        </p>
      )}
    </section>
  );
}
