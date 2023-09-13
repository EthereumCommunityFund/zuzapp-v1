import ImageUploadButton from "../ui/buttons/SelectImageButton";
import ImageUploadButtonDescription from "../ui/labels/image-upload-button-description";
import InputFieldLabel from "../ui/labels/inputFieldLabel";

interface IProps {
  title: string;
}

export default function ImageUploadForm(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch">
      <InputFieldLabel name={`${props.title} Image`} />
      <ImageUploadButton title="Select Track Image" />
      <ImageUploadButtonDescription name="We recommend using at least a 420 X 320" />
    </div>
  )
}