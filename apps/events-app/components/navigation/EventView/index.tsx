import Button from '@/components/ui/buttons/Button';
import { eventViewRoutes } from '@/constant/routes';
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdOutlineModeEdit } from 'react-icons/md';
import { HiArrowLeft, HiOutlineMenuAlt1 } from 'react-icons/hi';

import React, { useEffect, useState } from 'react';
import { ArrowCircleLeft } from '@/components/ui/icons';
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { BiPlusCircle } from 'react-icons/bi';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddScheduleForm from '@/components/commons/AddScheduleForm';

export default function EventViewNavigation() {
  const { isAuthenticated, user, profile } = useGlobalContext();
  const { eventSpace } = useEventDetails();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { event_space_id } = router.query;

  if (!event_space_id) {
    router.push('/404');
  }
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const routes = eventViewRoutes;

  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const handleEditEvent = () => {
    router.push(`/dashboard/events/space/details?event_space_id=${event_space_id}`);
  };

  const handleEditSchedules = () => {
    router.push(`/dashboard/events/space/details?event_space_id=${event_space_id}`);
  };

  const handleBackToEvents = () => {
    router.push('/dashboard/home');
  };

  const updateIsLoading = (newState: boolean) => {
    setIsLoading(newState);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="z-50 top-4 left-3 fixed">
        <button onClick={handleClick} className="block md:hidden " aria-label="Open Dashboard Menu">
          <HiOutlineMenuAlt1 size={28} />
        </button>
      </div>
      {/* Overlay that can close the dashboard menu */}
      <div className={`md:hidden fixed inset-0 bg-black/10 z-10 ${dashboardOpen ? 'block' : 'hidden'}`} onClick={handleClick}></div>
      <nav
        className={`z-50 lg:w-[250px] w-full fixed flex flex-col lg:h-screen border-r border-r-gray-800 bg-pagePrimary lg:py-10 lg:pl-10 md:text-base text-[12px] transition-transform duration-300 ${dashboardOpen && "open"
          }`}
      >
        <div className="flex-1 flex flex-col ml-5 lg:ml-0 gap-5 max-w-max">
          <div className="lg:mt-10 flex-1">
            <Button size="lg" variant="quiet-SM" className="lg:pb-8 md:pb-4 sm:pb-2 opacity-80" leftIcon={ArrowCircleLeft} onClick={handleBackToEvents}>
               <span className="text-sm opacity-70">Back to Events</span>
            </Button>
            <div className="flex flex-col gap-3.5 lg:pb-10 md:pb-1">
              <span className="font-normal text-sm md:hidden lg:contents sm:hidden">Navigate Event</span>
              <ul className="space-y-5 lg:block flex gap-2.5 lg:gap-0 items-end overflow-x-auto">
                {routes.map((route, index) => (route.name &&
                  <li
                    key={index}
                    className={`flex items-center font-medium text-sm cursor-pointer space-x-2 py-2 px-3 lg:rounded-xl md:hover:border-b duration-200 ${router.pathname.includes(route.path) ? "bg-white/10" : "opacity-60 hover:bg-white/20"
                      }`}
                  >
                    {route.icon && <route.icon size={25} />}
                    <Link href={`${route.path}?event_space_id=${event_space_id}`} >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {isAuthenticated ?
              (router.pathname.includes("dashboard/eventview/about") && eventSpace?.creator_id === user.id && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="blue"
                      size="lg"
                      className="rounded-full block sm:hidden  sm:w-full lg:w-fit justify-center"
                      leftIcon={BiPlusCircle}
                    >
                      Add a Session
                    </Button>
                  </DialogTrigger>
                  {
                    <DialogContent className="md:w-3/5 md:h-3/5 overflow-x-auto sm:w-3/4">
                      <AddScheduleForm
                        title={"Add"}
                        isQuickAccess={true}
                        updateIsLoading={updateIsLoading}
                        event_space_id={event_space_id as string}
                      />
                    </DialogContent>
                  }
                </Dialog>
              )) : (<></>)}
            {isAuthenticated ? (router.pathname.includes("dashboard/eventview/tracks") && eventSpace?.creator_id === user.id && (
              <div className="flex-col gap-3 rounded-md p-2 bg-black font-bold sm:hidden lg:flex">
                <h2>Organizer</h2>
                <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditEvent}>
                  <MdOutlineModeEdit />
                  <span>Edit Event</span>
                </Button>
              </div>
            )) : (<></>)}
            {isAuthenticated ? (router.pathname.includes("dashboard/eventview/allschedules") && eventSpace?.creator_id === user.id && (
              <div className="flex-col gap-3 rounded-md p-2 bg-black font-bold sm:hidden lg:flex">
                <h2>Organizer</h2>
                <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditSchedules}>
                  <MdOutlineModeEdit />
                  <span>Edit Sessions</span>
                </Button>
              </div>
            )) : (<></>)}
          </div>
        </div>
      </nav>
      {/* </div> */}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);
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
