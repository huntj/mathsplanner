/**
 * @statement CM-SG7.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG7.b: Use sequences given by recurrence relations
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import s0 from "./CM-SG7.ts";
import s1 from "../ks4/GF-A23_a.ts";

const s0Def = { ...s0.definition, id: "CM-SG7.b" };
const s1Def = { ...s1.definition, id: "CM-SG7.b" };

export default defineGenerator(mixFamilies("CM-SG7.b", { 1: s0Def, 2: s1Def, 4: s1Def }));
