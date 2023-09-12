import { IconType } from "react-icons";
import Button from "../ui/buttons/Button";
import { BsArrowUpCircle } from "react-icons/bs";

interface IProps {
  name: string,
  description: string,
  buttonName: string,
  icon?: IconType
}

export default function EventSpaceDashboardCard(props: IProps) {
  const { name, description, buttonName, icon } = props;
  return (
    <div className="flex flex-col py-5 px-4 items-center gap-8 rounded-2xl border bg-[#2E3131] border-white border-opacity-10 w-[800px]">
      <div className="flex flex-col items-start gap-[10px] self-stretch">
        <span className="text-xl font-bold leading-[1.2] items">{name}</span>
        <span className="text-[13px] font-normal leading-[1.4] tracking-[0.13px] opacity-70 lining-nums tabular-nums">{description}</span>
        <Button variant="primary" className="w-full flex gap-[10px] justify-center" leftIcon={icon}>{buttonName}</Button>
      </div>
    </div>
  )
}