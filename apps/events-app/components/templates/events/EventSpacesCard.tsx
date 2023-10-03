import { HiArrowRight } from "react-icons/hi";
import { useRouter } from "next/router";
import Button from "@/components/ui/buttons/Button";
import { SpaceDashboardType } from "@/types";

interface IProps {
  eventTitle: string;
  event_space_id: string;
  index: number;
  eventStatus: string;
}

export default function EventSpaceCard(props: IProps) {
  const router = useRouter();
  const { eventTitle, event_space_id, index, eventStatus } = props;

  const handleEnterSpace = async () => {
    try {
      // Redirect to a new page with the fetched details
      router.push({
        pathname: `/dashboard/events/space/dashboard/`, // Update with your actual route
        query: {
          event_space_id: event_space_id,
          isFirst: SpaceDashboardType.New,
        }, // Pass space ID as a query parameter
      });
    } catch (error) {
      console.error("Error fetching space details", error);
    }
  };

  return (
    <>
      <div
        key={index}
        className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-2xl px-3 md:px-5 py-5 mt-5 hover:bg-itemHover"
      >
        <div>
          <span className="bg-[#67DBFF]/20 text-[#67DBFF] rounded-full text-xs py-1 px-2 block w-fit font-extrabold">
            {eventStatus.toLocaleUpperCase()}
          </span>
          <h4 className="text-xl md:text-2xl font-bold mt-3">{eventTitle}</h4>
        </div>
        <div>
          <div className="w-full">
            <Button
              size="lg"
              variant="dark"
              className="bg-white/20 text-white/70 rounded-full hover:font-bold hover:bg-white/20 border-none"
              leftIcon={HiArrowRight}
              onClick={handleEnterSpace}
            >
              Enter Space
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
