import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/buttons/Button';
import { set, useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BsPlusCircleFill } from 'react-icons/bs';
import { createEventSpace } from '@/controllers/eventspace.controller';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Event name is required.',
  }),
  event_space_type: z.enum(['schedules', 'tracks'], {
    required_error: 'You need to select a structure type.',
  }),
});

export default function CreateEventsForm({ setEventCreated }: { setEventCreated: (eventCreated: boolean) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      event_space_type: 'tracks',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createEventSpace(values);
      setEventCreated(true);
      console.log(result);
    } catch (error) {
      setEventCreated(false);
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Event Name Space</FormLabel>
              <FormControl>
                <Input placeholder="Type Something" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_space_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg">Event Structure</FormLabel>
              <FormDescription>This will determine the basic structure of your event. Once selected, this cannot be changed.</FormDescription>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row justify-between pt-3 md:pt-5">
                  <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="schedules" />
                    </FormControl>
                    <FormLabel className="font-semibold text-white/30 text-base">
                      Only Schedules
                      <span className="text-xs block">No Sub Events</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="tracks" defaultChecked />
                    </FormControl>
                    <FormLabel className="font-semibold text-white/30 text-base">
                      With Tracks
                      <span className="text-xs block">Multiple Sub-Events that contain schedules in each.</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center pt-8">
          <Button className="rounded-full" size="lg" type="submit" leftIcon={BsPlusCircleFill}>
            Create Event Space
          </Button>
        </div>
      </form>
    </Form>
  );
}
