import { use, useEffect, useState } from "react";
import CreateEventsForm from "./CreateEventForm";
import Button from "@/components/ui/buttons/Button";
import { HiArrowRight } from "react-icons/hi";
import Link from "next/link";

export default function CreateEventTemplate() {
    const [eventCreated, setEventCreated] = useState(false)

    return (
        <div className="w-full bg-grayBackground p-4 md:p-8 rounded-lg">
            {
                eventCreated ? (
                    <div className="flex flex-col items-center">
                        <h3 className="font-bold text-xl">Your Event Space Has Been Created</h3>
                        <Link href="/dashboard/events/myspaces">
                            <Button variant="primary" className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full" leftIcon={HiArrowRight}>
                                Go to dashboard
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <h3 className="font-bold text-2xl">Create your space</h3>
                        <div className="mt-8">
                            <CreateEventsForm setEventCreated={setEventCreated} />
                        </div>
                    </>
                )
            }
        </div>
    )
}