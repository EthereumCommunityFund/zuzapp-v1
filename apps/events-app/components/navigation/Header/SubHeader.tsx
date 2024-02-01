import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { tabButtonLists } from './TabButtons';
import TabButton from './TabButton';
import Event from './Event';
import Button from '@/components/ui/buttons/Button';
import { SubHeaderTabIndex } from '@/types';
import AddToEventButton from './AddToEvent';
import { HiArrowLeft } from 'react-icons/hi';
import useEventDetails from '@/hooks/useCurrentEventSpace';

export default function SubHeader() {
  const router = useRouter();
  const { event_space_id } = router.query;
  // const { eventSpace } = useEventSpace();
  const { eventSpace } = useEventDetails();
  const [activeTab, setActiveTab] = useState<SubHeaderTabIndex>();
  const goBackToPreviousPage = () => {
    router.back();
  };
  const goTabButton = (path: string, index: any) => {
    router.push({
      pathname: path,
      query: { event_space_id: event_space_id }, // Pass space ID as a query parameter
    });
    setActiveTab(index);
  };

  const handleExitButton = () => {
    router.push({
      pathname: '/dashboard/events/myspaces',
      query: { event_space_id: event_space_id }, // Pass space ID as a query parameter
    });
  };

  useEffect(() => {
    const currentUrl = router.asPath;
    if (currentUrl.includes('/events/space/dashboard')) {
      setActiveTab(SubHeaderTabIndex.SpaceDashboard);
    } else if (currentUrl.includes('/events/space/tracks')) {
      setActiveTab(SubHeaderTabIndex.SpaceTrack);
    } else if (currentUrl.includes('/events/space/schedules')) {
      setActiveTab(SubHeaderTabIndex.AllSchedules);
    }
  }, [router]);

  return (
    <div className="flex flex-col lg:flex-row fixed w-full lg:w-auto right-0 lg:left-[290px] lg:h-20 z-40 bg-bgPrimary border-b border-white/20 lg:px-5 justify-between lg:items-center self-stretch backdrop-blur-20 bg-pagePrimary">
      {router.asPath.includes('/events/create') ? (
        <Button
          className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
          size="lg"
          leftIcon={HiArrowLeft}
          onClick={goBackToPreviousPage}
        >
          Back
        </Button>
      ) : (
        <>
          <div className="flex gap-[10px] py-3 items-center self-stretch">
            <Button
              className="rounded-[40px] text-sm py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={FaCircleArrowLeft}
              onClick={handleExitButton}
            >
              Exit
            </Button>
            <Event name={eventSpace?.name as string} />
          </div>
          <div className="flex box-border lg:h-full">
            {tabButtonLists.map((tabButton, index: number) => {
              return <TabButton key={index} name={tabButton.name} ButtonIcon={tabButton.icon} onClick={() => goTabButton(tabButton.path, index)} isActive={index === activeTab} />;
            })}
          </div>
          {/* <AddToEventButton className="hidden sm:block" /> */}
        </>
      )}
    </div>
  );
}
