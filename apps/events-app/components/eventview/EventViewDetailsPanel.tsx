import { HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from 'react-icons/hi';
import { Label } from '../ui/label';
import Speaker from '../ui/Speaker';
import { EventSpaceDetailsType, OrganizerType, ScheduleDetailstype, ScheduleUpdateRequestBody } from '@/types';
import { useEffect } from 'react';

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
          <h2 className="font-bold p-3.5 border-b border-b-background text-xl">Details</h2>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Format: </Label>
            <Label className="opacity-70 font-medium text-base">
              {schedule ? schedule.format.charAt(0).toUpperCase() + schedule.format.slice(1) : eventSpace.format.charAt(0).toUpperCase() + eventSpace.format.slice(1)}
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Type: </Label>
            <Label className="opacity-70 font-bold text-base">{schedule ? schedule.event_type : eventSpace?.event_type?.join(', ')}</Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Experience Level: </Label>
            <Label className="opacity-70 font-bold text-base">{schedule ? schedule?.experience_level : eventSpace?.experience_level?.join(', ')}</Label>
          </div>
        </div>
        <div className="pb-10 gap-2.5">
          <div className="flex flex-col gap-5  rounded-[10px]">
            <div className="flex flex-col border-b border-b-background pb-5 gap-5">
              <div className="flex gap-2.5 items-center pt-5">
                <HiCog className="text-2xl" />
                <Label>Organizers</Label>
              </div>
              <div className="flex flex-wrap gap-[6px] md:flex-row sm:flex-col">
                {organizers && organizers.map((organizer: OrganizerType) => organizer.role === 'organizer' && <Speaker title={organizer.name} />)}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiMicrophone className="text-2xl" />
                  <h2>Speakers</h2>
                </div>
                <div className="flex flex-wrap gap-[6px] md:flex-row sm:flex-col">
                  {organizers && organizers.map((organizer: OrganizerType) => organizer.role === 'speaker' && <Speaker title={organizer.name} />)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiTag className="text-2xl" />
                  <h2>Tags</h2>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {tags &&
                    tags.map((tag: string, index: number) => (
                      <p key={index} className="rounded-xl opacity-70 bg-itemBgPrimary p-1.5 text-sm w-fit">
                        {tag}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col pb-2.5 gap-5">
              <div className="flex gap-2.5 items-center">
                <HiLocationMarker className="text-2xl" />
                <h2>Location</h2>
              </div>
              {eventSpace.eventspacelocation && (
                <div className="flex gap-2.5">
                  <img src={eventSpace.image_url} width={100} height={50} alt="333" />
                  <div className="flex flex-col gap-[6px]">
                    <h2 className="font-bold">{eventSpace.eventspacelocation[0].name}</h2>
                    <Label className="opacity-70">{eventSpace.eventspacelocation[0].address}</Label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex p-2.5 items-center gap-3">
            <HiUserGroup className="text-xl" />
            <span className="font-bold">14 going</span>
          </div>
        </div>
      </div>
    </div>
  );
}
