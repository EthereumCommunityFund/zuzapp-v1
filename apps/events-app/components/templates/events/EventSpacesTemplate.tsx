import Link from "next/link";

import EventSpacesCard from "./EventSpacesCard";
import Button from "@/components/ui/buttons/Button";
import { EventSpaceDetailsType } from "@/types";
import { useEventSpace } from "@/context/EventSpaceContext";
import { Loader } from "@/components/ui/Loader";
import { arrayFromLength } from "@/lib/helper";
import { EventTemplateSkeleton } from "@/components/commons/EventTemplateSkeleton";

interface EventSpacesTemplateProps {
  eventSpaces?: EventSpaceDetailsType[];
  invitedSpaces?: EventSpaceDetailsType[];
  isLoading?: boolean;
}

const EventSpacesTemplate: React.FC<EventSpacesTemplateProps> = ({
  eventSpaces,
  isLoading,
  invitedSpaces,
}) => {
  console.log(eventSpaces, "event spaces");
  const { setEventSpace } = useEventSpace();
  return (
    <>
      <div className="xl:w-2/3 w-[92%] mx-auto font-inter">
        <h1 className="text-[31px] leading-[1.2] mb-20">My Event Spaces</h1>
        <h2 className="text-[25px] leading-[1.2]">Created Spaces</h2>
        <div className="mt-6">
          {isLoading ? (
            <div>
              {arrayFromLength(10).map((_, i) => (
                <EventTemplateSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {eventSpaces &&
                eventSpaces.map((event, index) => (
                  <div onClick={() => setEventSpace(event)} key={event.id}>
                    <EventSpacesCard
                      eventTitle={event.name}
                      index={index}
                      key={event.id}
                      event_space_id={event.id}
                      eventStatus={event.status}
                    />
                  </div>
                ))}
            </>
          )}
          <Link href="/dashboard/events/create" className="w-full">
            <Button
              variant="dark"
              size="lg"
              className="bg-transparent text-white/70 mt-3 text-[18px] leading-[1.2] border-dashed w-full justify-center py-4 rounded-lg"
            >
              Create an Event Space
            </Button>
          </Link>
        </div>
        <div>
          <h3 className="text-[25px] mt-10">Invited Spaces</h3>
          <div className="mt-2 mb-5">
            {isLoading ? (
              <div>
                {arrayFromLength(10).map((_, i) => (
                  <EventTemplateSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {invitedSpaces &&
                  invitedSpaces.map((event, index) => (
                    <div onClick={() => setEventSpace(event)} key={event.id}>
                      <EventSpacesCard
                        eventTitle={event.name}
                        index={index}
                        key={event.id}
                        event_space_id={event.id}
                        eventStatus={event.status}
                      />
                    </div>
                  ))}
              </>
            )}
            {invitedSpaces?.length === 0 ? (
              <p className="text-white/70 text-sm font-extrabold">
                No invited spaces
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventSpacesTemplate;
