// One input widget per answer type. Each shows the part's options or fields, holds nothing itself
// (the draft lives in the session), and is locked once the part has been checked.
import type { DiagramSpec, Option, Part } from "@mathsplanner/core";
import { renderRich } from "@mathsplanner/render";
import { useEffect, useRef, useState, type DragEvent } from "react";
import type { Draft } from "./answers.ts";
// MathLive's <math-field> element, typed for JSX.
import type {} from "./mathfield.ts";
import { PlotCanvas } from "./PlotCanvas.tsx";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface WidgetProps {
  part: Part;
  diagrams: readonly DiagramSpec[];
  draft: Draft;
  setDraft: (draft: Draft) => void;
  /** Checked: no more changes. */
  locked: boolean;
  /** Show which options were right, after checking with feedback on. */
  reveal: boolean;
  /** The canvas a plot part draws on. */
  canvas?: DiagramSpec;
}

function Html({
  html,
  as = "span",
  className,
}: {
  html: string;
  as?: "span" | "div";
  className?: string;
}) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

const hasFigure = (options: readonly Option[]) =>
  options.some((o) => o.content.some((n) => n.t === "diagram"));

/** A group of buttons choosing one (or, with `multiple`, several) options. */
function OptionButtons({
  options,
  diagrams,
  selected,
  onToggle,
  locked,
  correct,
  label,
  multiple = false,
}: {
  options: readonly Option[];
  diagrams: readonly DiagramSpec[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  locked: boolean;
  correct?: readonly string[];
  label: string;
  multiple?: boolean;
}) {
  return (
    <div
      className={`options${hasFigure(options) ? " with-figures" : ""}`}
      role={multiple ? "group" : "radiogroup"}
      aria-label={label}
    >
      {options.map((o, i) => {
        const chosen = selected.includes(o.id);
        const state = correct ? (correct.includes(o.id) ? " right" : chosen ? " wrong" : "") : "";
        return (
          <button
            key={o.id}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={chosen}
            className={`option${chosen ? " chosen" : ""}${state}`}
            disabled={locked}
            onClick={() => onToggle(o.id)}
          >
            <span className="letter">{LETTERS[i]}</span>
            <Html html={renderRich(o.content, diagrams)} className="content" />
          </button>
        );
      })}
    </div>
  );
}

function NumberInput({ part, draft, setDraft, locked }: WidgetProps) {
  if (draft.type !== "text" || part.answer.type !== "number") return null;
  const units = part.answer.units;
  return (
    <label className="answer-field">
      <span className="visually-hidden">Your answer</span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={draft.text}
        disabled={locked}
        placeholder="Your answer"
        onChange={(e) => setDraft({ type: "text", text: e.target.value })}
      />
      {units && <span className="units">{units === "°" || units === "degrees" ? "°" : units}</span>}
    </label>
  );
}

/** The MathLive maths keyboard, loaded only when an exact answer is needed. */
function ExactInput({ draft, setDraft, locked }: WidgetProps) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void import("mathlive").then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const field = ref.current as (HTMLElement & { value: string }) | null;
    if (!field) return;
    const onInput = () => setDraft({ type: "exact", latex: field.value });
    field.addEventListener("input", onInput);
    return () => field.removeEventListener("input", onInput);
  });
  if (draft.type !== "exact") return null;
  if (!ready) return <p className="muted">Loading the maths keyboard…</p>;
  return (
    <math-field
      ref={ref}
      class="math-field"
      aria-label="Your answer"
      read-only={locked ? "" : undefined}
    >
      {draft.latex}
    </math-field>
  );
}

function CoordinateInput({ draft, setDraft, locked }: WidgetProps) {
  if (draft.type !== "coordinate") return null;
  return (
    <span className="coordinate">
      (
      <input
        aria-label="x"
        inputMode="decimal"
        value={draft.x}
        disabled={locked}
        onChange={(e) => setDraft({ ...draft, x: e.target.value })}
      />
      ,
      <input
        aria-label="y"
        inputMode="decimal"
        value={draft.y}
        disabled={locked}
        onChange={(e) => setDraft({ ...draft, y: e.target.value })}
      />
      )
    </span>
  );
}

function OrderInput({ part, diagrams, draft, setDraft, locked }: WidgetProps) {
  const [dragging, setDragging] = useState<number>();
  if (draft.type !== "order" || part.answer.type !== "order") return null;
  const byId = new Map(part.answer.options.map((o) => [o.id, o]));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.ids.length || from === to) return;
    const ids = [...draft.ids];
    const [id] = ids.splice(from, 1);
    if (id !== undefined) ids.splice(to, 0, id);
    setDraft({ type: "order", ids });
  };
  return (
    <ol className="order" aria-label="Put these in order">
      {draft.ids.map((id, i) => (
        <li
          key={id}
          draggable={!locked}
          onDragStart={() => setDragging(i)}
          onDragOver={(e: DragEvent) => e.preventDefault()}
          onDrop={() => dragging !== undefined && move(dragging, i)}
          className={dragging === i ? "dragging" : undefined}
        >
          <span className="handle" aria-hidden="true">
            ⋮⋮
          </span>
          <Html html={renderRich(byId.get(id)?.content ?? [], diagrams)} className="content" />
          <span className="move">
            <button
              type="button"
              disabled={locked || i === 0}
              aria-label="Move up"
              onClick={() => move(i, i - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              disabled={locked || i === draft.ids.length - 1}
              aria-label="Move down"
              onClick={() => move(i, i + 1)}
            >
              ↓
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}

function MatchInput({ part, diagrams, draft, setDraft, locked, reveal }: WidgetProps) {
  if (draft.type !== "match" || part.answer.type !== "match") return null;
  const { left, right, correct } = part.answer;
  const set = (l: string, r: string) => {
    // Each right-hand item pairs with one left-hand item.
    const kept = Object.entries(draft.pairs).filter(([k, v]) => k !== l && v !== r);
    setDraft({ type: "match", pairs: Object.fromEntries(r ? [...kept, [l, r]] : kept) });
  };
  const letterOf = (id: string) => LETTERS[right.findIndex((o) => o.id === id)] ?? "";
  return (
    <div className="match">
      <ol className="match-left">
        {left.map((o, i) => {
          const chosen = draft.pairs[o.id] ?? "";
          const want = correct.find(([l]) => l === o.id)?.[1];
          const state = reveal ? (chosen === want ? " right" : " wrong") : "";
          return (
            <li
              key={o.id}
              className={state.trim() || undefined}
              onDragOver={(e: DragEvent) => e.preventDefault()}
              onDrop={(e: DragEvent) => !locked && set(o.id, e.dataTransfer.getData("text/plain"))}
            >
              <span className="number">{i + 1}</span>
              <Html html={renderRich(o.content, diagrams)} className="content" />
              <label>
                <span className="visually-hidden">Match for item {i + 1}</span>
                <select
                  value={chosen}
                  disabled={locked}
                  onChange={(e) => set(o.id, e.target.value)}
                >
                  <option value="">Choose…</option>
                  {right.map((r, k) => (
                    <option key={r.id} value={r.id}>
                      {LETTERS[k]}
                    </option>
                  ))}
                </select>
              </label>
              {reveal && want && chosen !== want && (
                <span className="should-be">should be {letterOf(want)}</span>
              )}
            </li>
          );
        })}
      </ol>
      <ol className="match-right">
        {right.map((o, k) => (
          <li
            key={o.id}
            draggable={!locked}
            onDragStart={(e: DragEvent) => e.dataTransfer.setData("text/plain", o.id)}
          >
            <span className="letter">{LETTERS[k]}</span>
            <Html html={renderRich(o.content, diagrams)} className="content" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function ConditionInputs({ part, draft, setDraft, locked }: WidgetProps) {
  if (draft.type !== "values" || part.answer.type !== "condition") return null;
  return (
    <div className="condition">
      {part.answer.inputs.map((input, i) => (
        <label key={i}>
          {input === "coordinate" ? `Point ${i + 1}` : `Answer ${i + 1}`}
          <input
            type="text"
            inputMode={input === "number" ? "decimal" : "text"}
            value={draft.texts[i] ?? ""}
            disabled={locked}
            onChange={(e) => {
              const texts = [...draft.texts];
              texts[i] = e.target.value;
              setDraft({ type: "values", texts });
            }}
          />
        </label>
      ))}
    </div>
  );
}

function FreeText({ draft, setDraft, locked }: WidgetProps) {
  if (draft.type !== "text") return null;
  return (
    <label className="answer-field wide">
      <span className="visually-hidden">Your answer</span>
      <textarea
        rows={4}
        value={draft.text}
        disabled={locked}
        onChange={(e) => setDraft({ type: "text", text: e.target.value })}
      />
    </label>
  );
}

/** The right widget for a part's answer type. */
export function PartInput(props: WidgetProps) {
  const { part, diagrams, draft, setDraft, locked, reveal } = props;
  const a = part.answer;
  switch (a.type) {
    case "number":
      return <NumberInput {...props} />;
    case "exact":
      return <ExactInput {...props} />;
    case "coordinate":
      return <CoordinateInput {...props} />;
    case "choice":
      return draft.type === "choice" ? (
        <OptionButtons
          options={a.options}
          diagrams={diagrams}
          selected={draft.id ? [draft.id] : []}
          onToggle={(id) => setDraft({ type: "choice", id })}
          locked={locked}
          {...(reveal ? { correct: [a.correct] } : {})}
          label="Options"
        />
      ) : null;
    case "multi-select":
      return draft.type === "choices" ? (
        <OptionButtons
          multiple
          options={a.options}
          diagrams={diagrams}
          selected={draft.ids}
          onToggle={(id) =>
            setDraft({
              type: "choices",
              ids: draft.ids.includes(id) ? draft.ids.filter((x) => x !== id) : [...draft.ids, id],
            })
          }
          locked={locked}
          {...(reveal ? { correct: a.correct } : {})}
          label="Choose all that apply"
        />
      ) : null;
    case "choice-with-reason":
      return draft.type === "reasoned" ? (
        <>
          <OptionButtons
            options={a.options}
            diagrams={diagrams}
            selected={draft.id ? [draft.id] : []}
            onToggle={(id) => setDraft({ ...draft, id })}
            locked={locked}
            {...(reveal ? { correct: [a.correct] } : {})}
            label="Your answer"
          />
          <p className="reason-prompt">Choose a reason:</p>
          <OptionButtons
            options={a.reasons}
            diagrams={diagrams}
            selected={draft.reason ? [draft.reason] : []}
            onToggle={(reason) => setDraft({ ...draft, reason })}
            locked={locked}
            {...(reveal ? { correct: [a.correctReason] } : {})}
            label="Reasons"
          />
        </>
      ) : null;
    case "order":
      return <OrderInput {...props} />;
    case "match":
      return <MatchInput {...props} />;
    case "plot":
      return props.canvas && draft.type === "points" ? (
        <PlotCanvas
          canvas={props.canvas}
          answer={a}
          points={draft.points}
          setPoints={(points) => setDraft({ type: "points", points })}
          locked={locked}
          reveal={reveal}
        />
      ) : null;
    case "condition":
      return <ConditionInputs {...props} />;
    case "free-text":
      return <FreeText {...props} />;
  }
}
