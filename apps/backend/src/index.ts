import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { env, isDev } from "./lib/env";
import * as Sentry from "@sentry/bun";

import { logger } from "hono/logger";
import api from "./api";
import { serve } from "bun";
import { cors } from "hono/cors";
import { TRUSTED_ORIGINS } from "./constants";
import type { ApiContext } from "./types/api";

Sentry.init({
  dsn: isDev ? undefined : "",
  tracesSampleRate: 0.1,
});

export const app = new Hono<ApiContext>()
  .use("*", logger())
  .use(
    "*",
    cors({
      origin(origin) {
        if (TRUSTED_ORIGINS.includes(origin)) {
          return origin;
        }
        return null;
      },
      credentials: true,
    }),
  )
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  })
  .route("/api", api);

if (!isDev) {
  app.use(
    "/*",
    serveStatic({
      root: "./static",
      onNotFound(path, c) {
        console.log("Not found", path, c.req.url);
      },
    }),
  );
}

const main = async () => {
  const server = serve({
    port: env.PORT,
    fetch: app.fetch,
    development: env.NODE_ENV !== "production",
  });

  return server;
};

if (require.main === module) {
  process.on("SIGINT", () => {
    console.log("Received SIGINT");
    process.exit(0);
  });

  process.on("exit", (code) => {
    console.log(`Process exited with code ${code}`);
    process.exit(0);
  });

  main()
    .then((server) => {
      console.log(`🚀 Server running at ${server.url}`);
    })
    .catch((err) => {
      console.error("Error starting server", err);
      process.exit(1);
    });
}
