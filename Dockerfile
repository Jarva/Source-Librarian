FROM denoland/deno:alpine AS builder
WORKDIR /app
COPY . .
RUN deno cache src/main.ts

FROM denoland/deno:alpine
WORKDIR /app
COPY --from=builder /app .
HEALTHCHECK --interval=30s --timeout=3s CMD deno eval "try { await fetch('http://localhost:8000/health'); } catch { Deno.exit(1); }"
CMD ["deno", "run", "-A", "src/main.ts"]
