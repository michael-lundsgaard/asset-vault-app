# AssetVault App — Copilot Instructions

## Stack

Next.js 14 (App Router) · Tailwind CSS · Supabase JS (auth) · Zustand (global state) · TanStack React Query v5 · `@hey-api/client-fetch` (HTTP) · react-hot-toast · Framer Motion · Lucide icons.

> **Note:** The README mentions Axios and Orval — both have been replaced. The live HTTP runtime is `@hey-api/client-fetch`; code gen is `@hey-api/openapi-ts`.

## Key Developer Commands

```bash
npm run dev              # Start Next.js dev server
npm run generate-client  # Regenerate src/api/generated/ from live spec (API must be running at localhost:5209)
npm run type-check       # tsc --noEmit (zero errors is the bar)
npm run format           # Prettier
```

## Architecture

### API Layer (`src/api/`)

- **`client.ts`** — Configures the generated `client` singleton (from `generated/client.gen.ts`) with `NEXT_PUBLIC_API_URL`, a request interceptor that attaches the Supabase JWT, and a 401→refresh→retry response interceptor.
- **`generated/`** — Never edit manually. Regenerate with `npm run generate-client` against the live OpenAPI spec at `http://localhost:5209/openapi/v1.json`. Source of truth is `openapi-ts.config.ts`.
- **`storage.ts`** — S3 raw XHR uploader. The presigned URL returned by `assetsInitiateUpload` is absolute and **must never pass through `apiClient`** (S3 rejects auth headers and base-URL prepending).

### Data Fetching Pattern

Use generated `queryOptions`/`mutationOptions` factories directly in components — no wrapper hooks for queries:

```ts
// In DashboardTemplate.tsx — idiomatic pattern
const { data, isLoading } = useQuery(assetsGetAllOptions({ query: { search: search || undefined, pageSize: 50 } }));
```

Factories live in `src/api/generated/@tanstack/react-query.gen.ts`. SDK functions (for mutations/imperative calls) live in `src/api/generated/sdk.gen.ts`.

### Three-Step Upload Pipeline (`src/hooks/useAssets.ts`)

The only custom hook. Handles parallel uploads without violating rules-of-hooks by using raw SDK functions (not mutation hooks):

1. `assetsInitiateUpload` → receives `{ assetId, presignedUrl }`
2. `uploadToS3(presignedUrl, file, onProgress)` — raw XHR via `storage.ts`
3. `assetsConfirmUpload({ path: { id: assetId } })`
4. `qc.invalidateQueries({ queryKey: assetsGetAllQueryKey() })`

### Global State (Zustand — `src/store/`)

| Store        | Responsibility                                   |
| ------------ | ------------------------------------------------ |
| `authStore`  | Supabase session, sign-in/out, `init()` listener |
| `themeStore` | Light/dark toggle, persisted to `localStorage`   |
| `uiStore`    | `viewMode` (grid/list), `uploadPanelOpen`        |

Server state lives in TanStack Query. Zustand is only for auth, theme, and UI control state.

### Component Structure (Atomic Design)

`atoms` → `molecules` → `organisms` → `templates`

- **Templates** (`src/components/templates/`) are the composition layer: `Providers` (QueryClient + theme), `AuthGuard` (Supabase listener + redirect), `AppLayout` (sidebar + content), `DashboardTemplate` (full page logic).
- `layout.tsx` renders `<Providers><AuthGuard>{children}</AuthGuard><Toaster /></Providers>`.

### Auth Flow

`AuthGuard` calls `authStore.init()` on mount, subscribes to Supabase `onAuthStateChange`, and redirects unauthenticated users to `/login`. The `apiClient` request interceptor reads the current session on every request — no manual token management needed in components.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL   # defaults to http://localhost:5209
```
