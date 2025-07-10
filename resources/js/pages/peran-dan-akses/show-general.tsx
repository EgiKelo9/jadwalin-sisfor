import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type AksesRoleData = {
    id: number;
    nama_role: string;
    akses: string;
    deskripsi: string;
};

export default function LihatAksesRole({ aksesRole, userRole, }: { aksesRole: AksesRoleData[], userRole: string, }) {
    console.log(userRole);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin/beranda',
        },
        {
            title: 'Peran dan Akses',
            href: '/admin/peran-dan-akses',
        },
        {
            title: 'Lihat',
            href: '/admin/peran-dan-akses/{id}',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Lihat Akses Role" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className='text-xl py-2 font-semibold'>Detail Akses Role</h1>
                
                {aksesRole.map((role) => (
                    <div key={role.id} className="grid grid-cols-2 gap-4 border p-4 rounded-lg mb-4">
                        <div className="flex flex-col gap-2">
                            <Label>ID</Label>
                            <Input value={role.id} disabled />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Nama Role</Label>
                            <Input value={role.nama_role} disabled />
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <Label>Akses</Label>
                            <Input value={role.akses} disabled />
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <Label>Deskripsi</Label>
                            <Input value={role.deskripsi} disabled />
                        </div>
                    </div>
                ))}

                <div className='flex gap-4 mt-2'>
                    <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => window.history.back()}
                    >
                        Kembali
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
