import "@fontsource/andika/latin-400.css";
import "@fontsource/andika/latin-700.css";
import "@fontsource/fredoka/latin-500.css";
import "@fontsource/fredoka/latin-600.css";
import "katex/dist/katex.min.css";
import "@mathsplanner/ui/widgets.css";
import "./styles.css";
import { questionStyles } from "@mathsplanner/render";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const style = document.createElement("style");
style.textContent = questionStyles;
document.head.prepend(style);

const root = document.getElementById("root");
if (root)
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
