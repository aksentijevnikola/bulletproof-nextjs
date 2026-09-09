import "server-only";

import { clientEnvSchema } from "./env.schema";

export const serverEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"],
  NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
});
