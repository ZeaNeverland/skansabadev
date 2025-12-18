export type Alumni = {
  id: string;
  name: string;
  angkatan: string;
  pekerjaan: string | null;
  perusahaan: string | null;
  lokasi: string | null;
  image_url: string | null;
  quote: string | null;
  linkedin: string | null;
  created_at: string;
  updated_at: string;
};

export type AlumniFormData = {
  name: string;
  angkatan: string;
  pekerjaan: string;
  perusahaan: string;
  lokasi: string;
  quote: string;
  linkedin: string;
  image: File | null;
  imagePreview: string;
};

export type AlumniState = {
  items: Alumni[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: Record<string, boolean>;
  formData: AlumniFormData;
  editingId: string | null;
};
