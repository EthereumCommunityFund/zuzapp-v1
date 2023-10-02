import { useUserPassportContext } from '@/context/PassportContext';
import Button from '../ui/buttons/Button';
import Image from 'next/image';
import Link from 'next/link';
import { BsCalendar2Fill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { useGlobalContext } from '@/context/GlobalContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useRouter } from 'next/router';
import { EventSpaceDetailsType, EventTypes } from '@/types';
import { useQuery } from 'react-query';
import { fetchPublishedEventSpaces } from '@/services/fetchPublishedEvents';
import { Loader } from '../ui/Loader';
import { arrayFromLength } from '@/lib/helper';
import { EventTemplateSkeleton } from '../commons/EventTemplateSkeleton';
import { HomePageTemplateSkeleton } from '../commons/HomePageTemplateSkeleton';
import { useEventSpace, useEventSpaces } from '@/context/EventSpaceContext';

export const sampleEvents = [
  {
    type: EventTypes.InPerson,
    name: 'Zu Connect',
    description: 'A Popup Village of Innovation in the Heart of Istanbul',
    date: 'October 8 - October 20',
  },
  {
    type: EventTypes.Online,
    name: 'Zuzalu Meetings',
    description: 'Here we post our Town Halls and other events!',
    date: 'Recuring',
  },
];

export default function HomePageTemplate() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();

  const { eventSpaceList, setEventSpaceList } = useEventSpace();

  const handleButtonClick = async (eventId: string) => {
    router.push({
      pathname: `/dashboard/eventview`, // Update with your actual route
      query: { eventId },
    });
  };

  const {
    data: eventSpaces,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType[], Error>(
    ['eventSpaces'], // Query key
    () => fetchPublishedEventSpaces(),
    {
      onSuccess: (data) => {
        console.log('HomePageTemplate Event Spaces:', data);
        setEventSpaceList(data);
      },
    }
  );

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  return (
    <div className="w-5/6 mx-auto ">
      <div
        className="w-full border border-white/10 rounded-2xl mt-5"
        style={{
          backgroundImage: "url('/images/zuconnectbanner.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="px-10 py-10 max-w-[650px]">
          <h1 className="font-bold font-inter text-3xl md:text-5xl mb-5">Discover & Experience Extraordinary Events</h1>
          {isAuthenticated ? (
            <Link href="/dashboard/events/create">
              <Button size="lg" variant={'primaryGreen'} className="rounded-full text-xl text-white bg-[#769270] hover:bg-[#92B68B] font-inter font-semibold">
                Create an Event
              </Button>
            </Link>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'primaryGreen'} size={'lg'} className="rounded-full">
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Need to Sign In!</DialogTitle>
                  <DialogDescription className="text-sm font-bold">You need to be signed to do that</DialogDescription>
                  <DialogFooter className="pt-5">
                    <Button variant="ghost" className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base" onClick={signIn}>
                      <Image src="/images/zaluza blackandwhite.png" width={20} height={20} alt="Passport" className="mr-2" />
                      Connect Passport
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-xl md:text-4xl">Zuzalu Events</h3>
        <div className="mt-3">
          {isLoading && (
            <div>
              {arrayFromLength(1).map((_, i) => (
                <HomePageTemplateSkeleton key={i} />
              ))}
            </div>
          )}
          {eventSpaces &&
            eventSpaces?.map((event, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-lg px-3 md:px-5 py-3 mt-5 duration-200"
              >
                <div className="flex flex-col md:flex-row space-x-3 md:items-center">
                  <div>
                    <Image src={event.image_url ? event.image_url : `/images/black-img.png`} alt="Event" width={150} height={120} />
                  </div>
                  <div className="space-y-2 mt-2 md:mt-0">
                    <h4 className="text-2xl font-bold">{event.name}</h4>
                    <h2 className="text-base font-semibold opacity-70 font-inter">{event.tagline}</h2>
                    <div className="flex space-x-2">
                      <p className="flex items-center text-xs md:text-sm text-white/60 bg-white/10 rounded-full py-2 px-3 w-fit font-semibold">
                        <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {formatDate(event?.start_date)} - {formatDate(event?.end_date)}
                      </p>
                      <p className="flex items-center text-xs md:text-sm text-white/60 bg-white/10 rounded-full py-2 px-3 w-fit font-semibold">
                        <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <Button size="lg" variant={'primaryGreen'} className="rounded-full" onClick={() => event.id && handleButtonClick(event.id)}>
                    View Event
                  </Button>
                </div>
              </div>
            ))}
          {/* {sampleEvents.map((event, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-lg px-3 md:px-5 py-3 mt-5 duration-200"
            >
              <div className="flex flex-col md:flex-row space-x-3 md:items-center">
                <div>
                  <Image src="/images/black-img.png" alt="Event" width={150} height={120} />
                </div>
                <div className="space-y-2 mt-2 md:mt-0">
                  <h4 className="text-2xl font-bold">{event.name}</h4>
                  <h2 className="text-base font-semibold opacity-70 font-inter">{event.description}</h2>
                  <div className="flex space-x-2">
                    <p className="flex items-center text-xs md:text-sm text-white/60 bg-white/10 rounded-full py-2 px-3 w-fit font-semibold">
                      <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {event.date}
                    </p>
                    <p className="flex items-center text-xs md:text-sm text-white/60 bg-white/10 rounded-full py-2 px-3 w-fit font-semibold">
                      <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                <Button size="lg" variant={'primaryGreen'} className="rounded-full" onClick={() => event.type && handleButtonClick(event.type)}>
                  View Event
                </Button>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
