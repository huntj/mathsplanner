# @mathsplanner/practice

The student-facing web app. A teacher chooses statements, depths, a numbers setting and how many questions, and shares the link; everyone who opens it gets the same questions. Students answer with an input widget for each answer type, get marks and misconception feedback after each question (or only at the end, as a quiz), and finish on a results page that downloads a CSV or prints.

Teachers can also set year and unit tests, and plan a scheme of work for a class: choose the year group and class, then topics for each half-term, and the planner suggests statements from that year, what they build on from earlier years, and next year's for stretch, with each item's prerequisites checked and the year's coverage shown. Items fall into weeks by their lessons, and each week gets homework on its new content with call-backs to earlier weeks, ending with a half-term review; each half-term also makes tests and prerequisite checks. A scheme is saved as its link or as a downloaded file.

It is stateless: there are no accounts and nothing is stored or sent anywhere. The session lives in the link, and results leave the page only as the student's download or printout.

Run it locally with `pnpm practice` (http://localhost:5174). It is published at `/practice/` beside the gallery.
