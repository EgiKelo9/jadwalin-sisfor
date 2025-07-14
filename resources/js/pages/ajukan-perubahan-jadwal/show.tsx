import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from 'lucide-react';

type PerubahanJadwalSementara = {
    id: number
    jadwal_sementara_id: number
    mahasiswa_id?: number | null;
    dosen_id?: number | null;
    admin_id?: number | null;
    ruang_kelas_id: number | null
    tanggal_perubahan: string
    jam_mulai_baru: string
    jam_selesai_baru: string
    alasan_perubahan: string
    lokasi: "online" | "offline"
    status: "pending" | "diterima" | "ditolak"
    jadwal_sementara: {
        id: number
        jadwal_id: number
        tanggal: string
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
                status: 'layak' | 'tidak_layak' | 'perbaikan'
            }
        }
        ruang_kelas: {
            id: number
            nama: string
            gedung: string
            lantai: number
            kapasitas: number
            status: 'layak' | 'tidak_layak' | 'perbaikan'
        }
    }
    ruang_kelas?: {
        id: number
        nama: string
        gedung: string
        lantai: number
        kapasitas: number
        status: 'layak' | 'tidak_layak' | 'perbaikan'
    }
};

type UserData = {
    id: number;
    nama: string;
    email: string;
};

export default function LihatPerubahanJadwal({ 
    perubahanJadwal, 
    userRole, 
    user,
    canUpdate 
}: { 
    perubahanJadwal: PerubahanJadwalSementara, 
    userRole: string,
    user: UserData,
    canUpdate?: boolean 
}) {
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
            title: 'Ajukan Perubahan',
            href: `/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal`,
        },
        {
            title: 'Lihat',
            href: `/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal/${perubahanJadwal.id}`,
        },
    ];

    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[date.getDay()];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Lihat Perubahan Jadwal" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Perubahan Jadwal</h1>
                    {canUpdate && perubahanJadwal.status === 'pending' && (
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal/${perubahanJadwal.id}/ubah`}>
                                <Pencil />Ubah
                            </Link>
                        </Button>
                    )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.nama'>Nama Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.nama'
                            type='text'
                            value={perubahanJadwal.jadwal_sementara.jadwal.mata_kuliah.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.kode'
                            type='text'
                            value={perubahanJadwal.jadwal_sementara.jadwal.mata_kuliah.kode}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal_asli'>Tanggal Asli</Label>
                        <Input
                            id='tanggal_asli'
                            type='text'
                            value={`${getDayName(perubahanJadwal.jadwal_sementara.tanggal)}, ${formatDate(perubahanJadwal.jadwal_sementara.tanggal)}`}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal_perubahan'>Tanggal Perkuliahan Baru</Label>
                        <Input
                            id='tanggal_perubahan'
                            type='text'
                            value={`${getDayName(perubahanJadwal.tanggal_perubahan)}, ${formatDate(perubahanJadwal.tanggal_perubahan)}`}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='dosen_pengampu'>Dosen Pengampu</Label>
                        <Input
                            id='dosen_pengampu'
                            type='text'
                            value={perubahanJadwal.jadwal_sementara.jadwal.mata_kuliah.dosen.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='lokasi'>Lokasi Perkuliahan</Label>
                        <Input
                            id='lokasi'
                            type='text'
                            value={perubahanJadwal.lokasi === 'online' ? 'Online (Virtual)' : 'Offline (Ruang Kelas)'}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='lokasi_asli'>Lokasi Asli</Label>
                        <Input
                            id='lokasi_asli'
                            type='text'
                            value="Offline (Ruang Kelas)"
                            disabled
                            className="w-full"
                        />
                    </div>

                    {perubahanJadwal.lokasi === 'offline' && perubahanJadwal.ruang_kelas && (
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='ruang_kelas_baru'>Ruang Kelas Baru</Label>
                            <Input
                                id='ruang_kelas_baru'
                                type='text'
                                value={`${perubahanJadwal.ruang_kelas.nama} ${perubahanJadwal.ruang_kelas.gedung} Lantai ${perubahanJadwal.ruang_kelas.lantai}`}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
                    )}

                    {perubahanJadwal.lokasi === 'online' && (
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='platform_online'>Platform Online</Label>
                            <Input
                                id='platform_online'
                                type='text'
                                value="Google Meet / Zoom / Teams"
                                disabled
                                className="w-full text-muted-foreground"
                            />
                        </div>
                    )}

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='ruang_kelas_asli'>Ruang Kelas Asli</Label>
                        <Input
                            id='ruang_kelas_asli'
                            type='text'
                            value={`${perubahanJadwal.jadwal_sementara.ruang_kelas.nama} ${perubahanJadwal.jadwal_sementara.ruang_kelas.gedung} Lantai ${perubahanJadwal.jadwal_sementara.ruang_kelas.lantai}`}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>

                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai_baru'>Waktu Mulai Baru</Label>
                        <Input
                            id='jam_mulai_baru'
                            disabled
                            value={perubahanJadwal.jam_mulai_baru}
                            className="w-full"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                    </div>

                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_selesai_baru'>Waktu Selesai Baru</Label>
                        <Input
                            id='jam_selesai_baru'
                            disabled
                            value={perubahanJadwal.jam_selesai_baru}
                            className="w-full"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='jadwal_asli'>Jadwal Asli</Label>
                        <Input
                            id='jadwal_asli'
                            type='text'
                            value={`${perubahanJadwal.jadwal_sementara.jam_mulai} - ${perubahanJadwal.jadwal_sementara.jam_selesai} WITA`}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='status'>Status</Label>
                        <Input
                            id='status'
                            type='text'
                            value={perubahanJadwal.status === 'pending' ? 'Menunggu Persetujuan' : 
                                  perubahanJadwal.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                            disabled
                            className={`w-full capitalize ${
                                perubahanJadwal.status === 'diterima' ? 'text-green-600' :
                                perubahanJadwal.status === 'ditolak' ? 'text-red-600' : 'text-yellow-600'
                            }`}
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2 sm:col-span-4 md:col-span-2 lg:col-span-4'>
                        <Label htmlFor='alasan_perubahan'>Alasan Perubahan</Label>
                        <Textarea
                            id='alasan_perubahan'
                            disabled
                            value={String(perubahanJadwal.alasan_perubahan)}
                            className="w-full min-h-32"
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
        </AppLayout>
    );
}