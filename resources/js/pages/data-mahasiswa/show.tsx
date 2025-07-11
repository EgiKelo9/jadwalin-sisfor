import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Pencil, Download } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

type MahasiswaData = {
    id: number;
    nim: string;
    nama: string;
    email: string;
    telepon: string | number;
    alamat: string;
    foto: string;
    status: 'aktif' | 'nonaktif';
};

export default function LihatMahasiswa({ mahasiswa, userRole, canUpdate }: { mahasiswa: MahasiswaData, userRole: string, canUpdate?: boolean }) {
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
            title: 'Lihat',
            href: `/${userRole}/data-mahasiswa/${mahasiswa.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Lihat Mahasiswa" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Mahasiswa</h1>
                    {canUpdate && (
                        <Button variant="outline" asChild>
                            <Link href={`/${userRole}/data-mahasiswa/${mahasiswa.id}/ubah`}><Pencil />Ubah</Link>
                        </Button>
                    )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Lengkap</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={mahasiswa.nama}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                tabIndex={2}
                                value={mahasiswa.email}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='nim'>NIM</Label>
                            <Input
                                id='nim'
                                type='text'
                                tabIndex={3}
                                value={mahasiswa.nim}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='status'>Status</Label>
                            <Input
                                id='status'
                                type='text'
                                tabIndex={4}
                                value={mahasiswa.status}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='telepon'>Nomor Telepon</Label>
                            <Input
                                id='telepon'
                                type='tel'
                                tabIndex={5}
                                value={mahasiswa.telepon}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='alamat'>Alamat</Label>
                            <Textarea
                                id='alamat'
                                tabIndex={6}
                                disabled
                                value={mahasiswa.alamat}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='foto'>Foto Profil</Label>
                            <Input
                                id='foto'
                                type='text'
                                tabIndex={7}
                                value={mahasiswa.foto ?? "Belum ada foto profil"}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                <img
                                    src={mahasiswa.foto ? `${window.location.origin}/storage/${mahasiswa.foto}` : `${window.location.origin}/images/blank-profile-picture.webp`}
                                    alt="Foto Profil"
                                    className="h-full w-full rounded-md object-contain aspect-video"
                                />
                                <Tooltip>
                                    <TooltipTrigger className={cn(buttonVariants({ 'variant': 'outline' }), 'absolute top-0 right-0')}
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `${window.location.origin}/storage/${mahasiswa.foto}`;
                                            link.download = `foto-${mahasiswa.nama}.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}>
                                        <Download className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Unduh</p>
                                    </TooltipContent>
                                </Tooltip>
                            </AspectRatio>
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => window.history.back()}
                    >
                        Kembali
                    </Button>
                </div>
            </div>
        </AppLayout >
    );
}
