export type Activity = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  drive_url: string;
  activity_date: string | null;
  participants: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityFormData = {
  title: string;
  description: string;
  drive_url: string;
  activity_date: string;
  participants: string;
  image: File | null;
  imagePreview: string;
  cover_image_url?: string;
};

export type GalleryState = {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: { [key: string]: boolean };
  formData: ActivityFormData;
  editingId: string | null;
};