"use client"

import React, { useState } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { IconType } from 'react-icons';

interface IProps {
  placeholder: string;
  options: Option[];
  className: string;
}

const options: Option[] = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
];

const MyDropdown: React.FC<IProps> = (props) => {
  const { placeholder, options, className } = props;
  const [selectedOption, setSelectedOption] = useState<Option | string | undefined>();

  const handleDropdownChange = (option: Option) => {
    setSelectedOption(option);
  };

  return (
    <Dropdown
      options={options}
      onChange={handleDropdownChange}
      value={selectedOption}
      placeholder={placeholder}
      baseClassName="bg-white"
      className='background-color: black'
      controlClassName={className}
      placeholderClassName={className}
    />
  );
};

export default MyDropdown;
