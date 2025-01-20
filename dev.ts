const bots = Array
  .from(Deno.readDirSync("./bots"))
  .filter(
    e => e.isDirectory &&
    Array
      .from(Deno.readDirSync(`./bots/${e.name}`))
      .filter(x => x.isFile && x.name == "bot.ts").length > 0)
  .map(x => x.name);

const generated_bot: {
  header: string,
  body: string,
  func: string,
} = { header: "", body: "", func: "" };

let generated_startup = "";

generated_bot.header = `import type { Context, Next } from "hono";
import { webhookCallback } from "grammy";
`;

generated_bot.func = `export default async function handler(c: Context, next: Next) {
  const { id } = c.req.param();

  switch (id) {
`;

for (const bot of bots) {
  generated_bot.header += `import ${bot} from "$bots/${bot}/bot.ts"
`;

  generated_bot.body += `const TOKEN_${bot} = Deno.env.get("TOKEN_${bot}") || "";
`;

  generated_bot.func += `
    case "${bot}":
      if (TOKEN_${bot} === "") throw new Error("TOKEN ${bot} is not exist");
      return await webhookCallback(${bot}(TOKEN_${bot}), "hono")(c);
  `;

  if (Array.from(Deno.readDirSync(`./bots/${bot}`)).filter(x => x.isFile && x.name == "startup.ts").length == 1) {
    generated_startup += `import "$bots/${bot}/startup.ts";
`
  }
}

generated_bot.func = `${generated_bot.func}
    default:
      next();
  }
}`;

const encoder = new TextEncoder();

Deno.writeFileSync("generated.bots.ts", encoder.encode(`${generated_bot.header}

${generated_bot.body}

${generated_bot.func}
`))

Deno.writeFileSync("generated.startup.ts", encoder.encode(generated_startup));

const args = Deno.args;

import main from "./main.ts";
if (args.length < 1 || args[0] !== "build")
  main();
