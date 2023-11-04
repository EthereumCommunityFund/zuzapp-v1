import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import EditScheduleForm from '@/components/commons/EditScheduleForm';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function UpdateSchedulePage() {
  const router = useRouter();
  const { event_space_id, trackId, scheduleId } = router.query;

  return (
    <>
      {trackId && scheduleId && event_space_id && (
        <EditScheduleForm isQuickAccess={false} trackId={trackId as string} scheduleId={scheduleId as string} event_space_id={event_space_id as string} isFromEventView={false} creatorId={''} />
      )}
    </>
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
