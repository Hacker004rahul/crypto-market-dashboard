export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          className="h-20 animate-pulse rounded-md border border-stone-200 bg-stone-100 dark:border-neutral-800 dark:bg-neutral-900"
          key={index}
        />
      ))}
    </div>
  );
}
