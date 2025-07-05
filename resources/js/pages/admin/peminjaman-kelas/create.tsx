import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { User, type BreadcrumbItem } from '@/types';
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
        title: 'Peminjaman Kelas',
        href: '/admin/peminjaman-kelas',
    },
    {
        title: 'Buat',
        href: '/admin/peminjaman-kelas/buat',
    },
];

type PeminjamanKelasForm = {
    mahasiswa_id?: number | null;
    dosen_id?: number | null;
    admin_id?: number | null;
    ruang_kelas_id: number;
    tanggal_peminjaman: Date | string;
    jam_mulai: Date | string;
    jam_selesai: Date | string;
    alasan: string;
    status: 'pending' | 'diterima' | 'ditolak';
    _method?: string;
};

type PeminjamanKelasData = {
    id: number
    tanggal_peminjaman: Date | string
    jam_mulai: Date | string
    jam_selesai: Date | string
    alasan: string
    status: "pending" | "diterima" | "ditolak"
    ruang_kelas_id: number
    mahasiswa: {
        id: number
        nama: string
        email: string
    }
    dosen: {
        id: number
        nama: string
        email: string
    }
    admin: {
        id: number
        nama: string
        email: string
    }
    ruang_kelas: {
        id: number
        nama: string
        gedung: string
        lantai: number
    }
};

type RuangKelasData = {
    id: number;
    nama: string;
    gedung: string;
    lantai: number;
    kapasitas: number;
    status: 'layak' | 'tidak_layak' | 'perbaikan';
}

type UserData = {
    id: number;
    nama: string;
    email: string;
}

export default function BuatPeminjamanKelas({ ruangKelas, peminjamanKelas, user, role }: { ruangKelas: RuangKelasData[], peminjamanKelas: PeminjamanKelasData[], user: UserData, role: string }) {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<PeminjamanKelasForm>>({
        mahasiswa_id: null,
        dosen_id: null,
        admin_id: null,
        ruang_kelas_id: 0,
        tanggal_peminjaman: '',
        jam_mulai: '',
        jam_selesai: '',
        alasan: '',
        status: 'pending',
        _method: 'POST',
    });

    const [page, setPage] = useState(1);
    const { ToasterComponent } = useFlashMessages();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.peminjaman-kelas.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    // Add validation function before the return statement
    const validatePage1 = () => {
        const requiredFields = [
            'tanggal_peminjaman',
            'jam_mulai', 
            'jam_selesai',
            'alasan'
        ];
        
        return requiredFields.every(field => {
            const value = data[field as keyof typeof data];
            return value !== null && value !== undefined && String(value).trim() !== '';
        });
    };

    // Add this function before the return statement
    const checkRoomAvailability = (ruangId: number) => {
        // Get existing bookings for the same room and date
        const conflictingBookings = peminjamanKelas.filter(peminjaman => 
            peminjaman.ruang_kelas_id === ruangId && 
            new Date(peminjaman.tanggal_peminjaman).toDateString() === new Date(data.tanggal_peminjaman).toDateString() &&
            peminjaman.status === 'diterima' // Only check approved bookings
        );

        // If no bookings on the same date, room is available
        if (conflictingBookings.length === 0) {
            return { available: true, reason: '' };
        }

        // Check time conflicts
        const newStartTime = data.jam_mulai;
        const newEndTime = data.jam_selesai;

        for (const booking of conflictingBookings) {
            const existingStartTime = booking.jam_mulai;
            const existingEndTime = booking.jam_selesai;

            // Convert time strings to minutes for easier comparison
            const newStart = timeToMinutes(newStartTime.toString());
            const newEnd = timeToMinutes(newEndTime.toString());
            const existingStart = timeToMinutes(existingStartTime.toString());
            const existingEnd = timeToMinutes(existingEndTime.toString());

            // Check for time overlap
            const hasOverlap = (newStart < existingEnd && newEnd > existingStart);

            if (hasOverlap) {
                return { 
                    available: false, 
                    reason: `Ruang sudah dipinjam pada ${existingStartTime} - ${existingEndTime}` 
                };
            }
        }

        return { available: true, reason: '' };
    };

    // Helper function to convert time string to minutes
    const timeToMinutes = (timeString: string): number => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Function to get unavailable rooms
    const getUnavailableRooms = () => {
        const unavailableRooms = new Map<number, string>();
        
        ruangKelas.forEach(ruang => {
            if (ruang.status === 'layak') {
                const availability = checkRoomAvailability(ruang.id);
                if (!availability.available) {
                    unavailableRooms.set(ruang.id, availability.reason);
                }
            }
        });
        
        return unavailableRooms;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Buat Peminjaman Kelas" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Peminjaman Kelas</h1>
                {page === 1 && (
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                            <div className='grid gap-4 mt-2 col-span-2'>
                                <Label htmlFor='nama'>Nama Peminjam
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='nama'
                                    type='text'
                                    disabled
                                    tabIndex={1}
                                    value={user.nama}
                                    className="w-full"
                                />
                            </div>
                            <div className='grid gap-4 mt-2 col-span-2'>
                                <Label htmlFor='email'>Email
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='email'
                                    type='text'
                                    disabled
                                    tabIndex={2}
                                    value={user.email}
                                    className="w-full"
                                />
                            </div>
                            <div className='grid gap-4 mt-2 col-span-2'>
                                <Label htmlFor='tanggal_peminjaman'>Tanggal Peminjaman
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='tanggal_peminjaman'
                                    type='date'
                                    required
                                    autoFocus
                                    tabIndex={3}
                                    value={String(data.tanggal_peminjaman)}
                                    onChange={(e) => setData('tanggal_peminjaman', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan Tanggal Peminjaman'
                                    className="w-full"
                                />
                                <InputError message={errors.tanggal_peminjaman} />
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
                                    tabIndex={4}
                                    value={String(data.jam_mulai)}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan Waktu Mulai Peminjaman'
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
                                    tabIndex={5}
                                    value={String(data.jam_selesai)}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan Waktu Mulai Peminjaman'
                                    className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                                <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                                    WITA
                                </span>
                                <InputError message={errors.jam_selesai} />
                            </div>
                            <div className='grid gap-4 mt-2 col-span-4'>
                                <Label htmlFor='alasan'>Alasan Peminjaman
                                    <span className='text-red-500'>*</span>
                                </Label>
                                <Textarea
                                    id='alasan'
                                    required
                                    autoFocus
                                    tabIndex={6}
                                    value={data.alasan}
                                    onChange={(e) => setData('alasan', e.target.value)}
                                    disabled={processing}
                                    placeholder='Masukkan Alasan Peminjaman'
                                    className="w-full min-h-32"
                                />
                                <InputError message={errors.alasan} />
                            </div>
                        </div>
                        <div className='flex gap-4 mt-2'>
                            <Button 
                                type='button'
                                variant={"primary"} 
                                tabIndex={7} 
                                disabled={processing || !validatePage1()} 
                                onClick={() => {
                                    // Only proceed if validation passes
                                    if (!validatePage1()) {
                                        return;
                                    }
                                    if (role === 'mahasiswa') {
                                        setData('mahasiswa_id', user.id);
                                        setData('dosen_id', null);
                                        setData('admin_id', null);
                                    } else if (role === 'dosen') {
                                        setData('dosen_id', user.id);
                                        setData('mahasiswa_id', null);
                                        setData('admin_id', null);
                                    } else if (role === 'admin') {
                                        setData('admin_id', user.id);
                                        setData('mahasiswa_id', null);
                                        setData('dosen_id', null);
                                    }
                                    setPage(2);
                                }}
                            >
                                Selanjutnya
                            </Button>
                            <Button
                                variant={"outline"}
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                )}
                {page === 2 && (
                    <div className='flex flex-col gap-4'>
                        <div className='grid gap-4'>
                            <Label htmlFor='ruang_kelas_id'>Pilih Ruang Kelas
                                <span className='text-red-500'>*</span>
                            </Label>
                            
                            {/* Show validation info */}
                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                <p><strong>Tanggal:</strong> {new Date(data.tanggal_peminjaman).toLocaleDateString('id-ID')}</p>
                                <p><strong>Waktu:</strong> {String(data.jam_mulai)} - {String(data.jam_selesai)} WITA</p>
                            </div>

                            {/* Filter and show available rooms count */}
                            <div className="text-sm text-gray-600">
                                {(() => {
                                    const availableRooms = ruangKelas.filter(ruang => {
                                        const unavailableRooms = getUnavailableRooms();
                                        const isUnavailable = unavailableRooms.has(ruang.id);
                                        return ruang.status === 'layak' && !isUnavailable;
                                    });
                                    return (
                                        <p><strong>Ruang tersedia:</strong> {availableRooms.length} dari {ruangKelas.length} ruang</p>
                                    );
                                })()}
                            </div>
                            
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3'>
                                {ruangKelas
                                    .sort((a, b) => {
                                        // Sort by availability first (available rooms first), then by name
                                        const unavailableRooms = getUnavailableRooms();
                                        const aUnavailable = a.status !== 'layak' || unavailableRooms.has(a.id);
                                        const bUnavailable = b.status !== 'layak' || unavailableRooms.has(b.id);
                                        
                                        if (aUnavailable && !bUnavailable) return 1;
                                        if (!aUnavailable && bUnavailable) return -1;
                                        
                                        return a.nama.localeCompare(b.nama);
                                    })
                                    .map((ruang) => {
                                        const unavailableRooms = getUnavailableRooms();
                                        const isUnavailable = unavailableRooms.has(ruang.id);
                                        const unavailableReason = unavailableRooms.get(ruang.id);
                                        const isDisabled = ruang.status !== 'layak' || isUnavailable;
                                        
                                        return (
                                            <div
                                                key={ruang.id}
                                                className={`
                                                    relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer aspect-square
                                                    ${data.ruang_kelas_id === ruang.id 
                                                        ? 'border-teal-500 bg-teal-50 shadow-md' 
                                                        : isDisabled
                                                            ? 'border-gray-300 bg-gray-100'
                                                            : 'border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
                                                    }
                                                    ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
                                                `}
                                                onClick={() => {
                                                    if (!isDisabled) {
                                                        setData('ruang_kelas_id', ruang.id);
                                                    }
                                                }}
                                                title={isUnavailable ? unavailableReason : ruang.status !== 'layak' ? `Status: ${ruang.status}` : `${ruang.nama} - ${ruang.gedung} Lantai ${ruang.lantai}`}
                                            >
                                                {/* Room Icon */}
                                                <div className={`
                                                    w-8 h-8 rounded flex items-center justify-center mb-2
                                                    ${data.ruang_kelas_id === ruang.id 
                                                        ? 'bg-teal-500 text-white' 
                                                        : isDisabled 
                                                            ? 'bg-gray-300 text-gray-500'
                                                            : 'bg-gray-200 text-gray-600'
                                                    }
                                                `}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                
                                                {/* Room Name */}
                                                <div className="text-center">
                                                    <p className={`
                                                        font-medium text-xs leading-tight
                                                        ${data.ruang_kelas_id === ruang.id ? 'text-teal-700' : 'text-gray-900'}
                                                    `}>
                                                        {ruang.nama}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(ruang.gedung.replace('Gedung ', '') || ruang.gedung) + ' - Lt. ' + ruang.lantai}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Maks. {ruang.kapasitas} Orang
                                                    </p>
                                                </div>
                                                
                                                {/* Selected Indicator - Top right corner */}
                                                {data.ruang_kelas_id === ruang.id && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {/* Status overlay for unavailable rooms */}
                                                {isDisabled && (
                                                    <div className="absolute inset-0 bg-gray-200/80 rounded-lg flex items-center justify-center">
                                                        <span className="text-xs font-medium text-gray-600 text-center px-1">
                                                            {ruang.status !== 'layak' ? 'Tidak Layak' : 'Terpakai'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                            <InputError message={errors.ruang_kelas_id} />
                            
                            {/* Show legend */}
                            <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                    <span>Dipilih</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                                    <span>Tersedia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                    <span>Terpakai</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className='flex gap-4 mt-2'>
                            <Button 
                                type="submit" 
                                variant={"primary"} 
                                tabIndex={9} 
                                disabled={processing || data.ruang_kelas_id === 0}
                            >
                                {processing ?
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    : "Buat"}
                            </Button>
                            <Button
                                variant={"outline"}
                                type="button"
                                onClick={() => setPage(1)}
                            >
                                Kembali
                            </Button>
                            <Button
                                variant={"outline"}
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </AppLayout>
    );
}
