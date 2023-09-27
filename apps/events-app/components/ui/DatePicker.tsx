import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null; // Changed to allow null
  handleDateChange: (date: Date | null) => void;
}

function range(start: number, end: number, step: number): number[] {
  return Array.from(
    { length: Math.floor((end - start) / step) + 1 },
    (_, i) => start + i * step
  );
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  handleDateChange,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selectedDate);

  const years = range(1990, new Date().getFullYear() + 1, 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex w-full rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10">
      <DatePicker
        className="bg-inputField focus-visible:outline-none w-full"
        showIcon
        placeholderText="00-00-0000"
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          handleDateChange(date);
        }}
        dateFormat="MM-dd-yyyy"
        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button onClick={decreaseMonth}>&lt;</button>
            <select
              value={date.getFullYear()}
              onChange={(e) => changeYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={months[date.getMonth()]}
              onChange={(e) => changeMonth(months.indexOf(e.target.value))}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <button onClick={increaseMonth}>&gt;</button>
          </div>
        )}
      />
    </div>
  );
};

export default CustomDatePicker;
