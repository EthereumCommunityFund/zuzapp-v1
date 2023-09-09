import { IconType } from "react-icons";
import Button from "../ui/buttons/Button";
import { GrUploadOption } from "react-icons/gr";

interface IProps {
  name: string,
  icon?: IconType
}

export default function ButtonWithDescription(props: IProps) {
  const { name, icon } = props;
  return (
    <div className="flex flex-col py-5 px-4 items-center gap-8 rounded-2xl border bg-[#2E3131] border-white border-opacity-10 w-full">
      <div className="flex flex-col gap-[10px] self-stretch">
        <span className="text-xl font-bold leading-[1.2]">{name}</span>
        <span className="text-[13px] font-normal leading-[1.4] tracking-[0.13px] opacity-70">Your Event is Not Published.</span>
        <Button variant="primary" leftIcon={GrUploadOption}><span>Publish Event</span></Button>
      </div>
    </div>
  )
}