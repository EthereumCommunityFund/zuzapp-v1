import DatePicker from "../ui/DatePicker";
import InputWrapper from "../ui/Input-Wrapper";
import EventDeatilsDescription from "../ui/labels/event-details-description";
import EventSpaceLabel from "../ui/labels/event-space-label";
import InputFieldLabel from "../ui/labels/input-field-label";

export default function EventBasics(){
  return (
    <>
      <EventSpaceLabel name="Event Basics" />
      <div>
        <div className="flex flex-col gap-[14px]">
          <InputFieldLabel name="Event Space Name"/>
          <InputWrapper>
            <input value={"ZuConnect"} className="bg-[#242727] h-4 w-full"></input>
          </InputWrapper>
        </div>
      </div>
      <div>
        <div className="flex gap-[14px]">
          <div className="w-1/2 flex flex-col gap-[14px]">
            <InputFieldLabel name="Start Date"/>
              <InputWrapper>
                <DatePicker />
              </InputWrapper>
            <EventDeatilsDescription name="Click & Select or type in a date"/>
          </div>
          <div className="w-1/2 flex flex-col gap-[14px]">
          <InputFieldLabel name="End Date"/>
            <InputWrapper>
              <DatePicker />
            </InputWrapper>
          <EventDeatilsDescription name="Click & Select or type in a date"/>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-[14px]">
          <InputFieldLabel name="Event Tagline"/>
          <InputWrapper>
            <input value={"Coolest Web3 Events"} className="bg-[#242727] h-4 w-full"></input>
          </InputWrapper>
          <EventDeatilsDescription name="This will be the short tagline below your event title"/>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-[10px]">
          <InputFieldLabel name="Event Description"/>

        </div>
      </div>
    </>
  )
}