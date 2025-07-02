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
        title: 'Ubah',
        href: '/admin/ruang-kelas/{id}/ubah',
    },
];

type RuangKelasForm = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
    _method?: string;
};

export default function UbahRuangKelas({ ruangKelas }: { ruangKelas: RuangKelasForm }) {
    const { data, setData, post, processing, errors } = useForm<RuangKelasForm>({
        id: ruangKelas.id,
        nama: ruangKelas.nama,
        gedung: ruangKelas.gedung,
        lantai: ruangKelas.lantai,
        kapasitas: ruangKelas.kapasitas,
        status: ruangKelas.status,
        _method: 'PUT',
    });

    const { ToasterComponent } = useFlashMessages();
    const [deleting, setDeleting] = useState(false);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('admin.ruang-kelas.destroy', ruangKelas.id), {
            onSuccess: () => {
                router.reload();
                sessionStorage.setItem('success', 'Ruang kelas berhasil dihapus.');
            },
            onError: (error) => {
                console.error('Gagal menghapus ruang kelas:', error);
            },
            onFinish: () => {
                setDeleting(false);
                router.visit(route('admin.ruang-kelas.index'));
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route('admin.ruang-kelas.update', ruangKelas.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Data ruang kelas berhasil diperbarui.');
                router.visit(route('admin.ruang-kelas.edit', ruangKelas.id));
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
            <Head title="Ubah Ruang Kelas" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Ruang Kelas</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/ruang-kelas/${ruangKelas.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus ruang kelas ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Ruang Kelas ini akan dihapus secara permanen
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