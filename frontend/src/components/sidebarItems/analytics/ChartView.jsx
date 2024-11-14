import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const ChartView = ({ data, selectedSlice, handlePieClick, expandedData }) => (
  <div className="space-y-6">
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

    {selectedSlice !== null && expandedData && (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium mb-2">
          {data[selectedSlice].name} - Detailed Information
        </h3>
        <div className="grid gap-4">
          {expandedData.map((item, index) => (
            <div key={index} className="p-3 bg-white rounded shadow-sm">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-1">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ChartView;
