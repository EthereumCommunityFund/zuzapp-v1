import { useRouter } from 'next/router';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import Button from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils';
import { SignInDialog } from '../HomePageTemplate';
import { useGlobalContext } from '@/context/GlobalContext';

type CreateEventProps = {
  btnTitle: string;
  className?: string;
};
const DarkPlusIcon = () => {
  return (
    <div className="bg-white p-2 rounded-full">
      <PlusIcon fill="black" />
    </div>
  );
};

export const CreateEvent = ({ btnTitle, className }: CreateEventProps) => {
  const { isAuthenticated, user } = useGlobalContext();
  const router = useRouter();

  const routeToCreateEventsPage = () => {
    router.push({
      pathname: `/dashboard/events/create`,
    });
  };
  const button = (
    <Button
      onClick={() => {
        if (isAuthenticated) {
          router.push(`/dashboard/events/create`);
        }
      }}
      size="sm"
      className="flex py-2 my-4 text-sm bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold border-b-[1px] border-white/10 hover:bg-white/20 duration-200 rounded-xl border-none"
      leftIcon={DarkPlusIcon}
    >
      {btnTitle}
    </Button>
  );
  return (
    <>
      <div className={cn('flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch', className)}>
        {/* <Button
          onClick={routeToCreateEventsPage}
          size="sm"
          className="flex py-2 my-4 text-sm bg-[#383B3B] hover:bg-[#383B3B] text-textSecondary hover:text-textSecondary self-stretch font-semibold border-b-[1px] border-white/10 hover:bg-white/20 duration-200 rounded-xl border-none"
          leftIcon={DarkPlusIcon}
        >
          {btnTitle}
        </Button> */}
        {isAuthenticated ? button : <SignInDialog>{button}</SignInDialog>}
      </div>
    </>
  );
};
