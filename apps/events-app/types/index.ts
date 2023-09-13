import { Database } from '@/database.types';

export type EventSpaceUpdateRequestBody = {
  id: string;
  name: string;
  event_space_type: 'tracks' | 'schedules';
  status: 'draft' | 'published' | 'archived';
  start_date: number;
  end_date: number;
  description: string;
  format: 'in-person' | 'online' | 'hybrid';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
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
  start_date: number;
  end_date: number;
  description: string;
  format: 'in-person' | 'online' | 'hybrid';
  event_type?: string[];
  experience_level?: string[];
  eventspacelocation?: LocationType[];
};
export type LocationType = {
  id?: string;
  name: string;
  description: string;
  is_main: boolean;
  address: string;
  capacity: number;
  image_urls?: string[];
};

export type ScheduleCreateRequestBody = {
  name: string;
  format: 'in-person' | 'online' | 'hybrid';
  description: string;
  date: number;
  start_time: number;
  end_time: number;
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

export type QueryWithID = {
  [key: string]: string;
};

type Tables = Database['public']['Tables'];

type ExtractInsertUpdateTypes<T> = {
  [K in keyof T]: {
    Insert: T[K]['Insert'];
    Update: T[K]['Update'];
    Row: T[K]['Row'];
  };
};

type AllInsertUpdateTypes = ExtractInsertUpdateTypes<Tables>;

// Now, for exporting the individual Insert and Update types for each table:

// export type EventSpaceInsert = AllInsertUpdateTypes['eventspace']['Insert'];
// export type EventSpaceUpdate = AllInsertUpdateTypes['eventspace']['Update'];
// export type EventSpaceResponse = AllInsertUpdateTypes['eventspace']['Row'];

// export type EventSpaceInvitesRowType = AllInsertUpdateTypes['eventspaceinvites']['Row'];
// export type EventSpaceInvitesInsert = AllInsertUpdateTypes['eventspaceinvites']['Insert'];
// export type EventSpaceInvitesUpdate = AllInsertUpdateTypes['eventspaceinvites']['Update'];

// export type EventSpaceLocationResponse = AllInsertUpdateTypes['eventspacelocation']['Row'];
// export type EventSpaceLocationInsert = AllInsertUpdateTypes['eventspacelocation']['Insert'];
// export type EventSpaceLocationUpdate = AllInsertUpdateTypes['eventspacelocation']['Update'];

// export type LocationResponseType = AllInsertUpdateTypes['location']['Row'];
// export type LocationInsert = AllInsertUpdateTypes['location']['Insert'];
// export type LocationUpdate = AllInsertUpdateTypes['location']['Update'];

// export type ProfileResponseType = AllInsertUpdateTypes['profile']['Row'];
// export type ProfileInsert = AllInsertUpdateTypes['profile']['Insert'];
// export type ProfileUpdate = AllInsertUpdateTypes['profile']['Update'];

// export type ScheduleResponseType = AllInsertUpdateTypes['schedule']['Row'];
// export type ScheduleInsert = AllInsertUpdateTypes['schedule']['Insert'];
// export type ScheduleUpdate = AllInsertUpdateTypes['schedule']['Update'];

// export type ScheduleSpeakerRoleRow = AllInsertUpdateTypes['schedulespeakerrole']['Row'];
// export type ScheduleSpeakerRoleInsert = AllInsertUpdateTypes['schedulespeakerrole']['Insert'];
// export type ScheduleSpeakerRoleUpdate = AllInsertUpdateTypes['schedulespeakerrole']['Update'];

// export type ScheduleTagsRow = AllInsertUpdateTypes['scheduletags']['Row'];
// export type ScheduleTagsInsert = AllInsertUpdateTypes['scheduletags']['Insert'];
// export type ScheduleTagsUpdate = AllInsertUpdateTypes['scheduletags']['Update'];

// export type SocialMediaLinksRow = AllInsertUpdateTypes['socialmedialinks']['Row'];
// export type SocialMediaLinksInsert = AllInsertUpdateTypes['socialmedialinks']['Insert'];
// export type SocialMediaLinksUpdate = AllInsertUpdateTypes['socialmedialinks']['Update'];

// export type SpeakerRow = AllInsertUpdateTypes['speaker']['Row'];
// export type SpeakerInsert = AllInsertUpdateTypes['speaker']['Insert'];
// export type SpeakerUpdate = AllInsertUpdateTypes['speaker']['Update'];

// export type TagsRow = AllInsertUpdateTypes['tags']['Row'];
// export type TagsInsert = AllInsertUpdateTypes['tags']['Insert'];
// export type TagsUpdate = AllInsertUpdateTypes['tags']['Update'];

// export type TrackResponseType = AllInsertUpdateTypes['track']['Row'];
// export type TrackInsert = AllInsertUpdateTypes['track']['Insert'];
// export type TrackUpdate = AllInsertUpdateTypes['track']['Update'];
