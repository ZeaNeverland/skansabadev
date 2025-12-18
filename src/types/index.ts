import { LucideIcon } from "lucide-react";

export interface FacilityImage {
  src: string;
  alt?: string;
}

export interface Facility {
  id?: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  image: string | FacilityImage;
  features: string | string[];
  photo_url?: string;
}

export interface News {
  id?: string;
  title: string;
  content: string;
  date: string;
  category: string;
  read_time: string;
  image_url?: string;
}

export interface Achievement {
  id?: string;
  title: string;
  description: string;
  student: string;
  date: string;
  category: string;
  image_url?: string;
}

export type TabType = 'news' | 'facilities' | 'achievements' | 'gallery';

export interface Image {
  id: string;
  name: string;
  url: string;
  created_at?: string;
  updated_at?: string;
}
