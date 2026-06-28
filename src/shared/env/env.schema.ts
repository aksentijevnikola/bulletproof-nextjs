import { z } from "zod";

export const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_APP_NAME: z
      .string()
      .trim()
      .min(1)
      .default("bulletproof-nextjs"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  })
  .strict();

export type ClientEnv = z.infer<typeof clientEnvSchema>;
