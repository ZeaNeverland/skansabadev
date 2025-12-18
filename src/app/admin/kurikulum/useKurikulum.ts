import { useCallback, useEffect, useState } from "react";
import { KurikulumDoc, KurikulumState } from "./types";
import { createKurikulum, fetchKurikulum, KurikulumFormData, deleteKurikulum } from "./kurikulum-service";
import { useToast } from "@/hooks/use-toast";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useKurikulum = () => {
  const [state, setState] = useState<KurikulumState>({
    items: [],
    loading: true,
    error: null,
    isUploading: false,
    isDeleting: {},
    newFile: null,
    title: "",
    description: "",
    category: "Kurikulum",
    updateDate: new Date().toISOString().slice(0, 10),
    filePreviewName: "",
  });

  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const items = await fetchKurikulum();
      setState((prev) => ({ ...prev, items, loading: false }));
    } catch (error) {
      console.error("Error loading kurikulum:", error);
      setState((prev) => ({ ...prev, loading: false, error: "Gagal memuat data kurikulum" }));
      toast({ title: "Error", description: "Gagal memuat data kurikulum", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // allow PDFs and common docs
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast({ title: "Error", description: "File harus PDF atau Dokumen (.doc/.docx)", variant: "destructive" });
      return;
    }

    setState((prev) => ({
      ...prev,
      newFile: file,
      filePreviewName: `${file.name} (${formatFileSize(file.size)})`,
      fileSizeLabel: formatFileSize(file.size),
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
    }));

    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.newFile) {
      toast({ title: "Error", description: "Silakan pilih file", variant: "destructive" });
      return;
    }

    try {
      setState((p) => ({ ...p, isUploading: true }));
      const payload: KurikulumFormData = {
        file: state.newFile,
        title: state.title.trim() || state.newFile.name,
        description: state.description.trim() || undefined,
        category: state.category || undefined,
        updateDate: state.updateDate || undefined,
      };
      const created = await createKurikulum(payload);
      // enrich with formatted size
      const enriched: KurikulumDoc = {
        ...created,
        formatted_size: state.fileSizeLabel || null,
      };
      setState((p) => ({
        ...p,
        items: [enriched, ...p.items],
        isUploading: false,
        newFile: null,
        filePreviewName: "",
      }));
      toast({ title: "Sukses", description: "Dokumen berhasil diunggah" });
    } catch (error) {
      console.error("Error creating kurikulum:", error);
      setState((p) => ({ ...p, isUploading: false }));
      toast({ title: "Error", description: "Gagal mengunggah dokumen", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus dokumen ini?")) return;
    try {
      setState((p) => ({ ...p, isDeleting: { ...p.isDeleting, [id]: true } }));
      await deleteKurikulum(id);
      setState((p) => ({
        ...p,
        items: p.items.filter((i) => i.id !== id),
        isDeleting: { ...p.isDeleting, [id]: false },
      }));
      toast({ title: "Sukses", description: "Dokumen dihapus" });
    } catch (error) {
      console.error("Error deleting kurikulum:", error);
      setState((p) => ({ ...p, isDeleting: { ...p.isDeleting, [id]: false } }));
      toast({ title: "Error", description: "Gagal menghapus dokumen", variant: "destructive" });
    }
  };

  return {
    ...state,
    setTitle: (v: string) => setState((p) => ({ ...p, title: v })),
    setDescription: (v: string) => setState((p) => ({ ...p, description: v })),
    setCategory: (v: string) => setState((p) => ({ ...p, category: v })),
    setUpdateDate: (v: string) => setState((p) => ({ ...p, updateDate: v })),
    handleFileChange,
    handleSubmit,
    handleDelete,
    loadItems,
    formatFileSize,
  };
};
