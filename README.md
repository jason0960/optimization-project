# Pallet Optimization Project

A pallet optimization builder with a **JavaScript + Three.js front-end** and a **Java back-end** that runs the 3D bin-packing / optimization algorithms.

## Architecture

```
┌─────────────────────────┐        HTTP / JSON         ┌─────────────────────────┐
│  Front-end (this repo)  │ ─────────────────────────▶ │  Java back-end service  │
│  - HTML / JS            │ ◀───────────────────────── │  - Spring Boot REST API │
│  - Three.js 3D viewer   │      placements + stats    │  - Optimization engine  │
└─────────────────────────┘                            └─────────────────────────┘
```

- **Front-end** handles data entry, 3D rendering, and result display.
- **Back-end (Java)** handles all optimization math, persistence, and exposes a REST API.

---

## Backlog

Points use a Fibonacci scale (1, 2, 3, 5, 8, 13). Total: **~110 pts**.

### Epic 1 — Project setup & tooling  *(Total: 8 pts)*

- [x] **SETUP-1** · Initialize npm project and install Three.js · **2 pts**
- [x] **SETUP-2** · Add Vite (or similar) dev server with hot reload · **2 pts**
- [ ] **SETUP-3** · Scaffold Java back-end (Spring Boot + Gradle/Maven) · **3 pts**

### Epic 2 — Front-end: Data entry & controls  *(Total: 16 pts)*

- [x] **FE-1** · Build pallet config form (width, depth, max height, max weight) · **2 pts**
- [x] **FE-2** · Build add/edit/delete item table (SKU, dims, weight, qty) · **5 pts**
- [x] **FE-3** · Add constraints UI (rotatable, fragile, stackable) · **3 pts**
- [x] **FE-4** · CSV/JSON import for bulk item loading · **3 pts**
- [ ] **FE-5** · Form validation & inline error messages · **2 pts**
- [ ] **FE-6** · Loading / disabled state while optimization runs · **1 pt**

### Epic 3 — Front-end: 3D pallet viewer (Three.js)  *(Total: 21 pts)*

- [ ] **FE-7** · Scaffold Three.js scene, camera, renderer, lighting · **3 pts**
- [ ] **FE-8** · Add OrbitControls (rotate / zoom / pan) · **2 pts**
- [ ] **FE-9** · Render pallet base mesh from user dimensions · **2 pts**
- [ ] **FE-10** · Render placed items as colored boxes at correct positions · **5 pts**
- [ ] **FE-11** · Deterministic per-SKU color assignment · **2 pts**
- [ ] **FE-12** · Highlight/select individual items in scene · **3 pts**
- [ ] **FE-13** · Toggle layer visibility (inspect stacking) · **2 pts**
- [ ] **FE-14** · Animate items "dropping" into place · **2 pts**

### Epic 4 — Front-end: Results panel  *(Total: 8 pts)*

- [ ] **FE-15** · Summary metrics (utilization %, items placed, stability) · **3 pts**
- [ ] **FE-16** · Placement list with click-to-highlight in scene · **3 pts**
- [ ] **FE-17** · Unplaced items warning panel · **2 pts**

### Epic 5 — Front-end ↔ Back-end integration  *(Total: 8 pts)*

- [ ] **INT-1** · Implement `OptimizationService` API client · **3 pts**
- [ ] **INT-2** · Wire Run button → API call → scene + results update · **2 pts**
- [ ] **INT-3** · Error handling + request cancellation (AbortController) · **2 pts**
- [ ] **INT-4** · Environment-driven API base URL config · **1 pt**

### Epic 6 — Back-end: Java REST API  *(Total: 13 pts)*

- [ ] **BE-1** · Define request/response DTOs (pallet, item, placement, stats) · **2 pts**
- [ ] **BE-2** · `POST /api/optimize` endpoint wired to optimizer service · **3 pts**
- [ ] **BE-3** · Request validation (Jakarta Bean Validation) · **2 pts**
- [ ] **BE-4** · Global exception handler with structured error responses · **2 pts**
- [ ] **BE-5** · Enable CORS for local front-end dev · **1 pt**
- [ ] **BE-6** · OpenAPI / Swagger UI documentation · **3 pts**

### Epic 7 — Back-end: Optimization engine  *(Total: 21 pts)*

- [ ] **BE-7** · Choose & integrate a 3D bin-packing approach (e.g., EB-AFIT, OR-Tools Java, custom heuristic) · **5 pts**
- [ ] **BE-8** · Implement pallet + item domain model · **3 pts**
- [ ] **BE-9** · Core placement algorithm (first-fit-decreasing or similar) · **8 pts**
- [ ] **BE-10** · Support item rotation constraints · **2 pts**
- [ ] **BE-11** · Compute stats: volume/weight utilization, stability score · **3 pts**

### Epic 8 — Back-end: Persistence  *(Total: 8 pts)*

- [ ] **BE-12** · Add database (Postgres or H2 for dev) + Flyway migrations · **3 pts**
- [ ] **BE-13** · `GET /api/layouts` and `POST /api/layouts` endpoints · **3 pts**
- [ ] **BE-14** · Repository + service layer with JPA entities · **2 pts**

### Epic 9 — Testing  *(Total: 8 pts)*

- [ ] **TEST-1** · Front-end unit tests (Jest/Vitest) for utils & components · **3 pts**
- [ ] **TEST-2** · Back-end unit tests for optimizer (JUnit 5) · **3 pts**
- [ ] **TEST-3** · Integration test for `POST /api/optimize` (MockMvc) · **2 pts**

### Epic 10 — DevOps & polish  *(Total: 8 pts)*

- [ ] **OPS-1** · Dockerfile for Java back-end · **2 pts**
- [ ] **OPS-2** · `docker-compose.yml` (front-end + back-end + DB) · **3 pts**
- [ ] **OPS-3** · GitHub Actions CI (lint, test, build) · **3 pts**

---

## Suggested milestone order

1. **M1 — Walking skeleton** (Epics 1, 6 partial, 5 partial): end-to-end request works with a stub optimizer that returns dummy placements.
2. **M2 — Usable MVP** (Epics 2, 3, 4, 7): real optimization + 3D rendering.
3. **M3 — Production-ready** (Epics 8, 9, 10): persistence, tests, containerization.

---

## Tech stack

**Front-end**
- HTML / vanilla JS (ES modules)
- [Three.js](https://threejs.org/) for 3D rendering
- Vite for dev server / bundling

**Back-end**
- Java 21 + Spring Boot 3
- Gradle or Maven
- PostgreSQL (H2 for local dev)
- Optimization: TBD (Google OR-Tools Java bindings, EB-AFIT port, or custom heuristic)


## Future hotfixes

- **Item row inputs don't sync back to `this.items`** (`controls.js` — `addItem`): When a user edits a field in an item row (e.g. changes the width after adding), the new value is not written back to the `this.items` array. `getPayload()` will return the original values from when the row was created. Fix: add `input` event listeners on each row's fields inside `addItem()` that update the matching item in `this.items` by id.