import Link from 'next/link';

import EventSpacesCard from './EventSpacesCard';
import Button from '@/components/ui/buttons/Button';
import { EventSpaceDetailsType } from '@/types';
// import { sampleEvents } from "../HomePageTemplate";

interface EventSpacesTemplateProps {
  eventSpaces: EventSpaceDetailsType[];
}

const EventSpacesTemplate: React.FC<EventSpacesTemplateProps> = ({ eventSpaces }) => {
  return (
    <>
      <div className="w-2/3 mx-auto font-inter">
        <h1 className="text-[31px] leading-[1.2] mb-20">My Event Spaces</h1>
        <h2 className="text-[25px] leading-[1.2]">Created Spaces</h2>
        <div className="mt-6">
          {/* {sampleEvents.map((event, index) => (
                        <EventSpacesCard eventTitle={event.name} index={index} />
                    ))
                    } */}
          {eventSpaces.map((event, index) => (
            <EventSpacesCard eventTitle={event.name} index={index} key={event.id} eventId={event.id} />
          ))}
          <Link href="/dashboard/events/create" className="w-full">
            <Button variant="dark" size="lg" className="bg-transparent text-white/70 mt-3 text-[18px] leading-[1.2] border-dashed w-full justify-center py-4 rounded-lg">
              Create an Event Space
            </Button>
          </Link>
        </div>
        <div>
          <h3 className="text-[25px] mt-10">Invited Spaces</h3>
          <div className="mt-2 mb-5">
            <p className="text-white/70 text-sm font-extrabold">No invited spaces</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventSpacesTemplate;
