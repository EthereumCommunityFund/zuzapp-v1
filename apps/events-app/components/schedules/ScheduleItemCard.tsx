import { ScheduleUpdateRequestBody } from '@/types';
import { BiCalendarAlt, BiRadioCircle, BiTimeFive } from 'react-icons/bi';
import Button from '../ui/buttons/Button';
import { HiArrowRight } from 'react-icons/hi';
import { useQuery } from 'react-query';
import fetchSchedulesByTrackId from '@/services/fetchSchedulesByTrackId';
import { useRouter } from 'next/router';
import { Loader } from '../ui/Loader';
import useEventDetails from "@/hooks/useCurrentEventSpace";

type IdProp = {
  id: string;
};

type Joined<T> = ScheduleUpdateRequestBody & T;

export default function ScheduleItemCard() {
  const router = useRouter();
  const { event_space_id, trackId, track_title } = router.query;
  const { eventSpace } = useEventDetails();

  const {
    data: schedules,
    isLoading,
    isError,
  } = useQuery<Joined<IdProp>[], Error>(
    ['schedules', event_space_id],
    () => fetchSchedulesByTrackId(trackId as string),

    {
      enabled: !!event_space_id,
    }
  );

  const handleEnterSchedule = async (id: string, scheduleTrackId: string) => {
    const scheduleTrackTitle = eventSpace?.tracks.find((trackItem) => trackItem.id === scheduleTrackId)?.name;
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules/updateSchedule`,
        query: {
          event_space_id,
          trackId: scheduleTrackId,
          scheduleId: id,
          track_title: scheduleTrackTitle,
        },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  function formatTime(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full">
      {schedules && (
        <div className="flex flex-col gap-[10px] w-full">
          {schedules.map((schedule) => (
            <div className="flex flex-col items-center justify-between gap-[10px]">
              <div className="flex py-3 px-3.5 items-center justify-between gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
                <div className="flex items-start gap-10">
                  <BiRadioCircle className="w-10 h-10" />
                  <div className="flex flex-col items-start gap-[10px]">
                    <span className="text-[18px] font-semibold leading-[1.2]">{schedule.name}</span>
                    <div className="flex items-start self-stretch gap-6">
                      <span className="flex items-center p-1 gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10] white-space-nowrap overflow-hidden text-ellipsis">
                        <BiCalendarAlt size={30} />
                        <span className="ml-2">{formatDate(schedule?.date)}</span>
                      </span>
                      <span className="flex items-center p-1 gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10] white-space-nowrap overflow-hidden text-ellipsis">
                        <BiTimeFive size={30} />
                        <span className="ml-2">{formatTime(schedule?.start_time)} </span>
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight} onClick={() => handleEnterSchedule(schedule.id, schedule.track_id as string)}>
                  Update Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}