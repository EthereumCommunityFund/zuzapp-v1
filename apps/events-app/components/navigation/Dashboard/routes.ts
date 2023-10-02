import { IconType } from 'react-icons';
import { HiCollection, HiHome, HiLightningBolt, HiTicket, HiViewBoards } from 'react-icons/hi';

interface DashboardRoute {
  path: string;
  title: string;
  icon: IconType;
}
export const dashboardRoutes: DashboardRoute[] = [
  {
    path: '/dashboard/home',
    title: 'Home',
    icon: HiHome,
  },
  {
    path: '/dashboard/schedules',
    title: 'Schedules',
    icon: HiViewBoards,
  },
  {
    path: '/dashboard/zapps',
    title: 'Zapps',
    icon: HiLightningBolt,
  },
  {
    path: '/dashboard/resources',
    title: 'Resources',
    icon: HiCollection,
  },
];
