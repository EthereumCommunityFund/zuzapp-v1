import { InputFieldType } from "@/types";
import { HiCalendar } from "react-icons/hi";
import React from "react";


type InputFieldDarkProps = {
  type: InputFieldType,
  placeholder: string,
} & React.HTMLAttributes<HTMLDivElement>;

const defaultProps: InputFieldDarkProps = {
  type: InputFieldType.Primary,
  placeholder: "Enter your text here",
}

export default function InputFieldDark(props: InputFieldDarkProps) {
  const { type, placeholder, ...rest } = { ...defaultProps, ...props };

  return (
    <div className="flex w-full rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10">
      {
        type === InputFieldType.Date && (
          <HiCalendar className="w-6 h-6" />
        )
      }
      <input className="bg-inputField w-full focus-visible:outline-none" placeholder={placeholder} {...rest} />
    </div>
  )
}