// Modules made at build time by vite.config.ts.
declare module "virtual:generator-headers" {
  import type { GeneratorHeader } from "../../../packages/generators/scripts/header.ts";

  /** Each generator file's header, by statement ID. */
  const headers: Record<string, GeneratorHeader>;
  export default headers;
}
