import EventLocationEditionButtons from "../eventspace/EventLocationEditionButtons";

export default function Location() {
  return (
    <div className="flex rounded-[10px] border border-opacity-10 border-white p-3.5 gap-[30px] bg-[#2B2E2E] bg-opacity-10">
      <img src="/images/Avatar.png" alt="Avatar" width={42} height={42} className="rounded-[6px]"/>
      <div className="opacity-50 gap-5 flex items-center w-1/2">
        <span className="font-semibold text-lg leading-[21.6px] text-white">The Waterfront</span>
      </div>
      <EventLocationEditionButtons />
    </div>
  )
}