# Google Flight Clone

A pixel-honest recreation of the Google Flights search experience — built to study how a price-aware flight UI behaves end to end, from search form to fare-heatmap calendar to live flight results.

Real flight data is pulled from RapidAPI on every search, so prices, durations, and CO₂ figures reflect what the underlying carriers are actually offering.

![Google Flight Clone — price-heatmap calendar and search results](https://github.com/user-attachments/assets/4a79d827-9b60-4527-b557-e0c2e2b82b60)

## What it does

- **Search flights** by origin, destination, dates, cabin class, and passenger count
- **Price-heatmap calendar** — color-coded fares across rolling months so users can spot the cheapest day at a glance
- **Round-trip / one-way** trip types with separate departure and return date pickers
- **Live results** — airline, flight number, times, layovers, CO₂ emissions, in-flight amenities (Wi-Fi, USB, Entertainment)
- **Accessible UI** — keyboard navigation, focus management, and screen-reader-friendly markup throughout
- **Responsive** — mobile-first, tested on phone, tablet, and desktop breakpoints

## Engineering notes

- The fare-heatmap calendar is a custom-built component, not a stock date picker. It coordinates two months side-by-side, pulls per-day pricing, and color-codes by tier (cheap → expensive) without flashing on re-render.
- TanStack Router gives the search results page a type-safe, URL-driven state so users can share, refresh, or bookmark any search.
- RapidAPI responses are cached client-side per (origin, destination, dates) tuple — repeat searches hit memory, not the network.
- ShadcnUI + Tailwind keep the look close to Google's reference without dragging in a heavy component library.

## Tech stack

| Layer | Choice |
|------|--------|
| UI components | [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI primitives) |
| Build tool | [Vite](https://vitejs.dev/) |
| Routing | [TanStack Router](https://tanstack.com/router/latest) — type-safe, URL-as-state |
| Language | [TypeScript](https://www.typescriptlang.org/), strict mode |
| Data source | RapidAPI flight endpoints |
| Icons | [Tabler Icons](https://tabler.io/icons) |
| Tooling | ESLint, Prettier, Knip, Commitizen |

## Run locally

```bash
git clone https://github.com/kbtanvir/google-flight-clone.git
cd google-flight-clone
pnpm install
pnpm run dev
```

Add a RapidAPI key to `.env` (see `.env.example`) to enable live flight data.

## Author

Built by [@kbtanvir](https://github.com/kbtanvir) — senior full-stack engineer focused on AI-integrated SaaS and infra-heavy backends.
