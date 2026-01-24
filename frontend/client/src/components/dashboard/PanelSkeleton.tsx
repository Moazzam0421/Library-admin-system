export default function PanelSkeleton({
  rows = 3,
}: {
  rows?: number;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border space-y-3">
      {/* Title */}
      <div className="h-4 w-1/3 skeleton" />

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-full skeleton"
        />
      ))}
    </div>
  );
}
