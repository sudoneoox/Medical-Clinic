import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../utils/Select.tsx";
import { Button } from "../../../utils/Button.tsx";
import { Table2, PieChartIcon } from "lucide-react";

const FilterBar = ({
  selectedOffice,
  setSelectedOffice,
  dateRange,
  setDateRange,
  selectedRole,
  setSelectedRole,
  viewMode,
  setViewMode,
  OFFICE_LIST,
  DATE_RANGES,
  ROLE_LIST,
}) => (
  <div className="mb-6 flex flex-wrap gap-4">
    <Select value={selectedOffice} onValueChange={setSelectedOffice}>
      <SelectTrigger className="w-[200px] bg-white">
        <SelectValue placeholder="Select Office" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="all" className="bg-white hover:bg-gray-100">
          All Offices
        </SelectItem>
        {OFFICE_LIST.map((office) => (
          <SelectItem
            key={office.office_id}
            value={office.office_id.toString()}
            className="bg-white hover:bg-gray-100"
          >
            {office.office_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {/* Similar Select components for date and role */}

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
  </div>
);

export default FilterBar;
