import { HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from 'react-icons/hi';
import { Label } from '../ui/label';
import Speaker from '../ui/Speaker';
import { EventSpaceDetailsType, OrganizerType, ScheduleDetailstype, ScheduleUpdateRequestBody } from '@/types';
import { useEffect } from 'react';
import Avvvatars from "avvvatars-react";

interface IEventViewDetailsPanel {
  eventSpace: EventSpaceDetailsType;
  organizers: OrganizerType[];
  tags: string[];
  schedule?: ScheduleUpdateRequestBody;
}

export default function EventViewDetailsPanel(props: IEventViewDetailsPanel) {
  const { eventSpace, organizers, tags, schedule } = props;

  useEffect(() => {
    console.log(schedule, 'schedule');
  });



  return (
    <div className="flex flex-col pt-5 pb-10 gap-5 md:min-w-[450px] lg:min-w-[25%] lg:px-0 sm:px-3">
      <div className="pb-10 gap-2.5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold p-3.5 border-b border-b-background text-xl">Track Details</h2>
          <div className="flex gap-2 items-center">
            <Label className="text-sm">Organizers</Label>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {
                schedule?.organizers?.map((item, idx) => (
                <div key={idx} className="rounded-[60px] flex items-center gap-3 border border-[#333435] pr-3 pl-1 py-0.5 bg-white/10 hover:bg-white/20 duration-200">
                  <Avvvatars value={item?.name} style="shape" />
                  <span className="text-sm inline-block">{item?.name}</span>
                </div>
              ))
            }
          </div>
          <div className="flex gap-2 items-center">
            <Label className="text-sm font-light">Speakers</Label>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {
                schedule?.organizers?.filter((speaker) => speaker.role === 'speaker' ).map((item, idx) => (
                    <div key={idx} className="rounded-[60px] flex items-center gap-3 border border-[#333435] pr-3 pl-1 py-0.5 bg-white/10 hover:bg-white/20 duration-200">
                        <Avvvatars value={item.name} style="shape" />
                        <span className="text-sm inline-block">{item.name}</span>
                    </div>
                    ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
