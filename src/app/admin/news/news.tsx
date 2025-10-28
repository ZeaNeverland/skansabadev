import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Image as ImageIcon, X, Save, Plus } from "lucide-react";
import { useNews } from "./useNews";
import { Image } from "@/components/ui/Image";

export const News = () => {
  const {
    news,
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
  } = useNews();

  return (
    <div className="space-y-6">
      <Card id="news-form">
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Perbarui informasi berita' : 'Tambahkan berita baru ke situs'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Judul Berita</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul berita"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Masukkan ringkasan berita"
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="content">Konten Lengkap</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Masukkan konten lengkap berita"
                disabled={isSubmitting}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date || ''}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'featured',
                        value: e.target.checked
                      }
                    } as unknown)}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium leading-none">
                    Featured
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image">Gambar Utama</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="cursor-pointer"
              />
              {formData.imagePreview && (
                <div className="mt-2 relative w-64 h-48 border rounded-md overflow-hidden">
                  <Image
                    src={formData.imagePreview}
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
                    {editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>
          <CardDescription>
            Kelola berita yang telah ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada berita</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan berita baru.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="md:flex">
                    {item.image_url && (
                      <div className="md:flex-shrink-0 md:w-48 h-48 relative">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            disabled={isDeleting[item.id] || isSubmitting}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.image_url)}
                            disabled={isDeleting[item.id] || isSubmitting}
                          >
                            {isDeleting[item.id] ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              </span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{item.excerpt}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        Dibuat pada: {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
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

export default News;
