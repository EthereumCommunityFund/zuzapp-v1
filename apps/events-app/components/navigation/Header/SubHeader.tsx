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
<<<<<<< HEAD
  const goTabButton = (path: string, index: any) => {
    router.push(path);
    setActiveTab(index);
=======
  const goTabButton = (path: string) => {
    router.push(path);
>>>>>>> df0c4f1 (feat: add tracks page)
  }
  return (
    <>
      <div className="border-b border-white/20 px-5 justify-between flex items-center self-stretch bg-[#22222280] backdrop-blur-20">
        <div className="flex gap-[10px] items-center self-stretch">
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
