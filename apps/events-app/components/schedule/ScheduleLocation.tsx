import SectionInputForm from "../ui/SectionInputForm";

export default function ScheduleLocation() {
  return (
    <>
      <span className="text-lg opacity-70 self-stretch">Schedule Date & Times</span>
      <SectionInputForm title={"Select Location"} defaultValue={"The Dome"} inputType={"dropdown"} />
      <SectionInputForm title={"Video Call Link"} defaultValue={"https://"} inputType={"link"} description="Please Provide the Full URL" />
      <SectionInputForm title={"Live Stream URL"} defaultValue={"https://"} inputType={"link"} description="Please Provide the Full URL" />
    </>
  )
}