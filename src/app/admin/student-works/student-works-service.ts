import { supabase } from "@/integrations/supabase/client";
import { StudentWork, StudentWorkFormData } from "./types";

export const fetchStudentWorks = async (): Promise<StudentWork[]> => {
  const { data, error } = await supabase
    .from('student_works')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student works:', error);
    throw error;
  }
  return data || [];
};

export const createStudentWork = async (formData: StudentWorkFormData): Promise<StudentWork> => {
  let imageUrl: string | null = null;
  
  // Upload image if exists
  if (formData.image) {
    const fileName = `student-works/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('student-works')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading student work image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('student-works')
      .getPublicUrl(fileName);
    
    imageUrl = publicUrl;
  }

  // Save to database
  const { data, error } = await supabase
    .from('student_works')
    .insert([
      { 
        title: formData.title,
        description: formData.description,
        student_name: formData.student_name,
        student_class: formData.student_class,
        year: formData.year,
        project_link: formData.project_link || null,
        image_url: imageUrl
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating student work:', error);
    throw error;
  }

  return data;
};

export const updateStudentWork = async (
  id: string, 
  formData: StudentWorkFormData, 
  currentImageUrl: string | null
): Promise<StudentWork> => {
  let imageUrl = currentImageUrl;
  
  // Upload new image if provided
  if (formData.image) {
    // Delete old image if exists
    if (currentImageUrl) {
      const fileName = currentImageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('student-works')
          .remove([fileName]);
      }
    }

    // Upload new image
    const fileName = `student-works/${Date.now()}-${formData.image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('student-works')
      .upload(fileName, formData.image);

    if (uploadError) {
      console.error('Error uploading student work image:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('student-works')
      .getPublicUrl(fileName);
    
    imageUrl = publicUrl;
  }

  // Update in database
  const { data, error } = await supabase
    .from('student_works')
    .update({
      title: formData.title,
      description: formData.description,
      student_name: formData.student_name,
      student_class: formData.student_class,
      year: formData.year,
      project_link: formData.project_link || null,
      ...(imageUrl && { image_url: imageUrl }),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating student work:', error);
    throw error;
  }

  return data;
};

export const deleteStudentWork = async (id: string, imageUrl: string | null): Promise<void> => {
  // Delete image from storage if exists
  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('student-works')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting student work image:', storageError);
      }
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('student_works')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student work:', error);
    throw error;
  }
};
