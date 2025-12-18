import { supabase } from "@/integrations/supabase/client";
import { Facility, FacilityFormData } from "./types";

export const fetchFacilities = async (): Promise<Facility[]> => {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
  return data || [];
};

export const createFacility = async (formData: FacilityFormData): Promise<Facility> => {
  let imageUrl: string | null = null;

  // Upload image if exists
  if (formData.image) {
    const fileName = `facilities/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('facilities')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading facility image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('facilities')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  // Save to database
  const { data, error } = await supabase
    .from('facilities')
    .insert([
      {
        name: formData.name,
        description: formData.description,
        features: formData.features,
        image_url: imageUrl
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating facility:', error);
    throw error;
  }

  return data;
};

export const updateFacility = async (id: string, formData: FacilityFormData, currentImageUrl: string | null): Promise<Facility> => {
  let imageUrl = currentImageUrl;

  // Upload new image if provided
  if (formData.image) {
    // Delete old image if exists
    if (currentImageUrl) {
      const fileName = currentImageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('facilities')
          .remove([fileName]);
      }
    }

    // Upload new image
    const fileName = `facilities/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('facilities')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading facility image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('facilities')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  // Update in database
  const { data, error } = await supabase
    .from('facilities')
    .update({
      name: formData.name,
      description: formData.description,
      features: formData.features,
      ...(imageUrl && { image_url: imageUrl }),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating facility:', error);
    throw error;
  }

  return data;
};

export const deleteFacility = async (id: string, imageUrl: string | null): Promise<void> => {
  // Delete image from storage if exists
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('facilities')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting facility image:', storageError);
      }
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('facilities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};
