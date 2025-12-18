import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StudentWork, StudentWorkState } from './types';
import {
  fetchStudentWorks,
  createStudentWork,
  updateStudentWork,
  deleteStudentWork
} from './student-works-service';

export const useStudentWorks = (initialStudentWorks: StudentWork[] = []) => {
  const [state, setState] = useState<StudentWorkState>({
    studentWorks: initialStudentWorks,
    loading: false,
    error: null,
    isSubmitting: false,
    isDeleting: {},
    formData: {
      title: '',
      description: '',
      student_name: '',
      class: '',
      year: new Date().getFullYear(),
      project_link: '',
      image: null,
      imagePreview: ''
    },
    editingId: null
  });

  const { toast } = useToast();

  const loadStudentWorks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const studentWorksData = await fetchStudentWorks();
      setState(prev => ({
        ...prev,
        studentWorks: studentWorksData,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading student works:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat karya siswa. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal memuat karya siswa. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    loadStudentWorks();
  }, [loadStudentWorks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle number inputs
    const finalValue = name === 'year' ? parseInt(value, 10) || new Date().getFullYear() : value;

    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: finalValue
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

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Ukuran gambar maksimal 5MB',
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

  const handleEdit = (studentWork: StudentWork) => {
    setState(prev => ({
      ...prev,
      formData: {
        title: studentWork.title,
        description: studentWork.description,
        student_name: studentWork.student_name,
        class: studentWork.class,
        year: studentWork.year,
        image: null,
        imagePreview: studentWork.image_url || ''
      },
      editingId: studentWork.id
    }));

    // Scroll to form
    document.getElementById('student-work-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        title: '',
        description: '',
        student_name: '',
        class: '',
        year: new Date().getFullYear(),
        image: null,
        imagePreview: ''
      },
      editingId: null
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, student_name, class: studentClass, year } = state.formData;

    // Validasi input
    if (!title.trim() || !description.trim() || !student_name.trim() || !studentClass.trim() || !year) {
      toast({
        title: 'Error',
        description: 'Semua field harus diisi dengan valid',
        variant: 'destructive'
      });
      return;
    }

    // Validasi tahun
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      toast({
        title: 'Error',
        description: `Tahun harus antara 2000 dan ${currentYear + 1}`,
        variant: 'destructive'
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      if (state.editingId) {
        // Update existing student work
        const currentWork = state.studentWorks.find(sw => sw.id === state.editingId);
        if (!currentWork) throw new Error('Student work not found');

        const updatedWork = await updateStudentWork(
          state.editingId,
          state.formData,
          currentWork.image_url
        );

        setState(prev => ({
          ...prev,
          studentWorks: prev.studentWorks.map(sw =>
            sw.id === state.editingId ? updatedWork : sw
          ),
          isSubmitting: false
        }));

        toast({
          title: 'Sukses',
          description: 'Karya siswa berhasil diperbarui',
          variant: 'default'
        });
      } else {
        // Create new student work
        const newWork = await createStudentWork(state.formData);

        setState(prev => ({
          ...prev,
          studentWorks: [newWork, ...prev.studentWorks],
          isSubmitting: false
        }));

        toast({
          title: 'Sukses',
          description: 'Karya siswa berhasil ditambahkan',
          variant: 'default'
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving student work:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Gagal menyimpan karya siswa. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal menyimpan karya siswa. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya siswa ini?')) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: true }
      }));

      await deleteStudentWork(id, imageUrl);

      setState(prev => ({
        ...prev,
        studentWorks: prev.studentWorks.filter(sw => sw.id !== id),
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));

      toast({
        title: 'Sukses',
        description: 'Karya siswa berhasil dihapus',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting student work:', error);
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));
      toast({
        title: 'Error',
        description: 'Gagal menghapus karya siswa. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  return {
    ...state,
    loadStudentWorks,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  };
};