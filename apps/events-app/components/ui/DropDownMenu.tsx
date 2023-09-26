import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { Listbox } from '@headlessui/react'
import { TbChevronDown } from 'react-icons/tb'
import { DropDownMenuItemType } from '@/types'
import { IconType } from 'react-icons'
import { LucideIcon } from 'lucide-react'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

type DropDownMenu = {
  data: DropDownMenuItemType[];
  header: string;
  headerIcon?: IconType;
}

export const List = (props: DropDownMenu) => {
  const { data, header, headerIcon: HeaderIcon } = props;

  const [selectedPeople, setSelectedPeople] = useState()

  console.log(selectedPeople);

  return (
    <>
      <Listbox as={"div"} className={"w-56 relative"} value={selectedPeople} onChange={setSelectedPeople} multiple>
        {/* <Listbox.Button>
          {selectedPeople.map((person) => person.name).join(', ')}
        </Listbox.Button> */}
        <Listbox.Button className="relative w-full inline-flex justify-between items-center cursor-pointer rounded-2xl bg-slate-600 py-2 px-2 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          {/* <HeaderIcon /> */}
          Select Categories
          <TbChevronDown
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />

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
          <Listbox.Options className={"w-56 absolute right-0 z-10 mt-2 pb-2 bg-slate-500 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"}>
            {data.map((item, idx) => (
              <Listbox.Option key={idx} value={item} className={"block pt-2 px-2 text-sm"}>
                {({ selected }) => (
                  <>
                    <span
                      className={`relative block truncate rounded-2xl py-2 px-2 w-full hover:bg-slate-700 ${selected ? 'font-medium bg-slate-700' : 'font-normal'
                        }`}
                    >
                      {item.name}
                      {selected ? (
                        <span className="absolute inset-y-0 right-1 flex items-center pl-3 text-white-600">
                          {/* <XCircleIcon className="h-5 w-5" aria-hidden="true" /> */}222
                        </span>
                      ) : null}
                    </span>

                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </>
  )
}
