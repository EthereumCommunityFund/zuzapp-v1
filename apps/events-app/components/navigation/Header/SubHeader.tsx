import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { tabButtonLists } from "./TabButtons";
import TabButton from "./TabButton";
import Event from "./Event";
import Button from "@/components/ui/buttons/Button";
import { SubHeaderTabIndex } from "@/types";

import AddToEventButton from "./AddToEvent";

export default function SubHeader() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SubHeaderTabIndex>();

  const goBackToPreviousPage = () => {
    router.back();
  };
  const goTabButton = (path: string, index: any) => {
    router.push(path);
    setActiveTab(index);
  }

  useEffect(() => {
    const currentUrl = router.asPath;
    if (currentUrl.includes('/spacedashboard')) {
      setActiveTab(SubHeaderTabIndex.Dashboard);
    } else if (currentUrl.includes('/tracks')) {
      setActiveTab(SubHeaderTabIndex.Track);
    } else if (currentUrl.includes('/schedules')) {
      setActiveTab(SubHeaderTabIndex.Schedules);
    }
  }, [router]);

  return (
    <div className="flex fixed right-0 left-[260px] h-20 z-[100] bg-bgPrimary border-b border-white/20 px-5 justify-between items-center self-stretch backdrop-blur-20">
      <div className="flex gap-[10px] items-center self-stretch">
        <Button
          className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
          size="lg"
          leftIcon={FaCircleArrowLeft}
          onClick={goBackToPreviousPage}
        >
          Exit
        </Button>
        <Event name={"ZuConnect"} />
      </div>
      <div className="flex box-border h-full">
        {
          tabButtonLists.map((tabButton, index: number) => {
            return (
              <TabButton
                key={index}
                name={tabButton.name}
                ButtonIcon={tabButton.icon}
                onClick={() => goTabButton(tabButton.path, index)}
                isActive={index === activeTab}
              />
            )
          })
        }
      </div>
      <AddToEventButton className="hidden sm:block" />
    </div>
  );
}
