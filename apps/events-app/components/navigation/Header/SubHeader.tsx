import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import { tabButtonLists } from "./buttons"; 
import TabButton from "./TabButton";

export default function SubHeader() {
  const router = useRouter();
  const goBackToPreviousPage = () => {
    router.back();
  };
  return (
    <>
      <div className="border-b border-white/20 pl-4 justify-between flex">
        <div className="flex">
          <button className="flex items-center mb-3 pr-2 pl-2 font-semibold " onClick={goBackToPreviousPage}>
            <BsArrowLeft className="mr-1" /> Exit
          </button>
          <div className="rounded-xl border border-white/20 flex bg-background font-semibold ">
            <div className="from-neutral-600 text-{rgba(255, 255, 255, 1)} ">Event:</div>
            <div>ZuConnect</div>
          </div>
        </div>
        <div className="flex">
          {
            tabButtonLists.map((tabButton) => {
              return (
                <TabButton name={tabButton.name} ButtonIcon={tabButton.icon} />
              )
            })
          }
        </div>
      </div>
    </>
  );
}
