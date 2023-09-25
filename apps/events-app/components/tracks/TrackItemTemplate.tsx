import Link from 'next/link';

import TrackItemCard from './TrackItemCard';
import Button from '@/components/ui/buttons/Button';
import { EventSpaceDetailsType, TrackUpdateRequestBody } from '@/types';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { HiCog, HiSelector } from 'react-icons/hi';
import router from 'next/router';
// import { sampleEvents } from "../HomePageTemplate";

interface TrackTemplateProps {
  trackDetails: TrackUpdateRequestBody[];
}

const TrackItemTemplate: React.FC<TrackTemplateProps> = ({ trackDetails }) => {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {trackDetails.map((track) => (
        <TrackItemCard description={track?.description as string} event_space_id={track.event_space_id} image={track?.image as string} name={track.name} key={track.id} />
      ))}
    </div>
  );
};

export default TrackItemTemplate;
