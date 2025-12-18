import { useState, useEffect, useCallback } from 'react';
import { Activity, GalleryState } from './types';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from './gallery-service';

export const useGallery = (initialActivities: Activity[] = []) => {
  const [state, setState] = useState<GalleryState>({
    activities: initialActivities,
    loading: false,
    error: null,
    isSubmitting: false,
    isDeleting: {},
    formData: {
      title: '',
      description: '',
      drive_url: '',
      activity_date: '',
      participants: '',
      image: null,
      imagePreview: ''
    },
    editingId: null
  });

  const loadActivities = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const activitiesData = await fetchActivities();
      setState(prev => ({ ...prev, activities: activitiesData, loading: false }));
    } catch (error) {
      console.error('Error loading activities:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat kegiatan. Silakan coba lagi.'
      }));
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    // Set image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          image: file,
          imagePreview: reader.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (activity: Activity) => {
    setState(prev => ({
      ...prev,
      formData: {
        title: activity.title,
        description: activity.description || '',
        drive_url: activity.drive_url,
        activity_date: activity.activity_date || '',
        participants: activity.participants || '',
        image: null,
        imagePreview: activity.cover_image_url || ''
      },
      editingId: activity.id
    }));
  };

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        title: '',
        description: '',
        drive_url: '',
        activity_date: '',
        participants: '',
        image: null,
        imagePreview: ''
      },
      editingId: null
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, drive_url } = state.formData;

    if (!title || !drive_url) {
      alert('Nama kegiatan dan link Google Drive harus diisi');
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      if (state.editingId) {
        // Update existing activity
        const currentActivity = state.activities.find(a => a.id === state.editingId);
        if (!currentActivity) throw new Error('Activity not found');

        const updatedActivity = await updateActivity(
          state.editingId,
          state.formData,
          currentActivity.cover_image_url
        );

        setState(prev => ({
          ...prev,
          activities: prev.activities.map(a => a.id === state.editingId ? updatedActivity : a),
          isSubmitting: false
        }));
      } else {
        // Create new activity
        const newActivity = await createActivity(state.formData);

        setState(prev => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
          isSubmitting: false
        }));
      }

      resetForm();
      // Refresh the activities data
      await loadActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Gagal menyimpan kegiatan. Silakan coba lagi.'
      }));
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: true }
      }));

      await deleteActivity(id, imageUrl);

      setState(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a.id !== id),
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));
    } catch (error) {
      console.error('Error deleting activity:', error);
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: false },
        error: 'Gagal menghapus kegiatan. Silakan coba lagi.'
      }));
    }
  };

  return {
    ...state,
    loadActivities,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  };
};