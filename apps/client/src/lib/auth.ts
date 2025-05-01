import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
  baseURL: import.meta.env.VITE_API_URL,
});

export default authClient;
