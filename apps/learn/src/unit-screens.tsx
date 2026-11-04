// The unit lesson screens beyond graphs: type an answer, place numbers on a line, put cards in
// order, sort them into groups, fill gaps from chips, shade a grid, solve an equation on a
// balance, work something out a step at a time, turn an angle, spin a spinner, grow a factor tree,
// and change a shape with a slider to see why its formula works. Each takes its screen's data
// and calls onNext once the pupil has done it; a wrong try gets a nudge, never a penalty.
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactElement,
} from "react";
import { Cuboid, Grid, NumberLine, numberText, PictureView, Spinner } from "./Picture.tsx";
import { play } from "./sounds.ts";
import type {
  Answer,
  Balance,
  Dial,
  Fill,
  Morph,
  Order,
  Place,
  Point,
  Screen,
  Shade,
  Sort,
  Spin,
  Steps,
  Tree,
} from "./unit-lessons/index.ts";
import { Title, useChime, Verdict, W, Working, type Step } from "./unit-ui.tsx";

type More = Exclude<
  Screen,
  { kind: "explain" | "machine" | "plot" | "choice" | "slider" | "build" | "drag-line" }
>;

export function ScreenStepMore({
  screen,
  ...step
}: Omit<Step<Screen>, "screen"> & { screen: Screen }) {
  const s = screen as More;
  switch (s.kind) {
    case "answer":
      return <AnswerStep screen={s} {...step} />;
    case "place":
      return <PlaceStep screen={s} {...step} />;
    case "order":
      return <OrderStep screen={s} {...step} />;
    case "sort":
      return <SortStep screen={s} {...step} />;
    case "fill":
      return <FillStep screen={s} {...step} />;
    case "shade":
      return <ShadeStep screen={s} {...step} />;
    case "balance":
      return <BalanceStep screen={s} {...step} />;
    case "steps":
      return <StepsStep screen={s} {...step} />;
    case "dial":
      return <DialStep screen={s} {...step} />;
    case "spin":
      return <SpinStep screen={s} {...step} />;
    case "tree":
      return <TreeStep screen={s} {...step} />;
    case "morph":
      return <MorphStep screen={s} {...step} />;
  }
}

function Lead({ text }: { text?: string | undefined }) {
  return text ? (
    <p className="lesson-lead">
      <W text={text} />
    </p>
  ) : null;
}

/** Plays the "wrong" sound each time `count` goes up. */
function useOops(count: number, sound: boolean) {
  useEffect(() => {
    if (count > 0) play("wrong", sound);
  }, [count, sound]);
}

/** The same mixed-up order every time for the same cards, and never already in order. */
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift() as T);
  return out;
}

// Typing an answer.

/** An answer as typed, tidied: no spaces, a plain minus, lower case. */
export function tidy(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/[−–]/g, "-")
    .replace(/[×*]/g, "x")
    .replace(/\s+/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1");
}

const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;

/** Whether a typed answer matches an accepted one; numbers match however they are written. */
export function matches(typed: string, accepted: string): boolean {
  const a = tidy(typed);
  const b = tidy(accepted);
  if (a === b) return true;
  return NUMBER.test(a) && NUMBER.test(b) && Number(a) === Number(b);
}

function AnswerStep({ screen, family, sound, onNext }: Step<Answer>) {
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [verdict, setVerdict] = useState<"right" | "wrong">();
  const right = verdict === "right";
  useChime(right, sound);
  useOops(verdict === "wrong" ? tries : 0, sound);
  const numeric = screen.answers.every((a) => NUMBER.test(tidy(a)) && !a.trim().startsWith("-"));
  const typedWrong = screen.wrong?.find((w) => matches(value, w.answer));
  const gaveUp = verdict === "wrong" && tries >= 2;

  const check = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || verdict) return;
    if (screen.answers.some((a) => matches(value, a))) setVerdict("right");
    else {
      setTries(tries + 1);
      setVerdict("wrong");
    }
  };

  return (
    <form className="lesson-form" onSubmit={check}>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        {screen.picture && <PictureView picture={screen.picture} />}
        <label className="ul-answer">
          <span className="visually-hidden">Your answer</span>
          <input
            className="ul-input"
            value={value}
            inputMode={numeric ? "decimal" : "text"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            readOnly={right}
            onChange={(e) => {
              setValue(e.target.value);
              if (verdict === "wrong") setVerdict(undefined);
            }}
          />
          {screen.unit && <span className="ul-unit">{screen.unit}</span>}
        </label>
      </main>
      {verdict ? (
        <Verdict
          right={right}
          text={
            right
              ? screen.done
              : `${typedWrong?.feedback ?? screen.hint}${gaveUp ? ` The answer is ${screen.answers[0]}${screen.unit ? ` ${screen.unit}` : ""}.` : ""}`
          }
          family={family}
          seed={value.length}
          action={right || gaveUp ? "Continue" : "Try again"}
          onAction={() => (right || gaveUp ? onNext() : setVerdict(undefined))}
        />
      ) : (
        <Working>
          <button type="submit" className="button primary big" disabled={!value.trim()}>
            Check
          </button>
        </Working>
      )}
    </form>
  );
}

// Placing numbers on a line.

function PlaceStep({ screen, family, sound, onNext }: Step<Place>) {
  const { targets, line } = screen;
  const [placed, setPlaced] = useState(0);
  const [miss, setMiss] = useState<number>();
  const [misses, setMisses] = useState(0);
  const done = placed === targets.length;
  useChime(done, sound);
  useOops(misses, sound);
  const target = targets[placed];

  const tap = (v: number) => {
    if (!target) return;
    if (Math.abs(v - target.value) < 1e-9) {
      setPlaced(placed + 1);
      setMiss(undefined);
      if (placed + 1 < targets.length) play("right", sound);
    } else {
      setMiss(v);
      setMisses(misses + 1);
    }
  };

  const marks = [
    ...targets
      .slice(0, placed)
      .map((t) => ({ at: t.value, label: t.mark ?? plainLabel(t.label), tone: "mine" as const })),
    ...(miss !== undefined ? [{ at: miss, tone: "wrong" as const }] : []),
  ];

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        {target && (
          <p className="ul-target">
            Put{" "}
            <strong>
              <W text={target.label} />
            </strong>{" "}
            on the line.
          </p>
        )}
        <NumberLine
          line={line}
          extra={marks}
          {...(done ? {} : { onTap: tap })}
          label={`A number line from ${numberText(line.min)} to ${numberText(line.max)}. Tap to place ${target?.label ?? "the number"}, or use the arrow keys and Enter.`}
        />
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={placed}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            miss !== undefined
              ? `That is ${numberText(miss)}. ${screen.hint}`
              : `${placed} of ${targets.length} placed.`
          }
        />
      )}
    </>
  );
}

/** Words with their maths turned to plain text, for a label inside a drawing. */
export function plainLabel(words: string): string {
  return words
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^}]*)\}/g, "√$1")
    .replace(/[$\\{}]/g, "")
    .replace(/-/g, "−");
}

// Putting cards in order.

function OrderStep({ screen, family, sound, onNext }: Step<Order>) {
  const { items } = screen;
  const mixed = useMemo(
    () =>
      shuffled(
        items.map((_, i) => i),
        items.join("|"),
      ),
    [items],
  );
  const [done, setDone] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number>();
  const [misses, setMisses] = useState(0);
  const finished = done.length === items.length;
  useChime(finished, sound);
  useOops(misses, sound);

  const tap = (i: number) => {
    if (i === done.length) {
      setDone([...done, i]);
      setWrong(undefined);
    } else {
      setWrong(i);
      setMisses(misses + 1);
    }
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        {screen.picture && <PictureView picture={screen.picture} />}
        <div className="ul-order" aria-label={`In order, ${screen.first} first`}>
          <span className="ul-order-end">
            {screen.first} → {screen.last}
          </span>
          <ol>
            {items.map((item, i) => (
              <li key={i} className={i < done.length ? "filled" : "empty"}>
                {i < done.length ? <W text={item} /> : " "}
              </li>
            ))}
          </ol>
        </div>
        <div className="ul-cards" role="group" aria-label="Cards to put in order">
          {mixed.map((i) =>
            done.includes(i) ? null : (
              <button
                key={`${i}-${wrong === i ? misses : 0}`}
                type="button"
                data-i={i}
                className={`ul-chip ul-card${wrong === i ? " tried" : ""}`}
                onClick={() => tap(i)}
              >
                <W text={items[i] ?? ""} />
              </button>
            ),
          )}
        </div>
      </main>
      {finished ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={items.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            wrong !== undefined
              ? screen.hint
              : `Tap the ${done.length === 0 ? screen.first : "next"} one.`
          }
        />
      )}
    </>
  );
}

// Sorting into groups.

function SortStep({ screen, family, sound, onNext }: Step<Sort>) {
  const { items, groups } = screen;
  const mixed = useMemo(
    () =>
      shuffled(
        items.map((_, i) => i),
        items.map((x) => x.text).join("|"),
      ),
    [items],
  );
  const [placed, setPlaced] = useState<number[]>([]);
  const [picked, setPicked] = useState<number>();
  const [why, setWhy] = useState<string>();
  const [misses, setMisses] = useState(0);
  const finished = placed.length === items.length;
  useChime(finished, sound);
  useOops(misses, sound);

  const drop = (g: number) => {
    if (picked === undefined) return;
    const item = items[picked];
    if (!item) return;
    if (item.group === g) {
      setPlaced([...placed, picked]);
      setPicked(undefined);
      setWhy(undefined);
    } else {
      setWhy(item.why);
      setMisses(misses + 1);
    }
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="ul-cards" role="group" aria-label="Cards to sort">
          {mixed.map((i) =>
            placed.includes(i) ? null : (
              <button
                key={i}
                type="button"
                aria-pressed={picked === i}
                data-i={i}
                className={`ul-chip ul-card${picked === i ? " picked" : ""}`}
                onClick={() => {
                  setPicked(i);
                  setWhy(undefined);
                }}
              >
                <W text={items[i]?.text ?? ""} />
              </button>
            ),
          )}
        </div>
        <div
          className="ul-groups"
          // Long cards get the width of the screen: groups stack rather than squeeze.
          style={{
            gridTemplateColumns: `repeat(${items.some((i) => i.text.length > 16) ? 1 : Math.min(groups.length, 3)}, 1fr)`,
          }}
        >
          {groups.map((g, gi) => (
            <button
              key={gi}
              type="button"
              data-g={gi}
              className={`ul-group${picked !== undefined ? " ready" : ""}`}
              onClick={() => drop(gi)}
              disabled={picked === undefined}
            >
              <span className="ul-group-name">
                <W text={g} />
              </span>
              <span className="ul-group-items">
                {placed
                  .filter((i) => items[i]?.group === gi)
                  .map((i) => (
                    <span key={i} className="ul-chip small">
                      <W text={items[i]?.text ?? ""} />
                    </span>
                  ))}
              </span>
            </button>
          ))}
        </div>
      </main>
      {finished ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={items.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            why ??
            (picked === undefined
              ? "Tap a card, then the group it belongs in."
              : "Now tap its group.")
          }
        />
      )}
    </>
  );
}

// Filling gaps from chips.

/** A piece of a gap-fill template: a word, some maths, or a gap. */
export type FillToken =
  { kind: "word"; text: string; space: boolean } | { kind: "slot"; slot: number; space: boolean };

/**
 * A template cut into groups that must stay on one line: maths and the gaps next to it stick
 * together, as in (x + [ ])(x + [ ]), and lines break only between ordinary words.
 */
export function fillGroups(template: string): FillToken[][] {
  const tokens: FillToken[] = [];
  const pieces = template.split("[]");
  pieces.forEach((piece, i) => {
    let space = /^\s/.test(piece);
    piece.split("$").forEach((part, j) => {
      if (j % 2 === 1) {
        tokens.push({ kind: "word", text: `$${part}$`, space });
        space = false;
        return;
      }
      for (const bit of part.split(/(\s+)/)) {
        if (!bit) continue;
        if (/^\s+$/.test(bit)) space = true;
        else {
          tokens.push({ kind: "word", text: bit, space });
          space = false;
        }
      }
    });
    if (i < pieces.length - 1) tokens.push({ kind: "slot", slot: i, space });
  });
  // A new group starts at a space next to an ordinary word; maths and gaps stay glued.
  const isMaths = (t: FillToken | undefined) =>
    t !== undefined && (t.kind === "slot" || t.text.startsWith("$"));
  const groups: FillToken[][] = [];
  tokens.forEach((t, k) => {
    const prev = tokens[k - 1];
    if (groups.length === 0 || (t.space && !(isMaths(t) && isMaths(prev))))
      groups.push([{ ...t, space: false }]);
    else groups[groups.length - 1]?.push(t);
  });
  return groups;
}

function FillStep({ screen, family, sound, onNext }: Step<Fill>) {
  const pieces = screen.template.split("[]");
  const slots = pieces.length - 1;
  const [filled, setFilled] = useState<(string | undefined)[]>(() => Array.from({ length: slots }));
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState(false);
  const wrongAt = fillWrong(filled, screen.answers, screen.anyOrder === true).map(
    (w) => checked && w,
  );
  const right = checked && wrongAt.every((w) => !w);
  useChime(right, sound);
  useOops(checked && !right ? 1 : 0, sound);

  const put = (chip: string) => {
    if (right) return;
    const next = [...filled];
    next[active] = chip;
    setFilled(next);
    setChecked(false);
    const empty = next.findIndex((f) => f === undefined);
    setActive(empty >= 0 ? empty : active);
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        {screen.picture && <PictureView picture={screen.picture} />}
        <p className="ul-fill">
          {fillGroups(screen.template).map((group, g) => (
            <Fragment key={g}>
              {g > 0 && " "}
              <span className="ul-nowrap">
                {group.map((t, k) =>
                  t.kind === "slot" ? (
                    <Fragment key={k}>
                      {t.space && " "}
                      <button
                        type="button"
                        className={`ul-slot${filled[t.slot] === undefined ? " empty" : ""}${active === t.slot && !right ? " active" : ""}${wrongAt[t.slot] ? " wrong" : ""}${right ? " right" : ""}`}
                        onClick={() => {
                          if (right) return;
                          setActive(t.slot);
                          if (filled[t.slot] !== undefined) {
                            setFilled(filled.map((f, j) => (j === t.slot ? undefined : f)));
                            setChecked(false);
                          }
                        }}
                        aria-label={`Gap ${t.slot + 1}${filled[t.slot] !== undefined ? `: ${filled[t.slot]}, tap to clear` : ", empty"}`}
                      >
                        {filled[t.slot] !== undefined ? <W text={filled[t.slot] ?? ""} /> : "?"}
                      </button>
                    </Fragment>
                  ) : (
                    <Fragment key={k}>
                      {t.space && " "}
                      <W text={t.text} />
                    </Fragment>
                  ),
                )}
              </span>
            </Fragment>
          ))}
        </p>
        <div className="ul-cards" role="group" aria-label="Chips">
          {screen.bank.map((chip, i) => (
            <button
              key={i}
              type="button"
              className="ul-chip"
              disabled={right}
              onClick={() => put(chip)}
            >
              <W text={chip} />
            </button>
          ))}
        </div>
      </main>
      {checked ? (
        <Verdict
          right={right}
          text={right ? screen.done : screen.hint}
          family={family}
          seed={slots}
          action={right ? "Continue" : "Try again"}
          onAction={() => {
            if (right) return onNext();
            const next = filled.map((f, i) => (wrongAt[i] ? undefined : f));
            setFilled(next);
            setActive(
              Math.max(
                0,
                next.findIndex((f) => f === undefined),
              ),
            );
            setChecked(false);
          }}
        />
      ) : (
        <Working>
          <button
            type="button"
            className="button primary big"
            disabled={filled.some((f) => f === undefined)}
            onClick={() => setChecked(true)}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

/**
 * Which gaps are wrong. In any order, a gap is right while its chip is still owed: (x + 4)(x + 3)
 * is as good as (x + 3)(x + 4), but (x + 3)(x + 3) gets one gap wrong.
 */
export function fillWrong(
  filled: readonly (string | undefined)[],
  answers: readonly string[],
  anyOrder: boolean,
): boolean[] {
  if (!anyOrder) return filled.map((f, i) => f !== answers[i]);
  const owed = [...answers];
  return filled.map((f) => {
    const at = f === undefined ? -1 : owed.indexOf(f);
    if (at < 0) return true;
    owed.splice(at, 1);
    return false;
  });
}

// Shading a grid.

function ShadeStep({ screen, family, sound, onNext }: Step<Shade>) {
  const [cells, setCells] = useState<ReadonlySet<number>>(new Set());
  const [checked, setChecked] = useState(false);
  // With exact squares set, those and only those; otherwise any squares, so long as enough.
  const exact = screen.cells;
  const right =
    checked && cells.size === screen.target && (!exact || exact.every((c) => cells.has(c)));
  useChime(right, sound);
  useOops(checked && !right ? 1 : 0, sound);
  const toggle = (i: number) => {
    if (right) return;
    const next = new Set(cells);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCells(next);
    setChecked(false);
  };
  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="graph-wrap">
          <Grid
            pic={{
              kind: "grid",
              cols: screen.cols,
              rows: screen.rows,
              shaded: 0,
              ...(screen.colLabels ? { colLabels: screen.colLabels } : {}),
              ...(screen.rowLabels ? { rowLabels: screen.rowLabels } : {}),
              ...(screen.values ? { values: screen.values } : {}),
            }}
            shadedCells={cells}
            onCell={toggle}
          />
          <p className="graph-readout" aria-live="polite">
            {cells.size} of {screen.cols * screen.rows} shaded
          </p>
        </div>
      </main>
      {checked ? (
        <Verdict
          right={right}
          text={
            right
              ? screen.done
              : cells.size === screen.target
                ? `Some of those squares are not right. ${screen.hint}`
                : `You have shaded ${cells.size}. ${screen.hint}`
          }
          family={family}
          seed={cells.size}
          action={right ? "Continue" : "Try again"}
          onAction={() => (right ? onNext() : setChecked(false))}
        />
      ) : (
        <Working note="Tap squares to shade them; tap again to unshade.">
          <button
            type="button"
            className="button primary big"
            disabled={cells.size === 0}
            onClick={() => setChecked(true)}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

// Solving on a balance.

interface Move {
  text: string;
  /** The equation after a right move; undefined for a wrong one, with why. */
  after?: { a: number; b: number; c: number; d?: number };
  why?: string;
}

/** What can be done next to ax + b = c, the right move first. */
export function balanceMoves(a: number, b: number, c: number, letter: string, d = 0): Move[] {
  if (d > 0)
    return [
      {
        text: `Take ${d === 1 ? "" : d}${letter} from both sides`,
        after: { a: a - d, b, c, d: 0 },
      },
      {
        text: `Take ${d === 1 ? "" : d}${letter} from the right side only`,
        why: "The scale tips: the right is lighter now. Whatever you do to one side, do to the other.",
      },
      {
        text: `Add ${d === 1 ? "" : d}${letter} to both sides`,
        why: `It stays level, but there are more ${letter}'s on both sides now, not fewer. Take them away to get the ${letter}'s on one side.`,
      },
    ];
  if (b > 0)
    return [
      { text: `Take ${b} from both sides`, after: { a, b: 0, c: c - b } },
      {
        text: `Take ${b} from the left side only`,
        why: "The scale tips: the left is lighter now. Whatever you do to one side, do to the other.",
      },
      {
        text: `Add ${b} to both sides`,
        why: `It stays level, but now there are more cubes beside the ${letter}'s, not fewer. Take them away instead.`,
      },
    ];
  if (a > 1)
    return [
      { text: `Share both sides into ${a} equal groups`, after: { a: 1, b: 0, c: c / a } },
      {
        text: `Take ${a} from both sides`,
        why: `That takes away cubes, but the ${a} ${letter}'s are still together. Share each side into ${a} equal groups, so one group holds one ${letter}.`,
      },
      {
        text: "Share the left side only",
        why: "The scale tips. Whatever you do to one side, do to the other.",
      },
    ];
  return [];
}

const eqTex = (a: number, b: number, c: number, x: string, d = 0) =>
  `$${a === 1 ? "" : a}${x}${b > 0 ? ` + ${b}` : ""} = ${d > 0 ? `${d === 1 ? "" : d}${x} + ` : ""}${c}$`;

function BalanceStep({ screen, family, sound, onNext }: Step<Balance>) {
  const { letter } = screen;
  const [eq, setEq] = useState({ a: screen.a, b: screen.b, c: screen.c, d: screen.d ?? 0 });
  const [lines, setLines] = useState([eqTex(screen.a, screen.b, screen.c, letter, screen.d)]);
  const [why, setWhy] = useState<string>();
  const [tried, setTried] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const moves = balanceMoves(eq.a, eq.b, eq.c, letter, eq.d);
  const done = moves.length === 0;
  const order = useMemo(
    () =>
      shuffled(
        moves.map((_, i) => i),
        `${eq.a},${eq.b},${eq.c},${eq.d}`,
      ),
    [eq.a, eq.b, eq.c, eq.d, moves],
  );
  useChime(done, sound);
  useOops(misses, sound);
  const [tip, setTip] = useState(0);

  const choose = (m: Move) => {
    if (m.after) {
      const next = { d: 0, ...m.after };
      setEq(next);
      setLines([...lines, eqTex(next.a, next.b, next.c, letter, next.d)]);
      setWhy(undefined);
      setTried([]);
      setTip(0);
      if (balanceMoves(next.a, next.b, next.c, letter, next.d).length) play("right", sound);
    } else {
      setWhy(m.why);
      setTried([...tried, m.text]);
      setMisses(misses + 1);
      setTip(m.text.includes("left side only") ? 1 : m.text.includes("right side only") ? -1 : 0);
    }
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <Scale a={eq.a} b={eq.b} c={eq.c} d={eq.d} letter={letter} tip={tip} />
        <div className="ul-working" aria-live="polite">
          {lines.map((l, i) => (
            <p key={i} className={i === lines.length - 1 ? "latest" : undefined}>
              <W text={l} />
            </p>
          ))}
        </div>
        {!done && (
          <div className="ul-options" role="group" aria-label="What next?">
            {order.map((i) => {
              const m = moves[i];
              if (!m) return null;
              return (
                <button
                  key={m.text}
                  data-right={m.after ? "yes" : undefined}
                  type="button"
                  className={`ul-option${tried.includes(m.text) ? " tried" : ""}`}
                  disabled={tried.includes(m.text)}
                  onClick={() => choose(m)}
                >
                  {m.text}
                </button>
              );
            })}
          </div>
        )}
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={eq.c}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working note={why ?? `Keep the scale level. What gets the ${letter} on its own?`} />
      )}
    </>
  );
}

/** Lays items out in rows across a pan, from the bottom up: each item's size and where it goes. */
export function flow(sizes: number[], left: number, width: number, floor: number) {
  const out: { x: number; y: number; size: number }[] = [];
  let x = left;
  let y = floor;
  let rowH = 0;
  for (const size of sizes) {
    if (x + size > left + width && x > left) {
      x = left;
      y -= rowH + 3;
      rowH = 0;
    }
    out.push({ x, y: y - size, size });
    x += size + 3;
    rowH = Math.max(rowH, size);
  }
  return out;
}

/** The sizes of a bag of x and of a unit cube on the balance. */
const BAG = 34;
const CUBE = 19;

/** The balance: bags of x and unit cubes on each side. */
function Scale({
  a,
  b,
  c,
  d,
  letter,
  tip,
}: {
  a: number;
  b: number;
  c: number;
  d: number;
  letter: string;
  tip: number;
}) {
  const pile = (bags: number, cubes: number) => [
    ...Array<number>(bags).fill(BAG),
    ...Array<number>(cubes).fill(CUBE),
  ];
  const left = flow(pile(a, b), 12, 138, 96);
  const right = flow(pile(d, c), 190, 138, 96);
  const top = Math.min(...[...left, ...right].map((p) => p.y), 40);
  const shift = 40 - top;
  const draw = (p: { x: number; y: number; size: number }, key: string) =>
    p.size > 20 ? (
      <g key={key} transform={`translate(${p.x} ${p.y})`}>
        <rect className="scale-bag" width={BAG} height={BAG} rx="8" />
        <text className="scale-bag-label" x={BAG / 2} y={BAG / 2 + 7} textAnchor="middle">
          {letter}
        </text>
      </g>
    ) : (
      <rect key={key} className="scale-cube" x={p.x} y={p.y} width={CUBE} height={CUBE} rx="3" />
    );
  const side = (bags: number, cubes: number) =>
    [bags ? `${bags} ${letter}${bags > 1 ? "s" : ""}` : "", cubes ? `${cubes} cubes` : ""]
      .filter(Boolean)
      .join(" and ");
  return (
    <svg
      className="pic scale"
      viewBox={`0 ${-shift} 340 ${170 + shift}`}
      role="img"
      aria-label={`A balance: ${side(a, b)} on the left, ${side(d, c)} on the right.`}
    >
      <g
        className="scale-beam"
        style={{ transform: `rotate(${tip * 8}deg)`, transformOrigin: "170px 104px" }}
      >
        {left.map((p, i) => draw(p, `l${i}`))}
        {right.map((p, i) => draw(p, `r${i}`))}
        <line className="scale-arm" x1="10" x2="330" y1="104" y2="104" />
        <path className="scale-pan" d="M6 97 h150 l-8 10 h-134 z" />
        <path className="scale-pan" d="M184 97 h150 l-8 10 h-134 z" />
      </g>
      <path className="scale-stand" d="M170 104 L150 160 H190 Z" />
      <circle className="pic-centre" cx="170" cy="104" r="5" />
    </svg>
  );
}

// A step at a time.

function StepsStep({ screen, family, sound, onNext }: Step<Steps>) {
  const [stage, setStage] = useState(0);
  const [lines, setLines] = useState([screen.start]);
  const [tried, setTried] = useState<number[]>([]);
  const [why, setWhy] = useState<string>();
  const [misses, setMisses] = useState(0);
  const current = screen.stages[stage];
  // The picture of the latest step done that has one, or the screen's own.
  const pictureAt = screen.stages.slice(0, stage).findLastIndex((st) => st.picture);
  const picture = screen.stages[pictureAt]?.picture ?? screen.picture;
  const done = !current;
  useChime(done, sound);
  useOops(misses, sound);
  const order = useMemo(
    () =>
      current
        ? shuffled(
            current.options.map((_, i) => i),
            current.prompt,
          )
        : [],
    [current],
  );

  const choose = (i: number) => {
    const o = current?.options[i];
    if (!current || !o) return;
    if (o.correct) {
      setLines([...lines, current.then]);
      setStage(stage + 1);
      setTried([]);
      setWhy(undefined);
      if (stage + 1 < screen.stages.length) play("right", sound);
    } else {
      setTried([...tried, i]);
      setWhy(o.feedback);
      setMisses(misses + 1);
    }
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        {picture && <PictureView key={pictureAt} picture={picture} />}
        <div className="ul-working" aria-live="polite">
          {lines.map((l, i) => (
            <p key={i} className={i === lines.length - 1 ? "latest" : undefined}>
              <W text={l} />
            </p>
          ))}
        </div>
        {current && (
          <>
            <p className="ul-prompt">
              <W text={current.prompt} />
            </p>
            <div className="ul-options" role="group" aria-label="Choose the next step">
              {order.map((i) => {
                const o = current.options[i];
                if (!o) return null;
                return (
                  <button
                    key={i}
                    type="button"
                    data-i={i}
                    className={`ul-option${tried.includes(i) ? " tried" : ""}`}
                    disabled={tried.includes(i)}
                    onClick={() => choose(i)}
                  >
                    <W text={o.text} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={lines.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working note={why ?? `Step ${stage + 1} of ${screen.stages.length}.`} />
      )}
    </>
  );
}

// Turning an angle.

function DialStep({ screen, family, sound, onNext }: Step<Dial>) {
  const full = screen.target > 180;
  const [angle, setAngle] = useState(full ? 200 : 40);
  const [checked, setChecked] = useState(false);
  const right = checked && Math.abs(angle - screen.target) <= screen.within;
  useChime(right, sound);
  useOops(checked && !right ? 1 : 0, sound);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const c = { x: 160, y: full ? 160 : 160 };
  const R = 120;
  const height = full ? 320 : 200;

  const set = (deg: number) => {
    const d = Math.round(full ? ((deg % 360) + 360) % 360 : Math.min(180, Math.max(0, deg)));
    setAngle(d);
    setChecked(false);
  };
  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    let deg = (Math.atan2(c.y - p.y, p.x - c.x) * 180) / Math.PI;
    if (deg < 0) deg = full ? deg + 360 : deg < -90 ? 180 : 0;
    set(deg);
  };
  const end = (deg: number, r: number) => ({
    x: c.x + r * Math.cos((deg * Math.PI) / 180),
    y: c.y - r * Math.sin((deg * Math.PI) / 180),
  });
  const tip = end(angle, R);
  const arcEnd = end(angle, 38);
  const ticks = Array.from({ length: (full ? 360 : 180) / 5 + 1 }, (_, i) => i * 5);

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="graph-wrap">
          <svg
            ref={svgRef}
            className="pic dial tappable"
            viewBox={`0 0 320 ${height}`}
            role="slider"
            aria-label="The angle"
            aria-valuemin={0}
            aria-valuemax={full ? 359 : 180}
            aria-valuenow={angle}
            aria-valuetext={screen.protractor ? `${angle} degrees` : "Turn with the arrow keys"}
            tabIndex={0}
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              fromPointer(e);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e)}
            onPointerUp={() => (dragging.current = false)}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 1;
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                set(angle + step);
              } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                set(angle - step);
              }
            }}
          >
            {screen.protractor && (
              <g className="protractor">
                <path
                  d={
                    full
                      ? `M${c.x - R - 14} ${c.y} A${R + 14} ${R + 14} 0 1 1 ${c.x + R + 14} ${c.y} A${R + 14} ${R + 14} 0 1 1 ${c.x - R - 14} ${c.y}`
                      : `M${c.x - R - 14} ${c.y} A${R + 14} ${R + 14} 0 0 1 ${c.x + R + 14} ${c.y} Z`
                  }
                />
                {ticks.map((t) => {
                  const big = t % 30 === 0;
                  const a = end(t, R + 14);
                  const b = end(t, R + (big ? 0 : t % 10 === 0 ? 5 : 9));
                  const l = end(t, R - 12);
                  return (
                    <g key={t}>
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                      {big && t < 360 && (
                        <text x={l.x} y={l.y + 4} textAnchor="middle">
                          {t}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
            <path
              className="dial-arc"
              d={`M${c.x + 38} ${c.y} A38 38 0 ${angle > 180 ? 1 : 0} 0 ${arcEnd.x} ${arcEnd.y}`}
            />
            <line className="pic-ray" x1={c.x} y1={c.y} x2={c.x + R} y2={c.y} />
            <line className="pic-ray live" x1={c.x} y1={c.y} x2={tip.x} y2={tip.y} />
            <circle className="handle-halo" cx={tip.x} cy={tip.y} r="18" />
            <circle className="handle-dot" cx={tip.x} cy={tip.y} r="8" />
            <circle className="pic-centre" cx={c.x} cy={c.y} r="4" />
          </svg>
          <p className="graph-readout" aria-live="polite">
            {screen.protractor || checked ? `${angle}°` : " "}
          </p>
        </div>
      </main>
      {checked ? (
        <Verdict
          right={right}
          text={right ? screen.done : `That is ${angle}°. ${screen.hint}`}
          family={family}
          seed={angle}
          action={right ? "Continue" : "Try again"}
          onAction={() => (right ? onNext() : setChecked(false))}
        />
      ) : (
        <Working note="Drag the dot to turn the line.">
          <button type="button" className="button primary big" onClick={() => setChecked(true)}>
            Check
          </button>
        </Working>
      )}
    </>
  );
}

// Spinning a spinner.

/** Which sector a number from 0 to 1 lands in, by the sectors' sizes. */
export function sectorAt(sizes: readonly number[], r: number): number {
  const total = sizes.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (const [i, s] of sizes.entries()) {
    acc += s / total;
    if (r < acc) return i;
  }
  return sizes.length - 1;
}

function SpinStep({ screen, family, sound, onNext }: Step<Spin>) {
  const sizes = screen.sectors.map((s) => s.size);
  const total = sizes.reduce((a, b) => a + b, 0);
  const [counts, setCounts] = useState(() => sizes.map(() => 0));
  const [turn, setTurn] = useState(0);
  const [last, setLast] = useState<number>();
  const spins = counts.reduce((a, b) => a + b, 0);
  const done = spins >= screen.spins;
  useChime(done, sound);

  const spin = (n: number) => {
    const next = [...counts];
    let landed = 0;
    for (let k = 0; k < n; k++) {
      landed = sectorAt(sizes, Math.random());
      next[landed] = (next[landed] ?? 0) + 1;
    }
    setCounts(next);
    setLast(landed);
    // Turn so the landed sector's middle comes under the pointer, plus a few whole turns.
    const before = sizes.slice(0, landed).reduce((a, b) => a + b, 0);
    const mid = ((before + (sizes[landed] ?? 0) * (0.2 + 0.6 * Math.random())) / total) * 360;
    setTurn((t) => t - (t % 360) + 360 * 3 + (360 - mid));
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="graph-wrap">
          <Spinner pic={{ kind: "spinner", sectors: screen.sectors }} turn={turn} />
          <p className="graph-readout" aria-live="polite">
            {last !== undefined ? `Landed on ${screen.sectors[last]?.label}` : " "}
          </p>
        </div>
        <div className="spin-buttons">
          <button type="button" className="button" onClick={() => spin(1)}>
            Spin
          </button>
          <button type="button" className="button" onClick={() => spin(10)}>
            Spin 10
          </button>
          <button type="button" className="button" onClick={() => spin(100)}>
            Spin 100
          </button>
        </div>
        <table className="ul-table spin-table">
          <thead>
            <tr>
              <th scope="col">Outcome</th>
              <th scope="col">Count</th>
              <th scope="col">Fraction of spins</th>
            </tr>
          </thead>
          <tbody>
            {screen.sectors.map((s, i) => {
              const share = spins ? (counts[i] ?? 0) / spins : 0;
              return (
                <tr key={i}>
                  <th scope="row">{s.label}</th>
                  <td>{counts[i]}</td>
                  <td>
                    <span className="spin-bar">
                      <span style={{ width: `${share * 100}%` }} />
                      <i style={{ left: `${(s.size / total) * 100}%` }} aria-hidden="true" />
                    </span>
                    <span className="spin-share">{spins ? share.toFixed(2) : "–"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={spins}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={`${spins} of ${screen.spins} spins. The marks show where each fraction should settle.`}
        />
      )}
    </>
  );
}

// A factor tree.

interface TreeNodeState {
  v: number;
  kids?: [TreeNodeState, TreeNodeState];
}

export const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

/** The ways to split n into two factors, neither of them 1, smallest first. */
export const factorPairs = (n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let a = 2; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]);
  return out;
};

const leaves = (t: TreeNodeState): number[] => (t.kids ? t.kids.flatMap(leaves) : [t.v]);

/** n as a product of primes, in index form: 2^2 \times 3 \times 5. */
export function primeProductTex(primes: number[]): string {
  const counts = new Map<number, number>();
  for (const p of [...primes].sort((a, b) => a - b)) counts.set(p, (counts.get(p) ?? 0) + 1);
  return [...counts].map(([p, k]) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join(" \\times ");
}

function TreeStep({ screen, family, sound, onNext }: Step<Tree>) {
  const [tree, setTree] = useState<TreeNodeState>({ v: screen.root });
  const [picked, setPicked] = useState<number[]>();
  const all = leaves(tree);
  const done = all.every(isPrime);
  useChime(done, sound);

  const nodeAt = (path: number[]) =>
    path.reduce<TreeNodeState | undefined>((n, i) => n?.kids?.[i], tree);
  const split = (path: number[], [a, b]: [number, number]) => {
    const grow = (n: TreeNodeState, rest: number[]): TreeNodeState =>
      rest.length === 0
        ? { v: n.v, kids: [{ v: a }, { v: b }] }
        : {
            v: n.v,
            kids: n.kids?.map((k, i) => (i === rest[0] ? grow(k, rest.slice(1)) : k)) as [
              TreeNodeState,
              TreeNodeState,
            ],
          };
    setTree(grow(tree, path));
    setPicked(undefined);
    play("right", sound);
  };
  const chosen = picked ? nodeAt(picked) : undefined;

  const draw = (n: TreeNodeState, path: number[]): ReactElement => {
    const prime = isPrime(n.v);
    const open = !n.kids && !prime;
    return (
      <div className="tree-node">
        <button
          type="button"
          className={`tree-value${prime ? " prime" : ""}${open ? " open" : ""}${picked?.join() === path.join() ? " picked" : ""}`}
          disabled={!open || done}
          onClick={() => setPicked(path)}
          aria-label={`${n.v}${prime ? ", prime" : open ? ", tap to split" : ""}`}
        >
          {n.v}
        </button>
        {n.kids && (
          <div className="tree-kids">
            {n.kids.map((k, i) => (
              <div key={i} className="tree-branch">
                {draw(k, [...path, i])}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="tree">{draw(tree, [])}</div>
        {done ? (
          <p className="ul-equation small">
            <W text={`$${screen.root} = ${primeProductTex(all)}$`} />
          </p>
        ) : chosen ? (
          <div>
            <p className="ul-prompt">Split {chosen.v} into</p>
            <div className="ul-cards">
              {factorPairs(chosen.v).map(([a, b]) => (
                <button
                  key={a}
                  type="button"
                  className="ul-chip"
                  onClick={() => picked && split(picked, [a, b])}
                >
                  {a} × {b}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={all.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            chosen
              ? "Pick any pair: every way ends in the same primes."
              : "Tap a number that is not prime to split it. Primes are circled."
          }
        />
      )}
    </>
  );
}

// Changing a shape with a slider.

const turnAbout = (p: Point, m: Point, deg: number): Point => {
  const r = (deg * Math.PI) / 180;
  const dx = p.x - m.x;
  const dy = p.y - m.y;
  return {
    x: m.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: m.y + dx * Math.sin(r) + dy * Math.cos(r),
  };
};

/** The two pieces of a morph at t from 0 to 1: one that stays, one that moves. */
export function morphPieces(
  shape: Morph["shape"],
  dims: number[],
  t: number,
): { still: Point[]; moving: Point[] } {
  const [p = 0, q = 0, r = 0, s = 0] = dims;
  if (shape === "parallelogram") {
    // Base p, height q, slant r: the corner triangle slides across by the base.
    return {
      still: [
        { x: r, y: 0 },
        { x: p, y: 0 },
        { x: p + r, y: q },
        { x: r, y: q },
      ],
      moving: [
        { x: t * p, y: 0 },
        { x: r + t * p, y: 0 },
        { x: r + t * p, y: q },
      ],
    };
  }
  if (shape === "triangle") {
    // Base p, height q, apex at r across: a copy turns about the middle of a side.
    const tri = [
      { x: 0, y: 0 },
      { x: p, y: 0 },
      { x: r, y: q },
    ];
    const m = { x: (p + r) / 2, y: q / 2 };
    return { still: tri, moving: tri.map((v) => turnAbout(v, m, -180 * t)) };
  }
  // Trapezium: top p, bottom q, height r, top starting s across.
  const trap = [
    { x: 0, y: 0 },
    { x: q, y: 0 },
    { x: s + p, y: r },
    { x: s, y: r },
  ];
  const m = { x: (q + s + p) / 2, y: r / 2 };
  return { still: trap, moving: trap.map((v) => turnAbout(v, m, -180 * t)) };
}

function MorphStep({ screen, family, sound, onNext }: Step<Morph>) {
  const cuboid = screen.shape === "cuboid";
  const max = cuboid ? (screen.dims[2] ?? 1) : 100;
  const [value, setValue] = useState(cuboid ? 1 : 0);
  const done = value >= max;
  const [latched, setLatched] = useState(false);
  useEffect(() => {
    if (done) setLatched(true);
  }, [done]);
  useChime(latched, sound);
  const [w = 1, d = 1, h = 1] = screen.dims;

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <Lead text={screen.text} />
        <div className="graph-wrap">
          {cuboid ? (
            <>
              <Cuboid pic={{ kind: "cuboid", w, d, h, cubes: true }} layers={value} />
              <p className="graph-readout" aria-live="polite">
                {value} layer{value === 1 ? "" : "s"} of {w} × {d} = {value * w * d} cubes
              </p>
            </>
          ) : screen.shape === "circle" ? (
            <CircleMorph r={screen.dims[0] ?? 1} n={screen.dims[1] ?? 16} t={value / 100} />
          ) : (
            <MorphPicture shape={screen.shape} dims={screen.dims} t={value / 100} />
          )}
        </div>
        <label className="ul-slider">
          <span className="ul-slider-name" aria-hidden="true">
            {cuboid ? "↑" : "↔"}
          </span>
          <input
            type="range"
            min={cuboid ? 1 : 0}
            max={max}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-label={cuboid ? "Layers" : "Move the piece"}
          />
        </label>
      </main>
      {latched ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={max}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working note="Drag the slider all the way." />
      )}
    </>
  );
}

function MorphPicture({ shape, dims, t }: { shape: Morph["shape"]; dims: number[]; t: number }) {
  const frames = [0, 0.25, 0.5, 0.75, 1].map((f) => morphPieces(shape, dims, f));
  const all = frames.flatMap((f) => [...f.still, ...f.moving]);
  const minX = Math.min(...all.map((p) => p.x));
  const maxX = Math.max(...all.map((p) => p.x));
  const minY = Math.min(...all.map((p) => p.y));
  const maxY = Math.max(...all.map((p) => p.y));
  const k = Math.min(280 / (maxX - minX || 1), 200 / (maxY - minY || 1));
  const pad = 20;
  const sx = (x: number) => pad + (x - minX) * k;
  const sy = (y: number) => pad + (maxY - y) * k;
  const { still, moving } = morphPieces(shape, dims, t);
  const pts = (ps: Point[]) => ps.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ");
  return (
    <svg
      className="pic morph"
      viewBox={`0 0 ${(maxX - minX) * k + 2 * pad} ${(maxY - minY) * k + 2 * pad}`}
      role="img"
      aria-label={`A ${shape}, with a piece moved ${Math.round(t * 100)}% of the way.`}
    >
      <polygon className="pic-shape" points={pts(still)} />
      <polygon className={`pic-shape moving${t >= 1 ? " home" : ""}`} points={pts(moving)} />
    </svg>
  );
}

/**
 * Where each slice of a circle sits at t from 0 (the circle) to 1 (a row of alternating slices,
 * nearly a rectangle r tall and half the circumference long): its point, and the way it faces.
 */
export function circleSlices(r: number, n: number, t: number): { apex: Point; facing: number }[] {
  const step = 360 / n;
  const width = (2 * Math.PI * r) / n;
  const centre = { x: (Math.PI * r) / 2, y: 2.3 * r };
  return Array.from({ length: n }, (_, k) => {
    const top = k < n / 2;
    const j = top ? k : k - n / 2;
    // The top half's slices point up from the bottom edge; the others hang down from the top.
    const end = top
      ? { apex: { x: (j + 1) * width, y: 0 }, facing: 90 }
      : { apex: { x: j * width + width / 2, y: r }, facing: -90 };
    const from = (k + 0.5) * step;
    const turn = ((((end.facing - from) % 360) + 540) % 360) - 180;
    return {
      apex: {
        x: centre.x + (end.apex.x - centre.x) * t,
        y: centre.y + (end.apex.y - centre.y) * t,
      },
      facing: from + turn * t,
    };
  });
}

function CircleMorph({ r, n, t }: { r: number; n: number; t: number }) {
  const slices = circleSlices(r, n, t);
  const half = 180 / n;
  const minX = -0.2 * r;
  const maxX = Math.PI * r + (Math.PI * r) / n + 0.2 * r;
  const maxY = 3.4 * r;
  const minY = -0.1 * r;
  const k = 300 / (maxX - minX);
  const sx = (x: number) => (x - minX) * k;
  const sy = (y: number) => (maxY - y) * k;
  const at = (p: Point, deg: number) => ({
    x: p.x + r * Math.cos((deg * Math.PI) / 180),
    y: p.y + r * Math.sin((deg * Math.PI) / 180),
  });
  return (
    <svg
      className="pic morph"
      viewBox={`0 0 ${(maxX - minX) * k} ${(maxY - minY) * k}`}
      role="img"
      aria-label={`A circle cut into ${n} slices, ${t >= 1 ? "laid out in a row" : `${Math.round(t * 100)}% of the way to a row`}.`}
    >
      {slices.map((s, i) => {
        const a = at(s.apex, s.facing - half);
        const b = at(s.apex, s.facing + half);
        return (
          <path
            key={i}
            className={`pic-shape slice${i < n / 2 ? " moving" : ""}`}
            d={`M${sx(s.apex.x)} ${sy(s.apex.y)} L${sx(a.x)} ${sy(a.y)} A${r * k} ${r * k} 0 0 0 ${sx(b.x)} ${sy(b.y)} Z`}
          />
        );
      })}
    </svg>
  );
}
