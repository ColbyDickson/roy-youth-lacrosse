# Roy Youth Lacrosse

A responsive parent reference hub for the 2027 Spring season in Roy, Utah.

## Run locally

No dependency installation or build step is required. From this checkout:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000`. The page also works directly from `index.html`; equipment checklist persistence depends on browser support for local storage on file URLs.

## Deploy

Publish `index.html`, `styles.css`, `script.js`, and the entire `assets/` directory together. Fonts and artwork are local; the page makes no third-party requests until a parent follows an external link.

- **GitHub Pages:** deploy the repository root from your chosen branch.
- **Netlify:** leave the build command empty and use `.` as the publish directory.
- **Vercel:** select the Other framework preset, leave the build command empty, and use `.` as the output directory.

## Features

- Sticky navigation and a mobile menu with keyboard support.
- All three registration tiers and all 12 supplied season dates.
- Downloadable all-day calendar events, compatible with calendar apps that import `.ics` files.
- Boys’ and girls’ equipment tabs with separate checklists saved to this browser.
- Native, keyboard-accessible FAQ accordions.
- Click-to-call, email, registration, gear rental, and social links.
- Reduced-motion support and bundled open-source fonts (licenses in `assets/`).

## Content and branding

Edit season content in `index.html`; calendar export dates and descriptions are in `script.js`. Update both when season dates change. The “Open now” and Early Bird messages intentionally reflect the supplied November 23, 2026 season announcement and are not automatically time-dependent.

The lion in `assets/roy-lion.svg` is a vector recreation of the supplied image. The working gold is `#E5C947`; a separate color-palette image was not supplied. For exact official artwork, replace that SVG with an approved asset and update its references if the filename changes. Brand colors are defined at the top of `styles.css`.

The Facebook link searches for “Roy High Lacrosse” because no exact Facebook page URL was provided. Replace it with the official page URL when available.

## Validation

Browser checks cover desktop, tablet, and phone layouts; navigation; both equipment tabs; checklist persistence; FAQ expansion; all 12 exported calendar dates; missing local assets; and browser errors. An automated axe WCAG 2.1 AA audit is also run against desktop and mobile layouts. These checks do not verify registration or payments on third-party sites.
