import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder — used throughout the app while
 * data is being fetched from the API.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
