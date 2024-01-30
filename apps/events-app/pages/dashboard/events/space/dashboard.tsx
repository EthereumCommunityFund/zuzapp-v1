import { useRouter } from 'next/router';
import EventSpaceDashboardCard from '@/components/eventspace/EventSpaceDashboardCard';
import { getSpaceDashboardCards, spaceDashboardCards } from '@/constant/spacedashboardcards';
import { ScheduleUpdateRequestBody, SpaceDashboardType, TrackUpdateRequestBody } from '@/types';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/buttons/Button';
import { HiCalendar } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';
import { RiSettings5Fill } from 'react-icons/ri';
import { SpaceDashboardCardType } from '@/types';
import { eventRoutes } from '@/constant/routes';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';

import { updateEventSpaceStatus } from '@/controllers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { useEffect, useState } from 'react';
import useCurrentEventSpace from '@/hooks/useCurrentEventSpace';
import { Loader } from 'lucide-react';
import { useQuery } from 'react-query';
import fetchTracksByEventSpaceId from '@/services/fetchTracksByEventSpace';
import ScheduleList from '@/components/eventspace/ScheduleList';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import { toast } from '@/components/ui/use-toast';

interface IProps {
  type: SpaceDashboardType;
}

type IdProp = {
  id: string;
};

type Joined<T> = ScheduleUpdateRequestBody & T;

interface DialogContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonAction: () => void;
}
export default function EventSpaceDashboard(props: IProps) {
  const { type } = props;
  const router = useRouter();
  const { event_space_id, isFirst, eventTitle } = router.query;
  const { eventSpace, isLoading, isError, refetch } = useCurrentEventSpace();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const currentEventStatus = eventSpace?.status;
  const dashboardCards = getSpaceDashboardCards(currentEventStatus as string);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handlePublishEvent = async () => {
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }

    const { name, main_location, tracks } = eventSpace;

    if (!name || !main_location) {
      console.error('Event space does not meet the minimum requirements for publishing');
      setDialogContent({
        title: 'Error!',
        description: 'Event space does not meet the minimum requirements for publishing.',
        buttonLabel: 'Edit Event',
        buttonAction: () =>
          router.push({
            pathname: '/dashboard/events/space/details/',
            query: { event_space_id: event_space_id },
          }),
      });
      setDialogOpen(true);
      return;
    }

    try {
      const result = await updateEventSpaceStatus(eventSpace.id as string, {
        status: 'published',
        id: eventSpace.id,
      });
      // setIsUpdatingStatus(true);
      console.log(result, 'Event space published successfully');
      if (result) {
        setDialogContent({
          title: 'Success!',
          description: 'Your Event Was Published Successfully.',
          buttonLabel: 'View Event',
          buttonAction: () => router.push('/dashboard/home'),
        });
        setDialogOpen(true);
      } else {
        setDialogContent({
          title: 'Error!',
          description: 'Event space does not meet the minimum requirements for publishing.',
          buttonLabel: 'Edit Event',
          buttonAction: () =>
            router.push({
              pathname: '/dashboard/events/space/details/',
              query: { event_space_id: event_space_id },
            }),
        });
      }
    } catch (error) {
      console.error('Failed to publish event space', error);
    }
    setIsUpdatingStatus(false);
  };
  const handleArchiveEvent = async () => {
    setIsUpdatingStatus(true);
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }
    if (currentEventStatus === 'published') {
      try {
        const result = await updateEventSpaceStatus(eventSpace.id as string, {
          status: 'archived',
          id: eventSpace.id,
        });
        if (result) {
          toast({
            title: 'Eventspace archived successfully',
          });
          refetch();
          setConfirmationModal(false);
        }
      } catch (error: any) {
        console.log(error);
        toast({
          title: 'Error',
          description: error?.response.data?.error,
          variant: 'destructive',
        });
      }
    }
    setIsUpdatingStatus(false);
  };

  const popUpModal = (actionType: SpaceDashboardCardType) => {
    let content: DialogContent | null = null;
    if (actionType === SpaceDashboardCardType.PublishEvent) {
      content = {
        title: 'Publish Event',
        description: "You're about to publish this event.",
        buttonLabel: 'Publish Event',
        buttonAction: handlePublishEvent,
      };
    } else if (actionType === SpaceDashboardCardType.ArchiveEvent) {
      content = {
        title: 'Archive Event',
        description: "You're about to archive this event.",
        buttonLabel: 'Archive Event',
        buttonAction: handleArchiveEvent,
      };
    }
    setDialogContent(content);
    setConfirmationModal(true);
  };

  const handleButtonClick = (type: SpaceDashboardCardType) => {
    if (type === SpaceDashboardCardType.PublishEvent || type === SpaceDashboardCardType.ArchiveEvent) {
      popUpModal(type);
    } else if (type === SpaceDashboardCardType.EnterEventDetails || type === SpaceDashboardCardType.EditDetails) {
      router.push({
        pathname: `/dashboard/events/space/details/`,
        query: { event_space_id: event_space_id },
      });
    } else if (type === SpaceDashboardCardType.OpenSettings) {
      router.push({
        pathname: `settings`,
        query: { event_space_id: event_space_id },
      });
    }
  };

  const {
    data: trackDetails,
    isLoading: isLoadingTracks,
    isError: isTracksError,
  } = useQuery<TrackUpdateRequestBody[], Error>(
    ['trackDetails', event_space_id],
    () => fetchTracksByEventSpaceId(event_space_id as string),

    {
      enabled: !!event_space_id,
      onSuccess: (data) => {},
      onError: (error) => {
        console.log('an error', error);
        // router.push("/404");
      },
    }
  );

  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    isError: isSchedulesError,
  } = useQuery<Joined<IdProp>[], Error>(
    ['schedules', event_space_id],
    () => fetchSchedulesByEvenSpaceId(event_space_id as string),

    {
      enabled: !!event_space_id,
    }
  );
  useEffect(() => {
    console.log(eventSpace, 'eventSpace');
  });
  if (isLoading) {
    <Loader />;
  }

  return (
    <>
      <div className="flex flex-col flex-1 items-center gap-[10px] self-stretch w-full">
        <div className="flex flex-col items-center gap-5 flex-1 w-full">
          {
            <div className="xl:w-4/5 w-full md:w-[90%] px-2.5">
              {isFirst === SpaceDashboardType.New.toString() && eventSpace?.status === 'draft' && eventSpace.name === '' && (
                <>
                  <Dialog open>
                    <DialogContent className="sm:max-w-[425px] h-1/3 md:max-w-none w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Welcome to your Event Space</DialogTitle>
                        <DialogDescription className="text-xl font-bold">First, you'll need to enter the details of your main event.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="pt-5 self-end text-2xl">
                        <Button
                          variant="primaryGreen"
                          className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base"
                          leftIcon={HiCalendar}
                          onClick={() => handleButtonClick(SpaceDashboardCardType.EnterEventDetails)}
                        >
                          Enter Event Details
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {dashboardCards.map((item, index) => (
                <div key={index} className="mb-8">
                  <EventSpaceDashboardCard
                    key={index}
                    name={item.name}
                    description={item.description}
                    buttonName={item.buttonName}
                    cardType={item.cardType}
                    icon={item.icon}
                    buttonIcon={item.buttonIcon}
                    onCardClick={handleButtonClick}
                  />
                </div>
              ))}

              <Dialog open={isDialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{dialogContent?.title}</DialogTitle>
                    <DialogDescription className="text-sm font-bold">{dialogContent?.description}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="pt-5">
                    <Button className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base" onClick={dialogContent?.buttonAction}>
                      {dialogContent?.buttonLabel}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        </div>
      </div>

      <Dialog open={confirmationModal} onOpenChange={(open) => setConfirmationModal(open)}>
        <DialogContent className="sm:max-w-[425px] lg:w-[800px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl my-3">{dialogContent?.title}</DialogTitle>
            <DialogDescription className="text-base font-normal text-white my-2">{dialogContent?.description}</DialogDescription>
          </DialogHeader>
          {/* <section className="text-white w-full flex flex-col gap-6 bg-accent-foreground rounded-2xl p-4">
            <div className="flex gap-3">
              <span className="font-semibold">Total Tracks: {trackDetails && trackDetails.length}</span>
              <span className="font-semibold">Total Sessions: {schedules && schedules.length}</span>
            </div>
            {trackDetails && trackDetails.map((track, index) => <ScheduleList track={track} />)}
          </section> */}
          <DialogFooter className="pt-5 self-end text-2xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <Button
                variant="yellow"
                className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base"
                leftIcon={MdCancel}
                onClick={() => setConfirmationModal(false)}
              >
                Don't {dialogContent?.buttonLabel.split(' ')[0]} Yet
              </Button>
              <Button
                variant="primaryGreen"
                className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base"
                leftIcon={HiCalendar}
                onClick={dialogContent?.buttonAction}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'loading...' : dialogContent?.buttonLabel}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
