# Smart Faculty & Lab Availability Tracking System

A full-stack campus tool that lets students and staff see faculty availability and lab occupancy in real time.  
Status updates pushed via WebSocket (STOMP over SockJS) — no polling needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.3.4 · Java 17 · Spring Security (JWT) · Spring WebSocket (STOMP) |
| Database | MySQL 8.x |
| Frontend | React 18 · Vite · Tailwind CSS v4 · Axios · @stomp/stompjs |

---

## Project Structure

```
faculty-tracker/
├── database/
│   └── schema.sql            ← MySQL schema + seed data
├── backend/                  ← Spring Boot Maven project
│   ├── pom.xml
│   └── src/main/java/com/facultytracker/
│       ├── entity/           (JPA entities + enums)
│       ├── repository/       (Spring Data JPA)
│       ├── dto/              (request/response DTOs)
│       ├── service/          (business logic)
│       ├── controller/       (REST endpoints)
│       ├── security/         (JWT filter, SecurityConfig, UserPrincipal)
│       ├── config/           (WebSocket/STOMP config)
│       └── exception/        (global error handler)
└── frontend/                 ← Vite + React app
    └── src/
        ├── api/              (axios instance + per-resource modules + WS client)
        ├── context/          (AuthContext — JWT + localStorage)
        ├── components/       (Layout, Navbar, StatusLight, StatusBadge, …)
        ├── hooks/            (useFacultyData, useLabData — REST + live WS merge)
        ├── pages/            (Login, Dashboard, Faculty, Labs, MyStatus, Admin)
        └── lib/              (status → color/label mappings)
```

---

## Prerequisites

- **Java 17+** and **Maven 3.8+**
- **MySQL 8.x** running locally
- **Node.js 18+** and **npm 9+**

---

## 1 — Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `faculty_tracker` database, all tables, indexes, and seed data.

---

## 2 — Backend Setup

### Configure

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Change this secret before any real deployment!
app.jwt.secret=ChangeThisFacultyTrackerJwtSecretKeyToSomethingLongAndRandom123!
```

### Run

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

### API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Admin only |
| GET | `/api/faculty?name=` | Any authenticated |
| POST/PUT/DELETE | `/api/faculty/**` | Admin only |
| PUT | `/api/availability/me` | Faculty only |
| PUT | `/api/availability/{facultyId}` | Admin only |
| GET | `/api/labs?name=` | Any authenticated |
| POST/DELETE | `/api/labs/**` | Admin only |
| PUT | `/api/labs/{id}/status` | Lab Incharge / Admin |
| GET | `/api/departments` | Any authenticated |
| GET | `/api/dashboard` | Any authenticated |

WebSocket endpoint: **ws://localhost:8080/ws** (SockJS)  
Topics: `/topic/faculty-status`, `/topic/lab-status`

---

## 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173**.

### Environment Variables (optional)

Copy `.env.example` → `.env` to override defaults:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=http://localhost:8080/ws
```

---

## Seeded Accounts

All seeded accounts use the password **`Password123!`**

| Email | Role | Notes |
|---|---|---|
| `admin@college.edu` | ADMIN | Full access — create users, manage faculty/labs/departments |
| `anitha.raman@college.edu` | FACULTY | Can update own status via "My Status" |
| `suresh.kumar@college.edu` | FACULTY | Can update own status via "My Status" |
| `priya.menon@college.edu` | FACULTY | Can update own status via "My Status" |
| `karthik.babu@college.edu` | LAB_INCHARGE | Can update lab occupancy from the Labs page |
| `student@college.edu` | STUDENT | Read-only — search faculty and labs |

---

## Role Capabilities

| Feature | Admin | Faculty | Lab Incharge | Student |
|---|:---:|:---:|:---:|:---:|
| View dashboard | ✓ | ✓ | ✓ | ✓ |
| Search faculty + view status | ✓ | ✓ | ✓ | ✓ |
| Search labs + view occupancy | ✓ | ✓ | ✓ | ✓ |
| Update own availability | — | ✓ | — | — |
| Update lab status / occupancy | ✓ | — | ✓ | — |
| Manage faculty / labs / departments | ✓ | — | — | — |
| Create user logins | ✓ | — | — | — |

---

## Real-Time Updates

When anyone saves a status or occupancy change the backend immediately broadcasts it over WebSocket. Any browser tab open on the Faculty or Labs page updates in place — no refresh required.

---

## Production Checklist

- [ ] Change `app.jwt.secret` to a strong random value (load from env var, not application.properties)
- [ ] Change `spring.datasource.password` / use environment variables
- [ ] Change all seeded account passwords
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (already set; never use `create-drop` in production)
- [ ] Put the backend behind a reverse proxy (nginx/Caddy) with HTTPS
- [ ] Deploy frontend build (`npm run build` → `dist/`) to Netlify, Vercel, or serve from nginx
- [ ] Update `app.cors.allowed-origins` to your production frontend URL
=======
