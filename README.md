<div align="center">
  <h1>📝 Memoir Notes</h1>
  <p><strong>Your personal notes, organized in one place.</strong></p>
</div>

## 🌟 Overview

**Memoir Notes** is a full-stack notes application for capturing ideas with minimal friction. Users sign up, sign in, and manage notes that belong only to them—each note supports a title, body, optional tags, and pinning for quick access. The app pairs a fast React SPA with a secure Express API backed by MongoDB, using JWT access tokens, httpOnly refresh cookies, and automatic token refresh when the access token expires.

## Snapshot 📸

<img width="1920" height="1080" alt="Memoir Notes Visual (38)" src="https://github.com/user-attachments/assets/a17bf44a-6aec-45fa-bea0-99650b7133b5" />


## 🛠 Tech Stack

### Frontend

- [React](https://react.dev) – UI with function components and hooks.
- [Vite](https://vitejs.dev/) – Dev server and production builds.
- [TypeScript](https://www.typescriptlang.org/) – Typed components and API layer.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling.
- [React Router](https://reactrouter.com/) – Public vs protected routes, deep links to individual notes.
- [Axios](https://axios-http.com/) – HTTP client with `Authorization` headers and refresh-retry logic.
- [Zod](https://zod.dev/) – Client-side validation aligned with API expectations.
- [Sonner](https://sonner.emilkowal.ski/) – Toast notifications.
- [React Icons](https://react-icons.github.io/react-icons/) – Icon set.

### Backend

- [Node.js](https://nodejs.org/) – Runtime.
- [Express](https://expressjs.com/) – REST API (`/api/auth`, `/api/user`, `/api/notes`).
- [TypeScript](https://www.typescriptlang.org/) – Typed controllers and middleware.
- [Swagger/OpenAPI 3.0](https://swagger.io/) – Interactive API documentation with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express).
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) – User and note persistence.
- [JWT](https://jwt.io/) – Short-lived access tokens; refresh tokens stored server-side and in httpOnly cookies.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Password hashing.
- [Zod](https://zod.dev/) – Request validation on create/update flows.
- [Upstash Redis](https://upstash.com/) – Sliding-window rate limits on auth endpoints via [@upstash/ratelimit](https://github.com/upstash/ratelimit-js).
- [cookie-parser](https://github.com/expressjs/cookie-parser) & [cors](https://github.com/expressjs/cors) – Cookies and cross-origin configuration for the SPA.

## 🚀 Key features

- **Authentication** – Sign up and login with validated payloads; access token in memory (`localStorage`); refresh token in an httpOnly cookie.
- **Session resilience** – Axios interceptor calls `/auth/refresh` on 401 and retries the original request when refresh succeeds.
- **Notes CRUD** – List, create, read, update, and delete notes scoped to the logged-in user.
- **Rich note metadata** – Optional tags and pinned notes for organization.
- **Protected experience** – Landing, login, and signup are public; the home grid and single-note views require auth.
- **Rate limiting** – Auth routes are throttled to reduce brute-force and abuse (Upstash).

## 📚 API Documentation

Interactive API documentation is available via **Swagger UI** when the backend is running:

- **Development**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- **Production**: [https://memoir-notes-production.up.railway.app/api-docs](https://memoir-notes-production.up.railway.app/api-docs)

The documentation includes:
- Complete endpoint specifications (Auth, Users, Notes, Health)
- Request/response schemas with examples
- Interactive "Try it out" feature for testing endpoints
- JWT authentication integration

> **Tip**: Use the "Authorize" button in Swagger UI to add your access token and test protected endpoints.

> **Note**: Access tokens expire after 15 minutes. Use `/api/auth/refresh` to get a new token or re-login.

## How to run locally 💻

You need **Node.js** (compatible with the versions pinned in each package) and a **MongoDB** deployment (local or Atlas). For rate limiting, create a free **Upstash Redis** database—the SDK reads credentials from environment variables.

### Clone this repository

```bash
git clone https://github.com/Pappyjay23/memoir-notes.git
```

### Navigate to the project

```bash
cd memoir-notes
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
# Server
PORT=5001

# CORS – set to your frontend origin (Vite default shown)
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/memoir-notes
# or your MongoDB Atlas connection string

# JWT – use long random strings in production
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
# Optional overrides (defaults: 15m access, 7d refresh)
# JWT_ACCESS_TOKEN_EXPIRES_IN=15m
# JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Upstash Redis (from Upstash dashboard – required for auth rate limiting)
UPSTASH_REDIS_REST_URL=https://YOUR_INSTANCE.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

Start the API:

```bash
npm run dev
```

The server listens on **http://localhost:5001** by default (`GET /` responds with a simple health JSON).

Production build:

```bash
npm run build
npm start
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```bash
# Must match the API mount path (see server.ts: /api/auth, /api/notes, …)
VITE_MEMOIR_API_URL=http://localhost:5001/api
```

Start the Vite dev server:

```bash
npm run dev
```

Open **http://localhost:5173** (or the URL Vite prints). Ensure the backend is running so login and notes requests succeed.

Production build:

```bash
npm run build
npm run preview
```

### Monorepo layout

| Path        | Role                                      |
| ----------- | ----------------------------------------- |
| `frontend/` | React + Vite SPA                          |
| `backend/`  | Express API, MongoDB, auth & rate limits  |

There is no root-level `package.json`; install and run each package separately.

## Credits ✍

Implementation by [Peace Jinadu-Paul](https://github.com/Pappyjay23)
