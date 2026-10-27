# Inrishi V46 Design Exit Control

V46 restores the preserved V38 homepage direction while retaining all V43 compile, dependency and backend fixes.

Locked homepage controls:
- full-bleed V38 cosmic scene with galaxy, planets, asteroid field and visible stars;
- cosmic backdrop stored locally so it cannot disappear when remote imagery is unavailable;
- previous robot + INRISHI hero artwork;
- uploaded green INRISHI logo used only as the top-left brand mark and favicon family;
- hero brand line: `Inrishi.`;
- tagline: `Intelligence inside.`;
- supporting line: `Connecting people, processes and data with software that thinks ahead.`;
- `Explore solutions` and `Start a conversation` CTAs;
- `EXPLORE OUR UNIVERSE` cue;
- dark/translucent V38 public homepage surfaces rather than the later white-card homepage redesign.

`npm run verify:design` is part of `npm run preflight`. Deployment must stop if any of these controls regress.
