export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      editlogs: {
        Row: {
          edit_summary: string | null
          edited_at: string | null
          editor_id: string | null
          id: string
          schedule_id: string | null
        }
        Insert: {
          edit_summary?: string | null
          edited_at?: string | null
          editor_id?: string | null
          id?: string
          schedule_id?: string | null
        }
        Update: {
          edit_summary?: string | null
          edited_at?: string | null
          editor_id?: string | null
          id?: string
          schedule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "editlogs_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "editlogs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          }
        ]
      }
      eventspace: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          end_date: string | null
          event_space_type: string | null
          event_type: string[] | null
          experience_level: string[] | null
          extra_links: string | null
          format: string | null
          id: string
          image_url: string | null
          main_location_id: string | null
          name: string
          social_links: string | null
          start_date: string | null
          status: string | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          end_date?: string | null
          event_space_type?: string | null
          event_type?: string[] | null
          experience_level?: string[] | null
          extra_links?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          main_location_id?: string | null
          name: string
          social_links?: string | null
          start_date?: string | null
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          end_date?: string | null
          event_space_type?: string | null
          event_type?: string[] | null
          experience_level?: string[] | null
          extra_links?: string | null
          format?: string | null
          id?: string
          image_url?: string | null
          main_location_id?: string | null
          name?: string
          social_links?: string | null
          start_date?: string | null
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventspace_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "eventspace_main_location_id_fkey"
            columns: ["main_location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          }
        ]
      }
      eventspaceinvites: {
        Row: {
          event_space_id: string
          id: string
          invitee_email: string
          invitee_id: string | null
          inviter_id: string
          status: string
        }
        Insert: {
          event_space_id: string
          id?: string
          invitee_email: string
          invitee_id?: string | null
          inviter_id: string
          status?: string
        }
        Update: {
          event_space_id?: string
          id?: string
          invitee_email?: string
          invitee_id?: string | null
          inviter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventspaceinvites_event_space_id_fkey"
            columns: ["event_space_id"]
            isOneToOne: false
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventspaceinvites_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "eventspaceinvites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
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
            isOneToOne: false
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
          username: string | null
          uuid: string
          visitor_date_ranges: string[] | null
        }
        Insert: {
          commitment?: string | null
          email: string
          name?: string | null
          order_id?: string | null
          role?: string | null
          username?: string | null
          uuid: string
          visitor_date_ranges?: string[] | null
        }
        Update: {
          commitment?: string | null
          email?: string
          name?: string | null
          order_id?: string | null
          role?: string | null
          username?: string | null
          uuid?: string
          visitor_date_ranges?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schedule: {
        Row: {
          all_day: boolean | null
          created_at: string | null
          current_rsvp_no: number
          date: string | null
          description: string | null
          end_date: string | null
          end_time: string
          event_space_id: string | null
          event_type: string | null
          experience_level: string | null
          format: string
          id: string
          images: string[] | null
          limit_rsvp: boolean | null
          live_stream_url: string | null
          location_id: string | null
          name: string
          real_end_date: string | null
          rsvp_amount: number
          schedule_frequency: string | null
          start_date: string | null
          start_time: string
          track_id: string | null
          updated_at: string | null
          video_call_link: string | null
        }
        Insert: {
          all_day?: boolean | null
          created_at?: string | null
          current_rsvp_no?: number
          date?: string | null
          description?: string | null
          end_date?: string | null
          end_time: string
          event_space_id?: string | null
          event_type?: string | null
          experience_level?: string | null
          format: string
          id?: string
          images?: string[] | null
          limit_rsvp?: boolean | null
          live_stream_url?: string | null
          location_id?: string | null
          name: string
          real_end_date?: string | null
          rsvp_amount?: number
          schedule_frequency?: string | null
          start_date?: string | null
          start_time: string
          track_id?: string | null
          updated_at?: string | null
          video_call_link?: string | null
        }
        Update: {
          all_day?: boolean | null
          created_at?: string | null
          current_rsvp_no?: number
          date?: string | null
          description?: string | null
          end_date?: string | null
          end_time?: string
          event_space_id?: string | null
          event_type?: string | null
          experience_level?: string | null
          format?: string
          id?: string
          images?: string[] | null
          limit_rsvp?: boolean | null
          live_stream_url?: string | null
          location_id?: string | null
          name?: string
          real_end_date?: string | null
          rsvp_amount?: number
          schedule_frequency?: string | null
          start_date?: string | null
          start_time?: string
          track_id?: string | null
          updated_at?: string | null
          video_call_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_event_space_id_fkey"
            columns: ["event_space_id"]
            isOneToOne: false
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "eventspacelocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          }
        ]
      }
      schedulespeakerrole: {
        Row: {
          id: string
          role: string
          schedule_id: string
          speaker_id: string
        }
        Insert: {
          id?: string
          role: string
          schedule_id: string
          speaker_id: string
        }
        Update: {
          id?: string
          role?: string
          schedule_id?: string
          speaker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedulespeakerrole_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedulespeakerrole_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speaker"
            referencedColumns: ["id"]
          }
        ]
      }
      scheduletags: {
        Row: {
          id: string
          schedule_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          schedule_id: string
          tag_id: string
        }
        Update: {
          id?: string
          schedule_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduletags_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduletags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          }
        ]
      }
      speaker: {
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
            isOneToOne: false
            referencedRelation: "eventspace"
            referencedColumns: ["id"]
          }
        ]
      }
      userrsvp: {
        Row: {
          schedule_id: string
          user_id: string
        }
        Insert: {
          schedule_id: string
          user_id: string
        }
        Update: {
          schedule_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "userrsvp_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
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
