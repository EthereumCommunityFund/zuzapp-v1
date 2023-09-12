import { IconType } from "react-icons";
import { BsTicket } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { SlMap } from "react-icons/sl";

interface TabButtons {
    name: string;    
    icon: IconType;
    path: string;
}
export const tabButtonLists: TabButtons[] = [
    {
        name: 'Dashboard',
        icon: MdDashboard,
<<<<<<< HEAD
        path: '/dashboard/events/spacedashboard',
=======
        path: '/dashboard/space-dashboard',
>>>>>>> df0c4f1 (feat: add tracks page)
    },
    {
        name: 'Track',
        icon: SlMap,
        path: '/dashboard/events/tracks',
    },
    {
        name: 'Schedules',
        icon: BsTicket,
        path: '/dashboard/events/schedules',
    },
]