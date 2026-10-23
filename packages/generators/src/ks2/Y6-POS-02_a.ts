/**
 * @statement Y6-POS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-POS-02.a: Translate shapes on the coordinate plane
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-POS-02.ts";
import translations from "./Y5-POS-01_b.ts";

const slide = { ...translations.definition, id: "Y6-POS-02.a" };

export default defineGenerator(
  mixFamilies("Y6-POS-02.a", {
    1: slide,
    2: { ...parent.definition, id: "Y6-POS-02.a" },
    4: slide,
  }),
);
