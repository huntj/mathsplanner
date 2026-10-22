// A printable A4 worksheet built from the same settings as a session. The preview is the page
// that prints; the link regenerates exactly this sheet.
import { renderWorksheet, worksheetStyles } from "@mathsplanner/render";
import { useMemo, useState } from "react";
import {
  describeSpec,
  formatRoute,
  generatorFor,
  sessionItems,
  type Route,
  type SessionSpec,
  type SheetOptions,
} from "./session.ts";

interface Props {
  spec: SessionSpec;
  sheet: SheetOptions;
  navigate: (route: Route, replace?: boolean) => void;
}

export function WorksheetView({ spec, sheet, navigate }: Props) {
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState(sheet.title);
  const update = (change: Partial<SheetOptions>) =>
    navigate({ page: "worksheet", spec, sheet: { ...sheet, ...change } }, true);

  const questions = useMemo(
    () =>
      sessionItems(spec).flatMap(({ statementId, depth, seed }) => {
        const generator = generatorFor(statementId);
        return generator ? [generator.generate({ depth, numbers: spec.numbers, seed })] : [];
      }),
    [spec],
  );

  const link = `${window.location.href.split("#")[0]}${formatRoute({ page: "worksheet", spec, sheet })}`;
  const html = useMemo(
    () =>
      renderWorksheet(questions, {
        title: sheet.title,
        subtitle: describeSpec(spec, questions.length),
        answers: sheet.answers,
        solutions: sheet.solutions,
        reducedInk: sheet.reducedInk,
        footer: `MathsPlanner · seed ${spec.seed} · ${link}`,
      }),
    [questions, sheet, spec, link],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <style>{worksheetStyles}</style>
      <div className="no-print">
        <p className="breadcrumb">
          <a href={spec.paper ? `#/${spec.paper.kind}` : "#/"}>Set up</a> /{" "}
          {spec.paper ? "Test paper" : "Worksheet"}
        </p>
        <h1>{spec.paper ? "Printable test paper" : "Printable worksheet"}</h1>
        <div className="controls">
          <label>
            Title
            <input
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => update({ title: title.trim() || sheet.title })}
              onKeyDown={(e) => e.key === "Enter" && update({ title: title.trim() || sheet.title })}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={sheet.answers}
              onChange={(e) => update({ answers: e.target.checked })}
            />
            Answer pages
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={sheet.solutions}
              disabled={!sheet.answers}
              onChange={(e) => update({ solutions: e.target.checked })}
            />
            Worked solutions
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={sheet.reducedInk}
              onChange={(e) => update({ reducedInk: e.target.checked })}
            />
            Reduced ink
          </label>
        </div>
        <div className="session-buttons">
          <button type="button" className="primary" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" onClick={() => void copy()}>
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({ page: "worksheet", spec: { ...spec, seed: spec.seed + 1 }, sheet })
            }
          >
            New questions
          </button>
        </div>
        <p className="muted">
          Answer pages start on a new page, so you can print the questions alone by choosing those
          pages. Choose “Save as PDF” in the print dialogue to keep a copy.
        </p>
      </div>
      {questions.length === 0 ? (
        <p className="banner error">The chosen statements have no questions at these depths.</p>
      ) : (
        <div className="sheet-preview" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </>
  );
}
