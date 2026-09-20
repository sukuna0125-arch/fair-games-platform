export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{hint}</span>
    </div>
  );
}
