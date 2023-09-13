import SectionInputForm from "../ui/SectionInputForm";
import TextEditor from "../ui/TextEditor";
import { Label } from "../ui/label";
import { InputFieldType } from "@/types";

import InputFieldLabel from "../ui/labels/inputFieldLabel";

export default function EventBasics() {
  return (
    <>
      <Label className="text-2xl opacity-80 leading-[1.2]">Event Basics</Label>
      <div>
        <SectionInputForm title={"Event Space Name"} placeholder={"ZuConnect"} inputType={InputFieldType.Primary} />
      </div>
      <div>
        <div className="flex gap-3">
          <SectionInputForm className="w-1/2" title={"Start Date"} placeholder={"00-00-0000"} inputType={InputFieldType.Date} description="Click & Select or type in a date" />
          <SectionInputForm className="w-1/2" title={"End Date"} placeholder={"00-00-0000"} inputType={InputFieldType.Date} description="Click & Select or type in a date" />
        </div>
      </div>
      <SectionInputForm title={"Event Tagline"} placeholder={"Coolest Web3 Events"} inputType={InputFieldType.Primary} description={"This will be the short tagline below your event title"} />
      <div>
        <div className="flex flex-col gap-[10px]">
          <InputFieldLabel name="Event Description" />
          <TextEditor value={""} onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }} />
        </div>
      </div>
    </>
  )
}