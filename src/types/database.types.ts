export type Json =
  | string
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          role: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alumni: {
        Row: {
          id: string
          name: string
          angkatan: string
          pekerjaan: string | null
          perusahaan: string | null
          lokasi: string | null
          image_url: string | null
          quote: string | null
          linkedin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          angkatan: string
          pekerjaan?: string | null
          perusahaan?: string | null
          lokasi?: string | null
          image_url?: string | null
          quote?: string | null
          linkedin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          angkatan?: string
          pekerjaan?: string | null
          perusahaan?: string | null
          lokasi?: string | null
          image_url?: string | null
          quote?: string | null
          linkedin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      facilities: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          features?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          event: string
          level: string
          photo_url: string | null
          student: string
          year: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          event: string
          level: string
          photo_url?: string | null
          student: string
          year: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          event?: string
          level?: string
          photo_url?: string | null
          student?: string
          year?: string
          created_at?: string
          updated_at?: string
        }
      }
      student_works: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          student_name: string
          class: string
          project_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          student_name: string
          class: string
          project_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          student_name?: string
          class?: string
          project_link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kurikulum: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          file_url: string
          file_path: string | null
          file_size: number | null
          update_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          file_url: string
          file_path?: string | null
          file_size?: number | null
          update_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          file_url?: string
          file_path?: string | null
          file_size?: number | null
          update_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      org_levels: {
        Row: {
          id: string
          name: string
          order_index: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      org_members: {
        Row: {
          id: string
          level_id: string
          name: string
          position: string
          photo_url: string | null
          description: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          level_id: string
          name: string
          position: string
          photo_url?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          level_id?: string
          name?: string
          position?: string
          photo_url?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      activities: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          drive_url: string
          activity_date: string | null
          participants: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          drive_url: string
          activity_date?: string | null
          participants?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          drive_url?: string
          activity_date?: string | null
          participants?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          activity_id: string
          image_url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          image_url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          image_url?: string
          caption?: string | null
          created_at?: string
        }
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
  }
}