import React, { useState } from 'react';
import { Portal } from '@radix-ui/react-portal';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from '@radix-ui/react-popover';
import { HiCalendar } from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ selectedDate, handleDateChange }) => {
  return (
    <div className='flex w-full rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10'>
      <DatePicker
        className='bg-inputField focus-visible:outline-none w-full'
        showIcon={true}
        placeholderText='00-00-0000'
        selected={selectedDate}
        onChange={date => handleDateChange(date)}
        dateFormat="MM-dd-yyyy"
      />
    </div>
  );
};

export default CustomDatePicker;
