import { hc } from "hono/client";
import type { AppType } from "@stormix/backend";

const endpoint = import.meta.env.VITE_API_URL as string;
const client = hc<AppType>(endpoint, {
  headers: {},
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, { ...init, credentials: "include" }),
});

export default client;
