import React, { useState } from "react";
import { HiCalendar, HiClock, HiLink } from "react-icons/hi";
import { InputFieldType } from "@/types";
import DropDown from "@/components/ui/DropDown";


type InputFieldDarkProps = {
  type: InputFieldType,
  placeholder: string,
  value?: string
} & React.HTMLAttributes<HTMLDivElement>;

const defaultProps: InputFieldDarkProps = {
  type: InputFieldType.Primary,
  placeholder: "Enter your text here",
}

export default function InputFieldDark({
  type,
  placeholder,
  value,
  ...rest
}: InputFieldDarkProps) {
  const [date, setDate] = useState<Date>();

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate)
      setDate(selectedDate);
  }

  return (
    type !== InputFieldType.Wysiwyg && type !== InputFieldType.Option ?
      (
        <div className="flex w-full rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10">
          {type === InputFieldType.Time && <HiClock className="w-6 h-6" />}
          {type === InputFieldType.Link && <HiLink className="w-6 h-6" />}
          <input className="bg-inputField w-full focus-visible:outline-none" value={value} placeholder={placeholder} {...rest} />
        </div>
      ) : (
        type === InputFieldType.Option ? (
          <DropDown placeholder={placeholder} options={[]} className={""}></DropDown>
        ) : (
          <></>
        )
      )
  );
}