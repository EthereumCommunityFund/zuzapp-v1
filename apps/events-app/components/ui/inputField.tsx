import { Input } from "./input";
import { Label } from "./label";

interface Props {
  title: string,
  placeholder: string,
  type: string,
}

export default function InputField(props: Props) {
  const { title, placeholder, type } = props;
  return (
    <div className="flex flex-col items-start gap-[14px] self-stretch">
      <Label>{title}</Label>
      <Input placeholder={placeholder} />
    </div>
  )
}