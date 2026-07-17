# Setup guide

## Local configuration

1. Copy `.env.example` to `.env` in the repository root.
2. Replace every placeholder with your own value. Do not commit `.env`.
3. Install dependencies with `npm install`.
4. Start the API with `npm run dev:server` and the frontend with `npm run dev`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string for application data. |
| `JWT_SECRET` | Yes | Cryptographic key used to sign login tokens. |
| `SUPER_ADMIN_EMAIL` | Yes | Email address assigned to the seed super-admin account. |
| `SUPER_ADMIN_PASSWORD` | Yes | Initial/reset password used by the super-admin seed command. |
| `PORT` | Local only | HTTP port for the API; defaults to `8080`. |
| `CORS_ORIGIN` | Yes | Comma-separated allowed frontend origins. |
| `APP_URL` | Recommended | Public frontend URL used in email links. |
| `VITE_API_URL` | Yes | Public API base URL used by the frontend. |
| `EMAIL_HOST` | Optional | SMTP server hostname for notification emails. |
| `EMAIL_PORT` | Optional | SMTP server port, usually `587` or `465`. |
| `EMAIL_USER` | Optional | SMTP account username. |
| `EMAIL_PASS` | Optional | SMTP account password or app password. |
| `EMAIL_FROM` | Optional | Sender address shown on notification emails. |
| `DEMO_ADMIN_PASSWORD` | Optional | Password used only by the demo-data seed script. |
| `DEMO_STUDENT_PASSWORD` | Optional | Password used only by the demo-data seed script. |

## Database and admin setup

Set `MONGODB_URI`, then run `npm run seed`. This creates the configured super-admin if it does not exist, or updates its role and password if it already exists. The optional `npm run seed:demo` command requires both demo-password variables.

## Deploying to Vercel and Render

Deploy the API first. On Render, create a Node Web Service with `backend` as the Root Directory, build command `npm install`, and start command `npm start`. Configure all required backend variables in the Render dashboard; do not upload `.env`. Set `CORS_ORIGIN` to the final Vercel URL and `APP_URL` to that same URL.

On Vercel, create a project with `frontend` as its Root Directory. Configure `VITE_API_URL` to the Render service URL, without a trailing slash. Use `npm run build` as the build command and `dist` as the output directory. Redeploy the frontend whenever `VITE_API_URL` changes.
