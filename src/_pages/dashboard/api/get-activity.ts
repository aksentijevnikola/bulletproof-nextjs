import { fetchClient } from "@/shared/api";
import { activityResponseSchema } from "../model/activity";

export async function getActivity(signal: AbortSignal) {
  const url = new URL("/demo/activity.json", window.location.href);
  const result = await fetchClient(url, {
    schema: activityResponseSchema,
    signal,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.data;
}
