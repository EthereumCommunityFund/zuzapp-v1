import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconType } from 'react-icons';
import { BsArrowRightSquare, BsFillTicketFill } from 'react-icons/bs';
import Button from '@/components/ui/buttons/Button';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useState } from 'react';
import { User } from '@/components/ui/icons';

interface DropDownMenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const MyProfileDropDownMenu: DropDownMenuItem[] = [
  {
    icon: User,
    label: 'My Profile',
    path: '/dashboard/user-profile',
  },
  {
    icon: BsFillTicketFill,
    label: 'My RSVPs',
    path: '/dashboard/events/space/tracks/addtrack',
  },
  {
    icon: BsArrowRightSquare,
    label: 'Sign Out',
    path: '/dashboard/events/space/tracks/addtrack',
  },
];

type MyProfileButtonType = {
  className: string;
  userName: string;
};

const MyProfileButton: React.FC<MyProfileButtonType> = (props: MyProfileButtonType) => {
  const router = useRouter();
  const { event_space_id, trackId } = router.query;
  const { userName, className } = props;

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div className='rounded-[60px] flex border border-[#333435] px-3 py-1 bg-white/10 hover:bg-white/20 duration-200'>
            <User /> {userName}
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="flex top-[10px] flex-col items-center self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50 w-52">
          <Button className="flex py-[14px] bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold leading-[1.2] border-b-[1px] border-white/10 rounded-tl-[10px] rounded-tr-[10px] border-none" leftIcon={User}>
            {userName}
          </Button>
          <DropdownMenu.Separator className="stroke stroke-white/10" />
          <div className="flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch">
            {MyProfileDropDownMenu.map((item: DropDownMenuItem, index: number) => {
              const id = v4();
              return (
                <Button
                  key={id}
                  onClick={() => {
                    let path = item.path;
                    if (event_space_id) path += `?event_space_id=${event_space_id}`;
                    if (trackId) path += `${event_space_id ? '&' : '?'}trackId=${trackId}`;
                    if (item.label === 'Add a Schedule') path += `${event_space_id || trackId ? '&' : '?'}quickAccess=true`;
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
    </>
  );
};

export default MyProfileButton;
