import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import {} from '@radix-ui/react-dropdown-menu';
import { CreateEvent } from '@/components/templates/events/CreateEvent';

const CreateEventSpace = () => {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <div className="rounded-[60px] flex border p-3 border-[#333435] bg-white/10 hover:bg-white/20 duration-200">
            <PlusIcon />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="flex top-[10px] flex-col items-center self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50 w-72">
          <h1 className="font-semibold ml-4 mr-auto text-white py-5">Create</h1>
          <DropdownMenu.Separator className="border-[0.5px] border-white/20 w-full" />
          {/* <div className="flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch">
            <Button
              onClick={routeToCreateEventsPage}
              size="sm"
              className="flex py-2 my-4 text-sm bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold border-b-[1px] border-white/10 hover:bg-white/20 duration-200 rounded-xl border-none"
              leftIcon={DarkPlusIcon}
            >
              Create Event Space
            </Button>
          </div> */}
          <CreateEvent btnTitle={'Create Event Space'} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default CreateEventSpace;
