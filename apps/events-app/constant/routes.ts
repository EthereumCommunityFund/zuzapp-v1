import { IconType } from "react-icons";
import { HiCollection, HiHome, HiLightningBolt, HiViewBoards } from "react-icons/hi";

interface Routes {
    path: string;
    title: string;
    icon?: IconType | null;
}
export const routes: Routes[] = [
    {
      path: '/dashboard/events/myspaces',
      title: 'Event Space Dashboard',
    },
    {
      path: '/dashboard/events/eventspace',
      title: 'Event Space Details',
    },
    {
      path: '/dashboard/event-management/tracks',
      title: 'Tracks',
    },
    {
      path: '/dashboard/event-management/allschedules',
      title: 'All schedules',
    },
    {
      path: 'my-event-spaces',
      title: 'My Event Spaces',
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