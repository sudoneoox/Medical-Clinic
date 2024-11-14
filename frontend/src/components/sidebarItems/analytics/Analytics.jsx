import React, { useState, useCallback } from "react";
import {
  analyticOptions,
  OFFICE_LIST,
  ROLE_LIST,
  DATE_RANGES,
} from "./constants.jsx";
import api from "../../../api.js";

import AnalyticsCard from "./AnalyticsCard";
import FilterBar from "./FilterBar";
import SubCategoryCards from "./SubCategoryCards";
import DataVisualization from "./DataVisualization";
import DetailSheet from "./DetailSheet";

const Analytics = () => {
  // State management
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [chartData, setChartData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // Default to table view
  const [dateRange, setDateRange] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  // initial api request when clicking on a category
  console.log(selectedAnalytic);
  const fetchAnalyticData = useCallback(
    async (type, subCategory, office, dateRange, role) => {
      try {
        const response = await api.post("/users/portal/analytics", {
          user_id: localStorage.getItem("userId"),
          user_role: "ADMIN",
          sidebarItem: "ANALYTICS",
          analyticData: {
            analyticType: type,
            subCategory: subCategory,
            office: office,
            dateRange: dateRange,
            role: role,
          },
        });
        setChartData(response.data.data);
      } catch (error) {
        console.error("Error fetching analytic data:", error);
      }
    },
    [],
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

  const handleFilterChange = useCallback(
    ({ office, date, role }) => {
      if (office !== undefined) {
        setSelectedOffice(office);
      }
      if (date !== undefined) {
        setDateRange(date);
      }
      if (role !== undefined) {
        setSelectedRole(role);
      }

      // Refetch data with new filters
      if (selectedAnalytic) {
        fetchAnalyticData(
          selectedAnalytic,
          selectedSubCategory,
          office ?? selectedOffice,
          date ?? dateRange,
          role ?? selectedRole,
        );
      }
    },
    [
      selectedAnalytic,
      selectedSubCategory,
      selectedOffice,
      dateRange,
      selectedRole,
      fetchAnalyticData,
    ],
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
        {selectedAnalytic !== "DEMOGRAPHICS" &&
          selectedAnalytic &&
          selectedAnalytic !== "BILLING" && (
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
              selectedAnalytic={selectedAnalytic}
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
            chartData={chartData}
            selectedAnalytic={selectedAnalytic}
            selectedSubCategory={selectedSubCategory}
            selectedOffice={selectedOffice}
            dateRange={dateRange}
          />
        )}

        {/* Details Panel */}
        <DetailSheet
          isOpen={showDetails}
          onOpenChange={setShowDetails}
          analyticType={selectedAnalytic}
          detailedData={detailedData}
        />
      </div>
    </div>
  );
};

export default Analytics;
