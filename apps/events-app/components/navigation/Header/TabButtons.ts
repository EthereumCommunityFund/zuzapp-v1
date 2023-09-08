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
        path: '/dashboard/space-dashboard',
    },
    {
        name: 'Track',
        icon: SlMap,
        path: '/tracks',
    },
    {
        name: 'Schedules',
        icon: BsTicket,
        path: '/schedules',
    },
]