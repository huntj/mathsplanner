# @mathsplanner/practice

The teacher's planner and the student-facing practice app. A first visit sets up the teacher's timetable a question at a time (one week or two, lessons a day, lesson length and the half-term dates), then their classes and the lessons they teach them, then the lessons homework is set and handed in; each class then gets its own scheme of work, planned in lessons from the timetable: started from topics a half-term at a time, a draft of the year or another class's plan, and seen as the year's half-terms or a half-term's dated lessons, each with what it teaches, the homework set and due, and the half-term test. The set-up is kept in the browser's local storage and in a backup file the teacher downloads; it holds class names only, never students'.

For practice, a teacher chooses statements, depths, a numbers setting and how many questions, and shares the link; everyone who opens it gets the same questions. Students answer with an input widget for each answer type, get marks and misconception feedback after each question (or only at the end, as a quiz), and finish on a results page that downloads a CSV or prints.

Teachers can also set year and unit tests, and plan a scheme of work for a class: choose the year group and class, then topics for each half-term, and the planner suggests statements from that year, what they build on from earlier years, and next year's for stretch, with each item's prerequisites checked and the year's coverage shown. Items fall into weeks by their lessons, and each week gets homework on its new content with call-backs to earlier weeks, ending with a half-term review; each half-term also makes tests and prerequisite checks. A scheme is saved as its link or as a downloaded file.

There are no accounts, and nothing is sent anywhere or stored about students. The session lives in the link, and results leave the page only as the student's download or printout.

Run it locally with `pnpm practice` (http://localhost:5174). It is published at `/practice/` beside the gallery.
