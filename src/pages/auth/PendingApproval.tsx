// src/pages/PendingApproval.tsx
export default function PendingApproval() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Menunggu Persetujuan</h1>
                <p>
                    Akunmu sudah terdaftar, tapi masih menunggu persetujuan admin.
                    Silakan coba login lagi nanti.
                </p>
            </div>
        </div>
    );
}
