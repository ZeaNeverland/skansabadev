import { Image } from "@/components/ui/Image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Image as ImageIcon, X, Save, Plus } from "lucide-react";
import { useStudentWorks } from "./useStudentWorks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export const StudentWorks = () => {
  const {
    studentWorks,
    loading,
    error,
    isSubmitting,
    isDeleting,
    formData,
    editingId,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  } = useStudentWorks();

  return (
    <div className="space-y-6">
      <Card id="student-work-form">
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Karya Siswa' : 'Tambah Karya Siswa Baru'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Perbarui informasi karya siswa' : 'Tambahkan karya siswa baru ke galeri'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Karya</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul karya"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_name">Nama Siswa</Label>
                <Input
                  id="student_name"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap siswa"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_class">Kelas</Label>
                <Input
                  id="student_class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="Contoh: X RPL 1"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Tahun</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: 'year', value: parseInt(value, 10) }
                    } as unknown as React.ChangeEvent<HTMLInputElement>)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Karya</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsikan karya siswa secara detail"
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_link">Link Proyek (Opsional)</Label>
              <Input
                id="project_link"
                name="project_link"
                type="url"
                value={formData.project_link || ''}
                onChange={handleInputChange}
                placeholder="https://github.com/username/project"
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                Contoh: https://github.com/username/project
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar Karya</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="cursor-pointer"
              />
              {(formData.imagePreview || (editingId && formData.imagePreview === '')) && (
                <div className="mt-2 relative w-64 h-48 border rounded-md overflow-hidden">
                  <Image
                    src={formData.imagePreview || ''}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingId ? 'Menyimpan...' : 'Mengunggah...'}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {editingId ? (
                      <Save className="w-4 h-4 mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {editingId ? 'Simpan Perubahan' : 'Tambah Karya'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Karya Siswa</CardTitle>
          <CardDescription>
            Kelola karya-karya siswa yang telah ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : studentWorks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada karya siswa</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan karya siswa baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentWorks.map((work) => (
                <div key={work.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {work.image_url ? (
                      <Image
                        src={work.image_url}
                        alt={work.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleEdit(work)}
                        disabled={isDeleting[work.id] || isSubmitting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleDelete(work.id, work.image_url)}
                        disabled={isDeleting[work.id] || isSubmitting}
                      >
                        {isDeleting[work.id] ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{work.title}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-900">{work.student_name}</p>
                    <p className="text-xs text-gray-500">
                      {work.class} • {work.year}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {work.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Diperbarui: {new Date(work.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentWorks;
