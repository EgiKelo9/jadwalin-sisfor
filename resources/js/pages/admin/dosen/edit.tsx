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
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/beranda',
    },
    {
        title: 'Dosen',
        href: '/admin/data-dosen',
    },
    {
        title: 'Ubah',
        href: '/admin/data-dosen/{id}/ubah',
    },
];

type DosenForm = {
    id: number;
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

export default function UbahDosen({ dosen }: { dosen: DosenForm }) {
    const { data, setData, post, processing, errors } = useForm<DosenForm>({
        id: dosen.id,
        nip: dosen.nip,
        nidn: dosen.nidn,
        nama: dosen.nama,
        email: dosen.email,
        telepon: dosen.telepon,
        alamat: dosen.alamat,
        foto: null,
        status: dosen.status,
        _method: 'PUT',
    });

    const { ToasterComponent } = useFlashMessages();
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('foto', null);
            setFotoPreview(null);
        }
    };

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('admin.data-dosen.destroy', dosen.id), {
            onSuccess: () => {
                router.visit(route('admin.data-dosen.index'));
            },
            onError: (error) => {
                console.error('Gagal menghapus dosen:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route('admin.data-dosen.update', dosen.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Data dosen berhasil diperbarui.');
                router.visit(route('admin.data-dosen.edit', dosen.id));
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
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Ubah Dosen" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Dosen</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/data-dosen/${dosen.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus dosen ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Dosen ini akan dihapus secara permanen
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
                    </div>
                </div>
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
                        <div className='grid grid-cols-2 items-start gap-4 mt-2 col-span-2'>
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
                                    tabIndex={3}
                                    value={data.nidn}
                                    onChange={(e) => setData('nidn', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan NIDN Dosen'
                                    className="w-full"
                                />
                                <InputError message={errors.nidn} />
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
                            <Label htmlFor='foto'>Foto Profil</Label>
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
                            <AspectRatio ratio={16 / 9} className='relative'>
                                {fotoPreview ? (
                                    <img
                                        src={fotoPreview}
                                        alt="Foto Profil"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <img
                                        src={dosen.foto ? `${window.location.origin}/storage/${dosen.foto}` : `${window.location.origin}/images/blank-profile-picture.webp`}
                                        alt="Foto Profil"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                )}
                            </AspectRatio>
                        </div>
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