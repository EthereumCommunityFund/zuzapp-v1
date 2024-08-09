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
import { arrayFromLength } from '@/lib/helper';
import { HomePageTemplateSkeleton } from '../commons/HomePageTemplateSkeleton';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { updateUsername } from '@/controllers/profile.controllers';
import zucity from '@/public/images/new_banner.png';
import banner2 from '@/public/images/banner2.png';
import CustomCarousel from '../ui/CustomCarousel';
import { formatDate, truncateString } from '@/utils';
import { toast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { HostUrls } from '@/constant/hostUrls';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import slideData from '@/constant/slidedata';
import { useWallet } from '@/context/WalletContext';
import { CreateEvent } from './events/CreateEvent';
import { usePublishedEvents } from '@/hooks/usePublishedEvents';
import axios from 'axios';

export default function HomePageTemplate() {
  return (
    <div className="md:w-5/6 w-[95%] mx-auto">
      <div className="lg:mt-10 mt-48 relative w-full border border-white/10 rounded-2xl">
        <div className="bg-[#184D46] text-white flex justify-between items-center p-4 rounded-t-2xl"
            style={{ height: '43px' }}>
          <div className="flex items-center gap-4">
            <span className="material-icons">info_outline</span>
            <span>Are you attending ZuVillage in Georgia?</span>
          </div>
          <a href="https://zuzalu-city-ten.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="bg-[#252828] hover:bg-[#1e1e1e] text-white font-bold py-2 px-4 rounded">
            Join the Alpha
          </a>
        </div>
        <div style={{ height: '20px' }}></div>
        <HomePageBanner />
      </div>
      <div className="mt-10 pb-5">
        <Label className="text-2xl md:text-4xl">Events</Label>
        <CreateEvent btnTitle={'Add Event'} className="w-40" />
        <PublishedEventSpaces />
      </div>
      {/*<TestEventSpace />*/}
      <FirstUserLogin />
    </div>
  );
}

export const TestEventSpace = () => {
  const router = useRouter();
  const [testEventSpace, setTestEventSpace] = useState<EventSpaceDetailsType>();
  const [hostUrl, setHostUrl] = useState<string>();
  const testEventId = `7bce1a05-1b78-497d-8070-29ff7cd695ed`;

  const fetchTestEventSpace = async (id: string) => {
    const testSpace: EventSpaceDetailsType = await fetchEventSpaceById(id);
    setTestEventSpace(testSpace);
  };
  const handleButtonClick = async (event_space_id: string) => {
    router.push({
      pathname: `/dashboard/eventview/about/`, // Update with your actual route
      query: { event_space_id: event_space_id },
    });
  };

  useEffect(() => {
    const hostUrl = window.location.origin;
    setHostUrl(hostUrl);
    fetchTestEventSpace(testEventId);
  }, []);

  return (
    <>
      {hostUrl !== HostUrls.PROD && testEventSpace && (
        <div>
          <Label className="text-xl md:text-4xl">Test Events</Label>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-2xl px-2 md:px-2 py-3 mt-5 duration-200">
            <div className="flex flex-col md:flex-row md:space-x-3 md:items-center">
              <div>
                <img
                  src={testEventSpace.image_url ? testEventSpace.image_url : `/images/black-img.png`}
                  className="rounded-xl w-full md:max-w-[180px] md:max-h-[180px]"
                  alt="Event"
                  width={150}
                  height={150}
                />
              </div>
              <div className="space-y-2 space-x-0 mt-2 md:mt-0">
                <h4 className="text-2xl font-semibold">{testEventSpace.name}</h4>
                <h2 className="text-base font-normal opacity-70 font-inter">{truncateString(testEventSpace.tagline, 40)}</h2>
                <div className="flex gap-2 flex-wrap">
                  <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                    <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {formatDate(testEventSpace?.start_date)} - {formatDate(testEventSpace?.end_date)}
                  </p>
                  {/* <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                    <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                  </p> */}
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-0 lg:mr-2">
              <Button
                size="lg"
                className="rounded-full w-full flex items-center justify-center font-semibold md:w-auto bg-white/10"
                onClick={() => testEventSpace.id && handleButtonClick(testEventSpace.id)}
              >
                View Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PublishedEventSpaces = () => {
  const router = useRouter();
  const { eventSpaces, isLoading, isError } = usePublishedEvents();
  const handleButtonClick = async (event_space_id: string) => {
    router.push({
      pathname: `/dashboard/eventview/about/`, // Update with your actual route
      query: { event_space_id: event_space_id },
    });
  };
  if (isError) {
    toast({
      title: 'Error',
      description: 'Error loading Published Events',
      variant: 'destructive',
    });
  }
  return (
    <>
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
                  <Image
                    src={event.image_url || `/images/black-img.png`}
                    layout="responsive"
                    objectFit="contain"
                    className="rounded-xl w-full md:max-w-[180px] md:max-h-[130px] md:min-w-[180px]"
                    alt="Event"
                    width={150}
                    height={150}
                    quality={50}
                    priority={true}
                  />
                </div>
                <div className="space-y-2 space-x-0 mt-2 md:mt-0">
                  <h4 className="text-2xl font-semibold">{event.name}</h4>
                  <h2 className="text-base font-normal opacity-70 ">{truncateString(event.tagline, 52)}</h2>
                  <div className="flex gap-2 flex-wrap">
                    <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                      <BsCalendar2Fill className="mr-2 text-sm md:text-base" /> {formatDate(event?.start_date)} - {formatDate(event?.end_date)}
                    </p>
                    {/* <p className="flex items-center text-xs text-white/60 bg-white/10 rounded-xl py-2 px-3 w-fit font-normal">
                      <HiLockClosed className="mr-2 text-sm md:text-base" /> Resident Only
                    </p> */}
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
    </>
  );
};

export const HomePageBanner = () => {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [zucity.src, zucity.src];
  const { isAuthenticated, user } = useGlobalContext();

  return (
    <>
      <CustomCarousel slides={slides as unknown as string[]} curr={currentSlide} setCurr={setCurrentSlide}>
        <div className="absolute top-0 left-0 px-4 py-10 sm:px-8 md:px-14 max-w-[650px] ml-2 sm:ml-4 mt-4 sm:mt-8">
          <h1 className="font-bold font-inter text-left text-2xl sm:text-3xl md:text-5xl mb-3 sm:mb-5">{slideData[currentSlide].title}</h1>
          <p className="text-left mb-4 max-w-[650px] text-gray-200 text-md sm:text-md">{slideData[currentSlide].description}</p>
          {slideData[currentSlide].ctas.map((cta, index) => {
            if (cta.ctaLink === '/dashboard/events/create' && !isAuthenticated) {
              return (
                <SignInDialog key={index}>
                  <Button size="lg" variant="primaryGreen" className={`${cta.twClassNames} rounded-full w-full slider_md:w-auto my-2.5 text-xl justify-center text-white font-inter font-semibold`}>
                    {cta.ctaText}
                  </Button>
                </SignInDialog>
              );
            } else {
              return (
                <Button
                  key={index}
                  size="lg"
                  variant="primaryGreen"
                  className={`${cta.twClassNames} rounded-full w-full slider_md:w-auto my-2.5 text-xl justify-center text-white font-inter font-semibold`}
                  onClick={() => {
                    if (cta.ctaLink === '/dashboard/events/create' && isAuthenticated) {
                      router.push(cta.ctaLink);
                    } else {
                      window.open(cta.ctaLink, '_blank');
                    }
                  }}
                >
                  {cta.ctaText}
                </Button>
              );
            }
          })}
        </div>
      </CustomCarousel>
    </>
  );
};

type SignInDialogProps = {
  children: React.ReactNode;
};

export const SignInDialog = ({ children }: SignInDialogProps) => {
  const { signIn } = useUserPassportContext();
  const { connectToMetamask } = useWallet();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-300 font-inter font-bold">Need to Sign in!</DialogTitle>
            <DialogDescription className="text-sm font-bold pt-5 text-white">Sign in to Create Events and Access more Features</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-5">
            <Button variant="primaryGreen" className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-3 h-full bg-dark text-sm md:text-base" onClick={signIn}>
              <Image src="/images/zaluza blackandwhite.png" width={20} height={20} alt="Passport" className="mr-2" />
              Connect Passport
            </Button>
            <Button variant="primaryGreen" className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-3 h-full bg-dark text-sm md:text-base" onClick={connectToMetamask}>
              Connect Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FirstUserLogin = () => {
  const { profile } = useGlobalContext();
  const [userName, setUsername] = useState<string>('');
  const router = useRouter();
  const { firstLogin } = router.query;

  interface DialogContent {
    title: string;
    description: string;
    buttonLabel: string;
    buttonAction?: () => void;
  }

  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: "Welcome to Zuzalu, let's get your name!",
    description: 'Type in a username. Does not have to be your real name. You can also change your username later',
    buttonLabel: 'Continue',
  });

  const handleDialogButton = async () => {
    try {
      const res = await updateUsername({ username: userName });
      setDialogContent({
        title: `Welcome, ${userName}`,
        description: 'Now, head to explore Zuzalu & community events!',
        buttonLabel: 'Complete',
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
        toast({
          title: 'Error',
          description: 'User name already exists, please choose another one',
          variant: 'destructive',
        });
      }
      console.error('Error updating username', error);
    }
  };

  return (
    <>
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
                onClick={dialogContent.buttonLabel === 'Continue' ? handleDialogButton : () => router.reload()}
              >
                {dialogContent?.buttonLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
