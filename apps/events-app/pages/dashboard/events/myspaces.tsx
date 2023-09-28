import EventSpacesTemplate from "@/components/templates/events/EventSpacesTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { fetchUserEventSpaces } from "../../../services/eventSpaceService";
import { EventSpaceDetailsType } from "@/types";
import { useQuery } from "react-query";
import { Loader } from "../../../components/ui/Loader";
import { arrayFromLength } from "@/lib/helper";
import { EventTemplateSkeleton } from "@/components/commons/EventTemplateSkeleton";
export default function MyEventSpacesPage() {
  // Make request to get all event spaces

  const {
    data: eventSpaces,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType[], Error>(
    ["eventSpaces"], // Query key
    () => fetchUserEventSpaces(),
    {
      onSuccess: (data) => {
        console.log("Event Spaces:", data);
      },
    }
  );

  // if (isLoading) {
  //   return (
  //     <div>
  //       {arrayFromLength(4).map((_, i) => (
  //         <EventTemplateSkeleton key={i} />
  //       ))}
  //     </div>
  //   );
  // }
  if (isError) {
    return <p>Error loading space details</p>;
  }
  return (
    <div className="flex gap-[10px] flex-1 items-center self-stretch font-inter">
      {<EventSpacesTemplate eventSpaces={eventSpaces} isLoading={isLoading} />}
    </div>
  );
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
