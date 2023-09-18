import React, { forwardRef, Ref } from 'react';


import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiCalendar } from 'react-icons/hi';

interface DatePickerProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ selectedDate, handleDateChange }) => {
  return (
    <div className='flex w-full rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10'>
      <HiCalendar className='w-5 h-5' />
      <DatePicker
        className='bg-inputField focus-visible:outline-none w-full'
        placeholderText='00-00-0000'
        selected={selectedDate}
        onChange={date => handleDateChange(date)}
        dateFormat="MM-dd-yyyy"
      />
    </div>
  );
};

export default CustomDatePicker;
