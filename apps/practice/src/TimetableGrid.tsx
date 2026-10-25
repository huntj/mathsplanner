// The teacher's timetable as a grid, a day a column and a period a row, with each cell drawn by
// the page using it: the set-up gives periods to classes in it, and the homework step and the
// dashboard show the classes' lessons. A lesson's height follows the lesson length.
import type { CSSProperties, ReactNode } from "react";
import { DAYS, WEEK_NAMES, type SchoolClass, type Slot, type Timetable } from "./workspace.ts";

/** How tall a lesson is drawn: longer lessons are taller, within limits that stay usable. */
export const lessonHeight = (minutes: number) => Math.round(Math.min(120, Math.max(44, minutes)));

export function TimetableGrid({
  timetable,
  week,
  cell,
  label,
}: {
  timetable: Timetable;
  week: 0 | 1;
  cell: (slot: Slot) => ReactNode;
  label: string;
}) {
  const style = {
    "--lesson-height": `${lessonHeight(timetable.lessonMinutes)}px`,
  } as CSSProperties;
  return (
    <div className="timetable" style={style}>
      <table aria-label={label}>
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Period</span>
            </th>
            {DAYS.map((day) => (
              <th key={day} scope="col">
                <span className="day-long">{day}</span>
                <span className="day-short" aria-hidden="true">
                  {day.slice(0, 3)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: timetable.periods }, (_, period) => (
            <tr key={period}>
              <th scope="row">
                <span className="visually-hidden">Period </span>
                <span aria-hidden="true">P</span>
                {period + 1}
              </th>
              {DAYS.map((day, d) => (
                <td key={day}>{cell({ week, day: d, period })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Week A and Week B, for a two-week timetable; nothing for a one-week one. */
export function WeekSwitch({
  timetable,
  week,
  onChange,
}: {
  timetable: Timetable;
  week: 0 | 1;
  onChange: (week: 0 | 1) => void;
}) {
  if (timetable.weeks === 1) return null;
  return (
    <div className="week-switch" role="group" aria-label="Which week">
      {WEEK_NAMES.map((name, i) => (
        <button
          key={name}
          type="button"
          aria-pressed={week === i}
          onClick={() => onChange(i as 0 | 1)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

/** A class's colour swatch, beside its name. */
export const Swatch = ({ cls }: { cls: SchoolClass }) => (
  <span className={`swatch class-c${cls.colour}`} aria-hidden="true" />
);

/** What a class is called: its name, or its course if it has none. */
export const className = (cls: SchoolClass) => cls.scheme.className || cls.scheme.title;
