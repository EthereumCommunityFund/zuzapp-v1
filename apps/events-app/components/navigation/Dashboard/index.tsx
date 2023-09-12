import Image from 'next/image';
import Link from 'next/link';
import { HiLightningBolt, HiOutlineMenuAlt1 } from 'react-icons/hi';
import { FaCog } from 'react-icons/fa';
import { navBarRoutes } from '@/constant/routes';
import React from 'react';

import { useRouter } from 'next/router';
import { useGlobalContext } from '@/context/GlobalContext';
import Button from '@/components/ui/buttons/Button';

// Create a navigation side menu for the dashboard.
export default function DashboardNavigation() {
  const routes = navBarRoutes;
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();
  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
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
          {isAuthenticated && (
            <ul className="flex flex-col gap-[31px]">
              <li className="flex items-center space-x-2">
                <Link href={'myspaces'}>
                  <Button variant={'primary'} className="rounded-full" leftIcon={FaCog}>
                    My Event Spaces
                  </Button>
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Image src="/images/Avatar.png" alt="Avatar" width={32} height={32} />
                <Link href="/dashboard/profile">My Profile</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}
