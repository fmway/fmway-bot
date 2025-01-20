import { Bot, Context } from "grammy";

type MyContext = Context & {
  
};

export default function MyBot(token: string) {
  const bot = new Bot<MyContext>(token);

  return bot;
}
