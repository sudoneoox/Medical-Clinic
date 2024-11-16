import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../utils/Select.tsx";
import { FILTER_TYPES, OFFICE_LIST, ROLE_LIST, STATUSES } from "./constants";
import DateRangePicker from "./DatePicker.jsx";

const FilterBar = ({
  selectedAnalytic,
  filters,
  onFilterChange,
  availableFilters,
}) => {
  // For calendar
  const handleDateRangeChange = useCallback(
    (dateRange) => {
      onFilterChange({ [FILTER_TYPES.DATE_RANGE]: dateRange });
    },
    [onFilterChange],
  );

  const getStatusOptions = useCallback(() => {
    if (selectedAnalytic === "BILLING") {
      return STATUSES.PAYMENT;
    }
    return STATUSES.APPOINTMENT;
  }, [selectedAnalytic]);

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* Office Filter */}
      {availableFilters.includes(FILTER_TYPES.OFFICE) && (
        <Select
          value={filters[FILTER_TYPES.OFFICE]}
          onValueChange={(value) =>
            onFilterChange({ [FILTER_TYPES.OFFICE]: value })
          }
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Select Office" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            {OFFICE_LIST.map((office) => (
              <SelectItem
                key={office.office_id}
                value={office.office_id.toString()}
              >
                {office.office_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Role Filter */}
      {availableFilters.includes(FILTER_TYPES.ROLE) && (
        <Select
          value={filters[FILTER_TYPES.ROLE]}
          onValueChange={(value) =>
            onFilterChange({ [FILTER_TYPES.ROLE]: value })
          }
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLE_LIST.map((role) => (
              <SelectItem key={role.user_role} value={role.user_role}>
                {role.user_role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Status Filter */}
      {availableFilters.includes(FILTER_TYPES.STATUS) && (
        <Select
          value={filters[FILTER_TYPES.STATUS]}
          onValueChange={(value) =>
            onFilterChange({ [FILTER_TYPES.STATUS]: value })
          }
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {getStatusOptions().map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Date Range Filter */}
      {availableFilters.includes(FILTER_TYPES.DATE_RANGE) && (
        <DateRangePicker
          startDate={filters[FILTER_TYPES.DATE_RANGE]?.startDate}
          endDate={filters[FILTER_TYPES.DATE_RANGE]?.endDate}
          onChange={handleDateRangeChange}
        />
      )}
    </div>
  );
};

export default FilterBar;
