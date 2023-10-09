import Image from 'next/image';

import Button from '@/components/ui/buttons/Button';
import { useGlobalContext } from '@/context/GlobalContext';
import { useUserPassportContext } from '@/context/PassportContext';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { dashboardRoutes } from '@/components/navigation/Dashboard/routes';
import { useRouter } from 'next/router';
import { RxAvatar } from 'react-icons/rx';
import IconButton from '@/components/ui/buttons/IconButton';
import { HiMenuAlt1 } from 'react-icons/hi';
import { User } from '@/components/ui/icons';
import { useState } from 'react';
import { navBarRoutes } from '@/constant/routes';
import { FaCog } from 'react-icons/fa';

export default function DashboardHeader() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();

  const routes = navBarRoutes;

  const [dashboardOpen, setDashboardOpen] = useState(false);

  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-white/10">
      <header className="w-full py-3 px-5 md:px-8 flex sm:justify-between justify-end items-center bg-[#2F3232] ">
        <div className="flex gap-2 w-[265px]">
          <IconButton onClick={handleClick} variant="dark" className=" rounded-full z-50 bg-componentPrimary border-none hover:b-- duration-200" icon={HiMenuAlt1} />
          <Link href="/">
            {/* create responsive image */}
            <Image src="/images/Logo.png" alt="Zuzalu Logo" width={150} height={35} />
          </Link>
        </div>


        <nav
        className={`dashboard-menu min-w-[260px] fixed lg:hidden flex flex-col h-screen border-r border-r-gray-800 bg-[#2F3232] py-10 px-6 transition-transform duration-300 ${dashboardOpen && "open"
          }`}
      >
        <div className="flex-1 flex flex-col opacity-70">
          <div className=" mt-14 flex-1">
            <ul className="space-y-2">
              {routes.map((route, index) => (
                <li
                  key={route.path}
                  onClick={handleClick}
                  className={`flex items-center space-x-2 py-1 px-3 hover:bg-white/20 rounded-3xl ${router.pathname === route.path && "bg-white/20"
                    }`}
                >
                  {route.icon && <route.icon size={30} />}
                  <Link href={route.path} className="w-full ">
                    {route.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Profile navigation */}
          {isAuthenticated && (
            <ul className="flex flex-col gap-[31px]">
              <li  onClick={handleClick} className="flex items-center space-x-2">
                <Link href={"/dashboard/events/myspaces"} className="w-full">
                  <Button
                    size="base"
                    variant={"primaryGreen"}
                    className="rounded-full w-full text-base"
                    leftIcon={FaCog}
                  >
                    My Event Spaces
                  </Button>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>






        <div className="hidden md:block">
          <input type="text" placeholder="Search" className="w-96 h-10 rounded-3xl px-5 bg-zinc-800" />
        </div>
        <div>
          {isAuthenticated ? (
            <Button leftIcon={User} variant="quiet" className="space-x-2 rounded-full">
              {/* {user?.email} */}
              <span className='hidden lg:inline-flex'>My Profile</span>
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger className="flex space-x-2 items-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base" onClick={signIn}>
                <Image src="/images/zaluza blackandwhite.png" width={20} height={20} alt="Passport" className="mr-2" />
                Connect <span className="hidden md:inline"> Passport</span>
              </PopoverTrigger>
              <PopoverContent className="bg-[#2B2D2DE5]">
                <div className="w-full flex flex-col items-center">
                  <Image src="/images/small-icon.png" alt="Avatar" width={100} height={25} />
                  <p className="text-white/50">Powered by Zero-Knowledge</p>
                  <div className="my-5">{!isAuthenticated ? <p>Confirming on Zupass...</p> : <p className="font-bold text-primary">Connected!</p>}</div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>
    </div>
  );
}
