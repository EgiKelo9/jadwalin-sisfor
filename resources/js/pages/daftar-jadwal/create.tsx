import AppLayout from '@/layouts/app-layout';
import { LoaderCircle, Wand2, PencilLine } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import InputError from '@/components/input-error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios';

type DaftarJadwalForm = {
    mata_kuliah_id: number
    ruang_kelas_id: number
    hari: "senin" | "selasa" | "rabu" | "kamis" | "jumat"
    jam_mulai: string
    jam_selesai: string
    status: "aktif" | "nonaktif"
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
};

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
};

export default function BuatDaftarJadwal({ ruangKelas, mataKuliahs, userRole }: { ruangKelas: RuangKelasData[], mataKuliahs: MataKuliahData[], userRole: string }) {
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
            title: 'Buat',
            href: `/${userRole}/daftar-jadwal/buat`,
        },
    ];

    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<DaftarJadwalForm>>({
        mata_kuliah_id: 0,
        ruang_kelas_id: 0,
        hari: "senin",
        jam_mulai: '',
        jam_selesai: '',
        status: "aktif",
        _method: "POST",
    });

    const { ToasterComponent } = useFlashMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRuangKelas, setFilteredRuangKelas] = useState(ruangKelas);
    const [filteredMataKuliah, setFilteredMataKuliah] = useState(mataKuliahs);
    const [selectedMataKuliah, setSelectedMataKuliah] = useState<MataKuliahData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [semesterType, setSemesterType] = useState<'ganjil' | 'genap'>('ganjil');

    const findMataKuliahById = (id: number) => {
        return mataKuliahs.find(mk => mk.id === id) || null;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.daftar-jadwal.store`), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const getFilteredMataKuliahBySemester = () => {
        if (semesterType === 'ganjil') {
            return mataKuliahs.filter(mk => mk.semester % 2 === 1);
        } else if (semesterType === 'genap') {
            return mataKuliahs.filter(mk => mk.semester % 2 === 0);
        }
        else return mataKuliahs;
    };

    const handleGenerateSchedule = () => {
        if (!confirm(`Proses generate jadwal dapat memakan waktu hingga 12 menit untuk dataset besar. Pastikan Anda tidak menutup halaman ini. Apakah Anda yakin ingin melanjutkan?`)) {
            return;
        }
        
        setIsGenerating(true);
        
        // Use Inertia router which handles long requests better
        router.post(route(`${userRole}.daftar-jadwal.generate`), {
            semester_type: semesterType
        }, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => {
                console.log('Starting schedule generation...');
            },
            onProgress: (progress) => {
                console.log('Progress:', progress);
            },
            onSuccess: () => {
                setIsGenerating(false);
                console.log('Schedule generation completed successfully');
            },
            onError: (errors) => {
                setIsGenerating(false);
                console.error('Generate error:', errors);
                alert('Gagal generate jadwal. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.');
            },
            onFinish: () => {
                setIsGenerating(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Buat Daftar Jadwal" />
            <ToasterComponent />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className='text-xl py-2 font-semibold'>Buat Daftar Jadwal</h1>
                
                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full max-w-xs grid-cols-2">
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                            <PencilLine className="h-4 w-4" />
                            Manual
                        </TabsTrigger>
                        <TabsTrigger value="automatic" className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4" />
                            Otomatis
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="mt-4">
                        <form onSubmit={submit}>
                            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                                <div className='grid gap-4 mt-2 col-span-2'>
                                    <Label htmlFor='mata_kuliah_id'>Nama Mata Kuliah
                                        <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            const mataKuliahId = Number(value);
                                            setData('mata_kuliah_id', mataKuliahId);
                                            setSelectedMataKuliah(findMataKuliahById(mataKuliahId));
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
                                    <InputError message={errors.mata_kuliah_id} />
                                </div>
                                <div className='grid gap-4 mt-2 col-span-2'>
                                    <Label htmlFor='mata_kuliah.kode'>Kode Mata Kuliah</Label>
                                    <Input
                                        id='mata_kuliah.kode'
                                        type='text'
                                        tabIndex={2}
                                        value={selectedMataKuliah?.kode || ''}
                                        placeholder='Nama Mata Kuliah'
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
                                    <Label htmlFor='hari'>Hari Perkuliahan
                                        <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select value={String(data.hari)} onValueChange={(value) => setData('hari', value as "senin" | "selasa" | "rabu" | "kamis" | "jumat")}>
                                        <SelectTrigger
                                            id='hari'
                                            autoFocus
                                            tabIndex={5}
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            <SelectValue placeholder={String(data.hari)} defaultValue={data.hari} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="senin">Hari Senin</SelectItem>
                                            <SelectItem value="selasa">Hari Selasa</SelectItem>
                                            <SelectItem value="rabu">Hari Rabu</SelectItem>
                                            <SelectItem value="kamis">Hari Kamis</SelectItem>
                                            <SelectItem value="jumat">Hari Jumat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.hari} />
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
                                        tabIndex={7}
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
                            <div className='flex gap-4 mt-6'>
                                <Button type="submit" variant={"primary"} tabIndex={8} disabled={processing}>
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
                    </TabsContent>
                    
                    <TabsContent value="automatic" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generate Jadwal Otomatis</CardTitle>
                                <CardDescription>
                                    Sistem akan membuat jadwal secara otomatis menggunakan Constraint Programming
                                    berdasarkan mata kuliah dan ruang kelas yang tersedia.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    {/* Data Summary Box */}
                                    <div className="flex-1">
                                        <Label className="text-base font-medium">Data yang akan diproses</Label>
                                        <div className="rounded-md border bg-background px-4 py-3 text-sm shadow-sm space-y-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-foreground">Mata Kuliah Aktif</span>
                                                <span className="font-medium text-muted-foreground">
                                                    {getFilteredMataKuliahBySemester().length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-foreground">Ruang Kelas Layak</span>
                                                <span className="font-medium text-muted-foreground">{ruangKelas.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Semester Selector */}
                                    <div className="flex-1">
                                        <Label className="text-base font-medium" htmlFor="semester_type">Pilih Semester</Label>
                                        <Select
                                            value={semesterType}
                                            onValueChange={(value) => setSemesterType(value as 'ganjil' | 'genap')}
                                        >
                                            <SelectTrigger id="semester_type" className="w-full mt-2">
                                                <SelectValue placeholder="Pilih jenis semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ganjil">Semester Ganjil (1, 3, 5, 7)</SelectItem>
                                                <SelectItem value="genap">Semester Genap (2, 4, 6, 8)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className='flex gap-4'>
                                    <Button 
                                        variant={"primary"} 
                                        onClick={handleGenerateSchedule}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="h-4 w-4" />
                                                Generate Jadwal
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        type="button"
                                        onClick={() => window.history.back()}
                                        disabled={isGenerating}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
