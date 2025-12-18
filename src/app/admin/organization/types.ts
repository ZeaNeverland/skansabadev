export type OrgLevel = {
  id: string;
  name: string; // e.g., "Kepala Sekolah", "Ketua Konsentrasi Keahlian"
  order_index: number;
  created_at: string;
  updated_at: string | null;
};

export type OrgMember = {
  id: string;
  level_id: string;
  name: string;
  position: string; // jabatan pada level tsb
  photo_url: string | null;
  description: string | null;
  start_date: string | null; // untuk historis (opsional)
  end_date: string | null; // untuk historis (opsional)
  is_active: boolean; // aktif pada struktur saat ini
  order_index: number;
  created_at: string;
  updated_at: string | null;
};

export type UpsertOrgLevel = Pick<OrgLevel, 'name' | 'order_index'> & { id?: string };
export type UpsertOrgMember = Pick<OrgMember, 'level_id' | 'name' | 'position' | 'photo_url' | 'description' | 'is_active' | 'order_index'> & { id?: string };
