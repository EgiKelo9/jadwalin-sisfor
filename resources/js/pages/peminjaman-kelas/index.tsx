import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createPeminjamanKelasColumns } from './column-index';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'tanggal_peminjaman',
        label: 'Tanggal',
        type: 'date',
    },
];

interface PeminjamanKelasTableProps {
    peminjamanKelas: any[];
    userRole: string;
    canCreate?: boolean;
    canConfirm?: boolean;
    canViewHistory?: boolean;
}

export default function PeminjamanKelas({ peminjamanKelas, userRole, canCreate, canConfirm, canViewHistory }: PeminjamanKelasTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Peminjaman Kelas',
            href: `/${userRole}/peminjaman-kelas`,
        },
    ];

    // Create columns with permissions
    const columns = createPeminjamanKelasColumns(userRole, canConfirm);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Peminjaman Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Peminjaman Kelas"
                    href={`/${userRole}/peminjaman-kelas`}
                    columns={columns}
                    data={peminjamanKelas}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    showHistoryButton={canViewHistory}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
