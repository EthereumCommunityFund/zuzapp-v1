import TrackItem from "@/components/tracks/TrackItemCard";
import Button from "@/components/ui/buttons/Button";
import { Database } from "@/database.types";
import { TrackUpdateRequestBody } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiSolidPlusCircle } from "react-icons/bi";
import { HiCog, HiPlusCircle, HiSelector } from "react-icons/hi";
import { useQuery } from "react-query";
import TrackItemTemplate from "@/components/tracks/TrackItemTemplate";
import fetchTracksByEventSpaceId from "../../../../../services/fetchTracksByEventSpace";
import { Loader } from "@/components/ui/Loader";
import { error } from "console";
export default function Tracks() {
  // const { eventSpace } = useEventSpace();
  // console.log(eventSpace, 'eventSpace')

  const router = useRouter();
  const { event_space_id } = router.query;
  const handleAddTrack = async () => {
    try {
      router.push({
        pathname: `tracks/addtrack`,
        query: { event_space_id: event_space_id },
      });
    } catch (error) {
      console.error("Error fetching tracks", error);
    }
  };

  const {
    data: trackDetails,
    isLoading,
    isError,
  } = useQuery<TrackUpdateRequestBody[], Error>(
    ["trackDetails", event_space_id],
    () => fetchTracksByEventSpaceId(event_space_id as string),

    {
      enabled: !!event_space_id,
      onSuccess: (data) => {
        console.log("tracks", data);
      },
      onError: (error) => {
        console.log("an error", error);
        // router.push("/404");
      },
    }
  );

  return (
    <div className="flex flex-col flex-1 items-center gap-[10px] pt-10 lg:px-20 pb-0 self-stretch">
      <div className="flex flex-col items-center gap-[44px] self-stretch w-[92%] mx-auto lg:w-[82%]">
        <div className="flex flex-col items-start gap-7 self-stretch">
          <span className="md:text-[50px] text-4xl font-bold leading-[1.2]">Tracks</span>
          <div className="flex justify-between flex-col gap-y-5 md:flex-row items-start self-stretch">
            <Button
              variant="blue"
              className="rounded-full w-full flex items-center justify-center md:w-auto font-bold"
              size="lg"
              leftIcon={BiSolidPlusCircle}
              onClick={handleAddTrack}
            >
              Add a Track
            </Button>
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="base"
                className="font-bold opacity-70"
                leftIcon={HiSelector}
              >
                Sort
              </Button>
              <Button
                variant="ghost"
                size="base"
                className="font-bold opacity-70"
                leftIcon={HiCog}
              >
                Select
              </Button>
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="w-full">
              {trackDetails && (
                <TrackItemTemplate trackDetails={trackDetails} />
                // <></>
              )}
            </div>
          )}
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
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("uuid", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
