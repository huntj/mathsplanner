// Gallery routes live in the URL hash, so every view is a link that works on GitHub Pages:
//   #/                                   statement list
//   #/?q=angle&stage=Y5                  filtered list
//   #/s/Y5-GEO-04?depth=1&numbers=standard&seed=42&v=0.1.0&answers=1&solution=1
import { DEPTHS, NUMBERS, STAGES, type Depth, type Numbers, type Stage } from "@mathsplanner/core";

export interface ListRoute {
  page: "list";
  query: string;
  stage: Stage | "";
  generatedOnly: boolean;
}

export interface StatementRoute {
  page: "statement";
  id: string;
  depth: Depth | undefined;
  numbers: Numbers;
  seed: number | undefined;
  /** Generator version the link was made with. */
  version: string | undefined;
  showAnswers: boolean;
  showSolution: boolean;
}

export interface DiagramsRoute {
  page: "diagrams";
}

export type Route = ListRoute | StatementRoute | DiagramsRoute;

export const LIST: ListRoute = { page: "list", query: "", stage: "", generatedOnly: false };

export function parseRoute(hash: string): Route {
  const [path = "", search = ""] = hash.replace(/^#/, "").split("?", 2);
  const params = new URLSearchParams(search);
  if (path === "/diagrams") return { page: "diagrams" };
  const statement = /^\/s\/(.+)$/.exec(path);
  if (!statement) {
    const stage = params.get("stage") ?? "";
    return {
      page: "list",
      query: params.get("q") ?? "",
      stage: (STAGES as readonly string[]).includes(stage) ? (stage as Stage) : "",
      generatedOnly: params.get("generated") === "1",
    };
  }
  const depth = Number(params.get("depth"));
  const numbers = params.get("numbers") ?? "";
  const seed = params.get("seed");
  return {
    page: "statement",
    id: decodeURIComponent(statement[1] ?? ""),
    depth: (DEPTHS as readonly number[]).includes(depth) ? (depth as Depth) : undefined,
    numbers: (NUMBERS as readonly string[]).includes(numbers) ? (numbers as Numbers) : "standard",
    seed:
      seed !== null && /^\d+$/.test(seed) && Number.isSafeInteger(Number(seed))
        ? Number(seed)
        : undefined,
    version: params.get("v") ?? undefined,
    showAnswers: params.get("answers") === "1",
    showSolution: params.get("solution") === "1",
  };
}

export function formatRoute(route: Route): string {
  if (route.page === "diagrams") return "#/diagrams";
  const params = new URLSearchParams();
  if (route.page === "list") {
    if (route.query) params.set("q", route.query);
    if (route.stage) params.set("stage", route.stage);
    if (route.generatedOnly) params.set("generated", "1");
    const search = params.toString();
    return `#/${search ? `?${search}` : ""}`;
  }
  if (route.depth !== undefined) params.set("depth", String(route.depth));
  params.set("numbers", route.numbers);
  if (route.seed !== undefined) params.set("seed", String(route.seed));
  if (route.version !== undefined) params.set("v", route.version);
  if (route.showAnswers) params.set("answers", "1");
  if (route.showSolution) params.set("solution", "1");
  return `#/s/${encodeURIComponent(route.id)}?${params.toString()}`;
}

export function statementRoute(id: string): StatementRoute {
  return {
    page: "statement",
    id,
    depth: undefined,
    numbers: "standard",
    seed: undefined,
    version: undefined,
    showAnswers: false,
    showSolution: false,
  };
}
