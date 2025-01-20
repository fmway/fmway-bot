import app, { bots } from "$app";

for (const bot of bots) {
  if (Array.from(Deno.readDirSync(`./bots/${bot}`)).filter(x => x.isFile && x.name == "startup.ts").length == 1) {
    await import(`$bots/${bot}/startup.ts`);
  }
}

Deno.serve(app.fetch);
