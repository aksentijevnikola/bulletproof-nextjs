import { queryOptions } from "@tanstack/react-query";
import { getActivity } from "./get-activity";

export const activityQueries = {
  all: () => ["demo"] as const,
  activity: () =>
    queryOptions({
      queryKey: [...activityQueries.all(), "activity"] as const,
      queryFn: ({ signal }) => getActivity(signal),
      retry: false,
    }),
};
