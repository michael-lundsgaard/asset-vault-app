# Migrate Orval → hey-api + Wire Dashboard

Replace `orval` with `@hey-api/openapi-ts` + `@hey-api/client-fetch` + its `@tanstack/react-query` plugin. hey-api generates typed SDK functions and `queryOptions`/`mutationOptions` factories — you compose them into `useQuery`/`useMutation` yourself, giving explicit control over every call site.

The S3 presigned-URL upload stays entirely in `src/api/storage.ts` using raw XHR, completely bypassing the hey-api client (no base URL prepending, no auth headers injected — exactly what S3 expects).

---

## Step 1 — Swap packages

Uninstall `orval`. Install:

- `@hey-api/openapi-ts` _(devDependency — code gen CLI)_
- `@hey-api/client-fetch` _(runtime client)_

`@tanstack/react-query` is already installed and consumed as a plugin reference inside the hey-api config — no extra install needed.

Update `package.json` scripts:

```json
"generate-client": "npx @hey-api/openapi-ts"
```

---

## Step 2 — Replace `orval.config.ts` → `openapi-ts.config.ts`

Delete `orval.config.ts`. Create `openapi-ts.config.ts`:

```ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'http://localhost:5209/openapi/v1.json',
	output: {
		path: 'src/api/generated',
		format: 'prettier',
	},
	plugins: [
		'@hey-api/client-fetch',
		'@hey-api/schemas',
		{
			name: '@tanstack/react-query',
			// generates queryOptions / mutationOptions factories
		},
	],
});
```

---

## Step 3 — Rewrite `client.ts`

Remove the orval-style mutator function. Replace with a hey-api client singleton that has an auth request interceptor and a 401-retry response interceptor.

> `ApiError` can be removed — hey-api surfaces errors through the typed response union (`error` field) rather than thrown exceptions.

```ts
import { createClient } from '@hey-api/client-fetch';
import { supabase } from './supabase';

export const apiClient = createClient({
	baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
});

// Attach Bearer token to every request
apiClient.interceptors.request.use(async (request) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	if (token) request.headers.set('Authorization', `Bearer ${token}`);
	return request;
});

// On 401, refresh once and retry
apiClient.interceptors.response.use(async (response) => {
	if (response.response.status !== 401) return response;
	const { data } = await supabase.auth.refreshSession();
	const token = data.session?.access_token;
	if (!token) return response;
	const retried = response.request.clone();
	retried.headers.set('Authorization', `Bearer ${token}`);
	return fetch(retried).then((r) => ({ ...response, response: r }));
});
```

---

## Step 4 — Regenerate the generated folder

Delete the entire `generated` folder. Run:

```bash
npm run generate-client
```

Run this against the live API spec. The hey-api output uses the same tags-split approach:

```
src/api/generated/
  assets/
    assetsGetAll          → typed SDK fn + assetsGetAllOptions() factory
    assetsInitiateUpload  → typed SDK fn + assetsInitiateUploadMutation()
    assetsConfirmUpload   → typed SDK fn + assetsConfirmUploadMutation()
    ...
  collections/
    ...
  schemas/
    AssetResponse.ts, ...  ← cleaner — no 3-way content-type unions
```

The generated code will import `apiClient` from `../../client` automatically because that's the configured client package.

---

## Step 5 — Create `src/hooks/useAssets.ts`

This is the **only custom hook needed**. It implements the three-step upload pipeline using raw SDK functions (not mutation hooks), so parallel uploads work without violating rules-of-hooks.

> **Critical S3 note:** `assetsInitiateUpload` returns a `presignedUrl` (absolute S3 URL). This URL must be passed directly to `uploadToS3` from `storage.ts` — never through `apiClient`, which would prepend `NEXT_PUBLIC_API_URL` and inject the `Authorization` header (S3 will reject it).

```ts
export function useUploadAsset() {
	const qc = useQueryClient();
	const [uploadStates, setUploadStates] = useState<UploadState[]>([]);

	const upload = async (file: File) => {
		// 1. Register state entry
		// 2. Call assetsInitiateUpload({ body: { fileName, contentType, sizeBytes } })
		//    → receives { assetId, presignedUrl }
		// 3. Call uploadToS3(presignedUrl, file, onProgress)  ← raw XHR, absolute URL
		// 4. Call assetsConfirmUpload({ path: { id: assetId } })
		// 5. On completion: qc.invalidateQueries({ queryKey: assetsGetAllQueryKey() })
		// 6. On any error: toast.error(err.message)
	};

	const reset = () => setUploadStates([]);
	return { upload, uploadStates, reset };
}
```

---

## Step 6 — Update `DashboardTemplate.tsx`

Replace the orval hook call with the hey-api pattern:

```ts
// Before (orval):
const { data, isLoading } = useAssetsGetAll({ search, pageSize: 50 });

// After (hey-api):
const { data, isLoading } = useQuery(assetsGetAllOptions({ query: { search: search || undefined, pageSize: 50 } }));
```

Remove the broken `useDeleteAsset` import. Change `onDelete` to fire a toast.

---

## Step 7 — Update `AssetGrid.tsx`

One import path change:

```ts
// Before:
import { AssetResponse } from '@/api/generated/schemas';

// After (hey-api puts types in the tag folder):
import type { AssetResponse } from '@/api/generated/assets';
```

> Exact path depends on hey-api output — verify after regeneration.

---

## Step 8 — Verify `Toaster` in layout

`layout.tsx` already has `<Toaster>` from `react-hot-toast` configured at the bottom of `<Providers>`. No changes needed here.

---

## Verification Checklist

1. `npm run generate-client` — completes with no errors against the spec
2. `npm run type-check` — zero type errors
3. `npm run dev` — dashboard loads, asset grid populates
4. Drop files in `UploadPanel` → status progresses through `initiating → uploading (%) → confirming → done`, grid refreshes
5. Click delete on any row/card → "Delete coming soon" toast appears
6. Check Network tab: S3 `PUT` request goes to the absolute presigned URL with **no `Authorization` header** and **no base-URL prefix**

---

## Key Decisions

**Raw SDK functions in `useUploadAsset`** — avoids the hooks-in-loop constraint while keeping full type safety from generated functions.

**S3 via `storage.ts` XHR** — the presigned URL is absolute and must bypass `apiClient` entirely; the existing `uploadToS3` already does this correctly.

**No wrapper hook for queries** — `useQuery(assetsGetAllOptions(...))` inline in `DashboardTemplate` is idiomatic hey-api and avoids an unnecessary abstraction layer.
