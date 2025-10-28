import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Trash2, Upload as UploadIcon, FileText } from "lucide-react";
import { useKurikulum } from "./useKurikulum";

export const Kurikulum = () => {
  const {
    items,
    loading,
    error,
    isUploading,
    isDeleting,
    newFile,
    title,
    description,
    category,
    updateDate,
    filePreviewName,
    setTitle,
    setDescription,
    setCategory,
    setUpdateDate,
    handleFileChange,
    handleSubmit,
    handleDelete,
  } = useKurikulum();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unggah Dokumen Kurikulum</CardTitle>
          <CardDescription>Tambahkan dokumen kurikulum (PDF/DOC/DOCX)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="file">Pilih File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {filePreviewName && (
                <p className="text-xs text-muted-foreground mt-1">{filePreviewName}</p>
              )}
            </div>

            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul dokumen"
                disabled={isUploading}
              />
            </div>

            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Silabus, Kurikulum Inti, Pedoman"
                disabled={isUploading}
              />
            </div>

            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="updateDate">Tanggal Update</Label>
              <Input
                id="updateDate"
                type="date"
                value={updateDate}
                onChange={(e) => setUpdateDate(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <div className="grid w-full max-w-xl items-center gap-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat dokumen"
                disabled={isUploading}
              />
            </div>

            <Button type="submit" disabled={!newFile || isUploading}>
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </span>
              ) : (
                <span className="flex items-center">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Unggah Dokumen
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen Kurikulum</CardTitle>
          <CardDescription>Kelola dokumen yang sudah diunggah</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada dokumen</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan mengunggah dokumen baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((doc) => (
                <div key={doc.id} className="relative group rounded-md overflow-hidden border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={doc.title}>{doc.title}</p>
                      {doc.category && (
                        <p className="text-xs text-gray-500 truncate">{doc.category}</p>
                      )}
                      {doc.update_date && (
                        <p className="text-xs text-gray-500">
                          {new Date(doc.update_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Download className="w-4 h-4 mr-2" /> Unduh
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDeleting[doc.id]}
                    >
                      {isDeleting[doc.id] ? "Menghapus..." : (
                        <span className="flex items-center">
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus
                        </span>
                      )}
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

export default Kurikulum;
