import { useState } from "react";
import EditionFormTitle from "../ui/EditionFormTitle";
import InputFieldDark from "../ui/InputFieldDark";
import DescriptionEditor from "../ui/DescriptionEditor";
import ImageUploadForm from "../templates/ImageUploadForm";

export default function AddTrackForm () {
  const [editorValue, setEditorValue] = useState('');

  const handleTextEditorChange = (value: string) => {
    setEditorValue(value);
  };

  return (
    <div className="flex flex-col gap-[34px] self-stretch">
      <EditionFormTitle title="Add a Track"/>
      <InputFieldDark name={"Track Name"} placeholder={"ZK week"} type={"NoCaption"} />
      <DescriptionEditor title={"Track"} value={editorValue} onChange={setEditorValue} />
      <ImageUploadForm title={"Track"}/>
    </div>
  )
}