import Location from "../ui/Location";
import IconButton from "../ui/buttons/IconButton";
import { RxPlus } from "react-icons/rx"
import LocationForm from "./LOcationForm";

export default function EventLocation(){
  return (
    <div className="flex flex-col px-4 py-5 rounded-2xl border border-opacity-10 border-white gap-6 bg-opacity-10 bg-[#2E3131] w-full">
      <div className="w-full flex justify-between">
        <div className="text-[25px] font-normal leading-7.5">Locations</div>
        <div className="text-xl text-right font-bold opacity-70">1</div>
      </div>
      <Location />
      <div className="flex gap-5">
        <div className="font-semibold text-base leading-[19.px] flex items-center">Add a Location</div>
        <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxPlus}></IconButton>
      </div>
      <LocationForm />
    </div>
  )
}