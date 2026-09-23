# Task Management REST API

A modern, production-grade RESTful API built with **Node.js**, **Express 5**, **TypeScript**, **Prisma 7**, and **Zod**. Designed using an enterprise **3-Tier Layered Architecture** with **Constructor-based Dependency Injection (Pure DI)** for high testability and clean separation of concerns.

---

## Architecture Overview

This project follows a strict 3-tier architecture separating HTTP concerns, business logic, and database persistence:

```mermaid
graph TD
  Client([HTTP Client]) --> Router[Routes Layer]
  Router --> Validation[Zod Validation Middleware]
  Validation --> Controller[Controller Layer]
  Controller --> Service[Service Layer]
  Service --> Repository[Repository Layer]
  Repository --> Prisma[Prisma 7 Client]
  Prisma --> DB[(PostgreSQL Database)]

  subgraph DI Container [src/container.ts]
    Repository
    Service
    Controller
  end
```

### Architectural Principles
* **Single Responsibility**: Each layer has one distinct purpose:
  * **Controllers**: Handle HTTP requests/responses, status codes, and routing parameters.
  * **Services**: Contain pure business rules, duplicate prevention, and domain exceptions.
  * **Repositories**: Abstract Prisma queries behind type-safe interfaces (`IUserRepository`, `ITaskRepository`).
* **Dependency Injection (Pure DI)**: All dependencies are injected via constructors. No reflection libraries or bloated decorators are required.
* **Single Source of Truth Validation**: Validation schemas defined in Zod automatically infer TypeScript DTO types, preventing type drift.

---

## Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Language:** TypeScript 7
* **Web Framework:** Express 5
* **ORM:** Prisma 7 (with `@prisma/adapter-pg` driver adapter)
* **Database:** PostgreSQL (supports Neon, Supabase, Railway, or local Postgres)
* **Schema Validation:** Zod 4
* **Dev Server:** TSX (instant TypeScript execution with watch mode)

---

## Project Structure

```text
task-api/
├── prisma/
│   ├── migrations/          # Version-controlled database migrations
│   └── schema.prisma        # Prisma data models (User, Task)
├── src/
│   ├── controllers/         # HTTP request handlers (User & Task controllers)
│   ├── errors/              # Domain & HTTP error classes
│   ├── middlewares/         # Reusable Zod validation middleware
│   ├── repositories/        # Database access layer (Interfaces & Implementations)
│   ├── routes/              # Express route definitions with path grouping
│   ├── schemas/             # Zod validation schemas & inferred DTO types
│   ├── services/            # Business logic and domain rules
│   ├── app.ts               # Express application setup & global error handling
│   ├── container.ts         # Composition root (Dependency Injection wiring)
│   ├── db.ts                # Prisma Client & PostgreSQL driver adapter setup
│   └── server.ts            # Application entrypoint & HTTP server listener
├── .env.example             # Template for required environment variables
├── package.json             # Scripts & dependencies
├── prisma7.config.ts        # Prisma 7 configuration file
└── tsconfig.json            # TypeScript configuration
```

---

## Getting Started

### Prerequisites
* **Node.js** v20.x or higher
* **npm** v10.x or higher
* A running **PostgreSQL** database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or local PostgreSQL)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/task-api.git
cd task-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL connection string:
```env
PORT=3001
DATABASE="postgresql://user:password@localhost:5432/taskdb?sslmode=disable"
```

### 4. Run database migrations
Apply database migrations to sync your PostgreSQL database:
```bash
npm run prisma:migrate
```

### 5. Start the development server
```bash
npm run dev
```
The server will start at `http://localhost:3001`.

---

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check API server status |

---

### User Endpoints (`/api/users`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/users` | Create a new user | `{ "name": string, "email": string }` |
| `GET` | `/api/users` | List all users (with task count) | None |
| `GET` | `/api/users/:id` | Get user by ID (with tasks) | None |
| `PUT` | `/api/users/:id` | Update user details | `{ "name"?: string, "email"?: string }` |
| `DELETE` | `/api/users/:id` | Delete user & associated tasks | None |

#### Example: Create User
**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2026-09-23T16:00:00.000Z",
  "updatedAt": "2026-09-23T16:00:00.000Z"
}
```

---

### Task Endpoints (`/api/tasks`)

| Method | Endpoint | Description | Query / Body |
|---|---|---|---|
| `POST` | `/api/tasks` | Create a new task | `{ "title": string, "content"?: string, "userId": number }` |
| `GET` | `/api/tasks` | List tasks (supports filtering) | Query: `?userId=1&isDone=true` |
| `GET` | `/api/tasks/:id` | Get task by ID (with user info) | None |
| `PATCH` | `/api/tasks/:id` | Update task status or content | `{ "title"?: string, "content"?: string, "isDone"?: boolean }` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None |

#### Example: Create Task
**Request:**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Build REST API",
  "content": "Implement 3-tier architecture with Prisma 7",
  "userId": 1
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "title": "Build REST API",
  "content": "Implement 3-tier architecture with Prisma 7",
  "isDone": false,
  "createdAt": "2026-09-23T16:05:00.000Z",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### Error Responses

The API uses standardized error responses:

#### Validation Error (`400 Bad Request`)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    },
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

#### Resource Not Found (`404 Not Found`)
```json
{
  "error": "User not found"
}
```

#### Duplicate Conflict (`409 Conflict`)
```json
{
  "error": "A user with this email already exists"
}
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the development server with live reload via `tsx watch` |
| `npm run start` | Runs the production server via `tsx` |
| `npm run typecheck` | Checks TypeScript types without emitting output (`tsc --noEmit`) |
| `npm run prisma:generate` | Generates the Prisma Client |
| `npm run prisma:migrate` | Runs database migrations in development |

---

## License

This project is licensed under the [MIT License](LICENSE).
