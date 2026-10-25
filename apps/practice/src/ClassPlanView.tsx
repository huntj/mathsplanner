// A class's scheme of work, in the same planner as a scheme from a link, but saved with the class:
// the planner's own moves between its pages and edits come back here as scheme routes, which save
// the scheme into the class and stay on the class's page. Its weeks and lessons come from the
// timetable, so the planner shows them rather than asking.
import type { Navigate } from "./SchemeDialogs.tsx";
import { SchemeEditor } from "./SchemeEditor.tsx";
import { SchemeGuide } from "./SchemeGuide.tsx";
import { updateClass, type Workspace } from "./workspace.ts";

export function ClassPlanView({
  ws,
  id,
  guide,
  save,
  navigate,
}: {
  ws: Workspace;
  id: string;
  guide: number | undefined;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}) {
  const cls = ws.classes.find((c) => c.id === id);
  if (!cls)
    return (
      <p className="banner">
        That class is not in your set-up. <a href="#/">Go to your home page</a>.
      </p>
    );
  const nav: Navigate = (route, replace) => {
    if (route.page !== "scheme") return navigate(route, replace);
    if (!route.scheme) return navigate({ page: "home" });
    const scheme = route.scheme;
    if (scheme.course === cls.scheme.course) save(updateClass(ws, id, (c) => ({ ...c, scheme })));
    navigate(
      route.guide === undefined ? { page: "class", id } : { page: "class", id, guide: route.guide },
      replace,
    );
  };
  if (guide !== undefined)
    return <SchemeGuide key={guide} scheme={cls.scheme} term={guide} navigate={nav} />;
  return <SchemeEditor scheme={cls.scheme} navigate={nav} inClass />;
}
