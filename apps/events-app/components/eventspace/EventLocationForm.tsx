import { useState } from 'react';

import { useRouter } from 'next/router';
import TextEditor from '../ui/TextEditor';
import EventDeatilsDescription1 from '../ui/labels/event-details-description-1';
import InputFieldLabel from '../ui/labels/inputFieldLabel';
import { Input } from '../ui/input';
import EditionButtons from '../ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import DragAndDrop from '../ui/dragDrop';
import IconButton from '../ui/buttons/IconButton';
import { createEventSpaceLocation } from '@/controllers';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Switch } from '../ui/switch';
import { LocationCreateRequestBody } from '@/types';
import { toast } from '../ui/use-toast';
import SwitchButton from '../ui/buttons/SwitchButton';

const locationFormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(3, { message: 'Name should be at least 3 characters long' }),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(3, { message: 'Description should be at least 3 characters long' }),
  is_main_location: z.boolean().optional(),
  address: z
    .string({
      required_error: 'Address is required',
    })
    .min(3, { message: 'Address should be at least 3 characters long' }),
  capacity: z.coerce.number({
    required_error: 'Capacity is required',
  }),
});

export default function EventLocationForm({ setIsLocationForm }: { setIsLocationForm: React.Dispatch<React.SetStateAction<boolean>> }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { event_space_id } = router.query;
  const [switchDialogue, setSwitchDialogue] = useState(false);
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    image_urls: [],
    event_space_id: event_space_id as string,
  });
  const form = useForm<z.infer<typeof locationFormSchema>>({
    resolver: zodResolver(locationFormSchema),
  });

  const onSubmit = (data: z.infer<typeof locationFormSchema>) => {
    if (payload.image_urls.length == 0) return;
    const payloadData: LocationCreateRequestBody = {
      ...data,
      is_main_location: data.is_main_location ? data.is_main_location : false,
      image_urls: payload.image_urls,
      event_space_id: event_space_id as string,
    };
    onCreateLocation(payloadData);
    setRequestIsLoading(true);
  };

  const onCreateLocation = async (data: LocationCreateRequestBody) => {
    try {
      const result = await createEventSpaceLocation(data, event_space_id as string);
      queryClient.invalidateQueries({ queryKey: ['locationDetails'] });
      form.reset();
      toast({
        title: 'Location created successfully',
      });
      setIsLocationForm(false);
      setRequestIsLoading(false);
    } catch (error: any) {
      toast({
        title: 'Error creating location',
        description: error?.details[0].message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedItems = [...payload.image_urls.slice(0, index), ...payload.image_urls.slice(index + 1)];
    setPayload({ ...payload, image_urls: updatedItems });
  };

  return (
    <Form {...form}>
      <form
        // onSubmit={handleCreateEventLocation}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col p-5 rounded-[10px] border items-start	gap-[30px] self-stretch border-opacity-10 bg-[#2B2E2E]"
      >
        {/* <FormField
          control={form.control}
          name="is_main_location"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center rounded-lg p-3 shadow-sm space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <SwitchButton value={field.value} onClick={field.onChange} />
              </FormControl>
              <FormLabel className="m-0">Main Location</FormLabel>
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg">Location Name </FormLabel>
              <FormControl>
                <Input className="bg-inputField" placeholder={'Name of this location'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
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
          name="capacity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg">Capacity</FormLabel>
              <FormControl>
                <Input type="number" min="1" className="bg-inputField" placeholder={'Enter a number'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-[10px]">
                  <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Location Description</h2>
                  <TextEditor value={field.value} onChange={field.onChange} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center gap-[10px] self-stretch">
          <InputFieldLabel name="Location Media" />
          <DragAndDrop payload={payload} setPayload={setPayload} />
          {/* <EventDeatilsDescription1 name="We recommend using at least a 2160x1080px" /> */}
        </div>
        {payload.image_urls.length == 0 && <p className="text-sm text-btnRed">Select at least one image</p>}
        {payload.image_urls.length > 0 && (
          <div className="flex gap-5">
            {payload.image_urls.map((source, index) => (
              <div className="w-full" key={index}>
                <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
                  <IconButton variant="dark" className="rounded-full absolute z-10 right-[-5px] top-[-5px]" onClick={() => handleRemoveImage(index)} icon={CgClose} />
                  <Image src={source} alt="" fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        )}

        <EditionButtons
          switchDialogue={switchDialogue}
          type={'location'}
          leftButtonName={'Discard This Location'}
          rightButtonName={'Add This Location'}
          leftButtonIcon={CgClose}
          rightButtonIcon={FaCircleArrowUp}
          isLoading={requestIsLoading}
        />
      </form>
    </Form>
  );
}
