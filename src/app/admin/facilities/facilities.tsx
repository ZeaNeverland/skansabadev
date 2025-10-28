import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Image as ImageIcon, X, Save, Plus } from "lucide-react";
import { useFacilities } from "./useFacilities";
import { Image } from "@/components/ui/Image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const Facilities = () => {
  const {
    facilities,
    loading,
    error,
    isSubmitting,
    isDeleting,
    formData,
    editingId,
    handleInputChange,
    handleFeaturesChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  } = useFacilities();

  const [featureInput, setFeatureInput] = useState("");

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      handleFeaturesChange([...formData.features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    handleFeaturesChange(formData.features.filter(f => f !== feature));
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="space-y-6">
      <Card id="facility-form">
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Perbarui informasi fasilitas' : 'Tambahkan fasilitas baru ke situs'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Nama Fasilitas</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama fasilitas"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi fasilitas"
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="features">Fitur</Label>
              <div className="flex gap-2">
                <Input
                  id="features"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyPress}
                  placeholder="Tambahkan fitur dan tekan Enter"
                  disabled={isSubmitting}
                />
                <Button type="button" onClick={handleAddFeature} disabled={isSubmitting}>
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image">Gambar Fasilitas</Label>
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
                    {editingId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Fasilitas</CardTitle>
          <CardDescription>
            Kelola fasilitas yang telah ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada fasilitas</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan fasilitas baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <div key={facility.id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    {facility.image_url ? (
                      <Image
                        src={facility.image_url}
                        alt={facility.name}
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
                        onClick={() => handleEdit(facility)}
                        disabled={isDeleting[facility.id] || isSubmitting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleDelete(facility.id, facility.image_url)}
                        disabled={isDeleting[facility.id] || isSubmitting}
                      >
                        {isDeleting[facility.id] ? (
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
                    <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {facility.description}
                    </p>
                    {facility.features && facility.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {facility.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Diperbarui: {new Date(facility.updated_at).toLocaleDateString('id-ID', {
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

export default Facilities;