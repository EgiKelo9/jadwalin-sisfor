import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
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

type PerubahanJadwalForm = {
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

type JadwalSementaraData = {
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

export default function BuatPerubahanJadwal({
    ruangKelas = [],
    jadwalSementaras = [],
    user,
    userRole
}: {
    ruangKelas?: RuangKelasData[],
    jadwalSementaras?: JadwalSementaraData[],
    user: UserData,
    userRole: string
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
            title: 'Buat',
            href: `/${userRole}/jadwal-perkuliahan/ajukan-perubahan-jadwal/buat`,
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<Required<PerubahanJadwalForm>>({
        jadwal_sementara_id: 0,
        mahasiswa_id: userRole === 'mahasiswa' ? user.id : null,
        dosen_id: userRole === 'dosen' ? user.id : null,
        admin_id: userRole === 'admin' ? user.id : null,
        ruang_kelas_id: 0,
        tanggal_perubahan: '',
        jam_mulai_baru: '',
        jam_selesai_baru: '',
        alasan_perubahan: '',
        lokasi: "offline",
        status: "pending",
        _method: "POST",
    });

    const { ToasterComponent } = useFlashMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);
    const [filteredJadwalSementara, setFilteredJadwalSementara] = useState(jadwalSementaras);
    const [selectedJadwalSementara, setSelectedJadwalSementara] = useState<JadwalSementaraData | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    // Update filtered data when props change
    useEffect(() => {
        setFilteredRuangKelas(ruangKelas);
        setFilteredJadwalSementara(jadwalSementaras);
    }, [ruangKelas, jadwalSementaras]);

    // Reset ruang kelas when switching to online
    useEffect(() => {
        if (data.lokasi === 'online') {
            setData('ruang_kelas_id', 0);
        }
    }, [data.lokasi]);

    // Get unique mata kuliah from jadwal sementara with safety check
    const uniqueMataKuliah = (jadwalSementaras || []).reduce((acc: any[], jadwalSementara) => {
        if (jadwalSementara?.jadwal?.mata_kuliah) {
            const mataKuliah = jadwalSementara.jadwal.mata_kuliah;
            if (!acc.find(mk => mk.id === mataKuliah.id)) {
                acc.push({
                    ...mataKuliah,
                    jadwalSementaras: jadwalSementaras.filter(js => js?.jadwal?.mata_kuliah?.id === mataKuliah.id)
                });
            }
        }
        return acc;
    }, []);

    const findJadwalSementaraById = (id: number) => {
        return jadwalSementaras.find(js => js.id === id) || null;
    };

    const handleMataKuliahChange = (mataKuliahId: number) => {
        const selectedMK = uniqueMataKuliah.find(mk => mk.id === mataKuliahId);
        if (selectedMK) {
            const dates = selectedMK.jadwalSementaras.map((js: JadwalSementaraData) => js.tanggal);
            setAvailableDates(dates);
            setSelectedJadwalSementara(null);
            setData('jadwal_sementara_id', 0);
            setData('tanggal_perubahan', '');
        }
    };

    const handleTanggalChange = (tanggal: string) => {
        setData('tanggal_perubahan', tanggal);

        // Find the corresponding jadwal sementara for this date
        const jadwalSementara = jadwalSementaras.find(js => js.tanggal === tanggal);
        if (jadwalSementara) {
            setData('jadwal_sementara_id', jadwalSementara.id);
            setSelectedJadwalSementara(jadwalSementara);
        }
    };

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.ajukan-perubahan-jadwal.store`), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    // Show loading or empty state if data is not available
    if (!jadwalSementaras || jadwalSementaras.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
                <Head title="Buat Perubahan Jadwal" />
                <ToasterComponent />
                <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <h1 className='text-xl py-2 font-semibold'>Buat Perubahan Jadwal</h1>
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Tidak ada jadwal sementara yang tersedia.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Buat Perubahan Jadwal" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Perubahan Jadwal</h1>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah_id'>Nama Mata Kuliah
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                const mataKuliahId = Number(value);
                                handleMataKuliahChange(mataKuliahId);
                            }}
                        >
                            <SelectTrigger
                                id='mata_kuliah_id'
                                autoFocus
                                tabIndex={1}
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
                                    }}
                                    className="text-sm"
                                />
                                {uniqueMataKuliah
                                    .filter(mk =>
                                        searchQuery.trim() === '' ||
                                        mk?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        mk?.kode?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((mataKuliah) => (
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
                        <InputError message={errors.jadwal_sementara_id} />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='mata_kuliah_kode'>Kode Mata Kuliah</Label>
                        <Input
                            id='mata_kuliah_kode'
                            type='text'
                            tabIndex={2}
                            value={selectedJadwalSementara?.jadwal?.mata_kuliah?.kode || ''}
                            placeholder='Kode Mata Kuliah'
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='jadwal_sementara_select'>Jadwal Sementara
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            // value={String(data.jadwal_sementara_id)}
                            onValueChange={(value) => {
                                const jadwalId = Number(value);
                                setData('jadwal_sementara_id', jadwalId);
                                const jadwalSementara = jadwalSementaras.find(js => js.id === jadwalId);
                                if (jadwalSementara) {
                                    setSelectedJadwalSementara(jadwalSementara);
                                }
                            }}
                            disabled={availableDates.length === 0}
                        >
                            <SelectTrigger
                                id='jadwal_sementara_select'
                                tabIndex={3}
                                disabled={processing || availableDates.length === 0}
                                className="w-full"
                            >
                                <SelectValue placeholder={availableDates.length === 0 ? 'Pilih mata kuliah terlebih dahulu' : 'Pilih Jadwal'} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDates.map((tanggal) => {
                                    const jadwalSementara = jadwalSementaras.find(js => js.tanggal === tanggal);
                                    return jadwalSementara ? (
                                        <SelectItem key={jadwalSementara.id} value={String(jadwalSementara.id)}>
                                            {getDayName(tanggal)}, {formatDate(tanggal)} - {jadwalSementara.jam_mulai}-{jadwalSementara.jam_selesai}
                                        </SelectItem>
                                    ) : null;
                                })}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.jadwal_sementara_id} />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal_asli'>Tanggal Asli</Label>
                        <Input
                            id='tanggal_asli'
                            type='text'
                            value={selectedJadwalSementara ?
                                `${getDayName(selectedJadwalSementara.tanggal)}, ${formatDate(selectedJadwalSementara.tanggal)}`
                                : ''}
                            placeholder='Tanggal Asli'
                            disabled
                            className="w-full"
                        />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='tanggal_perubahan_baru'>Tanggal Perkuliahan Baru
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='tanggal_perubahan_baru'
                            type='date'
                            required
                            tabIndex={4}
                            value={String(data.tanggal_perubahan)}
                            onChange={(e) => setData('tanggal_perubahan', e.target.value)}
                            disabled={processing}
                            placeholder='Pilih Tanggal Perkuliahan Baru'
                            className="w-full"
                        />
                        <InputError message={errors.tanggal_perubahan} />
                    </div>

                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='dosen_nama'>Dosen Pengampu</Label>
                        <Input
                            id='dosen_nama'
                            type='text'
                            tabIndex={5}
                            value={selectedJadwalSementara?.jadwal?.mata_kuliah?.dosen?.nama || ''}
                            placeholder='Nama Dosen Pengampu'
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
                                tabIndex={6}
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
                            placeholder='Lokasi Asli'
                            disabled
                            className="w-full"
                        />
                    </div>

                    {data.lokasi === 'offline' && (
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='ruang_kelas_id'>Ruang Kelas Baru
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Select onValueChange={(value) => setData('ruang_kelas_id', Number(value))}>
                                <SelectTrigger
                                    id='ruang_kelas_id'
                                    tabIndex={7}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <SelectValue placeholder='Pilih Ruang Kelas' />
                                </SelectTrigger>
                                <SelectContent>
                                    <Input
                                        placeholder={`Cari Ruang Kelas...`}
                                        onChange={(event) => {
                                            const query = event.target.value;
                                            const filtered = query.trim() === ''
                                                ? ruangKelas
                                                : ruangKelas.filter(rk =>
                                                    rk?.nama?.toLowerCase().includes(query.toLowerCase()) ||
                                                    rk?.gedung?.toLowerCase().includes(query.toLowerCase()) ||
                                                    String(rk?.lantai).includes(query)
                                                );
                                            setFilteredRuangKelas(filtered);
                                        }}
                                        className="text-sm"
                                    />
                                    {filteredRuangKelas.map((ruangKelas) => (
                                        <SelectItem
                                            key={ruangKelas.id}
                                            value={String(ruangKelas.id)}
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
                                placeholder='Platform Online'
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
                            value={selectedJadwalSementara ?
                                `${selectedJadwalSementara.ruang_kelas?.nama} ${selectedJadwalSementara.ruang_kelas?.gedung} Lantai ${selectedJadwalSementara.ruang_kelas?.lantai}`
                                : ''}
                            placeholder='Ruang Kelas Asli'
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
                            tabIndex={8}
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
                            tabIndex={9}
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
                            value={selectedJadwalSementara ?
                                `${selectedJadwalSementara.jam_mulai} - ${selectedJadwalSementara.jam_selesai} WITA`
                                : ''}
                            placeholder='Jadwal Asli'
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
                            tabIndex={10}
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
                    <Button type="submit" variant={"primary"} tabIndex={11} disabled={processing}>
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