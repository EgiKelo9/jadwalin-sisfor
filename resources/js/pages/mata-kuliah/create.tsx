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

type MataKuliahForm = {
    kode: string;
    nama: string;
    bobot_sks: number;
    kapasitas: number;
    semester: number;
    status: 'aktif' | 'nonaktif';
    jenis: 'wajib' | 'pilihan';
    dosen_id: number;
    _method?: string;
};

type DosenData = {
    id: number;
    nip: string;
    nidn: string;
    nama: string;
    email: string;
    telepon: string | number;
    alamat: string;
    foto: File | null;
    status: 'aktif' | 'nonaktif';
}

export default function BuatMataKuliah({ dosens, userRole }: { dosens: DosenData[], userRole: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Mata Kuliah',
            href: `/${userRole}/mata-kuliah`,
        },
        {
            title: 'Buat',
            href: `/${userRole}/mata-kuliah/buat`,
        },
    ];

    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<MataKuliahForm>>({
        kode: '',
        nama: '',
        bobot_sks: 0,
        kapasitas: 0,
        semester: 1,
        status: 'aktif',
        jenis: 'wajib',
        dosen_id: 0,
        _method: 'POST',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDosens, setFilteredDosens] = useState(dosens);

    const { ToasterComponent } = useFlashMessages();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.mata-kuliah.store`), {
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
            <Head title="Buat Mata Kuliah" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Mata Kuliah</h1>
                <div className='grid grid-cols-2 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='nama'>Nama Mata Kuliah
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='nama'
                            type='text'
                            required
                            autoFocus
                            tabIndex={1}
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Nama Mata Kuliah'
                            className="w-full"
                        />
                        <InputError message={errors.nama} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='jenis'>Jenis Mata Kuliah
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={String(data.jenis)} onValueChange={(value) => setData('jenis', value as 'wajib' | 'pilihan')}>
                            <SelectTrigger
                                id='jenis'
                                autoFocus
                                tabIndex={2}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder={String(data.jenis)} defaultValue={data.jenis} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="wajib">Wajib</SelectItem>
                                <SelectItem value="pilihan">Pilihan</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.jenis} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='kode'>Kode Mata Kuliah
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='kode'
                            type='text'
                            required
                            autoFocus
                            tabIndex={3}
                            value={data.kode}
                            onChange={(e) => setData('kode', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Kode Mata Kuliah'
                            className="w-full"
                        />
                        <InputError message={errors.kode} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='dosen_id'>Dosen Pengampu
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={(value) => setData('dosen_id', value ? Number(value) : 0)}>
                            <SelectTrigger
                                id='dosen_id'
                                autoFocus
                                tabIndex={4}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder='Pilih Dosen Pengampu' />
                            </SelectTrigger>
                            <SelectContent>
                                <Input
                                    placeholder={`Cari Dosen...`}
                                    value={searchQuery}
                                    onChange={(event) => {
                                        const query = event.target.value;
                                        setSearchQuery(query);                                        
                                        const filtered = query.trim() === '' 
                                            ? dosens 
                                            : dosens.filter(d => d.nama.toLowerCase().includes(query.toLowerCase()));
                                        setFilteredDosens(filtered);
                                    }}
                                    className="text-sm"
                                />
                                {filteredDosens.map((dosen) => (
                                    <SelectItem 
                                        key={dosen.id} 
                                        value={String(dosen.id)}
                                        onSelect={() => setSearchQuery('')}
                                    >
                                        {dosen.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.dosen_id} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='bobot_sks'>Bobot SKS
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='bobot_sks'
                            type='number'
                            required
                            autoFocus
                            tabIndex={5}
                            value={data.bobot_sks}
                            onChange={(e) => setData('bobot_sks', e.target.value ? Number(e.target.value) : 0)}
                            disabled={processing}
                            placeholder='Masukkan Bobot SKS Mata Kuliah'
                            className="w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <InputError message={errors.bobot_sks} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='semester'>Semester
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='semester'
                            type='number'
                            required
                            autoFocus
                            tabIndex={6}
                            value={data.semester}
                            onChange={(e) => setData('semester', e.target.value ? Number(e.target.value) : 0)}
                            disabled={processing}
                            placeholder='Masukkan Semester Mata Kuliah'
                            className="w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <InputError message={errors.semester} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='kapasitas'>Kapasitas
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='kapasitas'
                            type='number'
                            required
                            autoFocus
                            tabIndex={7}
                            value={data.kapasitas}
                            onChange={(e) => setData('kapasitas', e.target.value ? Number(e.target.value) : 0)}
                            disabled={processing}
                            placeholder='Masukkan Kapasitas Mata Kuliah'
                            className="w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <InputError message={errors.kapasitas} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='status'>Status
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={String(data.status)} onValueChange={(value) => setData('status', value as 'aktif' | 'nonaktif')}>
                            <SelectTrigger
                                id='status'
                                autoFocus
                                tabIndex={8}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder={String(data.status)} defaultValue={data.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
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
