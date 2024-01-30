import { use, useEffect, useState } from 'react';
import CreateEventsForm from './CreateEventForm';
import Button from '@/components/ui/buttons/Button';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CreateEventTemplate() {
  const router = useRouter();
  const [eventSpaceId, setEventSpaceId] = useState<string | null>(null);

  const handleEventCreated = (id: string | null) => {
    setEventSpaceId(id); // Store the event space ID or null on failure
  };

  return (
    <div className="w-full bg-grayBackground p-4 md:p-8 rounded-lg">
      {eventSpaceId ? (
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-xl">Your Event Space is Ready for the Spotlight</h3>
          <p className="font-light rounded-full text-base opacity-70 mt-10">Let's give the community a sneak peek. Fill in the details to showcase your event</p>
          <Button
            variant="primary"
            className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full"
            leftIcon={HiArrowRight}
            onClick={() => router.push(`/dashboard/events/space/details?event_space_id=${eventSpaceId}`)}
          >
            Fill in Event Details
          </Button>
        </div>
      ) : (
        <>
          <h3 className="font-bold text-2xl">Create your Event Space</h3>
          <div className="mt-8">
            <CreateEventsForm onEventCreated={handleEventCreated} />
          </div>
        </>
      )}
    </div>
  );
}
