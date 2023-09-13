import SectionInputForm from "../ui/SectionInputForm";
import TextEditor from "../ui/TextEditor";
import { Label } from "../ui/label";

import InputFieldLabel from "../ui/labels/inputFieldLabel";

export default function EventBasics() {
  return (
    <>
      <Label className="text-xl opacity-80 leading-[1.2]">Event Basics</Label>
      <div>
        <SectionInputForm title={"Event Space Name"} defaultValue={"ZuConnect"} inputType={"input"} />
      </div>
      <div>
        <div className="flex gap-[30px]">
          <SectionInputForm title={"Start Date"} defaultValue={"00-00-0000"} inputType={"calendar"} />
          <SectionInputForm title={"End Date"} defaultValue={"00-00-0000"} inputType={"calendar"} />
        </div>
      </div>
      <SectionInputForm title={"Event Tagline"} defaultValue={"Collest Web3 Events"} inputType={"input"} description={"This will be the short tagline below your event title"} />
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