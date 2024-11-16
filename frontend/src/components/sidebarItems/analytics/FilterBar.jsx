import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../utils/Select.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../utils/Popover.tsx";
import { Button } from "../../../utils/Button.tsx";
import { Calendar } from "../../../utils/Calendar.tsx";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { FILTER_TYPES, OFFICE_LIST, ROLE_LIST, STATUSES } from "./constants";

const FilterBar = ({
  selectedAnalytic,
  filters,
  onFilterChange,
  availableFilters,
}) => {
  const handleDateSelect = useCallback(
    (range) => {
      if (range?.from) {
        // if range is cleared, set dateRange to null
        // i.e. disable calendar
        onFilterChange({
          [FILTER_TYPES.DATE_RANGE]: null,
        });
        return;
      }
      // else handle it normally
      if (range.from) {
        onFilterChange({
          [FILTER_TYPES.DATE_RANGE]: {
            startDate: range.from,
            endDate: range.to || range.from,
          },
        });
      }
    },
    [onFilterChange],
  );

  const getStatusOptions = useCallback(() => {
    if (selectedAnalytic === "BILLING") {
      return STATUSES.PAYMENT;
    }
    return STATUSES.APPOINTMENT;
  }, [selectedAnalytic]);

  const getDateButtonText = () => {
    if (!filters[FILTER_TYPES.DATE_RANGE]) {
      return <span>Pick a date range</span>;
    }
    const { startDate, endDate } = filters[FILTER_TYPES.DATE_RANGE];
    return (
      <>
        {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
      </>
    );
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateButtonText()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={
                filters[FILTER_TYPES.DATE_RANGE]?.startDate || new Date()
              }
              selected={
                filters[FILTER_TYPES.DATE_RANGE]
                  ? {
                      from: filters[FILTER_TYPES.DATE_RANGE].startDate,
                      to: filters[FILTER_TYPES.DATE_RANGE].endDate,
                    }
                  : undefined
              }
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
            {filters[FILTER_TYPES.DATE_RANGE] && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onFilterChange({ [FILTER_TYPES.DATE_RANGE]: null })
                  }
                >
                  Clear Date Range
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default FilterBar;
