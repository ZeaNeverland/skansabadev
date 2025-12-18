export interface Achievement {
  id: string;
  title: string;
  description?: string;
  student: string;
  event: string;
  date: string;
  level: 'Sekolah' | 'Kecamatan' | 'Kota/Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AchievementFormData {
  title: string;
  description: string;
  student: string;
  event: string;
  date: string;
  level: 'Sekolah' | 'Kecamatan' | 'Kota/Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  image?: File | null;
  image_url?: string;
}

export interface AchievementState {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  formData: AchievementFormData;
  isEditing: boolean;
  editingId: string | null;
}
