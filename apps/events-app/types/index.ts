import { Database } from '@/database.types';
import { IconType } from 'react-icons';

export type EventSpaceUpdateRequestBody = {
  id: string;
  name: string;
  tagline?: string;
  social_links?: string;
  extra_links?: string;
  event_space_type: 'tracks' | 'schedules';
  status: 'draft' | 'published' | 'archived';
  start_date: Date;
  end_date: Date;
  description: string;
  format: 'in-person' | 'online' | 'hybrid';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
  image_url: string;
};

export type EventSpaceStatusUpdateRequestBody = {
  id: string;
  status: 'draft' | 'published' | 'archived';
};
export type EventSpaceCreateRequestBody = {
  name: string;
  event_space_type: 'tracks' | 'schedules';
};
export type EventSpaceDetailsType = {
  id: string;
  name: string;
  event_space_type: 'tracks' | 'schedules';
  status: 'draft' | 'published' | 'archived';
  start_date: Date;
  end_date: Date;
  description: string;
  format: 'in-person' | 'online' | 'hybrid';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
  tagline: string;
  social_links?: string;
  extra_links?: string;
  image_url: string;
  tracks: TrackUpdateRequestBody[];
  schedules: ScheduleUpdateRequestBody[];
};
export type LocationType = {
  id?: string;
  name: string;
  description: string;
  is_main_location: boolean;
  address: string;
  capacity: number;
  image_urls?: string[];
};
export type TrackType = {
  id?: string;
  description: string | null;
  event_space_id: string;
  image: string | null;
  name: string;
  schedules: ScheduleUpdateRequestBody[];
};

export type ScheduleCreateRequestBody = {
  name: string;
  format: 'in-person' | 'online' | 'hybrid';
  description: string;
  date: string | Date;
  start_time: string | Date;
  end_time: string | Date;
  all_day?: boolean;
  schedule_frequency: 'once' | 'everyday' | 'weekly';
  images?: string[];
  video_call_link?: string;
  live_stream_url?: string;
  location_id: string;
  event_type?: string[];
  experience_level?: string[];
  limit_rsvp?: boolean;
  rsvp_amount?: number;
  event_space_id: string;
  track_id?: string;
  tags: string[];
  speakers: [
    {
      speaker_name: string;
      role: string;
    },
  ];
};

export type ScheduleUpdateRequestBody = {
  name: string;
  format: 'in-person' | 'online' | 'hybrid';
  description: string;
  date: string | Date | number;
  start_time: string | Date | number;
  end_time: string | Date | undefined;
  all_day?: boolean;
  schedule_frequency: 'once' | 'everyday' | 'weekly';
  images?: string[];
  video_call_link?: string;
  live_stream_url?: string;
  location_id: string;
  event_type?: string[];
  experience_level?: string[];
  limit_rsvp?: boolean;
  rsvp_amount?: number;
  event_space_id: string;
  track_id?: string;
  tags?: string[];
  speakers?: {
    speaker_name: string;
    role: string;
  }[];
};

export type TrackCreateRequestBody = {
  description: string;
  event_space_id: string;
  image: string | null;
  name: string;
};
export type TrackUpdateRequestBody = {
  id?: string;
  description: string | null;
  event_space_id: string;
  image: string | null;
  name: string;
};

export type LocationCreateRequestBody = {
  name: string;
  description: string;
  is_main_location?: boolean;
  address: string;
  capacity: number;
  image_urls: string[];
  event_space_id: string;
};

export type LocationUpdateRequestBody = {
  id: string;
  name: string;
  description: string;
  is_main_location?: boolean;
  address: string;
  capacity: number;
  image_urls: string[];
  event_space_id: string;
};

export type InviteCreateRequestBody = {
  invitee_email: string;
  event_space_id: string;
};
export type InviteUpdateRequestBody = {
  invite_id: string;
  status: 'accepted' | 'declined';
};

export type SpeakerType = { speaker_name: string; role: string };

export type QueryWithID = {
  [key: string]: string;
};

type Tables = Database['public']['Tables'];

//@ts-ignore
// type ExtractInsertUpdateTypes<T> = {
//   [K in keyof T]: {
//     Insert: T[K]['Insert'];
//     Update: T[K]['Update'];
//     Row: T[K]['Row'];
//   };
// };

export enum SpaceDashboardType {
  New,
  Created,
}

export enum SpaceDashboardCardType {
  EnterEventDetails,
  PublishEvent,
  EditDetails,
  OpenSettings,
}

export enum InputFieldType {
  Primary,
  Date,
  Time,
  Wysiwyg,
  Option,
  Link,
}

export enum SubHeaderTabIndex {
  SpaceDashboard,
  SpaceTrack,
  AllSchedules,
}

export enum EventTypes {
  Online = 'online',
  InPerson = 'inPerson',
}

export type DropDownMenuItemType = {
  icon?: IconType;
  name: string;
};
