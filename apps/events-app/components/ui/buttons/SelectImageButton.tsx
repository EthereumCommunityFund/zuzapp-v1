import { title } from "process";
import Button from "./Button";
import { HiUpload } from "react-icons/hi";

interface IProps {
  title: string
}

export default function SelectImageButton (props: IProps) {
  return (
    <Button className="flex flex-col py-2.5 px-3 gap-[10px] self-stretch rounded-[6px] border-dashed border-white border-opacity-10 bg-[#242727] w-full">
      <HiUpload />
      <span className="text-[13px] text-center opacity-50 font-bold leading-[1.2] self-stretch">{props.title}</span>
      <span className=" text-[10px] tracking-[0.2px] font-normal leading-[1.2] opacity-50">DRAG & DROP IMAGE</span>
    </Button>
  )
}