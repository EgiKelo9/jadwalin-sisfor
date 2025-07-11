import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
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

type JadwalForm = {
    tanggal_mulai: string;
    semester: "ganjil" | "genap";
    jumlah_pertemuan: number;
    _method?: string;
};

export default function GenerateJadwal({ userRole }: { userRole: string }) {
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
            title: 'Generate',
            href: `/${userRole}/jadwal-perkuliahan/generate`,
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<Required<JadwalForm>>({
        tanggal_mulai: '',
        semester: "ganjil",
        jumlah_pertemuan: 16,
        _method: "POST",
    });

    const { ToasterComponent } = useFlashMessages();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`${userRole}.jadwal-perkuliahan.store`), {
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
            <Head title="Generate Jadwal Perkuliahan" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Generate Jadwal Perkuliahan</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2'>
                        <Label htmlFor='tanggal_mulai'>Tanggal Mulai Semester
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='tanggal_mulai'
                            type='date'
                            required
                            autoFocus
                            tabIndex={1}
                            value={data.tanggal_mulai}
                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                            disabled={processing}
                            placeholder='Pilih Tanggal Mulai Semester'
                            className="w-full"
                        />
                        <InputError message={errors.tanggal_mulai} />
                    </div>

                    <div className='grid gap-4 mt-2'>
                        <Label htmlFor='semester'>Semester
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Select 
                            value={data.semester} 
                            onValueChange={(value) => setData('semester', value as "ganjil" | "genap")}
                        >
                            <SelectTrigger
                                id='semester'
                                tabIndex={2}
                                disabled={processing}
                                className="w-full"
                            >
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ganjil">Semester Ganjil</SelectItem>
                                <SelectItem value="genap">Semester Genap</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.semester} />
                    </div>

                    <div className='grid gap-4 mt-2'>
                        <Label htmlFor='jumlah_pertemuan'>Jumlah Pertemuan
                            <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            id='jumlah_pertemuan'
                            type='number'
                            required
                            tabIndex={3}
                            min={1}
                            max={20}
                            value={data.jumlah_pertemuan}
                            onChange={(e) => setData('jumlah_pertemuan', Number(e.target.value))}
                            disabled={processing}
                            placeholder='Masukkan Jumlah Pertemuan'
                            className="w-full"
                        />
                        <InputError message={errors.jumlah_pertemuan} />
                        <p className="text-sm text-muted-foreground">
                            Biasanya 16 pertemuan untuk satu semester
                        </p>
                    </div>
                </div>

                <div className='flex gap-4 mt-6'>
                    <Button type="submit" variant={"primary"} tabIndex={4} disabled={processing}>
                        {processing ?
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            : "Generate Jadwal"}
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