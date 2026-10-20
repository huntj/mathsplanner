// @mathsplanner/marking: AnswerSpec checking, equivalence and form rules.
export { equivalent, formProblem, loadEquivalence, normaliseLatex } from "./exact.ts";
export {
  markPart,
  markQuestion,
  needsEquivalence,
  prepareMarking,
  type MarkResult,
  type MarkStatus,
  type QuestionMark,
} from "./mark.ts";
export { accuracyWords, judgeNumber, parseNumber } from "./number.ts";
