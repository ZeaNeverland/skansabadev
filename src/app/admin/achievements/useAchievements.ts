import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Achievement, 
  AchievementFormData, 
  AchievementState 
} from './types';
import { 
  fetchAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement,
  uploadAchievementImage,
  deleteAchievementImage
} from './achievements-service';

const initialFormData: AchievementFormData = {
  title: '',
  description: '',
  student: '',
  event: '',
  date: new Date().toISOString().split('T')[0],
  level: 'Sekolah',
  image: null,
};

export const useAchievements = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<AchievementState>({
    achievements: [],
    loading: false,
    error: null,
    formData: { ...initialFormData },
    isEditing: false,
    editingId: null,
  });

  const loadAchievements = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchAchievements();
      setState(prev => ({ ...prev, achievements: data, loading: false }));
    } catch (error) {
      console.error('Error loading achievements:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat data prestasi. Silakan coba lagi.'
      }));
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          image: file,
          image_url: URL.createObjectURL(file)
        }
      }));
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setState(prev => ({
      ...prev,
      formData: {
        title: achievement.title,
        description: achievement.description || '',
        student: achievement.student,
        event: achievement.event,
        date: achievement.date,
        level: achievement.level,
        image_url: achievement.image_url || '',
      },
      isEditing: true,
      editingId: achievement.id
    }));
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      formData: { ...initialFormData },
      isEditing: false,
      editingId: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!state.formData.title || !state.formData.student || !state.formData.event || !state.formData.date) {
      toast({
        title: 'Error',
        description: 'Harap lengkapi semua field yang wajib diisi',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      let imageUrl = state.formData.image_url || '';
      
      // Upload new image if exists
      if (state.formData.image) {
        // If editing and has existing image, delete the old one first
        if (state.isEditing && state.formData.image_url) {
          try {
            await deleteAchievementImage(state.formData.image_url);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue with upload even if deletion fails
          }
        }
        
        imageUrl = await uploadAchievementImage(state.formData.image);
      }

      const formDataWithImage = {
        ...state.formData,
        image_url: imageUrl
      };

      if (state.isEditing && state.editingId) {
        await updateAchievement(state.editingId, formDataWithImage);
        toast({
          title: 'Sukses',
          description: 'Prestasi berhasil diperbarui',
        });
      } else {
        await createAchievement(formDataWithImage);
        toast({
          title: 'Sukses',
          description: 'Prestasi berhasil ditambahkan',
        });
      }

      resetForm();
      loadAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan prestasi. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await deleteAchievement(id, imageUrl);
      toast({
        title: 'Sukses',
        description: 'Prestasi berhasil dihapus',
      });
      loadAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus prestasi. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
  };
};
