import { IconType } from "react-icons";
import { BiSolidLayout } from "react-icons/bi";
import { HiMap } from "react-icons/hi";
import { BsFillTicketFill } from "react-icons/bs";
import { SubHeaderTabIndex } from "@/types";

interface TabButtons {
    name: string;    
    icon: IconType;
    path: string;
};

export const tabButtonLists: TabButtons[] = [
    {
        name: 'Dashboard',
        icon: BiSolidLayout,
        path: '/dashboard/events/space/dashboard',
    },
    {
        name: 'Tracks',
        icon: HiMap,
        path: '/dashboard/events/space/tracks',
    },
    {
        name: 'Schedules',
        icon: BsFillTicketFill,
        path: '/dashboard/schedules',
    },
]