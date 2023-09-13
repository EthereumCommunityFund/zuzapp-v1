import { GoXCircle } from "react-icons/go";
import SectionInputForm from "../ui/SectionInputForm";
import InputFieldLabel from "../ui/labels/inputFieldLabel";

export default function ScheduleLabels() {
  return (
    <>
      <span className="text-lg opacity-70 self-stretch">Roles</span>
      <SectionInputForm title={"Select Event Category"} defaultValue={"Workshop"} inputType={"dropdown"} />
      <SectionInputForm title={"Select Experience Level"} defaultValue={"Beginner"} inputType={"dropdown"} />
      <div className="flex flex-col items-start gap-6 self-stretch">
        <SectionInputForm title={"Add Tags"} defaultValue={"Workshop"} inputType={"iconinput"} description="Add multiple tags separated by commas" />
        <div className="flex items-start gap-[10px]">
          <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
            <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"TagOne"} /></button>
          </div>
          <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
            <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"TagTwo"} /></button>
          </div>
        </div>
      </div>
    </>
  )
}