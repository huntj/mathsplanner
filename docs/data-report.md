# Data report: progression map import

19 Oct 2026 · Phase 0

This report lists everything the Phase 0 import of [progression-map.md](progression-map.md) into [`data/statements.json`](../data/statements.json) found that needs a human decision. Nothing listed here was changed: the JSON reproduces the map exactly, and each item is waiting for review. Once decided, fixes should be made in `data/statements.json` by pull request (and, if you want the map to stay in step, in the map too).

Reproduce the findings with `pnpm data:import` (parse and check) or `pnpm data:check` (check only). Line numbers refer to `docs/progression-map.md`.

## Summary

All 686 statements import cleanly. IDs are unique, every Needs ID exists, the prerequisite graph has no cycles, and every count matches the map's summary table.

| Group         | Map summary | Imported |
| ------------- | ----------: | -------: |
| EYFS          |          35 |       35 |
| KS1           |          54 |       54 |
| KS2           |         170 |      170 |
| KS3           |          76 |       76 |
| KS4           |         127 |      127 |
| A level Maths |         106 |      106 |
| Further Maths |          80 |       80 |
| · core pure   |          31 |       31 |
| · options     |          49 |       49 |
| Core Maths    |          38 |       38 |
| **Total**     |     **686** |  **686** |

By stage: N 19, R 16, Y1 21, Y2 33, Y3 33, Y4 42, Y5 47, Y6 48, Y7 31, Y8 26, Y9 19, GF 87, GH 40, AL 106, FM 80, CM 38.

`data:check` reports 13 warnings, covered in sections 1 and 2. Sections 3 to 6 are things I noticed by reading the map.

## 1. Prerequisites that look wrong

**1.1 A Foundation statement needs a Higher-only one.** `GF-A6` (know the difference between an equation and an identity; line 544) needs `GH-A3` (understand and use identities). GF statements are tested on both tiers, so a Foundation student would depend on Higher-only content. The split of A3 into GF and GH follows the specification, so the likely fix is for `GF-A6` to need `GF-A3` (or `GF-A4`) instead of `GH-A3`.

**1.2 Year 12 Further Maths statements need Year 13 A level statements.** Students take both A levels together, so these needs point forwards in time:

| Statement (Year 12)              | Needs (Year 13)             |
| -------------------------------- | --------------------------- |
| `FM-CP-01` proof by induction    | `AL-P4.3` sigma notation    |
| `FM-CP-14` sums of series        | `AL-P4.3` sigma notation    |
| `FM-CP-04` modulus-argument form | `AL-P5.6` addition formulae |
| `FM-CP-22` lines and planes      | `AL-P10.1b` vectors in 3D   |

Options: move those AL statements to Year 12 (many schools teach them early to Further Maths students), mark the FM statements as Years 12 and 13, or accept the mismatch as a teaching-order note.

**1.3 Two KS5 entry points have no prerequisites.** `FM-CP-08` (matrix arithmetic, line 819) and `FM-D1-01` (algorithms, line 885) have empty Needs. The map says every FM statement implicitly needs A level Maths (line 798), but that is not in the data, so the prerequisite graph treats both as starting points. Do you want explicit needs (for example `GF-A1` or `AL-P2.1` for matrices), or are they deliberate entry points?

## 2. Identical or near-identical wording

These pairs have word-for-word identical text (`data:check` warns about them):

| Statements               | Wording                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `Y3-NPV-04`, `Y4-NPV-06` | Identify, represent and estimate numbers using different representations           |
| `Y8-ALG-05`, `GF-A8`     | Work with coordinates in all four quadrants                                        |
| `Y8-RAT-01`, `GF-R2`     | Use scale factors, scale diagrams and maps                                         |
| `GF-A19`, `CM-LP5`       | Solve linear simultaneous equations algebraically and graphically                  |
| `GF-R16`, `CM-SG1`       | Set up and solve growth and decay problems, including compound interest            |
| `GF-S1`, `CM-A1`         | Infer properties of populations from a sample, knowing the limitations of sampling |

These mirror the source documents, which repeat themselves, so they are probably intended. But two generators with identical statements need some other difference (number ranges, contexts, depth) to be distinguishable. Should the wording say what differs, for example "…numbers up to 1000" for `Y3-NPV-04` and "…beyond 1000" for `Y4-NPV-06`?

Not caught by the check: `Y7-PRO-02` (line 429, "Understand that the probabilities of all possible outcomes sum to 1") and `Y8-PRO-01` (line 460) start with the same sentence; Y8 adds "and use this to find missing probabilities". Is the Year 7 statement needed?

## 3. Missing information

**3.1 No recommended year for 87 KS5 statements.** The Further Maths option table (line 846, 49 statements) and the Core Maths table (line 908, 38 statements) have no Yr column, so these statements have no `years`. Should options and Core Maths be given years, or is leaving them unset right?

**3.2 Core Maths strand codes are not defined.** Core Maths IDs use `A`, `P`, `LP` and `SG`, which are not in the map's strand table. I have assumed they mean data analysis, probability, linear programming (with algebra), and sequences and growth. Can you confirm the names?

**3.3 The strand table does not match the IDs above KS3.** The table at line 13 lists KS5 strand codes (`PRF`, `TRG`, `EXP`, `DIF`, `INT`, `NUM`, `VEC`, `MEC`, `CPX`, `MAT`) that no ID uses. In practice GCSE IDs use the specification areas (`N`, `A`, `R`, `G`, `P`, `S`), A level uses topic numbers (`P1` to `P10`, `S1` to `S5`, `M6` to `M9`) and Further Maths uses `CP` and the option codes. The "Used in" column also overstates some strands, for example `NPV` "EYFS to KS4", although KS4 uses `N`. The importer uses the strands in the IDs. Should the strand table be updated?

## 4. Statutory status and source

**4.1 Only 6 of the 16 Reception statements are statutory.** As agreed, `statutory` is true only for Reception statements marked ELG (`R-NPV-02`, `R-NPV-08`, `R-AS-01`, `R-NPV-09`, `R-NPV-10`, `R-PAT-01`). The other 10 Reception statements are false.

**4.2 Every Reception statement has source "EYFS framework".** The source comes from the section, as asked. The 10 non-ELG statements read like Development Matters' Reception guidance rather than the statutory framework, though. Should they be labelled "Development Matters" instead?

**4.3 KS3 is statutory as a key stage, not by year.** All 76 KS3 statements are `statutory: true` (national curriculum content), even though their Year 7, 8 and 9 placement is only the map's recommendation.

## 5. Annotations inside statement text

Some statements carry notes for teachers inside the "I can…" text, which students would see:

- `(ELG)` at the end of five Reception statements, and `(ELG: bonds to 5 including subtraction facts; some bonds to 10 including doubles)` in `R-AS-01`;
- `(assessed by the MTC)` in `Y4-MD-01` (line 241).

They were kept exactly as written. Should they move out of `text` (`statutory` already captures ELG status; an assessment note could become a new field)? If the ELG markers are removed, the import rule for Reception `statutory` needs another source of truth.

## 6. Minor points

- **Strand placement.** `N-POS-01` (talk about 2D and 3D shapes; line 73) is about shape, so it would sit more naturally in `GEO`. Moving it would change its ID, so only do it now if at all.
- **Row order.** `Y4-NPV-02` (line 230) appears before its prerequisite `Y4-NPV-03`, and `Y8-POS-01` (line 456) sits between geometry rows. This is harmless, since IDs and Needs, not row order, define the graph.
- **Further Maths option wording is summarised.** The map says (line 898) that option topic lists are summarised and should be checked against the specification before they are used for assessment. The same caution applies to all wording (line 977).
- **Out-of-scope section.** The "Curriculum change watch" section (line 951) is now outside the project's scope (current curriculum only). It contains no statements and was ignored.
- **Lost diagrams.** Both documents contain `[embedded content: …]` placeholders where diagrams did not survive the export (progression map line 37; design document, Architecture section).
- **Escaped pipes.** Ten `\|` sequences in table cells (for example `|bx/a| < 1`) were read as literal `|` characters. This is Markdown escaping, not a change to the data.

## Interpretations made during import

These follow your instructions or the design document; listed so they can be checked.

- `tier` is `"F"` for every GF statement, meaning "tested on both tiers" rather than "Foundation only", and `"H"` for GH.
- `source` values: Development Matters, EYFS framework, NC KS1, NC KS2, NC KS3, Edexcel 1MA1, Edexcel 9MA0, Edexcel 9FM0, Edexcel 7MC0.
- `years` is sorted, so "12, 13" becomes `[12, 13]`.
- The file wraps the statements as `{ "$schema", "version": "0.1.0", "statements": [...] }`, in map order. The misconception catalogue uses the same wrapper, with entries `{ code, description, remediate? }`; that entry shape is new and open to change before Phase 1.
- Teaching order used for the "taught later" warning: N, R, Y1 … Y9, then GCSE (GF and GH together), then A level and Core Maths, then Further Maths.
