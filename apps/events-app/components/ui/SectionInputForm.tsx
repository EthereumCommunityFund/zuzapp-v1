import { InputFieldType } from "@/types";

import SectionInputFormDescription from "./SectionInputFormDescription";
import InputFieldLabel from "./labels/inputFieldLabel";
import { cn } from "@/lib/utils";
import InputFieldDark from "./inputFieldDark";

type SectionInputFormProps = {
  title: string;
  placeholder?: string;
  description?: string;
  inputType: InputFieldType;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SectionInputForm({
  title,
  description,
  inputType,
  placeholder,
  className,
}: SectionInputFormProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[14px] items-start self-stretch",
        className
      )}
    >
      <InputFieldLabel name={title} />
      <InputFieldDark type={inputType} placeholder={placeholder} />
      {description && <SectionInputFormDescription name={description} />}
    </div>
  );
}
