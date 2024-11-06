import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../utils/Card.tsx";
import ChartView from "./ChartView";
import DataTable from "./DataTable";

const DataVisualization = ({
  viewMode,
  chartData,
  selectedSlice,
  handlePieClick,
}) => {
  if (!chartData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {viewMode === "chart" ? (
          <ChartView
            data={chartData}
            selectedSlice={selectedSlice}
            handlePieClick={handlePieClick}
          />
        ) : (
          <DataTable data={chartData} />
        )}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
