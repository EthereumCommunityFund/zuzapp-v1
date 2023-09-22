import Button from "@/components/ui/buttons/Button";
import { eventViewRoutes } from "@/constant/routes";
import { useGlobalContext } from "@/context/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineModeEdit } from "react-icons/md";
import { HiArrowLeft, HiOutlineMenuAlt1 } from "react-icons/hi";
import React from "react";

export default function EventViewNavigation() {
  const [dashboardOpen, setDashboardOpen] = React.useState(true);
  const router = useRouter();
  const routes = eventViewRoutes;
  const checkIfCurrentRouteIsEventView = () => {
    const currentRoute = router.pathname === 'dashboard/eventview';
    if (currentRoute) return false;
    return true;
  }
  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };
  const { isAuthenticated, user } = useGlobalContext();
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
        className={`dashboard-menu min-w-[260px] fixed flex flex-col h-screen border-r border-r-gray-800 bg-pagePrimary py-10 px-6 transition-transform duration-300 ${dashboardOpen && "open"
          }`}
      >
        <div className="flex-1 flex flex-col gap-5">
          <div className="mt-10 flex-1">
            <Button variant="ghost" size="lg" className="rountded-full opacity-70" leftIcon={HiArrowLeft}>Back to Events</Button>
            <div className="flex flex-col gap-3.5">
              <span className="font-semibold">Navigate Event</span>
              <ul className="space-y-3">
                {routes.map((route, index) => (
                  <li
                    key={index}
                    className={`flex items-center font-bold space-x-2 py-1 px-3 rounded-2xl hover:opacity-100 duration-200 ${router.pathname === route.path && "bg-white/20"
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
          </div>
          {
            checkIfCurrentRouteIsEventView() && (
              <div className=" flex flex-col gap-3 rounded-full">
                <h2>Organizer</h2>
                <Button leftIcon={MdOutlineModeEdit}>Edit Event</Button>
              </div>
            )
          }
        </div >
      </nav >
      {/* </div> */}
    </>
  )
}