// A class's scheme of work, saved with the class: its year and half-terms (ClassPlan.tsx), and the
// same guided set-up and full editor as a scheme from a link. Those two move between their pages
// and save edits through scheme routes; here those save the scheme into the class and stay on
// the class's pages. Its weeks and lessons come from the timetable, so the planner shows them
// rather than asking.
import { ClassTerm, ClassYear } from "./ClassPlan.tsx";
import type { Navigate } from "./SchemeDialogs.tsx";
import { SchemeEditor } from "./SchemeEditor.tsx";
import { SchemeGuide } from "./SchemeGuide.tsx";
import type { Route } from "./session.ts";
import { updateClass, type Workspace } from "./workspace.ts";

type ClassRoute = Extract<Route, { page: "class" }>;

export function ClassPlanView({
  ws,
  route,
  save,
  navigate,
}: {
  ws: Workspace;
  route: ClassRoute;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}) {
  const { id } = route;
  const cls = ws.classes.find((c) => c.id === id);
  if (!cls)
    return (
      <p className="banner">
        That class is not in your set-up. <a href="#/">Go to your home page</a>.
      </p>
    );
  // An edit (a replacing navigation) stays where it is; any other move without a half-term goes
  // back to the class's year.
  const nav: Navigate = (next, replace) => {
    if (next.page !== "scheme") return navigate(next, replace);
    if (!next.scheme) return navigate({ page: "class", id });
    const scheme = next.scheme;
    if (scheme.course === cls.scheme.course) save(updateClass(ws, id, (c) => ({ ...c, scheme })));
    if (next.guide !== undefined) navigate({ page: "class", id, guide: next.guide }, replace);
    else navigate(replace ? route : { page: "class", id }, replace);
  };
  if (route.guide !== undefined)
    return <SchemeGuide key={route.guide} scheme={cls.scheme} term={route.guide} navigate={nav} />;
  if (route.edit) return <SchemeEditor scheme={cls.scheme} navigate={nav} inClass />;
  if (route.term !== undefined)
    return <ClassTerm ws={ws} cls={cls} term={route.term} save={save} navigate={navigate} />;
  return <ClassYear ws={ws} cls={cls} save={save} navigate={navigate} />;
}
