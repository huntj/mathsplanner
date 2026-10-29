// The course as the app sees it: data/course.json's sections, units and skills, each skill's
// wording, the levels a skill climbs (from the depths its generator supports) and the state of each
// node on the path.
import type {
  CourseFile,
  CourseSection,
  CourseUnit,
  Depth,
  Numbers,
  Stage,
  StatementsFile,
  TopicsFile,
} from "@mathsplanner/core";
import courseFile from "../../../data/course.json" with { type: "json" };
import statementsFile from "../../../data/statements.json" with { type: "json" };
import topicsFile from "../../../data/topics.json" with { type: "json" };

export const course = courseFile as CourseFile;
const statements = (statementsFile as StatementsFile).statements;
const statementText = new Map(statements.map((s) => [s.id, s.text]));
const topicNames = new Map((topicsFile as TopicsFile).topics.map((t) => [t.id, t.name]));

/** The years a pupil can choose, in order; only those in the course can be started yet. */
export const YEARS: readonly { stage: Stage; name: string }[] = [
  { stage: "Y1", name: "Year 1" },
  { stage: "Y2", name: "Year 2" },
  { stage: "Y3", name: "Year 3" },
  { stage: "Y4", name: "Year 4" },
  { stage: "Y5", name: "Year 5" },
  { stage: "Y6", name: "Year 6" },
  { stage: "Y7", name: "Year 7" },
  { stage: "Y8", name: "Year 8" },
  { stage: "Y9", name: "Year 9" },
  { stage: "GF", name: "GCSE Foundation" },
  { stage: "GH", name: "GCSE Higher" },
];

export const sectionFor = (stage: Stage | undefined): CourseSection | undefined =>
  course.sections.find((s) => s.stage === stage);

export const skillText = (id: string) => statementText.get(id) ?? id;
export const topicName = (id: string) => topicNames.get(id) ?? id;

export const LEVEL_NAMES = ["Learn", "Practise", "Picture", "Reason", "Legendary"] as const;
export type LevelName = (typeof LEVEL_NAMES)[number];

/** One level of a skill: the depths and numbers setting its lessons use. */
export interface Level {
  name: LevelName;
  depths: Depth[];
  numbers: Numbers;
}

/** The levels a skill climbs, and which of them move a pupil along the path or mark mastery. */
export interface SkillLevels {
  levels: Level[];
  /** Levels to finish before the next skill opens. */
  pathLevels: number;
  /** The level (counting from 1) that marks the skill as mastered, if the skill has one. */
  mastery?: number;
}

/**
 * Learn (depth 1, friendly numbers), Practise (depths 1 and 2), Picture (depth 3) and Reason (depth
 * 4, which marks mastery) where the generator supports those depths, then Legendary: depth 5 with
 * stretch numbers, or the deepest depth there is when depth 5 is not supported.
 */
export function skillLevels(supported: readonly Depth[]): SkillLevels {
  const has = (d: Depth) => supported.includes(d);
  const levels: Level[] = [];
  const first = has(1) ? 1 : (Math.min(...supported) as Depth);
  levels.push({ name: "Learn", depths: [first], numbers: "friendly" });
  if (has(2)) levels.push({ name: "Practise", depths: has(1) ? [1, 2] : [2], numbers: "standard" });
  if (has(3)) levels.push({ name: "Picture", depths: [3], numbers: "standard" });
  const pathLevels = levels.length;
  if (has(4)) levels.push({ name: "Reason", depths: [4], numbers: "standard" });
  const deepest = has(5) ? 5 : (Math.max(...supported) as Depth);
  levels.push({ name: "Legendary", depths: [deepest], numbers: "stretch" });
  return has(4) ? { levels, pathLevels, mastery: pathLevels + 1 } : { levels, pathLevels };
}

export type NodeState = "locked" | "current" | "started" | "done" | "mastered" | "legendary";

export interface PathNode {
  skill: string;
  /** Levels completed. */
  level: number;
  info: SkillLevels;
  state: NodeState;
}

export interface PathUnit {
  unit: CourseUnit;
  /** Counting from 1. */
  number: number;
  nodes: PathNode[];
  /** The unit review opens once every skill in the unit has been finished. */
  review: "locked" | "open";
}

/** A finished skill's state: legendary at the top, mastered from its mastery level, else done. */
function finishedState(level: number, info: SkillLevels): NodeState {
  if (level >= info.levels.length) return "legendary";
  if (info.mastery !== undefined && level >= info.mastery) return "mastered";
  return "done";
}

/**
 * Lays a section out as the path: the first unfinished skill is the current one and the skills
 * after it are locked, except any already finished or started (by a test or a teacher's link).
 */
export function buildPath(
  section: CourseSection,
  levelOf: (skill: string) => number,
  infoOf: (skill: string) => SkillLevels,
): PathUnit[] {
  let current = false;
  return section.units.map((unit, i) => {
    const nodes = unit.skills.map((skill): PathNode => {
      const info = infoOf(skill);
      const level = Math.min(levelOf(skill), info.levels.length);
      let state: NodeState;
      if (level >= info.pathLevels) state = finishedState(level, info);
      else if (!current) {
        state = "current";
        current = true;
      } else state = level > 0 ? "started" : "locked";
      return { skill, level, info, state };
    });
    const finished = nodes.every((n) => n.level >= n.info.pathLevels);
    return { unit, number: i + 1, nodes, review: finished ? "open" : "locked" };
  });
}
