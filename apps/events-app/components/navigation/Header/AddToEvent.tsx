import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from "@/components/ui/buttons/Button";
import { BiChevronDown } from "react-icons/bi";
import { BsMapFill, BsTicketFill } from 'react-icons/bs';

export default function AddToEventButton() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className='inline-flex pr-[10px] items-center gap-[10px] rounded-[10px] border border-[#FFFFFF20] bg-[#FFFFFF20]'>
          <div className='flex w-[37px] py-[5px] px-0 justify-center items-center gap-[10px] rounded-tl-2xl rounded-bl-2xl rounded-tr-none rounded-br-none bg-[#363636]'><BiChevronDown /></div>
          <span className='text-base font-semibold leading-[1.2]'>Add</span>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className='flex top-[10px] flex-col items-center self-stretch bg-[#383B3BE6] rounded-[10px] border border-white/10 backdrop-blur-[20px]'>
        <DropdownMenu.Item className='flex py-[14px] px-5 flex-col items-center self-stretch text-lg font-semibold leading-[1.2] opacity-70'>Add to Event</DropdownMenu.Item>
        <DropdownMenu.Separator className="stroke stroke-white/10" />
        <div className='flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch'>
          <DropdownMenu.Item className='flex p-2.5 items-center gap-3 self-stretch'><BsTicketFill />Add a Schedule</DropdownMenu.Item>
          <DropdownMenu.Item className='flex p-2.5 items-center gap-3 self-stretch'><BsMapFill />Add a Track</DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}