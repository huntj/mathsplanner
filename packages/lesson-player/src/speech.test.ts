import { describe, expect, it } from "vitest";
import { plainWords, texWords, wordsToSpeech } from "./speech.ts";

describe("read aloud", () => {
  it("says maths in words", () => {
    expect(texWords("x^2 + 3x = 10")).toBe("x squared plus 3x equals 10");
    expect(texWords("\\frac{3}{4}")).toBe("3 over 4");
    expect(texWords("\\sin 30° = \\frac{x}{10}")).toBe("sine 30 degrees equals x over 10");
    expect(texWords("2 \\times 35° = 70°")).toBe("2 times 35 degrees equals 70 degrees");
    expect(texWords("\\sqrt{16} = 4")).toBe("the square root of 16 equals 4");
    expect(texWords("49\\pi")).toBe("49 pi");
    expect(texWords("90^\\circ")).toBe("90 degrees");
  });
  it("tidies plain words for a voice", () => {
    expect(plainWords("Find angle ACB.")).toBe("Find angle A C B.");
    expect(plainWords("Radius 4 cm, area 50.3 cm²")).toBe(
      "Radius 4 centimetres, area 50.3 square centimetres",
    );
    expect(plainWords("ACB = 130° ÷ 2 = 65°")).toBe(
      "A C B = 130 degrees divided by 2 = 65 degrees",
    );
    expect(plainWords("**Equal.** To 1 d.p.")).toBe("Equal. To 1 decimal place");
  });
  it("reads a string with maths in it", () => {
    expect(wordsToSpeech("So angle AOB is $2 \\times 35° = 70°$")).toBe(
      "So angle A O B is 2 times 35 degrees equals 70 degrees",
    );
  });
});
