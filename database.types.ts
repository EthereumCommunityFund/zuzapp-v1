yarn run v1.22.19
$ / Users / Saitozen / Documents / Zuzapp - main / node_modules /.bin / supabase gen types typescript--project - id ddsckwslfyjnhcythyko
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export type EventSpaceRow = Database['public']['Tables']['eventspace']['Row'];
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
          event_space_id: string | null
          id: string
          invitee_id: string | null
          inviter_id: string | null
          status: string | null
        }
        Insert: {
          event_space_id?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string | null
        }
        Update: {
          event_space_id?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string | null
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
Done in 3.84s.
