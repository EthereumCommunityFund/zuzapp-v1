import { InputFieldType } from "@/types";

import SectionInputFormDescription from "./SectionInputFormDescription";
import InputFieldLabel from "./labels/inputFieldLabel";
import { Input } from "./input";
import InputFieldDark from "./inputFieldDark";

interface IProps {
  title: string,
  placeholder: string,
  description?: string,
  inputType: InputFieldType,
}

export default function SectionInputForm(props: IProps) {
  const { title, placeholder, description, inputType } = props;

  return (
    <div className="flex flex-col gap-[14px] items-start self-stretch">
      <InputFieldLabel name={title} />
      <InputFieldDark type={inputType} placeholder={placeholder} />
      {
        description && (
          <SectionInputFormDescription name={description} />
        )
      }
    </div>
  )
}