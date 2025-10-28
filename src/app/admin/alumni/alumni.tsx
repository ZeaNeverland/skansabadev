import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAlumni } from "./useAlumni";

const AlumniAdmin = () => {
  const {
    items,
    loading,
    isSubmitting,
    isDeleting,
    formData,
    handleInputChange,
    handleImageChange,
    handleEdit,
    handleSubmit,
    handleDelete,
    resetForm
  } = useAlumni();

  return (
    <div className="space-y-6">
      <Card id="alumni-form">
        <CardHeader>
          <CardTitle>Tambah / Edit Alumni</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama lengkap" />
            </div>
            <div>
              <Label htmlFor="angkatan">Angkatan</Label>
              <Input id="angkatan" name="angkatan" value={formData.angkatan} onChange={handleInputChange} placeholder="2021" />
            </div>
            <div>
              <Label htmlFor="pekerjaan">Pekerjaan</Label>
              <Input id="pekerjaan" name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} placeholder="Software Engineer" />
            </div>
            <div>
              <Label htmlFor="perusahaan">Perusahaan</Label>
              <Input id="perusahaan" name="perusahaan" value={formData.perusahaan} onChange={handleInputChange} placeholder="Nama perusahaan" />
            </div>
            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" name="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Kota" />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="quote">Kutipan</Label>
              <Textarea id="quote" name="quote" value={formData.quote} onChange={handleInputChange} placeholder="Cerita singkat" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="image">Foto</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              {formData.imagePreview && (
                <img src={formData.imagePreview} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" loading="lazy" decoding="async" />
              )}
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Alumni</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Memuat data...</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Belum ada data</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map(item => (
                <div key={item.id} className="border rounded-lg p-4 flex flex-col">
                  <div className="flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="h-16 w-16 object-cover rounded-full" loading="lazy" decoding="async" fetchpriority="low" />}
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Angkatan {item.angkatan}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>{item.pekerjaan || '-'}{item.perusahaan ? `, ${item.perusahaan}` : ''}</div>
                    <div className="text-muted-foreground">{item.lokasi || ''}</div>
                  </div>
                  {item.quote && <div className="mt-2 text-sm italic">"{item.quote}"</div>}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button size="sm" variant="destructive" disabled={!!isDeleting[item.id]} onClick={() => handleDelete(item.id, item.image_url)}>
                      {isDeleting[item.id] ? 'Menghapus...' : 'Hapus'}
                    </Button>
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

export default AlumniAdmin;
