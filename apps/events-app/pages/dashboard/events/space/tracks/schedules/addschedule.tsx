import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import DetailsBar from "@/components/detailsbar";

import { CgClose } from "react-icons/cg";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import FormTitle from "@/components/ui/labels/form-title";
import InputFieldDark from "@/components/ui/inputFieldDark";
import {
  DropDownMenuItemType,
  EventSpaceDetailsType,
  InputFieldType,
  LocationUpdateRequestBody,
  TrackUpdateRequestBody,
} from "@/types";
import TextEditor from "@/components/ui/TextEditor";
import { Label } from "@/components/ui/label";
import SwitchButton from "@/components/ui/buttons/SwitchButton";
import { GoXCircle } from "react-icons/go";
import InputFieldLabel from "@/components/ui/labels/inputFieldLabel";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import CustomDatePicker from "@/components/ui/DatePicker";
import { useRouter } from "next/router";
import {
  fetchLocationsByEventSpace,
  createSchedule,
  fetchAllTags,
  fetchAllSpeakers,
} from "@/controllers";
import { useQuery, useMutation } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import fetchTracksByEventSpaceId from "@/services/fetchTracksByEventSpace";
// import timepicker as Timepicker from "react-time-picker";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { Loader } from "@/components/ui/Loader";
import { toast } from "@/components/ui/use-toast";
import { BsFillTicketFill } from "react-icons/bs";
import { sessionNavBarDetails } from "@/constant/addschedulenavbar";
import { sessionFrequency } from "@/constant/scheduleconstants";
import {
  convertDateToString,
  fromTurkeyToUTC,
  toTurkeyTime,
  toTurkeyTimestampWithDefaultTime,
} from "@/utils";
import AddScheduleForm from "@/components/commons/AddScheduleForm";
dayjs.extend(isSameOrAfter);

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};

export default function AddSchedulePage(props: any) {
  const router = useRouter();
  const { event_space_id, trackId, track_title } = router.query;

  return (
    <AddScheduleForm
      isQuickAccess={false}
      trackId={trackId as string}
      isFromEventView={false}
      event_space_id={event_space_id as string}
      track_title={track_title as string}
    />
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);
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

  const locationsResult = await fetchLocationsByEventSpace(
    ctx.query.event_space_id
  );
  const tagsResult = await fetchAllTags();
  const organizersResult = await fetchAllSpeakers();

  return {
    props: {
      initialSession: session,
      user: session?.user,
      savedLocations: locationsResult.data.data,
      tags: tagsResult.data.data,
      organizers: organizersResult.data.data,
    },
  };
};
