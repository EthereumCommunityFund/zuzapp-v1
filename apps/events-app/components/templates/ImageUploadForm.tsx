import SelectImageButton from "../ui/buttons/SelectImageButton";
import ImageUploadButtonDescription from "../ui/labels/image-upload-button-description";
import InputFieldLabel from "../ui/labels/inputFieldLabel";

interface IProps {
  title: string;
}

export default function ImageUploadForm(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] w-[420px] h-[320px]">
      <InputFieldLabel name={`${props.title} Image`} />
      <SelectImageButton title="Select Track Image" />
      <ImageUploadButtonDescription name="We recommend using at least a 420 X 320" />
    </div>
  )
}