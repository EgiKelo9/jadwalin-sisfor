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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type MahasiswaForm = {
    id: number;
    nim: string;
    nama: string;
    email: string;
    telepon: string | number;
    alamat: string;
    foto: File | null;
    status: 'aktif' | 'nonaktif';
    _method?: string;
};

export default function UbahMahasiswa({ mahasiswa, userRole, canDelete }: { mahasiswa: MahasiswaForm, userRole: string, canDelete?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Data Mahasiswa',
            href: `/${userRole}/data-mahasiswa`,
        },
        {
            title: 'Ubah',
            href: `/${userRole}/data-mahasiswa/${mahasiswa.id}/ubah`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<MahasiswaForm>({
        id: mahasiswa.id,
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        email: mahasiswa.email,
        telepon: mahasiswa.telepon,
        alamat: mahasiswa.alamat,
        foto: null,
        status: mahasiswa.status,
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
        router.delete(route(`${userRole}.data-mahasiswa.destroy`, mahasiswa.id), {
            onSuccess: () => {
                router.visit(route(`${userRole}.data-mahasiswa.index`));
            },
            onError: (error) => {
                console.error('Gagal menghapus mahasiswa:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route(`${userRole}.data-mahasiswa.update`, mahasiswa.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Data mahasiswa berhasil diperbarui.');
                router.visit(route(`${userRole}.data-mahasiswa.edit`, mahasiswa.id));
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
            <Head title="Ubah Mahasiswa" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Mahasiswa</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/data-mahasiswa/${mahasiswa.id}`}><Eye />Lihat</Link>
                        </Button>
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                    <Trash2 />Hapus
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin ingin menghapus mahasiswa ini?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aksi ini tidak dapat dibatalkan. Mahasiswa ini akan dihapus secara permanen
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
                                placeholder='Masukkan Nama Mahasiswa'
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
                                placeholder='Masukkan Email Mahasiswa'
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className='grid grid-cols-2 items-start gap-4 mt-2 col-span-2'>
                            <div className='grid gap-4'>
                                <Label htmlFor='nim'>NIM
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='nim'
                                    type='text'
                                    required
                                    autoFocus
                                    tabIndex={3}
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan NIM Mahasiswa'
                                    className="w-full"
                                />
                                <InputError message={errors.nim} />
                            </div>
                            <div className='grid gap-4'>
                                <Label htmlFor='status'>Status
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Select value={String(data.status)} onValueChange={(value) => setData('status', value as 'aktif' | 'nonaktif')}>
                                    <SelectTrigger
                                        id='status'
                                        autoFocus
                                        tabIndex={4}
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
                                placeholder='Masukkan Nomor Telepon Mahasiswa'
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
                                placeholder='Masukkan Alamat Mahasiswa'
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
                                        src={mahasiswa.foto ? `${window.location.origin}/storage/${mahasiswa.foto}` : `${window.location.origin}/images/blank-profile-picture.webp`}
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