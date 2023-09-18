import { CgClose } from "react-icons/cg";
import EventLocationEditionButtons from "../eventspace/EventLocationEditionButtons";
import Button from "./buttons/Button";
import { HiPencilAlt } from "react-icons/hi";

export default function Location() {
  return (
    <div className="flex rounded-[10px] border border-opacity-10 border-white p-3.5 gap-[30px] bg-[#2B2E2E] bg-opacity-10 w-full">
      <img src="/images/Avatar.png" alt="Avatar" width={42} height={42} className="rounded-[6px]" />
      <div className="opacity-50 gap-5 flex items-center w-1/2">
        <span className="font-semibold text-lg leading-[21.6px] text-white">The Waterfront</span>
      </div>
      <div className="flex gap-[10px]">
        <Button className="rounded-full flex justify-center h-10 " variant="red" size="lg" type="button" leftIcon={CgClose}>
          Delete
        </Button>
        <Button className="rounded-full flex justify-center h-10 whitespace-nowrap" variant="light" size="lg" type="button" leftIcon={HiPencilAlt}>
          Edit Location
        </Button>
      </div>
    </div>
  )
}