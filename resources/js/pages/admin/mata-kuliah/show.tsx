import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Mata Kuliah',
        href: '/admin/mata-kuliah',
    },
    {
        title: 'Lihat',
        href: '/admin/mata-kuliah/{id}',
    },
];

type MataKuliahData = {
    id: number
    kode: string
    nama: string
    bobot_sks: number
    kapasitas: number
    semester: number
    status: "aktif" | "nonaktif"
    jenis: "wajib" | "pilihan"
    dosen: {
        id: number
        nama: string
    }
};

export default function LihatMataKuliah({ mataKuliah }: { mataKuliah: MataKuliahData }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Lihat Mata Kuliah" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Mata Kuliah</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/mata-kuliah/${mataKuliah.id}/ubah`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid grid-cols-2 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='nama'>Nama Mata Kuliah</Label>
                        <Input
                            id='nama'
                            type='text'
                            tabIndex={1}
                            value={mataKuliah.nama}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jenis'>Jenis Mata Kuliah</Label>
                        <Input
                            id='jenis'
                            type='text'
                            tabIndex={2}
                            value={mataKuliah.jenis}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='kode'
                            type='text'
                            tabIndex={3}
                            value={mataKuliah.kode}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='dosen'>Dosen Pengampu</Label>
                        <Input
                            id='dosen'
                            type='text'
                            tabIndex={4}
                            value={mataKuliah.dosen.nama}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='bobot_sks'>SKS</Label>
                        <Input
                            id='bobot_sks'
                            type='number'
                            tabIndex={5}
                            value={mataKuliah.bobot_sks}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='semester'>Semester</Label>
                        <Input
                            id='semester'
                            type='number'
                            tabIndex={6}
                            value={mataKuliah.semester}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='kapasitas'>Kapasitas</Label>
                        <Input
                            id='kapasitas'
                            type='number'
                            tabIndex={7}
                            value={mataKuliah.kapasitas}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='status'>Status</Label>
                        <Input
                            id='status'
                            type='text'
                            tabIndex={8}
                            value={mataKuliah.status.replace('_', ' ')}
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
