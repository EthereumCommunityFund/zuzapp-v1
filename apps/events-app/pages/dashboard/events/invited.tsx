import { EventInviteCard } from "@/components/templates/events/EventInviteCard";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Invited() {
    const router = useRouter()
    const [connected, setConnected] = useState(false)
const [accepted, setAccepted] = useState(false)
  return (
    <div className="flex items-center justify-center">
       {!connected && <EventInviteCard spacename="ZuConnect" buttonTitle="Connect Passport" buttonVariant="quiet" info="You need to login to accept this invitation to edit" />} 
       {connected && !accepted && <EventInviteCard spacename="ZuConnect" buttonTitle="Accept invite" buttonVariant="blue" info="Head to your Event Spaces to view your invited spaces" />} 
       {accepted && <EventInviteCard spacename="ZuConnect" buttonTitle="My Event Spaces" onButtonClick={() => router.push("dashboard/events/myspaces")} buttonVariant="blue" info="Head to your Event Spaces to view your invited spaces" />} 
    </div>
  )
}
