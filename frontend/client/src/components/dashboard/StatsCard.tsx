export default function StatsCard({ title, value }: any) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
