import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import DetailsBar from "@/components/detailsbar";
import EditionButtons from "@/components/ui/buttons/EditionButtons";

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
import { useState, useEffect, useRef } from "react";
import FormTitle from "@/components/ui/labels/form-title";
import InputFieldDark from "@/components/ui/inputFieldDark";
import {
  EventSpaceDetailsType,
  InputFieldType,
  LocationUpdateRequestBody,
  ScheduleUpdateRequestBody,
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
import { useQuery } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
// import timepicker as Timepicker from "react-time-picker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { v4 as uuidv4 } from "uuid";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  fetchScheduleByID,
  updateSchedule,
} from "../../../../../../controllers/schedule.controller";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

import fetchSchedulesByTrackId from "@/services/fetchSchedulesByTrackId";
import { Loader } from "@/components/ui/Loader";
import { BsFillTicketFill } from "react-icons/bs";
import { sessionNavBarDetails } from "@/constant/addschedulenavbar";
import { HiXCircle } from "react-icons/hi";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { sessionFrequency } from "@/constant/scheduleconstants";
import { deleteScheduleById } from "@/services/deleteSchedule";
import {
  convertToTurkeyTimeAsDate,
  fromTurkeyToUTC,
  stringToDateFormated,
  toTurkeyTime,
  stringToDateObject,
  convertDateToString,
} from "@/utils";
import EditScheduleForm from "@/components/commons/EditScheduleForm";
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};

export default function UpdateSchedulePage() {
  const router = useRouter();
  const { event_space_id, trackId, scheduleId } = router.query;

  return (
    <>
      {trackId && scheduleId && event_space_id && (
        <EditScheduleForm
          isQuickAccess={false}
          trackId={trackId as string}
          scheduleId={scheduleId as string}
          event_space_id={event_space_id as string}
          isFromEventView={false}
        />
      )}
    </>
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
