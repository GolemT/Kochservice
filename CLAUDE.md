# Kochservice Frontend

Recipe management frontend. Intentionally built to enterprise-grade standards for learning purposes, even though the app itself is small (~7 recipes).

---

## Stack

| Concern | Library |
|---|---|
| Build | Vite 7 |
| UI | React 19 |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query v5 |
| Forms | TanStack Form v1 |
| Client state | Zustand v5 |
| Styling | Tailwind CSS 4 |
| Components | Custom Tailwind components (`src/components/`) — shadcn removed (see §7) |
| Notifications | Sonner |
| Icons | Lucide React |
| API codegen | Orval (OpenAPI → TypeScript) |
| HTTP client | Axios (via `src/lib/axios-client.ts`) |
| Error tracking | Sentry (`@sentry/react` frontend, `sentry` crate backend) |
| Testing | Vitest 4 + Testing Library + `@vitest/coverage-v8` |
| Package manager | **pnpm** — always use pnpm, never npm |

Backend: Rust ("Kochservice"), running on port 8080. Dev frontend runs on port 3000.

---

## Architecture

### Directory layout

```
src/
├── api/              # Orval-generated clients — do not edit manually
│   ├── recipes/
│   ├── ingredients/
│   ├── tags/
│   ├── sentry/       # Generated Sentry tunnel client
│   └── kochservice.schemas.ts
├── components/
│   ├── button.tsx    # KsButton — variants: default, accent, dark, outline, destructive; sizes: default, sm, lg, icon
│   ├── card.tsx      # KsCard — optional hover prop
│   ├── navbar.tsx    # Floating sketchy nav (Navbar C) + mobile hamburger drawer
│   └── ui/           # Thin stubs for legacy routes — re-export or wrap the new primitives
│                     # (badge, card, input, label, separator, skeleton, switch, textarea,
│                     #  combobox, dropdown-menu, tabs) — do NOT add new shadcn-style components here
├── hooks/            # Global TanStack Query hooks — all server state lives here
│   ├── use-recipe.ts
│   ├── use-ingredient.ts
│   ├── use-tag.ts
│   └── use-mobile.ts  # ⚠️ shadcn leftover — not imported anywhere, safe to delete
├── lib/
│   ├── axios-client.ts  # Axios instance — all API requests pass through here
│   └── utils.ts
├── routes/           # TanStack Router file-based routing
│   ├── __root.tsx    # Root layout: <Navbar /> persists across all routes
│   ├── index.tsx     # Landing page (fully implemented)
│   ├── recipe/
│   │   ├── $id.tsx   # Recipe detail + Kochmodus overlay (fully implemented)
│   │   ├── new.tsx   # New recipe form
│   │   └── use-new.ts  # ⚠️ see known issues
│   └── ...
└── styles.css        # Design tokens + Tailwind 4 theme
```

### Data flow convention

```
Orval-generated API fn  →  Global hook (src/hooks/)  →  Route/component
                ↓
        axios-client.ts  (interceptors: toasts, Sentry, future auth)
```

All server state is managed through the global hooks in `src/hooks/`. Components never call API functions directly.

### Key patterns

- **Cache-first recipe lookup** — `useRecipe` checks the infinite query cache before fetching individually
- **Infinite scroll + virtualisation** — home list uses `useInfiniteQuery` with row virtualisation
- **Preload on intent** — TanStack Router preloads routes on hover/focus
- **Centralised HTTP boundary** — `axios-client.ts` holds all cross-cutting request/response logic; hooks and components are never touched when transport behaviour changes

### Design system

All colours, fonts, shadows, and radii are CSS variables defined in `src/styles.css` and exposed to Tailwind 4 via `@theme` / `@theme inline`. Never hardcode colours.

```
:root / .dark  →  --ink, --paper, --paper-2, --accent (raw CSS vars, change in dark mode)

@theme          →  --font-hand, --font-head, --radius-sketchy, --radius-card,
                   --shadow-ink, --shadow-ink-sm, --shadow-ink-card, --shadow-ink-lg, etc.
                   (static, compiled at build time — do NOT reference CSS vars here)

@theme inline   →  --color-ink, --color-paper, --color-accent, etc.
                   (dynamic — these reference the CSS vars so they update in dark mode)
                   also: shadcn compat vars for Sonner (--color-background, --color-foreground…)
```

Tailwind utilities generated:
- `text-ink`, `bg-paper`, `bg-accent`, `border-ink-3` → colours
- `font-hand`, `font-head` → typefaces
- `rounded-sketchy`, `rounded-sketchy-sm`, `rounded-card`, `rounded-nav` → border radii
- `shadow-ink`, `shadow-ink-sm`, `shadow-ink-card`, `shadow-ink-lg`, `shadow-ink-hero` → box shadows

Custom CSS classes (not expressible in Tailwind): `.hatched`, `.hatched-sm` (diagonal line patterns), `.nav-active` (wavy underline).

---

## Known Issues / Tech Debt

- **`use-new.ts` route warning** — TanStack Router emits a warning because `src/routes/recipe/use-new.ts` doesn't export a `Route`. The `routeFileIgnorePattern` config should exclude it but doesn't seem to match. Either rename to `-use-new.ts` or fix the ignore pattern.
- **Loading states are bare `<div>Loading...</div>`** — should be replaced with skeleton components. `src/components/ui/skeleton.tsx` exists (simple pulse animation) but is not yet used on the recipe or home loading states.
- **Recipe images are hatched placeholders** — no real image support yet. The recipe detail hero and cards all render the hatched CSS pattern. This is intentional until photo upload (§4) is implemented. Do not add `<img src="">` — it causes React warnings.
- **Ingredient scaling formula assumes 2 default servings** — `scaledAmount = amount * portions / 2`. The backend has no servings field, so 2 is hardcoded as the base. This will need revisiting if the data model gains a servings field.
- **Kochmodus shows all ingredients, not per-step** — the wireframe intended per-step ingredient highlighting ("Du brauchst jetzt"), but the backend has no step↔ingredient mapping. Currently all ingredients are shown in the sidebar throughout.
- **"Speichern", "Drucken", "Teilen" buttons are non-functional** — UI placeholders, blocked on Auth (§2) for save, and no share/print logic yet.
- **Backend has no tests** — `cargo tarpaulin` is wired in CI and will report 0% until tests are added.
- **`server/README.md` is stale** — documents a `handlers/`, `services/`, `repositories/` layout that no longer matches the real `api/`, `application/`, `domain/`, `infrastructure/` structure.
- **`src/components/ui/` stubs** — these are thin compatibility wrappers so legacy routes (`recipe/new`, etc.) compile after shadcn removal. They are not the canonical components. When those routes get redesigned, import from `@/components/button` and `@/components/card` directly and delete the stub.
- **`src/hooks/use-mobile.ts`** — shadcn leftover, not imported anywhere. Safe to delete.

---

## Testing

**Frontend:** Vitest 4 + Testing Library. 4 test files, 38 tests. Run with `pnpm vitest run`.

Covered:
- `src/lib/axios-client.ts` — interceptor behaviour (toasts, Sentry, re-throw)
- `src/hooks/use-recipe.ts` — infinite query, cache-first lookup, create/update mutations
- `src/routes/recipe/use-new.ts` — form defaults, loading states, submission, navigation
- `src/routes/recipe/new.tsx` — smoke tests

Not yet covered: `src/routes/index.tsx` (landing page), `src/routes/recipe/$id.tsx` (recipe detail + Kochmodus), `src/components/navbar.tsx`. These should get tests when they stabilise.

**CI coverage reporting:**
- JUnit XML → GitLab Tests tab (38 tests visible per pipeline)
- Cobertura XML → line-level coverage in MR diffs
- Coverage % parsed from stdout (`Lines` metric) → visible in job sidebar
- Pipeline-level % requires setting the regex in **GitLab → Settings → CI/CD → General pipelines → Test coverage parsing**: `Lines\s*:\s*([\d.]+)%`

**Backend:** No tests yet. `cargo tarpaulin` is configured and will report 0% coverage — `allow_failure: true` is set so this doesn't block the pipeline.

---

## Planned Features

### 1. API client layer (Axios)

> Status: **complete**

`src/lib/axios-client.ts` — a configured Axios instance that all Orval-generated functions call via the `mutator` option in `orval.config.ts`.

**What's in place:**
- `baseURL` from `VITE_API_BASE` (falls back to `http://localhost:8080`), 10s timeout
- Response interceptor: success toast for mutating methods (POST/PUT/PATCH/DELETE), suppressible per-request via `successMessage: false`, customisable via `successMessage: 'custom text'`
- Response interceptor: error toast from `response.data.error` → `error.message` → fallback; Sentry capture on every error
- Auth interceptor stub ready — cookie-based auth (BFF pattern, see §2) means the interceptor won't need to attach tokens, just exists as an extension point
- `api-client.ts` (old fetch wrapper) has been deleted

---

### 2. Authentication (AuthService + Auth0)

> Status: **planned** — not started

**Provider:** Auth0. No custom JWT/user system — Auth0 handles identity, the Rust backend just validates tokens.

**Token storage: httpOnly cookie (BFF pattern)**
After the Auth0 login flow completes, the Rust backend exchanges the authorization code for a token and sets an httpOnly cookie. The frontend JS never sees the raw token. This is XSS-proof and the correct enterprise choice.

**Frontend flow:**
1. User clicks "Login" → redirect to Auth0 universal login page
2. Auth0 redirects back with an authorization code
3. Frontend sends the code to the Rust backend (`POST /auth/callback`)
4. Rust backend exchanges code for JWT with Auth0, validates it, sets httpOnly cookie
5. All subsequent requests include the cookie automatically (browser handles it)
6. Axios request interceptor does not need to attach a token — cookie is automatic

**Rust backend (no SDK needed):**
- Fetch Auth0's JWKS endpoint (`https://<domain>/.well-known/jwks.json`) to get public keys
- Validate incoming JWT on each protected route using the `jsonwebtoken` crate
- Check claims: `iss`, `aud`, `exp`
- Standard JWT validation — no Auth0-specific Rust library required

**Frontend AuthService:**
- `src/services/auth.ts` — `login()` (redirect to Auth0), `logout()` (clear cookie via backend), `useAuth()` hook exposing `{ user, isAuthenticated, isLoading }`
- React context wraps the app
- TanStack Router `beforeLoad` guards redirect unauthenticated users to login

**Open questions:**
- Auth0 tenant and app config (domain, clientId, audience) — needs setup
- Session expiry / token refresh strategy — Auth0 refresh tokens or re-login?

---

### 3. Legal pages (Privacy Policy, Impressum, About)

> Status: **planned** — not started

Required for EU compliance. No cookie consent banner needed (auth cookie is strictly necessary and exempt from GDPR opt-in), but a privacy notice is legally required.

**Planned pages:**
- `/about` — About the project, contact info
- `/about/privacy` — Privacy policy (what data is stored, auth cookie explanation, no third-party tracking)
- `/about/impressum` — Impressum (legally required in DACH for public-facing sites, but low enforcement risk for a non-commercial personal project with no real users)

**Implementation notes:**
- Static content pages, no backend calls
- Add to footer — keep sidebar focused on app navigation
- Write the actual legal text before implementing the pages (content-first)
- **Impressum blocker:** publishing a real name and home address is undesirable. Options when the time comes: PO box, legal representative address, or simply defer until the site has real public exposure. Not a priority.

**Scope decision:** No cookie consent modal planned. No third-party analytics or tracking will be added. If that changes, revisit this.

---

### 4. Photo upload / recipe images

> Status: **planned** — not started, blocked on image processing service (see §5)

**Summary:** Photos are optional at recipe creation time. One photo per recipe. Images are stored in a self-hosted MinIO instance. A separate image processing microservice handles validation, virus scanning, compression, and WebP conversion asynchronously. The frontend shows live progress via SSE.

**Storage:** Self-hosted MinIO (S3-compatible). No cloud provider. The main Rust backend never stores image bytes itself — it proxies the upload to the image processing service.

**Authentication against the image store — solved with presigned URLs:**
Images in MinIO are not publicly accessible. When the frontend requests a recipe, the Rust backend generates a short-lived signed URL (5–10 minutes) for the image and includes it in the recipe response. The frontend fetches the image directly from MinIO using that URL. The cryptographic signature embedded in the URL is the auth — no separate auth header needed, and the URL is useless after expiry. MinIO supports this natively as part of its S3-compatible API.

**Upload flow:**
1. User selects an image in the recipe form (optional)
2. Frontend validates format (JPEG, PNG, WebP only) and size (TBD max, e.g. 10MB) before sending
3. Frontend shows a preview using `URL.createObjectURL`
4. On recipe submit, image is sent to Rust backend as multipart (proxied — not presigned — so the backend can hand it to the image service and run the virus scan inline)
5. Rust backend forwards to the image processing service
6. Frontend subscribes to an SSE endpoint for progress updates (see below)
7. On completion, the image URL is stored in the recipe record

**Progress tracking via SSE:**
The image processing service emits status events back to the Rust backend, which streams them to the frontend via Server-Sent Events (SSE). SSE is one-directional (server → client), simpler than WebSockets, and sufficient here.

Progress states shown to the user:
- `uploading` — file is being received by the backend
- `scanning` — virus scan in progress
- `processing` — converting to WebP, compressing
- `saved` — stored in MinIO, recipe updated
- `error` — failed at any step, with reason

**Detail page:** Render image using the presigned URL from the recipe response. Fall back to a placeholder illustration when no image is set.

**Admin override:** Once the admin panel exists, admins can replace a recipe's photo without going through the full create flow.

---

### 5. Image processing service

> Status: **planned** — not started, prerequisite for photo upload (§4)

A dedicated microservice that handles all image processing so the main Rust backend stays responsive. Runs as a separate process, communicates with the main backend via an internal queue or direct HTTP call.

**Responsibilities:**
1. **Virus scanning** — ClamAV, running as a daemon. The service talks to it via TCP socket. Adds ~200–500ms per upload, acceptable for a one-time upload flow.
2. **Format validation** — reject anything that isn't a valid image, regardless of extension
3. **Compression + WebP conversion** — output is always WebP, sized appropriately for web display
4. **Storage** — writes final file to MinIO, returns the resulting object key to the main backend

**Progress reporting:**
Service emits status updates (`scanning`, `processing`, `saved`, `error`) back to the main Rust backend so they can be forwarded to the frontend via SSE.

**Language / implementation:** TBD — could be a second Rust service or a small Python service (Pillow has excellent WebP/compression support). Decision can wait until implementation time.

**Infrastructure note:** This service will also be deployed to the self-hosted environment alongside the main backend and MinIO.

---

### 6. Recipe state machine (draft / review / published)

> Status: **planned** — not started, blocked on Auth + Admin Panel

**Summary:** Recipes should not go live immediately on creation. A state machine prevents duplicates, typos, and low-quality entries from being visible to users.

**States:**
- `draft` — created but not submitted. Only visible to the creator (and admins). Editable.
- `review` — submitted for review. Locked for editing. Visible to admins only.
- `published` — approved. Visible to all users on the home feed and search.
- `rejected` — sent back from review with a reason. Editable again (returns to draft).

**Frontend impact:**
- Create recipe form submits into `draft` by default
- "Submit for review" button on the draft detail page transitions to `review`
- Home feed and search only show `published` recipes
- A "My Recipes" section (future) shows the user's own drafts and pending reviews
- Admin panel (future) shows the review queue

**Backend impact:**
- `status` field on the recipe record
- State transitions enforced server-side (can't go draft → published directly, must go through review)
- Auth required for draft/review visibility

**Open questions:**
- For now (no real users), the creator IS the admin — so the review step is essentially self-approval. The workflow is built correctly from the start but won't feel restrictive until there are multiple users.

---

### 7. Redesign / theming

> Status: **in progress** — design system, landing page, and recipe detail page are complete; remaining routes (search, new recipe form, categories, account) not yet redesigned

#### What's done

**Component library decision — made:** shadcn was removed. The design is custom enough (sketchy borders, offset box-shadows, handwritten fonts, warm paper palette) that no prebuilt library matched — everything would have needed heavy overriding. Approach: raw Tailwind 4 + a small set of custom primitives in `src/components/`.

**Design system — complete.** All tokens live in `src/styles.css`. See the Design system section under Architecture for the full token reference.

**Wireframe source:** `Kochservice Wireframes v2.html` from the Claude Design handoff. The chat transcript establishes the intent behind each layout decision. Keep it as the reference when implementing remaining pages.

**Navbar — complete.** Sketchy Floater (Navbar C) — a floating pill-shaped bar that stays sticky at `top: 12px`. Links, search input, theme toggle, login button on desktop. Hamburger → slide-in drawer on mobile. Implemented in `src/components/navbar.tsx`, mounted once in `__root.tsx` so it persists across every route.

**Landing page — complete.** `src/routes/index.tsx`. Sections:
- Hero (headline + stickers + CTA buttons)
- Hate list (what we removed)
- How it works (3-step cards)
- Popular recipes (4-up grid, real API data or placeholder)
- Feature grid (6 features)
- Big orange CTA section
- Footer (4-column grid)

**Recipe detail page — complete.** `src/routes/recipe/$id.tsx`. Features:
- Hero: 16:10 hatched image placeholder + title, ingredient count, step count, tags, action buttons
- Orange "Kochmodus starten" CTA bar (keyboard hint: `SPACE`)
- Desktop: 2-column — 280px ingredient sidebar with checkboxes + portion scaler (−/＋) | numbered steps list
- Mobile: big orange CTA + tab switcher (Zutaten / Schritte)
- **Kochmodus overlay** — fullscreen step-by-step mode:
  - Progress dots row, clickable to jump steps
  - Large step text on the left, ingredient checklist + timer on the right
  - Timer: preset buttons (5/10/15 min), play/pause/reset
  - Bottom nav: prev / step counter / next, last step becomes "Fertig — Guten Appetit!"
  - Keyboard: `→` / `Space` = next, `←` = prev, `Esc` = close

#### What's still needed

The following pages have not been redesigned yet — they still use the old layout or are stubs:

| Route | Status | Notes |
|---|---|---|
| `/recipe/new` | old layout | Uses `ui/` stubs; functional but unstyled for the new design |
| `/recipe/$id` loading state | placeholder | `<RecipeLoading />` uses skeleton stubs, not the new design |
| Search / recipe list | not built | No route exists yet |
| Categories | not built | No route exists yet |
| Bookmarks / Planer | not built | No route exists yet |
| Account / Login / Signup | not built | Blocked on Auth (§2) |
| Legal pages | not built | See §3 |

**Recommendation before implementing remaining pages:** wireframe them first in the Claude Design tool to keep the design consistent before committing to code. The landing page and recipe detail page establish the visual language — new pages should follow the same token usage and component patterns.

---

### 9. Admin Panel

> Status: **planned** — not started, blocked on Auth (§2) and recipe state machine (§6)

**Summary:** A management dashboard that gives admins full control over app data without touching the database directly. Admins are regular users with an elevated role — they see and can use the full normal user interface, plus the admin panel on top.

**Access model:**
- Role-based, sourced from Auth0 — roles assigned in the Auth0 dashboard (`user`, `admin`)
- The JWT issued by Auth0 includes the user's role in its claims
- Rust backend enforces role checks on all admin endpoints — the frontend role check is UX only, never security
- Admins access the admin panel via a separate route (e.g. `/admin`) that is hidden from and inaccessible to regular users
- Admins can freely switch between the normal user view and the admin panel

**Admin panel capabilities (planned):**
- **Recipe review queue** — approve or reject recipes submitted for review; send back with a rejection reason
- **Recipe management** — edit any recipe, correct typos, replace photos, change status (draft/review/published/rejected)
- **User management** — view users, assign/revoke roles (admin-only; no self-promotion)
- **Ingredient & tag management** — add, edit, or remove ingredients and tags from the global lists

**Frontend implementation notes:**
- Separate route subtree under `/admin/*` with a `beforeLoad` guard that checks for the `admin` role — redirects to home if not authorised
- Admin layout can differ from the user layout (e.g. wider, data-dense, table-heavy)
- Reuse existing hooks and components where possible — admin views are mostly the same data with more actions
- A role-aware `useAuth()` hook should expose `isAdmin` as a boolean so the sidebar can conditionally show the admin panel link

**Open questions:**
- Audit log: should admin actions be logged (who approved what, when)? Recommended for enterprise-grade — decide before implementation.
- Can an admin demote themselves? Probably not — require another admin or a super-admin role.

---

### 11. Observability (logging, tracing, metrics)

> Status: **partially complete** — Sentry error tracking is live (§13). Structured logging via `tracing` is live on the backend. Full observability stack (Prometheus, Grafana, OpenTelemetry distributed tracing) is future work.

**Backend (Rust) — current:**
- Structured logging via `tracing` crate with JSON output, log levels controlled by `RUST_LOG` env var
- Sentry integration via `sentry-tracing` — `tracing::error!()` events are forwarded to Sentry automatically

**Backend (Rust) — future:**
- **Distributed tracing** — trace IDs propagated across the main backend and image processing service. OpenTelemetry is the standard here.
- **Metrics** — request counts, error rates, latency histograms. Prometheus-compatible export via `metrics` crate.

**Frontend — current:**
- Sentry captures all unhandled errors and promise rejections
- `Sentry.ErrorBoundary` wraps the app root — render crashes are caught and reported

**Frontend — future:**
- Axios interceptor can attach trace IDs to outgoing requests once distributed tracing is set up
- `browserTracingIntegration()` for page load / navigation performance (low priority)

**Infrastructure (future):**
- Collector: OpenTelemetry Collector as a sidecar/agent
- Visualisation: Grafana for metrics + traces (pairs with Prometheus and Tempo/Jaeger). Self-hosted.
- Log aggregation: Loki (Grafana ecosystem, minimal overhead)

**When to add full stack:** After core features are stable. Good milestone: when the first real user outside the developer starts using the app.

---

### 12. Monorepo consolidation

> Status: **complete**

The frontend and Rust backend now live in a single monorepo. Both were imported via `git subtree` to preserve their full histories.

**Current structure:**
```
monorepo/
├── client/    # React + Vite frontend
└── server/    # Rust backend / kochservice
```

**Root CI/CD:** A root `.gitlab-ci.yml` uses `include:` to pull in `client/.gitlab-ci.yml` and `server/.gitlab-ci.yml`, with path-based `changes:` rules so client commits don't trigger backend builds and vice versa.

**Orval config:** Still points at the local OpenAPI spec served by the backend at runtime. Future improvement: point directly at `../server/` once the spec is exported as a static file.

---

## Backend (server/)

### Stack

| Concern | Technology |
|---|---|
| Web framework | Axum 0.8 |
| Async runtime | Tokio |
| ORM | SeaORM 2.0 (rc) |
| Database | PostgreSQL |
| API docs | utoipa + Scalar |
| Migrations | sea-orm-cli / SeaORM Migrator |
| Logging | `tracing` + `tracing-subscriber` (JSON output) |
| Error tracking | `sentry` + `sentry-tracing` |

Server runs on **port 8080**. API docs available at `http://localhost:8080/scalar`.

CORS is configured to allow: `localhost:3000`, `localhost:3100`, `kochservice.golemt.org`, `dev-kochservice.golemt.org`.

### Architecture

```
server/src/
├── api/              # HTTP layer — handlers, DTOs, OpenAPI spec registration
│   ├── heartbeat/    # GET /health
│   ├── recipe/       # recipe_handler.rs + recipe_dto.rs
│   ├── ingredient/   # ingredient_handler.rs + ingredient_dto.rs
│   ├── tag/          # tag_handler.rs + tag_dto.rs
│   ├── sentry_tunnel/# POST /sentry-tunnel — proxies frontend Sentry envelopes
│   └── openapi_spec/ # GET /openapi (raw spec JSON)
├── application/      # Business logic / services
│   ├── recipe/       # recipe_service.rs
│   ├── ingredient/   # ingredient_service.rs
│   └── tag/          # tag_service.rs
├── domain/           # Domain models + SeaORM entities
│   ├── entities/     # SeaORM-generated (do not edit manually)
│   ├── recipe/       # Recipe, RecipeId
│   ├── ingredient/   # Ingredient, IngredientId
│   ├── tag/          # Tag, TagId
│   └── recipe_ingredient/
└── infrastructure/   # AppState, error types, OpenAPI config, DB seeder, tracing init
```

**Request flow:** `api handler` → `application service` → SeaORM (via `AppState.db`)

### Key behaviours

- **Migrations run on startup** — `Migrator::up(&db, None)` runs before the server accepts requests. No manual migration step needed in dev.
- **Seeder** — `should_seed()` / `seed_all()` runs after migrations if the database is empty. Seeds recipe/ingredient/tag test data automatically.
- **AppState** — shared via Axum's `.with_state()`. Currently holds only the SeaORM `DatabaseConnection`.
- **IDs are UUIDs v7** — time-ordered, used for all entity primary keys.
- **Sentry guard** — initialised in `main.rs` before `tracing` and kept alive for the duration of the process. `SENTRY_DSN` unset = Sentry disabled (no-op), safe for local dev.

### Dev setup

See `server/README.md`. Requires Docker (for PostgreSQL) and `sea-orm-cli`. Set `DATABASE_URL` in a `.env` file in `server/`.

### Known issues / tech debt

- `server/README.md` documents a `handlers/`, `services/`, `repositories/` structure that no longer matches the actual code — the real layout is `api/`, `application/`, `domain/`, `infrastructure/`. README needs updating.

---

### 13. Error tracking (Sentry + GitLab integration)

> Status:
> - Frontend SDK + ErrorBoundary: **complete**
> - Sentry tunnel (`POST /sentry-tunnel`): **complete**
> - Backend `tracing` + Sentry: **complete**
> - GitLab Monitor integration: **planned**

**Using:** Sentry.io free tier (5k errors/month). Separate Sentry projects for frontend and backend.

---

#### Frontend — complete

- `@sentry/react` initialised in `src/main.tsx` with `tunnel: '/sentry-tunnel'`
- `Sentry.ErrorBoundary` wraps the app root — render crashes are caught and show a fallback UI instead of a blank page
- Unhandled JS errors and promise rejections captured automatically

**CI/CD variables (all set):**
- `VITE_SENTRY_DSN` — scoped per environment (`dev/client`, `prod/client`)
- `VITE_DEPLOY_ENV` — `development` / `production`, set in `workflow:rules`

**Known gotcha — Sentry inbound filters:** "Filter out events coming from localhost" is on by default and silently drops local dev events. Disable under **Sentry project → Settings → Inbound Filters** for local testing.

**Still to do:**
- Source maps — required before going live with real users so stack traces are readable in Sentry. Add `@sentry/vite-plugin` to `vite.config.ts`, set `SENTRY_AUTH_TOKEN` in GitLab CI variables.
- `browserTracingIntegration()` for page load / navigation tracing (low priority, deferred).

---

#### Sentry tunnel — complete

`POST /sentry-tunnel` on the Rust backend proxies frontend Sentry envelopes to `ingest.de.sentry.io`, bypassing ad blockers. Validates the DSN host and project ID from the envelope header before forwarding (prevents open proxy abuse).

**Environment variable:** `SENTRY_DSN_CLIENT` — the frontend DSN, used server-side for envelope validation.

---

#### Backend `tracing` + Sentry — complete

- `tracing` + `tracing-subscriber` for structured JSON logging, level controlled by `RUST_LOG`
- `sentry` + `sentry-tracing` — `tracing::error!()` events forwarded to Sentry automatically
- `#[tracing::instrument]` on handlers and services for span context in Sentry events

**Usage conventions:**
- `tracing::error!()` — forwarded to Sentry; use for unexpected failures
- `tracing::warn!()` — logged, not sent to Sentry by default
- `tracing::info!()` / `tracing::debug!()` — operational logs only

**CI/CD variables (all set):**
- `SENTRY_DSN` — scoped per environment (`dev/server`, `prod/server`)
- `RUST_LOG` — `warn` for prod, `debug` for dev
- `DEPLOY_ENV` — passed to the container via `docker run`

---

#### GitLab Monitor integration — planned

Surfaces Sentry errors inside GitLab without leaving the dashboard.

**Setup: GitLab project → Settings → Monitor → Error Tracking**
1. Select "Sentry" as provider
2. Enter Sentry API URL (`https://sentry.io/`) and a Sentry auth token (`project:read` scope)
3. Select the Sentry project (repeat for frontend and backend projects)

**What this gives you:** live errors in GitLab Monitor → Error Tracking, each linking back to the introducing commit via the `release` field.
