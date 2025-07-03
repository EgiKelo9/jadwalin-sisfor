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
        title: 'Mata Kuliah',
        href: '/admin/mata-kuliah',
    },
    {
        title: 'Ubah',
        href: '/admin/mata-kuliah/{id}/ubah',
    },
];

type MataKuliahForm = {
    id: number
    kode: string
    nama: string
    bobot_sks: number
    kapasitas: number
    semester: number
    status: "aktif" | "nonaktif"
    jenis: "wajib" | "pilihan"
    dosen_id: number
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
};

export default function UbahMataKuliah({ mataKuliah, dosens }: { mataKuliah: MataKuliahForm, dosens: DosenData[] }) {
    const { data, setData, post, processing, errors } = useForm<MataKuliahForm>({
        id: mataKuliah.id,
        kode: mataKuliah.kode,
        nama: mataKuliah.nama,
        bobot_sks: mataKuliah.bobot_sks,
        kapasitas: mataKuliah.kapasitas,
        semester: mataKuliah.semester,
        status: mataKuliah.status,
        jenis: mataKuliah.jenis,
        dosen_id: mataKuliah.dosen_id,
        _method: 'PUT',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDosens, setFilteredDosens] = useState(dosens);

    const { ToasterComponent } = useFlashMessages();
    const [deleting, setDeleting] = useState(false);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('admin.mata-kuliah.destroy', mataKuliah.id), {
            onSuccess: () => {
                router.reload();
                sessionStorage.setItem('success', 'Ruang kelas berhasil dihapus.');
            },
            onError: (error) => {
                console.error('Gagal menghapus mata kuliah:', error);
            },
            onFinish: () => {
                setDeleting(false);
                router.visit(route('admin.mata-kuliah.index'));
            },
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route('admin.mata-kuliah.update', mataKuliah.id), {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                sessionStorage.setItem('success', 'Data mata kuliah berhasil diperbarui.');
                router.visit(route('admin.mata-kuliah.edit', mataKuliah.id));
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
            <Head title="Ubah Mata Kuliah" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Mata Kuliah</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/mata-kuliah/${mataKuliah.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus mata kuliah ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Mata Kuliah ini akan dihapus secara permanen
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
                        <Label htmlFor='nama'>Jenis Mata Kuliah
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
                        <Label htmlFor='dosen'>Dosen Pengampu
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select value={String(data.dosen_id)} onValueChange={(value) => setData('dosen_id', Number(value))}>
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
                        <Label htmlFor='bobot_sks'>SKS
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='bobot_sks'
                            type='number'
                            required
                            autoFocus
                            tabIndex={4}
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
                            tabIndex={5}
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
                            tabIndex={6}
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
                                tabIndex={7}
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