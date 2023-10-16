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

export default function EventViewNavigation() {
  const { isAuthenticated, user } = useGlobalContext();
  const { eventSpace } = useEventDetails();
  // console.log("EventSpace in Subheader", eventSpace.creator_id, user);
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

  const handleEventRouteClick = (path: string) => {
    router.push({
      pathname: path,
      query: { event_space_id },
    });
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
            <Button size="lg" variant="quiet-SM" className="lg:pb-10 md:pb-2 sm:pb-1 opacity-80" leftIcon={ArrowCircleLeft} onClick={handleBackToEvents}>
              Back to Events
            </Button>
            <div className="flex flex-col gap-3.5 lg:pb-10 md:pb-1">
              <span className="font-semibold md:hidden lg:contents sm:hidden">Navigate Event</span>
              <ul className="space-y-3 lg:block flex gap-2.5 lg:gap-0 items-end overflow-x-auto">
                {routes.map((route, index) => (route.name &&
                  <li
                    key={index}
                    className={`flex items-center font-bold space-x-2 py-1 px-3 opacity-70 lg:rounded-xl hover:bg-white/20 md:hover:border-b duration-200 ${router.pathname.includes(route.path)
                      }`}
                  >
                    {route.icon && <route.icon size={30} />}
                    <Link href={`${route.path}?event_space_id=${event_space_id}`} >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {router.pathname.includes("dashboard/eventview/tracks") && eventSpace?.creator_id === user.id && (
              <div className="flex-col gap-3 rounded-md p-2 bg-black font-bold sm:hidden lg:flex">
                <h2>Organizer</h2>
                <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditEvent}>
                  <MdOutlineModeEdit />
                  <span>Edit Event</span>
                </Button>
              </div>
            )}
            {router.pathname.includes("dashboard/eventview/allschedules") && eventSpace?.creator_id === user.id && (
              <div className="flex-col gap-3 rounded-md p-2 bg-black font-bold sm:hidden lg:flex">
                <h2>Organizer</h2>
                <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditSchedules}>
                  <MdOutlineModeEdit />
                  <span>Edit Schedules</span>
                </Button>
              </div>
            )}
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