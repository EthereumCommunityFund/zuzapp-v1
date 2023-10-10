import { EventSpaceDetailsType } from "@/types";
import EventViewHeader from "@/components/eventview/EventViewHeader";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import { DropDownMenu } from "@/components/ui/DropDownMenu";
import { Loader } from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/buttons/Button";
import {
  Calendar,
  SelectCategories,
  SelectLocation,
} from "@/components/ui/icons";
import { useEventSpace } from "@/context/EventSpaceContext";
import { fetchEventSpace } from "@/controllers";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { DropDownMenuItemType } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { Option } from "react-dropdown";
import { BiLeftArrow, BiSolidCategory } from "react-icons/bi";
import { QueryClient, dehydrate, useQuery } from "react-query";
import useEventDetails from "@/hooks/useCurrentEventSpace";

export default function EventViewTracksPage() {
  const router = useRouter();
  const { event_space_id } = router.query;
  if (!event_space_id) {
    router.push("/404");
  }

  const { eventSpace, isLoading } = useEventDetails();

  const [currentPage, setCurrentPage] = useState(1);

  const categoryList: DropDownMenuItemType[] = [
    {
      name: "Network States",
    },
    {
      name: "Character Cities",
    },
    {
      name: "Coordinations",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = (track_title: string, trackId?: string) => {
    router.push({
      pathname: `/dashboard/eventview/tracks/track`,
      query: { trackId, event_space_id, track_title },
    });
  };

  return (
    <>
      {" "}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex gap-4 lg:flex-row sm:flex-col-reverse lg:bg-pagePrimary sm:bg-componentPrimary">
          <div className="flex flex-col lg:w-3/4 sm:w-full gap-5">
            <EventViewHeader
              imgPath={eventSpace?.image_url as string}
              name={eventSpace?.name as string}
              tagline={eventSpace?.tagline as string}
            />
            <div className="lg:py-5 lg:px-14 sm:py-3">
              <div className="p-2.5 md:bg-componentPrimary rounded-2xl">
                <div className="flex flex-col gap-[10px] overflow-hidden md:p-3">
                  {eventSpace?.tracks.map((item, idx) => (
                    <TrackItemCard
                      key={idx}
                      trackId={item.id}
                      trackTitle={item.name}
                      trackImage={item.image as string}
                      onClick={() => handleItemClick(item.name, item.id)}
                    />
                  ))}
                </div>
                <div>
                  {/* <Pagination totalPages={10} currentPage={1} onPageChange={handlePageChange} /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/4 sm:w-full flex lg:flex-col lg:pl-10 gap-5 lg:fixed lg:right-0 min-w-fit">
            <h2 className="p-3.5 gap-[10px] font-bold text-xl sm:hidden lg:flex">
              Tracks: Sort & Filter
            </h2>
            <div className="flex lg:flex-col md:flex-row sm:flex-col w-full p-2.5 md:gap-5 sm:gap-3 text-sm">
              <DropDownMenu
                data={categoryList}
                header={"Select Categories"}
                headerIcon={SelectCategories}
                multiple={true}
                value={""}

                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={""}
              />
              <DropDownMenu
                data={categoryList}
                header={"Select Dates"}
                headerIcon={Calendar}
                multiple={true}
                value={""}

                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={""}
              />
              <DropDownMenu
                data={categoryList}
                header={"Select Location"}
                headerIcon={SelectLocation}
                multiple={true}
                value={""}

                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={""}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  await queryClient.prefetchQuery("currentEventSpace", () =>
    fetchEventSpaceById(event_space_id)
  );
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
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("uuid", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
