# @mathsplanner/diagrams

The only place SVG is produced. It turns a small JSON `DiagramSpec` (geometry, cartesian, number line, bar model, counters, measures, charts, probability, networks, complex plane, vectors) into a self-contained SVG string plus a text description for screen readers, with no browser dependency, so the same code draws on screen, in print and in tests. Generators describe what to draw; this package decides where labels go and checks that the drawing agrees with the numbers. Implementation starts in Phase 3.
