import { z } from "zod";

export const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must contain at least 2 characters.")
    .max(60, "Display name must contain 60 characters or fewer."),
  email: z.email("Enter a valid email address."),
  timezone: z.string().min(1, "Choose a timezone."),
  theme: z.enum(["light", "dark", "system"]),
});

export type SettingsValues = z.infer<typeof settingsSchema>;
