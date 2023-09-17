import Button from '@/components/ui/buttons/Button';
import { HiArrowLeft } from 'react-icons/hi';
import DetailsBar from '@/components/detailsbar';
import ScheduleForm from '@/components/schedule/ScheduleForm';
import ScheduleLabels from '@/components/schedule/ScheduleLabels';
import EditionButtons from '@/components/ui/buttons/EditionButtons';

import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';

export default function AddSchedulePage() {
  return (
    <div className="flex items-start gap-[60px] self-stretch">
      <DetailsBar />
      <div className="flex flex-col items-start gap-[17px] flex-1">
        <div className="flex items-center gap-[17px] self-stretch">
          <Button leftIcon={HiArrowLeft} variant="light-dark">
            Back
          </Button>
          <div className="flex flex-col gap-[10px]">
            <span className="text-2xl items-start font-bold">ZK Week</span>
            <span className="text-sm opacity-70">You are adding a schedule for this track</span>
          </div>
        </div>
        <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-[#FFFFFF10] bg-[#2E3131]">
          <ScheduleForm />
          <ScheduleLabels />
          <EditionButtons type={'schedule'} leftButtonName={'Discard Schedule'} rightButtonName={'Add Schedule'} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowUp} />
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
