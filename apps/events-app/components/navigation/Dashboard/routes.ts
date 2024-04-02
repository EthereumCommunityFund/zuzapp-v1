import { IconType } from "react-icons";
import {
  HiCollection,
  HiHome,
  HiLightningBolt,
  HiViewBoards,
  HiMap,
  HiCalendar,
  HiChatAlt2,
  HiSpeakerphone,
  HiChevronDown,
} from "react-icons/hi";
import { BiCalendar, BiSolidLayout } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { LucideIcon } from "lucide-react";
import { HiArrowUpRight } from "react-icons/hi2";
import { GoArrowUpRight } from "react-icons/go";

interface RouteOption {
  path: string;
  title: string;
  img: string;
}

interface DashboardRoute {
  path: string;
  title: string;
  icon: IconType;
  icon_end?: IconType | LucideIcon;
  options?: RouteOption[];
}
export const dashboardRoutes: DashboardRoute[] = [
  {
    path: "/dashboard/home",
    title: "Home",
    icon: HiHome,
  },
  {
    path: "/dashboard/schedules",
    title: "Schedules",
    icon: HiViewBoards,
  },
  {
    path: "/dashboard/zapps",
    title: "Zapps",
    icon: HiLightningBolt,
  },
  {
    path: "/dashboard/resources",
    title: "Resources",
    icon: HiCollection,
  },
  {
    path: "",
    title: "Community",
    icon: HiSpeakerphone,
    icon_end: HiChevronDown,
    options: [
      {
        path: "/dashboard/about",
        title: "About Zuzalu",
        img: "/images/about_zuzalu.svg",
      },
      {
        path: "https://www.guilded.gg/Zuzalu/blog/Community-Blog",
        title: "Community Blog",
        img: "/images/guilded_logo.svg",
      },
      {
        path: "https://www.guilded.gg/Zuzalu/blog/Announcements",
        title: "Announcements",
        img: "/images/guilded_logo.svg",
      },
    ],
  },
];
