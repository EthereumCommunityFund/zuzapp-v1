import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";


import { Loader } from "@/components/ui/Loader";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { useGlobalContext } from "@/context/GlobalContext";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function EventViewPage() {
  // Make request to get all event spaces
  const { profile } = useGlobalContext();
  const { eventSpace, isLoading } = useEventDetails();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        eventSpace && (
          <EventViewPageTemplate eventSpace={eventSpace} profile={profile} />
        )
      )}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);

  // console.log(dehydrate(queryClient).queries[0].state, "dehydrated");
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

      // dehydratedState: dehydrate(queryClient),
    },
  };
};
