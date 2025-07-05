import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PeminjamanKelasColumns } from './column-index';
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
            <Head title="Peminjaman Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Peminjaman Kelas"
                    href="/admin/peminjaman-kelas"
                    columns={PeminjamanKelasColumns}
                    data={peminjamanKelas}
                    showSearch={true}
                    showCreateButton={true}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showHistoryButton={true}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
