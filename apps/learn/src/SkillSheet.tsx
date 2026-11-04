// The sheet that opens from a node: the skill, its levels and what each asks, and the way into its
// next lesson (or a refresh, when its review is due); or a unit or year review and the way in. In
// teacher mode every level has its own way in, so a teacher can try any of them.
import { useEffect, useRef } from "react";
import { skillText, topicName, type Level, type PathUnit } from "./course.ts";
import { familyOf } from "./families.ts";
import {
  CheckIcon,
  FamilyIcon,
  IdeaIcon,
  LockIcon,
  RefreshIcon,
  ReviewIcon,
  StarIcon,
  TeacherIcon,
} from "./Icons.tsx";
import type { Selection } from "./PathView.tsx";
import { lessonId } from "./unit-lessons/index.ts";

/** What a sheet can start. */
export type Start =
  | {
      kind: "skill";
      skill: string;
      /** A level a teacher picked, counting from 1. */ level?: number;
    }
  | { kind: "refresh"; skill: string }
  | { kind: "unit"; unit: PathUnit["unit"] }
  | { kind: "lesson"; id: string }
  | { kind: "year" };

const NUMBERS_WORDS = {
  friendly: "friendly numbers",
  standard: "standard numbers",
  stretch: "stretch numbers",
};

const LEVEL_WORDS: Record<Level["name"], string> = {
  Learn: "A worked example, then try it yourself",
  Practise: "The skill in different forms",
  Picture: "Diagrams, words and symbols",
  Reason: "Explain, justify or spot the mistake",
  Legendary: "The hardest questions, for a real challenge",
};

export function SkillSheet({
  selection,
  teacher,
  onClose,
  onStart,
}: {
  selection: Selection | undefined;
  teacher: boolean;
  onClose: () => void;
  onStart: (start: Start) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (selection && !dialog.open) {
      dialog.showModal();
      // Open at the top, on the title, rather than scrolled down to the first button.
      dialog.querySelector<HTMLElement>("#sheet-title")?.focus();
      dialog.scrollTop = 0;
    }
    if (!selection && dialog.open) dialog.close();
  }, [selection]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="sheet-title"
    >
      {selection && (
        <SheetBody selection={selection} teacher={teacher} onClose={onClose} onStart={onStart} />
      )}
    </dialog>
  );
}

function SheetBody({
  selection,
  teacher,
  onClose,
  onStart,
}: {
  selection: Selection;
  teacher: boolean;
  onClose: () => void;
  onStart: (start: Start) => void;
}) {
  if (selection.kind === "year") {
    const { state } = selection;
    return (
      <div className="sheet-body fam-number">
        <p className="eyebrow">The end of the path</p>
        <h2 id="sheet-title" className="sheet-title" tabIndex={-1}>
          <span className="sheet-icon">
            <StarIcon size={26} />
          </span>
          {selection.section.name} review
        </h2>
        <p>
          Twelve questions from across the whole year.{" "}
          {state === "locked"
            ? "It opens when you have finished every unit."
            : state === "done"
              ? "You have done it once. Do it again any time to keep the year fresh."
              : "Finish it for a bonus."}
        </p>
        <div className="sheet-actions">
          <button
            type="button"
            className="button primary big"
            disabled={state === "locked"}
            onClick={() => onStart({ kind: "year" })}
          >
            {state === "done" ? "Do it again" : "Start the year review"}
          </button>
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const { unit } = selection;
  const family = familyOf(unit.unit.topic);
  if (selection.kind === "lesson") {
    const { lesson, done } = selection;
    return (
      <div className={`sheet-body fam-${family}`}>
        <p className="eyebrow">
          Unit {unit.number} · {unit.unit.name}
        </p>
        <h2 id="sheet-title" className="sheet-title" tabIndex={-1}>
          <span className="sheet-icon">
            <IdeaIcon size={26} />
          </span>
          {lesson.title}
        </h2>
        <p>
          {lesson.summary} A hands-on lesson of {lesson.screens.length} short steps, before{" "}
          {lesson.before ? `“${skillText(lesson.before)}”` : "the unit’s skills"}.{" "}
          {done
            ? "You have done it. Do it again any time."
            : "Once it is done, the skills it teaches skip their worked examples."}
        </p>
        {teacher && !selection.open && (
          <p className="teacher-note">
            <TeacherIcon size={18} /> Teacher mode: this lesson is only shown to teachers until it
            has been reviewed.
          </p>
        )}
        <div className="sheet-actions">
          <button
            type="button"
            className="button primary big"
            onClick={() => onStart({ kind: "lesson", id: lessonId(lesson) })}
          >
            {done ? "Do it again" : "Start the lesson"}
          </button>
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  if (selection.kind === "review") {
    return (
      <div className={`sheet-body fam-${family}`}>
        <p className="eyebrow">
          Unit {unit.number} · {unit.unit.name}
        </p>
        <h2 id="sheet-title" className="sheet-title" tabIndex={-1}>
          <span className="sheet-icon">
            {unit.review === "done" ? <CheckIcon size={26} /> : <ReviewIcon size={26} />}
          </span>
          Unit review
        </h2>
        <p>
          A mixed lesson on every skill in this unit, to check it has stuck.{" "}
          {unit.review === "locked"
            ? "It opens when you have finished every skill in the unit."
            : unit.review === "done"
              ? "You have done it. Do it again any time."
              : "Finish it for a bonus."}
        </p>
        <div className="sheet-actions">
          <button
            type="button"
            className="button primary big"
            disabled={unit.review === "locked"}
            onClick={() => onStart({ kind: "unit", unit: unit.unit })}
          >
            {unit.review === "done" ? "Do it again" : "Start the unit review"}
          </button>
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const { node, before } = selection;
  const locked = node.state === "locked";
  return (
    <div className={`sheet-body fam-${family}`}>
      <p className="eyebrow">
        Unit {unit.number} · {topicName(unit.unit.topic)}
      </p>
      <h2 id="sheet-title" className="sheet-title" tabIndex={-1}>
        <span className="sheet-icon">
          <FamilyIcon family={family} size={26} />
        </span>
        {skillText(node.skill)}
      </h2>
      <p className="skill-id">{node.skill}</p>

      {node.due && (
        <p className="due-note">
          <RefreshIcon size={18} /> Due for a refresh. A quick review keeps it in your memory.
        </p>
      )}

      {locked && before ? (
        <p className="locked-note">
          <LockIcon size={18} /> Finish “{skillText(before)}” to open this skill.
        </p>
      ) : null}

      {teacher && (
        <p className="teacher-note">
          <TeacherIcon size={18} /> Teacher mode: try any level below.
        </p>
      )}

      <ol className="levels">
        {node.info.levels.map((level, i) => {
          const n = i + 1;
          const state =
            n <= node.level ? "done" : n === node.level + 1 && !locked ? "next" : "todo";
          const mastery = node.info.mastery === n;
          return (
            <li key={level.name} className={`level level-${state}`}>
              <span className="level-mark" aria-hidden="true">
                {state === "done" ? <CheckIcon size={16} /> : n}
              </span>
              <span className="level-text">
                <strong>
                  {level.name}
                  {mastery && <span className="tag">Mastered</span>}
                </strong>
                <span>
                  {LEVEL_WORDS[level.name]} · depth {level.depths.join(" and ")},{" "}
                  {NUMBERS_WORDS[level.numbers]}
                </span>
              </span>
              <span className="visually-hidden">
                {state === "done" ? "done" : state === "next" ? "next" : "to do"}
              </span>
              {teacher && (
                <button
                  type="button"
                  className="button small-button level-try"
                  onClick={() => onStart({ kind: "skill", skill: node.skill, level: n })}
                >
                  Try<span className="visually-hidden"> {level.name}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <div className="sheet-actions">
        {node.due && (
          <button
            type="button"
            className="button primary big"
            onClick={() => onStart({ kind: "refresh", skill: node.skill })}
          >
            Refresh this skill
          </button>
        )}
        <button
          type="button"
          className={`button big${node.due ? "" : " primary"}`}
          disabled={locked}
          onClick={() => onStart({ kind: "skill", skill: node.skill })}
        >
          {node.level === 0
            ? "Start lesson"
            : node.level >= node.info.levels.length
              ? "Practise again"
              : `Start ${node.info.levels[node.level]?.name ?? "the next level"}`}
        </button>
        <button type="button" className="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
