import Image from "next/image";

import Button from "@/components/ui/buttons/Button";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUserPassportContext } from "@/context/PassportContext";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dashboardRoutes } from "@/components/navigation/Dashboard/routes";
import { useRouter } from "next/router";
import { RxAvatar } from "react-icons/rx";
import IconButton from "@/components/ui/buttons/IconButton";
import { HiMenuAlt1 } from "react-icons/hi";
import { XCircle } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { navBarRoutes } from "@/constant/routes";
import { FaCog } from "react-icons/fa";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import MyProfileButton from "./MyProfileButton";
import CreateEventSpace from "@/components/navigation/Header/CreateEventSpace";
import { Label } from "@/components/ui/label";
import { useClickAway } from "@uidotdev/usehooks";
import { useWallet } from "@/context/WalletContext";

export default function DashboardHeader() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user, profile } = useGlobalContext();
  const { connectToMetamask } = useWallet();
  const router = useRouter();
  const [activePopover, setActivePopover] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const signInWithPassport = () => {
    signIn();
    toggleDropdown();
    setActivePopover("passport");
  };

  const signInWithMetamask = () => {
    connectToMetamask();
    toggleDropdown();
    setActivePopover("wallet");
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleNavItemClick = () => {
    // Close the navigation when a navigation item is clicked
    setDashboardOpen(false);
    setCommunityDropdownOpen(false);
  };

  const handleCommunityLinkClick = () => {
    setCommunityDropdownOpen((prevOpen) => !prevOpen);
  };

  const allowedPaths = [
    "https://www.zuzagora.com/",
    "https://www.guilded.gg/Zuzalu/blog/Community-Blog",
    "https://www.guilded.gg/Zuzalu/blog/Announcements",
  ];

  // const signInWithPassport = () => {
  //   signIn();
  //   setActivePopover("passport");
  // };

  // const signInWithMetamask = () => {
  //   connectToMetamask();
  //   setActivePopover("wallet");
  // };

  const containerRef = useClickAway(() => {
    setDashboardOpen(false);
  }) as React.RefObject<HTMLDivElement>;

  const toggleNavigation = () => {
    setDashboardOpen((prev) => !prev);
  };

  useEffect(() => {
    setDashboardOpen(false);
  }, []);

  const routes = navBarRoutes;
  console.log("isAuthenticated", isAuthenticated, profile);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);
  const [isAlert, setIsAlert] = useState<boolean>(true);

  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
    setCommunityDropdownOpen(false);
  };

  const handleAlert = () => {
    setIsAlert(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10"
    >
      <header className="w-full py-3 px-5 md:px-8 flex sm:justify-between justify-end items-center bg-[#2F3232] ">
        <div className="flex gap-2 w-[265px]">
          <IconButton
            ref={toggleNavigation}
            onClick={handleClick}
            variant="dark"
            className=" rounded-full lg:hidden z-50 bg-componentPrimary border-none hover:b-- duration-200"
            icon={HiMenuAlt1}
          />
          <Link href="/">
            {/* create responsive image */}
            <Image
              src="/images/Logo.png"
              alt="Zuzalu Logo"
              width={150}
              height={35}
            />
          </Link>
        </div>
        <nav
          className={`mobile_menu dashboard-menu w-[260px] z-10 fixed flex flex-col h-screen border-r border-r-gray-800 bg-[#2F3232] py-10 px-6 transition-transform duration-300 ${
            dashboardOpen && "open"
          }`}
        >
          <div className="top_menu_list flex flex-col">
            <div className="mt-10 flex-1">
              <ul className="space-y-1">
                {routes.map((route, index) => (
                  <li
                    key={route.path}
                    className={`flex items-center text-sm transition duration-200 space-x-2 py-2 font-semibold px-3 hover:bg-white/20 rounded-xl ${
                      router.pathname === route.path
                        ? "bg-white/20"
                        : "opacity-60"
                    }`}
                  >
                    {route.icon && <route.icon size={30} />}
                    {route.options ? (
                      <>
                        <span
                          className="w-full cursor-pointer"
                          onClick={handleCommunityLinkClick}
                        >
                          {route.title}
                        </span>
                      </>
                    ) : route.path.startsWith("http") ? (
                      <a
                        href={route.path}
                        className="w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {route.title}
                      </a>
                    ) : (
                      <Link href={route.path} className="w-full">
                        {route.title}
                      </Link>
                    )}

                    <span
                      className="icon_end"
                      onClick={handleCommunityLinkClick}
                    >
                      {route.icon_end && <route.icon_end size={24} />}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Dropdown outside the li */}
              {communityDropdownOpen && (
                <ul className="community_items">
                  {routes.map(
                    (route) =>
                      route.options &&
                      route.options.map((option) => (
                        <li
                          key={option.path}
                          className={`flex  ${
                            router.pathname === option.path
                              ? "bg-white/0"
                              : "opacity-60"
                          }`}
                          onClick={handleNavItemClick}
                        >
                          <div>
                            <div className="menu_cta">
                              <img src={option.img} />
                              <Link href={option.path}>
                                <span>{option.title}</span>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))
                  )}
                </ul>
              )}
            </div>
            {/* Profile navigation */}
            {isAuthenticated && (
              <ul className="flex mt-10 flex-col gap-[31px]">
                <li className="flex items-center space-x-2">
                  <Link href={"/dashboard/events/myspaces"} className="w-full">
                    <Button
                      size="base"
                      variant="primaryGreen"
                      className="rounded-full w-full text-base opacity-70"
                      leftIcon={FaCog}
                    >
                      My Event Spaces
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
            {/* <div className="mt-5 py-[15px] px-[13px] gap-3.5 flex flex-col rounded-2xl bg-[#2B2D2D] w-[240px]">
            <Label className="text-white text-xl">Zuzalu</Label>
            <Label className="text-white/70 text-xs font-normal">Foster a global network of communities to advance humanity by creating playgrounds at the intersection of free and open technology, science, heath and social innovation</Label>
            <Button variant='quiet' className="rounded-2xl tracking-wide justify-center" onClick={() => window.open(zuzaluLink, '_blank')}>Learn About Zuzalu</Button> */}
            <div className="py-[15px] mt-5 px-[13px] gap-3.5 flex flex-col rounded-2xl bg-[#2C2D2D] w-[240px]">
              <Label className="text-white text-xl">Collaborate</Label>
              <Label className="text-white/70 text-xs font-normal">
                Take part in building Zuzalu tools and discussions!
              </Label>

              <Label className="text-white text-l border_top">
                Build With Us
              </Label>
              <div
              className="menu_cta"
              onClick={() =>
                window.open(
                  "https://matrix.to/#/#zuzalusoftware:matrix.org",
                  "_blank"
                )
              }
            >
                    <img 
                      src="/images/elementicon.png" 
                      style={{ height: '16px', width: '16px', filter: 'brightness(0) invert(1)' }}
                      alt="Join Icon"
                    />
                  <span>Join on Element</span>
              </div>


              <Label className="text-white text-l">
                Participate in Discussions:
              </Label>
              <div
                className="menu_cta"
                onClick={() =>
                  window.open("https://www.zuzagora.com/", "_blank")
                }
              >
                <img src="/images/zuzagora.svg" />
                <span>Zuzagora Discourse</span>
              </div>
              {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant='quiet' className="rounded-2xl tracking-wide justify-center" >Learn About Zuzalu</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='pb-5'>
                    About Zuzalu
                  </DialogTitle>
                  <hr className='bg-grayBackground' />
                  <DialogDescription className="text-white">
                    {/* <RenderHTMLString htmlString={markdownContent} /> 
                    <ReactMarkdown className={'overflow-x-auto h-[500px]'}>{markdownContent}</ReactMarkdown>
                  </DialogDescription>
                </DialogHeader>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Button size='sm' className='rounded-full w-10 h-10'><X /></Button>
                </DialogPrimitive.Close>
              </DialogContent>
            </Dialog> */}
            </div>
          </div>
        </nav>
        {/*<div className="hidden md:block">*/}
        {/*  <input type="text" placeholder="Search" className="w-96 h-10 rounded-3xl px-5 bg-zinc-800" />*/}
        {/*</div>*/}
        <div>
          {isAuthenticated && profile ? (
            <div className="flex items-center gap-3">
              <CreateEventSpace />
              <MyProfileButton
                className={
                  profile.commitment !== "default_commitment"
                    ? "zupass"
                    : "wallet"
                }
                userName={profile.username ? profile.username : `My Profile`}
              />
            </div>
          ) : (
            // <Button leftIcon={User} variant="quiet" className="space-x-2 rounded-full">
            // </Button>
            <Popover>
              {/* 
                <PopoverTrigger
                  className="flex space-x-2 items-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base"
                  onClick={signInWithPassport}
                >
                  <Image
                    src="/images/zaluza blackandwhite.png"
                    width={20}
                    height={20}
                    alt="Passport"
                    className="mr-2"
                  />
                  Connect <span className="hidden md:inline"> Passport</span>
                </PopoverTrigger>
                <PopoverTrigger
                  className="flex space-x-2 items-center rounded-3xl px-5 py-2 h-full bg-dark text-sm md:text-base"
                  onClick={signInWithMetamask}
                >
                  Connect&nbsp;
                  <span className="hidden md:inline">&nbsp;Wallet</span>
                </PopoverTrigger>
              </div> */}

              <div className="relative inline-block text-left">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="connect_btn inline-flex justify-center w-full px-4 py-2 bg-dark text-sm md:text-base font-medium text-white/70 hover:text-white focus:outline-none"
                  id="dropdown-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <img src="/images/profile.svg" />
                  <span>Register an Event</span>
                </button>

                {isDropdownOpen && (
                  <div
                    className="connect_dropdown absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#2F3232] ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-menu"
                  >
                    <div className="py-1" role="none">
                      <PopoverTrigger
                        onClick={signInWithPassport}
                        className="connect_opt_btn flex px-4 py-2 text-sm text-white/70 hover:text-white w-full text-left"
                        role="menuitem"
                      >
                        <img src="/images/zupass_icon.svg" />
                        Connect Passport
                      </PopoverTrigger>
                      <PopoverTrigger
                        onClick={signInWithMetamask}
                        className="connect_opt_btn flex px-4 py-2 text-sm text-white/70 hover:text-white w-full text-left"
                        role="menuitem"
                      >
                        <img src="/images/wallet.svg" />
                        Connect Wallet
                      </PopoverTrigger>
                    </div>
                  </div>
                )}
              </div>

              <div className="connect_header">
                {activePopover === "passport" && (
                  <PopoverContent className="connection bg-[#2B2D2DE5] mt-5 mr-5 rounded-2xl w-80">
                    <div className="w-full flex flex-col items-center">
                      <Image
                        src="/images/small-icon.png"
                        alt="Avatar"
                        width={100}
                        height={25}
                      />
                      <p className="text-white/50 font-light text-xs mt-2">
                        POWERED BY OXPARC WITH ZERO-KNOWLEDGE
                      </p>
                      <div className="my-5 font-semibold text-sm">
                        {!isAuthenticated ? (
                          <p>Confirming on Zupass...</p>
                        ) : (
                          <p className="font-bold text-primary">Connected!</p>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                )}
                {activePopover === "wallet" && (
                  <PopoverContent className="connection bg-[#2B2D2DE5] mt-5 mr-5 rounded-2xl w-80">
                    <div className="w-full flex flex-col items-center">
                      <div className="my-5 font-semibold text-sm">
                        {!isAuthenticated ? (
                          <p>Connecting to Metamask</p>
                        ) : (
                          <p className="font-bold text-primary">Connected!</p>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </div>
            </Popover>
          )}
        </div>
      </header>
      {/* {router.pathname === `/dashboard/home` && isAlert && (
        <div className="flex justify-between w-full bg-[#7D432C] hover:bg-[#7D432C] text-[#FF956B] items-center">
          <Label className="md:px-2 px-1 sm:py-2 lg:py-0">Note: The app is still in Beta. Maintenance happens IST 2:00am to 6:00am. Thank you!</Label>
          <IconButton variant="ghost" className="text-[#FF956B]" icon={XCircle} onClick={handleAlert} />
        </div>
      )} */}
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);

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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
