import { useState } from "react";

import InputWrapper from "../ui/Input-Wrapper";
import TextEditor from "../ui/TextEditor";
import SwitchButton from "../ui/buttons/SwitchButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel1 from "../ui/labels/event-space-label-1";

export default function EventLocationForm() {
  const [editorValue, setEditorValue] = useState('');

  const handleTextEditorChange = (value: string) => {
    setEditorValue(value);
  };

  return (
    <div className="flex flex-col p-5 rounded-[10px] border items-start	gap-[30px] self-stretch border-opacity-10 bg-[#2B2E2E]">
      <div className="flex items-center gap-5 opacity-50">
        <span className="font-sans text-base font-semibold leading-[19.2px]">The Dome</span>
      </div>
      <div className="flex flex-col justify-center items-start gap-[10px] self-stretch">
        <div className="flex items-center gap-5 self-stretch">
          <SwitchButton />
          <EventSpaceLabel1 name="Main Location" />
        </div>
        <EventDeatilsDescription1 name="This is the location of the main event" />
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <EventSpaceLabel1 name="Location Name" />
        <InputWrapper>
          <input placeholder="Name of this location" className="bg-[#242727] h-4 w-full"></input>
        </InputWrapper>
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <EventSpaceLabel1 name="Address" />
        <InputWrapper>
          <input placeholder="Type the address" className="bg-[#242727] h-4 w-full"></input>
        </InputWrapper>
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <EventSpaceLabel1 name="Capacity" />
        <InputWrapper>
          <input placeholder="Enter a number" className="bg-[#242727] h-4 w-full"></input>
        </InputWrapper>
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <EventSpaceLabel1 name="Location Description" />
        <TextEditor value={editorValue} onChange={handleTextEditorChange} />
      </div>
    </div>
  )
}