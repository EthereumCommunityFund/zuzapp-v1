import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft } from "react-icons/hi";
import DetailsBar from "@/components/detailsbar";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import ScheduleLabels from "@/components/schedule/ScheduleLabels";
import EditionButtons from "@/components/ui/buttons/EditionButtons";

import { CgClose } from "react-icons/cg";
import { FaCircleArrowUp } from "react-icons/fa6";
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
import { useForm } from "react-hook-form";
import { useState } from "react";
import FormTitle from "@/components/ui/labels/form-title";
import InputFieldDark from "@/components/ui/inputFieldDark";
import { InputFieldType } from "@/types";
import TextEditor from "@/components/ui/TextEditor";
import { Label } from "@/components/ui/label";
import SwitchButton from "@/components/ui/buttons/SwitchButton";
import { GoXCircle } from "react-icons/go";
import InputFieldLabel from "@/components/ui/labels/inputFieldLabel";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event Format is required.",
  }),
  schedule_format: z.enum(["in-person", "online", "hybrid"], {
    required_error: "You need to select an event type.",
  }),
})

export default function AddSchedulePage() {
  const [selectedEventFormat, setSelectedEventFormat] = useState('');

  const [isAllDay, setIsAllDay] = useState(false);

  const handleChangeSwitch = () => {
    setIsAllDay(prev => !prev);
  }

  const [isLimit, setIsLimit] = useState(false);

  const handleLimitRSVP = () => {
    setIsLimit(prev => !prev);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      schedule_format: undefined,
    },
  })

  const handleEventFormatChange = (e: string) => {
    setSelectedEventFormat(e)
    // setEventFormat(selectedEventFormat);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Access the selected event_format from form.getValues()
      const selectedEventFormat = form.getValues("schedule_format");

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

  return (
    <div className="flex items-start gap-[60px] self-stretch px-10 py-5">
      <DetailsBar />
      <div className="flex flex-col items-start gap-[17px] flex-1">
        <div className="flex items-center gap-[17px] self-stretch">
          <Button
            className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
            size="lg"
            leftIcon={HiArrowLeft}
          >
            Back
          </Button>
          <div className="flex flex-col gap-[10px]">
            <span className="text-2xl items-start font-bold">ZK Week</span>
            <span className="text-sm opacity-70">You are adding a schedule for this track</span>
          </div>
        </div>
        <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-[#FFFFFF10] bg-[#2E3131]">
          <div className="flex flex-col items-center gap-[34px] self-stretch w-full">
            <FormTitle name="Add a Schedule" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 w-full">
                <FormField
                  control={form.control}
                  name="schedule_format"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-2xl opacity-80 leading-[1.2]">Schedule Format</FormLabel>
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
            <div className="flex flex-col gap-[10px] w-full">
              <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Schedule Name</Label>
              <InputFieldDark type={InputFieldType.Primary} placeholder={"Enter a name for your event"} />
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-[10px]">
                <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Schedule Description</Label>
                <TextEditor value={""} onChange={function (value: string): void {
                  throw new Error("Function not implemented.");
                }} />
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-xl opacity-70 self-stretch">Schedule Date & Times</h2>
              <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                <div className="flex gap-5">
                  <SwitchButton value={isAllDay} onClick={handleChangeSwitch} />
                  <span className="text-lg opacity-70 self-stretch">All Day</span>
                </div>
                <div className="flex items-center gap-[30px] self-stretch w-full">
                  <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                    <span className="text-lg opacity-70 self-stretch">Start Date</span>
                    <InputFieldDark type={InputFieldType.Date} placeholder={"00-00-0000"} />
                    <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                  </div>
                  {
                    !isAllDay && (
                      <>
                        <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                          <span className="text-lg opacity-70 self-stretch">Start Time</span>
                          <InputFieldDark type={InputFieldType.Time} placeholder={"00:00"} />
                          <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a time</h3>
                        </div>
                        <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                          <span className="text-lg opacity-70 self-stretch">End Time</span>
                          <InputFieldDark type={InputFieldType.Time} placeholder={"00:00"} />
                          <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a time</h3>
                        </div>
                      </>
                    )
                  }
                </div>
                <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select a Timezone</Label>
                  <InputFieldDark type={InputFieldType.Option} placeholder={"Select Timezone"} />
                </div>
                <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Schedule Frequency</Label>
                  <InputFieldDark type={InputFieldType.Option} placeholder={"Only Once"} />
                </div>
                <line></line>
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-xl opacity-70 self-stretch font-semibold">Location</h2>
              <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Location</Label>
                  <InputFieldDark type={InputFieldType.Option} placeholder={"The Dome"} />
                </div>
              </div>
              <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Video Call Link</Label>
                  <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                  <InputFieldDark type={InputFieldType.Link} placeholder="Type URL" />
                </div>
                <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Live Stream Link</Label>
                  <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                  <InputFieldDark type={InputFieldType.Link} placeholder="Type URL" />
                </div>
              </div>
            </div>
            <line></line>
            <div className="w-full">
              <h2 className="text-xl opacity-70 self-stretch font-semibold pb-5">Roles</h2>
              <div className="flex flex-col gap-6 items-start self-stretch">
                <div className="flex items-start gap-6 self-stretch">
                  <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                    <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Enter Name</Label>
                    <InputFieldDark type={InputFieldType.Primary} placeholder={"Enter the Name"} />
                  </div>
                  <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                    <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Role</Label>
                    <InputFieldDark type={InputFieldType.Option} placeholder={"Speaker"} />
                  </div>
                </div>
                <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                  <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"Janine Leger"} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-6">
            <h2 className="text-lg opacity-70 self-stretch font-bold pb-5">Schedule Labels</h2>
            <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
              <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Event Category</Label>
              <InputFieldDark type={InputFieldType.Option} placeholder={"Workshop"} />
            </div>
            <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
              <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Experience Level</Label>
              <InputFieldDark type={InputFieldType.Option} placeholder={"Beginner"} />
            </div>
            <div className="flex flex-col items-start gap-6 self-stretch">
              <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Add Tags</Label>
                <InputFieldDark type={InputFieldType.Primary} placeholder={"Add new tags"} />
                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Add multiple tags separated by commas.</h3>
              </div>
              <div className="flex items-start gap-[10px]">
                <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                  <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"TagOne"} /></button>
                </div>
                <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                  <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={"TagTwo"} /></button>
                </div>
              </div>
            </div>
            <line />
          </div>
          <div className="w-full">
            <span className="text-lg opacity-70 self-stretch">Advanced</span>
            <div className="flex flex-col items-center gap-5 self-stretch">
              <div className="flex items-center gap-5 self-stretch">
                <SwitchButton value={isLimit} onClick={handleLimitRSVP} />
                <span className="flex-1 text-base font-semibold leading-[1.2]">Limit RSVPs</span>
              </div>
              {
                isLimit && (
                  <div className='flex flex-col gap-[14px] items-start self-stretch w-full'>
                    <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select an Amount</Label>
                    <InputFieldDark type={InputFieldType.Option} placeholder={"50"} />
                  </div>
                )
              }
            </div>
          </div>
          <EditionButtons type={"schedule"} leftButtonName={"Discard Schedule"} rightButtonName={"Add Schedule"} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowUp} />
        </div>
      </div>
    </div >
  )
}
