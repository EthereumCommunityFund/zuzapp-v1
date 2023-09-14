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

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/buttons/Button';
import { useForm } from 'react-hook-form';

const trackSchema = z.object({
  name: z.string().min(2, {
    message: 'Track name is required.',
  }),
  description: z.string().min(10, {
    message: 'Track description is required and must be at least 10 characters.',
  }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Name</FormLabel>
              <Input placeholder="ZK week" {...field} />
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
              <Input placeholder="Enter track description" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Image url</FormLabel>
              <Input placeholder="Input image url" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center pt-8">
          <Button
            type="submit"
            className="rounded-full"
            size="lg"
            // You can set trackCreated to true directly here if needed
          >
            Add Track
          </Button>
        </div>
      </form>
    </Form>
  );
}
