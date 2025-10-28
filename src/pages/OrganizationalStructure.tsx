import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ChevronRight, Edit, Save, X, RefreshCw, Search, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sesuaikan dengan struktur tabel yang sebenarnya
type OrgLevel = {
  id: string;
  level_name: string; // Bukan 'name'
  display_order: number; // Bukan 'order_index'
  created_at: string;
  updated_at: string;
};

type OrgMember = {
  id: string;
  level_id: string;
  name: string;
  position: string;
  image_url: string | null; // Bukan 'photo_url'
  description: string | null;
  created_at: string;
  updated_at: string;
};

type LevelWithMembers = {
  level: OrgLevel;
  members: OrgMember[];
};

const OrganizationalStructure = () => {
  const [organizationData, setOrganizationData] = useState<LevelWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{
    levelIndex: number;
    memberIndex: number;
    member: OrgMember;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check if user has admin role
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setAdminMode(false);
            return;
          }

          setAdminMode(profile?.role === 'admin');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setAdminMode(false);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching organization data...");

      // First, check if tables exist by trying a simple query
      console.log("Checking if organization_levels table exists...");
      const { error: levelsCheckError } = await supabase
        .from('organization_levels') // Nama tabel yang benar
        .select('id')
        .limit(1);

      if (levelsCheckError) {
        console.error('organization_levels table check error:', levelsCheckError);
        // If the table doesn't exist, show a more user-friendly message
        if (levelsCheckError.message.includes('relation') || levelsCheckError.message.includes('does not exist')) {
          setError('Data struktur organisasi belum tersedia. Silakan hubungi administrator untuk menginisialisasi database.');
          return;
        }
        throw new Error(`Error checking organization_levels: ${levelsCheckError.message}`);
      }

      console.log("organization_levels table exists");

      // Fetch all levels ordered by display_order
      console.log("Fetching levels...");
      const { data: levels, error: levelsError } = await supabase
        .from('organization_levels') // Nama tabel yang benar
        .select('*')
        .order('display_order', { ascending: true }); // Nama kolom yang benar

      if (levelsError) {
        console.error('Levels error:', levelsError);
        throw new Error(`Levels error: ${levelsError.message}`);
      }

      console.log("Levels fetched:", levels);

      if (!levels || levels.length === 0) {
        console.log("No levels found");
        setOrganizationData([]);
        return;
      }

      // Fetch all members
      console.log("Fetching members...");
      const { data: members, error: membersError } = await supabase
        .from('organization_members') // Nama tabel yang benar
        .select('*')
        .order('level_id', { ascending: true });

      if (membersError) {
        console.error('Members error:', membersError);
        throw new Error(`Members error: ${membersError.message}`);
      }

      console.log("Members fetched:", members);

      if (!members || members.length === 0) {
        console.log("No members found");
        // Create empty structure with levels
        const emptyData: LevelWithMembers[] = levels.map(level => ({
          level,
          members: []
        }));
        setOrganizationData(emptyData);
        return;
      }

      // Group members by level
      const groupedData: LevelWithMembers[] = levels.map(level => ({
        level,
        members: members.filter(member => member.level_id === level.id)
      })).filter(group => group.members.length > 0); // Only show levels that have members

      console.log("Grouped data:", groupedData);
      setOrganizationData(groupedData);
    } catch (err: any) {
      console.error('Error fetching organization data:', err);
      setError(`Gagal memuat struktur organisasi: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrganizationData();
    setRefreshing(false);
  };

  // Function to open edit dialog
  const handleEditClick = (levelIndex: number, memberIndex: number) => {
    setEditingMember({
      levelIndex,
      memberIndex,
      member: { ...organizationData[levelIndex].members[memberIndex] }
    });
    setEditDialogOpen(true);
  };

  // Function to open image dialog
  const handleImageClick = (image_url: string | null, name: string) => {
    if (image_url) {
      setSelectedImage({
        url: image_url,
        name
      });
      setImageDialogOpen(true);
    }
  };

  // Function to save changes
  const handleSaveChanges = async () => {
    if (editingMember) {
      try {
        const { levelIndex, memberIndex, member } = editingMember;

        // Update in Supabase
        const { error } = await supabase
          .from('organization_members') // Nama tabel yang benar
          .update({
            name: member.name,
            position: member.position,
            image_url: member.image_url, // Nama kolom yang benar
            description: member.description
          })
          .eq('id', member.id);

        if (error) throw error;

        // Update local state
        const newData = [...organizationData];
        newData[levelIndex].members[memberIndex] = member;
        setOrganizationData(newData);
        setEditDialogOpen(false);
        setEditingMember(null);

        console.log("Data updated successfully");
      } catch (err: any) {
        console.error('Error updating member:', err);
        setError(`Gagal memperbarui data: ${err.message || err}`);
      }
    }
  };

  // Function to handle input changes
  const handleInputChange = (field: keyof OrgMember, value: string) => {
    if (editingMember) {
      setEditingMember({
        ...editingMember,
        member: {
          ...editingMember.member,
          [field]: value
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Memuat struktur organisasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Struktur Organisasi</h2>
            <p className="text-destructive mb-4">{error}</p>
            <Card className="bg-muted/50 p-6">
              <h3 className="font-semibold mb-2">Instruksi untuk Administrator:</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Untuk mengatasi masalah ini, ikuti langkah-langkah berikut:
              </p>
              <ol className="text-left text-sm text-muted-foreground list-decimal list-inside space-y-2">
                <li>Masuk ke halaman Admin → Struktur Organisasi</li>
                <li>Klik tombol "Check & Initialize Tables"</li>
                <li>Jika diminta, buat tabel secara manual melalui dashboard Supabase</li>
                <li>Setelah tabel dibuat, klik "Create Sample Data" untuk menambahkan data contoh</li>
              </ol>
              {adminMode && (
                <div className="mt-4">
                  <Button onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Memuat Ulang...' : 'Coba Lagi'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Get unique levels for filter dropdown
  const allLevels = organizationData.map(group => ({
    id: group.level.id,
    name: group.level.level_name
  }));

  // Flatten the organization data to display all members as individual cards
  const allMembers = organizationData.flatMap(levelGroup =>
    levelGroup.members.map(member => ({
      ...member,
      level_name: levelGroup.level.level_name,
      level_id: levelGroup.level.id
    }))
  );

  // Apply filters
  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === "all" || member.level_id === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="pb-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
              <span className="text-primary font-medium">Struktur Organisasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Struktur Organisasi
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Konsentrasi Keahlian RPL</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Struktur organisasi yang solid dengan tenaga pendidik dan kependidikan yang berkompeten
              untuk menghasilkan lulusan terbaik di bidang Rekayasa Perangkat Lunak
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-4 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama atau posisi..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semua Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  {allLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada data struktur organisasi yang sesuai dengan filter.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLevel("all");
                  }}
                >
                  Reset Filter
                </Button>
                {adminMode && (
                  <Button className="mt-4 ml-2" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Memuat Ulang...' : 'Refresh Data'}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <p className="text-muted-foreground">
                    Menampilkan {filteredMembers.length} dari {allMembers.length} anggota
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => {
                    // Find the level index and member index for editing
                    const levelIndex = organizationData.findIndex(levelGroup =>
                      levelGroup.members.some(m => m.id === member.id)
                    );
                    const memberIndex = levelIndex !== -1
                      ? organizationData[levelIndex].members.findIndex(m => m.id === member.id)
                      : -1;

                    return (
                      <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20 relative overflow-hidden">
                        {/* Edit Button - Only visible for admin */}
                        {adminMode && levelIndex !== -1 && memberIndex !== -1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                            onClick={() => handleEditClick(levelIndex, memberIndex)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        <CardHeader className="text-center pb-4">
                          <div className="w-24 h-24 mx-auto mb-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full"></div>
                            <div
                              className="relative z-10 w-full h-full rounded-full overflow-hidden cursor-pointer group-hover:scale-105 transition-transform duration-300"
                              onClick={() => handleImageClick(member.image_url, member.name)}
                            >
                              <img
                                src={member.image_url || 'https://placehold.co/200x200?text=Photo'}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://placehold.co/200x200?text=Photo';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                          <CardTitle className="text-xl text-foreground mb-2">
                            {member.name}
                          </CardTitle>
                          <div className="flex flex-col items-center gap-2">
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {member.position}
                            </Badge>
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                              {member.level_name}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <p className="text-sm text-muted-foreground text-center leading-relaxed">
                            {member.description || 'Tidak ada deskripsi'}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Anggota</DialogTitle>
            <DialogDescription>
              Perbarui informasi anggota organisasi di bawah ini.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Nama
                </label>
                <Input
                  id="name"
                  value={editingMember.member.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="position" className="text-right">
                  Posisi
                </label>
                <Input
                  id="position"
                  value={editingMember.member.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Deskripsi
                </label>
                <Textarea
                  id="description"
                  value={editingMember.member.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="image_url" className="text-right">
                  URL Foto
                </label>
                <Input
                  id="image_url"
                  value={editingMember.member.image_url || ""}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4">
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x600?text=Photo+Not+Available';
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationalStructure;