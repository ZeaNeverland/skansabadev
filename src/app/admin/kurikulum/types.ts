export interface KurikulumDoc {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_path?: string | null; // storage path for deletion
  file_size?: number | null;
  formatted_size?: string | null;
  update_date?: string | null; // ISO date string
  created_at: string;
  updated_at?: string | null;
}

export interface KurikulumState {
  items: KurikulumDoc[];
  loading: boolean;
  error: string | null;
  isUploading: boolean;
  isDeleting: Record<string, boolean>;
  newFile: File | null;
  title: string;
  description: string;
  category: string;
  updateDate: string;
  filePreviewName: string;
  fileSizeLabel?: string;
}
