type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <div className="metricDataCard">
      <p>{label}</p>
      <h2>{value}</h2>
      <span>{note}</span>
    </div>
  );
}