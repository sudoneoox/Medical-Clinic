import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../utils/Select.tsx";

const FilterBar = ({
  selectedOffice,
  dateRange,
  onFilterChange,
  OFFICE_LIST,
  DATE_RANGES,
  selectedAnalytic,
}) => (
  <div className="mb-6 flex flex-wrap gap-4">
    <Select
      value={selectedOffice}
      onValueChange={(value) => onFilterChange({ office: value })}
    >
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
    {selectedAnalytic !== "STAFF" && (
      <Select
        value={dateRange}
        onValueChange={(value) => onFilterChange({ date: value })}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select Time Period" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {DATE_RANGES.map((range) => (
            <SelectItem
              key={range.id}
              value={range.id}
              className="bg-white hover:bg-gray-100"
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </div>
);

export default FilterBar;
