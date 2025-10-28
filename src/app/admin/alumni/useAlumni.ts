import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alumni, AlumniFormData, AlumniState } from './types';
import { fetchAlumni, createAlumni, updateAlumni, deleteAlumni } from './alumni-service';

export const useAlumni = (initial: Alumni[] = []) => {
    const [state, setState] = useState<AlumniState>({
        items: initial,
        loading: false,
        error: null,
        isSubmitting: false,
        isDeleting: {},
        formData: {
            name: '',
            angkatan: '',
            pekerjaan: '',
            perusahaan: '',
            lokasi: '',
            quote: '',
            linkedin: '',
            image: null,
            imagePreview: ''
        },
        editingId: null
    });

    const { toast } = useToast();

    const load = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const data = await fetchAlumni();
            setState(prev => ({ ...prev, items: data, loading: false }));
        } catch (e) {
            setState(prev => ({ ...prev, loading: false, error: 'Gagal memuat alumni' }));
            toast({ title: 'Error', description: 'Gagal memuat alumni', variant: 'destructive' });
        }
    }, [toast]);

    useEffect(() => { load(); }, [load]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, formData: { ...prev.formData, [name]: value } }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast({ title: 'Error', description: 'File harus berupa gambar', variant: 'destructive' });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setState(prev => ({ ...prev, formData: { ...prev.formData, image: file, imagePreview: reader.result as string } }));
        };
        reader.readAsDataURL(file);
    };

    const handleEdit = (item: Alumni) => {
        setState(prev => ({
            ...prev,
            formData: {
                name: item.name,
                angkatan: item.angkatan,
                pekerjaan: item.pekerjaan || '',
                perusahaan: item.perusahaan || '',
                lokasi: item.lokasi || '',
                quote: item.quote || '',
                linkedin: item.linkedin || '',
                image: null,
                imagePreview: item.image_url || ''
            },
            editingId: item.id
        }));
        document.getElementById('alumni-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const resetForm = useCallback(() => {
        setState(prev => ({
            ...prev,
            formData: {
                name: '',
                angkatan: '',
                pekerjaan: '',
                perusahaan: '',
                lokasi: '',
                quote: '',
                linkedin: '',
                image: null,
                imagePreview: ''
            },
            editingId: null
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, angkatan } = state.formData;
        if (!name || !angkatan) {
            toast({ title: 'Error', description: 'Nama dan angkatan wajib diisi', variant: 'destructive' });
            return;
        }

        try {
            setState(prev => ({ ...prev, isSubmitting: true }));
            if (state.editingId) {
                const current = state.items.find(i => i.id === state.editingId);
                const updated = await updateAlumni(state.editingId, state.formData, current?.image_url || null);
                setState(prev => ({ ...prev, items: prev.items.map(i => i.id === updated.id ? updated : i), isSubmitting: false }));
                toast({ title: 'Sukses', description: 'Alumni diperbarui' });
            } else {
                const created = await createAlumni(state.formData);
                setState(prev => ({ ...prev, items: [created, ...prev.items], isSubmitting: false }));
                toast({ title: 'Sukses', description: 'Alumni ditambahkan' });
            }
            resetForm();
            await load();
        } catch (e) {
            setState(prev => ({ ...prev, isSubmitting: false }));
            toast({ title: 'Error', description: 'Gagal menyimpan alumni', variant: 'destructive' });
        }
    };

    const handleDelete = async (id: string, imageUrl: string | null) => {
        if (!confirm('Hapus alumni ini?')) return;
        try {
            setState(prev => ({ ...prev, isDeleting: { ...prev.isDeleting, [id]: true } }));
            await deleteAlumni(id, imageUrl);
            setState(prev => ({
                ...prev,
                items: prev.items.filter(i => i.id !== id),
                isDeleting: { ...prev.isDeleting, [id]: false }
            }));
            toast({ title: 'Sukses', description: 'Alumni dihapus' });
        } catch (e) {
            setState(prev => ({ ...prev, isDeleting: { ...prev.isDeleting, [id]: false } }));
            toast({ title: 'Error', description: 'Gagal menghapus alumni', variant: 'destructive' });
        }
    };

    return {
        ...state,
        load,
        handleInputChange,
        handleImageChange,
        handleEdit,
        handleSubmit,
        handleDelete,
        resetForm
    };
};
