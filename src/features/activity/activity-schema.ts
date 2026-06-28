import { z } from "zod";

export const activityItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  occurredAt: z.iso.datetime(),
  status: z.enum(["success", "info", "warning"]),
});

export const activityResponseSchema = z.object({
  items: z.array(activityItemSchema),
});

export type ActivityItem = z.infer<typeof activityItemSchema>;
export type ActivityResponse = z.infer<typeof activityResponseSchema>;
