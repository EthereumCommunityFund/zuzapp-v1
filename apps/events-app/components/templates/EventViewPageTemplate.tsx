import { useEventSpace } from "@/context/EventSpaceContext";
import InPersonEventViewPageTemplate from "./InPersonEventViewPageTemplate";
import OnlineEventViewPageTemplate from "./OnlineEventViewPageTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { EventSpaceDetailsType } from "@/types";
import fetchByEventID from "@/pages/api/invite/fetchByEventID";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { useQuery } from "react-query";
import { Loader } from "lucide-react";
// import EventSpaceDetailsType from "@types";

export default function EventViewPageTemplate({
  eventSpace,
}: {
  eventSpace: EventSpaceDetailsType;
}) {
  return (
    <>
      {eventSpace?.format === "in-person" && (
        <InPersonEventViewPageTemplate eventSpace={eventSpace} />
      )}
      {eventSpace?.format === "online" && (
        <OnlineEventViewPageTemplate eventSpace={eventSpace} />
      )}
    </>
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
