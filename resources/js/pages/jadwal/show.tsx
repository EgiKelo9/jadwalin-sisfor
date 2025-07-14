import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Pencil, Download } from 'lucide-react';

type JadwalData = {
    id: number
    jadwal_id: number
    ruang_kelas_id: number
    tanggal: Date | string
    jam_mulai: string
    jam_selesai: string
    jadwal: {
        id: number
        mata_kuliah_id: number
        ruang_kelas_id: number
        hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
        jam_mulai: string
        jam_selesai: string
        mata_kuliah: {
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
        }
        ruang_kelas: {
            id: number
            nama: string
            gedung: string
            lantai: number
            kapasitas: number
            status: "layak" | "tidak_layak" | "perbaikan"
        }
    }
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
        lantai: number
        kapasitas: number
        status: "layak" | "tidak_layak" | "perbaikan"
    }
};

export default function LihatJadwal({ jadwal, userRole, canUpdate }: { jadwal: JadwalData, userRole: string, canUpdate?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Jadwal Perkuliahan',
            href: `/${userRole}/jadwal-perkuliahan`,
        },
        {
            title: 'Lihat',
            href: `/${userRole}/jadwal-perkuliahan/${jadwal.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Lihat Jadwal Perkuliahan" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Jadwal Perkuliahan</h1>
                    {canUpdate && (
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/jadwal-perkuliahan/${jadwal.id}/ubah`}><Pencil />Ubah</Link>
                        </Button>
                    )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.nama'>Nama Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.nama'
                            type='text'
                            tabIndex={1}
                            value={jadwal.jadwal.mata_kuliah.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.kode'
                            type='text'
                            tabIndex={2}
                            value={jadwal.jadwal.mata_kuliah.kode}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='ruang_kelas'>Ruang Kelas</Label>
                        <Input
                            id='ruang_kelas'
                            type='text'
                            tabIndex={3}
                            value={`${jadwal.ruang_kelas.nama} (${jadwal.ruang_kelas.gedung}, Lantai ${jadwal.ruang_kelas.lantai})`}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='dosen_pengampu'>Dosen Pengampu</Label>
                        <Input
                            id='dosen_pengampu'
                            type='text'
                            tabIndex={4}
                            value={jadwal.jadwal.mata_kuliah.dosen.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal'>Tanggal Perkuliahan</Label>
                        <Input
                            id='tanggal'
                            type='text'
                            tabIndex={5}
                            value={new Date(jadwal.tanggal).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai'>Waktu Mulai</Label>
                        <Input
                            id='jam_mulai'
                            tabIndex={6}
                            disabled
                            value={jadwal.jadwal.jam_mulai}
                            className="w-full"
                        />
                        <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_selesai'>Waktu Selesai</Label>
                        <Input
                            id='jam_selesai'
                            tabIndex={7}
                            disabled
                            value={jadwal.jam_selesai}
                            className="w-full"
                        />
                        <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
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
