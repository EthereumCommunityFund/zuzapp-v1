
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { set, useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BsPlusCircleFill } from "react-icons/bs"
import { createEventSpace } from "@/controllers/eventspace.controller"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event Format is required.",
  }),
  event_format: z.enum(["in-person", "online", "hybrid"], {
    required_error: "You need to select an event type.",
  }),
})

export default function EventFormat() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      event_format: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Access the selected event_format from form.getValues()
      const selectedEventFormat = form.getValues("event_format");

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <FormField
          control={form.control}
          name="event_format"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-2xl opacity-80 leading-[1.2]">Event Format</FormLabel>
              <FormDescription>
                The format you select will determine what information will be required going forward
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col md:flex-row justify-between"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="In-Person" />
                    </FormControl>
                    <FormLabel className="font-semibold text-white/30 text-base cursor-pointer hover:bg-itemHover">
                      In-Person
                      <span className="text-xs block">This is a physical event</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Online" />
                    </FormControl>
                    <FormLabel className="font-semibold text-white/30 text-base cursor-pointer">
                      Online
                      <span className="text-xs block">Specifically Online Event</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Hybrid" />
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
  )
}
