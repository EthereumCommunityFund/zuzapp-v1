import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/buttons/Button';
import { useForm } from 'react-hook-form';
import ImageUploadForm from '../templates/ImageUploadForm';
import EditionButtons from '../ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import IconButton from '../ui/buttons/IconButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BsMap } from 'react-icons/bs';
import { useRef, useState } from 'react';
import DragAndDrop from '../ui/dragDrop';
import { useRouter } from 'next/router';
import { useQuery, QueryClient } from 'react-query';
import { TrackUpdateRequestBody } from '@/types';
import { fetchTrackById } from '@/services/fetchTrack';
import { deleteTrack } from '@/controllers';
import InputFieldLabel from '../ui/labels/inputFieldLabel';
import EventDeatilsDescription1 from '../ui/labels/event-details-description-1';
import Image from 'next/image';
import TextEditor from '../ui/TextEditor';
import { toast } from '../ui/use-toast';

const trackSchema = z.object({
  name: z.string().min(2, {
    message: 'Track name is required.',
  }),
  description: z.string().min(10, {
    message: 'Track description is required and must be at least 10 characters.',
  }),
});

export default function EditTrackForm({ onTrackSubmit, trackDetails }: { onTrackSubmit: (values: z.infer<typeof trackSchema>) => void; trackDetails: TrackUpdateRequestBody }) {
  const router = useRouter();
  const { event_space_id, trackId } = router.query;
  console.log(trackDetails);
  const [payload, setPayload] = useState({ image_urls: [trackDetails.image] });

  // const handleDiscardTrack = async () => {
  //   await deleteTrack(trackId as string, event_space_id as string);
  //   router.push({
  //     pathname: `/dashboard/events/space/tracks`,
  //     query: { event_space_id: event_space_id },
  //   });
  // };

  const handleRemoveImage = (index: number) => {
    const updatedItems = [...payload.image_urls.slice(0, index), ...payload.image_urls.slice(index + 1)];
    setPayload({ ...payload, image_urls: updatedItems });
  };

  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      name: trackDetails?.name,
      description: trackDetails?.description as string,
    },
  });

  const onSubmit = (values: z.infer<typeof trackSchema>) => {
    const image = payload.image_urls[0];
    if (!image) {
      toast({
        title: 'Error',
        description: 'Select at least one image',
        variant: 'destructive',
      });
      return;
    }
    const data = {
      ...values,
      image,
      event_space_id: event_space_id,
      id: trackId,
    };
    onTrackSubmit(data); // Pass the form values to the parent component
  };
  const onSubmitWithEnter = (values: z.infer<typeof trackSchema>) => {
    return null;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitWithEnter)} className="space-y-10 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Name</FormLabel>
              <Input
                className="bg-pagePrimary"
                placeholder="What is the name of this track?"
                value={field.value}
                onChange={field.onChange}
              // {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Description</FormLabel>
              <TextEditor {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-[10px] self-stretch">
          <InputFieldLabel name="Track Image" />
          <DragAndDrop payload={payload} setPayload={setPayload} />
          <EventDeatilsDescription1 name="We recommend using at least a 2160x1080px" />
        </div>
        {payload.image_urls.length == 0 && <p className="text-sm text-btnRed">Select at least one image</p>}
        {payload.image_urls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {payload.image_urls.map((source, index) => (
              <div className="" key={index}>
                <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
                  <IconButton variant="dark" className="rounded-full absolute right-[-5px] top-[-5px] z-10 bg-gray-400" onClick={() => handleRemoveImage(index)} icon={CgClose} />
                  <Image src={source as string} alt="" fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center pt-8">
          <div className="flex flex-col lg:flex-row gap-[30px] w-full">
            <Button className="rounded-full w-full lg:w-1/2 flex justify-center" variant="quiet" size="lg" type="button" leftIcon={CgClose}>
              <span>Discard Track</span>
            </Button>
            <Button className="rounded-full w-full lg:w-1/2 flex justify-center" variant="blue" size="lg" onClick={() => form.handleSubmit(onSubmit)()} leftIcon={FaCircleArrowUp}>
              <span>Update Track</span>
            </Button>
          </div>
        </div>
      </form>
      <></>
    </Form>
  );
}
