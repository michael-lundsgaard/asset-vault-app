# Generate a Conventional Commit Message

Analyze the staged changes (or all unstaged changes if nothing is staged) and produce **one logical commit message** following Conventional Commits 1.0.

Your goal is to describe the **intent of the change**, not list every modification.

---

## Output Format

```
<type>(<scope>): <short summary>

<body explaining motivation and behavior>

<footer(s) if needed>
```

The blank lines separating subject, body, and footer are required.
Do not output markdown fences or commentary — only the commit message.

---

## Core Principles (IMPORTANT)

1. **Think in features, not files**
    - Multiple modified files often belong to one change.
    - Produce a single cohesive description.

2. **Always choose ONE primary purpose**
    - If multiple unrelated changes exist, describe the dominant one
      and treat others as supporting context.
    - Never write multiple independent changes in the same commit message.

3. **Prioritize externally visible impact**
    - User-visible UI behavior or interactions
    - Route or navigation changes
    - Auth flow changes
    - Data fetching behavior (queries, mutations, cache)
    - Developer API surface (hooks, stores, components)

4. **De-emphasize mechanical refactors**
   Mention them only if they support the feature:
    - component renames or restructuring
    - prop/type reshaping
    - Zustand store restructuring
    - query key or factory extraction
    - style-only tweaks
    - generated file regeneration (`src/api/generated/`)

5. **Do NOT narrate the diff**
   Avoid phrases like:
    - "add file"
    - "update class"
    - "modify method"
    - "change property"

6. **The first line must answer:**
    > What capability does this introduce or fix?

---

## Choosing the Type

| Type       | Meaning                                                         |
| ---------- | --------------------------------------------------------------- |
| `feat`     | New capability or new API behavior                              |
| `fix`      | Corrects incorrect behavior                                     |
| `refactor` | Internal restructuring with identical runtime behavior          |
| `perf`     | Performance improvement                                         |
| `test`     | Tests only                                                      |
| `build`    | Dependencies / build system                                     |
| `ci`       | Pipeline changes                                                |
| `docs`     | Documentation only                                              |
| `chore`    | Tooling / config / structure without production behavior change |

**Rule:**  
If the end user would notice the change → `feat` or `fix`  
If only developers care → `refactor` or `chore`

Prefer `feat` when a new user-facing capability, route, UI element,
or observable data-fetching behavior is introduced — even if most
code changes are internal plumbing.

---

## Choosing the Scope

Use the functional area, not the layer or file:

Good:

- `assets` — asset listing, cards, grid, detail
- `upload` — upload pipeline, progress, drop zone
- `auth` — login, SessionProvider, Supabase session
- `store` — Zustand auth/theme/ui store changes
- `api` — API client config, interceptors, codegen
- `theme` — dark/light mode
- `layout` — AppLayout, Sidebar, routing structure
- `ui` — shared atoms/molecules with no single domain

Avoid:

- `components`
- `hooks`
- `pages`
- `utils`

---

## Subject Line Rules

- imperative mood
- lowercase
- ≤72 chars
- no trailing period
- describe behavior, not implementation

Good:

```
feat(upload): show per-file progress during parallel uploads
```

```
fix(auth): redirect to login when session refresh fails
```

Bad:

```
feat(components): update UploadProgress.tsx and useAssets hook
```

---

## Body Rules

Separate from the subject with exactly one blank line
Wrap all lines at 72 characters

Explain **why the change exists** and clarify behavior.

Include:

- behavior details
- constraints
- compatibility notes

Avoid:

- listing files
- repeating the subject
- low-level implementation steps

The body must add new information not present in the subject line.  
If it only repeats the summary, omit the body entirely.

---

## Breaking Changes

If behavior changes incompatibly:

```
feat(store)!: replace viewMode boolean with enum in uiStore

BREAKING CHANGE: isGridView removed; use viewMode === 'grid' instead
```

---

## Examples

Good:

```
feat(assets): add list view with sortable columns

Introduces a table layout toggled via the view mode control.
Sorts are applied client-side using the existing TanStack Query
cache — no new requests are triggered on sort change.
```

```
fix(upload): prevent duplicate uploads when drop zone is triggered twice
```

Bad:

```
feat(assets): update AssetGrid.tsx, AssetRow.tsx, ViewToggle, useAssets
```

---

## Final instruction

Review the diff, infer the single primary intent, and write the
cleanest commit message a human maintainer would write after
refactoring the branch into one commit.

Output only the commit message.
