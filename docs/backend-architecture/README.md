# Haberry Arcade / Hub — Backend Architecture

## Overview

Haberry Arcade backend is structured as an enterprise-grade **Modular Monolith** built on **NestJS** and **Prisma ORM** with **PostgreSQL**. This architecture provides domain boundaries, high cohesion, low coupling, and an incremental migration path to microservices if scale requires it.

```mermaid
flowchart TD
    Client["Client Surfaces (Web Portal, Counter Desktop, Station Agent)"] --> Gateway["NestJS API Gateway / Ingress"]
    
    subgraph Core ["Core Infrastructure Layer"]
        DatabaseModule["DatabaseModule (PrismaService, Global)"]
        CommonModule["Common (Filters, Guards, Interceptors, Pipes)"]
    end
    
    subgraph DomainModules ["Domain Modules"]
        SuperAdmin["Platform & SuperAdmin Module\n- Authentication & Sessions\n- Platform Metrics & Cashflow\n- Organization Directory & Provisioning"]
        Identity["Identity & Access Module\n- Multi-tenant RBAC\n- Venue Staff Assignments\n- Device Tokens"]
        OrgVenues["Organizations & Venues Module\n- Store Calendars & Timezones\n- Station & Hardware Management"]
        Sessions["Gaming Sessions & Timers Module\n- Rate Snapshots\n- Active Session Tracking"]
        Billing["Finance & Checkout Module\n- Split Tender & UPI/Cash\n- Shift Reconciliation"]
        DeviceSync["Offline Sync Module\n- Outbox Event Replay\n- Idempotent Ingestion"]
    end
    
    Gateway --> DomainModules
    DomainModules --> Core
    DatabaseModule --> Postgres[(Managed PostgreSQL / Neon)]
```

## Architectural Principles

1. **Domain Isolation**:
   - Each business capability lives in its own NestJS module (`src/modules/*` or `src/database/`).
   - Modules communicate via exported services or typed events rather than directly accessing another module's database tables.

2. **Global Database Layer**:
   - `PrismaService` lives in `src/database/` and is exported via `@Global() DatabaseModule`.
   - Manages connection pooling, lifecycle hooks (`onModuleInit`, `onModuleDestroy`), and transactional consistency.

3. **Multi-Tenancy & Scoped Permissions**:
   - Tenant boundary is the `Organization`.
   - Operational boundary is the `Location` / `Venue`.
   - Super admin has cross-tenant platform visibility with strict auditing.

4. **Security & Session Management**:
   - `SuperAdminService` hashes credentials using `scrypt` with a cryptographically secure 16-byte salt and 64-byte key length.
   - Authentication tokens are 256-bit entropy (`randomBytes(32)`), stored as SHA-256 digests in `platform_sessions`.
   - Rate limiting protects against brute force attacks (windowed IP/account throttling).
   - Strict `httpOnly`, `sameSite: "strict"`, and secure cookie delivery in browser clients.

5. **Financial & Offline Safety**:
   - Money stored as integer minor units (e.g. cents/paise) with explicit ISO currency.
   - Local counters utilize an SQLite outbox with ordered sequence numbers and idempotent server ingestion.
