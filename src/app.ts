import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes.ts";
import taskRoutes from "./routes/taskRoutes.ts";
import { HttpError } from "./errors/httpError.ts";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Handled HTTP domain errors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Bad JSON body or client syntax errors
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  // Prisma database constraint errors
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Resource with unique field already exists" });
  }

  if (err.code === "P2003") {
    return res.status(404).json({ error: "Referenced record not found" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
