import { BiLeftArrowAlt, BiEditAlt, BiPlus, BiRadioCircle, BiCalendarAlt, BiTimeFive, BiRadioCircleMarked, BiPlusCircle } from 'react-icons/bi';
import { HiArrowLeft, HiCog, HiSelector } from 'react-icons/hi';

import Button from '@/components/ui/buttons/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { useQuery } from 'react-query';
import fetchSchedulesByTrackId from '@/services/fetchScedulesByTrackId';
import { ScheduleUpdateRequestBody } from '@/types';
import { HiArrowRight } from 'react-icons/hi2';
import { Loader } from '@/components/ui/Loader';
import useTrackDetails from '@/hooks/useTrackDetails';

type IdProp = {
  id: string;
};

type Joined<T> = ScheduleUpdateRequestBody & T;

export default function SchedulesDashboardPage() {
  const router = useRouter();
  const { event_space_id, trackId, track_title } = router.query;
  const { trackDetails, isLoading: loading } = useTrackDetails();

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

  const handleEnterSchedule = async (id: string) => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules/updateSchedule`,
        query: {
          event_space_id,
          trackId,
          scheduleId: id,
          track_title: track_title,
        },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  const goBackToPreviousPage = () => {
    router.back();
  };
  const handleAddSchedule = async () => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules/addschedule`,
        query: { event_space_id, trackId: trackId, track_title: track_title },
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
  return (
    <div className="pt-10">
      <div className="flex flex-col items-start gap-10 self-stretch pb-[60px] px-20">
        <div className="w-full flex flex-col justify-start items-start relative p-0 gap-[30px] rounded-0">
          <div className="flex w-full justify-between items-center flex-1 flex-grow-0">
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={HiArrowLeft}
              onClick={goBackToPreviousPage}
            >
              Back
            </Button>
            <Button
              onClick={() =>
                router.push({
                  pathname: `/dashboard/events/space/tracks/update`,
                  query: { event_space_id, trackId: trackId },
                })
              }
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={BiEditAlt}
            >
              Edit Track
            </Button>
          </div>
          <div className="flex flex-col gap-[30px] self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="w-24 h-fit bg-white rounded-lg p-1">{loading ? <Loader /> : <img src={trackDetails?.image as string} alt="track-image" />}</div>
              <div className="flex flex-col gap-5 self-stretch">
                <h2 className="text-4xl font-semibold">{track_title}</h2>
              </div>
            </div>
            <h3 className="text-2xl leading-[1.2] opacity-70 font-bold ">Schedules</h3>
            <div className="flex justify-between items-start self-stretch">
              <Button
                variant="blue"
                className="flex py-[10px] px-[14px] items-center gap-[10px] rounded-[20px] bg-[#67DAFF20] text-[#67DAFF] text-xl"
                leftIcon={BsFillPlusCircleFill}
                onClick={handleAddSchedule}
              >
                Add a Schedule
              </Button>

              <div className="flex items-start gap-3">
                <Button className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary" size="lg" leftIcon={HiSelector}>
                  Sort
                </Button>
                <Button className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary" size="lg" leftIcon={HiCog}>
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
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
                      <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight} onClick={() => handleEnterSchedule(schedule.id)}>
                        Update Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  // get profile from session
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
