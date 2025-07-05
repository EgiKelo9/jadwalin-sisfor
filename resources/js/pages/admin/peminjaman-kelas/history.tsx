import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PeminjamanKelasColumns } from './column-history';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

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
        title: 'Riwayat',
        href: '/admin/peminjaman-kelas/riwayat',
    },
];

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'tanggal_peminjaman',
        label: 'Tanggal',
        type: 'date',
    },
];

interface PeminjamanKelasTableProps {
    peminjamanKelas: any[];
}

export default function PeminjamanKelas({ peminjamanKelas }: PeminjamanKelasTableProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole='admin'>
            <Head title="Riwayat Peminjaman Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Riwayat Peminjaman Kelas"
                    href="/admin/peminjaman-kelas/riwayat"
                    columns={PeminjamanKelasColumns}
                    data={peminjamanKelas}
                    showSearch={true}
                    showCreateButton={false}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showHistoryButton={false}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
