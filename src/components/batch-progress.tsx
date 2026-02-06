"use client";

export function BatchProgress({
  total,
  completed,
  failed,
  currentUrl,
}: {
  total: number;
  completed: number;
  failed: number;
  currentUrl: string | null;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-800">
          Converting {completed + failed} of {total}
        </span>
        <span className="text-stone-500">{pct}%</span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {currentUrl && (
        <p className="mt-2 truncate text-xs text-stone-400">{currentUrl}</p>
      )}

      {failed > 0 && (
        <p className="mt-2 text-xs text-red-500">
          {failed} link{failed > 1 ? "s" : ""} failed to convert
        </p>
      )}
    </div>
  );
}
