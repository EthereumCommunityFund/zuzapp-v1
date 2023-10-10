import Button from '@/components/ui/buttons/Button';
import { HiArrowLeft } from 'react-icons/hi';
import DetailsBar from '@/components/detailsbar';



import { useState } from 'react';

import { ScheduleUpdateRequestBody } from '@/types';

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';

import { useRouter } from 'next/router';


import ScheduleEditForm from '@/components/commons/ScheduleEditForm';

export default function UpdateSchedulePage() {
  const router = useRouter();
  const { track_title } = router.query;

  const [schedule, setSchedule] = useState<ScheduleUpdateRequestBody>({
    name: '',
    format: 'in-person',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    all_day: false,
    schedule_frequency: 'once',
    images: [''],
    video_call_link: '',
    live_stream_url: '',
    location_id: '',
    event_type: '',
    experience_level: '',
    limit_rsvp: false,
    rsvp_amount: 1,
    event_space_id: '',
    track_id: '',
    tags: [''],
    organizers: [
      {
        name: '',
        role: '',
      },
    ],
  });



  // const formated = formatDate('2023-09-27T23:00:00+00:00');
  // console.log(formated, 'formated');

  return (
    <div className="flex items-start gap-[60px] self-stretch md:px-10 px-2.5 py-5">
      <DetailsBar />
      <div className="flex flex-col items-start gap-[17px] flex-1">
        <div className="flex items-center gap-[17px] self-stretch">
          <Button
            className="rounded-[40px] text-base md:text-xl py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
            size="lg"
            leftIcon={HiArrowLeft}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div className="flex flex-col gap-[10px]">
            <span className="text-2xl items-start font-bold">{track_title}</span>
            <span className="text-sm opacity-70">You are editing a schedule for this track</span>
          </div>
        </div>
        <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-[#FFFFFF10] bg-[#2E3131]">
          <ScheduleEditForm
            title='Update Schedule'
            isFromAllSchedules={false}
            scheduleData={schedule} />
        </div>
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
