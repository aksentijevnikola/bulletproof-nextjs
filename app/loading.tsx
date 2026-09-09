import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-14 w-full max-w-2xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-72" />
    </main>
  );
}
