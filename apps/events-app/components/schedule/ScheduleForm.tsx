import FormTitle from "../ui/labels/form-title";
import ScheduleAdvanced from "./ScheduleAdvanced";
import ScheduleDateTime from "./ScheduleDateTime";
import ScheduleDescription from "./ScheduleDescription";
import ScheduleFormat from "./ScheduleFormat";
import ScheduleLabels from "./ScheduleLabels";
import ScheduleLocation from "./ScheduleLocation";
import ScheduleRoles from "./ScheduleRoles";

export default function ScheduleForm() {
  return (
    <div className="flex flex-col items-center gap-[34px] self-stretch">
      <FormTitle name="Add a Schedule" />
      <ScheduleFormat setEventCreated={function (eventCreated: boolean): void {
        throw new Error("Function not implemented.");
      }} />
      <ScheduleDescription />
      <line></line>
      <ScheduleDateTime />
      <line></line>
      <ScheduleLocation />
      <line></line>
      <ScheduleRoles />
      <line></line>
      <ScheduleLabels />
      <line></line>
      <ScheduleAdvanced />
    </div>
  )
}