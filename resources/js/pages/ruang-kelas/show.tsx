import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react';

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
};

export default function LihatRuangKelas({ ruangKelas, userRole, canUpdate }: { ruangKelas: RuangKelasData, userRole: string, canUpdate?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Ruang Kelas',
            href: `/${userRole}/ruang-kelas`,
        },
        {
            title: 'Lihat',
            href: `/${userRole}/ruang-kelas/${ruangKelas.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Lihat Ruang Kelas" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Ruang Kelas</h1>
                    {canUpdate && (
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/ruang-kelas/${ruangKelas.id}/ubah`}><Pencil />Ubah</Link>
                        </Button>
                    )}
                </div>
                <div className='grid grid-cols-2 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='nama'>Nama Ruang Kelas</Label>
                        <Input
                            id='nama'
                            type='text'
                            tabIndex={1}
                            value={ruangKelas.nama}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='gedung'>Lokasi Gedung</Label>
                        <Input
                            id='gedung'
                            type='text'
                            tabIndex={2}
                            value={ruangKelas.gedung}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='lantai'>Lantai</Label>
                        <Input
                            id='lantai'
                            type='number'
                            tabIndex={3}
                            value={ruangKelas.lantai}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='kapasitas'>Kapasitas</Label>
                        <Input
                            id='kapasitas'
                            type='number'
                            tabIndex={4}
                            value={ruangKelas.kapasitas}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='status'>Status</Label>
                        <Input
                            id='status'
                            type='text'
                            tabIndex={5}
                            value={ruangKelas.status.replace('_', ' ')}
                            disabled
                            className="w-full capitalize"
                        />
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
