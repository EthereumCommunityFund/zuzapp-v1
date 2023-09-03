import Image from "next/image";
import Link from "next/link";
import { HiCollection, HiHome, HiLightningBolt, HiOutlineMenuAlt1, HiTicket, HiViewBoards } from "react-icons/hi";
import { dashboardRoutes } from "./routes";
import React from "react";
import IconButton from "@/components/ui/buttons/IconButton";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/GlobalContext";



// Create a navigation side menu for the dashboard.
export default function DashboardNavigation() {
  const routes = dashboardRoutes;
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();
  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="z-20 top-4 left-3 fixed">
        <button onClick={handleClick} className="block md:hidden " aria-label="Open Dashboard Menu">
          <HiOutlineMenuAlt1 size={28} />
        </button>
      </div>
      {/* Overlay that can close the dashboard menu */}
      <div className={`md:hidden fixed inset-0 bg-black/10 z-10 ${dashboardOpen ? 'block' : 'hidden'}`} onClick={handleClick}></div>
      <nav className={`dashboard-menu w-64 flex flex-col h-screen overflow-y-auto border-r border-r-gray-800 bg-[#2F3232] py-8 px-6 transition-transform duration-300 ${dashboardOpen && 'open'}`}>
        <div className="flex-1 flex flex-col opacity-70">
          <div className="mt-10 flex-1">
            <ul className="space-y-2">
              {routes.map((route, index) => (
                <li key={route.path} className={`flex space-x-2 py-3 px-3 hover:bg-white/20 rounded-3xl ${router.pathname === route.path && 'bg-white/20'}`}>
                  <route.icon size={20} />
                  <Link href={route.path} className="w-full">
                    {route.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Profile navigation */}
          {
            isAuthenticated && (
              <ul>
                <li className="flex items-center space-x-2">
                  <Image src="/images/Avatar.png" alt="Avatar" width={32} height={32} />
                  <Link href="/dashboard/profile">
                    My Profile
                  </Link>
                </li>
              </ul>
            )
          }
        </div>
      </nav>
    </>
  );
}