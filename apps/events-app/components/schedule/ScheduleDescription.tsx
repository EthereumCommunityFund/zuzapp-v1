import SectionInputForm from "../ui/SectionInputForm";
import TextEditor from "../ui/TextEditor";
import InputFieldLabel from "../ui/labels/input-field-label";

export default function ScheduleDescription() {
  return (
    <>
      <SectionInputForm title={"Schedule Name"} defaultValue={"ZuConnect"} inputType={"input"} />
      <div>
        <div className="flex flex-col gap-[10px]">
          <InputFieldLabel name="Schedule Description" />
          <TextEditor value={""} onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }} />
        </div>
      </div>
    </>
  )
}