import PanelSkeleton from "./PanelSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="h-6 w-40 skeleton" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border space-y-3"
          >
            <div className="h-3 w-24 skeleton" />
            <div className="h-6 w-16 skeleton" />
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PanelSkeleton rows={3} />
        <PanelSkeleton rows={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={3} />
      </div>
    </div>
  );
}
