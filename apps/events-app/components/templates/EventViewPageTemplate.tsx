import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { EventSpaceDetailsType } from "@/types";

import { useEffect, useState } from "react";
import { LocationMarker, LockClosed, UserGroup } from "../ui/icons";
import Button from "../ui/buttons/Button";
import { HiCalendar, HiLocationMarker } from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RenderHTMLString from "../ui/RenderHTMLString";

import { Label } from "../ui/label";
import Image from "next/image";

interface IEventLink {
  name: string;
  link: string;
}

export default function EventViewPageTemplate({
  eventSpace,
  user,
}: {
  eventSpace: EventSpaceDetailsType;
  user: any;
}) {
  const {
    // id,
    name,
    event_space_type,
    status,
    start_date,
    end_date,
    description,
    format,
    event_type,
    experience_level,
    eventspacelocation,
    main_location,
    tagline,
    social_links,
    extra_links,
  } = eventSpace;
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [socialLinks, setSocialLinks] = useState<IEventLink[] | undefined>();
  const [extraLinks, setExtraLinks] = useState<IEventLink[] | undefined>();
  const [imgUrls, setImgUrls] = useState<string[]>();
  const [locationName, setLocationName] = useState<string>();
  const [locationAddress, setLocationAddress] = useState<string>();

  useEffect(() => {
    if (social_links) setSocialLinks(JSON.parse(social_links));
    if (extra_links) setExtraLinks(JSON.parse(extra_links));
    if (main_location) {
      setImgUrls(main_location.image_urls || []);
      setLocationName(main_location.name);
      setLocationAddress(user && main_location.address);
    }
    if (
      eventspacelocation &&
      (!main_location || eventspacelocation.length > 0)
    ) {
      const URLs =
        main_location && main_location.image_urls
          ? [...main_location.image_urls]
          : [];
      eventspacelocation.forEach((location) => {
        if (location.image_urls) URLs.push(...location.image_urls);
      });
      setImgUrls(URLs.length > 0 ? URLs : imgUrls);
      setLocationName(eventspacelocation[0]?.name || locationName);
      setLocationAddress(
        user && (eventspacelocation[0]?.address || locationAddress)
      );
    }
  }, [
    social_links,
    extra_links,
    eventSpace,
    main_location,
    eventspacelocation,
    user,
  ]);

  return (
    <>
      <div className="flex gap-10 md:flex-col sm:flex-col">
        <div className="lg:w-2/3 w-full flex flex-col lg:rounded-2xl bg-componentPrimary mt-4 lg:min-w-[600px]">
          {" "}
          {/* Information */}
          <div className="rounded-xl p-5">
            <Image
              src={eventSpace.image_url}
              className="w-full lg:pb-5 rounded-2xl"
              alt="About Zuzalu"
              height={600}
              width={1000}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-2.5 pb-5 lg:mt-[-30px] border-b-2 border-white/10 w-full md:pt-5 px-5">
            <div className="items-center justify-between w-full pb-5 sm:flex-col sm:gap-3 sm:flex md:flex md:flex-row">
              <div className="flex flex-col gap-3 sm:w-full md:w-auto">
                <div className="flex items-center gap-3 text-[#D7FFC4]/80">
                  {/* <LockClosed /> */}
                  <span className="font-bold">
                    Zuzalu Residents & Invited Guests
                  </span>
                </div>
                <h2 className="font-semibold text-[30px]">{name}</h2>
                <span className="text-white/80 font-md">{tagline}</span>
              </div>
              {/* <Button variant="primaryGreen" size="lg" className="rounded-full sm:w-full md:w-auto lg:w-auto justify-center" leftIcon={BsArrowRightCircleFill}>
                Apply to Event
              </Button> */}
            </div>
            <div className="flex gap-3 text-lg sm:text-sm pb-5">
              <span className="event_date_time_flex rounded-lg flex w-auto min-w-fit px-4 py-2 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-medium whitespace-nowrap">
                <HiCalendar className="event_cal" size={18} />{" "}
                <span>{formattedStartDate}</span> -{" "}
                <span>{formattedEndDate}</span>
              </span>
              {eventSpace.format === "in-person" && user && main_location && (
                <span className="rounded-lg w-auto min-w-fit flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-medium whitespace-nowrap">
                  <HiLocationMarker size={18} /> {main_location.address}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 border-white/10">
            {" "}
            {/* About */}
            <h3 className="text-lg font-bold text-white/70">
              ABOUT THIS EVENT
            </h3>
            {/* <div className={`md:h-auto overflow-hidden text-gray-300 text-md`} dangerouslySetInnerHTML={{ __html: `${description.slice(0, 350)}...` }} /> */}
            <RenderHTMLString htmlString={description} />
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant="quiet" size="lg" className="rounded-2xl inline-block text-white/70 font-bold hover:text-white">
                  Read Description
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="pb-5">About This Event</DialogTitle>
                  <hr className="bg-grayBackground" />
                  <DialogDescription className="text-white">
                    <RenderHTMLString height="500" htmlString={description} />
                  </DialogDescription>
                </DialogHeader>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Button size="sm" className="rounded-full w-10 h-10">
                    <X />
                  </Button>
                </DialogPrimitive.Close>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        <div className="lg:w-1/4 md:w-full flex flex-col px-5 lg:px-10 py-5 gap-8 lg:fixed lg:right-0">
          <h2 className="border-b pb-3 text-2xl font-bold border-white/10 mt-[-20px]">
            Details
          </h2>
          {/* <div className="flex gap-4 items-center">
            <span className="text-white/70 text-lg">
              {' '}
              <UserGroup />{' '}
            </span>
            <span className="text-white text-sm">14 applied</span>
          </div> */}
          <div className="flex flex-col gap-4 font-semibold text-sm">
            <div className="flex gap-2 items-center">
              <Label className="opacity-70">Format: </Label>
              <Label className="opacity-100 text-sm">
                {eventSpace.format.charAt(0).toUpperCase() +
                  eventSpace.format.slice(1)}
              </Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="opacity-70">Type: </Label>
              <Label className="opacity-100 text-sm">
                {eventSpace.format.charAt(0).toUpperCase() +
                  eventSpace.format.slice(1)}
              </Label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label className="opacity-70">Main Links </Label>
            {extraLinks &&
              extraLinks.map((value: IEventLink, idx: number) => (
                <div className="event_details_mainlinks_btn_wrap" key={idx}>
                  <Label className="duo_flex_btn_sec">
                    <a
                      href={
                        value.link.includes("https://")
                          ? value.link
                          : `https://${value.link}`
                      }
                      target="_blank"
                    >
                      {value.name}
                    </a>
                    <img src="/images/btn_arrow.svg" alt="" />
                  </Label>
                </div>
              ))}
            {/* <div className="event_details_mainlinks_btn_wrap">
              <button className="duo_flex_btn_sec">
                <span>Website</span>
                <img src="/images/btn_arrow.svg" alt="" />
              </button>
              <button className="duo_flex_btn_sec">
                <span>Apply to Event</span>
                <img src="/images/btn_arrow.svg" alt="" />
              </button>
              <button className="duo_flex_btn_sec">
                <span>FAQ</span>
                <img src="/images/btn_arrow.svg" alt="" />
              </button>
            </div> */}
          </div>
          <div className="flex flex-col gap-4 border-b pb-5 border-borderPrimary">
            <Label className="opacity-70">Socials </Label>
            {socialLinks &&
              socialLinks.map((value: IEventLink, idx: number) => (
                <div className="flex gap-2" key={idx}>
                  <Label className="opacity-100 text-sm cursor-pointer">
                    <a
                      href={
                        value.link.includes("https://")
                          ? value.link
                          : `https://${value.link}`
                      }
                      target="_blank"
                    >
                      {value.name}
                    </a>
                  </Label>
                </div>
              ))}
          </div>
          {eventSpace.format === "in-person" && (
            <div className="flex flex-col pt-2.5 pb-2.5 gap-5 mt-[-20px]">
              <div className="flex gap-2 items-center text-gray-300">
                <HiLocationMarker />
                <Label className="text-xl">Location</Label>
              </div>
              <div className="flex flex-col gap-[6px]">
                <Label className="text-lg">
                  {user ? locationName : `Apply to See Address`}
                </Label>
                <Label
                  className={`rounded-xl text-sm opacity-70  ${
                    user ? `blur-none` : `blur`
                  }`}
                >
                  {user && locationAddress}
                </Label>
              </div>
              {imgUrls && user && (
                <Image
                  width={260}
                  height={148}
                  src={imgUrls[0]}
                  alt={""}
                  className={`rounded-xl h-[148px] ${
                    user ? `blur-none` : `blur`
                  }`}
                  loading="lazy"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  // get profile from session

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
