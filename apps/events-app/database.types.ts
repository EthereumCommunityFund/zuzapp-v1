export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Tables = Database['public']['Tables'];

type ExtractInsertUpdateTypes<T> = {
  [K in keyof T]: {
    Insert: T[K]['Insert'];
    Update: T[K]['Update'];
  }
};

type AllInsertUpdateTypes = ExtractInsertUpdateTypes<Tables>;

// Now, for exporting the individual Insert and Update types for each table:

export type EventSpaceInsert = AllInsertUpdateTypes['eventspace']['Insert'];
export type EventSpaceUpdate = AllInsertUpdateTypes['eventspace']['Update'];

export type EventSpaceInvitesInsert = AllInsertUpdateTypes['eventspaceinvites']['Insert'];
export type EventSpaceInvitesUpdate = AllInsertUpdateTypes['eventspaceinvites']['Update'];

export type EventSpaceLocationInsert = AllInsertUpdateTypes['eventspacelocation']['Insert'];
export type EventSpaceLocationUpdate = AllInsertUpdateTypes['eventspacelocation']['Update'];

export type LocationInsert = AllInsertUpdateTypes['location']['Insert'];
export type LocationUpdate = AllInsertUpdateTypes['location']['Update'];

export type ProfileInsert = AllInsertUpdateTypes['profile']['Insert'];
export type ProfileUpdate = AllInsertUpdateTypes['profile']['Update'];

export type ScheduleInsert = AllInsertUpdateTypes['schedule']['Insert'];
export type ScheduleUpdate = AllInsertUpdateTypes['schedule']['Update'];

export type ScheduleSpeakerRoleInsert = AllInsertUpdateTypes['schedulespeakerrole']['Insert'];
export type ScheduleSpeakerRoleUpdate = AllInsertUpdateTypes['schedulespeakerrole']['Update'];

export type ScheduleTagsInsert = AllInsertUpdateTypes['scheduletags']['Insert'];
export type ScheduleTagsUpdate = AllInsertUpdateTypes['scheduletags']['Update'];

export type SocialMediaLinksInsert = AllInsertUpdateTypes['socialmedialinks']['Insert'];
export type SocialMediaLinksUpdate = AllInsertUpdateTypes['socialmedialinks']['Update'];

export type SpeakerInsert = AllInsertUpdateTypes['speaker']['Insert'];
export type SpeakerUpdate = AllInsertUpdateTypes['speaker']['Update'];

export type TagsInsert = AllInsertUpdateTypes['tags']['Insert'];
export type TagsUpdate = AllInsertUpdateTypes['tags']['Update'];

export type TrackInsert = AllInsertUpdateTypes['track']['Insert'];
export type TrackUpdate = AllInsertUpdateTypes['track']['Update'];


export interface Database {
  public: {
    Tables: {
      eventspace: {
        Row: {
          creator_id: string
          description: string
          end_date: string
          event_space_type: string
          event_type: string[]
          experience_level: string[]
          format: string
          id: string
          name: string
          start_date: string
          status: string
        }
        Insert: {
          creator_id: string
          description?: string
          end_date?: string
          event_space_type?: string
          event_type?: string[]
          experience_level?: string[]
          format?: string
          id?: string
          name: string
          start_date?: string
          status?: string
        }
        Update: {
          creator_id?: string
          description?: string
          end_date?: string
          event_space_type?: string
          event_type?: string[]
          experience_level?: string[]
          format?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventspace_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          }
        ]
      }
      eventspaceinvites: {
        Row: {
          event_space_id: string
          id: string
          invitee_id: string
          inviter_id: string
          status: string
        }
        Insert: {
          event_space_id: string
          id?: string
          invitee_id: string
          inviter_id: string
          status?: string
        }
        Update: {
          event_space_id?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventspaceinvites_event_space_id_fkey"
            columns: ["event_space_id"]
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventspaceinvites_invitee_id_fkey"
            columns: ["invitee_id"]
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "eventspaceinvites_inviter_id_fkey"
            columns: ["inviter_id"]
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          }
        ]
      }
      eventspacelocation: {
        Row: {
          address: string
          capacity: number
          description: string
          event_space_id: string
          id: string
          image_urls: string[] | null
          is_main_location: boolean
          name: string
        }
        Insert: {
          address: string
          capacity: number
          description: string
          event_space_id: string
          id?: string
          image_urls?: string[] | null
          is_main_location?: boolean
          name?: string
        }
        Update: {
          address?: string
          capacity?: number
          description?: string
          event_space_id?: string
          id?: string
          image_urls?: string[] | null
          is_main_location?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventspacelocation_event_space_id_fkey"
            columns: ["event_space_id"]
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          }
        ]
      }
      location: {
        Row: {
          address: string
          capacity: number
          description: string | null
          id: string
          image_urls: string[] | null
          name: string
        }
        Insert: {
          address: string
          capacity: number
          description?: string | null
          id?: string
          image_urls?: string[] | null
          name: string
        }
        Update: {
          address?: string
          capacity?: number
          description?: string | null
          id?: string
          image_urls?: string[] | null
          name?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          commitment: string | null
          email: string
          name: string | null
          order_id: string | null
          role: string | null
          uuid: string
          visitor_date_ranges: string[] | null
        }
        Insert: {
          commitment?: string | null
          email: string
          name?: string | null
          order_id?: string | null
          role?: string | null
          uuid: string
          visitor_date_ranges?: string[] | null
        }
        Update: {
          commitment?: string | null
          email?: string
          name?: string | null
          order_id?: string | null
          role?: string | null
          uuid?: string
          visitor_date_ranges?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_uuid_fkey"
            columns: ["uuid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule: {
        Row: {
          all_day: boolean | null
          date: string
          description: string | null
          end_time: string
          event_space_id: string | null
          event_type: string[] | null
          experience_level: string[] | null
          format: string
          id: string
          images: string[] | null
          limit_rsvp: boolean | null
          live_stream_url: string | null
          location_id: string | null
          name: string
          rsvp_amount: number | null
          schedule_frequency: string | null
          start_time: string
          track_id: string | null
          video_call_link: string | null
        }
        Insert: {
          all_day?: boolean | null
          date: string
          description?: string | null
          end_time: string
          event_space_id?: string | null
          event_type?: string[] | null
          experience_level?: string[] | null
          format: string
          id?: string
          images?: string[] | null
          limit_rsvp?: boolean | null
          live_stream_url?: string | null
          location_id?: string | null
          name: string
          rsvp_amount?: number | null
          schedule_frequency?: string | null
          start_time: string
          track_id?: string | null
          video_call_link?: string | null
        }
        Update: {
          all_day?: boolean | null
          date?: string
          description?: string | null
          end_time?: string
          event_space_id?: string | null
          event_type?: string[] | null
          experience_level?: string[] | null
          format?: string
          id?: string
          images?: string[] | null
          limit_rsvp?: boolean | null
          live_stream_url?: string | null
          location_id?: string | null
          name?: string
          rsvp_amount?: number | null
          schedule_frequency?: string | null
          start_time?: string
          track_id?: string | null
          video_call_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_event_space_id_fkey"
            columns: ["event_space_id"]
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "eventspacelocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_track_id_fkey"
            columns: ["track_id"]
            referencedRelation: "track"
            referencedColumns: ["id"]
          }
        ]
      }
      schedulespeakerrole: {
        Row: {
          id: string
          role: string
          schedule_id: string | null
          speaker_id: string | null
        }
        Insert: {
          id?: string
          role: string
          schedule_id?: string | null
          speaker_id?: string | null
        }
        Update: {
          id?: string
          role?: string
          schedule_id?: string | null
          speaker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedulespeakerrole_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedulespeakerrole_speaker_id_fkey"
            columns: ["speaker_id"]
            referencedRelation: "speaker"
            referencedColumns: ["id"]
          }
        ]
      }
      scheduletags: {
        Row: {
          id: string
          schedule_id: string | null
          tag_id: string | null
        }
        Insert: {
          id?: string
          schedule_id?: string | null
          tag_id?: string | null
        }
        Update: {
          id?: string
          schedule_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduletags_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduletags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      socialmedialinks: {
        Row: {
          event_space_id: string | null
          id: string
          link: string
          name: string
        }
        Insert: {
          event_space_id?: string | null
          id?: string
          link: string
          name: string
        }
        Update: {
          event_space_id?: string | null
          id?: string
          link?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "socialmedialinks_event_space_id_fkey"
            columns: ["event_space_id"]
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          }
        ]
      }
      speaker: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      track: {
        Row: {
          description: string | null
          event_space_id: string
          id: string
          image: string | null
          name: string
        }
        Insert: {
          description?: string | null
          event_space_id: string
          id?: string
          image?: string | null
          name: string
        }
        Update: {
          description?: string | null
          event_space_id?: string
          id?: string
          image?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_event_space_id_fkey"
            columns: ["event_space_id"]
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
