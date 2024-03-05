import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import v1Routes from "@routers";
import { errorHandlers } from "@handlers";
import { ApiError } from "@libs/responses";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

console.log("\n⛓️  Mode: " + process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1", v1Routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found", [{ field: "", message: `Can't find ${req.originalUrl} on this server!` }]));
});

app.use(errorHandlers.globalErrorHandler);

export default app;
