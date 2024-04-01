import app from "$app";

console.log(Deno.env.toObject());
Deno.serve(app.fetch);
