import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BiChevronDown } from "react-icons/bi";
import { BsMapFill, BsTicketFill } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { HiMap } from "react-icons/hi";
import { BsFillTicketFill } from "react-icons/bs";
import Button from '@/components/ui/buttons/Button';

interface DropDownMenuItem {
  icon: IconType;
  label: string;
};

const DropDownMenu: DropDownMenuItem[] = [
  {
    icon: BsFillTicketFill,
    label: "Add a Schedule"
  },
  {
    icon: HiMap,
    label: "Add a Track"
  },
]

type AddToEventButton = {
  className: string
}

const AddToEventButton: React.FC<AddToEventButton> = (props) => {
  return (
    <DropdownMenu.Root className={props.className}>
      <DropdownMenu.Trigger>
        <div className='inline-flex pr-3 items-center gap-[10px] rounded-xl border border-[#FFFFFF20] bg-[#FFFFFF20]'>
          <div className='flex w-[37px] py-2.5 justify-center items-center rounded-bl-xl rounded-tl-xl gap-[10px] bg-[#363636]'>
            <BiChevronDown className='w-4 h-4' />
          </div>
          <span className='text-base font-semibold leading-[1.2]'>Add</span>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className='flex top-[10px] flex-col items-center self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50'>
        <Button
          className="flex py-[14px] flex-col bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold leading-[1.2] border-b-[1px] border-white/10 rounded-tl-[10px] rounded-tr-[10px] border-none"
        >
          Add to Event
        </Button>
        <DropdownMenu.Separator className="stroke stroke-white/10" />
        <div className='flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch'>
          {
            DropDownMenu.map((item: DropDownMenuItem, index: number) => (
              <Button
                className="w-full shadow-none rounded-[40px] px-3.5 bg-[#383B3B] border-none hover:bg-[#ffffff10] duration-200 text-textSecondary hover:text-textSecondary"
                leftIcon={item.icon}
              >
                {item.label}
              </Button>
            ))
          }
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default AddToEventButton;