import { TbTicket } from 'react-icons/tb';
import Speaker from './Speaker';
import EventDataDate from './labels/event-data-date';
import { ScheduleDetailstype } from '@/types';
import { useEffect, useState } from 'react';
import EventDataTime from './labels/event-data-time';

import React from 'react';
import useTrackDetails from '@/hooks/useTrackDetails';
import { Loader } from './Loader';
import useTrack from '@/hooks/useTrack';
import { toast } from '@/components/ui/use-toast';
import { cancelUserRsvpBySchedule, checkUserRsvpBySchedule, rsvpSchedule } from '@/controllers';
import IconButton from './buttons/IconButton';
import * as Tooltip from '@radix-ui/react-tooltip';
import { StatusCodes } from 'http-status-codes';

interface IUserFacingTrack {
  scheduleId?: string;
  scheduleData: ScheduleDetailstype;
  onClick: () => void;
}

const UserFacingTrack: React.ForwardRefRenderFunction<HTMLDivElement, IUserFacingTrack> = (props, ref) => {
  const { scheduleData, onClick } = props;
  const { trackDetails, isLoading } = useTrack(scheduleData.track_id as string);
  const date = new Date(scheduleData.date);

  const startDate = new Date(scheduleData.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: "Europe/Istanbul" });
  const endDate = new Date(scheduleData.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: "Europe/Istanbul" });
  const startTime = new Date(scheduleData.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Istanbul" });
  const endTime = new Date(scheduleData.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Istanbul" });
  const [hasRsvpd, setHasRsvpd] = useState<boolean>(false);
  const [isRsvpFullOnLoad, setIsRsvpFullOnLoad] = useState<boolean>(false);

  const handleRsvpAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      if (scheduleData?.rsvp_amount === 0) {
        toast({
          title: 'Error',
          description: 'No RSVPs available',
          variant: 'destructive',
        });
      } else if (hasRsvpd) {
        const result = await cancelUserRsvpBySchedule(scheduleData.id as string, scheduleData.event_space_id as string);
        if (result.status === StatusCodes.OK) {
          setHasRsvpd(false);
          toast({
            title: 'RSVP cancelled successfully',
          });
        } else if (result.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          toast({
            title: 'Server Error',
            variant: 'destructive',
          });
        }
      } else {
        const result = await rsvpSchedule(scheduleData.id as string, scheduleData.event_space_id as string);
        if (result.status === StatusCodes.OK) {
          setHasRsvpd(true);
          toast({
            title: 'RSVPed successfully',
          });
        } else if (result.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          toast({
            title: 'Server Error',
            variant: 'destructive',
          });
        } else if (result.status === StatusCodes.BAD_REQUEST) {
          toast({
            title: 'RSVP limit has been reached for this schedule',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfUserHasRsvpd = async () => {
    try {
      const result = await checkUserRsvpBySchedule(scheduleData.id as string, scheduleData.event_space_id as string);
      const hasRsvp = result?.data?.hasRSVPed;
      setHasRsvpd(hasRsvp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (scheduleData) {
      if (scheduleData.rsvp_amount === scheduleData.current_rsvp_no) {
        setIsRsvpFullOnLoad(true);
      }
      if (scheduleData.rsvp_amount === 0) {
        setIsRsvpFullOnLoad(false);
      }
    }
  }, [scheduleData]);

  useEffect(() => {
    checkIfUserHasRsvpd();
  }, []);

  return scheduleData && scheduleData.repeating ? (
    <div ref={ref} onClick={onClick} className="flex flex-col gap-3  cursor-pointer">
      <div className="flex flex-col rounded-2xl">
        <div className="flex gap-1 justify-between border-2 border-[#444646] md:p-2 sm:p-2 rounded-2xl bg-userFacingItem hover:bg-[#434646] duration-200">
          <div className="flex flex-col gap-2.5 w-3/4 ml-2">
            <div className="flex gap-2.5 text-xs font-inter font-normal uppercase">
              {scheduleData && (scheduleData.schedule_frequency === 'everyday' || scheduleData.schedule_frequency === 'weekly') && <span className="text-[#b29457]">RECURRING</span>}
              <span>{isLoading ? <Loader /> : trackDetails?.name || 'TRACK'}</span>
            </div>
            <span className="font-semibold md:text-lg">{scheduleData.name}</span>
            <div className="flex gap-2.5 md:flex-row sm:flex-col w-fit">
              <EventDataTime startTime={startTime} endTime={endTime} />
            </div>
          </div>
          <div>
            <Tooltip.Provider delayDuration={500} skipDelayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    variant={`ghost`}
                    icon={TbTicket}
                    className={`${hasRsvpd ? `bg-componentPrimary` : `bg-trackDateColor`
                      } rounded-lg md:text-[40px] sm:text-[25px] opacity-70 text-white hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center outline-none focus:shadow-[0_0_0_2px] focus:shadow-[#3B3B3B] ${isRsvpFullOnLoad || scheduleData?.rsvp_amount === 0 || (isRsvpFullOnLoad && !hasRsvpd) ? `cursor-not-allowed` : ``
                      }`}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRsvpAction(e)}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-md bg-inputField px-2 py-1.5 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] text-white"
                    sideOffset={5}
                  >
                    {isRsvpFullOnLoad || scheduleData?.rsvp_amount === 0 || (isRsvpFullOnLoad && !hasRsvpd) ? `RSVP is not available` : hasRsvpd ? `Cancel RSVP` : `RSVP`}
                    <Tooltip.Arrow className="TooltipArrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div ref={ref} onClick={onClick} className="flex flex-col gap-3">
      <div className="flex flex-col rounded-2xl">
        <div className="flex md:gap-3 gap-1 justify-between border-2 border-[#444646] md:p-3 sm:p-3 rounded-2xl bg-userFacingItem hover:bg-[#434646] duration-200">
          <div>
            <div className="md:rounded-[10px] sm:rounded-lg text-center border bg-trackDateColor border-[#5F6262] md:text-xl sm:text-sm px-4 py-2">
              <h2 className="font-bold">{date.getDate()}</h2>
              <b className="font-medium">{date.toLocaleDateString('en-US', { month: 'short' })}.</b>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 ml-2">
            <div className="flex gap-2.5 text-xs font-inter font-light uppercase">
              {scheduleData && (scheduleData.schedule_frequency === 'everyday' || scheduleData.schedule_frequency === 'weekly') && <span className="text-[#b29457]">RECURRING</span>}
              <span>{isLoading ? <Loader /> : trackDetails?.name || 'TRACK'}</span>
            </div>

            <span className="font-semibold md:text-lg">{scheduleData.name}</span>
            <div className="flex gap-2.5 md:flex-row sm:flex-col w-fit">
              {scheduleData.schedule_frequency !== 'once' && <EventDataDate startDate={startDate} endDate={endDate} />}
              <EventDataTime startTime={startTime} endTime={endTime} />
            </div>
            <div className="flex gap-[3px] flex-wrap">{scheduleData.organizers?.map((organizer) => <Speaker title={organizer.name} />)}</div>
          </div>
          <div>
            <Tooltip.Provider delayDuration={500} skipDelayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    variant={`ghost`}
                    icon={TbTicket}
                    className={`${hasRsvpd ? `bg-componentPrimary` : `bg-trackDateColor`
                      } rounded-lg md:text-[40px] sm:text-[25px] opacity-70 text-white hover:bg-violet3 inline-flex h-[35px] w-[35px] items-center justify-center outline-none focus:shadow-[0_0_0_2px] focus:shadow-[#3B3B3B] ${isRsvpFullOnLoad || scheduleData?.rsvp_amount === 0 || (isRsvpFullOnLoad && !hasRsvpd) ? `cursor-not-allowed` : ``
                      }`}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRsvpAction(e)}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-md bg-inputField px-2 py-1.5 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] text-white"
                    sideOffset={5}
                  >
                    {isRsvpFullOnLoad || scheduleData?.rsvp_amount === 0 || (isRsvpFullOnLoad && !hasRsvpd) ? `RSVP is not available` : hasRsvpd ? `Cancel RSVP` : `RSVP`}
                    <Tooltip.Arrow className="TooltipArrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(UserFacingTrack);
