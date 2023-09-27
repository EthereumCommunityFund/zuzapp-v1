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

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/buttons/Button";
import { useForm } from "react-hook-form";
import ImageUploadForm from "../templates/ImageUploadForm";
import EditionButtons from "../ui/buttons/EditionButtons";
import { CgClose } from "react-icons/cg";
import { FaCircleArrowUp } from "react-icons/fa6";
import IconButton from "../ui/buttons/IconButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BsMap } from "react-icons/bs";
import { useRef, useState } from "react";
import DragAndDrop from "../ui/dragDrop";
import { useRouter } from "next/router";
import InputFieldLabel from "../ui/labels/inputFieldLabel";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import Image from "next/image";

const trackSchema = z.object({
  name: z.string().min(2, {
    message: "Track name is required.",
  }),
  description: z.string().min(10, {
    message:
      "Track description is required and must be at least 10 characters.",
  }),
  // event_space_id: z.string().min(2, {
  //   message: 'event_space_id is required',
  // }),
  // Add more validation for other fields if needed
});

export default function AddTrackForm({
  onTrackSubmit,
}: {
  onTrackSubmit: (values: z.infer<typeof trackSchema>) => void;
}) {
  const [payload, setPayload] = useState({ image_urls: [] });
  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleRemoveImage = (index: number) => {
    const updatedItems = [
      ...payload.image_urls.slice(0, index),
      ...payload.image_urls.slice(index + 1),
    ];
    setPayload({ ...payload, image_urls: updatedItems });
  };

  const onSubmit = (values: z.infer<typeof trackSchema>) => {
    const image = payload.image_urls[0];
    const data = { ...values, image };
    onTrackSubmit(data); // Pass the form values to the parent component
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Track Name</FormLabel>
              <Input
                className="bg-pagePrimary"
                placeholder="What is the name of this track?"
                {...field}
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
              <Input
                className="bg-pagePrimary"
                placeholder="Enter track description"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center gap-[10px] self-stretch">
          <InputFieldLabel name="Track Image Url" />
          <DragAndDrop payload={payload} setPayload={setPayload} />
          <EventDeatilsDescription1 name="We recommend using at least a 2160x1080px" />
        </div>
        {payload.image_urls.length > 0 && (
          <div className="flex gap-5">
            {payload.image_urls.map((source, index) => (
              <div className="w-full" key={index}>
                <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
                  <IconButton
                    variant="dark"
                    className="rounded-full absolute right-[-5px] top-[-5px]"
                    onClick={() => handleRemoveImage(index)}
                    icon={CgClose}
                  />
                  <Image
                    src={source as string}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center pt-8">
          <div className="flex gap-[30px] w-full">
            <Button
              className="rounded-full w-1/2 flex justify-center"
              variant="quiet"
              size="lg"
              type="button"
              leftIcon={CgClose}
            >
              <span>Discard Track</span>
            </Button>
            <Button
              className="rounded-full w-1/2 flex justify-center"
              variant="blue"
              size="lg"
              type="submit"
              leftIcon={FaCircleArrowUp}
            >
              <span>Add a Track</span>
            </Button>
          </div>
        </div>
      </form>
      <></>
    </Form>
  );
}
