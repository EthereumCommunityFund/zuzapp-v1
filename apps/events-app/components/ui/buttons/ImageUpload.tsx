import IconButton from "./IconButton";
import { HiUpload } from "react-icons/hi";

export default function ImageUpload () {
  return (
    <button className="flex flex-col py-2.5 px-3 justify-center items-center gap-[10px] self-stretch rounded-[6px] border-dashed border-white border-opacity-10 bg-[#242727]">
      <HiUpload />
      <span className="text-[13px] text-center opacity-50 font-bold leading-[1.2] self-stretch">Select Event Header Image</span>
      <span className=" text-[10px] tracking-[0.2px] font-normal leading-[1.2] opacity-50">DRAG & DROP IMAGE</span>
    </button>
  )
}