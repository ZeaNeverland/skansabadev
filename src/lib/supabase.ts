import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Tables = {
  news: {
    Row: {
      id: string;
      title: string;
      excerpt: string;
      content: string;
      date: string;
      category: string;
      read_time: string;
      image_url: string;
      featured: boolean;
    };
  };
  facilities: {
    Row: {
      id: string;
      title: string;
      description: string;
      features: string[];
      photo_url: string;
      icon_name: string;
    };
  };
  achievements: {
    Row: {
      id: string;
      title: string;
      student: string;
      event: string;
      date: string;
      description: string | null;
      year: string | null;
      level: string | null;
      photo_url: string | null;
    };
  };
  student_works: {
    Row: {
      id: string;
      created_at: string;
      title: string;
      student_name: string;
      class: string;
      description: string;
      image_url: string;
    };
  };
  profiles: {
    Row: {
      id: string;
      full_name: string;
      avatar_url: string | null;
      role: string;
    };
  };
};

type Database = {
  public: {
    Tables: {
      [K in keyof Tables]: {
        Row: Tables[K]['Row'];
        Insert: Omit<Tables[K]['Row'], 'id' | 'created_at'>;
        Update: Partial<Tables[K]['Row']>;
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
