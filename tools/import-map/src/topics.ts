// Topics: data/topics.txt groups the statements into teacher-friendly topics such as "Factors,
// multiples and primes", across every year. The text file is the source, since it is the easiest
// to read and edit; `pnpm data:topics` checks it, refills each statement's wording, sorts each
// topic into curriculum order, and writes data/topics.json for the apps.
import type { Statement, Topic, TopicsFile } from "@mathsplanner/core";

export const TOPICS_VERSION = "0.1.0";

export interface TopicsResult {
  file: TopicsFile;
  /** The source file rewritten with current wording and in curriculum order. */
  text: string;
  errors: string[];
}

const HEADING = /^##\s+(.+?)\s+\{([a-z0-9-]+)\}\s*$/;
const LINE = /^(\+\s*)?(\S+)/;

/** Parses and checks the topics text against the statements. */
export function buildTopics(source: string, statements: readonly Statement[]): TopicsResult {
  const errors: string[] = [];
  const byId = new Map(statements.map((s) => [s.id, s]));
  const order = new Map(statements.map((s, i) => [s.id, i]));
  const header: string[] = [];
  const topics: Topic[] = [];
  const main = new Map<string, string>();

  source.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    const where = `line ${i + 1}`;
    if (topics.length === 0 && (line.startsWith("#") || line === "") && !HEADING.test(line)) {
      header.push(raw);
      return;
    }
    if (line === "" || (line.startsWith("#") && !line.startsWith("##"))) return;
    const heading = HEADING.exec(line);
    if (heading) {
      const [, name = "", id = ""] = heading;
      if (topics.some((t) => t.id === id)) errors.push(`${where}: topic {${id}} appears twice`);
      topics.push({ id, name, statements: [], also: [] });
      return;
    }
    const topic = topics.at(-1);
    const [, plus, id = ""] = LINE.exec(line) ?? [];
    if (!topic) return void errors.push(`${where}: a statement comes before any "## Topic {id}"`);
    if (!byId.has(id)) return void errors.push(`${where}: ${id} is not in statements.json`);
    if (plus) {
      if (topic.also.includes(id)) errors.push(`${where}: ${id} is listed twice in ${topic.id}`);
      else topic.also.push(id);
      return;
    }
    const other = main.get(id);
    if (other) return void errors.push(`${where}: ${id} already has the main topic ${other}`);
    main.set(id, topic.id);
    topic.statements.push(id);
  });

  for (const s of statements) if (!s.parent && !main.has(s.id)) errors.push(`${s.id} has no topic`);
  for (const t of topics) {
    for (const id of t.also)
      if (main.get(id) === t.id) errors.push(`${id} is listed in ${t.id} twice, once with +`);
    const byOrder = (a: string, b: string) => (order.get(a) ?? 0) - (order.get(b) ?? 0);
    t.statements.sort(byOrder);
    t.also.sort(byOrder);
    if (t.statements.length === 0) errors.push(`topic ${t.id} has no statements of its own`);
  }

  const wording = (id: string) => byId.get(id)?.text ?? "";
  const body = topics.map((t) =>
    [
      `## ${t.name} {${t.id}}`,
      ...t.statements.map((id) => `${id}  ${wording(id)}`),
      ...t.also.map((id) => `+ ${id}  ${wording(id)}`),
    ].join("\n"),
  );
  const head = header.join("\n").trimEnd();
  return {
    file: { version: TOPICS_VERSION, topics },
    text: `${head}\n\n${body.join("\n\n")}\n`,
    errors,
  };
}
