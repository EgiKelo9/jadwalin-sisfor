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

type JadwalForm = {
    id: number
    jadwal_id: number
    ruang_kelas_id: number
    tanggal: string | Date
    jam_mulai: string
    jam_selesai: string
    _method?: string;
};

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
}

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
};

export default function UbahJadwal({ jadwal, ruangKelas, userRole, canDelete }: { jadwal: JadwalData, ruangKelas: RuangKelasData[], userRole: string, canDelete?: boolean }) {
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
            title: 'Ubah',
            href: `/${userRole}/jadwal-perkuliahan/${jadwal.id}/ubah`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<JadwalForm>({
        id: jadwal.id,
        jadwal_id: jadwal.jadwal_id,
        ruang_kelas_id: jadwal.ruang_kelas_id,
        tanggal: jadwal.tanggal,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
        _method: 'PUT',
    });

    const { ToasterComponent } = useFlashMessages();
    const [deleting, setDeleting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route(`${userRole}.jadwal-perkuliahan.destroy`, jadwal.id), {
            onSuccess: () => {
                router.visit(route(`${userRole}.jadwal-perkuliahan.index`));
            },
            onError: (error) => {
                console.error('Gagal menghapus jadwal perkuliahan:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route(`${userRole}.jadwal-perkuliahan.update`, jadwal.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Jadwal perkuliahan berhasil diperbarui.');
                router.visit(route(`${userRole}.jadwal-perkuliahan.edit`, jadwal.id));
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
            <Head title="Ubah Jadwal Perkuliahan" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Jadwal Perkuliahan</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/jadwal-perkuliahan/${jadwal.id}`}><Eye />Lihat</Link>
                        </Button>
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                    <Trash2 />Hapus
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin ingin menghapus jadwal ini?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aksi ini tidak dapat dibatalkan. Jadwal ini akan dihapus secara permanen
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
                            value={jadwal.jadwal.mata_kuliah.nama}
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
                            value={jadwal.jadwal.mata_kuliah.kode}
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
                            value={jadwal.jadwal.mata_kuliah.dosen.nama}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal'>Tanggal Perkuliahan
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='tanggal'
                            type='date'
                            required
                            autoFocus
                            tabIndex={5}
                            value={String(data.tanggal)}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Tanggal Perkuliahan'
                            className="w-full"
                        />
                        <InputError message={errors.tanggal} />
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_mulai'>Waktu Mulai
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_mulai'
                            type='time'
                            required
                            autoFocus
                            tabIndex={6}
                            value={String(data.jam_mulai)}
                            onChange={(e) => setData('jam_mulai', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Waktu Mulai Jadwal'
                            className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                        <InputError message={errors.jam_mulai} />
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jam_selesai'>Waktu Selesai
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jam_selesai'
                            type='time'
                            required
                            autoFocus
                            tabIndex={6}
                            value={String(data.jam_selesai)}
                            onChange={(e) => setData('jam_selesai', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Waktu Selesai Jadwal'
                            className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                        <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                        <InputError message={errors.jam_selesai} />
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