import { supabase } from "@/integrations/supabase/client";
import { Achievement, AchievementFormData } from "./types";

export const fetchAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }

  return data || [];
};

export const uploadAchievementImage = async (file: File): Promise<string> => {
  const timestamp = new Date().getTime();
  const fileExt = file.name.split('.').pop();
  const fileName = `achievements/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('achievements')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('achievements')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const deleteAchievementImage = async (url: string): Promise<void> => {
  if (!url) return;

  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('achievements')
    .remove([fileName]);

  if (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const createAchievement = async (formData: AchievementFormData): Promise<Achievement> => {
  const { data, error } = await supabase
    .from("achievements")
    .insert([{
      title: formData.title,
      description: formData.description,
      student: formData.student,
      event: formData.event,
      date: formData.date,
      level: formData.level,
      photo_url: formData.image_url,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }

  return data;
};

export const updateAchievement = async (
  id: string,
  formData: AchievementFormData
): Promise<Achievement> => {
  const { data, error } = await supabase
    .from("achievements")
    .update({
      title: formData.title,
      description: formData.description,
      student: formData.student,
      event: formData.event,
      date: formData.date,
      level: formData.level,
      photo_url: formData.image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating achievement:", error);
    throw error;
  }

  return data;
};

export const deleteAchievement = async (id: string, imageUrl?: string): Promise<void> => {
  if (imageUrl) {
    try {
      await deleteAchievementImage(imageUrl);
    } catch (error) {
      console.error("Error deleting achievement image:", error);
      // Continue with achievement deletion even if image deletion fails
    }
  }

  const { error } = await supabase
    .from("achievements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
};
