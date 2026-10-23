/**
 * @statement CM-SG7.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG7.c: Use Fibonacci sequences and the golden ratio
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import s0 from "../ks4/GF-A24_c.ts";
import s1 from "./CM-SG7.ts";

const s0Def = { ...s0.definition, id: "CM-SG7.c" };
const s1Def = { ...s1.definition, id: "CM-SG7.c" };

export default defineGenerator(mixFamilies("CM-SG7.c", { 1: s0Def, 2: s0Def, 4: s1Def }));
