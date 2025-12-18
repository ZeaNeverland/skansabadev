export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date?: string;
  featured?: boolean;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  date?: string;
  featured?: boolean;
  image?: File | null;
  imagePreview?: string;
}

export interface NewsState {
  news: News[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeleting: Record<string, boolean>;
  formData: NewsFormData;
  editingId: string | null;
}
