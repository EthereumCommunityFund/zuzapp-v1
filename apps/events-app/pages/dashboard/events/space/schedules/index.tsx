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
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import { useEffect } from 'react';
import ScheduleItemCard from '@/components/schedules/ScheduleItemCard';

type IdProp = {
  id: string;
};

type Joined<T> = ScheduleUpdateRequestBody & T;

export default function SchedulesDashboardPage() {
  const router = useRouter();
  const { event_space_id, trackId, trackTitle } = router.query;

  const {
    data: schedules,
    isLoading,
    isError,
  } = useQuery<Joined<IdProp>[], Error>(
    ['schedules', event_space_id],
    () => fetchSchedulesByEvenSpaceId(event_space_id as string),

    {
      enabled: !!event_space_id,
    }
  );

  // useEffect(() => {
  //   const data = fetchSchedulesByEvenSpaceId(event_space_id as string);
  //   console.log(data, 'schedules');
  // }, []);

  const handleEnterSchedule = async (id: string) => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules/updateSchedule`,
        query: {
          event_space_id: event_space_id,
          trackId: trackId,
          scheduleId: id,
          trackTitle: trackTitle,
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
        query: {
          event_space_id: event_space_id,
          trackId: trackId,
          trackTitle: trackTitle,
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
          </div>
          <div className="flex flex-col gap-[30px] self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="flex flex-col gap-5 self-stretch">
                <h3 className="text-2xl leading-[1.2] opacity-70 font-bold"> All Schedules</h3>
              </div>
            </div>
            <div className="flex justify-between items-start self-stretch"></div>
          </div>
        </div>
        {isLoading ? <Loader /> : <ScheduleItemCard />}
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
