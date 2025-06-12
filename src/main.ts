import "npm:dotenv/config";
import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import { handler } from "./discord/client.ts";

const app = new Hono();

app.use(logger());

app.mount("/api/discord", handler);
app.get("*", (c) => c.text("Hello, World!"));

Deno.serve(app.fetch);
