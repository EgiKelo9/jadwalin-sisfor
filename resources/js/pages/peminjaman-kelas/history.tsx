import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createPeminjamanKelasColumns } from './column-history';
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
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function PeminjamanKelas({ peminjamanKelas, userRole, canUpdate, canDelete }: PeminjamanKelasTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Peminjaman Kelas',
            href: `/${userRole}/peminjaman-kelas`,
        },
        {
            title: 'Riwayat',
            href: `/${userRole}/peminjaman-kelas/riwayat`,
        },
    ];

    // Create columns with permissions
    const columns = createPeminjamanKelasColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Riwayat Peminjaman Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Riwayat Peminjaman Kelas"
                    href={`/${userRole}/peminjaman-kelas/riwayat`}
                    columns={columns}
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
