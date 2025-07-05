import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Peminjaman Kelas',
        href: '/admin/peminjaman-kelas',
    },
    {
        title: 'Lihat',
        href: '/admin/peminjaman-kelas/{id}',
    },
];

type PeminjamanKelasData = {
    id: number
    tanggal_peminjaman: Date | string
    jam_mulai: Date | string
    jam_selesai: Date | string
    alasan: string
    status: "pending" | "diterima" | "ditolak"
    ruang_kelas_id: number
    mahasiswa: {
        id: number
        nama: string
        email: string
    }
    dosen: {
        id: number
        nama: string
        email: string
    }
    admin: {
        id: number
        nama: string
        email: string
    }
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
        lantai: number
    }
};

export default function LihatPeminjamanKelas({ peminjamanKelas }: { peminjamanKelas: PeminjamanKelasData }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Lihat Peminjaman Kelas" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Peminjaman Kelas</h1>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='nama'>Nama Peminjam</Label>
                        <Input
                            id='nama'
                            type='text'
                            tabIndex={1}
                            value={peminjamanKelas.mahasiswa?.nama || peminjamanKelas.dosen?.nama || peminjamanKelas.admin?.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            tabIndex={2}
                            value={peminjamanKelas.mahasiswa?.email || peminjamanKelas.dosen?.email || peminjamanKelas.admin?.email}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal_peminjaman'>Tanggal Peminjaman</Label>
                        <Input
                            id='tanggal_peminjaman'
                            type='text'
                            tabIndex={3}
                            value={
                                typeof peminjamanKelas.tanggal_peminjaman === 'string' 
                                    ? new Date(peminjamanKelas.tanggal_peminjaman).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      }).replace(/\//g, '-')
                                    : peminjamanKelas.tanggal_peminjaman.toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      }).replace(/\//g, '-')
                            }
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai'>Waktu Mulai</Label>
                        <Input
                            id='jam_mulai'
                            type='text'
                            tabIndex={4}
                            value={String(peminjamanKelas.jam_mulai)}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_selesai'>Waktu Selesai</Label>
                        <Input
                            id='jam_selesai'
                            type='text'
                            tabIndex={5}
                            value={String(peminjamanKelas.jam_selesai)}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='alasan'>Alasan Peminjaman</Label>
                        <Textarea
                            id='alasan'
                            tabIndex={6}
                            value={peminjamanKelas.alasan}
                            disabled
                            className="w-full min-h-32"
                        />
                    </div>
                    <div className='grid gap-4 col-span-2 grid-cols-1'>
                        <div className='grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='status'>Status Peminjaman</Label>
                            <Input
                                id='status'
                                type='text'
                                tabIndex={7}
                                value={peminjamanKelas.status}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='ruang_kelas_id'>Ruangan Dipinjam</Label>
                            <Input
                                id='ruang_kelas_id'
                                type='text'
                                tabIndex={8}
                                value={peminjamanKelas.ruang_kelas?.nama + ' ' + peminjamanKelas.ruang_kelas?.gedung + ' Lantai ' + peminjamanKelas.ruang_kelas?.lantai}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
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
