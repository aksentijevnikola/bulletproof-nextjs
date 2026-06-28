import { ActivityFeed } from "@/features/activity/activity-feed";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const metrics = [
  { label: "Configured routes", value: "04", note: "App Router views" },
  { label: "Live services", value: "00", note: "No backend attached" },
  { label: "Validation layers", value: "02", note: "Forms and response data" },
] as const;

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="blueprint-kicker">Overview / 01</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Application baseline
            </h2>
          </div>
          <Badge variant="outline">Local demonstration</Badge>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Static summaries describe the starter. Activity below is fetched
          through TanStack Query and validated before rendering.
        </p>
      </section>

      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Summary metrics"
      >
        {metrics.map(({ label, note, value }) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="font-mono text-4xl">{value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {note}
            </CardContent>
          </Card>
        ))}
      </section>

      <ActivityFeed />
    </div>
  );
}
