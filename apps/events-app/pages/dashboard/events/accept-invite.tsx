import { EventInviteCard } from "@/components/templates/events/EventInviteCard";
import { useState } from "react";
import router, { useRouter } from "next/router";
import { useUserPassportContext } from "@/context/PassportContext";
import { useGlobalContext } from "@/context/GlobalContext";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { updateInvite } from "@/controllers/invite.controller";
import { useQuery } from "react-query";
import fetchInviteById from "@/services/fetchInviteById";
import { EventSpaceDetailsType } from "@/types";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import useCurrentEventSpace from "@/hooks/useCurrentEventSpace";

export default function Invited() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const { invite_id } = router.query;
  const [eventId, setEventId] = useState("");

  const {
    data: inviteDetails,
    isLoading,
    isError,
  } = useQuery<any, Error>(
    ["inviteDetails", invite_id],
    () => fetchInviteById(invite_id as string),
    {
      enabled: !!invite_id,
      onSuccess: (data) => {
        console.log("invite", data);
        setEventId(data?.event_space_id as string);
        if (data.status === "accepted") {
          setAccepted(true);
        }
      },
    }
  );

  const { eventSpace } = useCurrentEventSpace();

  const handleUpdateInvite = async () => {
    if (!invite_id) return;
    setAccepted(true);
    try {
      await updateInvite(invite_id as string, {
        status: "accepted",
      });
    } catch (error) {
      console.error("Error sending invite", error);
    }
  };

  const handleButtonClick = async () => {
    router.push({
      pathname: `/dashboard/events/myspaces`,
    });
  };
  const renderEventInviteCard = () => {
    if (!user) {
      return (
        <EventInviteCard
          onButtonClick={signIn}
          spacename={eventSpace?.name as string}
          buttonTitle="Connect Passport"
          buttonVariant="quiet"
          info="You need to login to accept this invitation to edit"
        />
      );
    } else if (
      accepted ||
      (inviteDetails && inviteDetails.status === "accepted")
    ) {
      return (
        <EventInviteCard
          spacename={eventSpace?.name as string}
          buttonTitle={"My Event Spaces"}
          onButtonClick={handleButtonClick}
          buttonVariant="blue"
          info="Invite Accepted, Head to your Event Spaces to view your invited spaces"
        />
      );
    } else {
      return (
        <EventInviteCard
          spacename={eventSpace?.name as string}
          onButtonClick={handleUpdateInvite}
          buttonTitle="Accept invite"
          buttonVariant="blue"
          info="Click the Button to Accept the invite"
        />
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderEventInviteCard()}
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
