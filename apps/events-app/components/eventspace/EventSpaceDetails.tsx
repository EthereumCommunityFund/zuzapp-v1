import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { ChangeEvent, useEffect, useState } from 'react';

import { EventSpaceDetailsType, InputFieldType } from '@/types';
import EventFormat from './EventFormat';
import EventLinks from './EventLinks';
import EditionButtons from '@/components/ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import SectionInputFormDescription from '../ui/SectionInputFormDescription';
import InputFieldDark from '../ui/inputFieldDark';
import TextEditor from '../ui/TextEditor';
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import EventLocation from "./EventLocation";
import { eventCategories } from "@/constant/eventcategories";
import { GoXCircle } from "react-icons/go";
import { experienceLevels } from "@/constant/experienceelevels";
import CustomDatePicker from "../ui/DatePicker";


interface EventSpaceDetailsProps {
  eventSpace: EventSpaceDetailsType;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event Format is required.",
  }),
  event_format: z.enum(["in-person", "online", "hybrid"], {
    required_error: "You need to select an event type.",
  }),
})

const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({ eventSpace }) => {
  const { id, name, event_space_type, status, start_date, end_date, description, format, event_type, experience_level, eventspacelocation } = eventSpace;
  const [selectedEventFormat, setSelectedEventFormat] = useState('');
  const [eventDescriptionEditorValue, setEventDescriptionEditorValue] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleEditorChange = (value: string) => {
    setEventDescriptionEditorValue(value);
  }

  const handleStartDateChange = (selectedDate: Date | null) => {
    if (selectedDate)
      setStartDate(selectedDate);
  }

  const handleEndDateChange = (selectedDate: Date | null) => {
    if (selectedDate)
      setEndDate(selectedDate);
  }

  // const updateEventFormat = (newEventFormat: string) => {
  //   setEventFormat(newEventFormat);
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      event_format: format,
    },
  })

  const handleEventFormatChange = (e: string) => {
    setSelectedEventFormat(e)
    // setEventFormat(selectedEventFormat);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Access the selected event_format from form.getValues()
      const selectedEventFormat = form.getValues("event_format");

      // Now you can use the selectedEventFormat in your code
      console.log("Selected Event Format:", selectedEventFormat);

      // Rest of your code...
    } catch (error) {
      console.error(error);
    }
    // try {
    //   const result = await createEventSpace(values)
    //   setEventCreated(true)
    //   console.log(result)
    // } catch (error) {
    //   setEventCreated(false)
    //   console.log(error)
    // }
  }

  useEffect(() => {
    console.log('Selected Event Format:', selectedEventFormat);
    // Perform any actions based on the selected event_format here
  }, [selectedEventFormat]);
  // const { eventFormat, setEventFormat } = useState<string>('');

  // const updateEventFormat = (newEventFormat: string) => {
  //   setEventFormat(newEventFormat);
  // }

  return (
    <>
      <div className="flex py-10 px-4 flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full">
        <div className="flex flex-col gap-[34px] w-full">
          <h1 className="text-[25px] font-normal leading-[1.2]">Event Space Details</h1>
          <h2 className="text-2xl opacity-80 leading-[1.2]">Event Basics</h2>
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Event Space Name</h2>
            <InputFieldDark type={InputFieldType.Primary} placeholder={"ZuConnect"} />
          </div>
          <div>
            <div className="flex gap-3">
              <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Start Date</h2>
                <CustomDatePicker selectedDate={startDate} handleDateChange={handleStartDateChange} />
                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
              </div>
              <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">End Date</h2>
                <CustomDatePicker selectedDate={endDate} handleDateChange={handleEndDateChange} />
                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Event Tagline</h2>
            <InputFieldDark type={InputFieldType.Primary} placeholder={"Coolest Web3 Events"} />
            <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">This will be the short tagline below your event title</h3>
          </div>
          <div>
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Event Description</h2>
              <TextEditor
                value={eventDescriptionEditorValue}
                onChange={handleEditorChange}
              />
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="event_format"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl opacity-80 leading-[1.2]">Event Format</FormLabel>
                    <FormDescription>
                      The format you select will determine what information will be required going forward
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handleEventFormatChange}
                        defaultValue={field.value}
                        className="flex flex-col md:flex-row justify-between"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="in-person" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer hover:bg-itemHover">
                            In-Person
                            <span className="text-xs block">This is a physical event</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="online" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer">
                            Online
                            <span className="text-xs block">Specifically Online Event</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hybrid" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer">
                            Hybrid
                            <span className="text-xs block">In-Person & Online</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {selectedEventFormat !== "in-person" && <EventLinks />}
          {/* <EventLinks /> */}
          <div className="flex flex-col gap-[34px]">
            <div className="flex flex-col gap-2.5">
              <h2 className="h-6 opacity-70 font-bold text-xl leading-6">Manage Event Categories & Labels</h2>
              <span className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px] self-stretch">These will be shared as attributes by subsequent Sub-Events & Schedules you create.</span>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Add Event Types</h2>
              <InputFieldDark type={InputFieldType.Primary} placeholder={"Meetups, Workshop, Part, etc"} />
              <div className="flex gap-2.5">
                {
                  eventCategories.map((eventCategory) => (
                    <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                      <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" />
                        <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">{eventCategory.name}</span>
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">Experience Levels</span>
              <InputFieldDark type={InputFieldType.Primary} placeholder={"Begineer, Intermidate, Advanced"} />
              <div className="flex gap-2.5">
                {
                  experienceLevels.map((experienceLevel) => (
                    <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                      <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" />
                        <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">{experienceLevel.name}</span>
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <EditionButtons type={'eventspace'} leftButtonName={'Discard'} rightButtonName={'Save Edit'} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowUp} />
        </div>
      </div>
      {selectedEventFormat !== "online" && <EventLocation />}
      {/* <EventLocation /> */}
    </>

  );
};

export default EventSpaceDetails;
