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
  ChevronDown,
  Filter,
  Table2,
  PieChart as PieChartIcon,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../utils/Select.tsx";
import { Button } from "../../utils/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../utils/Card.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../utils/Sheet.tsx";
import api from "../../api.js";
import "../../styles/tailwindbase.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// TODO: handle click events for pie chart dont know what to do for it yet maybe show the list of values under the little description that makes up that data
// TODO: add more comprehensive filter data ie not just office selection but date selection, role selection
// TODO: allow the piechart view to be toggleble other option besides piechart is being able to generate the data that actually made the report
// like when your viewing your transcript
// TODO: add billing into analytics as well
// TODO: show actual data in sql file format for the report and show the venn diagram optionally as a button

const Analytics = () => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [chartData, setChartData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [viewMode, setViewMode] = useState("chart");
  const [dateRange, setDateRange] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
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
    {
      id: "BILLING",
      title: "Billing Analytics",
      icon: <DollarSign className="w-6 h-6 text-purple-500" />,
      description: "Track payment status and revenue distribution",
      subCategories: [
        {
          id: "PAYMENT_STATUS",
          title: "Payment Status",
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          id: "REVENUE",
          title: "Revenue Analysis",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
    },
  ];

  const OFFICE_LIST = [
    { office_id: 1, office_name: "Main Clinic" },
    { office_id: 2, office_name: "North Branch" },
    { office_id: 3, office_name: "South Branch" },
  ];

  const ROLE_LIST = [
    { user_role: "Admin" },
    { user_role: "Patient" },
    { user_role: "Doctor" },
    { user_role: "Receptionists" },
    { user_role: "Nurse" },
  ];

  const DATE_RANGES = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
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

  const handlePieClick = async (entry, index) => {
    setSelectedSlice(selectedSlice === index ? null : index);
    setShowDetails(true);

    try {
      const response = await api.post("/users/portal/analytics/details", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        analyticData: {
          analyticType: selectedAnalytic,
          subCategory: selectedSubCategory,
          office: selectedOffice,
          filter: entry.name,
        },
      });
      setDetailedData(response.data.details);
    } catch (error) {
      console.error("ERror fetching detailed data", error);
    }

    console.log("Clicked slice:", entry);
  };

  const getDetailedData = () => {
    if (!selectedSlice || !chartData) return [];
    const selectedCategory = chartData[selectedSlice];
    // This would normally come from the API based on the selection
    return Array(5)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: `${selectedCategory.name} Example ${i + 1}`,
        value: Math.floor(Math.random() * 100),
        date: new Date(2024, 0, i + 1).toLocaleDateString(),
      }));
  };

  const renderDataTable = () => {
    if (!chartData) return null;

    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(
                      (item.value /
                        chartData.reduce((sum, i) => sum + i.value, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderDetailedView = () => {
    if (!selectedSlice || !chartData || !detailedData) return null;

    const getFieldsBasedOnAnalytic = () => {
      switch (selectedAnalytic) {
        case "DEMOGRAPHICS":
          return [
            { key: "name", label: "Name" },
            { key: "dob", label: "Date of Birth" },
            { key: "email", label: "Email" },
          ];
        case "BILLING":
          return [
            { key: "id", label: "Bill ID" },
            { key: "amount", label: "Amount" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ];
        default:
          return [{ key: "name", label: "Name" }];
      }
    };

    return (
      <div className="space-y-4">
        {detailedData.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              {getFieldsBasedOnAnalytic().map((field) => (
                <div key={field.key} className="flex-1">
                  <div className="text-sm text-gray-500">{field.label}</div>
                  <div className="font-medium">{item[field.key]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
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
            <Card
              key={option.id}
              className={`cursor-pointer transition-all ${
                selectedAnalytic === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-300"
              }`}
              onClick={() => handleAnalyticSelect(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <div>
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Section */}
        {selectedAnalytic && (
          <div className="mb-6 flex flex-wrap gap-4">
            {/* office select  */}
            <Select value={selectedOffice} onValueChange={setSelectedOffice}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select Office" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Offices</SelectItem>
                {OFFICE_LIST.map((office) => (
                  <SelectItem
                    key={office.office_id}
                    value={office.office_id.toString()}
                    className="bg-white hover:bg-gray-100 w-[190px]"
                  >
                    {office.office_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* date range */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((range) => (
                  <SelectItem
                    key={range.id}
                    value={range.id}
                    className="bg-white hover:bg-gray w-[190px]"
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* role select */}
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLE_LIST.map((role) => (
                  <SelectItem
                    key={role.user_role}
                    value={role.user_role}
                    className="bg-white hover:bg-gray w-[190px]"
                  >
                    {role.user_role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* change between pie chart or table */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("chart")}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Sub-categories for Demographics */}
        {selectedAnalytic === "DEMOGRAPHICS" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {analyticOptions
              .find((opt) => opt.id === "DEMOGRAPHICS")
              .subCategories.map((subCat) => (
                <Card
                  key={subCat.id}
                  className={`cursor-pointer ${
                    selectedSubCategory === subCat.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => handleSubCategorySelect(subCat.id)}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      {subCat.icon}
                      <span className="text-sm font-medium">
                        {subCat.title}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {selectedAnalytic === "BILLING" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {analyticOptions
              .find((opt) => opt.id === "BILLING")
              .subCategories.map((subCat) => (
                <Card
                  key={subCat.id}
                  className={`cursor-pointer ${
                    selectedSubCategory === subCat.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => handleSubCategorySelect(subCat.id)}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2">
                      {subCat.icon}
                      <span className="text-sm font-medium">
                        {subCat.title}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Chart/Table Display */}
        {chartData && (
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <div className="h-[400px]">
                  <ResponsiveContainer>
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
              ) : (
                renderDataTable()
              )}
            </CardContent>
          </Card>
        )}

        {/* Details Sheet */}
        {selectedSlice !== null && chartData && (
          <Sheet open={showDetails} onOpenChange={setShowDetails}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{chartData[selectedSlice].name} Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="space-y-4">
                  {getDetailedData().map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                        <span className="text-lg font-semibold">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default Analytics;
