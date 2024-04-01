import myBot from "$bots/NamakuIsBot/bot.ts"

const TOKEN = Deno.env.get("TOKEN_NamakuIsBot");
if (!TOKEN) throw new Error("Token Undefined");

const bot = myBot(TOKEN);

bot.start();
