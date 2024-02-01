import * as z from 'zod';
import { useEffect, useRef, useState } from 'react';
import { EventSpaceDetailsType, SpaceDashboardCardType } from '@/types';
import { Loader } from '../ui/Loader';
import { useRouter } from 'next/router';
import Button from '../ui/buttons/Button';
import Link from 'next/link';
import { HiArrowCircleUp, HiArrowLeft, HiArrowRight, HiCalendar, HiXCircle } from 'react-icons/hi';
import { toast } from '../ui/use-toast';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { eventDetailsList } from '@/constant/eventdetails';
import { updateEventSpaceStatus } from '@/controllers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdCancel } from 'react-icons/md';
import { deleteEventSpaceById } from '@/services/deleteEventSpaces';
import { EventSpaceForm } from './EventSpaceForm';
dayjs.extend(isSameOrAfter);

interface EventSpaceDetailsProps {
  eventSpace: EventSpaceDetailsType;
  handleGoBack?: () => void;
  isLoadingEvent: boolean;
}
interface DialogContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonAction: () => void;
}

const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({ eventSpace, handleGoBack, isLoadingEvent }) => {
  const [detailsUpdated, setDetailsUpdated] = useState(false);
  const [dialog, setDialog] = useState(false);
  const router = useRouter();
  const { event_space_id } = router.query;
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const currentEventStatus = eventSpace?.status;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const zuconnectId = '873f2ae3-bcab-4a30-8b99-cb5e011a9db0';
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const goBackToPreviousPage = () => {
    router.push(`/dashboard/events/space/dashboard?event_space_id=${event_space_id}`);
  };
  const handleButtonClick = (type: SpaceDashboardCardType) => {
    if (type === SpaceDashboardCardType.PublishEvent || type === SpaceDashboardCardType.ArchiveEvent) {
      popUpModal(type);
    }
  };
  const handlePublishEvent = async () => {
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }

    const { name, main_location, tracks } = eventSpace;

    if (!name || !main_location) {
      console.error('Event space does not meet the minimum requirements for publishing. Enter Event Details and Save');
      setDialogContent({
        title: 'Error!',
        description: 'Event space does not meet the minimum requirements for publishing. Enter Event Details and Save',
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
          // refetch();
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
  const handleDeleteEventSpace = async () => {
    if (!eventSpace) return;
    if (eventSpace.id === zuconnectId) {
      toast({
        title: 'Error',
        description: 'This event cannot be deleted without adequate permissions.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsDeleting(true);
      await deleteEventSpaceById(eventSpace.id as string);
      router.push('/dashboard/events/myspaces');
    } catch (error) {
      console.error('Error deleting the event space', error);
    } finally {
      setIsDeleting(false);
    }
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

  if (isLoadingEvent) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col w-full items-center gap-[10px] bg-componentPrimary lg:bg-transparent self-stretch">
      <div className="flex items-start gap-8 self-stretch ">
        <div className="lg:flex hidden flex-col pt-3 rounded-s-xl opacity-70 w-[300px] gap-5 fixed">
          <div className="flex gap-[10px] pl-3 items-center font-bold">
            <HiCalendar className="w-5 h-5" /> Event Space Details
          </div>
          <div className="flex flex-col gap-3">
            {eventDetailsList.map((eventDetailsItem, index) => (
              <div key={index} className=" rounded-xl flex flex-col gap-1 pl-3 py-2 hover:cursor-pointer w-[230px] hover:bg-[#292929] duration-200" onClick={() => scrollToRef(sectionRefs[index])}>
                <div className="text-lg font-semibold opacity-90">{eventDetailsItem.name}</div>
                <div className="text-xs font-light opacity-60">{eventDetailsItem.description}</div>
              </div>
            ))}
          </div>
          {/* <hr className="bg-gray-500 w-60" /> */}
        </div>
        <div className="flex flex-col gap-5 items-start lg:ml-[300px] w-full">
          <div className="mx-5 mt-[-60px] md:mt-0 p-2">
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary "
              size="lg"
              leftIcon={HiArrowLeft}
              onClick={goBackToPreviousPage}
            >
              Back
            </Button>
          </div>
          <EventSpaceForm eventSpace={eventSpace} detailsUpdated={detailsUpdated} setDetailsUpdated={setDetailsUpdated} />
          {/* <div className="w-full" ref={sectionRefs[4]}>
            <EventLocation />
          </div> */}
          <div className="flex flex-col w-full md:flex-row gap-5 mb-5">
            <Button
              variant="primaryGreen"
              leftIcon={HiArrowCircleUp}
              size="lg"
              className="justify-center rounded-3xl text-base font-inter font-bold text-[#d4ffb5] w-full"
              onClick={() => handleButtonClick(SpaceDashboardCardType.PublishEvent)}
            >
              Publish Event
            </Button>
            {/* <Button className="w-40 flex justify-center rounded-3xl text-xl bg-[#EB5757]/20">Delete Event</Button> */}
            <Dialog>
              <DialogTrigger asChild>
                <Button aria-disabled size="lg" leftIcon={HiXCircle} className="w-full  justify-center rounded-3xl text-base font-inter font-bold" variant="red" type="button" disabled={isDeleting}>
                  Delete Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] h-auto rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Delete space?</DialogTitle>
                  <DialogDescription className="text-sm font-bold">Are you sure you want to delete this event space?</DialogDescription>
                  <DialogFooter className="pt-5">
                    <div className="flex items-center">
                      {/* <button className="py-2.5 px-3.5 flex items-center gap-1 rounded-[20px] bg-white/20">
                      <span>Cancel</span>
                    </button> */}
                      <button onClick={handleDeleteEventSpace} className="flex w-full justify-center py-2.5 px-3.5 items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20">
                        <HiXCircle />
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Dialog open={detailsUpdated} onOpenChange={(open) => setDialog(open)}>
          <DialogContent className="sm:max-w-[525px] h-auto rounded-2xl">
            <DialogHeader className="my-2">
              <DialogTitle>Event Details Saved</DialogTitle>
            </DialogHeader>
            <div className="text-sm font-light text-white/70 my-2">You can edit event space details in your dashboard.</div>
            {/* <div className="font-normal text-white my-2">Now go to Tracks and start building your schedules</div> */}
            <DialogFooter>
              <Link href={`/dashboard/events/space/dashboard?event_space_id=${event_space_id}`}>
                <Button variant="primary" className="bg-[#67DBFF]/20 text-[#67DBFF] text-lg w-full justify-center rounded-full" leftIcon={HiArrowRight}>
                  Go to Dashboard
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <EventLocation /> */}
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
                  // disabled={isUpdatingStatus}
                >
                  {dialogContent?.buttonLabel}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default EventSpaceDetails;
