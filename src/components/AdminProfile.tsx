import { useState, useMemo, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail, Calendar, Shield, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
};

interface AdminProfileProps {
  user: User | null;
  isLoading?: boolean;
}

export const AdminProfile = ({ user, isLoading = false }: AdminProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const userMetadata = useMemo((): UserMetadata => ({
    full_name: user?.user_metadata?.full_name,
    avatar_url: user?.user_metadata?.avatar_url,
    created_at: user?.created_at,
  }), [user]);

  const getInitials = useCallback((email: string | undefined): string => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  }, []);

  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return 'Tidak tersedia';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'Format tanggal tidak valid' 
        : date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error menampilkan tanggal';
    }
  }, []);

  const userEmail = user?.email || 'email@tidak.ada';
  const userCreatedAt = user?.created_at || '';
  const userName = userMetadata.full_name || 'Administrator';

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24 hidden md:block" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <UserCircle className="h-5 w-5" />
        <span>Belum login</span>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 hover:bg-muted"
          aria-label="Buka profil admin"
        >
          <Avatar className="h-8 w-8">
            {userMetadata.avatar_url && (
              <AvatarImage 
                src={userMetadata.avatar_url} 
                alt={`Foto profil ${userName}`}
              />
            )}
            <AvatarFallback 
              className="bg-primary text-primary-foreground text-sm"
              aria-hidden="true"
            >
              {getInitials(userEmail)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm text-muted-foreground truncate max-w-[160px]">
            {userEmail}
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]" aria-label="Profil Admin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            Profil Admin
          </DialogTitle>
          <DialogDescription>
            Informasi akun administrator sistem
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-16 w-16">
              {userMetadata.avatar_url && (
                <AvatarImage 
                  src={userMetadata.avatar_url} 
                  alt={`Foto profil ${userName}`}
                />
              )}
              <AvatarFallback 
                className="bg-primary text-primary-foreground text-lg"
                aria-hidden="true"
              >
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate" title={userName}>
                {userName}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={userEmail}>
                {userEmail}
              </p>
              <Badge variant="secondary" className="mt-1 inline-flex items-center">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                Admin
              </Badge>
            </div>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <p 
                    className="text-sm text-muted-foreground truncate" 
                    title={userEmail}
                  >
                    {userEmail}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tanggal Bergabung</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user?.created_at || "")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status Verifikasi</p>
                  <Badge variant={user?.email_confirmed_at ? "default" : "destructive"}>
                    {user?.email_confirmed_at ? "Terverifikasi" : "Belum Terverifikasi"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Privileges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Hak Akses Admin
              </CardTitle>
              <CardDescription>
                Izin yang dimiliki akun administrator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline">Kelola Berita</Badge>
                <Badge variant="outline">Kelola Fasilitas</Badge>
                <Badge variant="outline">Kelola Karya Siswa</Badge>
                <Badge variant="outline">Kelola Prestasi</Badge>
                <Badge variant="outline">Kelola Galeri</Badge>
                <Badge variant="outline">Akses Dashboard</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};