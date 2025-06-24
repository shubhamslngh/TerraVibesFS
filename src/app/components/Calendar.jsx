"use client";

import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme css

export default function DateRangeSelector({ onChange }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    onChange && onChange(ranges.selection);
  };

  return (
    <div className="rounded-lg shadow-md p-4 bg-stone-300 w-fit">
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={range}
        rangeColors={["#3b82f6"]}
      />
    </div>
  );
}
