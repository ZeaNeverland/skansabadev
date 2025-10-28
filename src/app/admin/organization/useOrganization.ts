import { useEffect, useMemo, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { organizationService } from './organization-service';
import type { OrgLevel, OrgMember, UpsertOrgLevel, UpsertOrgMember } from './types';

export const useOrganization = () => {
  const { toast } = useToast();
  const [levels, setLevels] = useState<OrgLevel[]>([]);
  const [membersByLevel, setMembersByLevel] = useState<Record<string, OrgMember[]>>({});
  const [headmasterLevel, setHeadmasterLevel] = useState<OrgLevel | null>(null);
  const [headmasters, setHeadmasters] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const lvls = await organizationService.getLevels();
      setLevels(lvls);
      const result: Record<string, OrgMember[]> = {};
      for (const lvl of lvls) {
        result[lvl.id] = await organizationService.getMembersByLevel(lvl.id);
      }
      setMembersByLevel(result);
      // Headmaster section
      const hmLevel = await organizationService.getHeadmasterLevel();
      setHeadmasterLevel(hmLevel);
      const hms = await organizationService.listHeadmasters();
      setHeadmasters(hms);
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal memuat struktur organisasi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  const upsertLevel = useCallback(async (payload: UpsertOrgLevel) => {
    const saved = await organizationService.upsertLevel(payload);
    await reload();
    toast({ title: 'Level tersimpan' });
    return saved;
  }, [reload, toast]);

  const deleteLevel = useCallback(async (id: string) => {
    await organizationService.deleteLevel(id);
    await reload();
    toast({ title: 'Level terhapus' });
  }, [reload, toast]);

  const upsertMember = useCallback(async (payload: UpsertOrgMember) => {
    const saved = await organizationService.upsertMember(payload);
    await reload();
    toast({ title: 'Anggota tersimpan' });
    return saved;
  }, [reload, toast]);

  const deleteMember = useCallback(async (id: string) => {
    await organizationService.deleteMember(id);
    await reload();
    toast({ title: 'Anggota terhapus' });
  }, [reload, toast]);

  const upsertHeadmaster = useCallback(async (payload: Omit<UpsertOrgMember, 'level_id'> & { level_id?: string }) => {
    const saved = await organizationService.upsertHeadmaster(payload);
    await reload();
    toast({ title: 'Kepala sekolah tersimpan' });
    return saved;
  }, [reload, toast]);

  const setActiveHeadmaster = useCallback(async (memberId: string) => {
    await organizationService.setActiveHeadmaster(memberId);
    await reload();
    toast({ title: 'Kepala sekolah aktif diperbarui' });
  }, [reload, toast]);

  const data = useMemo(() => ({ levels, membersByLevel, headmasterLevel, headmasters }), [levels, membersByLevel, headmasterLevel, headmasters]);

  return { ...data, loading, reload, upsertLevel, deleteLevel, upsertMember, deleteMember, upsertHeadmaster, setActiveHeadmaster };
};
