import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Facility, FacilityState } from './types';
import { fetchFacilities, createFacility, updateFacility, deleteFacility } from './facilities-service';

export const useFacilities = (initialFacilities: Facility[] = []) => {
  const [state, setState] = useState<FacilityState>({
    facilities: initialFacilities,
    loading: false,
    error: null,
    isSubmitting: false,
    isDeleting: {},
    formData: {
      name: '',
      description: '',
      features: [],
      image: null,
      imagePreview: ''
    },
    editingId: null
  });

  const { toast } = useToast();

  const loadFacilities = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const facilitiesData = await fetchFacilities();
      setState(prev => ({ ...prev, facilities: facilitiesData, loading: false }));
    } catch (error) {
      console.error('Error loading facilities:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat fasilitas. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal memuat fasilitas. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

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

  const handleFeaturesChange = (features: string[]) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        features
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'File harus berupa gambar',
        variant: 'destructive'
      });
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

  const handleEdit = (facility: Facility) => {
    setState(prev => ({
      ...prev,
      formData: {
        name: facility.name,
        description: facility.description,
        features: facility.features || [],
        image: null,
        imagePreview: facility.image_url || ''
      },
      editingId: facility.id
    }));
    // Scroll to form
    document.getElementById('facility-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      formData: {
        name: '',
        description: '',
        features: [],
        image: null,
        imagePreview: ''
      },
      editingId: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description } = state.formData;

    if (!name || !description) {
      toast({
        title: 'Error',
        description: 'Semua field harus diisi',
        variant: 'destructive'
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      if (state.editingId) {
        // Update existing facility
        const currentFacility = state.facilities.find(f => f.id === state.editingId);
        if (!currentFacility) throw new Error('Facility not found');

        const updatedFacility = await updateFacility(
          state.editingId,
          state.formData,
          currentFacility.image_url
        );

        setState(prev => ({
          ...prev,
          facilities: prev.facilities.map(f => f.id === state.editingId ? updatedFacility : f),
          isSubmitting: false
        }));

        toast({
          title: 'Sukses',
          description: 'Fasilitas berhasil diperbarui',
          variant: 'default'
        });
      } else {
        // Create new facility
        const newFacility = await createFacility(state.formData);

        setState(prev => ({
          ...prev,
          facilities: [newFacility, ...prev.facilities],
          isSubmitting: false
        }));

        toast({
          title: 'Sukses',
          description: 'Fasilitas berhasil ditambahkan',
          variant: 'default'
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving facility:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Gagal menyimpan fasilitas. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal menyimpan fasilitas. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: true }
      }));

      await deleteFacility(id, imageUrl);

      setState(prev => ({
        ...prev,
        facilities: prev.facilities.filter(f => f.id !== id),
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));

      toast({
        title: 'Sukses',
        description: 'Fasilitas berhasil dihapus',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting facility:', error);
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));
      toast({
        title: 'Error',
        description: 'Gagal menghapus fasilitas. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  return {
    ...state,
    loadFacilities,
    handleInputChange,
    handleFeaturesChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  };
};