"use state";

import React, { useState } from "react";

interface DayOption {
  label: string;
  value: string;
  shortLabel: string;
}

interface MultiDayPickerProps {
  onChange?: (selectedDays: string[]) => void;
  initialSelected?: string[];
  className?: string;
}

const DAYS: DayOption[] = [
  { label: "Monday", value: "monday", shortLabel: "Mon" },
  { label: "Tuesday", value: "tuesday", shortLabel: "Tue" },
  { label: "Wednesday", value: "wednesday", shortLabel: "Wed" },
  { label: "Thursday", value: "thursday", shortLabel: "Thu" },
  { label: "Friday", value: "friday", shortLabel: "Fri" },
  { label: "Saturday", value: "saturday", shortLabel: "Sat" },
  { label: "Sunday", value: "sunday", shortLabel: "Sun" },
];

const MultiDayPicker: React.FC<MultiDayPickerProps> = ({
  onChange,
  initialSelected = [],
  className = "",
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSelected);

  const toggleDay = (dayValue: string) => {
    const updatedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue];

    setSelectedDays(updatedDays);
    onChange?.(updatedDays);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <button
            key={day.value}
            onClick={() => toggleDay(day.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
               ${
                !isSelected
                  ? "bg-coralPink text-champagne"
                  : "bg-champagne text-asparagus"
              }
            `}
            type="button"
            aria-pressed={isSelected}
          >
            <span className="hidden sm:inline">{day.label}</span>
            <span className="sm:hidden">{day.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MultiDayPicker;
