import AddTrackTemplate from "@/components/tracks/AddTrackTemplate";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import EditTrackForm from "@/components/tracks/EditTrackForm";
import Container from "@/components/ui/Container";
import { TrackUpdateRequestBody } from "@/types";
import { updateTrack } from "@/controllers";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { useQueryClient, useQuery } from "react-query";
import { fetchTrackById } from "@/services/fetchTrack";
import { toast } from "@/components/ui/use-toast";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export default function UpdateTrackPageTemplate() {
  const [trackCreated, setTrackCreated] = useState(false);
  const router = useRouter();
  const { event_space_id, trackId } = router.query;
  const [dialog, setDialog] = useState(false);

  const queryClient = useQueryClient();
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false, // default: true
  //     },
  //   },
  // })

  const {
    data: trackDetails,
    isLoading,
    isError,
  } = useQuery<TrackUpdateRequestBody, Error>(
    ["trackDetails", trackId], // Query key
    () => fetchTrackById(trackId as string), // Query function
    {
      enabled: !!trackId,
      refetchOnWindowFocus: false, // Only execute the query if event_space_id is available
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }

  const handleTrackSubmit = async (values: TrackUpdateRequestBody) => {
    try {
      if (!event_space_id) return;
      const result = await updateTrack(
        trackId as string,
        {
          ...values,
          event_space_id: event_space_id as string,
          id: trackId as string,
        },
        event_space_id as string
      );
      setTrackCreated(true);
      // toast({
      //   title: "track updated successfully",
      // });
      queryClient.invalidateQueries({ queryKey: ["trackDetails"] });
    } catch (error) {
      setTrackCreated(false);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:py-5 lg:px-10 items-center gap-[10px] self-stretch w-full">
      {/*{trackCreated ? (*/}
      {/*  <div className="flex flex-col items-center">*/}
      {/*    <h3 className="font-bold text-xl">Your Track Has Been Updated</h3>*/}
      {/*    <Link*/}
      {/*      href={`/dashboard/events/space/tracks?event_space_id=${event_space_id}`}*/}
      {/*    >*/}
      {/*      <Button*/}
      {/*        variant="primary"*/}
      {/*        className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full"*/}
      {/*        leftIcon={HiArrowRight}*/}
      {/*      >*/}
      {/*        Go to tracks*/}
      {/*      </Button>*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*) : (*/}
      <Dialog open={trackCreated}  onOpenChange={(open) => setDialog(open)}>
        <DialogContent className="sm:max-w-[525px] h-auto rounded-2xl">
          <DialogHeader className="my-2">
            <DialogTitle>Your Track Has Been Updated</DialogTitle>
          </DialogHeader>
          <div className="text-sm font-light text-white/70 my-2">You can edit event space details in your dashboard.</div>
          <div className="font-normal text-white my-2">Now go to Tracks and start building your schedules</div>
          <DialogFooter>
            <Link href={`/dashboard/events/space/tracks?event_space_id=${event_space_id}`}>
              <Button
                  variant="primary"
                  className="bg-[#67DBFF]/20 text-[#67DBFF] text-lg w-full justify-center rounded-full"
                  leftIcon={HiArrowRight}>
                Go to tracks
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        <>
          <Container className="mx-auto max-w-screen-xl lg:w-[85%]">
            <h2 className="flex font-semibold text-3xl w-full ">Edit Track</h2>
            <EditTrackForm
              onTrackSubmit={handleTrackSubmit as any}
              trackDetails={trackDetails as TrackUpdateRequestBody}
            />
          </Container>
        </>
      {/*)}*/}
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
