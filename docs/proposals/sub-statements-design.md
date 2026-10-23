# Proposal: sub-statements, more variety, and schemes of work

Status: **approved on 23 October 2026** (IDs as `GF-A4.a`, GCSE first, half-term schemes). All 841 steps have generators (24 October 2026) and the scheme-of-work page is built (see the design doc's decisions). The full breakdown is listed at the end of this
file and is also in [sub-statements.json](sub-statements.json) (generated from
[sub-statements.txt](sub-statements.txt), which is the easiest file to edit).

## 1. Breaking broad statements into sub-statements

### What I found

I read all 686 statements. **326 bundle two or more skills that a teacher would usually teach in
separate lessons**, and they split into **841 sub-statements**. The other 360 are already one
skill and stay as they are.

| Stage                        | Statements split | Sub-statements |
| ---------------------------- | ---------------: | -------------: |
| Nursery and Reception        |                4 |             11 |
| Years 1 to 6                 |              105 |            265 |
| Years 7 to 9                 |               53 |            135 |
| GCSE (Foundation and Higher) |               61 |            171 |
| A level Maths                |               30 |             76 |
| Further Maths                |               56 |            142 |
| Core Maths                   |               17 |             41 |
| **Total**                    |          **326** |        **841** |

The rule I used: split when the parts are separate methods or separate lessons (expanding versus
factorising, column addition versus column subtraction, the sine rule versus the cosine rule).
Splits by unit only (length, mass, capacity) are kept for KS1 and KS2, where they are taught
separately, but not later. Early-years statements are mostly left whole.

Your example, GF-A4, becomes seven steps in order:

| ID      | Sub-statement                           | Needs                                    |
| ------- | --------------------------------------- | ---------------------------------------- |
| GF-A4.a | Collect like terms                      | Y9-ALG-01, Y9-ALG-02 (as GF-A4 does now) |
| GF-A4.b | Expand a single bracket                 | GF-A4.a                                  |
| GF-A4.c | Factorise by taking out a common factor | GF-A4.b                                  |
| GF-A4.d | Expand the product of two binomials     | GF-A4.c                                  |
| GF-A4.e | Factorise x² + bx + c                   | GF-A4.d                                  |
| GF-A4.f | Factorise the difference of two squares | GF-A4.e                                  |
| GF-A4.g | Use the laws of indices in algebra      | GF-A4.f                                  |

Each split is marked either as a **sequence** (each step needs the one before, like GF-A4) or as
**separate skills** that can be taught in any order (like the 2, 5 and 10 times tables).

### Proposed design (needs your approval, as it changes the design doc)

1. **IDs.** A sub-statement is its parent's ID, a dot and a letter: `GF-A4.a`, `Y2-AS-02.c`. The dot
   keeps A level IDs unambiguous, since some already end in a letter (`AL-P2.6a` splits into
   `AL-P2.6a.a`, `AL-P2.6a.b`, `AL-P2.6a.c`).
2. **Data.** Sub-statements are added to `data/statements.json` as ordinary statements with a new
   `parent` field, keeping the parent's stage, strand, tier and source. The parent stays, so every
   existing link, worksheet, test and prerequisite keeps working; a statement that needs `GF-A4`
   still needs the whole of it.
3. **Generators.** Every sub-statement gets its own generator, reviewed like the others. The
   parent's generator becomes a mix that draws from its sub-statements in turn. Many
   sub-statement generators can start from the code the parent already has (it often has a mode for
   each skill), and the rest are new questions, which also brings in the extra variety you asked
   for.
4. **Coverage.** The dashboard counts statements and sub-statements separately, so it shows
   686 statements and 841 sub-statements, each generated and reviewed.
5. **Dropdowns.** Wherever statements are listed (the practice picker, unit tests, the gallery and
   the coverage page), a statement with sub-statements has a dropdown arrow. Ticking the parent
   includes all of its steps; opening the dropdown lets you tick single steps for focused
   practice. Year and unit tests draw from the sub-statements, which spreads questions more evenly
   across the skills.
6. **Misconceptions.** Remediation can point to the exact sub-statement, e.g. a sign error when
   expanding points to `GF-A4.d` rather than the whole of GF-A4.

### Suggested order of work

Strand by strand, as in Phase 7, starting where the gain is biggest:

1. GCSE algebra and number (GF-A4 and the other GF and GH splits), then the rest of GCSE.
2. Years 7 to 9.
3. Years 1 to 6, then the early years.
4. A level, Core Maths and Further Maths.

The data and the dropdowns come first, so each strand appears in the app as soon as its
generators are pushed.

## 2. More variety in the questions

The difficulty levels stay as they are. Variety comes from three sources:

- **Sub-statements** give each skill its own set of questions, instead of one generator covering
  four skills.
- **More question styles per depth.** Most generators lean on four styles: true or false with a
  reason (used in 521 generator files), standard (452), multiple choice (264) and varied form (230).
  The engine already has styles that are hardly used: spot the mistake (14), explain the error (9),
  always, sometimes or never (17), odd one out (1) and compare methods (0). Adding these at depths 2
  to 4, and a few new ones (order the steps of a method, sort into groups, write a question with
  this answer), would give each skill several kinds of question at the same difficulty. Each
  generator could then pick a style at random from its seed, so the same depth looks different
  from one question to the next.
- **More contexts.** A bank of real contexts per topic (shopping, travel, sport, science, money)
  that word problems draw from, so the same skill appears in different settings.

## 3. Schemes of work

A new **Scheme of work** page in the practice app:

1. **Choose the year (or years) and the terms.** The default is six half-terms (Autumn 1 to Summer
   2), each with a number of weeks.
2. **Fill it in.** Either start from a draft built from the curriculum (the year's statements in
   prerequisite order, split across the half-terms), or start empty. Then add, remove and move
   statements and sub-statements using the same picker with dropdowns.
3. **Checks.** A warning appears when something is taught before one of its prerequisites.
4. **Use it.** Each half-term has buttons for:
   - **Homework**: a practice set from that half-term's statements, with an option to mix in some
     questions from earlier half-terms for retrieval practice.
   - **End of term test**: a paper from that half-term, or cumulative from the start of the year,
     using the year-test settings (questions, marks, start and end depth).
   - **Worksheet**: a printable sheet, as now.
5. **Save and share.** The app stays stateless, as the design doc requires. A scheme is saved as a
   link and as a file that the teacher can download, share with their department and load again.
   The browser also remembers the last scheme as a convenience.
6. **Print** a one-page overview of the scheme for the department.

## Decisions

1. IDs: `GF-A4.a` (approved). Generator files use an underscore, `GF-A4_a.ts`, because a file
   ending in `.d.ts` is a TypeScript declaration file.
2. The breakdown below can still be edited: change `sub-statements.txt` or say what to change.
3. Order of work: GCSE first (approved).
4. Schemes of work: half-terms (approved).

## The full breakdown

A sequence means each step needs the one before; separate means the steps can be taught in any order.

### Nursery

**N-MEA-01** Make comparisons between objects relating to size, length, weight and capacity _(separate)_

- `N-MEA-01.a` Compare objects by size and length
- `N-MEA-01.b` Compare objects by weight
- `N-MEA-01.c` Compare containers by capacity

### Reception

**R-AS-01** Automatically recall number bonds for 0 to 5 and some to 10 (ELG: bonds to 5 including subtraction facts; some bonds to 10 including doubles) _(sequence)_

- `R-AS-01.a` Recall number bonds to 5, including subtraction facts
- `R-AS-01.b` Recall some number bonds to 10, including doubles

**R-PAT-01** Explore and represent patterns within numbers up to 10, including evens and odds, double facts and sharing equally (ELG) _(separate)_

- `R-PAT-01.a` Explore odd and even numbers to 10
- `R-PAT-01.b` Explore double facts to 10
- `R-PAT-01.c` Share amounts up to 10 equally

**R-MEA-01** Compare length, weight and capacity _(separate)_

- `R-MEA-01.a` Compare lengths
- `R-MEA-01.b` Compare weights
- `R-MEA-01.c` Compare capacities

### Year 1

**Y1-NPV-01** Count to and across 100, forwards and backwards, from any number _(sequence)_

- `Y1-NPV-01.a` Count forwards to and across 100 from any number
- `Y1-NPV-01.b` Count backwards from any number up to 100

**Y1-NPV-02** Count, read and write numbers to 100 in numerals; count in 2s, 5s and 10s _(separate)_

- `Y1-NPV-02.a` Count, read and write numbers to 100 in numerals
- `Y1-NPV-02.b` Count in 2s
- `Y1-NPV-02.c` Count in 5s
- `Y1-NPV-02.d` Count in 10s

**Y1-NPV-04** Identify and represent numbers using objects and pictures, including the number line; use equal to, more than, less than, most, least _(sequence)_

- `Y1-NPV-04.a` Represent numbers using objects and pictures
- `Y1-NPV-04.b` Represent numbers on a number line
- `Y1-NPV-04.c` Use equal to, more than, less than, most and least

**Y1-AS-02** Represent and use number bonds and related subtraction facts within 20 _(sequence)_

- `Y1-AS-02.a` Know number bonds within 10
- `Y1-AS-02.b` Know number bonds within 20
- `Y1-AS-02.c` Use related subtraction facts within 20

**Y1-AS-03** Add and subtract one-digit and two-digit numbers to 20, including zero _(sequence)_

- `Y1-AS-03.a` Add one-digit numbers within 20, including zero
- `Y1-AS-03.b` Subtract one-digit numbers within 20, including zero
- `Y1-AS-03.c` Add and subtract a one-digit and a two-digit number within 20

**Y1-AS-04** Solve one-step problems involving addition and subtraction, including missing number problems like 7 = ? − 9 _(sequence)_

- `Y1-AS-04.a` Solve one-step addition and subtraction problems
- `Y1-AS-04.b` Solve missing number problems such as 7 = ? − 9

**Y1-MD-01** Solve one-step multiplication and division problems using objects, pictorial representations and arrays _(separate)_

- `Y1-MD-01.a` Solve multiplication problems with equal groups and arrays
- `Y1-MD-01.b` Solve division problems by sharing
- `Y1-MD-01.c` Solve division problems by grouping

**Y1-MEA-01** Compare, describe and solve practical problems for lengths, heights, mass, capacity and time _(separate)_

- `Y1-MEA-01.a` Compare and solve problems with lengths and heights
- `Y1-MEA-01.b` Compare and solve problems with mass
- `Y1-MEA-01.c` Compare and solve problems with capacity
- `Y1-MEA-01.d` Compare and solve problems with time

**Y1-MEA-02** Measure and begin to record lengths, heights, mass, capacity and time _(separate)_

- `Y1-MEA-02.a` Measure lengths and heights
- `Y1-MEA-02.b` Measure mass
- `Y1-MEA-02.c` Measure capacity
- `Y1-MEA-02.d` Measure time

**Y1-MEA-06** Tell the time to the hour and half past the hour and draw the hands on a clock face _(sequence)_

- `Y1-MEA-06.a` Tell the time to the hour
- `Y1-MEA-06.b` Tell the time to half past the hour
- `Y1-MEA-06.c` Draw the hands on a clock face for o'clock and half past

**Y1-POS-01** Describe position, direction and movement, including whole, half, quarter and three-quarter turns _(sequence)_

- `Y1-POS-01.a` Describe position and direction
- `Y1-POS-01.b` Describe whole and half turns
- `Y1-POS-01.c` Describe quarter and three-quarter turns

### Year 2

**Y2-NPV-01** Count in steps of 2, 3 and 5 from 0, and in tens from any number, forwards and backwards _(separate)_

- `Y2-NPV-01.a` Count in steps of 2 and 5 from 0
- `Y2-NPV-01.b` Count in steps of 3 from 0
- `Y2-NPV-01.c` Count in tens from any number, forwards and backwards

**Y2-NPV-04** Compare and order numbers from 0 up to 100; use <, > and = _(sequence)_

- `Y2-NPV-04.a` Compare numbers up to 100 using <, > and =
- `Y2-NPV-04.b` Order numbers from 0 up to 100

**Y2-AS-01** Recall and use addition and subtraction facts to 20 fluently, and derive and use related facts up to 100 _(sequence)_

- `Y2-AS-01.a` Recall addition and subtraction facts to 20
- `Y2-AS-01.b` Derive related facts up to 100, e.g. 30 + 70 from 3 + 7

**Y2-AS-02** Add and subtract numbers using objects, pictures and mentally: a 2-digit number and ones; a 2-digit number and tens; two 2-digit numbers; three 1-digit numbers _(sequence)_

- `Y2-AS-02.a` Add and subtract a 2-digit number and ones
- `Y2-AS-02.b` Add and subtract a 2-digit number and tens
- `Y2-AS-02.c` Add and subtract two 2-digit numbers
- `Y2-AS-02.d` Add three 1-digit numbers

**Y2-MD-01** Recall and use multiplication and division facts for the 2, 5 and 10 times tables, including odd and even numbers _(separate)_

- `Y2-MD-01.a` Recall and use the 2 times table
- `Y2-MD-01.b` Recall and use the 5 times table
- `Y2-MD-01.c` Recall and use the 10 times table
- `Y2-MD-01.d` Recognise odd and even numbers

**Y2-MD-04** Solve multiplication and division problems using materials, arrays, repeated addition, mental methods and facts, including in context _(sequence)_

- `Y2-MD-04.a` Solve multiplication and division with arrays and repeated addition
- `Y2-MD-04.b` Solve multiplication and division problems in context

**Y2-FR-01** Recognise, find, name and write ⅓, ¼, 2/4 and ¾ of a length, shape, set of objects or quantity _(sequence)_

- `Y2-FR-01.a` Find ½ and ¼ of a shape, length or quantity
- `Y2-FR-01.b` Find ⅓ of a shape, length or quantity
- `Y2-FR-01.c` Find 2/4 and ¾ of a shape, length or quantity

**Y2-FR-02** Write simple fractions, e.g. ½ of 6 = 3, and recognise that 2/4 and ½ are equivalent _(sequence)_

- `Y2-FR-02.a` Write simple fractions of amounts, e.g. ½ of 6 = 3
- `Y2-FR-02.b` Recognise that 2/4 and ½ are equivalent

**Y2-MEA-01** Choose and use standard units to estimate and measure length/height (m/cm), mass (kg/g), temperature (°C) and capacity (l/ml) to the nearest unit, using scales, thermometers and jugs _(separate)_

- `Y2-MEA-01.a` Measure length and height in m and cm
- `Y2-MEA-01.b` Measure mass in kg and g
- `Y2-MEA-01.c` Measure temperature in °C
- `Y2-MEA-01.d` Measure capacity in l and ml

**Y2-MEA-02** Compare and order lengths, mass, volume/capacity and record results using >, < and = _(separate)_

- `Y2-MEA-02.a` Compare and order lengths
- `Y2-MEA-02.b` Compare and order masses
- `Y2-MEA-02.c` Compare and order volumes and capacities

**Y2-MEA-03** Recognise and use £ and p; combine amounts to make a value; find different combinations of coins _(sequence)_

- `Y2-MEA-03.a` Recognise and use £ and p
- `Y2-MEA-03.b` Combine amounts to make a value
- `Y2-MEA-03.c` Find different combinations of coins for the same value

**Y2-MEA-06** Tell and write the time to five minutes, including quarter past/to the hour _(sequence)_

- `Y2-MEA-06.a` Tell the time to quarter past and quarter to
- `Y2-MEA-06.b` Tell and write the time to five minutes

**Y2-GEO-01** Identify and describe properties of 2D shapes, including number of sides and line symmetry in a vertical line _(separate)_

- `Y2-GEO-01.a` Describe the sides and vertices of 2D shapes
- `Y2-GEO-01.b` Find a vertical line of symmetry

**Y2-GEO-02** Identify and describe properties of 3D shapes, including number of edges, vertices and faces _(separate)_

- `Y2-GEO-02.a` Count the faces of 3D shapes
- `Y2-GEO-02.b` Count the edges and vertices of 3D shapes

**Y2-POS-02** Use mathematical vocabulary for position, direction and movement, including straight-line movement and rotation as a turn (quarter, half, three-quarter; clockwise and anticlockwise) _(separate)_

- `Y2-POS-02.a` Describe straight-line movement
- `Y2-POS-02.b` Describe quarter, half and three-quarter turns
- `Y2-POS-02.c` Use clockwise and anticlockwise

**Y2-STA-01** Interpret and construct simple pictograms, tally charts, block diagrams and tables _(separate)_

- `Y2-STA-01.a` Interpret and construct tally charts
- `Y2-STA-01.b` Interpret and construct pictograms
- `Y2-STA-01.c` Interpret and construct block diagrams
- `Y2-STA-01.d` Interpret and construct simple tables

### Year 3

**Y3-NPV-01** Count from 0 in multiples of 4, 8, 50 and 100; find 10 or 100 more or less than a number _(separate)_

- `Y3-NPV-01.a` Count in multiples of 4 and 8
- `Y3-NPV-01.b` Count in multiples of 50 and 100
- `Y3-NPV-01.c` Find 10 or 100 more or less than a number

**Y3-AS-01** Add and subtract mentally: a 3-digit number and ones, tens, or hundreds _(sequence)_

- `Y3-AS-01.a` Add and subtract ones to a 3-digit number mentally
- `Y3-AS-01.b` Add and subtract tens to a 3-digit number mentally
- `Y3-AS-01.c` Add and subtract hundreds to a 3-digit number mentally

**Y3-AS-02** Add and subtract numbers with up to three digits using formal written columnar methods _(sequence)_

- `Y3-AS-02.a` Add numbers with up to three digits using column addition
- `Y3-AS-02.b` Subtract numbers with up to three digits using column subtraction

**Y3-AS-03** Estimate the answer to a calculation and use inverse operations to check answers _(separate)_

- `Y3-AS-03.a` Estimate the answer to a calculation
- `Y3-AS-03.b` Use inverse operations to check answers

**Y3-MD-01** Recall and use multiplication and division facts for the 3, 4 and 8 times tables _(separate)_

- `Y3-MD-01.a` Recall and use the 3 times table
- `Y3-MD-01.b` Recall and use the 4 times table
- `Y3-MD-01.c` Recall and use the 8 times table

**Y3-MD-02** Write and calculate statements for multiplication and division, including 2-digit × 1-digit, using mental and progressing to formal written methods _(sequence)_

- `Y3-MD-02.a` Write multiplication and division statements from known facts
- `Y3-MD-02.b` Multiply a 2-digit number by a 1-digit number
- `Y3-MD-02.c` Divide a 2-digit number by a 1-digit number

**Y3-MD-03** Solve problems, including missing number, integer scaling and correspondence problems (n objects connected to m objects) _(separate)_

- `Y3-MD-03.a` Solve missing number multiplication and division problems
- `Y3-MD-03.b` Solve integer scaling problems
- `Y3-MD-03.c` Solve correspondence problems (n objects connected to m objects)

**Y3-FR-01** Count up and down in tenths; recognise that tenths arise from dividing an object into 10 equal parts and in dividing 1-digit numbers or quantities by 10 _(sequence)_

- `Y3-FR-01.a` Count up and down in tenths
- `Y3-FR-01.b` Recognise tenths from dividing by 10

**Y3-FR-02** Recognise, find and write fractions of a discrete set of objects: unit fractions and non-unit fractions with small denominators _(sequence)_

- `Y3-FR-02.a` Find unit fractions of a set of objects
- `Y3-FR-02.b` Find non-unit fractions of a set of objects

**Y3-MEA-01** Measure, compare, add and subtract lengths (m/cm/mm), mass (kg/g) and volume/capacity (l/ml) _(sequence)_

- `Y3-MEA-01.a` Measure lengths in m, cm and mm
- `Y3-MEA-01.b` Measure mass and capacity
- `Y3-MEA-01.c` Add and subtract lengths, masses and capacities

**Y3-MEA-04** Tell and write the time from an analogue clock, including Roman numerals I to XII, and 12-hour and 24-hour clocks _(separate)_

- `Y3-MEA-04.a` Tell the time on an analogue clock, including Roman numerals
- `Y3-MEA-04.b` Use the 12-hour clock
- `Y3-MEA-04.c` Use the 24-hour clock

**Y3-MEA-05** Estimate and read time to the nearest minute; use am/pm, morning, afternoon, noon and midnight _(sequence)_

- `Y3-MEA-05.a` Read the time to the nearest minute
- `Y3-MEA-05.b` Use am, pm, noon and midnight

**Y3-MEA-06** Know the number of seconds in a minute and days in each month, year and leap year _(separate)_

- `Y3-MEA-06.a` Know the number of seconds in a minute
- `Y3-MEA-06.b` Know the number of days in each month
- `Y3-MEA-06.c` Know the number of days in a year and a leap year

**Y3-GEO-01** Draw 2D shapes and make 3D shapes using modelling materials; recognise 3D shapes in different orientations and describe them _(separate)_

- `Y3-GEO-01.a` Draw 2D shapes
- `Y3-GEO-01.b` Recognise and describe 3D shapes in different orientations

**Y3-GEO-03** Identify right angles; recognise that two right angles make a half-turn, three a three-quarter turn and four a complete turn; identify whether angles are greater or less than a right angle _(sequence)_

- `Y3-GEO-03.a` Identify right angles
- `Y3-GEO-03.b` Relate right angles to quarter, half, three-quarter and whole turns
- `Y3-GEO-03.c` Identify angles greater or less than a right angle

**Y3-GEO-04** Identify horizontal and vertical lines and pairs of perpendicular and parallel lines _(sequence)_

- `Y3-GEO-04.a` Identify horizontal and vertical lines
- `Y3-GEO-04.b` Identify perpendicular and parallel lines

**Y3-STA-01** Interpret and present data using bar charts, pictograms and tables _(separate)_

- `Y3-STA-01.a` Interpret and present bar charts
- `Y3-STA-01.b` Interpret and present pictograms
- `Y3-STA-01.c` Interpret and present tables

**Y3-STA-02** Solve one-step and two-step questions such as 'how many more?' and 'how many fewer?' using bar charts, pictograms and tables _(sequence)_

- `Y3-STA-02.a` Answer one-step questions from charts and tables
- `Y3-STA-02.b` Answer two-step questions from charts and tables

### Year 4

**Y4-NPV-01** Count in multiples of 6, 7, 9, 25 and 1000 _(separate)_

- `Y4-NPV-01.a` Count in multiples of 6, 7 and 9
- `Y4-NPV-01.b` Count in multiples of 25
- `Y4-NPV-01.c` Count in multiples of 1000

**Y4-NPV-07** Round any number to the nearest 10, 100 or 1000 _(sequence)_

- `Y4-NPV-07.a` Round to the nearest 10
- `Y4-NPV-07.b` Round to the nearest 100
- `Y4-NPV-07.c` Round to the nearest 1000

**Y4-AS-01** Add and subtract numbers with up to 4 digits using formal written columnar methods _(sequence)_

- `Y4-AS-01.a` Add numbers with up to 4 digits using column addition
- `Y4-AS-01.b` Subtract numbers with up to 4 digits using column subtraction

**Y4-MD-01** Recall multiplication and division facts for multiplication tables up to 12 × 12 (assessed by the MTC) _(separate)_

- `Y4-MD-01.a` Recall the 6 and 9 times tables
- `Y4-MD-01.b` Recall the 7 times table
- `Y4-MD-01.c` Recall the 11 and 12 times tables
- `Y4-MD-01.d` Recall division facts for tables up to 12 × 12

**Y4-MD-02** Use place value, known and derived facts to multiply and divide mentally, including multiplying by 0 and 1, dividing by 1, and multiplying three numbers together _(separate)_

- `Y4-MD-02.a` Multiply by 0 and 1 and divide by 1
- `Y4-MD-02.b` Multiply three numbers together
- `Y4-MD-02.c` Multiply and divide mentally using derived facts, e.g. 60 × 3

**Y4-MD-04** Multiply two-digit and three-digit numbers by a one-digit number using formal written layout _(sequence)_

- `Y4-MD-04.a` Multiply a two-digit number by a one-digit number using the formal written layout
- `Y4-MD-04.b` Multiply a three-digit number by a one-digit number using the formal written layout

**Y4-MD-05** Solve problems involving multiplying and adding, including the distributive law and harder correspondence problems _(separate)_

- `Y4-MD-05.a` Use the distributive law to multiply
- `Y4-MD-05.b` Solve harder correspondence problems

**Y4-FR-02** Count up and down in hundredths; recognise that hundredths arise when dividing an object by 100 and tenths by 10 _(sequence)_

- `Y4-FR-02.a` Count up and down in hundredths
- `Y4-FR-02.b` Recognise hundredths from dividing by 100 and tenths by 10

**Y4-FR-03** Solve problems to calculate quantities, and fractions to divide quantities, including non-unit fractions where the answer is a whole number _(sequence)_

- `Y4-FR-03.a` Find unit fractions of amounts
- `Y4-FR-03.b` Find non-unit fractions of amounts with whole-number answers

**Y4-FR-05** Recognise and write decimal equivalents of any number of tenths or hundredths _(sequence)_

- `Y4-FR-05.a` Write tenths as decimals
- `Y4-FR-05.b` Write hundredths as decimals

**Y4-FR-07** Find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value of the digits in the answer as ones, tenths and hundredths _(sequence)_

- `Y4-FR-07.a` Divide a one- or two-digit number by 10
- `Y4-FR-07.b` Divide a one- or two-digit number by 100

**Y4-MEA-01** Convert between different units of measure, e.g. km to m, hour to minute _(separate)_

- `Y4-MEA-01.a` Convert between units of length
- `Y4-MEA-01.b` Convert between units of mass and capacity
- `Y4-MEA-01.c` Convert between units of time

**Y4-MEA-05** Read, write and convert time between analogue and digital 12- and 24-hour clocks _(sequence)_

- `Y4-MEA-05.a` Convert between analogue and 12-hour digital times
- `Y4-MEA-05.b` Convert between 12-hour and 24-hour times

**Y4-MEA-06** Solve problems converting hours to minutes, minutes to seconds, years to months, weeks to days _(separate)_

- `Y4-MEA-06.a` Convert hours to minutes and minutes to seconds
- `Y4-MEA-06.b` Convert years to months and weeks to days

**Y4-GEO-01** Compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes _(separate)_

- `Y4-GEO-01.a` Classify triangles by their properties
- `Y4-GEO-01.b` Classify quadrilaterals by their properties

**Y4-GEO-02** Identify acute and obtuse angles and compare and order angles up to two right angles by size _(sequence)_

- `Y4-GEO-02.a` Identify acute and obtuse angles
- `Y4-GEO-02.b` Compare and order angles up to two right angles

**Y4-STA-01** Interpret and present discrete and continuous data using appropriate graphical methods, including bar charts and time graphs _(separate)_

- `Y4-STA-01.a` Interpret and present bar charts for discrete data
- `Y4-STA-01.b` Interpret and present time graphs for continuous data

### Year 5

**Y5-NPV-01** Read, write, order and compare numbers to at least 1 000 000 and determine the value of each digit _(sequence)_

- `Y5-NPV-01.a` Read and write numbers to 1 000 000
- `Y5-NPV-01.b` Find the value of each digit in numbers to 1 000 000
- `Y5-NPV-01.c` Order and compare numbers to 1 000 000

**Y5-NPV-03** Interpret negative numbers in context; count through zero with positive and negative whole numbers _(sequence)_

- `Y5-NPV-03.a` Interpret negative numbers in context
- `Y5-NPV-03.b` Count forwards and backwards through zero

**Y5-NPV-04** Round any number up to 1 000 000 to the nearest 10, 100, 1000, 10 000 and 100 000 _(sequence)_

- `Y5-NPV-04.a` Round to the nearest 10, 100 and 1000
- `Y5-NPV-04.b` Round to the nearest 10 000 and 100 000

**Y5-AS-01** Add and subtract whole numbers with more than 4 digits, including formal written methods _(sequence)_

- `Y5-AS-01.a` Add whole numbers with more than 4 digits using column addition
- `Y5-AS-01.b` Subtract whole numbers with more than 4 digits using column subtraction

**Y5-MD-01** Identify multiples and factors, including all factor pairs and common factors of two numbers _(sequence)_

- `Y5-MD-01.a` Identify multiples
- `Y5-MD-01.b` Find all factor pairs of a number
- `Y5-MD-01.c` Find common factors of two numbers

**Y5-MD-02** Know and use prime numbers, prime factors and composite numbers _(sequence)_

- `Y5-MD-02.a` Identify prime and composite numbers
- `Y5-MD-02.b` Find the prime factors of a number

**Y5-MD-04** Multiply numbers up to 4 digits by a one- or two-digit number using a formal written method, including long multiplication for 2-digit numbers _(sequence)_

- `Y5-MD-04.a` Multiply up to 4 digits by a one-digit number
- `Y5-MD-04.b` Multiply by a two-digit number using long multiplication

**Y5-MD-06** Divide numbers up to 4 digits by a one-digit number using short division and interpret remainders in context _(sequence)_

- `Y5-MD-06.a` Divide up to 4 digits by a one-digit number using short division
- `Y5-MD-06.b` Interpret remainders in context

**Y5-MD-07** Multiply and divide whole numbers and decimals by 10, 100 and 1000 _(sequence)_

- `Y5-MD-07.a` Multiply and divide whole numbers by 10, 100 and 1000
- `Y5-MD-07.b` Multiply and divide decimals by 10, 100 and 1000

**Y5-MD-08** Recognise and use square numbers and cube numbers, and the notation ² and ³ _(separate)_

- `Y5-MD-08.a` Recognise and use square numbers and ²
- `Y5-MD-08.b` Recognise and use cube numbers and ³

**Y5-FR-02** Identify, name and write equivalent fractions of a given fraction, including tenths and hundredths _(sequence)_

- `Y5-FR-02.a` Find equivalent fractions
- `Y5-FR-02.b` Find equivalent fractions in tenths and hundredths

**Y5-FR-03** Recognise mixed numbers and improper fractions, convert between them, and write sums greater than 1 as a mixed number _(sequence)_

- `Y5-FR-03.a` Convert improper fractions to mixed numbers
- `Y5-FR-03.b` Convert mixed numbers to improper fractions
- `Y5-FR-03.c` Write sums greater than 1 as a mixed number

**Y5-FR-04** Add and subtract fractions with the same denominator and denominators that are multiples of the same number _(sequence)_

- `Y5-FR-04.a` Add and subtract fractions with the same denominator
- `Y5-FR-04.b` Add and subtract fractions where one denominator is a multiple of the other

**Y5-FR-05** Multiply proper fractions and mixed numbers by whole numbers, supported by materials and diagrams _(sequence)_

- `Y5-FR-05.a` Multiply proper fractions by whole numbers
- `Y5-FR-05.b` Multiply mixed numbers by whole numbers

**Y5-FR-08** Round decimals with two decimal places to the nearest whole number and to one decimal place _(separate)_

- `Y5-FR-08.a` Round decimals with two places to the nearest whole number
- `Y5-FR-08.b` Round decimals with two places to one decimal place

**Y5-FR-09** Read, write, order and compare numbers with up to three decimal places _(sequence)_

- `Y5-FR-09.a` Read and write numbers with up to three decimal places
- `Y5-FR-09.b` Order and compare numbers with up to three decimal places

**Y5-FR-11** Recognise the per cent symbol, understand that per cent relates to 'number of parts per hundred', and write percentages as a fraction with denominator 100 and as a decimal _(sequence)_

- `Y5-FR-11.a` Understand per cent as parts per hundred
- `Y5-FR-11.b` Write percentages as fractions with denominator 100
- `Y5-FR-11.c` Write percentages as decimals

**Y5-MEA-01** Convert between different units of metric measure, e.g. km/m, cm/m, cm/mm, g/kg, l/ml _(separate)_

- `Y5-MEA-01.a` Convert between km, m, cm and mm
- `Y5-MEA-01.b` Convert between kg and g
- `Y5-MEA-01.c` Convert between l and ml

**Y5-MEA-04** Calculate and compare the area of rectangles (including squares) using cm² and m², and estimate the area of irregular shapes _(sequence)_

- `Y5-MEA-04.a` Calculate the area of rectangles and squares
- `Y5-MEA-04.b` Compare areas in cm² and m²
- `Y5-MEA-04.c` Estimate the area of irregular shapes

**Y5-MEA-05** Estimate volume (e.g. using 1 cm³ blocks to build cuboids) and capacity _(separate)_

- `Y5-MEA-05.a` Estimate volume using 1 cm³ blocks
- `Y5-MEA-05.b` Estimate capacity

**Y5-GEO-02** Know angles are measured in degrees; estimate and compare acute, obtuse and reflex angles _(sequence)_

- `Y5-GEO-02.a` Know angles are measured in degrees and estimate them
- `Y5-GEO-02.b` Identify acute, obtuse and reflex angles

**Y5-GEO-03** Draw given angles, and measure them in degrees _(sequence)_

- `Y5-GEO-03.a` Measure angles in degrees with a protractor
- `Y5-GEO-03.b` Draw angles with a protractor

**Y5-GEO-04** Identify angles at a point and one whole turn (360°), angles at a point on a straight line and ½ a turn (180°), and other multiples of 90° _(separate)_

- `Y5-GEO-04.a` Use angles on a straight line (180°)
- `Y5-GEO-04.b` Use angles at a point (360°)
- `Y5-GEO-04.c` Recognise multiples of 90°

**Y5-GEO-05** Use the properties of rectangles to deduce related facts and find missing lengths and angles _(separate)_

- `Y5-GEO-05.a` Find missing lengths in rectangles
- `Y5-GEO-05.b` Find missing angles in rectangles

**Y5-POS-01** Identify, describe and represent the position of a shape following a reflection or translation, using appropriate language, and know that the shape has not changed _(separate)_

- `Y5-POS-01.a` Describe the position of a shape after a reflection
- `Y5-POS-01.b` Describe the position of a shape after a translation

**Y5-STA-02** Complete, read and interpret information in tables, including timetables _(sequence)_

- `Y5-STA-02.a` Complete, read and interpret tables
- `Y5-STA-02.b` Read and interpret timetables

### Year 6

**Y6-NPV-01** Read, write, order and compare numbers up to 10 000 000 and determine the value of each digit _(sequence)_

- `Y6-NPV-01.a` Read and write numbers to 10 000 000
- `Y6-NPV-01.b` Find the value of each digit in numbers to 10 000 000
- `Y6-NPV-01.c` Order and compare numbers to 10 000 000

**Y6-NPV-03** Use negative numbers in context, and calculate intervals across zero _(sequence)_

- `Y6-NPV-03.a` Use negative numbers in context
- `Y6-NPV-03.b` Calculate intervals across zero

**Y6-MD-02** Divide numbers up to 4 digits by a two-digit whole number using long division, interpreting remainders as whole numbers, fractions or by rounding _(sequence)_

- `Y6-MD-02.a` Divide using long division with whole-number remainders
- `Y6-MD-02.b` Interpret remainders as fractions or decimals
- `Y6-MD-02.c` Round remainders up or down in context

**Y6-MD-05** Identify common factors, common multiples and prime numbers _(separate)_

- `Y6-MD-05.a` Identify common factors
- `Y6-MD-05.b` Identify common multiples
- `Y6-MD-05.c` Identify prime numbers

**Y6-FR-01** Use common factors to simplify fractions; use common multiples to express fractions in the same denomination _(separate)_

- `Y6-FR-01.a` Simplify fractions using common factors
- `Y6-FR-01.b` Write fractions with a common denominator using common multiples

**Y6-FR-03** Add and subtract fractions with different denominators and mixed numbers _(sequence)_

- `Y6-FR-03.a` Add and subtract fractions with different denominators
- `Y6-FR-03.b` Add and subtract mixed numbers

**Y6-FR-06** Associate a fraction with division and calculate decimal fraction equivalents, e.g. 0.375 for ⅜ _(sequence)_

- `Y6-FR-06.a` Understand a fraction as a division
- `Y6-FR-06.b` Convert fractions to decimals, e.g. ⅜ = 0.375

**Y6-FR-07** Identify the value of each digit in numbers given to three decimal places and multiply and divide by 10, 100 and 1000 giving answers up to three decimal places _(sequence)_

- `Y6-FR-07.a` Find the value of each digit in numbers with three decimal places
- `Y6-FR-07.b` Multiply and divide by 10, 100 and 1000 giving up to three decimal places

**Y6-RAT-02** Solve problems involving the calculation of percentages (e.g. of measures, 15% of 360) and the use of percentages for comparison _(sequence)_

- `Y6-RAT-02.a` Calculate percentages of amounts and measures
- `Y6-RAT-02.b` Use percentages to compare

**Y6-MEA-02** Use, read, write and convert between standard units of length, mass, volume and time, from smaller to larger and vice versa _(separate)_

- `Y6-MEA-02.a` Convert between units of length and mass
- `Y6-MEA-02.b` Convert between units of volume and capacity
- `Y6-MEA-02.c` Convert between units of time

**Y6-MEA-06** Calculate the area of parallelograms and triangles _(separate)_

- `Y6-MEA-06.a` Calculate the area of parallelograms
- `Y6-MEA-06.b` Calculate the area of triangles

**Y6-MEA-07** Calculate, estimate and compare volume of cubes and cuboids using standard units, including cm³, m³, km³, mm³ _(sequence)_

- `Y6-MEA-07.a` Calculate the volume of cubes and cuboids
- `Y6-MEA-07.b` Use cm³, m³, km³ and mm³ to estimate and compare volumes

**Y6-GEO-03** Compare and classify geometric shapes based on their properties and sizes; find unknown angles in triangles, quadrilaterals and regular polygons _(sequence)_

- `Y6-GEO-03.a` Classify shapes by their properties
- `Y6-GEO-03.b` Find unknown angles in triangles
- `Y6-GEO-03.c` Find unknown angles in quadrilaterals
- `Y6-GEO-03.d` Find unknown angles in regular polygons

**Y6-GEO-04** Illustrate and name parts of circles, including radius, diameter and circumference, and know the diameter is twice the radius _(sequence)_

- `Y6-GEO-04.a` Name the parts of a circle
- `Y6-GEO-04.b` Know the diameter is twice the radius

**Y6-GEO-05** Recognise angles where they meet at a point, are on a straight line, or are vertically opposite, and find missing angles _(separate)_

- `Y6-GEO-05.a` Find missing angles at a point
- `Y6-GEO-05.b` Find missing angles on a straight line
- `Y6-GEO-05.c` Find vertically opposite angles

**Y6-POS-02** Draw and translate simple shapes on the coordinate plane, and reflect them in the axes _(separate)_

- `Y6-POS-02.a` Translate shapes on the coordinate plane
- `Y6-POS-02.b` Reflect shapes in the axes

**Y6-STA-01** Interpret and construct pie charts and line graphs and use these to solve problems _(separate)_

- `Y6-STA-01.a` Interpret and construct pie charts
- `Y6-STA-01.b` Interpret and construct line graphs

### Year 7

**Y7-NPV-02** Order positive and negative integers, decimals and fractions; use the number line; use =, ≠, <, >, ≤, ≥ _(sequence)_

- `Y7-NPV-02.a` Order positive and negative integers
- `Y7-NPV-02.b` Order decimals and fractions, including negatives
- `Y7-NPV-02.c` Use =, ≠, <, >, ≤ and ≥

**Y7-NPV-03** Use the four operations, including formal written methods, with integers, decimals, proper and improper fractions, and mixed numbers, all both positive and negative _(separate)_

- `Y7-NPV-03.a` Calculate with positive and negative integers
- `Y7-NPV-03.b` Calculate with decimals
- `Y7-NPV-03.c` Calculate with proper and improper fractions
- `Y7-NPV-03.d` Calculate with mixed numbers

**Y7-NPV-04** Use the concepts and vocabulary of prime numbers, factors, multiples, common factors, common multiples, HCF, LCM and prime factorisation, including product notation and the unique factorisation property _(sequence)_

- `Y7-NPV-04.a` Use primes, factors and multiples
- `Y7-NPV-04.b` Write a number as a product of prime factors
- `Y7-NPV-04.c` Find the HCF
- `Y7-NPV-04.d` Find the LCM

**Y7-NPV-05** Use conventional notation for priority of operations, including brackets, powers, roots and reciprocals _(sequence)_

- `Y7-NPV-05.a` Use priority of operations with brackets
- `Y7-NPV-05.b` Include powers and roots in the order of operations
- `Y7-NPV-05.c` Use reciprocals

**Y7-NPV-07** Use integer powers and associated real roots (square, cube and higher); recognise powers of 2, 3, 4, 5; distinguish exact representations of roots from decimal approximations _(sequence)_

- `Y7-NPV-07.a` Use squares and square roots
- `Y7-NPV-07.b` Use cubes and cube roots
- `Y7-NPV-07.c` Recognise powers of 2, 3, 4 and 5 and higher roots
- `Y7-NPV-07.d` Distinguish exact roots from decimal approximations

**Y7-NPV-08** Round numbers and measures to an appropriate degree of accuracy, e.g. decimal places or significant figures _(sequence)_

- `Y7-NPV-08.a` Round to a given number of decimal places
- `Y7-NPV-08.b` Round to a given number of significant figures

**Y7-NPV-09** Use approximation through rounding to estimate answers and calculate possible resulting errors expressed using inequality notation a < x ≤ b _(sequence)_

- `Y7-NPV-09.a` Estimate answers by rounding
- `Y7-NPV-09.b` Write error intervals using inequality notation

**Y7-ALG-01** Use and interpret algebraic notation: ab, 3y, a², a³, a²b, a/b, coefficients written as fractions, brackets _(sequence)_

- `Y7-ALG-01.a` Use notation for products, e.g. ab and 3y
- `Y7-ALG-01.b` Use notation for powers, e.g. a² and a²b
- `Y7-ALG-01.c` Use notation for fractions and brackets

**Y7-ALG-02** Substitute numerical values into formulae and expressions, including scientific formulae _(sequence)_

- `Y7-ALG-02.a` Substitute values into expressions
- `Y7-ALG-02.b` Substitute values into formulae, including scientific formulae

**Y7-ALG-04** Simplify and manipulate algebraic expressions by collecting like terms and multiplying a single term over a bracket _(sequence)_

- `Y7-ALG-04.a` Collect like terms
- `Y7-ALG-04.b` Multiply a single term over a bracket

**Y7-ALG-05** Generate terms of a sequence from a term-to-term or position-to-term rule _(separate)_

- `Y7-ALG-05.a` Generate terms from a term-to-term rule
- `Y7-ALG-05.b` Generate terms from a position-to-term rule

**Y7-ALG-06** Solve simple linear equations in one unknown algebraically _(sequence)_

- `Y7-ALG-06.a` Solve one-step linear equations
- `Y7-ALG-06.b` Solve two-step linear equations

**Y7-RAT-01** Change freely between related standard units (time, length, area, volume/capacity, mass) _(separate)_

- `Y7-RAT-01.a` Convert units of length, mass and capacity
- `Y7-RAT-01.b` Convert units of area and volume
- `Y7-RAT-01.c` Convert units of time

**Y7-RAT-03** Divide a given quantity into two parts in a given part:part or part:whole ratio; express the division of a quantity into two parts as a ratio _(sequence)_

- `Y7-RAT-03.a` Divide a quantity in a part:part ratio
- `Y7-RAT-03.b` Divide a quantity in a part:whole ratio
- `Y7-RAT-03.c` Express a division as a ratio

**Y7-RAT-04** Express one quantity as a fraction of another, where the fraction is less than 1 or greater than 1 _(sequence)_

- `Y7-RAT-04.a` Express one quantity as a fraction of another, less than 1
- `Y7-RAT-04.b` Express one quantity as a fraction of another, greater than 1

**Y7-RAT-05** Define percentage as 'number of parts per hundred'; interpret percentages and percentage changes as a fraction or a decimal _(sequence)_

- `Y7-RAT-05.a` Write percentages as fractions and decimals
- `Y7-RAT-05.b` Interpret percentage changes as fractions or decimals

**Y7-GEO-01** Derive and apply formulae to calculate and solve problems involving perimeter and area of triangles, parallelograms and trapezia _(separate)_

- `Y7-GEO-01.a` Find the perimeter of triangles, parallelograms and trapezia
- `Y7-GEO-01.b` Find the area of triangles
- `Y7-GEO-01.c` Find the area of parallelograms
- `Y7-GEO-01.d` Find the area of trapezia

**Y7-GEO-02** Calculate and solve problems involving volume of cuboids (including cubes) and other prisms _(sequence)_

- `Y7-GEO-02.a` Find the volume of cuboids and cubes
- `Y7-GEO-02.b` Find the volume of other prisms

**Y7-GEO-03** Draw and measure line segments and angles in geometric figures, including interpreting scale drawings _(sequence)_

- `Y7-GEO-03.a` Measure line segments and angles
- `Y7-GEO-03.b` Interpret scale drawings

**Y7-GEO-04** Describe, sketch and draw using conventional terms and notation: points, lines, parallel lines, perpendicular lines, right angles, regular polygons, and other polygons that are reflectively and rotationally symmetric _(separate)_

- `Y7-GEO-04.a` Use conventional terms and notation for lines and angles
- `Y7-GEO-04.b` Recognise reflective and rotational symmetry in polygons

**Y7-GEO-05** Apply the properties of angles at a point, on a straight line, and vertically opposite angles _(separate)_

- `Y7-GEO-05.a` Use angles at a point
- `Y7-GEO-05.b` Use angles on a straight line
- `Y7-GEO-05.c` Use vertically opposite angles

**Y7-GEO-06** Derive and use the sum of angles in a triangle; use it to deduce the angle sum in any polygon and derive properties of regular polygons _(sequence)_

- `Y7-GEO-06.a` Use the angle sum of a triangle
- `Y7-GEO-06.b` Find the angle sum of any polygon
- `Y7-GEO-06.c` Find interior and exterior angles of regular polygons

**Y7-STA-01** Describe, interpret and compare observed distributions of a single variable through appropriate graphs and measures of central tendency (mean, mode, median) and spread (range) _(sequence)_

- `Y7-STA-01.a` Find the mean
- `Y7-STA-01.b` Find the median and mode
- `Y7-STA-01.c` Find the range
- `Y7-STA-01.d` Compare distributions using averages and range

**Y7-PRO-01** Record, describe and analyse the frequency of outcomes of simple probability experiments involving randomness, fairness, equally and unequally likely outcomes, using appropriate language and the 0 to 1 probability scale _(sequence)_

- `Y7-PRO-01.a` Use the language of probability and the 0 to 1 scale
- `Y7-PRO-01.b` Record and analyse the outcomes of probability experiments

### Year 8

**Y8-NPV-01** Interpret and compare numbers in standard form A × 10ⁿ, 1 ≤ A < 10, where n is a positive or negative integer or zero _(sequence)_

- `Y8-NPV-01.a` Write numbers in standard form
- `Y8-NPV-01.b` Compare and order numbers in standard form

**Y8-ALG-01** Simplify and manipulate algebraic expressions to maintain equivalence by expanding products of two or more binomials _(sequence)_

- `Y8-ALG-01.a` Expand the product of two binomials with positive terms
- `Y8-ALG-01.b` Expand the product of two binomials with negative terms and coefficients

**Y8-ALG-02** Understand and use standard mathematical formulae; rearrange formulae to change the subject _(sequence)_

- `Y8-ALG-02.a` Use standard mathematical formulae
- `Y8-ALG-02.b` Rearrange formulae to change the subject

**Y8-ALG-04** Use algebraic methods to solve linear equations in one variable, including all forms that require rearrangement _(sequence)_

- `Y8-ALG-04.a` Solve linear equations with the unknown on both sides
- `Y8-ALG-04.b` Solve linear equations with brackets
- `Y8-ALG-04.c` Solve linear equations with fractions

**Y8-ALG-06** Recognise, sketch and produce graphs of linear functions of one variable with appropriate scaling, using equations in x and y and the Cartesian plane _(sequence)_

- `Y8-ALG-06.a` Plot graphs of linear functions from a table of values
- `Y8-ALG-06.b` Recognise and sketch linear graphs from their equations

**Y8-ALG-08** Use linear graphs to estimate values of y for given x and vice versa, and find approximate solutions of simultaneous linear equations _(sequence)_

- `Y8-ALG-08.a` Read values from linear graphs
- `Y8-ALG-08.b` Find approximate solutions of simultaneous linear equations from graphs

**Y8-RAT-03** Compare two quantities using percentages, and solve problems involving percentage change, including percentage increase, decrease, original value problems and simple interest in financial mathematics _(sequence)_

- `Y8-RAT-03.a` Express one quantity as a percentage of another
- `Y8-RAT-03.b` Find percentage increases and decreases
- `Y8-RAT-03.c` Find an original value (reverse percentages)
- `Y8-RAT-03.d` Calculate simple interest

**Y8-RAT-04** Solve problems involving direct proportion, including graphical and algebraic representations _(sequence)_

- `Y8-RAT-04.a` Solve direct proportion problems numerically
- `Y8-RAT-04.b` Represent direct proportion with graphs and equations

**Y8-RAT-05** Use compound units such as speed, unit pricing and density to solve problems _(separate)_

- `Y8-RAT-05.a` Solve problems with speed
- `Y8-RAT-05.b` Solve problems with unit pricing
- `Y8-RAT-05.c` Solve problems with density

**Y8-GEO-01** Calculate and solve problems involving perimeters of 2D shapes (including circles), areas of circles and composite shapes _(sequence)_

- `Y8-GEO-01.a` Find the circumference of a circle
- `Y8-GEO-01.b` Find the area of a circle
- `Y8-GEO-01.c` Find perimeters and areas of composite shapes

**Y8-GEO-02** Use the standard conventions for labelling the sides and angles of triangle ABC, and know and use the criteria for congruence of triangles _(sequence)_

- `Y8-GEO-02.a` Use the conventions for labelling triangles
- `Y8-GEO-02.b` Use the criteria for congruent triangles

**Y8-GEO-04** Use the standard ruler and compass constructions (perpendicular bisector of a line segment, a perpendicular to a given line from/at a given point, bisecting a given angle); recognise and use the perpendicular distance from a point to a line as the shortest distance _(separate)_

- `Y8-GEO-04.a` Construct the perpendicular bisector of a line segment
- `Y8-GEO-04.b` Construct a perpendicular from or at a point
- `Y8-GEO-04.c` Bisect an angle
- `Y8-GEO-04.d` Use the perpendicular distance as the shortest distance from a point to a line

**Y8-GEO-05** Understand and use the relationship between parallel lines and alternate and corresponding angles _(separate)_

- `Y8-GEO-05.a` Use alternate angles
- `Y8-GEO-05.b` Use corresponding angles

**Y8-POS-01** Identify properties of, and describe the results of, translations, rotations and reflections applied to given figures _(separate)_

- `Y8-POS-01.a` Describe translations
- `Y8-POS-01.b` Describe rotations
- `Y8-POS-01.c` Describe reflections

**Y8-STA-01** Construct and interpret appropriate tables, charts and diagrams, including frequency tables, bar charts, pie charts and pictograms for categorical data, and vertical line (or bar) charts for ungrouped and grouped numerical data _(separate)_

- `Y8-STA-01.a` Construct and interpret frequency tables and bar charts
- `Y8-STA-01.b` Construct and interpret pie charts and pictograms
- `Y8-STA-01.c` Construct and interpret vertical line charts for numerical data

**Y8-STA-02** Describe simple mathematical relationships between two variables (bivariate data) in observational and experimental contexts and illustrate using scatter graphs _(sequence)_

- `Y8-STA-02.a` Plot scatter graphs
- `Y8-STA-02.b` Describe the relationship shown by a scatter graph

### Year 9

**Y9-NPV-01** Use the four operations with numbers in standard form _(separate)_

- `Y9-NPV-01.a` Multiply and divide numbers in standard form
- `Y9-NPV-01.b` Add and subtract numbers in standard form

**Y9-ALG-01** Simplify and manipulate algebraic expressions by factorising quadratic expressions of the form x² + bx + c _(sequence)_

- `Y9-ALG-01.a` Factorise x² + bx + c with positive b and c
- `Y9-ALG-01.b` Factorise x² + bx + c with negative b or c

**Y9-ALG-02** Simplify expressions involving sums, products and powers, including the laws of indices _(sequence)_

- `Y9-ALG-02.a` Multiply and divide powers of the same base
- `Y9-ALG-02.b` Raise a power to a power
- `Y9-ALG-02.c` Simplify products and quotients using the laws of indices

**Y9-ALG-04** Find the gradient and intercept of a straight line; identify parallel lines _(sequence)_

- `Y9-ALG-04.a` Find the gradient of a straight line
- `Y9-ALG-04.b` Find the intercept of a straight line
- `Y9-ALG-04.c` Identify parallel lines

**Y9-ALG-05** Reduce a given linear equation in two variables to the standard form y = mx + c; calculate and interpret gradients and intercepts graphically and algebraically _(sequence)_

- `Y9-ALG-05.a` Rearrange a linear equation to y = mx + c
- `Y9-ALG-05.b` Interpret gradients and intercepts graphically and algebraically

**Y9-ALG-06** Use algebraic methods to solve simultaneous linear equations in two variables _(separate)_

- `Y9-ALG-06.a` Solve simultaneous linear equations by elimination
- `Y9-ALG-06.b` Solve simultaneous linear equations by substitution

**Y9-ALG-07** Use linear and quadratic graphs to estimate values of y for given x and vice versa, and find approximate solutions _(sequence)_

- `Y9-ALG-07.a` Use linear graphs to estimate values
- `Y9-ALG-07.b` Use quadratic graphs to find approximate solutions

**Y9-ALG-08** Recognise geometric sequences and appreciate other sequences that arise, e.g. Fibonacci, square and triangular numbers _(separate)_

- `Y9-ALG-08.a` Recognise and continue geometric sequences
- `Y9-ALG-08.b` Recognise Fibonacci, square and triangular numbers

**Y9-RAT-03** Solve problems involving percentage change with repeated percentages (compound interest, depreciation) _(separate)_

- `Y9-RAT-03.a` Calculate compound interest
- `Y9-RAT-03.b` Calculate depreciation

**Y9-GEO-01** Use Pythagoras' theorem and trigonometric ratios (sin, cos, tan) in similar triangles to solve problems involving right-angled triangles _(sequence)_

- `Y9-GEO-01.a` Use Pythagoras' theorem
- `Y9-GEO-01.b` Use trigonometry to find a missing side
- `Y9-GEO-01.c` Use trigonometry to find a missing angle

**Y9-GEO-02** Use the properties of faces, surfaces, edges and vertices to calculate surface area of prisms and volume of cylinders _(separate)_

- `Y9-GEO-02.a` Calculate the surface area of prisms
- `Y9-GEO-02.b` Calculate the volume of cylinders

**Y9-PRO-01** Enumerate sets and unions/intersections of sets systematically, using tables, grids and Venn diagrams _(separate)_

- `Y9-PRO-01.a` Enumerate sets using tables and grids
- `Y9-PRO-01.b` Enumerate sets using Venn diagrams

**Y9-PRO-02** Generate theoretical sample spaces for single and combined events with equally likely, mutually exclusive outcomes and use these to calculate theoretical probabilities _(sequence)_

- `Y9-PRO-02.a` Find theoretical probabilities for single events
- `Y9-PRO-02.b` Find theoretical probabilities for combined events using sample spaces

### GCSE Foundation

**GF-N1** Order positive and negative integers, decimals and fractions; use =, ≠, <, >, ≤, ≥ _(sequence)_

- `GF-N1.a` Order positive and negative integers, decimals and fractions
- `GF-N1.b` Use =, ≠, <, >, ≤ and ≥

**GF-N2** Apply the four operations, including formal written methods, to integers, decimals, simple fractions and mixed numbers, positive and negative; use place value with very large or small numbers _(separate)_

- `GF-N2.a` Calculate with negative numbers
- `GF-N2.b` Calculate with decimals
- `GF-N2.c` Calculate with fractions and mixed numbers
- `GF-N2.d` Use place value with very large and very small numbers

**GF-N3** Use inverse operations and cancellation; use conventional priority of operations including brackets, powers, roots and reciprocals _(separate)_

- `GF-N3.a` Use inverse operations
- `GF-N3.b` Use priority of operations including brackets, powers, roots and reciprocals

**GF-N4** Use primes, factors, multiples, HCF, LCM and prime factorisation, including product notation and the unique factorisation theorem _(sequence)_

- `GF-N4.a` Use primes, factors and multiples
- `GF-N4.b` Write a number as a product of prime factors
- `GF-N4.c` Find the HCF and LCM

**GF-N6** Use positive integer powers and real roots; recognise powers of 2, 3, 4 and 5 _(separate)_

- `GF-N6.a` Use positive integer powers
- `GF-N6.b` Use square and cube roots
- `GF-N6.c` Recognise powers of 2, 3, 4 and 5

**GF-N7** Calculate with roots and integer indices _(sequence)_

- `GF-N7.a` Calculate with roots
- `GF-N7.b` Calculate with integer indices, including zero and negative indices

**GF-N8** Calculate exactly with fractions and multiples of π _(separate)_

- `GF-N8.a` Calculate exactly with fractions
- `GF-N8.b` Calculate exactly with multiples of π

**GF-N9** Calculate with and interpret standard form A × 10ⁿ _(sequence)_

- `GF-N9.a` Write numbers in standard form
- `GF-N9.b` Calculate with numbers in standard form

**GF-N12** Interpret fractions and percentages as operators _(separate)_

- `GF-N12.a` Use fractions as operators
- `GF-N12.b` Use percentages as operators and multipliers

**GF-N13** Use standard units of mass, length, time, money and other measures, including compound measures, using decimals _(sequence)_

- `GF-N13.a` Use standard units of measure
- `GF-N13.b` Use compound measures

**GF-N15** Round to decimal places or significant figures; use inequality notation for error intervals due to truncation or rounding _(sequence)_

- `GF-N15.a` Round to decimal places
- `GF-N15.b` Round to significant figures
- `GF-N15.c` Write error intervals for rounding
- `GF-N15.d` Write error intervals for truncation

### GCSE Higher

**GH-N8** Calculate exactly with surds; simplify surds (e.g. √12 = 2√3) and rationalise denominators _(sequence)_

- `GH-N8.a` Simplify surds
- `GH-N8.b` Calculate exactly with surds
- `GH-N8.c` Rationalise denominators

**GH-N10** Change recurring decimals into fractions and vice versa _(separate)_

- `GH-N10.a` Change recurring decimals into fractions
- `GH-N10.b` Change fractions into recurring decimals

### GCSE Foundation

**GF-A2** Substitute values into formulae and expressions, including scientific formulae _(sequence)_

- `GF-A2.a` Substitute values into expressions
- `GF-A2.b` Substitute values into formulae, including scientific formulae

**GF-A4** Collect like terms, expand single brackets, take out common factors, expand two binomials, factorise x² + bx + c including difference of two squares, use index laws _(sequence)_

- `GF-A4.a` Collect like terms
- `GF-A4.b` Expand a single bracket
- `GF-A4.c` Factorise by taking out a common factor
- `GF-A4.d` Expand the product of two binomials
- `GF-A4.e` Factorise x² + bx + c
- `GF-A4.f` Factorise the difference of two squares
- `GF-A4.g` Use the laws of indices in algebra

### GCSE Higher

**GH-A4** Expand three binomials, factorise ax² + bx + c, simplify expressions with surds and algebraic fractions _(separate)_

- `GH-A4.a` Expand the product of three binomials
- `GH-A4.b` Factorise ax² + bx + c
- `GH-A4.c` Simplify algebraic fractions
- `GH-A4.d` Simplify expressions involving surds

### GCSE Foundation

**GF-A5** Use standard formulae and rearrange to change the subject _(sequence)_

- `GF-A5.a` Use standard formulae
- `GF-A5.b` Rearrange formulae to change the subject

**GF-A6** Know the difference between an equation and an identity; show algebraic expressions are equivalent and use algebra to support arguments _(sequence)_

- `GF-A6.a` Tell an equation from an identity
- `GF-A6.b` Show that two expressions are equivalent
- `GF-A6.c` Use algebra to support an argument

**GF-A9** Plot straight-line graphs; use y = mx + c to identify parallel lines; find the equation of a line through two points or through one point with a given gradient _(sequence)_

- `GF-A9.a` Plot straight-line graphs
- `GF-A9.b` Use y = mx + c to identify parallel lines
- `GF-A9.c` Find the equation of a line through one point with a given gradient
- `GF-A9.d` Find the equation of a line through two points

**GF-A10** Identify and interpret gradients and intercepts of linear functions graphically and algebraically _(separate)_

- `GF-A10.a` Identify and interpret gradients
- `GF-A10.b` Identify and interpret intercepts

**GF-A11** Identify roots, intercepts and turning points of quadratics graphically; deduce roots algebraically _(sequence)_

- `GF-A11.a` Identify roots and intercepts of quadratics from a graph
- `GF-A11.b` Identify turning points from a graph
- `GF-A11.c` Deduce roots algebraically

**GF-A12** Recognise, sketch and interpret linear, quadratic, simple cubic and reciprocal (y = 1/x) graphs _(separate)_

- `GF-A12.a` Recognise and sketch linear and quadratic graphs
- `GF-A12.b` Recognise and sketch simple cubic graphs
- `GF-A12.c` Recognise and sketch the reciprocal graph y = 1/x

### GCSE Higher

**GH-A12** Recognise, sketch and interpret exponential graphs y = kˣ and trig graphs y = sin x, cos x, tan x for any angle _(separate)_

- `GH-A12.a` Recognise and sketch exponential graphs y = kˣ
- `GH-A12.b` Recognise and sketch the graphs of sin x, cos x and tan x

### GCSE Foundation

**GF-A14** Plot and interpret graphs, including reciprocal and non-standard graphs in real contexts, e.g. distance, speed and acceleration _(separate)_

- `GF-A14.a` Plot and interpret distance-time graphs
- `GF-A14.b` Plot and interpret other graphs in real contexts

### GCSE Higher

**GH-A15** Estimate gradients of and areas under graphs, including non-linear graphs, and interpret them, e.g. distance-time and velocity-time graphs _(sequence)_

- `GH-A15.a` Estimate gradients of non-linear graphs
- `GH-A15.b` Estimate areas under graphs
- `GH-A15.c` Interpret gradients and areas in context, e.g. velocity-time graphs

**GH-A16** Use the equation of a circle centred at the origin; find the equation of a tangent at a given point _(sequence)_

- `GH-A16.a` Use the equation of a circle centred at the origin
- `GH-A16.b` Find the equation of a tangent to a circle at a given point

### GCSE Foundation

**GF-A17** Solve linear equations, including with the unknown on both sides _(sequence)_

- `GF-A17.a` Solve linear equations with the unknown on one side
- `GF-A17.b` Solve linear equations with the unknown on both sides
- `GF-A17.c` Solve linear equations with brackets

**GF-A18** Solve quadratic equations by factorising; find approximate solutions from a graph _(sequence)_

- `GF-A18.a` Solve quadratic equations by factorising
- `GF-A18.b` Find approximate solutions of quadratics from a graph

### GCSE Higher

**GH-A18** Solve quadratics needing rearrangement, by completing the square and by the quadratic formula _(separate)_

- `GH-A18.a` Solve quadratics by completing the square
- `GH-A18.b` Solve quadratics using the quadratic formula
- `GH-A18.c` Solve quadratics that need rearranging first

### GCSE Foundation

**GF-A19** Solve linear simultaneous equations algebraically and graphically _(separate)_

- `GF-A19.a` Solve simultaneous equations by elimination
- `GF-A19.b` Solve simultaneous equations by substitution
- `GF-A19.c` Solve simultaneous equations graphically

### GCSE Higher

**GH-A22** Solve linear inequalities in two variables and quadratic inequalities; use set notation and graphs _(separate)_

- `GH-A22.a` Solve linear inequalities in two variables and show the region
- `GH-A22.b` Solve quadratic inequalities
- `GH-A22.c` Use set notation for solution sets

### GCSE Foundation

**GF-A23** Generate sequences from term-to-term or position-to-term rules _(separate)_

- `GF-A23.a` Generate a sequence from a term-to-term rule
- `GF-A23.b` Generate a sequence from a position-to-term rule

**GF-A24** Recognise triangular, square, cube, arithmetic, Fibonacci-type, quadratic and simple geometric sequences _(separate)_

- `GF-A24.a` Recognise triangular, square and cube numbers
- `GF-A24.b` Recognise arithmetic and simple geometric sequences
- `GF-A24.c` Recognise Fibonacci-type sequences
- `GF-A24.d` Recognise quadratic sequences

**GF-R5** Divide a quantity in a part:part or part:whole ratio and apply ratio to conversion, comparison, scaling, mixing and concentrations _(sequence)_

- `GF-R5.a` Divide a quantity in a part:part ratio
- `GF-R5.b` Divide a quantity in a part:whole ratio
- `GF-R5.c` Apply ratio to conversion, comparison, scaling, mixing and concentrations

**GF-R9** Work with percentages, including percentage change, percentages over 100%, reverse percentages and simple interest _(separate)_

- `GF-R9.a` Calculate percentage change
- `GF-R9.b` Use percentages over 100%
- `GF-R9.c` Find an original value (reverse percentages)
- `GF-R9.d` Calculate simple interest

**GF-R10** Solve direct and inverse proportion problems, including graphical and algebraic representations _(separate)_

- `GF-R10.a` Solve direct proportion problems
- `GF-R10.b` Solve inverse proportion problems
- `GF-R10.c` Represent proportion graphically and algebraically

**GF-R11** Use compound units: speed, rates of pay, unit pricing, density and pressure _(separate)_

- `GF-R11.a` Use speed, distance and time
- `GF-R11.b` Use rates of pay and unit pricing
- `GF-R11.c` Use density
- `GF-R11.d` Use pressure

**GF-R16** Set up and solve growth and decay problems, including compound interest _(separate)_

- `GF-R16.a` Solve growth problems
- `GF-R16.b` Solve decay problems
- `GF-R16.c` Calculate compound interest

**GF-G2** Use standard ruler and compass constructions to construct figures and solve loci problems _(sequence)_

- `GF-G2.a` Use standard ruler and compass constructions
- `GF-G2.b` Solve loci problems

**GF-G3** Apply angle facts, including parallel lines, triangles and polygons _(separate)_

- `GF-G3.a` Use angle facts with parallel lines
- `GF-G3.b` Use angle facts in triangles
- `GF-G3.c` Use angle facts in polygons

**GF-G4** Derive and apply properties of special quadrilaterals, triangles and other plane figures _(separate)_

- `GF-G4.a` Use the properties of special quadrilaterals
- `GF-G4.b` Use the properties of triangles and other plane figures

**GF-G7** Identify, describe and construct congruent and similar shapes by rotation, reflection, translation and enlargement, including fractional scale factors _(separate)_

- `GF-G7.a` Rotate shapes
- `GF-G7.b` Reflect shapes
- `GF-G7.c` Translate shapes
- `GF-G7.d` Enlarge shapes, including by fractional scale factors

**GF-G13** Construct and interpret plans and elevations of 3D shapes _(separate)_

- `GF-G13.a` Draw and interpret plans
- `GF-G13.b` Draw and interpret elevations

**GF-G15** Measure lines and angles, interpret maps and scale drawings, and use bearings _(separate)_

- `GF-G15.a` Measure lines and angles
- `GF-G15.b` Interpret maps and scale drawings
- `GF-G15.c` Use bearings

**GF-G16** Calculate areas of triangles, parallelograms and trapezia, and volumes of prisms including cylinders _(separate)_

- `GF-G16.a` Find the area of triangles, parallelograms and trapezia
- `GF-G16.b` Find the volume of prisms
- `GF-G16.c` Find the volume of cylinders

**GF-G17** Use circle formulae; find perimeters and areas of composite shapes; find surface area and volume of spheres, pyramids, cones and composite solids _(sequence)_

- `GF-G17.a` Find the circumference and area of a circle
- `GF-G17.b` Find perimeters and areas of composite shapes
- `GF-G17.c` Find the surface area and volume of spheres
- `GF-G17.d` Find the surface area and volume of pyramids and cones

**GF-G18** Calculate arc lengths, angles and areas of sectors _(sequence)_

- `GF-G18.a` Calculate arc lengths
- `GF-G18.b` Calculate the area of a sector
- `GF-G18.c` Find the angle of a sector from its arc or area

**GF-G20** Use Pythagoras and sin, cos, tan to find lengths and angles in right-angled triangles in 2D _(sequence)_

- `GF-G20.a` Use Pythagoras' theorem in 2D
- `GF-G20.b` Use trigonometry to find a length
- `GF-G20.c` Use trigonometry to find an angle

**GF-G21** Know exact values of sin and cos for 0°, 30°, 45°, 60°, 90° and tan for 0°, 30°, 45°, 60° _(separate)_

- `GF-G21.a` Know exact values of sin and cos
- `GF-G21.b` Know exact values of tan

### GCSE Higher

**GH-G20** Use Pythagoras and trigonometry in 3D and in general triangles _(separate)_

- `GH-G20.a` Use Pythagoras in 3D
- `GH-G20.b` Use trigonometry in 3D
- `GH-G20.c` Use trigonometry in general triangles

**GH-G22** Apply the sine rule and cosine rule _(separate)_

- `GH-G22.a` Apply the sine rule
- `GH-G22.b` Apply the cosine rule

### GCSE Foundation

**GF-G25** Add, subtract and scale vectors using diagrams and column vectors _(sequence)_

- `GF-G25.a` Add and subtract vectors
- `GF-G25.b` Multiply a vector by a scalar
- `GF-G25.c` Represent vectors with diagrams and column vectors

**GF-P6** Enumerate sets and combinations systematically using tables, grids, Venn diagrams and tree diagrams _(separate)_

- `GF-P6.a` Enumerate using tables and grids
- `GF-P6.b` Enumerate using Venn diagrams
- `GF-P6.c` Enumerate using tree diagrams

**GF-P8** Calculate probabilities of independent and dependent combined events using tree diagrams _(sequence)_

- `GF-P8.a` Calculate probabilities of independent combined events
- `GF-P8.b` Calculate probabilities of dependent combined events

### GCSE Higher

**GH-P9** Calculate and interpret conditional probabilities using two-way tables, tree diagrams and Venn diagrams _(separate)_

- `GH-P9.a` Find conditional probabilities from two-way tables
- `GH-P9.b` Find conditional probabilities from tree diagrams
- `GH-P9.c` Find conditional probabilities from Venn diagrams

### GCSE Foundation

**GF-S2** Interpret and construct tables, charts and diagrams for categorical, discrete and time series data _(separate)_

- `GF-S2.a` Interpret and construct charts for categorical data
- `GF-S2.b` Interpret and construct charts for discrete data
- `GF-S2.c` Interpret and construct time series graphs

**GF-S3** Construct and interpret diagrams for grouped discrete and continuous data, including histograms with equal class intervals _(sequence)_

- `GF-S3.a` Construct and interpret grouped frequency tables
- `GF-S3.b` Construct and interpret frequency polygons
- `GF-S3.c` Construct and interpret histograms with equal class intervals

### GCSE Higher

**GH-S3** Construct and interpret histograms with unequal class intervals and cumulative frequency graphs _(separate)_

- `GH-S3.a` Construct and interpret histograms with unequal class intervals
- `GH-S3.b` Construct and interpret cumulative frequency graphs

### GCSE Foundation

**GF-S4** Compare distributions using averages (median, mean, mode, modal class) and range, including outliers _(sequence)_

- `GF-S4.a` Find the mean, median and mode
- `GF-S4.b` Estimate the mean and find the modal class from grouped data
- `GF-S4.c` Use the range and identify outliers to compare distributions

### GCSE Higher

**GH-S4** Use box plots, quartiles and interquartile range _(sequence)_

- `GH-S4.a` Find quartiles and the interquartile range
- `GH-S4.b` Draw and interpret box plots

### GCSE Foundation

**GF-S6** Use scatter graphs: correlation (not causation), lines of best fit, interpolation and extrapolation _(sequence)_

- `GF-S6.a` Describe correlation, knowing it is not causation
- `GF-S6.b` Draw lines of best fit, interpolating and extrapolating

### A level Maths

**AL-P2.3** Work with quadratic functions and graphs: discriminant, completing the square, solving quadratics including in a function of the unknown _(separate)_

- `AL-P2.3.a` Use the discriminant
- `AL-P2.3.b` Complete the square
- `AL-P2.3.c` Solve quadratics, including in a function of the unknown

**AL-P2.4** Solve simultaneous equations by elimination and substitution, including one linear and one quadratic _(sequence)_

- `AL-P2.4.a` Solve linear simultaneous equations by elimination and substitution
- `AL-P2.4.b` Solve one linear and one quadratic equation simultaneously

**AL-P2.5** Solve linear and quadratic inequalities; interpret graphically and as regions; use set notation _(sequence)_

- `AL-P2.5.a` Solve linear and quadratic inequalities
- `AL-P2.5.b` Interpret inequalities graphically and as regions, using set notation

**AL-P2.6a** Manipulate polynomials: expand, factorise, divide by a linear expression; use the factor theorem _(sequence)_

- `AL-P2.6a.a` Expand and factorise polynomials
- `AL-P2.6a.b` Divide a polynomial by a linear expression
- `AL-P2.6a.c` Use the factor theorem

**AL-P2.8** Understand functions: domain and range, composite and inverse functions and their graphs _(sequence)_

- `AL-P2.8.a` Find the domain and range of a function
- `AL-P2.8.b` Form composite functions
- `AL-P2.8.c` Find inverse functions and their graphs

**AL-P3.1** Use straight-line equations in all forms; gradient conditions for parallel and perpendicular lines; straight-line models _(separate)_

- `AL-P3.1.a` Use straight-line equations in all forms
- `AL-P3.1.b` Use gradient conditions for parallel and perpendicular lines

**AL-P3.2** Use the circle equation (x − a)² + (y − b)² = r², completing the square and circle properties _(sequence)_

- `AL-P3.2.a` Find the centre and radius of a circle by completing the square
- `AL-P3.2.b` Use circle properties, e.g. tangents and chords

**AL-P4.4** Work with arithmetic sequences and series, including the sum of the first n natural numbers _(sequence)_

- `AL-P4.4.a` Find terms of arithmetic sequences
- `AL-P4.4.b` Sum arithmetic series, including the first n natural numbers

**AL-P4.5** Work with geometric sequences and series, including sum to infinity when |r| < 1 _(sequence)_

- `AL-P4.5.a` Find terms of geometric sequences
- `AL-P4.5.b` Sum geometric series
- `AL-P4.5.c` Find the sum to infinity when |r| < 1

**AL-P5.1a** Use sine, cosine and tangent for all arguments, the sine and cosine rules and area ½ab sin C _(separate)_

- `AL-P5.1a.a` Use sin, cos and tan for all arguments
- `AL-P5.1a.b` Use the sine rule
- `AL-P5.1a.c` Use the cosine rule
- `AL-P5.1a.d` Use area = ½ab sin C

**AL-P5.1b** Use radians, including arc length and sector area _(sequence)_

- `AL-P5.1b.a` Convert between degrees and radians
- `AL-P5.1b.b` Find arc lengths in radians
- `AL-P5.1b.c` Find sector areas in radians

**AL-P5.4** Use sec, cosec, cot, arcsin, arccos and arctan, with graphs, domains and ranges _(separate)_

- `AL-P5.4.a` Use sec, cosec and cot
- `AL-P5.4.b` Use arcsin, arccos and arctan, with their domains and ranges

**AL-P5.6** Use addition and double angle formulae; write a cos θ + b sin θ as R cos(θ ± α) or R sin(θ ± α) _(sequence)_

- `AL-P5.6.a` Use the addition formulae
- `AL-P5.6.b` Use the double angle formulae
- `AL-P5.6.c` Write a cos θ + b sin θ as R cos(θ ± α) or R sin(θ ± α)

**AL-P5.7** Solve trigonometric equations in a given interval, including quadratics in trig functions and multiple angles _(sequence)_

- `AL-P5.7.a` Solve trig equations in a given interval
- `AL-P5.7.b` Solve quadratic equations in trig functions
- `AL-P5.7.c` Solve trig equations with multiple angles

**AL-P7.3** Find tangents, normals, stationary points, maxima and minima, and increasing and decreasing functions _(separate)_

- `AL-P7.3.a` Find tangents and normals
- `AL-P7.3.b` Find and classify stationary points
- `AL-P7.3.c` Find where functions are increasing or decreasing

**AL-P7.4** Use the product, quotient and chain rules, including dy/dx = 1/(dx/dy) _(separate)_

- `AL-P7.4.a` Use the chain rule
- `AL-P7.4.b` Use the product rule
- `AL-P7.4.c` Use the quotient rule

**AL-P7.5** Differentiate functions defined implicitly or parametrically (first derivative) _(separate)_

- `AL-P7.5.a` Differentiate implicitly
- `AL-P7.5.b` Differentiate parametrically

**AL-P8.4** Integrate xⁿ including 1/x, e^(kx), sin kx, cos kx and related functions _(separate)_

- `AL-P8.4.a` Integrate 1/x
- `AL-P8.4.b` Integrate e^(kx)
- `AL-P8.4.c` Integrate sin kx and cos kx

**AL-P8.7** Integrate by substitution and by parts _(separate)_

- `AL-P8.7.a` Integrate by substitution
- `AL-P8.7.b` Integrate by parts

**AL-S1.1** Understand populations, samples and census; use and critique simple random, stratified, systematic, quota and opportunity sampling _(sequence)_

- `AL-S1.1.a` Understand populations, samples and the census
- `AL-S1.1.b` Use and critique sampling methods

**AL-S2.1** Interpret histograms, frequency polygons, box plots and cumulative frequency diagrams _(separate)_

- `AL-S2.1.a` Interpret histograms and frequency polygons
- `AL-S2.1.b` Interpret box plots
- `AL-S2.1.c` Interpret cumulative frequency diagrams

**AL-S2.3** Interpret measures of central tendency and variation, including variance and standard deviation from raw data and summary statistics _(sequence)_

- `AL-S2.3.a` Calculate and interpret measures of central tendency
- `AL-S2.3.b` Calculate variance and standard deviation from raw data and summary statistics

**AL-S3.2** Calculate conditional probability using Venn diagrams, tree diagrams, two-way tables and P(A|B) = P(A ∩ B)/P(B) _(separate)_

- `AL-S3.2.a` Find conditional probabilities from Venn diagrams
- `AL-S3.2.b` Find conditional probabilities from tree diagrams and two-way tables
- `AL-S3.2.c` Use P(A|B) = P(A ∩ B)/P(B)

**AL-S4.1** Use discrete probability distributions, including the binomial distribution _(sequence)_

- `AL-S4.1.a` Use discrete probability distributions
- `AL-S4.1.b` Use the binomial distribution

**AL-S4.2** Use the normal distribution, including its points of inflection and standardisation _(sequence)_

- `AL-S4.2.a` Find normal probabilities
- `AL-S4.2.b` Use the inverse normal
- `AL-S4.2.c` Standardise to find an unknown mean or standard deviation

**AL-S5.1a** Use the language of hypothesis testing: hypotheses, significance level, test statistic, one and two tails, critical value and region, p-value _(sequence)_

- `AL-S5.1a.a` Write hypotheses and use significance levels
- `AL-S5.1a.b` Find critical values and regions
- `AL-S5.1a.c` Use p-values

**AL-M7.2** Use displacement-time and velocity-time graphs, including gradients and areas _(separate)_

- `AL-M7.2.a` Use displacement-time graphs
- `AL-M7.2.b` Use velocity-time graphs, including gradients and areas

**AL-M8.4** Apply Newton's third law to equilibrium and connected particles, including pulleys _(sequence)_

- `AL-M8.4.a` Apply Newton's third law to connected particles
- `AL-M8.4.b` Model particles connected over pulleys

**AL-M8.6** Use F ≤ μR and limiting friction in statics and dynamics _(sequence)_

- `AL-M8.6.a` Use limiting friction in statics
- `AL-M8.6.b` Use friction in dynamics

**AL-M9.1** Use moments for rigid bodies in equilibrium, e.g. beams and ladders _(separate)_

- `AL-M9.1.a` Use moments for beams
- `AL-M9.1.b` Use moments for ladders

### Further Maths

**FM-CP-01** Prove results by mathematical induction: sums of series, divisibility, matrix powers _(separate)_

- `FM-CP-01.a` Prove sums of series by induction
- `FM-CP-01.b` Prove divisibility results by induction
- `FM-CP-01.c` Prove matrix powers by induction

**FM-CP-02** Use the language and arithmetic of complex numbers, including complex conjugates and solving quadratics with complex roots _(sequence)_

- `FM-CP-02.a` Calculate with complex numbers
- `FM-CP-02.b` Use complex conjugates
- `FM-CP-02.c` Solve quadratics with complex roots

**FM-CP-04** Represent complex numbers on an Argand diagram; use modulus-argument form; multiply and divide in this form _(sequence)_

- `FM-CP-04.a` Represent complex numbers on an Argand diagram
- `FM-CP-04.b` Use modulus-argument form
- `FM-CP-04.c` Multiply and divide in modulus-argument form

**FM-CP-05** Represent and interpret loci and regions in the Argand diagram, e.g. |z − a| = r and arg(z − a) = θ _(separate)_

- `FM-CP-05.a` Use loci of the form |z − a| = r
- `FM-CP-05.b` Use loci of the form arg(z − a) = θ
- `FM-CP-05.c` Represent regions in the Argand diagram

**FM-CP-06** Use exponential form re^(iθ) and de Moivre's theorem, including trig identities from it _(sequence)_

- `FM-CP-06.a` Use exponential form re^(iθ)
- `FM-CP-06.b` Use de Moivre's theorem
- `FM-CP-06.c` Derive trig identities from de Moivre's theorem

**FM-CP-08** Add, subtract and multiply conformable matrices; use zero and identity matrices _(sequence)_

- `FM-CP-08.a` Add and subtract matrices
- `FM-CP-08.b` Multiply conformable matrices
- `FM-CP-08.c` Use zero and identity matrices

**FM-CP-09** Use 2×2 and 3×3 matrices for linear transformations: reflections, rotations, enlargements, stretches, shears; combine transformations _(sequence)_

- `FM-CP-09.a` Use 2×2 matrices for transformations
- `FM-CP-09.b` Use 3×3 matrices for transformations
- `FM-CP-09.c` Combine transformations

**FM-CP-11** Calculate determinants of 2×2 and 3×3 matrices and interpret them as scale factors; find inverses; use (AB)⁻¹ = B⁻¹A⁻¹ _(sequence)_

- `FM-CP-11.a` Calculate determinants and interpret them as scale factors
- `FM-CP-11.b` Find inverses of matrices
- `FM-CP-11.c` Use (AB)⁻¹ = B⁻¹A⁻¹

**FM-CP-13** Use relationships between roots and coefficients of polynomials up to quartic; form equations with transformed roots _(sequence)_

- `FM-CP-13.a` Use relationships between roots and coefficients
- `FM-CP-13.b` Form equations with transformed roots

**FM-CP-16** Find Maclaurin series of functions, including general terms, and use standard series _(sequence)_

- `FM-CP-16.a` Find Maclaurin series
- `FM-CP-16.b` Use standard series

**FM-CP-19** Find volumes of revolution about the x- and y-axes, including in modelling _(separate)_

- `FM-CP-19.a` Find volumes of revolution about the x-axis
- `FM-CP-19.b` Find volumes of revolution about the y-axis

**FM-CP-21** Differentiate inverse trig functions; integrate to give inverse trig functions _(separate)_

- `FM-CP-21.a` Differentiate inverse trig functions
- `FM-CP-21.b` Integrate to give inverse trig functions

**FM-CP-22** Use vector and Cartesian equations of lines and planes; use the scalar product _(sequence)_

- `FM-CP-22.a` Use vector and Cartesian equations of lines
- `FM-CP-22.b` Use vector and Cartesian equations of planes
- `FM-CP-22.c` Use the scalar product

**FM-CP-23** Find intersections, angles and shortest distances between points, lines and planes _(separate)_

- `FM-CP-23.a` Find intersections of lines and planes
- `FM-CP-23.b` Find angles between lines and planes
- `FM-CP-23.c` Find shortest distances

**FM-CP-24** Use polar coordinates; sketch polar curves; convert between polar and Cartesian forms _(sequence)_

- `FM-CP-24.a` Convert between polar and Cartesian forms
- `FM-CP-24.b` Sketch polar curves

**FM-CP-26** Define and sketch hyperbolic functions and their inverses, including logarithmic forms _(sequence)_

- `FM-CP-26.a` Define and sketch hyperbolic functions
- `FM-CP-26.b` Use inverse hyperbolic functions and their logarithmic forms

**FM-CP-27** Prove and use hyperbolic identities; differentiate and integrate hyperbolic functions _(sequence)_

- `FM-CP-27.a` Prove and use hyperbolic identities
- `FM-CP-27.b` Differentiate hyperbolic functions
- `FM-CP-27.c` Integrate hyperbolic functions

**FM-CP-29** Solve second-order homogeneous and non-homogeneous differential equations with constant coefficients _(sequence)_

- `FM-CP-29.a` Solve second-order homogeneous differential equations
- `FM-CP-29.b` Solve second-order non-homogeneous differential equations

**FM-CP-30** Model simple harmonic motion and damped oscillations with differential equations _(sequence)_

- `FM-CP-30.a` Model simple harmonic motion
- `FM-CP-30.b` Model damped oscillations

**FM-FP1-01** Use the vector product and scalar triple product, including areas and volumes _(sequence)_

- `FM-FP1-01.a` Use the vector product
- `FM-FP1-01.b` Use the scalar triple product for areas and volumes

**FM-FP1-02** Work with conic sections in Cartesian and parametric form: parabola, ellipse, hyperbola, rectangular hyperbola; tangents and normals _(separate)_

- `FM-FP1-02.a` Work with the parabola
- `FM-FP1-02.b` Work with the ellipse
- `FM-FP1-02.c` Work with the hyperbola and rectangular hyperbola
- `FM-FP1-02.d` Find tangents and normals to conics

**FM-FP1-03** Solve inequalities involving rational functions and modulus _(separate)_

- `FM-FP1-03.a` Solve inequalities with rational functions
- `FM-FP1-03.b` Solve inequalities with the modulus

**FM-FP1-05** Use Taylor series and series expansions to evaluate limits, including L'Hospital's rule _(separate)_

- `FM-FP1-05.a` Use series expansions to evaluate limits
- `FM-FP1-05.b` Use L'Hospital's rule

**FM-FP1-06** Solve differential equations using Taylor series and by reducing them with a substitution _(separate)_

- `FM-FP1-06.a` Solve differential equations using Taylor series
- `FM-FP1-06.b` Solve differential equations by reducing them with a substitution

**FM-FP1-07** Solve differential equations numerically using Euler's method and the midpoint method; use Simpson's rule _(separate)_

- `FM-FP1-07.a` Use Euler's method
- `FM-FP1-07.b` Use the midpoint method
- `FM-FP1-07.c` Use Simpson's rule

**FM-FP2-01** Use the division and Euclidean algorithms, modular arithmetic, Fermat's little theorem and divisibility tests _(sequence)_

- `FM-FP2-01.a` Use the division and Euclidean algorithms
- `FM-FP2-01.b` Use modular arithmetic
- `FM-FP2-01.c` Use Fermat's little theorem
- `FM-FP2-01.d` Use divisibility tests

**FM-FP2-02** Use group axioms, Cayley tables, subgroups, order, Lagrange's theorem and isomorphism _(sequence)_

- `FM-FP2-02.a` Use group axioms and Cayley tables
- `FM-FP2-02.b` Find orders of elements and subgroups
- `FM-FP2-02.c` Use Lagrange's theorem
- `FM-FP2-02.d` Identify isomorphic groups

**FM-FP2-04** Solve first- and second-order recurrence relations _(sequence)_

- `FM-FP2-04.a` Solve first-order recurrence relations
- `FM-FP2-04.b` Solve second-order recurrence relations

**FM-FP2-05** Find eigenvalues and eigenvectors, diagonalise matrices and use the Cayley-Hamilton theorem _(sequence)_

- `FM-FP2-05.a` Find eigenvalues and eigenvectors
- `FM-FP2-05.b` Diagonalise matrices
- `FM-FP2-05.c` Use the Cayley-Hamilton theorem

**FM-FP2-06** Derive and use reduction formulae; find arc lengths and surface areas of revolution _(separate)_

- `FM-FP2-06.a` Derive and use reduction formulae
- `FM-FP2-06.b` Find arc lengths
- `FM-FP2-06.c` Find surface areas of revolution

**FM-FS1-01** Find expectation and variance of discrete random variables, including functions of them _(sequence)_

- `FM-FS1-01.a` Find the expectation and variance of a discrete random variable
- `FM-FS1-01.b` Find the expectation and variance of functions of a random variable

**FM-FS1-02** Use the Poisson distribution, including additive property and approximation to the binomial _(sequence)_

- `FM-FS1-02.a` Use the Poisson distribution
- `FM-FS1-02.b` Use the additive property of Poisson distributions
- `FM-FS1-02.c` Approximate the binomial with a Poisson distribution

**FM-FS1-03** Use the geometric and negative binomial distributions _(sequence)_

- `FM-FS1-03.a` Use the geometric distribution
- `FM-FS1-03.b` Use the negative binomial distribution

**FM-FS1-04** Carry out hypothesis tests for Poisson and geometric parameters _(separate)_

- `FM-FS1-04.a` Test a Poisson parameter
- `FM-FS1-04.b` Test a geometric parameter

**FM-FS1-06** Use chi-squared tests for goodness of fit and for contingency tables _(separate)_

- `FM-FS1-06.a` Use chi-squared tests for goodness of fit
- `FM-FS1-06.b` Use chi-squared tests for contingency tables

**FM-FS1-08** Judge the quality of tests: Type I and Type II errors, size and power _(sequence)_

- `FM-FS1-08.a` Identify Type I and Type II errors
- `FM-FS1-08.b` Find the size and power of a test

**FM-FS2-01** Fit least squares regression lines and analyse residuals _(sequence)_

- `FM-FS2-01.a` Fit least squares regression lines
- `FM-FS2-01.b` Analyse residuals

**FM-FS2-02** Calculate PMCC and Spearman's rank correlation and test for association _(separate)_

- `FM-FS2-02.a` Calculate the PMCC
- `FM-FS2-02.b` Calculate Spearman's rank correlation coefficient
- `FM-FS2-02.c` Test for association

**FM-FS2-03** Use continuous random variables with pdfs and cdfs, including the continuous uniform distribution _(sequence)_

- `FM-FS2-03.a` Use probability density functions
- `FM-FS2-03.b` Use cumulative distribution functions
- `FM-FS2-03.c` Use the continuous uniform distribution

**FM-FS2-05** Use unbiased estimators and confidence intervals _(sequence)_

- `FM-FS2-05.a` Use unbiased estimators
- `FM-FS2-05.b` Find confidence intervals

**FM-FS2-06** Use the t-distribution and F-distribution for tests and confidence intervals, including paired t-tests _(separate)_

- `FM-FS2-06.a` Use t-tests and t confidence intervals
- `FM-FS2-06.b` Use paired t-tests
- `FM-FS2-06.c` Use the F-distribution

**FM-FM1-02** Use work, kinetic and potential energy, and power _(sequence)_

- `FM-FM1-02.a` Use work and kinetic and potential energy
- `FM-FM1-02.b` Use power

**FM-FM1-03** Model elastic strings and springs with Hooke's law and elastic potential energy _(sequence)_

- `FM-FM1-03.a` Use Hooke's law
- `FM-FM1-03.b` Use elastic potential energy

**FM-FM2-01** Model motion in a circle with constant and variable speed, horizontally and vertically _(separate)_

- `FM-FM2-01.a` Model horizontal circular motion
- `FM-FM2-01.b` Model vertical circular motion

**FM-FM2-02** Find centres of mass of plane figures and laminas, including by integration _(sequence)_

- `FM-FM2-02.a` Find centres of mass of composite laminas
- `FM-FM2-02.b` Find centres of mass by integration

**FM-FM2-03** Find centres of mass of solids and frameworks; analyse equilibrium and toppling _(separate)_

- `FM-FM2-03.a` Find centres of mass of solids
- `FM-FM2-03.b` Find centres of mass of frameworks
- `FM-FM2-03.c` Analyse equilibrium and toppling

**FM-FM2-04** Use Newton's laws with forces depending on time, displacement or velocity _(separate)_

- `FM-FM2-04.a` Use forces depending on time
- `FM-FM2-04.b` Use forces depending on displacement
- `FM-FM2-04.c` Use forces depending on velocity

**FM-D1-01** Follow, trace and judge the order of algorithms, including sorting and bin packing _(separate)_

- `FM-D1-01.a` Trace sorting algorithms
- `FM-D1-01.b` Use bin packing algorithms
- `FM-D1-01.c` Judge the order of an algorithm

**FM-D1-02** Use graph theory vocabulary and find minimum spanning trees (Kruskal, Prim) _(sequence)_

- `FM-D1-02.a` Use graph theory vocabulary
- `FM-D1-02.b` Use Kruskal's algorithm
- `FM-D1-02.c` Use Prim's algorithm

**FM-D1-03** Find shortest paths (Dijkstra, Floyd) _(separate)_

- `FM-D1-03.a` Use Dijkstra's algorithm
- `FM-D1-03.b` Use Floyd's algorithm

**FM-D1-04** Solve route inspection and travelling salesperson problems _(separate)_

- `FM-D1-04.a` Solve route inspection problems
- `FM-D1-04.b` Solve travelling salesperson problems

**FM-D1-05** Use critical path analysis: activity networks, floats, Gantt charts, resource levelling _(sequence)_

- `FM-D1-05.a` Draw activity networks
- `FM-D1-05.b` Find floats and critical paths
- `FM-D1-05.c` Draw Gantt charts and level resources

**FM-D1-06** Formulate and solve linear programming problems graphically and by the simplex method _(sequence)_

- `FM-D1-06.a` Formulate linear programming problems
- `FM-D1-06.b` Solve linear programs graphically
- `FM-D1-06.c` Solve linear programs by the simplex method

**FM-D2-01** Solve transportation problems using the north-west corner and stepping-stone methods _(sequence)_

- `FM-D2-01.a` Find an initial solution by the north-west corner method
- `FM-D2-01.b` Improve a solution by the stepping-stone method

**FM-D2-05** Analyse two-person zero-sum games, including play-safe strategies and mixed strategies _(sequence)_

- `FM-D2-05.a` Find play-safe strategies
- `FM-D2-05.b` Find mixed strategies

**FM-D2-06** Solve recurrence relations and use decision trees for decision analysis _(separate)_

- `FM-D2-06.a` Solve recurrence relations
- `FM-D2-06.b` Use decision trees

### Core Maths

**CM-A2** Interpret and construct time series tables and line graphs; calculate and use moving averages _(sequence)_

- `CM-A2.a` Interpret and construct time series tables and graphs
- `CM-A2.b` Calculate and use moving averages

**CM-A3** Construct and interpret histograms with equal and unequal class intervals and cumulative frequency graphs _(separate)_

- `CM-A3.a` Construct and interpret histograms
- `CM-A3.b` Construct and interpret cumulative frequency graphs

**CM-A5** Compare distributions using averages, quartiles, IQR, variance and standard deviation _(sequence)_

- `CM-A5.a` Compare distributions using averages
- `CM-A5.b` Compare distributions using quartiles and IQR
- `CM-A5.c` Compare distributions using variance and standard deviation

**CM-A8** Draw lines of best fit and make predictions; use and interpret the PMCC and its limitations _(sequence)_

- `CM-A8.a` Draw lines of best fit and make predictions
- `CM-A8.b` Use and interpret the PMCC

**CM-A10** Calculate and interpret Spearman's rank correlation coefficient, including tied ranks _(sequence)_

- `CM-A10.a` Calculate Spearman's rank correlation coefficient
- `CM-A10.b` Handle tied ranks

**CM-P3** Calculate probabilities of independent and dependent combined events, with and without replacement, using tree and Venn diagrams and the sum and product laws _(sequence)_

- `CM-P3.a` Calculate probabilities of independent combined events
- `CM-P3.b` Calculate probabilities without replacement

**CM-P4** Calculate conditional probabilities using two-way tables, tree diagrams and Venn diagrams _(separate)_

- `CM-P4.a` Find conditional probabilities from two-way tables
- `CM-P4.b` Find conditional probabilities from tree diagrams
- `CM-P4.c` Find conditional probabilities from Venn diagrams

**CM-P6** Use P(A′) = 1 − P(A), P(A ∪ B) = P(A) + P(B) − P(A ∩ B) and P(A ∩ B) = P(A)P(B|A) _(separate)_

- `CM-P6.a` Use P(A′) = 1 − P(A)
- `CM-P6.b` Use the addition rule
- `CM-P6.c` Use the multiplication rule

**CM-LP5** Solve linear simultaneous equations algebraically and graphically _(separate)_

- `CM-LP5.a` Solve simultaneous equations algebraically
- `CM-LP5.b` Solve simultaneous equations graphically

**CM-LP10** Solve two-variable linear programs graphically using ruler and vertex methods _(separate)_

- `CM-LP10.a` Use the ruler (objective line) method
- `CM-LP10.b` Use the vertex method

**CM-SG2** Calculate simple and compound interest and compare them graphically _(sequence)_

- `CM-SG2.a` Calculate simple interest
- `CM-SG2.b` Compare simple and compound interest graphically

**CM-SG3** Sketch and interpret quadratic, reciprocal, y = xⁿ and exponential y = kˣ graphs _(separate)_

- `CM-SG3.a` Sketch and interpret quadratic graphs
- `CM-SG3.b` Sketch and interpret reciprocal graphs
- `CM-SG3.c` Sketch and interpret y = xⁿ
- `CM-SG3.d` Sketch and interpret exponential graphs y = kˣ

**CM-SG5** Calculate with roots and with integer and fractional indices _(sequence)_

- `CM-SG5.a` Calculate with roots
- `CM-SG5.b` Calculate with integer indices
- `CM-SG5.c` Calculate with fractional indices

**CM-SG6** Find nth terms of linear and quadratic sequences _(sequence)_

- `CM-SG6.a` Find the nth term of linear sequences
- `CM-SG6.b` Find the nth term of quadratic sequences

**CM-SG7** Use sequences given by nth-term formulae and by xₙ₊₁ = f(xₙ), including Fibonacci and the golden ratio _(separate)_

- `CM-SG7.a` Use sequences given by nth-term formulae
- `CM-SG7.b` Use sequences given by recurrence relations
- `CM-SG7.c` Use Fibonacci sequences and the golden ratio

**CM-SG9** Use arithmetic series, including the general term and sum to n terms _(sequence)_

- `CM-SG9.a` Find the general term of an arithmetic series
- `CM-SG9.b` Find the sum of an arithmetic series

**CM-SG10** Use geometric series, including sum to n terms and sum to infinity when |r| < 1 _(sequence)_

- `CM-SG10.a` Find the sum to n terms of a geometric series
- `CM-SG10.b` Find the sum to infinity when |r| < 1
