import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';

import EventViewScheduleViewTemplate from '@/components/eventview/EventViewScheduleView';


export default function EventViewScheduleDetailsPage() {
  const router = useRouter();
  const { event_space_id, scheduleId, trackId } = router.query;
  return (
    <>
      {
        event_space_id && scheduleId && trackId &&
        < EventViewScheduleViewTemplate
          event_space_id={event_space_id as string}
          scheduleId={scheduleId as string}
          trackId={trackId as string}
        />
      }
    </>
  )
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);

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
