import express, { Application } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.set("views", path.join(__dirname, "..", "view"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "view")));

// Routes will be added here as features are implemented

import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";
import navRoutes from "./routes/nav-routes";
import groupRoutes from "./routes/group-routes";
import groupMemberRoutes from "./routes/group-member-routes";
import taskRoutes from "./routes/task-routes";
import expenseRoutes from "./routes/expense-routes";
import contributionRoutes from "./routes/contribution-routes";

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/", navRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/group-member", groupMemberRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/contribution", contributionRoutes);

app.get("/api/health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: "ok",
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            db: "connected"
        });
    } catch {
        res.status(503).json({ status: "error", db: "disconnected" });
    }
});

app.use((_req, res) => {
    res.status(404).send("<h1>404 - Not Found</h1>");
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error("Unhandled server error", { message: err.message, stack: err.stack });
    res.status(500).send("<h1>500 - Server Error</h1>");
});

app.listen(PORT, () => {
    logger.info(`FlowShare running on port ${PORT}`, { env: NODE_ENV, port: PORT });
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

export default app;
