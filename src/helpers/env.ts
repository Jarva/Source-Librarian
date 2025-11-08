// Helper for validating and retrieving required environment variables
// Note: Ensure your entrypoint imports "dotenv/config" to load .env before using this helper.

export function requireEnv<K extends string>(
  keys: readonly K[],
): Record<K, string> {
  const env = Deno.env.toObject();
  const out = {} as Record<K, string>;

  for (const key of keys) {
    const val = env[key];
    if (!val) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    out[key] = val;
  }

  return out;
}

// Helper for getting optional environment variables with defaults
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return Deno.env.get(key) ?? defaultValue;
}
