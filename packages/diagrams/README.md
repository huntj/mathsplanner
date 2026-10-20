# @mathsplanner/diagrams

The only place SVG is produced. `renderDiagram(spec)` turns a small JSON `DiagramSpec` into a self-contained SVG string plus a text description for screen readers, with no browser dependency, so the same code draws on screen, in print and in tests. Generators describe what to draw in maths units; this package decides where everything goes.

Four types are drawn so far: **geometry** (points, segments, lines, polygons, circles, angle arcs sized to the angle, right-angle squares, equal-length ticks, parallel arrows, "not drawn to scale"), **cartesian** (axes with nice ticks, grids, points, polygons, vectors and curves given as expressions such as `x^2 - 3x + 2`, broken at asymptotes), **number-line** (any scale, points, jumps, inequality intervals) and **bar-model** (proportional parts, shading, braces). Counters, measures, charts, probability, networks, complex-plane and vector diagrams come later.

- **Labels** are LaTeX in a classroom subset (numbers, italic variables, operators, `^circ`, powers, `rac`, `sqrt`, Greek, `	ext`, `mathrm`), drawn as SVG text in KaTeX's fonts and measured with KaTeX's font metrics. Anything outside the subset throws `LabelError`.
- **Placement**: a solver tries each label's candidate positions in priority order and reports any overlap it cannot avoid in `collisions`.
- **Truth checks**: `problems` lists every way a drawing contradicts its numbers (a stated angle drawn differently, unequal sides marked equal, and so on). `drawDiagram` throws instead.
- **Builders** (`anglesOnLine`, `anglesAtPoint`, `regularPolygon`, `triangleSSS`, `triangleASA`, `pointAt`) make honest geometry specs from the numbers a generator knows.
- **Reference diagrams**: `REFERENCE_DIAGRAMS` holds the 50 diagrams of the Phase 3 exit check, snapshot-tested and shown on the gallery's Diagrams page.
