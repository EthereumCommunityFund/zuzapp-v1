import { ScheduleUpdateRequestBody } from "@/types";
import { BiCalendarAlt, BiRadioCircle, BiTimeFive } from "react-icons/bi";
import Button from "../ui/buttons/Button";
import { HiArrowRight } from "react-icons/hi";
import { useQuery } from "react-query";
import fetchSchedulesByTrackId from "@/services/fetchScedulesByTrackId";
import { useRouter } from "next/router";
import { Loader } from "../ui/Loader";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import fetchSchedulesByEvenSpaceId from "@/services/fetchScheduleByEventSpace";
import { stringToDateFormated, toTurkeyTime } from "@/utils";

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
    ["schedules", event_space_id],
    () => fetchSchedulesByEvenSpaceId(event_space_id as string),

    {
      enabled: !!event_space_id,
    }
  );

  const handleEnterSchedule = async (id: string, scheduleTrackId: string) => {
    const scheduleTrackTitle = eventSpace?.tracks.find(
      (trackItem) => trackItem.id === scheduleTrackId
    )?.name;
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules/updateSchedule`,
        query: {
          event_space_id,
          trackId: scheduleTrackId,
          scheduleId: id,
          track_title: track_title,
        },
      });
    } catch (error) {
      console.error("Error fetching space details", error);
    }
  };

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function formatTime(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      {schedules && (
        <div className="flex flex-col gap-[10px] w-full">
          {schedules.map((schedule) => (
            <div className="flex flex-col items-center justify-between gap-[10px]">
              <div
                onClick={() =>
                  handleEnterSchedule(schedule.id, schedule.track_id as string)
                }
                className="flex py-3 px-3.5 items-start md:items-center justify-between rounded-2xl border border-white border-opacity-10 hover:bg-[#3B3F3F] cursor-pointer bg-[#2E3131] w-full"
              >
                <div className="flex items-start gap-2.5">
                  <BiRadioCircle className="w-10 h-6" />
                  <div className="flex flex-col items-start gap-[10px]">
                    <span className="text-[18px] font-semibold leading-[1.2]">
                      {schedule.name}
                    </span>
                    <div className="flex justify-between w-full"></div>

                    <div className="flex items-start self-stretch text-sm gap-6">
                      <span className="flex items-center p-1 gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10] white-space-nowrap overflow-hidden text-ellipsis">
                        <BiCalendarAlt size={30} />
                        <span className="ml-2 text-xs md:text-sm ">
                          {stringToDateFormated(schedule?.start_date)}
                        </span>
                      </span>
                      <span className="flex items-center p-1 gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10] white-space-nowrap overflow-hidden text-ellipsis">
                        <BiTimeFive size={30} />
                        <span className="ml-2 text-xs md:text-sm ">
                          {toTurkeyTime(schedule?.start_time).format("H:mm")} -{" "}
                          {toTurkeyTime(schedule?.end_time).format("H:mm")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div></div>
                <Button
                  variant="dark"
                  className="bg-white/20 text-black rounded-full text-sm md:text-base mx-2"
                  leftIcon={HiArrowRight}
                  onClick={() =>
                    handleEnterSchedule(
                      schedule.id,
                      schedule.track_id as string
                    )
                  }
                >
                  <span className="hidden md:block">Enter Session</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
