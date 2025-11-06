import "dotenv/config";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { handler } from "@/discord/client.ts";

const app = new Hono();

app.use(logger());

app.mount("/api/discord", handler);
app.get("/health", (c) => {
  c.status(200);
  return c.text("OK");
});

Deno.serve(app.fetch);
