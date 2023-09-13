import { GoXCircle } from "react-icons/go";
import SectionInputForm from "../ui/SectionInputForm";
import InputFieldLabel from "../ui/labels/inputFieldLabel";

export default function ScheduleRoles() {
  return (
    <>
      <span className="text-lg opacity-70 self-stretch">Roles</span>
      <div className="flex flex-col gap-6 items-start self-stretch">
        <div className="flex items-start gap-6 self-stretch">
          <SectionInputForm title={"Enter Name"} defaultValue={"Janine Leger"} inputType={"input"} />
          <SectionInputForm title={"Select Role"} defaultValue={"Speaker"} inputType={"dropdown"} />
        </div>
        <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
          <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"Janine Leger"} /></button>
        </div>
      </div>
    </>
  )
}