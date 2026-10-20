// Reading typed numbers and judging them against a stated accuracy.
import type { Accuracy } from "@mathsplanner/core";

/**
 * Reads a number as a student might type it: "65", "65°", "−3.5", "1,000", "1 000", "3/4" or
 * "2.5 cm". Returns undefined for anything else.
 */
export function parseNumber(text: string): number | undefined {
  const cleaned = text
    .trim()
    .replace(/[−–]/g, "-")
    .replace(/(\d)[,\s](?=\d{3}\b)/g, "$1")
    .replace(/\s*(°|\^\\circ|\\circ|degrees?|[a-zA-Z]+\d?|%)$/u, "")
    .trim();
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number(cleaned);
  const fraction = /^([+-]?\d+)\s*\/\s*(\d+)$/.exec(cleaned);
  if (fraction) {
    const d = Number(fraction[2]);
    return d === 0 ? undefined : Number(fraction[1]) / d;
  }
  return undefined;
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

function roundTo(v: number, dp: number): number {
  const k = 10 ** dp;
  return Math.round(v * k) / k;
}

function roundSf(v: number, sf: number): number {
  if (v === 0) return 0;
  return roundTo(v, sf - 1 - Math.floor(Math.log10(Math.abs(v))));
}

/**
 * How a response compares with the expected value at this accuracy: right, right but not
 * rounded as asked (more precise than the accuracy), or wrong.
 */
export function judgeNumber(
  response: number,
  expected: number,
  accuracy: Accuracy,
): "right" | "unrounded" | "wrong" {
  if ("exact" in accuracy) return close(response, expected) ? "right" : "wrong";
  if ("tolerance" in accuracy)
    return Math.abs(response - expected) <= accuracy.tolerance + 1e-9 ? "right" : "wrong";
  const round =
    "dp" in accuracy
      ? (v: number) => roundTo(v, accuracy.dp)
      : (v: number) => roundSf(v, accuracy.sf);
  if (!close(round(response), round(expected))) return "wrong";
  return close(response, round(response)) ? "right" : "unrounded";
}

/** The accuracy in words, for messages: "to 2 decimal places". */
export function accuracyWords(accuracy: Accuracy): string {
  if ("dp" in accuracy) return `to ${accuracy.dp} decimal place${accuracy.dp === 1 ? "" : "s"}`;
  if ("sf" in accuracy)
    return `to ${accuracy.sf} significant figure${accuracy.sf === 1 ? "" : "s"}`;
  return "";
}
