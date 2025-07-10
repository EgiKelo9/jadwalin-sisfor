import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { createMahasiswaColumns } from './column';
import { DataTable, ColumnFilterConfig } from '@/components/ui/data-table';

export const columnFiltersConfig: ColumnFilterConfig[] = [
    {
        columnId: 'status',
        label: 'Status',
        type: 'select',
        options: ['aktif', 'nonaktif'],
    },
];

interface MahasiswaTableProps {
    mahasiswas: any[];
    userRole: string;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export default function Mahasiswa({ mahasiswas, userRole, canCreate, canUpdate, canDelete }: MahasiswaTableProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
            href: `/${userRole}/beranda`,
        },
        {
            title: 'Data Mahasiswa',
            href: `/${userRole}/data-mahasiswa`,
        },
    ];

    // Create columns with permissions
    const columns = createMahasiswaColumns(userRole, canUpdate, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
            <Head title="Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Mahasiswa"
                    href={`/${userRole}/data-mahasiswa`}
                    columns={columns}
                    data={mahasiswas}
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
