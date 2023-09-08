import { Input } from "./input";
import InputFieldLabel from "./labels/input-field-label";

interface Props {
  name: string,
  placeholder: string,
  type: string,
}

export default function InputFieldDark (props: Props) {
  return (
    <div className="flex flex-col items-start gap-[14px] self-stretch">
      <InputFieldLabel name={props.name}/>
      <Input className="flex h-10 py-2.5 pl-2.5 pr-3" placeholder="ZK Week" />
    </div>
  )
}