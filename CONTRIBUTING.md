# Contributing to Source Librarian

Thanks for your interest in improving Source Librarian! Please follow the steps below to keep changes consistent and easy to review.

## Getting Started
- Use Deno (see `deno.json` tasks).
- Copy `.env` and set required tokens/keys; Starbuncle adoption flow needs `GITHUB_TOKEN`.
- Run locally with `deno task dev`.

## Running the Project
- **Prerequisites:** Install [Deno](https://deno.land/). Have a Discord Bot Token, CurseForge API Key, and (optionally) a `GITHUB_TOKEN` for the Starbuncle adoption PR flow.
- **Environment:** `.env` should include:
  ```env
  BASE_URL=https://your-deployment-url.com
  DISCORD_CLIENT_ID=your_client_id
  DISCORD_PUBLIC_KEY=your_public_key
  DISCORD_TOKEN=your_bot_token
  CURSEFORGE_API_KEY=your_curseforge_key
  GITHUB_TOKEN=your_github_token   # optional unless using Starbuncle adoption
  ```
- **Local dev:** `deno task dev` (auto-reload).
- **Prod-like:** `deno run -A src/main.ts`.
- **Docker:** `docker build -t source-librarian .` then `docker run -p 8000:8000 --env-file .env source-librarian`.
- **Scripts:**  
  - `deno task dev` – dev mode  
  - `deno task scripts:delete-guild-commands` – remove guild-specific commands  
  - `deno task scripts:delete-all-commands` – remove all application commands
- **Endpoints:** `GET /health`, `POST /api/discord`.
- **Registration:** Commands auto-deploy on startup via Carbon.

## Development Practices
- Prefer small, focused PRs with a clear description of the change and rationale.
- Add or update tests where practical; for commands, include reasoning on manual test steps if automation isn’t available.
- Match existing code style; keep comments concise and only when non-obvious logic needs context.
- Avoid force-pushes once review has started unless requested.

## Commands & Structure
- New commands live in `src/discord/commands/`; register them in `src/discord/commands.ts`.
- Reuse helpers in `src/discord/helpers/` and abstracts in `src/discord/abstracts/` where possible.
- For addon data updates, edit `src/discord/commands/addons/data.ts`.

## Submitting Changes
- Ensure linting/build succeeds (if applicable) before opening a PR.
- Describe manual verification steps (e.g., tried `/addons info`, `/addons glyphs search`, etc.).
- Link related issues/requests and call out any breaking changes.

## Code of Conduct
Be respectful and collaborative. Treat maintainers and community members with empathy and patience.
