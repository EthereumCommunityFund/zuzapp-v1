import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { EventSpaceDetailsType, InputFieldType, LocationType } from "@/types";
import EventFormat from "./EventFormat";
import EventLinks from "./EventLinks";
import EditionButtons from "@/components/ui/buttons/EditionButtons";
import { CgClose } from "react-icons/cg";
import { FaCircleArrowUp } from "react-icons/fa6";
import SectionInputFormDescription from "../ui/SectionInputFormDescription";
import InputFieldDark from "../ui/inputFieldDark";
import TextEditor from "../ui/TextEditor";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import EventLocation from "./EventLocation";
import { eventCategories } from "@/constant/eventcategories";
import { GoXCircle } from "react-icons/go";
// import { experienceLevels } from "@/constant/experienceelevels";
import CustomDatePicker from "../ui/DatePicker";
import { useRouter } from "next/router";
import { updateEventSpace } from "@/controllers";
import { useQueryClient } from "react-query";

interface EventSpaceDetailsProps {
  eventSpace: EventSpaceDetailsType;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event Format is required.",
  }),
  format: z.enum(["in-person", "online", "hybrid"], {
    required_error: "You need to select an event type.",
  }),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  description: z.string().min(2, {
    message: "Description is required.",
  }),
});

const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({
  eventSpace,
}) => {
  const {
    // id,
    name,
    event_space_type,
    status,
    start_date,
    end_date,
    description,
    format,
    event_type,
    experience_level,
    eventspacelocation,
    tagline,
    social_links,
    extra_links,
  } = eventSpace;

  const router = useRouter();

  const queryClient = useQueryClient()

  const [selectedEventFormat, setSelectedEventFormat] = useState("");
  const [eventDescriptionEditorValue, setEventDescriptionEditorValue] =
    useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [tag_line, setTagline] = useState(tagline);
  const [endDate, setEndDate] = useState<Date>();
  const [eventType, setEventType] = useState<string[]>(event_type as string[]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>(
    experience_level as string[]
  );
  const [eventItem, setEventItem] = useState("");
  const [experienceItem, setExperienceItem] = useState("");
  const [location, setLocation] = useState<LocationType[]>(
    eventspacelocation as LocationType[]
  );
  const { eventId } = router.query;

  interface SocialMediaFormState {
    socialMediaLinks: { label: string; link: string }[];
    otherLinks: { label: string; link: string }[];
    selectedOption: string;
    selectedOtherOption: string;
  }

  const [formData, setFormData] = useState<SocialMediaFormState>({
    socialMediaLinks: [],
    otherLinks: [],
    selectedOption: "facebook",
    selectedOtherOption: "",
  });

  const handleEditorChange = (value: string) => {
    setEventDescriptionEditorValue(value);
  };

  const handleStartDateChange = (selectedDate: Date | null) => {
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (selectedDate: Date | null) => {
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleLocationChange = () => {
    const updatedItems = [...location, {}];
    // setLocation(updatedItems);
  };

  const handleRemoveEventType = (index: number) => {
    const updatedItems = [
      ...eventType.slice(0, index),
      ...eventType.slice(index + 1),
    ];
    setEventType(updatedItems);
  };

  const handleRemoveExperienceLevels = (index: number) => {
    const updatedItems = [
      ...experienceLevels.slice(0, index),
      ...experienceLevels.slice(index + 1),
    ];
    setExperienceLevels(updatedItems);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      format,
      start_date: start_date !== undefined ? new Date(start_date) : new Date(),
      end_date: end_date !== undefined ? new Date(end_date) : new Date(),
      description,
      // event_space_type: "tracks",
    },
  });

  const handleEventFormatChange = (e: string) => {
    setSelectedEventFormat(e);
    // setEventFormat(selectedEventFormat);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const additionalPayload = {
      id: eventId as string,
      status: "draft" as "draft",
      event_type: eventType,
      experience_level: experienceLevels,
      event_space_type: "tracks" as "tracks",
      tagline: tag_line,
      social_links: JSON.stringify(formData.socialMediaLinks),
      extra_links: JSON.stringify(formData.otherLinks),
    };
    const payload = { ...values, ...additionalPayload };
    console.log(payload);
    try {
      const result = await updateEventSpace(eventId as string, payload);
      queryClient.invalidateQueries({ queryKey: ["spaceDetails"] });
      console.log(result, "result");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("Selected Event Format:", selectedEventFormat);
    console.log(eventSpace);
  }, [selectedEventFormat]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex py-10 px-4 flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full"
        >
          <div className="flex flex-col gap-[34px] w-full">
            <h1 className="text-[25px] font-normal leading-[1.2]">
              Event Space Details
            </h1>
            <h2 className="text-2xl opacity-80 leading-[1.2]">Event Basics</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Event Space Name </FormLabel>
                  <FormControl>
                    <InputFieldDark
                      type={InputFieldType.Primary}
                      placeholder={"ZuConnect"}
                      defaultValue={name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                        Start Date
                      </h2>

                      <CustomDatePicker
                        selectedDate={field.value}
                        handleDateChange={field.onChange}
                        {...field}
                      />
                      {/* <Input placeholder="12-03" {...field} /> */}

                      <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">
                        Click & Select or type in a date
                      </h3>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                        End Date
                      </h2>
                      <CustomDatePicker
                        selectedDate={field.value}
                        handleDateChange={field.onChange}
                        {...field}
                      />

                      <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">
                        Click & Select or type in a date
                      </h3>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                Event Tagline
              </h2>
              <InputFieldDark
                type={InputFieldType.Primary}
                value={tag_line}
                onChange={(e) =>
                  setTagline((e.target as HTMLInputElement).value)
                }
                placeholder={"Coolest Web3 Events"}
              />
              <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">
                This will be the short tagline below your event title
              </h3>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="flex flex-col gap-[10px]">
                  <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                    Event Description
                  </h2>
                  <TextEditor value={field.value} onChange={field.onChange} />
                </div>
              )}
            />

            <div className="space-y-10">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl opacity-80 leading-[1.2]">
                      Event Format
                    </FormLabel>
                    <FormDescription>
                      The format you select will determine what information will
                      be required going forward
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col md:flex-row justify-between"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="in-person" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer hover:bg-itemHover">
                            In-Person
                            <span className="text-xs block">
                              This is a physical event
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="online" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer">
                            Online
                            <span className="text-xs block">
                              Specifically Online Event
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hybrid" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/30 text-base cursor-pointer">
                            Hybrid
                            <span className="text-xs block">
                              In-Person & Online
                            </span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* {selectedEventFormat !== 'in-person' && <EventLinks formData={formData} setFormData={setFormData} />} */}
            {/* <EventLinks formData={formData} setFormData={setFormData} /> */}
            <div className="flex flex-col gap-[34px]">
              <div className="flex flex-col gap-2.5">
                <h2 className="h-6 opacity-70 font-bold text-xl leading-6">
                  Manage Event Categories & Labels
                </h2>
                <span className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px] self-stretch">
                  These will be shared as attributes by subsequent Sub-Events &
                  Schedules you create.
                </span>
              </div>

              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                  Add Event Types
                </h2>
                <div className="flex gap-5">
                  <InputFieldDark
                    type={InputFieldType.Primary}
                    value={eventItem}
                    onChange={(e) =>
                      setEventItem((e.target as HTMLInputElement).value)
                    }
                    placeholder={"Meetups, Workshops, etc"}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setEventType([...eventType, eventItem]);
                      setEventItem("");
                    }}
                    className="flex gap-2.5 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2.5">
                  {eventType?.map((eventCategory, index) => (
                    <div
                      key={eventCategory}
                      className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                    >
                      <button className="flex gap-2.5 items-center">
                        <GoXCircle
                          onClick={() => handleRemoveEventType(index)}
                          className="top-0.5 left-0.5 w-4 h-4"
                        />
                        <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          {eventCategory}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* )}
            /> */}
              <div className="flex flex-col gap-6">
                <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                  Experience Levels
                </span>
                <div className="flex gap-5">
                  <InputFieldDark
                    type={InputFieldType.Primary}
                    value={experienceItem}
                    onChange={(e) =>
                      setExperienceItem((e.target as HTMLInputElement).value)
                    }
                    placeholder={"Beginner, Intermediate, Advanced, etc"}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setExperienceLevels([
                        ...experienceLevels,
                        experienceItem,
                      ]);
                      setExperienceItem("");
                    }}
                    className="flex gap-2.5 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2.5">
                  {experienceLevels?.map((experience, index) => (
                    <div
                      key={experience}
                      className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                    >
                      <button className="flex gap-2.5 items-center">
                        <GoXCircle
                          onClick={() => handleRemoveExperienceLevels(index)}
                          className="top-0.5 left-0.5 w-4 h-4"
                        />
                        <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          {experience}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <EditionButtons
              type={"eventspace"}
              leftButtonName={"Discard"}
              rightButtonName={"Save Edit"}
              leftButtonIcon={CgClose}
              rightButtonIcon={FaCircleArrowUp}
            />
          </div>
        </form>
        {/* <EventLocation /> */}
      </Form>
      {selectedEventFormat !== "online" && <EventLocation />}
    </>
  );
};

export default EventSpaceDetails;
