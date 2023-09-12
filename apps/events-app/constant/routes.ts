import { IconType } from "react-icons";
import { HiCollection, HiHome, HiLightningBolt, HiViewBoards } from "react-icons/hi";

interface Routes {
    path: string;
    title: string;
    icon?: IconType | null;
}
export const eventRoutes: Routes[] = [
    {
      path: '/dashboard/events/spacedashboard',
      title: 'Event Space Dashboard',
    },
    {
      path: '/dashboard/events/spacedetails',
      title: 'Event Space Details',
    },
    {
      path: '/dashboard/events/tracks',
      title: 'Tracks',
    },
    {
      path: '/dashboard/events/addtrack',
      title: 'Add a Track ',
    },
    {
      path: '/dashboard/events/schedules',
      title: 'Schedules Dashboard',
    },
    {
      path: '/dashboard/events/addschedule',
      title: 'Schedules Dashboard',
    }
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