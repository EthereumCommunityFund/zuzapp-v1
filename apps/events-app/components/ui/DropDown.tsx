import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { CaretDownIcon } from "@radix-ui/react-icons"

interface IProps {
  title: string
}

export default function DropDown(props: IProps) {
  const { title } = props;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 w-inherit justify-between'>
        {title}<CaretDownIcon />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 w-full'>Option 1</DropdownMenu.Item>
        <DropdownMenu.Item className='flex rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10 w-full'>Option 2</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}