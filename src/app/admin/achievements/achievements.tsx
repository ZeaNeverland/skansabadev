'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAchievements } from "./useAchievements";
import { Trash2, Edit, X, Image as ImageIcon } from "lucide-react";
// Using standard img tag instead of next/image since this is a Vite project

export const Achievements = () => {
  const {
    achievements,
    loading,
    formData,
    isEditing,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
  } = useAchievements();

  const renderErrorIndicator = (hasError: boolean, fieldName: string) => {
    if (!hasError) return null;
    return <p className="text-sm text-red-500 mt-1">{fieldName} harus diisi</p>;
  };
  
  // Check for required fields
  const isTitleEmpty = !formData.title.trim();
  const isStudentEmpty = !formData.student.trim();
  const isEventEmpty = !formData.event.trim();
  const isDateEmpty = !formData.date.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Perbarui informasi prestasi' 
              : 'Isi formulir di bawah untuk menambahkan prestasi baru'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Judul Prestasi *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Juara 1 Lomba Cerdas Cermat"
                  className={isTitleEmpty ? 'border-red-500' : ''}
                />
                {renderErrorIndicator(isTitleEmpty, 'Judul prestasi')}
              </div>
              <div>
                <Label>Nama Siswa *</Label>
                <Input
                  name="student"
                  value={formData.student}
                  onChange={handleInputChange}
                  placeholder="Nama siswa yang meraih prestasi"
                  className={isStudentEmpty ? 'border-red-500' : ''}
                />
                {renderErrorIndicator(isStudentEmpty, 'Nama siswa')}
              </div>
            </div>

            <div>
              <Label>Nama Event/Kompetisi *</Label>
              <Input
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                placeholder="Nama event atau kompetisi"
                className={isEventEmpty ? 'border-red-500' : ''}
              />
              {renderErrorIndicator(isEventEmpty, 'Nama event')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tanggal *</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={isDateEmpty ? 'border-red-500' : ''}
                />
                {renderErrorIndicator(isDateEmpty, 'Tanggal')}
              </div>
              <div>
                <Label>Tingkat *</Label>
                <Select
                  name="level"
                  value={formData.level}
                  onValueChange={(value) => 
                    handleInputChange({ 
                      target: { 
                        name: 'level', 
                        value 
                      } 
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sekolah">Sekolah</SelectItem>
                    <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                    <SelectItem value="Kota/Kabupaten">Kota/Kabupaten</SelectItem>
                    <SelectItem value="Provinsi">Provinsi</SelectItem>
                    <SelectItem value="Nasional">Nasional</SelectItem>
                    <SelectItem value="Internasional">Internasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gambar</Label>
                <div className="flex items-center gap-2">
                  <label 
                    className="flex-1 flex items-center justify-center h-10 px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {formData.image_url ? 'Ganti Gambar' : 'Unggah Gambar'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </label>
                  {formData.image_url && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        handleInputChange({ 
                          target: { 
                            name: 'image_url', 
                            value: '' 
                          } 
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {formData.image_url && (
                  <div className="mt-2 relative w-32 h-24 rounded-md overflow-hidden border">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat tentang prestasi"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Batal
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={loading || isTitleEmpty || isStudentEmpty || isEventEmpty || isDateEmpty}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </div>
                ) : isEditing ? (
                  'Perbarui Prestasi'
                ) : (
                  'Tambah Prestasi'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Prestasi</CardTitle>
          <CardDescription>
            Kelola daftar prestasi yang telah ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && achievements.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data prestasi
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {achievement.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.student} • {achievement.event} • {new Date(achievement.date).toLocaleDateString('id-ID')}
                      </p>
                      {achievement.description && (
                        <p className="text-sm mt-1 line-clamp-2">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {achievement.image_url && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                          <img
                            src={achievement.image_url}
                            alt={achievement.title}
                            width={100}
                            height={100}
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(achievement)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(achievement.id, achievement.image_url || undefined)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default Achievements;
