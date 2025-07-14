import AppLayout from '@/layouts/app-layout';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import InputError from '@/components/input-error';
import { Eye } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

type PerubahanJadwalForm = {
    id: number
    jadwal_sementara_id: number
    mahasiswa_id?: number | null;
    dosen_id?: number | null;
    admin_id?: number | null;
    ruang_kelas_id: number
    tanggal_perubahan: string | Date
    jam_mulai_baru: string
    jam_selesai_baru: string
    alasan_perubahan: string
    lokasi: "online" | "offline"
    status: "pending" | "diterima" | "ditolak"
    _method?: string;
};

type PerubahanJadwalData = {
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

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
};

type UserData = {
    id: number;
    nama: string;
    email: string;
};

export default function UbahPerubahanJadwal({ 
    perubahanJadwal, 
    ruangKelas, 
    userRole, 
    user,
    canDelete 
}: { 
    perubahanJadwal: PerubahanJadwalData, 
    ruangKelas: RuangKelasData[], 
    userRole: string,
    user: UserData,
    canDelete?: boolean 
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
            title: 'Ubah',
            href: `/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal/${perubahanJadwal.id}/ubah`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<PerubahanJadwalForm>({
        id: perubahanJadwal.id,
        jadwal_sementara_id: perubahanJadwal.jadwal_sementara_id,
        mahasiswa_id: perubahanJadwal.mahasiswa_id ?? null,
        dosen_id: perubahanJadwal.dosen_id ?? null,
        admin_id: perubahanJadwal.admin_id ?? null,
        ruang_kelas_id: perubahanJadwal.ruang_kelas_id || 0,
        tanggal_perubahan: perubahanJadwal.tanggal_perubahan,
        jam_mulai_baru: perubahanJadwal.jam_mulai_baru,
        jam_selesai_baru: perubahanJadwal.jam_selesai_baru,
        alasan_perubahan: perubahanJadwal.alasan_perubahan,
        lokasi: perubahanJadwal.lokasi,
        status: perubahanJadwal.status,
        _method: 'PUT',
    });

    const { ToasterComponent } = useFlashMessages();
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);

    // Update filtered data when props change
    useEffect(() => {
        setFilteredRuangKelas(ruangKelas);
    }, [ruangKelas]);

    // Reset ruang kelas when switching to online
    useEffect(() => {
        if (data.lokasi === 'online') {
            setData('ruang_kelas_id', 0);
        }
    }, [data.lokasi]);

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

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route(`${userRole}.ajukan-perubahan-jadwal.destroy`, perubahanJadwal.id), {
            onSuccess: () => {
                router.visit(route(`${userRole}.ajukan-perubahan-jadwal.index`));
            },
            onError: (error) => {
                console.error('Gagal menghapus perubahan jadwal perkuliahan:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route(`${userRole}.ajukan-perubahan-jadwal.update`, perubahanJadwal.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Perubahan jadwal perkuliahan berhasil diperbarui.');
                router.visit(route(`${userRole}.ajukan-perubahan-jadwal.edit`, perubahanJadwal.id));
            },
            onError: (errors) => {
                console.error('Update gagal:', errors);
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Ubah Perubahan Jadwal" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Perubahan Jadwal</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal/${perubahanJadwal.id}`}><Eye />Lihat</Link>
                        </Button>
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                    <Trash2 />Hapus
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin ingin menghapus perubahan jadwal ini?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aksi ini tidak dapat dibatalkan. Perubahan jadwal ini akan dihapus secara permanen
                                            dan tidak dapat dipulihkan lagi.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className={cn(buttonVariants({ variant: 'destructive' }))}
                                        >
                                            {deleting ?
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                : "Hapus"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.nama'>Nama Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.nama'
                            type='text'
                            tabIndex={1}
                            value={perubahanJadwal.jadwal_sementara.jadwal.mata_kuliah.nama}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.kode'
                            type='text'
                            tabIndex={2}
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
                        <Label htmlFor='tanggal_perubahan'>Tanggal Perkuliahan Baru
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='tanggal_perubahan'
                            type='date'
                            required
                            tabIndex={3}
                            value={String(data.tanggal_perubahan)}
                            onChange={(e) => setData('tanggal_perubahan', e.target.value)}
                            disabled={processing}
                            className="w-full"
                        />
                        <InputError message={errors.tanggal_perubahan} />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='dosen_pengampu'>Dosen Pengampu</Label>
                        <Input
                            id='dosen_pengampu'
                            type='text'
                            tabIndex={4}
                            value={perubahanJadwal.jadwal_sementara.jadwal.mata_kuliah.dosen.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='lokasi'>Lokasi Perkuliahan
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select 
                            value={data.lokasi} 
                            onValueChange={(value: "online" | "offline") => setData('lokasi', value)}
                        >
                            <SelectTrigger
                                id='lokasi'
                                tabIndex={5}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder='Pilih Lokasi' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="offline">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Offline (Ruang Kelas)
                                    </div>
                                </SelectItem>
                                <SelectItem value="online">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Online (Virtual)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.lokasi} />
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

                    {data.lokasi === 'offline' && (
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='ruang_kelas_id'>Ruang Kelas Baru
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Select 
                                value={String(data.ruang_kelas_id)} 
                                onValueChange={(value) => setData('ruang_kelas_id', Number(value))}
                            >
                                <SelectTrigger
                                    id='ruang_kelas_id'
                                    tabIndex={6}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <SelectValue placeholder='Pilih Ruang Kelas' />
                                </SelectTrigger>
                                <SelectContent>
                                    <Input
                                        placeholder={`Cari Ruang Kelas...`}
                                        value={searchQuery}
                                        onChange={(event) => {
                                            const query = event.target.value;
                                            setSearchQuery(query);
                                            const filtered = query.trim() === ''
                                                ? ruangKelas
                                                : ruangKelas.filter(rk => 
                                                    rk.nama.toLowerCase().includes(query.toLowerCase()) || 
                                                    rk.gedung.toLowerCase().includes(query.toLowerCase()) || 
                                                    String(rk.lantai).includes(query)
                                                );
                                            setFilteredRuangKelas(filtered);
                                        }}
                                        className="text-sm"
                                    />
                                    {filteredRuangKelas.map((ruangKelas) => (
                                        <SelectItem
                                            key={ruangKelas.id}
                                            value={String(ruangKelas.id)}
                                            onSelect={() => setSearchQuery('')}
                                        >
                                            {ruangKelas.nama} {ruangKelas.gedung} Lantai {ruangKelas.lantai}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.ruang_kelas_id} />
                        </div>
                    )}

                    {data.lokasi === 'online' && (
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='platform_online'>Platform Online</Label>
                            <Input
                                id='platform_online'
                                type='text'
                                value="Google Meet / Zoom / Teams"
                                disabled
                                className="w-full text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground">
                                Link akan dibagikan melalui sistem akademik
                            </p>
                        </div>
                    )}

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='ruang_kelas_asli'>Ruang Kelas Asli</Label>
                        <Input
                            id='ruang_kelas_asli'
                            type='text'
                            value={`${perubahanJadwal.jadwal_sementara.ruang_kelas.nama} ${perubahanJadwal.jadwal_sementara.ruang_kelas.gedung} Lantai ${perubahanJadwal.jadwal_sementara.ruang_kelas.lantai}`}
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai_baru'>Waktu Mulai Baru
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_mulai_baru'
                            type='time'
                            required
                            tabIndex={7}
                            value={String(data.jam_mulai_baru)}
                            onChange={(e) => setData('jam_mulai_baru', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Waktu Mulai Jadwal'
                            className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                        <InputError message={errors.jam_mulai_baru} />
                    </div>

                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_selesai_baru'>Waktu Selesai Baru
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_selesai_baru'
                            type='time'
                            required
                            tabIndex={8}
                            value={String(data.jam_selesai_baru)}
                            onChange={(e) => setData('jam_selesai_baru', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Waktu Selesai Jadwal'
                            className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                        <InputError message={errors.jam_selesai_baru} />
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

                    <div className='grid gap-4 mt-2 col-span-2 sm:col-span-4 md:col-span-2 lg:col-span-4'>
                        <Label htmlFor='alasan_perubahan'>Alasan Perubahan
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                            id='alasan_perubahan'
                            required
                            tabIndex={9}
                            value={String(data.alasan_perubahan)}
                            onChange={(e) => setData('alasan_perubahan', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Alasan Perubahan Jadwal'
                            className="w-full min-h-32"
                        />
                        <InputError message={errors.alasan_perubahan} />
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button type="submit" variant={"primary"} tabIndex={10} disabled={processing}>
                        {processing ?
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            : "Simpan"}
                    </Button>
                    <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => window.history.back()}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}