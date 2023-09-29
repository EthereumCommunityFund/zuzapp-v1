import OnlineTrackDetailsPageTemplate from "@/components/templates/OnlineTrackDetailsPageTemplate";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import { useEventSpace } from "@/context/EventSpaceContext";
import { TrackUpdateRequestBody } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiEditAlt, BiPlusCircle } from "react-icons/bi";
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";

export default function EventViewTrackDetailsPage() {
  const router = useRouter();

  const { eventSpace } = useEventSpace();
  const trackId = router.query.trackId;
  const trackItem = eventSpace?.tracks.find((track) => track.id === trackId);


  const handleItemClick = () => {
    router.push("/dashboard/eventview/tracks/track/schedule");
  }

  const handleBackToTracksClick = () => {
    router.push("/dashboard/eventview/tracks");
  }
  return (
    trackItem && <OnlineTrackDetailsPageTemplate trackItem={trackItem} />
  )
}