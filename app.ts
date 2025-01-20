import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { Bot, webhookCallback } from "grammy";

export type BotFn = (token: string) => Bot;

export const bots = Array
  .from(Deno.readDirSync("./bots"))
  .filter(
    e => e.isDirectory &&
    Array
      .from(Deno.readDirSync(`./bots/${e.name}`))
      .filter(x => x.isFile && x.name == "bot.ts").length > 0)
  .map(x => x.name);

export const tokens = Object.assign({}, ...bots.map(id => {
  const res: Record<string, string> = {};
  res[id] = Deno.env.get(`TOKEN_${id}`) || "";
  if (res[id] === "") throw new Error(`Token ${id} not found!!!`);
  return res;
})) as Record<string, string>;

const app = new Hono({ strict: false });
app.use("*", logger());
app.use("*", prettyJSON());
app.use("/:id", async (c, next) => {
  const { id } = c.req.param();
  if (bots.includes(id)) {
    const { default: bot }: { default: BotFn } = await import(`$bots/${id}/bot.ts`);
    return await webhookCallback(bot(tokens[id]), "hono")(c);
  }

  next();
})
app.get("/", (c: Context) => c.text("Work jir"));

export default app;
