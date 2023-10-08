import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Listbox } from '@headlessui/react';
import { TbChevronDown } from 'react-icons/tb';
import { DropDownMenuItemType } from '@/types';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

type DropDownMenu = {
  data: DropDownMenuItemType[];
  header: string;
  headerIcon?: any;
  multiple: boolean;
  value: string | string[];

  className?: string;
  headerClassName: string;
  optionsClassName: string;
};

export const DropDownMenu = (props: DropDownMenu) => {
  const { data, header, headerIcon: HeaderIcon, multiple, value, className, headerClassName, optionsClassName } = props;

  return (
    <>
      <Listbox as={"div"} className={cn("w-full relative", className)} value={value} multiple={multiple}>
        <Listbox.Button className={cn("relative w-full inline-flex justify-between item-center cursor-pointer bg-trackItemHover border border-borderSecondary py-2 px-2 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm", headerClassName)}>
          <div className='flex gap-2 items-center font-semibold pl-2'>
            {HeaderIcon && <HeaderIcon />}
            {header.charAt(0).toUpperCase() + header.slice(1)}
          </div>
          <TbChevronDown className="h-5 w-5 text-gray-40 font-extrabold" aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className={cn("absolute right-0 z-10 mt-2 w-full pb-2 bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", optionsClassName)}>
            {data.map((item, idx) => (
              <Listbox.Option key={idx} value={item} className={'block pt-2 px-2 text-sm'}>
                {({ selected }) => (
                  <>
                    <span
                      className={`relative block truncate rounded-2xl py-2 px-2 w-full hover:bg-itemHover ${selected ? 'font-medium bg-slate-700' : 'font-normal'
                        }`}
                    >
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </>
  );
};
