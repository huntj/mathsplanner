# @mathsplanner/practice

The student-facing web app. A teacher chooses statements, depths, a numbers setting and how many questions, and shares the link; everyone who opens it gets the same questions. Students answer with an input widget for each answer type, get marks and misconception feedback after each question (or only at the end, as a quiz), and finish on a results page that downloads a CSV or prints.

Teachers can also set year and unit tests, and plan a scheme of work: a year, course or key stage in half-terms, filled with statements and their steps, with each item's prerequisites checked. A scheme is saved as its link or as a downloaded file, and each half-term makes homework (optionally with retrieval questions from earlier half-terms) and tests.

It is stateless: there are no accounts and nothing is stored or sent anywhere. The session lives in the link, and results leave the page only as the student's download or printout.

Run it locally with `pnpm practice` (http://localhost:5174). It is published at `/practice/` beside the gallery.
