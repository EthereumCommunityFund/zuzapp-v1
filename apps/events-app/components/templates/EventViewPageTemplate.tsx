import { useEventSpace } from "@/context/EventSpaceContext"
import InPersonEventViewPageTemplate from "./InPersonEventViewPageTemplate";
import OnlineEventViewPageTemplate from "./OnlineEventViewPageTemplate";

export default function EventViewPageTemplate() {
  const { eventSpace } = useEventSpace();
  console.log("EventViewPageTemplate", eventSpace);
  return (
    <>
      {eventSpace?.format === "in-person" && <InPersonEventViewPageTemplate eventSpace={eventSpace} />}
      {eventSpace?.format === "online" && <OnlineEventViewPageTemplate eventSpace={eventSpace} />}
    </>
  )
}