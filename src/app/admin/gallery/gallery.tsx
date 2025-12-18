"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Image as ImageIcon, ExternalLink, Calendar, Save, X, Upload } from "lucide-react";
import { useGallery } from "./useGallery";

export default function AdminGalleryPage() {
  const {
    activities,
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
  } = useGallery();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 container mx-auto px-4 pt-8 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Galeri Kegiatan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola kegiatan dan tautan Google Drive untuk galeri
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Form Section */}
        <Card className="mb-8" id="gallery-form">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                {editingId ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              {editingId ? "Perbarui informasi kegiatan" : "Tambahkan kegiatan baru ke galeri"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Nama Kegiatan</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="activity_date">Tanggal</Label>
                  <Input
                    id="activity_date"
                    name="activity_date"
                    value={formData.activity_date}
                    onChange={handleInputChange}
                    placeholder="Contoh: 15-20 Januari 2024"
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="participants">Jumlah Peserta</Label>
                <Input
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  placeholder="Contoh: 45 Siswa"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="drive_url">Link Google Drive</Label>
                <Input
                  id="drive_url"
                  name="drive_url"
                  value={formData.drive_url}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/drive/folders/..."
                  required
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image">Thumbnail</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG atau JPEG (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isSubmitting}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {formData.imagePreview && (
                    <div className="flex-shrink-0">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
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
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Simpan
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                Daftar Kegiatan
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  document.getElementById('gallery-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kegiatan
              </Button>
            </CardTitle>
            <CardDescription>
              Kelola kegiatan yang telah ditambahkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Belum ada kegiatan</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Tambahkan kegiatan baru untuk menampilkan di galeri.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Thumbnail</TableHead>
                      <TableHead>Nama Kegiatan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Peserta</TableHead>
                      <TableHead>Google Drive</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          {activity.cover_image_url ? (
                            <img
                              src={activity.cover_image_url}
                              alt={activity.title}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/64x64/e2e8f0/64748b?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{activity.title}</div>
                            {activity.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {activity.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {activity.activity_date ? (
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                              {activity.activity_date}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {activity.participants ? (
                            <div className="flex items-center">
                              <Badge variant="secondary">{activity.participants}</Badge>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <a
                            href={activity.drive_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Lihat
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(activity)}
                              disabled={isDeleting[activity.id] || isSubmitting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => activity.cover_image_url && handleDelete(activity.id, activity.cover_image_url)}
                              disabled={isDeleting[activity.id] || isSubmitting}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              {isDeleting[activity.id] ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </span>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}