import pino from "pino";
import { getEnv } from "@/helpers/env.ts";

const level = getEnv("LOG_LEVEL", "info");

export const logger = pino({
  level,
});
