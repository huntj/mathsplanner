/**
 * @statement CM-SG7.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-SG7.a: Use sequences given by nth-term formulae
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import s0 from "../ks4/GF-A23_b.ts";
import s1 from "./CM-SG7.ts";

const s0Def = { ...s0.definition, id: "CM-SG7.a" };
const s1Def = { ...s1.definition, id: "CM-SG7.a" };

export default defineGenerator(mixFamilies("CM-SG7.a", { 1: s0Def, 2: s1Def, 4: s0Def }));
