import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from "./buttons/Button"
import { CaretDownIcon } from "@radix-ui/react-icons"

export default function DropDown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        Select Social Media
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}