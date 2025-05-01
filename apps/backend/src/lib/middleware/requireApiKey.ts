import type { Context } from "hono";
import { auth } from "../auth";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { user } from "../db/schema";

export const requireApiKey = async (c: Context, next: () => Promise<void>) => {
  const apiKey = c.req.header("Authorization")?.split(" ")[1];

  if (!apiKey) {
    return c.json({ error: "Unauthorized: API key required" }, 401);
  }

  const { valid, error, key } = await auth.api.verifyApiKey({
    body: {
      key: apiKey,
    },
  });

  if (!valid || !key?.userId) {
    return c.json({ error: error || "Invalid API key" }, 401);
  }

  // Set the user in context based on the API key's userId
  const existingUser = await db.query.user.findFirst({
    where: eq(user.id, key.userId),
  });

  if (!existingUser) {
    return c.json({ error: "User not found" }, 401);
  }

  c.set("user", existingUser);

  await next();
};
