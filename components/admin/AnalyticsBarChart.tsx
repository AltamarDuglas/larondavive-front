interface AnalyticsBarChartProps {
  data: Record<string, number>;
  total: number;
  fillClassName: string;
  emptyMessage?: string;
  labelPrefix?: string;
}

export default function AnalyticsBarChart({
  data,
  total,
  fillClassName,
  emptyMessage,
  labelPrefix = "",
}: AnalyticsBarChartProps) {
  const entries = Object.entries(data);

  if (entries.length === 0 && emptyMessage) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="chart-bar-group">
      {entries.map(([label, count]) => {
        const pct = Math.round((count / (total || 1)) * 100);
        return (
          <div className="chart-bar-item" key={label}>
            <div className="chart-bar-label">
              <span>
                {labelPrefix}
                {label}
              </span>
              <strong>
                {count} ({pct}%)
              </strong>
            </div>
            <div className="chart-bar-track">
              <div
                className={`chart-bar-fill ${fillClassName}`}
                style={{ width: `${Math.max(4, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
