import { InputFieldType } from "@/types";
import { HiCalendar } from "react-icons/hi";
import { Input } from "./input";


interface IProps {
  type: InputFieldType,
  placeholder: string,
}

const defaultProps: IProps = {
  type: InputFieldType.Primary,
  placeholder: "Enter your text here",
}

export default function InputFieldDark(props: IProps) {
  const { type, placeholder } = { ...defaultProps, ...props };

  return (
    <div className="flex gap-2">
      {
        type === InputFieldType.Date && (
          <HiCalendar />
        )
      }
      <Input placeholder={placeholder} />
    </div>
  )
}