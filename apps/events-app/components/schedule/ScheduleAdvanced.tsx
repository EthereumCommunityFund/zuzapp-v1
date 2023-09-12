import { useState } from "react";
import SectionInputForm from "../ui/SectionInputForm";
import SwitchButton from "../ui/buttons/SwitchButton";

export default function ScheduleAdvanced() {
  const [isLimit, setIsLimit] = useState(false);

  const handleChangeSwitch = () => {
    setIsLimit(prev => !prev);
  }
  return (
    <>
      <span className="text-lg opacity-70 self-stretch">Advanced</span>
      <div className="flex flex-col items-center gap-5 self-stretch">
        <div className="flex items-center gap-5 self-stretch">
          <SwitchButton value={isLimit} onClick={handleChangeSwitch} />
          <span className="flex-1 text-base font-semibold leading-[1.2]">Limit RSVPs</span>
        </div>
        {
          isLimit && (
            <SectionInputForm title={"Select Amount"} defaultValue={"50"} inputType={"dropdown"} />
          )
        }
      </div>
    </>
  )
}