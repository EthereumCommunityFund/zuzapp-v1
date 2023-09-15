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
    <div className="flex py-3 px-3.5 items-center self-stretch border rounded-2xl border-white/20 bg-componentPrimary hover:cursor-pointer hover:bg-trackItemHover duration-200 w-full justify-between">
      {trackDetails.map((track) => (
        <TrackItemCard trackTitle={track.name} key={track.id} trackId={track.id} />
      ))}
    </div>
  );
};

export default TrackItemTemplate;
