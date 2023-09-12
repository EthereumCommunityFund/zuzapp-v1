import ImageUploadButton from "../ui/buttons/SelectImageButton";
<<<<<<< HEAD
import ImageUploadButtonDescription from "../ui/labels/image-upload-button-description";
=======
>>>>>>> df0c4f1 (feat: add tracks page)
import InputFieldLabel from "../ui/labels/input-field-label";

interface IProps {
  title: string;  
}

export default function ImageUploadForm(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch">
      <InputFieldLabel name={`${props.title} Image`} />
      <ImageUploadButton title="Select Track Image"/>
<<<<<<< HEAD
      <ImageUploadButtonDescription name="We recommend using at least a 420 X 320"/>
=======
>>>>>>> df0c4f1 (feat: add tracks page)
    </div>
  )
}