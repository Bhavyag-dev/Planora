# Workspace Rules & Context — Planora SaaS

This workspace contains Planora, a minimal multi-tenant Event Management SaaS MVP. Developers and AI coding assistants should reference this context and follow the rules below when working on this project.

---

## 🏗️ Architecture & Concepts

### 1. Database & Multi-Tenancy (Multi-Workspace)
- **Separate Database**: The application uses the `planora` database on the MongoDB server/cluster to keep it separated from the old campus events database. The connection string is managed via `MONGODB_URI` in `.env`.
- **Global Users**: Users (`User` schema) are global entities. Platform-wide super-admin roles are deprecated.
- **Scoped Roles**: Roles (`owner` vs `member`) are scoped specifically to individual organizations/workspaces. An organization (`Organization` schema) has a `members` array containing:
  ```typescript
  members: [{
    user: { type: ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'member'] }
  }]
  ```
- **Active Workspace Context**: The frontend manages the active organization selection via `WorkspaceContext` (`frontend/src/context/WorkspaceContext.tsx`) and persists the selected workspace ID in `localStorage` under `activeWorkspaceId`.

### 2. Events & Registrations
- **Workspace-isolated Events**: By default, dashboard operations query events scoped to the active workspace (`/api/events?organizationId=<id>`).
- **Landing Page Compatibility**: To keep the public landing page (`Landing.tsx`) intact, the endpoint `/api/events` (called without an `organizationId` query parameter) will return all published events (`status === 'published'`) across all organizations.
- **Registrations (RSVP)**: The simplified registration model is just a link between `User` and `Event` documents (`Registration` schema). E-commerce ticket transactions, hourly email reminders, and QR code scanner pages are fully deprecated.

---

## 📜 Development Guidelines & Constraints

### ⚠️ Landing Page Lock
> [!IMPORTANT]
> Do **NOT** modify, edit, or replace the public landing page ([Landing.tsx](file:///Users/bhavyag/Projects/CampusFlow/frontend/src/pages/Landing.tsx)).
> Keep the current landing page exactly as it is, including its copy, structure, glassmorphic floating scroll pill header, and watermarked parallax footer.

### ⚙️ Incremental Commit Flow
> [!TIP]
> Keep changes small, self-contained, and buildable.
> Commit incrementally to GitHub using **Conventional Commit** conventions (e.g., `feat(frontend): ...`, `refactor(backend): ...`, `cleanup(frontend): ...`).

### ✍️ Clean & Meaningful Code Comments
- **No Bulky ASCII Banners**: Avoid bulky box-drawing characters (`╔`, `═`, `║`, `╚`, etc.) and multi-line decorative dividers.
- **Intent-Driven & Concise**: Write minimal, informative comments that explain non-obvious logic, complex math/shaders, or architecture decisions for other developers.
- **Maintain Readability**: Keep comments clean, short, and close to the code they describe.

### 🛠️ Verification Commands
Before pushing changes, ensure there are no compilation errors:
- Compile backend & frontend types:
  ```bash
  npm run lint
  ```
- Production build:
  ```bash
  npm run build
  ```
- Reset & Seed Database:
  ```bash
  npm run seed
  ```

