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
  Calendar,
  UserSquare2,
  Globe2,
} from "lucide-react";
import api from "../../api.js";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// TODO: handle click events for pie chart dont know what to do for it yet maybe show the list of values under the little description that makes up that data
// TODO: add more comprehensive filter data ie not just office selection but date selection, role selection
// TODO: allow the piechart view to be toggleble other option besides piechart is being able to generate the data that actually made the report
// like when your viewing your transcript
// TODO: add billing into analytics as well
// TODO: show actual data in sql file format for the report and show the venn diagram optionally as a button

// SubCategory Card Component
const SubCategoryCard = ({ title, icon, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-2 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
  </div>
);

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
// Main Analytics Component
//
//
//
const Analytics = () => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [chartData, setChartData] = useState(null);
  const [selectedSlice, setSelectedSlice] = useState(null);

  const analyticOptions = [
    {
      id: "DEMOGRAPHICS",
      title: "User Demographics",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "View User age, gender, and ethnicity distribution",
      subCategories: [
        {
          id: "GENDER",
          title: "Gender Distribution",
          icon: <UserSquare2 className="w-4 h-4" />,
        },
        {
          id: "AGE",
          title: "Age Groups",
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          id: "ETHNICITY",
          title: "Ethnicity",
          icon: <Globe2 className="w-4 h-4" />,
        },
      ],
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

  // TODO: make it automatic
  const OFFICE_LIST = [
    { office_id: 1, office_name: "Main Clinic" },
    { office_id: 2, office_name: "North Branch" },
    { office_id: 3, office_name: "South Branch" },
  ];

  const DATE_RANGE = [];

  const ROLE_LIST = [
    { user_role: "Admin" },
    { user_role: "Patient" },
    { user_role: "Doctor" },
    { user_role: "Receptionists" },
    { user_role: "Nurse" },
  ];

  const fetchAnalyticData = async (type, subCategory, office) => {
    try {
      const response = await api.post("/users/portal/analytics", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "ANALYTICS",
        analyticData: {
          analyticType: type,
          subCategory: subCategory,
          office: office,
        },
      });
      setChartData(response.data.data);
      setSelectedSlice(null); // Reset selected slice when data changes
    } catch (error) {
      console.error("Error fetching analytic data:", error);
    }
  };

  const handleAnalyticSelect = (analyticId) => {
    setSelectedAnalytic(analyticId);
    setSelectedSubCategory(null);
    const option = analyticOptions.find((opt) => opt.id === analyticId);
    if (option?.subCategories) {
      setSelectedSubCategory(option.subCategories[0].id);
      fetchAnalyticData(analyticId, option.subCategories[0].id, selectedOffice);
    } else {
      fetchAnalyticData(analyticId, null, selectedOffice);
    }
  };

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    fetchAnalyticData(selectedAnalytic, subCategoryId, selectedOffice);
  };

  const handleOfficeChange = (e) => {
    const officeValue = e.target.value;
    setSelectedOffice(officeValue);
    if (selectedAnalytic) {
      fetchAnalyticData(selectedAnalytic, selectedSubCategory, officeValue);
    }
  };

  const handlePieClick = (entry, index) => {
    setSelectedSlice(selectedSlice === index ? null : index);
    // TODO: click logic ie show list of what s clicked
    console.log("Clicked slice:", entry);
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

        {/* Sub-categories for Demographics */}
        {selectedAnalytic === "DEMOGRAPHICS" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {analyticOptions
              .find((opt) => opt.id === "DEMOGRAPHICS")
              .subCategories.map((subCat) => (
                <SubCategoryCard
                  key={subCat.id}
                  title={subCat.title}
                  icon={subCat.icon}
                  isSelected={selectedSubCategory === subCat.id}
                  onClick={() => handleSubCategorySelect(subCat.id)}
                />
              ))}
          </div>
        )}

        {/* Office Selection */}
        {selectedAnalytic && (
          <>
            <div className="mb-6">
              <select
                value={selectedOffice}
                onChange={handleOfficeChange}
                className=" md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Offices</option>
                {OFFICE_LIST.map((office) => (
                  <option key={office.office_id} value={office.office_id}>
                    {office.office_name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="mb-6"> */}
            {/*   <select className=" md:w-auto px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"> */}
            {/*     <option value="all">Users</option> */}
            {/*     {OFFICE_LIST.map((office) => ( */}
            {/*       <option key={office.office_id} value={office.office_id}> */}
            {/*         {office.office_name} */}
            {/*       </option> */}
            {/*     ))} */}
            {/*   </select> */}
            {/* </div> */}
          </>
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
                  onClick={(entry, index) => handlePieClick(entry, index)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={
                        selectedSlice === null || selectedSlice === index
                          ? 1
                          : 0.5
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  onClick={(entry, index) => handlePieClick(entry, index)}
                  cursor="pointer"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Selected Slice Details */}
        {selectedSlice !== null && chartData && (
          <div className="mt-4 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-bold mb-2">
              {chartData[selectedSlice].name} Details
            </h3>
            <p>Value: {chartData[selectedSlice].value}</p>
            <p>
              Percentage:{" "}
              {(
                (chartData[selectedSlice].value /
                  chartData.reduce((sum, item) => sum + item.value, 0)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
