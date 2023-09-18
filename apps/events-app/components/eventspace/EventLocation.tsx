import Location from "../ui/Location";
import IconButton from "../ui/buttons/IconButton";
import { RxPlus } from "react-icons/rx"
import EventLocationForm from "./EventLocationForm";
import { useState } from "react";
import Container from "../ui/Container";
import Button from "../ui/buttons/Button";
import { CgClose } from "react-icons/cg";
import { HiPencilAlt } from "react-icons/hi";

export default function EventLocation() {
  const [isLocationForm, setIsLocationForm] = useState<boolean>(false);
  return (
    <div className="flex py-10 px-4 flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full">
      <div className="w-full flex justify-between">
        <div className="text-[25px] font-normal leading-7.5">Locations</div>
        <div className="text-xl text-right font-bold opacity-70">1</div>
      </div>
      <div className="flex rounded-[10px] border border-opacity-10 border-white p-3.5 gap-[30px] bg-[#2B2E2E] bg-opacity-10 w-full">
        <img src="/images/Avatar.png" alt="Avatar" width={42} height={42} className="rounded-[6px]" />
        <div className="opacity-50 gap-5 flex items-center w-1/2">
          <span className="font-semibold text-lg leading-[21.6px] text-white">The Waterfront</span>
        </div>
        <div className="flex gap-[10px]">
          <Button className="rounded-full flex justify-center h-10 " variant="red" size="lg" type="button" leftIcon={CgClose}>
            Delete
          </Button>
          <Button className="rounded-full flex justify-center h-10 whitespace-nowrap border-none" variant="light" size="lg" type="button" leftIcon={HiPencilAlt}>
            Edit Location
          </Button>
        </div>
      </div>
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