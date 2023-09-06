import Button from "@/components/ui/buttons/Button";
import { BiChevronDown } from "react-icons/bi";

export default function AddToEventButton() {
  return (
    <div className="flex pl-2.5 items-center border border-opacity-20 rounded-xl h-10 bg-[#363636]">
      <div className="align-middle p-0.5 w-6">
        <BiChevronDown className="h-8"/>
      </div>
      <div className="bg-white bg-opacity-5">
        <Button className="border-none h-10">Add</Button>
      </div>
    </div>    
  );
}