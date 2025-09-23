const DISCORD_API_BASE = "https://discord.com/api/v10";

export async function discordPut(path: string, token: string, body: unknown): Promise<void> {
  const res = await fetch(`${DISCORD_API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`Discord PUT ${path} failed: ${res.status} ${res.statusText} - ${text}`);
  }
}
