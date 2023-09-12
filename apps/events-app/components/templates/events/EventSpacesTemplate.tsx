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
      <div className="mt-10 w-2/3 mx-auto">
        <h1 className="text-3xl mb-5">My Event Spaces</h1>
        <h3 className="text-2xl">Created Spaces</h3>
        <div className="mt-6">
          {/* {sampleEvents.map((event, index) => (
                        <EventSpacesCard eventTitle={event.name} index={index} />
                    ))
                    } */}
          {eventSpaces.map((event, index) => (
            <EventSpacesCard eventTitle={event.name} index={index} key={event.id} />
          ))}
          <Link href="/dashboard/events/create" className="w-full">
            <Button variant="dark" size="lg" className="bg-transparent text-white/70 mt-3 border-dashed w-full justify-center py-4 rounded-lg">
              Create an Event Space
            </Button>
          </Link>
        </div>
        <div>
          <h3 className="text-2xl mt-10">Invited Spaces</h3>
          <div className="mt-2">
            <p className="text-white/70 text-sm">No invited spaces</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventSpacesTemplate;
