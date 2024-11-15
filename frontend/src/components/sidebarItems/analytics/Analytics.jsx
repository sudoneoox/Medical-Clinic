import React, { useState, useCallback } from "react";
import api from "../../../api.js";
import { sub } from "date-fns";
import { analyticOptions, FILTER_TYPES, STATUSES } from "./constants.jsx";

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
  const [viewMode, setViewMode] = useState("table"); // table or pie chart default is table
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: sub(new Date(), { months: 1 }),
    endDate: new Date(),
  });
  const [filters, setFilters] = useState({
    [FILTER_TYPES.OFFICE]: "all",
    [FILTER_TYPES.ROLE]: "all",
    [FILTER_TYPES.STATUS]: "all",
    [FILTER_TYPES.DATE_RANGE]: {
      startDate: sub(new Date(), { months: 1 }),
      endDate: new Date(),
    },
  });

  const getAvailableFilters = (analyticType) => {
    switch (analyticType) {
      case "DEMOGRAPHICS":
        return ["office", "dateRange"];
      case "STAFF":
        return ["office"];
      case "APPOINTMENTS":
        return ["office", "dateRange"];
      case "BILLING":
        return ["office", "dateRange"];
      default:
        return [];
    }
  };

  // initial api request when clicking on a category

  const fetchAnalyticData = useCallback(async () => {
    if (!selectedAnalytic) return;

    try {
      const response = await api.post("/users/portal/analytics", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "ANALYTICS",
        analyticData: {
          analyticType: selectedAnalytic,
          subCategory: selectedSubCategory,
          office: filters[FILTER_TYPES.OFFICE],
          dateRange: filters[FILTER_TYPES.DATE_RANGE],
          role: filters[FILTER_TYPES.ROLE],
          status: filters[FILTER_TYPES.STATUS],
        },
      });

      let filteredData = response.data.data;

      // BUG: Client-side filtering based on date range for relevant analytics
      if (["APPOINTMENTS", "BILLING"].includes(selectedAnalytic)) {
        const { startDate, endDate } = filters[FILTER_TYPES.DATE_RANGE];
        filteredData = filteredData.filter((item) => {
          const itemDate = new Date(item.name);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      // BUG: Client-side filtering based on status
      if (filters[FILTER_TYPES.STATUS] !== "all") {
        filteredData = filteredData.filter(
          (item) => item.status === filters[FILTER_TYPES.STATUS],
        );
      }

      // BUG: Client-side filtering based on role
      if (filters[FILTER_TYPES.ROLE] !== "all") {
        filteredData = filteredData.filter(
          (item) => item.role === filters[FILTER_TYPES.ROLE],
        );
      }

      setChartData(filteredData);
    } catch (error) {
      console.error("Error fetching analytic data:", error);
    }
  }, [selectedAnalytic, selectedSubCategory, filters]);

  const handleFilterChange = useCallback(({ office, startDate, endDate }) => {
    if (office !== undefined) {
      setSelectedOffice(office);
    }
    if (startDate !== undefined && endDate !== undefined) {
      setDateRange({ startDate, endDate });
    }
  }, []);

  const handleAnalyticSelect = useCallback(
    (analyticId) => {
      setSelectedAnalytic(analyticId);
      setSelectedSubCategory(null);

      // Reset filters when changing analytics type
      const option = analyticOptions.find((opt) => opt.id === analyticId);
      const defaultFilters = {
        [FILTER_TYPES.OFFICE]: "all",
        [FILTER_TYPES.ROLE]: "all",
        [FILTER_TYPES.STATUS]: "all",
        [FILTER_TYPES.DATE_RANGE]: filters[FILTER_TYPES.DATE_RANGE], // Keep current date range
      };
      setFilters(defaultFilters);

      if (option?.subCategories) {
        setSelectedSubCategory(option.subCategories[0].id);
      }
    },
    [filters],
  );

  const handleSubCategorySelect = useCallback((subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
  }, []);

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
            selectedAnalytic={selectedAnalytic}
            filters={filters}
            onFilterChange={handleFilterChange}
            availableFilters={
              analyticOptions.find((opt) => opt.id === selectedAnalytic)
                ?.availableFilters || []
            }
          />
        )}

        {/* Sub Categories */}
        {selectedAnalytic &&
          analyticOptions.find((opt) => opt.id === selectedAnalytic)
            ?.subCategories && (
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
        />
      </div>
    </div>
  );
};

export default Analytics;
