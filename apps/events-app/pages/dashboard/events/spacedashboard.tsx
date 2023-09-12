import EventSpaceDashboardCard from "@/components/eventspace/EventSpaceDashboardCard";
import { spaceDashboardCards } from "@/constant/spacedashboardcards";
import Link from "next/link";

interface IProps {
  type: string,
}

export default function EventSpaceDashboard(props: IProps) {
  const { type } = props;

  return (
    <div className="flex flex-col flex-1 p-10 items-center gap-[10px] self-stretch w-[800px]">
      <div className="flex px-5 flex-col items-center gap-5 flex-1">
        {
          type === "new" ? (
            <>
            </>
          ) : (
            <>
              <EventSpaceDashboardCard name={spaceDashboardCards[0].name} description={spaceDashboardCards[0].description} buttonName={spaceDashboardCards[0].buttonName} />
              <Link href={"spacedetails"}>
                <EventSpaceDashboardCard name={spaceDashboardCards[1].name} description={spaceDashboardCards[1].description} buttonName={spaceDashboardCards[1].buttonName} />
              </Link>
            </>
          )
        }
        <EventSpaceDashboardCard name={spaceDashboardCards[2].name} description={spaceDashboardCards[2].description} buttonName={spaceDashboardCards[2].buttonName} />
      </div>
    </div>
  )
}