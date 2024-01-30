import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useEffect, useRef, useState } from 'react';

import { EventSpaceDetailsType, EventSpaceStatusUpdateRequestBody, EventSpaceUpdateRequestBody, InputFieldType, MainLocationType, SpaceDashboardCardType } from '@/types';
import EventLinks from './EventLinks';
import { FaCircleArrowUp } from 'react-icons/fa6';
import InputFieldDark from '../ui/inputFieldDark';
import TextEditor from '../ui/TextEditor';
import { useForm } from 'react-hook-form';
import { Loader } from '../ui/Loader';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import EventLocation from './EventLocation';
import { GoXCircleFill } from 'react-icons/go';
// import { experienceLevels } from "@/constant/experienceelevels";
import CustomDatePicker from '../ui/DatePicker';
import { useRouter } from 'next/router';
import { updateEventSpace } from '@/controllers';
import { useQueryClient } from 'react-query';
import Button from '../ui/buttons/Button';
import Link from 'next/link';
import { HiArrowCircleUp, HiArrowLeft, HiArrowRight, HiCalendar, HiXCircle } from 'react-icons/hi';
import { EventBanner } from './EventBanner';
import IconButton from '../ui/buttons/IconButton';
import { RxPlus } from 'react-icons/rx';
import { toast } from '../ui/use-toast';
import { add } from 'libsodium-wrappers';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { eventDetailsList } from '@/constant/eventdetails';
import { Label } from '../ui/label';
import DragAndDrop from '../ui/dragDrop';
import { Input } from '../ui/input';
import Image from 'next/image';
import { updateEventSpaceStatus } from '@/controllers';
import EditionButtons from '../ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdCancel } from 'react-icons/md';
import { deleteEventSpaceById } from '@/services/deleteEventSpaces';
dayjs.extend(isSameOrAfter);

interface EventSpaceDetailsProps {
  eventSpace: EventSpaceDetailsType;
  handleGoBack: () => void;
  isLoadingEvent: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Event Name is required.',
  }),
  format: z.enum(['in-person', 'online'], {
    required_error: 'You need to select an event type.',
  }),
  start_date: z.date({
    required_error: 'You need to select a valid date for this event.',
    invalid_type_error: 'You need to select a valid date for this event.',
  }),
  end_date: z.date({
    required_error: 'You need to select a valid date for this event.',
    invalid_type_error: 'You need to select a valid date for this event.',
  }),
  description: z.string().min(5, {
    message: 'Description is required and is a minimum of 5 characters',
  }),
  locationName: z.string().min(2, {
    message: 'Main Location Name is required',
  }),
  locationAddress: z.string().min(2, {
    message: 'Main Location Address is required',
  }),
  locationCapacity: z.number().min(1, {
    message: 'Main Location Capacity is required',
  }),
  locationDescription: z.string().min(5, {
    message: 'Main Location Description is a minimum of 5 characters',
  }),
});

const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({ eventSpace, handleGoBack, isLoadingEvent }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const [socialLinks, setSocialLinks] = useState(social_links && social_links !== 'null' ? JSON.parse(social_links as string) : []);
  const [extraLinks, setExtraLinks] = useState(extra_links && extra_links !== 'null' ? JSON.parse(extra_links as string) : []);
  const [banner, setBanner] = useState(image_url);
  const [selectedEventFormat, setSelectedEventFormat] = useState('');
  const [tag_line, setTagline] = useState(tagline);
  const [eventType, setEventType] = useState<string[]>(event_type !== null ? (event_type as string[]) : []);
  const [experienceLevels, setExperienceLevels] = useState<string[]>(experience_level !== null ? (experience_level as string[]) : []);
  const [eventItem, setEventItem] = useState('');
  const [experienceItem, setExperienceItem] = useState('');
  const { event_space_id } = router.query;
  const [detailsUpdated, setDetailsUpdated] = useState(false);
  const [dialog, setDialog] = useState(false);

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

  useEffect(() => {
    console.log(eventSpace, 'eventSpace');
  }, []);

  const handleRemoveEventType = (index: number) => {
    const updatedItems = [...eventType.slice(0, index), ...eventType.slice(index + 1)];
    setEventType(updatedItems);
  };

  const handleRemoveExperienceLevels = (index: number) => {
    const updatedItems = [...experienceLevels.slice(0, index), ...experienceLevels.slice(index + 1)];
    setExperienceLevels(updatedItems);
  };

  const goBackToPreviousPage = () => {
    router.push(`/dashboard/events/space/dashboard?event_space_id=${event_space_id}`);
  };

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

  const onSubmitWithEnter = (values: z.infer<typeof formSchema>) => {
    return null;
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

  const handleRemoveImage = (index: number) => {
    const updatedItems = [...locationPayloads.image_urls.slice(0, index), ...locationPayloads.image_urls.slice(index + 1)];
    setLocationPayloads({ ...locationPayloads, image_urls: updatedItems });
  };
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
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const currentEventStatus = eventSpace?.status;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  interface DialogContent {
    title: string;
    description: string;
    buttonLabel: string;
    buttonAction: () => void;
  }

  const handlePublishEvent = async () => {
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }

    const { name, main_location, tracks } = eventSpace;

    if (!name || !main_location) {
      console.error('Event space does not meet the minimum requirements for publishing');
      setDialogContent({
        title: 'Error!',
        description: 'Event space does not meet the minimum requirements for publishing.',
        buttonLabel: 'Edit Event',
        buttonAction: () =>
          router.push({
            pathname: '/dashboard/events/space/details/',
            query: { event_space_id: event_space_id },
          }),
      });
      setDialogOpen(true);
      return;
    }

    try {
      const result = await updateEventSpaceStatus(eventSpace.id as string, {
        status: 'published',
        id: eventSpace.id,
      });
      // setIsUpdatingStatus(true);
      console.log(result, 'Event space published successfully');
      if (result) {
        setDialogContent({
          title: 'Success!',
          description: 'Your Event Was Published Successfully.',
          buttonLabel: 'View Event',
          buttonAction: () => router.push('/dashboard/home'),
        });
        setDialogOpen(true);
      } else {
        setDialogContent({
          title: 'Error!',
          description: 'Event space does not meet the minimum requirements for publishing.',
          buttonLabel: 'Edit Event',
          buttonAction: () =>
            router.push({
              pathname: '/dashboard/events/space/details/',
              query: { event_space_id: event_space_id },
            }),
        });
      }
    } catch (error) {
      console.error('Failed to publish event space', error);
    }
    setIsUpdatingStatus(false);
  };
  const handleArchiveEvent = async () => {
    setIsUpdatingStatus(true);
    if (!eventSpace) {
      console.error('Event space is not defined');
      return;
    }
    if (currentEventStatus === 'published') {
      try {
        const result = await updateEventSpaceStatus(eventSpace.id as string, {
          status: 'archived',
          id: eventSpace.id,
        });
        if (result) {
          toast({
            title: 'Eventspace archived successfully',
          });
          // refetch();
          setConfirmationModal(false);
        }
      } catch (error: any) {
        console.log(error);
        toast({
          title: 'Error',
          description: error?.response.data?.error,
          variant: 'destructive',
        });
      }
    }
    setIsUpdatingStatus(false);
  };

  const popUpModal = (actionType: SpaceDashboardCardType) => {
    let content: DialogContent | null = null;
    if (actionType === SpaceDashboardCardType.PublishEvent) {
      content = {
        title: 'Publish Event',
        description: "You're about to publish this event.",
        buttonLabel: 'Publish Event',
        buttonAction: handlePublishEvent,
      };
    } else if (actionType === SpaceDashboardCardType.ArchiveEvent) {
      content = {
        title: 'Archive Event',
        description: "You're about to archive this event.",
        buttonLabel: 'Archive Event',
        buttonAction: handleArchiveEvent,
      };
    }
    setDialogContent(content);
    setConfirmationModal(true);
  };
  const handleButtonClick = (type: SpaceDashboardCardType) => {
    if (type === SpaceDashboardCardType.PublishEvent || type === SpaceDashboardCardType.ArchiveEvent) {
      popUpModal(type);
    }
  };
  const zuconnectId = '873f2ae3-bcab-4a30-8b99-cb5e011a9db0';
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteEventSpace = async () => {
    if (!eventSpace) return;
    if (eventSpace.id === zuconnectId) {
      toast({
        title: 'Error',
        description: 'This event cannot be deleted without adequate permissions.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsDeleting(true);
      await deleteEventSpaceById(eventSpace.id as string);
      router.push('/dashboard/events/myspaces');
    } catch (error) {
      console.error('Error deleting the event space', error);
    } finally {
      setIsDeleting(false);
    }
  };
  if (isLoadingEvent) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col w-full items-center gap-[10px] bg-componentPrimary lg:bg-transparent self-stretch">
      <div className="flex items-start gap-8 self-stretch ">
        <div className="lg:flex hidden flex-col pt-3 rounded-s-xl opacity-70 w-[300px] gap-5 fixed">
          <div className="flex gap-[10px] pl-3 items-center font-bold">
            <HiCalendar className="w-5 h-5" /> Event Space Details
          </div>
          <div className="flex flex-col gap-3">
            {eventDetailsList.map((eventDetailsItem, index) => (
              <div key={index} className=" rounded-xl flex flex-col gap-1 pl-3 py-2 hover:cursor-pointer w-[230px] hover:bg-[#292929] duration-200" onClick={() => scrollToRef(sectionRefs[index])}>
                <div className="text-lg font-semibold opacity-90">{eventDetailsItem.name}</div>
                <div className="text-xs font-light opacity-60">{eventDetailsItem.description}</div>
              </div>
            ))}
          </div>
          <hr className="bg-gray-500 w-60" />
          <Button
            variant="primaryGreen"
            leftIcon={HiArrowCircleUp}
            className="w-52 ml-4 flex justify-center rounded-3xl text-base font-inter font-bold text-[#d4ffb5]"
            onClick={() => handleButtonClick(SpaceDashboardCardType.PublishEvent)}
          >
            Publish Event
          </Button>
          {/* <Button className="w-40 flex justify-center rounded-3xl text-xl bg-[#EB5757]/20">Delete Event</Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button aria-disabled leftIcon={HiXCircle} className="w-52 ml-4 flex justify-center rounded-3xl text-base font-inter font-bold" variant="red" type="button" disabled={isDeleting}>
                Delete Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-auto rounded-2xl">
              <DialogHeader>
                <DialogTitle>Delete space?</DialogTitle>
                <DialogDescription className="text-sm font-bold">Are you sure you want to delete this event space?</DialogDescription>
                <DialogFooter className="pt-5">
                  <div className="flex items-center">
                    {/* <button className="py-2.5 px-3.5 flex items-center gap-1 rounded-[20px] bg-white/20">
                      <span>Cancel</span>
                    </button> */}
                    <button onClick={handleDeleteEventSpace} className="flex w-full justify-center py-2.5 px-3.5 items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20">
                      <HiXCircle />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-5 items-start lg:ml-[300px] w-full">
          <div className="mx-5">
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={HiArrowLeft}
              onClick={goBackToPreviousPage}
            >
              Back
            </Button>
          </div>

          {/* <div className="flex flex-col py-5 items-center gap-[10px] self-stretch w-full">
            {detailsUpdated ? (
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-xl">Your Details Have Been Updated</h3>
                <Link href={`/dashboard/events/space/tracks?event_space_id=${event_space_id}`}>
                  <Button variant="primary" className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full" leftIcon={HiArrowRight}>
                    Go to tracks
                  </Button>
                </Link>
              </div>
            ) : ( */}
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
                    <Label className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px]">
                      These will be shared as attributes by subsequent Tracks & Sessions you create.
                    </Label>
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
                    {locationPayloads.image_urls.length == 0 && <p className="text-sm text-btnRed">Select at least one image</p>}
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
                      {isLoading && !detailsUpdated && <div className="">submitting...</div>}
                      <span>Save Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          {/* <div className="w-full" ref={sectionRefs[4]}>
            <EventLocation />
          </div> */}
        </div>
        <Dialog open={detailsUpdated} onOpenChange={(open) => setDialog(open)}>
          <DialogContent className="sm:max-w-[525px] h-auto rounded-2xl">
            <DialogHeader className="my-2">
              <DialogTitle>Event Details Saved</DialogTitle>
            </DialogHeader>
            <div className="text-sm font-light text-white/70 my-2">You can edit event space details in your dashboard.</div>
            {/* <div className="font-normal text-white my-2">Now go to Tracks and start building your schedules</div> */}
            <DialogFooter>
              <Link href={`/dashboard/events/myspaces?event_space_id=${event_space_id}`}>
                <Button variant="primary" className="bg-[#67DBFF]/20 text-[#67DBFF] text-lg w-full justify-center rounded-full" leftIcon={HiArrowRight}>
                  Back to Spaces
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <EventLocation /> */}
        <Dialog open={confirmationModal} onOpenChange={(open) => setConfirmationModal(open)}>
          <DialogContent className="sm:max-w-[425px] lg:w-[800px] lg:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-2xl my-3">{dialogContent?.title}</DialogTitle>
              <DialogDescription className="text-base font-normal text-white my-2">{dialogContent?.description}</DialogDescription>
            </DialogHeader>
            {/* <section className="text-white w-full flex flex-col gap-6 bg-accent-foreground rounded-2xl p-4">
            <div className="flex gap-3">
              <span className="font-semibold">Total Tracks: {trackDetails && trackDetails.length}</span>
              <span className="font-semibold">Total Sessions: {schedules && schedules.length}</span>
            </div>
            {trackDetails && trackDetails.map((track, index) => <ScheduleList track={track} />)}
          </section> */}
            <DialogFooter className="pt-5 self-end text-2xl">
              <div className="flex flex-col lg:flex-row gap-6">
                <Button
                  variant="yellow"
                  className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base"
                  leftIcon={MdCancel}
                  onClick={() => setConfirmationModal(false)}
                >
                  Don't {dialogContent?.buttonLabel.split(' ')[0]} Yet
                </Button>
                <Button
                  variant="primaryGreen"
                  className="w-full flex space-x-2 items-center justify-center rounded-3xl px-5 py-2 text-2xl md:text-base"
                  leftIcon={HiCalendar}
                  onClick={dialogContent?.buttonAction}
                  // disabled={isUpdatingStatus}
                >
                  {dialogContent?.buttonLabel}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default EventSpaceDetails;
