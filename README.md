# Rust Backend - Kochservice

Backend für eine Rezepte-Plattform gebaut mit Rust, Axum, SeaORM und PostgreSQL.

## Prerequisites

- Rust (latest stable)
- Docker & Docker Compose
- SeaORM CLI: `cargo install sea-orm-cli`

## Development Setup

### 1. Datenbank starten
```bash
docker-compose up -d
```

### 2. Environment Variables

Erstelle eine `.env` Datei im Root:
```
DATABASE_URL=postgresql://sa:test@localhost:5123/kochservice
```

### 3. Migrations ausführen

Für die Migrations muss die Datenbank laufen (siehe Punkt 1.)

```bash
# Alle Migrations ausführen
sea-orm-cli migrate up

# Neue Migration erstellen
sea-orm-cli migrate generate <migration_name>

# Migration rückgängig machen
sea-orm-cli migrate down
```

### 4. Entities generieren

Nach jeder Migration die Entities neu generieren:
```bash
sea-orm-cli generate entity -o src/domain/entities
```

### 5. Server starten
```bash
cargo run
```

Server läuft auf: `http://localhost:3000`   
API Dokumentation: `http://localhost:3000/scalar`

## Projekt-Struktur
```
src/
├── domain/          # Domain Models & Entities
│   ├── entities/    # Von SeaORM generiert
│   ├── tag/
│   ├── ingredient/
│   └── recipe/
├── handlers/        # HTTP Handler
├── services/        # Business Logic
├── repositories/    # Database Access
└── infrastructure/  # OpenAPI, Config, etc.
```

## Tech Stack

- **Web Framework:** Axum
- **ORM:** SeaORM
- **Database:** PostgreSQL
- **API Docs:** utoipa + Scalar
- **Async Runtime:** Tokio