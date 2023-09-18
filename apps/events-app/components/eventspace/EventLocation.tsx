import Location from "../ui/Location";
import IconButton from "../ui/buttons/IconButton";
import { RxPlus } from "react-icons/rx"
import EventLocationForm from "./EventLocationForm";
import { useState } from "react";
import Container from "../ui/Container";

export default function EventLocation() {
  const [isLocationForm, setIsLocationForm] = useState<boolean>(false);
  return (
    <div className="flex py-10 px-4 flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full">
      <div className="w-full flex justify-between">
        <div className="text-[25px] font-normal leading-7.5">Locations</div>
        <div className="text-xl text-right font-bold opacity-70">1</div>
      </div>
      <Location />
      <div className="flex gap-5 w-full">
        <div className="font-semibold text-base leading-[19.px] flex items-center">Add a Location</div>
        <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxPlus} onClick={() => (setIsLocationForm(!isLocationForm))}></IconButton>
      </div>
      {
        isLocationForm && (
          <EventLocationForm />
        )
      }
    </div>
  )
}