import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Ruang Kelas',
        href: '/admin/ruang-kelas',
    },
    {
        title: 'Buat',
        href: '/admin/ruang-kelas/buat',
    },
];

type RuangKelasForm = {
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
    _method?: string;
};

export default function BuatRuangKelas() {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<RuangKelasForm>>({
        nama: '',
        gedung: '',
        lantai: 0,
        kapasitas: 0,
        status: 'layak',
        _method: 'POST',
    });

    const { ToasterComponent } = useFlashMessages();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.ruang-kelas.store'), {
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
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Buat Ruang Kelas" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Ruang Kelas</h1>
                <div className='grid grid-cols-2 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='nama'>Nama Ruang Kelas
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
                            placeholder='Masukkan Nama Ruang Kelas'
                            className="w-full"
                        />
                        <InputError message={errors.nama} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='gedung'>Lokasi Gedung
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='gedung'
                            type='text'
                            required
                            autoFocus
                            tabIndex={2}
                            value={data.gedung}
                            onChange={(e) => setData('gedung', e.target.value)}
                            disabled={processing}
                            placeholder='Masukkan Gedung Ruang Kelas'
                            className="w-full"
                        />
                        <InputError message={errors.gedung} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='lantai'>Lantai
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='lantai'
                            type='number'
                            required
                            autoFocus
                            tabIndex={3}
                            value={data.lantai}
                            onChange={(e) => setData('lantai', e.target.value ? Number(e.target.value) : 0)}
                            disabled={processing}
                            placeholder='Masukkan Lantai Ruang Kelas'
                            className="w-full dark:[&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <InputError message={errors.lantai} />
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
                            tabIndex={4}
                            value={data.kapasitas}
                            onChange={(e) => setData('kapasitas', e.target.value ? Number(e.target.value) : 0)}
                            disabled={processing}
                            placeholder='Masukkan Kapasitas Ruang Kelas'
                            className="w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <InputError message={errors.lantai} />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='status'>Status
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={String(data.status)} onValueChange={(value) => setData('status', value as 'layak' | 'tidak_layak' | 'perbaikan')}>
                            <SelectTrigger
                                id='status'
                                autoFocus
                                tabIndex={5}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder={String(data.status)} defaultValue={data.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="layak">Layak</SelectItem>
                                <SelectItem value="tidak_layak">Tidak Layak</SelectItem>
                                <SelectItem value="perbaikan">Perbaikan</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button type="submit" variant={"primary"} tabIndex={3} disabled={processing}>
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
