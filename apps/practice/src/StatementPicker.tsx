// The list of statements to tick, each with its steps (sub-statements) in a dropdown under it.
// Ticking a statement includes all of its steps; opening the dropdown lets you tick single steps.
// The practice set-up and the scheme of work both use it.
import type { Statement } from "@mathsplanner/core";
import type { DragEvent, ReactNode } from "react";
import { stepsOf } from "./session.ts";

interface Props {
  /** Top-level statements to offer; their steps come from stepsOf. */
  statements: readonly Statement[];
  query: string;
  isChosen: (id: string) => boolean;
  onToggle: (id: string) => void;
  /** Something to show at the end of a row, such as where the statement is planned. */
  note?: (id: string) => ReactNode;
  /** Rows can be dragged out by ID, e.g. into a half-term. */
  onDragStart?: (id: string, e: DragEvent) => void;
  /** Rows that cannot be ticked, e.g. statements planned in another half-term. */
  isDisabled?: (id: string) => boolean;
  /** Shown when nothing is listed. */
  empty?: string;
}

export function StatementPicker({
  statements,
  query,
  isChosen,
  onToggle,
  note,
  onDragStart,
  isDisabled,
  empty = "Nothing matches the search.",
}: Props) {
  const q = query.trim().toLowerCase();
  const hit = (s: { id: string; text: string }) =>
    !q || s.id.toLowerCase().includes(q) || s.text.toLowerCase().includes(q);
  // Statements at the top level; a statement also shows when one of its steps matches the search.
  const visible = statements.filter((s) => hit(s) || (stepsOf.get(s.id) ?? []).some(hit));
  const drag = (id: string) =>
    onDragStart && {
      draggable: true,
      onDragStart: (e: DragEvent) => onDragStart(id, e),
    };

  const row = (s: Statement, checked: boolean, disabled = false) => (
    <label className="check" {...drag(s.id)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled || isDisabled?.(s.id)}
        onChange={() => onToggle(s.id)}
      />
      <code>{s.id}</code> <span>{s.text}</span>
      {note?.(s.id)}
    </label>
  );

  return (
    <ul className="statement-picker">
      {visible.map((s) => {
        const steps = stepsOf.get(s.id) ?? [];
        const whole = isChosen(s.id);
        const open = steps.some((x) => isChosen(x.id)) || (q !== "" && steps.some(hit));
        return (
          <li key={s.id}>
            {row(s, whole)}
            {steps.length > 0 && (
              <details className="steps" open={open || undefined}>
                <summary>
                  {steps.length} steps{whole ? " (all included)" : ""}
                </summary>
                <ul>
                  {steps.map((x) => (
                    <li key={x.id}>{row(x, whole || isChosen(x.id), whole && !isChosen(x.id))}</li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        );
      })}
      {visible.length === 0 && <li className="muted empty">{empty}</li>}
    </ul>
  );
}
