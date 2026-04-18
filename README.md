# Kochservice

A recipe management platform built to enterprise-grade standards as a learning exercise. The app itself is intentionally small (~7 recipes), but every architectural decision is made as if it were production software serving real users.

## What it is

Kochservice lets users create, browse, and manage recipes. The long-term vision includes a review/approval workflow, photo uploads, role-based access control, and a full observability stack — all built from scratch to learn how these systems actually work.

## Monorepo structure

```
monorepo/
├── client/    # React + Vite frontend
└── server/    # Rust + Axum backend (kochservice)
```

Each subdirectory has its own README with local setup instructions:
- [client/README.md](client/README.md) — frontend dev setup
- [server/README.md](server/README.md) — backend dev setup

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TanStack Router + Query + Form |
| Styling | Tailwind CSS 4, Radix UI primitives |
| API client | Orval (OpenAPI → TypeScript codegen) |
| Backend | Rust, Axum, Tokio |
| ORM | SeaORM |
| Database | PostgreSQL |
| API docs | utoipa + Scalar (available at `/scalar`) |
| Package manager | pnpm (frontend) |

## Environments

| Environment | Frontend | Backend |
|---|---|---|
| Production | https://kochservice.golemt.org | port 8080 |
| Dev | https://dev-kochservice.golemt.org | port 8180 |

## Planned features

- Auth0 authentication (httpOnly cookie / BFF pattern)
- Recipe state machine (draft → review → published)
- Photo uploads with async image processing + virus scanning
- Admin panel with review queue
- Observability (structured logging, distributed tracing, Prometheus metrics)

See [CLAUDE.md](CLAUDE.md) for detailed planning notes on each feature.
