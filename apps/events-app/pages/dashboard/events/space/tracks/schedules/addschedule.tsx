import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { useRouter } from "next/router";
import {
  fetchLocationsByEventSpace,
  fetchAllTags,
  fetchAllSpeakers,
} from "@/controllers";

import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import AddScheduleForm from "@/components/commons/AddScheduleForm";
dayjs.extend(isSameOrAfter);

export default function AddSchedulePage(props: any) {
  const router = useRouter();
  const { event_space_id, trackId, track_title } = router.query;

  return (
    <AddScheduleForm
      isQuickAccess={false}
      trackId={trackId as string}
      isFromEventView={false}
      event_space_id={event_space_id as string}
      track_title={track_title as string}
    />
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

  const locationsResult = await fetchLocationsByEventSpace(
    ctx.query.event_space_id
  );
  const tagsResult = await fetchAllTags();
  const organizersResult = await fetchAllSpeakers();

  return {
    props: {
      initialSession: session,
      user: session?.user,
      savedLocations: locationsResult.data.data,
      tags: tagsResult.data.data,
      organizers: organizersResult.data.data,
    },
  };
};
