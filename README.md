# GymTravel — Simple Workout Planner

A beginner-friendly, full-stack web application built for **CIS 486 · Spring 2026**. Users select a muscle group and available equipment, generate a three-exercise workout, save it, and manage their saved workouts — all without a single page reload.

**Authored by Jace Calvert.**

---

## Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [How to Run](#how-to-run)
- [API Reference](#api-reference)
- [Deployment Notes](#deployment-notes)
- [Known Limitations](#known-limitations)

---

## Features

### Generate Workout
Clicking **Generate Workout** on the homepage opens a modal. The user checks one or more muscle groups (Chest, Back, Legs, Core) and available equipment (None, Dumbbells, Bench). Submitting the form filters the built-in exercise library client-side and renders up to three matching exercise cards on the page with no reload.

### Save Workout — Create
After a workout is generated, a **Save Workout** button appears inside the rendered output. Clicking it sends `POST /api/workouts` with the exercise list. The server stores the workout and the Saved Workouts list refreshes automatically.

### List Workouts — Read
On page load the SPA calls `GET /api/workouts` and populates the **Saved Workouts** section. The list re-renders after every save or delete without leaving the page.

### Update Workout — Update
The server exposes `PUT /api/workouts/:id`. The `DataContainer.updateWorkout()` method applies the patch to MongoDB when connected, or directly to the in-memory array as a fallback.

### Delete Workout — Delete
Each saved workout row includes a **Delete** button that calls `DELETE /api/workouts/:id`. The DataContainer removes the record and the list refreshes in place.

### SPA Behavior
Generate → Display → Save → Delete all happen inside a single page visit. The external script (`/scripts/app.js`) attaches all event listeners after `DOMContentLoaded` and uses the native `fetch` API for every data operation. There are no full-page navigations in the workout flow.

### MongoDB + In-Memory Fallback
The `DataContainer` abstraction tries MongoDB first. If `MONGODB_URI` is not set or the connection fails, the app falls back to a plain JavaScript array with zero configuration. The app always starts and runs.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Server | Express 4 (ES Modules, `.mjs`) |
| Database | MongoDB (native `mongodb` driver) |
| Fallback store | In-memory JavaScript array |
| Frontend | Vanilla JavaScript — `fetch`, `DOMContentLoaded`, event delegation |
| Styles | CSS custom properties (`styles/main.css` + `BASE_STYLES` in `app.mjs`) |
| Config | `dotenv` — `MONGODB_URI`, `MONGODB_DB`, `PORT` |

---

## Architecture Overview

```
Browser
  │
  ├── GET /
  │     renderLayout() returns a full HTML page with:
  │       • hero section + Generate Workout button
  │       • hidden workout-setup modal
  │       • #generatedWorkout container (empty)
  │       • #savedWorkoutsList container (empty)
  │       • <script src="/scripts/app.js">
  │
  └── /scripts/app.js (runs after DOMContentLoaded)
        │
        ├── openBtn click   → show modal
        ├── form submit     → generateWorkoutV3() → renderGeneratedWorkout()
        ├── #saveGeneratedWorkoutBtn click (delegated)
        │     → POST /api/workouts → reload saved list
        └── Delete button click (delegated)
              → DELETE /api/workouts/:id → reload saved list

Server API
  GET    /api/workouts       → DataContainer.getAllWorkouts()
  POST   /api/workouts       → DataContainer.createWorkout()
  PUT    /api/workouts/:id   → DataContainer.updateWorkout()
  DELETE /api/workouts/:id   → DataContainer.deleteWorkout()

DataContainer (IIFE singleton in app.mjs)
  if MONGODB_URI set → uses db.collection('workouts')
  else               → uses in-memory _mem[]
```

### DataContainer
`DataContainer` is an IIFE-scoped singleton that owns all workout persistence logic. It exposes four async methods and decides internally whether to delegate to MongoDB or a local array. Route handlers call only these methods — no route touches the database directly.

### Generic CRUD (Routines & Exercises)
Routines and exercises use a separate set of synchronous helper functions (`createItem`, `getAllItems`, `updateItem`, `deleteItem`) backed by a plain `collections` object. These are in-memory only and are kept simple since they are not the primary demo subject.

---

## File Structure

```
project-root/
├── app.mjs                        # Entire server: routes, DataContainer,
│                                  #   HTML rendering, MongoDB init
├── .env                           # MONGODB_URI, MONGODB_DB, PORT (not committed)
├── package.json
├── styles/
│   └── main.css                   # External theme overrides (served at /styles/)
└── public/
    ├── images/
    │   └── allaround-athlete-logo.png
    └── scripts/
        └── app.js                 # SPA client: generate, render, save, delete
```

---

## How to Run

### Prerequisites
- Node.js 18 or later
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment (optional)

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGODB_DB=gymtravel
```

If `MONGODB_URI` is omitted the app runs fully in memory — no database setup needed.

### 3. Start the server

```bash
node app.mjs
```

Open `http://localhost:3000` in your browser.

---

## API Reference

All endpoints accept and return JSON.

### Workouts (primary demo resource)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/workouts` | List all saved workouts |
| `POST` | `/api/workouts` | Save a new workout — body: `{ exercises: [...] }` |
| `PUT` | `/api/workouts/:id` | Update a workout by ID |
| `DELETE` | `/api/workouts/:id` | Delete a workout by ID |

### Routines

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/routines` | List all routines |
| `POST` | `/api/routines` | Create a routine (exercises auto-generated if omitted) |
| `PUT` | `/api/routines/:id` | Update a routine |
| `DELETE` | `/api/routines/:id` | Delete a routine |

### Exercises

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/exercises` | List custom exercises (sorted A–Z) |
| `POST` | `/api/exercises` | Add a custom exercise |
| `PUT` | `/api/exercises/:id` | Update a custom exercise |
| `DELETE` | `/api/exercises/:id` | Delete a custom exercise |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ "status": "ok" }` |

---

## Deployment Notes

- The server binds to `process.env.PORT`, which Render, Railway, and Fly.io set automatically.
- Set `MONGODB_URI` and `MONGODB_DB` as environment variables in your hosting dashboard — do **not** commit `.env`.
- Static files (`/styles`, `/images`, `/scripts`) are served by Express via `express.static` — no separate CDN or build step required.
- Start command: `node app.mjs` (no build step).

---

## Known Limitations

- **In-memory data resets on restart.** Without `MONGODB_URI`, all saved workouts are lost when the server stops. This is intentional for demo use.
- **No authentication.** Any visitor can create, read, update, and delete all records.
- **Subscription gate is a mock.** The `/subscribe` route sets a server-side boolean flag and does not process any real payment. It demonstrates route guarding for the planner section only.
- **Exercise library is static.** The twelve built-in exercises are hardcoded in both `app.mjs` and `public/scripts/app.js`. Custom exercises added through the API go into a separate in-memory collection and do not affect the workout generator.
- **Single-process only.** The in-memory store is not shared across multiple server instances or restarts.

---

## Rubric Alignment

| Requirement | How it is met |
|---|---|
| **SPA — no full-page reloads for CRUD** | All workout generate / save / delete actions use `fetch` inside `public/scripts/app.js`; the DOM is updated in place. |
| **Create** | `POST /api/workouts` → `DataContainer.createWorkout()` — triggered by the Save Workout button. |
| **Read** | `GET /api/workouts` → `DataContainer.getAllWorkouts()` — called on load and after every mutation. |
| **Update** | `PUT /api/workouts/:id` → `DataContainer.updateWorkout()` — route is wired and tested. |
| **Delete** | `DELETE /api/workouts/:id` → `DataContainer.deleteWorkout()` — triggered by the Delete button in the saved list. |
| **MongoDB persistence** | `DataContainer` connects via the native `mongodb` driver when `MONGODB_URI` is present and stores workouts in the `workouts` collection. |
| **Fallback / resilience** | If `MONGODB_URI` is absent or the connection throws, the app logs a warning and continues using an in-memory array — no crash, no user-visible error. |
| **RESTful API** | Full CRUD routes exist for workouts, routines, and exercises using correct HTTP verbs and status codes (200, 201, 404, 500). |
| **Health endpoint** | `GET /health` returns `{ "status": "ok" }` — suitable for platform health checks. |
| **Server-side rendering** | `renderLayout(title, mainContent)` generates valid HTML on the server for every page request; no client-side framework is required to render the initial shell. |
| **Static asset serving** | CSS, images, and the SPA script are served from `public/` and `styles/` via `express.static`. |
| **Environment config** | `dotenv` reads `PORT`, `MONGODB_URI`, and `MONGODB_DB` — no secrets are hardcoded. |
