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
              {filters[FILTER_TYPES.DATE_RANGE].startDate ? (
                <>
                  {format(
                    filters[FILTER_TYPES.DATE_RANGE].startDate,
                    "LLL dd, y",
                  )}{" "}
                  -{" "}
                  {format(
                    filters[FILTER_TYPES.DATE_RANGE].endDate,
                    "LLL dd, y",
                  )}
                </>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters[FILTER_TYPES.DATE_RANGE].startDate}
              selected={{
                from: filters[FILTER_TYPES.DATE_RANGE].startDate,
                to: filters[FILTER_TYPES.DATE_RANGE].endDate,
              }}
              onSelect={handleDateSelect}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default FilterBar;
