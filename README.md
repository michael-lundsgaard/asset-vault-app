# AssetVault App

Next.js frontend for the [AssetVault API](https://github.com/michael-lundsgaard/assetvault-api/tree/develop).

## Stack

| Concern      | Library                      |
| ------------ | ---------------------------- |
| Framework    | Next.js 14 (App Router)      |
| Styling      | Tailwind CSS + CSS Variables |
| Auth         | Supabase JS (email/password) |
| Global State | Zustand (auth, theme, UI)    |
| Server State | TanStack React Query v5      |
| HTTP         | `@hey-api/client-fetch`      |
| Code Gen     | `@hey-api/openapi-ts`        |
| Animation    | Framer Motion                |
| Icons        | Lucide React                 |
| Upload DnD   | react-dropzone               |
| Toasts       | react-hot-toast              |

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# (Supabase project → Settings → API)

# 3. Run
npm run dev
```

## Developer Commands

```bash
npm run dev              # Start Next.js dev server
npm run generate-client  # Regenerate src/api/generated/ from live spec (API must be running at localhost:5209)
npm run type-check       # tsc --noEmit
npm run format           # Prettier
```

## How Auth Works

1. User logs in on `/login` with email + password via `@supabase/supabase-js`
2. Supabase issues a JWT and stores it in localStorage
3. `AuthGuard` boots the Supabase listener on app start, hydrates the Zustand `authStore`
4. Every request (via `src/api/client.ts`) automatically attaches the current JWT as `Authorization: Bearer <token>` and handles 401 → refresh → retry
5. Unauthenticated users are redirected to `/login`; authenticated users are redirected away from it

## API Layer (`src/api/`)

- **`client.ts`** — Configures the generated `client` singleton with `NEXT_PUBLIC_API_URL`, JWT injection, and 401→refresh→retry logic.
- **`generated/`** — Never edit manually. Regenerate with `npm run generate-client` against the live OpenAPI spec at `http://localhost:5209/openapi/v1.json`. Source of truth is `openapi-ts.config.ts`.
- **`storage.ts`** — S3 raw XHR uploader. Presigned URLs from `assetsInitiateUpload` are used directly and must never pass through `apiClient` (S3 rejects auth headers).

### Upload Pipeline (`src/hooks/useAssets.ts`)

Three-step flow handled by the `useAssets` hook:

1. `assetsInitiateUpload` → receives `{ assetId, presignedUrl }`
2. `uploadToS3(presignedUrl, file, onProgress)` — raw XHR via `storage.ts`
3. `assetsConfirmUpload({ path: { id: assetId } })`
4. Invalidate TanStack Query cache

## Zustand Stores

| Store        | File                  | Responsibility                                 |
| ------------ | --------------------- | ---------------------------------------------- |
| `authStore`  | `store/authStore.ts`  | User session, sign-in, sign-out                |
| `themeStore` | `store/themeStore.ts` | Light/dark mode, persisted to localStorage     |
| `uiStore`    | `store/uiStore.ts`    | View mode (grid/list), upload panel open state |

## Project Structure (Atomic Design)

```
src/
├── api/
│   ├── client.ts                  # Configured @hey-api/client-fetch singleton
│   ├── storage.ts                 # S3 XHR uploader
│   ├── supabase.ts                # Supabase client
│   └── generated/                 # Auto-generated — do not edit
│
├── app/
│   ├── layout.tsx                 # Root layout (Providers + AuthGuard)
│   ├── page.tsx                   # Dashboard
│   ├── login/page.tsx             # Login
│   └── assets/                    # Asset routes
│
├── components/
│   ├── atoms/          Button, Input, Badge, Skeleton, FileIcon
│   ├── molecules/      AssetCard, AssetRow, SearchBar, ViewToggle,
│   │                   ThemeToggle, StatCard, DropZone, UploadProgress
│   ├── organisms/      Sidebar, AssetGrid, Header, UploadPanel, LoginForm
│   └── templates/      Providers, AuthGuard, AppLayout, DashboardTemplate
│
├── hooks/              useAssets (upload pipeline)
├── store/              authStore, themeStore, uiStore
├── lib/                utils.ts
└── types/              index.ts
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL   # defaults to http://localhost:5209
```

## Theme

Toggle between **dark** (deep navy `#0f1117`) and **light** (soft indigo-white `#f5f7ff`) with the sun/moon button in the sidebar. Theme persists via Zustand `persist` middleware to `localStorage`.

Accent: vivid teal-cyan `#25c4cf` — applied to active nav, buttons, focus rings, and progress bars.

Fonts: **Syne** (display) + **Nunito** (body) + **JetBrains Mono** (metadata).
