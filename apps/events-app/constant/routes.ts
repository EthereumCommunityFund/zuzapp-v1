import { SubHeaderTabIndex } from "@/types";
import { IconType } from "react-icons";
import { HiCollection, HiHome, HiLightningBolt, HiViewBoards, HiMap, HiCalendar } from "react-icons/hi";
import { BiCalendar, BiSolidLayout } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";

interface Routes {
  name?: string;
  tabIndex?: SubHeaderTabIndex;
  path: string;
  title: string;
  icon?: IconType | null;
}
export const eventRoutes: Routes[] = [
  {
    name: 'Dashboard',
    tabIndex: SubHeaderTabIndex.SpaceDashboard,
    path: '/dashboard/events/space/dashbaord',
    title: 'Event Space Dashboard',
  },
  {
    path: '/dashboard/events/space/details',
    title: 'Event Space Details',
  },
  {
    name: 'Tracks',
    tabIndex: SubHeaderTabIndex.SpaceTrack,
    path: '/dashboard/events/space/tracks',
    title: 'Tracks Dashboard',
  },
  {
    path: '/dashboard/events/space/tracks/addtrack',
    title: 'Add a Track ',
  },
  {
    name: 'All Schedules',
    tabIndex: SubHeaderTabIndex.AllSchedules,
    path: '/dashboard/schedules',
    title: 'Schedules Dashboard',
  },
  {
    path: '/dashboard/events/space/tracks/schedules',
    title: 'Schedules',
  },
  {
    path: '/dashboard/events/space/tracks/schedules/addschedule',
    title: 'Add a Schedule',
  },

];

export const navBarRoutes: Routes[] = [
  {
    path: '/dashboard/home',
    title: 'Home',
    icon: HiHome
  },
  {
    path: '/dashboard/schedules',
    title: 'Schedules',
    icon: HiViewBoards
  },
  {
    path: '/dashboard/zapps',
    title: 'Zapps',
    icon: HiLightningBolt
  },
  {
    path: '/dashboard/resources',
    title: 'Resources',
    icon: HiCollection
  },
]

export const eventViewRoutes: Routes[] = [
  {
    name: 'About',
    path: '/dashboard/eventview',
    icon: HiCalendar,
    title: 'Event View About',
  },
  {
    name: 'Tracks',
    path: '/dashboard/eventview/tracks',
    title: 'Event View Tracks',
    icon: HiMap,
  },
  {
    name: 'All Schedules',
    path: '/dashboard/eventview/allschedules',
    title: 'Tracks Dashboard',
    icon: BsFillTicketFill
  },
  {
    path: '/dashboard/eventview/tracks/track',
    title: 'Track View'
  },
  {
    path: '/dashboard/eventview/allschedules/schedule',
    title: 'Track View'
  }
];