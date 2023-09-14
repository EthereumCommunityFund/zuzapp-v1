import { useRouter } from "next/router";
import EventSpaceDashboardCard from "@/components/eventspace/EventSpaceDashboardCard";
import { spaceDashboardCards } from "@/constant/spacedashboardcards";
import { SpaceDashboardType } from "@/types";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/buttons/Button";
import { HiCalendar } from "react-icons/hi";
import { RiSettings5Fill } from "react-icons/ri";
import { SpaceDashboardCardType } from "@/types";
import { eventRoutes } from "@/constant/routes";

interface IProps {
  type: SpaceDashboardType,
}

export default function EventSpaceDashboard(props: IProps) {
  const { type } = props;
  const router = useRouter();
  const { eventId } = router.query;

  const handleButtonClick = (type: SpaceDashboardCardType) => {
    if (type === SpaceDashboardCardType.EnterEventDetails || type === SpaceDashboardCardType.EditDetails) {
      router.push({
        pathname: `/dashboard/events/space/details/`, // Update with your actual route
        query: { eventId: eventId }, // Pass space ID as a query parameter
      });
    } else if (type === SpaceDashboardCardType.OpenSettings) {
      router.push("settings");
    }
  }

  return (
    <div className="flex flex-col flex-1 p-10 items-center gap-[10px] self-stretch w-full ">
      <div className="flex px-5 flex-col items-center gap-5 flex-1 md:w-full">
        {
          <div className="w-4/5 max-w-4xl">
            {
              type === SpaceDashboardType.New ? (
                <div className="flex flex-col gap-5 self-stretch p-4">
                  <Label className="text-3xl font-bold leading-[1.2]">Welcome to your Event Space</Label>
                  <Label className="opacity-70">First, you'll need to enter the main details of your main event.</Label>
                  <Button className="w-full flex justify-center rounded-3xl text-xl leading-[1.2]" leftIcon={HiCalendar}>Enter Event Details</Button>
                </div>
              ) : (
                <>
                  {
                    spaceDashboardCards.map((item, index) => (
                      <div className='mb-8'>
                        <EventSpaceDashboardCard
                          key={index}
                          name={item.name}
                          description={item.description}
                          buttonName={item.buttonName}
                          cardType={item.cardType}
                          icon={item.icon}
                          buttonIcon={item.buttonIcon}
                          onCardClick={handleButtonClick}
                        />
                      </div>
                    ))
                  }
                </>
              )
            }
            <EventSpaceDashboardCard
              name={"Settings"}
              description={"Open Settings"}
              buttonName={"Open Settings"}
              cardType={SpaceDashboardCardType.OpenSettings}
              icon={RiSettings5Fill}
              onCardClick={handleButtonClick}
            />
          </div>
        }
      </div>
    </div>
  )
}