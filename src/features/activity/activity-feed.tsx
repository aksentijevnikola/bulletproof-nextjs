"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  type ActivityItem,
  activityResponseSchema,
} from "@/features/activity/activity-schema";
import { fetchClient } from "@/shared/api/fetch-client";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";

const activityQueryKey = ["demo", "activity"] as const;

async function loadActivity() {
  const url = new URL("/demo/activity.json", window.location.href);
  const result = await fetchClient(url, {
    schema: activityResponseSchema,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.data;
}

function ActivityStatus({ status }: Pick<ActivityItem, "status">) {
  if (status === "success") {
    return (
      <Badge variant="outline">
        <CheckCircle2Icon aria-hidden="true" />
        Ready
      </Badge>
    );
  }

  if (status === "warning") {
    return (
      <Badge variant="secondary">
        <TriangleAlertIcon aria-hidden="true" />
        Pending
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      <InfoIcon aria-hidden="true" />
      Info
    </Badge>
  );
}

function ActivityLoading() {
  return (
    <div
      className="flex flex-col gap-5"
      role="status"
      aria-label="Loading activity"
      aria-busy="true"
    >
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex gap-4">
          <Skeleton className="size-10 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityFeed() {
  const query = useQuery({
    queryKey: activityQueryKey,
    queryFn: loadActivity,
    retry: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          Loaded from /demo/activity.json through the shared fetch client.
        </CardDescription>
      </CardHeader>
      <CardContent aria-live="polite">
        {query.isPending ? <ActivityLoading /> : null}

        {query.isError ? (
          <Alert variant="destructive">
            <AlertCircleIcon aria-hidden="true" />
            <AlertTitle>Activity could not be loaded</AlertTitle>
            <AlertDescription>
              <p>{query.error.message}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => query.refetch()}
              >
                <RefreshCwIcon data-icon="inline-start" aria-hidden="true" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {query.isSuccess && query.data.items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ActivityIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No activity yet</EmptyTitle>
              <EmptyDescription>
                The validated fixture returned an empty list.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {query.isSuccess && query.data.items.length > 0 ? (
          <ol className="flex flex-col">
            {query.data.items.map((item, index) => (
              <li key={item.id}>
                {index > 0 ? <Separator className="my-5" /> : null}
                <article className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                    <time
                      className="font-mono text-xs text-muted-foreground"
                      dateTime={item.occurredAt}
                    >
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.occurredAt))}
                    </time>
                  </div>
                  <ActivityStatus status={item.status} />
                </article>
              </li>
            ))}
          </ol>
        ) : null}
      </CardContent>
    </Card>
  );
}
