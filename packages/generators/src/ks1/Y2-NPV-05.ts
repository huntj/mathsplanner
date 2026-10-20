/**
 * @statement Y2-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-05: Read and write numbers to at least 100 in numerals and words
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberWords } from "../shared/counting.ts";

interface Params {
  n: number;
  set: number[];
}

export default defineGenerator<Params>({
  id: "Y2-NPV-05",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.PLACE.DIGIT-ORDER", "NPV.PLACE.WRITE-AS-SAID"],

  params(rng, numbers) {
    const n = numbers === "stretch" ? rng.pick([100, rng.int(21, 99)]) : rng.int(21, 99);
    if (n !== 100 && n % 10 === 0) reject("whole tens have no ones to confuse");
    if (n % 11 === 0) reject("repeated digits cannot be reversed");
    const set = rng.sample(
      Array.from({ length: 79 }, (_, i) => 21 + i).filter((v) => v % 10 !== 0),
      3,
    );
    return { n, set };
  },

  build(p, depth, rng): QuestionDraft {
    const tens = Math.floor(p.n / 10);
    const ones = p.n % 10;
    const reversed = ones * 10 + tens;
    const asSaid = p.n === 100 ? 1000 : tens * 100 + ones;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Read the words: ${numberWords(p.n)}.`,
          ask: "Which numeral is it?",
          correct: A.math(String(p.n)),
          distractors: [
            ...(p.n === 100
              ? []
              : [
                  {
                    content: A.math(String(reversed)),
                    code: "NPV.PLACE.DIGIT-ORDER",
                    feedback: "The tens come first: write the tens digit, then the ones.",
                  },
                ]),
            {
              content: A.math(String(asSaid)),
              code: "NPV.PLACE.WRITE-AS-SAID",
              feedback:
                p.n === 100
                  ? "One hundred is 100: a 1 and two zeros."
                  : `${numberWords(p.n)} is ${tens} tens and ${ones} ones: two digits, ${p.n}.`,
            },
            { content: A.math(String(p.n === 100 ? 10 : p.n + 10 > 99 ? p.n - 10 : p.n + 10)) },
          ],
          solution: [{ say: `${numberWords(p.n)} is ${p.n}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "reverse",
          question: ["Here is a number: ", A.math(String(p.n)), "."],
          ask: "How do you write it in words?",
          correct: numberWords(p.n),
          distractors: [
            ...(p.n === 100
              ? [{ content: "ten tens hundred" }]
              : [
                  {
                    content: numberWords(reversed),
                    code: "NPV.PLACE.DIGIT-ORDER",
                    feedback: `${p.n} has ${tens} tens, so it starts ${numberWords(tens * 10)}.`,
                  },
                ]),
            {
              content: p.n === 100 ? "one thousand" : `${numberWords(tens)}-${numberWords(ones)}`,
              feedback: "Use the tens word, like twenty, thirty or forty.",
            },
            { content: numberWords(p.n === 100 ? 10 : p.n + 1) },
          ],
          solution: [{ say: `${p.n} is written ${numberWords(p.n)}.` }],
        });
      default:
        return A.matchRepresentations({
          rng,
          question: "Match each number to its words.",
          pairs: p.set.map(
            (m) => [A.math(String(m)), numberWords(m)] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: p.set.map((m) => `${m} is ${numberWords(m)}`).join("; ") + "." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === String(p.n);
    if (question.archetype === "reverse") return chosenText(question) === numberWords(p.n);
    return new Set(p.set).size === 3;
  },
});
