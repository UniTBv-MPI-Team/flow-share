import express, { Application } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

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

app.use((req, res) => {
    res.status(404).send("<h1>404 - Not Found</h1>");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err);
    res.status(500).send("<h1>500 - Server Error</h1>");
});

app.listen(PORT, () => {
    console.log(`FlowShare running on port ${PORT} [${NODE_ENV}]`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

export default app;
