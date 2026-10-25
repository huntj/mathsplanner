# Proposal: a set-up and dashboard for teachers

Status: **agreed on 25 October 2026.** Steps 0 to 3 are built (`apps/practice/src/workspace.ts`
and the `Welcome`, `Timetable`, `Homework`, `Home` and `ClassPlan` views), with each class's scheme
opening in the existing planner; steps 4 to 7 are to do.

## Why

The practice app is built for someone who already knows it: a new teacher lands on a statement
picker with depths, seeds and curriculum codes. A maths teacher thinks in their own week instead:
their timetable, their classes, the lesson in front of them, and the homework and tests coming up.
This proposal puts that week first. A first visit walks through setting up the timetable and
classes, and from then on the home page is a dashboard of the week.

## Decisions

1. **Saved in the browser.** The timetable, half-term dates and classes are kept in the browser's
   local storage, with a backup file to download and open again (for moving between school and
   home). There are no accounts and nothing is sent anywhere. This changes the design's
   "stateless" decision: the practice app still stores no student results, but it now remembers
   the teacher's own set-up.
2. **Classes only.** No student names or marks are stored. Results stay as the student's CSV or
   printout.
3. **Half-terms by dates.** The teacher gives the start and end date of each of the six half-terms;
   the weeks come from the dates. Suggested dates are offered as a starting point. The set-up can
   be done at any point in the year: the dashboard finds this week from today's date.
4. **One or two weeks.** A two-week timetable has a Week A and a Week B. The teacher says whether it
   carries on through the holidays (the first week back follows on from the last week before) or
   starts again on Week A after each holiday, and which week the year starts on. Bank holidays and
   INSET days are not handled yet.
5. **Monday to Friday**, with the same number of periods each day. A class in two periods in a row
   has two lessons.
6. **Lesson length is for layout only**: it sets how tall a lesson is on the timetable and
   dashboard, and does not change what is planned.
7. **Homework once a week**, set in one lesson and handed in at the next lesson of the one chosen
   for it. With a two-week timetable there is one set lesson in each week. Each set is the weekly
   homework the scheme already makes.
8. **Tests**: each half-term's test goes in the class's last lesson of the half-term, and can be
   moved to another lesson.
9. **Each class has its own scheme**, with a way to copy another class's.

## Steps

0. **The data model.** A workspace of the timetable, half-term dates and classes, each class with
   its periods, homework lessons, test lessons and scheme. A calendar gives each class's lessons
   with dates and Week A/B; the scheme's weeks and lessons a week come from it, so a week with
   fewer lessons holds less. Saved to local storage and to a backup file, with everything read
   back checked as with scheme links.
1. **Welcome and timetable settings.** A first visit asks, one question at a time and in plain
   words: one week or two (and whether it carries on through holidays), lesson length, periods a
   day, and the half-term dates.
2. **A blank timetable and classes.** Add a class (its name and year group or course, given a
   colour), then click the periods it is taught in. Shows each class's lessons a week.
3. **Homework lessons.** For each class, click the lesson homework is set in and the one it is
   handed in.
4. **The scheme of work, from term to lesson.** Each class's scheme opens on the existing guided
   set-up, or a draft of the year. It zooms from the year to a half-term, a week and a lesson,
   with each objective in a dated lesson.
5. **The lesson page.** The lesson's learning objectives, their prerequisites (taught earlier, not
   yet taught, or from an earlier year, with a check), the question generator set to the lesson's
   objectives, and any homework set or due.
6. **The dashboard.** Once set up, the home page shows this week's lessons with their topics,
   each class's topics this half-term, homework coming up (set and due) and tests coming up, with
   earlier and later weeks a click away.
7. **Plain words and polish.** "Learning objective" for statement and "difficulty" for depth;
   no seeds or codes in the main path; helpful empty states, a settings page to change the
   set-up, and undo. The practice, year test and unit test pages stay, under "Question tools".
