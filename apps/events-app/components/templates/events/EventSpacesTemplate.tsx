import Button from "@/components/ui/buttons/Button";
import { sampleEvents } from "../HomePageTemplate";
import { HiPencilAlt } from "react-icons/hi";
import Link from "next/link";

export default function EventSpacesTemplate() {
    return (
        <>
            <div className="mt-10">
                <h3 className="text-2xl">Created Spaces</h3>
                <div className="mt-6">
                    {sampleEvents.map((event, index) => (
                        <div key={index} className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-lg px-3 md:px-5 py-5 mt-5">
                            <div>
                                <span className="bg-[#67DBFF]/20 text-[#67DBFF] rounded-full text-xs py-1 px-2 block w-fit">
                                    Draft    
                                </span> 
                                <h4 className="text-xl md:text-2xl font-bold mt-3">
                                    {event.name}
                                </h4>
                            </div>
                            <div>
                                <Link href="/dashboard/event-management" className="w-full">
                                    <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiPencilAlt}>Edit Space</Button>
                                </Link>
                            </div>
                        </div>
                    ))   
                    }
                    <Link href="/dashboard/events/create" className="w-full">
                        <Button variant="dark" size="lg" className="bg-transparent text-white/70 mt-3 border-dashed w-full justify-center py-4 rounded-lg">Create an Event Space</Button>
                    </Link>
                </div>
            </div>
            <div>
                <h3 className="text-2xl mt-10">Invited Spaces</h3>
                <div className="mt-2">
                    <p className="text-white/70 text-sm">No invited spaces</p>
                </div>
            </div>
        </>
    )
}