# Planora — Workspace Event SaaS MVP

**Planora** is a modern, high-fidelity Event Management SaaS designed for corporate workspaces, local organizations, and communities to plan, host, and share events within structured workspaces.

This codebase consists of a robust TypeScript-Express backend API and a fast Vite-React frontend web application styled with Tailwind CSS v4, built for portfolio presentation and production readiness.

---

## 🌟 Premium SaaS MVP Features

### 1. Multi-Tenant Workspaces (Organizations)
- **Flexible Management**: Users can create and belong to multiple workspaces, seamlessly switching between them via a sidebar dropdown.
- **Workspace-isolated Events**: Events are tied strictly to their respective workspaces, keeping communications and event schedules separated.
- **Team Invitations**: Workspace owners can invite other registered users to join their workspace by email.

### 2. Unified Workspace Dashboard
- **Onboarding Flow**: Users without active organizations are guided to configure their initial workspace name.
- **Members List**: Displays workspace members and their workspace-specific roles (`owner` vs `member`).
- **Interactive Event Scheduler**: Workspace members can schedule new events using a clean form modal.
- **Global Event Feed**: Users can browse published events in their active workspace or switch to global discovery to see public happenings across all workspaces.

### 3. High-Fidelity UI & Typography
- **Advanced Scroll-Physics Navbar**: Collapses from a full-width header into a glassmorphic rounded pill with backdrop blur on scroll (preserved from the original landing page).
- **Light/Dark Canvas Theme**: Uses a clean off-white canvas theme (`#fbfbfb`) for auth pages and the public landing page, blending with a dark glassmorphic interface for the authenticated workspaces area.
- **Sleek Fonts**: Combines Fustat and Schibsted Grotesk for display headings, Inter for interface elements, and Caveat cursive signatures for visual highlights.

---

## 🛠️ Technology Stack

### Backend API
- **Node.js & Express**: Lightweight, type-safe REST API server runtime.
- **MongoDB & Mongoose ODM**: Document database with schema indexing, validation filters, and member relationships.
- **JSON Web Tokens (JWT)**: Client-side session tokens with secure verification.

### Frontend Client
- **React 19 & Vite 6**: React framework bundled with high-speed HMR for instant visual feedback.
- **Tailwind CSS v4**: Theme customization using CSS variables and utility classes.
- **Framer Motion (`motion/react`)**: Spring-physics micro-interactions and workspace modal transitions.
- **Lucide React**: Modern SVG icon library.

### 🗂️ Codebase Languages & Formats

This repository leverages the following programming, markup, styling, configuration, scripting, query, and infrastructure languages/formats:

| Category | Language / Format | Usage & Purpose |
| :--- | :--- | :--- |
| **Programming Languages** | **TypeScript** (`.ts`, `.tsx`) | Core language for backend server logic (`server.ts`, seed scripts, database schemas, routes, middleware) and frontend React interactive UI components (`App.tsx`, pages, components). |
| **Markup Languages** | **HTML5** (`.html`), **Markdown** (`.md`), **SVG** (`.svg`) | HTML is used for the application entry point (`index.html`). Markdown is used for documentation (`README.md`, `SETUP.md`, `.agents/AGENTS.md`). SVG (XML-based) is used for the vector graphics favicon (`favicon.svg`). |
| **Styling Languages** | **CSS3** (`.css`) | Used for global and component-specific styles (`index.css`, `Aurora.css`, `MagicBento.css`) integrated with Tailwind CSS v4 directives. |
| **Configuration Languages** | **JSON** / **JSONC** | Used for dependency and task management (`package.json`, `package-lock.json`), TypeScript compiler settings (`tsconfig.json`), and app metadata (`metadata.json`). |
| | **Dotenv** | Declares backend config variables and environment parameters (`.env`, `.env.example`). |
| | **Gitignore Path-spec** | Defines untracked files and folders to exclude from version control (`.gitignore`). |
| **Scripting Languages** | **Shell Scripting** (`sh`/`bash` commands) | Used to chain package script tasks (e.g. concurrent dev servers, build pipelines, database seeding) in `package.json`. |
| **Query Languages** | **MongoDB Query Language** (MQL) | Database query operations integrated via Mongoose ODM helper methods in the backend routes and controllers. |
| **Infrastructure / Build Languages** | **Vite Config (ESM / TS)** | Defines build, alias resolver, and HMR dev-server configurations (`vite.config.ts`). |

---

## 🚀 Local Setup

### 1. Prerequisites
- **Node.js** (v20 or newer)
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)

### 2. Installation
Clone the repository and install workspace dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/planora
JWT_SECRET=your_jwt_signing_secret_here
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Seeding
Populate the separate `planora` database with initial test user, workspaces, and demo events:
```bash
npm run seed
```
- **Test User Credentials**:
  - Email: `admin@campusevents.com`
  - Password: `admin12345`

### 5. Running local servers
Start the backend and frontend concurrently:
```bash
# Terminal 1 (Run Backend server)
npm run dev:server

# Terminal 2 (Run Frontend Vite client)
npm run dev
```
Open `http://localhost:5173` in your browser.
