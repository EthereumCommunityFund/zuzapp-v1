import EventLocation from "@/components/eventspace/EventLocation";

import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft } from "react-icons/hi";
import DetailsBar from "@/components/detailsbar";
import ScheduleForm from "@/components/schedule/ScheduleForm";



export default function AddSchedule() {
  return (
    <div className="flex w-full gap-10 overflow-hidden self-stretch">
      <DetailsBar />
      <div className="flex flex-col px-5 w-full gap-8">
        <Button leftIcon={HiArrowLeft} variant="light-dark">Back</Button>
        <ScheduleForm />
      </div>
    </div>
  )
}