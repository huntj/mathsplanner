import { useEffect, useState } from "react";
import { UnitTestView, YearTestView } from "./PaperViews.tsx";
import { SchemeView } from "./SchemeView.tsx";
import { formatRoute, parseRoute, type Route } from "./session.ts";
import { SessionView } from "./SessionView.tsx";
import { SetupView } from "./SetupView.tsx";
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

export function App() {
  const [route, navigate] = useRoute();
  return (
    <>
      <header className="site-header no-print">
        <a className="site-title" href="#/">
          MathsPlanner <span>practice</span>
        </a>
        <nav className="site-nav">
          <a href="#/" aria-current={route.page === "setup" ? "page" : undefined}>
            Practice
          </a>
          <a href="#/year" aria-current={route.page === "year" ? "page" : undefined}>
            Year test
          </a>
          <a href="#/unit" aria-current={route.page === "unit" ? "page" : undefined}>
            Unit test
          </a>
          <a href="#/scheme" aria-current={route.page === "scheme" ? "page" : undefined}>
            Scheme of work
          </a>
          <a href="../">Gallery</a>
          <a href="https://github.com/huntj/mathsplanner">GitHub</a>
        </nav>
      </header>
      <main>
        {route.page === "setup" ? (
          <SetupView navigate={navigate} />
        ) : route.page === "year" ? (
          <YearTestView navigate={navigate} />
        ) : route.page === "unit" ? (
          <UnitTestView navigate={navigate} />
        ) : route.page === "scheme" ? (
          <SchemeView scheme={route.scheme} navigate={navigate} />
        ) : route.page === "worksheet" ? (
          <WorksheetView spec={route.spec} sheet={route.sheet} navigate={navigate} />
        ) : (
          <SessionView
            key={formatRoute(route)}
            spec={route.spec}
            restart={() =>
              navigate({ page: "session", spec: { ...route.spec, seed: route.spec.seed + 1 } })
            }
          />
        )}
      </main>
    </>
  );
}
