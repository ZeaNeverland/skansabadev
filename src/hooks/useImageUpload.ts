import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      if (!file) {
        throw new Error('No file selected');
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Hanya mendukung format JPG, PNG, atau WebP');
      }

      // Compress image before upload
      const options: Parameters<typeof imageCompression>[1] = {
        maxSizeMB: 1, // target around 1MB if possible
        maxWidthOrHeight: 1920, // downscale large dimensions
        useWebWorker: true,
        // Keep original type; omit fileType to preserve source mime when feasible
      };

      const compressedFile = await imageCompression(file, options);

      // Validate compressed size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (compressedFile.size > maxSize) {
        throw new Error('Ukuran file setelah kompresi masih lebih dari 5MB');
      }

      // Determine extension based on compressed mime type to avoid mismatch
      const extFromType = (type: string): string => {
        if (type === 'image/jpeg') return 'jpg';
        if (type === 'image/png') return 'png';
        if (type === 'image/webp') return 'webp';
        const originalExt = file.name.includes('.') ? file.name.split('.').pop() : undefined;
        return originalExt || 'img';
      };

      const fileExt = extFromType(compressedFile.type);
      const fileName = `${folder.toLowerCase()}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = await supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Gagal mengunggah gambar',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
