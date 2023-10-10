import { HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";
import { Label } from "../ui/label";
import Speaker from "../ui/Speaker";
import { EventSpaceDetailsType } from "@/types";

interface IEventViewDetailsPanel {
  eventSpace: EventSpaceDetailsType
}

export default function EventViewDetailsPanel(props: IEventViewDetailsPanel) {
  const { eventSpace } = props;
  return (
    <div className="flex flex-col pt-5 pb-10 gap-5 md:min-w-[450px] lg:max-w-[400px] lg:px-0 sm:px-3">
      <div className="pb-10 gap-2.5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold p-3.5 border-b border-b-background text-xl">
            Details
          </h2>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Format: </Label>
            <Label className="opacity-70 font-bold text-base">
              {eventSpace.format.charAt(0).toUpperCase() + eventSpace.format.slice(1)}
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Type: </Label>
            <Label className="opacity-70 font-bold text-base">
              {eventSpace?.event_type?.join(", ")}
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Expereicne Level: </Label>
            <Label className="opacity-70 font-bold text-base">
              {eventSpace?.experience_level?.join(", ")}
            </Label>
          </div>
        </div>
        <div className="pb-10 gap-2.5">
          <div className="flex flex-col gap-5  rounded-[10px]">
            <div className="flex flex-col border-b border-b-background pb-5 gap-5">
              <div className="flex gap-2.5 items-center pt-5">
                <HiCog className="text-2xl" />
                <Label>Organizers</Label>
              </div>
              <div className="flex gap-[6px] md:flex-row sm:flex-col">
                <Speaker title="QJ" />
                <Speaker title="Janine Leger" />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiMicrophone className="text-2xl" />
                  <h2>Speakers</h2>
                </div>
                <div className="flex gap-[6px] md:flex-row sm:flex-col">
                  <Speaker title="Avery Longname" />
                  <Speaker title="Janine Leger" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiTag className="text-2xl" />
                  <h2>Tags</h2>
                </div>
                <div className="flex gap-2.5">
                  <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">
                    Tag2
                  </Label>
                  <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">
                    Tag2
                  </Label>
                  <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">
                    Tag2
                  </Label>
                  <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">
                    Tag2
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col pb-2.5 gap-5">
              <div className="flex gap-2.5 items-center">
                <HiLocationMarker className="text-2xl" />
                <h2>Location</h2>
              </div>
              <div className="flex gap-2.5">
                <img src="/images/1.png" width={100} height={50} alt="333" />
                <div className="flex flex-col gap-[6px]">
                  <h2 className="font-bold">Soho House Istanbul</h2>
                  <Label className="opacity-70">
                    Beyoglu, Istanbul, Turkey
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-2.5 text-xl items-center gap-3">
            <HiUserGroup className="text-2xl" />
            <span>14 going</span>
          </div>
        </div>
      </div>
    </div>
  )
}