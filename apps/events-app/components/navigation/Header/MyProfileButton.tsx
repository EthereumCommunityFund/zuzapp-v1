import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconType } from 'react-icons';
import { BsArrowRightSquare, BsFillTicketFill } from 'react-icons/bs';
import Button from '@/components/ui/buttons/Button';
import router, { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useState } from 'react';
import { User } from '@/components/ui/icons';
import Avvvatars from 'avvvatars-react';

import { ReactNode } from 'react';

interface DropDownMenuItem {
  icon: ReactNode;
  label: string;
  path: string;
  action?: () => void;
}

const MyProfileDropDownMenu: DropDownMenuItem[] = [
  {
    icon: <User />,
    label: 'My Profile',
    path: '/dashboard/user-profile',
  },
  {
    icon: <BsArrowRightSquare />,
    label: 'Sign Out',
    path: '',
    action: handleSignOut,
  },
];

function handleSignOut() {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });

  router.push('/');
}

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
          <div className="rounded-[60px] flex items-center gap-3 border border-[#333435] pr-3 pl-1 py-1 bg-white/10 hover:bg-white/20 duration-200">
            <Avvvatars value={userName} style="shape" />
            <span className="hidden md:inline-block">{userName}</span>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="flex top-[10px] py-3 flex-col self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50 w-68">
          <div className="flex gap-5 items-center px-5 py-3">
            <Avvvatars value={userName} style="shape" size={40} />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-white">{userName}</p>
              <div className="text-textSecondary text-sm flex items-center gap-1">
                <small className="inline-block bg-green-400 w-1.5 h-1.5 rounded-full"></small>
                <span>Zupass Connected</span>
              </div>
            </div>
          </div>
          <DropdownMenu.Separator className="border-[0.5px] border-white/20 w-full my-2" />
          <div className="flex pt-1.5 pb-3 px-1.5 flex-col gap-4 self-stretch">
            {MyProfileDropDownMenu.map((item: DropDownMenuItem, index: number) => {
              const id = v4();
              return (
                <Button
                  key={id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      let path = item.path;
                      router.push(path);
                    }
                  }}
                  className="w-full shadow-none rounded-md px-3.5 bg-[#383B3B] border-none hover:bg-[#ffffff10] duration-200 text-textSecondary hover:text-textSecondary"
                >
                  <div className="flex gap-3 items-center font-semibold py-1">
                    {item.icon}
                    {item.label}
                  </div>
                </Button>
              );
            })}
          </div>
          <DropdownMenu.Separator className="border-[0.5px] border-white/20 w-full my-2" />
          <footer className="flex flex-col gap-x-4 text-textSecondary hover:text-textSecondary text-xs font-semibold px-5 py-3">
            <div className="flex justify-between gap-3">
              <span>Privacy </span>
              <span>Terms</span>
              <span>About Zuzalu</span>
            </div>
            <div>
              <span>Blog </span>
            </div>
          </footer>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default MyProfileButton;
