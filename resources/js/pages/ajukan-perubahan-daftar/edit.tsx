import AppLayout from '@/layouts/app-layout';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
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
    jadwal_id: number
    mahasiswa_id?: number | null;
    dosen_id?: number | null;
    admin_id?: number | null;
    ruang_kelas_id: number
    hari_perubahan: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
    jam_mulai_baru: string
    jam_selesai_baru: string
    alasan_perubahan: string
    status: "pending" | "diteirma" | "ditolak"
    _method?: string;
};

type PerubahanJadwalData = {
    id: number
    jadwal_id: number
    mahasiswa_id?: number | null;
    dosen_id?: number | null;
    admin_id?: number | null;
    ruang_kelas_id: number
    hari_perubahan: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
    jam_mulai_baru: string
    jam_selesai_baru: string
    alasan_perubahan: string
    status: "pending" | "diteirma" | "ditolak"
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
        status: "aktif" | "nonaktif"
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

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
};

export default function UbahDaftarJadwal({ perubahanJadwal, ruangKelas, userRole, canDelete }: { perubahanJadwal: PerubahanJadwalData, ruangKelas: RuangKelasData[], userRole: string, canDelete?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Daftar Jadwal',
            href: `/${userRole}/daftar-jadwal`,
        },
        {
            title: 'Ajukan Perubahan',
            href: `/${userRole}/daftar-jadwal/ajukan-perubahan-daftar`,
        },
        {
            title: 'Ubah',
            href: `/${userRole}/daftar-jadwal/ajukan-perubahan-daftar/${perubahanJadwal.id}/ubah`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<PerubahanJadwalForm>({
        id: perubahanJadwal.id,
        jadwal_id: perubahanJadwal.jadwal_id,
        mahasiswa_id: perubahanJadwal.mahasiswa_id ?? null,
        dosen_id: perubahanJadwal.dosen_id ?? null,
        admin_id: perubahanJadwal.admin_id ?? null,
        ruang_kelas_id: perubahanJadwal.ruang_kelas_id,
        hari_perubahan: perubahanJadwal.hari_perubahan as "senin" | "selasa" | "rabu" | "kamis" | "jumat",
        jam_mulai_baru: perubahanJadwal.jam_mulai_baru,
        jam_selesai_baru: perubahanJadwal.jam_selesai_baru,
        alasan_perubahan: perubahanJadwal.alasan_perubahan,
        status: perubahanJadwal.status as "pending" | "diteirma" | "ditolak",
        _method: 'PUT',
    });

    const { ToasterComponent } = useFlashMessages();
    const [deleting, setDeleting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route(`${userRole}.ajukan-perubahan-daftar.destroy`, perubahanJadwal.id), {
            onSuccess: () => {
                router.visit(route(`${userRole}.ajukan-perubahan-daftar.index`));
            },
            onError: (error) => {
                console.error('Gagal menghapus daftar jadwal perkuliahan:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route(`${userRole}.ajukan-perubahan-daftar.update`, perubahanJadwal.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Daftar jadwal perkuliahan berhasil diperbarui.');
                router.visit(route(`${userRole}.ajukan-perubahan-daftar.edit`, perubahanJadwal.id));
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
            <Head title="Ubah Perubahan Daftar Jadwal" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Perubahan Daftar Jadwal</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/jadwal-perkuliahan/ajukan-perubahan-daftar/${perubahanJadwal.id}`}><Eye />Lihat</Link>
                        </Button>
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                    <Trash2 />Hapus
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin ingin menghapus perubahan daftar jadwal ini?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aksi ini tidak dapat dibatalkan. Perubahan daftar jadwal ini akan dihapus secara permanen
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
                            value={perubahanJadwal.jadwal.mata_kuliah.nama}
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
                            value={perubahanJadwal.jadwal.mata_kuliah.kode}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='ruang_kelas_id'>Ruang Kelas</Label>
                        <Select value={String(data.ruang_kelas_id)} onValueChange={(value) => setData('ruang_kelas_id', Number(value))}>
                            <SelectTrigger
                                id='ruang_kelas_id'
                                autoFocus
                                tabIndex={3}
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
                                            : ruangKelas.filter(d => (d.nama.toLowerCase().includes(query.toLowerCase()) || d.gedung.toLowerCase().includes(query.toLowerCase()) || String(d.lantai).includes(query)));
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
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='dosen_id'>Dosen Pengampu</Label>
                        <Input
                            id='dosen_id'
                            type='text'
                            tabIndex={4}
                            value={perubahanJadwal.jadwal.mata_kuliah.dosen.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='hari_perubahan'>Hari Perkuliahan</Label>
                        <Select value={String(data.hari_perubahan)} onValueChange={(value) => setData('hari_perubahan', value as "senin" | "selasa" | "rabu" | "kamis" | "jumat")}>
                            <SelectTrigger
                                id='hari_perubahan'
                                autoFocus
                                tabIndex={5}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder={String(data.hari_perubahan)} defaultValue={data.hari_perubahan} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="senin">Hari Senin</SelectItem>
                                <SelectItem value="selasa">Hari Selasa</SelectItem>
                                <SelectItem value="rabu">Hari Rabu</SelectItem>
                                <SelectItem value="kamis">Hari Kamis</SelectItem>
                                <SelectItem value="jumat">Hari Jumat</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.hari_perubahan} />
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai_baru'>Waktu Mulai
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_mulai_baru'
                            type='time'
                            required
                            autoFocus
                            tabIndex={6}
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
                        <Label htmlFor='jam_selesai_baru'>Waktu Selesai
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_selesai_baru'
                            type='time'
                            required
                            autoFocus
                            tabIndex={6}
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
                    <div className='grid gap-4 mt-2 col-span-2 sm:col-span-4 md:col-span-2 lg:col-span-4'>
                        <Label htmlFor='alasan_perubahan'>Alasan Perubahan
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                            id='alasan_perubahan'
                            required
                            autoFocus
                            tabIndex={8}
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
                    <Button type="submit" variant={"primary"} tabIndex={8} disabled={processing}>
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