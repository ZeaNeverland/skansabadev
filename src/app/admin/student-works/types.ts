export interface StudentWork {
  id: string;
  title: string;
  description: string;
  student_name: string;
  class: string;
  year: number;
  image_url: string | null;
  project_link?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentWorkFormData {
  title: string;
  description: string;
  student_name: string;
  class: string;
  year: number;
  project_link?: string;
  image?: File | null;
  imagePreview?: string;
}

export interface StudentWorkState {
  studentWorks: StudentWork[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: Record<string, boolean>;
  formData: StudentWorkFormData;
  editingId: string | null;
}