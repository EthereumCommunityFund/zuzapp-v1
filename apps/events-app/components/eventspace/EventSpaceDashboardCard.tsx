import { IconType } from "react-icons";
import Button from "../ui/buttons/Button";
import { SpaceDashboardCardType } from "@/types";
import { LucideIcon } from "lucide-react";
import { HiCalendar } from "react-icons/hi";
import { RiSettings5Fill } from "react-icons/ri";
import { spaceDashboardCards } from "@/constant/spacedashboardcards";


interface IProps {
  name: string,
  description: string,
  buttonName: string,
  icon?: IconType | LucideIcon,
  buttonIcon?: IconType,
  cardType: SpaceDashboardCardType,
  onCardClick?: (type: SpaceDashboardCardType) => void | undefined,
}

export default function EventSpaceDashboardCard(props: IProps) {
  const { name, description, buttonName, cardType, buttonIcon, icon, onCardClick } = props;
  return (
    <div className="flex flex-col py-5 px-4 items-center gap-8 rounded-2xl border bg-[#2E3131] border-white/10 w-full">
      <div className="flex flex-col items-start gap-[10px] self-stretch">
        {
          <div className="flex items-center gap-[10px]">
            {
              cardType === (SpaceDashboardCardType.EditDetails) ? <HiCalendar className="opacity-70 w-6 h-6" /> :
                (
                  cardType === (SpaceDashboardCardType.OpenSettings) && <RiSettings5Fill className="opacity-70 w-6 h-6" />
                )
            }
            <span className="text-2xl font-bold leading-[1.2]">
              {name}
            </span>
          </div>
        }
        <span className="text-[13px] font-normal leading-[1.4] tracking-[0.13px] opacity-70 lining-nums tabular-nums">{description}</span>
        <Button variant={cardType === SpaceDashboardCardType.EditDetails || cardType === SpaceDashboardCardType.OpenSettings ? 'light-dark' : 'primary'} className="w-full flex justify-center rounded-3xl text-xl" leftIcon={buttonIcon} onClick={(e) => { onCardClick && onCardClick(cardType) }}>{buttonName}</Button>
      </div>
    </div>
  )
}