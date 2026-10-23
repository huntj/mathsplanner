/**
 * @statement CM-SG6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG6.b: Find the nth term of quadratic sequences
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import s0 from "../ks4/GF-A24_d.ts";
import s1 from "./CM-SG6.ts";

const s0Def = { ...s0.definition, id: "CM-SG6.b" };
const s1Def = { ...s1.definition, id: "CM-SG6.b" };

export default defineGenerator(mixFamilies("CM-SG6.b", { 1: s0Def, 2: s1Def, 4: s0Def }));
