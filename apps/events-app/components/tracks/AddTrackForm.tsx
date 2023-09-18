// import { useState } from 'react';
// import EditionFormTitle from '../ui/EditionFormTitle';

// import DescriptionEditor from '../ui/DescriptionEditor';
// import ImageUploadForm from '../templates/ImageUploadForm';
// import InputField from '../ui/inputField';

// <div className="flex flex-col gap-[34px] self-stretch">
//   <EditionFormTitle title="Add a Track" />
//   <InputField title={"Track Name"} placeholder={"ZK week"} type={"NoCaption"} />
//   <DescriptionEditor title={"Track"} value={editorValue} onChange={setEditorValue} />
//   <ImageUploadForm title={"Track"} />
// </div>

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

const trackSchema = z.object({
  name: z.string().min(2, {
    message: 'Track name is required.',
  }),
  description: z.string().min(10, {
    message: 'Track description is required and must be at least 10 characters.',
  }),
  // event_space_id: z.string().min(2, {
  //   message: 'event_space_id is required',
  // }),
  image: z.string().min(2, {
    message: 'image url is required',
  }),
  // Add more validation for other fields if needed
});

export default function AddTrackForm({ onTrackSubmit }: { onTrackSubmit: (values: z.infer<typeof trackSchema>) => void }) {
  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
    },
  });

  const onSubmit = (values: z.infer<typeof trackSchema>) => {
    onTrackSubmit(values); // Pass the form values to the parent component
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Name</FormLabel>
              <Input className="bg-pagePrimary" placeholder="What is the name of this track?" {...field} />
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
              <Input className="bg-pagePrimary" placeholder="Enter track description" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Image Url</FormLabel>
              <Input className="bg-pagePrimary" placeholder="Enter image url" {...field} />
              <FormMessage />
              {/* <ImageUploadForm title={'Track'} /> */}
              <DragAndDrop />
            </FormItem>
          )}
        />
        <div className="w-full">
          <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
            <IconButton variant="dark" className="rounded-full absolute right-[-5px] top-[-5px]" icon={CgClose} />
          </div>
        </div>
        <div className="flex justify-center pt-8">
          <div className="flex gap-[30px] w-full">
            <Button className="rounded-full w-1/2 flex justify-center" variant="light-dark" size="lg" type="button" leftIcon={CgClose}>
              <span>Discard Track</span>
            </Button>
            <Button className="rounded-full w-1/2 flex justify-center" variant="light-blue" size="lg" type="submit" leftIcon={FaCircleArrowUp}>
              <span>Add a Track</span>
            </Button>
          </div>
        </div>
      </form>
      <></>
    </Form>
  );
}
