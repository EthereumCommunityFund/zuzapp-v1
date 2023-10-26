import Link from "next/link";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaCog } from "react-icons/fa";
import { navBarRoutes } from "@/constant/routes";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/GlobalContext";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import RenderHTMLString from "@/components/ui/RenderHTMLString";

// Create a navigation side menu for the dashboard.
export default function DashboardNavigation() {
  const routes = navBarRoutes;
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const { isAuthenticated, user } = useGlobalContext();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const url = `/zuzalu/Zuzalu_Mission.md`;

  const router = useRouter();
  const handleClick = () => {
    setDashboardOpen(!dashboardOpen);
  };
  console.log('markdownContent', markdownContent);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        const response = await fetch(url);
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error fetching Markdown content:', error);
      }
    };

    fetchMarkdownContent();
  }, [url]);

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
        className={` hidden fixed inset-0 bg-black/10 z-10 ${dashboardOpen ? "block" : "hidden"
          }`}
        onClick={handleClick}
      ></div>
      <nav
        className={`dashboard-menu min-w-[260px] z-10 fixed flex flex-col h-screen border-r border-r-gray-800 bg-[#2F3232] py-10 px-6 transition-transform duration-300 ${dashboardOpen && "open"
          }`}
      >
        <div className="flex-1 flex flex-col">
          <div className="mt-10 flex-1">
            <ul className="space-y-3">
              {routes.map((route, index) => (
                <li
                  key={route.path}
                  className={`flex items-center text-sm transition duration-200 space-x-2 py-2 font-semibold px-3 hover:bg-white/20 rounded-3xl ${router.pathname === route.path ? "bg-white/20" : "opacity-60"
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
          <div className="mt-5 py-[15px] px-[13px] gap-3.5 flex flex-col rounded-2xl bg-[#2B2D2D] w-[240px]">
            <Label className="text-white text-xl">Zuzalu</Label>
            <Label className="text-white/70 text-xs font-normal">Foster a global network of communities to advance humanity by creating playgrounds at the intersection of free and open technology, science, heath and social innovation</Label>
            <Dialog>
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
                    {/* <RenderHTMLString htmlString={markdownContent} /> */}
                    <ReactMarkdown className={'overflow-x-auto h-[500px]'}>{markdownContent}</ReactMarkdown>
                  </DialogDescription>
                </DialogHeader>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Button size='sm' className='rounded-full w-10 h-10'><X /></Button>
                </DialogPrimitive.Close>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>
    </>
  );
}
