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
| Components | Radix UI primitives |
| Notifications | Sonner |
| Icons | Lucide React |
| API codegen | Orval (OpenAPI → TypeScript) |
| Testing | Vitest + Testing Library + Playwright (via MCP) |
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
│   └── kochservice.schemas.ts
├── components/
│   └── ui/           # Radix-based primitives (Button, Input, Card, Combobox, etc.)
├── hooks/            # Global TanStack Query hooks — all server state lives here
│   ├── use-recipe.ts
│   ├── use-ingredient.ts
│   └── use-tag.ts
├── lib/
│   ├── api-client.ts # Raw fetch wrapper — target for axios migration
│   └── utils.ts
├── routes/           # TanStack Router file-based routing
│   ├── __root.tsx
│   ├── index.tsx
│   ├── recipe/
│   │   ├── $id.tsx
│   │   ├── new.tsx
│   │   └── use-new.ts  # ⚠️ see known issues
│   └── ...
└── styles.css
```

### Data flow convention

```
Orval-generated API fn  →  Global hook (src/hooks/)  →  Route/component
```

All server state is managed through the global hooks in `src/hooks/`. Components never call API functions directly.

### Key patterns

- **Cache-first recipe lookup** — `useRecipe` checks the infinite query cache before fetching individually
- **Infinite scroll + virtualisation** — home list uses `useInfiniteQuery` with row virtualisation
- **Preload on intent** — TanStack Router preloads routes on hover/focus

---

## Known Issues / Tech Debt

- **`use-new.ts` route warning** — TanStack Router emits a warning because `src/routes/recipe/use-new.ts` doesn't export a `Route`. The `routeFileIgnorePattern` config should exclude it but doesn't seem to match. Either rename to `-use-new.ts` or fix the ignore pattern.
- **Loading states are bare `<div>Loading...</div>`** — should be replaced with skeleton components (`src/components/ui/skeleton.tsx` exists).
- **No error boundaries** — unhandled query/render errors will crash the whole page.
- **Recipe images are non-functional** — the detail page renders `<img src="">` when no image is set, causing a React warning.
- **`npm install` instead of pnpm** — once caused a broken install. Always use pnpm.

---

## Planned Features

### 1. API client layer (Axios)

> Status: **planned** — not started

**Why:** The current `src/lib/api-client.ts` is a raw fetch wrapper that Orval's generated functions call directly. This means if we swap Orval, change codegen, or want to add cross-cutting behaviour (auth, error normalisation, logging, tracing, metrics), there's no single place to do it.

The goal is a **controlled HTTP boundary** — one place every request and response passes through. Axios is the implementation choice because it has first-class interceptor support. The generated Orval functions are an implementation detail; what matters is that they point at *our* client, not raw fetch.

**Abstraction stack (current):**
```
Components → Hooks → Orval-generated fns → api-client.ts (fetch) → Network
```

**Abstraction stack (target):**
```
Components → Hooks → Orval-generated fns → axios-client.ts → Network
                                                    ↑
                              interceptors: auth, errors, logging, tracing, metrics
```

Hooks and components don't change — they're already insulated. Only the transport layer changes.

**Planned approach:**
- Create `src/lib/axios-client.ts`: configured Axios instance (baseURL from `VITE_API_BASE`, timeout, default headers)
- Request interceptor: attach auth token (from AuthService, once built)
- Response interceptor: normalise errors into a consistent `ApiError` shape before they reach TanStack Query
- Update Orval config (`orval.config.ts`) to use a custom mutator pointing at the new Axios client instead of the fetch wrapper
- Future interceptors: logging, distributed tracing headers, metrics collection

**`ApiError` shape to define before implementing:**
```ts
interface ApiError {
  message: string
  status: number
  code?: string       // backend-defined error code for specific handling
}
```

**Open questions:**
- Token storage strategy: depends on AuthService design (see below) — implement interceptor stub first, wire token later
- Whether to keep `api-client.ts` as a thin re-export during transition or delete it immediately

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

**Infrastructure note:** This service will also be deployed to the self-hosted environment alongside the main backend and MinIO. Azure test deployment (see project notes) should include all three.

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

> Status: **in progress** — design exploration underway via Claude design feature

**Problem:** The current UI is functional but feels empty, wireframe-like, and uninviting. Even the developer doesn't want to use it. Nobody will adopt a recipe app they don't enjoy looking at, regardless of how well-built the underlying code is.

**Root causes of the "empty" feeling:**
- No images on recipe cards — everything looks like a list, not a collection of food
- No visual hierarchy — recipe names, metadata, and actions all have the same weight
- Default shadcn palette — reads as unfinished, no personality
- Low information density on cards — not enough reason to click

**UX goals (independent of visual style):**
- **Fast-feeling** — skeletons on load, optimistic updates on mutations, instant feedback on all interactions
- **Obvious** — user never wonders what to do next; clear affordances everywhere
- **Satisfying** — hover states, transitions, toasts that feel intentional, not bolted on
- **Rich cards** — recipe cards should show image, title, tags, and at minimum one piece of metadata (e.g. number of steps or ingredients)
- **Typography hierarchy** — recipe names, section headers, ingredient lists, step numbers all need distinct treatment

**Visual direction:**
TBD — being explored via Claude design feature. Document the output here once a direction is chosen (colour palette, typography, spacing scale, card design).

**Component library:**
The current stack (Radix UI primitives + Tailwind 4 + shadcn-style components) gives full control but requires building everything from scratch. If the design output points toward a richer, more opinionated visual style, switching to a more prebuilt component library (e.g. Mantine, Chakra UI, or a shadcn alternative with more built-in variants) may be the right call.

**Decision criteria for keeping vs. switching:**
- Keep Radix + Tailwind if the design is custom enough that prebuilt components would need heavy overriding anyway
- Switch if a library ships components that already look close to the target design out of the box — saves time and produces a more consistent result

**Constraints regardless of library choice:**
- Dark mode must remain supported
- All colours via CSS variables — no hardcoded values — so theming stays centralised
- Accessibility (Radix's main strength) must not regress

**Scope warning:** This will likely touch every layout file, most components, and possibly the routing structure if page layouts change significantly. Treat it as a full rewrite of the visual layer, not a reskin.

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

> Status: **partially in progress** — Sentry error tracking being implemented (§13). Full observability stack (Prometheus, Grafana, OpenTelemetry) is future work.

**Scope:** Covers all services — main Rust backend, image processing service, and frontend.

**Backend (Rust):**
- **Structured logging** — `tracing` crate with JSON output, log levels per environment (debug locally, warn/error in prod)
- **Distributed tracing** — trace IDs propagated across the main backend and image processing service so a single user request can be followed end-to-end. OpenTelemetry is the standard here.
- **Metrics** — request counts, error rates, latency histograms, image processing queue depth. Prometheus-compatible export (Rust has good support via `metrics` crate).

**Frontend:**
- The Axios interceptor layer (§1) is the natural place to attach trace IDs to outgoing requests and capture client-side error rates
- Sentry JS SDK handles unhandled errors and promise rejections automatically once installed (§13)

**Infrastructure (future):**
- Collector: OpenTelemetry Collector as a sidecar/agent
- Visualisation: Grafana for metrics + traces (pairs with Prometheus and Tempo/Jaeger). Self-hosted, fits the no-cloud-provider constraint.
- Log aggregation: Loki (also Grafana ecosystem, minimal overhead)

**When to add full stack:** After core features are stable and deployed. Good milestone: add it when the first real user outside the developer starts using the app.

---

### 12. Monorepo consolidation

> Status: **complete**

The frontend and Rust backend now live in a single monorepo. Both were imported via `git subtree` to preserve their full histories.

**Current structure:**
```
monorepo/
├── client/    # React + Vite frontend (was: standalone repo)
└── server/    # Rust backend / kochservice (was: standalone repo)
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
└── infrastructure/   # AppState, error types, OpenAPI config, DB seeder
```

**Request flow:** `api handler` → `application service` → SeaORM (via `AppState.db`)

### Key behaviours

- **Migrations run on startup** — `Migrator::up(&db, None)` runs before the server accepts requests. No manual migration step needed in dev.
- **Seeder** — `should_seed()` / `seed_all()` runs after migrations if the database is empty. Seeds recipe/ingredient/tag test data automatically.
- **AppState** — shared via Axum's `.with_state()`. Currently holds only the SeaORM `DatabaseConnection`.
- **IDs are UUIDs v7** — time-ordered, used for all entity primary keys.

### Dev setup

See `server/README.md`. Requires Docker (for PostgreSQL) and `sea-orm-cli`. Set `DATABASE_URL` in a `.env` file in `server/`.

### Known issues / tech debt

- `server/README.md` documents a `handlers/`, `services/`, `repositories/` structure that no longer matches the actual code — the real layout is `api/`, `application/`, `domain/`, `infrastructure/`. README needs updating.

---

### 13. Error tracking (Sentry + GitLab integration)

> Status: **in progress**
> - Frontend SDK: **complete**
> - Sentry tunnel (backend proxy): **next**
> - Backend `tracing` + Sentry: **next**
> - GitLab Monitor integration: **planned**

**Using:** Sentry.io free tier (5k errors/month). Separate Sentry projects for frontend and backend for cleaner filtering and independent quotas.

**Philosophy:** Sentry is the transport, not the instrumentation. The backend needs `tracing` to produce structured data; Sentry forwards `tracing::error!()` events automatically. The frontend needs error boundaries to catch render crashes; Sentry catches everything else (unhandled errors, promise rejections) via its global hooks.

---

#### Frontend — complete

**SDK:** `@sentry/react` installed. Init in `src/main.tsx` before React renders.

**Current config:**
```ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_DEPLOY_ENV ?? 'development',
  sendDefaultPii: false,
})
```

**Pipeline variables (all set):**
- `VITE_SENTRY_DSN` — GitLab CI/CD variable, scoped per environment (`dev/client`, `prod/client`)
- `VITE_DEPLOY_ENV` — set in root `workflow:rules` (`development` for dev branch, `production` for main); passed as Docker build arg

**What's captured automatically:** unhandled JS errors, unhandled promise rejections.

**Still missing on frontend:**
- `Sentry.ErrorBoundary` around the app root — render crashes currently show a blank page and are not reported
- Axios interceptor hook-in (when Axios is implemented — §1)
- `browserTracingIntegration()` for page load / navigation performance tracing (low priority)

**Known gotcha — Sentry inbound filters:** Sentry's "Filter out events coming from localhost" is enabled by default and silently drops local dev events even when the network request returns 200 with a valid event ID. Disable it under **Sentry project → Settings → Inbound Filters** for local testing.

**Tunnel (not yet implemented):** Ad blockers block direct requests to `ingest.de.sentry.io`. Until the tunnel is in place, disable your ad blocker for local dev. See tunnel section below.

---

#### Sentry tunnel — next

The tunnel is a single endpoint on the Rust backend (`POST /sentry-tunnel`) that proxies frontend error envelopes to Sentry's ingest. The frontend sends to your own domain instead of directly to Sentry, bypassing ad blockers entirely.

**Frontend change (`src/main.tsx`):**
```ts
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tunnel: '/sentry-tunnel',   // add this line
  environment: import.meta.env.VITE_DEPLOY_ENV ?? 'development',
  sendDefaultPii: false,
})
```

**Backend endpoint (`api/sentry_tunnel/`):**

The tunnel must validate that the envelope is destined for your own Sentry project (by checking the DSN host and project ID parsed from the envelope header) before forwarding, to prevent abuse as an open proxy.

```rust
// POST /sentry-tunnel
// 1. Read raw request body (the Sentry envelope)
// 2. Parse the first line of the envelope as JSON to extract the DSN
// 3. Validate the DSN host matches your known Sentry ingest host
// 4. Validate the project ID matches your known project ID
// 5. Forward the raw body to https://<sentry-host>/api/<project-id>/envelope/
//    with the same Content-Type header
// 6. Return Sentry's response upstream
```

**Crates needed:**
```toml
reqwest = { version = "0.12", features = ["json"] }  # likely already present or needed anyway
```

**Security:** Without the DSN/project ID validation in step 3–4, the endpoint is an open HTTP proxy. Always validate before forwarding.

**Environment variables:**
- `SENTRY_TUNNEL_DSN` — the frontend DSN, used server-side to validate incoming envelopes. Scoped per environment in GitLab CI.

---

#### Backend `tracing` + Sentry — next

**Crates to add to `server/Cargo.toml`:**
```toml
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
sentry = { version = "0.34", features = ["tracing"] }
sentry-tracing = "0.34"
```

**`tracing` setup — new file `server/src/infrastructure/tracing.rs`:**
```rust
pub fn init_tracing() {
    let sentry_layer = sentry_tracing::layer();

    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(fmt::layer().json())
        .with(sentry_layer)
        .init();
}
```
Use `.pretty()` instead of `.json()` for local dev readability — controlled via a `RUST_LOG_FORMAT=pretty` env var or a compile-time feature flag.

**Sentry init in `server/src/main.rs`:**
Sentry guard must be initialised before `tracing` and kept alive for the entire duration of `main` — dropping it early causes in-flight events to be lost on shutdown.

```rust
let _sentry_guard = sentry::init((
    std::env::var("SENTRY_DSN").unwrap_or_default(),
    sentry::ClientOptions {
        release: sentry::release_name!(),
        traces_sample_rate: 0.1,
        environment: Some(std::env::var("DEPLOY_ENV")
            .unwrap_or_else(|_| "development".into()).into()),
        ..Default::default()
    },
));
init_tracing();
```

Using `unwrap_or_default()` on the DSN means Sentry is simply disabled (no-op) when `SENTRY_DSN` is not set — useful for local dev without requiring the variable.

**Usage conventions:**
- `tracing::error!()` — forwarded to Sentry; use for unexpected failures
- `tracing::warn!()` — logged but not sent to Sentry by default
- `tracing::info!()` / `tracing::debug!()` — operational logs only, never sent to Sentry
- `#[tracing::instrument]` on handlers and service methods — attaches span context to every Sentry event so you can see which endpoint triggered the error

**Environment variables to add to the backend deploy job:**
- `SENTRY_DSN` — scoped per environment (`dev/server`, `prod/server`) in GitLab CI
- `RUST_LOG` — `warn` for prod, `debug` for dev (set in GitLab CI/CD variables)
- `DEPLOY_ENV` — already in `workflow:rules`; add `-e DEPLOY_ENV=$DEPLOY_ENV` to the `docker run` command in `backend:deploy`

---

#### GitLab Monitor integration — planned

Surfaces Sentry errors inside GitLab without leaving the dashboard.

**Setup: GitLab project → Settings → Monitor → Error Tracking**
1. Select "Sentry" as provider
2. Enter Sentry API URL (`https://sentry.io/`) and a Sentry auth token (create under Sentry user settings → API tokens, with `project:read` scope)
3. Select the Sentry project to link (do this twice — once for the frontend project, once for backend if using separate projects)

**What this gives you:**
- GitLab Monitor → Error Tracking shows live errors from Sentry
- Each error links back to the commit that introduced it via the `release` field
- Error status (resolved/ignored) manageable from GitLab

**Source maps (frontend — do this before going live with real users):**
Without source maps, Sentry stack traces point at minified bundle line numbers — useless for debugging. The Sentry Vite plugin uploads maps automatically at build time:
```bash
pnpm add -D @sentry/vite-plugin
```
Requires a `SENTRY_AUTH_TOKEN` CI variable and the org/project slugs in `vite.config.ts`. Source map files should be excluded from the nginx-served build (the plugin handles this).

