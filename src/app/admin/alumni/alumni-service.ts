import { supabase } from "@/integrations/supabase/client";
import { Alumni, AlumniFormData } from "./types";

export const fetchAlumni = async (): Promise<Alumni[]> => {
  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createAlumni = async (formData: AlumniFormData): Promise<Alumni> => {
  let imageUrl: string | null = null;

  if (formData.image) {
    const fileName = `alumni/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('alumni')
      .upload(fileName, formData.image);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('alumni')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from('alumni')
    .insert([
      {
        name: formData.name,
        angkatan: formData.angkatan,
        pekerjaan: formData.pekerjaan || null,
        perusahaan: formData.perusahaan || null,
        lokasi: formData.lokasi || null,
        quote: formData.quote || null,
        linkedin: formData.linkedin || null,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Alumni;
};

export const updateAlumni = async (id: string, formData: AlumniFormData, currentImageUrl: string | null): Promise<Alumni> => {
  let imageUrl = currentImageUrl;

  if (formData.image) {
    if (currentImageUrl) {
      const fileName = currentImageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('alumni').remove([fileName]);
      }
    }

    const fileName = `alumni/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage.from('alumni').upload(fileName, formData.image);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('alumni').getPublicUrl(fileName);
    imageUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from('alumni')
    .update({
      name: formData.name,
      angkatan: formData.angkatan,
      pekerjaan: formData.pekerjaan || null,
      perusahaan: formData.perusahaan || null,
      lokasi: formData.lokasi || null,
      quote: formData.quote || null,
      linkedin: formData.linkedin || null,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Alumni;
};

export const deleteAlumni = async (id: string, imageUrl: string | null): Promise<void> => {
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from('alumni').remove([fileName]);
    }
  }

  const { error } = await supabase.from('alumni').delete().eq('id', id);
  if (error) throw error;
};
