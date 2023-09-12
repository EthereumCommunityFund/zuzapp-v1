import ImageUploadButton from "../ui/buttons/SelectImageButton";
import ImageUploadButtonDescription from "../ui/labels/image-upload-button-description";
import InputFieldLabel from "../ui/labels/input-field-label";

interface IProps {
<<<<<<< HEAD
  title: string;
=======
  title: string;  
>>>>>>> df1dcdbf62c9b28231a82a6c0ebcb064226f4982
}

export default function ImageUploadForm(props: IProps) {
  return (
    <div className="flex flex-col items-start gap-[10px] self-stretch">
      <InputFieldLabel name={`${props.title} Image`} />
<<<<<<< HEAD
      <ImageUploadButton title="Select Track Image" />
      <ImageUploadButtonDescription name="We recommend using at least a 420 X 320" />
=======
      <ImageUploadButton title="Select Track Image"/>
      <ImageUploadButtonDescription name="We recommend using at least a 420 X 320"/>
>>>>>>> df1dcdbf62c9b28231a82a6c0ebcb064226f4982
    </div>
  )
}