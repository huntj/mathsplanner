# @mathsplanner/print

Prints an A4 worksheet to PDF: numbered questions with answer lines and working space, then (optionally) answer pages with worked solutions. The same settings and seed always give the same sheet, and every page carries the seed. The layout is `renderWorksheet` from `@mathsplanner/render`, the same one the practice app's worksheet page prints from the browser.

```bash
pnpm print --statements Y5-GEO-04,Y6-GEO-03 --depths 1,2,4 --count 10 --seed 42 --out angles.pdf
```

Run `pnpm print --help` for every option (numbers setting, title, no answers, no solutions, reduced ink, keeping the HTML).

PDFs are made with Playwright (`playwright-core`) driving a Chrome or Edge that is already installed, so nothing is downloaded. Set `MATHSPLANNER_BROWSER` to a browser's path to use another Chromium-based browser.
