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
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { ArrowCircleLeft, ArrowCircleRight, ArrowLeft } from '../ui/icons';
import { updateUsername } from '@/controllers/profile.controllers';
import banner1 from '@/public/images/zuconnectbanner.png';
import banner2 from '@/public/images/playbook.png';
import CustomCarousel from '../ui/CustomCarousel';
import { truncateString } from '@/utils';
import { error } from 'console';
import { toast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { HostUrls } from '@/constant/hostUrls';
import { fetchEventSpace } from '@/controllers';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';

interface DialogContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonAction?: () => void;
}

export default function HomePageTemplate() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();
  const [userName, setUsername] = useState<string>('');
  const { firstLogin } = router.query;
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: "Welcome to Zuzalu, let's get your name!",
    description: 'Type in a username. Does not have to be your real name. You can also change your username later',
    buttonLabel: 'Continue',
  });

  const { eventSpaceList, setEventSpaceList } = useEventSpace();
  const { profile } = useGlobalContext();
  const handleButtonClick = async (event_space_id: string) => {
    router.push({
      pathname: `/dashboard/eventview/about/`, // Update with your actual route
      query: { event_space_id: event_space_id },
    });
  };
  const testEventId = `7aa90b9a-456e-4852-bfad-ed247513b28f`;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventSpaces, setEventSpaces] = useState<EventSpaceDetailsType[]>();
  const [testEventSpace, setTestEventSpace] = useState<EventSpaceDetailsType>();
  const [hostUrl, setHostUrl] = useState<string>();

  // const {
  //   data: eventSpaces,
  //   isLoading,
  //   isError,
  // } = useQuery<EventSpaceDetailsType[], Error>(
  //   ['publishedEventSpaces'], // Query key
  //   () => fetchPublishedEventSpaces({ page: 1, limit: 10 }),
  //   {
  //     onSuccess: (data) => {
  //       setEventSpaceList(data);
  //     },
  //     onError: (error) => {
  //       console.log(error, 'error loading events');
  //       toast({
  //         title: 'Error',
  //         description: 'Error loading Published Events',
  //         variant: 'destructive',
  //       });
  //     },
  //   }
  // );

  const fetchEventSpaces = async (id: string) => {
    const response: EventSpaceDetailsType[] = await fetchPublishedEventSpaces({ page: 1, limit: 10 });
    const testSpace: EventSpaceDetailsType = await fetchEventSpaceById(id);

    setTestEventSpace(testSpace);
    setEventSpaceList(response);
    setEventSpaces(response);
  }

  useEffect(() => {
    const hostUrl = window.location.origin;
    setHostUrl(hostUrl);
    fetchEventSpaces(testEventId);
    setIsLoading(false);
  }, []);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
  const slideData = [
    {
      title: 'ZuConnect in Istanbul',
      description:
        'Join us for a two-week popup village where the leading innovators in crypto, AI, governance, decentralized science, and culture unite in the heart of Istanbul to co-work, break downsiloes, and have fun',
      ctas: [
        {
          ctaText: 'Apply to Waitlist',
          ctaLink: 'https://app.tripsha.com/trip/64ff3a6eb4b6950008dee4f8/book',
          action: 'apply',
          twClassNames: 'bg-[#769270] hover:bg-[#92B68B]',
        },
        {
          ctaText: 'About ZuConnect',
          ctaLink: 'https://app.skiff.com/docs/686afeda-6dd6-4e45-bd9c-025da5ab7af2#/APhdwcKl0ybzpGeElvYgLL3+IXTf+8vm5OMl+s/1P0=',
          action: 'about',
          twClassNames: 'bg-white/20 hover:bg-white/30',
        },
      ],
    },
    {
      title: 'The Zuzalu Playbook',
      description:
        'Looking to start your own Zuzalu-style community event? We have developed a comprehensive playbook that compiles our extensive experience and expertise. A guide for any community looking to organize a successful event quickly and efficiently.',
      ctas: [
        {
          ctaText: 'View the Playbook',
          ctaLink: 'https://zuzalu.notion.site/3e893df2a248496bb30720fc1518c3c6?v=b0bc5b586a574272928d9a1fe0ded088',
          action: 'view',
          twClassNames: 'bg-[#769270] hover:bg-[#92B68B]',
        },
      ],
    },
  ];

  const handleDialogButton = async () => {
    try {
      const res = await updateUsername({ username: userName });
      setDialogContent({
        title: `Welcome, ${userName}`,
        description: 'Now, head to explore Zuzalu & community events!',
        buttonLabel: 'Complete',
      });
    } catch (error) {
      console.error('Error updating username', error);
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [banner1.src, banner2.src];

  return (
    <div className="md:w-5/6 w-[95%] mx-auto">
      <div className="lg:mt-10 mt-48 relative w-full border border-white/10 rounded-2xl">
        <div className="">
          <CustomCarousel slides={slides as unknown as string[]} curr={currentSlide} setCurr={setCurrentSlide}>
            <div className="absolute top-0 left-0 px-8 slider_md:px-14 py-14 max-w-[650px] ml-4 mt-4">
              <h1 className="font-bold font-inter text-left text-3xl md:text-5xl mb-5">{slideData[currentSlide].title}</h1>
              <p className="text-left mb-4 max-w-[650px]font-inter text-gray-200 text-md">{slideData[currentSlide].description}</p>
              {isAuthenticated ? (
                <div className="md:flex gap-2 mb-3 items-center">
                  {slideData[currentSlide].ctas.map((cta, index) => (
                    <Link key={index} href={cta.ctaLink} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="primaryGreen" className={`${cta.twClassNames} rounded-full w-full slider_md:w-auto my-1.5 text-xl justify-center text-white font-inter font-semibold`}>
                        {cta.ctaText}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="md:flex gap-2 items-center">
                      {slideData[currentSlide].ctas.map((cta, index) => (
                        <Link key={index} href={cta.ctaLink} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="lg"
                            variant="primaryGreen"
                            className={`${cta.twClassNames} rounded-full w-full slider_md:w-auto my-2.5 text-xl justify-center text-white font-inter font-semibold`}
                          >
                            {cta.ctaText}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-gray-300 font-inter font-bold">Need to Sign in!</DialogTitle>
                      <DialogDescription className="text-sm font-bold pt-5 text-white">Sign in to Create Events and Access more Features</DialogDescription>
                      <DialogFooter className="pt-5">
                        <Button variant="ghost" className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-3 h-full bg-dark text-sm md:text-base" onClick={signIn}>
                          <Image src="/images/zaluza blackandwhite.png" width={20} height={20} alt="Passport" className="mr-2" />
                          Connect Passport
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CustomCarousel>
        </div>
      </div>
      <div className="mt-10 pb-5">
        <Label className="text-xl md:text-4xl">Events</Label>
        <div className="mt-3">
          {isLoading && (
            <div>
              {arrayFromLength(1).map((_, i) => (
                <HomePageTemplateSkeleton key={i} />
              ))}
            </div>
          )}
          {eventSpaces &&
            eventSpaces.map((event, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-2xl px-2 md:px-2 py-3 mt-5 duration-200"
              >
                <div className="flex flex-col md:flex-row md:space-x-3 md:items-center">
                  <div>
                    <img src={event.image_url ? event.image_url : `/images/black-img.png`} className="rounded-xl w-full md:max-w-[180px] md:max-h-[180px]" alt="Event" width={150} height={150} />
                  </div>
                  <div className="space-y-2 space-x-0 mt-2 md:mt-0">
                    <h4 className="text-2xl font-semibold">{event.name}</h4>
                    <h2 className="text-base font-normal opacity-70 font-inter">{truncateString(event.tagline, 40)}</h2>
                    <div className="flex gap-2 flex-wrap">
                      <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                        <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {formatDate(event?.start_date)} - {formatDate(event?.end_date)}
                      </p>
                      <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                        <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 lg:mr-2">
                  <Button size="lg" className="rounded-full w-full flex items-center justify-center font-semibold md:w-auto bg-white/10" onClick={() => event.id && handleButtonClick(event.id)}>
                    View Event
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {hostUrl !== HostUrls.PROD && testEventSpace &&
        <div>
          <Label className="text-xl md:text-4xl">Test Events</Label>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-2xl px-2 md:px-2 py-3 mt-5 duration-200">
            <div className="flex flex-col md:flex-row md:space-x-3 md:items-center">
              <div>
                <img src={testEventSpace.image_url ? testEventSpace.image_url : `/images/black-img.png`} className="rounded-xl w-full md:max-w-[180px] md:max-h-[180px]" alt="Event" width={150} height={150} />
              </div>
              <div className="space-y-2 space-x-0 mt-2 md:mt-0">
                <h4 className="text-2xl font-semibold">{testEventSpace.name}</h4>
                <h2 className="text-base font-normal opacity-70 font-inter">{truncateString(testEventSpace.tagline, 40)}</h2>
                <div className="flex gap-2 flex-wrap">
                  <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                    <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {formatDate(testEventSpace?.start_date)} - {formatDate(testEventSpace?.end_date)}
                  </p>
                  <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                    <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-0 lg:mr-2">
              <Button size="lg" className="rounded-full w-full flex items-center justify-center font-semibold md:w-auto bg-white/10" onClick={() => testEventSpace.id && handleButtonClick(testEventSpace.id)}>
                View Event
              </Button>
            </div>
          </div>
        </div>
      }
      {profile && firstLogin && !profile.username && (
        <Dialog open={true}>
          <DialogContent className="w-96 sm:max-w-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-4">{dialogContent?.title}</DialogTitle>
              <DialogDescription className="text-md font-normal text-gray-400">{dialogContent?.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-5">
              {dialogContent.buttonLabel === 'Continue' && (
                <Input placeholder="Type your username" className="text-white py-2 px-3 rounded border border-gray-600" value={userName} onChange={(e) => setUsername(e.target.value)} />
              )}
              <Button
                variant={`${userName.length ? `strongerGreen` : `ghost`}`}
                className="w-full flex items-center justify-center rounded-3xl py-2 h-full bg-dark text-lg md:text-base text-white"
                onClick={dialogContent.buttonLabel === 'Continue' ? handleDialogButton : () => router.push('/dashboard/home')}
              >
                {dialogContent?.buttonLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
