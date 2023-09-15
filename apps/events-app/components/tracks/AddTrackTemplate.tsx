import { use, useEffect, useState } from 'react';
import AddTrackForm from './AddTrackForm';
import Button from '@/components/ui/buttons/Button';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TrackCreateRequestBody } from '@/types';
import { createTrack } from '@/controllers';
import EditionForm from '../ui/EditionForm';

export default function AddTrackTemplate() {
  const [trackCreated, setTrackCreated] = useState(false);
  const router = useRouter();
  const { eventId } = router.query;

  const handleTrackSubmit = async (values: TrackCreateRequestBody) => {
    try {
      const result = await createTrack({ ...values, event_space_id: eventId });
      setTrackCreated(true);
      console.log(result);
    } catch (error) {
      setTrackCreated(false);
      console.error(error);
    }
  };
  return (
    <EditionForm>
      <div className="w-full bg-grayBackground p-4 md:p-8 rounded-lg">
        {trackCreated ? (
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl">Your Track Has Been Created</h3>
            <Link href="/dashboard/events/tracks">
              <Button variant="primary" className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full" leftIcon={HiArrowRight}>
                Go to tracks
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-2xl">Create your track</h3>
            <div className="mt-8">
              <AddTrackForm onTrackSubmit={handleTrackSubmit} />
            </div>
          </>
        )}
      </div>
    </EditionForm>
  );
}
