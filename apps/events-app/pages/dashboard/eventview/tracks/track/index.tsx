import OnlineTrackDetailsPageTemplate from "@/components/templates/InPersonTrackDetailsPageTemplate";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiEditAlt, BiPlusCircle } from "react-icons/bi";
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";

export default function EventViewTrackDetailsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = () => {
    router.push("/dashboard/eventview/tracks/track/schedule");
  }

  const handleBackToTracksClick = () => {
    router.push("/dashboard/eventview/tracks");
  }
  return (
    <OnlineTrackDetailsPageTemplate />
  )
}