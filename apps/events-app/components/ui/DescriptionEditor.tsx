import TextEditor from "./TextEditor";
import InputFieldLabel from "./labels/inputFieldLabel";

interface IProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionEditor(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch">
      <InputFieldLabel name={`${props.title} Description`} />
      <TextEditor value={props.value} onChange={props.onChange} />
    </div>
  )
}