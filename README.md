# Planora — SaaS Event Management & Ticketing Platform

**Planora** is a modern, high-fidelity SaaS Event Management and Ticketing Platform designed for corporate workspaces, local organizations, and communities to plan, host, and monetize events.

This codebase consists of a robust TypeScript-Express backend API and a fast Vite-React frontend web application styled with Tailwind CSS v4, built for portfolio presentation and production readiness.

---

## 🌟 Premium Features

### 1. Advanced Scroll-Physics Navbar
- **Collapsible Floating Pill**: A sticky header bar that dynamically contracts from a full-width header (`72rem`) into a centered glassmorphic rounded pill (`44rem`) with a backdrop blur and offset shadows on scroll.
- **Top-Level Transparency**: Set to fully transparent at `top-0` to blend with the hero folding graphic, instantly snap-expanding back when scrolled to the top.
- **Hover-to-Reveal tooltips**: Glassmorphic "Planning" and "Categories" dropdown panels with continuous hover padding bridges preventing mouseleave gaps.

### 2. Immersive Visual Layouts
- **Full-Bleed Graphic Backgrounds**: Features a detailed landscape cover image aligned to the viewport height (`h-screen`) of the first fold, fading out cleanly via linear opacity blends.
- **SaaS Mockup Previews**: A dual-card visual grid showing an interactive dark analytics card (94.2% community engagement) alongside high-contrast featured event cover thumbnails.
- **Clean Signature Typography**: Imports Fustat and Schibsted Grotesk for display headings, Inter for interface elements, and Caveat cursive signatures for elegant visual highlights.

### 3. Core Event Functions
- **Role-Based Control**: Three distinct account portals: Super Admins (Platform-wide controls), Org Admins (workspace-specific hosting boundaries), and Users/Hosts.
- **Ticketing & Payments**: Integrations for free RSVPs and paid ticket pricing models.
- **QR-Code Ticket Check-ins**: Built-in QR scanners for front-gate ticket verification.
- **watermark footer Parallax**: A giant watermark container positioned underneath a multi-column SaaS footer (with Newsletter signups, Brand columns, and social widgets) that collapses dynamically during scroll.

---

## 🛠️ Technology Stack & Languages

### Languages
- **TypeScript (ESNext)**: Strong compiler checking and type definitions across frontend and backend layers.
- **JavaScript (ES2022)**: Modern ES-modules (`type: module`).
- **HTML5 & CSS3**: Semantic markups and Tailwind integration.

### Frontend (React application)
- **React 19**: Modern component lifecycle, hooks, and contexts.
- **Vite 6**: Next-generation frontend bundler for high-speed Hot Module Replacement (HMR).
- **Tailwind CSS v4**: High-performance CSS compiler with native `@theme` directives and nested layout utility variables.
- **Framer Motion (`motion/react`)**: Spring physics, layout transformations, and `AnimatePresence` enter/exit transitions.
- **Recharts**: Responsive SVG charts representing event registrations and ticketing revenue metrics.
- **GSAP (GreenSock)**: Micro-interaction animations.
- **Three.js & OGL**: 3D web-graphics support.
- **Lucide React**: Modern SVG icon library.

### Backend (Node API)
- **Node.js**: Asynchronous backend server runtime environment.
- **Express.js**: Lightweight REST API framework with MVC routing structures.
- **MongoDB & Mongoose ODM**: Document database with schema models, indexing, and validation filters.
- **JSON Web Tokens (JWT)**: Secure state auth cookies.
- **bcryptjs**: Secure cryptographic password hashing.
- **Cors & Helmet**: API routing security policies.

---

## 🚀 Local Setup

### 1. Prerequisites
- **Node.js** (v20 or newer)
- **MongoDB** (Local daemon or MongoDB Atlas URL)

### 2. Installation
Clone the repository and install dependencies from the root folder:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/planora
JWT_SECRET=your_jwt_signing_secret_here
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### 4. Seed Seed Data
Populate the database with demo accounts, organizations, and events:
```bash
npm run seed
```

### 5. Running the Dev Environment
Start both services in parallel:
- In Terminal 1 (Start API): `npm run dev:server`
- In Terminal 2 (Start Frontend): `npm run dev`
- Open `http://localhost:5173` in your browser.
