import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Building2,
  Users,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import api from "../api.js";
const AnalyticsCard = ({ title, icon, isSelected, onClick, description }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [chartData, setChartData] = useState(null);

  const analyticOptions = [
    {
      id: "DEMOGRAPHICS",
      title: "Patient Demographics",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "View patient age, gender, and ethnicity distribution",
    },
    {
      id: "STAFF",
      title: "Staff Distribution",
      icon: <Building2 className="w-6 h-6 text-green-500" />,
      description: "Analyze staff roles and office assignments",
    },
    {
      id: "APPOINTMENTS",
      title: "Appointment Analytics",
      icon: <Activity className="w-6 h-6 text-orange-500" />,
      description: "Track appointment status and distribution",
    },
  ];

  const OFFICE_LIST = [
    { office_id: 1, office_name: "Main Clinic" },
    { office_id: 2, office_name: "North Branch" },
    { office_id: 3, office_name: "South Branch" },
  ];

  const fetchAnalyticData = async (type, office) => {
    try {
      const response = await api.post("/users/portal/analytics", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "ANALYTICS",
        analyticType: type, // Pass the type in the body
        office: office,
        analyticData: {
          analyticType: type,
          office: office,
        },
      });
      console.log("sending office", office);
      console.log("GOT FROM ANALYTICS", response.data.data);
      setChartData(response.data.data);
    } catch (error) {
      console.error("Error fetching analytic data:", error);
    }
  };

  const handleAnalyticSelect = (analyticId) => {
    setSelectedAnalytic(analyticId);
    fetchAnalyticData(analyticId, selectedOffice);
  };

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
    if (selectedAnalytic) {
      fetchAnalyticData(selectedAnalytic, e.target.value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Select a category to view detailed analytics
        </p>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {analyticOptions.map((option) => (
            <AnalyticsCard
              key={option.id}
              title={option.title}
              icon={option.icon}
              description={option.description}
              isSelected={selectedAnalytic === option.id}
              onClick={() => handleAnalyticSelect(option.id)}
            />
          ))}
        </div>

        {/* Office Selection */}
        {selectedAnalytic && (
          <div className="mb-6">
            <select
              value={selectedOffice}
              onChange={handleOfficeChange}
              className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Offices</option>
              {OFFICE_LIST.map((office) => (
                <option key={office.office_id} value={office.office_id}>
                  {office.office_name}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Chart Display */}
        {chartData && (
          <div className="bg-white rounded-lg p-4 shadow">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
