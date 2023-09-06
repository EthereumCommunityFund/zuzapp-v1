import { IconType } from "react-icons";
import { BsTicket, BsCalendar2 } from "react-icons/bs";
import { SlMap } from "react-icons/sl";

interface TabButtons {
    name: string;    
    icon: IconType;
}
export const tabButtonLists: TabButtons[] = [
    {
        name: 'Event Space',
        icon: BsCalendar2
    },
    {
        name: 'Track',
        icon: SlMap
    },
    {
        name: 'Schedules',
        icon: BsTicket
    },
]