// src/pages/AdminApprovals.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminApprovals() {
    interface UserProfile {
        id: string;
        full_name: string | null;
        email: string;
        approved: boolean;
        role: string | null;
    }

    const [users, setUsers] = useState<UserProfile[]>([]);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, approved, role")
            .eq("approved", false);

        if (error) console.error(error);
        else setUsers(data || []);
    };

    const approveUser = async (userId: string) => {
        const { error } = await supabase
            .from("profiles")
            .update({ approved: true })
            .eq("id", userId);

        if (error) {
            console.error("Error approving user:", error);
        } else {
            fetchUsers(); // refresh
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Daftar User Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <p>Tidak ada user yang menunggu approval ✅</p>
                    ) : (
                        <ul className="space-y-4">
                            {users.map((user) => (
                                <li key={user.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold">{user.full_name || "No Name"}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <Button onClick={() => approveUser(user.id)}>Approve</Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
