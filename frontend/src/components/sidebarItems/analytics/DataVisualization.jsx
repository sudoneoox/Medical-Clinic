import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../utils/Card.tsx";
import ChartView from "./ChartView";
import DataTable from "./DataTable";
import { Button } from "../../../utils/Button.tsx";
import { Table2, PieChartIcon } from "lucide-react";
import api from "../../../api.js";

const DataVisualization = ({
  chartData,
  selectedAnalytic,
  selectedSubCategory,
  filters,
  dateRange,
}) => {
  const [viewMode, setViewMode] = useState("table");
  const [detailedData, setDetailedData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  // when clicking on a role send api request with header
  // to expand and show the data that made the analytic
  const handleRowClick = async (item, index) => {
    console.log(item);
    console.log(index);
    console.log(selectedAnalytic);
    try {
      if (expandedRow === index) {
        setExpandedRow(null);
        setDetailedData(null);
        return;
      }

      setExpandedRow(index);
      const response = await api.post("/users/portal/analytics/details", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        analyticData: {
          analyticType: selectedAnalytic,
          subCategory: selectedSubCategory,
          office: filters.office || "all",
          filter: item.name,
          dateRange: filters.dateRange || null,
          status: filters.status || "all",
          role: filters.role || "all",
        },
      });

      setDetailedData(response.data.details);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    }
  };

  // Calculate totals for revenue analysis
  const calculateTotals = () => {
    if (selectedAnalytic === "BILLING" && selectedSubCategory === "REVENUE") {
      return chartData.reduce((acc, curr) => {
        acc.totalPaid = (acc.totalPaid || 0) + curr.value;
        acc.totalDue = (acc.totalDue || 0) + (curr.totalDue || 0);
        return acc;
      }, {});
    }
    return null;
  };

  if (!chartData) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Data Visualization</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("chart")}
          >
            <PieChartIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "chart" ? (
          <ChartView data={chartData} />
        ) : (
          <DataTable
            data={chartData}
            expandedRow={expandedRow}
            detailedData={detailedData}
            onRowClick={handleRowClick}
            analyticType={selectedAnalytic}
            subCategory={selectedSubCategory}
            totals={calculateTotals()}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
