import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SpendingDonut({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{entry.name}</p>
          <p className="tooltip-value" style={{ color: entry.color }}>
            ₹{entry.value.toLocaleString('en-IN')}
          </p>
          <p className="tooltip-percent">{entry.percent.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="spending-donut">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="#faf9f7"
            strokeWidth={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
