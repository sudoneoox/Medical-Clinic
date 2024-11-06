import React, { useState, useCallback } from "react";
import {
  Building2,
  Users,
  Activity,
  Calendar,
  UserSquare2,
  Globe2,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import api from "../../../api.js";

import AnalyticsCard from "./AnalyticsCard";
import FilterBar from "./FilterBar";
import SubCategoryCards from "./SubCategoryCards";
import DataVisualization from "./DataVisualization";
import DetailSheet from "./DetailSheet";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  // State management
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [chartData, setChartData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // Default to table view
  const [dateRange, setDateRange] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  // Configuration constants
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

  // Data fetching functions
  const fetchAnalyticData = useCallback(
    async (type, subCategory, office) => {
      try {
        const response = await api.post("/users/portal/analytics", {
          user_id: localStorage.getItem("userId"),
          user_role: "ADMIN",
          sidebarItem: "ANALYTICS",
          analyticData: {
            analyticType: type,
            subCategory: subCategory,
            office: office,
            dateRange,
            role: selectedRole,
          },
        });
        setChartData(response.data.data);
        setSelectedSlice(null);
      } catch (error) {
        console.error("Error fetching analytic data:", error);
      }
    },
    [dateRange, selectedRole],
  );

  const fetchDetailedData = useCallback(
    async (entry) => {
      try {
        const response = await api.post("/users/portal/analytics/details", {
          user_id: localStorage.getItem("userId"),
          user_role: "ADMIN",
          analyticData: {
            analyticType: selectedAnalytic,
            subCategory: selectedSubCategory,
            office: selectedOffice,
            filter: entry.name,
            dateRange,
            role: selectedRole,
          },
        });
        setDetailedData(response.data.details);
      } catch (error) {
        console.error("Error fetching detailed data:", error);
      }
    },
    [
      selectedAnalytic,
      selectedSubCategory,
      selectedOffice,
      dateRange,
      selectedRole,
    ],
  );

  // Event handlers
  const handleAnalyticSelect = useCallback(
    (analyticId) => {
      setSelectedAnalytic(analyticId);
      setSelectedSubCategory(null);
      const option = analyticOptions.find((opt) => opt.id === analyticId);
      if (option?.subCategories) {
        setSelectedSubCategory(option.subCategories[0].id);
        fetchAnalyticData(
          analyticId,
          option.subCategories[0].id,
          selectedOffice,
        );
      } else {
        fetchAnalyticData(analyticId, null, selectedOffice);
      }
    },
    [selectedOffice, fetchAnalyticData],
  );

  const handleSubCategorySelect = useCallback(
    (subCategoryId) => {
      setSelectedSubCategory(subCategoryId);
      fetchAnalyticData(selectedAnalytic, subCategoryId, selectedOffice);
    },
    [selectedAnalytic, selectedOffice, fetchAnalyticData],
  );

  const handlePieClick = useCallback(
    async (entry, index) => {
      setSelectedSlice(selectedSlice === index ? null : index);
      setShowDetails(true);
      await fetchDetailedData(entry);
    },
    [selectedSlice, fetchDetailedData],
  );

  const handleFilterChange = useCallback(
    ({ office, date, role }) => {
      if (office !== undefined) setSelectedOffice(office);
      if (date !== undefined) setDateRange(date);
      if (role !== undefined) setSelectedRole(role);

      if (selectedAnalytic) {
        fetchAnalyticData(
          selectedAnalytic,
          selectedSubCategory,
          office ?? selectedOffice,
        );
      }
    },
    [selectedAnalytic, selectedSubCategory, fetchAnalyticData],
  );

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
              option={option}
              isSelected={selectedAnalytic === option.id}
              onClick={() => handleAnalyticSelect(option.id)}
            />
          ))}
        </div>

        {/* Filters */}
        {selectedAnalytic && (
          <FilterBar
            selectedOffice={selectedOffice}
            dateRange={dateRange}
            selectedRole={selectedRole}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onFilterChange={handleFilterChange}
            OFFICE_LIST={OFFICE_LIST}
            DATE_RANGES={DATE_RANGES}
            ROLE_LIST={ROLE_LIST}
          />
        )}

        {/* Sub Categories */}
        {(selectedAnalytic === "DEMOGRAPHICS" ||
          selectedAnalytic === "BILLING") && (
          <SubCategoryCards
            type={selectedAnalytic}
            analyticOptions={analyticOptions}
            selectedSubCategory={selectedSubCategory}
            onSelect={handleSubCategorySelect}
          />
        )}

        {/* Data Display */}
        {chartData && (
          <DataVisualization
            viewMode={viewMode}
            chartData={chartData}
            selectedSlice={selectedSlice}
            handlePieClick={handlePieClick}
          />
        )}

        {/* Details Panel */}
        <DetailSheet
          isOpen={showDetails}
          onOpenChange={setShowDetails}
          title={chartData?.[selectedSlice]?.name}
          analyticType={selectedAnalytic}
          detailedData={detailedData}
        />
      </div>
    </div>
  );
};

export default Analytics;
