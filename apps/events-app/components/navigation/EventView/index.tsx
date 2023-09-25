import Button from "@/components/ui/buttons/Button";
import { eventViewRoutes } from "@/constant/routes";
import { useGlobalContext } from "@/context/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineModeEdit } from "react-icons/md";
import { HiArrowLeft, HiOutlineMenuAlt1 } from "react-icons/hi";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import React from "react";

export default function EventViewNavigation() {
  const [dashboardOpen, setDashboardOpen] = React.useState(true);
  const router = useRouter();
  const routes = eventViewRoutes;

  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const handleEditEvent = () => {
    router.push("/dashboard/eventview/");
  };

  const handleEditSchedules = () => {
    router.push("/dashboard/eventview/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="z-50 top-4 left-3 fixed">
        <button
          onClick={handleClick}
          className="block md:hidden "
          aria-label="Open Dashboard Menu"
        >
          <HiOutlineMenuAlt1 size={28} />
        </button>
      </div>
      {/* Overlay that can close the dashboard menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/10 z-10 ${dashboardOpen ? "block" : "hidden"
          }`}
        onClick={handleClick}
      ></div>
      <nav
        className={`z-50 dashboard-menu min-w-[300px] fixed flex flex-col h-screen border-r border-r-gray-800 bg-pagePrimary py-10 pl-10 transition-transform duration-300 ${dashboardOpen && "open"
          }`}
      >
        <div className="flex-1 flex flex-col gap-5 max-w-max">
          <div className="mt-10 flex-1">
            <Button variant="ghost" size="lg" className="rountded-full opacity-70 pb-10 text-base" leftIcon={BiSolidLeftArrowCircle}>Back to Events</Button>
            <div className="flex flex-col gap-3.5 pb-10">
              <span className="font-semibold">Navigate Event</span>
              <ul className="space-y-3">
                {routes.map((route, index) => (route.name &&
                  <li
                    key={index}
                    className={`flex items-center font-bold space-x-2 py-1 px-3 opacity-70 rounded-xl hover:bg-white/20  duration-200 ${router.pathname === route.path && "bg-white/20"
                      }`}
                  >
                    {route.icon && <route.icon size={30} />}
                    <Link href={route.path} className="w-full ">
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {
              router.pathname.includes('dashboard/eventview/tracks') && (
                <div className="flex flex-col gap-3 rounded-md p-2 bg-black font-bold">
                  <h2>Organizer</h2>
                  <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditEvent}>
                    <MdOutlineModeEdit />
                    <span>Edit Event</span>
                  </Button>
                </div>
              )
            }
            {
              router.pathname.includes('dashboard/eventview/allschedules') && (
                <div className="flex flex-col gap-3 rounded-md p-2 bg-black font-bold">
                  <h2>Organizer</h2>
                  <Button variant="ghost" className="p-2 w-full gap-3 text-base" onClick={handleEditSchedules}>
                    <MdOutlineModeEdit />
                    <span>Edit Schedules</span>
                  </Button>
                </div>
              )
            }
          </div>
        </div >
      </nav >
      {/* </div> */}
    </>
  )
}