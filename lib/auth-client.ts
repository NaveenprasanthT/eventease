import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Optional
  plugins: [inferAdditionalFields<typeof auth>()],
});
