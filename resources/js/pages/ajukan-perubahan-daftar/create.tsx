import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

type PerubahanDaftarJadwalForm = {
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
    jadwal: {
        id: number
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

export default function BuatPerubahanDaftarJadwal({ ruangKelas, mataKuliahs, user, userRole }: { ruangKelas: RuangKelasData[], mataKuliahs: MataKuliahData[], user: UserData, userRole: string }) {
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
            title: 'Buat',
            href: `/${userRole}/daftar-jadwal/ajukan-perubahan-daftar/buat`,
        },
    ];

    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<PerubahanDaftarJadwalForm>>({
        jadwal_id: 0,
        mahasiswa_id: userRole === 'mahasiswa' ? user.id : null,
        dosen_id: userRole === 'dosen' ? user.id : null,
        admin_id: userRole === 'admin' ? user.id : null,
        ruang_kelas_id: 0,
        hari_perubahan: "senin",
        jam_mulai_baru: '',
        jam_selesai_baru: '',
        alasan_perubahan: '',
        status: "pending",
        _method: "POST",
    });

    const { ToasterComponent } = useFlashMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);
    const [filteredMataKuliah, setFilteredMataKuliah] = useState(mataKuliahs);
    const [selectedMataKuliah, setSelectedMataKuliah] = useState<MataKuliahData | null>(null);

    const findMataKuliahById = (id: number) => {
        return mataKuliahs.find(mk => mk.id === id) || null;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.ajukan-perubahan-daftar.store`), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Buat Perubahan Daftar Jadwal" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Perubahan Daftar Jadwal</h1>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='jadwal_id'>Nama Mata Kuliah
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                const mataKuliahId = Number(value);
                                const selectedMK = findMataKuliahById(mataKuliahId);
                                setData('jadwal_id', selectedMK?.jadwal?.id || 0);
                                setSelectedMataKuliah(selectedMK);
                            }}
                        >
                            <SelectTrigger
                                id='mata_kuliah_id'
                                autoFocus
                                tabIndex={3}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder='Pilih Mata Kuliah' />
                            </SelectTrigger>
                            <SelectContent>
                                <Input
                                    placeholder={`Cari Mata Kuliah...`}
                                    value={searchQuery}
                                    onChange={(event) => {
                                        const query = event.target.value;
                                        setSearchQuery(query);
                                        const filtered = query.trim() === ''
                                            ? mataKuliahs
                                            : mataKuliahs.filter(mk => (mk.kode.toLowerCase().includes(query.toLowerCase())));
                                        setFilteredMataKuliah(filtered);
                                    }}
                                    className="text-sm"
                                />
                                {filteredMataKuliah.map((mataKuliah) => (
                                    <SelectItem
                                        key={mataKuliah.id}
                                        value={String(mataKuliah.id)}
                                        onSelect={() => setSearchQuery('')}
                                    >
                                        {mataKuliah.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.jadwal_id} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah.kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah.kode'
                            type='text'
                            tabIndex={2}
                            value={selectedMataKuliah?.kode || ''}
                            placeholder='Kode Mata Kuliah'
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='ruang_kelas_id'>Ruang Kelas
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(value) => setData('ruang_kelas_id', Number(value))}>
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
                            value={selectedMataKuliah?.dosen?.nama || ''}
                            placeholder='Nama Dosen Pengampu'
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='hari_perubahan'>Hari Perkuliahan
                            <span className='text-red-500'>*</span>
                        </Label>
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
                            tabIndex={7}
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
                    <Button type="submit" variant={"primary"} tabIndex={9} disabled={processing}>
                        {processing ?
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            : "Buat"}
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
