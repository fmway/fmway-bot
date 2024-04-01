import { Context, Hono } from "hono";
import { cors, logger, prettyJSON } from "hono/middleware";
import { webhookCallback } from "grammy";
import namakuIsBot from "$bots/NamakuIsBot/bot.ts";

const TOKEN_NamakuIsBot = Deno.env.get("TOKEN_NamakuIsBot");
if (!TOKEN_NamakuIsBot) throw new Error("Token NamakuIsBot not found!!!");

const app = new Hono({ strict: false });
app.use("*", logger());
app.use("*", prettyJSON());
app.get("/", (c: Context) => c.text("Work jir"));
app.use("/NamakuIsBot", webhookCallback(namakuIsBot(TOKEN_NamakuIsBot), "hono")); 

export default app;
