import { Hono } from "hono";
import type { Context } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import handler from "./generated.bots.ts";

const app = new Hono({ strict: false });
app.use("*", logger());
app.use("*", prettyJSON());
app.use("/:id", handler)
app.get("/", (c: Context) => c.text("Work jir"));

export default app;
