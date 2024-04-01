import { Bot, Context } from "grammy";

type AllowedUser = "developer" | "user" | "all" | number |  number[];

const BOT_DEVELOPER = 1152514021;
const ALLOWED_USER: AllowedUser = "all";

interface BotConfig {
  botDeveloper: number,
  isDeveloper: boolean,
  allowedUser: AllowedUser,
  isAllowed: boolean,
  isGroup: boolean,
}

type MyContext = Context & {
  config: BotConfig,
};

function isAllowedUser(allowedUser: AllowedUser, user?: number): boolean {
  if (!user) {
    if (allowedUser == "all")
      return true;
    return false;
  }
  switch (allowedUser) {
    case "all":
      return true;
    case "user":
      return BOT_DEVELOPER !== user;
    case "developer":
      return BOT_DEVELOPER === user;
    default:
      if (Array.isArray(allowedUser)) {
        return allowedUser.includes(user);
      } else {
        return user === allowedUser;
      }
  }
}

export default function myBot(token: string) {
  const bot = new Bot<MyContext>(token);


  bot.use(async (ctx, next) => {
    ctx.config = {
      botDeveloper: BOT_DEVELOPER,
      isDeveloper: ctx.from?.id === BOT_DEVELOPER,
      allowedUser: ALLOWED_USER, 
      isAllowed: isAllowedUser(ALLOWED_USER, ctx.from?.id),
      isGroup: ctx.hasChatType('group') || ctx.hasChatType('supergroup'),
    };
    await next();
  });

  const pm = bot.chatType("private");
  const gm = bot.chatType("group");
  const sm = bot.chatType("supergroup");
  const cm = bot.chatType("channel");

  pm.command("start", async (ctx) => {
    if (!ctx.config.isAllowed) {
      await ctx.reply("Tai anjing!!");
    } else {
      await ctx.reply("Ok");
    }
    console.dir(ctx.entities());
  });

  bot.hears(/^\$ (.+)$/, (ctx) => {
    console.log(ctx.match);
    ctx.reply(ctx.match.at(1) || "");
  });

  bot.on("msg:new_chat_members:me", async (ctx) => {
    await ctx.reply(`Thanks ${ctx.msg.from?.username || 'dude'} for adding me to this group :)`);
  });

  bot.on(":left_chat_member:me", async (ctx) => {
    const msg = await ctx.reply("Babi kalian semua!!!");
    await ctx.deleteMessages([msg.message_id]);
  });

  pm.on("msg", (ctx) => {
    console.log(ctx.msg);
    ctx.reply((ctx.msg.text ?? '') + ' username: ' + (ctx.msg.from?.username ?? "") + ", id: " +(ctx.msg.from?.id ?? ""))
  });

  bot.command("delete", async (ctx) => {
    if (ctx.config.isGroup) {
      const jir = await ctx.reply("otw");
      const replied_id = ctx.msg.reply_to_message?.message_id;
      console.dir(ctx.message);
      if (replied_id) await ctx.deleteMessages([replied_id]);
      await ctx.deleteMessages([jir.message_id, ctx.msg.message_id]);
    }
  });

  bot.on(":new_chat_members", async (ctx) => {
    const members = ctx.msg.new_chat_members;
    for (const m of members)
      await bot.api.sendMessage(ctx.chat.id, 
      `*Welcome @${m.username || '\bdude'}\\!*:\\)
Semoga membabi selalu ☺️
`, { parse_mode: "MarkdownV2" });
  })

  return bot;
}
