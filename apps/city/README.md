# @mathsplanner/city

Maths City: the Learn Maths course as a city-building game. See the [proposal](../../docs/proposals/city-game.md) for the whole design. It is being built in small steps; this is what is here so far.

**The engine** is pure functions, tested without a browser.

- `economy.ts`: the rules. Each skill's outcrop gives one of four materials, by its topic family (stone, ore, timber, sand). A skill's machine is built by its unit lesson and makes 2 a minute, then 3, 4, 5, 6 and 8 as the skill reaches Learn, Practise, Picture, Reason and Legendary; a finished skill whose review is not due runs tuned, half as fast again. A machine's state is read from the learning record (`machineState`) and never saved. A finished lesson pays a crate (ten minutes of the city's output, at least 60) and 30 minutes of power. The price list and the ranks are here too.
- `city.ts`: the city's save, in the browser's local storage under its own key beside Learn Maths' progress: for each year, the map's seed, where machines and buildings stand, the stock and when the power runs out. `settle` brings the stock up to date from the clock, so machines run in real time whether the game is open or closed, and only while there is power. `lessonFinished` records a lesson; `build` buys a building.
- `works.ts`: a city's machines and output today, from the learning record.
- `simulate.ts` and `economy.test.ts`: made-up pupils (slow, typical, keen) played through Place value and the whole of Year 7 with the real learning functions, to check the numbers in the proposal: what each lesson is worth, that income grows steadily and not explosively, and that a pupil who never tunes up is still paid well.

**The map** is a grid of squares drawn in SVG, with no drawing library.

- `map.ts`: makes a year's map from the seed in the city's save, so each pupil's is their own and is the same each time. Each unit is a zone, a patch of ground with an outcrop for each skill; the zones lie along a road from the camp, in course order, three across; trees and ponds fill some of the land between. Outcrops sit on every other square of their zone and nothing is put beside them, so all four squares round each are free for its machine (`machineSpots`). `map.test.ts` checks this over many seeds, for one zone and for all of Year 7.
- `art.tsx`: the drawings, one SVG symbol each, a square wide and a square and a half tall so that tall things overlap the row behind. Their colours are CSS variables, so the same drawings serve light and dark. The machines and buildings here are first drafts.
- `tiles.ts`: what is on a square (ground, outcrop, machine or building), its name, and how a screen reader says it.
- `MapView.tsx`: the map in a box that scrolls. Dragging or the scroll wheel moves it and a tap chooses a square. With the keyboard, arrow keys move a cursor square, Enter opens it, and plus and minus zoom. Only the squares in view are drawn, back row first.
- `CityScreen.tsx`: the counters across the top, the map, the zoom buttons, and the sheet that slides up for the chosen square (Escape closes it). With `prefers-reduced-motion` the sheet does not slide.
- `demo.ts`: a made-up full Year 7 city, to see how a busy map draws. Add `#demo` to the address; it is never saved.

**On screen** so far: the counters and the map of the first zone, Place value, with its four stone outcrops. Choosing a square says what it is. The lessons and the buildings come next.

Run it locally with `pnpm city` (http://localhost:5176). Learn Maths' progress is shared only when both apps are served from the same site, as they will be when published; on a developer's machine they run on different ports, so the city starts from an empty record.
