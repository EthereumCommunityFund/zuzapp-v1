import { Database } from '@/database.types';
import { IconType } from 'react-icons';
import { ethers } from 'ethers';

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
  format: 'in-person' | 'online';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
  image_url: string;
  main_location: MainLocationType;
};

export type MainLocationType = {
  id?: string;
  name: string;
  description: string;
  address: string;
  capacity: number;
  image_urls: string[];
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
  created_at?: string;
  creator_id?: string;
  id: string;
  name: string;
  event_space_type: 'tracks' | 'schedules';
  status: 'draft' | 'published' | 'archived';
  start_date: Date;
  end_date: Date;
  description: string;
  format: 'in-person' | 'online';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
  tagline: string;
  social_links?: string;
  extra_links?: string;
  image_url: string;
  tracks: TrackUpdateRequestBody[];
  schedules: ScheduleDetailstype[];
  main_location: MainLocationType;
  main_location_id: string;
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
  format: 'in-person' | 'online';
  description: string;
  date: string | Date;
  end_date: string | Date;
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
  organizers: [
    {
      name: string;
      role: string;
    },
  ];
};

export type ScheduleDetailstype = {
  repeating: ScheduleDetailstype;
  id: string;
  name: string;
  format: 'in-person' | 'online';
  description: string;
  date: string | Date | number;
  start_time: any;
  end_time: string | Date | number;
  end_date: string | Date | number;
  all_day?: boolean;
  current_rsvp_no?: number;
  schedule_frequency: 'once' | 'everyday' | 'weekly';
  images?: string[];
  video_call_link?: string;
  live_stream_url?: string;
  location_id: string;
  event_type?: string;
  experience_level?: string;
  limit_rsvp?: boolean;
  rsvp_amount?: number;
  event_space_id: string;
  track_id?: string;
  start_date: string;
  real_end_date: string;
  tags?: string[];
  editlogs?: any;
  organizers?: {
    name: string;
    role: string;
  }[];
  track: TrackType;
};
export type ScheduleUpdateRequestBody = {
  editlogs: any;
  current_rsvp_no: number | undefined;
  name: string;
  format: 'in-person' | 'online';
  description: string;
  date: string | Date | number;
  end_date: string | Date | number | null;
  start_time: string | Date | number;
  end_time: string | Date | number;
  all_day?: boolean;
  schedule_frequency: 'once' | 'everyday' | 'weekly';
  images?: string[];
  video_call_link?: string;
  live_stream_url?: string;
  location_id: string;
  event_type?: string;
  experience_level?: string;
  limit_rsvp?: boolean;
  rsvp_amount?: number;
  event_space_id: string;
  track_id?: string;
  tags?: string[];
  start_date?: string;
  real_end_date?: string;
  organizers?: {
    name: string;
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
  status: 'accepted' | 'declined';
};

export type OrganizerType = { name: string; role: string };

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
  ArchiveEvent,
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

export type RouteOptions = {
  page: number;
  limit: number;
};

export type ZappCardTemplate = {
  imgURL?: string;
  appTitle: string;
  appTagLine: string;
  appContents?: string[];
  appDescription?: string;
  githubLink?: string;
  websiteLink?: string;
  cardItemLink?: string;
};

export type ResourceItemCard = {
  title: string;
  tagLine: string;
  prevLink: string;
  fullLink: string;
};

export interface WalletContextType {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null
  account: string | null;
  isConnected: boolean;
  connectToMetamask: () => Promise<void>;
  hasChangedAccount: Boolean;
  userAccounts: string[]|null;
  // ... any other functions or state variables you want to include
}