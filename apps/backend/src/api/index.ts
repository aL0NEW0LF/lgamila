import { Hono } from "hono";
import { auth } from "../lib/auth";
import type { ApiContext } from "../types/api";
import { TypeID } from "typeid-js";

const api = new Hono<ApiContext>()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }
    c.set("user", {
      ...session.user,
      id: TypeID.fromString(session.user.id.toString(), "user"),
    });
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default api;
