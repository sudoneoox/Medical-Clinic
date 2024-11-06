import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ChartView = ({ data, selectedSlice, handlePieClick }) => (
  <div className="h-[400px]">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          onClick={handlePieClick}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={
                selectedSlice === null || selectedSlice === index ? 1 : 0.5
              }
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend cursor="pointer" />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ChartView;
