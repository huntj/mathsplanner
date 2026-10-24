// Topics (data/topics.json) group the statements of every year into teacher-friendly topics such as
// "Factors, multiples and primes". The guided scheme set-up offers a year's topics, then suggests
// the statements to teach for each: the topic's statements in that year, the earlier ones they
// build on, the next year's for stretch, and prerequisites from other topics.
import type { Statement, TopicsFile } from "@mathsplanner/core";
import topicsFile from "../../../data/topics.json" with { type: "json" };
import { inThisYear, statementYears, type Course } from "./scheme.ts";
import { practisable, statementById, stepsOf } from "./session.ts";

export const TOPIC_LIST = (topicsFile as TopicsFile).topics;
export const topicById = new Map(TOPIC_LIST.map((t) => [t.id, t]));

const main = new Map<string, string>();
const also = new Map<string, string[]>();
for (const t of TOPIC_LIST) {
  for (const id of t.statements) main.set(id, t.id);
  for (const id of t.also) also.set(id, [...(also.get(id) ?? []), t.id]);
}

const own = (id: string) => (main.has(id) ? id : (statementById.get(id)?.parent ?? id));

/** A statement's main topic; a sub-statement not listed in a topic takes its parent's. */
export const mainTopic = (id: string): string | undefined => main.get(own(id));

/** Every topic a statement is in, main first. */
export const topicsOf = (id: string): string[] => {
  const key = own(id);
  return [...(main.has(key) ? [main.get(key) as string] : []), ...(also.get(key) ?? [])];
};

const practisableTop = practisable.filter((s) => !s.parent);
const inTopic = (s: Statement, topic: string) => topicsOf(s.id).includes(topic);

/** The topics a course teaches this year, with how many of its statements each has. */
export function courseTopics(course: Course): { id: string; name: string; count: number }[] {
  return TOPIC_LIST.map((t) => ({
    id: t.id,
    name: t.name,
    count: practisableTop.filter((s) => inThisYear(course, s) && inTopic(s, t.id)).length,
  })).filter((t) => t.count > 0);
}

const STAGE_RANK: Record<string, number> = {
  N: 0,
  R: 1,
  ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`Y${i + 1}`, i + 2])),
  GF: 11,
  GH: 12,
  AL: 13,
  CM: 13,
  FM: 14,
};
const rank = (stage: string) => STAGE_RANK[stage] ?? 0;

export interface Suggestions {
  /** The topic's statements this year. */
  thisYear: Statement[];
  /** The topic's statements from up to two years before, earliest first. */
  earlier: Statement[];
  /** Of those, the ones this year's statements build on. */
  neededFirst: Set<string>;
  /** The topic's statements in the next year, for stretch. */
  stretch: Statement[];
  /** Earlier statements from other topics that this year's statements need directly. */
  otherTopics: Statement[];
}

/** Statements a course could teach for a topic, grouped as the guided set-up shows them. */
export function suggest(course: Course, topic: string): Suggestions {
  const year = course.year ?? 0;
  const low = Math.min(...course.stages.map(rank));
  const high = Math.max(...course.stages.map(rank));
  const isEarlier = (s: Statement) => {
    if (inThisYear(course, s)) return false;
    const [, last] = statementYears(s);
    const before = course.stages.includes(s.stage) ? last < year : rank(s.stage) < low;
    return before && last >= year - 2;
  };
  // Stretch comes from next year of the same course, or up to Year 9 from the next stage (Year 9
  // stretches into GCSE), but never from a different qualification such as Further Maths.
  const isStretch = (s: Statement) =>
    !inThisYear(course, s) &&
    statementYears(s)[0] === year + 1 &&
    (course.stages.includes(s.stage) || (course.part === undefined && rank(s.stage) > high));
  const byYear = (a: Statement, b: Statement) => statementYears(a)[0] - statementYears(b)[0];

  const members = practisableTop.filter((s) => inTopic(s, topic));
  const thisYear = members.filter((s) => inThisYear(course, s));
  const earlier = members.filter(isEarlier).sort(byYear);
  const stretch = members.filter(isStretch);

  // Everything this year's statements build on, through their steps and prerequisites.
  const needs = (s: Statement) => [s, ...(stepsOf.get(s.id) ?? [])].flatMap((x) => x.needs);
  const chain = new Set<string>();
  const queue = thisYear.flatMap(needs);
  while (queue.length) {
    const id = own(queue.pop() as string);
    if (chain.has(id)) continue;
    chain.add(id);
    const s = statementById.get(id);
    if (s && isEarlier(s)) queue.push(...needs(s));
  }
  const listed = new Set([...thisYear, ...earlier, ...stretch].map((s) => s.id));
  const direct = new Set(thisYear.flatMap(needs).map(own));
  const otherTopics = practisableTop.filter(
    (s) => direct.has(s.id) && !listed.has(s.id) && !inTopic(s, topic) && rank(s.stage) <= high,
  );
  return {
    thisYear,
    earlier,
    neededFirst: new Set(earlier.filter((s) => chain.has(s.id)).map((s) => s.id)),
    stretch,
    otherTopics: otherTopics.sort(byYear),
  };
}
