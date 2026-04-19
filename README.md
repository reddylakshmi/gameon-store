# gameon-store

Production-ready React Point of Sale system for a retail game store, built with Vite, React, Tailwind CSS, and `vite-plugin-pwa`.

## Features

- Searchable, filterable inventory grid for consoles, games, and accessories
- Smart cart with quantity controls, 8.25% tax calculation, and sale completion flow
- Midnight & Crimson touchscreen-friendly UI
- PWA install support with offline caching for the app shell and mock inventory data
- Mock inventory preloaded from `public/mock-data/items.json`

## Local Development

```bash
cd /Users/lmotati/workspace/gameon-store
npm install
npm run dev
```

## Build And Test The PWA Locally

```bash
cd /Users/lmotati/workspace/gameon-store
npm install
npm run build
npx serve -s dist
```

Then open the local URL printed by `serve` in your browser. Installability and offline service worker behavior are best verified from the built app, not the Vite dev server.
