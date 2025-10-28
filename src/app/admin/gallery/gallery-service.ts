import { supabase } from "@/integrations/supabase/client";
import { Activity, ActivityFormData } from "./types";

export const fetchActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  return data || [];
};

export const createActivity = async (formData: ActivityFormData): Promise<Activity> => {
  let coverImageUrl: string | null = null;

  // Upload image if exists
  if (formData.image) {
    const fileName = `gallery-thumbnails/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading activity image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    coverImageUrl = publicUrl;
  }

  // Save to database
  const { data, error } = await supabase
    .from('activities')
    .insert([
      {
        title: formData.title,
        description: formData.description || null,
        cover_image_url: coverImageUrl,
        drive_url: formData.drive_url,
        activity_date: formData.activity_date || null,
        participants: formData.participants || null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }

  return data;
};

export const updateActivity = async (id: string, formData: ActivityFormData, currentImageUrl: string | null): Promise<Activity> => {
  let coverImageUrl = currentImageUrl;

  // Upload new image if provided
  if (formData.image) {
    // Delete old image if exists
    if (currentImageUrl) {
      try {
        const url = new URL(currentImageUrl);
        const filePath = url.pathname.split('/').pop();

        if (filePath) {
          await supabase.storage
            .from('gallery')
            .remove([`gallery-thumbnails/${filePath}`]);
        }
      } catch (urlError) {
        console.error('Error parsing image URL for deletion:', urlError);
      }
    }

    // Upload new image
    const fileName = `gallery-thumbnails/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading activity image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    coverImageUrl = publicUrl;
  }

  // Update activity in database
  const { data, error } = await supabase
    .from('activities')
    .update({
      title: formData.title,
      description: formData.description || null,
      cover_image_url: coverImageUrl,
      drive_url: formData.drive_url,
      activity_date: formData.activity_date || null,
      participants: formData.participants || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating activity:', error);
    throw error;
  }

  return data;
};

export const deleteActivity = async (id: string, imageUrl: string | null): Promise<void> => {
  // Delete image from storage if exists
  if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      const filePath = url.pathname.split('/').pop();

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([`gallery-thumbnails/${filePath}`]);

        if (storageError) {
          console.error('Error deleting activity image:', storageError);
        }
      }
    } catch (urlError) {
      console.error('Error parsing image URL for deletion:', urlError);
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};