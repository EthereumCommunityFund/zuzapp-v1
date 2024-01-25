import { SubHeaderTabIndex } from "@/types";
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

interface Routes {
  name?: string;
  tabIndex?: SubHeaderTabIndex;
  path: string;
  title: string;
  icon?: IconType | LucideIcon;
  icon_end?: IconType | LucideIcon;
  options?: RouteOption[];
}
export const eventRoutes: Routes[] = [
  {
    name: "Dashboard",
    tabIndex: SubHeaderTabIndex.SpaceDashboard,
    path: "/dashboard/events/space/dashboard",
    title: "Event Space Dashboard",
  },
  {
    path: "/dashboard/events/space/details",
    title: "Event Space Details",
  },
  {
    name: "Tracks",
    tabIndex: SubHeaderTabIndex.SpaceTrack,
    path: "/dashboard/events/space/tracks",
    title: "Tracks Dashboard",
  },
  {
    path: "/dashboard/events/space/tracks/addtrack",
    title: "Add a Track ",
  },
  {
    path: "/dashboard/events/space/tracks/update",
    title: "Update a Track ",
  },
  {
    name: "All Schedules",
    tabIndex: SubHeaderTabIndex.AllSchedules,
    path: "/dashboard/events/space/schdeules",
    title: "Schedules Dashboard",
  },
  {
    path: "/dashboard/events/space/tracks/schedules",
    title: "Schedules",
  },
  {
    path: "/dashboard/events/space/tracks/schedules/addschedule",
    title: "Add a Session",
  },
  {
    path: "/dashboard/events/space/tracks/schedules/updateSchedule",
    title: "Update a Session",
  },
  {
    path: "/dashboard/events/space/schedules",
    title: "Sessions",
  },
];

export const navBarRoutes: Routes[] = [
  {
    path: "/dashboard/home",
    title: "Home",
    icon: HiHome,
  },
  // {
  //   path: '/dashboard/eventview/allschedules?event_space_id=873f2ae3-bcab-4a30-8b99-cb5e011a9db0',
  //   title: 'Zuconnect Sessions',
  //   icon: HiViewBoards,
  // },
  {
    path: "/dashboard/zapps",
    title: "Zapps",
    icon: HiLightningBolt,
  },
  // {
  //   path: '/dashboard/resources',
  //   title: 'Resources',
  //   icon: HiCollection,
  // },
  {
    path: "https://www.zuzagora.com/",
    title: "Zuzagora",
    icon: HiChatAlt2,
    icon_end: GoArrowUpRight,
  },
  {
    path: "/dashboard/resources",
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
        path: "/dashboard/resources/events",
        title: "Community Blog",
        img: "/images/guilded_logo.svg",
      },
      {
        path: "/dashboard/resources/events",
        title: "Announcements",
        img: "/images/guilded_logo.svg",
      },
    ],
  },
];

export const eventViewRoutes: Routes[] = [
  {
    name: "About",
    path: "/dashboard/eventview/about",
    icon: HiCalendar,
    title: "Event View About",
  },
  // {
  //   name: 'Tracks',
  //   path: '/dashboard/eventview/tracks',
  //   title: 'Event View Tracks',
  //   icon: HiMap,
  // },
  // {
  //   name: 'All Sessions',
  //   path: '/dashboard/eventview/allschedules',
  //   title: 'Sessions Dashboard',
  //   icon: BsFillTicketFill,
  // },
  // {
  //   path: '/dashboard/eventview/tracks/track',
  //   title: 'Track View',
  // },
  // {
  //   path: '/dashboard/eventview/allschedules/schedule',
  //   title: 'Track View',
  // },
  // {
  //   path: '/dashboard/eventview/tracks/track/schedule',
  //   title: 'Schedule View',
  // },
];
