import { useRouter } from 'next/router';
import EventSpaceDashboardCard from '@/components/eventspace/EventSpaceDashboardCard';
import { spaceDashboardCards } from '@/constant/spacedashboardcards';
import { SpaceDashboardType } from '@/types';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/buttons/Button';
import { HiCalendar } from 'react-icons/hi';
import { RiSettings5Fill } from 'react-icons/ri';
import { SpaceDashboardCardType } from '@/types';
import { eventRoutes } from '@/constant/routes';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { useEventSpace } from '@/context/EventSpaceContext';
import { updateEventSpaceStatus } from '@/controllers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { useState } from 'react';

interface IProps {
  type: SpaceDashboardType;
}
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
  const { eventSpace } = useEventSpace();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  console.log(eventSpace, 'myeventspace');

  const handlePublishEvent = async () => {
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }

    const { name, eventspacelocation, tracks, schedules } = eventSpace;

    if (!name || !eventspacelocation || eventspacelocation.length === 0 || !tracks || tracks.length === 0 || !schedules || schedules.length === 0) {
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
      // setShowDialog(true);
    } catch (error) {
      console.error('Failed to publish event space', error);
    }
  };

  const handleButtonClick = (type: SpaceDashboardCardType) => {
    if (type === SpaceDashboardCardType.PublishEvent) {
      handlePublishEvent();
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

  return (
    <div className="flex flex-col flex-1 items-center gap-[10px] self-stretch w-full ">
      <div className="flex flex-col items-center gap-5 flex-1 w-full">
        {
          <div className="xl:w-4/5 w-full md:w-[90%] px-2.5">
            {isFirst === SpaceDashboardType.New.toString() &&
              <>
                <Dialog open>
                  <DialogContent className="sm:max-w-[425px] h-1/3 md:max-w-none w-[600px]">
                    <DialogHeader>
                      <DialogTitle className='text-2xl'>Welcome to your Event Space</DialogTitle>
                      <DialogDescription className="text-xl font-bold">First, you'll need to enter the details of your main event.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-5 self-end text-2xl">
                      <Button variant='primaryGreen' className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base" leftIcon={HiCalendar} onClick={() => handleButtonClick(SpaceDashboardCardType.EnterEventDetails)}>
                        Enter Event Details
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            }
            {spaceDashboardCards.map((item, index) => (
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
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
