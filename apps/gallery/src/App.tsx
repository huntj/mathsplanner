import { useEffect, useState } from "react";
import { formatRoute, parseRoute, type Route } from "./route.ts";
import { StatementList } from "./StatementList.tsx";
import { StatementPage } from "./StatementPage.tsx";

function useRoute(): [Route, (route: Route, replace?: boolean) => void] {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (next: Route, replace = false) => {
    const hash = formatRoute(next);
    if (replace) window.history.replaceState(null, "", hash);
    else window.history.pushState(null, "", hash);
    setRoute(next);
  };
  return [route, navigate];
}

export function App() {
  const [route, navigate] = useRoute();

  useEffect(() => {
    if (route.page === "list") window.scrollTo(0, 0);
  }, [route.page]);

  return (
    <>
      <header className="site-header">
        <a className="site-title" href="#/">
          MathsPlanner <span>gallery</span>
        </a>
        <a href="https://github.com/huntj/mathsplanner">GitHub</a>
      </header>
      <main>
        {route.page === "list" ? (
          <StatementList route={route} navigate={navigate} />
        ) : (
          <StatementPage key={route.id} route={route} navigate={navigate} />
        )}
      </main>
    </>
  );
}
