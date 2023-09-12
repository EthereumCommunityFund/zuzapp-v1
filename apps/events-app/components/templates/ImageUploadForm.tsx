import ImageUploadButton from "../ui/buttons/SelectImageButton";
import InputFieldLabel from "../ui/labels/input-field-label";

interface IProps {
  title: string;  
}

export default function ImageUploadForm(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch">
      <InputFieldLabel name={`${props.title} Image`} />
      <ImageUploadButton title="Select Track Image"/>
    </div>
  )
}