import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useRef, useState } from 'react';
import { EventSpaceDetailsType, EventSpaceUpdateRequestBody, InputFieldType, MainLocationType } from '@/types';
import EventLinks from './EventLinks';
import { FaCircleArrowUp } from 'react-icons/fa6';
import InputFieldDark from '../ui/inputFieldDark';
import TextEditor from '../ui/TextEditor';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GoXCircleFill } from 'react-icons/go';
import CustomDatePicker from '../ui/DatePicker';
import { useRouter } from 'next/router';
import { updateEventSpace } from '@/controllers';
import { useQueryClient } from 'react-query';
import Button from '../ui/buttons/Button';
import { EventBanner } from './EventBanner';
import IconButton from '../ui/buttons/IconButton';
import { RxPlus } from 'react-icons/rx';
import { toast } from '../ui/use-toast';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Label } from '../ui/label';
import DragAndDrop from '../ui/dragDrop';
import { Input } from '../ui/input';
import Image from 'next/image';
import { formSchema } from '@/constant/formschema';
dayjs.extend(isSameOrAfter);

interface SocialMediaFormState {
  socialMediaLinks: { label: string; link: string }[];
  otherLinks: { label: string; link: string }[];
  selectedOption: string;
  selectedOtherOption: string;
}
interface LocationPayloadsState {
  image_urls: string[];
  event_space_id: string;
}
interface EventSpaceFormProps {
  eventSpace: EventSpaceDetailsType;
  detailsUpdated: boolean;
  setDetailsUpdated: any;
}

export const EventSpaceForm = ({ eventSpace, detailsUpdated, setDetailsUpdated }: EventSpaceFormProps) => {
  const {
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
    image_url,
    main_location,
    main_location_id,
  } = eventSpace;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      format: format,
      start_date: start_date !== undefined && start_date !== null ? new Date(start_date) : new Date(),
      end_date: end_date !== undefined && end_date !== null ? new Date(end_date) : new Date(),
      description: description,
      locationName: main_location?.name || '',
      locationAddress: main_location?.address || '',
      locationCapacity: main_location?.capacity || 0,
      locationDescription: main_location?.description || '',
    },
  });

  const [socialLinks, setSocialLinks] = useState(social_links && social_links !== 'null' ? JSON.parse(social_links as string) : []);
  const [extraLinks, setExtraLinks] = useState(extra_links && extra_links !== 'null' ? JSON.parse(extra_links as string) : []);
  const [banner, setBanner] = useState(image_url);
  const [selectedEventFormat, setSelectedEventFormat] = useState('');
  const [tag_line, setTagline] = useState(tagline);
  const [eventType, setEventType] = useState<string[]>(event_type !== null ? (event_type as string[]) : []);
  const [experienceLevels, setExperienceLevels] = useState<string[]>(experience_level !== null ? (experience_level as string[]) : []);
  const [eventItem, setEventItem] = useState('');
  const [experienceItem, setExperienceItem] = useState('');
  const router = useRouter();
  const { event_space_id } = router.query;
  // const [detailsUpdated, setDetailsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onSubmitWithEnter = (values: z.infer<typeof formSchema>) => {
    return null;
  };

  const [formData, setFormData] = useState<SocialMediaFormState>({
    socialMediaLinks: [],
    otherLinks: [],
    selectedOption: 'facebook',
    selectedOtherOption: '',
  });

  const [locationPayloads, setLocationPayloads] = useState<LocationPayloadsState>({
    image_urls: [],
    event_space_id: eventSpace.id,
  });

  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleRemoveEventType = (index: number) => {
    const updatedItems = [...eventType.slice(0, index), ...eventType.slice(index + 1)];
    setEventType(updatedItems);
  };

  const handleRemoveExperienceLevels = (index: number) => {
    const updatedItems = [...experienceLevels.slice(0, index), ...experienceLevels.slice(index + 1)];
    setExperienceLevels(updatedItems);
  };

  const addEventTypes = (eventTypeData: string) => {
    if (eventTypeData === '') {
      toast({
        title: 'Error',
        description: 'Event Type is required',
        variant: 'destructive',
      });
      return;
    }
    setEventType([...eventType, eventTypeData]);
    setEventItem('');
  };

  const addExperienceLevels = (experienceLevelData: string) => {
    if (experienceLevelData === '') {
      toast({
        title: 'Error',
        description: 'Experience Level is required',
        variant: 'destructive',
      });
      return;
    }
    setExperienceLevels([...experienceLevels, experienceLevelData]);
    setExperienceItem('');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const endDate = dayjs(values.end_date);
    const startDate = dayjs(values.start_date);
    if (endDate.isBefore(startDate)) {
      form.setError('end_date', {
        message: 'End date cannot be earlier than start date',
      });
      return;
    }

    const mainLocation: MainLocationType = {
      // id: main_location_id,
      ...(main_location_id && { id: main_location_id }),
      name: values.locationName,
      address: values.locationAddress,
      capacity: values.locationCapacity,
      description: values.locationDescription,
      image_urls: locationPayloads.image_urls,
    };

    const additionalPayload = {
      id: event_space_id as string,
      status: status,
      event_type: eventType,
      experience_level: experienceLevels,
      event_space_type: 'tracks' as 'tracks',
      tagline: tag_line,
      image_url: banner,
      social_links: JSON.stringify(socialLinks),
      extra_links: JSON.stringify(extraLinks),
      main_location: mainLocation,
    };
    // const payload = { ...values, ...additionalPayload };
    const payload = {
      name: values.name,
      format: values.format,
      start_date: values.start_date,
      end_date: values.end_date,
      description: values.description,
      ...additionalPayload,
    };

    try {
      setIsLoading(true);
      console.log(payload, 'my payload');
      const result = await updateEventSpace(event_space_id as string, payload as unknown as EventSpaceUpdateRequestBody);
      setDetailsUpdated(true);
      queryClient.invalidateQueries({ queryKey: ['currentEventSpace'] });
      toast({
        title: 'Details updated successfully',
      });
    } catch (error: any) {
      console.log(error, 'error');
      toast({
        title: 'Error',
        description: error.response.data.error,
        variant: 'destructive',
      });
    }
  }
  useEffect(() => {
    // Check if the main_location has image_urls and they are not already in locationPayloads
    if (main_location?.image_urls?.length > 0 && locationPayloads.image_urls.length === 0) {
      setLocationPayloads((prevState) => ({
        ...prevState,
        image_urls: main_location.image_urls,
      }));
    }
  }, [main_location, locationPayloads.image_urls.length]);

  useEffect(() => {
    //get the first item from the errors object
    const firstError = Object.values(form.formState.errors)[0];
    if (firstError) {
      toast({
        title: 'Error',
        description: firstError?.message,
        variant: 'destructive',
      });
    }
  }, [form.formState.errors]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitWithEnter)}
          className="flex lg:py-8 px-4 flex-col items-center gap-8 lg:rounded-2xl lg:border border-white border-opacity-10 lg:bg-componentPrimary w-full"
        >
          <div className="flex flex-col gap-[34px] w-full">
            <h1 className="text-[25px] font-normal leading-[1.2]">Event Space Details</h1>
            <h2 className="text-2xl opacity-80 leading-[1.2]" ref={sectionRefs[0]}>
              Event Basics
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Event Space Name </FormLabel>
                  <FormControl>
                    <InputFieldDark type={InputFieldType.Primary} placeholder={'ZuConnect'} defaultValue={name} {...field} />
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
                      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Start Date</h2>

                      <CustomDatePicker defaultDate={undefined} selectedDate={field.value} handleDateChange={field.onChange} {...field} />

                      <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">End Date</h2>
                      <CustomDatePicker defaultDate={undefined} selectedDate={field.value} handleDateChange={field.onChange} {...field} />

                      <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Event Tagline</h2>
              <InputFieldDark type={InputFieldType.Primary} value={tag_line} onChange={(e) => setTagline((e.target as HTMLInputElement).value)} placeholder={'Coolest Web3 Events'} />
              <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">This will be the short tagline below your event title</h3>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-[10px]">
                      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Event Description</h2>
                      <TextEditor value={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            <EventBanner banner={banner} setBanner={setBanner} />
            {!banner && <p className="text-sm text-btnRed">Select at least one image</p>}

            <div className="space-y-10">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl opacity-80 leading-[1.2]" ref={sectionRefs[1]}>
                      Event Format
                    </FormLabel>
                    <FormDescription>The format you select will determine what information will be required going forward</FormDescription>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row">
                        <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer p-3 hover:bg-btnPrimaryGreen/20 rounded-md focus:bg-btnPrimaryGreen/20">
                          <FormControl>
                            <RadioGroupItem value="in-person" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/60 text-base cursor-pointer">
                            In-Person
                            <span className="text-xs block">This is a physical event</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer p-3 hover:bg-btnPrimaryGreen/20 rounded-md focus:bg-btnPrimaryGreen/20">
                          <FormControl>
                            <RadioGroupItem value="online" />
                          </FormControl>
                          <FormLabel className="font-semibold text-white/60 text-base cursor-pointer">
                            Online
                            <span className="text-xs block">Specifically Online Event</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full" ref={sectionRefs[2]}>
              {selectedEventFormat !== 'in-person' && (
                <EventLinks social_links={socialLinks} setSocialLinks={setSocialLinks} extra_links={extraLinks} setExtraLinks={setExtraLinks} formData={formData} setFormData={setFormData} />
              )}
            </div>
            <div className="flex flex-col gap-[34px]" ref={sectionRefs[3]}>
              <div className="flex flex-col gap-2.5">
                <Label className="h-6 opacity-70 font-bold text-xl leading-6">Manage Event Categories & Labels</Label>
                <Label className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px]">These will be shared as attributes by subsequent Tracks & Sessions you create.</Label>
              </div>

              <div className="flex flex-col gap-6">
                <Label className="text-lg font-semibold text-white">Add Event Types</Label>
                <div className="flex space-x-3 items-center">
                  <InputFieldDark type={InputFieldType.Primary} value={eventItem} onChange={(e) => setEventItem((e.target as HTMLInputElement).value)} placeholder={'Meetups, Workshops, etc'} />
                  <div>
                    <IconButton
                      variant="dark"
                      className="rounded-full"
                      icon={RxPlus}
                      onClick={() => {
                        addEventTypes(eventItem);
                      }}
                    ></IconButton>
                  </div>
                </div>
                <div className="flex items-start flex-wrap gap-2.5">
                  {eventType?.map((eventCategory, index) => (
                    <div key={eventCategory} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                      <button type="button" className="flex gap-2.5 items-center">
                        <GoXCircleFill onClick={() => handleRemoveEventType(index)} className="top-0.5 left-0.5 w-4 h-4" />
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">{eventCategory}</Label>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <Label className="text-lg font-semibold text-white">Experience Levels</Label>
                <div className="flex space-x-3 items-center">
                  <InputFieldDark
                    type={InputFieldType.Primary}
                    value={experienceItem}
                    onChange={(e) => setExperienceItem((e.target as HTMLInputElement).value)}
                    placeholder={'Beginner, Intermediate, Advanced, etc'}
                  />
                  <IconButton
                    variant="dark"
                    className="rounded-full"
                    icon={RxPlus}
                    onClick={() => {
                      addExperienceLevels(experienceItem);
                    }}
                  />
                </div>
                <div className="flex place-content-start items-start flex-wrap gap-2.5">
                  {experienceLevels?.map((experience, index) => (
                    <div key={experience} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                      <button type="button" className="flex gap-2.5 items-center">
                        <GoXCircleFill onClick={() => handleRemoveExperienceLevels(index)} className="top-0.5 left-0.5 w-4 h-4" />
                        <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">{experience}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border border-borderPrimary" />
              <div className="flex flex-col gap-8" ref={sectionRefs[4]}>
                <div className="flex flex-col gap-2">
                  <Label className="text-2xl font-bold text-white/70">Main Address</Label>
                  <Label className="text-sm text-white/70">Enter the details of the main location for the event</Label>
                </div>
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg">Location Name</FormLabel>
                      <FormControl>
                        <Input className="bg-inputField" placeholder={'Name of this location'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg">Address </FormLabel>
                      <FormControl>
                        <Input className="bg-inputField" placeholder={'Type the address'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationCapacity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg">Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="bg-inputField"
                          placeholder={'Enter a number'}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          value={field.value} // Make sure to bind the value from the form
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationDescription"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="flex flex-col gap-[10px]">
                          <Label className="text-lg font-semibold text-white">Location Description</Label>
                          <TextEditor value={field.value} onChange={field.onChange} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 w-full">
                  <Label className="text-lg font-semibold text-white">Location Media</Label>
                  <DragAndDrop payload={locationPayloads} setPayload={setLocationPayloads} title={`Select Main Location Image`} />
                  {/* <Label className="text-xs text-white/50">We recommend using at least a 2160x1080px</Label> */}
                </div>
                {/* {locationPayloads.image_urls.length == 0 && <p className="text-sm text-btnRed">Select at least one image</p>} */}
                {locationPayloads.image_urls.length > 0 && (
                  <div className="flex gap-5">
                    {locationPayloads.image_urls.map((source, index) => (
                      <div className="w-full" key={index}>
                        <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
                          {/* <IconButton variant="dark" className="rounded-full absolute z-10 right-[-5px] top-[-5px]" onClick={() => handleRemoveImage(index)} icon={CgClose} /> */}
                          <Image src={source} alt="Main Location Image" fill className="object-contain" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center pt-8">
              <div className="flex flex-col lg:flex-row gap-[30px] w-full">
                {/* <Button className="rounded-full w-full lg:w-1/2 flex justify-center" variant="quiet" size="lg" type="button" leftIcon={CgClose}>
                          <span>Discard Edit</span>
                        </Button> */}
                <Button className="rounded-full w-full md:w-full lg:w-full flex justify-center" variant="blue" size="lg" onClick={() => form.handleSubmit(onSubmit)()} leftIcon={FaCircleArrowUp}>
                  {isLoading && !detailsUpdated ? <div className="">submitting...</div> : <span>Save Edit</span>}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
