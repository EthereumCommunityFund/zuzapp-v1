import { useUserPassportContext } from '@/context/PassportContext';
import Button from '../ui/buttons/Button';
import Image from 'next/image';
import Link from 'next/link';
import { BsCalendar2Fill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { useGlobalContext } from '@/context/GlobalContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export const sampleEvents = [
  {
    name: 'Zu Connect',
    description: 'A Popup Village of Innovation in the Heart of Istanbul',
    date: 'October 8 - October 20',
  },
  {
    name: 'Zuzalu Town Halls',
    description: 'Here we post our Town Halls and other events!',
    date: 'Recuring',
  },
];

export default function HomePageTemplate() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();

  return (
    <div className="w-4/5 mx-auto ">
      <div
        className="w-full border border-white/10 rounded-2xl mt-5"
        style={{
          backgroundImage: "url('/images/home-page-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="px-10 py-10 max-w-[650px]">
          <h2 className="font-bold font-inter text-xl md:text-5xl mb-5">Discover & Experience Extraordinary Events</h2>
          {isAuthenticated ? (
            <Link href="/dashboard/events/create">
              <Button size='lg' variant={'primary'} className="rounded-full text-xl text-white bg-[#769270] hover:bg-[#92B68B] font-inter font-semibold">
                Create an Event
              </Button>
            </Link>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'primary'} className="rounded-full">
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
        <h3 className="text-2xl md:text-4xl">Zuzalu Events</h3>
        <div>
          {sampleEvents.map((event, index) => (
            <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center border border-white/10 bg-componentPrimary hover:bg-itemHover rounded-lg px-3 md:px-5 py-3 mt-5 duration-200">
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
                <Button size='lg' variant={'primary'} className="rounded-full">
                  View Event
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
