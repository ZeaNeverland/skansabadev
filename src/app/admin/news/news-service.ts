import { supabase } from "@/integrations/supabase/client";
import { News, NewsFormData } from "./types";

export const fetchNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
  return data || [];
};

export const createNews = async (formData: NewsFormData): Promise<News> => {
  let imageUrl: string | null = null;
  
  // Upload image if exists
  if (formData.image) {
    const fileName = `news/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('news')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading news image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news')
      .getPublicUrl(fileName);
    
    imageUrl = publicUrl;
  }

  // Save to database
  const { data, error } = await supabase
    .from('news')
    .insert([
      { 
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        date: formData.date || new Date().toISOString().split('T')[0],
        featured: formData.featured || false,
        image_url: imageUrl,
        published_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    throw error;
  }

  return data;
};

export const updateNews = async (id: string, formData: NewsFormData, currentImageUrl: string | null): Promise<News> => {
  let imageUrl = currentImageUrl;
  
  // Upload new image if provided
  if (formData.image) {
    // Delete old image if exists
    if (currentImageUrl) {
      const fileName = currentImageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('news')
          .remove([fileName]);
      }
    }

    // Upload new image
    const fileName = `news/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('news')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading news image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news')
      .getPublicUrl(fileName);
    
    imageUrl = publicUrl;
  }

  // Update news in database
  const { data, error } = await supabase
    .from('news')
    .update({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: formData.date || new Date().toISOString().split('T')[0],
      featured: formData.featured || false,
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news:', error);
    throw error;
  }

  return data;
};

export const deleteNews = async (id: string, imageUrl: string | null): Promise<void> => {
  // Delete image from storage if exists
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('news')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting news image:', storageError);
      }
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};
