// @mathsplanner/marking: AnswerSpec checking, equivalence and form rules.
export { equivalent, formProblem, normaliseLatex } from "./exact.ts";
export {
  markPart,
  markQuestion,
  type MarkResult,
  type MarkStatus,
  type QuestionMark,
} from "./mark.ts";
export { accuracyWords, judgeNumber, parseNumber } from "./number.ts";
