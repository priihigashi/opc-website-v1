export default function HouseLoadingIndicatorV1({ delayed = false }) {
  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center bg-[#09090B]"
      data-testid="house-loading-indicator-v1"
      data-loading-state={delayed ? "delayed" : "pending"}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2.5 text-center">
        <span
          className="h-[18px] w-[18px] animate-spin rounded-full border border-white/15 border-t-[#D5D800] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-white/45">
          {delayed ? "Still loading" : "Loading"}
        </span>
      </div>
    </div>
  );
}
