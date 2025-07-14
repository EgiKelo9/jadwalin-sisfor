import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Pencil } from 'lucide-react';

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

type Account = {
    id: number;
    mahasiswa?: {
        id: number;
        nama: string;
        nim: string;
    }
    dosen?: {
        id: number;
        nama: string;
        nip: string;
        nidn: string;
    }
    admin?: {
        id: number;
        nama: string;
        nip: string;
    }
};

type AksesRoleData = {
    id: number;
    nama_role: string;
    akses: string;
    deskripsi: string;
    pivot?: {
        status: boolean | number;
        user_id: number;
        akses_role_id: number;
    };
};

export default function LihatAksesRole({ account, aksesRoles }: { account: Account, aksesRoles: AksesRoleData[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Lihat Peran dan Akses" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Peran dan Akses</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/peran-dan-akses/${account.id}/ubah`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid grid-cols-2 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='identitas'>Identitas Pengguna</Label>
                        <Input
                            id='identitas'
                            type='text'
                            tabIndex={1}
                            value={account.mahasiswa
                                ? `${account.mahasiswa.nama} - ${account.mahasiswa.nim} - Mahasiswa`
                                : account.dosen
                                    ? `${account.dosen.nama} - ${account.dosen.nip} - Dosen`
                                    : account.admin
                                        ? `${account.admin.nama} - ${account.admin.nip} - Admin`
                                        : 'Tidak Diketahui'}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mahasiswa'>Akses Dimiliki</Label>
                        {aksesRoles.length > 0 ? (
                            <div className='grid grid-cols-2 gap-4 p-4 border border-secondary rounded-lg'>
                                {aksesRoles.map((role) => (
                                    <div key={role.id} className='flex items-center justify-start gap-2 col-span-1 w-full'>
                                        <Switch
                                            className="mr-1"
                                            disabled
                                            checked={role.pivot?.status === 1}
                                        />
                                        <Label className="text-sm">{role.akses}</Label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='p-4 border border-secondary rounded-lg text-center text-gray-500'>
                                Tidak ada akses yang dimiliki
                            </div>
                        )}
                    </div>
                </div>
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
        </AppLayout >
    );
}
