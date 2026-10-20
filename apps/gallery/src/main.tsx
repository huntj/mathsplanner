import "katex/dist/katex.min.css";
import "./styles.css";
import { questionStyles } from "@mathsplanner/render";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const style = document.createElement("style");
style.textContent = questionStyles;
document.head.append(style);

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
