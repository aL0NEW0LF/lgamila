import type { Context } from "hono";

export const requireAuth = async (c: Context, next: () => Promise<void>) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized: Authentication required" }, 401);
  }

  await next();
};
