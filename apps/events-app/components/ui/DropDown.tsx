import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { CaretDownIcon } from "@radix-ui/react-icons"

interface IProps {
  title: string
}

export default function DropDown(props: IProps) {
  const { title } = props;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 justify-between w-full'>
        {title}<CaretDownIcon />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <div>
          <DropdownMenu.Item className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 w-[350px]'>Option 1</DropdownMenu.Item>
          <DropdownMenu.Item className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 w-[350px]'>Option 2</DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}