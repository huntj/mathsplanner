// The scheme-of-work planner. With no scheme it starts one (year group, then class); with
// `guide` it walks through one half-term's topics; otherwise it shows the whole plan. The scheme
// is kept in the page's link (and the browser remembers the last one); it is shared as that link
// or as a downloaded file, so nothing is stored on a server.
import { useEffect } from "react";
import type { Navigate } from "./SchemeDialogs.tsx";
import { SchemeEditor } from "./SchemeEditor.tsx";
import { SchemeGuide } from "./SchemeGuide.tsx";
import { remember, SchemeStart } from "./SchemeStart.tsx";
import type { Scheme } from "./scheme.ts";

export function SchemeView({
  scheme,
  guide,
  navigate,
}: {
  scheme: Scheme | undefined;
  guide: number | undefined;
  navigate: Navigate;
}) {
  useEffect(() => {
    if (scheme) remember(scheme);
  }, [scheme]);
  if (!scheme) return <SchemeStart navigate={navigate} />;
  if (guide !== undefined)
    return <SchemeGuide key={guide} scheme={scheme} term={guide} navigate={navigate} />;
  return <SchemeEditor scheme={scheme} navigate={navigate} />;
}
