import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createDaftarJadwalColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'hari',
        label: 'Hari',
        type: 'select',
        options: ['senin', 'selasa', 'rabu', 'kamis', 'jumat'],
    },
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['aktif', 'nonaktif'],
    },
];

interface DaftarJadwalTableProps {
    daftarJadwals: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canShowAjukan?: boolean;
}

export default function DaftarJadwal({ daftarJadwals, userRole, canCreate, canUpdate, canDelete, canShowAjukan }: DaftarJadwalTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Daftar Jadwal',
            href: `/${userRole}/daftar-jadwal`,
        },
    ];

    // Create columns with permissions
    const columns = createDaftarJadwalColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Daftar Jadwal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Daftar Jadwal"
                    href={`/${userRole}/daftar-jadwal`}
                    columns={columns}
                    data={daftarJadwals}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={false}
                    showDataFilter={true}
                    columnFilters={columnFiltersConfig}
                    showTopActionButton={canShowAjukan}
                    topActionButtonLabel="Ajukan"
                    topActionButtonHref="ajukan-perubahan-daftar"
                />
            </div>
        </AppLayout>
    );
}
