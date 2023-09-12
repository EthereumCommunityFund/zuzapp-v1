import { useState } from "react";
import SwitchButton from "../ui/buttons/SwitchButton"
import InputFieldLabel from "../ui/labels/input-field-label"
import SectionInputForm from "../ui/SectionInputForm";

export default function ScheduleDateTime() {
  const [isAllDay, setIsAllDay] = useState(false);

  const handleChangeSwitch = () => {
    setIsAllDay(prev => !prev);
  }

  return (
    <>
      <span className="text-lg opacity-70 self-stretch">Schedule Date & Times</span>
      <div className="flex flex-col items-start gap-5 self-stretch">
        <div className="flex gap-5">
          <SwitchButton value={isAllDay} onClick={handleChangeSwitch} />
          <InputFieldLabel name="All Day" />
        </div>
        <div className="flex items-center gap-[30px] self-stretch">
          <SectionInputForm title={"Date"} defaultValue={"00-00-0000"} inputType={"calendar"} description="Click & Select or type in a date" />
          {
            !isAllDay && (
              <>
                <SectionInputForm title={"Start Time"} defaultValue={"00:00"} inputType={"time"} description="Click & Select or type in a time" />
                <SectionInputForm title={"End Time"} defaultValue={"00:00"} inputType={"time"} description="Click & Select or type in a time" />
              </>
            )
          }
        </div>
        <SectionInputForm title={"Select a Timezone"} defaultValue={"Select Timezone"} inputType={"dropdown"} />
        <SectionInputForm title={"Select Schedule Frequency"} defaultValue={"Only Once"} inputType={"dropdown"} />
      </div>
    </>
  )
}