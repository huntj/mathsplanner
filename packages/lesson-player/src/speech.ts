// Read aloud: the words on a lesson screen spoken by the device's own voice, with the maths said in
// words ("x squared", "130 degrees"). Only voices on the device are used, so nothing about the
// pupil, nor the lesson, leaves it; with no such voice, there is no button.

const NAMES: Record<string, string> = {
  times: "times",
  cdot: "times",
  div: "divided by",
  pm: "plus or minus",
  pi: "pi",
  theta: "theta",
  alpha: "alpha",
  beta: "beta",
  le: "is less than or equal to",
  leq: "is less than or equal to",
  ge: "is greater than or equal to",
  geq: "is greater than or equal to",
  ne: "is not equal to",
  neq: "is not equal to",
  approx: "is about",
  sin: "sine",
  cos: "cos",
  tan: "tan",
  infty: "infinity",
  degree: "degrees",
  circ: "degrees",
  to: "to",
  rightarrow: "gives",
  Rightarrow: "so",
};

/** The text inside the braces that open at `s[i]`, and where they close. */
function group(s: string, i: number): [string, number] {
  if (s[i] !== "{") {
    // A single character, or a command, stands for itself.
    const m = /^\\[a-zA-Z]+|^./.exec(s.slice(i));
    const t = m?.[0] ?? "";
    return [t, i + t.length];
  }
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && --depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return [s.slice(i + 1), s.length];
}

const SIGNS: Record<string, string> = {
  "=": " equals ",
  "+": " plus ",
  "-": " minus ",
  "−": " minus ",
  "<": " is less than ",
  ">": " is greater than ",
};

const power = (p: string) =>
  p === "2" ? " squared" : p === "3" ? " cubed" : ` to the power ${texWords(p)}`;

/** A piece of TeX, as it would be read out. */
export function texWords(tex: string): string {
  const out: string[] = [];
  let i = 0;
  while (i < tex.length) {
    const c = tex[i] ?? "";
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(tex.slice(i));
      const name = m?.[1] ?? "";
      i += (m?.[0] ?? "\\").length;
      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const [top, a] = group(tex, i);
        const [bottom, b] = group(tex, a);
        i = b;
        out.push(` ${texWords(top)} over ${texWords(bottom)} `);
      } else if (name === "sqrt") {
        const [inside, a] = group(tex, i);
        i = a;
        out.push(` the square root of ${texWords(inside)} `);
      } else if (name === "text" || name === "mathrm" || name === "textbf" || name === "mathbf") {
        const [inside, a] = group(tex, i);
        i = a;
        out.push(plainWords(inside));
      } else if (name === "%") out.push(" percent");
      else if (name === "left" || name === "right" || name === "," || name === ";" || name === " ")
        out.push(" ");
      else out.push(` ${NAMES[name] ?? name} `);
    } else if (c === "^") {
      const [p, a] = group(tex, i + 1);
      i = a;
      out.push(p === "\\circ" ? " degrees" : power(p));
    } else if (c === "_") {
      const [, a] = group(tex, i + 1);
      i = a;
    } else {
      if (c !== "{" && c !== "}") out.push(SIGNS[c] ?? c);
      i++;
    }
  }
  return plainWords(out.join(""));
}

const UNITS: [RegExp, string][] = [
  [/(\d)\s*cm²/g, "$1 square centimetres"],
  [/(\d)\s*m²/g, "$1 square metres"],
  [/(\d)\s*cm³/g, "$1 cubic centimetres"],
  [/(\d)\s*mm\b/g, "$1 millimetres"],
  [/(\d)\s*cm\b/g, "$1 centimetres"],
  [/(\d)\s*km\b/g, "$1 kilometres"],
  [/(\d)\s*m\b/g, "$1 metres"],
  [/(\d)\s*kg\b/g, "$1 kilograms"],
  [/(\d)\s*g\b/g, "$1 grams"],
];

/** Plain words, tidied for a voice: symbols in words, and point names spelt out. */
export function plainWords(text: string): string {
  let t = text.replace(/\*\*/g, "");
  for (const [re, to] of UNITS) t = t.replace(re, to);
  t = t
    .replace(/°/g, " degrees")
    .replace(/²/g, " squared")
    .replace(/³/g, " cubed")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/(\d)\s*%/g, "$1 percent")
    .replace(/\s[−-]\s/g, " minus ")
    .replace(/(^|[\s(])−(\d)/g, "$1minus $2")
    .replace(/\bd\.p\./g, "decimal places")
    .replace(/\b1 decimal places\b/g, "1 decimal place")
    // Names of points, lines and angles are spelt out: "angle A C B".
    .replace(/\b[A-Z]{2,4}\b/g, (m) => m.split("").join(" "))
    .replace(/\s+/g, " ");
  return t.trim();
}

/** A string with maths between dollar signs, as it would be read out. */
export function wordsToSpeech(text: string): string {
  return text
    .split(/(\$[^$]*\$)/)
    .map((part) =>
      part.startsWith("$") && part.endsWith("$") && part.length > 1
        ? texWords(part.slice(1, -1))
        : plainWords(part),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** What the pupil reads on a screen, in reading order: the question, options, Dot's words. */
const READ = [
  ".lesson-main h1",
  ".lesson-main .lesson-lead",
  ".lesson-main .ul-text > p",
  ".lesson-main .ul-text > li",
  ".lesson-main .ask-changed",
  ".lesson-main .ask-prompt",
  ".lesson-main .ul-prompt",
  ".lesson-main .worked-problem",
  ".lesson-main .worked-line",
  ".lesson-main .working-row > p:first-child",
  ".lesson-main .worked-reason",
  ".lesson-main .dot-bubble-text",
  ".lesson-main .ul-option:not(:disabled)",
  ".lesson-foot .verdict h2",
  ".lesson-foot .ul-feedback",
  ".lesson-foot .dot-bubble-text",
].join(", ");

/** An element's words as they would be read out: its maths from KaTeX's own copy of the TeX. */
export function elementSpeech(el: Element): string {
  const parts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) parts.push(plainWords(node.textContent ?? ""));
    else if (node instanceof Element) {
      if (node.classList.contains("katex")) {
        const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        parts.push(tex ? texWords(tex) : plainWords(node.textContent ?? ""));
      } else if (node.getAttribute("aria-hidden") !== "true") node.childNodes.forEach(walk);
    }
  };
  walk(el);
  return parts
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.?!:;])/g, "$1")
    .trim();
}

/** The words of the screen inside `root`, a sentence or option at a time. */
export function screenSpeech(root: ParentNode): string[] {
  return [...root.querySelectorAll(READ)].map(elementSpeech).filter(Boolean);
}

/** A voice on the device, British if there is one; none if speech isn't there. */
export function deviceVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.localService);
  return (
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    undefined
  );
}

/** Speak each piece in turn, stopping anything already being said. */
export function speak(pieces: string[], voice: SpeechSynthesisVoice, onEnd: () => void) {
  const synth = window.speechSynthesis;
  synth.cancel();
  pieces.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.9;
    if (i === pieces.length - 1) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    synth.speak(u);
  });
  if (!pieces.length) onEnd();
}
