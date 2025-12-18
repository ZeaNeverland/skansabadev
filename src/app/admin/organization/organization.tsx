import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOrganization } from './useOrganization';
import type { UpsertOrgLevel, UpsertOrgMember } from './types';
import { useImageUpload } from '@/hooks/useImageUpload';
import { initOrganizationTables, createSampleOrganizationData } from './init-organization-tables';
import { useToast } from '@/hooks/use-toast';

const OrganizationAdmin = () => {
  const { toast } = useToast();
  const { levels, membersByLevel, headmasterLevel, headmasters, loading, upsertLevel, deleteLevel, upsertMember, deleteMember, upsertHeadmaster, setActiveHeadmaster } = useOrganization();
  const { uploadImage, isUploading } = useImageUpload();

  const [levelForm, setLevelForm] = useState<UpsertOrgLevel>({ name: '', order_index: (levels?.length ?? 0) + 1 });
  const [memberForm, setMemberForm] = useState<UpsertOrgMember>({ level_id: '', name: '', position: '', description: '', photo_url: '', is_active: true, order_index: 1 });
  const [headForm, setHeadForm] = useState<Omit<UpsertOrgMember, 'level_id'> & { level_id?: string }>({ name: '', position: 'Kepala Sekolah', description: '', photo_url: '', is_active: true, order_index: 1 });

  useEffect(() => {
    if (headmasterLevel && !headForm.level_id) {
      setHeadForm((f) => ({ ...f, level_id: headmasterLevel.id }));
    }
  }, [headmasterLevel]);

  const handleAddLevel = async () => {
    if (!levelForm.name) return;
    await upsertLevel(levelForm);
    setLevelForm({ name: '', order_index: (levels?.length ?? 0) + 1 });
  };

  const handleAddMember = async () => {
    if (!memberForm.level_id || !memberForm.name || !memberForm.position) return;
    await upsertMember(memberForm);
    setMemberForm({ level_id: memberForm.level_id, name: '', position: '', description: '', photo_url: '', is_active: true, order_index: 1 });
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file, 'organization');
    if (url) setMemberForm((f) => ({ ...f, photo_url: url }));
  };

  const handleHeadUpload = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file, 'organization');
    if (url) setHeadForm((f) => ({ ...f, photo_url: url }));
  };

  // Function to initialize organization tables
  const handleInitTables = async () => {
    try {
      const result = await initOrganizationTables();
      toast({
        title: result.success ? 'Success' : 'Info',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize tables',
        variant: 'destructive'
      });
    }
  };

  // Function to create sample data
  const handleCreateSampleData = async () => {
    try {
      const result = await createSampleOrganizationData();
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message
        });
        // Reload the data
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create sample data',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Initialization Section */}
      <Card>
        <CardHeader>
          <CardTitle>Database Initialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you're seeing errors about missing tables, click the button below to check if tables exist.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInitTables} variant="secondary" disabled={loading}>
              Check & Initialize Tables
            </Button>
            <Button onClick={handleCreateSampleData} variant="outline" disabled={loading}>
              Create Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Headmaster Section */}
      <Card>
        <CardHeader>
          <CardTitle>Kepala Sekolah</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div>
              <Label>Nama</Label>
              <Input value={headForm.name} onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })} placeholder="Nama kepala sekolah" />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Input value={headForm.position} onChange={(e) => setHeadForm({ ...headForm, position: e.target.value })} />
            </div>
            <div>
              <Label>Urutan</Label>
              <Input type="number" value={headForm.order_index} onChange={(e) => setHeadForm({ ...headForm, order_index: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <Label>Deskripsi</Label>
              <Input value={headForm.description ?? ''} onChange={(e) => setHeadForm({ ...headForm, description: e.target.value })} />
            </div>
            <div className="flex items-end">
              <Button onClick={() => upsertHeadmaster(headForm)} disabled={loading}>Simpan</Button>
            </div>
            <div className="md:col-span-3">
              <Label>Foto</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleHeadUpload(e.target.files?.[0])} />
                <Button variant="secondary" disabled>{isUploading ? 'Mengunggah...' : 'Unggah'}</Button>
              </div>
              {headForm.photo_url && (
                <img src={headForm.photo_url} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover border" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input id="head_is_active" type="checkbox" checked={headForm.is_active} onChange={(e) => setHeadForm({ ...headForm, is_active: e.target.checked })} />
              <Label htmlFor="head_is_active">Aktif</Label>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            {headmasters.map((m) => (
              <div key={m.id} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <img src={m.photo_url || ''} alt={m.name} className="h-12 w-12 rounded-full object-cover border" />
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.position}</div>
                    {!m.is_active && (
                      <span className="text-xs text-muted-foreground">Tidak aktif</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setHeadForm({ name: m.name, position: m.position, description: m.description, photo_url: m.photo_url, is_active: m.is_active, order_index: m.order_index, level_id: m.level_id })}>Edit</Button>
                  {!m.is_active && (
                    <Button onClick={() => setActiveHeadmaster(m.id)}>Jadikan Aktif</Button>
                  )}
                  <Button variant="destructive" onClick={() => deleteMember(m.id)}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kelola Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Nama Level</Label>
              <Input value={levelForm.name} onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })} placeholder="Contoh: Kepala Sekolah" />
            </div>
            <div>
              <Label>Urutan</Label>
              <Input type="number" value={levelForm.order_index} onChange={(e) => setLevelForm({ ...levelForm, order_index: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLevel} disabled={loading}>Simpan Level</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            {levels.map((lvl) => (
              <div key={lvl.id} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lvl.name}</span>
                  <span className="text-xs text-muted-foreground">Urutan: {lvl.order_index}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setLevelForm({ id: lvl.id, name: lvl.name, order_index: lvl.order_index })}>Edit</Button>
                  <Button variant="destructive" onClick={() => deleteLevel(lvl.id)}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kelola Anggota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <Label>Level</Label>
              <select className="w-full border rounded-md h-10 px-3" value={memberForm.level_id} onChange={(e) => setMemberForm({ ...memberForm, level_id: e.target.value })}>
                <option value="">Pilih Level</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Nama</Label>
              <Input value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Input value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} />
            </div>
            <div>
              <Label>Urutan</Label>
              <Input type="number" value={memberForm.order_index} onChange={(e) => setMemberForm({ ...memberForm, order_index: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddMember} disabled={loading}>Simpan Anggota</Button>
            </div>
            <div className="md:col-span-3">
              <Label>Deskripsi</Label>
              <Input value={memberForm.description ?? ''} onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Foto</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} />
                <Button variant="secondary" disabled>{isUploading ? 'Mengunggah...' : 'Unggah'}</Button>
              </div>
              {memberForm.photo_url && (
                <img src={memberForm.photo_url} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover border" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input id="is_active" type="checkbox" checked={memberForm.is_active} onChange={(e) => setMemberForm({ ...memberForm, is_active: e.target.checked })} />
              <Label htmlFor="is_active">Aktif</Label>
            </div>
          </div>
          <Separator />
          <div className="space-y-6">
            {levels.map((lvl) => (
              <div key={lvl.id}>
                <div className="font-semibold mb-2">{lvl.name}</div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(membersByLevel[lvl.id] || []).map((m) => (
                    <div key={m.id} className="border rounded-md p-3 flex items-center gap-3">
                      <img src={m.photo_url || ''} alt={m.name} className="h-14 w-14 rounded-full object-cover border" />
                      <div className="flex-1">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.position}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setMemberForm({ id: m.id, level_id: m.level_id, name: m.name, position: m.position, description: m.description, photo_url: m.photo_url, is_active: m.is_active, order_index: m.order_index })}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMember(m.id)}>Hapus</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationAdmin;
