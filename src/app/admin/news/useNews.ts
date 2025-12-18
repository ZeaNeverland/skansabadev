import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { News, NewsState } from './types';
import { fetchNews, createNews, updateNews, deleteNews } from './news-service';

export const useNews = (initialNews: News[] = []) => {
  const [state, setState] = useState<NewsState>({
    news: initialNews,
    loading: false,
    error: null,
    isSubmitting: false,
    isDeleting: {},
    formData: {
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0], // Default to today's date
      featured: false,
      image: null,
      imagePreview: ''
    },
    editingId: null
  });

  const { toast } = useToast();

  const loadNews = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const newsData = await fetchNews();
      setState(prev => ({ ...prev, news: newsData, loading: false }));
    } catch (error) {
      console.error('Error loading news:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat berita. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal memuat berita. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

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

  const handleEdit = (newsItem: News) => {
    setState(prev => ({
      ...prev,
      formData: {
        title: newsItem.title,
        excerpt: newsItem.excerpt || '',
        content: newsItem.content,
        date: newsItem.date || new Date().toISOString().split('T')[0],
        featured: newsItem.featured || false,
        image: null,
        imagePreview: newsItem.image_url || ''
      },
      editingId: newsItem.id
    }));
    // Scroll to form
    document.getElementById('news-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        title: '',
        excerpt: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        image: null,
        imagePreview: ''
      },
      editingId: null
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { title, excerpt, content } = state.formData;
    
    if (!title || !excerpt || !content) {
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
        // Update existing news
        const currentNews = state.news.find(n => n.id === state.editingId);
        if (!currentNews) throw new Error('News not found');
        
        const updatedNews = await updateNews(
          state.editingId,
          state.formData,
          currentNews.image_url
        );
        
        setState(prev => ({
          ...prev,
          news: prev.news.map(n => n.id === state.editingId ? updatedNews : n),
          isSubmitting: false
        }));
        
        toast({
          title: 'Sukses',
          description: 'Berita berhasil diperbarui',
          variant: 'default'
        });
      } else {
        // Create new news
        const newNews = await createNews(state.formData);
        
        setState(prev => ({
          ...prev,
          news: [newNews, ...prev.news],
          isSubmitting: false
        }));
        
        toast({
          title: 'Sukses',
          description: 'Berita berhasil ditambahkan',
          variant: 'default'
        });
      }
      
      resetForm();
      // Refresh the news data
      await loadNews();
    } catch (error) {
      console.error('Error saving news:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Gagal menyimpan berita. Silakan coba lagi.'
      }));
      toast({
        title: 'Error',
        description: 'Gagal menyimpan berita. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: true }
      }));

      await deleteNews(id, imageUrl);
      
      setState(prev => ({
        ...prev,
        news: prev.news.filter(n => n.id !== id),
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));
      
      toast({
        title: 'Sukses',
        description: 'Berita berhasil dihapus',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      setState(prev => ({
        ...prev,
        isDeleting: { ...prev.isDeleting, [id]: false }
      }));
      toast({
        title: 'Error',
        description: 'Gagal menghapus berita. Silakan coba lagi.',
        variant: 'destructive'
      });
    }
  };

  return {
    ...state,
    loadNews,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  };
};
