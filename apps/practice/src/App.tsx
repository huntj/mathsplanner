import { useEffect, useState } from "react";
import { ClassPlanView } from "./ClassPlanView.tsx";
import { HomeView } from "./HomeView.tsx";
import { HomeworkView } from "./HomeworkView.tsx";
import { UnitTestView, YearTestView } from "./PaperViews.tsx";
import { SchemeView } from "./SchemeView.tsx";
import { formatRoute, parseRoute, type Route } from "./session.ts";
import { SessionView } from "./SessionView.tsx";
import { SetupView } from "./SetupView.tsx";
import { TimetableView } from "./TimetableView.tsx";
import { WelcomeView } from "./WelcomeView.tsx";
import {
  clearWorkspace,
  isWorkspaceKey,
  loadWorkspace,
  saveWorkspace,
  type Workspace,
} from "./workspace.ts";
import { WorksheetView } from "./WorksheetView.tsx";

function useRoute(): [Route, (route: Route, replace?: boolean) => void] {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (next: Route, replace = false) => {
    if (replace) window.history.replaceState(null, "", formatRoute(next));
    else {
      window.history.pushState(null, "", formatRoute(next));
      window.scrollTo(0, 0);
    }
    setRoute(next);
  };
  return [route, navigate];
}

/**
 * The teacher's set-up, kept in this browser and followed across tabs. `saved` is false when the
 * browser refuses to keep it, so the page can say so.
 */
function useWorkspace() {
  const [ws, setWs] = useState<Workspace | undefined>(loadWorkspace);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (isWorkspaceKey(e.key)) setWs(loadWorkspace());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const save = (next: Workspace) => {
    setWs(next);
    setSaved(saveWorkspace(next));
  };
  const clear = () => {
    clearWorkspace();
    setWs(undefined);
  };
  return { ws, saved, save, clear };
}

export function App() {
  const [route, navigate] = useRoute();
  const { ws, saved, save, clear } = useWorkspace();
  const current = (page: Route["page"] | Route["page"][]) =>
    [page].flat().includes(route.page) ? "page" : undefined;
  return (
    <>
      <header className="site-header no-print">
        <a className="site-title" href="#/">
          MathsPlanner
        </a>
        <nav className="site-nav">
          <a href="#/" aria-current={current(["home", "welcome", "class"])}>
            Home
          </a>
          {ws && (
            <a href="#/timetable" aria-current={current(["timetable", "homework"])}>
              Timetable
            </a>
          )}
          <a href="#/practice" aria-current={current("setup")}>
            Make questions
          </a>
          <a href="#/year" aria-current={current("year")}>
            Year test
          </a>
          <a href="#/unit" aria-current={current("unit")}>
            Unit test
          </a>
          <a href="#/scheme" aria-current={current("scheme")}>
            Scheme from a link
          </a>
          <a href="../">Gallery</a>
        </nav>
      </header>
      <main>
        {!saved && (
          <p className="banner warning no-print">
            This browser isn&apos;t letting MathsPlanner save your set-up (it may be a private
            window). Download a backup from the home page before you close it.
          </p>
        )}
        {route.page === "home" ? (
          ws ? (
            <HomeView ws={ws} save={save} clear={clear} navigate={navigate} />
          ) : (
            <WelcomeView ws={undefined} step={0} save={save} navigate={navigate} />
          )
        ) : route.page === "welcome" ? (
          <WelcomeView ws={ws} step={route.step} save={save} navigate={navigate} />
        ) : (route.page === "timetable" || route.page === "homework" || route.page === "class") &&
          !ws ? (
          <WelcomeView ws={undefined} step={0} save={save} navigate={navigate} />
        ) : route.page === "timetable" && ws ? (
          <TimetableView ws={ws} save={save} navigate={navigate} />
        ) : route.page === "homework" && ws ? (
          <HomeworkView ws={ws} save={save} navigate={navigate} />
        ) : route.page === "class" && ws ? (
          <ClassPlanView
            ws={ws}
            id={route.id}
            guide={route.guide}
            save={save}
            navigate={navigate}
          />
        ) : route.page === "setup" ? (
          <SetupView navigate={navigate} />
        ) : route.page === "year" ? (
          <YearTestView navigate={navigate} />
        ) : route.page === "unit" ? (
          <UnitTestView navigate={navigate} />
        ) : route.page === "scheme" ? (
          <SchemeView scheme={route.scheme} guide={route.guide} navigate={navigate} />
        ) : route.page === "worksheet" ? (
          <WorksheetView spec={route.spec} sheet={route.sheet} navigate={navigate} />
        ) : route.page === "session" ? (
          <SessionView
            key={formatRoute(route)}
            spec={route.spec}
            restart={() =>
              navigate({ page: "session", spec: { ...route.spec, seed: route.spec.seed + 1 } })
            }
          />
        ) : null}
      </main>
    </>
  );
}
