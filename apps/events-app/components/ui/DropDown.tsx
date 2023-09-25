"use client"

import React, { useState } from 'react';
import Dropdown, { Option } from 'react-dropdown';

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
  const { placeholder, className } = props;
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
      controlClassName={className}
      menuClassName='rounded-2xl bg-componentPrimary'

    />
  );
};

export default MyDropdown;
