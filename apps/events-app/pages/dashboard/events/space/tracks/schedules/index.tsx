import {
  BiLeftArrowAlt,
  BiEditAlt,
  BiPlus,
  BiRadioCircle,
  BiCalendarAlt,
  BiTimeFive,
  BiRadioCircleMarked,
  BiPlusCircle,
} from "react-icons/bi";
import { HiArrowLeft, HiCog, HiSelector } from "react-icons/hi";

import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { useQuery } from "react-query";
import fetchSchedulesByTrackId from "@/services/fetchScedulesByTrackId";
import { ScheduleUpdateRequestBody } from "@/types";
import { HiArrowRight } from "react-icons/hi2";
import { Loader } from "@/components/ui/Loader";
import useTrackDetails from "@/hooks/useTrackDetails";
import ScheduleItemCard from "@/components/schedules/ScheduleItemCard";
import TrackScheduleItemCard from "@/components/schedules/TrackScheduleItemCard";
import Image from "next/image";

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
    ["schedules", event_space_id],
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
      console.error("Error fetching space details", error);
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
      console.error("Error fetching space details", error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-start gap-10 self-stretch pb-[60px] px-5 lg:px-20">
        <div className="w-full flex flex-col justify-start items-start relative p-0 gap-[30px] rounded-0">
          <div className="flex w-full justify-between items-center flex-1 flex-grow-0">
            <Button
              className="rounded-[40px] py-2.5 text-base px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
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
              className="rounded-[40px] py-2.5 text-base px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={BiEditAlt}
            >
              Edit Track
            </Button>
          </div>
          <div className="flex flex-col gap-[30px] self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="w-24 h-fit bg-white rounded-lg p-1">
                {loading ? (
                  <Loader />
                ) : (
                  <Image
                    src={trackDetails?.image as string}
                    alt="track-image"
                    width={100}
                    height={100}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex flex-col gap-5 self-stretch">
                <h2 className="md:text-4xl text-2xl font-semibold">
                  {track_title}
                </h2>
              </div>
            </div>
            <h3 className="text-2xl leading-[1.2] opacity-70 font-bold ">
              Sessions
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-start self-stretch">
              <Button
                variant="blue"
                className="flex py-[10px] px-[14px] justify-center w-full md:w-auto items-center gap-[10px] rounded-[20px] bg-[#67DAFF20] text-[#67DAFF] text-xl"
                leftIcon={BsFillPlusCircleFill}
                onClick={handleAddSchedule}
              >
                Add a Session
              </Button>

              <div className="flex mt-2 md:mt-0 items-start gap-3">
                <Button
                  className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-sm text-textSecondary hover:text-textSecondary"
                  size="lg"
                  leftIcon={HiSelector}
                >
                  Sort
                </Button>
                <Button
                  className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-sm text-textSecondary hover:text-textSecondary"
                  size="lg"
                  leftIcon={HiCog}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? <Loader /> : <TrackScheduleItemCard />}
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
