import { HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from 'react-icons/hi';
import { Label } from '../ui/label';
import Speaker from '../ui/Speaker';
import { EventSpaceDetailsType, OrganizerType, ScheduleDetailstype, ScheduleUpdateRequestBody } from '@/types';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import LocationMarker from '../ui/icons/LocationMarker';

interface IEventViewDetailsPanel {
  eventSpace: EventSpaceDetailsType;
  organizers: OrganizerType[];
  tags: string[];
  schedule?: ScheduleUpdateRequestBody;
}
interface IEventLink {
  name: string;
  link: string;
}

export default function EventViewDetailsPanel(props: IEventViewDetailsPanel) {
  const { eventSpace, organizers, tags, schedule } = props;
  const {
    // id,
    name,
    event_space_type,
    status,
    start_date,
    end_date,
    description,
    format,
    event_type,
    experience_level,
    eventspacelocation,
    tagline,
    social_links,
    extra_links,
  } = eventSpace;
  const { profile } = useGlobalContext();
  const [socialLinks, setSocialLinks] = useState<IEventLink[] | undefined>();
  const [extraLinks, setExtraLinks] = useState<IEventLink[] | undefined>();
  const [imgUrls, setImgUrls] = useState<string[]>();
  const [locationName, setLocationName] = useState<string>();
  const [locationAddress, setLocationAddress] = useState<string>();

  useEffect(() => {
    if (social_links) setSocialLinks(JSON.parse(social_links));
    if (extra_links) setExtraLinks(JSON.parse(extra_links));
    if (eventSpace.eventspacelocation) {
      const URLs: string[] = [];
      eventSpace.eventspacelocation.forEach((location) => {
        if (location.image_urls) URLs.push(...location.image_urls);
      });

      eventSpace.eventspacelocation.forEach((spaceLocation) => {
        if (spaceLocation.id === schedule?.location_id) {
          setLocationName(spaceLocation.name);
          setLocationAddress(spaceLocation.address);
          setImgUrls(spaceLocation.image_urls);
        }
      })
      // setLocationName(eventSpace.eventspacelocation[);
      // setLocationAddress(eventSpace.eventspacelocation[0]);
    }
  }, [social_links, extra_links, eventSpace]);
  useEffect(() => {
    console.log(schedule, 'schedule');
  });

  return (
    <div className="flex flex-col pt-5 pb-10 gap-5 md:min-w-[450px] lg:min-w-[25%] lg:px-0 sm:px-3">
      <div className="pb-10 gap-2.5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold p-3.5 border-b border-b-background text-xl">Details</h2>
          {schedule && (
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Format: </Label>
              <Label className="opacity-70 font-medium text-base">
                {schedule ? schedule.format.charAt(0).toUpperCase() + schedule.format.slice(1) : eventSpace.format.charAt(0).toUpperCase() + eventSpace.format.slice(1)}
              </Label>
            </div>
          )}
          {schedule && (
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Type: </Label>
              <Label className="opacity-70 font-bold text-base">{schedule ? schedule.event_type : ''}</Label>
            </div>
          )}
          {schedule && (
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Experience Level: </Label>
              <Label className="opacity-70 font-bold text-base">{schedule ? schedule?.experience_level : ''}</Label>
            </div>
          )}
        </div>
        <div className="pb-10 gap-2.5 mt-5">
          <div className="flex flex-col gap-5  rounded-[10px]">
            {organizers.length > 0 && (
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center pt-5">
                  <HiCog className="text-2xl" />
                  <Label>Organizers</Label>
                </div>
                <div className="flex flex-wrap gap-[6px] md:flex-row sm:flex-col">
                  {organizers.map((organizer: OrganizerType) => organizer.role === 'organizer' && <Speaker title={organizer.name} />)}
                </div>
              </div>
            )}
            {organizers.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                  <div className="flex gap-2.5 items-center">
                    <HiMicrophone className="text-2xl" />
                    <h2>Speakers</h2>
                  </div>
                  <div className="flex flex-wrap gap-[6px] md:flex-row sm:flex-col">
                    {organizers.map((organizer: OrganizerType) => organizer.role === 'speaker' && <Speaker title={organizer.name} />)}
                  </div>
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                  <div className="flex gap-2.5 items-center">
                    <HiTag className="text-2xl" />
                    <h2>Tags</h2>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {tags.map((tag: string, index: number) => (
                      <p key={index} className="rounded-xl opacity-70 bg-itemBgPrimary p-1.5 text-sm w-fit">
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {schedule && (
              <div className="flex flex-col pt-2.5 pb-2.5 gap-5 mt-[20px]">
                <div className="flex gap-2 items-center text-gray-300">
                  <LocationMarker />
                  <Label className="text-xl">Location</Label>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <Label className="text-md">{profile ? locationName : `Apply to See Address`}</Label>
                  <Label className="text-sm font-light opacity-70">{locationAddress}</Label>
                </div>
                {/* {imgUrls && <Image width={260} height={148} src={imgUrls[0]} alt={''} className={`rounded-xl ${profile ? `blur-none` : `blur`} h-[148px]`} />} */}
                {imgUrls && <img src={imgUrls[0]} width={150} height={50} alt="No Images" />}
              </div>
            )}
          </div>
          {schedule && (
            <div className="flex p-2.5 items-center gap-3">
              <HiUserGroup className="text-xl" />
              <span className="font-bold">{schedule?.current_rsvp_no || 0} going</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
