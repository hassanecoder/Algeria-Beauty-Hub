# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, Shadcn UI, React Query, Framer Motion, Wouter

## Project: Jamila — Algeria Health & Beauty Marketplace

A full-featured health & beauty listings/marketplace web app for Algeria, branded "Jamila" (جميلة - beautiful in Arabic).

### Features
- Browse 22+ health & beauty businesses across Algeria
- 10 categories: Hair Salons, Spas & Hammams, Aesthetic Clinics, Pharmacies, Parfumeries, Body Care, Dental Centers, Opticians, Nail Studios, Laser Centers
- All 58 Algerian wilayas (provinces) supported
- Filter by category, wilaya, price range, rating
- Search functionality
- Business detail pages with services, reviews, pricing in DZD
- Submit listing form
- About page
- Featured & Verified badges
- Rich seed data with Algerian businesses, Arabic/French content

### Pages
- `/` — Homepage with hero search, featured listings, category grid, stats
- `/listings` — All listings with filters sidebar
- `/listings/:id` — Business detail with services & reviews
- `/categories` — All categories grid
- `/about` — About the platform
- `/submit` — Submit a new listing form

### Seed Script
Run `pnpm --filter @workspace/scripts run seed` to repopulate the database.

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── health-beauty/      # React + Vite frontend (Jamila marketplace)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seeder
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## DB Schema

- `wilayas` — all 58 Algerian provinces
- `categories` — business categories (10)
- `listings` — business listings with ratings, images, tags, price range
- `services` — services offered per listing with prices in DZD
- `reviews` — customer reviews with star ratings

## API Endpoints

All endpoints at `/api`:
- `GET /api/healthz` — health check
- `GET /api/wilayas` — all 58 wilayas with listing counts
- `GET /api/categories` — all categories with listing counts
- `GET /api/listings?category=&wilaya=&search=&featured=&minRating=&page=&limit=` — paginated listings
- `GET /api/listings/:id` — listing detail with services & recent reviews
- `GET /api/listings/:id/reviews` — all reviews for a listing
- `POST /api/listings/:id/reviews` — submit a review
- `GET /api/search?q=&wilaya=&category=` — search
- `GET /api/stats` — marketplace statistics
