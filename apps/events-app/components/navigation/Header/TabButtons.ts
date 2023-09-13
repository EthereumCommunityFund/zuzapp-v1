import { IconType } from "react-icons";
import { BiSolidLayout } from "react-icons/bi";
import { HiMap } from "react-icons/hi";
import { BsFillTicketFill } from "react-icons/bs";

interface TabButtons {
    name: string;    
    icon: IconType;
    path: string;
};

export const tabButtonLists: TabButtons[] = [
    {
        name: 'Dashboard',
        icon: BiSolidLayout,
        path: '/dashboard/events/space',
    },
    {
        name: 'Track',
        icon: HiMap,
        path: '/dashboard/events/tracks',
    },
    {
        name: 'All Schedules',
        icon: BsFillTicketFill,
        path: '/dashboard/events/schedules',
    },
]