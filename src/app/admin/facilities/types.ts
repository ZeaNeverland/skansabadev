export interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface FacilityFormData {
  name: string;
  description: string;
  features: string[];
  image?: File | null;
  imagePreview?: string;
}

export interface FacilityState {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: Record<string, boolean>;
  formData: FacilityFormData;
  editingId: string | null;
}