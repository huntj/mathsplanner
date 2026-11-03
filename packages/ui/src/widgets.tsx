// One input widget per answer type. Each shows the part's options or fields, holds nothing itself
// (the draft lives in the session), and is locked once the part has been checked.
import type { DiagramSpec, Option, Part, Question } from "@mathsplanner/core";
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

/** A key for something a phone keyboard may lack: what it types, and what it is called. */
interface Key {
  label: string;
  name: string;
  text: string;
}

const MINUS: Key = { label: "−", name: "Minus sign", text: "-" };
const SLASH: Key = { label: "/", name: "Fraction bar", text: "/" };
const NUMBER_KEYS = [MINUS, SLASH];
const POINT_KEYS = [
  MINUS,
  SLASH,
  { label: "(", name: "Open bracket", text: "(" },
  { label: ",", name: "Comma", text: "," },
  { label: ")", name: "Close bracket", text: ")" },
];
/** For the maths keyboard: LaTeX to insert, with #? for a box to type into. */
const MATH_KEYS: Key[] = [
  MINUS,
  { label: "a/b", name: "Fraction", text: "\\frac{#@}{#?}" },
  { label: "xⁿ", name: "Power", text: "^{#?}" },
  { label: "√", name: "Square root", text: "\\sqrt{#?}" },
  { label: "(", name: "Open bracket", text: "(" },
  { label: ")", name: "Close bracket", text: ")" },
];

/**
 * A row of keys under an answer box, for the minus sign, fraction bar and the like, which a phone's
 * number keyboard does not always have. A key types at the cursor without taking the focus.
 */
function AnswerKeys({ keys, onKey }: { keys: readonly Key[]; onKey: (text: string) => void }) {
  return (
    <div className="answer-keys" role="group" aria-label="Maths keys">
      {keys.map((k) => (
        <button
          key={k.name}
          type="button"
          aria-label={k.name}
          title={k.name}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => onKey(k.text)}
        >
          {k.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Types `text` into a text box at its cursor (at the end if the box does not have the focus), and
 * puts the cursor after it.
 */
function typeInto(
  input: HTMLInputElement | null,
  value: string,
  text: string,
  set: (v: string) => void,
) {
  const focused = input !== null && document.activeElement === input;
  const start = focused ? (input.selectionStart ?? value.length) : value.length;
  const end = focused ? (input.selectionEnd ?? start) : value.length;
  const next = value.slice(0, start) + text + value.slice(end);
  set(next);
  const caret = start + text.length;
  // The new value leaves the cursor at the end, so it only needs moving after typing in the middle
  // or into a box that did not have the focus.
  if (focused && caret === next.length) return;
  requestAnimationFrame(() => {
    input?.focus();
    input?.setSelectionRange(caret, caret);
  });
}

function NumberInput({ part, draft, setDraft, locked }: WidgetProps) {
  const ref = useRef<HTMLInputElement>(null);
  if (draft.type !== "text" || part.answer.type !== "number") return null;
  const units = part.answer.units;
  return (
    <div className="keyed">
      <label className="answer-field">
        <span className="visually-hidden">Your answer</span>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft.text}
          disabled={locked}
          placeholder="Your answer"
          onChange={(e) => setDraft({ type: "text", text: e.target.value })}
        />
        {units && (
          <span className="units">{units === "°" || units === "degrees" ? "°" : units}</span>
        )}
      </label>
      {!locked && (
        <AnswerKeys
          keys={NUMBER_KEYS}
          onKey={(t) =>
            typeInto(ref.current, draft.text, t, (text) => setDraft({ type: "text", text }))
          }
        />
      )}
    </div>
  );
}

type MathField = HTMLElement & {
  value: string;
  executeCommand: (command: [string, ...unknown[]]) => boolean;
};

/**
 * Keeps `--math-keyboard-height` on the page root at the height of MathLive's on-screen keyboard
 * (0px when it is hidden), so an app can keep its buttons above it. Watches once per page.
 */
let watching = false;
function watchMathKeyboard() {
  const keyboard = (
    window as {
      mathVirtualKeyboard?: EventTarget & { boundingRect: DOMRect; visible: boolean };
    }
  ).mathVirtualKeyboard;
  if (watching || !keyboard) return;
  watching = true;
  keyboard.addEventListener("geometrychange", () => {
    const height = keyboard.visible ? keyboard.boundingRect.height : 0;
    document.documentElement.style.setProperty("--math-keyboard-height", `${height}px`);
  });
}

/** The MathLive maths keyboard, loaded only when an exact answer is needed. */
function ExactInput({ draft, setDraft, locked }: WidgetProps) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void import("mathlive").then(() => {
      watchMathKeyboard();
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const field = ref.current as MathField | null;
    if (!field) return;
    const onInput = () => setDraft({ type: "exact", latex: field.value });
    field.addEventListener("input", onInput);
    return () => field.removeEventListener("input", onInput);
  });
  if (draft.type !== "exact") return null;
  if (!ready) return <p className="muted">Loading the maths keyboard…</p>;
  const insert = (latex: string) => {
    const field = ref.current as MathField | null;
    if (!field) return;
    field.focus();
    field.executeCommand(["insert", latex, { selectionMode: "placeholder" }]);
    setDraft({ type: "exact", latex: field.value });
  };
  return (
    <div className="keyed">
      <math-field
        ref={ref}
        class="math-field"
        aria-label="Your answer"
        read-only={locked ? "" : undefined}
      >
        {draft.latex}
      </math-field>
      {!locked && <AnswerKeys keys={MATH_KEYS} onKey={insert} />}
    </div>
  );
}

function CoordinateInput({ draft, setDraft, locked }: WidgetProps) {
  const refs = { x: useRef<HTMLInputElement>(null), y: useRef<HTMLInputElement>(null) };
  const last = useRef<"x" | "y">("x");
  if (draft.type !== "coordinate") return null;
  const box = (axis: "x" | "y") => (
    <input
      ref={refs[axis]}
      aria-label={axis}
      inputMode="decimal"
      value={draft[axis]}
      disabled={locked}
      onFocus={() => (last.current = axis)}
      onChange={(e) => setDraft({ ...draft, [axis]: e.target.value })}
    />
  );
  return (
    <div className="keyed">
      <span className="coordinate">
        ({box("x")},{box("y")})
      </span>
      {!locked && (
        <AnswerKeys
          keys={NUMBER_KEYS}
          onKey={(t) => {
            const axis = last.current;
            typeInto(refs[axis].current, draft[axis], t, (v) => setDraft({ ...draft, [axis]: v }));
          }}
        />
      )}
    </div>
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
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const last = useRef(0);
  if (draft.type !== "values" || part.answer.type !== "condition") return null;
  const set = (i: number, value: string) => {
    const texts = [...draft.texts];
    texts[i] = value;
    setDraft({ type: "values", texts });
  };
  const points = part.answer.inputs.includes("coordinate");
  return (
    <div className="keyed">
      <div className="condition">
        {part.answer.inputs.map((input, i) => (
          <label key={i}>
            {input === "coordinate" ? `Point ${i + 1}` : `Answer ${i + 1}`}
            <input
              ref={(el) => {
                boxes.current[i] = el;
              }}
              type="text"
              inputMode={input === "number" ? "decimal" : "text"}
              value={draft.texts[i] ?? ""}
              disabled={locked}
              onFocus={() => (last.current = i)}
              onChange={(e) => set(i, e.target.value)}
            />
          </label>
        ))}
      </div>
      {!locked && (
        <AnswerKeys
          keys={points ? POINT_KEYS : NUMBER_KEYS}
          onKey={(t) => {
            const i = last.current;
            typeInto(boxes.current[i] ?? null, draft.texts[i] ?? "", t, (v) => set(i, v));
          }}
        />
      )}
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

/** The diagram a plot part draws on: the last one in the stem. It becomes the drawing area. */
export function canvasIndex(question: Question): number | undefined {
  if (!question.parts.some((p) => p.answer.type === "plot")) return undefined;
  const indices = question.stem.flatMap((n) => (n.t === "diagram" ? [n.i] : []));
  return indices.at(-1);
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
