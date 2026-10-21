// Measuring instruments for scale reading: clocks, rulers, measuring jugs, thermometers and the
// dials of weighing scales. Every mark is drawn from the numbers, so a reading is never ambiguous,
// and the default descriptions describe the instrument without giving the reading away.
import type { Scene } from "../scene.ts";
import type { ClockSpec, RulerSpec, ScaleSpec } from "../spec.ts";
import { circle, fmt, line, path, type Point } from "../svg.ts";
import { layoutLabel } from "../text.ts";
import { numberLabel, numberPlain, plain } from "./shared.ts";

const NUMBER_SIZE = 13;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const isWhole = (x: number) => close(x, Math.round(x));

/** Text centred on (x, y) horizontally, with its baseline at y + ascent / 2. */
function centred(latex: string, at: Point, size = NUMBER_SIZE): string {
  const t = layoutLabel(latex, size);
  return t.svg(at[0] - t.width / 2, at[1] + t.ascent / 2 - t.descent / 2);
}

const scene = (
  shapes: string[],
  bounds: Scene["bounds"],
  description: string,
  problems: string[],
): Scene => ({
  shapes: [`<g fill="none">${shapes.join("")}</g>`],
  bounds,
  obstacles: [],
  labels: [],
  description,
  problems,
});

// --- clock ---------------------------------------------------------------------------------

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
const CLOCK_R = 80;

export function checkClock(spec: ClockSpec): string[] {
  const problems: string[] = [];
  if (!(Number.isInteger(spec.hours) && spec.hours >= 0 && spec.hours <= 23))
    problems.push(`hours must be a whole number from 0 to 23, not ${spec.hours}`);
  if (!(Number.isInteger(spec.minutes) && spec.minutes >= 0 && spec.minutes <= 59))
    problems.push(`minutes must be a whole number from 0 to 59, not ${spec.minutes}`);
  return problems;
}

export function describeClock(spec: ClockSpec): string {
  if (spec.description) return spec.description;
  const numerals = spec.roman ? "Roman numerals I to XII" : "the numbers 1 to 12";
  return spec.hideHands
    ? `An analogue clock face with ${numerals} and no hands.`
    : `An analogue clock face with ${numerals}, an hour hand and a minute hand.`;
}

/** A point at `deg` clockwise from 12 o'clock and radius r (y down). */
const clockAt = (deg: number, r: number): Point => [
  r * Math.sin((deg * Math.PI) / 180),
  -r * Math.cos((deg * Math.PI) / 180),
];

export function layoutClock(spec: ClockSpec): Scene {
  const R = CLOCK_R;
  const shapes: string[] = [circle([0, 0], R, { width: 2.4 })];
  for (let m = 0; m < 60; m++) {
    const hour = m % 5 === 0;
    shapes.push(
      line(clockAt(m * 6, R - (hour ? 9 : 4)), clockAt(m * 6, R - 1), { width: hour ? 1.8 : 0.8 }),
    );
  }
  const numbers: string[] = [];
  for (let h = 0; h < 12; h++) {
    const text = spec.roman ? `\\text{${ROMAN[h] ?? ""}}` : String(h === 0 ? 12 : h);
    numbers.push(centred(text, clockAt(h * 30, R - (spec.roman ? 22 : 21)), spec.roman ? 12 : 15));
  }
  shapes.push(`<g fill="currentColor" stroke="none">${numbers.join("")}</g>`);
  if (!spec.hideHands) {
    const hourDeg = ((spec.hours % 12) + spec.minutes / 60) * 30;
    shapes.push(line([0, 0], clockAt(hourDeg, R * 0.36), { width: 4.5 }));
    shapes.push(line([0, 0], clockAt(spec.minutes * 6, R * 0.56), { width: 2.4 }));
  }
  shapes.push(circle([0, 0], 3.5, { filled: true, width: 1 }));
  return scene(
    shapes,
    { x: -R - 2, y: -R - 2, w: 2 * R + 4, h: 2 * R + 4 },
    describeClock(spec),
    checkClock(spec),
  );
}

// --- ruler ---------------------------------------------------------------------------------

const PER_CM = 36;
const RULER_H = 46;

export function checkRuler(spec: RulerSpec): string[] {
  const problems: string[] = [];
  if (!(Number.isInteger(spec.length) && spec.length >= 1 && spec.length <= 15))
    problems.push(`a ruler is 1 to 15 whole centimetres long, not ${spec.length}`);
  const o = spec.object;
  if (o) {
    if (!(o.from >= 0 && o.to <= spec.length && o.from < o.to))
      problems.push(`the object must lie on the ruler, from a smaller reading to a larger one`);
    const step = spec.mm === false ? 1 : 0.1;
    if (!isWhole(o.from / step) || !isWhole(o.to / step))
      problems.push(
        `the object's ends must be on ${spec.mm === false ? "centimetre" : "millimetre"} marks`,
      );
  }
  return problems;
}

export function describeRuler(spec: RulerSpec): string {
  if (spec.description) return spec.description;
  const mm = spec.mm === false ? "" : ", with millimetre marks";
  return `A ruler marked in centimetres from 0 to ${spec.length}${mm}.${spec.object ? " An object lies along it." : ""}`;
}

export function layoutRuler(spec: RulerSpec): Scene {
  const x = (cm: number) => cm * PER_CM;
  const shapes: string[] = [
    path(`M ${fmt(-12)} 0 H ${fmt(x(spec.length) + 12)} V ${RULER_H} H ${fmt(-12)} Z`, {
      width: 1.4,
    }),
  ];
  const ticks = spec.mm === false ? spec.length : spec.length * 10;
  const per = spec.mm === false ? 1 : 0.1;
  for (let i = 0; i <= ticks; i++) {
    const cm = i * per;
    const whole = isWhole(cm);
    const half = !whole && isWhole(cm * 2);
    const len = whole ? 15 : half ? 10 : 6;
    shapes.push(line([x(cm), 0], [x(cm), len], { width: whole ? 1.2 : 0.7 }));
  }
  const numbers: string[] = [];
  for (let cm = 0; cm <= spec.length; cm++) numbers.push(centred(String(cm), [x(cm), 27], 12));
  numbers.push(centred("\\text{cm}", [x(0) + 4, 40], 10));
  shapes.push(`<g fill="currentColor" stroke="none">${numbers.join("")}</g>`);
  let top = 0;
  if (spec.object) {
    const [a, b] = [x(spec.object.from), x(spec.object.to)];
    shapes.push(
      `<rect x="${fmt(a)}" y="-30" width="${fmt(b - a)}" height="22" rx="3" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>`,
      line([a, -8], [a, 0], { width: 1, dashed: true }),
      line([b, -8], [b, 0], { width: 1, dashed: true }),
    );
    top = -32;
  }
  return scene(
    shapes,
    { x: -14, y: top, w: x(spec.length) + 28, h: RULER_H + 2 - top },
    describeRuler(spec),
    checkRuler(spec),
  );
}

// --- jugs, thermometers and dials ----------------------------------------------------------

const SCALE_H = 220;
const INSTRUMENT: Record<ScaleSpec["instrument"], string> = {
  jug: "A measuring jug",
  thermometer: "A thermometer",
  scales: "Weighing scales with a dial",
};

export function checkScale(spec: ScaleSpec): string[] {
  const problems: string[] = [];
  const min = spec.min ?? 0;
  const divisions = spec.divisions ?? 1;
  if (!(spec.max > min)) problems.push("max must be more than min");
  if (!(spec.step > 0)) problems.push("step must be positive");
  else {
    const steps = (spec.max - min) / spec.step;
    if (!isWhole(steps)) problems.push("the range must be a whole number of steps");
    else if (steps > 12)
      problems.push(`${Math.round(steps)} numbered marks are too many to read; use 12 or fewer`);
  }
  if (!(Number.isInteger(divisions) && divisions >= 1 && divisions <= 10))
    problems.push("divisions must be a whole number from 1 to 10");
  if (!(spec.reading >= min && spec.reading <= spec.max))
    problems.push(`the reading ${spec.reading} is off the scale`);
  if (spec.instrument !== "thermometer" && min < 0)
    problems.push(`a ${spec.instrument} scale starts at 0 or more`);
  return problems;
}

export function describeScale(spec: ScaleSpec): string {
  if (spec.description) return spec.description;
  const divisions = spec.divisions ?? 1;
  const marks = divisions > 1 ? `, with ${divisions} equal spaces between numbered marks` : "";
  return `${INSTRUMENT[spec.instrument]}, numbered every ${numberPlain(spec.step)} from ${numberPlain(spec.min ?? 0)} to ${numberPlain(spec.max)} ${plain(spec.unit)}${marks}.`;
}

/** Each mark's value and whether it is numbered. */
function marks(spec: ScaleSpec): { value: number; numbered: boolean }[] {
  const min = spec.min ?? 0;
  const divisions = spec.divisions ?? 1;
  const count = Math.round(((spec.max - min) / spec.step) * divisions);
  return Array.from({ length: count + 1 }, (_, i) => ({
    value: min + (i * spec.step) / divisions,
    numbered: i % divisions === 0,
  }));
}

export function layoutScale(spec: ScaleSpec): Scene {
  const problems = checkScale(spec);
  const description = describeScale(spec);
  if (problems.length > 0) return scene([], { x: 0, y: 0, w: 10, h: 10 }, description, problems);
  if (spec.instrument === "scales") return layoutDial(spec, description);
  const min = spec.min ?? 0;
  const y = (v: number) => SCALE_H - ((v - min) / (spec.max - min)) * SCALE_H;
  const shapes: string[] = [];
  const text: string[] = [];
  const level = y(spec.reading);

  if (spec.instrument === "jug") {
    const W = 120;
    // Body, spout and handle; the scale runs up the left wall.
    shapes.push(
      path(`M 0 -24 L -10 -32 M 0 -24 V ${SCALE_H + 12} H ${W} V -24`, { width: 2 }),
      path(`M ${W} 10 C ${W + 40} 10, ${W + 40} ${SCALE_H * 0.55}, ${W} ${SCALE_H * 0.6}`, {
        width: 2,
      }),
      `<rect x="1" y="${fmt(level)}" width="${W - 2}" height="${fmt(SCALE_H + 11 - level)}" fill="currentColor" fill-opacity="0.16" stroke="none"/>`,
      line([1, level], [W - 1, level], { width: 1.4 }),
    );
    for (const m of marks(spec)) {
      shapes.push(
        line([0, y(m.value)], [m.numbered ? 18 : 10, y(m.value)], {
          width: m.numbered ? 1.3 : 0.8,
        }),
      );
      if (m.numbered) text.push(leftAligned(numberLabel(m.value), [23, y(m.value)]));
    }
    text.push(centred(spec.unit, [W - 22, -12], 13));
    shapes.push(`<g fill="currentColor" stroke="none">${text.join("")}</g>`);
    return scene(shapes, { x: -12, y: -34, w: W + 46, h: SCALE_H + 48 }, description, problems);
  }

  // Thermometer: a tube and bulb, with the liquid filled solid and the scale to the right.
  const T = 8;
  shapes.push(
    path(`M ${-T} ${SCALE_H + 8} V -14 A ${T} ${T} 0 0 1 ${T} -14 V ${SCALE_H + 8}`, {
      width: 1.8,
    }),
    circle([0, SCALE_H + 22], 15, { width: 1.8 }),
    circle([0, SCALE_H + 22], 11, { filled: true, width: 0.5 }),
    `<rect x="-3.5" y="${fmt(level)}" width="7" height="${fmt(SCALE_H + 14 - level)}" fill="currentColor" stroke="none"/>`,
  );
  for (const m of marks(spec)) {
    shapes.push(
      line([T, y(m.value)], [T + (m.numbered ? 14 : 8), y(m.value)], {
        width: m.numbered ? 1.3 : 0.8,
      }),
    );
    if (m.numbered) text.push(leftAligned(numberLabel(m.value), [T + 19, y(m.value)]));
  }
  text.push(centred(spec.unit, [T + 24, -26], 13));
  shapes.push(`<g fill="currentColor" stroke="none">${text.join("")}</g>`);
  return scene(shapes, { x: -17, y: -36, w: 80, h: SCALE_H + 76 }, description, problems);
}

function leftAligned(latex: string, at: Point): string {
  const t = layoutLabel(latex, NUMBER_SIZE);
  return t.svg(at[0], at[1] + t.ascent / 2 - t.descent / 2);
}

/** A dial sweeping 270° clockwise from bottom left, with a pointer at the reading. */
function layoutDial(spec: ScaleSpec, description: string): Scene {
  const R = 95;
  const min = spec.min ?? 0;
  const angle = (v: number) => -135 + ((v - min) / (spec.max - min)) * 270;
  const shapes: string[] = [
    path(`M -70 ${-R - 26} H 70`, { width: 3 }),
    line([0, -R - 26], [0, -R - 12], { width: 2 }),
    circle([0, 0], R + 12, { width: 2 }),
    circle([0, 0], R, { width: 1 }),
  ];
  const text: string[] = [];
  for (const m of marks(spec)) {
    const a = angle(m.value);
    shapes.push(
      line(clockAt(a, R), clockAt(a, R - (m.numbered ? 13 : 7)), { width: m.numbered ? 1.4 : 0.8 }),
    );
    if (m.numbered) text.push(centred(numberLabel(m.value), clockAt(a, R - 27)));
  }
  text.push(centred(spec.unit, [0, 42], 13));
  shapes.push(`<g fill="currentColor" stroke="none">${text.join("")}</g>`);
  shapes.push(line([0, 0], clockAt(angle(spec.reading), R - 10), { width: 2.4 }));
  shapes.push(circle([0, 0], 4, { filled: true, width: 1 }));
  return scene(shapes, { x: -R - 14, y: -R - 28, w: 2 * R + 28, h: 2 * R + 42 }, description, []);
}
