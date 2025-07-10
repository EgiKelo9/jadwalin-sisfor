import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createRuangKelasColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'gedung',
        label: 'Gedung',
        type: 'select',
    },
    {
        columnId: 'kapasitas',
        label: 'Kapasitas',
        type: 'select',
    },
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['layak', 'tidak_layak', 'perbaikan'],
    },
];

interface RuangKelasTableProps {
    ruangKelas: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function RuangKelas({ ruangKelas, userRole, canCreate, canUpdate, canDelete }: RuangKelasTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Ruang Kelas',
            href: `/${userRole}/ruang-kelas`,
        },
    ];

    // Create columns with permissions
    const columns = createRuangKelasColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Ruang Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Ruang Kelas"
                    href={`/${userRole}/ruang-kelas`}
                    columns={columns}
                    data={ruangKelas}
                    showSearch={true}
                    showCreateButton={canCreate}
                    showColumnFilter={true}
                    showDataFilter={true}
                    columnFilters={columnFiltersConfig}
                />
            </div>
        </AppLayout>
    );
}
