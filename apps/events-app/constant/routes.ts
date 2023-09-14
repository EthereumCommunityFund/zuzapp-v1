import { SubHeaderTabIndex } from "@/types";
import { IconType } from "react-icons";
import { HiCollection, HiHome, HiLightningBolt, HiViewBoards } from "react-icons/hi";

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
      title: 'Add a Schedule',
    },
    {
      path: '/dashboard/events/create',
      title: 'Create a EventSpace',
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