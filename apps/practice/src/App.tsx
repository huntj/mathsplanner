import { useEffect, useState } from "react";
import { formatRoute, parseRoute, type Route } from "./session.ts";
import { SessionView } from "./SessionView.tsx";
import { SetupView } from "./SetupView.tsx";

function useRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (next: Route) => {
    window.history.pushState(null, "", formatRoute(next));
    setRoute(next);
    window.scrollTo(0, 0);
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
          <a href="../">Gallery</a>
          <a href="https://github.com/huntj/mathsplanner">GitHub</a>
        </nav>
      </header>
      <main>
        {route.page === "setup" ? (
          <SetupView navigate={navigate} />
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
