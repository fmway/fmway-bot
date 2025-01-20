import type { Context, Next } from "hono";
import { webhookCallback } from "grammy";
import NamakuIsBot from "$bots/NamakuIsBot/bot.ts"
import OrcaUpdaterBot from "$bots/OrcaUpdaterBot/bot.ts"


const TOKEN_NamakuIsBot = Deno.env.get("TOKEN_NamakuIsBot") || "";
const TOKEN_OrcaUpdaterBot = Deno.env.get("TOKEN_OrcaUpdaterBot") || "";


export default async function handler(c: Context, next: Next) {
  const { id } = c.req.param();

  switch (id) {

    case "NamakuIsBot":
      if (TOKEN_NamakuIsBot === "") throw new Error("TOKEN NamakuIsBot is not exist");
      return await webhookCallback(NamakuIsBot(TOKEN_NamakuIsBot), "hono")(c);
  
    case "OrcaUpdaterBot":
      if (TOKEN_OrcaUpdaterBot === "") throw new Error("TOKEN OrcaUpdaterBot is not exist");
      return await webhookCallback(OrcaUpdaterBot(TOKEN_OrcaUpdaterBot), "hono")(c);
  
    default:
      next();
  }
}
