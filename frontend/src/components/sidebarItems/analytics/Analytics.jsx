import React, { useState, useCallback, useEffect } from "react";
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
  const [chartData, setChartData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    [FILTER_TYPES.OFFICE]: "all",
    [FILTER_TYPES.ROLE]: "all",
    [FILTER_TYPES.STATUS]: "all",
    // the calendar is disabled by default
    // so the date range is start-end
    [FILTER_TYPES.DATE_RANGE]: null,
  });

  // fetch data when filters or selections end
  useEffect(() => {
    if (selectedAnalytic) {
      fetchAnalyticData();
    }
  }, [selectedAnalytic, selectedSubCategory, filters]);

  // API request handler
  const fetchAnalyticData = useCallback(async () => {
    if (!selectedAnalytic) return;

    try {
      // prepare request body
      const requestBody = {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "ANALYTICS",
        analyticData: {
          analyticType: selectedAnalytic,
          subCategory: selectedSubCategory,
          office: filters[FILTER_TYPES.OFFICE],
          role: filters[FILTER_TYPES.ROLE],
          status: filters[FILTER_TYPES.STATUS],
        },
      };

      // add daterange filter if its been enabled by the user
      if (filters[FILTER_TYPES.DATE_RANGE]) {
        requestBody.analyticData.dateRange = filters[FILTER_TYPES.DATE_RANGE];
      }

      const response = await api.post("/users/portal/analytics", requestBody);

      let filteredData = response.data.data;

      // WARNING: its doing this in the frontend not backend I honestly think thats fine?

      // BUG: THIS WAS FUCKING CAUSING AN ISSUE WITH NOTHING APPEARING AFTER A FILTER CHANGE >:(
      // Thought this would be a shortcut and so that we wont have to make filters on row clicks either but this does not work
      //
      // // Only apply client-side data filtering if the date range is enabled
      // if (
      //   filters[FILTER_TYPES.DATE_RANGE] &&
      //   ["APPOINTMENTS", "BILLING"].includes(selectedAnalytic)
      // ) {
      //   const { startDate, endDate } = filters[FILTER_TYPES.DATE_RANGE];
      //   filteredData = filteredData.filter((item) => {
      //     const itemDate = new Date(item.name);
      //     return itemDate >= startDate && itemDate <= endDate;
      //   });
      // }
      //
      // //  apply role filter
      // if (filters[FILTER_TYPES.ROLE] !== "all") {
      //   filteredData = filteredData.filter(
      //     (item) => item.role === filters[FILTER_TYPES.ROLE],
      //   );
      // }
      //
      // // apply status filter
      // if (filters[FILTER_TYPES.STATUS] !== "all") {
      //   filteredData = filteredData.filter(
      //     (item) => item.status === filters[FILTER_TYPES.STATUS],
      //   );
      // }

      // update chart as well
      setChartData(filteredData);
    } catch (error) {
      console.error("Error fetching analytic data:", error);
    }
  }, [selectedAnalytic, selectedSubCategory, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
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
        [FILTER_TYPES.DATE_RANGE]: null,
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
            filters={filters}
            onFilterChange={handleFilterChange}
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
