# gameon-store

Production-ready React Point of Sale system for a retail game store, built with Vite, React, Tailwind CSS, and `vite-plugin-pwa`.

## Features

- Searchable, filterable inventory grid for consoles, games, and accessories
- Smart cart with quantity controls, tax calculation, and a full checkout flow
- Associate login gate (demo credentials in mock data)
- Customer lookup header (debounced search by phone/email) + profile slide-over drawer
- Loyalty: points progress, coupon injection, trade-in credit application, redemption modal (cash vs points)
- Returns: transaction history viewer, 30-day eligibility highlighting, and disposition flagging (Resellable vs Refurbished)
- Midnight & Crimson touchscreen-friendly UI
- PWA install support with offline caching for the app shell and all mock data JSON
- Offline queue: completed transactions stored in IndexedDB when offline + "Sync Pending" badge (auto-sync on reconnect)
- Service worker notifications: push low-stock / preorder arrival alerts to the device (mock templates)
- Hardware bridge UI: pair Bluetooth receipt printers (Web Bluetooth) and connect USB barcode scanners (WebUSB) where supported

## Local Development

```bash
cd /Users/lmotati/workspace/gameon-store
npm install
npm run dev
```

After signing in, the **Customer Lookup** search bar is pinned at the top of the POS screen.

## Build And Test The PWA Locally

```bash
cd /Users/lmotati/workspace/gameon-store
npm install
npm run build
npx serve -s dist
```

Then open the local URL printed by `serve` in your browser. Installability and offline service worker behavior are best verified from the built app, not the Vite dev server.

## Mock Data (API-Shaped Fixtures)

These files simulate backend API responses and are cached offline by the service worker:

- `public/mock-data/items.json` inventory items
- `public/mock-data/associates.json` associate login credentials
- `public/mock-data/customers.json` customer records for lookup
- `public/mock-data/orders.json` transaction history for returns
- `public/mock-data/payment-methods.json` supported payment methods
- `public/mock-data/payment-responses.json` mock card-reader + checkout responses
- `public/mock-data/rewards.json` reward catalog (cash vs points)
- `public/mock-data/notifications.json` notification templates
- `public/mock-data/hardware.json` paired printer/scanner mock state

## Backend Integration Switch

The app is organized so screens call services rather than hardcoded mock files.

Environment variables:

- `VITE_USE_MOCK_DATA=false` to switch services to real API mode
- `VITE_API_BASE_URL=/api` (or your backend origin/path) for API calls
