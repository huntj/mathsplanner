// Keeps maths whole on a phone. A piece of maths never breaks across two lines (styles.css gives
// .katex and .ul-nowrap white-space: nowrap), so a long one moves down whole to the next line;
// and one too wide even for a line of its own is shrunk to fit, rather than running off the
// screen. watchMaths keeps this up as the page changes and the screen turns.

/** The smallest a piece of maths is shrunk to, as a share of its normal size. */
export const SMALLEST = 0.55;

/**
 * The size maths that cannot fit even at SMALLEST is shown at instead. It is then allowed to
 * break between its terms (after a + or =, never inside a number or a bracket), as a long sum
 * such as 5,000,000 + 900,000 + 10,000 + … in a narrow column would otherwise run off the
 * screen.
 */
export const LONG = 0.85;

/** What a piece of maths fits in: its nearest ancestor that is not inline. */
function boxOf(el: HTMLElement): HTMLElement | undefined {
  let p = el.parentElement;
  while (p) {
    const display = getComputedStyle(p).display;
    if (display !== "inline" && display !== "inline-block" && display !== "contents") return p;
    p = p.parentElement;
  }
  return undefined;
}

/** The width inside a box, without its padding. */
function room(box: HTMLElement): number {
  const s = getComputedStyle(box);
  return box.clientWidth - Number.parseFloat(s.paddingLeft) - Number.parseFloat(s.paddingRight);
}

/** The scale that fits `width` into `room`: 1 when it fits already, never below SMALLEST. */
export function scaleToFit(width: number, space: number): number {
  if (width <= space || width <= 0 || space <= 0) return 1;
  return Math.max(SMALLEST, Math.floor((space / width) * 100) / 100);
}

/** Whether maths this wide fits its space at all, at the smallest size. */
export const fitsAtSmallest = (width: number, space: number) => width * SMALLEST <= space;

/** Shrinks every piece of maths under `root` that is wider than the space it has. */
export function fitMaths(root: HTMLElement): void {
  // Groups first: maths inside a group shrinks with it.
  const all = [...root.querySelectorAll<HTMLElement>(".ul-nowrap, .katex")].filter(
    (el) => !(el.classList.contains("katex") && el.closest(".ul-nowrap, .katex-display")),
  );
  for (const el of all) {
    el.style.fontSize = "";
    el.classList.remove("fit-break");
  }
  for (const el of all) {
    const box = boxOf(el);
    if (!box) continue;
    const rect = el.getBoundingClientRect();
    // Never wider than the screen, whatever its box: a box can grow to fit what is in it.
    const boxLeft = Math.max(0, box.getBoundingClientRect().left);
    const screen = document.documentElement.clientWidth - boxLeft - 16;
    const space = Math.min(room(box), screen);
    if (!fitsAtSmallest(rect.width, space)) {
      el.style.fontSize = `${LONG}em`;
      el.classList.add("fit-break");
      continue;
    }
    const scale = scaleToFit(rect.width, space);
    if (scale < 1) el.style.fontSize = `${scale}em`;
  }
}

/** Fits the maths under `root` now and whenever its content or the screen's width changes. */
export function watchMaths(root: HTMLElement): () => void {
  let queued = 0;
  const fit = () => {
    if (queued) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      fitMaths(root);
    });
  };
  // Only content changes: fitting sets styles, which must not set it off again.
  const changes = new MutationObserver(fit);
  changes.observe(root, { childList: true, subtree: true, characterData: true });
  let width = root.clientWidth;
  const resized = new ResizeObserver(() => {
    if (root.clientWidth !== width) {
      width = root.clientWidth;
      fit();
    }
  });
  resized.observe(root);
  // Web fonts change the width of maths once they load.
  void document.fonts?.ready.then(fit);
  fit();
  return () => {
    changes.disconnect();
    resized.disconnect();
    cancelAnimationFrame(queued);
  };
}
