# Campus Events

Campus Events is a college event-management platform with role-based dashboards, registrations, QR check-in, notifications, and multi-college administration.

## Project layout

- `frontend/` — React and Vite application, deployable to Vercel.
- `backend/` — Express and MongoDB API, deployable to Render.
- `.env` — local-only configuration (never commit this file).

## Local development

1. Install Node.js 20 or newer and MongoDB (or create a MongoDB Atlas database).
2. Copy `.env.example` to `.env` and set `MONGODB_URI`.
3. Install dependencies from the repository root: `npm install`.
4. In one terminal, start the API: `npm run dev:server`.
5. In another terminal, start the frontend: `npm run dev`.
6. Open `http://localhost:5173`.

Run `npm run seed` to create or update the configured super-admin account after connecting MongoDB.

## Deployment

### Frontend — Vercel

Create a Vercel project with `frontend` as its Root Directory. Set `VITE_API_URL` to the public Render backend URL (for example, `https://your-api.onrender.com`), then deploy with build command `npm run build` and output directory `dist`.

### Backend — Render

Create a Render Web Service with `backend` as its Root Directory. Use build command `npm install` and start command `npm start`. Add the backend variables described in [SETUP.md](SETUP.md), including a MongoDB connection string and a `CORS_ORIGIN` equal to the Vercel site URL. Render supplies `PORT` automatically.

See [SETUP.md](SETUP.md) for the full environment-variable reference.
