import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BiChevronDown } from 'react-icons/bi';
import { BsMapFill, BsTicketFill } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { HiMap } from 'react-icons/hi';
import { BsFillTicketFill } from 'react-icons/bs';
import Button from '@/components/ui/buttons/Button';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useState } from 'react';

interface DropDownMenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const DropDownMenu: DropDownMenuItem[] = [
  {
    icon: BsFillTicketFill,
    label: 'Add a Session',
    path: '/dashboard/events/space/tracks/schedules/addschedule',
  },
  {
    icon: HiMap,
    label: 'Add a Track',
    path: '/dashboard/events/space/tracks/addtrack',
  },
];

type AddToEventButton = {
  className: string;
};

const AddToEventButton: React.FC<AddToEventButton> = (props) => {
  const router = useRouter();
  const { event_space_id, trackId } = router.query;

  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {/* <div className="lg:inline-flex hidden pr-3 items-center gap-[10px] rounded-xl border border-[#FFFFFF20] bg-[#FFFFFF20]">
            <div className="flex w-[37px] py-2.5 justify-center items-center rounded-bl-xl rounded-tl-xl gap-[10px] bg-[#363636]">
              <BiChevronDown className="w-4 h-4" />
            </div>
            <span className="lg:text-base text-sm font-semibold leading-[1.2]">Add</span>
          </div> */}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="flex top-[10px] flex-col items-center self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50">
          <Button className="flex py-[14px] flex-col bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold leading-[1.2] border-b-[1px] border-white/10 rounded-tl-[10px] rounded-tr-[10px] border-none">
            Add to Event
          </Button>
          <DropdownMenu.Separator className="stroke stroke-white/10" />
          <div className="flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch">
            {DropDownMenu.map((item: DropDownMenuItem, index: number) => {
              const id = v4();
              return (
                <Button
                  key={id}
                  onClick={() => {
                    let path = item.path;
                    if (event_space_id) path += `?event_space_id=${event_space_id}`;
                    if (trackId) path += `${event_space_id ? '&' : '?'}trackId=${trackId}`;
                    if (item.label === 'Add a Session') path += `${event_space_id || trackId ? '&' : '?'}quickAccess=true`;
                    router.push(path);
                  }}
                  className="w-full shadow-none rounded-[40px] px-3.5 bg-[#383B3B] border-none hover:bg-[#ffffff10] duration-200 text-textSecondary hover:text-textSecondary"
                  leftIcon={item.icon}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <div onClick={() => setIsOpened(true)} className="fixed lg:hidden bottom-14 right-5">
        <div className="border rounded-full bg-[#2F3131] border-white/10 cursor-pointer pb-2 px-3 ">
          <div className="font-semibold text-5xl text-white">+</div>
        </div>
      </div>
      {isOpened && (
        <div onClick={() => setIsOpened(false)} className="fixed top-0 bottom-0 left-0 right-0">
          <div className="fixed bg-transparent min-w-screeen min-h-screen z-20"></div>
          <div className="border fixed border-white/10 backdrop-blur-[20px] rounded-t-[10px] z-30 -bottom-px flex-col left-0 flex gap-1 pb-5 right-0">
            <div className="flex font-bold justify-between bg-[#383B3B] p-5">
              <h1 className="">Add to Event</h1>
              <div onClick={() => setIsOpened(false)} className="border rounded-full bg-[#2F3131] border-white/10 cursor-pointer pb-2 px-3 ">
                <div className="font-semibold text-3xl text-white">x</div>
              </div>
            </div>
            <div className="flex flex-col gap-5 p-5">
              {DropDownMenu.map((item: DropDownMenuItem, index: number) => {
                const id = v4();
                return (
                  <Button
                    key={id}
                    onClick={() => {
                      let path = item.path;
                      if (event_space_id) path += `?event_space_id=${event_space_id}`;
                      if (trackId) path += `${event_space_id ? '&' : '?'}trackId=${trackId}`;
                      if (item.label === 'Add a Session') {
                        path += `${event_space_id || trackId ? '&' : '?'}quickAccess=true`;
                      }
                      router.push(path);
                    }}
                    className="w-full shadow-none rounded-[40px] px-3.5 bg-[#383B3B] border-none hover:bg-[#ffffff10] duration-200 text-textSecondary hover:text-textSecondary flex lg:block items-center justify-center py-2 lg:py-0"
                    leftIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToEventButton;
