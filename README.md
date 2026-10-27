# INRISHI Website V46

Production frontend source for INRISHI Private Limited.

- Website version: `46.0.0`
- Homepage visual authority: preserved V38 design
- Tagline: `Intelligence inside.`
- Production backend: unchanged Google Apps Script Web App

## V46 design restoration

V46 restores the approved cosmic homepage direction after the V41 visual regression:

- full-bleed galaxy / planet / asteroid / meteor environment;
- centered INRISHI hero composition over the cosmic background;
- the uploaded INRISHI logo is used as the public header, hero and footer brand asset;
- `Solutions`, `Sample Work`, `Our approach`, `Contact` navigation rhythm is restored;
- hero copy is restored to `Connecting people, processes and data with software that thinks ahead.`;
- `Explore solutions`, `Start a conversation` and `EXPLORE OUR UNIVERSE` are restored;
- the V41 horizontal service-chip strip is removed from the hero;
- white customer-facing title cards remain below the hero where previously approved.

## Exit-control gate

`npm run verify:design` locks the approved V46 homepage composition and the uploaded logo bytes. It is included in `npm run preflight` so a future design regression fails before deployment.

## Build corrections retained from V41

- Vite `8.1.5` with `@tailwindcss/vite` / `tailwindcss` `4.3.3`;
- Vite 8 native Oxc minification;
- strict TypeScript optional-property correction;
- Partner Login and Partner Registration `Button` imports;
- Node `22.12+` support without the obsolete `<25` ceiling.


## V46 approved delta

V46 preserves the V38/V44 cosmic layout and production functionality. The only visual changes are a refined robot/INRISHI hero holding composition and larger customer-facing service/body typography for readability.
