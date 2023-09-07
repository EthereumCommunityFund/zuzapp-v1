import EventSpaceLabel from "../ui/labels/event-space-label";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FormControl, FormItem, FormLabel } from "../ui/form";

export default function EventFormat(){
  return (
    <div className="flex flex-col gap-3 border-b">
      <EventSpaceLabel name="Event Format"/>
      <EventDeatilsDescription1 name="The format you select will determine what information will be required going forward" />
      {/* <RadioGroupItem value="In-Person"/> */}
    </div>
  )
}