import app from "$app";

import "./generated.startup.ts";

export default function main() {
  Deno.serve(app.fetch);
}
