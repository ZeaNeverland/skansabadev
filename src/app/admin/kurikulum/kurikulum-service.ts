import { supabase } from "@/integrations/supabase/client";
import { KurikulumDoc } from "./types";

const BUCKET = "kurikulum"; // Ensure this storage bucket exists in Supabase

export const fetchKurikulum = async (): Promise<KurikulumDoc[]> => {
  const { data, error } = await supabase
    .from("kurikulum")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching kurikulum:", error);
    throw error;
  }
  return data || [];
};

export type KurikulumFormData = {
  file: File;
  title: string;
  description?: string;
  category?: string;
  updateDate?: string; // ISO date
};

export const createKurikulum = async (form: KurikulumFormData): Promise<KurikulumDoc> => {
  // Upload file to storage
  const safeName = form.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `documents/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, form.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading kurikulum file:", uploadError);
    throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  const fileUrl = publicData?.publicUrl;

  if (!fileUrl) {
    throw new Error("Gagal membuat URL publik file");
  }

  const { data, error } = await supabase
    .from("kurikulum")
    .insert([
      {
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        file_url: fileUrl,
        file_path: filePath,
        file_size: form.file.size,
        update_date: form.updateDate || new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    // cleanup storage if DB insert fails
    await supabase.storage.from(BUCKET).remove([filePath]);
    console.error("Error saving kurikulum to DB:", error);
    throw new Error("Gagal menyimpan data kurikulum");
  }

  return data;
};

export const deleteKurikulum = async (id: string): Promise<void> => {
  // Fetch to get file_path
  const { data: item, error: fetchError } = await supabase
    .from("kurikulum")
    .select("file_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const filePath = item?.file_path as string | undefined;

  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([filePath]);
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // continue to delete DB row regardless
    }
  }

  const { error } = await supabase
    .from("kurikulum")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
