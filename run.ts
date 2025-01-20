import { tokens, bots, BotFn } from "$app";
const args = Deno.args;
if (args.length < 1)
  throw new Error("Required 1 arguments, found 0");

const id = args[0];

if (!bots.includes(id)) throw new Error(`Bot ${id} not found`);

const { default: myBot }: { default: BotFn } = await import(`$bots/${id}/bot.ts`);

myBot(tokens[id]).start();
