import Link from "next/link";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaCog } from "react-icons/fa";
import { navBarRoutes } from "@/constant/routes";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/GlobalContext";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";

// Create a navigation side menu for the dashboard.
export default function DashboardNavigation() {
  const routes = navBarRoutes;
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(true);
  const { isAuthenticated, user } = useGlobalContext();
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const url = `/zuzalu/Zuzalu_Mission.md`;
  const zuzaluLink = `https://zuzalu.notion.site/Zuzalu-s-Mission-and-Vision-28d0dfaf60c043ab8bb1943f493a225f`;

  const router = useRouter();

  // const handleCommunityDropdownClick = () => {
  //   setCommunityDropdownOpen(!communityDropdownOpen);
  // };

  const handleCommunityLinkClick = () => {
    setCommunityDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
    setCommunityDropdownOpen(false);
  };

  const allowedPaths = [
    "https://www.zuzagora.com/",
    "https://www.guilded.gg/Zuzalu/blog/Commuity-Blog",
    "https://www.guilded.gg/Zuzalu/blog/Announcements",
  ];

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
        className={` hidden fixed inset-0 bg-black/10 z-10 ${
          dashboardOpen ? "block" : "hidden"
        }`}
        onClick={handleClick}
      ></div>
      <nav
        className={`dashboard-menu min-w-[260px] z-10 fixed flex flex-col h-screen border-r border-r-gray-800 bg-[#2F3232] py-10 px-6 transition-transform duration-300 ${
          dashboardOpen && "open"
        }`}
      >
        <div className="flex-1 flex flex-col">
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

                  <span className="icon_end" onClick={handleCommunityLinkClick}>
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
            <ul className="flex mt-28 flex-col gap-[31px]">
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
          <div className="mt-5 py-[15px] px-[13px] gap-3.5 flex flex-col rounded-2xl bg-[#2C2D2D] w-[240px]">
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
                  "https://www.guilded.gg/r/zzME2L6mXR?i=dVbg9yzd",
                  "_blank"
                )
              }
            >
              <img src="/images/guilded_logo.svg" />
              <span>Join Guilded</span>
            </div>

            <Label className="text-white text-l">
              Participate in Discussions:
            </Label>
            <div
              className="menu_cta"
              onClick={() => window.open("https://www.zuzagora.com/", "_blank")}
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
    </>
  );
}
