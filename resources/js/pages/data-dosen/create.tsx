import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";

type DosenForm = {
    nip: string;
    nidn: string;
    nama: string;
    email: string;
    telepon: string | number;
    alamat: string;
    foto: File | null;
    status: 'aktif' | 'nonaktif';
    _method?: string;
};

export default function BuatDosen({ userRole }: { userRole: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Data Dosen',
            href: `/${userRole}/data-dosen`,
        },
        {
            title: 'Buat',
            href: `/${userRole}/data-dosen/buat`,
        },
    ];

    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<DosenForm>>({
        nip: '',
        nidn: '',
        nama: '',
        email: '',
        telepon: '',
        alamat: '',
        foto: null,
        status: 'aktif',
        _method: 'POST',
    });

    const { ToasterComponent } = useFlashMessages();
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.data-dosen.store`), {
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
            <Head title="Buat Dosen" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Dosen</h1>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Lengkap
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
                                placeholder='Masukkan Nama Dosen'
                                className="w-full"
                            />
                            <InputError message={errors.nama} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='email'>Email
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                required
                                autoFocus
                                tabIndex={2}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan Email Dosen'
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2 col-span-2'>
                            <div className='grid gap-4'>
                                <Label htmlFor='nip'>NIP
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='nip'
                                    type='text'
                                    required
                                    autoFocus
                                    tabIndex={3}
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan NIP Dosen'
                                    className="w-full"
                                />
                                <InputError message={errors.nip} />
                            </div>
                            <div className='grid gap-4'>
                                <Label htmlFor='nidn'>NIDN
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='nidn'
                                    type='text'
                                    required
                                    autoFocus
                                    tabIndex={4}
                                    value={data.nidn}
                                    onChange={(e) => setData('nidn', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan NIDN Dosen'
                                    className="w-full"
                                />
                                <InputError message={errors.nip} />
                            </div>
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='telepon'>Nomor Telepon
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='telepon'
                                type='tel'
                                required
                                autoFocus
                                tabIndex={5}
                                value={data.telepon}
                                onChange={(e) => setData('telepon', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan Nomor Telepon Dosen'
                                className="w-full"
                            />
                            <InputError message={errors.telepon} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='alamat'>Alamat
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Textarea
                                id='alamat'
                                required
                                autoFocus
                                tabIndex={6}
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan Alamat Dosen'
                                className="w-full"
                            />
                            <InputError message={errors.alamat} />
                        </div>
                    </div>
                    <div className='grid grid-rows-1 items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='foto'>Foto Profil
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='foto'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                tabIndex={7}
                                onChange={handleFotoChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.foto} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9}>
                                {fotoPreview ? (
                                    <img
                                        src={fotoPreview}
                                        alt="Foto Preview"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full rounded-md border border-dashed">
                                        <span className="text-muted-foreground">Tidak ada gambar terpilih</span>
                                    </div>
                                )}
                            </AspectRatio>
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
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
        </AppLayout>
    );
}
