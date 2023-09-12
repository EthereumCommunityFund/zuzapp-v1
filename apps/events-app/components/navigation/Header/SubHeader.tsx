import { useState } from "react";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import { tabButtonLists } from "./TabButtons";
import TabButton from "./TabButton";
import Event from "./Event";

import AddToEventButton from "./AddToEvent";

export default function SubHeader() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);

  const goBackToPreviousPage = () => {
    router.back();
  };
  const goTabButton = (path: string, index: any) => {
    router.push(path);
    setActiveTab(index);
  }
  return (
    <>
      <div className="border-b border-white/20 pl-4 justify-between flex">
        <div className="flex gap-2.5 items-center">
          <button className="flex items-center pr-2 pl-2 font-semibold" onClick={goBackToPreviousPage}>
            <BsArrowLeft className="mr-1" /> Exit
          </button>
          <Event name={"ZuConnect"} />
        </div>
        <div className="flex">
          {
            tabButtonLists.map((tabButton, index) => {
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
        <AddToEventButton />
      </div>
    </>
  );
}
