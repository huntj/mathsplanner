import { describe, expect, it } from "vitest";
import { lessonPlan, setLessons, TERMS, weekPlan, placeItem, type Scheme } from "./scheme.ts";
import { stepsOf } from "./session.ts";
import {
  addClass,
  classAt,
  classLessons,
  cleanWorkspace,
  defaultDue,
  dateOf,
  dayNumber,
  homeworkDates,
  longDate,
  readWorkspaceFile,
  removeClass,
  settle,
  setupProgress,
  slotName,
  startWeekFor,
  suggestedTerms,
  teachingWeeks,
  termProblems,
  testLessons,
  toggleSlot,
  updateClass,
  weekday,
  weekFor,
  whereWeAre,
  workspaceFile,
  type HalfTermDates,
  type Slot,
  type Workspace,
} from "./workspace.ts";

/** 2026 to 2027: Autumn 1 starts on a Wednesday and Summer 2 ends on one. */
const TERMS_2026: HalfTermDates[] = [
  { start: "2026-09-02", end: "2026-10-23" },
  { start: "2026-11-02", end: "2026-12-18" },
  { start: "2027-01-04", end: "2027-02-12" },
  { start: "2027-02-22", end: "2027-03-26" },
  { start: "2027-04-12", end: "2027-05-28" },
  { start: "2027-06-07", end: "2027-07-21" },
];

const slot = (day: number, period: number, week: 0 | 1 = 0): Slot => ({ week, day, period });

function workspace(weeks: 1 | 2 = 1, carryOn = true): Workspace {
  return settle({
    timetable: { weeks, carryOn, firstWeek: 0, periods: 5, lessonMinutes: 60 },
    terms: TERMS_2026,
    classes: [],
  });
}

/** 7X2 on Monday periods 1 and 2 (a double) and Wednesday period 3. */
function withClass(ws = workspace()): Workspace {
  let next = addClass(ws, "Y7", "7X2");
  const id = next.classes[0]?.id ?? "";
  for (const s of [slot(0, 0), slot(0, 1), slot(2, 2)]) next = toggleSlot(next, id, s);
  return next;
}

const first = (ws: Workspace) => ws.classes[0] as Workspace["classes"][number];

describe("dates", () => {
  it("reads and writes dates and days of the week", () => {
    expect(dayNumber("2026-02-30")).toBeUndefined();
    expect(dayNumber("26-10-25")).toBeUndefined();
    const day = dayNumber("2026-10-25") ?? 0;
    expect(dateOf(day)).toBe("2026-10-25");
    expect(weekday(day)).toBe(6);
    expect(weekday(dayNumber("1969-12-29") ?? 0)).toBe(0);
  });

  it("suggests half-terms for the school year a date is in", () => {
    const terms = suggestedTerms("2026-10-25");
    expect(terms[0]).toEqual({ start: "2026-09-02", end: "2026-10-23" });
    expect(terms[1]?.start).toBe("2026-11-02");
    expect(terms[2]?.start).toBe("2027-01-04");
    expect(suggestedTerms("2027-03-01")).toEqual(terms);
    expect(termProblems(terms, TERMS)).toEqual([]);
    // 2 September 2028 is a Saturday.
    expect(suggestedTerms("2028-09-01")[0]?.start).toBe("2028-09-04");
  });

  it("explains what is wrong with half-term dates", () => {
    const terms = [
      { start: "", end: "2026-10-23" },
      { start: "2026-11-02", end: "2026-10-30" },
      { start: "2026-10-01", end: "2027-04-01" },
    ];
    expect(termProblems(terms, TERMS)).toEqual([
      "Autumn 1 needs a start and an end date.",
      "Autumn 2 ends before it starts.",
      "Spring 1 is longer than 12 weeks. Is it a whole term? Give each half-term its own dates.",
      "Spring 1 starts before the half-term before it ends.",
    ]);
  });
});

describe("the calendar", () => {
  it("counts the teaching weeks of each half-term, part weeks included", () => {
    const weeks = teachingWeeks(workspace());
    const per = TERMS.map((_, t) => weeks.filter((w) => w.term === t).length);
    expect(per).toEqual([8, 7, 6, 5, 7, 7]);
    expect(weeks[0]).toMatchObject({
      monday: "2026-08-31",
      days: [false, false, true, true, true],
    });
    expect(weeks.at(-1)?.days).toEqual([true, true, true, false, false]);
    expect(weeks.every((w) => w.label === 0)).toBe(true);
  });

  it("alternates Week A and B, carrying on through holidays or starting again", () => {
    const labels = (ws: Workspace) => teachingWeeks(ws).map((w) => w.label);
    // Autumn 2 ends on its 15th teaching week, a Week A.
    expect(labels(workspace(2, true)).slice(13, 17)).toEqual([1, 0, 1, 0]);
    expect(labels(workspace(2, false)).slice(13, 17)).toEqual([1, 0, 0, 1]);
    const fromB = {
      ...workspace(2),
      timetable: { ...workspace(2).timetable, firstWeek: 1 as const },
    };
    expect(labels(fromB).slice(0, 3)).toEqual([1, 0, 1]);
  });

  it("finds this week, or after a holiday or weekend the next teaching week", () => {
    const weeks = teachingWeeks(workspace());
    expect(weeks[weekFor(weeks, "2026-10-21") ?? -1]?.monday).toBe("2026-10-19");
    // A Sunday in the October half-term looks ahead to the first week back.
    expect(weeks[weekFor(weeks, "2026-10-25") ?? -1]?.monday).toBe("2026-11-02");
    expect(weekFor(weeks, "2026-08-01")).toBe(0);
    expect(weekFor(weeks, "2027-08-01")).toBeUndefined();
  });

  it("gives a class's lessons with dates, a double as two", () => {
    const ws = withClass();
    const lessons = classLessons(ws, first(ws));
    const autumn1 = lessons.filter((l) => l.term === 0);
    // The first week starts on a Wednesday, so it has only the Wednesday lesson.
    expect(autumn1).toHaveLength(1 + 7 * 3);
    expect(autumn1[0]).toMatchObject({ date: "2026-09-02", period: 2, index: 0, week: 0 });
    expect(autumn1[1]).toMatchObject({ date: "2026-09-07", period: 0, index: 1 });
    expect(autumn1[2]).toMatchObject({ date: "2026-09-07", period: 1, index: 2 });
    expect(lessons.filter((l) => l.term === 1)[0]?.index).toBe(0);
  });

  it("gives a two-week timetable's lessons by Week A and Week B", () => {
    let ws = addClass(workspace(2), "Y7", "7X2");
    const id = first(ws).id;
    for (const s of [slot(0, 0, 0), slot(0, 0, 1), slot(1, 0, 1)]) ws = toggleSlot(ws, id, s);
    expect(first(ws).scheme.weekLessons?.[1]).toEqual([1, 2, 1, 2, 1, 2, 1]);
    expect(first(ws).scheme.weekLessons?.[2]?.[0]).toBe(2);
  });
});

describe("schemes on the calendar", () => {
  it("takes each half-term's weeks and lessons from the timetable", () => {
    const scheme = first(withClass()).scheme;
    expect(scheme.className).toBe("7X2");
    expect(scheme.halfTerms.map((h) => h.weeks)).toEqual([8, 7, 6, 5, 7, 7]);
    expect(scheme.weekLessons?.[0]).toEqual([1, 3, 3, 3, 3, 3, 3, 3]);
    expect(scheme.lessonsPerWeek).toBe(3);
  });

  it("puts items in weeks by the lessons each week really has", () => {
    let ws = withClass();
    ws = updateClass(ws, first(ws).id, (c) => {
      let scheme: Scheme = c.scheme;
      for (const id of ["Y7-ALG-01", "Y7-ALG-02", "Y7-ALG-03"]) {
        scheme = setLessons(placeItem(scheme, id, 0), id, 2);
      }
      return { ...c, scheme };
    });
    const plan = weekPlan(first(ws).scheme, 0);
    // Week 1 has one lesson, so the second item, at lesson 3, starts in week 2 and the third,
    // at lesson 5, in week 3.
    expect(plan.starts).toEqual([0, 1, 2]);
    expect(plan.capacity).toBe(22);
    expect(plan.weeks).toHaveLength(8);
  });

  it("lists what each lesson teaches, a step a lesson by default", () => {
    const ws = addClass(workspace(), "GF10", "10Y1");
    const scheme = placeItem(first(ws).scheme, "GF-A4", 0);
    const steps = (stepsOf.get("GF-A4") ?? []).map((s) => s.id);
    expect(steps.length).toBeGreaterThan(1);
    expect(lessonPlan(scheme, 0)).toEqual(steps);
    expect(lessonPlan(setLessons(scheme, "GF-A4", 2), 0)).toEqual(["GF-A4", "GF-A4"]);
    expect(lessonPlan(scheme, 1)).toEqual([]);
  });
});

describe("homework and tests", () => {
  it("sets homework in its lesson and has it in at the next lesson chosen", () => {
    let ws = withClass();
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      homework: [{ set: slot(0, 1), due: slot(2, 2) }],
    }));
    const dates = homeworkDates(classLessons(ws, first(ws)), first(ws));
    expect(dates[0]?.set.date).toBe("2026-09-07");
    expect(dates[0]?.due?.date).toBe("2026-09-09");
    expect(dates.at(-1)?.set.date).toBe("2027-07-19");
    expect(dates.at(-1)?.due?.date).toBe("2027-07-21");
    expect(dates.filter((d) => d.set.term === 0)).toHaveLength(7);
  });

  it("has homework due a week later when it is set and handed in at the same lesson", () => {
    let ws = withClass();
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      homework: [{ set: slot(2, 2), due: slot(2, 2) }],
    }));
    const dates = homeworkDates(classLessons(ws, first(ws)), first(ws));
    expect(dates[0]?.due?.date).toBe("2026-09-09");
    // Over the October half-term.
    expect(dates[7]?.set.date).toBe("2026-10-21");
    expect(dates[7]?.due?.date).toBe("2026-11-04");
    expect(dates.at(-1)?.due).toBeUndefined();
  });

  it("puts each half-term's test in its last lesson unless another is chosen", () => {
    let ws = withClass();
    const tests = () => testLessons(classLessons(ws, first(ws)), first(ws));
    expect(tests()[0]?.date).toBe("2026-10-21");
    expect(tests()).toHaveLength(6);
    ws = updateClass(ws, first(ws).id, (c) => ({ ...c, tests: [0, 999] }));
    expect(tests()[0]?.date).toBe("2026-09-02");
    expect(tests()[1]?.date).toBe("2026-12-16");
  });
});

describe("editing the set-up", () => {
  it("gives a period to one class at a time", () => {
    let ws = addClass(withClass(), "Y8", "8B");
    const [a, b] = ws.classes.map((c) => c.id);
    expect(ws.classes.map((c) => c.colour)).toEqual([0, 1]);
    ws = toggleSlot(ws, b ?? "", slot(0, 0));
    expect(classAt(ws, slot(0, 0))?.id).toBe(b);
    expect(first(ws).slots).toHaveLength(2);
    ws = toggleSlot(ws, b ?? "", slot(0, 0));
    expect(classAt(ws, slot(0, 0))).toBeUndefined();
    expect(removeClass(ws, a ?? "").classes.map((c) => c.id)).toEqual([b]);
  });

  it("drops periods and homework that no longer fit the timetable", () => {
    let ws = withClass(workspace(2));
    ws = toggleSlot(ws, first(ws).id, slot(4, 4, 1));
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      homework: [
        { set: slot(0, 0), due: slot(2, 2) },
        { set: slot(4, 4, 1), due: slot(4, 4, 1) },
      ],
    }));
    expect(first(ws).homework).toHaveLength(2);
    ws = settle({ ...ws, timetable: { ...ws.timetable, weeks: 1, periods: 2 } });
    expect(first(ws).slots).toEqual([slot(0, 0), slot(0, 1)]);
    expect(first(ws).homework).toEqual([]);
  });

  it("only adds classes on one-year courses", () => {
    expect(addClass(workspace(), "KS3", "7X").classes).toEqual([]);
    expect(addClass(workspace(), "NOPE", "7X").classes).toEqual([]);
    expect(first(addClass(workspace(), "AL12", "12A")).scheme.course).toBe("AL12");
  });
});

describe("backups", () => {
  it("round-trips the set-up through its backup file", () => {
    let ws = withClass(workspace(2, false));
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      homework: [{ set: slot(0, 0), due: slot(2, 2) }],
      tests: [3, null, null, null, null, 0],
      scheme: placeItem(c.scheme, "Y7-ALG-01", 2),
    }));
    const text = workspaceFile(ws);
    const file = JSON.parse(text);
    expect(file.format).toBe("mathsplanner-workspace");
    expect(file.classes[0].scheme.format).toBe("mathsplanner-scheme");
    expect(file.classes[0].scheme.weekLessons).toBeUndefined();
    expect(readWorkspaceFile(text)).toEqual(ws);
  });

  it("rejects other files and drops what it cannot read", () => {
    expect(() => readWorkspaceFile("nope")).toThrow(/not JSON/);
    expect(() => readWorkspaceFile('{"format": "mathsplanner-scheme"}')).toThrow(/not a/);
    const ws = cleanWorkspace({
      format: "mathsplanner-workspace",
      timetable: { weeks: 3, periods: 99, lessonMinutes: "x", carryOn: "yes" },
      terms: [{ start: "2026-09-02", end: "2026-02-30" }],
      classes: [
        { scheme: { format: "mathsplanner-scheme", course: "KS3", halfTerms: [] } },
        { scheme: { format: "nope" } },
        {
          id: "a",
          slots: [slot(0, 0), { week: 5, day: 0, period: 0 }, slot(0, 0)],
          tests: ["x", 2],
          scheme: { format: "mathsplanner-scheme", course: "Y9", halfTerms: [] },
        },
      ],
    });
    expect(ws?.timetable).toEqual({
      weeks: 1,
      carryOn: true,
      firstWeek: 0,
      periods: 5,
      lessonMinutes: 60,
    });
    expect(ws?.terms[0]).toEqual({ start: "2026-09-02", end: "" });
    expect(ws?.terms).toHaveLength(6);
    expect(ws?.classes.map((c) => c.id)).toEqual(["a"]);
    expect(ws?.classes[0]?.slots).toEqual([slot(0, 0)]);
    expect(ws?.classes[0]?.tests).toEqual([null, 2, null, null, null, null]);
    expect(cleanWorkspace({ format: "other" })).toBeUndefined();
  });
});

describe("words for the set-up", () => {
  it("names dates and periods", () => {
    expect(longDate("2026-11-02")).toBe("Monday 2 November");
    expect(longDate("2026-11-02", true)).toBe("Monday 2 November 2026");
    expect(longDate("")).toBe("");
    const one = workspace().timetable;
    const two = workspace(2).timetable;
    expect(slotName(one, slot(2, 0))).toBe("Wednesday period 1");
    expect(slotName(two, slot(2, 0, 1))).toBe("Week B, Wednesday period 1");
    expect(slotName(two, slot(4, 3), true)).toBe("A Fri P4");
    expect(slotName(one, slot(4, 3), true)).toBe("Fri P4");
  });

  it("says where the year is", () => {
    const ws = workspace(2);
    expect(whereWeAre(ws, "2026-10-21")).toBe("This is week 8 of Autumn 1 (Week B).");
    expect(whereWeAre(ws, "2026-10-17")).toBe("Next week is week 8 of Autumn 1 (Week B).");
    expect(whereWeAre(ws, "2026-10-25")).toBe("Autumn 2 starts on Monday 2 November (Week A).");
    expect(whereWeAre(workspace(), "2026-08-31")).toBe("Autumn 1 starts on Wednesday 2 September.");
    expect(whereWeAre(ws, "2027-08-01")).toBe("The school year in your half-term dates is over.");
  });

  it("finds the start week from which week a date is in", () => {
    const ws = workspace(2);
    const weeks = teachingWeeks(ws);
    const i = weekFor(weeks, "2026-11-04") ?? 0;
    expect(weeks[i]?.label).toBe(0);
    const first = startWeekFor(ws, i, 1);
    expect(first).toBe(1);
    const moved = { ...ws, timetable: { ...ws.timetable, firstWeek: first } };
    expect(teachingWeeks(moved)[i]?.label).toBe(1);
    expect(startWeekFor(ws, i, 0)).toBe(0);
  });

  it("suggests handing homework in about a week after it is set", () => {
    const ws = withClass();
    const tt = ws.timetable;
    expect(defaultDue(tt, first(ws), slot(0, 1))).toEqual(slot(0, 1));
    expect(defaultDue(tt, first(ws), slot(2, 2))).toEqual(slot(2, 2));
    let two = addClass(workspace(2), "Y7", "7X2");
    for (const s of [slot(0, 0, 0), slot(3, 0, 0), slot(0, 0, 1)])
      two = toggleSlot(two, first(two).id, s);
    expect(defaultDue(two.timetable, first(two), slot(0, 0, 0))).toEqual(slot(0, 0, 1));
    // From Thursday of Week A, Monday of the next Week A is nearer a week than Week B's Monday.
    expect(defaultDue(two.timetable, first(two), slot(3, 0, 0))).toEqual(slot(0, 0, 0));
  });

  it("tracks how far the set-up has got", () => {
    let ws = addClass(workspace(), "Y7", "7X2");
    expect(setupProgress(ws)).toEqual({ classes: false, homework: false, schemes: false });
    ws = toggleSlot(ws, first(ws).id, slot(0, 0));
    expect(setupProgress(ws)).toEqual({ classes: true, homework: false, schemes: false });
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      noHomework: true,
      homework: [{ set: slot(0, 0), due: slot(0, 0) }],
    }));
    expect(first(ws).homework).toEqual([]);
    expect(setupProgress(ws).homework).toBe(true);
    ws = updateClass(ws, first(ws).id, (c) => ({
      ...c,
      scheme: placeItem(c.scheme, "Y7-ALG-01", 0),
    }));
    expect(setupProgress(ws).schemes).toBe(true);
  });
});
