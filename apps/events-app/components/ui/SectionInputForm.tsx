import InputWrapper from "./Input-Wrapper";
import SectionInputFormDescription from "./SectionInputFormDescription";
import InputFieldLabel from "./labels/input-field-label";

interface IProps {
  title: string,
  defaultValue: string,
  description?: string,
  inputType: string,
}

export default function SectionInputForm(props: IProps) {
  const { title, defaultValue, description, inputType } = props;

  return (
    <div className="flex flex-col gap-[14px] items-start self-stretch">
      <InputFieldLabel name={title} />
      <InputWrapper>
        <input value={defaultValue} className="bg-[#242727] h-4 w-full"></input>
      </InputWrapper>
      {
        description && (
          <SectionInputFormDescription name={description} />
        )
      }
    </div>
  )
}