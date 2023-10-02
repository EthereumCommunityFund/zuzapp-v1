import EventViewHeader from "@/components/eventview/EventViewHeader";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import { List } from "@/components/ui/DropDownMenu";
import Pagination from "@/components/ui/Pagination";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Calendar, SelectCategories, SelectLocation } from "@/components/ui/icons";
import { useEventSpace } from "@/context/EventSpaceContext";
import { DropDownMenuItemType } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiLeftArrow, BiPlusCircle } from "react-icons/bi";

const categoryList: DropDownMenuItemType[] = [
  {
    name: 'Network States',
  },
  {
    name: 'Character Cities',
  },
  {
    name: 'Coordinations',
  },
]

export default function EventViewTracksAlleSchedulesPage() {
  const router = useRouter();
  const { eventSpace } = useEventSpace();

  const handleItemClick = (scheduleName: string, trackId?: string) => {
    router.push({
      pathname: "/dashboard/eventview/allschedules/schedule",
      query: { scheduleName, trackId }
    });
  }
  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-[1000px]">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="flex flex-col gap-2.5 p-[30px]">
          <div>
            <Button variant="blue" size="lg" className="rounded-xl" leftIcon={BiPlusCircle}>
              Add a Schedule
            </Button>
          </div>
          <div className=" p-2.5 gap-[10px] overflow-hidden rounded-[10px]">
            {
              eventSpace?.schedules.map((schedule) => (
                <UserFacingTrack onClick={() => handleItemClick(schedule.name, schedule.track_id)} scheduleData={schedule} />
              ))
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 px-5 py-2.5 w-1/4 fixed right-0">
        <h2 className="p-3.5 gap-[10px] font-bold text-2xl border-b-2 border-borderPrimary">Schedules: Sort & Filter</h2>
        <div className="flex flex-col p-2.5 gap-5 ">
          <List data={categoryList} header={"Select Categories"} headerIcon={SelectCategories} />
          <List data={categoryList} header={"Select Dates"} headerIcon={Calendar} />
          <List data={categoryList} header={"Select Location"} headerIcon={SelectLocation} />
        </div>
      </div>
    </div>
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