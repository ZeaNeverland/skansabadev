// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { Database } from "@/types/database.types";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Tables = Database['public']['Tables'];
type News = Tables['news']['Row'];
type Facility = Tables['facilities']['Row'];
type Achievement = Tables['achievements']['Row'];
type StudentWork = Tables['student_works']['Row'];

interface FormData {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  image_url?: string | null;
  features?: string[];
  date?: string;
  student_name?: string;
  class?: string;
  featureInput?: string;
  event?: string;
  level?: string;
  photo_url?: string | null;
  student?: string;
  year?: string | number;
  [key: string]: any; // For dynamic access
}

// Helper function to handle file uploads
const uploadFile = async (file: File, folder: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, or WebP)');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB');
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to get public URL for the uploaded file');
    }

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
  }
};

const Admin = () => {
  const [news, setNews] = useState<News[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("news");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // 🔹 Fetch data from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data in parallel for better performance
      const [
        { data: newsData, error: newsError },
        { data: facilitiesData, error: facilitiesError },
        { data: achievementsData, error: achievementsError },
        { data: studentWorksData, error: studentWorksError }
      ] = await Promise.all([
        supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false }),
        
        supabase
          .from("facilities")
          .select("*")
          .order("created_at", { ascending: false }),
        
        supabase
          .from("achievements")
          .select("*")
          .order("date", { ascending: false }),
        
        supabase
          .from("student_works")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      // Handle errors
      const errors = [newsError, facilitiesError, achievementsError, studentWorksError].filter(Boolean);
      if (errors.length > 0) {
        throw new Error(errors.map(e => e?.message).join('; '));
      }

      // Update state
      setNews((newsData || []) as News[]);
      setFacilities((facilitiesData || []) as Facility[]);
      setAchievements((achievementsData || []) as Achievement[]);
      setStudentWorks((studentWorksData || []) as StudentWork[]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        handleFileUpload(e as React.ChangeEvent<HTMLInputElement>);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 Handle feature input for facilities
  const handleAddFeature = () => {
    if (!formData.featureInput?.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), prev.featureInput!.trim()],
      featureInput: ''
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  // 🔹 Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadFile(file, activeTab);
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      toast({ title: "Upload berhasil", description: "Gambar berhasil diunggah" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah file';
      toast({
        title: "Upload gagal",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      description: '',
      image_url: null,
      features: [],
      date: '',
      student_name: '',
      class: '',
      featureInput: '',
      event: '',
      level: '',
      photo_url: null,
      student: '',
      year: ''
    });
    setEditId(null);
  };

  // 🔹 CRUD Operations for Facilities
  const handleEdit = (item: News | Facility | Achievement | StudentWork) => {
    setFormData({
      id: item.id,
      title: 'title' in item ? item.title : 'name' in item ? item.name : '',
      description: item.description || '',
      image_url: 'image_url' in item ? item.image_url : 'photo_url' in item ? item.photo_url : null,
      features: 'features' in item ? item.features : [],
      date: 'date' in item ? item.date : '',
      student_name: 'student_name' in item ? item.student_name : '',
      class: 'class' in item ? item.class : '',
      event: 'event' in item ? item.event : '',
      level: 'level' in item ? item.level : '',
      student: 'student' in item ? item.student : '',
      year: 'year' in item ? item.year : ''
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFacility = async () => {
    try {
      const { error } = await supabase.from('facilities').insert([{
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        features: formData.features || []
      }]);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Fasilitas berhasil ditambahkan" });
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal menambahkan fasilitas",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateFacility = async () => {
    if (!editId) return;
    
    try {
      const { error } = await supabase
        .from('facilities')
        .update({
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          features: formData.features || []
        })
        .eq('id', editId);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Fasilitas berhasil diperbarui" });
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal memperbarui fasilitas",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) return;
    
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Fasilitas berhasil dihapus" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus fasilitas",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddAchievement = async () => {
    const achievementData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      event: formData.event || '',
      level: formData.level || 'Sekolah',
      photo_url: formData.image_url || null,
      student: formData.student,
      year: formData.year || new Date().getFullYear().toString()
    };

    try {
      const { error } = await supabase
        .from('achievements')
        .insert([achievementData]);

      if (error) throw error;
      
      // Add success handling here (e.g., show success message, reset form, refresh data)
    } catch (error) {
      console.error('Error adding achievement:', error);
      // Add error handling here
    }
  };
  const handleUpdateAchievement = async () => {
    if (!editId) return;
    
    try {
      const { error } = await supabase
        .from('achievements')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          date: formData.date
        })
        .eq('id', editId);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Prestasi berhasil diperbarui" });
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal memperbarui prestasi",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return;
    
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Prestasi berhasil dihapus" });
      fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus prestasi';
      toast({
        title: "Gagal menghapus prestasi",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // 🔹 CRUD Operations for Student Works
  const handleAddStudentWork = async () => {
    try {
      if (!formData.title || !formData.description || !formData.student_name || !formData.class) {
        throw new Error('Semua field harus diisi');
      }

      const studentWorkData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        student_name: formData.student_name,
        class: formData.class
      };

      const { error } = await supabase
        .from('student_works')
        .insert([studentWorkData]);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Karya siswa berhasil ditambahkan" });
      resetForm();
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan karya siswa';
      toast({
        title: "Gagal menambahkan karya siswa",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleUpdateStudentWork = async () => {
    if (!editId) return;
    
    try {
      if (!formData.title || !formData.description || !formData.student_name || !formData.class) {
        throw new Error('Semua field harus diisi');
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        student_name: formData.student_name,
        class: formData.class,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('student_works')
        .update(updateData)
        .eq('id', editId);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Karya siswa berhasil diperbarui" });
      resetForm();
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui karya siswa';
      toast({
        title: "Gagal memperbarui karya siswa",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudentWork = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya siswa ini?')) return;
    
    try {
      const { error } = await supabase
        .from('student_works')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Karya siswa berhasil dihapus" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus karya siswa",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'news') {
        if (editId) {
          await handleUpdateNews();
        } else {
          await handleAddNews();
        }
      } else if (activeTab === 'facilities') {
        if (editId) {
          await handleUpdateFacility();
        } else {
          await handleAddFacility();
        }
      } else if (activeTab === 'achievements') {
        if (editId) {
          await handleUpdateAchievement();
        } else {
          await handleAddAchievement();
        }
      } else if (activeTab === 'student-works') {
        if (editId) {
          await handleUpdateStudentWork();
        } else {
          await handleAddStudentWork();
        }
      }
      resetForm();
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const filePath = `${activeTab}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: "Upload berhasil",
        description: "Gambar berhasil diunggah"
      });
      
      return publicUrl;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah file';
      toast({
        title: "Upload gagal",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // 🔹 Tambah berita
  const addNews = async () => {
    const { error } = await supabase.from("news").insert([addData]);
    if (error) {
      toast({ title: "Error adding news", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Berita berhasil ditambahkan" });
      setAddData({});
      fetchNews();
    }
  };

  // 🔹 Edit berita
  const updateNews = async (id: string) => {
    const { error } = await supabase.from("news").update(addData).eq("id", id);
    if (error) {
      toast({ title: "Error updating", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Berita berhasil diperbarui" });
      setEditId(null);
      setAddData({});
      fetchNews();
    }
  };

  // 🔹 Hapus berita
  const handleDeleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      
      toast({ 
        title: "Berhasil", 
        description: "Berita berhasil dihapus" 
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus berita",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Render form based on active tab
  const renderForm = () => {
    switch (activeTab) {
      case 'facilities':
        return (
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Nama Fasilitas"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Deskripsi"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium">Fitur-fitur (tekan Enter untuk menambahkan)</label>
              <div className="flex gap-2">
                <Input
                  name="featureInput"
                  placeholder="Tambah fitur"
                  value={formData.featureInput || ''}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature}>
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features?.map((feature, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gambar</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="cursor-pointer"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Mengunggah...' : editId ? 'Perbarui' : 'Tambah'}
              </Button>
              {editId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="space-y-4">
            <Input
              name="title"
              placeholder="Judul Prestasi"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Deskripsi"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
            />
            <Input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Gambar</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="cursor-pointer"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Mengunggah...' : editId ? 'Perbarui' : 'Tambah'}
              </Button>
              {editId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        );
      
      case 'student-works':
        return (
          <div className="space-y-4">
            <Input
              name="title"
              placeholder="Judul Karya"
              value={formData.title || ''}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Deskripsi"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
            />
            <Input
              name="student_name"
              placeholder="Nama Siswa"
              value={formData.student_name || ''}
              onChange={handleInputChange}
              required
            />
            <Input
              name="class"
              placeholder="Kelas"
              value={formData.class || ''}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Karya</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="cursor-pointer"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Mengunggah...' : editId ? 'Perbarui' : 'Tambah'}
              </Button>
              {editId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="mb-6 text-gray-600">Selamat datang, <span className="font-semibold text-blue-600">Admin</span> 👋</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="news">Berita</TabsTrigger>
            <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
            <TabsTrigger value="achievements">Prestasi</TabsTrigger>
            <TabsTrigger value="student-works">Karya Siswa</TabsTrigger>
          </TabsList>

          {/* CRUD BERITA */}
          {/* News Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Berita</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  <Input
                    name="title"
                    placeholder="Judul"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <Textarea
                    name="description"
                    placeholder="Deskripsi"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Gambar</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? 'Mengunggah...' : editId ? 'Perbarui' : 'Tambah'}
                    </Button>
                    {editId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Batal
                      </Button>
                    )}
                  </div>
                </form>

                {/* News List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-md hover:shadow-lg transition">
                        <img
                          src={item.image_url || "https://via.placeholder.com/400"}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{item.description}</p>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item, 'news')}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteNews(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Fasilitas</CardTitle>
                <p className="text-sm text-gray-500">Tambah dan kelola fasilitas sekolah</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  {renderForm()}
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.map((facility) => (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-md hover:shadow-lg transition">
                        <img
                          src={facility.image_url || "https://via.placeholder.com/400"}
                          alt={facility.name}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{facility.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{facility.description}</p>
                          {facility.features && facility.features.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm font-medium">Fasilitas:</p>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {facility.features.slice(0, 3).map((feature, idx) => (
                                  <li key={idx} className="truncate">{feature}</li>
                                ))}
                                {facility.features.length > 3 && (
                                  <li className="text-blue-600">+{facility.features.length - 3} lainnya</li>
                                )}
                              </ul>
                            </div>
                          )}
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(facility, 'facilities')}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFacility(facility.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Prestasi</CardTitle>
                <p className="text-sm text-gray-500">Tambah dan kelola prestasi siswa</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  {renderForm()}
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-md hover:shadow-lg transition">
                        <img
                          src={achievement.image_url || "https://via.placeholder.com/400"}
                          alt={achievement.title}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <p className="text-sm text-gray-500">
                            {new Date(achievement.date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{achievement.description}</p>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(achievement, 'achievements')}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAchievement(achievement.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Works Tab */}
          <TabsContent value="student-works">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Karya Siswa</CardTitle>
                <p className="text-sm text-gray-500">Tambah dan kelola karya siswa</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  {renderForm()}
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentWorks.map((work) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-md hover:shadow-lg transition">
                        <img
                          src={work.image_url || "https://via.placeholder.com/400"}
                          alt={work.title}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{work.title}</CardTitle>
                          <p className="text-sm text-gray-500">
                            {work.student_name} • {work.class}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{work.description}</p>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(work, 'student-works')}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStudentWork(work.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
